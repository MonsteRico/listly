"use client";
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
import { deleteList } from "@/server/actions/lists/deleteList";
import type { List } from "@/server/db/schema";
import { Trash } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { ListsContext } from "./ListsContext";

export function DeleteListButton({ list }: { list: List }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { lists, setLists, listOrder, setListOrder } = useContext(ListsContext);
  return (
    <AlertDialog onOpenChange={setDeleteDialogOpen} open={deleteDialogOpen}>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
        <Button
          className="text-destructive-foreground gap-4 items-center"
          onClick={(e) => {
            e.stopPropagation();
          }}
          variant={"destructive"}
        >
          Delete <Trash className="h-5 w-5 text-destructive-foreground" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the list
            and all items within it for everyone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteList(list.id, list.boardId);
              setLists(lists.filter((l) => l.id !== list.id));
              setListOrder(listOrder.filter((listId) => listId !== list.id));
              toast.success("List deleted");
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
