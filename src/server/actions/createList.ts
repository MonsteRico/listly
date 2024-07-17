"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateList, List, listBoards, lists } from "../db/schema";
import { eq } from "drizzle-orm";
import { list } from "postcss";

export async function createList({ name, boardId }: CreateList): Promise<List> {
  const listBoard = await db.query.listBoards.findFirst({
    where: eq(listBoards.id, boardId),
    with: { lists: true },
  });
  if (!listBoard) {
    throw new Error("List board not found");
  }
  const [newList] = await db
    .insert(lists)
    .values({
      name,
      boardId,
      items: [],
    })
    .returning();
  if (!newList) {
    throw new Error("Failed to create list");
  }
  const newListOrder = [...listBoard.listOrder, newList.id];
  await db.update(listBoards).set({
    listOrder: [...newListOrder],
  });
  if (!newList) {
    throw new Error("Failed to create list");
  }

  revalidatePath(`/${boardId}`);

  return newList;
}
