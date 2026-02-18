'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Target, Timer, Settings, LogOut, Menu, X } from 'lucide-react';
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="container flex h-16 items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard" className="flex items-center space-x-2 group">
                        <span className="text-2xl sm:text-3xl font-serif italic text-foreground transition-all group-hover:text-accent">
                            Bloom
                        </span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center bg-card/80 border border-border/70 rounded-full px-2 py-1 space-x-1 text-sm font-medium shadow-sm">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'px-3 py-1.5 rounded-full transition-all duration-300',
                                    isActive
                                        ? 'bg-accent text-accent-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/20'
                                )}
                            >
                                <span className="flex items-center space-x-1.5">
                                    <Icon className="h-4 w-4" />
                                    <span>{item.name}</span>
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Desktop Logout */}
                <div className="hidden md:flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/20">
                        <LogOut className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </div>

                {/* Mobile Menu Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden rounded-full"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
                    <nav className="container max-w-6xl mx-auto px-4 py-3 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
                                        isActive
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            )}
        </header>
    );
}
