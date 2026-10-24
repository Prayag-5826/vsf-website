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
  Camera,
  ExternalLink
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

interface AuditPhotoRecord {
  id: string;
  client_name: string;
  premise_type: string;
  tag_key: string;
  tag_label: string;
  photo_url: string;
  file_path: string;
  latitude: number | null;
  longitude: number | null;
  captured_by: string;
  captured_at: string;
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

  // View Filter: Default to 'CLIENTS'
  const [directoryView, setDirectoryView] = useState<'CLIENTS' | 'VISITS'>('CLIENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'TERMINATED'>('ALL');

  // Selected client folder modal
  const [selectedClient, setSelectedClient] = useState<ClientRecord | null>(null);
  const [activeFolderTab, setActiveFolderTab] = useState<'BILLS' | 'AUDIT_PHOTOS' | 'FILES' | 'PROPOSALS' | 'SURVEYS' | 'STATUTORY'>('BILLS');
  const [clientBills, setClientBills] = useState<ClientBill[]>([]);
  const [clientVisits, setClientVisits] = useState<ClientVisit[]>([]);
  const [clientProposals, setClientProposals] = useState<ClientProposal[]>([]);
  const [clientFiles, setClientFiles] = useState<ClientVaultFile[]>([]);
  const [clientAttendances, setClientAttendances] = useState<MonthlyAttendanceRecord[]>([]);
  const [clientAuditPhotos, setClientAuditPhotos] = useState<AuditPhotoRecord[]>([]);
  const [openMonthFolders, setOpenMonthFolders] = useState<Record<string, boolean>>({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [generatingAuditPdf, setGeneratingAuditPdf] = useState(false);
  const [previewAuditPhoto, setPreviewAuditPhoto] = useState<AuditPhotoRecord | null>(null);

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

    const registered: ClientRecord[] = (clientsRes.data || []).map((c: any) => ({
      ...c,
      status: c.status || 'ACTIVE'
    }));

    const registeredNames = new Set(registered.map((c) => c.company_name.trim().toLowerCase()));

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
      const cleanName = client.company_name.trim();

      const nameWithUnderscores = cleanName.replace(/\s+/g, '_');
      const nameWithSpaces = cleanName.replace(/_/g, ' ');

      const [billsRes, visitsRes, proposalsRes, filesRes, attendanceRes, auditPhotosRes] = await Promise.all([
        supabase
          .from('bills')
          .select('*')
          .ilike('client_name', `%${cleanName}%`)
          .order('bill_date', { ascending: false }),
        supabase
          .from('visits')
          .select('*')
          .ilike('company_name', `%${cleanName}%`)
          .order('timestamp', { ascending: false })
          .limit(25),
        supabase
          .from('proposals')
          .select('id, client_name, total_amount, status, created_at')
          .ilike('client_name', `%${cleanName}%`)
          .order('created_at', { ascending: false })
          .limit(20),
        supabase
          .from('client_documents')
          .select('*')
          .or(`client_name.ilike.%${cleanName}%,client_id.eq.${client.id}`)
          .order('uploaded_at', { ascending: false }),
        supabase
          .from('monthly_attendance')
          .select('*')
          .or(`unit_name.ilike.%${cleanName}%,client_id.eq.${client.id}`)
          .order('year', { ascending: false }),
        supabase
          .from('site_visit_photos')
          .select('*')
          .or(`client_name.ilike.%${nameWithSpaces}%,client_name.ilike.%${nameWithUnderscores}%`)
          .order('captured_at', { ascending: false })
          .limit(60)
      ]);

      setClientBills((billsRes.data as ClientBill[]) || []);
      setClientVisits((visitsRes.data as ClientVisit[]) || []);
      setClientProposals((proposalsRes.data as ClientProposal[]) || []);
      setClientFiles((filesRes.data as ClientVaultFile[]) || []);
      setClientAttendances((attendanceRes.data as MonthlyAttendanceRecord[]) || []);
      setClientAuditPhotos((auditPhotosRes.data as AuditPhotoRecord[]) || []);

      // Auto-open first month folder if present
      setOpenMonthFolders({});
    } catch (err) {
      console.error('Failed to load client dossier', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Printable Muster PDF Trigger
  const handlePrintMusterRoll = async (att: MonthlyAttendanceRecord) => {
    const printUrl = `/admin/attendance?unit=${encodeURIComponent(att.unit_name)}&month=${att.month}&year=${att.year}&autoPrint=true`;
    window.open(printUrl, '_blank');
  };

  // 1-Click Executive "Site Audit Dossier" PDF Engine
  const handlePrintAuditDossierPdf = async () => {
    if (!selectedClient) return;
    setGeneratingAuditPdf(true);

    try {
      const { data: settingsData } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
      const companyData = settingsData || {};

      const companyName = esc(companyData.company_name || 'VIDHYA SECURITY FORCE & HOUSEKEEPING SERVICES');
      const companyAddress = esc(companyData.address || '012 A BLOCK TREASURE TOWN INDORE, MP');
      const companyPhone = esc(companyData.contact_no || companyData.contact_number || companyData.phone || '9826259020');
      const companyEmail = esc(companyData.email || 'contact@vidhyasecurityforce.in');
      const psaraLicense = esc(companyData.psara_license || 'PSA/L/74/MP/2023/FEB/3/425');
      const directorName = esc(companyData.director_name || 'Anil Dhariwal');
      const sealImage = companyData.seal_image || '';
      const logoUrl = companyData.logo || '/assets/img/logo/logo.png';

      const docketRef = `VSF-AUDIT-${selectedClient.id.replace(/\D/g, '') || Date.now().toString().slice(-4)}`;
      const reportDate = new Date().toLocaleDateString('en-GB');

      const photosHtml = clientAuditPhotos.length === 0
        ? `<div style="padding: 30px; text-align: center; color: #64748b; font-size: 12px; border: 1px dashed #cbd5e1; border-radius: 8px;">
             No photographic inspection evidence logged yet for this client.
           </div>`
        : clientAuditPhotos.map((photo, index) => {
          const time = new Date(photo.captured_at).toLocaleString('en-IN');
          const gps = photo.latitude && photo.longitude
            ? `${photo.latitude.toFixed(5)}, ${photo.longitude.toFixed(5)}`
            : 'GPS Logged On-Site';

          return `
            <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: #ffffff; break-inside: avoid; page-break-inside: avoid; margin-bottom: 12px;">
             <div style="min-height: 210px; max-height: 230px; background: #0b1120; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; border-radius: 6px 6px 0 0;">
  <img
    src="${photo.photo_url}"
    alt="${esc(photo.tag_label)}"
    style="max-width: 100%; max-height: 225px; width: auto; height: auto; object-fit: contain; display: block; margin: auto;"
  />
                <div style="position: absolute; top: 6px; left: 6px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 8.5px; font-weight: bold; padding: 2px 6px; border-radius: 4px; font-family: monospace;">
                  ${esc(photo.premise_type)}
                </div>
                <div style="position: absolute; bottom: 6px; left: 6px; right: 6px; background: rgba(15,23,42,0.85); color: #ffffff; font-size: 8px; font-family: monospace; padding: 4px 6px; border-radius: 4px; line-height: 1.3;">
                  <strong style="color: #fde047; text-transform: uppercase;">${esc(photo.tag_label)}</strong><br/>
                  By: ${esc(photo.captured_by)} | ${esc(time)} | GPS: ${gps}
                </div>
              </div>
              <div style="padding: 6px 8px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 10px; display: flex; justify-content: space-between;">
                <span style="font-weight: bold; color: #1e293b; text-transform: uppercase;">Point #${index + 1}: ${esc(photo.tag_label)}</span>
                <span style="color: #991b1b; font-weight: bold; font-family: monospace;">VERIFIED</span>
              </div>
            </div>
          `;
        }).join('');

      const dossierHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Site Audit Dossier - ${esc(selectedClient.company_name)}</title>
            <style>
              @page { size: A4 portrait; margin: 12mm 14mm; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
                color: #0f172a;
                margin: 0;
                padding: 0;
                background: #ffffff;
                line-height: 1.45;
              }
              .header-table {
                width: 100%;
                border-collapse: collapse;
                border-bottom: 2.5px solid #7f1d1d;
                padding-bottom: 10px;
                margin-bottom: 12px;
              }
              .tag {
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #991b1b;
                padding: 2.5px 7px;
                font-size: 9px;
                font-weight: 900;
                border-radius: 4px;
                text-transform: uppercase;
                font-family: monospace;
              }
              .client-strip {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 10px 14px;
                margin-bottom: 14px;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              .meta-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                margin-bottom: 16px;
              }
              .meta-card {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 6px;
                padding: 8px;
                text-align: center;
              }
              .photo-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
              }
              .footer {
                margin-top: 24px;
                padding-top: 12px;
                border-top: 1.5px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                break-inside: avoid;
                page-break-inside: avoid;
              }
            </style>
          </head>
          <body>
            <table class="header-table">
              <tr>
                <td style="width: 25%; vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${logoUrl}" alt="VSF" style="width: 52px; height: 52px; object-fit: contain;" onerror="this.style.display='none'"/>
                    <div>
                      <div style="color: #991b1b; font-weight: 900; font-size: 9.5px; letter-spacing: 0.8px; font-family: monospace;">PROTECTION • SURVEILLANCE</div>
                      <div style="font-size: 13px; font-weight: 900; color: #020617;">संरक्षण एवं सुरक्षा</div>
                      <div style="font-size: 8.5px; font-family: monospace; color: #64748b;">HQ: +91 ${companyPhone}</div>
                    </div>
                  </div>
                </td>
                <td style="text-align: center; vertical-align: middle; padding: 0 8px;">
                  <div style="font-size: 14.5px; font-weight: 900; text-transform: uppercase; color: #020617;">${companyName}</div>
                  <div style="font-size: 9px; font-weight: bold; color: #475569; text-transform: uppercase; margin-top: 1px;">HEAD OFFICE: ${companyAddress}</div>
                  <div style="font-size: 8.5px; font-family: monospace; color: #64748b;">E: ${companyEmail} &bull; Web: vidhyasecurityforce.in</div>
                </td>
                <td style="width: 25%; text-align: right; vertical-align: middle;">
                  <span class="tag">PSARA MP LICENSED</span>
                  <div style="font-size: 9px; font-family: monospace; font-weight: bold; color: #334155; margin-top: 3px;">LIC: ${psaraLicense}</div>
                </td>
              </tr>
            </table>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">
              <div>
                <span style="font-size: 13px; font-weight: 900; text-transform: uppercase; color: #7f1d1d; letter-spacing: 0.5px;">
                  EXECUTIVE PHYSICAL SITE INSPECTION &amp; AUDIT DOSSIER
                </span>
              </div>
              <div style="font-family: monospace; font-size: 10.5px; text-align: right;">
                <span style="color: #64748b;">REF: </span><strong>${esc(docketRef)}</strong> &bull;
                <span style="color: #64748b;">DATE: </span><strong>${esc(reportDate)}</strong>
              </div>
            </div>

            <div class="client-strip">
              <div>
                <span style="font-size: 8.5px; font-family: monospace; font-weight: 900; text-transform: uppercase; color: #64748b; display: block;">AUDITED ESTABLISHMENT</span>
                <span style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #0f172a;">${esc(selectedClient.company_name)}</span>
                <span style="font-size: 10.5px; color: #475569; display: block; margin-top: 2px;">
                  Location: ${esc(selectedClient.billing_address || 'Premises Registered with HQ')}
                </span>
              </div>
              <div style="text-align: right; font-family: monospace; font-size: 10px;">
                <span style="display: block; color: #64748b;">STATUS: <strong style="color: #15803d;">CONTRACT ACTIVE</strong></span>
                <span style="display: block; color: #64748b;">TOTAL POINTS: <strong>${clientAuditPhotos.length} VERIFIED</strong></span>
              </div>
            </div>

            <div class="meta-grid">
              <div class="meta-card">
                <span style="font-size: 8.5px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Inspections Logged</span>
                <span style="font-size: 16px; font-weight: 900; color: #020617; font-family: monospace;">${clientAuditPhotos.length}</span>
              </div>
              <div class="meta-card">
                <span style="font-size: 8.5px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Surveillance Mode</span>
                <span style="font-size: 11px; font-weight: 900; color: #020617; font-family: monospace;">GEOTAGGED GPS</span>
              </div>
              <div class="meta-card">
                <span style="font-size: 8.5px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Audit Standard</span>
                <span style="font-size: 11px; font-weight: 900; color: #7f1d1d; font-family: monospace;">PSARA COMPLIANT</span>
              </div>
              <div class="meta-card">
                <span style="font-size: 8.5px; font-weight: bold; color: #64748b; text-transform: uppercase; display: block;">Last Inspected</span>
                <span style="font-size: 11px; font-weight: 900; color: #020617; font-family: monospace;">
                  ${clientAuditPhotos[0] ? new Date(clientAuditPhotos[0].captured_at).toLocaleDateString('en-GB') : 'CURRENT'}
                </span>
              </div>
            </div>

            <div style="margin-bottom: 8px;">
              <span style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #1e293b; letter-spacing: 0.5px; display: block; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 10px;">
                Photographic Audit Evidence &amp; Premise Telemetry
              </span>
              <div class="photo-grid">
                ${photosHtml}
              </div>
            </div>

            <div class="footer">
              <div style="font-size: 9px; font-family: monospace; color: #64748b;">
                <div style="font-weight: bold; color: #0f172a; font-size: 9.5px;">${companyName}</div>
                <div style="color: #991b1b; font-weight: bold; text-transform: uppercase;">Official Field Inspection &amp; Guard Turnout Report</div>
                <div>Automated HQ Dossier Docket Ref: ${esc(docketRef)}</div>
              </div>
              <div style="text-align: center; width: 220px;">
                <div style="font-size: 9px; font-weight: bold; text-transform: uppercase; color: #475569; margin-bottom: 2px;">Authorized Field Inspector</div>
                <div style="height: 56px; display: flex; align-items: center; justify-content: center;">
                  ${sealImage ? `
                    <img src="${sealImage}" alt="Official Seal" style="max-height: 54px; max-width: 100%; object-fit: contain;"/>
                  ` : `
                    <div style="border: 1px dashed #fca5a5; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 8.5px; color: #991b1b;">[ OFFICIAL SEAL ]</div>
                  `}
                </div>
                <div style="border-top: 1.5px solid #0f172a; padding-top: 2px;">
                  <div style="font-size: 11px; font-weight: 900; text-transform: uppercase; color: #020617;">${directorName}</div>
                  <div style="font-size: 9px; font-family: monospace; font-weight: bold; color: #991b1b; text-transform: uppercase;">Managing Director / Field Admin</div>
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
        }, 350);
      };
      frame.srcdoc = dossierHtml;
      document.body.appendChild(frame);
    } catch (err: any) {
      console.error('Audit PDF error:', err);
      alert(`Could not generate audit dossier: ${err.message || 'Error creating document'}`);
    } finally {
      setGeneratingAuditPdf(false);
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

  // Direct Downloader: Handles PDFs, Images and skips raw JSON dumps
  const handleDownloadVaultFile = async (doc: ClientVaultFile) => {
    setDownloadingDocId(doc.id);
    try {
      // If someone clicks on an attendance muster file inside documents, trigger printable muster
      if (doc.doc_category === 'ATTENDANCE_MUSTER' || doc.file_name?.endsWith('.json')) {
        const matchingAtt = clientAttendances.find((a) => doc.doc_title.includes(a.month));
        if (matchingAtt) {
          handlePrintMusterRoll(matchingAtt);
          return;
        }
      }

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

  // Group Bills and Attendance into structured Monthly Folders
  const monthlyFoldersData = useMemo(() => {
    const map = new Map<string, { monthKey: string; bills: ClientBill[]; attendances: MonthlyAttendanceRecord[] }>();

    const normalizeMonth = (val: string) => {
      if (!val) return 'CURRENT';
      // Match 2026-10 or OCT-2026 format cleanly
      return val.trim().toUpperCase();
    };

    clientBills.forEach((b) => {
      const key = normalizeMonth(b.bill_month || 'GENERAL');
      if (!map.has(key)) map.set(key, { monthKey: key, bills: [], attendances: [] });
      map.get(key)!.bills.push(b);
    });

    clientAttendances.forEach((att) => {
      const key = `${att.month.toUpperCase()}-${att.year}`;
      if (!map.has(key)) map.set(key, { monthKey: key, bills: [], attendances: [] });
      map.get(key)!.attendances.push(att);
    });

    return Array.from(map.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [clientBills, clientAttendances]);

  // Filter out ATTENDANCE_MUSTER JSON files from "Work Orders & Contracts" to eliminate duplication
  const filteredClientVaultFiles = useMemo(() => {
    return clientFiles.filter((f) => f.doc_category !== 'ATTENDANCE_MUSTER' && !f.file_name.endsWith('.json'));
  }, [clientFiles]);

  const toggleMonthFolder = (key: string) => {
    setOpenMonthFolders((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
            Enterprise client dossiers, verified duty muster rolls, photographic inspections, and tax invoices.
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

      {/* Control Bar */}
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

      {/* Grid of Client Cards */}
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

      {/* Redesigned 2-Column Master-Detail Client Vault Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex justify-end z-50">
          <div className="w-full max-w-5xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Top Bar */}
            <div className="shrink-0 border-b border-slate-200">
              <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4">
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

              {/* Action Buttons */}
              <div className="bg-[#FAF9F5] px-5 py-2.5 flex items-center justify-between gap-3 flex-wrap">
                <button
                  onClick={() => handleOpenEdit(selectedClient)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                >
                  Edit Details
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={generatingAuditPdf}
                    onClick={handlePrintAuditDossierPdf}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    {generatingAuditPdf ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
                    <span>Audit Report PDF</span>
                  </button>

                  <Link
                    href={`/admin/attendance?unit=${encodeURIComponent(selectedClient.company_name)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer shadow-2xs"
                  >
                    <ClipboardList size={12} className="text-amber-300" />
                    <span>New Muster</span>
                  </Link>

                  <Link
                    href="/admin/billing"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer shadow-2xs"
                  >
                    <Receipt size={13} />
                    <span>Issue Bill</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Two-Column Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Vertical Category Navigation (Clearer Names) */}
              <div className="w-64 shrink-0 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-y-auto">
                <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Dossier Sections
                </div>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('BILLS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'BILLS'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder size={15} className={activeFolderTab === 'BILLS' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Monthly Invoices &amp; Attendance</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {monthlyFoldersData.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('AUDIT_PHOTOS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'AUDIT_PHOTOS'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Camera size={15} className={activeFolderTab === 'AUDIT_PHOTOS' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Site Inspection Photos</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-red-100 text-red-800 font-bold">
                    {clientAuditPhotos.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('FILES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'FILES'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Paperclip size={15} className={activeFolderTab === 'FILES' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Work Orders &amp; Contracts</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {filteredClientVaultFiles.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('PROPOSALS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'PROPOSALS'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileText size={15} className={activeFolderTab === 'PROPOSALS' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Quotations</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {clientProposals.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('SURVEYS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'SURVEYS'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck2 size={15} className={activeFolderTab === 'SURVEYS' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Field Visit Reports</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold">
                    {clientVisits.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFolderTab('STATUTORY')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeFolderTab === 'STATUTORY'
                    ? 'bg-white text-red-700 shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={15} className={activeFolderTab === 'STATUTORY' ? 'text-red-700' : 'text-slate-400'} />
                    <span>Company &amp; Tax Info</span>
                  </div>
                </button>
              </div>

              {/* Right Workspace Stage */}
              <div className="flex-1 p-6 overflow-y-auto bg-white">
                {loadingDetails ? (
                  <div className="py-16 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 size={24} className="animate-spin text-red-700" />
                    <span>Loading documents from storage...</span>
                  </div>
                ) : (
                  <>
                    {/* TAB 1: MONTHLY INVOICES & ATTENDANCE */}
                    {activeFolderTab === 'BILLS' && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-black uppercase text-slate-900 block">
                              Monthly Invoices &amp; Verified Musters
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Each monthly folder groups the Tax Bill alongside the printable Duty Muster Sheet.
                            </span>
                          </div>
                        </div>

                        {monthlyFoldersData.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                            <Folder className="h-8 w-8 text-slate-300 mx-auto" />
                            <p className="font-semibold text-slate-700">No monthly records yet</p>
                            <p className="text-[11px] text-slate-400">
                              Save an attendance sheet or issue a bill to see it organized by month here.
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
                                  {/* Folder Banner */}
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
                                          {folder.bills.length} Invoices &bull; {folder.attendances.length} Muster Sheets
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

                                  {/* Folder Body: Split into Invoices vs Duty Musters */}
                                  {isOpen && (
                                    <div className="p-4 border-t border-slate-100 bg-white space-y-4 animate-in fade-in duration-150">
                                      {/* Tax Invoices Section */}
                                      <div className="space-y-2">
                                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                                          1. Tax Invoices &amp; Bills
                                        </span>
                                        {folder.bills.length === 0 ? (
                                          <p className="text-[11px] text-slate-400 italic">No tax invoice generated for this period.</p>
                                        ) : (
                                          folder.bills.map((b) => (
                                            <div
                                              key={b.id}
                                              className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs bg-[#FAF9F5]"
                                            >
                                              <div className="flex items-center gap-2.5">
                                                <Receipt size={16} className="text-red-700 shrink-0" />
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

                                      {/* Duty Musters Section with Direct PDF Action */}
                                      <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
                                          2. Verified Guard Attendance &amp; OT Muster Roll
                                        </span>
                                        {folder.attendances.length === 0 ? (
                                          <p className="text-[11px] text-slate-400 italic">No attendance sheets saved for this month.</p>
                                        ) : (
                                          folder.attendances.map((att) => (
                                            <div
                                              key={att.id}
                                              className="p-3 border border-slate-200 rounded-xl flex items-center justify-between text-xs bg-white hover:border-slate-300 transition"
                                            >
                                              <div className="flex items-center gap-2.5 min-w-0">
                                                <ClipboardList size={16} className="text-amber-700 shrink-0" />
                                                <div className="min-w-0">
                                                  <span className="font-bold text-slate-900 block truncate">
                                                    {att.unit_name} ({att.shift_hours}h Shift)
                                                  </span>
                                                  <span className="text-[10px] text-slate-500 font-mono">
                                                    Total Duties: <strong>{att.total_duties}</strong> &bull; Total OT: <strong>{att.total_ot_hours} hrs</strong>
                                                  </span>
                                                </div>
                                              </div>

                                              {/* Action: Print or View directly without downloading JSON */}
                                              <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                  type="button"
                                                  onClick={() => handlePrintMusterRoll(att)}
                                                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer"
                                                  title="Open Printable Attendance Sheet (PDF)"
                                                >
                                                  <Printer size={12} className="text-amber-300" />
                                                  <span>Print / Save PDF</span>
                                                </button>
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

                    {/* TAB 2: SITE INSPECTION PHOTOS */}
                    {activeFolderTab === 'AUDIT_PHOTOS' && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-xs font-black uppercase text-slate-900 block">
                              Site Inspection Photos &amp; Patrol Evidence
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Real-time geotagged photos captured on-site by field staff.
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={generatingAuditPdf || clientAuditPhotos.length === 0}
                            onClick={handlePrintAuditDossierPdf}
                            className="px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
                          >
                            <Printer size={13} />
                            <span>Export Audit PDF</span>
                          </button>
                        </div>

                        {clientAuditPhotos.length === 0 ? (
                          <div className="p-10 bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-center space-y-2">
                            <Camera size={32} className="mx-auto text-slate-300" />
                            <p className="font-bold text-xs uppercase text-slate-700">No on-site audit photos recorded yet</p>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                              When field inspectors take angle photos for {selectedClient.company_name} using the mobile app, they stream automatically into this vault.
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                            {clientAuditPhotos.map((photo) => (
                              <div
                                key={photo.id}
                                onClick={() => setPreviewAuditPhoto(photo)}
                                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-red-700 transition cursor-pointer flex flex-col justify-between"
                              >
                                <div className="relative aspect-video bg-black overflow-hidden">
                                  <img
                                    src={photo.photo_url}
                                    alt={photo.tag_label}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    loading="lazy"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[8.5px] font-mono font-bold text-white uppercase">
                                    {photo.premise_type}
                                  </div>

                                  {photo.latitude && (
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 text-[8px] font-mono font-bold flex items-center gap-1">
                                      <MapPin size={8} />
                                      <span>GPS</span>
                                    </div>
                                  )}

                                  <div className="absolute bottom-2 left-2 right-2 text-white">
                                    <p className="text-[11px] font-bold uppercase truncate drop-shadow-xs">
                                      {photo.tag_label}
                                    </p>
                                  </div>
                                </div>

                                <div className="p-2.5 bg-white space-y-1 border-t border-slate-100">
                                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                                    <span className="truncate">By: {photo.captured_by}</span>
                                    <span className="shrink-0">{new Date(photo.captured_at).toLocaleDateString('en-GB')}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB 3: WORK ORDERS & CONTRACTS (NO DUPLICATE JSON FILES) */}
                    {activeFolderTab === 'FILES' && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                          <span>Client Work Orders, Agreements &amp; Scans</span>
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

                        {filteredClientVaultFiles.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                            <FileBadge size={30} className="mx-auto text-slate-300" />
                            <p className="font-semibold text-slate-700">No contracts or work orders uploaded</p>
                            <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                              Upload signed client work orders, service agreements, GST certificate copies, or cancelled cheques here.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {filteredClientVaultFiles.map((doc) => (
                              <div
                                key={doc.id}
                                className="p-4 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition shadow-xs flex items-center justify-between gap-3 text-xs"
                              >
                                <div className="space-y-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-900 block truncate">
                                      {doc.doc_title}
                                    </span>
                                    <span className="text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border bg-slate-100 text-slate-700 border-slate-200">
                                      {doc.doc_category.replace('_', ' ')}
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-400 font-mono truncate">
                                    {doc.file_name} &bull; {doc.file_size || 'File'} &bull; Added {new Date(doc.uploaded_at).toLocaleDateString('en-IN')}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    disabled={downloadingDocId === doc.id}
                                    onClick={() => handleDownloadVaultFile(doc)}
                                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer flex items-center gap-1 font-bold disabled:opacity-50"
                                    title="Download File"
                                  >
                                    {downloadingDocId === doc.id ? (
                                      <Loader2 size={14} className="animate-spin text-red-700" />
                                    ) : (
                                      <Download size={14} />
                                    )}
                                    <span className="text-[11px] hidden sm:inline">Download</span>
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

                    {/* TAB 4: QUOTATIONS */}
                    {activeFolderTab === 'PROPOSALS' && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                          <span>Certified Quotations &amp; Proposals</span>
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

                    {/* TAB 5: FIELD VISIT REPORTS */}
                    {activeFolderTab === 'SURVEYS' && (
                      <div className="space-y-4 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100">
                          <span>Field Officer Visit Logs</span>
                          <span className="text-[10px] text-slate-400 font-normal">Physical audits and survey visits</span>
                        </div>

                        {clientVisits.length === 0 ? (
                          <div className="p-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-1">
                            <FileCheck2 size={28} className="mx-auto text-slate-300" />
                            <p className="font-semibold text-slate-700">No field visit records found</p>
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
                                    Inspection Visit #{v.id}
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

                    {/* TAB 6: COMPANY & TAX INFO */}
                    {activeFolderTab === 'STATUTORY' && (
                      <div className="space-y-4 text-xs animate-in fade-in duration-150">
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
                            <span className="block text-[10px] font-bold text-slate-400 uppercase">Official Site &amp; Billing Address</span>
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

            {/* Bottom Bar */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">VSF Client Document Core Module</span>
              <button
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-2xs"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Audit Photo Preview Modal */}
      {previewAuditPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewAuditPhoto(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video bg-black">
              <img
                src={previewAuditPhoto.photo_url}
                alt={previewAuditPhoto.tag_label}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black uppercase text-slate-900">
                    {previewAuditPhoto.tag_label}
                  </h3>
                  <p className="text-xs font-bold text-red-700 uppercase">
                    {previewAuditPhoto.client_name}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 text-[10px] font-mono font-bold uppercase">
                  {previewAuditPhoto.premise_type}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-[#FAF9F5] rounded-xl border border-slate-200 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Inspector</span>
                  <span className="font-bold text-slate-800">{previewAuditPhoto.captured_by}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold">Timestamp</span>
                  <span className="font-bold text-slate-800">
                    {new Date(previewAuditPhoto.captured_at).toLocaleString('en-IN')}
                  </span>
                </div>
                {previewAuditPhoto.latitude && (
                  <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center gap-1.5 text-emerald-800">
                    <MapPin size={12} className="text-emerald-700" />
                    <span>Lat: {previewAuditPhoto.latitude.toFixed(6)}, Lng: {previewAuditPhoto.longitude?.toFixed(6)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href={previewAuditPhoto.photo_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download size={13} />
                  <span>Download High-Res Original</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewAuditPhoto(null)}
                  className="px-5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close Inspection
                </button>
              </div>
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
                <h3 className="text-sm font-black text-slate-900 uppercase">Upload Document</h3>
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
                  <span>{uploading ? 'Uploading...' : 'Save Document'}</span>
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
                  <label className="block uppercase text-[10px] tracking-wider mb-1">Permanent Account (PAN)</label>
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
