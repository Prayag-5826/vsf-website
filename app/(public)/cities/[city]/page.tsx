import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Building2,
  HardHat,
  Sparkles,
  ArrowLeft,
  BadgeCheck,
  Clock,
  FileCheck2,
  Users,
  Wrench
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

interface CityData {
  name: string;
  tagline: string;
  division: string;
  pinCodes: string;
  phone: string;
  description: string;
  responseUnit: string;
  turnaroundTime: string;
  districts: string[];
  sectors: string[];
  capabilities: string[];
  hardwareDeployed: string[];
  complianceSpecs: { label: string; value: string }[];
}

// Complete Master List of All 55 Madhya Pradesh Districts
export const allMpDistrictsList = [
  'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur',
  'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
  'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena',
  'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
  'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
  'Umaria', 'Vidisha', 'Mauganj', 'Pandhurna', 'Maihar'
];

// Helper to sanitize slugs (e.g., 'Agar Malwa' -> 'agar-malwa')
export const formatSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

// Deep Localized Profiles for Primary Commercial Hubs
const primaryDistrictDirectory: Record<string, CityData> = {
  indore: {
    name: 'Indore',
    tagline: 'Central Operations Command & Rapid Mobilization Hub',
    division: 'Malwa Division',
    pinCodes: '452001 - 452020',
    phone: '+91 98262 59020',
    description: 'Vidhya Security Force provides PSARA-licensed security guards, armed bank sentries, event bouncers, and mechanized corporate housekeeping across commercial towers, tech parks, shopping complexes, and industrial belts throughout Indore.',
    responseUnit: 'Dedicated 24/7 Mobile QRT & Supervisory Patrol',
    turnaroundTime: 'Immediate Survey (Within 2 Hours)',
    districts: [
      'Vijay Nagar IT Park & Commercial Corridor',
      'Sanwer Road Industrial Area (Sector A–F)',
      'Super Corridor & Airport Highway Zone',
      'Bijalpur & Rau Commercial Hubs',
      'Palasia, MG Road & RNT Marg Commercial Hubs',
      'Treasure Town & AB Bypass Townships'
    ],
    sectors: [
      'IT Towers, MNC Plazas & Co-Working Centers',
      'Sanwer Road Engineering & Plastic Plants',
      'Corporate Banking Branches & Currency Vaults',
      'Multi-Story Gated Residential Townships'
    ],
    capabilities: [
      'Commercial Access Control & Lift Sentry',
      'Night Searchlight Foot Patrols',
      'Mechanized Office Janitorial & Washroom Audits',
      'Executive Protection & VIP Conclave Marshals'
    ],
    hardwareDeployed: ['Handheld Metal Detectors', 'Walkie-Talkie Grid', 'Microfiber Scrubbers', 'Sentry Batons & Torches'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'PSA/L/74/MP/2023/FEB/3/425' },
      { label: 'EPF Code', value: 'MPIND1462732000' },
      { label: 'ESIC Code', value: '18000237700000999' },
      { label: 'State Verification', value: '100% Police Verified' },
    ]
  },
  pithampur: {
    name: 'Pithampur',
    tagline: 'Special Economic Zone (SEZ) & Automobile Industrial Gateway',
    division: 'Dhar / Indore Industrial Corridor',
    pinCodes: '454774 / 454775',
    phone: '+91 98262 59020',
    description: 'Specialized industrial gatekeepers, material delivery challan controllers, cargo truck seal inspectors, and 5S factory housekeeping squads stationed across manufacturing plants and pharma cleanrooms in Pithampur SEZ.',
    responseUnit: 'Pithampur Industrial Night Patrol Squad',
    turnaroundTime: 'Guaranteed 24-Hour Mobilization',
    districts: [
      'Pithampur Sector 1, 2 & 3 Heavy Industrial Belts',
      'Special Economic Zone (SEZ) Phase II',
      'Smart Industrial Park (SIP) Zone',
      'Kheda Industrial Corridor & Warehousing Yards',
      'Pharma Formulation & Cleanroom Hubs',
      'Auto-Ancillary Machinery Compounds'
    ],
    sectors: [
      'Automobile Assembly & Ancillary Plants',
      'Pharmaceutical & Bulk Drug Formulations',
      'Large Scale Logistics & Cold Storage Warehouses',
      'Steel Rolling Mills & Heavy Machine Yards'
    ],
    capabilities: [
      'Material Inward/Outward Challan Reconciliation',
      'Under-Vehicle Mirror Search & Truck Frisking',
      'Epoxy Floor Care & Heavy Oil Degreasing',
      'Shift-Change Metal Detector Screening'
    ],
    hardwareDeployed: ['Under-Vehicle Search Mirrors', 'High-Vis Industrial Vests', 'Slurry Wet Vacuums', 'Gate Register Tablets'],
    complianceSpecs: [
      { label: 'Factories Act Norms', value: '100% Compliant' },
      { label: 'EPF / ESIC Records', value: 'Monthly Direct Credit' },
      { label: 'Safety Training', value: 'Mandatory PPE & 5S' },
      { label: 'Supervisory Audits', value: 'Midnight Surprise Checks' },
    ]
  },
  bhopal: {
    name: 'Bhopal',
    tagline: 'Capital Division & Institutional Facility Network',
    division: 'Bhopal Division',
    pinCodes: '462001 - 462044',
    phone: '+91 98262 59020',
    description: 'Enterprise guarding details, corporate facility housekeeping teams, and armed security marshals serving government administrative towers, corporate headquarters, hospitals, and industrial corridors across Bhopal and Mandideep.',
    responseUnit: 'Bhopal Regional Assistant Field Office',
    turnaroundTime: 'On-Site Survey Within 4 Hours',
    districts: [
      'Govindpura Industrial Area',
      'Mandideep Industrial Corridor (Phases 1–3)',
      'MP Nagar Commercial & Financial District',
      'Arera Hills & Kolar Road Institutional Zones',
      'Berasia Road Logistics Warehouses',
      'Hoshangabad Road Commercial Belts'
    ],
    sectors: [
      'Heavy Electricals & Engineering Corridors',
      'Government & Institutional Office Complexes',
      'Hospitals, Diagnostic Centers & Medical Hubs',
      'Commercial Retail Showrooms & Bank Branches'
    ],
    capabilities: [
      'Front Desk Badge & Access Authorization',
      'Daily Mechanized Housekeeping & Sanitization',
      'Surprise Midnight Field Officer Visits',
      'Parking Lot & Multi-Level Facility Guarding'
    ],
    hardwareDeployed: ['Metal Detectors (HHMD)', 'Color-Coded Cleaning Carts', 'High-Band Telecom Radios', 'Fire Safety Gear'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'Govt. of MP Certified' },
      { label: 'Labor Welfare', value: 'LWB-R-731 Registered' },
      { label: 'Billing Guarantee', value: 'Statutory ECR Challans' },
      { label: 'Staff KYC', value: '100% Background Checked' },
    ]
  },
  dewas: {
    name: 'Dewas',
    tagline: 'Chemical, Textile & Processing Plant Security Hub',
    division: 'Ujjain Division',
    pinCodes: '455001',
    phone: '+91 98262 59020',
    description: 'Full statutory compliance, police-verified sentry units, raw material loss prevention officers, and industrial scrubber operators serving heavy manufacturing plants, textile mills, and chemical facilities across Dewas.',
    responseUnit: 'Dewas Quick Response Patrol Unit',
    turnaroundTime: 'Deployment Ready in 24 Hours',
    districts: [
      'Dewas Industrial Area Phase 1 & 2',
      'AB Road Heavy Manufacturing Belt',
      'Bank Note Press (BNP) Road Logistics Zone',
      'Siya Industrial Belt & Warehousing Complexes',
      'Maksi Road Agro-Processing Corridors'
    ],
    sectors: [
      'Chemical & Fertilizer Manufacturing Units',
      'Textile Mills & Synthetic Garment Plants',
      'Agro-Processing & Packaging Facilities',
      'Commercial Warehouses & Logistics Hubs'
    ],
    capabilities: [
      'Weighbridge Slip & Delivery Invoice Audit',
      'Hazardous Plant Perimeter Guarding',
      'Epoxy Floor Degreasing & Machinery Wiping',
      'Worker Shift-End Anti-Pilferage Frisking'
    ],
    hardwareDeployed: ['Under-Vehicle Search Inspection Mirrors', 'Industrial PPE Gear', 'Breathalyzers', 'Search Floodlights'],
    complianceSpecs: [
      { label: 'Factories Act Audit', value: 'Full Safety Clearance' },
      { label: 'Minimum Wages', value: 'MP Gazetted Standard' },
      { label: 'EPF / ESIC', value: 'Direct Bank Passbook' },
      { label: 'Reliever Policy', value: 'Zero-Delay Backup' },
    ]
  },
  ujjain: {
    name: 'Ujjain',
    tagline: 'Hospitality, Event Crowd Control & Commercial Sentry Wing',
    division: 'Ujjain Division',
    pinCodes: '456001 - 456010',
    phone: '+91 98262 59020',
    description: 'Event crowd control marshals, executive bouncers, commercial complex sentries, and daily janitorial personnel deployed across temples, hotels, resorts, commercial banks, and industrial corridors in Ujjain.',
    responseUnit: 'Ujjain Event & Emergency Escalation Team',
    turnaroundTime: 'On-Site Team Assessment in 3 Hours',
    districts: [
      'Nagziri Industrial Area & Machinery Estates',
      'Maksi Road Manufacturing Zone',
      'Freeganj & Tower Chowk Commercial Centers',
      'Mahakal Corridor & Hospitality Belts',
      'Agar Road Logistics & Storage Yards'
    ],
    sectors: [
      'Hotels, Resorts & Hospitality Chains',
      'Nagziri Manufacturing & Processing Units',
      'Pilgrimage Events & Public Summits',
      'Educational Campuses & Colleges'
    ],
    capabilities: [
      'Crowd Surge Damping & Stage Barricades',
      'Hotel Gate Access & Parking Valet Security',
      'Continuous Corridor Damp Mopping',
      '24/7 Security Desk & Emergency Intercom'
    ],
    hardwareDeployed: ['Crowd Control Stanchions', 'Acoustic Earpieces', 'Microfiber Dust Mops', 'Duty Flashlights'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'Statewide MP Authorized' },
      { label: 'Police Coordination', value: 'Local Police Intimated' },
      { label: 'Verification', value: '100% Government KYC' },
      { label: 'Staff Turnout', value: 'Peak Cap / Black Bouncer Uniform' },
    ]
  },
  gwalior: {
    name: 'Gwalior',
    tagline: 'Northern MP Commercial Logistics & Industrial Guarding Wing',
    division: 'Chambal / Gwalior Division',
    pinCodes: '474001 - 474020',
    phone: '+91 98262 59020',
    description: 'Disciplined security squads, armed cash van sentries, retail mall cleaning staff, and warehouse access controllers operating across industrial parks and commercial hubs in Gwalior and Malanpur.',
    responseUnit: 'Northern Zone Field Supervisory Command',
    turnaroundTime: 'Deployment Mobilized within 48 Hours',
    districts: [
      'Malanpur Industrial Belt (Gwalior-Bhind Corridor)',
      'Birlanagar Manufacturing District',
      'City Center Commercial & Administrative Zone',
      'Maharaj Bada Retail Hub',
      'Lashkar & Morar Commercial Centers'
    ],
    sectors: [
      'FMCG Packaging & Processing Plants',
      'Shopping Malls, Supermarkets & Showrooms',
      'Banking & Financial Currency Centers',
      'Gated Societies & High-Rise Townships'
    ],
    capabilities: [
      'Warehouse Bay Gate & Challan Logging',
      'Armed Gunmen Cash Protection',
      'Hourly Restroom Deep Cleaning SOPs',
      'Perimeter Fence Security & Night Checks'
    ],
    hardwareDeployed: ['Handheld Metal Detectors', 'Walkie-Talkie Sets', 'Floor Scrubbers', 'Sentry Batons'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'PSA/L/74/MP/2023/FEB/3/425' },
      { label: 'Statutory EPF/ESIC', value: '100% Monthly Challans' },
      { label: 'Police Verification', value: 'Complete Record Check' },
      { label: 'Turnout Standard', value: 'Crisp Uniform & Badging' },
    ]
  },
  jabalpur: {
    name: 'Jabalpur',
    tagline: 'Eastern Defense, Mining & Heavy Manufacturing Guarding Hub',
    division: 'Mahakoshal Division',
    pinCodes: '482001 - 482011',
    phone: '+91 98262 59020',
    description: 'Heavy industrial sentries, raw material loss prevention officers, defense perimeter controllers, and facility cleaning squads serving engineering units, mining belts, and commercial hubs in Jabalpur.',
    responseUnit: 'Mahakoshal Command Field Unit',
    turnaroundTime: 'Survey & Post Plan in 24 Hours',
    districts: [
      'Richhai Industrial Area Phases 1 & 2',
      'Adhartal Commercial & Light Industry Belt',
      'Vijay Nagar Jabalpur Commercial Complex',
      'Civil Lines Administrative Zone',
      'Khamaria Defense Compound Perimeter'
    ],
    sectors: [
      'Heavy Engineering & Defense Equipment Units',
      'Quarrying, Cement & Stone Crushing Yards',
      'Hospitals, Clinics & Diagnostic Centers',
      'Logistics Warehouses & Transport Terminals'
    ],
    capabilities: [
      'Inward/Outward Truck Dispatch Audits',
      'Perimeter Searchlight Night Patrols',
      'Corridor Janitorial & Washroom Sanitation',
      'Emergency Fire Alarm & Hydrant Response'
    ],
    hardwareDeployed: ['Under-Vehicle Mirrors', 'Search Floodlights', 'Wet & Dry Vacuums', 'Two-Way Radios'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'Govt. PSARA Licensed' },
      { label: 'Labor Laws', value: 'Zero Statutory Liability' },
      { label: 'Wage Standards', value: 'MP Minimum Wages Act' },
      { label: 'Supervision', value: 'Active Night Audits' },
    ]
  }
};

