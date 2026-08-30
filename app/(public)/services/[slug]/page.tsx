import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileCheck2,
  Building2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  BadgeCheck,
  Wrench,
  Layers,
  ShieldAlert,
  HardHat
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

interface FeatureCard {
  title: string;
  desc: string;
}

interface ServiceDetail {
  title: string;
  category: 'Security Force' | 'Housekeeping & Facility';
  badge: string;
  code: string;
  image: string;
  imageAlt: string;
  imagePosition: string;
  heroDesc: string;
  stats: { label: string; value: string }[];
  duties: string[];
  equipment: string[];
  compliance: string[];
  industries: string[];
  keyCards: FeatureCard[];
}

const serviceDirectory: Record<string, ServiceDetail> = {
  // ===================== SECURITY SERVICES =====================
  'commercial-access-security': {
    title: 'Static & Commercial Gate Security',
    category: 'Security Force',
    badge: 'PSARA Category A &bull; Static Guarding',
    code: 'VSF-SEC-01',
    image: '/assets/img/operations/commercial-entry-guard.webp',
    imageAlt: 'VSF Security Guard at Building Entrance',
    imagePosition: 'object-cover object-top',
    heroDesc: 'Uniformed, police-verified security personnel deployed to manage corporate entrances, visitor access desks, lift atriums, and 24/7 static perimeter defense.',
    stats: [
      { label: 'KYC & Police Check', value: '100%' },
      { label: 'Shift Attendance', value: 'Biometric' },
      { label: 'Reliever Policy', value: 'Zero Delay' },
      { label: 'Night Inspection', value: 'Active QRT' },
    ],
    duties: [
      'Strict visitor, vehicle, and delivery vendor identity verification with entry badge logging',
      'Automatic boom barrier operation and authorized parking bay traffic control',
      'Scheduled hourly perimeter boundary foot patrols and lift emergency monitoring',
      'Immediate crisis management, fire hydrant activation, and incident escalation protocols',
      'Daily shift handover reporting and digital visitor logs submitted to client facility managers'
    ],
    equipment: [
      'Official VSF Peaked Cap & Tailored Uniform',
      'Duty Lanyard with Whistle & Heavy Sentry Baton',
      'Two-Way High-Frequency Walkie Talkie Radio',
      'Handheld Metal Detector (HHMD)',
      'High-Output LED Rechargeable Search Torch'
    ],
    compliance: [
      'PSARA Govt. of Madhya Pradesh Licensed',
      'EPF & ESIC Monthly Passbook Credit Compliance',
      'Private Security Training & Fire Safety Certified',
      'Complete Character & Background Verification'
    ],
    industries: ['Corporate IT Parks & Plazas', 'Hospitals & Medical Centers', 'Commercial Malls & Multiplexes', 'Gated Residential Townships'],
    keyCards: [
      { title: 'Access Point Filtration', desc: 'Strict verification of all incoming visitors and contractors preventing unauthorized facility entry.' },
      { title: 'Perimeter Night Vigilance', desc: 'Active boundary checks that eliminate dark spot vulnerability and trespassing risks.' },
      { title: 'Professional Entrance Standards', desc: 'Disciplined and polite sentries representing the highest corporate front-desk standards.' }
    ]
  },

  'industrial-gate-material-control': {
    title: 'Industrial Gate & Material Control',
    category: 'Security Force',
    badge: 'Supply Chain Defense &bull; Inventory Gatekeeping',
    code: 'VSF-SEC-02',
    image: '/assets/img/operations/guard-control-cabin.webp',
    imageAlt: 'Security Guards in Gatehouse Control Cabin',
    imagePosition: 'object-cover object-center',
    heroDesc: 'Specialized industrial sentries trained in weighbridge checks, delivery challans, truck cargo seals, worker frisking, and factory loss prevention.',
    stats: [
      { label: 'Challan Matching', value: '100%' },
      { label: 'Vehicle Inspection', value: 'Every Entry' },
      { label: 'Frisking Protocol', value: 'Shift End' },
      { label: 'Gate Clearance', value: '< 90 Sec' },
    ],
    duties: [
      'Raw material delivery challan verification against approved purchase orders and gate passes',
      'Physical inspection of container and truck cargo seals prior to factory compound entry',
      'Under-vehicle mirror inspection and driver entry screening protocols',
      'Worker shift-change biometric tracking and random physical metal detector frisking',
      'Scrap yard dispatch supervision and returnable/non-returnable gate pass register logging'
    ],
    equipment: [
      'Under-Vehicle Search Inspection Mirrors',
      'Heavy-Duty Handheld Metal Detectors (HHMD)',
      'Digital Material Register Tablets',
      'High-Visibility Safety Vests & Hard Hats',
      'Gatehouse Intercom & Telecommunication Radio'
    ],
    compliance: [
      'Factories Act Gate Safety Standards',
      '100% EPF & ESIC Labor Statutory Adherence',
      'Police Background Verification & KYC',
      'Reconciled Third-Party Inward/Outward Registers'
    ],
    industries: ['Heavy Engineering Plants', 'Steel, Cement & Mining Yards', 'FMCG Packaging Centers', 'Automobile Assembly Facilities'],
    keyCards: [
      { title: 'Challan Reconciliation', desc: 'No material leaves or enters without matching verified client dispatch and purchase vouchers.' },
      { title: 'Cargo Seal Inspection', desc: 'Tamper-evident seal logging stops pilferage and unauthorized loading across logistics routes.' },
      { title: 'Workforce Frisking', desc: 'Standard operating metal detection checks eliminate tool and machinery component theft.' }
    ]
  },

  'vip-bouncers-event-marshals': {
    title: 'VIP Protection & Event Bouncers',
    category: 'Security Force',
    badge: 'Executive Protection &bull; Crowd Marshals',
    code: 'VSF-SEC-03',
    image: '/assets/img/operations/executive-bouncer-marshal.webp',
    imageAlt: 'VIP Bouncer in Tactical Uniform',
    imagePosition: 'object-cover object-top',
    heroDesc: 'High-stature, trained security marshals and bodyguards for corporate conclaves, celebrity transits, stage barriers, and high-footfall public events.',
    stats: [
      { label: 'Height Standard', value: '6ft+ Trained' },
      { label: 'De-escalation', value: 'SOP Certified' },
      { label: 'Response Protocol', value: 'Instant' },
      { label: 'Comms Network', value: 'Encrypted' },
    ],
    duties: [
      'Access filtration, green room protection, and stage perimeter security',
      'Crowd movement surge damping and bottleneck clearance at large venues',
      'Executive escort convoy management with discreet close-protection transit',
      'Swift, non-violent physical de-escalation of aggressive altercations and unauthorized backstage entries',
      'Direct liaison with local law enforcement, police stations, and venue administration'
    ],
    equipment: [
      'Tactical Black Executive Uniform / Suits',
      'Acoustic Discreet Comms Earpieces',
      'Retractable Crowd Control Belts & Stanchions',
      'First Aid & Emergency Trauma Evacuation Kits',
      'High-Output Tactical Megaphones'
    ],
    compliance: [
      'Police Station Event NOC & Legal Coordination',
      'PSARA Certified Security Marshals',
      'Medical First-Aid & Emergency Response Certified',
      'Zero-Tolerance Drug & Alcohol Screened'
    ],
    industries: ['Corporate AGMs & Conclaves', 'Exhibitions & Trade Fairs', 'Celebrity & Executive Transit', 'Public Concerts & Sports Events'],
    keyCards: [
      { title: 'Crowd Surge Dampening', desc: 'Engineered barrier placements that keep entrances moving without dangerous blockages.' },
      { title: 'Discreet Executive Shadow', desc: 'Close protection that preserves client privacy while neutralizing proximity threats.' },
      { title: 'Swift Threat Isolation', desc: 'Calm and decisive non-violent containment of unruly individuals without event disruptions.' }
    ]
  },

  'factory-yard-perimeter-patrol': {
    title: 'Factory Yard & Night Patrol Guarding',
    category: 'Security Force',
    badge: 'Field Command &bull; Mobile QRT Fleet',
    code: 'VSF-SEC-04',
    image: '/assets/img/operations/field-guard-perimeter.webp',
    imageAlt: 'Industrial Yard Perimeter Security Guard',
    imagePosition: 'object-cover object-top',
    heroDesc: 'Dedicated static sentries and mobile Field Officers conducting surprise midnight audits, guard alertness checks, and raw stock yard defense.',
    stats: [
      { label: 'Patrol Coverage', value: '24/7/365' },
      { label: 'Surprise Checks', value: '2-3 per Night' },
      { label: 'GPS Fleet Tracking', value: 'Live' },
      { label: 'Emergency Backup', value: 'On-Call' },
    ],
    duties: [
      'Surprise midnight and early morning field inspections across all deployed client posts',
      'Physical guard alertness, sobriety testing, uniform turnout, and post-log assessments',
      'Immediate armed or unarmed backup dispatch during perimeter alarms or intruder attempts',
      'Digital GPS geo-tagged inspection logs submitted directly to client administrative portals',
      'Active defense of open timber, steel, and machinery yards against trespassing and theft'
    ],
    equipment: [
      'Branded VSF Quick-Response Patrol Vehicles',
      'Long-Range LED Search Floodlights',
      'Central Operations Base High-Band Radios',
      'Alcohol Breathalyzer Testing Devices',
      'Digital Field Inspection Tablets'
    ],
    compliance: [
      'Central Control Room 24/7 Active Dispatch',
      'GPS Vehicle Fleet Tracking Compliance',
      'Daily Field Audit & Night Inspection Records',
      'ISO 9001:2015 Operational Quality Auditing'
    ],
    industries: ['Timber & Steel Stockyards', 'Solar Power Plants', 'Industrial SEZ Corridors', 'Large Logistics Warehouses'],
    keyCards: [
      { title: 'Surprise Midnight Audits', desc: 'Guards stay continuously alert knowing supervisory vans inspect at random night hours.' },
      { title: 'Live GPS Shift Logs', desc: 'Transparent reporting proving regular physical inspection rounds at your facility.' },
      { title: 'Emergency Dispatch Squad', desc: 'Immediate reinforcement squads dispatched if a perimeter or material hazard occurs.' }
    ]
  },

  // ===================== HOUSEKEEPING SERVICES =====================
  'corporate-office-housekeeping': {
    title: 'Corporate & Office Housekeeping',
    category: 'Housekeeping & Facility',
    badge: 'Facility Management &bull; Workplace Hygiene',
    code: 'VSF-FAC-01',
    image: '/assets/img/operations/housekeeping-lobby-mop.webp',
    imageAlt: 'Housekeeping Staff Cleaning Commercial Lobby',
    imagePosition: 'object-cover object-top',
    heroDesc: 'Uniformed, trained janitorial staff and floor-care specialists delivering mechanized office upkeep, hourly washroom sanitization, and pantry management.',
    stats: [
      { label: 'Checklist Audits', value: 'Hourly' },
      { label: 'Chemical Grade', value: 'Eco-Safe' },
      { label: 'Machinery Used', value: 'Mechanized' },
      { label: 'Staff Verification', value: '100% KYC' },
    ],
    duties: [
      'Continuous daily sanitation of workstations, meeting rooms, cabins, and reception atriums',
      'Restroom deep sanitization with automated hourly checklist physical and digital sign-offs',
      'Glass facade, partition, window, and high-reach fixture streak-free cleaning',
      'Pantry assistance, tea/coffee station restocking, and cafeteria hygiene upkeep',
      'Color-coded waste segregation and certified municipal disposal practices'
    ],
    equipment: [
      'Single-Disc Mechanized Floor Polishers & Scrubbers',
      'Wet & Dry Commercial Vacuum Cleaners',
      'Color-Coded Anti-Bacterial Microfiber Mops',
      'Eco-Friendly Diversey / Taski Certified Chemicals',
      'High-Pressure Glass Facade Telescopic Cleaners'
    ],
    compliance: [
      'Full EPF & ESIC Monthly Labor Compliance',
      'Color-Coded Cross-Contamination Prevention SOPs',
      'Material Safety Data Sheet (MSDS) Adherence',
      '100% Police Background Verified Personnel'
    ],
    industries: ['Corporate IT Offices & MNC Plazas', 'Financial Institutions & Banks', 'Co-Working Spaces & Hubs', 'Automobile Showrooms'],
    keyCards: [
      { title: 'Restroom Hygiene Checklists', desc: 'Regular hourly sign-offs guaranteeing pristine, odor-free corporate restrooms.' },
      { title: 'Color-Coded Mops & Cloths', desc: 'Strict cross-contamination prevention separating washroom, pantry, and desk supplies.' },
      { title: 'Quiet Corporate Operation', desc: 'Trained to execute thorough cleaning without interrupting employee work routines.' }
    ]
  },

  'industrial-shopfloor-corridor-care': {
    title: 'Industrial & Floor Care Housekeeping',
    category: 'Housekeeping & Facility',
    badge: 'Heavy Industrial &bull; 5S Shopfloor Standards',
    code: 'VSF-FAC-02',
    image: '/assets/img/operations/housekeeping-floor-care.webp',
    imageAlt: 'Housekeeping Staff Cleaning Hallway Floor',
    imagePosition: 'object-cover object-center',
    heroDesc: 'Heavy-duty industrial cleaning manpower trained in 5S shopfloor organization, chemical spill management, and oil-stain machine floor degreasing.',
    stats: [
      { label: '5S Framework', value: 'Compliant' },
      { label: 'PPE Safety Gear', value: 'Mandatory' },
      { label: 'Degreasing Power', value: 'Industrial' },
      { label: 'Safety Record', value: 'Zero Incident' },
    ],
    duties: [
      'Mechanized scrubbing and degreasing of epoxy and concrete production plant floors',
      'Shopfloor waste collection, scrap sorting, and non-hazardous material handling',
      'High-traffic corridor continuous damp mopping and stainless steel dustbin clearance',
      'Machinery perimeter cleaning complying with factory audit cleanliness standards',
      'Worker locker room, canteen, and washroom continuous shift sanitization'
    ],
    equipment: [
      'Heavy-Duty Ride-on & Walk-behind Floor Scrubbers',
      'Industrial Slurry & Oil-Absorbent Wet Vacuums',
      'High-Pressure Water Jet Cleaning Machines (200+ Bar)',
      'Heavy-Duty PPE (Steel-Toe Boots, Goggles, Helmets)',
      'Industrial Bio-Degreasers & Sorbent Booms'
    ],
    compliance: [
      'Factories Act Industrial Safety Standards',
      'OSHA Standard Housekeeping Practices',
      'Full EPF/ESIC Labor Statutory Compliance',
      'Hazardous Spill Containment Protocols'
    ],
    industries: ['Multiplexes & Shopping Malls', 'Auto Component & Machine Plants', 'Warehouses & Cold Storages', 'Commercial Food Courts'],
    keyCards: [
      { title: '5S Shopfloor Compliance', desc: 'Keeps production bays organized, reducing slip hazards and boosting manufacturing safety.' },
      { title: 'Oil & Grease Degreasing', desc: 'Heavy mechanized scrubbing to remove stubborn industrial residues from concrete.' },
      { title: 'Factory Audit Readiness', desc: 'Ensures your facility consistently passes statutory cleanliness and safety inspections.' }
    ]
  }
};

