"use client";
import { Button } from "@/components/ui/button";
import type {
  Item,
  MovieContent,
  List,
} from "@/server/db/schema";
import {  useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { Input } from "@/components/ui/input";
import { Movie } from "tmdb-ts";
import { useDebounce } from "@uidotdev/usehooks";
import { searchMovies } from "@/server/actions/movies/searchMovies";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "@/components/ui/modal-drawer";
import { useSession } from "next-auth/react";

export function AddMovieItem({
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

  const { data: session } = useSession();

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DrawerDialogTrigger asChild>
        <Button
          className="flex w-full flex-row rounded-lg border-2 border-dashed focus-within:border-solid"
          variant="ghost"
        >
          Add a Movie
        </Button>
      </DrawerDialogTrigger>
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Add a Movie</DrawerDialogTitle>
        </DrawerDialogHeader>
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
                  if (!session) return;
                  const movieContent: MovieContent = {
                    posterPath: movie.poster_path,
                    title: movie.title,
                  };
                  const newItem = await addListItem({
                    listId: list.id,
                    content: movieContent,
                    type: "movie",
                    createdByUserId: session.user.id,
                  });
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
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
