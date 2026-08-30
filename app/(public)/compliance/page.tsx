import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Scale,
  FileCheck2,
  UserCheck,
  Activity,
  Building2,
  Shirt,
  HeartHandshake,
  Lock,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'PSARA Statutory Compliance & Legal Governance | Vidhya Security Force',
  description: 'Explore the 7 mandatory PSARA 2005 & MP PSARA Rules 2012 compliance pillars maintained by Vidhya Security Force, ensuring 100% legal immunity and audited security deployments for principal employers.',
  keywords: [
    'PSARA compliance madhya pradesh',
    'private security agencies regulation act 2005',
    'MP PSARA rules 2012',
    'Form X electronic registers',
    'security guard police verification MP',
    'PSARA training section 9 10'
  ],
  alternates: {
    canonical: 'https://vidhyasecurity.com/compliance',
  },
};

interface CompliancePillar {
  number: string;
  title: string;
  legalProvision: string;
  definition: string;
  icon: any;
  agencyActions: string[];
}

const compliancePillars: CompliancePillar[] = [
  {
    number: '01',
    title: 'Mandatory Training & Skills Verification',
    legalProvision: 'Section 9 & 10 of PSARA 2005 | Rule 4 & 5 of MP PSARA Rules, 2012',
    definition: 'Statutory training required for all private security personnel to maintain entry-level physical, cognitive, and tactical readiness.',
    icon: ShieldCheck,
    agencyActions: [
      'Initial Training: Every newly recruited security guard completes a mandatory 160 hours (100 hours classroom + 60 hours field training) over a minimum span of 20 days. Ex-servicemen receive relaxation strictly per statutory guidelines.',
      'Ongoing Refresher Drills: Deployed guards undergo continuous refresher drills, specialized access control protocols, and site-specific emergency Standard Operating Procedures (SOPs).',
      'Controlling Authority Submission: Regular submission and record filing of certified trainee batches with the Madhya Pradesh Home Department Controlling Authority.'
    ]
  },
  {
    number: '02',
    title: 'Form X: Maintenance of Electronic Registers',
    legalProvision: 'Section 15 of PSARA 2005 | Rule 12 of MP PSARA Rules, 2012',
    definition: 'Prescribed master ledger containing verified, real-time records of agency workforce, deployments, and commercial clientele.',
    icon: FileCheck2,
    agencyActions: [
      'Personnel Logs: Real-time maintenance of Form X records documenting full names, biometric verification, photographs, and permanent/local residential addresses of all guards and field supervisors.',
      'Statutory Records: Complete logging of wage disbursement vouchers, duty rosters, post history, and annual physical fitness clearances.',
      'Client Register: Continuous cataloging of active commercial service contracts, post allocation numbers, and site supervisor contact dockets.'
    ]
  },
  {
    number: '03',
    title: 'Verification of Personnel Backgrounds',
    legalProvision: 'Section 10 of PSARA 2005 | Rule 3 & Form II of MP PSARA Rules, 2012',
    definition: 'Mandatory background investigations ensuring all security professionals possess impeccable character credentials with zero criminal records.',
    icon: UserCheck,
    agencyActions: [
      'Form II Processing: Prior to on-site deployment, every candidate undergoes formal character and antecedent verification through Form II.',
      'Police Database Screening: Records are routed and cleared through jurisdictional police databases to disqualify any individual convicted of offenses involving moral turpitude or national security concerns.',
      'Biometric KYC: Biometric Aadhaar verification and permanent domicile proof archived for every active sentry.'
    ]
  },
  {
    number: '04',
    title: 'Continuous Medical & Physical Fitness Audits',
    legalProvision: 'Section 10(1) of PSARA 2005 | General Conditions of MP PSARA Licence',
    definition: 'Recurrent health screenings validating that on-duty personnel remain physically agile and capable of handling high-stress security environments.',
    icon: Activity,
    agencyActions: [
      'Annual Medical Examinations: Routine health checks conducted every 12 months for 100% of guarding and supervisory personnel.',
      'Standardized Vitals & Endurance: Screenings verify eyesight standards, auditory perception, dexterity, stamina, and cardiovascular baseline requirements.',
      'Fitness Clearance Slips: Medical fitness certificates archived directly in the personnel Form X dossier.'
    ]
  },
  {
    number: '05',
    title: 'Intimation of Organizational Adjustments',
    legalProvision: 'Section 10(3) & 10(5) of MP PSARA Rules, 2012',
    definition: 'Legal reporting protocol mandating formal declaration of internal restructuring or contact modifications to state inspectors.',
    icon: Building2,
    agencyActions: [
      '30-Day Mandatory Intimation: Any alteration in principal office address, branch expansion, or management structure is formally submitted in writing to the Controlling Authority within 30 days.',
      'Management Clearance: Formal declarations confirming that all proprietary executives and directors maintain spotless legal records without statutory disqualifications.',
      'Licence Endorsement: Active synchronization with the Home Department portal for ongoing administrative transparency.'
    ]
  },
  {
    number: '06',
    title: 'Strict Uniform & Insignia Standards',
    legalProvision: 'Section 21 of PSARA 2005 | Rule 11 of MP PSARA Rules, 2012',
    definition: 'Statutory dress code enforcement ensuring private security attire is unique, dignified, and distinctly distinguished from official state or national armed forces.',
    icon: Shirt,
    agencyActions: [
      'Prohibition of Military Emblems: Uniforms strictly avoid camouflage patterns, official police colors, or military rank designs.',
      'Authorized Emblems & Badges: Standard-issue agency kits feature the registered corporate crest arm patch and visible name/rank shoulder badges.',
      'Mandatory Laminated Photo-ID: Tamper-proof photo identity cards prominently displayed on the outermost garment above the waistline during all operational hours.'
    ]
  },
  {
    number: '07',
    title: 'Core Labour & Welfare Compliance',
    legalProvision: 'Section 13(1) of PSARA 2005 | State Labour Codes & Social Security Acts',
    definition: 'Strict execution of statutory labor, tax, and social security mandates protecting principal employers from vicarious liability.',
    icon: HeartHandshake,
    agencyActions: [
      'EPFO & ESIC Remittance: 100% direct monthly deposit of provident fund and ESIC health cover with certified Electronic Challan cum Return (ECR) receipts enclosed with billing.',
      'Shops & Commercial Establishments Act: Strict enforcement of standard 8-hour/12-hour duty caps, mandated weekly off-relief rosters, and overtime allowances.',
      'Fiscal & Tax Compliance: Regular GST return submissions enabling Input Tax Credit (ITC) reconciliation and updated income tax compliance.'
    ]
  }
];

