"use server";
import { db } from "../db";
import { ListBoard } from "../db/schema";

export async function getListBoards() : Promise<ListBoard[]> {
    const listBoards = await db.query.listBoards.findMany({ with: { lists: true } });

    if (!listBoards) {
        throw new Error("Failed to get list boards");
    }

    return listBoards;
}