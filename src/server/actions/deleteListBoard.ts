"use server";

import { revalidatePath } from "next/cache";
import { db } from "../db";
import { ListBoard, listBoards } from "../db/schema";
import { eq } from "drizzle-orm";

export async function deleteListBoard(id: string) {
  await db.delete(listBoards).where(eq(listBoards.id, id));
  revalidatePath("/");
}
