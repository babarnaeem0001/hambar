import { createClient } from '@supabase/supabase-js';

let rawUrl = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/['"]/g, '').trim().replace(/\/$/, "");
let supabaseAnonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '').replace(/['"]/g, '').trim();

if (rawUrl && !rawUrl.startsWith('http')) {
  rawUrl = `https://${rawUrl}`;
}

// If it's just the project ID (e.g. "xurj..." without ".supabase.co")
if (rawUrl && rawUrl.startsWith('https://') && !rawUrl.substring(8).includes('.') && !rawUrl.includes('localhost')) {
  rawUrl = `${rawUrl}.supabase.co`;
}

// Ensure URL is structurally valid
try {
  if (rawUrl) {
    new URL(rawUrl);
  }
} catch (e) {
  console.error("Invalid Supabase URL:", rawUrl);
  rawUrl = ''; // will disable client
}

export const supabase = rawUrl && supabaseAnonKey 
  ? createClient(rawUrl, supabaseAnonKey) 
  : null;

