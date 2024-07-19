"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { ListBoard, listBoards, lists } from "../db/schema";
import { eq } from "drizzle-orm";

export async function deleteList(id: string, boardId: string) {
  await db.delete(lists).where(eq(lists.id, id));
  await revalidatePath(`/${boardId}`);
}
