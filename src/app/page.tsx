import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Target, Timer, TrendingUp, Zap, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/15" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-6 py-24 md:py-32 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-card border-2 border-border/60 rounded-full px-5 py-2 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">ADHDの特性に寄り添う設計</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-foreground leading-tight">
            あなたのペースで、<br />
            <span className="text-accent">咲いていこう。</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            統合型タスク管理・習慣トラッカー・ポモドーロタイマー。<br className="hidden md:block" />
            小さな一歩を、確実な成長に変えます。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-base px-10 py-7 h-auto">
                今すぐ始める
                <ArrowRight className="h-5 w-5 ml-1" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-base px-10 py-7 h-auto">
                機能を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-24 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">主な機能</h2>
          <p className="text-muted-foreground text-lg">ADHDの方に最適化された3つのコア機能</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border-2 border-border/60 bg-card">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <CheckSquare className="h-7 w-7 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">タスク管理</CardTitle>
              <CardDescription className="text-base">
                タスクを視覚的に整理し、優先順位を明確に
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />大きなタスクを小さなステップに分解</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />色分けで直感的に優先度を把握</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary" />達成状況を可視化してモチベーション維持</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-secondary/10 hover:-translate-y-1 transition-all duration-300 border-2 border-border/60 bg-card">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary/25 flex items-center justify-center group-hover:bg-secondary/35 transition-colors">
                <Timer className="h-7 w-7 text-secondary-foreground" />
              </div>
              <CardTitle className="text-xl">ポモドーロタイマー</CardTitle>
              <CardDescription className="text-base">
                集中と休憩のリズムを作る
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" />カスタマイズ可能な時間設定</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" />過集中防止アラート</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-secondary" />集中できた時間帯を可視化</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-300 border-2 border-border/60 bg-card">
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                <Target className="h-7 w-7 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">習慣トラッカー</CardTitle>
              <CardDescription className="text-base">
                小さな習慣を継続するサポート
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />リマインダー通知</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />柔軟な目標設定（週3回など）</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" />失敗しても続けやすい設計</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20 max-w-5xl">
        <Card className="border-2 border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-4 md:p-8">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-center mb-2">ADHDの特性に配慮した設計</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-warning/30 flex items-center justify-center shrink-0">
                  <Zap className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">シンプルで直感的</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    情報過多を避け、必要な情報だけを表示。視覚的なデザインで直感的に理解できます。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/25 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">達成を可視化</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    完了したタスクや習慣の継続日数を可視化し、モチベーションを維持します。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                  <Heart className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">励ましのメッセージ</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    ポジティブなフィードバックで、あなたのペースを尊重します。
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-success/25 flex items-center justify-center shrink-0">
                  <CheckSquare className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1.5">柔軟な目標設定</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    「毎日」ではなく「週3回」など、現実的な目標を設定できます。
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24 text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-foreground">今日から始めましょう</h2>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
          あなたのペースで、一歩ずつ。<br />
          Bloom がサポートします。
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="text-base px-12 py-7 h-auto">
            無料で始める
            <ArrowRight className="h-5 w-5 ml-1" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center border-t-2 border-border/40 max-w-6xl">
        <p className="text-sm text-muted-foreground">&copy; 2026 Bloom — ADHD Support App</p>
      </footer>
    </div>
  );
}
