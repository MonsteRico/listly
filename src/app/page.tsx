import { Boards } from "@/components/Boards";
import { CreateListBoard } from "@/components/CreateListBoard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getListBoards } from "@/server/actions/getListBoards";
import { ListBoard } from "@/server/db/schema";
import { Share, Trash } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const listBoards = (await getListBoards()).reverse();
  console.log(listBoards);
  return (
      <Boards listBoards={listBoards} />
  );
}

