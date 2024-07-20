"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { List, Item, ThingContent } from "@/server/db/schema";
import { Plus, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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

export function List({ list, index }: { list: List; index: number }) {
  const [parent, enableAnimations] = useAutoAnimate();
  const [items, setItems] = useState(list.items || []);
  const memoizedItems = useMemo(() => items, [items]);

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <Card
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="max-h-[80dvh] min-w-64 max-w-xl overflow-y-auto"
        >
          <CardHeader
            {...provided.dragHandleProps}
            className="flex flex-row items-center justify-between"
          >
            <h2>{list.name}</h2>
            <DeleteListButton list={list} />
          </CardHeader>
          <Droppable droppableId={list.id} type="item">
            {(provided, snapshot) => {
              return (
                <div
                  className={cn(
                    "flex flex-col gap-2 py-2 transition duration-150",
                    snapshot.isDraggingOver && "bg-muted",
                  )}
                  ref={parent}
                  {...provided.droppableProps}
                >
                  <CardContent
                    ref={provided.innerRef}
                    className="flex flex-col justify-between"
                  >
                    {memoizedItems.map((item, index) => (
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
                    {list.type === "thing" && <AddThingItem
                      list={list}
                      items={items}
                      setItems={setItems}
                    />}
                    {list.type === "movie" && <AddMovieItem
                      list={list}
                      items={items}
                      setItems={setItems}
                    />}
                  </CardContent>
                </div>
              );
            }}
          </Droppable>

          <CardFooter></CardFooter>
        </Card>
      )}
    </Draggable>
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
          list.id,
          newThingItemContent,
          "thing",
        );
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

  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setMovies([]);
      return;
    }
    searchMovies(debouncedQuery).then((movies) => {
      setMovies(movies);
      console.log(movies);
    });
  }, [debouncedQuery]);

  return (
    <form
      className="relative flex flex-row rounded-lg border-2 border-dashed focus-within:border-solid"
      ref={formRef}
      action={async (formData) => {
        // const { content } = Object.fromEntries(formData.entries()) as {
        //   content: string;
        // };
        // if (!content || content.length === 0) {
        //   toast.error("Content cannot be empty");
        //   return;
        // }
        // const newItem = await addListItem(list.id, content, "thing");
        // toast.success("Item added");
        // setItems([...items, newItem]);
        // formRef.current?.reset();
      }}
    >
      <Input
        type="text"
        className="px-4 focus:outline-none"
        name="content"
        placeholder="New Item"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      <Search />
      <div className="absolute top-[100%] bg-blue-500 text-xl text-white">
        {movies &&
          movies.map((movie) => {
            return <p>{movie.title}</p>;
          })}
      </div>
    </form>
  );
}
