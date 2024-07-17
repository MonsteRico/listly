"use client";
import { createList } from "@/server/actions/createList";
import { createListBoard } from "@/server/actions/createListBoard";
import type { CreateListBoard, List } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";

export function CreateList({ boardId, listsState, setListsState }: { boardId: string, listsState: List[], setListsState: React.Dispatch<React.SetStateAction<List[]>> }) {
  const formRef = useRef<HTMLFormElement>(null);
  return <form ref={formRef} action={async (formData) => {
    const { name } = Object.fromEntries(formData.entries()) as CreateListBoard;
    const newList = await createList({ name, boardId });
    console.log(newList);
    toast.success("List created");
    // clear form
    formRef.current?.reset();
    // add list to state
    setListsState([...listsState, newList]);
  }}>
    <input type="text" name="name" placeholder="Name" />
    <button type="submit">Create List</button>
  </form>;
}