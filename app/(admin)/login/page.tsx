'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Lock,
  Mail,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from 'lucide-react';
import { loginWithPassword } from '@/lib/session';

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;
const REMEMBER_KEY = 'vsf_admin_last_id';

const FIELD_PORTAL_ORIGINS = ['https://field.vidhyasecurityforce.in'];
if (process.env.NODE_ENV !== 'production') {
  FIELD_PORTAL_ORIGINS.push('http://localhost:5173');
}

/**
 * Returns a safe redirect target or null.
 * - Internal paths must start with a single "/" (blocks "//evil.com").
 * - External URLs are compared by exact origin, not by startsWith,
 *   so "https://field.vidhyasecurityforce.in.evil.com" is rejected.
 */
function resolveSafeRedirect(raw: string | null): string | null {
  if (!raw) return null;

  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.startsWith('/\\')) {
    return raw;
  }

  try {
    const url = new URL(raw);
    if (FIELD_PORTAL_ORIGINS.includes(url.origin)) return url.toString();
  } catch {
    /* invalid URL */
  }
  return null;
}

type Notice = { tone: 'success' | 'info' | 'warning'; text: string } | null;

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTarget = resolveSafeRedirect(searchParams.get('redirect'));

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [capsLock, setCapsLock] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [attempts, setAttempts] = useState(0);
  const [lockedFor, setLockedFor] = useState(0);

  const passwordRef = useRef<HTMLInputElement>(null);

  // Notice banner from query string (?loggedout=..., ?reason=expired)
  const notice: Notice = searchParams.get('loggedout')
    ? { tone: 'success', text: 'You have been signed out.' }
    : searchParams.get('reason') === 'expired'
      ? { tone: 'info', text: 'Your session expired. Sign in again to continue.' }
      : searchParams.get('reason') === 'unauthorized'
        ? { tone: 'warning', text: 'This account does not have admin access.' }
        : null;

  // Restore last used ID (identifier only, never the password)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) setIdentifier(saved);
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (lockedFor <= 0) return;
    const t = setInterval(() => {
      setLockedFor((s) => {
        if (s <= 1) {
          setAttempts(0);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [lockedFor]);

  const isLocked = lockedFor > 0;
  const canSubmit = identifier.trim().length > 0 && password.length > 0 && !loading && !isLocked;

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setCapsLock(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await loginWithPassword(identifier.trim(), password);

      if (!res.ok) {
        const next = attempts + 1;
        setAttempts(next);
        setPassword('');
        passwordRef.current?.focus();

        if (next >= MAX_ATTEMPTS) {
          setLockedFor(LOCKOUT_SECONDS);
          setErrorMessage('Too many failed attempts. Wait before trying again.');
        } else {
          const left = MAX_ATTEMPTS - next;
          setErrorMessage(
            `${res.message || 'Incorrect ID or password.'} ${left} ${left === 1 ? 'attempt' : 'attempts'} left.`
          );
        }
        setLoading(false);
        return;
      }

      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, identifier.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* ignore */
      }

      // Hard navigation so the new session cookies are picked up everywhere.
      // Loading stays true on purpose: the page is about to unload.
      window.location.assign(redirectTarget ?? '/admin');
    } catch (err: any) {
      setErrorMessage(
        err?.message || 'Could not reach the server. Check your connection and try again.'
      );
      setLoading(false);
    }
  };

  const noticeStyles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    info: 'bg-sky-50 border-sky-200 text-sky-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-900',
  } as const;

  const NoticeIcon =
    notice?.tone === 'success' ? CheckCircle2 : notice?.tone === 'warning' ? TriangleAlert : Info;

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Use your admin ID or official email to open the operations desk.
        </p>
      </div>

      {notice && !errorMessage && (
        <div
          role="status"
          className={`mb-5 flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${noticeStyles[notice.tone]}`}
        >
          <NoticeIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{notice.text}</span>
        </div>
      )}

      <div aria-live="assertive">
        {errorMessage && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {errorMessage}
              {isLocked && <span className="font-semibold"> Retry in {lockedFor}s.</span>}
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleAuth} className="space-y-5" noValidate>
        <div>
          <label htmlFor="identifier" className="mb-1.5 block text-sm font-medium text-slate-700">
            Admin ID or email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="identifier"
              name="username"
              type="text"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoFocus
              required
              disabled={loading}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@vidhyasecurityforce.in"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-red-700 focus:outline-none focus:ring-4 focus:ring-red-700/10 disabled:bg-slate-50 disabled:text-slate-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="password"
              name="password"
              ref={passwordRef}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              disabled={loading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
              onKeyUp={handleKey}
              onBlur={() => setCapsLock(false)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-red-700 focus:outline-none focus:ring-4 focus:ring-red-700/10 disabled:bg-slate-50 disabled:text-slate-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {capsLock && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-amber-700">
              <TriangleAlert className="h-3.5 w-3.5" />
              Caps Lock is on
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-red-700 focus:ring-red-700"
            />
            Remember my ID on this device
          </label>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-800 active:bg-red-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-700/30 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in
            </>
          ) : isLocked ? (
            <>Try again in {lockedFor}s</>
          ) : (
            <>Sign in</>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
        Forgot your password or locked out? Contact the HQ administrator to reset your access.
      </p>

      {redirectTarget && redirectTarget.startsWith('http') && (
        <p className="mt-3 text-center text-xs text-slate-400">
          After signing in you will return to the Field Patrol app.
        </p>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen bg-[#FBFBF9] text-slate-900 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-red-800 p-12 text-white lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full border-[40px] border-amber-400/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-24 h-64 w-64 rounded-full border-[28px] border-white/5"
        />

        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white p-1.5">
            <Image
              src="/assets/img/logo/logo.png"
              alt="Vidhya Security Force logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <span className="text-base font-semibold tracking-tight">Vidhya Security Force</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            One desk for every guard, post and invoice.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-red-100">
            Attendance, client records, quotations and billing for the Indore headquarters, with
            the same sign-in used by the Field Patrol app.
          </p>
        </div>

        <div className="relative flex items-center gap-3 text-sm text-red-100">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <p className="font-medium text-white">PSARA Madhya Pradesh licensed</p>
            <p className="text-xs text-red-200">PSA/L/74/MP/2023/FEB/3/425</p>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded text-sm font-medium text-slate-500 transition hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to public website
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          {/* Mobile-only brand mark */}
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-white p-1.5">
                <Image
                  src="/assets/img/logo/logo.png"
                  alt="Vidhya Security Force logo"
                  width={34}
                  height={34}
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-sm font-semibold text-slate-900">Vidhya Security Force</span>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading sign-in
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        <footer className="text-center text-xs text-slate-400">
          Authorised staff only. Sign-in activity is monitored.
        </footer>
      </main>
    </div>
  );
}
