"use server";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { ListBoard, listBoards, ItemTypes, lists } from "../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function addListItem(id: string, content: string, type: ItemTypes) {
  const [list] = await db.select().from(lists).where(eq(lists.id, id));
  if (!list) throw new Error("List not found");
  const existingItems = list.items ? list.items : [];

  const newItem = {
    id: uuidv4(),
    type,
    content,
    createdAt: new Date().toISOString(),
    createdBy: "",
    updatedAt: new Date().toISOString(),
    updatedBy: "",
  };

 await db
    .update(lists)
    .set({
      items: [
        ...existingItems,
        newItem,
      ],
    })
    .where(eq(lists.id, id));

  revalidatePath(`/${list.boardId}`);

  return newItem;
}
