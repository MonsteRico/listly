import { List } from "@/server/db/schema";
import { createContext } from "react";


export const ListsContext = createContext<{
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  listOrder: string[];
  setListOrder: React.Dispatch<React.SetStateAction<string[]>>;
}>({
  lists: [],
  setLists: () => {},
  listOrder: [],
  setListOrder: () => {},
});
