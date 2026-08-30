import { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Building2,
  CheckCircle2,
  Sparkles,
  HardHat,
  ShieldAlert,
  BadgeCheck
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Top Security Guard & Housekeeping Services Across Madhya Pradesh | VSF',
  description: 'Govt PSARA licensed security guard agency in Indore, Bhopal, Pithampur, Dewas, Ujjain & all 55 MP districts. Armed gunmen, VIP bouncers, industrial gate sentries & commercial housekeeping.',
  keywords: [
    'best security services in indore',
    'security guard agency pithampur',
    'armed gunmen in bhopal',
    'corporate bouncers ujjain',
    'industrial housekeeping dewas',
    'psara licensed security agency madhya pradesh',
    'factory gate security jabalpur gwalior'
  ],
  alternates: {
    canonical: 'https://vidhyasecurity.com/cities',
  },
  openGraph: {
    title: 'Madhya Pradesh Security Guard & Facility Hub | Vidhya Security Force',
    description: 'Licensed guarding squads and mechanized housekeeping deployments serving all industrial corridors and districts across MP.',
    url: 'https://vidhyasecurity.com/cities',
    type: 'website',
  }
};

interface CityHub {
  name: string;
  slug: string;
  role: string;
  division: string;
  pinCodes: string;
  keyServices: string[];
  clientClusters: string[];
  responseUnit: string;
}

