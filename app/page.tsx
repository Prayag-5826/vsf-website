import { Navbar } from '@/components/public/navbar';
import { HeroSection } from '@/components/public/hero-section';
import { TrustBadges } from '@/components/public/trust-badges';
import { BentoServices } from '@/components/public/bento-services';
import { CtaBanner } from '@/components/public/cta-banner';
import Footer from '@/components/public/footer';

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
