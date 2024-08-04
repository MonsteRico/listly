"use server";

import { db } from "@/server/db";
import { Item, lists } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function setListItems({
    listId,
    items,
}: {
    listId: string;
    items: Item[];
}) {
    await db
      .update(lists)
      .set({
        items,
      })
      .where(eq(lists.id, listId));
}