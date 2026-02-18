'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/themeStore';

export function ThemeInitializer() {
    const initTheme = useThemeStore((state) => state.initTheme);

    useEffect(() => {
        // クライアントサイドでテーマを初期化
        initTheme();
    }, [initTheme]);

    return null;
}
