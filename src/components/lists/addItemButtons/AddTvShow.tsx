"use client";
import { Button } from "@/components/ui/button";
import type { Item, MovieContent, List, TvShowContent } from "@/server/db/schema";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { Input } from "@/components/ui/input";
import { Movie, TV } from "tmdb-ts";
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
import { searchTvShows } from "@/server/actions/apis/searchTv";

export function AddTvShowDialog({
  list,
  setItems,
  items,
  setOpen,
}: {
  list: List;
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  items: Item[];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState("");
  const [tvShows, setTvShows] = useState<TV[]>([]);
  const debouncedQuery = useDebounce(query, 500);
  useEffect(() => {
    if (debouncedQuery.length === 0) {
      setTvShows([]);
      return;
    }
    void searchTvShows(debouncedQuery).then((tvShows) => {
      setTvShows(tvShows);
    });
  }, [debouncedQuery]);

  const { data: session } = useSession();

  return (
    <DrawerDialogContent className="min-h-[80dvh]">
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
        {tvShows?.map((show) => {
          return (
            <div
              key={show.id}
              onClick={async () => {
                if (!session) return;
                const showContent: TvShowContent = {
                  posterPath: show.poster_path,
                  title: show.name,
                };
                const newItem = await addListItem({
                  listId: list.id,
                  content: showContent,
                  type: "tv_show",
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
                    {show.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {show.first_air_date}
                  </p>
                </div>
                <p className="text-left text-sm text-muted-foreground">
                  {show.overview.substring(0, 100)}...
                </p>
              </div>
              <img
                className="w-24"
                src={`https://image.tmdb.org/t/p/original/${show.poster_path}`}
              />
            </div>
          );
        })}
      </div>
    </DrawerDialogContent>
  );
}
