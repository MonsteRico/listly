"use client";
import type { Item, List as ListType, ListBoard } from "@/server/db/schema";
import { useEffect, useMemo, useState } from "react";
import { CreateList } from "../CreateList";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { moveItems } from "@/server/actions/lists/moveItems";
import { moveLists } from "@/server/actions/lists/moveLists";
import { ListsContext } from "./ListsContext";
import { List } from "./List";
import { cn } from "@/lib/utils";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ListItem } from "./ListItems";
import { arrayMove } from "@dnd-kit/sortable";

export function Lists({ listBoard }: { listBoard: ListBoard }) {
  const [parent, enableAnimations] = useAutoAnimate();

  const [listOrder, setListOrder] = useState(listBoard.listOrder);
  const [lists, setLists] = useState(
    listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!),
  );

  useEffect(() => {
    setLists(listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!));
  }, [listOrder, listBoard.lists]);

  const onDragEnd = async (result: DragEndEvent) => {
    const { active, over } = result;
    setDraggedItem(null);
    if (!over) return;
    if (active.id == over.id) return;
    const activeData = active.data.current as {
      type: "Item" | "List";
      item?: Item;
      list?: ListType;
      index: number;
    };
    const overData = over.data.current as {
      type: "Item" | "List";
      item?: Item;
      list?: ListType;
      index: number;
    };
    if (!activeData || !overData) return;
    const activeType = activeData.type;
    const overType = overData.type;
    if (activeType == "Item" && overType == "Item") {
      const overItem = overData.item!;
      const activeItem = activeData.item!;
      const overListId = overItem.listId;
      const activeListId = activeItem.listId;
      if (overListId === activeListId) {
        // Move item within list
        lists.forEach((list) => {
          if (list.id === overListId) {
            list.items = arrayMove(
              list.items,
              activeData.index,
              overData.index,
            );
          }
        });
      }
    }
  };

  const onDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id == over.id) return;
    const activeData = active.data.current as {
      type: "Item" | "List";
      item?: Item;
      list?: ListType;
      index: number;
    };
    const overData = over.data.current as {
      type: "Item" | "List";
      item?: Item;
      list?: ListType;
      index: number;
    };
    if (!activeData || !overData) return;
    const activeType = activeData.type;
    const overType = overData.type;
    if (activeType == "Item" && overType == "List") {
      const activeItem = activeData.item!;
      const overList = overData.list!;
      if (overList.items.length > 0) {
        return;
      }
      const overListId = overList.id;

      const activeListId = activeItem.listId;
      lists.forEach((list) => {
        if (list.id === overListId) {
          list.items = [...list.items, { ...activeItem, listId: overListId }];
        }
        if (list.id === activeListId) {
          list.items = list.items.filter((i) => i.id !== activeItem.id);
        }
      });
    } else if (activeType == "Item" && overType == "Item") {
      const activeItem = activeData.item!;
      const overItem = overData.item!;
      if (activeItem.listId === overItem.listId) {
        return;
      } else {
        // Move item to other list
        const originListId = activeItem.listId;
        const destinationListId = overItem.listId;
        lists.forEach((list) => {
          if (list.id === originListId) {
            list.items = list.items.filter((i) => i.id !== activeItem.id);
          }
          if (list.id === destinationListId) {
            list.items = [
              ...list.items,
              { ...activeItem, listId: destinationListId },
            ];
          }
        });
      }
    }
    setLists(lists);
  };

  // const dragList = (result: any) => {
  //   const { destination, source, draggableId } = result;
  //   if (!destination) {
  //     return;
  //   }
  //   const newListOrder = [...listOrder];
  //   newListOrder.splice(source.index, 1);
  //   newListOrder.splice(destination.index, 0, draggableId);
  //   setListOrder(newListOrder);
  //   moveLists(listBoard.id, newListOrder);
  // };

  const memoizedLists = useMemo(() => lists, [lists]);
  const memoizedListOrder = useMemo(() => listOrder, [listOrder]);
  const [draggedItem, setDraggedItem] = useState<Item | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  return (
    <ListsContext.Provider
      value={{
        lists,
        setLists,
        listOrder: memoizedListOrder,
        setListOrder,
        draggedItem,
        setDraggedItem,
      }}
    >
      <DndContext
        sensors={sensors}
        onDragOver={onDragOver}
        onDragStart={({ active }) => {
          if (!active.data.current) return;
          if (active.data.current.type == "Item") {
            setDraggedItem(active.data.current.item as Item);
          }
        }}
        onDragEnd={onDragEnd}
      >
        <main
          className={cn("flex flex-row justify-center overflow-auto")}
          ref={parent}
        >
          <div
            className={cn(
              "flex h-screen gap-4 overflow-x-auto md:h-full md:snap-none md:flex-wrap  md:justify-center",
              !draggedItem && "snap-x snap-mandatory",
            )}
          >
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                index={memoizedListOrder.indexOf(list.id)}
              />
            ))}
            <CreateList
              boardId={listBoard.id}
              listsState={memoizedLists}
              setListsState={setLists}
            />
          </div>
        </main>
        <DragOverlay>
          {draggedItem && (
            <ListItem
              item={draggedItem}
              index={0}
              onDelete={() => {
                return;
              }}
            />
          )}
        </DragOverlay>
      </DndContext>
    </ListsContext.Provider>
  );
}
