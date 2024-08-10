import { Boards } from "@/components/Boards";
import { LoginButton } from "@/components/LoginButton";
import { getListBoards } from "@/server/actions/boards/getListBoards";
import { getServerAuthSession } from "@/server/auth";

export default async function HomePage() {
  const session = await getServerAuthSession();
  if (!session) {
    return (
      <div className="mx-auto flex flex-col items-center justify-center gap-4 px-4 py-12 text-primary sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">What is this?</h2>
        <p className="max-w-[800px] text-lg">
          Listly is a simple todo list like app, similar to Trello. The unique
          thing is the ability to add Movies and TV Shows and potentially other
          types of items in the future to your lists. These will show with
          thumbnails, so its easier to keep track of! Lists are also super easy
          to share, just copy the link and send to a friend thats logged in. No
          extra fluff, just a simple todo list.
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          Login to see your lists
        </h2>
        <div className="">
          <LoginButton />
        </div>
      </div>
    );
  }
  const user = session?.user;
  console.log(user);
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 text-primary sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">What is this?</h2>
        <p className="text-lg">
          Listly is a simple todo list like app, similar to Trello. The unique
          thing is the ability to add Movies and TV Shows and potentially other
          types of items in the future to your lists. These will show with
          thumbnails, so its easier to keep track of! Lists are also super easy
          to share, just copy the link and send to a friend. No extra fluff,
          just a simple todo list.
        </p>
        <h2 className="text-3xl font-bold tracking-tight">
          Login to see your lists
        </h2>
        <div className="">
          <LoginButton />
        </div>
      </div>
    );
  }

  const listBoards = (await getListBoards()).reverse();
  console.log(listBoards);
  return <Boards listBoards={listBoards} />;
}
