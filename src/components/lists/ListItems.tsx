import type { Item, MovieItem, ThingItem } from "@/server/db/schema";
import { Card } from "../ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ListsContext } from "./ListsContext";
import { useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export function ListItem({
  item,
  index,
  onDelete,
}: {
  item: Item;
  index: number;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);


  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id, data: { type: "Item", item, index } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      style={style}
      {...attributes}
      ref={setNodeRef}
      className={cn(
        "group mb-2 flex h-full w-full items-center bg-muted",
        isDragging && "border-2 border-primary bg-muted-foreground/10",
      )}
    >
      <div
        {...listeners}
        className={cn("h-full w-3/4 py-2 pl-4", isDragging && "opacity-0")}
      >
        <ListItemContent isDragging={false} item={item} />
      </div>
      <Button
        variant="ghost"
        className={cn(
          "h-full w-1/4 text-muted-foreground opacity-0 hover:bg-muted-foreground/10 group-hover:opacity-100",
          isDragging && "hidden",
        )}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onDelete();
        }}
      >
        <X />
      </Button>
    </Card>
  );
}

function ListItemContent({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  switch (item.type) {
    case "thing":
      return <ListItemThing isDragging={isDragging} item={item as ThingItem} />;
    case "movie":
      return <ListItemMovie isDragging={isDragging} item={item as MovieItem} />;
    case "game":
      return <ListItemGame isDragging={isDragging} item={item as ThingItem} />;
    case "book":
      return <ListItemBook isDragging={isDragging} item={item as ThingItem} />;
    case "tv_show":
      return (
        <ListItemTVShow isDragging={isDragging} item={item as ThingItem} />
      );
    default:
      return <div className="bg-red-500">{item.content.toString()}</div>;
  }
}

function ListItemThing({
  item,
  isDragging,
}: {
  item: ThingItem;
  isDragging: boolean;
}) {
  return <p className="text-sm">{item.content.text}</p>;
}

function ListItemMovie({
  item,
  isDragging,
}: {
  item: MovieItem;
  isDragging: boolean;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <img
            className="w-32"
            src={`https://image.tmdb.org/t/p/original/${item.content.posterPath}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.content.title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ListItemGame({
  item,
  isDragging,
}: {
  item: ThingItem;
  isDragging: boolean;
}) {
  return <div>{item.content.text}</div>;
}

function ListItemBook({
  item,
  isDragging,
}: {
  item: ThingItem;
  isDragging: boolean;
}) {
  return <div>{item.content.text}</div>;
}

function ListItemTVShow({
  item,
  isDragging,
}: {
  item: ThingItem;
  isDragging: boolean;
}) {
  return <p>{item.content.text}</p>;
}
