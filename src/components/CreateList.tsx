"use client";
import { createList } from "@/server/actions/lists/createList";
import type { CreateListBoard, List } from "@/server/db/schema";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ListsContext } from "./lists/ListsContext";

export function CreateList({
  boardId,
}: {
  boardId: string;
}) {
  const {lists, setLists} = useContext(ListsContext);

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Card className="flex max-h-[80dvh] min-h-96 min-w-[90dvw] snap-center md:min-w-64 md:max-w-xl flex-col items-center justify-center gap-4 overflow-y-auto border-4 border-dashed border-accent dark:border-muted-foreground bg-transparent focus-within:border-solid">
      <form
        autoComplete="off"
        className="flex flex-col gap-4"
        ref={formRef}
        action={async (formData) => {
          const { name } = Object.fromEntries(
            formData.entries(),
          ) as CreateListBoard;
          const newList = await createList({ name, boardId });
          console.log(newList);
          toast.success("List created");
          // clear form
          formRef.current?.reset();
          // add list to state
          setLists([...lists, newList]);
        }}
      >
        <Input type="text" name="name" placeholder="Name" autoComplete="off" />
        <Button type="submit">Create List</Button>
      </form>
    </Card>
  );
}
