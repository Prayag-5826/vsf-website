'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Receipt,
  X,
  Loader2,
  Save,
  UserCheck,
  AlertCircle,
  Folder,
  FolderOpen,
  FileText,
  FileCheck2,
  Printer,
  Calendar,
  Eye,
  ShieldCheck,
  Tag,
  ArrowRight,
  Upload,
  Download,
  Trash2,
  Paperclip,
  CheckCircle2,
  FileBadge,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Sparkles,
  UserCheck2
} from 'lucide-react';
import { getSupabase } from '@/lib/supabaseBrowser';

interface ClientRecord {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  billing_address: string | null;
  gst_number: string | null;
  pan_number: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'TERMINATED';
  contract_start_date: string | null;
  contract_end_date: string | null;
  notes: string | null;
  created_at: string;
}

interface ClientBill {
  id: string;
  bill_no: string;
  bill_month: string;
  grand_total: number;
  status: string;
  bill_date?: string;
}

interface ClientVisit {
  id: string;
  company_name?: string;
  representative_name: string | null;
  visit_purpose: string | null;
  timestamp: string;
  interaction_outcome: string | null;
  notes: string | null;
  manning_specs?: any;
  next_follow_up?: string | null;
  phone_number?: string | null;
  contact_person?: string | null;
}

interface ClientProposal {
  id: string;
  client_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface ClientVaultFile {
  id: string;
  client_id: string;
  client_name: string;
  doc_title: string;
  doc_category: 'WORK_ORDER' | 'AGREEMENT' | 'GST_CERT' | 'CHEQUE' | 'MISC' | 'ATTENDANCE_MUSTER';
  file_url: string;
  file_name: string;
  file_size: string | null;
  file_type: string | null;
  uploaded_by: string;
  uploaded_at: string;
}

interface MonthlyAttendanceRecord {
  id: string;
  unit_name: string;
  month: string;
  year: number;
  shift_hours: number;
  guards_data: any[];
  total_duties: number;
  total_ot_hours: number;
  notes?: string;
  updated_at: string;
}

const esc = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)
  );

