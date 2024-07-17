"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { lists } from "../db/schema";

export async function deleteListItem(listItemId: string, listId: string) {
    const [list] = await db.select().from(lists).where(eq(lists.id, listId));
    if (!list) {
        throw new Error("List not found");
    }
    list.items = list.items.filter((item) => item.id !== listItemId);
    await db.update(lists).set({
        items: [...list.items],
    }).where(eq(lists.id, listId));
}