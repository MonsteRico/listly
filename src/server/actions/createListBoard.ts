"use server";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateListBoard, ListBoard, listBoards } from "../db/schema";
import { eq } from "drizzle-orm";

export async function createListBoard({ name } : CreateListBoard) : Promise<ListBoard> {
    const [newListBoard] = await db.insert(listBoards).values({ name, listOrder: [] }).returning(); 

    if (!newListBoard) {
        throw new Error("Failed to create list board");
    }

    // get the new list board
    const listBoard = await db.query.listBoards.findFirst({ where: eq(listBoards.id, newListBoard.id), with: { lists: true } });

    if (!listBoard) {
        throw new Error("Failed to get list board");
    }
    
    revalidatePath("/");

    return listBoard;
}