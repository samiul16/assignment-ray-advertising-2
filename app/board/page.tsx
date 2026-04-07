"use client";

import Board from "@/components/Board/Board";
import AddTaskModal from "@/components/AddTaskModal";

export default function BoardPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}

      <div className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold">Kanban Board</h1>

        <AddTaskModal />
      </div>

      {/* Board */}

      <Board />
    </main>
  );
}