// Programmatic Generator for Remaining 48 Districts to Guarantee 100% Indexing
export function getDistrictData(slug: string): CityData | null {
  const cleanSlug = slug.toLowerCase();

  if (primaryDistrictDirectory[cleanSlug]) {
    return primaryDistrictDirectory[cleanSlug];
  }

  // Find district match in all 55 districts
  const matchedDistrict = allMpDistrictsList.find(d => formatSlug(d) === cleanSlug);
  if (!matchedDistrict) return null;

  return {
    name: matchedDistrict,
    tagline: `Statutory PSARA Security & Facility Operations Wing`,
    division: `${matchedDistrict} District Headquarters`,
    pinCodes: `Statewide PIN Corridor (${matchedDistrict})`,
    phone: '+91 98262 59020',
    description: `Vidhya Security Force provides government PSARA-licensed commercial security guards, armed bank sentries, loss prevention officers, and mechanized housekeeping services across ${matchedDistrict} district, Madhya Pradesh.`,
    responseUnit: `${matchedDistrict} Mobile Field Supervisory Squad`,
    turnaroundTime: 'Deployment Roster in 24-48 Hours',
    districts: [
      `${matchedDistrict} Commercial Center & Collectorate Area`,
      `${matchedDistrict} Industrial Area & Logistics Belt`,
      `Banking Corridors & Financial Complexes in ${matchedDistrict}`,
      `Gated Residential Townships & Healthcare Hubs`
    ],
    sectors: [
      'Commercial Complexes, Banks & Retail Centers',
      'Warehousing, Grain Storage & Industrial Units',
      'Hospitals, Diagnostic Centers & Educational Campuses',
      'Residential Housing Societies & High-Rise Townships'
    ],
    capabilities: [
      'Main Gate Access Control & Visitor Badging',
      '24/7 Foot Patrols & Night Perimeter Checks',
      'Mechanized Commercial Sweeping & Washroom Sanitization',
      'Material Dispatch Challan Verification'
    ],
    hardwareDeployed: ['Handheld Metal Detectors (HHMD)', 'Walkie-Talkie Radios', 'Microfiber Wet/Dry Mops', 'Heavy Duty Search Torches'],
    complianceSpecs: [
      { label: 'PSARA License', value: 'PSA/L/74/MP/2023/FEB/3/425' },
      { label: 'EPF Registration', value: 'MPIND1462732000' },
      { label: 'ESIC Registration', value: '18000237700000999' },
      { label: 'Police Verification', value: '100% Background KYC Cleared' }
    ]
  };
}

