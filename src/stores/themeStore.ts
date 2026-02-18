import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// テーマ定義
export const themes = {
    pastel: {
        name: 'Bloom',
        emoji: '🌿',
        colors: {
            background: '34 45% 98%',
            foreground: '18 18% 28%',
            card: '0 0% 100%',
            'card-foreground': '18 18% 28%',
            popover: '0 0% 100%',
            'popover-foreground': '18 18% 28%',
            muted: '24 35% 95%',
            'muted-foreground': '24 12% 45%',
            primary: '104 38% 82%',
            'primary-foreground': '104 26% 27%',
            accent: '346 58% 85%',
            'accent-foreground': '346 40% 30%',
            secondary: '279 42% 87%',
            'secondary-foreground': '279 30% 31%',
            success: '140 45% 84%',
            warning: '42 88% 82%',
            destructive: '0 74% 85%',
            'destructive-foreground': '0 48% 30%',
            border: '20 25% 88%',
            input: '20 30% 96%',
            ring: '104 35% 74%',
        },
    },
    warm: {
        name: 'ウォーム',
        emoji: '🌞',
        colors: {
            background: '30 70% 97%',
            foreground: '24 28% 26%',
            card: '34 80% 99%',
            'card-foreground': '24 28% 26%',
            popover: '34 80% 99%',
            'popover-foreground': '24 28% 26%',
            muted: '35 62% 93%',
            'muted-foreground': '25 18% 44%',
            primary: '24 82% 74%',
            'primary-foreground': '24 58% 24%',
            accent: '8 90% 82%',
            'accent-foreground': '8 52% 29%',
            secondary: '43 86% 82%',
            'secondary-foreground': '39 50% 27%',
            success: '122 42% 81%',
            warning: '36 100% 78%',
            destructive: '2 86% 82%',
            'destructive-foreground': '2 56% 30%',
            border: '30 42% 84%',
            input: '30 55% 94%',
            ring: '24 70% 67%',
        },
    },
    cool: {
        name: 'クール',
        emoji: '❄️',
        colors: {
            background: '210 55% 97%',
            foreground: '216 28% 25%',
            card: '0 0% 100%',
            'card-foreground': '216 28% 25%',
            popover: '0 0% 100%',
            'popover-foreground': '216 28% 25%',
            muted: '208 46% 93%',
            'muted-foreground': '214 16% 43%',
            primary: '210 75% 78%',
            'primary-foreground': '214 56% 24%',
            accent: '186 70% 82%',
            'accent-foreground': '191 48% 25%',
            secondary: '258 56% 85%',
            'secondary-foreground': '255 35% 31%',
            success: '164 52% 80%',
            warning: '50 86% 82%',
            destructive: '352 74% 84%',
            'destructive-foreground': '352 50% 30%',
            border: '208 35% 84%',
            input: '210 45% 94%',
            ring: '208 68% 68%',
        },
    },
} as const;

export type ThemeName = keyof typeof themes;

// CSS変数にテーマを適用
function applyTheme(themeName: ThemeName) {
    const theme = themes[themeName];
    if (!theme) return;

    Object.entries(theme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--${key}`, value);
    });
}

// Store定義
type ThemeStore = {
    currentTheme: ThemeName;
    setTheme: (theme: ThemeName) => void;
    initTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
    persist(
        (set, get) => ({
            currentTheme: 'pastel',

            setTheme: (theme: ThemeName) => {
                set({ currentTheme: theme });
                applyTheme(theme);
            },

            initTheme: () => {
                const { currentTheme } = get();
                applyTheme(currentTheme);
            },
        }),
        {
            name: 'adhd-app-theme',
        }
    )
);
