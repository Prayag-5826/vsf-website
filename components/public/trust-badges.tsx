import { ShieldCheck, FileCheck2, Award, Building2 } from 'lucide-react';

const verifications = [
  {
    title: 'PSARA Licensed',
    detail: 'Certified by Controlling Authority, MP Home Dept.',
    icon: ShieldCheck,
  },
  {
    title: 'Statutory Payroll Compliant',
    detail: '100% EPF, ESIC, and Monthly Challan Submission',
    icon: FileCheck2,
  },
  {
    title: 'ISO Quality Standard',
    detail: 'Standardized physical and fire safety security drills',
    icon: Award,
  },
  {
    title: 'Corporate & Industrial',
    detail: 'Serving Pithampur, Indore & MP Industrial belts',
    icon: Building2,
  },
];

export function TrustBadges() {
  return (
    <section className="border-b border-slate-200 bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {verifications.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300 hover:shadow-xs"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-amber-400">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0F172A] leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-sans text-xs text-slate-600 leading-snug">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
