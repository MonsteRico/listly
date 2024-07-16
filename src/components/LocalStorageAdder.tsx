"use client";

import { LocalStorage } from "@/lib/local-storage";
import { useEffect } from "react";

export function LocalStorageAdder({ boardId }: { boardId: string }) {
    useEffect(() => {
      const previousListBoardIds = LocalStorage.getItem("listly_listBoardIds", []) as string[];
      if (!previousListBoardIds.includes(boardId)) {
        LocalStorage.setItem("listly_listBoardIds", [...previousListBoardIds, boardId]);
      }
    }, []);
  return null;
}