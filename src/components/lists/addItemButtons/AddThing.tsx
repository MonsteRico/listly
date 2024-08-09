"use client";
import { Button } from "@/components/ui/button";
import type { Item, List, ThingContent } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

export function AddThingItem({
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
        const newItem = await addListItem({
          listId: list.id,
          content: newThingItemContent,
          type: "thing",
        });
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
