import { create } from "zustand";
import { Task, ColumnType } from "@/types/task";
import { supabase } from "@/lib/supabase";
import Cookies from "js-cookie";

interface TaskState {
  tasks: Task[];
  notification: string | null;

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

  initRealtime: () => void;
}

let isRealtimeInitialized = false;

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  notification: null,

  setNotification: (msg) => set({ notification: msg }),

  // 🚀 REALTIME INIT

  initRealtime: () => {
    if (isRealtimeInitialized) return;

    isRealtimeInitialized = true;

    console.log("Realtime Initialized");

    // -------------------------
    // Broadcast Channel
    // -------------------------

    const notificationChannel = supabase.channel("board-notifications");

    notificationChannel
      .on("broadcast", { event: "task-moved" }, ({ payload }) => {
        const currentUser = Cookies.get("user-auth");

        const user = currentUser ? JSON.parse(currentUser) : null;

        const currentUserName = user?.name;

        // Ignore own message
        if (payload.sender === currentUserName) return;

        set({
          notification: payload.message,
        });
      })
      .subscribe();

    // -------------------------
    // Database Changes
    // -------------------------

    const dbChannel = supabase.channel("tasks-db-changes");

    dbChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
        },
        async () => {
          const { data } = await supabase.from("tasks").select("*");

          set({
            tasks: data || [],
          });
        }
      )
      .subscribe();
  },

  // -------------------------
  // API Calls
  // -------------------------

  fetchTasks: async () => {
    const res = await fetch("/api/tasks");

    const data = await res.json();

    set({ tasks: data });
  },

  moveTask: async (taskId, newStatus, newOrder, userName) => {
    // 1. Save a snapshot of the current tasks in case we need to roll back
    const previousTasks = get().tasks;

    // 2. Perform the Optimistic Update
    // We create a new array where the specific task is updated immediately
    const optimisticallyUpdatedTasks = previousTasks.map((task) =>
      task.id === taskId
        ? { ...task, status: newStatus, order_index: newOrder }
        : task
    );

    // Update the local state instantly
    set({ tasks: optimisticallyUpdatedTasks });

    try {
      const res = await fetch("/api/tasks/move", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          newStatus,
          newOrder,
          userName,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to move task on server");
      }

      // Optional: You can update the state again with the actual response
      // if the server returns precise order_indices, but usually not needed.
    } catch (error) {
      // 3. If the API fails, roll back to the previous state
      console.error("Move task failed:", error);
      set({
        tasks: previousTasks,
        notification: "Connection error: Could not save task position.",
      });
    }
  },

  updateTask: async (taskId, title, description, userName) => {
    await fetch("/api/tasks/update", {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        taskId,
        title,
        description,
        userName,
      }),
    });
  },

  addTask: async (data, userName) => {
    await fetch("/api/tasks", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        ...data,
        userName,
      }),
    });
  },
}));
