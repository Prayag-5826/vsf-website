import Link from 'next/link';
import { PhoneCall, ArrowRight, MapPin } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="bg-slate-50 py-14 sm:py-16 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0F172A] px-6 py-10 sm:px-12 sm:py-14 shadow-xl border border-slate-800">
          {/* Subtle Accent Background Grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left space-y-3">
              <div className="inline-flex items-center gap-2 rounded-md bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-xs font-heading font-bold uppercase tracking-wider text-amber-300">
                <MapPin className="h-3.5 w-3.5" />
                <span>Active Across All 55 Districts of MP</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Need Immediate Security Deployment?
              </h2>

              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
                PSARA-certified industrial guards, armed security sentries, and corporate facility housekeeping teams deployed within 24 to 48 hours anywhere in Madhya Pradesh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto shrink-0">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-800 transition-colors"
              >
                <span>Request Fast Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259292"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800/80 px-5 py-3.5 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>+91 98262 59292</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
