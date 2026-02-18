'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Target, Timer, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Habits', href: '/habits', icon: Target },
    { name: 'Timer', href: '/timer', icon: Timer },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container flex h-20 items-center justify-between px-6 max-w-6xl mx-auto">
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard" className="flex items-center space-x-2 group">
                        <span className="text-3xl font-serif italic text-foreground transition-all group-hover:text-accent">
                            Bloom
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center bg-card/80 border border-border/70 rounded-full px-4 py-1.5 space-x-4 text-sm font-medium shadow-sm">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'px-4 py-1.5 rounded-full transition-all duration-300',
                                    isActive
                                        ? 'bg-accent text-accent-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                                )}
                            >
                                <span className="flex items-center space-x-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20">
                        <LogOut className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
