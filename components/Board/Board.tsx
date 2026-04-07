/* eslint-disable @typescript-eslint/no-explicit-any */
// Board.tsx
"use client";
import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useTaskStore } from "@/store/useTaskStore";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { Box } from "@mui/material";

export default function Board() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<any>(null);

  // CRITICAL: This allows clicking "Edit" without triggering a drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (e: DragStartEvent) => {
    const task = tasks.find((t) => t.id === e.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;
    if (
      !over ||
      (over.id !== "todo" && over.id !== "inprogress" && over.id !== "done")
    )
      return;
    if (over.id === "todo" || over.id === "inprogress" || over.id === "done") {
      await moveTask(
        active.id as string,
        over.id as "todo" | "inprogress" | "done",
        Date.now()
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          px: 3,
          height: "100%",
          overflowX: "auto",
          pb: 4,
          alignItems: "flex-start",
        }}
      >
        <Column columnId="todo" title="TO DO" />
        <Column columnId="inprogress" title="IN PROGRESS" />
        <Column columnId="done" title="DONE" />
      </Box>
      <DragOverlay>
        {activeTask ? (
          <Box sx={{ width: 280, transform: "rotate(2deg)" }}>
            <TaskCard task={activeTask} isOverlay />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
