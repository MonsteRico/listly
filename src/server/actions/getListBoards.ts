"use server";
import getUser from "@/lib/getUser";
import { db } from "../db";
import { ListBoard, listBoards, lists, usersToBoards } from "../db/schema";
import { eq, inArray } from "drizzle-orm";

export async function getListBoards(): Promise<ListBoard[]> {
  const user = await getUser();
  if (!user) throw new Error("User not found");
  const userListBoardsRelation = await db.query.usersToBoards.findMany({
    where: eq(usersToBoards.userId, user.id),
  });
  if (userListBoardsRelation.length === 0) {
    return [];
  }
  const userListBoards = await db.query.listBoards.findMany({
    where: inArray(listBoards.id, userListBoardsRelation.map((ubr) => ubr.boardId)),
    with: { lists: true },
  });

  if (!userListBoards) {
    throw new Error("Failed to get list boards");
  }

  return userListBoards;
}
