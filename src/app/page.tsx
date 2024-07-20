import { Boards } from "@/components/Boards";
import { LoginButton } from "@/components/LoginButton";
import { getListBoards } from "@/server/actions/boards/getListBoards";
import { getServerAuthSession } from "@/server/auth";

export default async function HomePage() {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Login to see your lists
        </h2>
        <div className="mt-6">
          <LoginButton />
        </div>
      </div>
    );
  }
  const user = session?.user;
  console.log(user);
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Login to see your lists
        </h2>
        <div className="mt-6">
          <LoginButton />
        </div>
      </div>
    );
  }

  const listBoards = (await getListBoards()).reverse();
  console.log(listBoards);
  return <Boards listBoards={listBoards} />;
}
