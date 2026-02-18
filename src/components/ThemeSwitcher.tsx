'use client';

import { useThemeStore, themes, type ThemeName } from '@/stores/themeStore';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export function ThemeSwitcher() {
    const { currentTheme, setTheme } = useThemeStore();

    return (
        <div className="space-y-2">
            <Label htmlFor="theme-select">カラーテーマ</Label>
            <Select value={currentTheme} onValueChange={(value) => setTheme(value as ThemeName)}>
                <SelectTrigger id="theme-select">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {Object.entries(themes).map(([key, theme]) => (
                        <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                                <span>{theme.emoji}</span>
                                <span>{theme.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* テーマプレビュー */}
            <div className="flex gap-2 mt-4">
                {Object.entries(themes).map(([key, theme]) => (
                    <button
                        key={key}
                        onClick={() => setTheme(key as ThemeName)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${currentTheme === key
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:border-primary/50'
                            }`}
                    >
                        <div className="flex gap-1">
                            <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                            />
                            <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                            />
                            <div
                                className="w-6 h-6 rounded-full"
                                style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                            />
                        </div>
                        <span className="text-xs font-medium">
                            {theme.emoji} {theme.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
