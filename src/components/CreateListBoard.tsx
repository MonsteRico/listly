"use client";
import { createListBoard } from "@/server/actions/boards/createListBoard";
import type { CreateListBoard } from "@/server/db/schema";
import { useRef } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export function CreateListBoard() {
  const formRef = useRef<HTMLFormElement>(null);
  return (
    <Card className="flex flex-col items-center justify-center min-h-36">
      <CardContent className="flex flex-col items-center justify-center">
        <form
          className="flex flex-col items-center justify-center gap-2"
          ref={formRef}
          action={async (formData) => {
            const { name } = Object.fromEntries(
              formData.entries(),
            ) as CreateListBoard;
            if (!name || name.length === 0 || !name.trim()) {
              toast.error("List Board name cannot be empty");
              return;
            }
            const listBoard = await createListBoard({ name: name.trim() });
            toast.success("List Board created");

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
