import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import { DirectorPortrait } from '@/components/public/DirectorPortrait';

export const metadata: Metadata = {
  title: 'About Us | Vidhya Security Force & Housekeeping Services MP',
  description:
    'Learn about Vidhya Security Force (VSF), Madhya Pradesh Home Department PSARA-licensed security and facility agency led by Director Anil Dhariwal.',
  alternates: {
    canonical: 'https://vidhyasecurityforce.in/about',
  },
  openGraph: {
    title: 'About Vidhya Security Force & Housekeeping Services',
    description:
      'Govt PSARA-licensed security and mechanized facility agency serving commercial, industrial, and institutional premises across all 55 MP districts.',
    url: 'https://vidhyasecurityforce.in/about',
    type: 'website',
  },
};

export default function AboutPage() {
  const credentials = [
    { label: 'PSARA License No.', value: 'PSA/L/74/MP/2023/FEB/3/425' },
    { label: 'Labour Commissioner Reg.', value: 'INDO220426SE009839' },
    { label: 'EPF Establishment Code', value: 'MPIND1462732000' },
    { label: 'ESIC Corporate Code', value: '18000237700000999' },
    { label: 'GSTIN Registration', value: '23AQRPD0652Q2ZI' },
    { label: 'Professional Tax (PT)', value: '79479022051' },
    { label: 'Income Tax PAN', value: 'AQRPD0652Q' },
    { label: 'Headquarters Location', value: '012 A Block, Treasure Town, Indore (M.P.)' },
  ];

  const milestones = [
    {
      year: '2014',
      title: 'Agency Foundation',
      desc: 'Founded under the leadership of Mr. Anil Dhariwal with a mission to deliver disciplined guarding and ethical statutory compliance.',
    },
    {
      year: '2017',
      title: 'SEZ & Industrial Expansion',
      desc: 'Mobilized round-the-clock factory sentry and material gate-inward control squads across the Pithampur and Sanwer Road industrial corridors.',
    },
    {
      year: '2020',
      title: 'Mechanized Facility Division',
      desc: 'Launched corporate industrial janitorial operations, auto-scrubber fleets, and hospital sanitization protocols.',
    },
    {
      year: '2023',
      title: 'Statewide PSARA License Renewal',
      desc: 'Certified under the Madhya Pradesh Private Security Agencies (Regulation) Act with full authority to deploy across all 55 districts.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Sub-Header Context Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Company Profile &amp; Leadership</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                PSARA State-Wide License Valid Thru 2027
              </span>
            </div>
          </div>
        </section>

        {/* Command Hero Section */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>About Vidhya Security Force &amp; Housekeeping Services</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Protection, Discipline &amp; Sincere Service Across Madhya Pradesh
              </h1>

              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Headquartered in Indore, Vidhya Security Force is a government-certified security and mechanized facility agency. We provide police-verified static guards, armed sentries, quick-reaction patrol squads, and mechanized housekeeping teams to industrial corridors, commercial complexes, banks, and gated communities.
              </p>
            </div>

            {/* Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Statewide Reach</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">55 MP Districts</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">100% PSARA Licensed</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Supervisory Command</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">24/7 Mobile QRT</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">Midnight Surprise Checks</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Statutory Standard</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">100% EPF &amp; ESIC</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Zero Client Liability</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Leadership Experience</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">10+ Years</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">Led by Anil Dhariwal</div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

          {/* Director Profile & Operational Philosophy */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-full max-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-md text-center">
                  <DirectorPortrait />
                  <div className="pt-3">
                    <h3 className="font-heading text-base font-black uppercase text-[#0F172A]">Anil Dhariwal</h3>
                    <p className="font-heading text-[10px] font-bold uppercase tracking-widest text-red-700">Managing Director &amp; Founder</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block">
                  Message from Central Command
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                  &ldquo;Your Security Is Our Sacred Responsibility&rdquo;
                </h2>
                <div className="space-y-3 font-sans text-sm text-slate-600 leading-relaxed text-justify">
                  <p>
                    &ldquo;In our line of work, there is no margin for error. A security gate sentry or night patrolling guard is often the sole line of defense protecting valuable inventory, machinery, and lives. When clients partner with Vidhya Security Force, they are not just hiring manpower—they are securing total peace of mind.&rdquo;
                  </p>
                  <p>
                    &ldquo;We have built our agency on two unshakeable pillars: rigorous discipline on the ground, and strict statutory compliance on paper. Every staff member deployed receives full statutory benefits, provident fund deposits, and ESIC healthcare coverage. This eliminates operational friction and guarantees genuine vigilance.&rdquo;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Direct Collect-and-Pay Salary Transparency
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Biometric KYC &amp; Verification Checks
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    24/7 Mobile Escalation Response
                  </div>
                  <div className="flex items-center gap-2 text-xs font-sans font-medium text-slate-800">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                    Mandatory Industrial PPE &amp; 5S Training
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Official Statutory Accreditations Matrix */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block">
                Government Compliance Directory
              </span>
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Certified Legal Registrations &amp; Licenses
              </h2>
              <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vidhya Security Force operates under full certification by the Government of Madhya Pradesh, safeguarding our principal clients from labor liabilities or statutory penalties:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {credentials.map((cred, idx) => (
                <div key={idx} className="rounded-xl bg-slate-50 p-4 border border-slate-200/80">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                    {cred.label}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900 block mt-1 break-all">
                    {cred.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Company Journey Timeline */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
            <div className="max-w-3xl space-y-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block">
                Institutional Track Record
              </span>
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Our Growth &amp; Milestones
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {milestones.map((m, idx) => (
                <div key={idx} className="space-y-2 relative border-l-2 border-red-700 pl-4 md:border-l-0 md:border-t-2 md:pt-4 md:pl-0">
                  <span className="font-mono text-sm font-black text-red-700 block">{m.year}</span>
                  <h3 className="font-heading text-sm font-bold uppercase text-[#0F172A]">{m.title}</h3>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Immediate Contact & Mobilization Banner */}
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Direct Operational Consultation
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Speak With Central Operations Today
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Schedule a site survey or receive an official statutory PSARA-compliant rate docket for your commercial or industrial establishment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
              >
                <span>Request Proposal</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259020"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 px-5 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>+91 98262 59020</span>
              </a>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
