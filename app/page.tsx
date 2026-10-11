import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import { HeroSection } from '@/components/public/hero-section';
import { TrustBadges } from '@/components/public/trust-badges';
import { BentoServices } from '@/components/public/bento-services';
import { CtaBanner } from '@/components/public/cta-banner';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Vidhya Security Force & Housekeeping Services | Top Agency in MP',
  description:
    'Govt. PSARA Licensed security guards, armed bank gunmen, industrial factory gate sentries, and mechanized housekeeping across Indore, Bhopal, Pithampur & all 55 MP districts.',
  keywords: [
    'security services in indore',
    'security guard agency indore',
    'security services madhya pradesh',
    'psara licensed security agency mp',
    'corporate housekeeping services indore',
    'industrial gate security pithampur',
    'armed security guards bhopal',
    'vidhya security force'
  ],
  alternates: {
    canonical: 'https://vidhyasecurityforce.in',
  },
  openGraph: {
    title: 'Vidhya Security Force & Housekeeping Services | Madhya Pradesh',
    description:
      'Govt. PSARA Licensed security manpower and mechanized facility management across all MP industrial belts and 55 districts.',
    url: 'https://vidhyasecurityforce.in',
    siteName: 'Vidhya Security Force',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/img/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Vidhya Security Force MP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidhya Security Force & Housekeeping Services',
    description: 'Premier PSARA-licensed security & facility management agency in Madhya Pradesh.',
    images: ['/assets/img/og-cover.jpg'],
  },
};

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://vidhyasecurityforce.in/#organization',
    name: 'Vidhya Security Force & Housekeeping Services',
    legalName: 'Vidhya Security Force & Housekeeping Services',
    url: 'https://vidhyasecurityforce.in',
    logo: 'https://vidhyasecurityforce.in/assets/img/logo/logo.png',
    image: 'https://vidhyasecurityforce.in/assets/img/og-cover.jpg',
    telephone: '+919826259292',
    sameAs: [
      'https://www.facebook.com/people/Vidhya-Security-Force-And-Housekeeping-Services/100022317112649/',
      'https://www.instagram.com/vidhyasecurityforce/',
      'https://share.google/RfdmOCQNHIRNwqHob',
    ],
    email: 'contact@vidhyasecurityforce.in',
    priceRange: '₹₹',
    founder: {
      '@type': 'Person',
      name: 'Anil Dhariwal',
      jobTitle: 'Managing Director',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '012, A-Block, EWS Apartment, Treasure Town, Bijalpur',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452012',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.7196',
      longitude: '75.8577',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Madhya Pradesh',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Security & Housekeeping Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Armed & Unarmed Static Security Guards',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Industrial Gate & Material Control',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Corporate & Factory Housekeeping',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '24/7 Mobile Patrol Supervision',
          },
        },
      ],
    },
  };

  const popularServices = [
    { label: 'Security Guard Services', href: '/services/security-guard' },
    { label: 'Armed Security Guards', href: '/services/armed-gunman' },
    { label: 'Housekeeping Services', href: '/services/housekeeping' },
    { label: 'Bouncers & Event Security', href: '/services/bouncers' },
  ];

  const popularCities = [
    { label: 'Indore', href: '/cities/indore' },
    { label: 'Pithampur', href: '/cities/pithampur' },
    { label: 'Bhopal', href: '/cities/bhopal' },
    { label: 'Dewas', href: '/cities/dewas' },
    { label: 'Ujjain', href: '/cities/ujjain' },
    { label: 'Gwalior', href: '/cities/gwalior' },
    { label: 'Jabalpur', href: '/cities/jabalpur' },
  ];

  const faqs = [
    {
      q: 'What is a PSARA license and why does it matter?',
      a: 'The Private Security Agencies (Regulation) Act, 2005 (PSARA) requires security agencies to hold a licence from the state controlling authority. Hiring a licensed agency means guards are police-verified and trained, and the agency follows labour and statutory rules.',
    },
    {
      q: 'Which areas of Madhya Pradesh do you serve?',
      a: 'We provide security guards and housekeeping staff in Indore, Pithampur, Bhopal, Dewas, Ujjain, Gwalior, Jabalpur and other districts of Madhya Pradesh, coordinated from our Indore control room.',
    },
    {
      q: 'How quickly can guards be deployed at my site?',
      a: 'After a site survey and agreement, deployment rosters are typically arranged within 24 to 48 hours. Call +91 98262 59292 for an urgent requirement.',
    },
    {
      q: 'Do you provide armed security guards?',
      a: 'Yes. Armed security guards are available for suitable sites such as banks and cash-handling locations, subject to applicable arms and licensing rules.',
    },
    {
      q: 'Who pays the guards and handles EPF and ESIC?',
      a: 'We are the direct employer of every guard we deploy. We pay wages and remit Provident Fund (EPF) and ESIC contributions ourselves, and share compliance proofs with our invoices.',
    },
    {
      q: 'How do I get a quote?',
      a: 'Use the contact page or call +91 98262 59292 with your site type, location, number of guards and shift timings, and we will send a proposal.',
    },
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-white">
      {/* Schema.org Root Graph Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <Navbar />

      <main className="flex-1 w-full">
        {/* Core Home Sections */}
        <HeroSection />
        <TrustBadges />
        <BentoServices />

        {/* Internal links to the key service and city pages */}
        <section className="bg-slate-50 border-y border-slate-200 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 block">
                  Madhya Pradesh Coverage
                </span>
                <h2 className="text-lg sm:text-xl font-black uppercase text-[#0F172A] tracking-tight">
                  Security Guard &amp; Housekeeping Services Across Madhya Pradesh
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Police-verified guards, armed security guards, and mechanized housekeeping for factories, offices, banks and institutions, coordinated from our Indore control room.
                </p>
              </div>

              <Link
                href="/cities"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-all shadow-xs group cursor-pointer"
              >
                <span>Explore MP Cities</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <nav aria-label="Popular services">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Popular Services</h3>
                <ul className="flex flex-wrap gap-2">
                  {popularServices.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-block rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-700/40 hover:text-red-700 transition-colors">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav aria-label="Popular cities">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Popular Cities</h3>
                <ul className="flex flex-wrap gap-2">
                  {popularCities.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-red-700/40 hover:text-red-700 transition-colors">
                        <MapPin className="h-3 w-3 text-red-700" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* FAQ: visible answers to the questions customers ask before hiring */}
        <section className="bg-white py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0F172A] mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((item) => (
                <details key={item.q} className="group rounded-xl border border-slate-200 bg-white p-4 open:bg-slate-50">
                  <summary className="cursor-pointer list-none font-semibold text-sm text-[#0F172A] flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-red-700 text-lg leading-none group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
