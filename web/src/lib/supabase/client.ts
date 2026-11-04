import { createBrowserClient } from "@supabase/ssr";
import {
  isSupabaseConfigured,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  return createBrowserClient(supabaseUrl, supabasePublishableKey);
}
