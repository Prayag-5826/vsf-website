'use client';

import { useState } from 'react';
import { Shield, PhoneCall, Send, CheckCircle2, Building2, MapPin } from 'lucide-react';

export default function DeploymentRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="w-full bg-[#0F172A] text-white p-6 sm:p-10 lg:p-12 relative overflow-hidden">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">

        {/* Left Column: Operations Overview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-heading font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>Manpower Placement Desk</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
            Request a Free Site Assessment &amp; Proposal
          </h2>

          <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
            Submit your requirements for commercial security, factory gate sentries, or facility housekeeping manpower. Our Field Operations Manager will contact you within 2 hours.
          </p>

          <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs font-sans text-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-obligation on-site risk analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Customized manpower strength &amp; shift roster</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full statutory EPF, ESIC, and PSARA compliance guarantee</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <a
              href="tel:+919826259292"
              className="inline-flex items-center gap-2 font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-300 hover:text-amber-200 transition"
            >
              <PhoneCall className="w-4 h-4 text-red-500" />
              <span>Control Room: +91 98262 59292</span>
            </a>
          </div>
        </div>

        {/* Right Column: Lead Form Card */}
        <div className="lg:col-span-7 bg-white text-[#0F172A] p-5 sm:p-8 rounded-2xl shadow-xl border border-slate-200">
          {submitted ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Deployment Request Received
              </h3>
              <p className="font-sans text-slate-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                Our Field Operations Officer will review your parameters and reach out via phone shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98260 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Company / Society Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Industrial Park"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    City / Location in MP *
                  </label>
                  <select
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none bg-white font-medium transition cursor-pointer"
                  >
                    <option value="Indore">Indore</option>
                    <option value="Pithampur">Pithampur</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Dewas">Dewas</option>
                    <option value="Ujjain">Ujjain</option>
                    <option value="Ratlam">Ratlam</option>
                    <option value="Gwalior">Gwalior</option>
                    <option value="Jabalpur">Jabalpur</option>
                    <option value="Satna">Satna</option>
                    <option value="Sagar">Sagar</option>
                    <option value="Khandwa">Khandwa</option>
                    <option value="Rewa">Rewa</option>
                    <option value="Other">Other MP District</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Services Required *
                </label>
                <select
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none bg-white font-medium transition cursor-pointer"
                >
                  <option value="Industrial / Factory Gate Security">Industrial &amp; Factory Gate Security</option>
                  <option value="Commercial / Office Complex Sentry">Commercial &amp; Office Complex Sentry</option>
                  <option value="Residential Society Guards">Residential Society &amp; Township Security</option>
                  <option value="Mechanized Housekeeping">Corporate &amp; Industrial Housekeeping</option>
                  <option value="Armed Guards / Bank Sentry">Armed Security Guards / Bank Sentry</option>
                  <option value="Event Bouncers & Marshals">VIP Bouncers &amp; Event Marshals</option>
                  <option value="Combined Security + Housekeeping">Combined Security &amp; Housekeeping Package</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Estimated Headcount or Site Details
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Need 4 security guards for 12-hour shifts at a plant near Pithampur..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none resize-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-heading text-xs font-bold uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Deployment Request</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
