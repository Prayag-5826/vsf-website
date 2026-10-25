'use client';

import React from 'react';
import { ShieldCheck, Award, Building, FileCheck } from 'lucide-react';
import { ShiftType } from '@/lib/billingMath';

export type PageNo = 1 | 2 | 3 | 4 | 5;

export interface DocketCompanyInfo {
  companyName: string;
  address: string;
  contactNo: string;
  email: string;
  directorName: string;
  logo: string;
  sealImage?: string;
  psaraLicense: string;
  labourRegNo: string;
  epfCode: string;
  esicRegNo: string;
  gstNumber: string;
  ptLicenseNo: string;
  panNumber: string;
}

export interface FlatSubOptions {
  addServiceCharge?: boolean;
  addEpf?: boolean;
  addEsic?: boolean;
  addUniform?: boolean;
}

export interface QuotationDocketProps {
  pageNo: PageNo;
  mode?: 'screen' | 'print';
  company: DocketCompanyInfo;
  clientName: string;
  clientAddress: string;
  docRef: string;
  docDate: string;
  proposalSubject: string;
  validityDays: number;
  paymentTermsDays: number;
  billingModel: 'COMPLIANCE' | 'FLAT';
  activeChosenServices: any[];
  totalMonthlyBilling: number;
  effectiveMarginPercent: number;
  isApproved: boolean;
  statutoryRates?: {
    overtime: number;
    reliever: number;
    epf: number;
    esic: number;
  };
  flatSubOptions?: FlatSubOptions;
}

const TOTAL_PAGES = 5;

