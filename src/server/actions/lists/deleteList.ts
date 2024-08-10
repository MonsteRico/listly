"use server";

import { revalidatePath } from "next/cache";
import { db } from "../../db";
import { ListBoard, listBoards, lists } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function deleteList(id: string, boardId: string) {
  await db.delete(lists).where(eq(lists.id, id));
  const board = await db.query.listBoards.findFirst({
    where: eq(listBoards.id, boardId),
  })
  if (!board) throw new Error("Board not found");
   await db.update(listBoards).set({
    listOrder: board.listOrder.filter((listId) => listId !== id),
  })
  await revalidatePath(`/${boardId}`);
}
