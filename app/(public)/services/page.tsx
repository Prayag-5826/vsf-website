import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Sparkles,
  Building2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldAlert,
  HardHat,
  BadgeCheck,
  FileCheck2,
  Wrench,
  Layers,
  Cctv,
  Flame,
  UserCheck,
  Clock,
  ArrowUpRight,
  Users,
  Settings2
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export default function ServicesPage() {
  const primaryServices = [
    {
      slug: 'commercial-access-security',
      title: 'Static & Commercial Gate Security',
      division: 'Guarding Operations',
      code: 'VSF-SEC-01',
      badge: 'PSARA Category A',
      image: '/assets/img/operations/commercial-entry-guard.webp',
      imageAlt: 'VSF Security Guard at Building Entrance',
      imagePosition: 'object-cover object-top',
      overview: 'Disciplined, police-verified security personnel managing corporate entrances, reception desks, visitor access gates, and physical perimeter defense.',
      duties: [
        'Mandatory visitor verification, pass issuance, and vehicle register logging',
        'Automatic boom barrier and authorized parking management',
        'Scheduled perimeter boundary foot patrols and night sentry vigilance',
        'Direct coordination with local emergency services and client administration',
      ],
      hardware: ['Uniform Peak Cap & Peak Turnout', 'Handheld Metal Detector (HHMD)', 'Duty Baton & Whistle', 'Two-Way Wireless Radio'],
      sla: '100% Police Verified | Zero-Delay Reliever Guarantee',
    },
    {
      slug: 'industrial-gate-material-control',
      title: 'Industrial Gate & Material Control',
      division: 'Loss Prevention',
      code: 'VSF-SEC-02',
      badge: 'Factories Act Norms',
      image: '/assets/img/operations/guard-control-cabin.webp',
      imageAlt: 'Security Guards in Control Cabin',
      imagePosition: 'object-cover object-center',
      overview: 'Specialized industrial sentries trained in factory gate operations, delivery challan verification, under-vehicle inspections, and inventory loss control.',
      duties: [
        'Delivery challan matching against approved purchase orders and gate passes',
        'Container seal checks and under-vehicle mirror search routines',
        'Worker shift-end frisking to prevent factory tool and metal theft',
        'Returnable and non-returnable material gate register reconciliation',
      ],
      hardware: ['Under-Vehicle Search Mirrors', 'Material Pass Tablets', 'High-Vis Safety Vests', 'Gatehouse Intercom'],
      sla: 'Reconciled Gate Registers | 100% Inward/Outward Audit',
    },
    {
      slug: 'vip-bouncers-event-marshals',
      title: 'VIP Protection & Event Bouncers',
      division: 'Executive Protection',
      code: 'VSF-SEC-03',
      badge: 'Physical Stature 6ft+',
      image: '/assets/img/operations/executive-bouncer-marshal.webp',
      imageAlt: 'VIP Bouncer in Tactical Uniform',
      imagePosition: 'object-cover object-top',
      overview: 'High-stature, trained security marshals providing close protection for VIP guests, corporate conclaves, stage cordoning, and crowd surge management.',
      duties: [
        'Cordoning VIP green rooms, stage barriers, and executive lounges',
        'Crowd surge damping and exit bottleneck control at high-footfall venues',
        'Personal executive transit escort with discrete communication earpieces',
        'Swift, non-violent physical de-escalation of public altercations',
      ],
      hardware: ['Tactical Black Uniform / Suit', 'Acoustic Comms Earpieces', 'Crowd Control Belts', 'First-Aid Kit'],
      sla: 'Trained Executive Marshals | Local Police NOC Coordination',
    },
    {
      slug: 'factory-yard-perimeter-patrol',
      title: 'Factory Yard & Night Patrol Guarding',
      division: 'Perimeter Defense',
      code: 'VSF-SEC-04',
      badge: '24/7 Mobile QRT',
      image: '/assets/img/operations/field-guard-perimeter.webp',
      imageAlt: 'Industrial Yard Perimeter Security Guard',
      imagePosition: 'object-cover object-top',
      overview: 'Static sentries and mobile night field officers providing vigilance over open industrial plots, raw stock, timber yards, and boundary fences.',
      duties: [
        'Hourly searchlight patrols across open storage yards and perimeter fences',
        'Surprise midnight alertness inspections conducted by VSF patrol vans',
        'Machinery asset protection against trespassing and inventory sabotage',
        'Daily digital incident reporting submitted directly to client managers',
      ],
      hardware: ['High-Power Search Flashlight', 'GPS Patrol Logger', 'Weatherproof Duty Gear', 'Duty Sentry Baton'],
      sla: 'Surprise Midnight Audits | Immediate Backup Squad Fleet',
    },
    {
      slug: 'corporate-office-housekeeping',
      title: 'Corporate & Office Housekeeping',
      division: 'Mechanized Facility',
      code: 'VSF-FAC-01',
      badge: 'Workplace Hygiene',
      image: '/assets/img/operations/housekeeping-lobby-mop.webp',
      imageAlt: 'Housekeeping Staff with Microfiber Floor Mop',
      imagePosition: 'object-cover object-top',
      overview: 'Trained janitorial staff delivering daily workstation sanitization, hourly washroom deep cleaning, pantry support, and floor care.',
      duties: [
        'Dust-free dry microfiber mopping and continuous lobby floor upkeep',
        'Hourly restroom sanitization, odor control, and soap replenishment',
        'Glass facade, partition, window, and high-reach fixture cleaning',
        'Pantry assistance, cafeteria hygiene upkeep, and waste segregation',
      ],
      hardware: ['Microfiber Dry/Wet Mops', 'Commercial Wet/Dry Vacuum', 'Diversey Safe Chemicals', 'Color-Coded Carts'],
      sla: 'Hourly Restroom Checklists | 100% Background Checked Staff',
    },
    {
      slug: 'industrial-shopfloor-corridor-care',
      title: 'Industrial & Floor Care Housekeeping',
      division: '5S Shopfloor Standards',
      code: 'VSF-FAC-02',
      badge: 'Heavy Industrial Care',
      image: '/assets/img/operations/housekeeping-floor-care.webp',
      imageAlt: 'Housekeeping Staff Cleaning Hallway Floor',
      imagePosition: 'object-cover object-center',
      overview: 'Heavy-duty cleaning personnel maintaining high-traffic corridors, granite lobbies, shopping atrium walkways, and factory machine floorways.',
      duties: [
        'Continuous mopping of heavy-traffic public walkways and cinema lobbies',
        'Routine garbage collection, bag replacement, and bin sanitization',
        'Immediate spill containment to prevent workplace slip-and-fall hazards',
        'Corridor wall wiping, signage dusting, and entry mat maintenance',
      ],
      hardware: ['Heavy-Duty Floor Scrubbers', 'Industrial Slurry Vacuums', 'Caution Floor Boards', 'Industrial Work PPE'],
      sla: '5S Workplace Standard | Zero-Slip Safety Compliance',
    },
  ];

  const specializedCapabilities = [
    {
      icon: Cctv,
      title: '24/7 CCTV & Control Room Operators',
      desc: 'Trained technical personnel stationed in your central CCTV control room for real-time camera monitoring, video playback archiving, PTZ tracking, and perimeter intrusion alerting.',
      badge: 'Electronic Surveillance',
    },
    {
      icon: Flame,
      title: 'Fire Safety Marshals & Hydrant Handlers',
      desc: 'Guards trained in fire prevention, emergency evacuation drills, smoke detector response, fire hydrant operation, and regular fire extinguisher pressure audits.',
      badge: 'Life Safety & Emergency',
    },
    {
      icon: Users,
      title: 'Society Facility & Campus Discipline Staff',
      desc: 'Integrated gatekeepers managing residential society visitor apps, basement parking enforcement, and staff dining canteen discipline.',
      badge: 'Residential & Campus',
    },
    {
      icon: Settings2,
      title: 'Custom Workforce Deployment (As Per Client SLA)',
      desc: 'Tailor-made staffing solutions where we recruit, train, and manage custom security, ticketing, or facility crews specific to your corporate requirements and operating shifts.',
      badge: 'Custom Contract SLA',
    },
  ];

  const operationalAssurances = [
    {
      title: '100% Statutory Adherence',
      desc: 'Direct EPF, ESIC, and Minimum Wage disbursements with compliance challan copies submitted alongside monthly client billing.',
    },
    {
      title: 'Zero-Delay Reliever Policy',
      desc: 'Dedicated reserve squads in every district hub guarantee instant replacements if a stationed guard or cleaner is on leave.',
    },
    {
      title: 'Midnight Supervisory Inspections',
      desc: 'Senior Field Officers conduct randomized 2 AM – 5 AM surprise site checks to ensure guards remain active and alert.',
    },
    {
      title: 'Police KYC Verification',
      desc: 'Every deployed individual undergoes full KYC, character verification, and local police station background checks.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* 2. Statutory Sub-Header Ribbon */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Enterprise Services</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Guarding &amp; Facility Catalog</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                Govt. PSARA Licensed &bull; ISO 9001:2015 &bull; 100% EPF/ESIC
              </span>
            </div>
          </div>
        </section>

        {/* 3. Editorial Header */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>Madhya Pradesh Guarding &amp; Facility Wing</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Security &amp; Facility Capabilities
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Statutory-compliant guarding details, surveillance control room operators, and mechanized facility housekeeping teams deployed across industrial zones, corporate parks, and private estates across all 55 districts of Madhya Pradesh.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Main Service Capabilities List (Side-by-Side Cards with Tall Un-cropped Photos) */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">

          <section>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                  Core Solutions
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                  Physical Guarding &amp; Facility Operations
                </h2>
              </div>
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-500">
                24/7 Central Control Room Monitored
              </span>
            </div>

            <div className="space-y-8">
              {primaryServices.map((svc) => (
                <div
                  key={svc.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 md:gap-8 items-stretch"
                >
                  {/* Left Column: Dedicated Tall Portrait Frame (Full Cap-to-Belt Turnout) */}
                  <div className="relative w-full md:w-[280px] lg:w-[320px] h-[340px] md:h-auto min-h-[340px] shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner group">
                    <Image
                      src={svc.image}
                      alt={svc.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className={`${svc.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                    />

                    {/* Subtle Overlay Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="rounded bg-[#0F172A]/90 backdrop-blur-xs px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10 shadow-xs">
                        {svc.badge}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 z-10">
                      <span className="rounded bg-black/75 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                        {svc.code}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <span className="inline-flex items-center gap-1.5 rounded bg-black/70 backdrop-blur-xs px-2.5 py-1 text-[11px] font-sans font-medium text-slate-200 border border-white/10">
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        Verified Active Turnout
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Deep Operational Content */}
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {svc.division}
                        </span>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0F172A] mt-0.5">
                          {svc.title}
                        </h3>
                        <p className="mt-1.5 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {svc.overview}
                        </p>
                      </div>

                      {/* Deliverables Checklist */}
                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-2">
                        <span className="block font-heading text-[11px] font-bold uppercase tracking-wider text-[#0F172A]">
                          Standard Operating Deliverables:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {svc.duties.map((duty, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-sans text-slate-700">
                              <CheckCircle2 className="h-3.5 w-3.5 text-red-700 shrink-0 mt-0.5" />
                              <span>{duty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Hardware Manifest */}
                      <div>
                        <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Issued Hardware &amp; Tooling:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {svc.hardware.map((item, i) => (
                            <span key={i} className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Bottom Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-sans font-medium text-slate-500 flex items-center gap-1.5">
                        <FileCheck2 className="h-4 w-4 text-emerald-600" />
                        {svc.sla}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          href={`/services/${svc.slug}`}
                          className="font-heading text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-red-700"
                        >
                          Detailed Scope &rarr;
                        </Link>
                        <Link
                          href="/contact"
                          className="rounded bg-red-700 px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-xs"
                        >
                          Deploy Force
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Specialized Enterprise Wings */}
          <section className="border-t border-slate-200 pt-16">
            <div className="max-w-3xl mb-10">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block mb-1">
                Specialized Wings
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                Surveillance, Fire Safety &amp; Custom Staffing
              </h2>
              <p className="font-sans text-sm text-slate-600 mt-2">
                Complement your static guarding and housekeeping contracts with specialized technical personnel trained for high-risk and high-compliance commercial environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specializedCapabilities.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between hover:border-amber-600/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#0F172A] text-amber-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="rounded bg-amber-50 border border-amber-200/60 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-800">
                        {item.badge}
                      </span>
                      <h3 className="font-heading text-base font-bold uppercase tracking-tight text-[#0F172A] mt-2">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-sans text-xs text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800"
                    >
                      <span>Inquire Requirements</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 6. Statutory & Quality Assurances */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
            <div className="max-w-3xl mb-8">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                Operational Framework
              </span>
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Why Madhya Pradesh Enterprises Trust VSF
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {operationalAssurances.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-red-700 shrink-0" />
                    <h3 className="font-heading text-sm font-bold uppercase tracking-tight text-[#0F172A]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="font-sans text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Institutional Rate Card & Manpower Intake CTA */}
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Commercial Manpower Mobilization
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Require a Guarding or Housekeeping Proposal?
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Contact our central deployment command to calculate site shift distributions, mandated tooling, and statutory PSARA compliance rate sheets within 24 hours.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
              >
                <span>Request Quotation</span>
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

      {/* 8. Global Footer */}
      <Footer />
    </div>
  );
}
