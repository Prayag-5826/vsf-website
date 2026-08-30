import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Mail,
  PhoneCall
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Terms of Service | Vidhya Security Force & Housekeeping Services',
  description: 'Standard operating terms, deployment parameters, statutory labor compliance rules, and payment schedules for security guarding and facility management services across Madhya Pradesh.',
  alternates: {
    canonical: 'https://vidhyasecurity.com/terms',
  },
};

export default function TermsOfServicePage() {
  const lastUpdated = 'August 30, 2026';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* Top Context Sub-Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Legal &amp; Governance</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Service Agreement &amp; Operating Terms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                Effective Date: {lastUpdated}
              </span>
            </div>
          </div>
        </section>

        {/* Header Section */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
                <Scale className="h-3.5 w-3.5 text-red-700" />
                <span>Statutory Guarding &amp; Facility Operations Agreement</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Terms of Service
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                These terms govern all manpower placement proposals, static guarding deployments, executive bouncer contracts, armed escort assignments, and mechanized housekeeping services rendered by Vidhya Security Force &amp; Housekeeping Services.
              </p>
            </div>
          </div>
        </section>

        {/* Terms Content Body */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">

          {/* Section 1 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">01</span>
              Scope of Deployment &amp; Authority
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Vidhya Security Force provides verified physical security personnel, armed gunmen, VIP bouncers, gatehouse controllers, and facility cleaning teams strictly within the authorized regulatory framework of the Private Security Agencies (Regulation) Act, 2005 (PSARA) and the Madhya Pradesh Private Security Agencies Rules, 2012.
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Post Orders:</strong> Guarding duties are executed according to mutually agreed site post instructions (e.g., access control, visitor registers, perimeter patrolling, inward/outward vehicle checks).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Shift Timings:</strong> Standard operating shifts operate on 8-hour or 12-hour continuous rotations with mandatory weekly off-relief rosters maintained by our field supervisors.</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">02</span>
              Statutory Compliance &amp; Zero Client Liability
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              As an established, compliant contractor, Vidhya Security Force assumes full responsibility as the direct employer of all deployed staff:
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Social Security Contributions:</strong> We ensure 100% direct monthly remittance of Provident Fund (EPFO Code: MPIND1462732000) and Employee State Insurance (ESIC Code: 18000237700000999).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Minimum Wage Adherence:</strong> Personnel wage disbursements strictly comply with the latest gazetted Minimum Wages published by the Labour Department, Government of Madhya Pradesh.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Police Verification:</strong> Every deployed sentry undergoes local police character verification, residential KYC checks, and mandatory PSARA syllabus training.</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">03</span>
              Billing, Invoicing &amp; Payment Schedules
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              All commercial terms, invoice structures, and payment timelines follow standardized corporate practices:
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Billing Cycle:</strong> Invoices are generated monthly on or before the 1st week of each month based on biometric or register attendance sheets certified by the client.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Compliance Enclosures:</strong> Invoices are accompanied by statutory bank payment proof, EPF/ESIC monthly ECR challans, and GST return filings (GSTIN: 23AQRPD0652Q2ZI).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Payment Terms:</strong> Invoices are payable within the agreed credit window (standard: 7 to 15 calendar days from submission) via direct electronic bank transfer (NEFT / RTGS).</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">04</span>
              Client Responsibilities &amp; Site Facilities
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              To ensure optimal security and facility standards, the client agrees to:
            </p>
            <ul className="space-y-2 pt-2 text-xs font-sans text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Provide adequate basic amenities including access to clean drinking water, sanitation facilities, and shelter/cabin arrangements for static gate posts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Notify the Operations Desk in advance of any temporary surge requirements, shift modifications, or emergency event escalations.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Refrain from directly employing or soliciting staff deployed by Vidhya Security Force during the active agreement and for a period of 12 months following termination.</span>
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">05</span>
              Supervision, Audits &amp; Replacements
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              We operate an active field inspection network with surprise visits scheduled between 2:00 AM and 5:00 AM across all shifts. If any guard fails to maintain uniform discipline or alert standing, we provide an immediate replacement within 24 hours of notification at no additional cost.
            </p>
          </div>

          {/* Section 6 */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-3">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-50 text-red-700 text-xs font-mono">06</span>
              Agreement Duration &amp; Notice Period
            </h2>
            <p className="font-sans text-sm text-slate-600 leading-relaxed">
              Standard commercial service contracts are executed for an annual tenure of 12 months and renew automatically unless terminated by either party with a formal 30-day written notice.
            </p>
          </div>

          {/* Section 7 - Legal Jurisdiction */}
          <div className="rounded-2xl border border-slate-800 bg-[#0F172A] p-6 sm:p-8 text-white shadow-panel space-y-4">
            <h2 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-red-700 text-white text-xs font-mono">07</span>
              Governing Law &amp; Legal Jurisdiction
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              All agreements, service engagements, and legal notices shall be governed by and interpreted in accordance with the laws of the State of Madhya Pradesh and the Republic of India. Any disputes arising out of or related to our services shall be subject to the exclusive jurisdiction of the competent courts in <strong>Indore, Madhya Pradesh</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs font-sans">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Legal Inquiries</span>
                <a href="mailto:contact@vidhyasecurityforce.in" className="font-mono text-amber-300 hover:underline block truncate">
                  contact@vidhyasecurityforce.in
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Operations Desk</span>
                <a href="tel:+919826259292" className="font-heading text-amber-300 hover:underline block font-bold">
                  +91 98262 59292
                </a>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              Headquarters: 012, A-Block, EWS Apartment, Treasure Town, Bijalpur, Indore, Madhya Pradesh &bull; 452012
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
