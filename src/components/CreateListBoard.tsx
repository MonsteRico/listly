"use client";
import { createListBoard } from "@/server/actions/createListBoard";
import type { CreateListBoard } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { LocalStorage } from "@/lib/local-storage";

export function CreateListBoard() {
  const formRef = useRef<HTMLFormElement>(null);
  const previousListBoardIds = LocalStorage.getItem("listly_listBoardIds", []);
  return (
    <Card className="flex flex-col justify-center items-center">
      <CardContent className="flex flex-col justify-center items-center">
        <form
          className="flex flex-col gap-2 justify-center items-center"
          ref={formRef}
          action={async (formData) => {
            const { name } = Object.fromEntries(
              formData.entries(),
            ) as CreateListBoard;
            if (!name || name.length === 0 || !name.trim()) {
              toast.error("List Board name cannot be empty");
              return;
            };
            const listBoard = await createListBoard({ name: name.trim() });
            toast.success("List Board created");
            
            LocalStorage.setItem("listly_listBoardIds", [...previousListBoardIds, listBoard.id]);
            // clear form
            formRef.current?.reset();
          }}
        >
          <Input type="text" name="name" placeholder="Name" />
          <Button type="submit">Create List Board</Button>
        </form>
      </CardContent>
    </Card>
  );
}
