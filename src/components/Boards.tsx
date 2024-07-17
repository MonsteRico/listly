"use client";
import { CreateListBoard } from "@/components/CreateListBoard";
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
import { LocalStorage } from "@/lib/local-storage";
import { deleteListBoard } from "@/server/actions/deleteListBoard";
import { getListBoards } from "@/server/actions/getListBoards";
import { ListBoard } from "@/server/db/schema";
import { Share, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export function Boards({ listBoards }: { listBoards: ListBoard[] }) {
  const [parent, enableAnimations] = useAutoAnimate();

  return (
    <main ref={parent} className="flex flex-wrap gap-4">
      <CreateListBoard />

      {listBoards.map((listBoard) => (
        <Board key={listBoard.id} listBoard={listBoard} />
      ))}
    </main>
  );
}


function Board({ listBoard }: { listBoard: ListBoard }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const previousListBoardIds = LocalStorage.getItem("listly_listBoardIds", []);
  return (
    <Card
        className="cursor-pointer"
      onClick={() => {
        if (!deleteDialogOpen) router.push(`/${listBoard.id}`);
      }}
    >
      <CardHeader>{listBoard.name}</CardHeader>
      <CardFooter>
        <Button
          onClick={(e) => {
            // copy to the clipboard
            navigator.clipboard.writeText(`${window.location.origin}/${listBoard.id}`);
            toast.success("Copied to clipboard");
            e.stopPropagation();
          }}
          variant={"ghost"}
        >
          <Share />
        </Button>
        <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
          <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
            <Button
              onClick={(e) => {
                e.stopPropagation();
              }}
              variant={"ghost"}
            >
              <Trash className="text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                list board and all lists within it for everyone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteListBoard(listBoard.id);
                  LocalStorage.setItem("listly_listBoardIds", previousListBoardIds.filter((id) => id !== listBoard.id));
                  toast.success("List Board deleted");
                }}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
