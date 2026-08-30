'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  ArrowRight,
  FileCheck2,
  MapPin
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Certifications', href: '/certifications' },
    { label: 'MP Coverage', href: '/cities' },
    { label: 'PSARA Compliance', href: '/compliance' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-xs">
      {/* Top Utility Ribbon */}
      <div className="bg-[#0F172A] px-3 py-1 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 text-[10.5px] sm:text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <ShieldCheck className="h-3 w-3 text-amber-400 shrink-0" />
            <span className="font-sans font-medium text-slate-200 truncate">
              Govt. Licensed &bull; PSARA Certified MP
            </span>
          </div>

          <div className="hidden md:block">
            <span className="font-hindi text-xs text-amber-300 tracking-wider">
              संरक्षण एवं सुरक्षा — संपूर्ण मध्य प्रदेश
            </span>
          </div>

          <div className="shrink-0">
            <a
              href="tel:+919826259292"
              className="inline-flex items-center gap-1 font-sans font-semibold text-white hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="h-3 w-3 text-amber-400" />
              <span>+91 98262 59292</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-3.5 py-2 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
          <div className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0">
            <Image
              src="/assets/img/logo/logo.png"
              alt="VSF Logo"
              width={96}
              height={96}
              quality={100}
              priority
              className="h-full w-full object-contain filter drop-shadow-xs"
            />
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span className="font-heading text-xs sm:text-base font-black uppercase tracking-tight text-[#0F172A] leading-none group-hover:text-red-700 transition-colors truncate">
              VIDHYA SECURITY FORCE
            </span>
            <span className="font-heading text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-amber-600 leading-tight mt-0.5 truncate">
              &amp; Housekeeping Services
            </span>
          </div>
        </Link>

        {/* Desktop Links (Visible on screens >= 1024px) */}
        <div className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-2.5 py-1.5 font-sans text-xs font-semibold tracking-wide transition-colors rounded-md ${
                  isActive
                    ? 'bg-slate-100 text-red-700 font-bold'
                    : 'text-slate-700 hover:text-red-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right CTA + Mobile Hamburger Button */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/contact"
            className="rounded-md bg-red-700 px-3 py-1.5 sm:px-4 sm:py-2 font-heading text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-800 shadow-xs whitespace-nowrap"
          >
            Deploy Guards
          </Link>

          {/* Mobile Hamburger Toggle (Visible on mobile/tablet) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-[#0F172A] transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5 text-red-700" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-sans font-semibold transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-red-50 text-red-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-700'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-3.5 w-3.5 text-red-700" />
              <a href="tel:+919826259292" className="font-bold text-[#0F172A]">
                +91 98262 59292 (24/7 Helpline)
              </a>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>Headquarters: Indore, Madhya Pradesh</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
