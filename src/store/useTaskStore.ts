import { create } from "zustand";
import { generateTasks } from "../data/generateTasks";

type Task = {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
};

type Filter = {
  status: string[];
  priority: string[];
};

type Store = {
  tasks: Task[];
  filters: Filter;
  setFilters: (f: Filter) => void;
  moveTask: (id: string, status: string) => void;
};

export const useTaskStore = create<Store>((set) => ({
  tasks: generateTasks(500),

  filters: {
    status: [],
    priority: [],
  },

  setFilters: (filters) => set({ filters }),

  moveTask: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
}));