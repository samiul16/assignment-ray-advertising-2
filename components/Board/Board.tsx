/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Column from "./Column";

import { DndContext, DragEndEvent } from "@dnd-kit/core";

import { useTaskStore } from "@/store/useTaskStore";

import { useEffect } from "react";

export default function Board() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    console.log("Drag ended:", active, over);

    const taskId = active.id as string;

    const newStatus = over.id as any;

    // Move task
    await moveTask(taskId, newStatus, Date.now());
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-3 gap-4 p-6">
        <Column columnId="todo" title="To Do" />

        <Column columnId="inprogress" title="In Progress" />

        <Column columnId="done" title="Done" />
      </div>
    </DndContext>
  );
}
