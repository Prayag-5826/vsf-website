import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Cctv,
  Flame,
  Users,
  Settings2,
  MapPin,
  Award,
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Best Security Guard & Housekeeping Services in Indore, MP | Vidhya Security Force',
  description:
    'Govt. PSARA-licensed private security and mechanized housekeeping services across Indore, Pithampur & all 55 MP districts. 100% EPF/ESIC statutory compliance.',
  alternates: {
    canonical: 'https://vidhyasecurityforce.in/services',
  },
  openGraph: {
    title: 'Security Guard & Mechanized Housekeeping Services | Vidhya Security Force',
    description:
      'Premier PSARA-licensed security force and facility care agency headquartered in Indore, MP. Static guarding, industrial loss prevention, and corporate deep cleaning.',
    url: 'https://vidhyasecurityforce.in/services',
    siteName: 'Vidhya Security Force & Housekeeping Services',
    type: 'website',
  },
};

export default function ServicesPage() {
  const primaryServices = [
    {
      slug: 'security-guard',
      title: 'Industrial & Commercial Security Guard Services',
      division: 'Flagship Guarding',
      code: 'VSF-SEC-00',
      badge: 'PSARA Category A',
      image: '/assets/img/operations/commercial-entry-guard.webp',
      imageAlt: 'Vidhya Security Force Guard in Full Uniform',
      imagePosition: 'object-cover object-top',
      overview:
        'Disciplined, police-verified security guards and static sentries managing visitor access, perimeter defense, gate registers, and 24/7 facility vigilance across Indore and MP.',
      duties: [
        'Mandatory visitor verification, digital access passes & vehicle logging',
        'Automatic boom barrier and authorized parking lot traffic management',
        'Hourly perimeter boundary foot patrols with high-output search flashlights',
        'Immediate coordination with local police and client emergency management',
      ],
      hardware: ['Uniform Peak Cap & Epaulets', 'Handheld Metal Detector (HHMD)', 'Duty Baton & Whistle', 'Two-Way High-Frequency Radio'],
      sla: '100% Police KYC Verified | Zero-Delay Reliever Policy',
    },
    {
      slug: 'housekeeping',
      title: 'Mechanized Housekeeping & Facility Services',
      division: 'Facility Operations',
      code: 'VSF-FAC-00',
      badge: '5S Shopfloor Standards',
      image: '/assets/img/operations/housekeeping-floor-care.webp',
      imageAlt: 'Housekeeping Staff Cleaning Hallway Floor',
      imagePosition: 'object-cover object-center',
      overview:
        'Mechanized facility sanitation powered by heavy-duty auto scrubbers, high-pressure jet cleaners, and background-checked janitorial crews for corporate offices and plants.',
      duties: [
        'Continuous mopping of high-traffic commercial walkways and office atriums',
        'Hourly corporate restroom deep sanitization with automated sign-off checklists',
        'Mechanized electric floor scrubbing, buffing, and rapid oil-spill degreasing',
        'Color-coded cross-contamination prevention separating pantry and washroom tools',
      ],
      hardware: ['Heavy-Duty Floor Scrubbers', 'Industrial Slurry Vacuums', 'Diversey Safe Chemicals', 'Microfiber Flat Mops'],
      sla: 'Hourly Restroom Audits | 100% Statutory Compliant Staff',
    },
    {
      slug: 'armed-gunman',
      title: 'Licensed Armed Security Sentries & Gunmen',
      division: 'Armed Protection',
      code: 'VSF-SEC-05',
      badge: 'Ex-Military Sentries',
      image: '/assets/img/operations/guard-control-cabin.webp',
      imageAlt: 'Security Guards in Control Cabin',
      imagePosition: 'object-cover object-center',
      overview:
        'Ex-servicemen and licensed firearm sentries providing high-alert standoff defense for bank branches, cash transit logistics, bullion vaults, and critical industrial gates.',
      duties: [
        'Static armed deterrence stationed at vault entrances and bullion counters',
        'Armed transit escort for cash logistics and high-value precious cargo',
        'Industrial perimeter standoff enforcement against unlawful armed breaches',
        'Active coordination with local district police stations during security alerts',
      ],
      hardware: ['Licensed 12-Bore / DBBL Weapons', 'Ammunition Bandoliers', 'Tactical Guard Vests', 'Emergency Comms'],
      sla: 'Valid Govt. Firearm License | Ex-Servicemen Verification',
    },
    {
      slug: 'bouncers',
      title: 'VIP Protection & Event Security Bouncers',
      division: 'Executive Protection',
      code: 'VSF-SEC-03',
      badge: 'Physical Stature 6ft+',
      image: '/assets/img/operations/executive-bouncer-marshal.webp',
      imageAlt: 'VIP Bouncer in Tactical Uniform',
      imagePosition: 'object-cover object-top',
      overview:
        'High-stature, de-escalation trained bouncers and close-protection bodyguards for corporate summits, VIP transit, stage barricades, and high-footfall public conclaves.',
      duties: [
        'Cordoning VIP green rooms, stage barriers, and executive lounges',
        'Crowd surge damping and bottleneck management at high-footfall venues',
        'Personal executive transit escort with discrete acoustic communication earpieces',
        'Decisive, non-violent physical de-escalation of public disputes and trespassers',
      ],
      hardware: ['Tactical Black Uniform / Suit', 'Acoustic Comms Earpieces', 'Crowd Control Belts', 'First-Aid Kit'],
      sla: 'Trained Executive Marshals | Local Police NOC Coordination',
    },
    {
      slug: 'industrial-gate-material-control',
      title: 'Industrial Gate & Material Loss Control',
      division: 'Loss Prevention',
      code: 'VSF-SEC-02',
      badge: 'Factories Act Norms',
      image: '/assets/img/operations/guard-control-cabin.webp',
      imageAlt: 'Industrial Security Gatehouse Operations',
      imagePosition: 'object-cover object-center',
      overview:
        'Specialized industrial sentries trained in weighbridge checks, raw material delivery challans, truck cargo seals, and worker shift-end frisking.',
      duties: [
        'Delivery challan matching against approved purchase orders and gate passes',
        'Under-vehicle mirror inspection and container seal verification',
        'Shift-end worker metal detector frisking to stop tool and copper component theft',
        'Returnable and non-returnable material gate register reconciliation',
      ],
      hardware: ['Under-Vehicle Search Mirrors', 'Material Pass Tablets', 'High-Vis Safety Vests', 'Gatehouse Intercom'],
      sla: 'Reconciled Gate Registers | 100% Inward/Outward Audit',
    },
    {
      slug: 'factory-yard-perimeter-patrol',
      title: 'Factory Yard & Midnight Patrol Guarding',
      division: 'Perimeter Defense',
      code: 'VSF-SEC-04',
      badge: '24/7 Mobile QRT',
      image: '/assets/img/operations/field-guard-perimeter.webp',
      imageAlt: 'Industrial Yard Perimeter Security Guard',
      imagePosition: 'object-cover object-top',
      overview:
        'Static sentries and supervisory patrol officers conducting random midnight alertness inspections and safeguarding open industrial plots, raw materials, and yards.',
      duties: [
        'Hourly searchlight patrols across open storage yards and perimeter fences',
        'Randomized 2 AM – 5 AM surprise sobriety and alertness checks by VSF patrol vans',
        'Machinery asset protection against nighttime trespassing and sabotage',
        'Digital geo-tagged incident logs submitted directly to client managers',
      ],
      hardware: ['High-Power Search Flashlight', 'GPS Patrol Logger', 'Weatherproof Duty Gear', 'Duty Sentry Baton'],
      sla: 'Surprise Midnight Audits | Immediate Backup Squad Fleet',
    },
  ];

  const specializedCapabilities = [
    {
      icon: Cctv,
      title: '24/7 CCTV & Control Room Operators',
      desc: 'Trained technical personnel stationed in your central CCTV control room for real-time camera monitoring, video archiving, PTZ tracking, and perimeter intrusion alerting.',
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
      desc: 'Tailor-made staffing solutions where we recruit, train, and manage custom security or facility crews specific to your operating shifts and compliance standards.',
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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: primaryServices.map((svc, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: svc.title,
      description: svc.overview,
      url: `https://vidhyasecurityforce.in/services/${svc.slug}`,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* 1. Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* 2. Top Statutory Sub-Header Ribbon */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <Link href="/" className="hover:text-red-700 transition-colors">Home</Link>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Enterprise Guarding &amp; Facility Catalog</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-700">
                Govt. PSARA Licensed &bull; ISO 9001:2015 &bull; 100% EPF/ESIC
              </span>
            </div>
          </div>
        </section>

        {/* 3. Hero Editorial Header with Local Indore Anchor */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-900">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>Madhya Pradesh Guarding &amp; Facility Operations</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Security Guard &amp; Housekeeping Services
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Govt. PSARA-licensed physical guarding, armed sentry details, and mechanized facility management. Headquartered in Indore, deploying trained and police-verified manpower across Pithampur, Dewas, Sanwer Road, Bhopal, and all 55 districts of Madhya Pradesh.
              </p>

              {/* Local SEO Strategic Banner */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-slate-500 uppercase tracking-wide">Regional Deployment Hubs:</span>
                <Link
                  href="/cities/indore"
                  className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2.5 py-1 font-semibold text-red-700 hover:bg-red-100 transition-colors"
                >
                  <MapPin className="h-3 w-3" />
                  <span>Indore &amp; Pithampur (Primary Base)</span>
                </Link>
                <Link
                  href="/cities/bhopal"
                  className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Bhopal &amp; Mandideep
                </Link>
                <Link
                  href="/cities/dewas"
                  className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Dewas Industrial
                </Link>
                <Link
                  href="/cities/ujjain"
                  className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Ujjain
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Main Service Cards Grid */}
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
                  {/* Left Column: Image Frame */}
                  <div className="relative w-full md:w-[280px] lg:w-[320px] h-[340px] md:h-auto min-h-[340px] shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-100 shadow-inner group">
                    <Image
                      src={svc.image}
                      alt={svc.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className={`${svc.imagePosition} group-hover:scale-105 transition-transform duration-500`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

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
                        <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {svc.division}
                        </span>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#0F172A] mt-0.5">
                          {svc.title}
                        </h3>
                        <p className="mt-1.5 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {svc.overview}
                        </p>
                      </div>

                      {/* Standard Deliverables Checklist */}
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
                        <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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

                    {/* Action Bar with Matching Slugs */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-xs font-sans font-medium text-slate-600 flex items-center gap-1.5">
                        <FileCheck2 className="h-4 w-4 text-emerald-700" />
                        {svc.sla}
                      </span>
                      <div className="flex items-center gap-3 shrink-0">
                        <Link
                          href={`/services/${svc.slug}`}
                          className="font-heading text-xs font-bold uppercase tracking-wider text-[#0F172A] hover:text-red-700 transition-colors py-2 px-1"
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
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-800 block mb-1">
                Specialized Wings
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                Surveillance, Fire Safety &amp; Custom Staffing
              </h2>
              <p className="font-sans text-sm text-slate-600 mt-2">
                Complement your static guarding and housekeeping contracts with specialized technical personnel trained for high-risk, high-compliance commercial environments.
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
                      <span className="rounded bg-amber-50 border border-amber-200/60 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-900">
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
                      className="inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 py-1.5"
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

          {/* 7. B2B Deployment CTA */}
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

      <Footer />
    </div>
  );
}
