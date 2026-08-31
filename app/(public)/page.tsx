import type { Metadata } from 'next';
import { Navbar } from '@/components/public/navbar';
import { HeroSection } from '@/components/public/hero-section';
import { TrustBadges } from '@/components/public/trust-badges';
import { BentoServices } from '@/components/public/bento-services';
import { CtaBanner } from '@/components/public/cta-banner';
import Footer from '@/components/public/footer';

export const metadata: Metadata = {
  title: 'Vidhya Security Force & Housekeeping Services | Madhya Pradesh',
  description:
    'Govt. PSARA Licensed & ISO 9001:2015 certified armed/unarmed security guards, factory gate controllers, and corporate housekeeping services across Madhya Pradesh.',
  keywords: [
    'security guard agency indore',
    'security services madhya pradesh',
    'psara licensed security agency mp',
    'corporate housekeeping services indore',
    'industrial gate security pithampur',
    'armed security guards bhopal',
    'vidhya security force'
  ],
  alternates: {
    canonical: 'https://www.vidhyasecurityforce.in',
  },
  openGraph: {
    title: 'Vidhya Security Force & Housekeeping Services | MP',
    description:
      'Govt. PSARA Licensed & ISO 9001:2015 certified security manpower and facility management across MP industrial belts.',
    url: 'https://www.vidhyasecurityforce.in',
    siteName: 'Vidhya Security Force',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function HomePage() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SecurityService',
    name: 'Vidhya Security Force & Housekeeping Services',
    url: 'https://www.vidhyasecurityforce.in',
    telephone: '+919826259292',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      postalCode: '452001',
      addressCountry: 'IN',
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Navbar />
      <main className="flex-1 w-full">
        <HeroSection />
        <TrustBadges />
        <BentoServices />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
