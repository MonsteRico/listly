import type { Item } from "@/server/db/schema";
import { Card, CardContent } from "./ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Button } from "./ui/button";
import { X } from "lucide-react";

export function ListItem({ item, index, onDelete }: { item: Item; index: number; onDelete: () => void }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          className="relative mb-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <ListItemContent item={item} />
          <Button variant="ghost" className="absolute right-0 top-0 text-muted-foreground" onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onDelete();
          }}>
            <X className="h-4" />
          </Button>
        </div>
      )}
    </Draggable>
  );
}

function ListItemContent({ item }: { item: Item }) {
  switch (item.type) {
    case "thing":
      return <ListItemThing item={item} />;
    case "movie":
      return <ListItemMovie item={item} />;
    case "game":
      return <ListItemGame item={item} />;
    case "book":
      return <ListItemBook item={item} />;
    case "tv_show":
      return <ListItemTVShow item={item} />;
    default:
      return <div className="bg-red-500">{item.content}</div>;
  }
}

function ListItemThing({ item }: { item: Item }) {
  return (
    <Card className="flex items-center bg-muted">
      <CardContent className="flex items-center text-sm">
        {item.content}
      </CardContent>
    </Card>
  );
}

function ListItemMovie({ item }: { item: Item }) {
  return <div>{item.content}</div>;
}

function ListItemGame({ item }: { item: Item }) {
  return <div>{item.content}</div>;
}

function ListItemBook({ item }: { item: Item }) {
  return <div>{item.content}</div>;
}

function ListItemTVShow({ item }: { item: Item }) {
  return <div>{item.content}</div>;
}
