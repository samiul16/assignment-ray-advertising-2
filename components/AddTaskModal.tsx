"use client";

import { useState } from "react";

import { useTaskStore } from "@/store/useTaskStore";

import { ColumnType } from "@/types/task";

export default function AddTaskModal() {
  const { addTask } = useTaskStore();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [status, setStatus] = useState<ColumnType>("todo");

  const handleSubmit = async () => {
    if (!title) return;

    await addTask(
      {
        title,
        description,
        status,
      }
      // "current-user-id" // TODO: Get from auth
    );

    setTitle("");

    setDescription("");

    setStatus("todo");

    setOpen(false);
  };

  return (
    <>
      {/* Open Button */}

      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Add Task
      </button>

      {/* Modal */}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[400px] space-y-4">
            <h2 className="text-lg font-bold">Add Task</h2>

            {/* Title */}

            <input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* Description */}

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border p-2 rounded"
            />

            {/* Status */}

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ColumnType)}
              className="w-full border p-2 rounded"
            >
              <option value="todo">To Do</option>

              <option value="inprogress">In Progress</option>

              <option value="done">Done</option>
            </select>

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
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
