'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  FileText,
  BadgeCheck,
  CheckCircle2,
  Eye,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  PhoneCall,
  Scale,
  Award,
  Calendar,
  Layers
} from 'lucide-react';
import { Navbar } from '@/components/public/navbar';
import Footer from '@/components/public/footer';

type CategoryFilter = 'ALL' | 'PSARA' | 'LABOUR' | 'TAX' | 'TRAINING';

interface CertificateDoc {
  id: string;
  title: string;
  category: CategoryFilter;
  categoryLabel: string;
  authority: string;
  regNumber: string;
  validity: string;
  legalBasis: string;
  description: string;
  pages: string[];
  keyHighlights: string[];
}

const certificationRecords: CertificateDoc[] = [
  {
    id: 'DOC-PSARA-01',
    title: 'PSARA Private Security Agency Licence (Current)',
    category: 'PSARA',
    categoryLabel: 'Home Department & PSARA',
    authority: 'Controlling Authority / Home Department, Govt. of Madhya Pradesh',
    regNumber: 'PSA/L/74/MP/2023/FEB/3/425',
    validity: '01/09/2022 to 31/08/2027 (Entire State of M.P.)',
    legalBasis: 'The Private Security Agencies (Regulation) Act, 2005 & M.P. Rules, 2012',
    description: 'Official statutory licence granting legal authority to deploy static, armed, and physical security guards across all 55 districts of Madhya Pradesh.',
    pages: ['/api/documents/signed-url?file=psara-license-current-p1.webp'],
    keyHighlights: [
      'Valid throughout the entire state of Madhya Pradesh',
      'Officially issued under Controlling Authority, M.P.',
      'Active renewal sequence maintaining continuous operations'
    ]
  },
  {
    id: 'DOC-PSARA-02',
    title: 'PSARA Historical / Heritage Licence (Form II)',
    category: 'PSARA',
    categoryLabel: 'Home Department & PSARA',
    authority: 'Office of the Addl. D.G. of Police / Controlling Authority, Bhopal (M.P.)',
    regNumber: 'Form II (Old Reg: 731 / R-3)',
    validity: 'Continuous Operations Since 2014',
    legalBasis: 'Section 7(2) of PSARA 2005 (Historical Form II Renewal)',
    description: 'Historical official gazetted licence issued under the Additional Director General of Police, demonstrating an unbroken decade-long operational standing in MP.',
    pages: ['/api/documents/signed-url?file=psara-license-heritage-p1.webp'],
    keyHighlights: [
      'Documented operational heritage since 2014',
      'Signed & endorsed by ADG Police Bhopal controlling authority',
      'Seamless regulatory transition into modern state licensing'
    ]
  },
  {
    id: 'DOC-TRG-01',
    title: 'Proprietor Security Training Certificate (Rule 10(1))',
    category: 'TRAINING',
    categoryLabel: 'Mandated Training',
    authority: 'Samarth Detective & Security Services (Govt. Order: PA/ADG/SISF/PSA/561)',
    regNumber: 'Cert No: P-021311 | Lic: TRG/01/2014',
    validity: 'Grade A — Lifetime Compliance Qualification',
    legalBasis: 'Madhya Pradesh Private Security Agencies Rules, 2012 — Section 10(1)',
    description: 'In the Madhya Pradesh Private Security Agencies Rules, 2012, the requirement is specified under Section 10(1). The rule states, "The licencee shall successfully undergo a training relating to the private security service as prescribed by the Controlling Authority within the time frame fixed by it". Completed under Retd. D.S.P., M.P. Police with Grade A qualification.',
    pages: ['/api/documents/signed-url?file=proprietor-training-p1.webp'],
    keyHighlights: [
      'Completed under supervision of Retd. D.S.P. Anil Bhatt',
      'Awarded Grade "A" rating as prescribed by the Controlling Authority',
      'Mandatory proprietor security management compliance fulfilled'
    ]
  },
  {
    id: 'DOC-EPF-01',
    title: 'EPFO Establishment Code Intimation Certificate',
    category: 'LABOUR',
    categoryLabel: 'Labor & Social Security',
    authority: 'Employees\' Provident Fund Organisation, Ministry of Labour, Govt. of India',
    regNumber: 'Code: MPIND1462732000 | App: 9202536317',
    validity: 'Active Statutory Compliance',
    legalBasis: 'Employees\' Provident Funds and Miscellaneous Provisions Act, 1952',
    description: 'Official establishment code allotment ensuring direct, monthly employee EPF passbook contributions and transparent labor welfare management.',
    pages: [
      '/api/documents/signed-url?file=epf-certificate-p1.webp',
      '/api/documents/signed-url?file=epf-certificate-p2.webp'
    ],
    keyHighlights: [
      'Direct monthly Electronic Challan cum Return (ECR) generation',
      '100% provident fund protection for all on-duty security & cleaning personnel',
      'Monthly payment verification receipts enclosed with enterprise invoices'
    ]
  },
  {
    id: 'DOC-ESIC-01',
    title: 'ESIC Employer Registration Intimation',
    category: 'LABOUR',
    categoryLabel: 'Labor & Social Security',
    authority: 'Employees\' State Insurance Corporation, Regional Office Indore',
    regNumber: 'Code No: 18000237700000999',
    validity: 'Active Social Security Coverage',
    legalBasis: 'Section 1(3) & 1(5) of the Employees\' State Insurance Act, 1948',
    description: 'Statutory health and medical social security registration providing full hospital and outpatient insurance for our guarding and housekeeping workforce.',
    pages: [
      '/api/documents/signed-url?file=esic-certificate-p1.webp',
      '/api/documents/signed-url?file=esic-certificate-p2.webp'
    ],
    keyHighlights: [
      'Complete cashless medical and emergency health coverage for staff',
      'Full coverage across regional ESIC dispensaries and network hospitals',
      'Eliminates statutory vicarious liability for client enterprises'
    ]
  },
  {
    id: 'DOC-GST-01',
    title: 'GST Registration Certificate (Form GST REG-06)',
    category: 'TAX',
    categoryLabel: 'Tax & Commercial Compliance',
    authority: 'Goods and Services Tax Network, Govt. of India & Govt. of Madhya Pradesh',
    regNumber: 'GSTIN: 23AQRPD0652Q2ZI',
    validity: 'Regular Taxpayer — Active',
    legalBasis: 'Rule 10(1) of the Central Goods and Services Tax Rules, 2017',
    description: 'Official 3-page regular GST registration certificate issued by the Assistant Commissioner of State Tax, Indore-15, complete with Annexure A and Annexure B.',
    pages: [
      '/api/documents/signed-url?file=gst-certificate-p1.webp',
      '/api/documents/signed-url?file=gst-certificate-p2.webp',
      '/api/documents/signed-url?file=gst-certificate-p3.webp'
    ],
    keyHighlights: [
      'Includes principal place of business and proprietor schedule',
      'Legally compliant GST billing enabling 100% client Input Tax Credit (ITC)',
      'Digitally signed and validated by State Commercial Tax authorities'
    ]
  },
  {
    id: 'DOC-LWB-01',
    title: 'MP Labour Welfare Board Registration',
    category: 'LABOUR',
    categoryLabel: 'Labor & Social Security',
    authority: 'M.P. Shram Kalyan Mandal, Labour Department, Govt. of Madhya Pradesh',
    regNumber: 'Registration No: LWB-R-731',
    validity: 'Active Registered Contractor',
    legalBasis: 'Madhya Pradesh Shram Kalyan Nidhi Adhiniyam',
    description: 'Certified registration with the MP Shramik Evaluation & Monitoring System verifying contractor standing for enterprise service execution.',
    pages: ['/api/documents/signed-url?file=labour-welfare-license-p1.webp'],
    keyHighlights: [
      'Official contractor evaluation registration',
      'Ensures labor welfare cess and fund statutory compliance',
      'Verified credential for government and corporate industrial deployment'
    ]
  },
  {
    id: 'DOC-PT-01',
    title: 'MP Professional Tax (PT) Registration Certificate',
    category: 'TAX',
    categoryLabel: 'Tax & Commercial Compliance',
    authority: 'Commercial Tax Department, Indore Circle-15, Govt. of Madhya Pradesh',
    regNumber: 'Certificate No: 79479022051',
    validity: 'Active Form-2 Employer Registration',
    legalBasis: 'Rule 3(3) of the Madhya Pradesh Vritti Kar Adhiniyam, 1995',
    description: 'Form-2 official certificate of registration for employers issued under the Madhya Pradesh Professional Tax Act, 1995.',
    pages: ['/api/documents/signed-url?file=professional-tax-certificate-p1.webp'],
    keyHighlights: [
      'Commercial tax employer compliance certificate',
      'Authorizes lawful professional payroll tax administration',
      'Endorsed by Commercial Tax Office, Indore Division-1'
    ]
  },
  {
    id: 'DOC-GUM-01',
    title: 'MP Shops & Establishment Registration (Gumasta)',
    category: 'TAX',
    categoryLabel: 'Tax & Commercial Compliance',
    authority: 'District Labour Office, Indore, Govt. of Madhya Pradesh',
    regNumber: 'Registration No: INDO220426SE009839',
    validity: 'Commercial Establishment — Registered',
    legalBasis: 'Rule 3(3) of the Madhya Pradesh Shops and Establishments Act, 1958',
    description: 'Statutory local municipal and labor registration certifying lawful physical establishment and commercial operations in Indore, Madhya Pradesh.',
    pages: ['/api/documents/signed-url?file=gumasta-license-p1.webp'],
    keyHighlights: [
      'Registered under M.P. Shops & Establishments Act, 1958',
      'Digitally certified by District Labour Officer, Indore',
      'Validates corporate address and physical headquarters'
    ]
  }
];

