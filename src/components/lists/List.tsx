"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type {
  List,
  ListTypes,
} from "@/server/db/schema";
import { useContext, useEffect, useRef, useState } from "react";
import { ListItem } from "./ListItems";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { deleteListItem } from "@/server/actions/lists/deleteListItem";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { DeleteListButton } from "./DeleteListButton";
import { useDebounce } from "@uidotdev/usehooks";
import { Label } from "../ui/label";
import { ListsContext } from "./ListsContext";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { setListItems } from "@/server/actions/lists/setListItems";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "../ui/modal-drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CirclePicker } from "react-color";
import { updateList } from "@/server/actions/lists/updateList";
import { AddMovieItem } from "./addItemButtons/AddMovie";
import { AddThingItem } from "./addItemButtons/AddThing";
import { Button } from "../ui/button";

export function List({ list, index }: { list: List; index: number }) {
  const [parent, enableAnimations] = useAutoAnimate();
  const [items, setItems] = useState(list.items || []);
  const { lists, setLists } = useContext(ListsContext);
  const debouncedList = useDebounce(list, 500);
  useEffect(() => {
    console.log("list updated");
    setItems(list.items || []);
  }, [list.items]);

  useEffect(() => {
    void setListItems({ listId: debouncedList.id, items });
  }, [debouncedList, items]);

  const ref = useRef(null);
  const { setNodeRef, isOver } = useDroppable({
    id: list.id,
    data: {
      type: "List",
      list,
    },
  });

  const [open, setOpen] = useState(false);

  return (
    <Card
      className={cn(
        "h-fit max-h-[90dvh] min-w-[90dvw] snap-center md:max-h-full md:min-w-64 md:max-w-xl",
      )}
    >
      <DrawerDialog open={open} onOpenChange={setOpen}>
        <EditList list={list} />
        <DrawerDialogTrigger asChild>
          <CardHeader
            style={{
              backgroundColor: list.accentColor != "#ffffff" ? list.accentColor : "transparent",
            }}
            className="flex flex-row items-center justify-between hover:cursor-pointer rounded-t-lg border-b-2  border-accent"
          >
            <h2 className="text-xl font-bold text-primary">{list.name}</h2>
          </CardHeader>
        </DrawerDialogTrigger>
      </DrawerDialog>
      <div
        className={cn("flex flex-col gap-2 py-2 transition duration-150")}
        ref={parent}
      >
        <CardContent
          ref={setNodeRef}
          className={cn("flex w-full flex-col justify-between rounded-b-lg")}
        >
          <div className="mb-2 max-h-[50dvh] overflow-y-auto md:max-h-full md:overflow-y-visible">
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, index) => (
                <ListItem
                  key={item.id}
                  item={item}
                  index={index}
                  onDelete={() => {
                    setItems(items.filter((i) => i.id !== item.id));
                    lists.forEach((listFromState) => {
                      if (listFromState.id == list.id) {
                        listFromState.items.filter((i) => i.id != item.id);
                      }
                    });
                    setLists(lists);
                    void deleteListItem(item.id, list.id);
                  }}
                />
              ))}
            </SortableContext>
          </div>
          {list.type === "thing" && (
            <AddThingItem list={list} items={items} setItems={setItems} />
          )}
          {list.type === "movie" && (
            <AddMovieItem list={list} items={items} setItems={setItems} />
          )}
        </CardContent>
      </div>
      <CardFooter className="flex flex-col rounded-b-lg"></CardFooter>
    </Card>
  );
}




function EditList({ list }: { list: List }) {
  const [listName, setListName] = useState(list.name ?? "");
  const [listType, setListType] = useState(list.type);
  const [accentColor, setAccentColor] = useState(list.accentColor);
  const debouncedListName = useDebounce(listName, 500);
  const debouncedListType = useDebounce(listType, 500);
  const debouncedAccentColor = useDebounce(accentColor, 500);

  useEffect(() => {
    void updateList({
      listId: list.id,
      name: debouncedListName,
      type: debouncedListType,
      accentColor: debouncedAccentColor,
    });
  }, [debouncedListName, debouncedListType, debouncedAccentColor]);

  return (
    <DrawerDialogContent>
      <DrawerDialogHeader>
        <DrawerDialogTitle>Edit List</DrawerDialogTitle>
        <DrawerDialogDescription>{list.id}</DrawerDialogDescription>
      </DrawerDialogHeader>
      <div className="flex flex-col gap-4">
        <Label>Name</Label>
        <Input
          name="listName"
          className="w-full"
          defaultValue={listName}
          onChange={(e) => {
            setListName(e.target.value);
          }}
        />
      </div>
      <div className="flex flex-col gap-4">
        <Label>Accent Color</Label>
        <CirclePicker
          color={accentColor}
          onChangeComplete={(color) => {
            setAccentColor(color.hex);
          }}
        />
        <Button className="mt-4" onClick={() => {setAccentColor("#ffffff")}}>Reset Color to None</Button>
      </div>
      <div className="flex flex-col gap-4">
        <Label>Item Type</Label>
        <Select
          defaultValue={list.type}
          value={listType}
          onValueChange={(value) => {
            setListType(value as ListTypes);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="thing">Thing</SelectItem>
            <SelectItem value="movie">Movie</SelectItem>
            <SelectItem value="tv">TV Show</SelectItem>
            <SelectItem value="book">Book</SelectItem>
            <SelectItem value="game">Game</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DrawerDialogFooter>
        <DeleteListButton list={list} />
      </DrawerDialogFooter>
    </DrawerDialogContent>
  );
}
