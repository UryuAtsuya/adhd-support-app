# Bloom (ADHD Support App)

Next.jsベースのADHD支援アプリです。タスク管理、習慣トラッカー、ポモドーロタイマーを提供します。

## セットアップ

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Supabase設定

1. Supabaseでプロジェクトを作成
2. `.env.local` に以下を設定

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

3. SQLエディタで `supabase/migrations/202602190001_initial_schema.sql` を実行
4. Supabase Authで必要なログイン方式（Email / Google）を有効化
5. Googleログインを使う場合はリダイレクトURLに以下を登録

```text
http://localhost:3000/auth/callback
https://<your-domain>/auth/callback
```

## 主要構成

- `src/app/login/page.tsx`: ログインページ
- `src/app/auth/callback/route.ts`: 認証コールバック
- `middleware.ts`: セッション更新
- `src/app/(dashboard)/layout.tsx`: ダッシュボード配下の認証ガード
- `src/features/*/stores/*Store.ts`: Supabase連携ストア
- `supabase/migrations/202602190001_initial_schema.sql`: 初期DB/RLS/課金テーブル

## スクリプト

```bash
npm run dev
npm run build
npm run lint
```
