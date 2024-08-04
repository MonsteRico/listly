"use server";
import { revalidatePath } from "next/cache";
import { db } from "../../db";
import {
  ListBoard,
  listBoards,
  ItemTypes,
  lists,
  ContentTypes,
  Item,
} from "../../db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function addListItem({
  listId,
  item,
  content,
  type,
}: {
  listId: string;
  item?: Item;
  content?: ContentTypes;
  type: ItemTypes;
}) : Promise<Item | undefined> {
  if (item && content) throw new Error("Cannot add both item and content");
  if (!item && !content) throw new Error("Must add either item or content");
  const [list] = await db.select().from(lists).where(eq(lists.id, listId));
  if (!list) throw new Error("List not found");
  const existingItems = list.items ? list.items : [];

  if (content) {
    const newItem = {
      id: uuidv4(),
      listId,
      type,
      content,
      createdAt: new Date().toISOString(),
      createdByUserId: "",
      updatedAt: new Date().toISOString(),
      updatedByUserId: "",
    };

    await db
      .update(lists)
      .set({
        items: [...existingItems, newItem],
      })
      .where(eq(lists.id, listId));
    revalidatePath(`/${list.boardId}`);

    return newItem;
  }
  else if (item) {
    await db
      .update(lists)
      .set({
        items: [...existingItems, item],
      })
      .where(eq(lists.id, listId));
    revalidatePath(`/${list.boardId}`);
    return item;
  }

}