function AutoOrientedDocPreview({ src, alt }: { src: string; alt: string }) {
  const [isLandscape, setIsLandscape] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-1.5">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="360px"
        className="object-cover blur-md opacity-25 scale-110 pointer-events-none select-none"
      />

      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={(e) => {
          const target = e.currentTarget;
          if (target.naturalWidth > target.naturalHeight) {
            setIsLandscape(true);
          }
        }}
        className={`z-10 object-contain transition-transform duration-300 group-hover:scale-[1.02] select-none pointer-events-none ${
          isLandscape ? 'object-center p-1' : 'object-center p-0'
        }`}
        onDragStart={(e) => e.preventDefault()}
      />
    </div>
  );
}

export default function CertificationsPage() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');
  const [selectedDoc, setSelectedDoc] = useState<CertificateDoc | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [modalLandscape, setModalLandscape] = useState<boolean>(false);

  const filteredDocs = activeFilter === 'ALL'
    ? certificationRecords
    : certificationRecords.filter((doc) => doc.category === activeFilter);

  const openViewer = (doc: CertificateDoc) => {
    setSelectedDoc(doc);
    setCurrentPage(0);
    setZoomLevel(1);
    setModalLandscape(false);
  };

  const closeViewer = () => {
    setSelectedDoc(null);
    setCurrentPage(0);
    setZoomLevel(1);
    setModalLandscape(false);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedDoc) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === 'ArrowRight' && currentPage < selectedDoc.pages.length - 1) {
      setCurrentPage((prev) => prev + 1);
    }
    if (e.key === 'ArrowLeft' && currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [selectedDoc, currentPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans antialiased selection:bg-red-700 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 text-xs">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-slate-500">
              <span>Legal Accreditations</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#0F172A]">Public Inspection Vault</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading font-semibold uppercase tracking-wide text-slate-600">
                100% Audited &amp; Statutory Compliant &bull; Madhya Pradesh
              </span>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 rounded border border-amber-400/40 bg-amber-50 px-3 py-1 font-heading text-xs font-bold uppercase tracking-wider text-amber-700">
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
                <span>Statutory Governance &amp; Regulatory Compliance</span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#0F172A] leading-tight">
                Certifications &amp; Legal Licences
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 leading-relaxed">
                Vidhya Security Force &amp; Housekeeping Services maintains strict statutory governance across all state and national authorities, ensuring zero legal liability, flawless labor audit clearance, and transparent vendor verification for our clients.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">PSARA Status</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">Valid Thru Aug 2027</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Statewide MP Licenced</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">EPFO Code</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">MPIND1462732000</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">100% Monthly Passbook</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">ESIC Code</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">18000237700000999</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Cashless Medical Cover</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                <span className="font-sans text-[10px] text-slate-400 uppercase tracking-tight font-semibold">GST Identification</span>
                <div className="font-heading text-xs sm:text-sm font-bold text-[#0F172A] mt-0.5">23AQRPD0652Q2ZI</div>
                <div className="text-[10px] text-emerald-600 font-medium mt-1">Regular Taxpayer (ITC Ready)</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {[
                { label: 'All Credentials (9)', value: 'ALL' },
                { label: 'PSARA & Home Dept (2)', value: 'PSARA' },
                { label: 'Labor & Social Security (3)', value: 'LABOUR' },
                { label: 'Tax & Commercial (3)', value: 'TAX' },
                { label: 'Mandated Training (1)', value: 'TRAINING' },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value as CategoryFilter)}
                  className={`rounded-lg px-3.5 py-2 font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === tab.value
                      ? 'bg-[#0F172A] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  <div
                    onClick={() => openViewer(doc)}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950 cursor-pointer border-b border-slate-100 flex items-center justify-center"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <AutoOrientedDocPreview src={doc.pages[0]} alt={doc.title} />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none z-15" />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-20 rotate-[-20deg] z-15">
                      <span className="font-heading text-base sm:text-lg font-black uppercase tracking-widest text-white text-center border border-white px-3 py-1">
                        VIDHYA SECURITY FORCE
                      </span>
                    </div>

                    <div className="absolute top-3 left-3 z-20">
                      <span className="rounded bg-[#0F172A]/90 backdrop-blur-xs px-2.5 py-1 font-heading text-[10px] font-bold uppercase tracking-wider text-amber-300 border border-white/10 shadow-xs">
                        {doc.categoryLabel}
                      </span>
                    </div>

                    {doc.pages.length > 1 && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="rounded bg-black/80 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] font-bold text-white flex items-center gap-1 border border-white/10">
                          <Layers className="h-3 w-3 text-amber-400" />
                          {doc.pages.length} Pages
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-25">
                      <span className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-heading text-xs font-bold uppercase tracking-wider text-[#0F172A] shadow-lg">
                        <Eye className="h-4 w-4 text-red-700" />
                        Inspect Document
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 z-20">
                      <div className="rounded bg-black/75 backdrop-blur-xs px-2.5 py-1.5 border border-white/10 text-slate-200 text-[11px] font-mono flex items-center justify-between">
                        <span className="truncate">{doc.regNumber}</span>
                        <Lock className="h-3 w-3 text-amber-400 shrink-0 ml-1.5" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div>
                      <span className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {doc.authority}
                      </span>
                      <h3 className="font-heading text-base font-bold uppercase tracking-tight text-[#0F172A] leading-snug mt-1 group-hover:text-red-700 transition-colors">
                        {doc.title}
                      </h3>
                    </div>

                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      {doc.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <span className="block font-heading text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Statutory Highlights:
                      </span>
                      <ul className="space-y-1.5">
                        {doc.keyHighlights.map((hl, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] font-sans text-slate-700">
                            <CheckCircle2 className="h-3.5 w-3.5 text-red-700 shrink-0 mt-0.5" />
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
                  <span className="font-sans text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Verified Genuine
                  </span>
                  <button
                    onClick={() => openViewer(doc)}
                    className="font-heading text-xs font-bold uppercase tracking-wider text-red-700 hover:text-red-800 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect</span>
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-xs">
            <div className="max-w-3xl mb-6">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-red-700 block mb-1">
                Client Assurance
              </span>
              <h2 className="font-heading text-2xl font-black uppercase tracking-tight text-[#0F172A]">
                Labor Law &amp; Statutory Compliance Protocol
              </h2>
              <p className="font-sans text-sm text-slate-600 mt-2 leading-relaxed">
                As a client contracting security and facility personnel in Madhya Pradesh, your organization remains 100% shielded from statutory labor liabilities. Vidhya Security Force submits verified compliance documentation with every monthly billing cycle:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-xs font-sans">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0F172A]">
                  <FileText className="h-4 w-4 text-red-700" />
                  Monthly ECR Challans
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Provident Fund Electronic Challan cum Return (ECR) receipt with individual employee names credited.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0F172A]">
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  ESIC Contribution
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Monthly ESIC bank payment verification vouchers ensuring complete medical insurance validity.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0F172A]">
                  <Scale className="h-4 w-4 text-emerald-600" />
                  Minimum Wages Act
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Direct electronic bank transfer wage disbursement sheets aligned with MP State Gazetted Minimum Wage notifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#0F172A]">
                  <BadgeCheck className="h-4 w-4 text-blue-600" />
                  Police Verification
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Local police station character clearance and identity verification dossiers maintained for 100% of deployed personnel.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-slate-800 bg-[#0F172A] p-8 sm:p-12 text-white shadow-panel flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <span className="font-heading text-xs font-bold uppercase tracking-widest text-amber-400">
                Ready for Deployment &bull; All 55 MP Districts
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-snug">
                Need Licensed Security or Housekeeping Staff?
              </h3>
              <p className="font-sans text-sm text-slate-300 leading-relaxed">
                Contact our operations desk to discuss your security guard requirements, shift timings, and receive a customized deployment proposal.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-red-700 px-6 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-red-800 transition-colors shadow-sm"
              >
                <span>Request Deployment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="tel:+919826259292"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 px-5 py-3.5 font-heading text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
              >
                <PhoneCall className="h-4 w-4 text-amber-400" />
                <span>+91 98262 59292</span>
              </a>
            </div>
          </section>
        </div>
      </main>

      {selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="px-5 py-3.5 bg-[#0F172A] border-b border-slate-800 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700/20 text-red-400 border border-red-700/40 shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="truncate">
                  <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-tight truncate text-white">
                    {selectedDoc.title}
                  </h3>
                  <p className="font-mono text-[11px] text-slate-400 truncate">
                    {selectedDoc.regNumber} &bull; {selectedDoc.authority}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1 bg-slate-800 rounded-lg p-1 border border-slate-700">
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
                    className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
                    className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1.5 text-slate-300 hover:text-white rounded hover:bg-slate-700 cursor-pointer"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={closeViewer}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  title="Close Inspection Viewer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-slate-950 p-4 flex items-center justify-center relative select-none">
              <div
                className="relative max-w-full transition-transform duration-200 shadow-2xl"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'center center'
                }}
              >
                <Image
                  src={selectedDoc.pages[currentPage]}
                  alt={`${selectedDoc.title} - Page ${currentPage + 1}`}
                  width={modalLandscape ? 1200 : 900}
                  height={modalLandscape ? 850 : 1280}
                  unoptimized
                  onLoad={(e) => {
                    const target = e.currentTarget;
                    if (target.naturalWidth > target.naturalHeight) {
                      setModalLandscape(true);
                    }
                  }}
                  className={`rounded-sm object-contain w-auto pointer-events-none select-none ${
                    modalLandscape ? 'max-h-[65vh]' : 'max-h-[72vh]'
                  }`}
                  priority
                  onDragStart={(e) => e.preventDefault()}
                />

                <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-around overflow-hidden opacity-30">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="font-heading text-lg sm:text-2xl font-black uppercase tracking-widest text-white whitespace-nowrap text-center rotate-[-25deg] transform translate-y-4"
                    >
                      VIDHYA SECURITY FORCE &bull; VERIFICATION ONLY &bull; NOT FOR REPRODUCTION
                    </div>
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                  <div className="h-48 w-48 rounded-full border-4 border-amber-400 flex items-center justify-center text-center p-4">
                    <span className="font-heading text-xs font-black uppercase text-amber-300">
                      OFFICIAL RECORD<br />GOVT OF MP AUDITED
                    </span>
                  </div>
                </div>
              </div>

              {selectedDoc.pages.length > 1 && (
                <>
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none border border-slate-700 shadow-xl cursor-pointer"
                    title="Previous Page"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <button
                    disabled={currentPage === selectedDoc.pages.length - 1}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white disabled:opacity-30 disabled:pointer-events-none border border-slate-700 shadow-xl cursor-pointer"
                    title="Next Page"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3 bg-[#0F172A] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-300 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-sans font-medium text-slate-200">
                  {selectedDoc.legalBasis}
                </span>
              </div>

              {selectedDoc.pages.length > 1 ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">
                    Viewing Page {currentPage + 1} of {selectedDoc.pages.length}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {selectedDoc.pages.map((_, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => setCurrentPage(pIdx)}
                        className={`px-2.5 py-1 rounded font-mono text-[11px] font-bold cursor-pointer transition-colors ${
                          currentPage === pIdx
                            ? 'bg-red-700 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        P{pIdx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <span className="font-mono text-[11px] text-slate-400">
                  Single-Page Official Certificate
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
