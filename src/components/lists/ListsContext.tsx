import type { Item, List } from "@/server/db/schema";
import { createContext } from "react";


export const ListsContext = createContext<{
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  listOrder: string[];
  setListOrder: React.Dispatch<React.SetStateAction<string[]>>;
  draggedItem: Item | null;
  setDraggedItem: React.Dispatch<React.SetStateAction<Item | null>>;
  draggedList: List | null;
  setDraggedList: React.Dispatch<React.SetStateAction<List | null>>;
}>({
  lists: [],
  setLists: () => {return},
  listOrder: [],
  setListOrder: () => {return},
  draggedItem: null,
  setDraggedItem: () => {return},
  draggedList: null,
  setDraggedList: () => {return},
});
