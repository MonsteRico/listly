"use client";
import { Button } from "@/components/ui/button";
import type { Item, List, ThingContent } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";
import { addListItem } from "@/server/actions/lists/addListItem";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  DrawerDialogContent,
  DrawerDialogHeader,
  DrawerDialogTitle,
} from "@/components/ui/modal-drawer";

export function AddThingDialog({
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
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <DrawerDialogContent className="min-h-[80dvh]">
      <DrawerDialogHeader>
        <DrawerDialogTitle>Add a Thing</DrawerDialogTitle>
      </DrawerDialogHeader>
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
          if (!session) return;
          const newThingItemContent: ThingContent = {
            text,
          };
          const newItem = await addListItem({
            listId: list.id,
            content: newThingItemContent,
            type: "thing",
            createdByUserId: session.user.id,
          });
          if (!newItem) throw new Error("no new item");
          toast.success("Item added");
          setItems([...items, newItem]);
          formRef.current?.reset();
          setOpen(false);
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
    </DrawerDialogContent>
  );
}
