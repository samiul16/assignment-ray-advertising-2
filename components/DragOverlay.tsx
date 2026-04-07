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
import { Box, Grid } from "@mui/material";
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
    const newStatus = over.id as any;

    await moveTask(taskId, newStatus, Date.now());
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Column columnId="todo" title="To Do" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Column columnId="inprogress" title="In Progress" />
          </Grid>
          <Grid item xs={12} md={4}>
            <Column columnId="done" title="Done" />
          </Grid>
        </Grid>
      </Box>

      {/* This creates the floating preview on movement */}
      <DragOverlay adjustScale={true}>
        {activeTask ? (
          <Box sx={{ transform: "rotate(3deg)", cursor: "grabbing" }}>
            <TaskCard task={activeTask} isOverlay />
          </Box>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