export default function PsaraCompliancePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'PSARA 2005 & MP PSARA Rules 2012 Statutory Compliance Framework',
    'description': 'Comprehensive 7-pillar compliance blueprint governing private security deployments, training, background screening, and labor welfare in Madhya Pradesh.',
    'author': {
      '@type': 'Organization',
      'name': 'Vidhya Security Force & Housekeeping Services',
      'url': 'https://vidhyasecurity.com'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Vidhya Security Force',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://vidhyasecurity.com/assets/img/logo/logo.png'
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Top Context Sub-Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Statutory Governance</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">PSARA 2005 &bull; MP Rules 2012</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                100% Home Department Audited &bull; All 55 MP Districts
              </span>
            </div>
          </div>
        </section>

        {/* Section Hero Header */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
                <Scale className="h-3.5 w-3.5 text-red-700" />
                <span>Statutory Regulatory Framework</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                PSARA Compliance &amp; Legal Governance
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Vidhya Security Force operates under strict statutory governance dictated by the Private Security Agencies (Regulation) Act, 2005 and the Madhya Pradesh Private Security Agencies Rules, 2012, protecting principal employers from legal liabilities and labor disputes.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">PSARA License</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">PSA/L/74/MP/2023/FEB/3/425</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Valid Thru Aug 2027</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Training Mandate</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">160 Hours Certified</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Syllabus Section 9 &amp; 10</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Verification Standard</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">Form II Police Clearances</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Zero Criminal Records</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Electronic Registers</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">Form X Maintained</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Live Biometric &amp; Wages</div>
              </div>
            </div>
          </div>
        </section>

        {/* The 7 PSARA Compliance Pillars */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block">
              Audited Standards
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
              The 7 Mandatory PSARA Pillars
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {compliancePillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-700/10 text-red-700 border border-red-700/20 shrink-0">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="font-mono text-xs font-bold text-red-700">Pillar {pillar.number}</span>
                        <h3 className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-[#0F172A]">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    <div className="rounded-lg bg-amber-50 border border-amber-200/70 px-3 py-1.5 self-start sm:self-auto">
                      <span className="font-mono text-[11px] font-bold text-amber-900 block">
                        {pillar.legalProvision}
                      </span>
                    </div>
                  </div>

                  {/* Definition */}
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 text-xs font-sans text-slate-600 leading-relaxed">
                    <strong className="font-heading text-slate-800 uppercase tracking-wider text-[11px] block mb-1">
                      Statutory Definition:
                    </strong>
                    {pillar.definition}
                  </div>

                  {/* Agency Actions */}
                  <div className="space-y-2.5">
                    <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Vidhya Security Force Operational Execution:
                    </span>
                    <ul className="space-y-2 text-xs font-sans text-slate-700">
                      {pillar.agencyActions.map((action, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2.5 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Zero Client Liability Protocol Box */}
          <section className="mt-12 rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                100% Legal &amp; Audit Immunity
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Protect Your Organization from Labor Liabilities
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Hiring an unlicenced agency exposes principal employers to heavy statutory fines and joint liability. Partner with Vidhya Security Force for verified PSARA compliance and monthly audit dockets.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
              >
                <span>Request Deployment Plan</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259292"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 px-5 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>+91 98262 59292</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