export default async function ServiceSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = serviceDirectory[slug];

  if (!service) {
    return notFound();
  }

  const allServiceKeys = Object.keys(serviceDirectory);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Top Sub-Header Context Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-slate-500 hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to All Services</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700">
                {service.category} Wing
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 space-y-12">

          {/* 3. Hero Header with Photo & KPI Integration */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Left: Tall Un-cropped Photo Frame */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full h-[360px] rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 360px"
                    className={`${service.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="rounded bg-[#0F172A]/90 backdrop-blur-xs px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10 shadow-xs">
                      {service.code}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 rounded bg-black/70 backdrop-blur-xs px-2.5 py-1 text-[11px] font-sans font-medium text-slate-200 border border-white/10">
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      Verified Operational Personnel
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Service Title, Overview & Primary Benchmarks */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-3">
                    <span dangerouslySetInnerHTML={{ __html: service.badge }} />
                  </div>
                  <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                    {service.title}
                  </h1>
                  <p className="mt-3 font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
                    {service.heroDesc}
                  </p>
                </div>

                {/* Key Metric KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {service.stats.map((stat, idx) => (
                    <div key={idx} className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-center">
                      <div className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">
                        {stat.label}
                      </div>
                      <div className="font-heading text-base sm:text-lg font-bold text-[#0F172A] mt-0.5 truncate">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Action Bar */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded bg-red-700 px-5 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-xs"
                  >
                    <span>Deploy This Service</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href="tel:+919826259292"
                    className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition-colors"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
                    <span>Control Room: +91 98262 59292</span>
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* 4. Strategic Objectives / Feature Architecture */}
          <section className="space-y-4">
            <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block">
              Operational Focus
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {service.keyCards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <span className="font-mono text-xs font-bold text-slate-400">
                    MODULE 0{idx + 1}
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-bold uppercase tracking-tight text-[#0F172A]">
                      {card.title}
                    </h2>
                    <p className="mt-1.5 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Scope of Execution vs Hardware & Compliance */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left Column: Scope of Work / SOPs */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  On-Ground Execution
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                  Standard Operating Procedures
                </h3>
              </div>

              <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
                {service.duties.map((duty, idx) => (
                  <div key={idx} className="py-3.5 flex items-start gap-3.5">
                    <span className="font-mono text-xs font-bold text-slate-400 pt-0.5 select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {duty}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Tooling & Statutory Compliance */}
            <div className="lg:col-span-5 space-y-6">

              {/* Issued Equipment */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <span className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#0F172A] border-l-2 border-amber-600 pl-2">
                  <Wrench className="h-3.5 w-3.5 text-amber-600" />
                  Tooling &amp; Equipment Manifest
                </span>
                <ul className="space-y-2 pt-1">
                  {service.equipment.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 font-sans text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statutory Standards */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <span className="flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-[#0F172A] border-l-2 border-red-700 pl-2">
                  <FileCheck2 className="h-3.5 w-3.5 text-red-700" />
                  Statutory Directives &amp; KYC
                </span>
                <ul className="space-y-2 pt-1">
                  {service.compliance.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 font-sans text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </section>

          {/* 6. Primary Target Environments */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                  Deployment Environments
                </span>
                <h3 className="font-heading text-lg font-bold uppercase tracking-tight text-[#0F172A]">
                  Primary Industry Sectors
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {service.industries.map((ind, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-sans text-xs font-semibold text-slate-700"
                  >
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* 7. Service Directory Switcher */}
          <nav aria-label="Other services" className="space-y-4">
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-slate-500">
              Explore Other Capabilities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allServiceKeys
                .filter((k) => k !== slug)
                .map((k) => (
                  <Link
                    key={k}
                    href={`/services/${k}`}
                    className="group flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all"
                  >
                    <span className="font-sans text-xs sm:text-sm font-semibold text-slate-800 group-hover:text-red-700 transition-colors">
                      {serviceDirectory[k].title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-red-700 transition-colors shrink-0 ml-2" />
                  </Link>
                ))}
            </div>
          </nav>

          {/* 8. Bottom Institutional Mobilization Card */}
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Custom Post Deployment
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Request Service Proposal &amp; Post Strength Plan
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Contact our central operations command to calculate site shift requirements, mandatory equipment tooling, and statutory PSARA compliance rate sheets.
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

      {/* 9. Global Footer */}
      <Footer />
    </div>
  );
}
