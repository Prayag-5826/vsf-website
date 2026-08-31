import type { Metadata, Viewport } from 'next';
import { Montserrat, Open_Sans, Tiro_Devanagari_Hindi } from 'next/font/google';
import '../globals.css';
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const hindiFont = Tiro_Devanagari_Hindi({
  subsets: ['devanagari'],
  variable: '--font-hindi',
  weight: ['400'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0F172A',
};

export const metadata: Metadata = {
  title: 'Vidhya Security Force (VSF) | PSARA Licensed Security Agency MP',
  description:
    'Industrial, Commercial, and Residential Security Guards across Indore, Bhopal, and Madhya Pradesh. PSARA Certified, EPF & ESIC Compliant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${openSans.variable} ${hindiFont.variable} scroll-smooth`}
    >
      <body className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
