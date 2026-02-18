'use client';

import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">設定</h1>
                <p className="text-muted-foreground mt-2">
                    アプリの外観や動作をカスタマイズできます
                </p>
            </div>

            <Separator />

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
