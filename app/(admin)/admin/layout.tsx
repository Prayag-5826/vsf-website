'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PhoneCall,
  FileCheck2,
  ExternalLink,
  LogOut,
  MapPin,
  ShieldAlert,
  Globe
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{ name?: string; role?: string } | null>(null);

  useEffect(() => {
    // 1. Verify Active Session (Cookie or Local Storage fallback)
    const localUser = localStorage.getItem('vs_active_user');
    const hasCookie = document.cookie.includes('vsf_user_session');

    if (!localUser && !hasCookie) {
      const currentUrl = encodeURIComponent(window.location.href);
      window.location.href = `/login?redirect=${currentUrl}`;
      return;
    }

    if (localUser) {
      try {
        setCurrentUser(JSON.parse(localUser));
      } catch {
        // Fallback for parsing edge cases
      }
    }

    setIsAuthorized(true);
  }, []);

  const handleUniversalLogout = () => {
    const isProd = typeof window !== 'undefined' && window.location.hostname.endsWith('vidhyasecurityforce.in');
    const domainAttr = isProd ? '; domain=.vidhyasecurityforce.in' : '';

    // Clear wildcard cross-subdomain tokens
    document.cookie = `vsf_universal_token=; path=/${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;
    document.cookie = `vsf_user_session=; path=/${domainAttr}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`;

    // Clear client-side storage cache
    localStorage.removeItem('vs_token');
    localStorage.removeItem('vs_active_user');

    // Hard redirect directly to login gateway
    window.location.href = '/login';
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-3 border-red-700/20 border-t-red-700 rounded-full animate-spin" />
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-500">
          Authorizing Command Desk Session...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#FBFBF9] text-slate-900 font-sans antialiased selection:bg-red-700 selection:text-white">

      {/* Desktop Executive Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex shadow-xs z-20">
        <div className="space-y-6">

          {/* Agency Official Brand Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="h-11 w-11 rounded-2xl bg-white border-2 border-amber-400 p-1 flex items-center justify-center shadow-md shadow-red-900/10 shrink-0">
              <Image
                src="/assets/img/logo/logo.png"
                alt="VSF Emblem"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="block font-black text-xs uppercase tracking-wider text-red-700 truncate">
                Vidhya Security
              </span>
              <span className="block font-mono text-[9.5px] font-bold text-amber-800 uppercase tracking-widest truncate">
                {currentUser?.name || 'Owner Command Desk'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-bold">
            <Link
              href="/admin"
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition ${
                pathname === '/admin'
                  ? 'bg-red-50 text-red-700 border border-red-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className={`h-4 w-4 ${pathname === '/admin' ? 'text-red-700' : 'text-slate-400'}`} />
              <span>Lead Intake &amp; Pipeline</span>
            </Link>

            <Link
              href="/admin/telecaller"
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition ${
                pathname === '/admin/telecaller'
                  ? 'bg-red-50 text-red-700 border border-red-200 shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PhoneCall className={`h-4 w-4 ${pathname === '/admin/telecaller' ? 'text-red-700' : 'text-emerald-600'}`} />
                <span>Speed Dialer Desk</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-red-700 text-[9px] font-mono font-bold text-white uppercase">
                Live
              </span>
            </Link>

            <Link
              href="/compliance"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <div className="flex items-center gap-2.5">
                <FileCheck2 className="h-4 w-4 text-slate-400" />
                <span>PSARA Compliance Vault</span>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </Link>
          </nav>

          {/* Field Operations Portal SSO Launcher */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-900 uppercase tracking-wider">
              <ShieldAlert size={12} className="text-red-600" />
              <span>Field Ops Module</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Manage live guard attendance, GPS tracking, and site inspection rosters.
            </p>
            <a
              href="https://field.vidhyasecurityforce.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center justify-between w-full px-3 py-2 bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber-300" />
                <span>Field Portal</span>
              </div>
              <ExternalLink className="h-3 w-3 text-red-200" />
            </a>
          </div>

        </div>

        {/* Agency Footer Badge & Unified Sign Out */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <div className="px-2 text-[11px] text-slate-500 space-y-0.5">
            <span className="block text-slate-800 font-bold">Indore Central HQ</span>
            <span className="font-mono text-[9.5px] font-semibold text-red-700 block">
              PSA/L/74/MP/2023/FEB/3/425[cite: 5]
            </span>
          </div>

          <div className="pt-1 flex flex-col space-y-1">
            <Link
              href="/"
              className="flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition rounded-lg hover:bg-slate-50"
            >
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Public Website</span>
            </Link>

            <button
              type="button"
              onClick={handleUniversalLogout}
              className="flex items-center gap-2 px-2 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition rounded-lg hover:bg-red-50 text-left w-full cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Universal Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile Navigation Header */}
        <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs sticky top-0 z-30">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white border-2 border-amber-400 p-0.5 flex items-center justify-center">
              <Image
                src="/assets/img/logo/logo.png"
                alt="VSF Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="font-black text-xs uppercase tracking-wider text-red-700">
              VSF Admin
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <a
              href="https://field.vidhyasecurityforce.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-red-700 text-white rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1"
            >
              <MapPin size={10} className="text-amber-300" />
              <span>Field</span>
            </a>
            <button
              onClick={handleUniversalLogout}
              className="p-1.5 text-slate-500 hover:text-red-600"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Viewport */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}
