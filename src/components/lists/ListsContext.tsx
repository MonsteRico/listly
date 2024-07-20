import { List } from "@/server/db/schema";
import { createContext } from "react";


export const ListsContext = createContext<{
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  listOrder: string[];
  setListOrder: React.Dispatch<React.SetStateAction<string[]>>;
  somethingDragging: boolean;
  setSomethingDragging: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  lists: [],
  setLists: () => {},
  listOrder: [],
  setListOrder: () => {},
  somethingDragging: false,
  setSomethingDragging: () => {},
});
