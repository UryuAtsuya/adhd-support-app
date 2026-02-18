import { Priority, TaskStatus, HabitFrequency } from '@/lib/constants';

/**
 * ユーザー型
 */
export type User = {
    id: string;
    email: string;
    name?: string;
    created_at: string;
    updated_at: string;
};

/**
 * サブタスク型
 */
export type Subtask = {
    id: string;
    title: string;
    completed: boolean;
};

/**
 * タスク型
 */
export type Task = {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    priority: Priority;
    status: TaskStatus;
    due_date?: string;
    subtasks?: Subtask[];
    created_at: string;
    updated_at: string;
};

/**
 * タスク作成用の型
 */
export type CreateTaskInput = Omit<
    Task,
    'id' | 'user_id' | 'created_at' | 'updated_at'
>;

/**
 * タスク更新用の型
 */
export type UpdateTaskInput = Partial<CreateTaskInput>;

/**
 * 習慣型
 */
export type Habit = {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    frequency: HabitFrequency;
    target_days: number[]; // [1, 2, 3, 4, 5, 6, 7] (1: Mon, ..., 7: Sun)
    color: string;
    target_count?: number; // 週3回など
    reminder_time?: string;
    created_at: string;
    updated_at: string;
};

/**
 * 習慣作成用の型
 */
export type CreateHabitInput = Omit<
    Habit,
    'id' | 'user_id' | 'created_at' | 'updated_at'
>;

/**
 * 習慣更新用の型
 */
export type UpdateHabitInput = Partial<CreateHabitInput>;

/**
 * 習慣ログ型
 */
export type HabitLog = {
    id: string;
    habit_id: string;
    user_id: string;
    completed_at: string;
    date: string; // YYYY-MM-DD
};

/**
 * ポモドーロセッション型
 */
export type PomodoroSession = {
    id: string;
    user_id: string;
    task_id?: string;
    duration: number; // 分
    completed: boolean;
    started_at: string;
    ended_at?: string;
};

/**
 * ダッシュボード統計型
 */
export type DashboardStats = {
    totalTasks: number;
    completedTasks: number;
    todayTasks: number;
    overdueTasks: number;
    completionRate: number;
    weeklyProgress: number[];
};
