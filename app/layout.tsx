import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#B91C1C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vidhyasecurityforce.in'),
  title: {
    default: 'Vidhya Security Force & Housekeeping Services | Top Agency in MP',
    template: '%s | Vidhya Security Force',
  },
  description:
    'Govt. PSARA-licensed security guard agency and mechanized housekeeping services across Indore, Pithampur, Bhopal, Dewas, and all 55 MP districts.',
  keywords: [
    'security services in indore',
    'security guard agency madhya pradesh',
    'psara licensed security agency indore',
    'industrial security pithampur',
    'corporate housekeeping services bhopal',
    'armed bank gunmen madhya pradesh',
    'vidhya security force',
  ],
  authors: [{ name: 'Anil Dhariwal' }],
  creator: 'Vidhya Security Force & Housekeeping Services',
  publisher: 'Vidhya Security Force',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://vidhyasecurityforce.in',
  },
  openGraph: {
    title: 'Vidhya Security Force & Housekeeping Services | Madhya Pradesh',
    description:
      'Police-verified security guards, armed sentries, event bouncers & mechanized janitorial crews across all 55 MP districts.',
    url: 'https://vidhyasecurityforce.in',
    siteName: 'Vidhya Security Force',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/img/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Vidhya Security Force & Housekeeping Services MP',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vidhya Security Force & Housekeeping Services',
    description: 'Premier PSARA-licensed security & facility management agency in Madhya Pradesh.',
    images: ['/assets/img/og-cover.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Add your Google Search Console verification token here once generated
  verification: {
    google: 'YOUR_GSC_VERIFICATION_TOKEN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}
