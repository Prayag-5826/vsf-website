'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { Lock, Mail, Loader2, ArrowLeft, KeyRound, ShieldAlert } from 'lucide-react';

function LoginForm() {
  const [identifier, setIdentifier] = useState('admin@vidhyasecurityforce.in');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://czbohynimtodyhlftbbn.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6Ym9oeW5pbXRvZHlobGZ0YmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNDQ3MjUsImV4cCI6MjA4MzYyMDcyNX0.z0dIYr7AQ4_BMS--QaiBPUAgTYRGPC3oWzRi4aB2UyA'
  );

  const setCookiesAndProceed = (token: string, user: any) => {
    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('vidhyasecurityforce.in');
    const domainAttr = isProduction ? '; domain=.vidhyasecurityforce.in' : '';
    const maxAge = 60 * 60 * 24 * 7;

    document.cookie = `vsf_universal_token=${encodeURIComponent(token)}; path=/${domainAttr}; max-age=${maxAge}; SameSite=Lax; ${isProduction ? 'Secure' : ''}`;
    document.cookie = `vsf_user_session=${encodeURIComponent(JSON.stringify(user))}; path=/${domainAttr}; max-age=${maxAge}; SameSite=Lax; ${isProduction ? 'Secure' : ''}`;

    localStorage.setItem('vs_token', token);
    localStorage.setItem('vs_active_user', JSON.stringify(user));

    if (redirectUrl && (redirectUrl.startsWith('https://field.vidhyasecurityforce.in') || redirectUrl.startsWith('http://localhost'))) {
      window.location.href = redirectUrl;
    } else {
      // Force hard browser redirect to clear hanging Next.js router states
      window.location.assign('/admin');
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const cleanInput = identifier.trim();

    try {
      // 1. Direct Table Verification (public.users)
      const { data: userRecord, error: userError } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${cleanInput},email.eq.${cleanInput},phone.eq.${cleanInput}`)
        .maybeSingle();

      if (!userError && userRecord) {
        if (userRecord.status === 'BLOCKED' || userRecord.status === 'SUSPENDED') {
          setErrorMessage(`Account access suspended: ${userRecord.block_reason || 'Contact Operations Director.'}`);
          setLoading(false);
          return;
        }

        if (userRecord.password === password) {
          const sessionPayload = {
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            phone: userRecord.phone,
            role: userRecord.role,
            avatar: userRecord.avatar || '/assets/img/logo/logo.png',
            status: userRecord.status,
          };
          setCookiesAndProceed(`token-${userRecord.id}-${Date.now()}`, sessionPayload);
          return;
        } else {
          setErrorMessage('Invalid security master passkey.');
          setLoading(false);
          return;
        }
      }

      // 2. Fallback: Supabase Auth Verification
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanInput,
        password,
      });

      if (!authError && authData?.session) {
        setCookiesAndProceed(authData.session.access_token, authData.user);
        return;
      }

      setErrorMessage('User record not found in central database or credentials incorrect.');
    } catch (err: any) {
      setErrorMessage(err.message || 'HQ network connection failure. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white border-2 border-amber-100/80 rounded-3xl shadow-[0_20px_45px_-15px_rgba(185,28,28,0.08)] p-8 sm:p-10 z-10">

      {/* VSF Header Logo Area */}
      <div className="flex flex-col items-center text-center mb-7 space-y-3">
        <div className="w-20 h-20 p-2 bg-white border-2 border-amber-400 rounded-2xl flex items-center justify-center shadow-md shadow-red-900/10">
          <Image
            src="/assets/img/logo/logo.png"
            alt="Vidhya Security Force Logo"
            width={68}
            height={68}
            className="object-contain"
            priority
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-sm font-black text-red-700 uppercase tracking-wider">
            Vidhya Security Force
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[10px] font-mono font-bold text-amber-900 uppercase tracking-widest">
            <ShieldAlert size={12} className="text-red-600" />
            <span>Unified Operations Gateway</span>
          </div>
        </div>
      </div>

      {/* Error Message Alert Box */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2 shadow-xs">
          <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Authentication Form Block */}
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Admin ID / Official Email
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-amber-600 transition-colors group-focus-within:text-red-700" />
            </div>
            <input
              type="text"
              required
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin@vidhyasecurityforce.in"
              className="w-full bg-[#FBFBF9] border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-700/10 focus:border-red-700 focus:bg-white transition font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
            Security Master Passkey
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-amber-600 transition-colors group-focus-within:text-red-700" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#FBFBF9] border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-700/10 focus:border-red-700 focus:bg-white transition font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-black py-3 px-4 rounded-xl text-xs uppercase tracking-widest shadow-md shadow-red-700/20 hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
              <span>Authorizing Master Session...</span>
            </>
          ) : (
            <>
              <KeyRound className="w-4 h-4 text-amber-300" />
              <span>Initialize Secure Access</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Subtext */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center gap-1.5 text-center">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-[#1E3A8A] uppercase tracking-wider">
          <span>संरक्षण एवं सुरक्षा &bull; PSARA MP Licensed</span>
        </div>
        <p className="text-[10px] text-slate-400 font-mono">
          Shared SSO node for vidhyasecurityforce.in &amp; field portal
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">

      {/* Brand Backlight Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-red-100/40 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-100/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Return Navigation */}
      <div className="w-full max-w-md mb-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-700 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Public Portal
        </Link>
      </div>

      <Suspense fallback={<div className="text-xs font-bold text-slate-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading portal gateway...</div>}>
        <LoginForm />
      </Suspense>

    </div>
  );
}
