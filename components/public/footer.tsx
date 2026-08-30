import Link from 'next/link';
import Image from 'next/image';
import {
  PhoneCall,
  MapPin,
  Mail,
  ShieldCheck,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';

export default function Footer() {
  const mpDivisions = [
    { name: 'Indore & Pithampur', slug: 'indore' },
    { name: 'Bhopal & Mandideep', slug: 'bhopal' },
    { name: 'Ujjain & Dewas', slug: 'ujjain' },
    { name: 'Gwalior & Chambal', slug: 'gwalior' },
    { name: 'Jabalpur Industrial', slug: 'jabalpur' },
    { name: 'Ratlam & Mandsaur', slug: 'ratlam' },
    { name: 'Sagar & Damoh', slug: 'sagar' },
    { name: 'Rewa & Satna', slug: 'rewa' },
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
                  alt="VSF Logo"
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
            <ul className="space-y-2.5 text-xs sm:text-sm font-sans">
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-300 transition-colors">
                  Industrial &amp; Factory Gate Security
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-300 transition-colors">
                  Corporate Housekeeping &amp; Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-300 transition-colors">
                  Armed &amp; Unarmed Guarding
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-300 transition-colors">
                  VIP Bouncers &amp; Event Marshals
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-300 hover:text-amber-300 transition-colors">
                  Township &amp; Commercial Complex Sentry
                </Link>
              </li>
              <li>
                <Link href="/compliance" className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1 font-semibold pt-1">
                  <span>PSARA Statutory Governance</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* MP Coverage (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white border-l-2 border-amber-500 pl-2.5 mb-3">
              Madhya Pradesh Coverage
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Active deployments across all 55 MP Districts &amp; Corridors:
            </p>
            <div className="grid grid-cols-1 gap-y-2 text-xs sm:text-sm font-sans">
              {mpDivisions.map((div) => (
                <Link
                  key={div.slug}
                  href={`/cities/${div.slug}`}
                  className="text-slate-300 hover:text-amber-300 transition-colors flex items-center justify-between group pr-2"
                >
                  <span className="leading-tight">{div.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-amber-400 shrink-0 transition-opacity" />
                </Link>
              ))}
            </div>
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
                  <span className="text-slate-200 text-xs leading-relaxed block mt-0.5">
                    012, A-Block, Treasure Town, Bijalpur, Indore, MP &bull; 452012
                  </span>
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
          </div>
        </div>

      </div>
    </footer>
  );
}
