import { Navbar } from '@/components/public/navbar';
import { HeroSection } from '@/components/public/hero-section';
import Footer from '@/components/public/footer';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Building2,
  Sparkles,
  UserCheck,
  Clock,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const serviceHighlights = [
    {
      title: 'Industrial & Factory Gate Security',
      desc: 'Armed and unarmed gate sentries, material movement registers, vehicle frisking, and boundary perimeter guards.',
      icon: ShieldCheck,
      href: '/services#industrial',
    },
    {
      title: 'Mechanized Facility & Housekeeping',
      desc: 'Corporate janitorial teams, industrial floor scrubber operations, washroom sanitization, and waste management.',
      icon: Sparkles,
      href: '/services#housekeeping',
    },
    {
      title: 'VIP Protection & Event Bouncers',
      desc: 'Trained physical protection officers, crowd control marshals, and VIP escorts for high-profile MP events.',
      icon: UserCheck,
      href: '/services#bouncers',
    },
    {
      title: 'Commercial & Township Guarding',
      desc: '24/7 security desks for residential societies, hospitals, educational institutions, and retail malls.',
      icon: Building2,
      href: '/services#commercial',
    },
  ];

  const mpDistricts = [
    'Indore & Pithampur',
    'Bhopal & Mandideep',
    'Ujjain & Dewas',
    'Gwalior & Chambal',
    'Jabalpur Industrial',
    'Ratlam & Mandsaur',
    'Sagar & Damoh',
    'Rewa & Satna',
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Statutory & Trust Credentials Strip */}
        <section className="border-y border-slate-200 bg-[#F8FAFC] py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-red-700 shrink-0" />
                <div>
                  <div className="font-heading text-xs font-black uppercase text-[#0F172A]">PSARA Licensed</div>
                  <div className="font-sans text-[11px] text-slate-500">MP Home Dept. Approved</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileCheck2 className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                  <div className="font-heading text-xs font-black uppercase text-[#0F172A]">100% Compliant</div>
                  <div className="font-sans text-[11px] text-slate-500">EPF, ESIC &amp; Minimum Wages</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-red-700 shrink-0" />
                <div>
                  <div className="font-heading text-xs font-black uppercase text-[#0F172A]">24/7 Field QRT</div>
                  <div className="font-sans text-[11px] text-slate-500">Active Mobile Night Audits</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-amber-600 shrink-0" />
                <div>
                  <div className="font-heading text-xs font-black uppercase text-[#0F172A]">55 MP Districts</div>
                  <div className="font-sans text-[11px] text-slate-500">Statewide Deployment Hubs</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Core Services & Facility Management Bento */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-14">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                Statewide Deployment Wings
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0F172A]">
                Guarding &amp; Mechanized Facility Solutions
              </h2>
              <p className="mt-3 font-sans text-sm sm:text-base text-slate-600">
                Supplying verified, disciplined manpower trained for high-risk industrial units, corporate IT hubs, hospitals, and commercial properties.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {serviceHighlights.map((svc, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-xs flex flex-col justify-between hover:border-red-700/40 hover:shadow-subtle transition-all"
                >
                  <div>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F172A] text-amber-400">
                      <svc.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base font-bold uppercase tracking-tight text-[#0F172A] mb-2">
                      {svc.title}
                    </h3>
                    <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-slate-200">
                    <Link
                      href={svc.href}
                      className="inline-flex items-center gap-1 text-xs font-heading font-bold uppercase tracking-wider text-red-700 hover:text-red-800"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Director & Operational Foundation Snapshot */}
        <section className="border-t border-slate-200 bg-[#F8FAFC] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

              {/* Director Portrait Mini-Card */}
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-[280px] overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-panel text-center">
                  <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src="/assets/img/team/director-anil-dhariwal.webp"
                      alt="Director Anil Dhariwal"
                      fill
                      sizes="280px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="pt-3">
                    <h3 className="font-heading text-base font-black uppercase text-[#0F172A]">Mr. Anil Dhariwal</h3>
                    <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-red-700">Director &amp; Operations Head</p>
                  </div>
                </div>
              </div>

              {/* Bio Highlights */}
              <div className="lg:col-span-8 space-y-4">
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block">
                  18+ Years Leadership &bull; Madhya Pradesh
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                  Disciplined Manpower Under Strict Supervisory Command
                </h2>
                <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                  Every guard and facility worker deployed by Vidhya Security Force &amp; Housekeeping Services undergoes complete police verification, biometric registration, and systematic fire-safety training.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Zero Absenteeism with Guaranteed Backup
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Direct Monthly EPF &amp; ESIC Proofs
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Surprise Midnight Field Officer Audits
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Instant Emergency Quick Response (QRT)
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 rounded bg-[#0F172A] px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition-colors"
                  >
                    <span>Read Full Force Leadership Dossier</span>
                    <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 6. Statewide MP Coverage Grid */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                  Jurisdiction &amp; Territory
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                  All 55 Districts of Madhya Pradesh
                </h2>
              </div>
              <Link
                href="/cities"
                className="font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:underline underline-offset-4"
              >
                View Complete MP Deployment Outpost Directory &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {mpDistricts.map((district, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-3.5 text-center font-sans text-xs sm:text-sm font-semibold text-slate-700"
                >
                  {district}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Institutional Deployment Action Strip */}
        <section className="border-t border-slate-200 bg-[#0F172A] py-12 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Quick Commercial Mobilization
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight">
                  Request Security Force or Facility Proposal
                </h2>
                <p className="font-sans text-xs sm:text-sm text-slate-300 mt-1">
                  Get customized guard deployment plans, statutory compliance rate sheets, and SLA documentation within 24 hours.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                <Link
                  href="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
                >
                  <span>Request Deployment</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+919826259292"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800/90 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
                >
                  <PhoneCall className="h-4 w-4 text-amber-400" />
                  <span>+91 98262 59292</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 8. Global Footer */}
      <Footer />
    </div>
  );
}
