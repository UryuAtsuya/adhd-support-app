import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/supabase/env';

/**
 * ブラウザ用Supabaseクライアント
 * クライアントコンポーネントで使用
 */
export function createClient() {
    const { url, publishableKey } = getSupabaseEnv();
    return createBrowserClient(url, publishableKey);
}