// 1. Static Generation for Programmatic SEO across all 55 MP Districts
export async function generateStaticParams() {
  // Includes all 55 districts plus special industrial corridors (like Pithampur)
  const combined = Array.from(new Set(['pithampur', ...allMpDistrictsList.map(d => formatSlug(d))]));
  return combined.map(city => ({ city }));
}

// 2. High-Intent Metadata for Local SEO Ranking
export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  const data = getDistrictData(city);

  if (!data) {
    return {
      title: 'City Deployment Directory | Vidhya Security Force Madhya Pradesh',
      description: 'PSARA licensed security guard and housekeeping deployments across Madhya Pradesh.',
    };
  }

  return {
    title: `Best Security Guard Agency in ${data.name}, MP | PSARA Licensed VSF`,
    description: `Hire police-verified security guards, armed gunmen, VIP bouncers & mechanized housekeeping in ${data.name}, Madhya Pradesh. 100% EPF/ESIC statutory compliance. Direct Call: +91 98262 59020.`,
    keywords: [
      `security services in ${data.name.toLowerCase()}`,
      `security guard agency ${data.name.toLowerCase()}`,
      `hire security guard in ${data.name.toLowerCase()}`,
      `housekeeping services ${data.name.toLowerCase()}`,
      `armed gunmen ${data.name.toLowerCase()}`,
      `psara licensed security agency in ${data.name.toLowerCase()}`,
      `vidhya security force ${data.name.toLowerCase()}`
    ],
    alternates: {
      canonical: `https://vidhyasecurityforce.in/cities/${city}`,
    },
    openGraph: {
      title: `Top Security Guard & Housekeeping Agency in ${data.name} | Vidhya Security Force`,
      description: `Licensed guarding details and mechanized housekeeping for commercial, industrial, and residential properties in ${data.name}, MP.`,
      url: `https://vidhyasecurityforce.in/cities/${city}`,
      type: 'website',
    }
  };
}

