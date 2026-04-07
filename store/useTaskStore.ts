import { create } from "zustand";
import { Task, ColumnType } from "@/types/task";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

interface TaskState {
  tasks: Task[];

  addTask: ({
    title,
    description,
    status,
  }: {
    title: string;
    description: string;
    status: ColumnType;
  }) => Promise<void>;

  moveTask: (
    taskId: string,
    newColumn: ColumnType,
    newOrder: number
  ) => Promise<void>;

  updateTask: (
    taskId: string,
    title: string,
    description: string
  ) => Promise<void>;

  setTasks: (tasks: Task[]) => void;

  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => {
  // ✅ Supabase Realtime Listener
  supabase
    .channel("tasks-realtime")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "tasks",
      },
      async () => {
        console.log("Realtime update received");

        const { data } = await supabase.from("tasks").select("*");

        set({ tasks: data || [] });
      }
    )
    .subscribe();

  return {
    tasks: [],

    setTasks: (tasks) => set({ tasks }),

    // ✅ Add Task
    addTask: async ({ title, description, status }) => {
      const newTask = {
        id: uuidv4(),

        title,

        description,

        status,

        order_index: Date.now(),
      };

      await supabase.from("tasks").insert([newTask]);
    },

    // ✅ Move Task
    moveTask: async (taskId, newStatus, newOrder) => {
      // Optimistic UI
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                order_index: newOrder,
              }
            : task
        ),
      }));

      await supabase
        .from("tasks")
        .update({
          status: newStatus,

          order_index: newOrder,
        })
        .eq("id", taskId);
    },

    // ✅ Update Task
    updateTask: async (taskId, title, description) => {
      await supabase
        .from("tasks")
        .update({
          title,

          description,
        })
        .eq("id", taskId);
    },

    // ✅ Fetch Tasks
    fetchTasks: async () => {
      const { data, error } = await supabase.from("tasks").select("*");

      if (error) {
        console.error("Error fetching tasks:", error);

        return;
      }

      set({ tasks: data || [] });
    },
  };
});
