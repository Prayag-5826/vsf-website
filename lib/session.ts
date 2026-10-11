import { getSupabase } from './supabaseBrowser';

/** Sign-in / sign-out helpers shared by the website login page and the office panel layout. */

export interface SessionUser {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: 'ADMIN' | 'SR_FIELD_EXECUTIVE' | 'FIELD_REP' | string;
  avatar?: string | null;
  status?: string;
  visitTarget?: number;
}

const isProd = () => typeof window !== 'undefined' && window.location.hostname.endsWith('vidhyasecurityforce.in');

const cookieSuffix = (maxAge: number) => {
  const domain = isProd() ? '; domain=.vidhyasecurityforce.in' : '';
  const secure = isProd() ? '; Secure' : '';
  return `; path=/${domain}; max-age=${maxAge}; SameSite=Lax${secure}`;
};

export const saveSession = (token: string, user: SessionUser) => {
  const week = 60 * 60 * 24 * 7;
  // Cookies hold about 4 KB, so never put a photo in them.
  const slim = { ...user, avatar: user.avatar && user.avatar.length < 300 ? user.avatar : undefined };
  document.cookie = `vsf_universal_token=${encodeURIComponent(token)}${cookieSuffix(week)}`;
  document.cookie = `vsf_user_session=${encodeURIComponent(JSON.stringify(slim))}${cookieSuffix(week)}`;
  localStorage.setItem('vs_token', token);
  localStorage.setItem('vs_active_user', JSON.stringify(user));
};

export const clearSession = () => {
  const gone = '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `vsf_universal_token=${cookieSuffix(0)}${gone}`;
  document.cookie = `vsf_user_session=${cookieSuffix(0)}${gone}`;
  localStorage.removeItem('vs_token');
  localStorage.removeItem('vs_active_user');
};

/** Call this from the website login page instead of reading the users table. */
export const loginWithPassword = async (
  identifier: string,
  password: string
): Promise<{ ok: true; user: SessionUser } | { ok: false; message: string; attemptsLeft?: number }> => {
  const { data, error } = await getSupabase().rpc('app_login', {
    p_identifier: identifier.trim(),
    p_password: password,
    p_device: typeof navigator !== 'undefined' ? navigator.userAgent : null
  });
  if (error) return { ok: false, message: 'Could not reach the server. Please try again.' };
  if (!data?.success) return { ok: false, message: data?.message || 'Login failed.', attemptsLeft: data?.attemptsLeft };
  saveSession(data.access_token, data.user);
  return { ok: true, user: data.user };
};

/** Asks the server who this session belongs to. Returns null when it is missing, expired or blocked. */
export const fetchCurrentUser = async (): Promise<SessionUser | null> => {
  const { data, error } = await getSupabase().rpc('app_me');
  if (error) throw error;
  return (data as SessionUser) ?? null;
};

export const logoutEverywhere = async () => {
  try {
    await getSupabase().rpc('app_logout');
  } catch {
    /* offline: still clear locally */
  }
  clearSession();
  window.location.href = '/login';
};
