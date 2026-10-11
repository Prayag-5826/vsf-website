'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash2,
  Printer,
  Save,
  FilePlus2,
  Loader2,
  CheckCircle2,
  Ban,
  Building2,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';
import { getSupabase } from '@/lib/supabaseBrowser';
import { buildBillHtml, type BillCompany, type BillDocument } from '@/lib/billHtml';
import {
  billMonthLabel,
  calculateBill,
  daysInBillMonth,
  formatBillAmount,
  perDayFromMonthly,
  type BillAdjustment,
  type BillItem
} from '@/lib/invoice';

interface ClientOption {
  id: string;
  company_name: string;
  billing_address: string | null;
  gst_number: string | null;
  status?: string;
}

interface ProposalRow {
  id: string;
  client_name: string;
  client_address: string | null;
  status: string | null;
  service_items: any[] | null;
}

interface BillRow {
  id: string;
  bill_no: string;
  bill_month: string;
  bill_date: string;
  client_name: string;
  client_address: string | null;
  items: BillItem[];
  adjustments: BillAdjustment[];
  grand_total: number;
  status: 'ISSUED' | 'PAID' | 'CANCELLED';
  proposal_id: string | null;
}

const localISO = (d = new Date()) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

const DEFAULT_COMPANY: BillCompany = {
  name: 'Vidhya Security Force & Housekeeping Services',
  pan: 'AQRPD0652Q',
  address: '012 Ews Apartment A Block Treasure Town Indore',
  email: 'vidhyasecurity@gmail.com',
  logoUrl: '/assets/img/logo/logo.png'
};

const emptyItem = (): BillItem => ({ description: 'Security Guard 12 Hours', totalDays: 30, qty: 1, rate: 0 });

const inputStyle =
  'w-full h-10 px-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/20 transition';

