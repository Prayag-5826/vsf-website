import { CheckCircle2, FileSearch, ShieldCheck, UserCheck, RefreshCw } from 'lucide-react';

export default function OperationalWorkflow() {
  const steps = [
    {
      num: '01',
      icon: FileSearch,
      title: 'Aadhaar & Police KYC',
      desc: '100% background checks, biometric KYC, and clean criminal record verification with local police stations.'
    },
    {
      num: '02',
      icon: ShieldCheck,
      title: 'Physical & Fire Training',
      desc: 'Mandatory physical drills, gate logging SOPs, fire-fighting training, and visitor greeting protocols.'
    },
    {
      num: '03',
      icon: UserCheck,
      title: 'Site Deployment & Briefing',
      desc: 'Tailored on-site duty handover matching client risk points, boom barrier management, and inventory rules.'
    },
    {
      num: '04',
      icon: RefreshCw,
      title: '24/7 Field Audit & Backup',
      desc: 'Surprise night van inspections by Field Officers with instant substitute deployment in case of leave.'
    }
  ];

  return (
    <section className="py-20 bg-white border-y border-[#E8ECF2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#CB1517] block">Standard Operating Procedure</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1A2B4C] mt-2">The 4-Tier Guard Verification System</h2>
          <p className="text-slate-600 text-sm mt-2">How Vidhya Security Force guarantees absolute discipline and accountability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E8ECF2] hover:border-[#D49B18] transition relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E8ECF2] flex items-center justify-center text-[#CB1517] shadow-sm">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300">{step.num}</span>
                </div>
                <h3 className="text-lg font-black text-[#1A2B4C] mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/70 flex items-center gap-1 text-[11px] font-bold text-[#9B6B08]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#CB1517]" />
                <span>Verified Process</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
