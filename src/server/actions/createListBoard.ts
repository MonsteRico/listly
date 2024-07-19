"use server";
import { revalidatePath } from "next/cache";
import { db } from "../db";
import { CreateListBoard, ListBoard, listBoards, users, usersToBoards } from "../db/schema";
import { eq } from "drizzle-orm";
import getUser from "@/lib/getUser";

export async function createListBoard({
  name,
}: CreateListBoard): Promise<ListBoard> {
    const user = await getUser();
    if (!user) throw new Error("User not found");
  const [newListBoard] = await db
    .insert(listBoards)
    .values({ name, listOrder: [], createdByUserId: user.id })
    .returning();

  if (!newListBoard) {
    throw new Error("Failed to create list board");
  }

  // add the user to the list board
  await db.insert(usersToBoards).values({
    userId: user.id,
    boardId: newListBoard.id,
  });

  // get the new list board
  const listBoard = await db.query.listBoards.findFirst({
    where: eq(listBoards.id, newListBoard.id),
    with: { lists: true },
  });

  if (!listBoard) {
    throw new Error("Failed to get list board");
  }

  revalidatePath("/");

  return listBoard;
}
