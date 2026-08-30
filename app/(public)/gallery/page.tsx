'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  MapPin,
  Camera,
  ArrowRight,
  PhoneCall,
  BadgeCheck,
  CheckCircle2,
  Building2,
  HardHat,
  Sparkles,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

type CategoryType =
  | 'ALL'
  | 'ACCESS_CONTROL'
  | 'INDUSTRIAL_GUARDING'
  | 'GATE_DISPATCH'
  | 'VIP_PROTECTION'
  | 'JANITORIAL'
  | 'FACILITY_CARE';

interface GalleryDeployment {
  id: string;
  roleTitle: string;
  category: CategoryType;
  categoryLabel: string;
  categoryBadge: string;
  dutyPost: string;
  location: string;
  image: string;
  specs: string[];
  workSummary: string;
}

const operationalGallery: GalleryDeployment[] = [
  {
    id: 'VSF-OPS-01',
    roleTitle: 'Commercial Access Control Sentry',
    category: 'ACCESS_CONTROL',
    categoryLabel: 'Access Control',
    categoryBadge: 'Commercial Guarding',
    dutyPost: 'Main Atrium & Lift Corridor',
    location: 'Vishal Complex, Indore (M.P.)',
    image: '/assets/img/operations/commercial-entry-guard.webp',
    specs: ['Visitor Badge Issuance', 'Lift Corridor Surveillance', '100% Police Verified'],
    workSummary: 'Manages building reception protocols, verifies visitor identity passes, checks entry permissions, and maintains access vigilance.',
  },
  {
    id: 'VSF-OPS-02',
    roleTitle: 'VIP Executive Protection Marshal',
    category: 'VIP_PROTECTION',
    categoryLabel: 'VIP Protection',
    categoryBadge: 'Executive Bouncers',
    dutyPost: 'Stage & VIP Enclosure Cordon',
    location: 'Corporate Event Pavilion, Indore (M.P.)',
    image: '/assets/img/operations/executive-bouncer-marshal.webp',
    specs: ['6ft+ Physical Stature', 'Tactical Black Turnout', 'Crowd De-escalation SOP'],
    workSummary: 'Provides close executive protection, controls stage perimeter access, and prevents crowd bottlenecks during corporate conclaves.',
  },
  {
    id: 'VSF-OPS-03',
    roleTitle: 'Industrial Perimeter & Yard Guard',
    category: 'INDUSTRIAL_GUARDING',
    categoryLabel: 'Industrial Guarding',
    categoryBadge: 'Perimeter Defense',
    dutyPost: 'Factory Boundary & Lumber Yard',
    location: 'Pithampur Industrial Corridor, M.P.',
    image: '/assets/img/operations/field-guard-perimeter.webp',
    specs: ['Raw Material Protection', 'Boundary Foot Patrols', 'Vehicle Entry Verification'],
    workSummary: 'Stationed at factory boundary gates to inspect truck dispatches, prevent material theft, and enforce perimeter defense standards.',
  },
  {
    id: 'VSF-OPS-04',
    roleTitle: 'Gatehouse Control & Dispatch Supervisor',
    category: 'GATE_DISPATCH',
    categoryLabel: 'Gate & Dispatch',
    categoryBadge: 'Command Cabin',
    dutyPost: 'Main Gate Security Gatehouse',
    location: 'Industrial Plant, Dewas (M.P.)',
    image: '/assets/img/operations/guard-control-cabin.webp',
    specs: ['Material In/Out Register', 'Intercom & QRT Relay', 'Shift Turnout Audits'],
    workSummary: 'Supervises inward/outward delivery challans, operates central telecom systems, and manages shift relief rosters.',
  },
  {
    id: 'VSF-OPS-05',
    roleTitle: 'Facility Discipline & Canteen Marshal',
    category: 'ACCESS_CONTROL',
    categoryLabel: 'Access Control',
    categoryBadge: 'Campus Discipline',
    dutyPost: 'Employee Dining & Canteen Wing',
    location: 'Corporate Industrial Campus, M.P.',
    image: '/assets/img/operations/guard-control-cantin.webp',
    specs: ['Shift Turnout Inspected', 'Staff Order & Queue SOP', 'Asset Loss Prevention'],
    workSummary: 'Oversees employee shift changeovers in dining and recreation zones, maintaining orderly conduct and campus rules.',
  },
  {
    id: 'VSF-OPS-06',
    roleTitle: 'Deep Facility Housekeeping Specialist',
    category: 'FACILITY_CARE',
    categoryLabel: 'Facility Care',
    categoryBadge: 'Corridor Janitorial',
    dutyPost: 'Multiplex Corridor & Common Area',
    location: 'Multiplex & Atrium Complex, M.P.',
    image: '/assets/img/operations/housekeeping-floor-care.webp',
    specs: ['Granite Spill Protocol', 'Receptacle Sanitization', 'High-Footfall Cleanliness'],
    workSummary: 'Maintains hygiene across commercial corridors, handles waste segregation, and executes damp mopping in high-traffic zones.',
  },
  {
    id: 'VSF-OPS-07',
    roleTitle: 'Commercial Lobby Janitorial Specialist',
    category: 'JANITORIAL',
    categoryLabel: 'Janitorial Services',
    categoryBadge: 'Floor Care',
    dutyPost: 'Entertainment Center Lobby Floor',
    location: 'Entertainment Center, Indore (M.P.)',
    image: '/assets/img/operations/housekeeping-lobby-mop.webp',
    specs: ['Microfiber Sweeping Grid', 'Hourly Sign-Off Audits', 'Anti-Bacterial Care'],
    workSummary: 'Uses industrial micro-fiber dust sweepers on polished tile floors to ensure spotless, dust-free public spaces.',
  },
];

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryType>('ALL');

  const filteredItems = activeFilter === 'ALL'
    ? operationalGallery
    : operationalGallery.filter((item) => item.category === activeFilter);

  const filterTabs: { label: string; value: CategoryType }[] = [
    { label: 'All Operations (7)', value: 'ALL' },
    { label: 'Access Control', value: 'ACCESS_CONTROL' },
    { label: 'Industrial Guarding', value: 'INDUSTRIAL_GUARDING' },
    { label: 'Gatehouse Cabin', value: 'GATE_DISPATCH' },
    { label: 'VIP Marshals', value: 'VIP_PROTECTION' },
    { label: 'Floor Janitorial', value: 'JANITORIAL' },
    { label: 'Facility Care', value: 'FACILITY_CARE' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Top Sub-Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Operational Evidence</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Real Field Deployments</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                100% Real Turnout Photos &bull; Madhya Pradesh
              </span>
            </div>
          </div>
        </section>

        {/* 3. Section Header & Category Filter */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-700">
                <Camera className="h-3.5 w-3.5 text-red-700" />
                <span>Field Operations Archive</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Live Deployment Showcase
              </h1>

              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Authentic, on-site photography showcasing Vidhya Security Force &amp; Housekeeping Services personnel actively serving industrial plants, commercial towers, multiplexes, and events across Madhya Pradesh.
              </p>
            </div>

            {/* Filter Tabs Bar */}
            <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-100 pt-6">
              {filterTabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`rounded-lg px-3.5 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === tab.value
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Diversified Specimen Cards Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo Frame (4:3 Ratio) */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.roleTitle}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Tag Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="rounded bg-[#0F172A]/90 backdrop-blur-xs px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10 shadow-xs">
                        {item.categoryBadge}
                      </span>
                    </div>

                    {/* Bottom Location Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-6">
                      <div className="flex items-center gap-1.5 text-slate-200 text-xs font-sans font-medium">
                        <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <span className="font-mono text-[11px] font-bold text-slate-400">
                        {item.id}
                      </span>
                      <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                        {item.dutyPost}
                      </span>
                    </div>

                    <h3 className="font-heading text-base font-bold uppercase tracking-tight text-[#0F172A] leading-snug">
                      {item.roleTitle}
                    </h3>

                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      {item.workSummary}
                    </p>

                    {/* Spec Checkmarks */}
                    <div className="pt-2 border-t border-slate-100">
                      <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Operational Checklist:
                      </span>
                      <ul className="space-y-1.5">
                        {item.specs.map((sp, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-[11px] font-sans font-medium text-slate-700">
                            <CheckCircle2 className="h-3.5 w-3.5 text-red-700 shrink-0" />
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Card Bottom Verification */}
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold text-emerald-700">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Turnout
                  </span>
                  <Link
                    href="/contact"
                    className="font-heading text-[10px] font-bold uppercase tracking-wider text-red-700 hover:text-red-800"
                  >
                    Deploy Post &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Institutional Deployment CTA Strip */}
          <section className="mt-16 rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Turnout &amp; Duty Standards Guaranteed
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Deploy Disciplined Manpower at Your Site
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                All personnel deployed by Vidhya Security Force &amp; Housekeeping Services undergo rigorous background screening, biometric registration, and routine midnight supervisory audits across Madhya Pradesh.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
              >
                <span>Request Deployment</span>
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

      {/* 6. Global Footer */}
      <Footer />
    </div>
  );
}
