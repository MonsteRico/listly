"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateList, List, lists } from "../db/schema";

export async function createList({ name, boardId } : CreateList) : Promise<List> {
    const [newList] = await db.insert(lists).values({
        name,
        boardId,
    }).returning();
    console.log(newList);
    if (!newList) {
        throw new Error("Failed to create list");
    }

    revalidatePath(`/${boardId}`);

    return newList;
}