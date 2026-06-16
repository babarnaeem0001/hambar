import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let isValid = true;
try {
  if (supabaseUrl) {
    new URL(supabaseUrl);
  } else {
    isValid = false;
  }
} catch (e) {
  isValid = false;
  console.error("VITE_SUPABASE_URL is not a valid URL. It should look like 'https://xxx.supabase.co'. Currently it is:", supabaseUrl);
}

export const supabase = (supabaseUrl && supabaseAnonKey && isValid)
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

