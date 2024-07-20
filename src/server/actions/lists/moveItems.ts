"use server";

import { eq } from "drizzle-orm";
import { Item, lists } from "../../db/schema";
import { db } from "../../db";
import { revalidatePath } from "next/cache";

export async function moveItems({
  item,
  originListId,
  destinationListId,
  originalIndex,
  newIndex,
}: {
  item: Item;
  originListId: string;
  destinationListId: string;
  originalIndex: number;
  newIndex: number;
}) {
  const [originList] = await db
    .select()
    .from(lists)
    .where(eq(lists.id, originListId));
  if (!originList) {
    throw new Error("Origin list not found");
  }
  console.log("Original origin list items", originList.items);
  const before = originList.items.slice(0, originalIndex);
  const after = originList.items.slice(originalIndex + 1);
  const newOriginListItems = [...before, ...after];
  console.log("New origin list items", newOriginListItems);
  await db
    .update(lists)
    .set({
      items: [...newOriginListItems],
    })
    .where(eq(lists.id, originListId));

  // update the destination list
  const [destinationList] = await db
    .select()
    .from(lists)
    .where(eq(lists.id, destinationListId));
  if (!destinationList) {
    throw new Error("Destination list not found");
  }
  console.log("Original destination list items", destinationList.items);
  destinationList.items.splice(newIndex, 0, item);

  const newDestinationListItems = destinationList.items;
  console.log("New destination list items", newDestinationListItems);
  await db
    .update(lists)
    .set({
      items: [...newDestinationListItems],
    })
    .where(eq(lists.id, destinationListId));
  // maybe remove this
  revalidatePath(`/${originList.boardId}`);
  return;
}
