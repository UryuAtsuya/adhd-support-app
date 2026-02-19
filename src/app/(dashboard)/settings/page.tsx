'use client';

import { useEffect, useMemo, useState } from 'react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { createClient } from '@/lib/supabase/client';
import { Subscription } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
    const supabase = useMemo(() => createClient(), []);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [isLoadingPlan, setIsLoadingPlan] = useState(true);

    useEffect(() => {
        const loadSubscription = async () => {
            setIsLoadingPlan(true);

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setSubscription(null);
                setIsLoadingPlan(false);
                return;
            }

            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', user.id)
                .in('status', ['trialing', 'active', 'past_due'])
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            setSubscription((data as Subscription | null) ?? null);
            setIsLoadingPlan(false);
        };

        void loadSubscription();
    }, [supabase]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">設定</h1>
                <p className="text-muted-foreground mt-2">
                    アプリの外観や動作をカスタマイズできます
                </p>
            </div>

            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>プラン・請求</CardTitle>
                    <CardDescription>
                        現在のプラン状態を確認できます
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {isLoadingPlan ? (
                        <p className="text-sm text-muted-foreground">プラン情報を読み込み中です...</p>
                    ) : subscription ? (
                        <div className="space-y-2">
                            <p className="text-sm">
                                現在のプラン: <strong>{subscription.plan_code.toUpperCase()}</strong>
                            </p>
                            <Badge variant="outline">{subscription.status}</Badge>
                            {subscription.current_period_end && (
                                <p className="text-xs text-muted-foreground">
                                    次回更新日: {new Date(subscription.current_period_end).toLocaleDateString('ja-JP')}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">現在はFreeプランです。</p>
                    )}
                    <Button variant="outline" disabled>
                        請求管理（近日公開）
                    </Button>
                </CardContent>
            </Card>

            {/* 外観設定 */}
            <Card>
                <CardHeader>
                    <CardTitle>外観</CardTitle>
                    <CardDescription>
                        アプリの見た目をカスタマイズします
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ThemeSwitcher />
                </CardContent>
            </Card>

            {/* 将来的な設定項目 */}
            <Card>
                <CardHeader>
                    <CardTitle>通知</CardTitle>
                    <CardDescription>
                        通知の設定（近日公開予定）
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        ポモドーロタイマーの完了通知やタスクの期限通知などを設定できるようになります
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>アカウント</CardTitle>
                    <CardDescription>
                        アカウント設定（近日公開予定）
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        プロフィール編集やパスワード変更などができるようになります
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