const LOGO_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#fff" stroke="#991b1b" stroke-width="3"/><text x="28" y="33" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#991b1b" text-anchor="middle">VSF</text></svg>'
)}`;

const formatINR = (value: number): string =>
  `₹${(Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatPercent = (value: number): string => `${Number(value)}%`;

const shiftLabel = (shift: ShiftType): string => (shift === '12_HOURS' ? '12 Hrs' : '08 Hrs');

export default function QuotationDocket({
  pageNo,
  mode = 'screen',
  company,
  clientName,
  clientAddress,
  docRef,
  docDate,
  proposalSubject,
  validityDays,
  paymentTermsDays,
  billingModel,
  activeChosenServices,
  totalMonthlyBilling,
  effectiveMarginPercent,
  isApproved,
  statutoryRates = {
    overtime: 35,
    reliever: 16.67,
    epf: 13,
    esic: 3.25
  },
  flatSubOptions = {
    addServiceCharge: true,
    addEpf: false,
    addEsic: false,
    addUniform: false
  }
}: QuotationDocketProps) {
  const docClientName = (clientName || '').trim();
  const docClientAddress = (clientAddress || '').trim();

  // Helper to dynamically describe flat rate inclusions selected by director
  const getFlatInclusionsLabel = (): string => {
    // Check if passed directly via prop or embedded in service item
    const options = flatSubOptions || activeChosenServices?.[0]?.flatSubOptions || {
      addServiceCharge: true,
      addEpf: false,
      addEsic: false,
      addUniform: false
    };

    const parts: string[] = ['Negotiated Base Wage'];
    if (options.addEpf) parts.push('EPF (13%)');
    if (options.addEsic) parts.push('ESIC (3.25%)');
    if (options.addUniform) parts.push('Kit & Uniform Allowance');
    if (options.addServiceCharge) {
      parts.push(`Agency Service Margin (${effectiveMarginPercent || 8}%)`);
    }

    if (parts.length === 1) {
      return 'Direct Negotiated Flat Rate (All-Inclusive)';
    }

    return parts.join(' + ');
  };

  const renderHeader = () => (
    <div className="w-full border-b-2 border-red-800 pb-3 mb-2.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 shrink-0">
        <img
          src={company.logo || '/assets/img/logo/logo.png'}
          alt="VSF Logo"
          className="w-14 h-14 object-contain"
          onError={(e: any) => {
            const img = e.currentTarget;
            if (img.dataset.fallback === '1') return;
            img.dataset.fallback = '1';
            img.src = LOGO_FALLBACK;
          }}
        />
        <div className="text-left leading-tight">
          <span className="text-[10px] font-mono font-black text-red-700 tracking-wider block">
            PROTECTION &bull; SECURITY
          </span>
          <span className="text-[13px] font-black text-slate-900 tracking-wide block">
            संरक्षण एवं सुरक्षा
          </span>
          <span className="text-[9.5px] font-mono text-slate-500 font-bold block mt-0.5">
            24/7 HELPLINE: +91 9826259020
          </span>
        </div>
      </div>

      <div className="text-center flex-1 px-2">
        <h1 className="text-[16px] font-black uppercase tracking-tight text-slate-950 leading-tight">
          {company.companyName}
        </h1>
        <p className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wide mt-0.5">
          HEAD OFFICE: {company.address}
        </p>
        <p className="text-[9px] font-mono font-semibold text-slate-600">
          Phone: {company.contactNo} &bull; Email: {company.email}
        </p>
      </div>

      <div className="text-right shrink-0 space-y-1">
        <span className="inline-block text-[9.5px] font-mono font-black bg-red-50 border border-red-200 text-red-800 px-2.5 py-0.5 rounded uppercase">
          PSARA MP LICENSED
        </span>
        <span className="text-[10px] font-mono text-slate-700 font-bold block">
          Date: {docDate}
        </span>
      </div>
    </div>
  );

  const renderSignature = (title: string, showFirmLine = false) => (
    <div className="text-center space-y-1">
      {showFirmLine && (
        <p className="text-[10px] font-bold text-slate-700 uppercase">For {company.companyName}</p>
      )}
      <div
        className={`w-32 h-16 rounded mx-auto flex items-center justify-center p-1 ${
          company.sealImage && isApproved ? '' : 'border border-dashed border-red-300 bg-red-50/20'
        }`}
      >
        {company.sealImage && isApproved ? (
          <img src={company.sealImage} alt="Official Seal" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-[8.5px] font-mono font-bold text-red-700 text-center leading-tight">
            {isApproved ? '[ OFFICIAL STAMP ]' : '[ PENDING AUTHORIZATION ]'}
          </span>
        )}
      </div>
      <p className="text-[13px] font-black uppercase text-slate-950 tracking-wide">{company.directorName}</p>
      <p className="text-[10.5px] font-mono font-bold text-slate-600 uppercase">{title}</p>
    </div>
  );

  const renderFooter = (pNo: PageNo, left: React.ReactNode, signatureTitle: string, showFirmLine = false) => (
    <div className="pt-2.5 border-t border-slate-200 flex justify-between items-end gap-4 mt-auto">
      <div className="text-[10px] font-mono text-slate-600 space-y-0.5">
        {left}
        <p className="text-[9px] text-slate-400 pt-0.5">
          Page {pNo} of {TOTAL_PAGES} &bull; Proposal Docket Ref: {docRef}
        </p>
      </div>
      {renderSignature(signatureTitle, showFirmLine)}
    </div>
  );

  const renderClientBlock = (label: string, rightLabel: string, rightValue: string) => (
    <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 flex justify-between items-start gap-4">
      <div className="min-w-0">
        <p className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-[15px] font-black text-slate-950 uppercase mt-0.5 leading-snug">{docClientName || 'VALUED CLIENT'}</p>
        <p className="text-[11.5px] text-slate-700 mt-0.5 font-medium leading-tight">Premises: {docClientAddress || 'Indore, Madhya Pradesh'}</p>
      </div>
      <div className="text-right font-mono text-[10.5px] shrink-0">
        <p className="text-slate-500 uppercase font-bold">{rightLabel}</p>
        <p className="text-[12px] font-black text-slate-950 mt-0.5">{rightValue}</p>
      </div>
    </div>
  );

  const registrations: [string, string][] = [
    ['Private Security Agency License No (PSARA M.P.)', company.psaraLicense],
    ['Labour Commissioner Registration No', company.labourRegNo],
    ['Employee Provident Fund (EPF Establishment Code)', company.epfCode],
    ['Employees State Insurance Corporation (ESIC Code)', company.esicRegNo],
    ['GST Registration Number (GSTIN)', company.gstNumber],
    ['Professional Tax (P.T.) License Number', company.ptLicenseNo],
    ['Income Tax Permanent Account Number (PAN)', company.panNumber],
    ['Executive Managing Director', company.directorName.toUpperCase()]
  ];

  const containerClass = `vsf-sheet font-sans ${mode === 'screen' ? 'rounded-2xl border border-slate-200 shadow-xl' : ''}`;

  return (
    <div className={containerClass}>
      {/* =========================================================================
          PAGE 1: FORMAL TRANSMITTAL & STATUTORY INTRODUCTION
         ========================================================================= */}
      {pageNo === 1 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}
            {renderClientBlock('Quotation Submitted To:', 'Proposal Date:', docDate)}

            <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-slate-900 text-[12px] font-bold">
              <span className="text-red-800 uppercase font-black mr-1">Subject:</span>
              {proposalSubject}
            </div>

            <div className="space-y-3.5 text-[12.5px] leading-relaxed text-slate-800 pt-0.5">
              <p className="text-justify font-medium">
                <strong>Respected Sir / Madam,</strong><br />
                With reference to your commercial inquiry and our physical inspection visit regarding the provision of specialized security guarding, premises surveillance, and facility housekeeping manpower, <strong>{company.companyName}</strong> is pleased to submit our comprehensive formal proposal and certified schedule of rates for your administrative review.
              </p>

              <div className="space-y-1.5">
                <h3 className="text-[13px] font-black uppercase text-red-800 border-b border-red-100 pb-0.5 tracking-wider">
                  1. Statutory Accreditations &amp; Regulatory Standing
                </h3>
                <ul className="text-[12px] text-slate-700 space-y-1 list-disc pl-5 leading-normal">
                  <li>Formally licensed across Madhya Pradesh under the <strong>Private Security Agencies (Regulation) Act, 2005 (PSARA MP)</strong>.</li>
                  <li>100% compliant statutory infrastructure with dedicated monthly remittances under <strong>EPF, ESIC, Labour Welfare Fund (LWF) &amp; Professional Tax</strong>.</li>
                  <li>All deployed security personnel undergo mandatory police character verification, biometric background documentation, and rigorous pre-induction physical fitness drills.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-[13px] font-black uppercase text-red-800 border-b border-red-100 pb-0.5 tracking-wider">
                  2. Operational Command &amp; Supervisory Oversight
                </h3>
                <ul className="text-[12px] text-slate-700 space-y-1 list-disc pl-5 leading-normal">
                  <li><strong>Dedicated 24/7 Flying Patrol Squad:</strong> Regular unannounced day and night surprise inspections conducted by Senior Field Officers across Indore, Ujjain, Pithampur, and MP.</li>
                  <li><strong>Central Escalation Desk:</strong> 24-hour rapid communication bridge with local police stations, fire emergency services, and medical first-responders.</li>
                  <li><strong>Turnout Standards:</strong> Crisp ceremonial company uniforms equipped with badges, whistles, lanyards, high-visibility night batons, and formal duty log registers.</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-[13px] font-black uppercase text-red-800 border-b border-red-100 pb-0.5 tracking-wider">
                  3. Executive Guarantee
                </h3>
                <p className="text-[12px] text-slate-700 text-justify">
                  We guarantee that upon acceptance, seamless deployment will be mobilized within 24 to 48 hours without operational delay, backed by experienced relievers to ensure 100% post occupancy at all times.
                </p>
              </div>

              <p className="text-[12px] text-slate-800 pt-1 text-justify font-semibold">
                We assure you of the highest standards of vigilance, discipline, and integrity at your esteemed premises.
              </p>
            </div>
          </div>

          {renderFooter(
            1,
            <>
              <p className="font-bold text-slate-900 text-[10.5px]">Protection &bull; Security &bull; Facility Management</p>
              <p className="font-black text-red-700 text-[11px]">संरक्षण एवं सुरक्षा &bull; PSARA MP LICENSED</p>
            </>,
            'Managing Director'
          )}
        </>
      )}

      {/* =========================================================================
          PAGE 2: RATE SHEET & WAGE BREAKDOWN
         ========================================================================= */}
      {pageNo === 2 && (
        <>
          <div className="space-y-3">
            {renderHeader()}
            {renderClientBlock('Quotation Prepared For:', 'Docket Ref:', docRef)}

            {billingModel === 'COMPLIANCE' ? (
              <div className="w-full overflow-hidden">
                <table className="w-full text-left border-collapse border border-slate-900 text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-950 font-black uppercase border-b border-slate-900 text-[10.5px]">
                      <th className="py-2 px-2 border-r border-slate-900 text-center w-7">SR</th>
                      <th className="py-2 px-2.5 border-r border-slate-900">DESCRIPTION OF WAGE STRUCTURE (M.P. PSARA)</th>
                      <th className="py-2 px-2 border-r border-slate-900 text-center w-24">BENCHMARK</th>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <th key={idx} className="py-2 px-2.5 border-r border-slate-900 text-right">
                          {s.label.toUpperCase()} ({shiftLabel(s.shift)})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-mono text-slate-800 text-[11px]">
                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-bold">1</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans font-bold text-slate-950">Basic Minimum Wages (26 Days Basis)</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-bold text-[10px]">BASIC</td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right font-black text-slate-950">
                          {formatINR(Number(s.statutory?.basic ?? s.statutory?.gross ?? 15000))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center">2</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans">Overtime Allowance (Additional 4 Hours)</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center text-[10px]">{formatPercent(statutoryRates.overtime)}</td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right">
                          {formatINR(Number(s.statutory?.overtime ?? s.statutory?.additional12Hrs ?? 0))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center">3</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans">Reliever Charges (Weekly Day-Off Allowance)</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center text-[10px]">
                        {activeChosenServices[0]?.statutory?.reliever ? '16.67%' : 'NIL'}
                      </td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right">
                          {formatINR(Number(s.statutory?.reliever ?? 0))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300 bg-slate-50">
                      <td className="py-1.5 px-2 border-r border-slate-900 text-center font-bold">4</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-900 font-sans font-bold text-slate-950">Gross Guard Earnings (Subtotal A)</td>
                      <td className="py-1.5 px-2 border-r border-slate-900 text-center font-bold">—</td>
                      {activeChosenServices.map((s: any, idx: number) => {
                        const baseGross = Number(s.statutory?.basic ?? 15000) + Number(s.statutory?.overtime ?? 0) + Number(s.statutory?.reliever ?? 0);
                        return (
                          <td key={idx} className="py-1.5 px-2.5 border-r border-slate-900 text-right font-black text-slate-950">
                            {formatINR(baseGross)}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center">5</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans">Provident Fund (EPF Employer Contribution)</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center text-[10px]">{formatPercent(statutoryRates.epf)}</td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right">
                          {formatINR(Number(s.statutory?.epf ?? 0))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center">6</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans">ESIC Medical &amp; Accidental Insurance</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center text-[10px]">{formatPercent(statutoryRates.esic)}</td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right">
                          {formatINR(Number(s.statutory?.esic ?? 0))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center">7</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans">Uniform Kit, LWF &amp; Festival Leaves</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center text-[10px]">STAT</td>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right">
                          {formatINR(Number(s.statutory?.uniform ?? 836))}
                        </td>
                      ))}
                    </tr>

                    <tr className="border-b border-slate-300">
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-bold">8</td>
                      <td className="py-1 px-2.5 border-r border-slate-900 font-sans font-bold text-slate-950">Agency Administrative &amp; Service Margin</td>
                      <td className="py-1 px-2 border-r border-slate-900 text-center font-bold text-[10px]">{formatPercent(effectiveMarginPercent)}</td>
                      {activeChosenServices.map((s: any, idx: number) => {
                        const basic = Number(s.statutory?.basic ?? 15000);
                        const overtime = Number(s.statutory?.overtime ?? 0);
                        const reliever = Number(s.statutory?.reliever ?? 0);
                        const epf = Number(s.statutory?.epf ?? 0);
                        const esic = Number(s.statutory?.esic ?? 0);
                        const uniform = Number(s.statutory?.uniform ?? 836);
                        const subtotal = basic + overtime + reliever + epf + esic + uniform;
                        const margin = Math.round((subtotal * (effectiveMarginPercent || 8)) / 100);
                        return (
                          <td key={idx} className="py-1 px-2.5 border-r border-slate-900 text-right font-bold text-slate-900">
                            {formatINR(margin)}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="bg-[#8b1515] text-white font-black text-xs">
                      <td className="p-2 border border-slate-900 text-center font-mono">9</td>
                      <td className="p-2 border border-slate-900 uppercase font-black tracking-tight">
                        COST TO COMPANY (PER HEAD / MONTH)
                      </td>
                      <td className="p-2 border border-slate-900 text-center font-mono uppercase text-[10.5px]">
                        TOTAL
                      </td>
                      {activeChosenServices.map((srv: any, idx: number) => {
                        const basic = Number(srv.statutory?.basic ?? 15000);
                        const overtime = Number(srv.statutory?.overtime ?? 0);
                        const reliever = Number(srv.statutory?.reliever ?? 0);
                        const epf = Number(srv.statutory?.epf ?? 0);
                        const esic = Number(srv.statutory?.esic ?? 0);
                        const uniform = Number(srv.statutory?.uniform ?? 836);
                        const subtotal = basic + overtime + reliever + epf + esic + uniform;
                        const margin = Math.round((subtotal * (effectiveMarginPercent || 8)) / 100);
                        const accurateTotal = subtotal + margin;

                        return (
                          <td key={idx} className="p-2 border border-slate-900 text-right font-mono font-black text-amber-200 text-sm">
                            {formatINR(accurateTotal)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full">
                <table className="w-full text-left border-collapse border border-slate-900 text-[12px]">
                  <thead>
                    <tr className="bg-red-800 text-white font-black uppercase text-[10.5px]">
                      <th className="py-2.5 px-3 border-r border-red-900">Requested Service Role</th>
                      <th className="py-2.5 px-3 border-r border-red-900 text-center">Shift Schedule</th>
                      <th className="py-2.5 px-3 border-r border-red-900 text-center">Assigned Posts</th>
                      <th className="py-2.5 px-3 border-r border-red-900 text-right">Consolidated Rate / Head</th>
                      <th className="py-2.5 px-3 text-right">Monthly Consideration</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold text-slate-800 text-[12px]">
                    {activeChosenServices.map((service: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-300">
                        <td className="py-2.5 px-3 border-r border-slate-900 font-black text-slate-900">{service.label}</td>
                        <td className="py-2.5 px-3 border-r border-slate-900 text-center font-mono text-[11px]">
                          {service.shift === '12_HOURS' ? '12 Hours (Continuous)' : '08 Hours (Continuous)'}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-900 text-center font-mono">
                          {service.count} {service.count === 1 ? 'Post' : 'Posts'}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-900 text-right font-mono text-red-700 font-black">
                          {formatINR(service.perHeadRate)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-950 font-black">
                          {formatINR(service.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Dynamic Breakdown Note reflecting the exact user configuration */}
                <div className="mt-1 px-1 text-[9.5px] font-mono text-slate-600">
                  <span className="font-bold text-red-800">* Commercial Rate Breakdown:</span> Consolidated rate per head is formulated as [{getFlatInclusionsLabel()}].
                </div>
              </div>
            )}

            <div className="p-3 bg-red-50/90 border-2 border-red-200 rounded-xl flex justify-between items-center gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-black text-red-950 uppercase tracking-wider">
                  TOTAL DEPLOYMENT: {activeChosenServices.map((s: any) => `${s.count} ${s.label}`).join(', ')}
                </p>
                <p className="text-[9px] font-black text-red-700 uppercase tracking-wider mt-0.5">
                  * AS PER STATUTORY LAWS, GST (18%) WILL BE CHARGED EXTRA ON TOTAL MONTHLY BILLING.
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9.5px] font-mono font-bold uppercase text-slate-500">Total Monthly Billing</p>
                <p className="text-[18px] font-mono font-black text-slate-950 whitespace-nowrap">
                  {formatINR(
                    billingModel === 'COMPLIANCE'
                      ? activeChosenServices.reduce((sum: number, srv: any) => {
                          const basic = Number(srv.statutory?.basic ?? 15000);
                          const overtime = Number(srv.statutory?.overtime ?? 0);
                          const reliever = Number(srv.statutory?.reliever ?? 0);
                          const epf = Number(srv.statutory?.epf ?? 0);
                          const esic = Number(srv.statutory?.esic ?? 0);
                          const uniform = Number(srv.statutory?.uniform ?? 250);
                          const subtotal = basic + overtime + reliever + epf + esic + uniform;
                          const margin = Math.round((subtotal * (effectiveMarginPercent || 8)) / 100);
                          return sum + (subtotal + margin) * (srv.count || 1);
                        }, 0)
                      : totalMonthlyBilling
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-1 text-[10px] text-slate-700 leading-normal pt-0.5">
              <h4 className="text-[10.5px] font-black uppercase text-slate-950 border-b border-slate-200 pb-0.5 mb-1">
                Primary Terms of Engagement:
              </h4>
              <ol className="list-decimal pl-4 space-y-0.5 font-medium">
                <li>Rates apply on a continuous 30/31 days monthly cycle per post deployed.</li>
                <li>Offer valid for <strong>{validityDays} calendar days</strong> from the date of issue.</li>
                <li>Monthly certified invoices are strictly payable within <strong>{paymentTermsDays} business days</strong>.</li>
                <li><strong>GST @ 18% extra</strong> as applicable under prevailing tax statutes (Direct / RCM).</li>
                <li>Direct recruitment or hiring of deployed staff is prohibited without official clearance and payment of placement compensation.</li>
                <li><strong>Gender Rate Parity:</strong> Male Security Guard and Female (Lady) Security Guard deployments carry identical rates with zero commercial variation.</li>
              </ol>
            </div>
          </div>

          {renderFooter(
            2,
            <>
              <p className="font-bold text-slate-900 text-[10.5px]">PSA LICENSE: {company.psaraLicense}</p>
              <p className="text-[9.5px]">GSTIN: {company.gstNumber}</p>
            </>,
            'Managing Director'
          )}
        </>
      )}

      {/* =========================================================================
          PAGE 3: COMPREHENSIVE TERMS, CONDITIONS & LEGAL COVENANTS
         ========================================================================= */}
      {pageNo === 3 && (
        <>
          <div className="space-y-3">
            {renderHeader()}

            <div className="space-y-2.5 text-[11.5px] leading-relaxed text-slate-800">
              <h3 className="text-[13.5px] font-black uppercase text-red-800 border-b border-red-200 pb-0.5 tracking-wider">
                Comprehensive Operational Terms &amp; Commercial Covenants
              </h3>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">1. Invoicing &amp; Payment Settlement Terms</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  The Agency shall submit monthly attendance muster rolls and tax invoices by the 1st day of every month for the preceding service period. The Client agrees to verify and clear the full payment through Account Payee Cheque / NEFT / RTGS in favour of <strong>&quot;{company.companyName}&quot;</strong> strictly within <strong>{paymentTermsDays} calendar days</strong> of invoice submission.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">2. Goods &amp; Services Tax (GST) &amp; Statutory Pass-Through</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  (a) If the Client is a corporate or registered entity, GST liability shall be governed in accordance with Notification No. 29/2018-CT(R) under Section 9(3) of the CGST Act (Reverse Charge Mechanism - RCM).<br />
                  (b) If the Client is an unregistered entity, society, or individual, GST @ 18% shall be charged on the Agency invoice and discharged directly by the Agency.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">3. Labour Law Revisions &amp; Wage Indexation</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  The rates submitted are pegged to current Madhya Pradesh Minimum Wage notifications. Any future statutory escalation in basic wages, dearness allowance (VDA), EPF, or ESIC limits notified by the Government of Madhya Pradesh or Central Labour Commissioner shall be passed on with arrears from the effective notification date.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">4. Post Manning, Discipline &amp; Immediate Replacements</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  The Agency shall ensure 100% attendance coverage across all contracted posts. In the event of illness, leave, or absenteeism, relief personnel shall be deployed immediately. If any staff member is found unsuitable or negligent, the Agency shall provide a replacement within 24 hours of written or verbal notice from the Client.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">5. Non-Solicitation &amp; Anti-Poaching Covenant</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  The Client covenants not to directly or indirectly solicit, recruit, hire, or contract any security guard, supervisor, or housekeeping personnel deployed by the Agency during the contract term and for a period of twelve (12) months following termination. Violation of this covenant shall attract an administrative placement penalty equal to three months of gross billing per personnel.
                </p>
              </div>

              <div className="p-2.5 bg-slate-50/70 rounded-xl border border-slate-200 space-y-0.5">
                <h4 className="font-black text-slate-950 uppercase text-[11.5px]">6. Tenure, Notice Period &amp; Termination</h4>
                <p className="text-slate-700 text-justify leading-normal">
                  The contract shall remain valid for an initial term of one (1) year. Either party may terminate this agreement by serving thirty (30) days prior written notice, or payment of one month billing in lieu thereof, subject to clearance of all outstanding dues.
                </p>
              </div>
            </div>
          </div>

          {renderFooter(
            3,
            <>
              <p className="font-bold text-slate-900 text-[10.5px]">PSARA MP Commercial Framework &bull; Statutory Covenants</p>
              <p className="text-slate-500 text-[9.5px]">Governed Under High Court Jurisdiction, Indore (M.P.)</p>
            </>,
            'Authorised Signatory'
          )}
        </>
      )}

      {/* =========================================================================
          PAGE 4: COMPREHENSIVE OPERATIONAL SCOPE & SERVICE SPECIFICATIONS
         ========================================================================= */}
      {pageNo === 4 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}

            <div className="space-y-3 text-[12px] leading-relaxed text-slate-800">
              <h3 className="text-[13.5px] font-black uppercase text-red-800 border-b border-red-200 pb-0.5 tracking-wider">
                Operational Scope of Services &amp; Guarding Protocols
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[12px] uppercase">
                    <ShieldCheck size={16} className="text-red-700" />
                    <span>A. Static Physical Guarding</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
                    <li>Entry and exit gate access control with visitor recording.</li>
                    <li>Vehicle movement logging with chassis and material inward/outward passes.</li>
                    <li>Key registry maintenance and after-hours locking audits.</li>
                    <li>Perimeter fence checking and prevention of unauthorized trespassing.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[12px] uppercase">
                    <Award size={16} className="text-red-700" />
                    <span>B. Armed Escort &amp; Gunmen Duty</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
                    <li>Ex-servicemen and licensed armed guards with certified 12 Bore / .32 weapons.</li>
                    <li>Cash-in-transit, bullion, and executive VIP escort protection.</li>
                    <li>Valid district weapon permits verified under police jurisdiction.</li>
                    <li>Strict firearms safety protocols and physical vigilance drills.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[12px] uppercase">
                    <Building size={16} className="text-red-700" />
                    <span>C. Mechanized Housekeeping &amp; Sanitation</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
                    <li>Floor scrubbing, washroom sanitation, and garbage disposal routines.</li>
                    <li>Eco-friendly chemicals (Taski/Diversey equivalent) with trained janitors.</li>
                    <li>Dusting of cabins, workstations, glass facades, and common corridors.</li>
                    <li>Daily inspection checklists signed by on-site facility supervisors.</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50/80 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-[12px] uppercase">
                    <FileCheck size={16} className="text-red-700" />
                    <span>D. Emergency Response &amp; Fire Safety</span>
                  </div>
                  <ul className="text-[11px] text-slate-700 list-disc pl-4 space-y-0.5">
                    <li>First-response fire extinguisher operation during sudden outbreak.</li>
                    <li>Disaster evacuation coordination and crowd containment.</li>
                    <li>Immediate incident escalation to central emergency control desk.</li>
                    <li>Quarterly security mock drills in coordination with client management.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-red-50/60 border-2 border-red-200 rounded-2xl text-center space-y-1 mt-2">
                <h4 className="text-[11px] font-black uppercase text-red-800 tracking-widest">
                  QUALITY POLICY &amp; DIRECTORIAL COMMITMENT
                </h4>
                <p className="font-black text-slate-950 tracking-wide text-[13px] leading-snug uppercase">
                  &quot;TO DELIVER AN IMPREGNABLE FIRST LINE OF DEFENCE THROUGH HONESTY, PHYSICAL DISCIPLINE, VIGILANT SUPERVISION, AND 100% STATUTORY INTEGRITY.&quot;
                </p>
                <p className="text-[11px] font-mono font-bold text-slate-600 uppercase pt-1">
                  &mdash; ANIL DHARIWAL, MANAGING DIRECTOR
                </p>
              </div>
            </div>
          </div>

          {renderFooter(
            4,
            <>
              <p className="font-bold text-slate-900 text-[10.5px]">Service Commitment &bull; Quality Management</p>
              <p className="text-slate-500 text-[9.5px]">Vigilance &amp; Central Escalation Protocol</p>
            </>,
            'Authorised Signatory',
            true
          )}
        </>
      )}

      {/* =========================================================================
          PAGE 5: STATUTORY LICENSES TABLE & FORMAL CLIENT ACCEPTANCE
         ========================================================================= */}
      {pageNo === 5 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}

            <div className="space-y-3">
              <div className="border-b border-red-200 pb-1 flex items-center gap-2">
                <ShieldCheck size={20} className="text-red-800" />
                <h3 className="text-[13.5px] font-black uppercase text-red-800 tracking-wider">
                  Statutory Registrations &amp; Corporate Credentials
                </h3>
              </div>

              <div className="border border-slate-900 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left border-collapse text-[11.5px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-950 font-black uppercase text-[10.5px] border-b border-slate-900">
                      <th className="py-2 px-3 border-r border-slate-900 w-10 text-center">SR</th>
                      <th className="py-2 px-3 border-r border-slate-900">REGULATORY ACCREDITATION / STATUTORY LICENSE</th>
                      <th className="py-2 px-3 text-right font-mono">REGISTRATION / LICENSE NUMBER</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300 text-[11.5px]">
                    {registrations.map(([label, value], idx) => (
                      <tr key={label} className={idx % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'}>
                        <td className="py-1.5 px-3 border-r border-slate-900 text-center font-bold">{idx + 1}</td>
                        <td className="py-1.5 px-3 border-r border-slate-900 font-bold text-slate-800">{label}</td>
                        <td className="py-1.5 px-3 text-right font-mono font-black text-slate-950">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 p-3.5 border-2 border-dashed border-slate-400 rounded-xl bg-slate-50/70 space-y-2">
                <div className="flex justify-between items-center border-b border-slate-300 pb-1">
                  <span className="text-[11.5px] font-black uppercase text-slate-900 tracking-wider">
                    Client Formal Acceptance &amp; Deployment Work Order
                  </span>
                  <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase">Docket: {docRef}</span>
                </div>
                <p className="text-[10.5px] text-slate-700 leading-normal text-justify">
                  We, the undersigned authorized authority for <strong>{docClientName || 'THE CLIENT'}</strong>, hereby accept the rates, terms, and conditions set forth in this 5-page commercial docket and authorize <strong>{company.companyName}</strong> to proceed with deployment at our establishment.
                </p>

                <div className="grid grid-cols-2 gap-8 pt-6 pb-1">
                  <div className="text-center">
                    <div className="border-t-2 border-slate-800 pt-1">
                      <span className="text-[10.5px] font-black uppercase text-slate-900 block">Authorized Signatory &amp; Stamp</span>
                      <span className="text-[9.5px] font-mono text-slate-500 block uppercase">For {docClientName || 'Client Establishment'}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Date: ________________________</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="border-t-2 border-slate-800 pt-1">
                      <span className="text-[10.5px] font-black uppercase text-slate-900 block">For {company.companyName}</span>
                      <span className="text-[9.5px] font-mono text-slate-500 block uppercase">Anil Dhariwal &bull; Managing Director</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">Date: {docDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderFooter(
            5,
            <>
              <p className="font-bold text-slate-900 text-[10.5px]">Certified Statutory Registrations</p>
              <p className="text-red-700 font-bold uppercase text-[10px]">Government of Madhya Pradesh Compliant</p>
            </>,
            'Managing Director'
          )}
        </>
      )}
    </div>
  );
}
