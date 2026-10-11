'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Printer,
  Save,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Building2,
  Calendar,
  RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabaseBrowser';

interface GuardRow {
  id: string;
  name: string;
  role: string;
  days: Record<number, string>;
}

interface ParsedDay {
  duty: number;
  otHours: number;
}

const parseAttendanceCode = (raw: string): ParsedDay => {
  const code = (raw || '').trim().toUpperCase();
  if (!code || code === 'A' || code === 'AB') return { duty: 0, otHours: 0 };
  if (code === 'WO' || code === 'W/O') return { duty: 1, otHours: 0 };
  if (code === '1/2' || code === 'HD' || code === '0.5') return { duty: 0.5, otHours: 0 };
  if (code === '2' || code === 'DP') return { duty: 2, otHours: 0 };

  const otMatch = code.match(/^P[/+\s]?(\d+(\.\d+)?)$/);
  if (otMatch) {
    const hours = parseFloat(otMatch[1]) || 0;
    return { duty: 1, otHours: hours };
  }

  const hdOtMatch = code.match(/^(?:1\/2|HD)[/+\s]?(\d+(\.\d+)?)$/);
  if (hdOtMatch) {
    const hours = parseFloat(hdOtMatch[1]) || 0;
    return { duty: 0.5, otHours: hours };
  }

  if (code === 'P') return { duty: 1, otHours: 0 };
  return { duty: 0, otHours: 0 };
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface ClientOption {
  id: string;
  company_name: string;
  status: string;
}

export default function AttendanceMusterPage() {
  const supabase = useMemo(() => getSupabase(), []);

  // Approved Clients State
  const [approvedClients, setApprovedClients] = useState<ClientOption[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [unitName, setUnitName] = useState<string>('');

  const [selectedMonth, setSelectedMonth] = useState('April');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [shiftHours, setShiftHours] = useState<12 | 8>(12);
  const [musterNotes, setMusterNotes] = useState('');

  const [guards, setGuards] = useState<GuardRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [dataLoadedNotice, setDataLoadedNotice] = useState<string | null>(null);

  const totalDaysInMonth = useMemo(() => {
    const monthIndex = MONTH_NAMES.indexOf(selectedMonth);
    return new Date(selectedYear, monthIndex + 1, 0).getDate();
  }, [selectedMonth, selectedYear]);

  // 1. Fetch only ACTIVE approved contract clients from the clients table
  useEffect(() => {
    const fetchApprovedClients = async () => {
      const { data, error } = await supabase
        .from('clients')
        .select('id, company_name, status')
        .eq('status', 'ACTIVE')
        .order('company_name', { ascending: true });

      if (!error && data && data.length > 0) {
        setApprovedClients(data);
        // Default to first active client
        setSelectedClientId(data[0].id);
        setUnitName(data[0].company_name);
      }
    };
    fetchApprovedClients();
  }, [supabase]);

  // 2. Auto-load existing attendance for this specific client and month
  const loadMonthAttendance = useCallback(async (cId: string, uName: string, month: string, year: number) => {
    if (!cId && !uName) return;
    setLoadingData(true);
    setDataLoadedNotice(null);

    try {
      const recordId = `ATT-${uName.replace(/[^A-Za-z0-9]/g, '_')}-${month.toUpperCase()}-${year}`;

      const { data, error } = await supabase
        .from('monthly_attendance')
        .select('*')
        .or(`id.eq.${recordId},and(client_id.eq.${cId},month.ilike.${month},year.eq.${year})`)
        .maybeSingle();

      if (!error && data && Array.isArray(data.guards_data) && data.guards_data.length > 0) {
        // Saved attendance found for this month: restore exactly
        setGuards(data.guards_data);
        setShiftHours(data.shift_hours === 8 ? 8 : 12);
        setMusterNotes(data.notes || '');
        setDataLoadedNotice(`Loaded saved record for ${month} ${year} (${data.guards_data.length} personnel).`);
      } else {
        // No attendance saved for this month yet: check if previous month had guards to copy names
        const { data: prevData } = await supabase
          .from('monthly_attendance')
          .select('guards_data')
          .eq('client_id', cId)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const daysInMonth = new Date(year, MONTH_NAMES.indexOf(month) + 1, 0).getDate();
        const freshDays: Record<number, string> = {};
        for (let i = 1; i <= daysInMonth; i++) freshDays[i] = 'P';

        if (prevData && Array.isArray(prevData.guards_data) && prevData.guards_data.length > 0) {
          // Carry over guard names from previous roster with clean present duties
          setGuards(
            prevData.guards_data.map((g: any, idx: number) => ({
              id: g.id || `g_${idx + 1}`,
              name: g.name || `Security Guard ${idx + 1}`,
              role: g.role || 'Security Guard',
              days: freshDays
            }))
          );
          setDataLoadedNotice(`Roster initialized using personnel from previous records.`);
        } else {
          // Fresh starter template
          setGuards([
            { id: 'g1', name: 'Naresh Agrawal Guard', role: 'Security Guard', days: freshDays },
            { id: 'g2', name: 'Laxminarayan Guard', role: 'Security Guard', days: freshDays },
            { id: 'g3', name: 'Prahlad Guard', role: 'Security Guard', days: freshDays },
            { id: 'g4', name: 'Santosh Guard', role: 'Security Guard', days: freshDays }
          ]);
          setDataLoadedNotice(`New attendance roster initialized for ${month} ${year}.`);
        }
        setMusterNotes('');
      }
    } catch (err) {
      console.error('Error fetching monthly attendance:', err);
    } finally {
      setLoadingData(false);
    }
  }, [supabase]);

  // Trigger loading whenever client, month, or year changes
  useEffect(() => {
    if (selectedClientId && unitName) {
      loadMonthAttendance(selectedClientId, unitName, selectedMonth, selectedYear);
    }
  }, [selectedClientId, unitName, selectedMonth, selectedYear, loadMonthAttendance]);

  const handleClientSelectChange = (clientId: string) => {
    setSelectedClientId(clientId);
    const hit = approvedClients.find((c) => c.id === clientId);
    if (hit) {
      setUnitName(hit.company_name);
    }
  };

  const handleCellChange = (guardId: string, day: number, value: string) => {
    setGuards((prev) =>
      prev.map((g) => {
        if (g.id !== guardId) return g;
        return { ...g, days: { ...g.days, [day]: value } };
      })
    );
  };

  const handleAddGuard = () => {
    const newId = `g_${Date.now()}`;
    const initialDays: Record<number, string> = {};
    for (let i = 1; i <= totalDaysInMonth; i++) initialDays[i] = 'P';
    setGuards((prev) => [
      ...prev,
      {
        id: newId,
        name: `Security Guard ${prev.length + 1}`,
        role: 'Security Guard',
        days: initialDays
      }
    ]);
  };

  const handleRemoveGuard = (id: string) => {
    if (guards.length <= 1) return;
    setGuards((prev) => prev.filter((g) => g.id !== id));
  };

  const guardCalculations = useMemo(() => {
    return guards.map((g) => {
      let dutySum = 0;
      let otSum = 0;
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const val = g.days[day] || '';
        const parsed = parseAttendanceCode(val);
        dutySum += parsed.duty;
        otSum += parsed.otHours;
      }
      return { id: g.id, totalDuty: dutySum, totalOt: otSum };
    });
  }, [guards, totalDaysInMonth]);

  const grandTotalDuties = useMemo(() => {
    return guardCalculations.reduce((acc, c) => acc + c.totalDuty, 0);
  }, [guardCalculations]);

  const grandTotalOtHours = useMemo(() => {
    return guardCalculations.reduce((acc, c) => acc + c.totalOt, 0);
  }, [guardCalculations]);

  const handleSaveAttendance = async () => {
    if (!unitName.trim()) {
      alert('Please select an active client establishment first.');
      return;
    }

    setSaving(true);
    setSuccessNotice(false);

    const cleanUnit = unitName.trim().toUpperCase();
    const safeClientId = selectedClientId || `CL-${cleanUnit.replace(/[^A-Za-z0-9]/g, '_').slice(0, 15)}`;
    const recordId = `ATT-${cleanUnit.replace(/[^A-Za-z0-9]/g, '_')}-${selectedMonth.toUpperCase()}-${selectedYear}`;

    const payload = {
      id: recordId,
      client_id: safeClientId,
      unit_name: cleanUnit,
      month: selectedMonth,
      year: selectedYear,
      shift_hours: shiftHours,
      guards_data: guards,
      total_duties: grandTotalDuties,
      total_ot_hours: grandTotalOtHours,
      notes: musterNotes.trim(),
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('monthly_attendance').upsert(payload);

    if (error) {
      setSaving(false);
      alert(`Could not save attendance: ${error.message}`);
      return;
    }

    // Automatically sync into client_documents under the monthly folder
    try {
      const monthFolderTag = `${selectedMonth.slice(0, 3).toUpperCase()}-${selectedYear}`;
      const docPayload = {
        id: `DOC-ATT-${Date.now()}`,
        client_id: safeClientId,
        client_name: cleanUnit,
        doc_title: `Attendance Muster (${shiftHours}h Shift - ${guards.length} Guards) [${monthFolderTag}]`,
        doc_category: 'ATTENDANCE_MUSTER',
        file_url: `/admin/attendance?unit=${encodeURIComponent(cleanUnit)}&month=${selectedMonth}&year=${selectedYear}`,
        file_name: `Muster_${cleanUnit}_${monthFolderTag}.json`,
        file_size: `${grandTotalDuties} Duties | ${grandTotalOtHours} OT hrs`,
        file_type: 'MUSTER_ROLL',
        uploaded_by: 'Muster Desk',
        uploaded_at: new Date().toISOString()
      };
      await supabase.from('client_documents').upsert(docPayload);
    } catch (docErr) {
      console.warn('Vault auto-folder note:', docErr);
    }

    setSaving(false);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-5 pb-16 px-1 sm:px-2 animate-in fade-in duration-200">
      <style>{`
        @page {
          size: A4 landscape;
          margin: 8mm 6mm;
        }

        @media print {
          html, body {
            background: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #print-muster-area, #print-muster-area * {
            visibility: visible;
          }

          #print-muster-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }

          .no-print {
            display: none !important;
          }

          textarea.notes-print {
            border: none !important;
            resize: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Top Operations Action Bar */}
      <div className="no-print bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="text-[10px] font-mono font-bold text-slate-400 hover:text-red-700 uppercase tracking-wider flex items-center gap-1 mb-1 transition"
          >
            <ArrowLeft size={13} className="text-red-700" />
            <span>Central Operations Desk</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Monthly Guard Attendance &amp; Overtime Muster Roll
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Active Client Deployment Ledger. Enter <span className="font-mono font-bold text-slate-800">P</span> (Present), <span className="font-mono font-bold text-slate-800">P/3</span> (Present + 3h OT), <span className="font-mono font-bold text-slate-800">1/2</span> (Half Day), <span className="font-mono font-bold text-slate-800">A</span> (Absent), <span className="font-mono font-bold text-slate-800">WO</span> (Weekly Off).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleAddGuard}
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus size={14} className="text-amber-300" />
            <span>Add Guard Post</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving || loadingData}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin text-amber-300" /> : <Save size={14} className="text-amber-300" />}
            <span>Save Ledger &amp; Sync to Client Vault</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer size={14} className="text-amber-300" />
            <span>Print Landscape Muster</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="no-print p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold rounded-2xl flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700 shrink-0" />
          <span>Attendance muster saved and synced to the Client Directory under the <strong>{selectedMonth.toUpperCase()} {selectedYear}</strong> billing folder.</span>
        </div>
      )}

      {dataLoadedNotice && !successNotice && (
        <div className="no-print p-2.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold rounded-xl flex items-center gap-2">
          <Calendar size={14} className="text-slate-500 shrink-0" />
          <span>{dataLoadedNotice}</span>
        </div>
      )}

      {/* Meta Controls Strip */}
      <div className="no-print bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Approved Client Dropdown */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Approved Client Establishment
          </label>
          <select
            value={selectedClientId}
            onChange={(e) => handleClientSelectChange(e.target.value)}
            className="w-full px-3 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold uppercase text-slate-900 outline-none focus:border-red-700 cursor-pointer"
          >
            {approvedClients.length === 0 ? (
              <option value="">No Active Clients Available</option>
            ) : (
              approvedClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.company_name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Attendance Month Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Attendance Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full px-3 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-red-700 cursor-pointer"
          >
            {MONTH_NAMES.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {/* Year Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Billing Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="w-full px-3 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-red-700 cursor-pointer"
          >
            {[2024, 2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Shift Duration */}
        <div className="space-y-1">
          <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Shift Schedule
          </label>
          <select
            value={shiftHours}
            onChange={(e) => setShiftHours(Number(e.target.value) as 12 | 8)}
            className="w-full px-3 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-red-700 cursor-pointer"
          >
            <option value={12}>12-Hour Shift (Standard Security)</option>
            <option value={8}>08-Hour Shift (Commercial / Housekeeping)</option>
          </select>
        </div>
      </div>

      {/* OFFICIAL PRINTABLE MUSTER ROLL SHEET (A4 LANDSCAPE) */}
      <div
        id="print-muster-area"
        className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden p-5 sm:p-7 text-slate-900"
      >
        {/* Header: Large Logo on Left & Centered Agency Header */}
        <div className="border-b-2 border-slate-900 pb-3 mb-3">
          <div className="flex items-center gap-5">
            <div className="shrink-0 w-24 h-24 flex items-center justify-center p-1 bg-white">
              <img
                src="/assets/img/logo/logo.png"
                alt="VSF Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56"><circle cx="28" cy="28" r="26" fill="%23b91c1c"/><text x="28" y="34" font-family="sans-serif" font-size="14" font-weight="900" fill="%23fff" text-anchor="middle">VSF</text></svg>';
                }}
              />
            </div>

            <div className="flex-1 text-center pr-12">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-950 leading-none">
                VIDHYA SECURITY FORCE &amp; HOUSEKEEPING SERVICES
              </h2>
              <p className="text-[11px] font-mono font-bold text-red-700 uppercase tracking-widest mt-1.5">
                संरक्षण एवं सुरक्षा &bull; PSARA MP LICENSED &bull; GOVT. RECOGNISED
              </p>
              <p className="text-[9.5px] font-mono text-slate-600 font-semibold mt-0.5">
                HEAD OFFICE: 012 A BLOCK TREASURE TOWN INDORE, MP &bull; PHONE: +91 9826259020
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-300 flex items-center justify-between font-mono text-xs sm:text-[13px] leading-tight text-slate-900">
            <div>
              <span className="font-bold text-slate-700">ESTABLISHMENT / UNIT: </span>
              <span className="font-black text-slate-950 underline">{unitName.toUpperCase() || 'SELECT CLIENT'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">ATTENDANCE MONTH: </span>
              <span className="font-black text-slate-950">{selectedMonth.toUpperCase()} {selectedYear}</span>
            </div>
            <div>
              <span className="font-bold text-slate-700">DATE: </span>
              <span className="font-black text-slate-950">
                01/{String(MONTH_NAMES.indexOf(selectedMonth) + 1).padStart(2, '0')}/{selectedYear}
              </span>
            </div>
          </div>
        </div>

        {/* Master Muster Roll Table */}
        <div className="overflow-x-auto">
          {loadingData ? (
            <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2 font-mono">
              <Loader2 className="animate-spin text-red-700" size={24} />
              <span>Fetching {selectedMonth} {selectedYear} attendance record...</span>
            </div>
          ) : (
            <table className="w-full border-collapse border border-slate-900 text-[10px]">
              <thead>
                <tr className="bg-slate-100 text-slate-950 font-black uppercase text-center border-b border-slate-900">
                  <th className="border border-slate-900 py-1.5 px-1 w-7 text-center">S.No</th>
                  <th className="border border-slate-900 py-1.5 px-2.5 text-left min-w-[150px]">Guard / Personnel Name</th>
                  {Array.from({ length: totalDaysInMonth }, (_, i) => i + 1).map((d) => (
                    <th key={d} className="border border-slate-900 py-1 px-0.5 w-[26px] text-center font-mono">
                      {d}
                    </th>
                  ))}
                  <th className="border border-slate-900 py-1.5 px-1.5 w-16 bg-amber-50 text-amber-950 text-center font-bold">
                    Total OT (Hrs)
                  </th>
                  <th className="border border-slate-900 py-1.5 px-1.5 w-16 bg-slate-200 text-slate-950 text-center font-black">
                    Total Duty
                  </th>
                  <th className="no-print border border-slate-900 py-1 px-1 w-8 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {guards.map((guard, idx) => {
                  const calc = guardCalculations.find((c) => c.id === guard.id);
                  return (
                    <tr key={guard.id} className="border-b border-slate-900 hover:bg-slate-50/50">
                      <td className="border border-slate-900 text-center font-bold font-mono py-1">
                        {idx + 1}
                      </td>
                      <td className="border border-slate-900 px-2 py-1 font-bold truncate">
                        <input
                          value={guard.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setGuards((p) => p.map((g) => (g.id === guard.id ? { ...g, name: val } : g)));
                          }}
                          className="w-full bg-transparent outline-none font-bold text-slate-900 border-b border-transparent focus:border-red-600 text-[10.5px]"
                          placeholder="Guard Name"
                        />
                      </td>

                      {Array.from({ length: totalDaysInMonth }, (_, i) => i + 1).map((day) => {
                        const val = guard.days[day] || '';
                        const isAbsent = val === 'A' || val === 'AB';
                        const isHalf = val === '1/2' || val === 'HD';
                        const hasOt = val.includes('/') || val.includes('+') || val.includes(' ');

                        return (
                          <td
                            key={day}
                            className={`border border-slate-900 p-0 text-center font-mono font-bold ${
                              isAbsent
                                ? 'bg-red-50 text-red-700'
                                : isHalf
                                ? 'bg-amber-50 text-amber-800'
                                : hasOt && !isHalf
                                ? 'bg-blue-50/70 text-blue-900'
                                : ''
                            }`}
                          >
                            <input
                              value={val}
                              onChange={(e) => handleCellChange(guard.id, day, e.target.value)}
                              className="w-full h-6 text-center bg-transparent outline-none uppercase font-bold p-0 text-[10px]"
                              maxLength={5}
                            />
                          </td>
                        );
                      })}

                      <td className="border border-slate-900 font-mono font-bold text-center bg-amber-50/70 text-amber-900">
                        {calc?.totalOt || 0} hrs
                      </td>

                      <td className="border border-slate-900 font-mono font-black text-center bg-slate-100 text-slate-950 text-[11px]">
                        {calc?.totalDuty || 0}
                      </td>

                      <td className="no-print border border-slate-900 text-center p-1">
                        <button
                          type="button"
                          onClick={() => handleRemoveGuard(guard.id)}
                          className="text-slate-400 hover:text-red-700 p-1 cursor-pointer"
                          title="Delete guard row"
                        >
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-slate-100 font-black border-t-2 border-slate-900 text-[11px]">
                  <td colSpan={totalDaysInMonth + 2} className="border border-slate-900 px-3 py-1.5 text-right uppercase">
                    Grand Total Deployment Consideration:
                  </td>
                  <td className="border border-slate-900 text-center font-mono text-amber-900 bg-amber-100/70">
                    {grandTotalOtHours} hrs
                  </td>
                  <td className="border border-slate-900 text-center font-mono text-red-800 bg-red-100/70 text-xs font-black">
                    {grandTotalDuties}
                  </td>
                  <td className="no-print border border-slate-900" />
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Operational Remarks & Notes Block */}
        <div className="mt-4 pt-2 border-t border-slate-200">
          <div className="flex items-start gap-2 text-[10px] font-mono">
            <span className="font-bold uppercase text-slate-700 shrink-0 mt-0.5">
              Operational Notes / Special Remarks:
            </span>
            <div className="flex-1">
              <textarea
                value={musterNotes}
                onChange={(e) => setMusterNotes(e.target.value)}
                placeholder="Type on-site observations, reliever adjustments, night-patrol remarks, or billing notes here (optional)..."
                rows={2}
                className="notes-print w-full bg-[#FBFBF9] border border-slate-200 rounded-lg p-1.5 text-[10px] font-mono outline-none focus:border-slate-800 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Dual Authorization Signatory Block */}
        <div className="mt-8 pt-3 flex justify-between items-end px-8">
          <div className="w-64 text-center">
            <div className="h-12 flex items-end justify-center mb-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase">[ Duty Checked On-Site ]</span>
            </div>
            <div className="border-t-2 border-slate-800 pt-1 font-bold text-[10.5px] uppercase text-slate-900">
              Security Supervisor / Field Officer
            </div>
            <span className="text-[8.5px] font-mono text-slate-500 uppercase block">
              Physical Verification Signature
            </span>
          </div>

          <div className="w-72 text-center">
            <div className="h-12 flex items-end justify-center mb-1">
              <span className="text-[9px] font-mono text-slate-400 uppercase">[ Official Seal &amp; Stamp ]</span>
            </div>
            <div className="border-t-2 border-slate-800 pt-1 font-black text-[10.5px] uppercase text-slate-950">
              For VIDHYA SECURITY FORCE &amp; HOUSEKEEPING SERVICES
            </div>
            <span className="text-[9px] font-mono font-bold text-red-800 uppercase block">
              Authorised Signatory
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
