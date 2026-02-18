import { create } from 'zustand';
import { Habit, HabitLog, CreateHabitInput, UpdateHabitInput } from '@/types';

type HabitStore = {
    habits: Habit[];
    habitLogs: HabitLog[];
    isLoading: boolean;
    error: string | null;

    // Actions
    addHabit: (habit: CreateHabitInput) => void;
    updateHabit: (id: string, updates: UpdateHabitInput) => void;
    deleteHabit: (id: string) => void;
    checkInHabit: (habitId: string, date?: string) => void;
    getHabitStreak: (habitId: string) => number;
    getHabitLogsForDate: (habitId: string, date: string) => HabitLog[];
    getTodayHabits: () => Habit[];
};

// Mock data
const mockHabits: Habit[] = [
    {
        id: '1',
        user_id: 'mock-user',
        name: '朝のストレッチ',
        description: '10分間のストレッチ',
        frequency: 'daily',
        target_days: [1, 2, 3, 4, 5, 6, 7],
        color: '#3B82F6',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: '2',
        user_id: 'mock-user',
        name: '読書',
        description: '30分間の読書',
        frequency: 'daily',
        target_days: [1, 2, 3, 4, 5, 6, 7],
        color: '#10B981',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

const mockHabitLogs: HabitLog[] = [
    {
        id: '1',
        habit_id: '1',
        user_id: 'mock-user',
        completed_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
    },
];

export const useHabitStore = create<HabitStore>((set, get) => ({
    habits: mockHabits,
    habitLogs: mockHabitLogs,
    isLoading: false,
    error: null,

    addHabit: (habitInput: CreateHabitInput) => {
        const newHabit: Habit = {
            id: Date.now().toString(),
            user_id: 'mock-user',
            ...habitInput,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        set((state) => ({
            habits: [...state.habits, newHabit],
        }));
    },

    updateHabit: (id: string, updates: Partial<Habit>) => {
        set((state) => ({
            habits: state.habits.map((habit) =>
                habit.id === id
                    ? { ...habit, ...updates, updated_at: new Date().toISOString() }
                    : habit
            ),
        }));
    },

    deleteHabit: (id: string) => {
        set((state) => ({
            habits: state.habits.filter((habit) => habit.id !== id),
            habitLogs: state.habitLogs.filter((log) => log.habit_id !== id),
        }));
    },

    checkInHabit: (habitId: string, date?: string) => {
        const checkDate = date || new Date().toISOString().split('T')[0];
        const existingLog = get().habitLogs.find(
            (log) => log.habit_id === habitId && log.date === checkDate
        );

        if (existingLog) {
            // Remove check-in
            set((state) => ({
                habitLogs: state.habitLogs.filter((log) => log.id !== existingLog.id),
            }));
        } else {
            // Add check-in
            const newLog: HabitLog = {
                id: Date.now().toString(),
                habit_id: habitId,
                user_id: 'mock-user',
                completed_at: new Date().toISOString(),
                date: checkDate,
            };

            set((state) => ({
                habitLogs: [...state.habitLogs, newLog],
            }));
        }
    },

    getHabitStreak: (habitId: string) => {
        const logs = get().habitLogs
            .filter((log) => log.habit_id === habitId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (logs.length === 0) return 0;

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < logs.length; i++) {
            const logDate = new Date(logs[i].date);
            logDate.setHours(0, 0, 0, 0);

            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            expectedDate.setHours(0, 0, 0, 0);

            if (logDate.getTime() === expectedDate.getTime()) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    },

    getHabitLogsForDate: (habitId: string, date: string) => {
        return get().habitLogs.filter(
            (log) => log.habit_id === habitId && log.date === date
        );
    },

    getTodayHabits: () => {
        const today = new Date().getDay() || 7; // 0 (Sunday) -> 7
        return get().habits.filter((habit) =>
            habit.target_days?.includes(today)
        );
    },
}));
