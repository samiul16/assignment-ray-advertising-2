// Column.tsx
"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { Task } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";

export default function Column({
  columnId,
  title,
}: {
  columnId: string;
  title: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const tasks = useTaskStore((state) => state.tasks);

  const columnTasks = useMemo(
    () =>
      tasks
        .filter((t: Task) => t.status === columnId)
        .sort((a: Task, b: Task) => a.order_index - b.order_index),
    [tasks, columnId]
  );

  return (
    <Box
      ref={setNodeRef}
      sx={{
        width: 280,
        minWidth: 280,
        display: "flex",
        flexDirection: "column",
        bgcolor: isOver ? "action.hover" : "background.paper",
        borderRadius: 1.5,
        p: 1,
        maxHeight: "calc(100vh - 250px)",
        transition: "0.2s",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          p: 1,
          fontWeight: 700,
          color: "text.secondary",
          textTransform: "uppercase",
        }}
      >
        {title}{" "}
        <span style={{ marginLeft: 4, opacity: 0.7 }}>
          {columnTasks.length}
        </span>
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <SortableContext
          items={columnTasks.map((t: Task) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </Box>
    </Box>
  );
}
