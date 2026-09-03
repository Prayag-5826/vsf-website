'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  Send,
  CheckCircle2,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Shield,
  Loader2,
  Clock4,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

const serviceOptions = [
  'Industrial / Factory Gate Security',
  'Commercial / Office Complex Sentry',
  'Residential Society & Township Security',
  'Corporate & Industrial Housekeeping',
  'Armed Security Guards / Bank Sentry',
  'VIP Bouncers & Event Marshals',
  'Combined Security & Housekeeping Package',
];

const cityOptions = [
  'Agar Malwa',
  'Alirajpur',
  'Anuppur',
  'Ashoknagar',
  'Balaghat',
  'Barwani',
  'Betul',
  'Bhind',
  'Bhopal (State Capital)',
  'Burhanpur',
  'Chhatarpur',
  'Chhindwara',
  'Damoh',
  'Datia',
  'Dewas',
  'Dhar',
  'Dindori',
  'Guna',
  'Gwalior',
  'Harda',
  'Indore',
  'Jabalpur',
  'Jhabua',
  'Katni',
  'Khandwa (East Nimar)',
  'Khargone (West Nimar)',
  'Maihar',
  'Mandla',
  'Mandsaur',
  'Mauganj',
  'Morena',
  'Narmadapuram (Hoshangabad)',
  'Narsinghpur',
  'Neemuch',
  'Niwari',
  'Pandhurna',
  'Panna',
  'Raisen',
  'Rajgarh',
  'Ratlam',
  'Rewa',
  'Sagar',
  'Satna',
  'Sehore',
  'Seoni',
  'Shahdol',
  'Shajapur',
  'Sheopur',
  'Shivpuri',
  'Sidhi',
  'Singrauli',
  'Tikamgarh',
  'Ujjain',
  'Umaria',
  'Vidisha'
];

export default function DeploymentRequestForm() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('Indore');
  const [serviceType, setServiceType] = useState('Industrial / Factory Gate Security');
  const [headcountNotes, setHeadcountNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidIndianMobile = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    return /^[6-9]\d{9}$/.test(cleaned);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidIndianMobile(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim().toLowerCase(),
          company_name: companyName.trim(),
          city,
          service_type: serviceType,
          headcount_notes: headcountNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit proposal request.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection error. Please dial our central control room directly.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12">

        {/* Left Operational Context Sidebar */}
        <div className="lg:col-span-5 bg-slate-900 text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>PSARA Verified Manpower</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Request Deployment Quote
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Submit parameters for corporate guarding, industrial sentries, or housekeeping teams. Our operations officer will respond with a site post proposal within 2 hours.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero-obligation on-site risk analysis &amp; post mapping</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>100% direct statutory compliance (EPF, ESIC, GST)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Active night supervisory patrolling (2 AM &ndash; 5 AM)</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-2">
            <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Central Control Room
            </span>
            <a
              href="tel:+919826259292"
              className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-red-500" />
              <span>+91 98262 59292</span>
            </a>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock4 className="w-3 h-3 text-emerald-400" />
              <span>24/7 Rapid Deployment Desk</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Form Area */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 bg-white">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  Proposal Request Logged
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Your requirements for <strong className="text-slate-800">{city}</strong> have been dispatched to our central operations desk. An officer will connect at <strong className="text-slate-800">+91 {phone}</strong> or via email at <strong className="text-slate-800">{email}</strong> shortly.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setCompanyName('');
                  setHeadcountNotes('');
                }}
                className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold uppercase tracking-wider transition cursor-pointer"
              >
                Submit New Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-snug">{errorMessage}</span>
                </div>
              )}

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Number (India 10-Digit) *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-semibold text-slate-500 font-mono select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98260 12345"
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-12 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company / Society Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Apex Industrial Park"
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition"
                    />
                  </div>
                </div>
              </div>

              {/* MP District & Service Wing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Deployment District in MP (All 55 Districts) *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <select
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition cursor-pointer max-h-48"
                    >
                      {cityOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Guarding / Facility Wing *
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <select
                      required
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded py-2 pl-9 pr-3 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition cursor-pointer"
                    >
                      {serviceOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Headcount Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Shift Timing &amp; Estimated Headcount Requirements
                </label>
                <textarea
                  rows={2}
                  value={headcountNotes}
                  onChange={(e) => setHeadcountNotes(e.target.value)}
                  placeholder="e.g. Need 4 security guards for 12-hour shifts at a site..."
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none transition"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-red-700 hover:bg-red-800 active:bg-red-900 text-white rounded text-xs font-bold uppercase tracking-wider transition duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing Submission...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
