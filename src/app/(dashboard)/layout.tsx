import { Header } from '@/components/layout/Header';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const runtime = 'edge';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login?next=/dashboard');
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-accent/30">
            <Header />
            <main className="container mx-auto px-6 py-12 max-w-6xl">
                {children}
            </main>
        </div>
    );
}
