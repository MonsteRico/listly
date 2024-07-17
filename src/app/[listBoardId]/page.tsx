import { getBoard } from "@/server/actions/getBoard";
import { Lists } from "@/components/Lists";

export default async function BoardPage({
  params,
}: {
  params: { listBoardId: string };
}) {
  const listBoard = await getBoard(params.listBoardId);
  console.log(listBoard);
  return (
    <Lists listBoard={listBoard} />
  );
}