const operationalDistricts: CityHub[] = [
  {
    name: 'Indore',
    slug: 'indore',
    role: 'Central Command & Quick Response HQ',
    division: 'Malwa Division',
    pinCodes: '452001 - 452020',
    keyServices: ['Commercial Lobby Sentry', 'Armed Bank Gunmen', 'Corporate Housekeeping', 'VIP Conclave Bouncers'],
    clientClusters: ['Vijay Nagar IT Park', 'Treasure Island Corridor', 'Bijalpur Commercial Hub', 'Sanwer Road Ind. Area'],
    responseUnit: 'Dedicated 24/7 Mobile Patrol Squad'
  },
  {
    name: 'Pithampur',
    slug: 'pithampur',
    role: 'Special Economic Zone (SEZ) & Auto Corridor',
    division: 'Dhar / Indore Industrial Belt',
    pinCodes: '454774 / 454775',
    keyServices: ['Factory Gate & Material Control', 'Epoxy Floor Care & 5S Cleaning', 'Truck Inward/Outward Frisking', 'Perimeter Yard Guards'],
    clientClusters: ['Pithampur Sector 1, 2 & 3', 'Smart Industrial Park (SIP)', 'SEZ Phase II', 'Kheda Industrial Belt'],
    responseUnit: 'Dedicated Industrial Night Inspection Team'
  },
  {
    name: 'Bhopal',
    slug: 'bhopal',
    role: 'Capital Region & Institutional Facility Wing',
    division: 'Bhopal Division',
    pinCodes: '462001 - 462044',
    keyServices: ['Govt Secretariat Guarding', 'Corporate Park Security', 'Mechanized Office Janitorial', 'Hospital Sanitization'],
    clientClusters: ['Govindpura Industrial Area', 'Mandideep Corridor', 'MP Nagar Commercial Zone', 'Arera Hills Complex'],
    responseUnit: 'Regional Assistant Field Officer Command'
  },
  {
    name: 'Dewas',
    slug: 'dewas',
    role: 'Chemical, Textile & Pharma Industrial Hub',
    division: 'Ujjain Division',
    pinCodes: '455001',
    keyServices: ['Hazardous Plant Sentry', 'Weighbridge Challan Inspection', 'Industrial Degreasing', 'Emergency Fire Hydrant Marshals'],
    clientClusters: ['Dewas Industrial Area Phase 1 & 2', 'Tata Square Commercial Hub', 'Bank Note Press Perimeter', 'Siya Industrial Zone'],
    responseUnit: 'Dewas Rapid Support Patrol Fleet'
  },
  {
    name: 'Ujjain',
    slug: 'ujjain',
    role: 'Religious Tourism, Event & Hospitality Security',
    division: 'Ujjain Division',
    pinCodes: '456001 - 456010',
    keyServices: ['Crowd Management Bouncers', 'Hotel & Resort Security', 'Commercial Complex Sentry', 'Corridor Janitorial Care'],
    clientClusters: ['Mahakal Temple Corridor', 'Nanakheda Commercial Belt', 'Maksi Road Industrial Area', 'Dewas Road Estates'],
    responseUnit: 'Event Escalation & Crowd Safety Unit'
  },
  {
    name: 'Gwalior',
    slug: 'gwalior',
    role: 'Northern MP Commercial & Logistics Gateway',
    division: 'Chambal / Gwalior Division',
    pinCodes: '474001 - 474020',
    keyServices: ['Warehouse Access Control', 'Armed Bank Gunmen', 'Retail Mall Housekeeping', 'Society Gate Sentries'],
    clientClusters: ['Malanpur Industrial Belt', 'Birlanagar Manufacturing Zone', 'City Center Commercial Hub', 'Maharaj Bada Market'],
    responseUnit: 'Northern Zone Field Inspection Office'
  },
  {
    name: 'Jabalpur',
    slug: 'jabalpur',
    role: 'Eastern Defense, Mining & Railway Corridor',
    division: 'Mahakoshal Division',
    pinCodes: '482001 - 482011',
    keyServices: ['Heavy Industry Sentry', 'Defense Establishment Perimeter', 'Quarry Material Tracking', 'Commercial Sanitization'],
    clientClusters: ['Richhai Industrial Area', 'Adhartal Commercial Center', 'Vijay Nagar Jabalpur', 'Civil Lines Hub'],
    responseUnit: 'Mahakoshal Command Unit'
  },
  {
    name: 'Ratlam',
    slug: 'ratlam',
    role: 'Rail Transit, Gold & Chemical Hub',
    division: 'Malwa Division',
    pinCodes: '457001',
    keyServices: ['Logistics Depot Security', 'Jewelry Showroom Guarding', 'Factory Floor Mopping', 'Shift In/Out Gate Frisking'],
    clientClusters: ['Dosigaon Industrial Belt', 'Station Road Commercial Zone', 'Jaora Road Logistics Yard', 'Manak Chowk'],
    responseUnit: 'Western MP Rapid Relief Unit'
  },
  {
    name: 'Khandwa',
    slug: 'khandwa',
    role: 'Nimar Power Generation & Agricultural Belt',
    division: 'Nimar Division',
    pinCodes: '450001',
    keyServices: ['Power Substation Security', 'Warehouse Stockpile Sentry', 'Agro-processing Guarding', 'Township Housekeeping'],
    clientClusters: ['Nimar Industrial Belt', 'Civil Lines Khandwa', 'Harsud Road Agro Zone', 'Thermal Power Sub-stations'],
    responseUnit: 'Nimar Zone Sentry Command'
  },
  {
    name: 'Satna',
    slug: 'satna',
    role: 'Cement Manufacturing & Mining Epicenter',
    division: 'Vindhya Division',
    pinCodes: '485001',
    keyServices: ['Cement Plant Perimeter Security', 'Truck Dispatch Verification', 'Limestone Mine Guarding', 'Heavy Machinery PPE Watch'],
    clientClusters: ['Maihar Cement Belt', 'Satna Industrial Estate', 'Panna Road Mining Corridor', 'Rewa Road Commercials'],
    responseUnit: 'Vindhya Industrial Patrol Mobile Unit'
  },
  {
    name: 'Sagar',
    slug: 'sagar',
    role: 'Bundelkhand Central Logistics & Institutional Hub',
    division: 'Bundelkhand Division',
    pinCodes: '470001 - 470004',
    keyServices: ['University Campus Guarding', 'Bank Branch Security', 'District Hospital Sanitation', 'Retail Showroom Sentries'],
    clientClusters: ['Sagar Cantonment Board', 'Civil Lines Commercial Complex', 'Bina Refinery Belt', 'Dhawa Industrial Area'],
    responseUnit: 'Bundelkhand Field Supervisor'
  },
  {
    name: 'Rewa',
    slug: 'rewa',
    role: 'Vindhya Regional Hub & Solar Infrastructure',
    division: 'Vindhya Division',
    pinCodes: '486001',
    keyServices: ['Solar Plant Boundary Defense', 'Commercial Complex Security', 'Office Housekeeping Staff', 'Night Searchlight Patrols'],
    clientClusters: ['Rewa Ultra Mega Solar Park', 'Gura Industrial Estate', 'College Road Commercial Hub', 'Kothi Compound'],
    responseUnit: 'Solar Infrastructure Security Squad'
  }
];

const allMpDistricts = [
  'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur',
  'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda',
  'Hoshangabad (Narmadapuram)', 'Indore', 'Jabalpur', 'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena',
  'Narsinghpur', 'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna',
  'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain',
  'Umaria', 'Vidisha', 'Mauganj', 'Pandhurna', 'Maihar'
];