export default function ClientsPage() {
  const supabase = useMemo(() => getSupabase(), []);

  // Directory Data
  const [masterClients, setMasterClients] = useState<ClientRecord[]>([]);
  const [fieldVisitsList, setFieldVisitsList] = useState<ClientRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // View Filter: Default to 'CLIENTS' so only approved contract clients appear
  const [directoryView, setDirectoryView] = useState<'CLIENTS' | 'VISITS'>('CLIENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED'>('ALL');

  // Selected client folder modal
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [activeFolderTab, setActiveFolderTab] = useState<'BILLS' | 'FILES' | 'PROPOSALS' | 'SURVEYS' | 'STATUTORY'>('BILLS');
  const [clientBills, setClientBills] = useState<ClientBill[]>([]);
  const [clientVisits, setClientVisits] = useState<ClientVisit[]>([]);
  const [clientProposals, setClientProposals] = useState<ClientProposal[]>([]);
  const [clientFiles, setClientFiles] = useState<ClientVaultFile[]>([]);
  const [clientAttendances, setClientAttendances] = useState<MonthlyAttendanceRecord[]>([]);
  const [openMonthFolders, setOpenMonthFolders] = useState<Record<string, boolean>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  // File Upload State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState<'WORK_ORDER' | 'AGREEMENT' | 'GST_CERT' | 'CHEQUE' | 'MISC'>('WORK_ORDER');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add / Edit Client Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    billing_address: '',
    gst_number: '',
    pan_number: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'TERMINATED',
    contract_start_date: '',
    contract_end_date: '',
    notes: ''
  });

  const loadClients = useCallback(async () => {
    setLoading(true);

    const [clientsRes, visitsRes] = await Promise.all([
      supabase.from('clients').select('*').order('company_name', { ascending: true }),
      supabase.from('visits').select('*').order('timestamp', { ascending: false }).limit(100)
    ]);

    // 1. Approved Master Clients
    const registered: ClientRecord[] = (clientsRes.data || []).map((c: any) => ({
      ...c,
      status: c.status || 'ACTIVE'
    }));

    // Registered client set to prevent duplicates in visits
    const registeredNames = new Set(registered.map((c) => c.company_name.trim().toLowerCase()));

    // 2. Raw Field Visits (Unapproved prospect locations)
    const rawVisits: ClientRecord[] = [];
    const seenVisitNames = new Set<string>();

    (visitsRes.data || []).forEach((v: any) => {
      const name = (v.company_name || '').trim();
      const lower = name.toLowerCase();

      if (name && !registeredNames.has(lower) && !seenVisitNames.has(lower)) {
        seenVisitNames.add(lower);

        let cleanAddr = '';
        if (v.notes) {
          const match = v.notes.match(/Address:\s*([^|]+)/i);
          if (match && match[1]) cleanAddr = match[1].trim();
        }

        rawVisits.push({
          id: `CL-VISIT-${v.id ? v.id.slice(-6).toUpperCase() : Math.random().toString(36).slice(2, 6).toUpperCase()}`,
          company_name: name.toUpperCase(),
          contact_person: v.contact_person || null,
          phone: v.phone_number || null,
          email: null,
          billing_address: cleanAddr || 'Logged via Field Inspection Lead',
          gst_number: null,
          pan_number: null,
          status: 'ACTIVE',
          contract_start_date: null,
          contract_end_date: null,
          notes: v.notes || null,
          created_at: v.timestamp || new Date().toISOString()
        });
      }
    });

    setMasterClients(registered);
    setFieldVisitsList(rawVisits);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Promote a Visit lead to an official Approved Client
  const handlePromoteToClient = async (visitLead: ClientRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Promote "${visitLead.company_name}" to an official Approved Contract Client?`)) return;

    try {
      const generatedClientId = 'CL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const payload = {
        id: generatedClientId,
        company_name: visitLead.company_name.trim().toUpperCase(),
        contact_person: visitLead.contact_person || null,
        phone: visitLead.phone || null,
        billing_address: visitLead.billing_address || null,
        status: 'ACTIVE',
        contract_start_date: new Date().toISOString().split('T')[0],
        notes: visitLead.notes || 'Promoted from field inspection visit',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('clients').insert(payload);
      if (error) throw error;

      alert(`"${visitLead.company_name}" is now an Approved Client!`);
      await loadClients();
      setDirectoryView('CLIENTS');
    } catch (err: any) {
      alert(`Could not promote client: ${err.message}`);
    }
  };

  const openClientDossier = async (client: ClientRecord) => {
    setSelectedClient(client);
    setActiveFolderTab('BILLS');
    setLoadingDetails(true);

    try {
      const [billsRes, visitsRes, proposalsRes, filesRes, attendanceRes] = await Promise.all([
        supabase
          .from('bills')
          .select('*')
          .ilike('client_name', `%${client.company_name.trim()}%`)
          .order('bill_date', { ascending: false }),
        supabase
          .from('visits')
          .select('*')
          .ilike('company_name', `%${client.company_name.trim()}%`)
          .order('timestamp', { ascending: false })
          .limit(25),
        supabase
          .from('proposals')
          .select('id, client_name, total_amount, status, created_at')
          .ilike('client_name', `%${client.company_name.trim()}%`)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('client_documents')
          .select('*')
          .or(`client_name.ilike.%${client.company_name.trim()}%,client_id.eq.${client.id}`)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('monthly_attendance')
          .select('*')
          .or(`unit_name.ilike.%${client.company_name.trim()}%,client_id.eq.${client.id}`)
          .order('year', { ascending: false })
      ]);

      setClientBills((billsRes.data as ClientBill[]) || []);
      setClientVisits((visitsRes.data as ClientVisit[]) || []);
      setClientProposals((proposalsRes.data as ClientProposal[]) || []);
      setClientFiles((filesRes.data as ClientVaultFile[]) || []);
      setClientAttendances((attendanceRes.data as MonthlyAttendanceRecord[]) || []);
      setOpenMonthFolders({});
    } catch (err) {
      console.error('Failed to load client dossier', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !uploadFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const fileExt = uploadFile.name.split('.').pop() || 'bin';
      const safeClientName = selectedClient.company_name.replace(/[^A-Za-z0-9]/g, '_');
      const uniqueFileName = `${safeClientName}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${uniqueFileName}`;

      const { error: storageError } = await supabase.storage
        .from('client-vault')
        .upload(filePath, uploadFile, { cacheControl: '3600', upsert: false });

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from('client-vault')
        .getPublicUrl(filePath);

      const docPayload = {
        id: `DOC-${Date.now()}`,
        client_id: selectedClient.id,
        client_name: selectedClient.company_name,
        doc_title: uploadTitle.trim() || uploadFile.name,
        doc_category: uploadCategory,
        file_url: urlData.publicUrl,
        file_name: uploadFile.name,
        file_size: `${(uploadFile.size / (1024 * 1024)).toFixed(2)} MB`,
        file_type: uploadFile.type || fileExt,
        uploaded_by: 'Anil Dhariwal (Director)',
        uploaded_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase.from('client_documents').insert(docPayload);
      if (dbError) throw dbError;

      setClientFiles((prev) => [docPayload as ClientVaultFile, ...prev]);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadTitle('');
    } catch (err: any) {
      console.error('Upload failure:', err);
      setUploadError(err.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to permanently delete this document?')) return;
    try {
      await supabase.from('client_documents').delete().eq('id', docId);
      setClientFiles((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      console.error('Could not delete document:', err);
    }
  };

  // Dedicated Actual Downloader: Handles both Survey Transmittal Letters & Binary Files
  const handleDownloadVaultFile = async (doc: ClientVaultFile) => {
    setDownloadingDocId(doc.id);

    try {
      // 1. If it's a Survey Transmittal Cover Letter or internal quotation reference
      if (doc.file_type === 'SURVEY_LETTER' || doc.file_url.startsWith('/admin/quotations')) {
        // Fetch matching proposal data and official company settings in parallel
        const [propRes, settingsRes] = await Promise.all([
          supabase
            .from('proposals')
            .select('*')
            .ilike('client_name', `%${doc.client_name.trim()}%`)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle(),
          supabase.from('settings').select('*').eq('id', 1).maybeSingle()
        ]);

        const propData = propRes.data;
        const companyData = settingsRes.data || {};

        const companyName = esc(companyData.company_name || 'VIDHYA SECURITY FORCE & HOUSEKEEPING SERVICES');
        const companyAddress = esc(companyData.address || '012 A BLOCK TREASURE TOWN INDORE, MP');
        const companyPhone = esc(companyData.contact_no || companyData.contact_number || companyData.phone || '9826259020');
        const companyEmail = esc(companyData.email || 'contact@vidhyasecurityforce.in');
        const psaraLicense = esc(companyData.psara_license || 'PSA/L/74/MP/2023/FEB/3/425');
        const directorName = esc(companyData.director_name || 'Anil Dhariwal');
        const sealImage = companyData.seal_image || '';
        const logoUrl = companyData.logo || '/assets/img/logo/logo.png';

        const refNo = propData?.id ? `VSF/INSP/${propData.id.replace(/\D/g, '') || '2026'}` : 'VSF/INSP/2026';
        const clientTitle = esc(propData?.client_name || doc.client_name);
        const clientAddr = esc(propData?.client_address || selectedClient?.billing_address || 'Institution Premises, Madhya Pradesh');
        const contact = esc(propData?.contact_person || selectedClient?.contact_person || '');
        const phone = esc(propData?.client_phone || selectedClient?.phone || '');
        const issueDate = propData?.created_at ? new Date(propData.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');

        // Render exact post items from stored service_items
        const itemsHtml = (propData?.service_items || [])
          .map(
            (s: any) =>
              `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#ffffff;border:1px solid #e2e8f0;border-radius:8px;font-family:monospace;font-size:11.5px;">
                <span style="font-weight:bold;text-transform:uppercase;color:#1e293b;">${esc(s.label)} (${s.shift === '12_HOURS' ? '12-Hour Shift' : '08-Hour Shift'})</span>
                <span style="color:#991b1b;font-weight:900;">${s.count} Post${s.count > 1 ? 's' : ''}</span>
              </div>`
          )
          .join('');

        const letterHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Survey Letter - ${clientTitle}</title>
              <style>
                @page { size: A4 portrait; margin: 12mm 15mm; }
                body {
                  font-family: Georgia, Cambria, "Times New Roman", Times, serif;
                  color: #0f172a;
                  margin: 0;
                  padding: 0;
                  background: #ffffff;
                  line-height: 1.6;
                }
                .sheet {
                  width: 100%;
                  box-sizing: border-box;
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  min-height: 270mm;
                }
                .header-table {
                  width: 100%;
                  border-collapse: collapse;
                  border-bottom: 2px solid #7f1d1d;
                  padding-bottom: 12px;
                  margin-bottom: 14px;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .tag {
                  background: #fef2f2;
                  border: 1px solid #fecaca;
                  color: #991b1b;
                  padding: 3px 8px;
                  font-size: 9.5px;
                  font-weight: bold;
                  border-radius: 4px;
                  text-transform: uppercase;
                  font-family: monospace;
                  display: inline-block;
                }
                .ref-bar {
                  display: flex;
                  justify-content: space-between;
                  font-family: monospace;
                  font-size: 11px;
                  border-bottom: 1px solid #e2e8f0;
                  padding-bottom: 6px;
                  margin-bottom: 14px;
                }
                .client-box {
                  background: #FAF9F5;
                  border: 1px solid #e2e8f0;
                  border-radius: 10px;
                  padding: 12px 14px;
                  margin-bottom: 14px;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .subj-box {
                  background: #fef2f2;
                  border: 1px solid #fecaca;
                  border-radius: 8px;
                  padding: 10px 12px;
                  font-size: 12px;
                  font-weight: bold;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  color: #0f172a;
                  margin-bottom: 16px;
                }
                .body-text p {
                  font-size: 13.5px;
                  line-height: 1.65;
                  margin: 0 0 12px 0;
                  text-align: justify;
                }
                .schedule-box {
                  border: 1px solid #991b1b;
                  background: #fef2f2;
                  border-radius: 10px;
                  padding: 10px 14px;
                  margin-bottom: 14px;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .post-grid {
                  display: grid;
                  grid-template-columns: 1fr 1fr;
                  gap: 8px;
                  margin-top: 6px;
                  margin-bottom: 14px;
                }
                .footer {
                  border-top: 1px solid #e2e8f0;
                  padding-top: 10px;
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-end;
                  margin-top: auto;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
              </style>
            </head>
            <body>
              <div class="sheet">
                <div>
                  <!-- Letterhead -->
                  <table class="header-table">
                    <tr>
                      <td style="width: 25%; vertical-align: middle;">
                        <div style="display: flex; align-items: center; gap: 10px;">
                          <img src="${logoUrl}" alt="VSF Logo" style="width: 58px; height: 58px; object-fit: contain;" onerror="this.style.display='none'"/>
                          <div style="line-height: 1.2;">
                            <div style="color: #991b1b; font-weight: 900; font-size: 10px; letter-spacing: 1px; font-family: monospace;">PROTECTION • SECURITY</div>
                            <div style="font-size: 13.5px; font-weight: 900; color: #020617;">संरक्षण एवं सुरक्षा</div>
                            <div style="font-size: 9px; font-family: monospace; color: #64748b; margin-top: 2px;">24/7 HELPLINE: +91 9826259020</div>
                          </div>
                        </div>
                      </td>
                      <td style="text-align: center; vertical-align: middle; padding: 0 10px;">
                        <div style="font-size: 16px; font-weight: 900; text-transform: uppercase; color: #020617; line-height: 1.2;">${companyName}</div>
                        <div style="font-size: 9.5px; font-weight: bold; color: #334155; margin-top: 2px; text-transform: uppercase;">HEAD OFFICE: ${companyAddress}</div>
                        <div style="font-size: 9px; font-family: monospace; color: #475569;">Phone: ${companyPhone} • Email: ${companyEmail}</div>
                      </td>
                      <td style="width: 25%; text-align: right; vertical-align: middle;">
                        <span class="tag">PSARA MP LICENSED</span>
                        <div style="font-size: 9.5px; font-family: monospace; font-weight: bold; color: #334155; margin-top: 4px;">LIC: ${psaraLicense}</div>
                      </td>
                    </tr>
                  </table>

                  <!-- Reference Bar -->
                  <div class="ref-bar">
                    <div><span style="color: #64748b;">DISPATCH REF: </span><strong style="color: #7f1d1d; font-weight: 900;">${esc(refNo)}</strong></div>
                    <div><span style="color: #64748b;">DATE: </span><strong>${esc(issueDate)}</strong></div>
                  </div>

                  <!-- Client Block -->
                  <div class="client-box">
                    <div style="font-size: 9.5px; font-family: monospace; font-weight: bold; color: #64748b; text-transform: uppercase;">To,</div>
                    <div style="font-size: 15px; font-weight: 900; text-transform: uppercase; color: #020617; margin: 2px 0;">The Management / Administration Authority</div>
                    <div style="font-size: 13.5px; font-weight: bold; color: #1e293b; text-transform: uppercase;">${clientTitle}</div>
                    <div style="font-size: 11.5px; color: #334155; margin-top: 3px;">
                      ${contact ? `<div><strong>Kind Attention:</strong> ${contact}${phone ? `(Ph: +91 ${phone})` : ''}</div>` : ''}
                      <div><strong>Campus Location:</strong> ${clientAddr}</div>
                    </div>
                  </div>

                  <!-- Subject -->
                  <div class="subj-box">
                    <span style="color: #7f1d1d; text-transform: uppercase;">Subject:</span> Prior Intimation for Scheduled Campus Inspection &amp; Premises Assessment Visit.
                  </div>

                  <!-- Letter Body -->
                  <div class="body-text">
                    <p><strong>Dear Sir / Madam,</strong></p>
                    <p>Greetings from <strong>${companyName}</strong>.</p>
                    <p>With reference to our ongoing communication, this is to confirm our upcoming visit to your campus for conducting an on-site physical security inspection and operational assessment:</p>

                    <!-- Schedule Box -->
                    <div class="schedule-box">
                      <div style="display: flex; justify-content: space-between; font-family: monospace; font-size: 12.5px;">
                        <div>
                          <span style="color: #64748b; font-size: 9.5px; font-weight: bold; text-transform: uppercase; display: block;">Proposed Date of Visit</span>
                          <strong style="color: #020617; font-size: 13.5px;">${esc(issueDate)}</strong>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 9.5px; font-weight: bold; text-transform: uppercase; display: block;">Designated Time Window</span>
                          <strong style="color: #7f1d1d; font-size: 13.5px;">11:00 AM – 01:30 PM (Standard)</strong>
                        </div>
                      </div>
                    </div>

                    ${itemsHtml ? `
                      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <span style="font-size: 10px; font-family: monospace; font-weight: 900; text-transform: uppercase; color: #334155; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">Manpower Deployment Under Review:</span>
                        <div class="post-grid">${itemsHtml}</div>
                      </div>
                    ` : ''}

                    <p>We look forward to meeting with your administrative team on the scheduled date to review the requirements and finalize our operational recommendations.</p>
                    <p style="margin-top: 14px;">Thanking you,<br/><strong>Yours faithfully,</strong></p>
                  </div>
                </div>

                <!-- Footer Signatory Block -->
                <div class="footer">
                  <div style="font-size: 9.5px; font-family: monospace; color: #64748b;">
                    <div style="font-weight: bold; color: #0f172a; font-size: 10px;">${companyName}</div>
                    <div style="color: #991b1b; font-weight: bold; text-transform: uppercase;">Govt. of Madhya Pradesh PSARA Licensed • Central HQ</div>
                    <div>Dispatch Docket Ref: ${esc(refNo)}</div>
                  </div>
                  <div style="text-align: center; width: 230px;">
                    <div style="font-size: 9.5px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 2px;">For ${companyName}</div>
                    <div style="height: 72px; display: flex; align-items: center; justify-content: center; margin: 2px 0;">
                      ${sealImage ? `
                        <img src="${sealImage}" alt="Official Seal" style="max-height: 70px; max-width: 100%; object-fit: contain;"/>
                      ` : `
                        <div style="border: 1px dashed #fca5a5; padding: 6px 12px; border-radius: 4px; font-family: monospace; font-size: 9px; color: #991b1b; text-transform: uppercase;">[ OFFICIAL SEAL ]</div>
                      `}
                    </div>
                    <div style="border-top: 2px solid #0f172a; padding-top: 2px;">
                      <div style="font-size: 12px; font-weight: 900; text-transform: uppercase; color: #020617;">${directorName}</div>
                      <div style="font-size: 9.5px; font-family: monospace; font-weight: bold; color: #991b1b; text-transform: uppercase;">Managing Director</div>
                    </div>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `;

        const frame = document.createElement('iframe');
        frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
        frame.onload = () => {
          setTimeout(() => {
            frame.contentWindow?.focus();
            frame.contentWindow?.print();
            setTimeout(() => frame.remove(), 2500);
          }, 300);
        };
        frame.srcdoc = letterHtml;
        document.body.appendChild(frame);
      } else {
        // 2. Binary file in Supabase Storage - direct blob download
        const res = await fetch(doc.file_url);
        if (!res.ok) throw new Error('Could not download file from storage.');
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = doc.file_name || `${doc.doc_title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      }
    } catch (err: any) {
      console.error('Download error:', err);
      window.open(doc.file_url, '_blank');
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      id: '',
      company_name: '',
      contact_person: '',
      phone: '',
      email: '',
      billing_address: '',
      gst_number: '',
      pan_number: '',
      status: 'ACTIVE',
      contract_start_date: '',
      contract_end_date: '',
      notes: ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client: ClientRecord) => {
    setFormData({
      id: client.id,
      company_name: client.company_name,
      contact_person: client.contact_person || '',
      phone: client.phone || '',
      email: client.email || '',
      billing_address: client.billing_address || '',
      gst_number: client.gst_number || '',
      pan_number: client.pan_number || '',
      status: client.status,
      contract_start_date: client.contract_start_date || '',
      contract_end_date: client.contract_end_date || '',
      notes: client.notes || ''
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) {
      setFormError('Company or unit name is required');
      return;
    }

    setSaving(true);
    setFormError(null);

    const clientPayload = {
      company_name: formData.company_name.trim(),
      contact_person: formData.contact_person.trim() || null,
      phone: formData.phone.trim() || null,
      email: formData.email.trim() || null,
      billing_address: formData.billing_address.trim() || null,
      gst_number: formData.gst_number.trim().toUpperCase() || null,
      pan_number: formData.pan_number.trim().toUpperCase() || null,
      status: formData.status,
      contract_start_date: formData.contract_start_date || null,
      contract_end_date: formData.contract_end_date || null,
      notes: formData.notes.trim() || null,
      updated_at: new Date().toISOString()
    };

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('clients')
          .update(clientPayload)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const generatedId = 'CL-' + Math.random().toString(36).substring(2, 9).toUpperCase();
        const { error } = await supabase.from('clients').insert({ id: generatedId, ...clientPayload });
        if (error) throw error;
      }

      setIsModalOpen(false);
      loadClients();
      if (selectedClient && selectedClient.id === formData.id) {
        setSelectedClient({ ...selectedClient, ...clientPayload });
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save client record');
    } finally {
      setSaving(false);
    }
  };

  // Group Bills and Attendance into Monthly Folders
  const monthlyFoldersData = useMemo(() => {
    const map = new Map<string, { monthKey: string; bills: ClientBill[]; attendances: MonthlyAttendanceRecord[] }>();

    const getFolderKey = (monthStr: string, yearVal?: number | string) => {
      const clean = (monthStr || 'General').toUpperCase().trim();
      return yearVal ? `${clean}-${yearVal}` : clean;
    };

    clientBills.forEach((b) => {
      const key = getFolderKey(b.bill_month || 'General');
      if (!map.has(key)) map.set(key, { monthKey: key, bills: [], attendances: [] });
      map.get(key)!.bills.push(b);
    });

    clientAttendances.forEach((att) => {
      const key = getFolderKey(att.month, att.year);
      if (!map.has(key)) map.set(key, { monthKey: key, bills: [], attendances: [] });
      map.get(key)!.attendances.push(att);
    });

    return Array.from(map.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [clientBills, clientAttendances]);

  const toggleMonthFolder = (key: string) => {
    setOpenMonthFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Switch between Approved Clients vs Field Visits
  const activeDataset = useMemo(() => {
    return directoryView === 'CLIENTS' ? masterClients : fieldVisitsList;
  }, [directoryView, masterClients, fieldVisitsList]);

  const filteredItems = useMemo(() => {
    return activeDataset.filter((c) => {
      const matchesSearch =
        c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.contact_person && c.contact_person.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        (c.gst_number && c.gst_number.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [activeDataset, searchQuery, statusFilter]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Document Center</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-bold font-mono">
              {masterClients.length} Contract Entities
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            Enterprise dossiers, monthly billing folders, attendance musters, certified quotations, and signed agreements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-700/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} className="text-amber-300" />
          <span>New Client Dossier</span>
        </button>
      </div>

      {/* Control Bar: Primary View Segmented Control + Search & Filter */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setDirectoryView('CLIENTS')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${directoryView === 'CLIENTS'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ShieldCheck size={14} className={directoryView === 'CLIENTS' ? 'text-red-700' : 'text-slate-400'} />
            <span>Approved Clients ({masterClients.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setDirectoryView('VISITS')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer ${directoryView === 'VISITS'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <MapPin size={14} className={directoryView === 'VISITS' ? 'text-amber-600' : 'text-slate-400'} />
            <span>Field Visits ({fieldVisitsList.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              directoryView === 'CLIENTS'
                ? 'Search contracted clients by name, GSTIN...'
                : 'Search field inspection visits by site name...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FBFBF9] border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:border-red-700 focus:bg-white transition"
          />
        </div>

        {/* Status filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['ALL', 'ACTIVE', 'INACTIVE', 'TERMINATED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition shrink-0 cursor-pointer ${statusFilter === st
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 text-red-700 animate-spin" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Opening Client Document Vault...
          </span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center space-y-3">
          <Folder className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            {directoryView === 'CLIENTS' ? 'No approved contract clients found' : 'No unapproved field visit leads found'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? 'No match found for your search query.'
              : directoryView === 'CLIENTS'
                ? 'Click "+ New Client Dossier" or promote an inspection visit to onboard your first client.'
                : 'All logged visits have already been approved or no field logs exist.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openClientDossier(item)}
              className="bg-white border border-slate-200/90 rounded-2xl hover:border-red-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between overflow-hidden group shadow-xs"
            >
              {/* Folder Tab Shape Header */}
              <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${directoryView === 'CLIENTS'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                      }`}
                  >
                    <Folder className={`h-4 w-4 ${directoryView === 'CLIENTS' ? 'fill-red-200 text-red-700' : 'fill-amber-200 text-amber-700'}`} />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">
                    {item.id}
                  </span>
                </div>

                {directoryView === 'VISITS' ? (
                  <button
                    type="button"
                    onClick={(e) => handlePromoteToClient(item, e)}
                    className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition flex items-center gap-1 cursor-pointer"
                    title="Promote this lead to an Approved Client"
                  >
                    <Sparkles size={11} className="text-emerald-600" />
                    <span>Approve Client</span>
                  </button>
                ) : (
                  <span
                    className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${item.status === 'ACTIVE'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : item.status === 'INACTIVE'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                  >
                    {item.status}
                  </span>
                )}
              </div>

              {/* Folder Content */}
              <div className="p-5 space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-red-700 transition truncate">
                    {item.company_name}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.billing_address || 'Premises address not specified'}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  {item.contact_person && (
                    <div className="flex items-center gap-2 truncate">
                      <UserCheck size={13} className="text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{item.contact_person}</span>
                    </div>
                  )}
                  {item.phone && (
                    <div className="flex items-center gap-2 truncate">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      <span className="font-mono">{item.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Status Banner */}
              <div className="px-5 py-3 bg-[#FBFBF9] border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-400 text-[10px]">
                  {item.gst_number ? `GST: ${item.gst_number}` : directoryView === 'CLIENTS' ? 'Approved Contract' : 'Field Lead'}
                </span>
                <span className="text-red-700 font-bold group-hover:underline flex items-center gap-1">
                  Open Vault &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 360 Client Document Vault Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              {/* Dossier Banner */}
              <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-amber-300 uppercase">
                    <FolderOpen size={12} />
                    <span>Client Dossier &amp; Vault</span>
                  </div>
                  <h2 className="text-xl font-black">{selectedClient.company_name}</h2>
                  <p className="text-xs text-slate-400 font-mono">Dossier UID: {selectedClient.id}</p>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Action Ribbon */}
              <div className="bg-[#FBFBF9] border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => handleOpenEdit(selectedClient)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Edit Master Particulars
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/admin/attendance?unit=${encodeURIComponent(selectedClient.company_name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-xs"
                  >
                    <ClipboardList size={12} className="text-amber-300" />
                    <span>New Muster Sheet</span>
                  </Link>

                  <Link
                    href="/admin/billing"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <Receipt size={13} />
                    <span>Issue Bill</span>
                  </Link>
                </div>
              </div>

              {/* Folder Tabs Navigation */}
              <div className="flex items-center border-b border-slate-200 px-6 bg-white overflow-x-auto">
                <button
                  onClick={() => setActiveFolderTab('BILLS')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeFolderTab === 'BILLS'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <Folder className="h-4 w-4" />
                  <span>Monthly Bills &amp; Attendance ({monthlyFoldersData.length} Folders)</span>
                </button>

                <button
                  onClick={() => setActiveFolderTab('FILES')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeFolderTab === 'FILES'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <Paperclip size={14} />
                  <span>Work Orders &amp; Files ({clientFiles.length})</span>
                </button>

                <button
                  onClick={() => setActiveFolderTab('PROPOSALS')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeFolderTab === 'PROPOSALS'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <FileText size={14} />
                  <span>Quotations ({clientProposals.length})</span>
                </button>

                <button
                  onClick={() => setActiveFolderTab('SURVEYS')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeFolderTab === 'SURVEYS'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <FileCheck2 size={14} />
                  <span>Survey Dockets ({clientVisits.length})</span>
                </button>

                <button
                  onClick={() => setActiveFolderTab('STATUTORY')}
                  className={`py-3 px-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 shrink-0 cursor-pointer ${activeFolderTab === 'STATUTORY'
                    ? 'border-red-700 text-red-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                  <ShieldCheck size={14} />
                  <span>Tax &amp; Contract</span>
                </button>
              </div>

              {/* Folder Content Area */}
              <div className="p-6">
                {loadingDetails ? (
                  <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-red-700" />
                    <span>Loading documents from storage...</span>
                  </div>
                ) : (
                  <>
                    {/* TAB 1: NESTED MONTHLY BILLS & ATTENDANCE FOLDERS */}
                    {activeFolderTab === 'BILLS' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          <span>Monthly Accounting &amp; Attendance Folders</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Contains Tax Invoice + Shift Attendance Musters
                          </span>
                        </div>

                        {monthlyFoldersData.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                            <Folder className="h-8 w-8 text-slate-300 mx-auto" />
                            <p className="font-semibold text-slate-700">No monthly billing records created yet</p>
                            <p className="text-[11px] text-slate-400">
                              When you save an attendance sheet or generate an invoice, it organizes automatically into monthly folders here.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {monthlyFoldersData.map((folder) => {
                              const isOpen = Boolean(openMonthFolders[folder.monthKey]);
                              return (
                                <div
                                  key={folder.monthKey}
                                  className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs transition"
                                >
                                  {/* Folder Header */}
                                  <div
                                    onClick={() => toggleMonthFolder(folder.monthKey)}
                                    className="p-4 bg-slate-50 hover:bg-slate-100/70 flex items-center justify-between cursor-pointer select-none transition"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                                        {isOpen ? <FolderOpen size={16} /> : <Folder size={16} />}
                                      </div>
                                      <div>
                                        <span className="text-xs font-black uppercase text-slate-900 block">
                                          Period: {folder.monthKey}
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500">
                                          {folder.bills.length} Invoices &bull; {folder.attendances.length} Shift Musters
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {folder.bills.some((b) => b.status === 'PAID') && (
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                          PAID
                                        </span>
                                      )}
                                      {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                    </div>
                                  </div>

                                  {/* Folder Sub-Items */}
                                  {isOpen && (
                                    <div className="p-4 border-t border-slate-100 bg-white space-y-3 animate-in fade-in duration-150">
                                      {/* Invoices */}
                                      <div className="space-y-2">
                                        <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                          Invoices &amp; Bills
                                        </span>
                                        {folder.bills.length === 0 ? (
                                          <p className="text-[11px] text-slate-400 italic">No invoice generated for this period.</p>
                                        ) : (
                                          folder.bills.map((b) => (
                                            <div
                                              key={b.id}
                                              className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs bg-[#FBFBF9]"
                                            >
                                              <div className="flex items-center gap-2.5">
                                                <Receipt size={15} className="text-red-700 shrink-0" />
                                                <div>
                                                  <span className="font-bold text-slate-900 block">{b.bill_no}</span>
                                                  <span className="text-[10px] text-slate-400 font-mono">
                                                    Status: {b.status}
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="text-right">
                                                <span className="font-bold text-slate-900 block font-mono">
                                                  ₹{b.grand_total.toLocaleString('en-IN')}
                                                </span>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>

                                      {/* Attendance Musters */}
                                      <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <span className="text-[9.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                                          Verified Attendance &amp; OT Muster Rolls
                                        </span>
                                        {folder.attendances.length === 0 ? (
                                          <p className="text-[11px] text-slate-400 italic">No attendance sheets saved for this period.</p>
                                        ) : (
                                          folder.attendances.map((att) => (
                                            <div
                                              key={att.id}
                                              className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs bg-white hover:border-slate-300 transition"
                                            >
                                              <div className="flex items-center gap-2.5 min-w-0">
                                                <ClipboardList size={15} className="text-amber-700 shrink-0" />
                                                <div className="min-w-0">
                                                  <span className="font-bold text-slate-900 block truncate">
                                                    {att.unit_name} ({att.shift_hours}h Shift)
                                                  </span>
                                                  <span className="text-[10px] text-slate-500 font-mono">
                                                    Total Duties: <strong>{att.total_duties}</strong> &bull; Total OT: <strong>{att.total_ot_hours} hrs</strong>
                                                  </span>
                                                </div>
                                              </div>

                                              <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                  href={`/admin/attendance?unit=${encodeURIComponent(att.unit_name)}&month=${att.month}&year=${att.year}`}
                                                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 transition"
                                                >
                                                  <Printer size={11} className="text-amber-300" />
                                                  <span>View / Print</span>
                                                </Link>
                                              </div>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 2: FILES (WITH TRUE DIRECT DOWNLOAD + PRINT ENGINE) */}
                    {activeFolderTab === 'FILES' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          <span>Client Files, Work Orders &amp; Survey Transmittal Letters</span>
                          <button
                            onClick={() => {
                              setUploadFile(null);
                              setUploadTitle('');
                              setUploadError(null);
                              setIsUploadModalOpen(true);
                            }}
                            className="text-red-700 font-bold hover:underline flex items-center gap-1 normal-case text-[11px] cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>Upload Document</span>
                          </button>
                        </div>

                        {clientFiles.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                            <FileBadge size={30} className="mx-auto text-slate-300" />
                            <p className="font-semibold text-slate-700">No external documents uploaded yet</p>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                              Upload signed client work orders, service agreements, GST certificate scans, or save a Survey Transmittal Letter from the quotation desk.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {clientFiles.map((doc) => (
                              <div
                                key={doc.id}
                                className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition shadow-xs flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 block truncate">
                                      {doc.doc_title}
                                    </span>
                                    <span
                                      className={`text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${doc.file_type === 'SURVEY_LETTER'
                                          ? 'bg-red-50 text-red-800 border-red-200'
                                          : 'bg-slate-100 text-slate-700 border-slate-200'
                                        }`}
                                    >
                                      {doc.file_type === 'SURVEY_LETTER' ? 'SURVEY NOTICE' : doc.doc_category.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-400 font-mono truncate">
                                    {doc.file_name} &bull; {doc.file_size || 'File'} &bull; Added {new Date(doc.uploaded_at).toLocaleDateString('en-IN')}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {/* Download Button: Triggers True Download / PDF Save Dialog */}
                                  <button
                                    type="button"
                                    disabled={downloadingDocId === doc.id}
                                    onClick={() => handleDownloadVaultFile(doc)}
                                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold disabled:opacity-50"
                                    title={doc.file_type === 'SURVEY_LETTER' ? 'Download / Print Survey Letter' : 'Download File'}
                                  >
                                    {downloadingDocId === doc.id ? (
                                      <Loader2 size={14} className="animate-spin text-red-700" />
                                    ) : (
                                      <Download size={14} />
                                    )}
                                    <span className="text-[11px] hidden sm:inline">
                                      {doc.file_type === 'SURVEY_LETTER' ? 'Print / PDF' : 'Download'}
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition cursor-pointer"
                                    title="Delete Document"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: PROPOSALS */}
                    {activeFolderTab === 'PROPOSALS' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          <span>Certified Quotations &amp; Scope Dockets</span>
                          <span className="text-[10px] text-slate-400 font-normal">{clientProposals.length} available</span>
                        </div>

                        {clientProposals.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-1">
                            <FileText size={28} className="mx-auto text-slate-300" />
                            <p className="font-semibold text-slate-700">No quotation proposals on file</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {clientProposals.map((p) => (
                              <div
                                key={p.id}
                                className="p-4 border border-slate-200 rounded-2xl bg-white shadow-xs flex items-center justify-between gap-3 text-xs"
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">{p.id}</span>
                                  <span className="text-[11px] text-slate-400 font-mono">
                                    Dated: {new Date(p.created_at).toLocaleDateString('en-IN')}
                                  </span>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                  <div>
                                    <span className="font-bold text-slate-900 block font-mono">
                                      ₹{Number(p.total_amount).toLocaleString('en-IN')}/mo
                                    </span>
                                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                      {p.status}
                                    </span>
                                  </div>
                                  <Link
                                    href="/admin/quotations"
                                    className="p-2 text-slate-400 hover:text-red-700 rounded-lg hover:bg-slate-50 transition"
                                  >
                                    <ArrowRight size={15} />
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 4: SURVEYS */}
                    {activeFolderTab === 'SURVEYS' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800">
                          <span>Physical Survey Dockets &amp; Requisitions</span>
                          <span className="text-[10px] text-slate-400 font-normal">Rendered from inspection visits</span>
                        </div>

                        {clientVisits.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-1">
                            <FileCheck2 size={28} className="mx-auto text-slate-300" />
                            <p className="font-semibold text-slate-700">No field survey dockets found</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {clientVisits.map((v) => (
                              <div
                                key={v.id}
                                className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-red-300 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1 min-w-0">
                                  <span className="font-bold text-xs text-slate-900 block truncate">
                                    Site Survey Ref #{v.id}
                                  </span>
                                  <p className="text-[11px] text-slate-500 font-mono">
                                    Inspecting Officer: {v.representative_name || 'Field Officer'} &bull; Date: {new Date(v.timestamp).toLocaleDateString('en-IN')}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 5: STATUTORY */}
                    {activeFolderTab === 'STATUTORY' && (
                      <div className="space-y-4 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">GSTIN / Tax ID</span>
                            <span className="font-mono font-bold text-slate-800 text-sm">
                              {selectedClient.gst_number || 'NOT SPECIFIED'}
                            </span>
                          </div>
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Permanent Account (PAN)</span>
                            <span className="font-mono font-bold text-slate-800 text-sm">
                              {selectedClient.pan_number || 'NOT SPECIFIED'}
                            </span>
                          </div>
                          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 col-span-2">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Official Billing / Premises Address</span>
                            <span className="font-medium text-slate-800 text-sm leading-relaxed">
                              {selectedClient.billing_address || 'No billing address provided.'}
                            </span>
                          </div>
                        </div>

                        {selectedClient.notes && (
                          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl space-y-1">
                            <span className="block text-[10px] font-bold text-amber-900 uppercase">Operational Account Notes</span>
                            <p className="text-slate-700 leading-relaxed font-medium">{selectedClient.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Drawer Bottom Bar */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">VSF Client Document Core Module</span>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {isUploadModalOpen && selectedClient && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Upload To Client Vault</h3>
                <p className="text-[11px] text-slate-400 font-mono truncate">{selectedClient.company_name}</p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadDocument} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block uppercase text-[10px] tracking-wider mb-1">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl bg-white font-medium text-slate-900 focus:outline-none focus:border-red-700"
                >
                  <option value="WORK_ORDER">Work Order (Letter of Intent / LOI)</option>
                  <option value="AGREEMENT">Service Agreement / Contract</option>
                  <option value="GST_CERT">Client GST Registration Certificate</option>
                  <option value="CHEQUE">Cancelled Cheque Copy / Bank Proof</option>
                  <option value="MISC">Other Correspondence</option>
                </select>
              </div>

              <div>
                <label className="block uppercase text-[10px] tracking-wider mb-1">Document Label / Title</label>
                <input
                  type="text"
                  placeholder="e.g. Official Work Order - Signed August 2026"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700"
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] tracking-wider mb-1">Select File (PDF, DOCX, PNG, JPG)</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-red-50/20"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadFile(e.target.files[0]);
                        if (!uploadTitle) {
                          setUploadTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                  />
                  {uploadFile ? (
                    <div className="flex flex-col items-center gap-1 text-slate-900">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                      <span className="font-bold text-xs">{uploadFile.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {(uploadFile.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-slate-500">
                      <Upload size={24} className="text-slate-400" />
                      <span className="font-bold text-xs text-slate-700">Click to choose file</span>
                      <span className="text-[10px] text-slate-400">PDF, scanned image, or document (Up to 25 MB)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{uploading ? 'Uploading...' : 'Save to Vault'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {formData.id ? 'Edit Client Particulars' : 'Onboard New Enterprise Client'}
                </h2>
                <p className="text-xs text-slate-400">Master client ledger and statutory records</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveClient} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block uppercase text-[10px] tracking-wider mb-1">Company / Unit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haidery Township Block A"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Yusuf Khan"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98260XXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">Official Email</label>
                  <input
                    type="email"
                    placeholder="accounts@client.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10 bg-white"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="TERMINATED">TERMINATED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">GSTIN Number</label>
                  <input
                    type="text"
                    placeholder="23XXXXX0000X1Z5"
                    value={formData.gst_number}
                    onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] tracking-wider mb-1">PAN Number</label>
                  <input
                    type="text"
                    placeholder="ABCDE1234F"
                    value={formData.pan_number}
                    onChange={(e) => setFormData({ ...formData, pan_number: e.target.value })}
                    className="w-full h-10 px-3 border border-slate-300 rounded-xl font-mono text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] tracking-wider mb-1">Billing &amp; Site Address</label>
                <textarea
                  rows={2}
                  placeholder="Official site location or invoice mailing address..."
                  value={formData.billing_address}
                  onChange={(e) => setFormData({ ...formData, billing_address: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-700/10"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadow-md shadow-red-700/20"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{formData.id ? 'Save Changes' : 'Create Client'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
