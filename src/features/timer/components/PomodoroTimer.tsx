'use client';

import { useEffect } from 'react';
import { usePomodoroStore } from '../stores/pomodoroStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PomodoroTimer() {
    const {
        status,
        timeLeft,
        currentSession,
        isWorkTime,
        workDuration,
        sessions,
        startTimer,
        pauseTimer,
        resetTimer,
        skipSession,
        tick,
    } = usePomodoroStore();

    // Timer tick effect
    useEffect(() => {
        if (status === 'running') {
            const interval = setInterval(() => {
                tick();
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status, tick]);

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate progress percentage
    const totalSeconds = isWorkTime
        ? workDuration * 60
        : (currentSession % 4 === 0 && currentSession > 0)
            ? 15 * 60  // long break
            : 5 * 60;  // short break

    const todaySessions = sessions.filter((session) => {
        const today = new Date().toISOString().split('T')[0];
        const sessionDate = session.started_at.split('T')[0];
        return sessionDate === today;
    });

    const todayMinutes = todaySessions.reduce((sum, session) => sum + session.duration, 0);

    return (
        <div className="space-y-12 pb-20 max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center space-y-2 pt-10">
                <h2 className="font-serif text-4xl text-foreground tracking-tight">Focus Bloom</h2>
                <p className="text-muted-foreground text-lg italic">
                    {isWorkTime ? 'Harvesting focus, moment by moment.' : 'Rest like a flower, gathering strength.'}
                </p>
            </div>

            {/* Timer Display */}
            <div className="relative flex justify-center py-10">
                <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
                    {/* Organic Background Shape (Brighter) */}
                    <div
                        className={cn(
                            "absolute inset-0 transition-all duration-1000 blur-2xl opacity-10",
                            isWorkTime ? "bg-primary" : "bg-accent"
                        )}
                        style={{
                            borderRadius: (status === 'running')
                                ? "40% 60% 70% 30% / 40% 50% 60% 50%"
                                : "50% 50% 50% 50% / 50% 50% 50% 50%"
                        }}
                    />

                    {/* Inner Circle / Glassmorphism (Brighter) */}
                    <Card className="w-full h-full rounded-full border border-border/50 bg-card/85 backdrop-blur-sm shadow-xl flex flex-col items-center justify-center">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
                            {isWorkTime ? 'Flow State' : 'Deep Rest'}
                        </span>
                        <div className="text-7xl md:text-8xl font-serif text-foreground tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                        </div>
                        <span className="text-sm italic text-muted-foreground mt-2">
                            Session {currentSession + 1}
                        </span>
                    </Card>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-14 w-14 rounded-full hover:bg-card shadow-sm border border-border/40 transition-all active:scale-95"
                        onClick={resetTimer}
                        disabled={status === 'idle' && timeLeft === totalSeconds}
                    >
                    <RotateCcw className="h-6 w-6 text-muted-foreground" />
                </Button>

                {status === 'running' ? (
                    <Button
                        size="lg"
                        className="h-20 w-20 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-lg border-none transition-all active:scale-90"
                        onClick={pauseTimer}
                    >
                        <Pause className="h-8 w-8" />
                    </Button>
                ) : (
                    <Button
                        size="lg"
                        className="h-20 w-20 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg border-none transition-all active:scale-90"
                        onClick={startTimer}
                    >
                        <Play className="h-8 w-8 ml-1" />
                    </Button>
                )}

                <Button
                    size="icon"
                    variant="ghost"
                    className="h-14 w-14 rounded-full hover:bg-card shadow-sm border border-border/40 transition-all active:scale-95"
                    onClick={skipSession}
                >
                    <SkipForward className="h-6 w-6 text-muted-foreground" />
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card className="border border-border/50 bg-primary/15 rounded-3xl p-6 shadow-sm">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Today&apos;s Focus</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-serif text-foreground">{todayMinutes}m</div>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Across {todaySessions.length} sessions
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-border/40 bg-secondary/15 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Completed</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-serif text-foreground">{sessions.length}</div>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Total flow sessions
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-border/40 bg-accent/15 backdrop-blur-sm rounded-3xl p-6 shadow-sm">
                    <CardHeader className="p-0 pb-2">
                        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Total Time</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="text-3xl font-serif text-foreground">{sessions.reduce((sum, s) => sum + s.duration, 0)}m</div>
                        <p className="text-xs text-muted-foreground mt-1 italic">
                            Life-time focus
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Affirmation Section */}
            <div className="text-center py-10 opacity-60 italic text-muted-foreground max-w-sm mx-auto">
                <p>
                    &ldquo;
                    {status === 'running' ? 'Focusing is an act of self-care. Take your time.' : 'Resting is just as important as growing. Well done.'}
                    &rdquo;
                </p>
            </div>
        </div>
    );
}
