'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTaskStore } from '@/features/tasks/stores/taskStore';
import { getMotivationalMessage } from '@/lib/utils';

export const BloomDashboard = () => {
    const { getTodayTasks } = useTaskStore();
    const todayTasks = getTodayTasks();
    const motivationalMessage = getMotivationalMessage();

    return (
        <div className="max-w-4xl mx-auto space-y-10 pb-20">
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

            {/* Organic Focus Timer Preview */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative flex justify-center py-10"
            >
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <motion.div
                        animate={{
                            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "70% 30% 50% 50% / 30% 60% 40% 70%", "40% 60% 70% 30% / 40% 50% 60% 50%"],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-primary/30 backdrop-blur-3xl shadow-xl shadow-primary/5"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                        <span className="text-sm font-medium text-primary-foreground/60 uppercase tracking-widest">Focus Timer</span>
                        <span className="font-serif text-4xl md:text-5xl text-foreground">00:20:45</span>
                        <span className="text-xs text-primary-foreground/40 italic">Focusing...</span>
                    </div>
                </div>
            </motion.div>

            {/* Small Wins Section */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-serif text-2xl text-foreground flex items-center gap-2">
                        Small Wins <Sparkles className="w-5 h-5 text-accent" />
                    </h3>
                    <button className="text-sm text-primary-foreground/60 hover:text-primary transition-colors">View All</button>
                </div>

                <div className="grid gap-4">
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
                        <p className="text-center py-10 text-muted-foreground italic">No tasks today. Take it easy.</p>
                    )}
                </div>
            </div>

            {/* Soft Navigation (Fixed Bottom) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-card/75 backdrop-blur-xl border border-border/60 rounded-full p-2 flex justify-around shadow-2xl shadow-primary/10">
                <button className="p-3 text-primary transition-transform active:scale-90"><User className="w-6 h-6" /></button>
                <button className="p-3 text-muted-foreground hover:text-primary transition-transform active:scale-90"><Calendar className="w-6 h-6" /></button>
                <button className="p-3 text-muted-foreground hover:text-primary transition-transform active:scale-90"><Users className="w-6 h-6" /></button>
                <button className="p-3 text-muted-foreground hover:text-primary transition-transform active:scale-90"><User className="w-6 h-6" /></button>
            </div>
        </div>
    );
};
