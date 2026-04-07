"use client";

import { Task } from "@/types/task";

import { useSortable } from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import EditTaskModal from "@/components/EditTaskModal";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: task.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),

    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-3 rounded shadow cursor-grab active:cursor-grabbing"
    >
      <h3 className="font-semibold">{task.title}</h3>

      <p className="text-sm text-gray-600">{task.description}</p>

      <EditTaskModal task={task} />
    </div>
  );
}
