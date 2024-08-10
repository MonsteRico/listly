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
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { deleteListBoard } from "@/server/actions/boards/deleteListBoard";
import { ListBoard } from "@/server/db/schema";
import { Pencil, Share, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useSession } from "next-auth/react";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "./ui/modal-drawer";
import { Label } from "@radix-ui/react-label";
import { updateBoard } from "@/server/actions/boards/updateBoard";
import { useDebounce } from "@uidotdev/usehooks";
import { Input } from "./ui/input";

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
  const { data: session } = useSession();

  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [boardName, setBoardName] = useState(listBoard.name);
  const debouncedBoardName = useDebounce(boardName, 500);

  useEffect(() => {
    updateBoard({
      boardId: listBoard.id,
      name: debouncedBoardName,
    });
  }, [boardName]);

  if (!session) return null;
  const user = session.user;
  return (
    <>
      <Card
        className="cursor-pointer min-h-36"
        onClick={() => {
          if (!deleteDialogOpen) router.push(`/${listBoard.id}`);
        }}
      >
        <CardHeader>{listBoard.name}</CardHeader>
        {listBoard.createdByUserId === user.id && (
          <CardFooter>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setDrawerOpen(true);
              }}
              variant={"ghost"}
            >
              <Pencil />
            </Button>
            <Button
              onClick={(e) => {
                // copy to the clipboard
                navigator.clipboard.writeText(
                  `${window.location.origin}/${listBoard.id}`,
                );
                toast.success("Copied to clipboard");
                e.stopPropagation();
              }}
              variant={"ghost"}
            >
              <Share />
            </Button>
            <AlertDialog
              onOpenChange={setDeleteDialogOpen}
              open={deleteDialogOpen}
            >
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
                    This action cannot be undone. This will permanently delete
                    the list board and all lists within it for everyone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await deleteListBoard(listBoard.id);
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
        )}
      </Card>
      <DrawerDialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerDialogContent>
          <DrawerDialogHeader>
            <DrawerDialogTitle>Options</DrawerDialogTitle>
            <DrawerDialogDescription>
              You can change the name of the list board here.
            </DrawerDialogDescription>
          </DrawerDialogHeader>
          <div className="flex flex-col gap-2">
            <Label>Name</Label>
            <Input
              onChange={(e) => setBoardName(e.target.value)}
              value={boardName}
            />
          </div>
        </DrawerDialogContent>
      </DrawerDialog>
    </>
  );
}
