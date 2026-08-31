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
    'Govt. PSARA Licensed & ISO 9001:2015 certified armed/unarmed security guards, factory gate controllers, and facility housekeeping manpower across Madhya Pradesh.',
  alternates: {
    canonical: 'https://www.vidhyasecurityforce.in',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-white">
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
