/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Database } from '@edukalyan/types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase Config Error] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file.',
    '\nVITE_SUPABASE_URL:', supabaseUrl,
    '\nVITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '***SET***' : '***MISSING***'
  );
}

// Debug: Log which Supabase instance we are connecting to
console.log('[Supabase] Connecting to:', supabaseUrl);

export const supabase = createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'edukalyan_auth_session',
  },
});
