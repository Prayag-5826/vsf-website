import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * One shared browser client for the office panel. Every request carries the session token
 * issued by app_login() in the x-session-token header, which the database uses to decide
 * what this person may read or change (row-level security).
 */

const TOKEN_KEY = 'vs_token';
const TOKEN_COOKIE = 'vsf_universal_token';

export const getSessionToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(TOKEN_KEY);
  if (stored) return stored;
  const match = document.cookie.match(new RegExp('(^| )' + TOKEN_COOKIE + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

let client: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (client) return client;

  client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        const token = getSessionToken();
        if (token) headers.set('x-session-token', token);
        return fetch(input, { ...init, headers });
      }
    }
  });
  return client;
};
