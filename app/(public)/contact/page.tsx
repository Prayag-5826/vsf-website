import { Metadata } from 'next';
import {
  PhoneCall,
  MapPin,
  Mail,
  ShieldCheck,
  Clock,
  Building2,
  CheckCircle2,
  BadgeCheck,
  Shield,
  Truck
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';
import DeploymentRequestForm from '@/components/public/deployment-request-form';

export const metadata: Metadata = {
  title: 'Hire Security Guards & Housekeeping Services | Vidhya Security Force MP',
  description: 'Request a site assessment and customized quotation for commercial security guards, armed gunmen, VIP bouncers, and facility cleaning across Indore, Bhopal, Pithampur, Dewas, and all MP districts.',
  keywords: [
    'hire security guards indore',
    'security agency contact number madhya pradesh',
    'commercial housekeeping quotation indore',
    'bouncers for events indore',
    'factory gate security pithampur'
  ],
  alternates: {
    canonical: 'https://vidhyasecurity.com/contact',
  },
};

export default function ContactPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Vidhya Security Force & Housekeeping Services',
    'image': 'https://vidhyasecurity.com/assets/img/logo/logo.png',
    'telephone': '+919826259292',
    'email': 'contact@vidhyasecurityforce.in',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '012, A-Block, EWS Apartment, Treasure Town, Bijalpur',
      'addressLocality': 'Indore',
      'addressRegion': 'Madhya Pradesh',
      'postalCode': '452012',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 22.6718,
      'longitude': 75.8340
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '00:00',
      'closes': '23:59'
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* Top Status Ribbon */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Customer Helpdesk</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Staffing &amp; Guard Deployment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                24/7 Operations Room Active &bull; Madhya Pradesh
              </span>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>Fast Mobilization &bull; All 55 MP Districts</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Get a Guarding &amp; Facility Proposal
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Connect with our Indore operations control room to deploy verified security staff, armed guards, VIP bouncers, and mechanized housekeeping teams to your property.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Phone Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-700/10 text-red-700 border border-red-700/20">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      24/7 Operations Desk
                    </span>
                    <h2 className="font-heading text-base font-bold uppercase text-[#0F172A] mt-0.5">
                      Direct Phone Call
                    </h2>
                    <p className="font-sans text-xs text-slate-600 mt-1">
                      Call our dispatch team directly for quick site post surveys and emergency relief staff.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1">
                  <a
                    href="tel:+919826259292"
                    className="font-heading text-base font-black text-red-700 hover:text-red-800 block tracking-tight"
                  >
                    +91 98262 59292
                  </a>
                  <span className="font-sans text-[11px] text-slate-500 block">
                    Available 24 Hours &bull; 7 Days a Week
                  </span>
                </div>
              </div>

              {/* Email Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700 border border-amber-600/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Email Inquiries
                    </span>
                    <h2 className="font-heading text-base font-bold uppercase text-[#0F172A] mt-0.5">
                      Send Requirements
                    </h2>
                    <p className="font-sans text-xs text-slate-600 mt-1">
                      Send your site specifications, shift timings, or vendor registration forms.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1">
                  <a
                    href="mailto:contact@vidhyasecurityforce.in"
                    className="font-mono text-xs font-bold text-[#0F172A] hover:text-red-700 block truncate"
                  >
                    contact@vidhyasecurityforce.in
                  </a>
                  <span className="font-sans text-[11px] text-slate-500 block">
                    Response SLA: Within 2 Hours
                  </span>
                </div>
              </div>

              {/* Office Card */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
                <div className="space-y-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900/10 text-slate-800 border border-slate-300">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-heading text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Visit Headquarters
                    </span>
                    <h2 className="font-heading text-base font-bold uppercase text-[#0F172A] mt-0.5">
                      Indore Central Office
                    </h2>
                    <p className="font-sans text-xs text-slate-600 mt-1">
                      012, A-Block, EWS Apartment, Treasure Town, Bijalpur
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="font-heading text-xs font-bold uppercase text-slate-800 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-red-700" />
                    Indore, MP &bull; 452012
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Clean Center-Aligned Deployment Form Container */}
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
            <DeploymentRequestForm />
          </div>

          {/* Client Assurance Badges */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-700 mb-2">
                <Clock className="h-4 w-4" />
              </div>
              <div className="font-heading font-bold text-slate-900 uppercase text-[11px]">2-Hour Site Survey</div>
              <div className="text-slate-500 text-[11px]">Fast local response in Indore &amp; nearby belts.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 mb-2">
                <Shield className="h-4 w-4" />
              </div>
              <div className="font-heading font-bold text-slate-900 uppercase text-[11px]">100% PSARA Licensed</div>
              <div className="text-slate-500 text-[11px]">Full compliance with zero client liability.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-700 mb-2">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <div className="font-heading font-bold text-slate-900 uppercase text-[11px]">Surprise Night Audits</div>
              <div className="text-slate-500 text-[11px]">Active inspections from 2 AM to 5 AM.</div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 text-center">
              <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700 mb-2">
                <Truck className="h-4 w-4" />
              </div>
              <div className="font-heading font-bold text-slate-900 uppercase text-[11px]">Rapid Staff Placement</div>
              <div className="text-slate-500 text-[11px]">Trained personnel positioned in 24–48 hrs.</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
