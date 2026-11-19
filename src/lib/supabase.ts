import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let client: Promise<SupabaseClient> | null = null;

/** The Supabase client, downloaded on first use so it stays out of the page's initial bundle. */
export const getSupabase = () => {
  client ??= import("@supabase/supabase-js").then(({ createClient }) => {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables. Check your .env file.");
    }
    return createClient(supabaseUrl, supabaseKey);
  });
  return client;
};
