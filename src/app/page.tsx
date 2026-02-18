import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Target, Timer, TrendingUp, Zap, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/25 via-secondary/15 to-accent/25">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-foreground via-foreground to-accent-foreground bg-clip-text text-transparent">
          ADHD Support App
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          ADHDの特性を持つあなたのための、<br />
          統合型タスク管理・習慣トラッカーアプリ
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6">
              今すぐ始める
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              機能を見る
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">主な機能</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow bg-card/90 border-border/50">
            <CardHeader>
              <CheckSquare className="h-12 w-12 text-primary mb-4" />
              <CardTitle>タスク管理</CardTitle>
              <CardDescription>
                タスクを視覚的に整理し、優先順位を明確に
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ 大きなタスクを小さなステップに分解</li>
                <li>✓ 色分けで直感的に優先度を把握</li>
                <li>✓ 達成状況を可視化してモチベーション維持</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card/90 border-border/50">
            <CardHeader>
              <Timer className="h-12 w-12 text-secondary-foreground mb-4" />
              <CardTitle>ポモドーロタイマー</CardTitle>
              <CardDescription>
                集中と休憩のリズムを作る
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ カスタマイズ可能な時間設定</li>
                <li>✓ 過集中防止アラート</li>
                <li>✓ 集中できた時間帯を可視化</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow bg-card/90 border-border/50">
            <CardHeader>
              <Target className="h-12 w-12 text-accent-foreground mb-4" />
              <CardTitle>習慣トラッカー</CardTitle>
              <CardDescription>
                小さな習慣を継続するサポート
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ リマインダー通知</li>
                <li>✓ 柔軟な目標設定（週3回など）</li>
                <li>✓ 失敗しても続けやすい設計</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20 bg-card/80 border border-border/50 rounded-3xl my-12">
        <h2 className="text-4xl font-bold text-center mb-12">ADHDの特性に配慮した設計</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <Zap className="h-8 w-8 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">シンプルで直感的</h3>
              <p className="text-muted-foreground">
                情報過多を避け、必要な情報だけを表示。視覚的なデザインで直感的に理解できます。
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <TrendingUp className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">達成を可視化</h3>
              <p className="text-muted-foreground">
                完了したタスクや習慣の継続日数を可視化し、モチベーションを維持します。
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Heart className="h-8 w-8 text-accent-foreground flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">励ましのメッセージ</h3>
              <p className="text-muted-foreground">
                ポジティブなフィードバックで、あなたのペースを尊重します。
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <CheckSquare className="h-8 w-8 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold mb-2">柔軟な目標設定</h3>
              <p className="text-muted-foreground">
                「毎日」ではなく「週3回」など、現実的な目標を設定できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">今日から始めましょう</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          あなたのペースで、一歩ずつ。<br />
          ADHD Support Appがサポートします。
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-lg px-12 py-6">
            無料で始める
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border/70">
        <p>&copy; 2026 ADHD Support App. All rights reserved.</p>
      </footer>
    </div>
  );
}
