"use server";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { listBoards } from "../db/schema";

export async function moveLists(boardId: string, listOrder: string[]) {
  await db.update(listBoards)
    .set({
      listOrder: [...listOrder],
    })
    .where(eq(listBoards.id, boardId));
}