export default async function CitySlugPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const currentCity = getDistrictData(city);

  if (!currentCity) {
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SecurityService',
    'name': `Vidhya Security Force & Housekeeping Services - ${currentCity.name}`,
    'description': currentCity.description,
    'url': `https://vidhyasecurityforce.in/cities/${city}`,
    'telephone': '+919826259020',
    'priceRange': '₹₹',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': currentCity.name,
      'addressRegion': 'Madhya Pradesh',
      'addressCountry': 'IN'
    },
    'areaServed': {
      '@type': 'City',
      'name': currentCity.name,
      'containedInPlace': {
        '@type': 'State',
        'name': 'Madhya Pradesh'
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* Schema.org Injection for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Top Context Sub-Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <Link
              href="/cities"
              className="group inline-flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500 hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Back to MP Coverage Directory</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-700">
                {currentCity.division} &bull; {currentCity.pinCodes}
              </span>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14 space-y-12">

          {/* Hero Header Block */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
            <div className="max-w-4xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
                <MapPin className="h-3.5 w-3.5 text-red-700" />
                <span>On-Ground Deployment &bull; {currentCity.name}, Madhya Pradesh</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Security Guard &amp; Housekeeping Services in <span className="text-red-700">{currentCity.name}</span>
              </h1>

              <p className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500">
                {currentCity.tagline}
              </p>

              <p className="font-sans text-base text-slate-600 leading-relaxed pt-1">
                {currentCity.description}
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Response Fleet</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">{currentCity.responseUnit}</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">24/7 Mobile Squad</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Mobilization SLA</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">{currentCity.turnaroundTime}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">Site Post Survey</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Statutory Standard</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">PSARA Licensed</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">100% EPF &amp; ESIC</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Night Supervision</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">Surprise Night Audits</div>
                <div className="text-[10px] text-slate-500 font-medium mt-1">2 AM – 5 AM Guard Checks</div>
              </div>
            </div>

            {/* Immediate Action Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded bg-red-700 px-6 py-3 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-xs"
              >
                <span>Request Deployment in {currentCity.name}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259020"
                className="inline-flex items-center gap-2 rounded border border-slate-200 bg-slate-50 px-5 py-3 font-heading text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-amber-600" />
                <span>Control Room: +91 98262 59020</span>
              </a>
            </div>
          </div>

          {/* Deployment Zones & Industry Sectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                  Local Jurisdiction
                </span>
                <h3 className="font-heading text-xl font-black uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-red-700" />
                  Key Deployment Zones in {currentCity.name}
                </h3>
              </div>

              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                Active guarding squad posts and mechanized cleaning teams stationed across major industrial parks and commercial hubs:
              </p>

              <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                {currentCity.districts.map((d, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-sans font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-red-700 shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block mb-1">
                  Client Environments
                </span>
                <h3 className="font-heading text-xl font-black uppercase tracking-tight text-[#0F172A] flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  Industry Sectors Protected in {currentCity.name}
                </h3>
              </div>

              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                Tailored Standard Operating Procedures (SOPs) matching industrial compliance and corporate reception standards:
              </p>

              <ul className="space-y-2.5 pt-2 border-t border-slate-100">
                {currentCity.sectors.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-sans font-medium text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Manpower Capabilities vs Tooling Manifest */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
            <div className="md:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  On-Ground Operations
                </span>
                <h3 className="font-heading text-xl font-black uppercase tracking-tight text-[#0F172A]">
                  Operational Capabilities Available in {currentCity.name}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentCity.capabilities.map((cap, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-sans font-medium text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="flex items-center gap-1.5 font-heading text-[11px] font-bold uppercase text-slate-400 mb-2">
                  <Wrench className="h-3.5 w-3.5 text-amber-600" />
                  Standard Deployed Tooling in {currentCity.name}:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCity.hardwareDeployed.map((tool, tIdx) => (
                    <span key={tIdx} className="rounded bg-slate-100 px-2.5 py-1 text-[11px] font-sans font-medium text-slate-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-[#0F172A] p-6 sm:p-8 text-white shadow-panel flex flex-col justify-between space-y-4">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
                  Zero Client Liability
                </span>
                <h3 className="font-heading text-xl font-black uppercase tracking-tight text-white">
                  Statutory Directives &amp; KYC
                </h3>
                <p className="font-sans text-xs text-slate-300 mt-2 leading-relaxed">
                  Every security guard and housekeeping team member stationed in {currentCity.name} is supported by complete statutory documentation.
                </p>
              </div>

              <div className="divide-y divide-slate-800 border-t border-b border-slate-800">
                {currentCity.complianceSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-sans text-slate-400">{spec.label}</span>
                    <span className="font-mono font-bold text-amber-300">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-sans text-emerald-400 font-medium">
                  <BadgeCheck className="h-4 w-4" />
                  Monthly ECR Challans Provided With Invoicing
                </span>
              </div>
            </div>
          </div>

          {/* Sibling Cities Quick Navigation */}
          <nav aria-label="Other Cities" className="space-y-4">
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-slate-500">
              Explore Other Major MP Deployment Hubs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {allMpDistrictsList
                .filter((d) => formatSlug(d) !== city.toLowerCase())
                .slice(0, 12)
                .map((d) => (
                  <Link
                    key={d}
                    href={`/cities/${formatSlug(d)}`}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-red-700/50 hover:shadow-xs transition-all text-center group"
                  >
                    <div className="font-heading text-xs font-bold uppercase text-[#0F172A] group-hover:text-red-700 transition-colors">
                      {d}
                    </div>
                    <div className="font-sans text-[10px] text-slate-400 mt-0.5 truncate">
                      Madhya Pradesh
                    </div>
                  </Link>
                ))}
            </div>
          </nav>

          {/* Bottom Mobilization Strip */}
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Direct Deployment &bull; {currentCity.name}, MP
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Require a Structured Guarding or Housekeeping Plan?
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Contact our central operations command to schedule a site post assessment in {currentCity.name}, calculate required shift distributions, and receive a statutory PSARA compliance rate sheet within 24 hours.
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
