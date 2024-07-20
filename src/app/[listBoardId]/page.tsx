import { getBoard } from "@/server/actions/boards/getBoard";
import { Lists } from "@/components/lists/Lists";
import getUser from "@/lib/getUser";
import { permanentRedirect } from "next/navigation";
import { db } from "@/server/db";
import { usersToBoards } from "@/server/db/schema";

export default async function BoardPage({
  params,
}: {
  params: { listBoardId: string };
}) {
  const user = await getUser();
  if (!user) {
    permanentRedirect("/");
  }
  const listBoard = await getBoard(params.listBoardId);
  if (user.listBoardIds.indexOf(listBoard.id) === -1) {
    // add the user to the list board
    await db.insert(usersToBoards).values({
      userId: user.id,
      boardId: listBoard.id,
    });
  }
  return <Lists listBoard={listBoard} />;
}
