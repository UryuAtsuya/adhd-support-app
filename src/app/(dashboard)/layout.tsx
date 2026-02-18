import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
            <Header />
            <main className="container mx-auto px-6 py-12 max-w-6xl">
                {children}
            </main>
        </div>
    );
}