export default function CitiesHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SecurityService',
    'name': 'Vidhya Security Force & Housekeeping Services',
    'description': 'Govt PSARA licensed security guard and mechanized facility housekeeping deployment across all 55 districts of Madhya Pradesh.',
    'url': 'https://vidhyasecurity.com/cities',
    'telephone': '+919826259292',
    'priceRange': '₹₹',
    'areaServed': allMpDistricts.map((dist) => ({
      '@type': 'City',
      'name': dist,
      'containedInPlace': {
        '@type': 'State',
        'name': 'Madhya Pradesh'
      }
    })),
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Madhya Pradesh Manpower & Security Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Armed & Static Security Guard Deployment'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Factory Gate Material & Loss Prevention Sentry'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'VIP Bouncers & Event Crowd Control Marshals'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Mechanized Industrial & Office Housekeeping'
          }
        }
      ]
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      {/* Schema.org Injection for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Top Context Bar */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Coverage Directory</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">All 55 Madhya Pradesh Districts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                PSARA State-Wide License: Valid Thru 2027
              </span>
            </div>
          </div>
        </section>

        {/* Hero Header with SEO Keyword Density */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>Madhya Pradesh Security Agency &amp; Facility Network</span>
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Security Guard &amp; Housekeeping Services in Madhya Pradesh
              </h1>

              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Deploy police-verified security guards, armed gunmen, VIP bouncers, gatehouse supervisors, and mechanized housekeeping staff across industrial clusters, commercial towers, banks, hospitals, and residential townships across Madhya Pradesh.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Statewide Reach</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">55 MP Districts</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">100% PSARA Licensed</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Mobilization Speed</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">24 to 48 Hours</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">Reserve Guard Squads</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Supervisory Grid</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">Surprise Night Checks</div>
                <div className="text-[11px] text-slate-500 font-medium mt-1">2 AM – 5 AM Patrols</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">Statutory Assurance</span>
                <div className="font-heading text-base font-bold text-[#0F172A] mt-0.5">100% EPF &amp; ESIC</div>
                <div className="text-[11px] text-emerald-600 font-medium mt-1">Zero Client Liability</div>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Industrial Hubs Grid */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
          <section>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-8">
              <div>
                <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                  Strategic Deployment Hubs
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0F172A]">
                  Major City &amp; Industrial Corridor Centers
                </h2>
              </div>
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-500">
                Click District for Local Post Strength &amp; Rates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {operationalDistricts.map((city) => (
                <div
                  key={city.slug}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-red-700/40 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Top Tag & Division */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="rounded bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-600">
                        PIN: {city.pinCodes}
                      </span>
                      <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded">
                        {city.division}
                      </span>
                    </div>

                    {/* Clickable City Name Link */}
                    <div>
                      <Link href={`/cities/${city.slug}`} className="block">
                        <h3 className="font-heading text-xl font-bold uppercase tracking-tight text-[#0F172A] group-hover:text-red-700 transition-colors flex items-center justify-between">
                          <span>{city.name}</span>
                          <MapPin className="h-4 w-4 text-red-700 shrink-0" />
                        </h3>
                      </Link>
                      <p className="mt-1 font-sans text-xs text-slate-600 font-medium">
                        {city.role}
                      </p>
                    </div>

                    {/* Deployed Manpower Capabilities */}
                    <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 space-y-1.5">
                      <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Specialized Guarding &amp; Facility Wings:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {city.keyServices.map((svc, sIdx) => (
                          <span key={sIdx} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-sans font-semibold text-slate-700">
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Active Client Sectors */}
                    <div>
                      <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Active Client Sectors &amp; Parks:
                      </span>
                      <ul className="space-y-1">
                        {city.clientClusters.map((cluster, cIdx) => (
                          <li key={cIdx} className="flex items-center gap-2 text-xs font-sans text-slate-600">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{cluster}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Bottom Slug Link */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-sans text-[11px] font-medium text-slate-400 truncate max-w-[170px]">
                      {city.responseUnit}
                    </span>
                    <Link
                      href={`/cities/${city.slug}`}
                      className="inline-flex items-center gap-1 font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 transition-colors"
                    >
                      <span>Explore {city.name} Hub</span>
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Programmatic All-55 MP Districts Complete Tag Index */}
          <section className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs space-y-6">
            <div className="max-w-3xl space-y-2">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-700 block">
                Statutory Statewide Jurisdiction
              </span>
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Comprehensive MP District Deployment Directory
              </h2>
              <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vidhya Security Force is authorized by the Home Department Controlling Authority to deploy commercial, armed, and industrial manpower across every district and tehsil of Madhya Pradesh:
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {allMpDistricts.map((district, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-sans text-xs font-medium text-slate-700 hover:border-red-700/40 transition-colors"
                >
                  <MapPin className="h-3 w-3 text-red-700" />
                  <span>{district}</span>
                </span>
              ))}
            </div>
          </section>

          {/* Institutional Mobilization Strip */}
          <section className="rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Immediate Statewide Mobilization
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Need Guards or Housekeeping at Your Property?
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Receive site post distributions, equipment allocations, and statutory PSARA compliance rate cards for any city or industrial area in Madhya Pradesh within 24 hours.
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
