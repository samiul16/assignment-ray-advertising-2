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

interface Props {
  columnId: ColumnType;

  title: string;
}

export default function Column({ columnId, title }: Props) {
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const tasks = useTaskStore((state) => state.tasks);

  const columnTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.status === columnId)
        .sort((a, b) => a.order_index - b.order_index),

    [tasks, columnId]
  );

  const taskIds = columnTasks.map((task) => task.id);

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-xl p-4 min-h-[400px]">
      <h2 className="font-bold mb-4">{title}</h2>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
