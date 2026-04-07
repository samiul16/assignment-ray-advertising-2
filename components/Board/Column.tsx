/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography, Paper } from "@mui/material";
import TaskCard from "./TaskCard";
import { useMemo } from "react";
import { useTaskStore } from "@/store/useTaskStore";

export default function Column({
  columnId,
  title,
}: {
  columnId: any;
  title: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: columnId });
  const tasks = useTaskStore((state) => state.tasks);

  const columnTasks = useMemo(
    () =>
      tasks
        .filter((t: { status: string }) => t.status === columnId)
        .sort(
          (a: { order_index: number }, b: { order_index: number }) =>
            a.order_index - b.order_index
        ),
    [tasks, columnId]
  );

  return (
    <Paper
      ref={setNodeRef}
      elevation={0}
      sx={{
        width: 300,
        flexShrink: 0,
        bgcolor: isOver ? "action.hover" : "background.paper",
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        borderRadius: 2,
        transition: "background-color 0.2s",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          p: 2,
          fontWeight: 700,
          color: "text.secondary",
          letterSpacing: 1,
        }}
      >
        {title} {columnTasks.length}
      </Typography>

      <SortableContext
        items={columnTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <Box
          sx={{
            p: 1,
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </Box>
      </SortableContext>
    </Paper>
  );
}
