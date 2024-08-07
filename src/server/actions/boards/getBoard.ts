"use server";

import { db } from "../../db";
import { List, ListBoard, listBoards, lists } from "../../db/schema";
import { asc, desc, eq } from "drizzle-orm";
export async function getBoard(id: string): Promise<ListBoard> {
  const listBoard = await db.query.listBoards.findFirst({
    where: eq(listBoards.id, id),
    with: { lists: true },
    orderBy: desc(lists.createdAt),
  });

  if (!listBoard) {
    throw new Error("Failed to get list board");
  }

  return listBoard;
}
