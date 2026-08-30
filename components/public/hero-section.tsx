import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Users,
  Building2,
  Award,
  Clock
} from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] text-white">
      {/* Background Image: Hero Guard */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/img/hero/hero-guard.webp"
          alt="Vidhya Security Force Guard On Site"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] lg:object-right opacity-40 lg:opacity-60"
        />

        {/* Text Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-transparent lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-[#0F172A]/40" />

        {/* Subtle Tech Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Regulatory Badge */}
            <div className="inline-flex items-center gap-2 rounded border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 font-heading text-xs font-bold uppercase tracking-wider text-amber-300 backdrop-blur-xs">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>PSARA Licensed &bull; MP Home Dept. Approved</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-3xl font-black uppercase tracking-tight text-white sm:text-5xl lg:text-[46px] leading-[1.15]">
              Disciplined Security &amp; Facility Guarding Across MP
            </h1>

            {/* Subtext */}
            <p className="max-w-2xl font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
              We deploy certified armed/unarmed guards, corporate bouncers, and facility housekeeping teams across Indore, Bhopal, and all 55 districts of Madhya Pradesh with guaranteed EPF/ESIC compliance.
            </p>

            {/* High-Contrast Verification Pills */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-w-2xl text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 backdrop-blur-xs">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-sans font-medium text-slate-100">
                  100% EPF, ESIC &amp; GST Compliant
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 backdrop-blur-xs">
                <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-sans font-medium text-slate-100">
                  Ex-Servicemen &amp; Verified Civilians
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 backdrop-blur-xs">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-sans font-medium text-slate-100">
                  Active in All 55 MP Districts
                </span>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 backdrop-blur-xs">
                <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-sans font-medium text-slate-100">
                  24/7 QRT &amp; Night Supervision
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-red-800"
              >
                <span>Request Deployment Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259292"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800/80 px-5 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white backdrop-blur-xs transition-all hover:bg-slate-700"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>+91 98262 59292</span>
              </a>
            </div>
          </div>
        </div>

        {/* Operational Metrics Ribbon */}
        <div className="mt-12 grid grid-cols-2 gap-4 border-t border-slate-800 pt-8 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-amber-400 shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-extrabold text-white">350+</div>
              <div className="font-sans text-[11px] text-slate-400">Active Duty Guards</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-amber-400 shrink-0">
              <Building2 className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-extrabold text-white">80+</div>
              <div className="font-sans text-[11px] text-slate-400">Client Deployments</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-amber-400 shrink-0">
              <Award className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-extrabold text-white">100%</div>
              <div className="font-sans text-[11px] text-slate-400">Statutory Compliant</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 p-2 text-amber-400 shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="font-heading text-lg sm:text-xl font-extrabold text-white">15 Min</div>
              <div className="font-sans text-[11px] text-slate-400">QRT Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
