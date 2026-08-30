import Link from 'next/link';
import {
  ShieldCheck,
  Sparkles,
  Factory,
  UserCheck,
  ArrowRight,
  Building2
} from 'lucide-react';

export function BentoServices() {
  const services = [
    {
      title: 'Industrial & Factory Security',
      category: 'Armed & Unarmed Guarding',
      description:
        'Material in/out register control, weighbridge monitoring, worker frisking, perimeter patrolling, and gate-pass verification across industrial belts.',
      link: '/services',
      icon: Factory,
      highlight: 'Pithampur & Indore Belts',
    },
    {
      title: 'Corporate Housekeeping & Facility',
      category: 'Deep Cleaning & Staffing',
      description:
        'Mechanized floor scrubbing, daily sanitization, pantry staff, waste management, and eco-friendly chemical maintenance for corporate parks and offices.',
      link: '/services',
      icon: Sparkles,
      highlight: 'Mechanized Equipment',
    },
    {
      title: 'Executive Protection & Event Bouncers',
      category: 'VIP & High-Risk Guarding',
      description:
        'Physically verified bouncers, crowd management for summits and exhibitions, VIP escorting, and corporate event security deployment.',
      link: '/services',
      icon: UserCheck,
      highlight: 'Trained & Height-Verified',
    },
    {
      title: 'Township & Commercial Mall Security',
      category: '24/7 Gated Security',
      description:
        'Visitor management systems, boom barrier operations, night vigil beats, and incident resolution for residential societies and retail centers.',
      link: '/services',
      icon: Building2,
      highlight: '24/7 CCTV & Beat Patrol',
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC] border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-800">
            <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
            <span>Specialized Guarding &amp; Facility Operations</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0F172A]">
            Our Core Security &amp; Facility Services
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed">
            Deployed with strict operational SOPs, regular night-shift officer inspections, and 100% legal EPF/ESIC compliance.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <span className="rounded bg-slate-100 px-2.5 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wider text-slate-700">
                      {service.category}
                    </span>
                    <span className="font-heading text-[11px] font-bold uppercase text-amber-700">
                      {service.highlight}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="rounded-xl bg-[#0F172A] p-2.5 text-amber-400 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-heading text-base sm:text-lg font-bold uppercase tracking-tight text-[#0F172A] group-hover:text-red-700 transition-colors">
                      {service.title}
                    </h3>
                  </div>

                  <p className="mt-3 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 transition-colors"
                  >
                    <span>View Deployment Scope</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <span className="text-[11px] font-sans font-medium text-emerald-600">
                    Zero Client Liability
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
