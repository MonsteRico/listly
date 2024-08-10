"use client";
import { Button } from "@/components/ui/button";
import type { Item, MovieContent, List, ListTypes } from "@/server/db/schema";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { Input } from "@/components/ui/input";
import { Movie } from "tmdb-ts";
import { useDebounce } from "@uidotdev/usehooks";
import { searchMovies } from "@/server/actions/apis/searchMovies";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "@/components/ui/modal-drawer";
import { useSession } from "next-auth/react";
import { AddMovieDialog } from "./AddMovie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddThingDialog } from "./AddThing";
import { AddTvShowDialog } from "./AddTvShow";

export function AddItem({
  list,
  setItems,
  items,
}: {
  list: List;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  items: Item[];
}) {
  const [openMovieAdd, setOpenMovieAdd] = useState(false);
  const [openTvShowAdd, setOpenTvShowAdd] = useState(false);
  const [openBookAdd, setOpenBookAdd] = useState(false);
  const [openGameAdd, setOpenGameAdd] = useState(false);
  const [openThingAdd, setOpenThingAdd] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="flex w-full flex-row rounded-lg border-2 border-dashed focus-within:border-solid"
            variant="ghost"
          >
            Add Item
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent >
          <DropdownMenuItem
            onClick={() => {
              setOpenThingAdd(true);
            }}
          >
            Thing
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenMovieAdd(true);
            }}
          >
            Movie
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenTvShowAdd(true);
            }}
          >
            TV Show
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenBookAdd(true);
            }}
            disabled
          >
            Book
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setOpenGameAdd(true);
            }}
            disabled
          >
            Game
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DrawerDialog open={openMovieAdd} onOpenChange={setOpenMovieAdd}>
        <AddMovieDialog
          list={list}
          setItems={setItems}
          items={items}
          setOpen={setOpenMovieAdd}
        />
      </DrawerDialog>
      <DrawerDialog open={openTvShowAdd} onOpenChange={setOpenTvShowAdd}>
        <AddTvShowDialog
          list={list}
          setItems={setItems}
          items={items}
          setOpen={setOpenTvShowAdd}
        />
      </DrawerDialog>
      {/* <DrawerDialog open={openBookAdd} onOpenChange={setOpenBookAdd}>
        <AddBookDialog
          list={list}
          setItems={setItems}
          items={items}
          setOpen={setOpenBookAdd}
        />
      </DrawerDialog>
      <DrawerDialog open={openGameAdd} onOpenChange={setOpenGameAdd}>
        <AddGameDialog
          list={list}
          setItems={setItems}
          items={items}
          setOpen={setOpenGameAdd}
        />
      </DrawerDialog> */}
      <DrawerDialog open={openThingAdd} onOpenChange={setOpenThingAdd}>
        <AddThingDialog
          list={list}
          setItems={setItems}
          items={items}
          setOpen={setOpenThingAdd}
        />
      </DrawerDialog>
    </>
  );
}
