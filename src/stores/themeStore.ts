import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// テーマ定義（hex値 - Tailwind v4 @theme inline 互換）
export const themes = {
    pastel: {
        name: 'Bloom',
        emoji: '🌿',
        colors: {
            '--color-background': '#faf8f5',
            '--color-foreground': '#3d3229',
            '--color-card': '#ffffff',
            '--color-card-foreground': '#3d3229',
            '--color-popover': '#ffffff',
            '--color-popover-foreground': '#3d3229',
            '--color-muted': '#f4efe8',
            '--color-muted-foreground': '#8c7d6d',
            '--color-primary': '#b5d6a7',
            '--color-primary-foreground': '#2d4a20',
            '--color-accent': '#e8a4b8',
            '--color-accent-foreground': '#5c2234',
            '--color-secondary': '#cdb4db',
            '--color-secondary-foreground': '#43275a',
            '--color-success': '#a8ddb5',
            '--color-warning': '#f5d98e',
            '--color-destructive': '#e8b4b4',
            '--color-destructive-foreground': '#6b2525',
            '--color-border': '#e4ddd3',
            '--color-input': '#f7f3ee',
            '--color-ring': '#b5d6a7',
        },
        // ThemeSwitcherのプレビュー用
        preview: {
            primary: '#b5d6a7',
            accent: '#e8a4b8',
            secondary: '#cdb4db',
        },
    },
    warm: {
        name: 'ウォーム',
        emoji: '🌞',
        colors: {
            '--color-background': '#fdf6ee',
            '--color-foreground': '#4a3522',
            '--color-card': '#fffbf5',
            '--color-card-foreground': '#4a3522',
            '--color-popover': '#fffbf5',
            '--color-popover-foreground': '#4a3522',
            '--color-muted': '#f5ead8',
            '--color-muted-foreground': '#7a6650',
            '--color-primary': '#e8a955',
            '--color-primary-foreground': '#4a3018',
            '--color-accent': '#e87c6a',
            '--color-accent-foreground': '#5a2318',
            '--color-secondary': '#f0ca5e',
            '--color-secondary-foreground': '#5a4018',
            '--color-success': '#8dd49a',
            '--color-warning': '#f0b84a',
            '--color-destructive': '#e89a9a',
            '--color-destructive-foreground': '#6b2525',
            '--color-border': '#e2d0b8',
            '--color-input': '#f7efe0',
            '--color-ring': '#e8a955',
        },
        preview: {
            primary: '#e8a955',
            accent: '#e87c6a',
            secondary: '#f0ca5e',
        },
    },
    cool: {
        name: 'クール',
        emoji: '❄️',
        colors: {
            '--color-background': '#f0f5fa',
            '--color-foreground': '#2a3545',
            '--color-card': '#ffffff',
            '--color-card-foreground': '#2a3545',
            '--color-popover': '#ffffff',
            '--color-popover-foreground': '#2a3545',
            '--color-muted': '#e4ecf4',
            '--color-muted-foreground': '#5a6a7a',
            '--color-primary': '#7ab8e8',
            '--color-primary-foreground': '#1a3550',
            '--color-accent': '#7ad4d4',
            '--color-accent-foreground': '#1a4545',
            '--color-secondary': '#a88ce8',
            '--color-secondary-foreground': '#352060',
            '--color-success': '#7ac8a0',
            '--color-warning': '#f0d060',
            '--color-destructive': '#e8a0aa',
            '--color-destructive-foreground': '#6b2530',
            '--color-border': '#c8d4e0',
            '--color-input': '#eaf0f6',
            '--color-ring': '#7ab8e8',
        },
        preview: {
            primary: '#7ab8e8',
            accent: '#7ad4d4',
            secondary: '#a88ce8',
        },
    },
} as const;

export type ThemeName = keyof typeof themes;

// CSS変数にテーマを適用
function applyTheme(themeName: ThemeName) {
    const theme = themes[themeName];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    // body の直接スタイルも更新
    document.body.style.background = theme.colors['--color-background'];
    document.body.style.color = theme.colors['--color-foreground'];
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
