'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Target, Timer, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/features/tasks/stores/taskStore';
import { useHabitStore } from '@/features/habits/stores/habitStore';
import { usePomodoroStore } from '@/features/timer/stores/pomodoroStore';
import { getMotivationalMessage } from '@/lib/utils';

export const BloomDashboard = () => {
    const { tasks, getTodayTasks } = useTaskStore();
    const { habits, habitLogs, getHabitStreak } = useHabitStore();
    const { timeLeft, isWorkTime, status, sessions } = usePomodoroStore();
    const todayTasks = getTodayTasks();
    const motivationalMessage = getMotivationalMessage();

    // Task stats
    const doneTasks = tasks.filter(t => t.status === 'done').length;
    const taskCompletionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

    // Habit stats
    const today = new Date().toISOString().split('T')[0];
    const todayHabitLogs = habitLogs.filter(l => l.date === today);
    const habitCompletionRate = habits.length > 0 ? Math.round((todayHabitLogs.length / habits.length) * 100) : 0;

    // Timer
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const todaySessions = sessions.filter((s) => {
        const sessionDate = s.started_at.split('T')[0];
        return sessionDate === today;
    });
    const todayMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);

    // Best streak
    const bestStreak = habits.length > 0
        ? Math.max(...habits.map(h => getHabitStreak(h.id)), 0)
        : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20 px-4">
            {/* Gentle Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4 pt-8"
            >
                <h2 className="font-serif text-2xl text-primary-foreground/60 italic">Bloom</h2>
                <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight">
                    Good morning,<br />
                    <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-8">you&apos;re doing great.</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                    {motivationalMessage}
                </p>
            </motion.div>

            {/* Live Focus Timer */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative flex justify-center py-6"
            >
                <Link href="/timer" className="group relative w-56 h-56 md:w-72 md:h-72 cursor-pointer">
                    <motion.div
                        animate={status === 'running' ? {
                            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "70% 30% 50% 50% / 30% 60% 40% 70%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                        } : {}}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className={`absolute inset-0 backdrop-blur-3xl shadow-xl shadow-primary/5 rounded-full transition-colors duration-500 ${isWorkTime ? 'bg-primary/30' : 'bg-accent/30'
                            }`}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.2em]">
                            {status === 'running' ? (isWorkTime ? 'Focusing' : 'Resting') : 'Focus Timer'}
                        </span>
                        <span className="font-serif text-4xl md:text-5xl text-foreground tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-xs text-muted-foreground italic group-hover:text-accent transition-colors">
                            {status === 'running' ? 'Tap to control →' : 'Tap to start →'}
                        </span>
                    </div>
                </Link>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                <Card className="border-none bg-primary/10 shadow-none rounded-2xl">
                    <CardContent className="p-5 text-center">
                        <CheckCircle2 className="w-5 h-5 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-serif text-foreground">{taskCompletionRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">タスク完了率</p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-accent/10 shadow-none rounded-2xl">
                    <CardContent className="p-5 text-center">
                        <Target className="w-5 h-5 text-accent mx-auto mb-2" />
                        <div className="text-2xl font-serif text-foreground">{habitCompletionRate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">習慣達成率</p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-secondary/15 shadow-none rounded-2xl">
                    <CardContent className="p-5 text-center">
                        <Timer className="w-5 h-5 text-secondary-foreground/60 mx-auto mb-2" />
                        <div className="text-2xl font-serif text-foreground">{todayMinutes}m</div>
                        <p className="text-xs text-muted-foreground mt-1">今日の集中</p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-warning/15 shadow-none rounded-2xl">
                    <CardContent className="p-5 text-center">
                        <Sparkles className="w-5 h-5 text-warning mx-auto mb-2" />
                        <div className="text-2xl font-serif text-foreground">{bestStreak}d</div>
                        <p className="text-xs text-muted-foreground mt-1">最長連続</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Small Wins Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
                        Small Wins <Sparkles className="w-5 h-5 text-accent" />
                    </h3>
                    <Link href="/tasks" className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid gap-3">
                    {todayTasks.slice(0, 3).map((task, idx) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                            <Card className="border border-border/60 bg-card/90 hover:bg-card transition-all cursor-pointer group shadow-sm">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full border-2 border-accent/30 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-colors">
                                        {task.status === 'done' && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                                    </div>
                                    <span className={`text-lg transition-colors ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground font-medium'}`}>
                                        {task.title}
                                    </span>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                    {todayTasks.length === 0 && (
                        <Card className="border border-border/40 bg-card/50">
                            <CardContent className="text-center py-10">
                                <p className="text-muted-foreground italic mb-4">No tasks today. Take it easy.</p>
                                <Link href="/tasks">
                                    <Button variant="outline" size="sm">
                                        タスクを追加 <ArrowRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};
