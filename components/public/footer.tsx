import Link from 'next/link';
import Image from 'next/image';
import {
  PhoneCall,
  MapPin,
  Mail,
  ShieldCheck,
  FileCheck2,
  ArrowUpRight,
  Star
} from 'lucide-react';

const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/people/Vidhya-Security-Force-And-Housekeeping-Services/100022317112649/',
  instagram: 'https://www.instagram.com/vidhyasecurityforce/',
  googleProfile: 'https://share.google/RfdmOCQNHIRNwqHob',
  googleReview: 'https://g.page/r/Cf6P2tsqzqYBEAI/review',
};

export default function Footer() {
  const serviceLinks = [
    { label: 'Security Guard Services', href: '/services/security-guard' },
    { label: 'Armed Security Guards', href: '/services/armed-gunman' },
    { label: 'Housekeeping Services', href: '/services/housekeeping' },
    { label: 'Bouncers & Event Security', href: '/services/bouncers' },
    { label: 'Factory Gate & Material Control', href: '/services/industrial-gate-material-control' },
    { label: 'Factory Yard & Perimeter Patrol', href: '/services/factory-yard-perimeter-patrol' },
  ];

  const cityLinks = [
    { label: 'Security Guard in Indore', href: '/cities/indore' },
    { label: 'Security Guard in Pithampur', href: '/cities/pithampur' },
    { label: 'Security Guard in Bhopal', href: '/cities/bhopal' },
    { label: 'Security Guard in Dewas', href: '/cities/dewas' },
    { label: 'Security Guard in Ujjain', href: '/cities/ujjain' },
    { label: 'Security Guard in Gwalior', href: '/cities/gwalior' },
    { label: 'Security Guard in Jabalpur', href: '/cities/jabalpur' },
  ];

  return (
    <footer className="relative border-t-2 border-amber-600/60 bg-[#0F172A] text-slate-200 font-sans">
      {/* Top Pre-Footer Dispatch Ribbon */}
      <div className="border-b border-slate-800 bg-[#0A0F1D] py-3.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-heading font-bold uppercase tracking-wider text-slate-100">
              24/7 Operations Control Room Active
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-hindi text-amber-300 text-xs sm:text-sm tracking-wider">
              संरक्षण एवं सुरक्षा — संपूर्ण मध्य प्रदेश
            </span>
            <span className="hidden text-slate-700 sm:inline">|</span>
            <span className="hidden sm:inline font-sans text-slate-300 text-xs">
              PSARA License: <strong className="text-white font-semibold">PSA/L/74/MP/2023/FEB/3/425</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 pb-10 border-b border-slate-800">

          {/* Brand Column (4 Cols) */}
          <div className="space-y-4 lg:col-span-4">
            <div className="flex items-start gap-3.5">
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-slate-900/90 p-1 shadow-md">
                <Image
                  src="/assets/img/logo/logo.png"
                  alt="Vidhya Security Force logo"
                  width={52}
                  height={52}
                  className="h-full w-full object-contain filter drop-shadow-xs"
                />
              </div>
              <div>
                <span className="block font-heading text-base font-black uppercase tracking-tight text-white leading-snug">
                  VIDHYA SECURITY FORCE
                </span>
                <span className="block font-heading text-[11px] font-bold uppercase tracking-widest text-amber-400 mt-0.5">
                  &amp; Housekeeping Services
                </span>
              </div>
            </div>

            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              Govt. PSARA Licensed private security force delivering disciplined armed/unarmed guarding and mechanized corporate housekeeping across all 55 districts of Madhya Pradesh.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vidhya Security Force on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8V13.5h2.5V21h3z" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vidhya Security Force on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={SOCIAL_LINKS.googleProfile}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Vidhya Security Force on Google Maps"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/90 text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <MapPin className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.googleReview}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 text-xs font-semibold text-amber-300 hover:bg-amber-400/20 transition-colors"
              >
                <Star className="h-3.5 w-3.5" />
                Review us on Google
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/compliance"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
                PSARA Compliance (7 Pillars)
              </Link>
              <Link
                href="/certifications"
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-amber-400/50 hover:text-amber-300 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Statutory Vault
              </Link>
            </div>
          </div>

          {/* Guarding & Housekeeping Services (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white border-l-2 border-red-600 pl-2.5 mb-3">
              Guarding &amp; Facility Wings
            </h3>
            <nav aria-label="Services">
              <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
                {serviceLinks.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-slate-300 hover:text-amber-300 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/services" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-semibold pt-1">
                    <span>View All Services</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* MP Coverage (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white border-l-2 border-amber-500 pl-2.5 mb-3">
              Madhya Pradesh Coverage
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Security guard &amp; housekeeping services across Madhya Pradesh, coordinated from Indore:
            </p>
            <nav aria-label="Cities served">
              <ul className="grid grid-cols-1 gap-y-2 text-xs sm:text-sm font-sans">
                {cityLinks.map((city) => (
                  <li key={city.href}>
                    <Link
                      href={city.href}
                      className="text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between group pr-2"
                    >
                      <span className="leading-tight">{city.label}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 text-amber-400 shrink-0 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="pt-2 border-t border-slate-800">
              <Link
                href="/cities"
                className="text-xs font-heading font-bold uppercase text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                View Full MP District Directory &rarr;
              </Link>
            </div>
          </div>

          {/* Operations & Registered Office Desk (2 Cols) */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white border-l-2 border-red-600 pl-2.5 mb-3">
              Operations Control
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm font-sans">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 font-heading">Registered Office</span>
                  <address className="text-slate-200 text-xs leading-relaxed block mt-0.5 not-italic">
                    012, A-Block, EWS Apartment, Treasure Town, Bijalpur, Indore, Madhya Pradesh &bull; 452012
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <PhoneCall className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-400 font-heading">24/7 Helpline</span>
                  <a
                    href="tel:+919826259292"
                    className="font-heading text-xs sm:text-sm font-bold tracking-wider text-white hover:text-amber-300 transition-colors block"
                  >
                    +91 98262 59292
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold uppercase text-slate-400 font-heading">Official Email</span>
                  <a
                    href="mailto:contact@vidhyasecurityforce.in"
                    className="text-xs text-slate-200 hover:text-amber-300 transition-colors break-all font-mono block mt-0.5"
                  >
                    contact@vidhyasecurityforce.in
                  </a>
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5 text-[11px] text-slate-300">
                <span className="text-slate-400 block font-heading uppercase text-[9.5px]">PSARA Govt License:</span>
                <span className="font-semibold text-amber-300 font-mono break-all">PSA/L/74/MP/2023/FEB/3/425</span>
                <span className="text-slate-400 block font-heading uppercase text-[9.5px] mt-2">GSTIN:</span>
                <span className="font-semibold text-slate-100 font-mono break-all">23AQRPD0652Q2ZI</span>
              </div>
            </div>

            <div className="pt-1">
              <Link
                href="/contact"
                className="block w-full rounded-lg bg-red-700 py-2.5 text-center font-heading text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-800 shadow-sm"
              >
                Request Proposal
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal Links Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} Vidhya Security Force &amp; Housekeeping Services. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6">
            <Link href="/privacy" className="hover:text-amber-300 transition-colors underline underline-offset-2">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-amber-300 transition-colors underline underline-offset-2">
              Terms of Service
            </Link>
            <span>&bull;</span>
            <Link href="/compliance" className="hover:text-amber-300 transition-colors underline underline-offset-2">
              PSARA Compliance (7 Pillars)
            </Link>
            <span>&bull;</span>
            <Link href="/certifications" className="hover:text-amber-300 transition-colors underline underline-offset-2">
              Statutory Vault
            </Link>
            <span>&bull;</span>
            <a href="/sitemap.xml" className="hover:text-amber-300 transition-colors underline underline-offset-2">
              Sitemap
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
