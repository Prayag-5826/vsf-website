import { getSupabase } from '@/lib/supabaseBrowser';

// Sends browser errors to the Supabase "app_errors" table (a small private Sentry).
// It never throws, and it limits duplicates and volume so a bug cannot flood the table.

const seen = new Set<string>();
let sent = 0;
const MAX_PER_SESSION = 20;

export async function reportClientError(
  error: unknown,
  context: { kind?: string; page?: string } = {}
): Promise<void> {
  try {
    if (typeof window === 'undefined') return;

    const err =
      error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : safeStringify(error));

    const message = (err.message || 'Unknown error').slice(0, 500);
    const stack = (err.stack || '').slice(0, 4000);

    const key = `${message}|${stack.slice(0, 200)}`;
    if (seen.has(key) || sent >= MAX_PER_SESSION) return;
    seen.add(key);
    sent += 1;

    const supabase = getSupabase();

    let email: string | null = null;
    try {
      const { data } = await supabase.auth.getUser();
      email = data?.user?.email ?? null;
    } catch {
      /* not signed in */
    }

    const desktop = (window as any).desktopAPI;
    let appVersion: string | null = null;
    try {
      appVersion = (await desktop?.getVersion?.()) ?? null;
    } catch {
      /* ignore */
    }

    await supabase.from('app_errors').insert({
      source: desktop ? 'desktop' : 'web',
      kind: context.kind ?? 'client-error',
      message,
      stack,
      page: context.page ?? window.location.pathname,
      user_email: email,
      app_version: appVersion,
      os: navigator.userAgent.slice(0, 300),
    });
  } catch {
    /* the reporter must never cause errors of its own */
  }
}

function safeStringify(value: unknown): string {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
}
