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
import { arrayMove } from "@dnd-kit/sortable";
import { useTaskStore } from "@/store/useTaskStore";
import Column from "./Column";
import TaskCard from "./TaskCard";
import { Box } from "@mui/material";
import { ColumnType, Task } from "@/types/task";
import Cookies from "js-cookie";

export default function Board() {
  const { tasks, fetchTasks, moveTask } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
    if (task) setActiveTask(task);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1. Find the active task
    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    // 2. Determine target status and position
    let newStatus: ColumnType;
    let targetIndex: number;

    const isOverAColumn = ["todo", "inprogress", "done"].includes(overId);

    if (isOverAColumn) {
      // Dropped directly on a column container
      newStatus = overId as ColumnType;
      const columnTasks = tasks
        .filter((t) => t.status === newStatus)
        .sort((a, b) => a.order_index - b.order_index);
      targetIndex = columnTasks.length; // Move to the end
    } else {
      // Dropped over another task card
      const overTaskObj = tasks.find((t) => t.id === overId);
      if (!overTaskObj) return;
      newStatus = overTaskObj.status;

      const columnTasks = tasks
        .filter((t) => t.status === newStatus)
        .sort((a, b) => a.order_index - b.order_index);
      targetIndex = columnTasks.findIndex((t) => t.id === overId);
    }

    // 3. Calculate new order_index
    // We get all tasks in that column sorted
    const sortedColumnTasks = tasks
      .filter((t) => t.status === newStatus && t.id !== activeId)
      .sort((a, b) => a.order_index - b.order_index);

    let newOrderIndex: number;

    if (sortedColumnTasks.length === 0) {
      newOrderIndex = 1000; // First item in column
    } else if (targetIndex <= 0) {
      newOrderIndex = sortedColumnTasks[0].order_index / 2; // Move to top
    } else if (targetIndex >= sortedColumnTasks.length) {
      newOrderIndex =
        sortedColumnTasks[sortedColumnTasks.length - 1].order_index + 1000; // Move to bottom
    } else {
      // Between two items
      const prev = sortedColumnTasks[targetIndex - 1];
      const next = sortedColumnTasks[targetIndex];
      newOrderIndex = (prev.order_index + next.order_index) / 2;
    }

    const session = Cookies.get("user-auth");
    const userName = session ? JSON.parse(session).name : "Unknown User";

    await moveTask(activeId, newStatus, Math.round(newOrderIndex), userName);
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
