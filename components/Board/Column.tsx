"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ColumnType } from "@/types/task";
import { useTaskStore } from "@/store/useTaskStore";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";

interface Props {
  columnId: ColumnType;
  title: string;
}

export default function Column({ columnId, title }: Props) {
  const { setNodeRef } = useDroppable({ id: columnId });
  const tasks = useTaskStore((state) => state.tasks);
  const theme = useTheme();

  const columnTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === columnId)
        .sort((a, b) => a.order_index - b.order_index),
    [tasks, columnId]
  );

  const taskIds = columnTasks.map((task) => task.id);

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        p: 2,
        minHeight: 600,
        backgroundColor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f4f5f7",
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, px: 1 }}>
        {title}
        <Typography
          component="span"
          sx={{ ml: 1, opacity: 0.5, fontSize: "0.9rem" }}
        >
          ({columnTasks.length})
        </Typography>
      </Typography>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
}
