'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  MapPin,
  Loader2,
  Search,
  RefreshCw,
  PhoneCall,
  Save,
  ExternalLink,
  MessageCircle,
  UserCheck
} from 'lucide-react';

interface Inquiry {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  email?: string | null;
  company_name: string | null;
  city: string;
  service_type: string;
  headcount_notes: string | null;
  status: 'new' | 'contacted' | 'survey_scheduled' | 'proposal_sent' | 'deployed' | 'closed';
  admin_notes: string | null;
  assigned_officer: string | null;
}

interface Officer {
  id: string;
  name: string;
  role: string;
}

const statusStyles: Record<string, string> = {
  new: 'bg-red-50 text-red-700 border-red-200 font-bold',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  survey_scheduled: 'bg-amber-50 text-amber-800 border-amber-200',
  proposal_sent: 'bg-purple-50 text-purple-700 border-purple-200',
  deployed: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function OwnerLeadDeskPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [notes, setNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [assigningOfficer, setAssigningOfficer] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchOfficers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, role')
      .in('role', ['FIELD_REP', 'SR_FIELD_EXECUTIVE', 'ADMIN'])
      .eq('status', 'ACTIVE');

    if (!error && data) {
      setOfficers(data as Officer[]);
    }
  };

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInquiries(data as Inquiry[]);
      if (data.length > 0 && !selectedInquiry) {
        setSelectedInquiry(data[0] as Inquiry);
        setNotes(data[0].admin_notes || '');
      } else if (selectedInquiry) {
        const updatedSelected = data.find((d: Inquiry) => d.id === selectedInquiry.id);
        if (updatedSelected) {
          setSelectedInquiry(updatedSelected as Inquiry);
          setNotes((updatedSelected as Inquiry).admin_notes || '');
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
    fetchOfficers();
  }, []);

  const handleSelect = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setNotes(inq.admin_notes || '');
  };

  const updateStatus = async (id: string, newStatus: Inquiry['status']) => {
    const { error } = await supabase
      .from('inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedInquiry?.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  const handleAssignOfficer = async (officerId: string) => {
    if (!selectedInquiry) return;
    setAssigningOfficer(true);
    const targetOfficer = officerId || null;

    const { error } = await supabase
      .from('inquiries')
      .update({
        assigned_officer: targetOfficer,
        status: targetOfficer && selectedInquiry.status === 'new' ? 'survey_scheduled' : selectedInquiry.status
      })
      .eq('id', selectedInquiry.id);

    if (!error) {
      if (targetOfficer) {
        const leadId = `LEAD-${selectedInquiry.id.slice(0, 8)}`;
        await supabase.from('leads').upsert({
          id: leadId,
          company_name: selectedInquiry.company_name || selectedInquiry.full_name,
          contact_person: selectedInquiry.full_name,
          phone: selectedInquiry.phone,
          address: `${selectedInquiry.city} | Service: ${selectedInquiry.service_type}`,
          status: 'PROSPECT',
          assigned_to: targetOfficer,
          updated_at: new Date().toISOString()
        });
      }

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id
            ? {
                ...item,
                assigned_officer: targetOfficer,
                status: targetOfficer && item.status === 'new' ? 'survey_scheduled' : item.status
              }
            : item
        )
      );
      setSelectedInquiry((prev) =>
        prev
          ? {
              ...prev,
              assigned_officer: targetOfficer,
              status: targetOfficer && prev.status === 'new' ? 'survey_scheduled' : prev.status
            }
          : null
      );
    }
    setAssigningOfficer(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from('inquiries')
      .update({ admin_notes: notes })
      .eq('id', selectedInquiry.id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, admin_notes: notes } : item
        )
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, admin_notes: notes } : null));
    }
    setSavingNotes(false);
  };

  const getCleanMobile = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 ? `91${cleaned}` : cleaned;
  };

  const openWhatsApp = (inq: Inquiry) => {
    const phoneNum = getCleanMobile(inq.phone);
    const text = encodeURIComponent(
      `Namaste ${inq.full_name} ji,\n\nThis is Anil Dhariwal from *Vidhya Security Force & Housekeeping Services*.\n\nRegarding your requirement for *${inq.service_type}* in *${inq.city}*, I would like to arrange an on-site survey and provide our official PSARA compliance rate schedule.\n\nWhen would be a good time to speak?\n\n*Vidhya Security Force Central Operations*\nIndore, MP | +91 98262 59292`
    );
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filterStatus === 'all' || inq.status === filterStatus;
    const matchesSearch =
      inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.company_name && inq.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const total = inquiries.length;
  const newCount = inquiries.filter((i) => i.status === 'new').length;
  const inPipeline = inquiries.filter((i) => ['contacted', 'survey_scheduled', 'proposal_sent'].includes(i.status)).length;
  const deployed = inquiries.filter((i) => i.status === 'deployed').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Banner with Direct SSO Link to Field Portal & Telecaller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Agency Operations &amp; Lead Desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-800 text-[10px] font-mono font-bold uppercase tracking-wider">
              Executive HQ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Indore Central Hub &bull; Site surveys, client intake &amp; officer dispatch
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* SSO Field App Quick Launcher */}
          <a
            href="https://field.vidhyasecurityforce.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer uppercase tracking-wider"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>Open Field App</span>
            <ExternalLink className="w-3 h-3 text-red-200" />
          </a>

          {/* Telecaller Dialer */}
          <Link
            href="/admin/telecaller"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl uppercase tracking-wider transition cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>Speed Dialer</span>
          </Link>

          <button
            type="button"
            onClick={fetchInquiries}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Inquiries
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block">
            New (Action Pending)
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">{newCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
            In Site Survey / Pipeline
          </span>
          <div className="text-2xl font-black text-blue-600 mt-1">{inPipeline}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
            Guards Deployed
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{deployed}</div>
        </div>
      </div>

      {/* Main Workspace (Split View) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left: Lead Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, city, company..."
                className="w-full bg-[#FBFBF9] border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-red-600 focus:bg-white transition"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10.5px]">
              {['all', 'new', 'contacted', 'survey_scheduled', 'deployed'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterStatus(tab)}
                  className={`px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider transition ${
                    filterStatus === tab
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1">
            {loading ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2 text-red-600" />
                Loading inquiries from database...
              </div>
            ) : filtered.length > 0 ? (
              filtered.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                const assignedOfficerObj = officers.find((o) => o.id === inq.assigned_officer);

                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelect(inq)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/40 border-red-600 shadow-xs ring-1 ring-red-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">
                          {inq.company_name || inq.full_name}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                          {inq.city} &bull; {inq.service_type}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          statusStyles[inq.status]
                        }`}
                      >
                        {inq.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-700 text-[11px] font-bold">
                        +91 {inq.phone}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {assignedOfficerObj ? (
                          <span className="text-[9.5px] font-bold px-1.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded">
                            {assignedOfficerObj.name}
                          </span>
                        ) : (
                          <span className="text-[9.5px] font-medium text-slate-400">
                            Unassigned
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {new Date(inq.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
                No inquiries matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right: Master Lead Record & Controls (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 sticky top-6">

              {/* Record Title & Stage Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                    Inquiry Record #{selectedInquiry.id.slice(0, 8)}
                  </span>
                  <h2 className="text-lg font-black text-slate-900 mt-0.5">
                    {selectedInquiry.company_name || selectedInquiry.full_name}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Location: <strong className="text-slate-700">{selectedInquiry.city}, Madhya Pradesh</strong>
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <span className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Deployment Pipeline Stage
                  </span>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) =>
                      updateStatus(selectedInquiry.id, e.target.value as Inquiry['status'])
                    }
                    className="text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-300 px-3 py-2 bg-slate-50 cursor-pointer focus:outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="new">Action Required (New)</option>
                    <option value="contacted">Spoke with Client</option>
                    <option value="survey_scheduled">Site Risk Survey Booked</option>
                    <option value="proposal_sent">Rate Proposal Submitted</option>
                    <option value="deployed">Guards Deployed</option>
                    <option value="closed">Closed / Inactive</option>
                  </select>
                </div>
              </div>

              {/* Field Officer Assignment Dropdown */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      Assigned Field Representative
                    </span>
                    <span className="text-[10px] text-amber-800/80">
                      Syncs lead directly to the officer&apos;s mobile app
                    </span>
                  </div>
                </div>

                <select
                  value={selectedInquiry.assigned_officer || ''}
                  disabled={assigningOfficer}
                  onChange={(e) => handleAssignOfficer(e.target.value)}
                  className="text-xs font-bold text-slate-800 bg-white border border-amber-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
                >
                  <option value="">-- Unassigned --</option>
                  {officers.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} ({officer.id})
                    </option>
                  ))}
                </select>
              </div>

              {/* Direct Communication Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="py-3 px-4 bg-red-700 hover:bg-red-800 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <PhoneCall className="w-4 h-4 text-red-200" />
                  <span>Call +91 {selectedInquiry.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => openWhatsApp(selectedInquiry)}
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-200" />
                  <span>WhatsApp Proposal</span>
                </button>
              </div>

              {/* Specifications Card */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Contact Person
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {selectedInquiry.full_name}
                  </span>
                </div>

                <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Service Wing
                  </span>
                  <span className="font-bold text-slate-900 mt-0.5 block">
                    {selectedInquiry.service_type}
                  </span>
                </div>

                <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Phone Number
                  </span>
                  <span className="font-mono font-bold text-slate-900 mt-0.5 block">
                    +91 {selectedInquiry.phone}
                  </span>
                </div>

                <div className="p-3.5 bg-[#FBFBF9] rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Email
                  </span>
                  <span className="font-semibold text-slate-900 mt-0.5 block truncate">
                    {selectedInquiry.email || 'None provided'}
                  </span>
                </div>
              </div>

              {/* Requirement Notes */}
              <div className="p-4 bg-[#FBFBF9] rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Client Requirement Details
                </span>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedInquiry.headcount_notes || 'No specific notes entered by client.'}
                </p>
              </div>

              {/* Internal Owner Log Notes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-800">
                    Internal Site Survey &amp; Rate Quotation Notes
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Database Synced</span>
                </div>

                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record survey details (e.g. Quoted rate for 4 unarmed guards at 12hr shifts for Pithampur factory. On-site risk analysis scheduled Friday 10 AM)..."
                  className="w-full bg-[#FBFBF9] border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-red-600 focus:bg-white resize-none leading-relaxed transition"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-50"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
              Select an inquiry on the left to inspect parameters.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
