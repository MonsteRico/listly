import { eq } from "drizzle-orm";
import { db } from "../db";
import { listBoards, lists } from "../db/schema";

export async function moveLists(boardId: string, listOrder: string[]) {
  db.update(listBoards)
    .set({
      listOrder: [...listOrder],
    })
    .where(eq(listBoards.id, boardId));
}
