import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSのクラス名を結合するユーティリティ関数
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * 日付を「YYYY-MM-DD」形式にフォーマット
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}

/**
 * 日付を「MM月DD日」形式にフォーマット
 */
export function formatDateJP(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${month}月${day}日`;
}

/**
 * 相対的な日付表現（今日、明日、昨日など）
 */
export function getRelativeDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);

    const diffTime = d.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '明日';
    if (diffDays === -1) return '昨日';
    if (diffDays > 0) return `${diffDays}日後`;
    return `${Math.abs(diffDays)}日前`;
}

/**
 * 期限切れかどうかを判定
 */
export function isOverdue(dueDate: Date | string): boolean {
    const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d < today;
}

/**
 * ランダムな励ましメッセージを取得
 */
export function getMotivationalMessage(): string {
    const messages = [
        '今日も一歩ずつ進んでいきましょう!',
        '小さな達成の積み重ねが大きな成果になります',
        'あなたのペースで大丈夫です',
        '今日できることに集中しましょう',
        '完璧でなくても、進んでいることが素晴らしい!',
        '休憩も大切な仕事の一部です',
        '自分を褒めることを忘れずに',
        '一つずつ、確実に',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}
