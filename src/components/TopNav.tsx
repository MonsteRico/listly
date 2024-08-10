import getUser from "@/lib/getUser";
import { NotebookTabs } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { LoginButton } from "./LoginButton";
import { Profile } from "./Profile";
import Link from "next/link";
import BackArrow from "./BackArrow";

export async function TopNav() {
  const user = await getUser();
  return (
    <div className="mb-5 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2">
        <BackArrow />
      </div>
      <Link href="/">
        <div className="flex flex-row items-center justify-center gap-2 border-b-4 border-primary">
          <NotebookTabs className="h-10 w-10 text-primary" />

          <h1 className="text-4xl font-bold text-primary hover:cursor-pointer">
            Listly
          </h1>
        </div>
      </Link>
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
