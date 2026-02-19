'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const nextPath = useMemo(() => {
    if (typeof window === 'undefined') return '/dashboard';
    const params = new URLSearchParams(window.location.search);
    return params.get('next') || '/dashboard';
  }, []);

  const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error: signInError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage('ログインリンクを送信しました。メールを確認してください。');
    }

    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-serif">Bloomにログイン</CardTitle>
          <CardDescription>
            データを安全に同期して、どの端末からでも続きから使えます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleEmailLogin} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              ログインリンクを送る
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Googleでログイン
          </Button>

          {message && <p className="text-sm text-primary">{message}</p>}
          {error && <p className="text-sm text-destructive-foreground">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
