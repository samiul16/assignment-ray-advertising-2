/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Task } from "@/types/task";

export default function Board() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Fix: DnD-kit needs sensors to distinguish between "click" and "drag"
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as any;

    // Logic: moveTask(id, status, order_index)
    await moveTask(taskId, newStatus, Date.now());
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
          gap: 2,
          p: 3,
          height: "100%",
          overflowX: "auto", // Jira-style horizontal scroll
          alignItems: "flex-start",
          "&::-webkit-scrollbar": { height: 8 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "#0003", borderRadius: 4 },
        }}
      >
        <Column columnId="todo" title="TO DO" />
        <Column columnId="inprogress" title="IN PROGRESS" />
        <Column columnId="done" title="DONE" />
      </Box>

      <DragOverlay>
        {activeTask ? (
          <Box sx={{ width: 300, transform: "rotate(3deg)" }}>
            <TaskCard task={activeTask} isOverlay />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
