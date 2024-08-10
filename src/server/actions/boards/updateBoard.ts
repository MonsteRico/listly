"use server";

import { db } from "@/server/db";
import { listBoards, lists, ListTypes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateBoard({
  boardId,
  name,
}: {
  boardId: string;
  name?: string;
}): Promise<void> {
  const [board] = await db
    .select()
    .from(listBoards)
    .where(eq(listBoards.id, boardId));
  if (!board) throw new Error("Board not found");
  if (name) {
    await db
      .update(listBoards)
      .set({
        name,
      })
      .where(eq(listBoards.id, boardId));
  }

  revalidatePath(`/${boardId}`);
  revalidatePath("/");
}
