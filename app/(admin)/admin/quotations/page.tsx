'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  ArrowLeft,
  Search,
  FileCheck2,
  CheckCircle2,
  Eye,
  Edit3,
  CheckSquare,
  Square,
  PlusCircle,
  Loader2,
  MessageCircle,
  FileText,
  Plus,
  Trash2,
  Sparkles,
  Crown,
  Clock,
  Check,
  Building2,
  ShieldCheck,
  Calendar,
  Layers,
  Percent
} from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabaseBrowser';
import { ShiftType, RelieverType } from '@/lib/billingMath';
import QuotationDocket, { PageNo, DocketCompanyInfo } from '@/components/admin/QuotationDocket';
import SurveyTransmittalLetter from '@/components/admin/SurveyTransmittalLetter';

const COMPANY_DEFAULTS: DocketCompanyInfo = {
  companyName: 'VIDHYA SECURITY FORCE & HOUSEKEEPING SERVICES',
  address: '012 A BLOCK TREASURE TOWN INDORE, MP',
  contactNo: '9826259020',
  email: 'contact@vidhyasecurityforce.in',
  directorName: 'Anil Dhariwal',
  logo: '/assets/img/logo/logo.png',
  sealImage: '',
  psaraLicense: 'PSA/L/74/MP/2023/FEB/3/425',
  labourRegNo: 'INDO220426SE009839',
  epfCode: 'MPIND1462732000 / 18000232770',
  esicRegNo: '18000237700000999',
  gstNumber: '23AQRPD0652Q2ZI',
  ptLicenseNo: '79479022051',
  panNumber: 'AQRPD0652Q'
};

const ALL_PAGES: PageNo[] = [1, 2, 3, 4, 5];
const MAX_POSTS_PER_ROLE = 999;
const PRINT_ROOT_ID = 'vsf-print-root';
const PRINT_MODE_CLASS = 'vsf-print-mode';

interface AccountOption {
  id: string;
  source: 'CLIENT' | 'VISIT' | 'LEAD';
  companyName: string;
  contactPerson: string;
  phone: string;
  address: string;
  manningSpecs?: any;
  category?: string;
  visitDate?: string;
}

interface CustomRoleItem {
  id: string;
  label: string;
  count: number | string;
  shift: ShiftType;
  customBasic: number;
  flatRate: number;
  hasEpf: boolean;
  hasEsic: boolean;
  relieverType: RelieverType;
  relieverCustomValue: number;
  uniformAllowance: number;
}

interface FlatSubOptions {
  addServiceCharge: boolean;
  addEpf: boolean;
  addEsic: boolean;
  addUniform: boolean;
}

const formatINR = (value: number): string =>
  `₹${(Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const normaliseIndianMobile = (raw: string): string => (raw || '').replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '');
const isValidIndianMobile = (raw: string): boolean => /^[6-9]\d{9}$/.test(normaliseIndianMobile(raw));

const PRINT_CSS = `
  .vsf-sheet {
    width: 210mm;
    height: 297mm;
    padding: 12mm 15mm;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: #ffffff;
    color: #0f172a;
    flex-shrink: 0;
  }

  #${PRINT_ROOT_ID} { display: none; }

  @page {
    size: A4 portrait;
    margin: 0;
  }

  @media print {
    html.${PRINT_MODE_CLASS},
    html.${PRINT_MODE_CLASS} body {
      margin: 0 !important;
      padding: 0 !important;
      width: 210mm !important;
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      overflow: visible !important;
      background: #ffffff !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html.${PRINT_MODE_CLASS} body > *:not(#${PRINT_ROOT_ID}) {
      display: none !important;
    }

    html.${PRINT_MODE_CLASS} #${PRINT_ROOT_ID} {
      display: block !important;
      position: static !important;
      width: 210mm !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    #${PRINT_ROOT_ID} .vsf-sheet {
      margin: 0 !important;
      border: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      break-after: page;
      page-break-after: always;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    #${PRINT_ROOT_ID} .vsf-sheet:last-child {
      break-after: auto;
      page-break-after: auto;
    }

    #${PRINT_ROOT_ID} table,
    #${PRINT_ROOT_ID} tr {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

