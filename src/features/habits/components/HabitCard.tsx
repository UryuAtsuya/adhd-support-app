'use client';

import { Habit } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

type HabitCardProps = {
    habit: Habit;
    isCheckedToday: boolean;
    streak: number;
    onCheckIn: (habitId: string) => void;
    onEdit: (habit: Habit) => void;
    onDelete: (habitId: string) => void;
};

export function HabitCard({
    habit,
    isCheckedToday,
    streak,
    onCheckIn,
    onEdit,
    onDelete,
}: HabitCardProps) {
    return (
        <Card className={cn(
            'transition-all',
            isCheckedToday && 'border-success/70 bg-success/25'
        )}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <Checkbox
                            checked={isCheckedToday}
                            onCheckedChange={() => onCheckIn(habit.id)}
                            className="h-6 w-6 mt-1"
                        />

                        <div className="flex-1">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-lg">{habit.name}</h3>
                                {streak > 0 && (
                                    <Badge variant="secondary" className="flex items-center space-x-1">
                                        <Flame className="h-3 w-3 text-warning" />
                                        <span>{streak}日連続</span>
                                    </Badge>
                                )}
                            </div>

                            {habit.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    {habit.description}
                                </p>
                            )}

                            <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">
                                    {habit.frequency === 'daily' ? '毎日' : '週間'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit(habit)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(habit.id)}
                        >
                            <Trash2 className="h-4 w-4 text-destructive-foreground" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
