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
    '@type': 'SecurityService',
    '@id': 'https://vidhyasecurityforce.in/#organization',
    name: 'Vidhya Security Force & Housekeeping Services',
    legalName: 'Vidhya Security Force & Housekeeping Services',
    url: 'https://vidhyasecurityforce.in',
    logo: 'https://vidhyasecurityforce.in/assets/img/logo/logo.png',
    image: 'https://vidhyasecurityforce.in/assets/img/og-cover.jpg',
    telephone: '+919826259020',
    email: 'vidhyasecurity@gmail.com',
    priceRange: '₹₹',
    founder: {
      '@type': 'Person',
      name: 'Anil Dhariwal',
      jobTitle: 'Managing Director',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '012 A Block Treasure Town',
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

        {/* High-Authority SEO Internal Linking Bridge to 55 Districts */}
        <section className="bg-slate-50 border-y border-slate-200 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 block">
                Statutory Statewide Jurisdiction
              </span>
              <h2 className="text-lg sm:text-xl font-black uppercase text-[#0F172A] tracking-tight">
                Active Deployment Across All 55 Districts of Madhya Pradesh
              </h2>
              <p className="text-xs text-slate-500 max-w-2xl">
                Police-verified guards, armed gunmen, and mechanized housekeeping stationed across Indore, Pithampur, Bhopal, Dewas, Ujjain, Gwalior, Jabalpur, and all state tehsils.
              </p>
            </div>

            <Link
              href="/cities"
              className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-all shadow-xs group cursor-pointer"
            >
              <span>Explore 55 MP Outposts</span>
              <ArrowRight className="h-3.5 w-3.5 text-amber-300 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
