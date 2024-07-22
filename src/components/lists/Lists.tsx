"use client";
import type { ListBoard } from "@/server/db/schema";
import { useEffect, useMemo, useState } from "react";
import { CreateList } from "../CreateList";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { moveItems } from "@/server/actions/lists/moveItems";
import { moveLists } from "@/server/actions/lists/moveLists";
import { ListsContext } from "./ListsContext";
import { List } from "./List";
import { cn } from "@/lib/utils";
import { DndContext } from "@dnd-kit/core";

export function Lists({ listBoard }: { listBoard: ListBoard }) {
  const [parent, enableAnimations] = useAutoAnimate();

  const [listOrder, setListOrder] = useState(listBoard.listOrder);
  const [lists, setLists] = useState(
    listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!),
  );
  const [somethingDragging, setSomethingDragging] = useState(false);

  useEffect(() => {
    setLists(listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!));
  }, [listOrder]);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    setSomethingDragging(false);
    if (!destination) {
      return;
    }
    if (result.type === "list") {
      dragList(result);
    } else if (result.type === "item") {
      dragItem(result);
    }
  };

  const dragList = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    const newListOrder = [...listOrder];
    newListOrder.splice(source.index, 1);
    newListOrder.splice(destination.index, 0, draggableId);
    setListOrder(newListOrder);
    moveLists(listBoard.id, newListOrder);
  };

  const dragItem = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const sourceList = lists.find((list) => list.id === source.droppableId);
    if (!sourceList) {
      return;
    }
    const destinationList = lists.find(
      (list) => list.id === destination.droppableId,
    );
    if (!destinationList) {
      return;
    }
    // update the items in the source list and destination list in state
    const draggedItem = sourceList.items.find(
      (item) => item.id === draggableId,
    );
    if (!draggedItem) {
      return;
    }
    // update the source list
    sourceList.items.splice(source.index, 1);
    destinationList.items.splice(destination.index, 0, draggedItem);
    // update state
    setLists(
      lists.map((list) => {
        if (list.id === source.droppableId) {
          return sourceList;
        }
        if (list.id === destination.droppableId) {
          return destinationList;
        }
        return list;
      }),
    );
    moveItems({
      item: draggedItem,
      originListId: source.droppableId,
      destinationListId: destination.droppableId,
      originalIndex: source.index,
      newIndex: destination.index,
    });
  };

  const memoizedLists = useMemo(() => lists, [lists]);
  const memoizedListOrder = useMemo(() => listOrder, [listOrder]);

  return (
    <ListsContext.Provider
      value={{
        lists: memoizedLists,
        setLists,
        listOrder: memoizedListOrder,
        setListOrder,
        somethingDragging,
        setSomethingDragging,
      }}
    >
      
        <main
          className={cn(
            "flex flex-row justify-center overflow-auto",
            somethingDragging && "bg-red-500",
          )}
          ref={parent}
        >
              <div
                className={cn(
                  "flex h-screen gap-4 overflow-x-auto md:h-full md:flex-wrap md:justify-center",
                  !somethingDragging && "snap-x snap-mandatory",
                )}
              >
                {memoizedLists.map((list) => (
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
    </ListsContext.Provider>
  );
}
