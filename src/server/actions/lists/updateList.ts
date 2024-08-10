"use server";

import { db } from "@/server/db";
import { lists, ListTypes } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateList({
  listId,
  name,
  accentColor,
}: {
  listId: string;
  name?: string;
  accentColor?: string;
}) : Promise<void> {
  const [list] = await db.select().from(lists).where(eq(lists.id, listId));
  if (!list) throw new Error("List not found");
  if (name) {
    await db.update(lists).set({
      name,
    }).where(eq(lists.id, listId));
  }
  if (accentColor) {
    await db.update(lists).set({
      accentColor,
    }).where(eq(lists.id, listId));
  }
  revalidatePath(`/${list.boardId}`);
}