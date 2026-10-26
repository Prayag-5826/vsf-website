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
const HELPLINE = '+91 9826259020';

// Defaults live in ONE place so every table, total and note on the docket agrees
const DEFAULT_BASIC = 15000;
const DEFAULT_UNIFORM = 836;
const DEFAULT_MARGIN_PERCENT = 8;

const LOGO_FALLBACK = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="#fff" stroke="#991b1b" stroke-width="3"/><text x="28" y="33" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#991b1b" text-anchor="middle">VSF</text></svg>'
)}`;

const formatINR = (value: number): string =>
  `₹${(Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatPercent = (value: number): string => `${Number(value)}%`;

const shiftLabel = (shift: ShiftType): string => (shift === '12_HOURS' ? '12 hrs' : '8 hrs');

const num = (value: unknown, fallback = 0): number => {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

interface LineCalc {
  basic: number;
  overtime: number;
  reliever: number;
  gross: number;
  epf: number;
  esic: number;
  uniform: number;
  subtotal: number;
  margin: number;
  total: number;
}

/** The single source of truth for one service line's wage structure. */
function calcLine(srv: any, marginPercent: number): LineCalc {
  const st = srv?.statutory ?? {};
  const basic = num(st.basic ?? st.gross, DEFAULT_BASIC);
  const overtime = num(st.overtime ?? st.additional12Hrs);
  const reliever = num(st.reliever);
  const epf = num(st.epf);
  const esic = num(st.esic);
  const uniform = num(st.uniform, DEFAULT_UNIFORM);
  const gross = basic + overtime + reliever;
  const subtotal = gross + epf + esic + uniform;
  const margin = Math.round((subtotal * marginPercent) / 100);
  return { basic, overtime, reliever, gross, epf, esic, uniform, subtotal, margin, total: subtotal + margin };
}

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
  statutoryRates = { overtime: 35, reliever: 16.67, epf: 13, esic: 3.25 },
  flatSubOptions,
}: QuotationDocketProps) {
  const docClientName = (clientName || '').trim();
  const docClientAddress = (clientAddress || '').trim();

  // A margin of 0% is a valid choice; only a missing value falls back to the default
  const marginPercent =
    typeof effectiveMarginPercent === 'number' && Number.isFinite(effectiveMarginPercent)
      ? effectiveMarginPercent
      : DEFAULT_MARGIN_PERCENT;

  const lines = activeChosenServices.map((s) => calcLine(s, marginPercent));

  const complianceTotal = activeChosenServices.reduce(
    (sum: number, srv: any, i: number) => sum + lines[i].total * (num(srv.count, 1) || 1),
    0
  );
  const grandTotal = billingModel === 'COMPLIANCE' ? complianceTotal : num(totalMonthlyBilling);

  const getFlatInclusionsLabel = (): string | null => {
    if (billingModel !== 'FLAT') return null;
    const options = flatSubOptions || activeChosenServices?.[0]?.flatSubOptions;
    if (!options) return null;

    const parts: string[] = [];
    if (options.addEpf) parts.push(`EPF (${formatPercent(statutoryRates.epf)})`);
    if (options.addEsic) parts.push(`ESIC (${formatPercent(statutoryRates.esic)})`);
    if (options.addUniform) parts.push('Kit & Uniform Allowance');
    if (options.addServiceCharge) parts.push(`Agency Service Margin (${formatPercent(marginPercent)})`);

    return parts.length ? `Negotiated Base Wage + ${parts.join(' + ')}` : null;
  };

  /* ───────── shared building blocks ───────── */

  const renderHeader = () => (
    <div className="mb-3 flex w-full items-center justify-between gap-4 border-b-2 border-red-800 pb-3">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={company.logo || '/assets/img/logo/logo.png'}
          alt="Company logo"
          className="h-14 w-14 shrink-0 object-contain"
          onError={(e: any) => {
            const img = e.currentTarget;
            if (img.dataset.fallback === '1') return;
            img.dataset.fallback = '1';
            img.src = LOGO_FALLBACK;
          }}
        />
        <div className="min-w-0 leading-snug">
          <h1 className="text-[16px] font-bold text-slate-900">{company.companyName}</h1>
          <p className="text-[10px] text-slate-600">{company.address}</p>
          <p className="text-[10px] text-slate-600">
            {company.contactNo} &nbsp;|&nbsp; {company.email}
          </p>
        </div>
      </div>

      <div className="shrink-0 text-right text-[10px] leading-snug text-slate-600">
        <p className="text-[11px] font-semibold text-red-800">PSARA Madhya Pradesh licensed</p>
        <p>24/7 helpline: {HELPLINE}</p>
        <p className="font-medium text-slate-800">Date: {docDate}</p>
      </div>
    </div>
  );

  const renderSignature = (title: string, showFirmLine = false) => (
    <div className="space-y-1 text-center">
      {showFirmLine && <p className="text-[10px] text-slate-600">For {company.companyName}</p>}
      <div
        className={`mx-auto flex h-16 w-32 items-center justify-center rounded p-1 ${
          company.sealImage && isApproved ? '' : 'border border-dashed border-slate-300'
        }`}
      >
        {company.sealImage && isApproved ? (
          <img src={company.sealImage} alt="Official seal" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="text-center text-[9px] leading-tight text-slate-400">
            {isApproved ? 'Official stamp' : 'Pending authorisation'}
          </span>
        )}
      </div>
      <p className="text-[12px] font-semibold text-slate-900">{company.directorName}</p>
      <p className="text-[10px] text-slate-600">{title}</p>
    </div>
  );

  const renderFooter = (pNo: PageNo, left: React.ReactNode, signatureTitle: string, showFirmLine = false) => (
    <div className="mt-auto flex items-end justify-between gap-4 border-t border-slate-300 pt-3">
      <div className="space-y-0.5 text-[10px] text-slate-600">
        {left}
        <p className="pt-0.5 text-[9.5px] text-slate-400">
          Page {pNo} of {TOTAL_PAGES} &nbsp;|&nbsp; Ref: {docRef}
        </p>
      </div>
      {renderSignature(signatureTitle, showFirmLine)}
    </div>
  );

  const renderClientBlock = (label: string, rightLabel: string, rightValue: string) => (
    <div className="flex items-start justify-between gap-4 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="mt-0.5 text-[15px] font-bold leading-snug text-slate-900">
          {docClientName || 'Valued client'}
        </p>
        <p className="mt-0.5 text-[11.5px] leading-tight text-slate-700">
          Premises: {docClientAddress || 'Indore, Madhya Pradesh'}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-[10px] text-slate-500">{rightLabel}</p>
        <p className="mt-0.5 text-[12px] font-semibold text-slate-900">{rightValue}</p>
      </div>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className="border-b border-red-200 pb-1 text-[13px] font-semibold text-red-800">{children}</h3>
  );

  const registrations: [string, string][] = [
    ['Private Security Agency licence no. (PSARA M.P.)', company.psaraLicense],
    ['Labour Commissioner registration no.', company.labourRegNo],
    ['Employees’ Provident Fund (EPF establishment code)', company.epfCode],
    ['Employees’ State Insurance (ESIC code)', company.esicRegNo],
    ['GST registration number (GSTIN)', company.gstNumber],
    ['Professional Tax (P.T.) licence number', company.ptLicenseNo],
    ['Income Tax Permanent Account Number (PAN)', company.panNumber],
    ['Managing Director', company.directorName],
  ];

  const containerClass = `vsf-sheet font-sans ${mode === 'screen' ? 'rounded-lg border border-slate-200 shadow-lg' : ''}`;

  const th = 'border-b border-slate-300 px-2.5 py-2 font-semibold';
  const td = 'border-b border-slate-200 px-2.5 py-1.5';

  /* ───────── page 2 table rows (compliance) ───────── */
  const hasReliever = lines.some((l) => l.reliever > 0);
  const complianceRows: {
    sr: number;
    label: string;
    benchmark: string;
    value: (l: LineCalc) => number;
    emphasis?: boolean;
  }[] = [
    { sr: 1, label: 'Basic minimum wages (26-day basis)', benchmark: 'Basic', value: (l) => l.basic, emphasis: true },
    { sr: 2, label: 'Overtime allowance (additional 4 hours)', benchmark: formatPercent(statutoryRates.overtime), value: (l) => l.overtime },
    { sr: 3, label: 'Reliever charges (weekly day-off allowance)', benchmark: hasReliever ? formatPercent(statutoryRates.reliever) : 'Nil', value: (l) => l.reliever },
    { sr: 4, label: 'Gross guard earnings (subtotal A)', benchmark: '–', value: (l) => l.gross, emphasis: true },
    { sr: 5, label: 'Provident Fund (EPF employer contribution)', benchmark: formatPercent(statutoryRates.epf), value: (l) => l.epf },
    { sr: 6, label: 'ESIC medical & accidental insurance', benchmark: formatPercent(statutoryRates.esic), value: (l) => l.esic },
    { sr: 7, label: 'Uniform kit, LWF & festival leaves', benchmark: 'Statutory', value: (l) => l.uniform },
    { sr: 8, label: 'Agency administrative & service margin', benchmark: formatPercent(marginPercent), value: (l) => l.margin, emphasis: true },
  ];

  /* ───────── page 3 / 4 content ───────── */
  const covenants: [string, React.ReactNode][] = [
    [
      'Invoicing & payment settlement',
      <>
        The Agency shall submit monthly attendance muster rolls and tax invoices by the 1st day of every month for
        the preceding service period. The Client agrees to verify and clear the full payment through Account Payee
        Cheque / NEFT / RTGS in favour of <strong>&quot;{company.companyName}&quot;</strong> within{' '}
        <strong>{paymentTermsDays} calendar days</strong> of invoice submission.
      </>,
    ],
    [
      'Goods & Services Tax (GST) and statutory pass-through',
      <>
        (a) If the Client is a corporate or registered entity, GST liability shall be governed in accordance with
        Notification No. 29/2018-CT(R) under Section 9(3) of the CGST Act (Reverse Charge Mechanism).
        <br />
        (b) If the Client is an unregistered entity, society, or individual, GST @ 18% shall be charged on the
        Agency invoice and discharged directly by the Agency.
      </>,
    ],
    [
      'Labour law revisions & wage indexation',
      <>
        The rates submitted are pegged to current Madhya Pradesh minimum wage notifications. Any future statutory
        escalation in basic wages, dearness allowance (VDA), EPF, or ESIC limits notified by the Government of
        Madhya Pradesh or the Central Labour Commissioner shall be passed on with arrears from the effective
        notification date.
      </>,
    ],
    [
      'Post manning, discipline & immediate replacements',
      <>
        The Agency shall ensure 100% attendance coverage across all contracted posts. In the event of illness,
        leave, or absenteeism, relief personnel shall be deployed immediately. If any staff member is found
        unsuitable or negligent, the Agency shall provide a replacement within 24 hours of written or verbal
        notice from the Client.
      </>,
    ],
    [
      'Non-solicitation & anti-poaching',
      <>
        The Client covenants not to directly or indirectly solicit, recruit, hire, or contract any security guard,
        supervisor, or housekeeping personnel deployed by the Agency during the contract term and for a period of
        twelve (12) months following termination. Violation of this covenant shall attract an administrative
        placement penalty equal to three months of gross billing per personnel.
      </>,
    ],
    [
      'Tenure, notice period & termination',
      <>
        The contract shall remain valid for an initial term of one (1) year. Either party may terminate this
        agreement by serving thirty (30) days prior written notice, or payment of one month billing in lieu
        thereof, subject to clearance of all outstanding dues.
      </>,
    ],
  ];

  const scopes: { icon: React.ElementType; title: string; points: string[] }[] = [
    {
      icon: ShieldCheck,
      title: 'A. Static physical guarding',
      points: [
        'Entry and exit gate access control with visitor recording.',
        'Vehicle movement logging with chassis and material inward/outward passes.',
        'Key registry maintenance and after-hours locking audits.',
        'Perimeter fence checking and prevention of unauthorized trespassing.',
      ],
    },
    {
      icon: Award,
      title: 'B. Armed escort & gunmen duty',
      points: [
        'Ex-servicemen and licensed armed guards with certified 12 Bore / .32 weapons.',
        'Cash-in-transit, bullion, and executive VIP escort protection.',
        'Valid district weapon permits verified under police jurisdiction.',
        'Strict firearms safety protocols and physical vigilance drills.',
      ],
    },
    {
      icon: Building,
      title: 'C. Mechanized housekeeping & sanitation',
      points: [
        'Floor scrubbing, washroom sanitation, and garbage disposal routines.',
        'Eco-friendly chemicals (Taski/Diversey equivalent) with trained janitors.',
        'Dusting of cabins, workstations, glass facades, and common corridors.',
        'Daily inspection checklists signed by on-site facility supervisors.',
      ],
    },
    {
      icon: FileCheck,
      title: 'D. Emergency response & fire safety',
      points: [
        'First-response fire extinguisher operation during sudden outbreak.',
        'Disaster evacuation coordination and crowd containment.',
        'Immediate incident escalation to central emergency control desk.',
        'Quarterly security mock drills in coordination with client management.',
      ],
    },
  ];

  return (
    <div className={containerClass}>
      {/* PAGE 1: TRANSMITTAL */}
      {pageNo === 1 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}
            {renderClientBlock('Quotation submitted to', 'Proposal date', docDate)}

            <div className="rounded-md border border-red-200 bg-red-50/60 px-3 py-2 text-[12px] text-slate-900">
              <span className="mr-1 font-semibold text-red-800">Subject:</span>
              <span className="font-medium">{proposalSubject}</span>
            </div>

            <div className="space-y-3.5 pt-0.5 text-[12.5px] leading-relaxed text-slate-800">
              <p className="text-justify">
                <strong>Respected Sir / Madam,</strong>
                <br />
                With reference to your commercial inquiry and our physical inspection visit regarding the provision
                of specialized security guarding, premises surveillance, and facility housekeeping manpower,{' '}
                <strong>{company.companyName}</strong> is pleased to submit our comprehensive formal proposal and
                certified schedule of rates for your administrative review.
              </p>

              <div className="space-y-1.5">
                <SectionTitle>1. Statutory accreditations &amp; regulatory standing</SectionTitle>
                <ul className="list-disc space-y-1 pl-5 text-[12px] leading-normal text-slate-700">
                  <li>
                    Formally licensed across Madhya Pradesh under the{' '}
                    <strong>Private Security Agencies (Regulation) Act, 2005 (PSARA MP)</strong>.
                  </li>
                  <li>
                    100% compliant statutory infrastructure with dedicated monthly remittances under{' '}
                    <strong>EPF, ESIC, Labour Welfare Fund (LWF) &amp; Professional Tax</strong>.
                  </li>
                  <li>
                    All deployed security personnel undergo mandatory police character verification, biometric
                    background documentation, and rigorous pre-induction physical fitness drills.
                  </li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <SectionTitle>2. Operational command &amp; supervisory oversight</SectionTitle>
                <ul className="list-disc space-y-1 pl-5 text-[12px] leading-normal text-slate-700">
                  <li>
                    <strong>Dedicated 24/7 flying patrol squad:</strong> regular unannounced day and night surprise
                    inspections conducted by Senior Field Officers across Indore, Ujjain, Pithampur, and MP.
                  </li>
                  <li>
                    <strong>Central escalation desk:</strong> 24-hour rapid communication bridge with local police
                    stations, fire emergency services, and medical first-responders.
                  </li>
                  <li>
                    <strong>Turnout standards:</strong> crisp ceremonial company uniforms equipped with badges,
                    whistles, lanyards, high-visibility night batons, and formal duty log registers.
                  </li>
                </ul>
              </div>

              <div className="space-y-1">
                <SectionTitle>3. Executive guarantee</SectionTitle>
                <p className="text-justify text-[12px] text-slate-700">
                  We guarantee that upon acceptance, seamless deployment will be mobilized within 24 to 48 hours
                  without operational delay, backed by experienced relievers to ensure 100% post occupancy at all
                  times.
                </p>
              </div>

              <p className="pt-1 text-justify text-[12px] font-medium text-slate-800">
                We assure you of the highest standards of vigilance, discipline, and integrity at your esteemed
                premises.
              </p>
            </div>
          </div>

          {renderFooter(
            1,
            <>
              <p className="text-[10.5px] font-semibold text-slate-900">Protection &bull; Security &bull; Facility management</p>
              <p className="text-[11px] font-semibold text-red-700">संरक्षण एवं सुरक्षा</p>
            </>,
            'Managing Director'
          )}
        </>
      )}

      {/* PAGE 2: RATE SHEET */}
      {pageNo === 2 && (
        <>
          <div className="space-y-3">
            {renderHeader()}
            {renderClientBlock('Quotation prepared for', 'Docket ref', docRef)}

            {billingModel === 'COMPLIANCE' ? (
              <div className="w-full overflow-hidden rounded-md border border-slate-300">
                <table className="w-full border-collapse text-left text-[11px]">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className={`${th} w-8 text-center`}>#</th>
                      <th className={th}>Wage structure (M.P. PSARA)</th>
                      <th className={`${th} w-20 text-center`}>Rate</th>
                      {activeChosenServices.map((s: any, idx: number) => (
                        <th key={idx} className={`${th} text-right`}>
                          {s.label}
                          <span className="block text-[10px] font-normal text-slate-500">
                            {shiftLabel(s.shift)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-800">
                    {complianceRows.map((r) => (
                      <tr key={r.sr} className={r.emphasis ? 'bg-slate-50 font-semibold' : ''}>
                        <td className={`${td} text-center`}>{r.sr}</td>
                        <td className={td}>{r.label}</td>
                        <td className={`${td} text-center text-[10.5px]`}>{r.benchmark}</td>
                        {lines.map((l, idx) => (
                          <td key={idx} className={`${td} text-right tabular-nums`}>
                            {formatINR(r.value(l))}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-red-800 text-white">
                      <td className="px-2.5 py-2.5 text-center font-semibold">9</td>
                      <td className="px-2.5 py-2.5 font-semibold">Cost to company (per head / month)</td>
                      <td className="px-2.5 py-2.5 text-center text-[10.5px]">Total</td>
                      {lines.map((l, idx) => (
                        <td key={idx} className="px-2.5 py-2.5 text-right text-[13px] font-bold tabular-nums">
                          {formatINR(l.total)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full">
                <div className="overflow-hidden rounded-md border border-slate-300">
                  <table className="w-full border-collapse text-left text-[12px]">
                    <thead className="bg-slate-100 text-slate-800">
                      <tr>
                        <th className={th}>Service role</th>
                        <th className={`${th} text-center`}>Shift</th>
                        <th className={`${th} text-center`}>Posts</th>
                        <th className={`${th} text-right`}>Rate per head</th>
                        <th className={`${th} text-right`}>Monthly amount</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-800">
                      {activeChosenServices.map((service: any, idx: number) => (
                        <tr key={idx}>
                          <td className={`${td} py-2.5 font-semibold text-slate-900`}>{service.label}</td>
                          <td className={`${td} py-2.5 text-center`}>
                            {service.shift === '12_HOURS' ? '12 hours (continuous)' : '8 hours (continuous)'}
                          </td>
                          <td className={`${td} py-2.5 text-center`}>
                            {service.count} {service.count === 1 ? 'post' : 'posts'}
                          </td>
                          <td className={`${td} py-2.5 text-right tabular-nums`}>
                            {formatINR(service.perHeadRate)}
                          </td>
                          <td className={`${td} py-2.5 text-right font-semibold tabular-nums text-slate-900`}>
                            {formatINR(service.lineTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {(() => {
                  const label = getFlatInclusionsLabel();
                  if (!label) return null;
                  return (
                    <p className="mt-1.5 px-1 text-[10px] text-slate-600">
                      <span className="font-semibold text-red-800">Rate basis:</span> the consolidated rate per
                      head is formulated as [{label}].
                    </p>
                  );
                })()}
              </div>
            )}

            <div className="flex items-center justify-between gap-4 rounded-md border border-red-200 bg-red-50/60 p-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-red-950">
                  Total deployment: {activeChosenServices.map((s: any) => `${s.count} ${s.label}`).join(', ')}
                </p>
                <p className="mt-0.5 text-[10px] text-red-800">
                  GST @ 18% is charged extra on the total monthly billing, as per statutory laws.
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] text-slate-500">Total monthly billing</p>
                <p className="whitespace-nowrap text-[18px] font-bold tabular-nums text-slate-900">
                  {formatINR(grandTotal)}
                </p>
              </div>
            </div>

            <div className="space-y-1 pt-0.5 text-[10.5px] leading-normal text-slate-700">
              <h4 className="border-b border-slate-200 pb-0.5 text-[11px] font-semibold text-slate-900">
                Primary terms of engagement
              </h4>
              <ol className="list-decimal space-y-0.5 pl-4">
                <li>Rates apply on a continuous 30/31 days monthly cycle per post deployed.</li>
                <li>
                  Offer valid for <strong>{validityDays} calendar days</strong> from the date of issue.
                </li>
                <li>
                  Monthly certified invoices are payable within <strong>{paymentTermsDays} calendar days</strong>.
                </li>
                <li>
                  <strong>GST @ 18% extra</strong> as applicable under prevailing tax statutes (Direct / RCM).
                </li>
                <li>
                  Direct recruitment or hiring of deployed staff is prohibited without official clearance and
                  payment of placement compensation.
                </li>
                <li>
                  <strong>Gender rate parity:</strong> Male Security Guard and Female (Lady) Security Guard
                  deployments carry identical rates with zero commercial variation.
                </li>
              </ol>
            </div>
          </div>

          {renderFooter(
            2,
            <>
              <p className="text-[10.5px] font-semibold text-slate-900">PSA licence: {company.psaraLicense}</p>
              <p className="text-[10px]">GSTIN: {company.gstNumber}</p>
            </>,
            'Managing Director'
          )}
        </>
      )}

      {/* PAGE 3: TERMS */}
      {pageNo === 3 && (
        <>
          <div className="space-y-3">
            {renderHeader()}

            <div className="space-y-2.5 text-[11.5px] leading-relaxed text-slate-800">
              <h3 className="border-b border-red-200 pb-1 text-[14px] font-semibold text-red-800">
                Operational terms &amp; commercial covenants
              </h3>

              {covenants.map(([title, body], i) => (
                <div key={title} className="rounded-md border border-slate-200 bg-slate-50/60 p-2.5">
                  <h4 className="text-[11.5px] font-semibold text-slate-900">
                    {i + 1}. {title}
                  </h4>
                  <p className="mt-0.5 text-justify leading-normal text-slate-700">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {renderFooter(
            3,
            <>
              <p className="text-[10.5px] font-semibold text-slate-900">PSARA MP commercial framework</p>
              <p className="text-[10px] text-slate-500">Governed under the jurisdiction of the High Court, Indore (M.P.)</p>
            </>,
            'Authorised Signatory'
          )}
        </>
      )}

      {/* PAGE 4: SCOPE */}
      {pageNo === 4 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}

            <div className="space-y-3 text-[12px] leading-relaxed text-slate-800">
              <h3 className="border-b border-red-200 pb-1 text-[14px] font-semibold text-red-800">
                Scope of services &amp; guarding protocols
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {scopes.map(({ icon: Icon, title, points }) => (
                  <div key={title} className="space-y-1.5 rounded-md border border-slate-200 bg-slate-50/60 p-3">
                    <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-900">
                      <Icon size={16} className="text-red-700" />
                      <span>{title}</span>
                    </div>
                    <ul className="list-disc space-y-0.5 pl-4 text-[11px] text-slate-700">
                      {points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-2 space-y-1 rounded-md border border-red-200 bg-red-50/50 p-4 text-center">
                <h4 className="text-[11px] font-semibold text-red-800">Quality policy &amp; directorial commitment</h4>
                <p className="text-[13px] font-medium leading-snug text-slate-900">
                  &ldquo;To deliver an impregnable first line of defence through honesty, physical discipline,
                  vigilant supervision, and 100% statutory integrity.&rdquo;
                </p>
                <p className="pt-1 text-[11px] text-slate-600">
                  &mdash; {company.directorName}, Managing Director
                </p>
              </div>
            </div>
          </div>

          {renderFooter(
            4,
            <>
              <p className="text-[10.5px] font-semibold text-slate-900">Service commitment &bull; Quality management</p>
              <p className="text-[10px] text-slate-500">Vigilance &amp; central escalation protocol</p>
            </>,
            'Authorised Signatory',
            true
          )}
        </>
      )}

      {/* PAGE 5: CREDENTIALS & ACCEPTANCE */}
      {pageNo === 5 && (
        <>
          <div className="space-y-3.5">
            {renderHeader()}

            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-red-200 pb-1">
                <ShieldCheck size={18} className="text-red-800" />
                <h3 className="text-[14px] font-semibold text-red-800">
                  Statutory registrations &amp; corporate credentials
                </h3>
              </div>

              <div className="overflow-hidden rounded-md border border-slate-300">
                <table className="w-full border-collapse text-left text-[11.5px]">
                  <thead className="bg-slate-100 text-slate-800">
                    <tr>
                      <th className={`${th} w-10 text-center`}>#</th>
                      <th className={th}>Registration / licence</th>
                      <th className={`${th} text-right`}>Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(([label, value], idx) => (
                      <tr key={label} className={idx % 2 === 1 ? 'bg-slate-50/70' : ''}>
                        <td className={`${td} text-center`}>{idx + 1}</td>
                        <td className={`${td} text-slate-800`}>{label}</td>
                        <td className={`${td} text-right font-semibold text-slate-900`}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 space-y-2 rounded-md border border-dashed border-slate-400 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1">
                  <span className="text-[12px] font-semibold text-slate-900">
                    Client acceptance &amp; deployment work order
                  </span>
                  <span className="text-[10px] text-slate-500">Ref: {docRef}</span>
                </div>
                <p className="text-justify text-[11px] leading-normal text-slate-700">
                  We, the undersigned authorised authority for <strong>{docClientName || 'the client'}</strong>,
                  hereby accept the rates, terms, and conditions set forth in this {TOTAL_PAGES}-page commercial
                  docket and authorise <strong>{company.companyName}</strong> to proceed with deployment at our
                  establishment.
                </p>

                <div className="grid grid-cols-2 gap-8 pb-1 pt-8">
                  <div className="text-center">
                    <div className="border-t border-slate-800 pt-1">
                      <span className="block text-[11px] font-semibold text-slate-900">Authorised signatory &amp; stamp</span>
                      <span className="block text-[10px] text-slate-500">For {docClientName || 'client establishment'}</span>
                      <span className="mt-0.5 block text-[10px] text-slate-400">Date: ____________________</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="border-t border-slate-800 pt-1">
                      <span className="block text-[11px] font-semibold text-slate-900">For {company.companyName}</span>
                      <span className="block text-[10px] text-slate-500">{company.directorName}, Managing Director</span>
                      <span className="mt-0.5 block text-[10px] text-slate-400">Date: {docDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {renderFooter(
            5,
            <>
              <p className="text-[10.5px] font-semibold text-slate-900">Certified statutory registrations</p>
              <p className="text-[10px] text-red-700">Government of Madhya Pradesh compliant</p>
            </>,
            'Managing Director'
          )}
        </>
      )}
    </div>
  );
}
