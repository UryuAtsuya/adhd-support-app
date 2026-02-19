import { create } from 'zustand';
import { CreateTaskInput, Task, UpdateTaskInput } from '@/types';
import { createClient } from '@/lib/supabase/client';

type TaskStore = {
  tasks: Task[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  addTask: (task: CreateTaskInput) => void;
  updateTask: (id: string, updates: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  getTodayTasks: () => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getOverdueTasks: () => Task[];
};

const getCurrentUserId = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user.id;
};

export const useTaskStore = create<TaskStore>()((set, get) => ({
  tasks: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    const userId = await getCurrentUserId();
    if (!userId) {
      set({ isLoading: false, isInitialized: true, tasks: [] });
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      set({ isLoading: false, isInitialized: true, error: error.message });
      return;
    }

    set({
      tasks: (data ?? []) as Task[],
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  addTask: (taskInput) => {
    void (async () => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          title: taskInput.title,
          description: taskInput.description ?? null,
          priority: taskInput.priority,
          status: taskInput.status,
          due_date: taskInput.due_date ?? null,
          subtasks: taskInput.subtasks ?? [],
        })
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({ tasks: [data as Task, ...state.tasks], error: null }));
    })();
  },

  updateTask: (id, updates) => {
    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description ?? null,
          priority: updates.priority,
          status: updates.status,
          due_date: updates.due_date ?? null,
          subtasks: updates.subtasks,
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({
        tasks: state.tasks.map((task) => (task.id === id ? (data as Task) : task)),
        error: null,
      }));
    })();
  },

  deleteTask: (id) => {
    void (async () => {
      const supabase = createClient();
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id), error: null }));
    })();
  },

  toggleTaskStatus: (id) => {
    const task = get().tasks.find((item) => item.id === id);
    if (!task) return;

    const nextStatus = task.status === 'done' ? 'todo' : 'done';

    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tasks')
        .update({ status: nextStatus })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({
        tasks: state.tasks.map((item) => (item.id === id ? (data as Task) : item)),
        error: null,
      }));
    })();
  },

  getTodayTasks: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().tasks.filter((task) => task.due_date === today);
  },

  getTasksByStatus: (status) => {
    return get().tasks.filter((task) => task.status === status);
  },

  getOverdueTasks: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return get().tasks.filter((task) => {
      if (!task.due_date || task.status === 'done') return false;
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < today;
    });
  },
}));
