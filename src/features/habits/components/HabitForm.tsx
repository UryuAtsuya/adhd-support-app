'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateHabitInput, Habit } from '@/types';

const HABIT_COLORS = [
    { value: '#3B82F6', label: '💙 ブルー' },
    { value: '#10B981', label: '💚 グリーン' },
    { value: '#F59E0B', label: '💛 イエロー' },
    { value: '#EF4444', label: '❤️ レッド' },
    { value: '#8B5CF6', label: '💜 パープル' },
    { value: '#EC4899', label: '💗 ピンク' },
];

const habitSchema = z.object({
    name: z.string().min(1, '習慣名は必須です').max(50, '習慣名は50文字以内で入力してください'),
    description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
    frequency: z.enum(['daily', 'weekly']),
    color: z.string().min(1),
});

type HabitFormData = z.infer<typeof habitSchema>;

type HabitFormProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (habit: CreateHabitInput) => void;
    initialData?: Habit;
    mode?: 'create' | 'edit';
};

export function HabitForm({ open, onOpenChange, onSubmit, initialData, mode = 'create' }: HabitFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: initialData
            ? {
                name: initialData.name,
                description: initialData.description || '',
                frequency: initialData.frequency,
                color: initialData.color,
            }
            : {
                name: '',
                description: '',
                frequency: 'daily',
                color: '#3B82F6',
            },
    });

    const frequency = watch('frequency');
    const color = watch('color');

    const handleFormSubmit = (data: HabitFormData) => {
        const habitData: CreateHabitInput = {
            name: data.name,
            description: data.description || undefined,
            frequency: data.frequency,
            target_days: data.frequency === 'daily' ? [1, 2, 3, 4, 5, 6, 7] : [1, 3, 5],
            color: data.color,
        };

        onSubmit(habitData);
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-serif">
                        {mode === 'create' ? '🌱 新しい習慣' : '📝 習慣を編集'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? '小さな習慣から始めましょう'
                            : '習慣の内容を変更してください'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">習慣名 <span className="text-accent">*</span></Label>
                        <Input
                            id="name"
                            placeholder="例: 朝のストレッチ"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-xs text-destructive-foreground font-medium">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-semibold text-foreground">説明</Label>
                        <Textarea
                            id="description"
                            placeholder="習慣の詳細を入力（任意）"
                            rows={2}
                            {...register('description')}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive-foreground font-medium">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="frequency" className="text-sm font-semibold text-foreground">頻度</Label>
                            <Select
                                value={frequency}
                                onValueChange={(value) => setValue('frequency', value as 'daily' | 'weekly')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">📅 毎日</SelectItem>
                                    <SelectItem value="weekly">📆 週間</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="color" className="text-sm font-semibold text-foreground">カラー</Label>
                            <Select
                                value={color}
                                onValueChange={(value) => setValue('color', value)}
                            >
                                <SelectTrigger>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                                        <SelectValue />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    {HABIT_COLORS.map((c) => (
                                        <SelectItem key={c.value} value={c.value}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: c.value }} />
                                                <span>{c.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            キャンセル
                        </Button>
                        <Button type="submit">
                            {mode === 'create' ? '追加する' : '更新する'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
