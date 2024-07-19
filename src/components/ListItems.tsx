import type { Item } from "@/server/db/schema";
import { Card } from "./ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ListItem({
  item,
  index,
  onDelete,
}: {
  item: Item;
  index: number;
  onDelete: () => void;
}) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <Card
          className={cn(
            "mb-2 flex h-full w-full items-center bg-muted",
            snapshot.isDragging && "bg-accent",
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
            <div {...provided.dragHandleProps} className="h-full w-3/4 pl-4 py-2">
              <ListItemContent isDragging={snapshot.isDragging} item={item} />
            </div>
            <Button
              variant="ghost"
              className="w-1/4 h-full text-muted-foreground hover:bg-muted-foreground/10"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onDelete();
              }}
            >
              <X />
            </Button>
        </Card>
      )}
    </Draggable>
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
      return <ListItemThing isDragging={isDragging} item={item} />;
    case "movie":
      return <ListItemMovie isDragging={isDragging} item={item} />;
    case "game":
      return <ListItemGame isDragging={isDragging} item={item} />;
    case "book":
      return <ListItemBook isDragging={isDragging} item={item} />;
    case "tv_show":
      return <ListItemTVShow isDragging={isDragging} item={item} />;
    default:
      return <div className="bg-red-500">{item.content}</div>;
  }
}

function ListItemThing({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  return (
    <p className="text-sm">{item.content}</p>
  );
}

function ListItemMovie({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  return <p>{item.content}</p>;
}

function ListItemGame({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  return <div>{item.content}</div>;
}

function ListItemBook({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  return <div>{item.content}</div>;
}

function ListItemTVShow({
  item,
  isDragging,
}: {
  item: Item;
  isDragging: boolean;
}) {
  return <p>{item.content}</p>;
}
