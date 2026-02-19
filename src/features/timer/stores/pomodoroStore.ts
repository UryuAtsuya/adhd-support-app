import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PomodoroSession } from '@/types';
import { POMODORO_DEFAULTS } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';

type TimerStatus = 'idle' | 'running' | 'paused' | 'break';

type PomodoroStore = {
  status: TimerStatus;
  timeLeft: number;
  currentSession: number;
  isWorkTime: boolean;

  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;

  sessions: PomodoroSession[];
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  completeSession: () => void;
  updateSettings: (settings: Partial<{
    workDuration: number;
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
  }>) => void;
  tick: () => void;
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

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      status: 'idle',
      timeLeft: POMODORO_DEFAULTS.FOCUS_TIME * 60,
      currentSession: 0,
      isWorkTime: true,

      workDuration: POMODORO_DEFAULTS.FOCUS_TIME,
      shortBreakDuration: POMODORO_DEFAULTS.SHORT_BREAK,
      longBreakDuration: POMODORO_DEFAULTS.LONG_BREAK,
      sessionsUntilLongBreak: POMODORO_DEFAULTS.SESSIONS_UNTIL_LONG_BREAK,

      sessions: [],
      isLoading: false,
      isInitialized: false,
      error: null,

      initialize: async () => {
        if (get().isInitialized) return;

        set({ isLoading: true, error: null });

        const userId = await getCurrentUserId();
        if (!userId) {
          set({ isLoading: false, isInitialized: true, sessions: [] });
          return;
        }

        const supabase = createClient();
        const { data, error } = await supabase
          .from('pomodoro_sessions')
          .select('*')
          .eq('user_id', userId)
          .order('started_at', { ascending: false })
          .limit(1000);

        if (error) {
          set({ isLoading: false, isInitialized: true, error: error.message });
          return;
        }

        set({
          sessions: (data ?? []) as PomodoroSession[],
          isLoading: false,
          isInitialized: true,
          error: null,
        });
      },

      startTimer: () => {
        const state = get();
        if (state.status === 'idle' || state.status === 'paused') {
          set({ status: 'running' });
        }
      },

      pauseTimer: () => {
        set({ status: 'paused' });
      },

      resetTimer: () => {
        const state = get();
        const duration = state.isWorkTime
          ? state.workDuration
          : state.currentSession % state.sessionsUntilLongBreak === 0 && state.currentSession > 0
            ? state.longBreakDuration
            : state.shortBreakDuration;

        set({
          status: 'idle',
          timeLeft: duration * 60,
        });
      },

      skipSession: () => {
        const state = get();
        const newIsWorkTime = !state.isWorkTime;
        const newSession = newIsWorkTime ? state.currentSession + 1 : state.currentSession;

        let duration: number;
        if (newIsWorkTime) {
          duration = state.workDuration;
        } else {
          const isLongBreak = newSession % state.sessionsUntilLongBreak === 0 && newSession > 0;
          duration = isLongBreak ? state.longBreakDuration : state.shortBreakDuration;
        }

        set({
          status: 'idle',
          isWorkTime: newIsWorkTime,
          currentSession: newSession,
          timeLeft: duration * 60,
        });
      },

      completeSession: () => {
        const state = get();

        if (state.isWorkTime) {
          const now = new Date().toISOString();

          void (async () => {
            const userId = await getCurrentUserId();
            if (!userId) return;

            const sessionInsert = {
              user_id: userId,
              duration: state.workDuration,
              completed: true,
              started_at: now,
              ended_at: now,
              task_id: null,
            };

            const supabase = createClient();
            const { data, error } = await supabase
              .from('pomodoro_sessions')
              .insert(sessionInsert)
              .select('*')
              .single();

            if (error) {
              set({ error: error.message });
              return;
            }

            set((current) => ({
              sessions: [data as PomodoroSession, ...current.sessions],
              error: null,
            }));
          })();
        }

        get().skipSession();
      },

      updateSettings: (settings) => {
        const state = get();
        const newSettings = { ...state, ...settings };

        if (state.status === 'idle') {
          const duration = state.isWorkTime
            ? newSettings.workDuration
            : state.currentSession % newSettings.sessionsUntilLongBreak === 0 && state.currentSession > 0
              ? newSettings.longBreakDuration
              : newSettings.shortBreakDuration;

          set({
            ...settings,
            timeLeft: duration * 60,
          });
        } else {
          set(settings);
        }
      },

      tick: () => {
        const state = get();
        if (state.status !== 'running') return;

        if (state.timeLeft > 0) {
          set({ timeLeft: state.timeLeft - 1 });
        } else {
          get().completeSession();
        }
      },
    }),
    {
      name: 'adhd-app-pomodoro-settings',
      partialize: (state) => ({
        workDuration: state.workDuration,
        shortBreakDuration: state.shortBreakDuration,
        longBreakDuration: state.longBreakDuration,
        sessionsUntilLongBreak: state.sessionsUntilLongBreak,
      }),
    }
  )
);