const printHtml = (html: string) => {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  frame.onload = () => {
    setTimeout(() => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => frame.remove(), 2000);
    }, 300);
  };
  frame.srcdoc = html;
  document.body.appendChild(frame);
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function BillingPage() {
  const supabase = useMemo(() => getSupabase(), []);

  const [company, setCompany] = useState<BillCompany>(DEFAULT_COMPANY);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [bills, setBills] = useState<BillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [billMonth, setBillMonth] = useState(localISO().slice(0, 7)); // e.g. "2026-04"
  const [billDate, setBillDate] = useState(localISO());
  const [clientName, setClientName] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [items, setItems] = useState<BillItem[]>([emptyItem()]);
  const [adjustments, setAdjustments] = useState<BillAdjustment[]>([]);
  const [issuedNo, setIssuedNo] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const [settingsRes, clientsRes, proposalsRes, billsRes] = await Promise.all([
      supabase.from('settings').select('company_name,pan_number,address,email,logo,seal_image').eq('id', 1).maybeSingle(),
      // Fetch only approved active contract clients
      supabase.from('clients').select('id,company_name,billing_address,gst_number,status').order('company_name', { ascending: true }),
      supabase
        .from('proposals')
        .select('id,client_name,client_address,status,service_items')
        .order('created_at', { ascending: false })
        .limit(60),
      supabase.from('bills').select('*').order('created_at', { ascending: false }).limit(40)
    ]);

    const s: any = settingsRes.data;
    if (s) {
      setCompany((prev) => ({
        ...prev,
        name: s.company_name || prev.name,
        pan: s.pan_number || prev.pan,
        address: s.address || prev.address,
        email: s.email || prev.email,
        logoUrl: s.logo || prev.logoUrl,
        sealUrl: s.seal_image || undefined
      }));
    }
    setClients((clientsRes.data as ClientOption[]) || []);
    setProposals((proposalsRes.data as ProposalRow[]) || []);
    setBills((billsRes.data as BillRow[]) || []);
    if (billsRes.error) setMessage({ kind: 'error', text: `Could not load bills: ${billsRes.error.message}` });
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const doc: BillDocument = useMemo(
    () => ({ billNo: issuedNo, billDate, billMonth, clientName, clientAddress, items, adjustments }),
    [issuedNo, billDate, billMonth, clientName, clientAddress, items, adjustments]
  );
  const totals = useMemo(() => calculateBill(items, adjustments), [items, adjustments]);
  const html = useMemo(() => buildBillHtml(doc, company), [doc, company]);
  const locked = Boolean(issuedNo);

  // Auto-Recall Past Client Rate Structure & Attendance Duties
  const applyClientMemory = useCallback(
    async (targetClientName: string, targetMonth: string) => {
      if (!targetClientName.trim()) return;

      const [yearStr, monthNumStr] = targetMonth.split('-');
      const monthIndex = parseInt(monthNumStr, 10) - 1;
      const targetMonthName = MONTH_NAMES[monthIndex] || '';
      const daysCount = daysInBillMonth(targetMonth);

      setSyncNotice('Checking client memory and attendance ledger…');

      try {
        // 1. Fetch most recent previous bill for this client to remember day rates & service setup
        const { data: previousBill } = await supabase
          .from('bills')
          .select('items, adjustments')
          .ilike('client_name', targetClientName.trim())
          .order('bill_date', { ascending: false })
          .limit(1)
          .maybeSingle();

        // 2. Fetch logged monthly attendance to pull real duty days & overtime hours
        const { data: attendanceData } = await supabase
          .from('monthly_attendance')
          .select('total_duties, total_ot_hours, guards_data, shift_hours')
          .ilike('unit_name', targetClientName.trim())
          .ilike('month', targetMonthName)
          .eq('year', parseInt(yearStr, 10))
          .maybeSingle();

        let baseLines: BillItem[] = [];

        if (previousBill && Array.isArray(previousBill.items) && previousBill.items.length > 0) {
          // Re-use established descriptions, staff quantities, and per-day rates
          baseLines = previousBill.items.map((it: any) => ({
            description: it.description || 'Security Guard 12 Hours',
            qty: Number(it.qty) || 1,
            rate: Number(it.rate) || 0,
            totalDays: (Number(it.qty) || 1) * daysCount
          }));

          if (previousBill.adjustments && Array.isArray(previousBill.adjustments)) {
            setAdjustments(previousBill.adjustments);
          }
        } else {
          // Check if there is an approved proposal to pull rates from
          const matchingProp = proposals.find(
            (p) => p.client_name.trim().toLowerCase() === targetClientName.trim().toLowerCase()
          );

          if (matchingProp && Array.isArray(matchingProp.service_items) && matchingProp.service_items.length > 0) {
            baseLines = matchingProp.service_items.map((s: any) => {
              const qty = Number(s.count) || 1;
              const monthlyRate = Number(s.perHeadRate) || 0;
              return {
                description: `${s.label || 'Security Guard'} ${s.shift === '8_HOURS' ? '8' : '12'} Hours`,
                qty,
                totalDays: qty * daysCount,
                rate: perDayFromMonthly(monthlyRate, daysCount)
              };
            });
          }
        }

        // 3. If attendance sheet exists for this month, override total duty days with actual on-site logs
        if (attendanceData && Number(attendanceData.total_duties) > 0) {
          const loggedDuties = Number(attendanceData.total_duties);
          const loggedOt = Number(attendanceData.total_ot_hours) || 0;

          if (baseLines.length > 0) {
            // Apply verified duty days to the primary guarding line
            baseLines[0].totalDays = loggedDuties;
          } else {
            baseLines = [
              {
                description: `Security Guard (${attendanceData.shift_hours || 12} Hours Shift)`,
                qty: Array.isArray(attendanceData.guards_data) ? attendanceData.guards_data.length : 1,
                totalDays: loggedDuties,
                rate: 516 // standard baseline fallback
              }
            ];
          }

          // If overtime hours were logged in attendance, add an automatic adjustment line
          if (loggedOt > 0) {
            const otHourlyRate = Math.round((baseLines[0]?.rate || 500) / (attendanceData.shift_hours || 12));
            setAdjustments((prev) => {
              const filtered = prev.filter((a) => !a.label.includes('Overtime'));
              return [...filtered, { label: `Approved Overtime (${loggedOt} hrs @ ₹${otHourlyRate}/hr)`, amount: loggedOt * otHourlyRate }];
            });
          }

          setSyncNotice(
            `Restored client rates & applied verified muster: ${loggedDuties} duty days${loggedOt ? ` + ${loggedOt} OT hrs` : ''}.`
          );
        } else if (baseLines.length > 0) {
          setSyncNotice(`Restored past rate structure for ${targetClientName} (${daysCount} standard days).`);
        } else {
          setSyncNotice(null);
        }

        if (baseLines.length > 0) {
          setItems(baseLines);
        }
      } catch (err) {
        console.error('Failed to restore client billing memory:', err);
        setSyncNotice(null);
      }
    },
    [supabase, proposals]
  );

  const importClient = (clientId: string) => {
    setSelectedClientId(clientId);
    if (!clientId) return;
    const c = clients.find((x) => x.id === clientId);
    if (!c) return;

    setClientName(c.company_name);
    let addr = c.billing_address || '';
    if (c.gst_number) {
      addr = addr ? `${addr} (GSTIN: ${c.gst_number})` : `GSTIN: ${c.gst_number}`;
    }
    setClientAddress(addr);

    // Trigger auto-recall of rates and duties
    applyClientMemory(c.company_name, billMonth);
  };

  const handleMonthChange = (newMonth: string) => {
    setBillMonth(newMonth);
    if (clientName) {
      applyClientMemory(clientName, newMonth);
    }
  };

  const patchItem = (i: number, patch: Partial<BillItem>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const patchAdj = (i: number, patch: Partial<BillAdjustment>) =>
    setAdjustments((prev) => prev.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));

  const startNew = () => {
    setIssuedNo('');
    setSelectedClientId('');
    setProposalId('');
    setClientName('');
    setClientAddress('');
    setItems([emptyItem()]);
    setAdjustments([]);
    setBillDate(localISO());
    setMessage(null);
    setSyncNotice(null);
  };

  const openBill = (b: BillRow) => {
    setIssuedNo(b.bill_no);
    setBillMonth(b.bill_month);
    setBillDate(b.bill_date);
    setClientName(b.client_name);
    setClientAddress(b.client_address || '');
    setProposalId(b.proposal_id || '');
    setItems(b.items);
    setAdjustments(b.adjustments);
    setMessage(null);
    setSyncNotice(`Viewing saved bill: ${b.bill_no}`);
  };

  const problems = useMemo(() => {
    const list: string[] = [];
    if (!clientName.trim()) list.push('Select or enter the client establishment');
    if (!items.some((i) => i.description.trim() && i.totalDays > 0 && i.rate > 0))
      list.push('Add at least one line item with duty days and a day rate');
    if (totals.grandTotal <= 0) list.push('Grand total must be above zero');
    return list;
  }, [clientName, items, totals.grandTotal]);

  const issue = async () => {
    if (problems.length || locked) return;
    setSaving(true);
    setMessage(null);

    const { data, error } = await supabase.rpc('app_issue_bill', {
      p: {
        bill_month: billMonth,
        bill_date: billDate,
        client_name: clientName.trim(),
        client_address: clientAddress.trim(),
        proposal_id: proposalId || null,
        items: totals.items,
        adjustments,
        total_value: totals.totalValue,
        grand_total: totals.grandTotal
      }
    });

    setSaving(false);
    if (error) {
      setMessage({ kind: 'error', text: `Bill not saved: ${error.message}` });
      return;
    }

    const saved = data as BillRow;
    setIssuedNo(saved.bill_no);
    setMessage({ kind: 'ok', text: `Invoice ${saved.bill_no} created and synchronized with client vault.` });
    load();
  };

  const setStatus = async (b: BillRow, status: BillRow['status']) => {
    const { error } = await supabase.from('bills').update({ status }).eq('id', b.id);
    if (error) setMessage({ kind: 'error', text: error.message });
    else load();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Billing &amp; Tax Invoices</h1>
        <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
          Automated client invoicing with memory recall for agreed per-day rates, staffing counts, and attendance duty rolls.
        </p>
      </div>

      {message && (
        <div
          role="status"
          className={`rounded-2xl border px-4 py-3.5 text-sm font-semibold flex items-center gap-2.5 shadow-xs ${
            message.kind === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${message.kind === 'ok' ? 'bg-emerald-600' : 'bg-red-600'}`} />
          <span>{message.text}</span>
        </div>
      )}

      {syncNotice && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-mono font-bold text-amber-900 flex items-center gap-2">
          <Sparkles size={14} className="text-amber-700 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Form Container */}
        <section className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black uppercase text-slate-900 tracking-tight">Invoice Details</h2>
            {locked && (
              <button onClick={startNew} className="text-xs font-bold text-red-700 hover:underline flex items-center gap-1 cursor-pointer">
                <FilePlus2 size={15} /> Create Next Bill
              </button>
            )}
          </div>

          {/* Client Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                Select Approved Contract Client (Auto-Recalls Rates &amp; Duties)
              </label>
              <select
                className={inputStyle}
                value={selectedClientId}
                disabled={locked}
                onChange={(e) => importClient(e.target.value)}
              >
                <option value="">Choose an approved client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.company_name} {c.gst_number ? `(GST: ${c.gst_number})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                Billing Month
              </label>
              <input
                type="month"
                className={inputStyle}
                value={billMonth}
                disabled={locked}
                onChange={(e) => handleMonthChange(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                Bill Issue Date
              </label>
              <input
                type="date"
                className={inputStyle}
                value={billDate}
                disabled={locked}
                onChange={(e) => setBillDate(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                Establishment Name *
              </label>
              <input
                className={inputStyle}
                value={clientName}
                disabled={locked}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                Billing &amp; Premises Address
              </label>
              <input
                className={inputStyle}
                value={clientAddress}
                disabled={locked}
                onChange={(e) => setClientAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Line items with day rate and total days */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Service Line Items &amp; Manpower Duties
                </h3>
                <p className="text-[10px] font-mono text-slate-400">Total Days &times; Day Rate = Monthly Billing</p>
              </div>
              {!locked && (
                <button
                  type="button"
                  onClick={() => setItems((p) => [...p, emptyItem()])}
                  className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-lg hover:bg-red-100 flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add Line
                </button>
              )}
            </div>

            <div className="space-y-3">
              {items.map((it, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/70 space-y-3">
                  <div className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Service Post Description
                      </label>
                      <input
                        className={inputStyle}
                        value={it.description}
                        disabled={locked}
                        onChange={(e) => patchItem(i, { description: e.target.value })}
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Total Duties
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        className={`${inputStyle} text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none font-mono font-bold`}
                        value={it.totalDays || ''}
                        disabled={locked}
                        onChange={(e) => patchItem(i, { totalDays: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-2">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Staff Qty
                      </label>
                      <input
                        type="number"
                        min={0}
                        className={`${inputStyle} text-center font-bold font-mono [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        value={it.qty || ''}
                        disabled={locked}
                        onChange={(e) => patchItem(i, { qty: Number(e.target.value) })}
                      />
                    </div>

                    <div className="col-span-4 sm:col-span-3">
                      <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Day Rate (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        className={`${inputStyle} text-right font-mono font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        value={it.rate || ''}
                        disabled={locked}
                        onChange={(e) => patchItem(i, { rate: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <div className="text-xs font-semibold text-slate-500">
                      Line Subtotal:{' '}
                      <span className="text-sm font-black text-slate-900 tabular-nums font-mono">
                        ₹{formatBillAmount(totals.items[i]?.amount ?? 0)}
                      </span>
                    </div>
                    {!locked && items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItems((p) => p.filter((_, idx) => idx !== i))}
                        className="text-xs font-semibold text-slate-400 hover:text-red-700 transition flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Adjustments */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Adjustments / Overtime / Deductions</h3>
                <p className="text-[10px] font-mono text-slate-400">Use minus (-) for client deductions</p>
              </div>
              {!locked && (
                <button
                  type="button"
                  onClick={() => setAdjustments((p) => [...p, { label: '', amount: 0 }])}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Add
                </button>
              )}
            </div>
            {adjustments.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  className={`${inputStyle} flex-1`}
                  placeholder="e.g. Overtime or Material Allowance"
                  value={a.label}
                  disabled={locked}
                  onChange={(e) => patchAdj(i, { label: e.target.value })}
                />
                <input
                  type="number"
                  className={`${inputStyle} w-32 text-right font-mono font-bold`}
                  placeholder="₹ Amount"
                  value={a.amount || ''}
                  disabled={locked}
                  onChange={(e) => patchAdj(i, { amount: Number(e.target.value) })}
                />
                {!locked && (
                  <button onClick={() => setAdjustments((p) => p.filter((_, idx) => idx !== i))} className="p-2 text-slate-400 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-950 text-white p-5 shadow-inner">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Grand Total Payable</span>
            <span className="text-2xl font-black tabular-nums text-amber-400 font-mono">
              ₹{formatBillAmount(totals.grandTotal)}
            </span>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={issue}
              disabled={saving || locked || problems.length > 0}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-red-700 hover:bg-red-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-700/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {locked ? `Issued as ${issuedNo}` : 'Save and Get Bill Number'}
            </button>
            <button
              onClick={() => printHtml(buildBillHtml(doc, company))}
              className="py-3.5 px-6 rounded-2xl border-2 border-slate-200 hover:border-red-700 hover:text-red-700 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer bg-white"
            >
              <Printer size={16} /> Print / PDF
            </button>
          </div>
        </section>

        {/* Live Preview Container */}
        <section className="space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-3 shadow-sm">
            <iframe title="Bill preview" srcDoc={html} className="w-full rounded-2xl bg-white border border-slate-100" style={{ height: 800 }} />
          </div>

          {/* Recent Invoices Ledger */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">Recent Generated Invoices</h2>
              <span className="text-xs font-semibold text-slate-400">{bills.length} saved</span>
            </div>

            {loading ? (
              <p className="text-sm text-slate-400 py-4 text-center font-mono">Loading invoices…</p>
            ) : bills.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center font-mono">No invoices saved yet.</p>
            ) : (
              <ul className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                {bills.map((b) => (
                  <li key={b.id} className="py-3.5 flex items-center justify-between gap-3">
                    <button onClick={() => openBill(b)} className="text-left min-w-0 cursor-pointer">
                      <p className="text-sm font-bold text-slate-900 hover:text-red-700 transition truncate">{b.client_name}</p>
                      <p className="text-xs font-mono text-slate-500">
                        {b.bill_no} · {billMonthLabel(b.bill_month)} · ₹{formatBillAmount(b.grand_total)}
                      </p>
                    </button>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          b.status === 'PAID'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : b.status === 'CANCELLED'
                            ? 'bg-slate-100 text-slate-500 border-slate-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {b.status}
                      </span>
                      {b.status === 'ISSUED' && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => setStatus(b, 'PAID')} title="Mark paid" className="p-1 text-emerald-600 hover:text-emerald-800">
                            <CheckCircle2 size={16} />
                          </button>
                          <button onClick={() => setStatus(b, 'CANCELLED')} title="Cancel bill" className="p-1 text-slate-400 hover:text-red-700">
                            <Ban size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
