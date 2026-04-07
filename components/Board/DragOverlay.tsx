/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from "@dnd-kit/core";
import { useTaskStore } from "@/store/useTaskStore";
import Column from "@/components/Board/Column";
import TaskCard from "@/components/Board/TaskCard";
import { Box } from "@mui/material";
import { Task } from "@/types/task";

export default function Board() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    // The over.id will be the columnId ('todo', 'inprogress', 'done')
    const newStatus = over.id as any;

    await moveTask(taskId, newStatus, Date.now());
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          p: 3,
          display: "grid",
          // Responsive columns: 1 column on mobile, 3 columns on medium screens+
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Column columnId="todo" title="To Do" />
        <Column columnId="inprogress" title="In Progress" />
        <Column columnId="done" title="Done" />
      </Box>

      {/* Floating preview that follows the mouse cursor */}
      <DragOverlay adjustScale={true}>
        {activeTask ? (
          <Box
            sx={{
              transform: "rotate(3deg)",
              cursor: "grabbing",
              width: "100%",
              // Ensure the overlay looks exactly like the card
              opacity: 0.9,
            }}
          >
            <TaskCard task={activeTask} isOverlay />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
