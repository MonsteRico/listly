import { Boards } from "@/components/Boards";
import { CreateListBoard } from "@/components/CreateListBoard";
import { LoginButton } from "@/components/LoginButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getListBoards } from "@/server/actions/getListBoards";
import { authOptions, getServerAuthSession } from "@/server/auth";
import { ListBoard } from "@/server/db/schema";
import { Share, Trash } from "lucide-react";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import Link from "next/link";

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
