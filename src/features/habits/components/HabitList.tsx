'use client';

import { useState } from 'react';
import { Habit, CreateHabitInput } from '@/types';
import { useHabitStore } from '../stores/habitStore';
import { HabitCard } from './HabitCard';
import { HabitForm } from './HabitForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Target, TrendingUp, Calendar } from 'lucide-react';

export function HabitList() {
    const {
        habits,
        habitLogs,
        addHabit,
        updateHabit,
        checkInHabit,
        getHabitStreak,
        getHabitLogsForDate,
        deleteHabit,
    } = useHabitStore();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

    const today = new Date().toISOString().split('T')[0];
    const todayLogs = habitLogs.filter((log) => log.date === today);
    const completedToday = todayLogs.length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

    const handleAddHabit = (habitData: CreateHabitInput) => {
        addHabit(habitData);
    };

    const handleEditHabit = (habitData: CreateHabitInput) => {
        if (editingHabit) {
            updateHabit(editingHabit.id, habitData);
            setEditingHabit(undefined);
        }
    };

    const handleOpenEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingHabit(undefined);
    };

    return (
        <div className="space-y-12 pb-20 max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10">
                <div className="space-y-2">
                    <h2 className="font-serif text-4xl text-foreground tracking-tight">Daily Rituals</h2>
                    <p className="text-muted-foreground text-lg italic">
                        Small steps, blooming everyday.
                    </p>
                </div>
                <Button
                    onClick={() => setIsFormOpen(true)}
                    className="rounded-full bg-accent hover:bg-accent/80 text-accent-foreground px-8 py-6 text-lg h-auto shadow-lg shadow-accent/10 border-none transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    New Ritual
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-none bg-primary/10 shadow-none rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60">Today&apos;s Bloom</CardTitle>
                        <Target className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-serif text-foreground">
                            {completedToday} / {totalHabits}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                            {completionRate}% Completed
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-accent/10 shadow-none rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-widest text-accent-foreground/60">Registered</CardTitle>
                        <Calendar className="h-4 w-4 text-accent" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-serif text-foreground">{totalHabits}</div>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                            Rituals in progress
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none bg-secondary/20 shadow-none rounded-3xl overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium uppercase tracking-widest text-secondary-foreground/60">Longest Streak</CardTitle>
                        <TrendingUp className="h-4 w-4 text-secondary-foreground/60" />
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-4xl font-serif text-foreground">
                            {Math.max(...habits.map((h) => getHabitStreak(h.id)), 0)}d
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 italic">
                            Continuous growth
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Habits List */}
            <div className="space-y-4">
                {habits.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-12">
                            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground mb-4">
                                まだ習慣が登録されていません
                            </p>
                            <Button onClick={() => setIsFormOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                最初の習慣を追加
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    habits.map((habit) => {
                        const isCheckedToday = getHabitLogsForDate(habit.id, today).length > 0;
                        const streak = getHabitStreak(habit.id);

                        return (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                isCheckedToday={isCheckedToday}
                                streak={streak}
                                onCheckIn={checkInHabit}
                                onEdit={handleOpenEdit}
                                onDelete={deleteHabit}
                            />
                        );
                    })
                )}
            </div>

            {/* Tips Section */}
            <Card className="border border-border/50 bg-card/70 rounded-3xl p-8 shadow-sm">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="font-serif text-2xl text-foreground">Gentle Reminders</CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 grid md:grid-cols-2 gap-4 text-muted-foreground italic">
                    <p>• Start small, let it grow naturally.</p>
                    <p>• Same time, same pace, everyday.</p>
                    <p>• Missed a day? No worries, just bloom again.</p>
                    <p>• Focus on the joy of the ritual itself.</p>
                </CardContent>
            </Card>

            {/* Habit Form Dialog */}
            <HabitForm
                open={isFormOpen}
                onOpenChange={handleCloseForm}
                onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
                initialData={editingHabit}
                mode={editingHabit ? 'edit' : 'create'}
            />
        </div>
    );
}
