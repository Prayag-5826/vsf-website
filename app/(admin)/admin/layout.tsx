'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  PhoneCall,
  Receipt,
  FolderOpen,
  FileCheck2,
  Settings,
  ExternalLink,
  Menu,
  X,
  LogOut,
  Globe,
  Files,
  LayoutDashboard,
  Calendar,
  Loader2,
  ShieldCheck,
  Smartphone,
  Search,
  Keyboard,
  RefreshCw,
  LifeBuoy,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabaseBrowser';
import { reportClientError } from '@/lib/reportError';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMIN_NAVIGATION: NavSection[] = [
  {
    title: 'Operations',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/attendance', label: 'Attendance', icon: Calendar },
      { href: '/admin/telecaller', label: 'Telecaller desk', icon: PhoneCall, badge: 'Live' },
      { href: '/admin/clients', label: 'Clients', icon: FolderOpen },
      { href: '/admin/documents', label: 'Documents', icon: Files },
    ],
  },
  {
    title: 'Billing',
    items: [
      { href: '/admin/quotations', label: 'Quotations', icon: FileCheck2 },
      { href: '/admin/billing', label: 'Invoices', icon: Receipt },
    ],
  },
  {
    title: 'System',
    items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

const ALL_ITEMS = ADMIN_NAVIGATION.flatMap((s) => s.items);

const PROD_DOMAIN = 'vidhyasecurityforce.in';

/** Resolve after `ms` so a hanging request can never block logout. */
const withTimeout = <T,>(p: Promise<T>, ms = 4000) =>
  Promise.race([p, new Promise<undefined>((r) => setTimeout(() => r(undefined), ms))]);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [appVersion, setAppVersion] = useState('');

  // Values that depend on the browser are set after mount to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [fieldPortalUrl, setFieldPortalUrl] = useState('#');
  const [hasDesktopApi, setHasDesktopApi] = useState(false);
  const [user, setUser] = useState({ name: 'Anil Dhariwal', role: 'Managing Director' });

  useEffect(() => {
    setMounted(true);
    setFieldPortalUrl(
      window.location.hostname.endsWith(PROD_DOMAIN)
        ? `https://field.${PROD_DOMAIN}`
        : 'http://localhost:5173'
    );
    setHasDesktopApi(Boolean((window as any).desktopAPI));
    (window as any).desktopAPI?.getVersion?.().then((v: string) => v && setAppVersion(v)).catch(() => {});

    // Show the signed-in user when the session has a name; otherwise keep the default
    (async () => {
      try {
        const { data } = await getSupabase().auth.getUser();
        const meta = data?.user?.user_metadata as Record<string, string> | undefined;
        const name = meta?.full_name || meta?.name;
        if (name) setUser({ name, role: meta?.role || 'Administrator' });
      } catch {
        /* keep default */
      }
    })();
  }, []);

  // Close the drawer / dialog with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (!loggingOut) setConfirmOpen(false);
      setPaletteOpen(false);
      setHelpOpen(false);
      setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loggingOut]);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Send unexpected browser errors to the app_errors table (a small private Sentry)
  useEffect(() => {
    const IGNORE = /ResizeObserver loop|^Script error\.?$/i;
    const onError = (e: ErrorEvent) => {
      if (IGNORE.test(e.message || '')) return;
      reportClientError(e.error ?? e.message, { kind: 'window-error' });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      reportClientError(e.reason, { kind: 'unhandled-rejection' });
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  /* ───────── keyboard shortcuts and quick search ───────── */

  const openPalette = useCallback(() => {
    setHelpOpen(false);
    setQuery('');
    setActiveIdx(0);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && !e.shiftKey && !e.altKey && key === 'k') {
        e.preventDefault();
        openPalette();
      } else if (mod && !e.altKey && key === '/') {
        e.preventDefault();
        setPaletteOpen(false);
        setHelpOpen(true);
      } else if (mod && e.shiftKey && !e.altKey && key === 'l') {
        e.preventDefault();
        setConfirmOpen(true);
      } else if (e.altKey && !mod && !e.shiftKey && /^Digit[1-8]$/.test(e.code)) {
        const item = ALL_ITEMS[Number(e.code.slice(5)) - 1];
        if (item) {
          e.preventDefault();
          router.push(item.href);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [router, openPalette]);

  type PaletteEntry = { id: string; label: string; hint?: string; icon: React.ElementType; run: () => void };

  const paletteEntries: PaletteEntry[] = [
    ...ALL_ITEMS.map((item, i) => ({
      id: item.href,
      label: `Go to ${item.label}`,
      hint: `Alt+${i + 1}`,
      icon: item.icon,
      run: () => router.push(item.href),
    })),
    { id: 'site', label: 'Open public website', icon: Globe, run: () => window.open('/', '_blank') },
    { id: 'field', label: 'Open field patrol app', icon: Smartphone, run: () => window.open(fieldPortalUrl, '_blank') },
    { id: 'help', label: 'Keyboard shortcuts', hint: 'Ctrl+/', icon: Keyboard, run: () => setHelpOpen(true) },
    ...(hasDesktopApi
      ? [
          {
            id: 'update',
            label: 'Check for app updates',
            icon: RefreshCw,
            run: () => (window as any).desktopAPI?.checkForUpdates?.(),
          },
          {
            id: 'report',
            label: 'Report a problem',
            icon: LifeBuoy,
            run: () => (window as any).desktopAPI?.reportProblem?.(),
          },
        ]
      : []),
    { id: 'signout', label: 'Sign out', hint: 'Ctrl+Shift+L', icon: LogOut, run: () => setConfirmOpen(true) },
  ];

  const filteredEntries = paletteEntries.filter((e) =>
    e.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const runEntry = (entry?: PaletteEntry) => {
    if (!entry) return;
    setPaletteOpen(false);
    entry.run();
  };

  const onPaletteKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => (filteredEntries.length ? (i + 1) % filteredEntries.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => (filteredEntries.length ? (i - 1 + filteredEntries.length) % filteredEntries.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runEntry(filteredEntries[activeIdx]);
    }
  };

  const shortcutGroups: { title: string; rows: [string, string][] }[] = [
    {
      title: 'Anywhere in the admin panel',
      rows: [
        ['Ctrl + K', 'Quick search and commands'],
        ['Ctrl + /', 'Show this list'],
        ['Alt + 1 to 8', 'Go to Dashboard, Attendance ... Settings'],
        ['Ctrl + Shift + L', 'Sign out'],
        ['Esc', 'Close a window'],
      ],
    },
    ...(hasDesktopApi
      ? [
          {
            title: 'Desktop app',
            rows: [
              ['Ctrl + Alt + E', 'Bring the app to the front from any program'],
              ['F5  or  Ctrl + R', 'Reload'],
              ['Ctrl + Shift + R', 'Reload and clear cache'],
              ['Alt + Left / Right', 'Back / forward'],
              ['Ctrl + Plus / Minus / 0', 'Zoom in / out / reset'],
              ['F11', 'Full screen'],
              ['Ctrl + W', 'Hide to the system tray'],
              ['Ctrl + M', 'Minimize'],
            ] as [string, string][],
          },
        ]
      : []),
  ];

  const isNavActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const pageTitle =
    [...ALL_ITEMS]
      .sort((a, b) => b.href.length - a.href.length)
      .find((i) => isNavActive(i.href))?.label ?? 'Admin';

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);

    try {
      // 1. Revoke the session with Supabase (never block on it)
      try {
        await withTimeout(getSupabase().auth.signOut({ scope: 'global' }));
      } catch {
        /* continue even if the token is already invalid */
      }

      // 2. Server purge: removes HttpOnly and shared-domain (.vidhyasecurityforce.in) cookies
      try {
        await withTimeout(
          fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
          })
        );
      } catch {
        /* continue */
      }

      // 3. Desktop app only: wipe the persistent Electron session
      try {
        await withTimeout((window as any).desktopAPI?.clearSession?.());
      } catch {
        /* not running in the desktop app */
      }

      // 3b. Sweep any JS-readable cookies on the host and the shared domain
      const host = window.location.hostname;
      const domainParts = ['', `; domain=${host}`];
      if (host.endsWith(PROD_DOMAIN)) domainParts.push(`; domain=.${PROD_DOMAIN}`);
      document.cookie.split(';').forEach((c) => {
        const name = c.split('=')[0].trim();
        if (!name) return;
        domainParts.forEach((d) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
        });
      });

      // 4. Clear stored auth state (keep unrelated keys such as the remembered login ID)
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sb-') || k.includes('supabase'))
          .forEach((k) => localStorage.removeItem(k));
        sessionStorage.clear();
      } catch {
        /* storage unavailable */
      }
    } finally {
      // 5. Always leave, with a unique URL so no cached page is reused
      window.location.replace(`/admin/login?loggedout=${Date.now()}`);
    }
  }, [loggingOut]);

  const navContent = (
    <div className="flex h-full flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 px-5">
        <Image
          src="/assets/img/logo/logo.png"
          alt="Vidhya Security Force logo"
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          priority
        />
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-semibold text-slate-900">Vidhya Security Force</p>
          <p className="text-xs text-slate-500">Operations desk</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin navigation">
        {ADMIN_NAVIGATION.map((section) => (
          <div key={section.title}>
            <p className="mb-1.5 px-3 text-xs font-semibold text-slate-500">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      title={`${item.label} (Alt+${ALL_ITEMS.findIndex((i) => i.href === item.href) + 1})`}
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 ${
                        active
                          ? 'bg-red-50 font-semibold text-red-800'
                          : 'font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon
                          size={17}
                          className={`shrink-0 ${active ? 'text-red-700' : 'text-slate-500'}`}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-1.5 px-3 text-xs font-semibold text-slate-500">Open</p>
          <ul className="space-y-0.5">
            <li>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
              >
                <span className="flex items-center gap-3">
                  <Globe size={17} className="text-slate-500" />
                  Public website
                </span>
                <ExternalLink size={13} className="text-slate-300" />
              </a>
            </li>
            <li>
              <a
                href={fieldPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
              >
                <span className="flex items-center gap-3">
                  <Smartphone size={17} className="text-slate-500" />
                  Field patrol app
                </span>
                <ExternalLink size={13} className="text-slate-300" />
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* User + sign out */}
      <div className="shrink-0 border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-xs text-slate-500">{user.role}</p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            disabled={loggingOut}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-md p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:opacity-50"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 shrink-0 lg:block">{navContent}</aside>

      {/* Mobile drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] shadow-xl">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Close navigation"
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
            {navContent}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className={`flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 ${
            hasDesktopApi ? 'vsf-titlebar-drag' : ''
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation"
              className="vsf-titlebar-nodrag rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="truncate text-base font-semibold text-slate-900">{pageTitle}</h1>
          </div>

          <div className="vsf-titlebar-nodrag flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={openPalette}
              className="hidden items-center gap-2 rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-500 transition hover:bg-slate-50 hover:text-slate-700 md:flex"
              aria-label="Open quick search"
            >
              <Search size={14} />
              <span>Search</span>
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">Ctrl K</kbd>
            </button>

            <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>
                PSARA licensed
                <span className="hidden xl:inline"> · PSA/L/74/MP/2023/FEB/3/425</span>
              </span>
            </div>

            {mounted && hasDesktopApi && (
              <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.minimize()}
                  className="flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
                  title="Minimize"
                  aria-label="Minimize window"
                >
                  &minus;
                </button>
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.maximize()}
                  className="flex h-7 w-7 items-center justify-center rounded text-xs text-slate-600 hover:bg-slate-100"
                  title="Maximize"
                  aria-label="Maximize window"
                >
                  &#9633;
                </button>
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.close()}
                  className="flex h-7 w-7 items-center justify-center rounded text-xs text-slate-600 hover:bg-red-600 hover:text-white"
                  title="Close to tray"
                  aria-label="Close window to tray"
                >
                  &#x2715;
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>

      {/* Quick search */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[14vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Quick search"
        >
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setPaletteOpen(false)} />
          <div className="relative w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-4">
              <Search size={16} className="shrink-0 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIdx(0);
                }}
                onKeyDown={onPaletteKey}
                placeholder="Go to a page or run a command"
                className="h-12 w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-500">Esc</kbd>
            </div>
            <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
              {filteredEntries.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-slate-500">Nothing matches &ldquo;{query}&rdquo;</li>
              )}
              {filteredEntries.map((entry, i) => {
                const Icon = entry.icon;
                return (
                  <li key={entry.id} role="option" aria-selected={i === activeIdx}>
                    <button
                      type="button"
                      onClick={() => runEntry(entry)}
                      onMouseMove={() => setActiveIdx(i)}
                      className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm ${
                        i === activeIdx ? 'bg-red-50 text-red-800' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon size={16} className={i === activeIdx ? 'text-red-700' : 'text-slate-500'} />
                        <span className="truncate">{entry.label}</span>
                      </span>
                      {entry.hint && <span className="shrink-0 text-xs text-slate-400">{entry.hint}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts */}
      {helpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setHelpOpen(false)} />
          <div className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Keyboard shortcuts</h2>
              <button
                type="button"
                onClick={() => setHelpOpen(false)}
                aria-label="Close"
                className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 space-y-5">
              {shortcutGroups.map((group) => (
                <div key={group.title}>
                  <p className="mb-1.5 text-xs font-semibold text-slate-500">{group.title}</p>
                  <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
                    {group.rows.map(([keys, label]) => (
                      <li key={keys} className="flex items-center justify-between gap-4 px-3 py-2 text-sm">
                        <span className="text-slate-700">{label}</span>
                        <kbd className="shrink-0 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                          {keys}
                        </kbd>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {appVersion && <p className="mt-4 text-center text-xs text-slate-400">Desktop app version {appVersion}</p>}
          </div>
        </div>
      )}

      {/* Sign-out confirmation */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="signout-title"
          aria-describedby="signout-desc"
        >
          <div
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => !loggingOut && setConfirmOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 id="signout-title" className="text-base font-semibold text-slate-900">
              Sign out?
            </h2>
            <p id="signout-desc" className="mt-1.5 text-sm text-slate-600">
              You will be signed out on this device and in the Field Patrol app.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={loggingOut}
                autoFocus
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-70"
              >
                {loggingOut && <Loader2 size={15} className="animate-spin" />}
                {loggingOut ? 'Signing out' : 'Sign out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
