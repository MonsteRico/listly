import getUser from "@/lib/getUser";
import { NotebookTabs } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { LoginButton } from "./LoginButton";
import { Profile } from "./Profile";

export async function TopNav() {
  const user = await getUser();
  return (
    <div className="mb-5 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2"></div>
      <div className="border-primary flex flex-row items-center justify-center gap-2 border-b-4">
        <NotebookTabs className="text-primary h-10 w-10" />
        <h1 className="text-primary text-4xl font-bold">Listly</h1>
      </div>
      <div className="flex flex-row gap-2">
        {user ? (
          <div className="flex flex-col items-center gap-2">
            <Profile user={user} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
