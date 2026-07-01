import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client. The URL and key come from environment variables
// WITHOUT a NEXT_PUBLIC_ prefix, so they are never sent to the browser. Only
// Server Actions call this.
//
// The client is created lazily inside this function rather than at module load
// so that a production build doesn't need the env vars to be present.
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY. Add them to .env.local (and to Vercel).",
    );
  }

  return createClient(url, key);
}
