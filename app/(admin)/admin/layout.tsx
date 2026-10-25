'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PhoneCall,
  Receipt,
  FolderOpen,
  FileCheck2,
  Settings,
  ExternalLink,
  Menu,
  LogOut,
  Radio,
  ChevronRight,
  Globe,
  Files,
  LayoutDashboard,
  Calendar,
  Loader2
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
    title: 'Operations & Pipeline',
    items: [
      { href: '/admin', label: 'Operations Command', icon: LayoutDashboard },
      { href: '/admin/attendance', label: 'Attendance Muster Roll', icon: Calendar },
      { href: '/admin/telecaller', label: 'Speed Dialer Desk', icon: PhoneCall, badge: 'LIVE' },
      { href: '/admin/clients', label: 'Client Directory & Vault', icon: FolderOpen },
      { href: '/admin/documents', label: 'Document Archive', icon: Files }
    ]
  },
  {
    title: 'Commercial & Billing',
    items: [
      { href: '/admin/quotations', label: 'Quotations & Proposals', icon: FileCheck2 },
      { href: '/admin/billing', label: 'Billing & Invoicing', icon: Receipt }
    ]
  },
  {
    title: 'System & Configuration',
    items: [
      { href: '/admin/settings', label: 'System & Wage Setup', icon: Settings }
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Guard against SSR / Client hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const fieldPortalUrl =
    typeof window !== 'undefined' && window.location.hostname.includes('vidhyasecurityforce.in')
      ? 'https://field.vidhyasecurityforce.in'
      : 'http://localhost:5173';

  const isNavActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    const confirmed = window.confirm('Sign out of Central Operations session?');
    if (!confirmed) return;

    setLoggingOut(true);
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut({ scope: 'global' }).catch(() => {});

      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();

        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
        }

        window.location.replace('/admin/login');
      }
    } catch (err) {
      console.error('Logout error:', err);
      window.location.replace('/admin/login');
    }
  };

  const renderNavContent = () => (
    <div className="flex h-full flex-col justify-between bg-white border-r border-slate-200/90 text-slate-800 select-none overflow-hidden">
      <div className="shrink-0 flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-1.5 shadow-2xs">
          <img
            src="/assets/img/logo/logo.png"
            alt="VSF Logo"
            className="h-full w-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23b91c1c"><circle cx="12" cy="12" r="10"/></svg>';
            }}
          />
        </div>
        <div className="min-w-0">
          <span className="block text-xs font-black tracking-tight uppercase text-slate-950 leading-tight">
            Vidhya Security Force
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider">
              HQ Operations Desk
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-5" aria-label="Admin Navigation">
        {ADMIN_NAVIGATION.map((section) => (
          <div key={section.title} className="space-y-1">
            <span className="px-3 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
              {section.title}
            </span>
            <ul className="space-y-0.5 pt-0.5">
              {section.items.map((item) => {
                const active = isNavActive(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? 'bg-red-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          size={15}
                          className={`shrink-0 transition-colors ${
                            active ? 'text-amber-300' : 'text-slate-400 group-hover:text-slate-600'
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase tracking-wider ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
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

        <div className="space-y-1 pt-2 border-t border-slate-100">
          <span className="px-3 text-[9.5px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Quick Portals
          </span>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe size={14} className="text-slate-400 shrink-0" />
              <span className="truncate text-xs">Public Website</span>
            </div>
            <ExternalLink size={12} className="text-slate-400 shrink-0" />
          </a>

          <a
            href={fieldPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-amber-950 bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/70 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Radio size={14} className="text-amber-700 shrink-0 animate-pulse" />
              <span className="truncate text-xs">Field Patrol App</span>
            </div>
            <ExternalLink size={12} className="text-amber-700 shrink-0" />
          </a>
        </div>
      </nav>

      <div className="shrink-0 p-3 border-t border-slate-200/80 bg-slate-50/80">
        <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-amber-300 text-[11px] font-black font-mono">
              AD
            </div>
            <div className="min-w-0">
              <span className="block text-xs font-black text-slate-900 truncate leading-tight">
                Anil Dhariwal
              </span>
              <span className="block text-[9px] font-mono font-bold uppercase text-slate-400 tracking-tight mt-0.5">
                Managing Director
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={loggingOut}
            onClick={handleSignOut}
            title="Sign Out of Session"
            className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? <Loader2 size={16} className="animate-spin text-red-700" /> : <LogOut size={16} />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#FBFBF9] text-slate-900">
      <aside className="hidden lg:block w-64 shrink-0 h-full">
        {renderNavContent()}
      </aside>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-150">
            {renderNavContent()}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-14 shrink-0 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation menu"
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-slate-500 truncate">
              <span>HQ Central Desk</span>
              <ChevronRight size={13} className="text-slate-300 shrink-0" />
              <span className="text-slate-900 truncate">
                {pathname.replace('/admin/', '').replace('/admin', 'Command') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>PSARA MP COMPLIANT</span>
            </div>

            <div className="text-right hidden md:block">
              <span className="block text-[11px] font-bold text-slate-900 leading-tight">
                Indore Central HQ
              </span>
              <span className="block text-[9.5px] font-mono text-slate-400">
                PSA/L/74/MP/2023/FEB/3/425
              </span>
            </div>

            {/* Render desktop window controls only after hydration */}
            {mounted && typeof window !== 'undefined' && (window as any).desktopAPI && (
              <div className="flex items-center gap-1 ml-2 border-l border-slate-200 pl-3">
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.minimize()}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 transition"
                  title="Minimize"
                >
                  &minus;
                </button>
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.maximize()}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 transition text-xs"
                  title="Maximize"
                >
                  &#9633;
                </button>
                <button
                  type="button"
                  onClick={() => (window as any).desktopAPI.close()}
                  className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-600 hover:text-white text-slate-600 transition text-xs"
                  title="Close to Tray"
                >
                  &#x2715;
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
