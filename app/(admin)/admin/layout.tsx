'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { getSupabase } from '@/lib/supabaseBrowser';

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

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
      setMobileDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loggingOut]);

  // Close the drawer whenever the route changes
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

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

      // 3. Sweep any JS-readable cookies on the host and the shared domain
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
            <p className="mb-1.5 px-3 text-xs font-medium text-slate-400">{section.title}</p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700 ${
                        active
                          ? 'bg-red-50 font-semibold text-red-800'
                          : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon
                          size={17}
                          className={`shrink-0 ${active ? 'text-red-700' : 'text-slate-400'}`}
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
          <p className="mb-1.5 px-3 text-xs font-medium text-slate-400">Open</p>
          <ul className="space-y-0.5">
            <li>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
              >
                <span className="flex items-center gap-3">
                  <Globe size={17} className="text-slate-400" />
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
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
              >
                <span className="flex items-center gap-3">
                  <Smartphone size={17} className="text-slate-400" />
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
        <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation"
              className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <h1 className="truncate text-base font-semibold text-slate-900">{pageTitle}</h1>
          </div>

          <div className="flex shrink-0 items-center gap-4">
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
