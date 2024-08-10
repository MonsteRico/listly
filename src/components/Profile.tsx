"use client";

import { useEffect, useState } from "react";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "./ui/modal-drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { LogoutButton } from "./LogoutButton";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ThemeToggle } from "./ThemeToggle";
import { useDebounce } from "@uidotdev/usehooks";
import { updateDbUser } from "@/server/actions/users/updateUser";

export function Profile({
  user,
}: {
  user: {
    id: string;
    listBoardIds: string[];
  } & {
    nickname?: string | null;
    colorScheme?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name ?? "Listly User");
    const debouncedName = useDebounce(name, 500);

    useEffect(() => {
      if (!debouncedName) return;
      updateDbUser({ userId: user.id, name: debouncedName });
    }, [debouncedName]);

  return (
    <DrawerDialog open={open} onOpenChange={setOpen}>
      <DrawerDialogTrigger asChild>
        <img
          className="w-16 rounded-full bg-foreground transition duration-300 hover:cursor-pointer hover:bg-foreground/75"
          src={user.image ?? "/defaultUser.jpg"}
        />
      </DrawerDialogTrigger>
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Edit User Settings</DrawerDialogTitle>
        </DrawerDialogHeader>
        <div className="flex flex-row justify-evenly">
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Nickname</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Color Scheme</Label>
            <ThemeToggle />
          </div>
        </div>
        <DrawerDialogFooter>
          <LogoutButton />
        </DrawerDialogFooter>
      </DrawerDialogContent>
    </DrawerDialog>
  );
}
