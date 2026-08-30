import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Building2,
  CheckCircle2,
  Mail,
  PhoneCall
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | Vidhya Security Force & Housekeeping Services',
  description: 'Learn how Vidhya Security Force collects, protects, and handles client data, site deployment parameters, and statutory records in full compliance with Indian data regulations.',
  alternates: {
    canonical: 'https://vidhyasecurity.com/privacy',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 30, 2026';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Top Context Sub-Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Legal &amp; Compliance</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Data Governance &amp; Privacy Policy</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                Last Updated: {lastUpdated}
              </span>
            </div>
          </div>
        </section>

        {/* Section Header */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
                <Lock className="h-3.5 w-3.5 text-red-700" />
                <span>Client Confidentiality &amp; Data Protection</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Privacy Policy &amp; Security Standards
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Vidhya Security Force &amp; Housekeeping Services is dedicated to safeguarding client premise confidentiality, operational security blueprints, and corporate contact records under the laws of Madhya Pradesh and India.
              </p>
            </div>
          </div>
        </section>

        {/* Document Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">

          {/* Section 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">01</span>
              Information We Collect
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              When requesting guard placements, site risk assessments, or housekeeping services, we collect information necessary to tailor and fulfill operational deployment:
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Contact Details:</strong> Representative name, corporate designation, phone number, and official email address.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Site Information:</strong> Physical premises location, property classification (Industrial, SEZ, Commercial, or Society), shift distribution requirements, and estimated manpower headcount.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Statutory &amp; Invoicing Details:</strong> Company legal entity name, GSTIN (for Input Tax Credit reconciliation), and billing dispatch addresses.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">02</span>
              How Your Information Is Used
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              All data collected is used solely for legitimate operational execution and legal compliance:
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Formulating tailored guard post schedules, shift rosters, and cost proposals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Coordinating on-site risk surveys with our field operations inspectors.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Generating statutory monthly wage sheets, EPF passbook credits, and ESIC vouchers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>We do not sell, rent, or lease your private information or commercial proposals to any third-party marketing networks.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">03</span>
              Confidentiality of Premise Blueprints
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Security post orders, CCTV layout designs, access control diagrams, and gate pass protocols shared with Vidhya Security Force are treated as confidential operational intelligence. Access is restricted strictly to authorized Field Officers, Operations Managers, and assigned sentry personnel.
            </p>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">04</span>
              Statutory Disclosure Obligations
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              As a PSARA-licensed agency under the Home Department, Government of Madhya Pradesh, we maintain mandatory police verification files and labor registers. We may disclose relevant operational information only if required by a court of law, police inquiry, or authorized labor inspection department.
            </p>
          </div>

          {/* Section 5 - Contact & Grievance */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8 text-white shadow-panel space-y-4">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-700 text-white text-xs font-mono">05</span>
              Privacy Officer &amp; Contact Desk
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              If you have any questions or data clarification requests regarding our privacy standards or confidential protocols, please contact our administrative desk:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Email Inquiry</span>
                <a href="mailto:contact@vidhyasecurityforce.in" className="font-mono text-amber-300 hover:underline block truncate">
                  contact@vidhyasecurityforce.in
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Control Room</span>
                <a href="tel:+919826259292" className="font-heading text-amber-300 hover:underline block font-bold">
                  +91 98262 59292
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Operational Office: 012, A-Block, EWS Apartment, Treasure Town, Bijalpur, Indore, Madhya Pradesh &bull; 452012
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
