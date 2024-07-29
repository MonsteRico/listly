"use client";
import type { Item, ListBoard } from "@/server/db/schema";
import { useEffect, useMemo, useState } from "react";
import { CreateList } from "../CreateList";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { moveItems } from "@/server/actions/lists/moveItems";
import { moveLists } from "@/server/actions/lists/moveLists";
import { ListsContext } from "./ListsContext";
import { List } from "./List";
import { cn } from "@/lib/utils";
import { DndContext } from "@dnd-kit/core";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export function Lists({ listBoard }: { listBoard: ListBoard }) {
  const [parent, enableAnimations] = useAutoAnimate();

  const [listOrder, setListOrder] = useState(listBoard.listOrder);
  const [lists, setLists] = useState(
    listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!),
  );
  

  useEffect(() => {
    setLists(listOrder.map((id) => listBoard.lists.find((l) => l.id === id)!));
  }, [listOrder]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }

        setDraggedItem(null);
        const destinationData = destination.data;
        const sourceData = source.data;
        const destinationType = destinationData.type;
        const sourceType = sourceData.type;
        console.log("source", sourceData);
        console.log("destination", destinationData);
        if (sourceType == "item" && destinationType == "list") {
          const item = sourceData.item as Item;
          const originListId = item.listId;
          const destinationListId = destinationData.id as string;
          const itemIndex = lists
            .find((list) => list.id === originListId)!
            .items.indexOf(item);

          console.log(
            "Moving item id",
            item.id,
            "from",
            originListId,
            "to",
            destinationListId,
          );
          const originList = lists.find((list) => list.id === originListId)!;
          const destinationList = lists.find(
            (list) => list.id === destinationListId,
          )!;
          console.log("originList", originList);
          console.log("destinationList", destinationList);
          const listsCopy = [...lists];
          listsCopy.forEach((list) => {
            if (list.id === originListId) {
              list.items = list.items.filter((i) => i.id !== item.id);
              console.log("originList.items", list.items);
            }
            if (list.id === destinationListId) {
              list.items = [
                ...list.items,
                { ...item, listId: destinationListId },
              ];
              item.listId = destinationListId;
              console.log("destinationList.items", list.items);
            }
          });
          setLists(listsCopy);
        }
      },
      onDropTargetChange({ source, location }) {
        return;
        console.log("onDropTargetChange");
        const destination = location.current.dropTargets[0];
        if (!destination) {
          // if dropped outside of any drop targets
          return;
        }
        const destinationData = destination.data;
        const sourceData = source.data;
        const destinationType = destinationData.type;
        const sourceType = sourceData.type;
        if (sourceType == "item" && destinationType == "list") {
          const item = sourceData.item as Item;
          const originListId = item.listId;
          const destinationListId = destinationData.id as string;
          if (originListId === destinationListId) {
            return;
          }
          const itemIndex = lists
            .find((list) => list.id === originListId)!
            .items.indexOf(item);

          console.log(
            "Moving item id",
            item.id,
            "from",
            originListId,
            "to",
            destinationListId,
          );
          const originList = lists.find((list) => list.id === originListId)!;
          const destinationList = lists.find(
            (list) => list.id === destinationListId,
          )!;
          console.log("originList", originList);
          console.log("destinationList", destinationList);
          lists.forEach((list) => {
            if (list.id === originListId) {
              list.items = list.items.filter((i) => i.id !== item.id);
              console.log("originList.items", list.items);
            }
            if (list.id === destinationListId) {
              list.items = [
                ...list.items,
                { ...item, listId: destinationListId },
              ];
              console.log("destinationList.items", list.items);
              item.listId = destinationListId;
            }
          });
          setLists(lists);
        }
      },
    });
  }, []);

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

  const [draggedItem, setDraggedItem] = useState<Item | null>(null);

  return (
    <ListsContext.Provider
      value={{
        lists,
        setLists,
        listOrder: memoizedListOrder,
        setListOrder,
        draggedItem,
        setDraggedItem
      }}
    >
      <main
        className={cn(
          "flex flex-row justify-center overflow-auto",
        )}
        ref={parent}
      >
        <div
          className={cn(
            "flex h-screen gap-4 overflow-x-auto md:h-full md:flex-wrap md:justify-center",
          )}
        >
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              items={list.items}
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
