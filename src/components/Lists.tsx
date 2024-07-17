"use client";
import { CreateListBoard } from "@/components/CreateListBoard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LocalStorage } from "@/lib/local-storage";
import { deleteList } from "@/server/actions/deleteList";
import { deleteListBoard } from "@/server/actions/deleteListBoard";
import { getListBoards } from "@/server/actions/getListBoards";
import type { List, ListBoard, Item } from "@/server/db/schema";
import { Plus, Share, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { addListItem } from "@/server/actions/addListItem";
import { ListItem } from "./ListItems";
import { LocalStorageAdder } from "./LocalStorageAdder";
import { CreateList } from "./CreateList";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { moveItems } from "@/server/actions/moveItems";
import { deleteListItem } from "@/server/actions/deleteListItem";

const ListsContext = createContext<{
  lists: List[];
  setLists: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        name: string | null;
        boardId: string;
        items: Item[];
        createdAt: Date;
        updatedAt: Date | null;
      }[]
    >
  >;
  listOrder: string[];
  setListOrder: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  lists: [],
  setLists: () => {},
  listOrder: [],
  setListOrder: () => {},
});

export function Lists({ listBoard }: { listBoard: ListBoard }) {
  const [parent, enableAnimations] = useAutoAnimate();

  const [listOrder, setListOrder] = useState(listBoard.listOrder);
  const [lists, setLists] = useState(
    listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!),
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceList = lists.find((list) => list.id === source.droppableId);
    if (!sourceList) {
      return;
    }
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId,
    );
    if (!destinationList) {
      return;
    }
    // update the items in the source list and destination list in state
    const draggedItem = sourceList.items.find(
      (item) => item.id === draggableId,
    );
    if (!draggedItem) {
      return;
    }
    // update the source list
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggedItem);
    // update state
    setLists(
      lists.map((list) => {
        if (list.id === source.droppableId) {
          return sourceList;
        }
        if (list.id === destination.droppableId) {
          return destinationList;
        }
        return list;
      }),
    );
    moveItems({
      item: draggedItem,
      originListId: source.droppableId,
      destinationListId: destination.droppableId,
      originalIndex: source.index,
      newIndex: destination.index,
    });
  };

  return (
    <ListsContext.Provider value={{ lists, setLists, listOrder, setListOrder }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <main
          ref={parent}
          className="flex flex-wrap justify-center gap-4 overflow-x-auto"
        >
          <LocalStorageAdder boardId={listBoard.id} />
          {lists.map((list) => (
            <List key={list.id} list={list} />
          ))}
          <CreateList
            boardId={listBoard.id}
            listsState={lists}
            setListsState={setLists}
          />
        </main>
      </DragDropContext>
    </ListsContext.Provider>
  );
}

function List({ list }: { list: List }) {
  const [parent, enableAnimations] = useAutoAnimate();
  const [items, setItems] = useState(list.items || []);

  return (
    <Card className="max-h-[80dvh] min-w-64 overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2>{list.name}</h2>
        <DeleteListButton list={list} />
      </CardHeader>
      <Droppable droppableId={list.id} type="list">
        {(provided) => {
          return (
            <div
              className="flex flex-col gap-2"
              ref={parent}
              {...provided.droppableProps}
            >
              <CardContent
                ref={provided.innerRef}
                className="flex flex-col justify-between"
              >
                {items.map((item, index) => (
                  <ListItem
                    key={item.id}
                    item={item}
                    index={index}
                    onDelete={() => {
                      setItems(items.filter((i) => i.id !== item.id));
                      deleteListItem(item.id, list.id);
                    }}
                  />
                ))}
                {provided.placeholder}
                <AddListItem list={list} items={items} setItems={setItems} />
              </CardContent>
            </div>
          );
        }}
      </Droppable>

      <CardFooter></CardFooter>
    </Card>
  );
}

function AddListItem({
  list,
  setItems,
  items,
}: {
  list: List;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  items: Item[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <form
      className="relative"
      ref={formRef}
      action={async (formData) => {
        const { content } = Object.fromEntries(formData.entries()) as {
          content: string;
        };
        if (!content || content.length === 0) {
          toast.error("Content cannot be empty");
          return;
        }
        const newItem = await addListItem(list.id, content, "thing");
        toast.success("Item added");
        setItems([...items, newItem]);
        formRef.current?.reset();
      }}
    >
      <Input type="text" name="content" placeholder="New Item" />
      <Button
        type="submit"
        variant="ghost"
        className="absolute right-0 top-0 text-muted-foreground"
      >
        <Plus />
      </Button>
    </form>
  );
}

function DeleteListButton({ list }: { list: List }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { lists, setLists, listOrder, setListOrder } = useContext(ListsContext);
  return (
    <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant={"ghost"}
        >
          <Trash className="h-5 w-5 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the list
            and all items within it for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteList(list.id, list.boardId);
              setLists(lists.filter((l) => l.id !== list.id));
              setListOrder(listOrder.filter((listId) => listId !== list.id));
              toast.success("List deleted");
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