export default function QuotationsPage() {
  const supabase = useMemo(() => getSupabase(), []);

  const [company, setCompany] = useState<DocketCompanyInfo>(COMPANY_DEFAULTS);
  const [accountList, setAccountList] = useState<AccountOption[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'ALL' | 'CLIENT' | 'VISIT' | 'LEAD'>('ALL');
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingToVault, setSavingToVault] = useState(false);
  const [builderErrors, setBuilderErrors] = useState<string[]>([]);

  const [viewMode, setViewMode] = useState<'BUILDER' | 'PREVIEW'>('BUILDER');
  const [activePageTab, setActivePageTab] = useState<'ALL' | 'COVER_LETTER' | PageNo>('ALL');
  const [printModeType, setPrintModeType] = useState<'DOCKET' | 'COVER_LETTER'>('DOCKET');
  const [printPages, setPrintPages] = useState<PageNo[] | null>(null);
  const printRequestedRef = useRef(false);

  // Proposal Meta
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [billingModel, setBillingModel] = useState<'COMPLIANCE' | 'FLAT'>('COMPLIANCE');

  // Modular Flat Rate Sub-Options
  const [flatSubOptions, setFlatSubOptions] = useState<FlatSubOptions>({
    addServiceCharge: true,
    addEpf: false,
    addEsic: false,
    addUniform: false
  });

  const [proposalSubject, setProposalSubject] = useState('Deployment of Security Guarding & Facility Management Operations');
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(7);
  const [validityDays, setValidityDays] = useState<number>(30);
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(8);
  const [inspectedVisitDate, setInspectedVisitDate] = useState<string>('');
  const [visitTimeSlot, setVisitTimeSlot] = useState<string>('11:00 AM – 01:30 PM');

  // Dynamic Live Rates
  const [liveServiceMatrix, setLiveServiceMatrix] = useState({
    GUARD: { label: 'Security Guard', flat12: 15500, flat8: 12500, basic12: 13421, basic8: 12425 },
    SUPERVISOR: { label: 'Security Field Supervisor', flat12: 18500, flat8: 15500, basic12: 14869, basic8: 13800 },
    GUNMAN: { label: 'Armed Gunman (12 Bore / .32)', flat12: 23000, flat8: 19500, basic12: 16500, basic8: 15000 },
    HOUSEKEEPING: { label: 'Housekeeping & Sanitation', flat12: 15000, flat8: 12000, basic12: 15000, basic8: 15000 }
  });

  const [enabledPresets, setEnabledPresets] = useState<Record<string, boolean>>({
    GUARD: true,
    SUPERVISOR: false,
    GUNMAN: false,
    HOUSEKEEPING: false
  });

  const [presetConfigs, setPresetConfigs] = useState<Record<string, {
    count: number | string;
    shift: ShiftType;
    customBasic: number;
    flatRate: number;
    relieverType: RelieverType;
    relieverCustomValue: number;
    uniformAllowance: number;
  }>>({
    GUARD: { count: 1, shift: '12_HOURS', customBasic: 13421, flatRate: 15000, relieverType: 'PERCENT', relieverCustomValue: 16.67, uniformAllowance: 250 },
    SUPERVISOR: { count: 0, shift: '12_HOURS', customBasic: 14869, flatRate: 18000, relieverType: 'PERCENT', relieverCustomValue: 16.67, uniformAllowance: 250 },
    GUNMAN: { count: 0, shift: '12_HOURS', customBasic: 16500, flatRate: 22000, relieverType: 'PERCENT', relieverCustomValue: 16.67, uniformAllowance: 250 },
    HOUSEKEEPING: { count: 0, shift: '8_HOURS', customBasic: 15000, flatRate: 12000, relieverType: 'NIL', relieverCustomValue: 0, uniformAllowance: 250 }
  });

  const [customRoles, setCustomRoles] = useState<CustomRoleItem[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    const [settingsRes, clientsRes, visitsRes, leadsRes, proposalsRes] = await Promise.all([
      supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
      supabase.from('clients').select('id,company_name,billing_address,phone,contact_person').order('company_name'),
      supabase.from('visits').select('*').order('timestamp', { ascending: false }).limit(100),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('proposals').select('*').order('created_at', { ascending: false }).limit(100)
    ]);

    const s = settingsRes.data;
    if (s) {
      setCompany((prev) => ({
        ...prev,
        companyName: s.company_name || prev.companyName,
        address: s.address || prev.address,
        email: s.email || prev.email,
        contactNo: s.contact_no || s.contact_number || s.phone || prev.contactNo,
        directorName: s.director_name || prev.directorName,
        logo: s.logo || prev.logo,
        sealImage: s.seal_image || undefined,
        psaraLicense: s.psara_license || prev.psaraLicense,
        labourRegNo: s.labour_reg_no || prev.labourRegNo,
        epfCode: s.epf_code || prev.epfCode,
        esicRegNo: s.esic_reg_no || prev.esicRegNo,
        gstNumber: (s.gst_number || prev.gstNumber).trim().toUpperCase(),
        ptLicenseNo: s.pt_license_no || prev.ptLicenseNo,
        panNumber: (s.pan_number || prev.panNumber).trim().toUpperCase()
      }));

      const matrix = {
        GUARD: {
          label: 'Security Guard',
          flat12: Number(s.flat_guard_12 || 15500),
          flat8: Number(s.flat_guard_8 || 12500),
          basic12: Number(s.guard_basic_12 || 13421),
          basic8: Number(s.guard_basic_8 || 12425)
        },
        SUPERVISOR: {
          label: 'Security Field Supervisor',
          flat12: Number(s.flat_supervisor_12 || 18500),
          flat8: Number(s.flat_supervisor_8 || 15500),
          basic12: Number(s.supervisor_basic_12 || 14869),
          basic8: Number(s.supervisor_basic_8 || 13800)
        },
        GUNMAN: {
          label: 'Armed Gunman (12 Bore / .32)',
          flat12: Number(s.flat_gunman_12 || 23000),
          flat8: Number(s.flat_gunman_8 || 19500),
          basic12: Number(s.gunman_basic_12 || 16500),
          basic8: Number(s.gunman_basic_8 || 15000)
        },
        HOUSEKEEPING: {
          label: 'Housekeeping & Sanitation',
          flat12: Number(s.flat_housekeeping_12 || 15000),
          flat8: Number(s.flat_housekeeping_8 || 12000),
          basic12: Number(s.housekeeping_basic_12 || 15000),
          basic8: Number(s.housekeeping_basic_8 || 15000)
        }
      };

      setLiveServiceMatrix(matrix);
      setServiceChargePercent(Number(s.default_service_margin || 8));
    }

    const combinedMap = new Map<string, AccountOption>();

    (clientsRes.data || []).forEach((c: any) => {
      const name = (c.company_name || '').trim();
      if (name) {
        combinedMap.set(name.toLowerCase(), {
          id: `CLIENT_${c.id}`,
          source: 'CLIENT',
          companyName: name.toUpperCase(),
          contactPerson: c.contact_person || '',
          phone: c.phone || '',
          address: c.billing_address || ''
        });
      }
    });

    (visitsRes.data || []).forEach((v: any) => {
      const name = (v.company_name || '').trim();
      if (name) {
        let cleanAddr = '';
        if (v.notes) {
          const match = v.notes.match(/Address:\s*([^|]+)/i);
          if (match && match[1]) cleanAddr = match[1].trim();
        }

        const existing = combinedMap.get(name.toLowerCase());
        if (!existing) {
          combinedMap.set(name.toLowerCase(), {
            id: `VISIT_${v.id}`,
            source: 'VISIT',
            companyName: name.toUpperCase(),
            contactPerson: v.contact_person || '',
            phone: v.phone_number || '',
            address: cleanAddr,
            category: v.category,
            manningSpecs: v.manning_specs,
            visitDate: v.timestamp ? new Date(v.timestamp).toLocaleDateString('en-CA') : undefined
          });
        }
      }
    });

    (leadsRes.data || []).forEach((l: any) => {
      const name = (l.company_name || '').trim();
      if (name && !combinedMap.has(name.toLowerCase())) {
        combinedMap.set(name.toLowerCase(), {
          id: `LEAD_${l.id}`,
          source: 'LEAD',
          companyName: name.toUpperCase(),
          contactPerson: l.contact_person || '',
          phone: l.phone || '',
          address: l.address || ''
        });
      }
    });

    setAccountList(Array.from(combinedMap.values()));
    setProposals(proposalsRes.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
    setBuilderErrors([]);

    const acc = accountList.find((x) => x.id === accountId);
    if (!acc) return;

    setClientName(acc.companyName);
    setContactPerson(acc.contactPerson);
    setClientPhone(normaliseIndianMobile(acc.phone).slice(0, 10));
    setClientAddress(acc.address || 'Indore, Madhya Pradesh');
    if (acc.visitDate) setInspectedVisitDate(acc.visitDate);

    if (acc.manningSpecs) {
      const specs = acc.manningSpecs;
      setEnabledPresets({
        GUARD: Boolean(specs.guard?.enabled),
        SUPERVISOR: Boolean(specs.supervisor?.enabled),
        GUNMAN: Boolean(specs.gunman?.enabled),
        HOUSEKEEPING: Boolean(specs.housekeeping?.enabled)
      });

      setPresetConfigs((prev) => ({
        ...prev,
        GUARD: specs.guard ? { ...prev.GUARD, count: specs.guard.count, shift: specs.guard.shift } : prev.GUARD,
        SUPERVISOR: specs.supervisor ? { ...prev.SUPERVISOR, count: specs.supervisor.count, shift: specs.supervisor.shift } : prev.SUPERVISOR,
        GUNMAN: specs.gunman ? { ...prev.GUNMAN, count: specs.gunman.count, shift: specs.gunman.shift } : prev.GUNMAN,
        HOUSEKEEPING: specs.housekeeping ? { ...prev.HOUSEKEEPING, count: specs.housekeeping.count, shift: specs.housekeeping.shift } : prev.HOUSEKEEPING
      }));
    }
  };

  const handleAddCustomRole = () => {
    setCustomRoles((prev) => [
      ...prev,
      {
        id: `CUSTOM-${Date.now()}`,
        label: 'Peon / Office Attendant',
        count: 1,
        shift: '8_HOURS',
        customBasic: 15000,
        flatRate: 15000,
        hasEpf: true,
        hasEsic: true,
        relieverType: 'NIL',
        relieverCustomValue: 0,
        uniformAllowance: 250
      }
    ]);
  };

  const handleRemoveCustomRole = (id: string) => {
    setCustomRoles((prev) => prev.filter((r) => r.id !== id));
  };

  // Build Service Items dynamically with multi-option Flat Rate & Compliance models
  const activeChosenServices = useMemo(() => {
    if (viewMode === 'PREVIEW' && selectedProposal?.service_items && !editingProposalId) {
      return selectedProposal.service_items;
    }

    const lines: any[] = [];

    // Helper: Calculate per-head amount based on selected flat rate options
    const computeFlatRate = (baseRate: number, uniform: number) => {
      const epf = flatSubOptions.addEpf ? Math.round(baseRate * 0.13) : 0;
      const esic = flatSubOptions.addEsic ? Math.round(baseRate * 0.0325) : 0;
      const kit = flatSubOptions.addUniform ? uniform : 0;
      const subtotal = baseRate + epf + esic + kit;
      const margin = flatSubOptions.addServiceCharge ? Math.round((subtotal * serviceChargePercent) / 100) : 0;
      return {
        baseRate,
        epf,
        esic,
        kit,
        subtotal,
        margin,
        grandTotal: subtotal + margin
      };
    };

    // Standard preset positions
    (Object.keys(liveServiceMatrix) as (keyof typeof liveServiceMatrix)[]).forEach((role) => {
      const cfg = presetConfigs[role];
      const parsedCount = parseInt(String(cfg?.count || 0), 10) || 0;

      if (enabledPresets[role] && parsedCount > 0) {
        const meta = liveServiceMatrix[role];
        const basicAmt = Number(cfg.customBasic) || (cfg.shift === '12_HOURS' ? meta.basic12 : meta.basic8);
        const uniformAmt = Number(cfg.uniformAllowance || 250);

        // 1. Compliance calculations
        const epf = Math.round(basicAmt * 0.13);
        const esic = Math.round(basicAmt * 0.0325);
        const overtime = cfg.shift === '12_HOURS' ? Math.round(basicAmt * 0.35) : 0;
        const reliever = cfg.relieverType === 'PERCENT'
          ? Math.round(basicAmt * 0.1667)
          : cfg.relieverType === 'FIXED'
            ? Number(cfg.relieverCustomValue || 0)
            : 0;

        const compSubtotal = basicAmt + overtime + reliever + epf + esic + uniformAmt;
        const compMargin = Math.round((compSubtotal * serviceChargePercent) / 100);
        const compGrandTotal = compSubtotal + compMargin;

        // 2. Flat Rate calculations
        const flatCalc = computeFlatRate(cfg.flatRate, uniformAmt);

        const statutory = billingModel === 'COMPLIANCE' ? {
          basic: basicAmt,
          gross: basicAmt + overtime + reliever,
          overtime,
          reliever,
          epf,
          esic,
          uniform: uniformAmt,
          subtotal: compSubtotal,
          serviceCharge: compMargin,
          grandTotal: compGrandTotal
        } : {
          basic: cfg.flatRate,
          gross: cfg.flatRate,
          overtime: 0,
          reliever: 0,
          epf: flatCalc.epf,
          esic: flatCalc.esic,
          uniform: flatCalc.kit,
          subtotal: flatCalc.subtotal,
          serviceCharge: flatCalc.margin,
          grandTotal: flatCalc.grandTotal
        };

        const perHeadRate = billingModel === 'COMPLIANCE' ? compGrandTotal : flatCalc.grandTotal;

        lines.push({
          role,
          label: meta.label,
          count: parsedCount,
          shift: cfg.shift,
          perHeadRate,
          lineTotal: perHeadRate * parsedCount,
          statutory,
          flatBreakup: billingModel === 'FLAT' ? flatCalc : undefined
        });
      }
    });

    // Custom roles
    customRoles.forEach((custom) => {
      const parsedCount = parseInt(String(custom.count || 0), 10) || 0;
      if (parsedCount > 0) {
        const basicAmt = Number(custom.customBasic) || 15000;
        const uniformAmt = Number(custom.uniformAllowance || 250);

        const epf = custom.hasEpf ? Math.round(basicAmt * 0.13) : 0;
        const esic = custom.hasEsic ? Math.round(basicAmt * 0.0325) : 0;
        const overtime = custom.shift === '12_HOURS' ? Math.round(basicAmt * 0.35) : 0;
        const reliever = custom.relieverType === 'PERCENT'
          ? Math.round(basicAmt * 0.1667)
          : custom.relieverType === 'FIXED'
            ? Number(custom.relieverCustomValue || 0)
            : 0;

        const compSubtotal = basicAmt + overtime + reliever + epf + esic + uniformAmt;
        const compMargin = Math.round((compSubtotal * serviceChargePercent) / 100);
        const compGrandTotal = compSubtotal + compMargin;

        const flatCalc = computeFlatRate(custom.flatRate, uniformAmt);

        const statutory = billingModel === 'COMPLIANCE' ? {
          basic: basicAmt,
          gross: basicAmt + overtime + reliever,
          overtime,
          reliever,
          epf,
          esic,
          uniform: uniformAmt,
          subtotal: compSubtotal,
          serviceCharge: compMargin,
          grandTotal: compGrandTotal
        } : {
          basic: custom.flatRate,
          gross: custom.flatRate,
          overtime: 0,
          reliever: 0,
          epf: flatCalc.epf,
          esic: flatCalc.esic,
          uniform: flatCalc.kit,
          subtotal: flatCalc.subtotal,
          serviceCharge: flatCalc.margin,
          grandTotal: flatCalc.grandTotal
        };

        const perHeadRate = billingModel === 'COMPLIANCE' ? compGrandTotal : flatCalc.grandTotal;

        lines.push({
          role: 'CUSTOM',
          label: custom.label,
          count: parsedCount,
          shift: custom.shift,
          perHeadRate,
          lineTotal: perHeadRate * parsedCount,
          statutory,
          flatBreakup: billingModel === 'FLAT' ? flatCalc : undefined,
          customConfig: {
            hasEpf: custom.hasEpf,
            hasEsic: custom.hasEsic,
            basic: custom.customBasic,
            relieverType: custom.relieverType,
            relieverCustomValue: custom.relieverCustomValue,
            uniformAllowance: custom.uniformAllowance
          }
        });
      }
    });

    return lines;
  }, [viewMode, selectedProposal, editingProposalId, enabledPresets, presetConfigs, customRoles, billingModel, flatSubOptions, serviceChargePercent, liveServiceMatrix]);

  const totalMonthlyBilling = useMemo(() => {
    return activeChosenServices.reduce((acc: number, item: any) => acc + (item.lineTotal || 0), 0);
  }, [activeChosenServices]);

  const effectiveBillingModel =
    viewMode === 'PREVIEW' && selectedProposal?.billing_model && !editingProposalId
      ? selectedProposal.billing_model
      : billingModel;

  const docClientName = (selectedProposal?.client_name || clientName || '').trim();
  const docClientAddress = (selectedProposal?.client_address || clientAddress || '').trim();
  const docRef = selectedProposal?.id || (editingProposalId ? editingProposalId : 'UNSAVED DRAFT');
  const isApproved = selectedProposal ? selectedProposal.status === 'APPROVED' : true;

  const validateBuilder = (): string[] => {
    const errors: string[] = [];
    if (clientName.trim().length < 3) errors.push('Client establishment name is required (minimum 3 characters).');
    if (clientAddress.trim().length < 5) errors.push('Premises address is required.');
    if (clientPhone && !isValidIndianMobile(clientPhone)) errors.push('Contact mobile must be a valid 10-digit Indian number.');
    if (activeChosenServices.length === 0) errors.push('Select at least one position with headcount greater than 0.');
    return errors;
  };

  const handleResetForm = () => {
    setEditingProposalId(null);
    setSelectedProposal(null);
    setSelectedAccountId('');
    setClientName('');
    setContactPerson('');
    setClientPhone('');
    setClientAddress('');
    setInspectedVisitDate('');
    setVisitTimeSlot('11:00 AM – 01:30 PM');
    setBuilderErrors([]);
    setEnabledPresets({ GUARD: true, SUPERVISOR: false, GUNMAN: false, HOUSEKEEPING: false });
    setCustomRoles([]);
    setFlatSubOptions({ addServiceCharge: true, addEpf: false, addEsic: false, addUniform: false });
    setActivePageTab('ALL');
    setViewMode('BUILDER');
  };

  const handleEditProposalScope = (prop: any) => {
    setEditingProposalId(prop.id);
    setSelectedProposal(prop);
    setClientName(prop.client_name || '');
    setClientAddress(prop.client_address || '');
    setClientPhone(prop.client_phone || '');
    setContactPerson(prop.contact_person || '');
    setProposalSubject(prop.proposal_subject || proposalSubject);
    setPaymentTermsDays(prop.payment_terms_days || 7);
    setValidityDays(prop.validity_days || 30);
    setBillingModel(prop.billing_model || 'COMPLIANCE');
    setServiceChargePercent(prop.service_charge_percent || 8);

    if (prop.flat_sub_options) {
      setFlatSubOptions(prop.flat_sub_options);
    }

    if (prop.visit_date) {
      setInspectedVisitDate(prop.visit_date);
    } else if (prop.created_at) {
      setInspectedVisitDate(new Date(prop.created_at).toISOString().split('T')[0]);
    }
    if (prop.visit_time_slot) setVisitTimeSlot(prop.visit_time_slot);

    if (Array.isArray(prop.service_items)) {
      const newEnabled = { GUARD: false, SUPERVISOR: false, GUNMAN: false, HOUSEKEEPING: false };
      const newCustom: CustomRoleItem[] = [];

      prop.service_items.forEach((s: any) => {
        if (s.role && ['GUARD', 'SUPERVISOR', 'GUNMAN', 'HOUSEKEEPING'].includes(s.role)) {
          newEnabled[s.role as keyof typeof newEnabled] = true;
          setPresetConfigs((prev) => ({
            ...prev,
            [s.role]: {
              ...prev[s.role],
              count: s.count ?? 1,
              shift: s.shift || '12_HOURS',
              customBasic: s.statutory?.basic || prev[s.role].customBasic,
              flatRate: s.flatBreakup?.baseRate || s.perHeadRate || prev[s.role].flatRate,
              uniformAllowance: s.statutory?.uniform || 250,
              relieverType: s.statutory?.reliever ? 'PERCENT' : 'NIL',
              relieverCustomValue: s.statutory?.reliever ? 16.67 : 0
            }
          }));
        } else {
          newCustom.push({
            id: s.id || `CUSTOM-${Date.now()}-${Math.random()}`,
            label: s.label || 'Custom Position',
            count: s.count ?? 1,
            shift: s.shift || '8_HOURS',
            customBasic: s.statutory?.basic || s.customConfig?.basic || 15000,
            flatRate: s.flatBreakup?.baseRate || s.perHeadRate || 15000,
            hasEpf: s.customConfig?.hasEpf ?? true,
            hasEsic: s.customConfig?.hasEsic ?? true,
            relieverType: s.customConfig?.relieverType || (s.statutory?.reliever ? 'PERCENT' : 'NIL'),
            relieverCustomValue: s.customConfig?.relieverCustomValue ?? (s.statutory?.reliever ? 16.67 : 0),
            uniformAllowance: s.statutory?.uniform || 250
          });
        }
      });

      setEnabledPresets(newEnabled);
      setCustomRoles(newCustom);
    }

    setViewMode('BUILDER');
  };

  const handleDeleteProposal = async (propId: string, clientTitle: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(`Permanently delete proposal "${propId}" for ${clientTitle}?`);
    if (!confirmed) return;

    setDeletingId(propId);
    try {
      const { error } = await supabase.from('proposals').delete().eq('id', propId);
      if (error) throw error;

      if (selectedProposal?.id === propId) {
        setSelectedProposal(null);
        setViewMode('BUILDER');
      }
      if (editingProposalId === propId) {
        setEditingProposalId(null);
      }

      setProposals((prev) => prev.filter((p) => p.id !== propId));
    } catch (err: any) {
      alert(`Could not delete proposal: ${err.message || 'Unknown database error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateBuilder();
    setBuilderErrors(errors);
    if (errors.length > 0) return;

    setSubmitting(true);
    const proposalId = editingProposalId || selectedProposal?.id || `PROP-${Date.now()}`;
    const cleanCompany = clientName.trim().toUpperCase();
    const cleanPhone = normaliseIndianMobile(clientPhone);

    const newProposal = {
      id: proposalId,
      visit_id: selectedAccountId?.startsWith('VISIT_') ? selectedAccountId.replace('VISIT_', '') : (selectedProposal?.visit_id || null),
      client_name: cleanCompany,
      client_address: clientAddress.trim(),
      client_phone: cleanPhone,
      contact_person: contactPerson.trim(),
      proposal_subject: proposalSubject.trim(),
      payment_terms_days: paymentTermsDays,
      validity_days: validityDays,
      billing_model: billingModel,
      flat_sub_options: billingModel === 'FLAT' ? flatSubOptions : null,
      service_charge_percent: serviceChargePercent,
      service_items: activeChosenServices,
      total_amount: totalMonthlyBilling,
      visit_date: inspectedVisitDate || null,
      visit_time_slot: visitTimeSlot || null,
      requested_by_id: selectedProposal?.requested_by_id || 'HQ-DIRECTOR',
      requested_by_name: selectedProposal?.requested_by_name || 'Anil Dhariwal (Director)',
      approved_by: 'Anil Dhariwal',
      approved_at: new Date().toISOString(),
      created_at: selectedProposal?.created_at || new Date().toISOString(),
      status: 'APPROVED'
    };

    const { error: propError } = await supabase.from('proposals').upsert(newProposal, { onConflict: 'id' });
    if (propError) {
      setSubmitting(false);
      alert(`Could not save proposal: ${propError.message}`);
      return;
    }

    try {
      const generatedClientId = 'CL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      await supabase.from('clients').upsert({
        id: generatedClientId,
        company_name: cleanCompany,
        contact_person: contactPerson.trim() || null,
        phone: cleanPhone || null,
        billing_address: clientAddress.trim() || null,
        status: 'ACTIVE',
        updated_at: new Date().toISOString()
      }, { onConflict: 'company_name' });
    } catch (clientErr) {
      console.warn('Auto-client note:', clientErr);
    }

    setSubmitting(false);
    setSelectedProposal(newProposal);
    setEditingProposalId(null);
    setActivePageTab('ALL');
    setViewMode('PREVIEW');
    loadData();
  };

  const handleApproveProposal = async (propToApprove?: any) => {
    const target = propToApprove || selectedProposal;
    if (!target) return;
    setApprovingId(target.id);

    const { error } = await supabase
      .from('proposals')
      .update({
        status: 'APPROVED',
        approved_by: company.directorName || 'Anil Dhariwal',
        approved_at: new Date().toISOString()
      })
      .eq('id', target.id);

    setApprovingId(null);
    if (error) {
      alert(`Approval error: ${error.message}`);
      return;
    }
    if (selectedProposal && selectedProposal.id === target.id) {
      setSelectedProposal({ ...selectedProposal, status: 'APPROVED' });
    }
    loadData();
  };

  const handleShareWhatsApp = () => {
    if (!selectedProposal && !clientName) return;
    const phone = normaliseIndianMobile(selectedProposal?.client_phone || clientPhone || '');
    if (!isValidIndianMobile(phone)) {
      alert('Client mobile number is invalid or missing.');
      return;
    }
    const formattedPhone = `91${phone}`;
    const client = selectedProposal?.client_name || clientName || 'Valued Client';

    const serviceSummary = activeChosenServices
      .map((s: any) => `• ${s.count}x ${s.label} (${s.shift === '12_HOURS' ? '12 Hrs' : '8 Hrs'}) @ ${formatINR(s.perHeadRate)}/mo`)
      .join('\n');

    const text =
      `*OFFICIAL SCHEDULE OF RATES & SERVICE PROPOSAL*\n` +
      `*${company.companyName}*\n\n` +
      `To: The Management, *${client}*\n` +
      `Proposal Reference: ${docRef} | Date: ${new Date().toLocaleDateString('en-GB')}\n\n` +
      `Subject: ${proposalSubject}\n\n` +
      `Allocated Deployments:\n${serviceSummary}\n\n` +
      `Total Monthly Consideration: ${formatINR(totalMonthlyBilling)}/- (Statutory GST Extra)\n\n` +
      `Regards,\nAnil Dhariwal\nManaging Director\nPhone: +91 9826259020`;

    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrintCoverLetter = () => {
    setPrintModeType('COVER_LETTER');
    printRequestedRef.current = true;
    setPrintPages(['COVER_LETTER' as any]);
  };

  const handlePrintDocket = (pageTarget: 'ALL' | 'RATE' | PageNo) => {
    setPrintModeType('DOCKET');
    const pages: PageNo[] = pageTarget === 'ALL' ? ALL_PAGES : [pageTarget === 'RATE' ? 2 : pageTarget];
    printRequestedRef.current = true;
    setPrintPages(pages);
  };

  const handleSyncLetterToClientVault = async () => {
    if (!docClientName) {
      alert('Please specify an establishment name first.');
      return;
    }

    setSavingToVault(true);
    try {
      const cleanClient = docClientName.toUpperCase().trim();
      const cleanRefId = (docRef || 'DRAFT').replace(/[^A-Za-z0-9_-]/g, '_');
      const deterministicDocId = `DOC-LTR-${cleanClient.replace(/[^A-Za-z0-9]/g, '_')}-${cleanRefId}`;
      const effectiveVisitDate = inspectedVisitDate || selectedProposal?.visit_date || new Date().toISOString().split('T')[0];
      const effectiveTimeSlot = visitTimeSlot || selectedProposal?.visit_time_slot || '11:00 AM – 01:30 PM';

      const cleanDocTitle = `Survey Letter - ${cleanClient}`;
      const cleanFileName = `Survey Letter - ${cleanClient}.pdf`;

      const docPayload = {
        id: deterministicDocId,
        client_name: cleanClient,
        doc_title: cleanDocTitle,
        doc_category: 'MISC',
        file_url: `/admin/quotations?client=${encodeURIComponent(cleanClient)}&docRef=${encodeURIComponent(docRef)}&visitDate=${encodeURIComponent(effectiveVisitDate)}&timeSlot=${encodeURIComponent(effectiveTimeSlot)}`,
        file_name: cleanFileName,
        file_size: `${effectiveVisitDate} • ${effectiveTimeSlot}`,
        file_type: 'SURVEY_LETTER',
        uploaded_by: 'Anil Dhariwal (Director)',
        uploaded_at: new Date().toISOString()
      };

      const activePropId = selectedProposal?.id || editingProposalId;
      if (activePropId) {
        await supabase
          .from('proposals')
          .update({
            visit_date: effectiveVisitDate,
            visit_time_slot: effectiveTimeSlot
          })
          .eq('id', activePropId);
      }

      const { error } = await supabase.from('client_documents').upsert(docPayload, { onConflict: 'id' });
      if (error) throw error;

      alert(`Official Survey Letter for "${cleanClient}" saved/updated in Document Vault!`);
    } catch (err: any) {
      alert(`Could not save letter to vault: ${err.message}`);
    } finally {
      setSavingToVault(false);
    }
  };

  useEffect(() => {
    if (viewMode !== 'PREVIEW') return;
    document.documentElement.classList.add(PRINT_MODE_CLASS);
    return () => document.documentElement.classList.remove(PRINT_MODE_CLASS);
  }, [viewMode]);

  useEffect(() => {
    if (!printPages || !printRequestedRef.current) return;
    printRequestedRef.current = false;

    let cancelled = false;
    const originalTitle = document.title;

    const restore = () => {
      document.title = originalTitle;
      setPrintPages(null);
    };

    const run = async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      if (cancelled) return;

      window.addEventListener('afterprint', restore, { once: true });
      document.title = printModeType === 'COVER_LETTER'
        ? `Survey Letter - ${docClientName || 'Client'}`
        : `Proposal - ${docClientName || 'Client'} - ${docRef}`;
      window.print();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [printPages, docClientName, docRef, printModeType]);

  const visiblePages: PageNo[] = activePageTab === 'ALL'
    ? ALL_PAGES
    : activePageTab === 'COVER_LETTER'
      ? ['COVER_LETTER' as any]
      : [activePageTab];
  const pagesInPrintRoot: PageNo[] = printPages ?? visiblePages;

  const filteredAccounts = useMemo(() => {
    if (sourceFilter === 'ALL') return accountList;
    return accountList.filter((a) => a.source === sourceFilter);
  }, [accountList, sourceFilter]);

  const pendingProposals = useMemo(() => proposals.filter((p) => p.status === 'PENDING_APPROVAL'), [proposals]);
  const approvedProposals = useMemo(() => proposals.filter((p) => p.status !== 'PENDING_APPROVAL'), [proposals]);

  return (
    <div className="w-full space-y-6 px-1 sm:px-2 pb-16 animate-in fade-in duration-200">
      <style>{PRINT_CSS}</style>

      {/* Top Command Bar */}
      <div className="print:hidden bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-red-700 uppercase tracking-wider flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft size={13} className="text-red-700" />
            <span>Central Command Desk</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Quotation &amp; Proposal Desk
            </h1>
            {editingProposalId && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-mono font-bold border border-blue-200">
                Editing #{editingProposalId}
              </span>
            )}
            {pendingProposals.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold animate-pulse">
                {pendingProposals.length} Pending Approval
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePrintCoverLetter}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Print 1-Page Survey Transmittal Letter directly"
          >
            <FileText size={14} className="text-amber-300" />
            <span>Print Cover Letter</span>
          </button>

          <button
            type="button"
            onClick={handleResetForm}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <PlusCircle size={14} className="text-amber-300" />
            <span>New Blank Quote</span>
          </button>

          <div className="bg-[#FBFBF9] p-1 rounded-2xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('BUILDER')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'BUILDER' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 size={13} />
              <span>Scope Builder</span>
            </button>
            <button
              onClick={() => setViewMode('PREVIEW')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'PREVIEW' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye size={13} />
              <span>A4 Print Docket</span>
            </button>
          </div>
        </div>
      </div>

      {/* BUILDER WORKSPACE */}
      {viewMode === 'BUILDER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-8 shadow-xs space-y-6">

            {/* Model Selector Bar */}
            <div className="p-4 rounded-2xl border bg-slate-50 border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2">
                    <Layers size={15} className="text-red-700" />
                    <span>Commercial Rate Model</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Switch between statutory compliance wage schedules or customizable flat contracts.
                  </p>
                </div>

                <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setBillingModel('COMPLIANCE')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                      billingModel === 'COMPLIANCE' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck size={13} className={billingModel === 'COMPLIANCE' ? 'text-amber-300' : 'text-slate-400'} />
                    <span>Statutory PSARA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingModel('FLAT')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition cursor-pointer flex items-center gap-1.5 ${
                      billingModel === 'FLAT' ? 'bg-red-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Percent size={13} />
                    <span>Flat Rate Options</span>
                  </button>
                </div>
              </div>

              {/* Sub-Options for Flat Rate[cite: 19] */}
              {billingModel === 'FLAT' && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-950 block">
                      Flat Rate Auto-Calculation Formula Options:
                    </span>
                    <span className="text-[10px] font-mono text-amber-900 font-bold">
                      Agency Margin: {serviceChargePercent}%
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                    <label className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                      flatSubOptions.addServiceCharge ? 'bg-white border-amber-400 text-slate-900 shadow-2xs' : 'bg-white/60 border-slate-200 text-slate-500'
                    }`}>
                      <input
                        type="checkbox"
                        checked={flatSubOptions.addServiceCharge}
                        onChange={(e) => setFlatSubOptions(prev => ({ ...prev, addServiceCharge: e.target.checked }))}
                        className="rounded text-red-700"
                      />
                      <span>+ Margin ({serviceChargePercent}%)</span>
                    </label>

                    <label className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                      flatSubOptions.addEpf ? 'bg-white border-amber-400 text-slate-900 shadow-2xs' : 'bg-white/60 border-slate-200 text-slate-500'
                    }`}>
                      <input
                        type="checkbox"
                        checked={flatSubOptions.addEpf}
                        onChange={(e) => setFlatSubOptions(prev => ({ ...prev, addEpf: e.target.checked }))}
                        className="rounded text-red-700"
                      />
                      <span>+ EPF (13%)</span>
                    </label>

                    <label className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                      flatSubOptions.addEsic ? 'bg-white border-amber-400 text-slate-900 shadow-2xs' : 'bg-white/60 border-slate-200 text-slate-500'
                    }`}>
                      <input
                        type="checkbox"
                        checked={flatSubOptions.addEsic}
                        onChange={(e) => setFlatSubOptions(prev => ({ ...prev, addEsic: e.target.checked }))}
                        className="rounded text-red-700"
                      />
                      <span>+ ESIC (3.25%)</span>
                    </label>

                    <label className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-2 ${
                      flatSubOptions.addUniform ? 'bg-white border-amber-400 text-slate-900 shadow-2xs' : 'bg-white/60 border-slate-200 text-slate-500'
                    }`}>
                      <input
                        type="checkbox"
                        checked={flatSubOptions.addUniform}
                        onChange={(e) => setFlatSubOptions(prev => ({ ...prev, addUniform: e.target.checked }))}
                        className="rounded text-red-700"
                      />
                      <span>+ Kit / Uniform</span>
                    </label>
                  </div>

                  {/* Formula Preview Helper */}
                  <div className="pt-1.5 border-t border-amber-200/80 flex items-center justify-between text-[10.5px] font-mono text-amber-900">
                    <span>Formula: <strong>Base Flat Rate</strong>
                      {flatSubOptions.addEpf ? ' + EPF (13%)' : ''}
                      {flatSubOptions.addEsic ? ' + ESIC (3.25%)' : ''}
                      {flatSubOptions.addUniform ? ' + Uniform' : ''}
                      {flatSubOptions.addServiceCharge ? ` + Margin (${serviceChargePercent}%)` : ''}
                    </span>
                    <span className="font-bold text-red-700">Auto-Evaluated</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProposal} className="space-y-5">
              {/* Account Dropdown */}
              <div className="space-y-2 bg-slate-50/70 p-4 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                    Auto-Fill From Client Directory or Field Inspection Visits
                  </label>
                  <div className="flex items-center gap-1">
                    {(['ALL', 'VISIT', 'CLIENT', 'LEAD'] as const).map((source) => (
                      <button
                        key={source}
                        type="button"
                        onClick={() => setSourceFilter(source)}
                        className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md transition ${
                          sourceFilter === source
                            ? 'bg-slate-900 text-white'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="absolute left-3.5 top-3 text-slate-400" size={15} />
                  <select
                    value={selectedAccountId}
                    onChange={(e) => handleAccountSelect(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-red-700 transition cursor-pointer"
                  >
                    <option value="">-- Choose client account, logged officer visit, or pipeline lead --</option>
                    {filteredAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        [{acc.source}] {acc.companyName} {acc.contactPerson ? `• ${acc.contactPerson}` : ''}{' '}
                        {acc.visitDate ? `(${acc.visitDate})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Establishment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Client Establishment Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. THE SANSKRITI SCHOOL"
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 uppercase outline-none focus:border-red-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Contact Person Met
                  </label>
                  <input
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="HR Head / Estate Manager"
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-red-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-red-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Premises Physical Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Bhopal Sahara Bypass road, MP"
                    className="w-full px-3.5 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-red-700"
                  />
                </div>
              </div>

              {/* Commercial Meta Fields */}
              <div className="p-4 bg-[#FBFBF9] border border-slate-200 rounded-2xl grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Inspection Visit Date
                  </label>
                  <input
                    type="date"
                    value={inspectedVisitDate}
                    onChange={(e) => setInspectedVisitDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Visit Time Slot
                  </label>
                  <select
                    value={visitTimeSlot}
                    onChange={(e) => setVisitTimeSlot(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="10:00 AM – 12:30 PM">10:00 AM – 12:30 PM (Morning)</option>
                    <option value="11:00 AM – 01:30 PM">11:00 AM – 01:30 PM (Standard)</option>
                    <option value="02:30 PM – 04:30 PM">02:30 PM – 04:30 PM (Afternoon)</option>
                    <option value="04:00 PM – 06:00 PM">04:00 PM – 06:00 PM (Evening)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Payment Terms
                  </label>
                  <select
                    value={paymentTermsDays}
                    onChange={(e) => setPaymentTermsDays(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value={7}>Within 7 Days (Standard)</option>
                    <option value={15}>Within 15 Days</option>
                    <option value={30}>Within 30 Days</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Quote Validity
                  </label>
                  <select
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value={15}>15 Days</option>
                    <option value={30}>30 Days (Standard)</option>
                    <option value={60}>60 Days</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1 pt-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                    Proposal Subject Heading
                  </label>
                  <input
                    value={proposalSubject}
                    onChange={(e) => setProposalSubject(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1 pt-1">
                  <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>Agency Margin (%)</span>
                    <div className="flex gap-1">
                      {[5, 8, 10, 12].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setServiceChargePercent(m)}
                          className={`text-[8.5px] px-1 rounded ${serviceChargePercent === m ? 'bg-red-700 text-white' : 'bg-slate-200 text-slate-700'}`}
                        >
                          {m}%
                        </button>
                      ))}
                    </div>
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={serviceChargePercent}
                    onChange={(e) => setServiceChargePercent(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 outline-none"
                  />
                </div>
              </div>

              {/* Standard Roles Matrix */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-900">
                  Standard Security &amp; Facility Personnel
                </h4>

                <div className="space-y-3">
                  {(Object.keys(liveServiceMatrix) as (keyof typeof liveServiceMatrix)[]).map((role) => {
                    const isChecked = enabledPresets[role];
                    const cfg = presetConfigs[role];
                    const meta = liveServiceMatrix[role];
                    const activeItem = activeChosenServices.find((x: any) => x.role === role);
                    const perHead = activeItem?.perHeadRate || (billingModel === 'COMPLIANCE' ? 15000 : cfg.flatRate);

                    return (
                      <div
                        key={role}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                          isChecked
                            ? 'bg-white border-red-700 shadow-xs ring-1 ring-red-700'
                            : 'bg-[#FBFBF9] border-slate-200 opacity-70'
                        }`}
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2.5 min-w-0">
                              <button
                                type="button"
                                onClick={() => {
                                  const enabling = !enabledPresets[role];
                                  setEnabledPresets((p) => ({ ...p, [role]: enabling }));
                                  if (enabling && (!presetConfigs[role].count || presetConfigs[role].count === 0)) {
                                    setPresetConfigs((p) => ({ ...p, [role]: { ...p[role], count: 1 } }));
                                  }
                                }}
                                className="text-red-700 shrink-0 mt-0.5 cursor-pointer"
                              >
                                {isChecked ? <CheckSquare size={20} /> : <Square size={20} className="text-slate-400" />}
                              </button>
                              <div className="min-w-0">
                                <span className="text-xs font-black uppercase text-slate-900 block truncate">
                                  {meta.label}
                                </span>
                                <span className="text-[10px] font-mono text-slate-500 block">
                                  {cfg.shift === '12_HOURS' ? '12 Hrs' : '08 Hrs'} &bull; {formatINR(perHead)}/head
                                </span>
                              </div>
                            </div>

                            {isChecked && (
                              <span className="text-xs font-mono font-black text-red-700 shrink-0 bg-red-50 border border-red-100 px-2.5 py-1 rounded-xl">
                                {formatINR(perHead * (parseInt(String(cfg.count || 0), 10) || 0))}
                              </span>
                            )}
                          </div>

                          {isChecked && (
                            <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-slate-100">
                              <div className="flex items-center space-x-1.5">
                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Shift:</label>
                                <select
                                  value={cfg.shift}
                                  onChange={(e) => {
                                    const newShift = e.target.value as ShiftType;
                                    const newFlat = newShift === '12_HOURS' ? meta.flat12 : meta.flat8;
                                    setPresetConfigs((p) => ({
                                      ...p,
                                      [role]: { ...p[role], shift: newShift, flatRate: newFlat }
                                    }));
                                  }}
                                  className="px-2 py-1 bg-[#FBFBF9] border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none cursor-pointer"
                                >
                                  <option value="12_HOURS">12-Hour</option>
                                  <option value="8_HOURS">8-Hour</option>
                                </select>
                              </div>

                              <div className="flex items-center space-x-1.5">
                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Posts:</label>
                                <input
                                  type="text"
                                  inputMode="numeric"
                                  value={cfg.count === 0 ? '' : cfg.count}
                                  onChange={(e) => {
                                    const rawVal = e.target.value.replace(/\D/g, '');
                                    setPresetConfigs((p) => ({
                                      ...p,
                                      [role]: { ...p[role], count: rawVal === '' ? '' : Math.min(MAX_POSTS_PER_ROLE, parseInt(rawVal, 10)) }
                                    }));
                                  }}
                                  onBlur={() => {
                                    if (cfg.count === '' || Number(cfg.count) <= 0) {
                                      setPresetConfigs((p) => ({ ...p, [role]: { ...p[role], count: 1 } }));
                                    }
                                  }}
                                  className="w-16 px-2 py-1 text-center font-mono font-bold text-xs bg-[#FBFBF9] border border-slate-200 rounded-lg outline-none focus:border-red-700"
                                  placeholder="1"
                                />
                              </div>

                              {billingModel === 'COMPLIANCE' ? (
                                <div className="flex items-center space-x-1.5">
                                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Base Wage (₹):</label>
                                  <input
                                    type="number"
                                    value={cfg.customBasic}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setPresetConfigs((p) => ({ ...p, [role]: { ...p[role], customBasic: val } }));
                                    }}
                                    className="w-24 px-2 py-1 font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg outline-none text-slate-900"
                                    placeholder="15000"
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center space-x-1.5">
                                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Flat Base (₹):</label>
                                  <input
                                    type="number"
                                    value={cfg.flatRate}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setPresetConfigs((p) => ({ ...p, [role]: { ...p[role], flatRate: val } }));
                                    }}
                                    className="w-24 px-2 py-1 font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg outline-none text-red-700"
                                    placeholder="15000"
                                  />
                                </div>
                              )}

                              <div className="flex items-center space-x-1.5">
                                <label className="text-[10px] font-mono font-bold text-slate-500 uppercase">Kit/Leaves (₹):</label>
                                <input
                                  type="number"
                                  value={cfg.uniformAllowance}
                                  onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setPresetConfigs((p) => ({ ...p, [role]: { ...p[role], uniformAllowance: val } }));
                                  }}
                                  className="w-16 px-2 py-1 font-mono font-bold text-xs bg-white border border-slate-300 rounded-lg outline-none text-slate-900"
                                  placeholder="250"
                                />
                              </div>
                            </div>
                          )}

                          {isChecked && billingModel === 'COMPLIANCE' && (
                            <div className="space-y-1.5 pt-2 border-t border-slate-100 bg-[#FBFBF9] p-3 rounded-xl">
                              <label className="text-[9.5px] font-bold text-slate-700 uppercase tracking-wider block">
                                Reliever Policy (Weekly Off)
                              </label>
                              <div className="flex flex-wrap items-center gap-2">
                                <select
                                  value={cfg.relieverType}
                                  onChange={(e) => {
                                    const type = e.target.value as RelieverType;
                                    setPresetConfigs((p) => ({
                                      ...p,
                                      [role]: {
                                        ...p[role],
                                        relieverType: type,
                                        relieverCustomValue: type === 'PERCENT' ? 16.67 : type === 'FIXED' ? 1500 : 0
                                      }
                                    }));
                                  }}
                                  className="flex-1 min-w-[140px] px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                                >
                                  <option value="PERCENT">Statutory % (16.67%)</option>
                                  <option value="FIXED">Fixed (₹ / Head)</option>
                                  <option value="NIL">Nil / Included (₹0)</option>
                                </select>
                                {cfg.relieverType !== 'NIL' && (
                                  <input
                                    type="number"
                                    value={cfg.relieverCustomValue}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      setPresetConfigs((p) => ({
                                        ...p,
                                        [role]: { ...p[role], relieverCustomValue: val }
                                      }));
                                    }}
                                    className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg font-mono text-xs font-bold text-slate-900 outline-none"
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Custom Positions Table */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-600" />
                      <span>Custom Ad-Hoc Positions (Peon, Driver, Escort, Lift Operator)</span>
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Configure custom daily wages, 8h/12h shifts, and individual compliance status.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomRole}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[10px] font-bold uppercase rounded-xl transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={12} className="text-amber-300" />
                    <span>Add Custom Position</span>
                  </button>
                </div>

                {customRoles.map((custom) => (
                  <div key={custom.id} className="p-4 rounded-2xl border border-amber-300 bg-amber-50/20 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          value={custom.label}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, label: val } : r)));
                          }}
                          placeholder="e.g. Peon / Office Attendant"
                          className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-900 outline-none uppercase"
                        />

                        <select
                          value={custom.shift}
                          onChange={(e) => {
                            const newShift = e.target.value as ShiftType;
                            setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, shift: newShift } : r)));
                          }}
                          className="px-2 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-slate-800"
                        >
                          <option value="8_HOURS">8-Hour Shift (1 Duty)</option>
                          <option value="12_HOURS">12-Hour Shift (1.5 Duty)</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-mono font-bold text-slate-600">Posts:</label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={custom.count === 0 ? '' : custom.count}
                            onChange={(e) => {
                              const rawVal = e.target.value.replace(/\D/g, '');
                              setCustomRoles((p) =>
                                p.map((r) =>
                                  r.id === custom.id
                                    ? { ...r, count: rawVal === '' ? '' : parseInt(rawVal, 10) }
                                    : r
                                )
                              );
                            }}
                            onBlur={() => {
                              if (custom.count === '' || Number(custom.count) <= 0) {
                                setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, count: 1 } : r)));
                              }
                            }}
                            className="w-16 px-2 py-1 text-center font-mono font-bold text-xs bg-white border border-amber-200 rounded-xl"
                            placeholder="1"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveCustomRole(custom.id)}
                        className="p-2 text-slate-400 hover:text-red-700 transition cursor-pointer"
                        title="Remove custom position"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-3 text-xs">
                      {billingModel === 'COMPLIANCE' ? (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                            <div>
                              <label className="block text-[9.5px] font-mono font-bold text-slate-500 uppercase mb-0.5">Custom Basic (₹/Mo)</label>
                              <input
                                type="number"
                                value={custom.customBasic}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, customBasic: val } : r)));
                                }}
                                className="w-full p-1.5 border border-slate-200 rounded-lg font-mono font-bold text-xs"
                              />
                            </div>

                            <div className="flex items-center gap-2 pt-3">
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={custom.hasEpf}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, hasEpf: checked } : r)));
                                  }}
                                  className="rounded text-red-700"
                                />
                                <span>EPF (13%)</span>
                              </label>
                            </div>

                            <div className="flex items-center gap-2 pt-3">
                              <label className="flex items-center gap-1 text-[11px] font-bold text-slate-700 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={custom.hasEsic}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, hasEsic: checked } : r)));
                                  }}
                                  className="rounded text-red-700"
                                />
                                <span>ESIC (3.25%)</span>
                              </label>
                            </div>

                            <div>
                              <span className="block text-[9px] font-mono text-slate-400 uppercase">Effective Rate</span>
                              <span className="font-mono font-bold text-red-700 text-sm">
                                {formatINR(
                                  (() => {
                                    const b = Number(custom.customBasic) || 15000;
                                    const epf = custom.hasEpf ? Math.round(b * 0.13) : 0;
                                    const esic = custom.hasEsic ? Math.round(b * 0.0325) : 0;
                                    const rel = custom.relieverType === 'PERCENT' ? Math.round(b * 0.1667) : custom.relieverType === 'FIXED' ? Number(custom.relieverCustomValue || 0) : 0;
                                    const u = Number(custom.uniformAllowance || 250);
                                    const sub = b + epf + esic + rel + u;
                                    const m = Math.round((sub * serviceChargePercent) / 100);
                                    return sub + m;
                                  })()
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="sm:col-span-4 flex items-center justify-between">
                          <div className="w-1/2">
                            <label className="block text-[9.5px] font-mono font-bold text-slate-500 uppercase mb-0.5">
                              Flat Base Rate (₹ / Head)
                            </label>
                            <input
                              type="number"
                              value={custom.flatRate}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setCustomRoles((p) => p.map((r) => (r.id === custom.id ? { ...r, flatRate: val } : r)));
                              }}
                              className="w-full p-1.5 border border-slate-200 rounded-lg font-mono font-bold text-xs text-red-700"
                            />
                          </div>
                          <div>
                            <span className="block text-[9px] font-mono text-slate-400 uppercase">Per Head Rate (with Options)</span>
                            <span className="font-mono font-bold text-slate-900 text-sm">
                              {formatINR(activeChosenServices.find((x: any) => x.id === custom.id)?.perHeadRate || custom.flatRate)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {builderErrors.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-1">
                  <p className="text-[10px] font-mono font-black uppercase text-red-800">Please correct errors:</p>
                  <ul className="list-disc pl-5 text-[11px] text-red-800">
                    {builderErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Total & Submit */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-900 block">
                    Total Consideration ({activeChosenServices.length} Roles Assigned)
                  </span>
                  <span className="text-2xl font-mono font-black text-slate-950 block">
                    {formatINR(totalMonthlyBilling)}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin text-amber-300" size={16} /> : <FileCheck2 size={16} />}
                  <span>{editingProposalId ? 'Overwrite & Save Proposal' : 'Save Proposal & Open Preview'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Proposals Registry Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-5">
            {pendingProposals.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-amber-600" />
                    <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                      Pending HQ Approvals ({pendingProposals.length})
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    ACTION REQUIRED
                  </span>
                </div>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {pendingProposals.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-2xl border border-amber-200 bg-amber-50/40 hover:bg-amber-50 transition space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-black text-xs text-slate-900 uppercase truncate">{p.client_name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleDeleteProposal(p.id, p.client_name, e)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                            title="Delete Proposal"
                          >
                            <Trash2 size={12} />
                          </button>
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-amber-100 text-amber-900 border border-amber-300">
                            PENDING
                          </span>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-600 font-mono">
                        By: <span className="font-semibold text-slate-800">{p.requested_by_name || 'Field Officer'}</span> • {formatINR(Number(p.total_amount))}/mo
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedProposal(p);
                            if (p.visit_date) {
                              setInspectedVisitDate(p.visit_date);
                            } else if (p.created_at) {
                              setInspectedVisitDate(new Date(p.created_at).toISOString().split('T')[0]);
                            }
                            if (p.visit_time_slot) setVisitTimeSlot(p.visit_time_slot);
                            setActivePageTab('ALL');
                            setViewMode('PREVIEW');
                          }}
                          className="text-red-700 font-bold hover:underline text-[11px] cursor-pointer"
                        >
                          Review &rarr;
                        </button>

                        <button
                          type="button"
                          disabled={approvingId === p.id}
                          onClick={() => handleApproveProposal(p)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold uppercase rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          {approvingId === p.id ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                          <span>Certify</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Certified Proposals ({approvedProposals.length})
                </h3>
                <span className="text-[9.5px] font-mono text-slate-400 font-bold">REGISTRY</span>
              </div>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {approvedProposals.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No certified proposals yet.</p>
                ) : (
                  approvedProposals.map((p: any) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedProposal(p);
                        if (p.visit_date) {
                          setInspectedVisitDate(p.visit_date);
                        } else if (p.created_at) {
                          setInspectedVisitDate(new Date(p.created_at).toISOString().split('T')[0]);
                        }
                        if (p.visit_time_slot) setVisitTimeSlot(p.visit_time_slot);
                        setActivePageTab('ALL');
                        setViewMode('PREVIEW');
                      }}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        selectedProposal?.id === p.id
                          ? 'border-red-700 bg-red-50/40 shadow-xs'
                          : 'border-slate-200 bg-[#FBFBF9] hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-black text-xs text-slate-900 uppercase truncate">{p.client_name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800">
                            CERTIFIED
                          </span>
                          <button
                            type="button"
                            disabled={deletingId === p.id}
                            onClick={(e) => handleDeleteProposal(p.id, p.client_name, e)}
                            className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Permanently Delete Proposal"
                          >
                            {deletingId === p.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-slate-100">
                        <span className="font-bold text-slate-900">{formatINR(Number(p.total_amount))}/mo</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProposalScope(p);
                            }}
                            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1"
                          >
                            <Edit3 size={11} />
                            <span>Edit</span>
                          </button>
                          <span className="text-red-700 font-bold hover:underline">View Docket &rarr;</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A4 PREVIEW (FULL 5-PAGE DOCKET + STANDALONE COVER LETTER) */}
      {viewMode === 'PREVIEW' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="print:hidden bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold text-slate-500">Docket Ref:</span>
                <span className="text-xs font-mono font-black text-slate-900">{docRef}</span>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isApproved ? 'Approved & Certified' : 'Awaiting Directorial Clearance'}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleEditProposalScope(selectedProposal)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 size={12} />
                  <span>Edit Scope &amp; Overwrite</span>
                </button>

                {selectedProposal && (
                  <button
                    type="button"
                    disabled={deletingId === selectedProposal.id}
                    onClick={() => handleDeleteProposal(selectedProposal.id, selectedProposal.client_name)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {deletingId === selectedProposal.id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                    <span>Delete Proposal</span>
                  </button>
                )}

                {!isApproved && selectedProposal && (
                  <button
                    type="button"
                    onClick={() => handleApproveProposal()}
                    disabled={approvingId === selectedProposal.id}
                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {approvingId === selectedProposal.id ? (
                      <Loader2 className="animate-spin" size={13} />
                    ) : (
                      <CheckCircle2 size={13} />
                    )}
                    <span>Authorize &amp; Certify Quote</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>

            {/* Navigation Strip */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-1 bg-[#FBFBF9] p-1 rounded-xl border border-slate-200 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActivePageTab('ALL')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    activePageTab === 'ALL' ? 'bg-red-700 text-white' : 'text-slate-600'
                  }`}
                >
                  Full 5-Page Docket
                </button>

                <button
                  type="button"
                  onClick={() => setActivePageTab('COVER_LETTER')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                    activePageTab === 'COVER_LETTER' ? 'bg-slate-900 text-white' : 'text-slate-600'
                  }`}
                >
                  <FileText size={12} className={activePageTab === 'COVER_LETTER' ? 'text-amber-300' : 'text-slate-400'} />
                  <span>Survey Cover Letter</span>
                </button>

                {ALL_PAGES.map((pNum) => (
                  <button
                    key={pNum}
                    type="button"
                    onClick={() => setActivePageTab(pNum)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      activePageTab === pNum ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Page {pNum}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handlePrintCoverLetter}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Print strictly the 1-Page Survey Transmittal Letter"
                >
                  <FileText size={13} className="text-amber-300" />
                  <span>Print Cover Letter</span>
                </button>

                <button
                  type="button"
                  disabled={savingToVault}
                  onClick={handleSyncLetterToClientVault}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  title="Save letter permanently to Client Document Vault"
                >
                  {savingToVault ? <Loader2 size={13} className="animate-spin" /> : <FileCheck2 size={13} />}
                  <span>Save Letter to Vault</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintDocket('RATE')}
                  className="px-3.5 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText size={13} className="text-amber-300" />
                  <span>Print Rate Sheet (Page 2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePrintDocket('ALL')}
                  className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer size={13} className="text-amber-300" />
                  <span>Print Full 5-Page PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* On-Screen Preview Area */}
          <div className="print:hidden w-full overflow-x-auto pb-4">
            <div className="w-[210mm] mx-auto flex flex-col gap-8">
              {activePageTab === 'COVER_LETTER' ? (
                <div className="rounded-2xl border border-slate-200 shadow-xl overflow-hidden bg-white">
                  <SurveyTransmittalLetter
                    company={company}
                    clientName={docClientName}
                    clientAddress={docClientAddress}
                    contactPerson={contactPerson}
                    clientPhone={clientPhone}
                    docRef={docRef}
                    docDate={new Date().toLocaleDateString('en-GB')}
                    visitDate={inspectedVisitDate || selectedProposal?.visit_date || ''}
                    visitTimeSlot={visitTimeSlot || selectedProposal?.visit_time_slot || '11:00 AM – 01:30 PM'}
                    proposalSubject={proposalSubject}
                    activeChosenServices={activeChosenServices}
                    totalMonthlyBilling={totalMonthlyBilling}
                    isApproved={isApproved}
                  />
                </div>
              ) : (
                visiblePages.map((pNum) => (
                  <QuotationDocket
                    key={pNum}
                    pageNo={pNum}
                    mode="screen"
                    company={company}
                    clientName={docClientName}
                    clientAddress={docClientAddress}
                    docRef={docRef}
                    docDate={new Date().toLocaleDateString('en-GB')}
                    proposalSubject={proposalSubject}
                    validityDays={validityDays}
                    paymentTermsDays={paymentTermsDays}
                    billingModel={effectiveBillingModel}
                    activeChosenServices={activeChosenServices}
                    totalMonthlyBilling={totalMonthlyBilling}
                    effectiveMarginPercent={serviceChargePercent}
                    isApproved={isApproved}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Vector Print Root */}
      {viewMode === 'PREVIEW' && typeof document !== 'undefined' && createPortal(
        <div id={PRINT_ROOT_ID} aria-hidden="true">
          {printModeType === 'COVER_LETTER' ? (
            <div className="vsf-sheet">
              <SurveyTransmittalLetter
                company={company}
                clientName={docClientName}
                clientAddress={docClientAddress}
                contactPerson={contactPerson}
                clientPhone={clientPhone}
                docRef={docRef}
                docDate={new Date().toLocaleDateString('en-GB')}
                visitDate={inspectedVisitDate || selectedProposal?.visit_date || ''}
                visitTimeSlot={visitTimeSlot || selectedProposal?.visit_time_slot || '11:00 AM – 01:30 PM'}
                proposalSubject={proposalSubject}
                activeChosenServices={activeChosenServices}
                totalMonthlyBilling={totalMonthlyBilling}
                isApproved={isApproved}
              />
            </div>
          ) : (
            pagesInPrintRoot.map((pNum) => (
              <QuotationDocket
                key={pNum}
                pageNo={pNum}
                mode="print"
                company={company}
                clientName={docClientName}
                clientAddress={docClientAddress}
                docRef={docRef}
                docDate={new Date().toLocaleDateString('en-GB')}
                proposalSubject={proposalSubject}
                validityDays={validityDays}
                paymentTermsDays={paymentTermsDays}
                billingModel={effectiveBillingModel}
                activeChosenServices={activeChosenServices}
                totalMonthlyBilling={totalMonthlyBilling}
                effectiveMarginPercent={serviceChargePercent}
                isApproved={isApproved}
              />
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
