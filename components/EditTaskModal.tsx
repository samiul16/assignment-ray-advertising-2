"use client";

import { useState } from "react";

import { Task } from "@/types/task";

import { useTaskStore } from "@/store/useTaskStore";

interface Props {
  task: Task;
}

export default function EditTaskModal({ task }: Props) {
  const { updateTask } = useTaskStore();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState(task.title);

  const [description, setDescription] = useState(task.description);

  const handleSubmit = async () => {
    await updateTask(
      task.id,

      title,

      description
    );

    setOpen(false);
  };

  return (
    <>
      {/* Open Trigger */}

      <button onClick={() => setOpen(true)} className="text-sm text-blue-600">
        Edit
      </button>

      {/* Modal */}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h2 className="font-bold">Edit Task</h2>

            {/* Title */}

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* Description */}

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* Actions */}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
