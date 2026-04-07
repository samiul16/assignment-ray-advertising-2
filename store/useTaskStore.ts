import { create } from "zustand";
import { Task, ColumnType } from "@/types/task";
import { supabase } from "@/lib/supabase";

interface TaskState {
  tasks: Task[];
  notification: string | null; // For the real-time toast
  setNotification: (msg: string | null) => void;
  fetchTasks: () => Promise<void>;
  moveTask: (
    taskId: string,
    newStatus: ColumnType,
    newOrder: number,
    userName: string
  ) => Promise<void>;
  updateTask: (
    taskId: string,
    title: string,
    description: string,
    userName: string
  ) => Promise<void>;
  addTask: (data: Task, userName: string) => Promise<void>;
}

// Create a single broadcast channel for UI notifications
const notificationChannel = supabase.channel("board-notifications");

export const useTaskStore = create<TaskState>((set, get) => {
  // 1. Listen for Broadcast messages (Realtime UI Notifications)
  notificationChannel
    .on("broadcast", { event: "task-moved" }, ({ payload }) => {
      console.log("Broadcast received:", payload);
      set({ notification: payload.message });
    })
    .subscribe();

  // 2. Postgres Changes (Syncing Data)
  supabase
    .channel("tasks-db-changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      async () => {
        const { data } = await supabase.from("tasks").select("*");
        set({ tasks: data || [] });
      }
    )
    .subscribe();

  return {
    tasks: [],
    notification: null,
    setNotification: (msg) => set({ notification: msg }),

    fetchTasks: async () => {
      const { data } = await supabase.from("tasks").select("*");
      set({ tasks: data || [] });
    },

    moveTask: async (taskId, newStatus, newOrder, userName) => {
      const task = get().tasks.find((t) => t.id === taskId);
      const message = `${userName} moved task: ${task?.title}`;

      // 1. Broadcast to others immediately
      notificationChannel.send({
        type: "broadcast",
        event: "task-moved",
        payload: { message },
      });

      // 2. Update DB with metadata
      await supabase
        .from("tasks")
        .update({
          status: newStatus,
          order_index: newOrder,
          updated_by: userName, // User's name
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);
    },

    updateTask: async (taskId, title, description, userName) => {
      await supabase
        .from("tasks")
        .update({
          title,
          description,
          updated_by: userName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);
    },

    addTask: async ({ id, title, description, status }, userName) => {
      console.log("Adding task:", { title, description, status, userName });
      const { data, error } = await supabase.from("tasks").insert([
        {
          id,
          title,
          description,
          status,
          order_index: Date.now(),
          created_by: userName,
        },
      ]);
      console.log("Add task result:", { data, error });
    },
  };
});
