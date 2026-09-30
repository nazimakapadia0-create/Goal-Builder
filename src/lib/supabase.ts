import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;
let initError: string | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  initError =
    'Configuration is missing — environment variables are not set. If you are deploying, make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured in your hosting provider.';
} else {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    initError = err instanceof Error ? err.message : 'Failed to initialize the database connection.';
  }
}

export const supabase = client;
export const supabaseInitError = initError;
