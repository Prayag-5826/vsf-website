'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  PhoneCall,
  MessageCircle,
  MessageSquare,
  Clock,
  MapPin,
  Save,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Shield,
  FileCheck2,
  BookOpen,
  Send,
  Calendar
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
}

const statusBadgeStyles: Record<string, string> = {
  new: 'bg-red-50 text-red-700 border-red-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  survey_scheduled: 'bg-amber-50 text-amber-700 border-amber-200',
  proposal_sent: 'bg-purple-50 text-purple-700 border-purple-200',
  deployed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function TelecallerPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Call Notes & Telecaller state
  const [callNotes, setCallNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'script'>('details');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
        setCallNotes(data[0].admin_notes || '');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleSelect = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setCallNotes(inq.admin_notes || '');
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

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setSavingNotes(true);
    const { error } = await supabase
      .from('inquiries')
      .update({ admin_notes: callNotes })
      .eq('id', selectedInquiry.id);

    if (!error) {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === selectedInquiry.id ? { ...item, admin_notes: callNotes } : item
        )
      );
      setSelectedInquiry((prev) => (prev ? { ...prev, admin_notes: callNotes } : null));
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
      `Namaste ${inq.full_name} ji,\n\nThis is regarding your inquiry with *Vidhya Security Force & Housekeeping Services* for *${inq.service_type}* in *${inq.city}*.\n\nOur operations officer would like to discuss your shift schedule, post placement, and customized rate proposal. When would be a convenient time to speak with you?\n\n*Vidhya Security Force Central Operations Desk*\nIndore, Madhya Pradesh | +91 98262 59292`
    );
    window.open(`https://wa.me/${phoneNum}?text=${text}`, '_blank');
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter = filterStatus === 'all' || inq.status === filterStatus;
    const matchesSearch =
      inq.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.phone.includes(searchQuery) ||
      (inq.company_name && inq.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inq.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Telecaller Calling Console
            </h1>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
              Outbound Queue
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            1-Click client dialing, automated WhatsApp proposals, and live conversation loggers.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800 transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Leads</span>
        </button>
      </div>

      {/* Main Calling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* Left: Lead Call Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xs space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, city..."
                className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10.5px]">
              {['all', 'new', 'contacted', 'survey_scheduled'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterStatus(t)}
                  className={`px-2 py-1 rounded font-semibold uppercase tracking-wider transition ${
                    filterStatus === t
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {loading ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                Loading call queue...
              </div>
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => handleSelect(inq)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-50/40 border-red-600 shadow-xs ring-1 ring-red-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {inq.company_name || inq.full_name}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-600" />
                          {inq.city} &bull; {inq.service_type}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                          statusBadgeStyles[inq.status]
                        }`}
                      >
                        {inq.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-600 text-[11px]">
                        +91 {inq.phone}
                      </span>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`tel:${inq.phone}`}
                          className="p-1 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Call Now"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => openWhatsApp(inq)}
                          className="p-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition cursor-pointer"
                          title="WhatsApp Pitch"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
                No inquiries in this category.
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Dial & Call Notes Dossier (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedInquiry ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5 sticky top-6">

              {/* Client Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                    Active Telecalling Record
                  </span>
                  <h2 className="text-base font-bold text-slate-900">
                    {selectedInquiry.company_name || selectedInquiry.full_name}
                  </h2>
                  <span className="text-xs text-slate-500">
                    Point of Contact: <strong>{selectedInquiry.full_name}</strong>
                  </span>
                </div>

                {/* Outcome Pipeline Status */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) =>
                      updateStatus(selectedInquiry.id, e.target.value as Inquiry['status'])
                    }
                    className="text-xs font-bold uppercase tracking-wider rounded border border-slate-300 px-2.5 py-1.5 bg-slate-50 cursor-pointer focus:outline-none"
                  >
                    <option value="new">🔴 New Lead</option>
                    <option value="contacted">🔵 Spoke with Client</option>
                    <option value="survey_scheduled">🟡 Site Survey Scheduled</option>
                    <option value="proposal_sent">🟣 Rate Sheet Sent</option>
                    <option value="deployed">🟢 Deployed</option>
                    <option value="closed">⚪ Inactive / Closed</option>
                  </select>
                </div>
              </div>

              {/* Immediate Telecalling Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="py-2.5 px-4 bg-red-700 hover:bg-red-800 text-white font-bold text-xs rounded uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call +91 {selectedInquiry.phone}</span>
                </a>

                <button
                  type="button"
                  onClick={() => openWhatsApp(selectedInquiry)}
                  className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send WhatsApp Pitch</span>
                </button>
              </div>

              {/* Tab Switcher: Client Details vs Calling Script */}
              <div className="border-b border-slate-200 flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 border-b-2 transition ${
                    activeTab === 'details'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Client Specifications
                </button>
                <button
                  onClick={() => setActiveTab('script')}
                  className={`pb-2 border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === 'script'
                      ? 'border-slate-900 text-slate-900'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Calling Script &amp; Pitch</span>
                </button>
              </div>

              {/* Tab 1: Specifications */}
              {activeTab === 'details' ? (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Location
                      </span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {selectedInquiry.city}, MP
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Service Wing
                      </span>
                      <span className="font-semibold text-slate-900 mt-0.5 block">
                        {selectedInquiry.service_type}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Client Shift / Headcount Instructions
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedInquiry.headcount_notes || 'No custom shift notes specified.'}
                    </p>
                  </div>
                </div>
              ) : (
                /* Tab 2: Calling Script */
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-2 text-slate-800 leading-relaxed font-sans">
                  <div className="font-bold uppercase tracking-wider text-amber-900 text-[11px]">
                    Telecaller Script Pitch (Indore / MP Regional)
                  </div>
                  <p>
                    <strong>Opening:</strong> &quot;Namaste {selectedInquiry.full_name} ji, I am calling from Vidhya Security Force central operations desk in Indore regarding your inquiry for {selectedInquiry.service_type} in {selectedInquiry.city}.&quot;
                  </p>
                  <p>
                    <strong>Key Hook:</strong> &quot;We provide 100% PSARA licensed guards with zero client liability and direct EPF/ESIC monthly challans attached to every invoice.&quot;
                  </p>
                  <p>
                    <strong>Closing Call-To-Action:</strong> &quot;Would tomorrow 11:00 AM work for our Field Officer to visit your site for a zero-obligation security risk assessment?&quot;
                  </p>
                </div>
              )}

              {/* Call Notes Logger */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-700">
                    Call Outcome &amp; Assessment Notes
                  </span>
                  <span className="text-[11px] text-slate-400">Database Synced</span>
                </div>

                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record outcome: e.g. Client requested 4 armed sentries for 12hr night shift. Site survey scheduled for Friday at Pithampur Sector 3..."
                  className="w-full bg-white border border-slate-300 rounded p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 resize-none leading-relaxed"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded text-xs font-bold uppercase tracking-wider transition cursor-pointer disabled:opacity-60"
                  >
                    {savingNotes ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Call Notes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-400">
              Select a lead from the queue to start telecalling.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
