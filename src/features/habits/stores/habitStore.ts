import { create } from 'zustand';
import { CreateHabitInput, Habit, HabitLog, UpdateHabitInput } from '@/types';
import { createClient } from '@/lib/supabase/client';

type HabitStore = {
  habits: Habit[];
  habitLogs: HabitLog[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  addHabit: (habit: CreateHabitInput) => void;
  updateHabit: (id: string, updates: UpdateHabitInput) => void;
  deleteHabit: (id: string) => void;
  checkInHabit: (habitId: string, date?: string) => void;
  getHabitStreak: (habitId: string) => number;
  getHabitLogsForDate: (habitId: string, date: string) => HabitLog[];
  getTodayHabits: () => Habit[];
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

export const useHabitStore = create<HabitStore>()((set, get) => ({
  habits: [],
  habitLogs: [],
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (get().isInitialized) return;

    set({ isLoading: true, error: null });

    const userId = await getCurrentUserId();
    if (!userId) {
      set({ isLoading: false, isInitialized: true, habits: [], habitLogs: [] });
      return;
    }

    const supabase = createClient();
    const [habitsResult, logsResult] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('habit_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
    ]);

    if (habitsResult.error) {
      set({ isLoading: false, isInitialized: true, error: habitsResult.error.message });
      return;
    }

    if (logsResult.error) {
      set({ isLoading: false, isInitialized: true, error: logsResult.error.message });
      return;
    }

    set({
      habits: (habitsResult.data ?? []) as Habit[],
      habitLogs: (logsResult.data ?? []).map((log) => ({
        ...(log as HabitLog),
        date: typeof log.date === 'string' ? log.date : new Date(log.date).toISOString().split('T')[0],
      })),
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  addHabit: (habitInput) => {
    void (async () => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const supabase = createClient();
      const { data, error } = await supabase
        .from('habits')
        .insert({
          user_id: userId,
          name: habitInput.name,
          description: habitInput.description ?? null,
          frequency: habitInput.frequency,
          target_days: habitInput.target_days,
          color: habitInput.color,
          target_count: habitInput.target_count ?? null,
          reminder_time: habitInput.reminder_time ?? null,
        })
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({ habits: [data as Habit, ...state.habits], error: null }));
    })();
  },

  updateHabit: (id, updates) => {
    void (async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('habits')
        .update({
          name: updates.name,
          description: updates.description ?? null,
          frequency: updates.frequency,
          target_days: updates.target_days,
          color: updates.color,
          target_count: updates.target_count ?? null,
          reminder_time: updates.reminder_time ?? null,
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({
        habits: state.habits.map((habit) => (habit.id === id ? (data as Habit) : habit)),
        error: null,
      }));
    })();
  },

  deleteHabit: (id) => {
    void (async () => {
      const supabase = createClient();
      const { error } = await supabase.from('habits').delete().eq('id', id);

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({
        habits: state.habits.filter((habit) => habit.id !== id),
        habitLogs: state.habitLogs.filter((log) => log.habit_id !== id),
        error: null,
      }));
    })();
  },

  checkInHabit: (habitId, date) => {
    void (async () => {
      const userId = await getCurrentUserId();
      if (!userId) return;

      const checkDate = date || new Date().toISOString().split('T')[0];
      const existingLog = get().habitLogs.find(
        (log) => log.habit_id === habitId && log.date === checkDate
      );
      const supabase = createClient();

      if (existingLog) {
        const { error } = await supabase.from('habit_logs').delete().eq('id', existingLog.id);

        if (error) {
          set({ error: error.message });
          return;
        }

        set((state) => ({
          habitLogs: state.habitLogs.filter((log) => log.id !== existingLog.id),
          error: null,
        }));
        return;
      }

      const { data, error } = await supabase
        .from('habit_logs')
        .insert({
          habit_id: habitId,
          user_id: userId,
          date: checkDate,
          completed_at: new Date().toISOString(),
        })
        .select('*')
        .single();

      if (error) {
        set({ error: error.message });
        return;
      }

      set((state) => ({
        habitLogs: [{ ...(data as HabitLog), date: checkDate }, ...state.habitLogs],
        error: null,
      }));
    })();
  },

  getHabitStreak: (habitId) => {
    const logs = get()
      .habitLogs
      .filter((log) => log.habit_id === habitId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (logs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < logs.length; i += 1) {
      const logDate = new Date(logs[i].date);
      logDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === expectedDate.getTime()) {
        streak += 1;
      } else {
        break;
      }
    }

    return streak;
  },

  getHabitLogsForDate: (habitId, date) => {
    return get().habitLogs.filter((log) => log.habit_id === habitId && log.date === date);
  },

  getTodayHabits: () => {
    const today = new Date().getDay() || 7;
    return get().habits.filter((habit) => habit.target_days?.includes(today));
  },
}));
