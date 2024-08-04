"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type {
  List,
  Item,
  ThingContent,
  MovieContent,
} from "@/server/db/schema";
import { Dot, Plus, Search, Star } from "lucide-react";
import { use, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { ListItem } from "./ListItems";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import { deleteListItem } from "@/server/actions/lists/deleteListItem";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { DeleteListButton } from "./DeleteListButton";
import { Movie } from "tmdb-ts";
import { useDebounce } from "@uidotdev/usehooks";
import { searchMovies } from "@/server/actions/movies/searchMovies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ListsContext } from "./ListsContext";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { set } from "zod";
import { setListItems } from "@/server/actions/lists/setListItems";

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
  return (
    <Card className={cn("h-fit min-w-[90dvw] md:min-w-64 md:max-w-xl snap-center")}>
      <CardHeader className="flex flex-row items-center justify-between">
        <h2>{list.name}</h2>
        <DeleteListButton list={list} />
      </CardHeader>
      <div
        className={cn("flex flex-col gap-2 py-2 transition duration-150")}
        ref={parent}
      >
        <CardContent
          ref={setNodeRef}
          className={cn("flex w-full flex-col justify-between")}
        >
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
          {list.type === "thing" && (
            <AddThingItem list={list} items={items} setItems={setItems} />
          )}
          {list.type === "movie" && (
            <AddMovieItem list={list} items={items} setItems={setItems} />
          )}
        </CardContent>
      </div>
      <CardFooter></CardFooter>
    </Card>
  );
}

function AddThingItem({
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
      className="flex flex-row rounded-lg border-2 border-dashed focus-within:border-solid"
      ref={formRef}
      action={async (formData) => {
        const { text } = Object.fromEntries(formData.entries()) as {
          text: string;
        };
        if (!text || text.length === 0) {
          toast.error("Content cannot be empty");
          return;
        }
        const newThingItemContent: ThingContent = {
          text,
        };
        const newItem = await addListItem(
        {  listId:list.id,
          content:newThingItemContent,
          type:"thing",}
        );
        if (!newItem) throw new Error("no new item");
        toast.success("Item added");
        setItems([...items, newItem]);
        formRef.current?.reset();
      }}
    >
      <Input
        type="text"
        className="px-4 focus:outline-none"
        name="text"
        placeholder="New Item"
      />
      <Button type="submit" variant="ghost" className="text-muted-foreground">
        <Plus />
      </Button>
    </form>
  );
}

function AddMovieItem({
  list,
  setItems,
  items,
}: {
  list: List;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  items: Item[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const debouncedQuery = useDebounce(query, 500);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setMovies([]);
      return;
    }
    void searchMovies(debouncedQuery).then((movies) => {
      setMovies(movies);
      console.log(movies);
    });
  }, [debouncedQuery]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="flex w-full flex-row rounded-lg border-2 border-dashed focus-within:border-solid"
          variant="ghost"
        >
          Add a Movie
        </Button>
      </DialogTrigger>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Add a Movie</DialogTitle>
        </DialogHeader>
        <div className="items-center gap-4">
          <Input
            className=""
            placeholder="Search for a movie"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
          />
        </div>
        <div className="flex max-h-[60dvh] flex-col justify-center gap-4 overflow-auto">
          {movies?.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={async () => {
                    const movieContent: MovieContent = {
                      posterPath: movie.poster_path,
                      title: movie.title,
                    };
                    const newItem = await addListItem(
                      {listId:list.id,
                      content:movieContent,
                      type:"movie",}
                    );
                    if (!newItem) throw new Error("no new item");
                    toast.success("Item added");
                    setItems([...items, newItem]);
                    setOpen(false);
                  }}
                  className="relative flex h-full w-full cursor-pointer flex-row items-center justify-between rounded-lg p-3 transition duration-150 hover:bg-muted"
                >
                  <div className="flex flex-col items-center justify-start p-4">
                    <div className="flex w-full flex-row items-center justify-between gap-2">
                      <p className="text-left text-base font-bold text-primary">
                        {movie.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {movie.release_date}
                      </p>
                    </div>
                    <p className="text-left text-sm text-muted-foreground">
                      {movie.overview.substring(0, 100)}...
                    </p>
                  </div>
                  <img
                    className="w-24"
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  />
                </div>
              );
            })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
