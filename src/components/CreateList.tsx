"use client";
import { createList } from "@/server/actions/createList";
import { createListBoard } from "@/server/actions/createListBoard";
import type { CreateListBoard } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";

export function CreateList({ boardId }: { boardId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  return <form ref={formRef} action={async (formData) => {
    const { name } = Object.fromEntries(formData.entries()) as CreateListBoard;
    const listBoard = await createList({ name, boardId });
    console.log(listBoard);
    toast.success("List created");
    // clear form
    formRef.current?.reset();
  }}>
    <input type="text" name="name" placeholder="Name" />
    <button type="submit">Create List</button>
  </form>;
}