import { CreateList } from "@/components/CreateList";
import { CreateListBoard } from "@/components/CreateListBoard";
import { LocalStorageAdder } from "@/components/LocalStorageAdder";
import { getBoard } from "@/server/actions/getBoard";
import { getListBoards } from "@/server/actions/getListBoards";
import Link from "next/link";

export default async function BoardPage({
  params,
}: {
  params: { listBoardId: string };
}) {
  const listBoard = await getBoard(params.listBoardId);
  console.log(listBoard);
  return (
    <main className="">
      <LocalStorageAdder boardId={listBoard.id} />
      <CreateList boardId={listBoard.id} />
      {listBoard.lists.map((listBoard) => (
        <div key={listBoard.id}>
          <h2>{listBoard.name}</h2>
        </div>
      ))}
    </main>
  );
}
