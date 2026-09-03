'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import {
  FileCheck2,
  UploadCloud,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  Plus,
  X,
  Layers,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface DocumentRecord {
  id: string;
  title: string;
  category: 'PSARA' | 'LABOUR' | 'TAX' | 'TRAINING';
  category_label: string;
  authority: string;
  reg_number: string;
  validity: string;
  legal_basis: string;
  description: string;
  pages: string[];
  key_highlights: string[];
  is_public: boolean;
}

const categoryLabels: Record<string, string> = {
  PSARA: 'Home Department & PSARA',
  LABOUR: 'Labor & Social Security',
  TAX: 'Tax & Commercial Compliance',
  TRAINING: 'Mandated Training',
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'PSARA' | 'LABOUR' | 'TAX' | 'TRAINING'>('PSARA');
  const [authority, setAuthority] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [validity, setValidity] = useState('');
  const [legalBasis, setLegalBasis] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState<string[]>(['']);
  const [files, setFiles] = useState<FileList | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setDocuments(data as DocumentRecord[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const addHighlightField = () => setHighlights([...highlights, '']);
  const removeHighlightField = (index: number) =>
    setHighlights(highlights.filter((_, i) => i !== index));
  const updateHighlight = (index: number, value: string) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const handleUploadAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) {
      alert('Please upload at least one page image/pdf for this certificate.');
      return;
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];

      // 1. Upload all page files to Supabase Storage
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${category.toLowerCase()}-${Date.now()}-p${i + 1}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('compliance-vault')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('compliance-vault')
          .getPublicUrl(filePath);

        uploadedUrls.push(urlData.publicUrl);
      }

      // 2. Insert Complete Metadata Record
      const { error: insertError } = await supabase.from('documents').insert([
        {
          title,
          category,
          category_label: categoryLabels[category] || category,
          authority,
          reg_number: regNumber,
          validity,
          legal_basis: legalBasis,
          description,
          pages: uploadedUrls,
          key_highlights: highlights.filter((h) => h.trim() !== ''),
          is_public: isPublic,
        },
      ]);

      if (insertError) throw insertError;

      // Reset form
      setTitle('');
      setAuthority('');
      setRegNumber('');
      setValidity('');
      setLegalBasis('');
      setDescription('');
      setHighlights(['']);
      setFiles(null);
      fetchDocs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error uploading document';
      alert(msg);
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('documents')
      .update({ is_public: !currentStatus })
      .eq('id', id);

    if (!error) {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_public: !currentStatus } : d))
      );
    }
  };

  const deleteDocument = async (id: string) => {
    if (!confirm('Permanently delete this certificate record?')) return;
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (!error) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Compliance &amp; License Vault Manager
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Add, configure, and manage statutory accreditation cards on the public inspection page.
        </p>
      </div>

      {/* Creation Form */}
      <form
        onSubmit={handleUploadAndSave}
        className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6"
      >
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Register New Certificate Document
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. PSARA Private Security Agency Licence"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Classification Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as typeof category)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            >
              <option value="PSARA">PSARA &amp; Home Dept</option>
              <option value="LABOUR">Labor &amp; Social Security (EPF/ESIC)</option>
              <option value="TAX">Tax &amp; Commercial (GST/Gumasta)</option>
              <option value="TRAINING">Mandated Training &amp; Arms</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Issuing Authority
            </label>
            <input
              type="text"
              required
              value={authority}
              onChange={(e) => setAuthority(e.target.value)}
              placeholder="e.g. Controlling Authority / Home Dept, Govt. of MP"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Registration / License Number
            </label>
            <input
              type="text"
              required
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="e.g. PSA/L/74/MP/2023/FEB/3/425"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Validity / Operational Term
            </label>
            <input
              type="text"
              required
              value={validity}
              onChange={(e) => setValidity(e.target.value)}
              placeholder="e.g. Valid Thru Aug 2027 (Entire MP)"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Legal Basis / Statutory Act
            </label>
            <input
              type="text"
              required
              value={legalBasis}
              onChange={(e) => setLegalBasis(e.target.value)}
              placeholder="e.g. Section 7(2) of PSARA 2005"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Public Card Description
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Official statutory licence granting legal authority to deploy static, armed, and physical security guards across all 55 districts..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Highlights List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Statutory Key Highlights (Checklist)
            </label>
            <button
              type="button"
              onClick={addHighlightField}
              className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Add Highlight
            </button>
          </div>
          <div className="space-y-2">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateHighlight(index, e.target.value)}
                  placeholder={`Statutory Highlight #${index + 1}`}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-600"
                />
                {highlights.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeHighlightField(index)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* File Upload (Multi-page support) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Document Scan Pages (Select 1 or more images/PDFs in page order)
          </label>
          <input
            type="file"
            required
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-slate-700 dark:file:text-slate-200 hover:file:bg-slate-200"
          />
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
            />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Publish directly to public certification inspection vault
            </span>
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Uploading &amp; Saving...
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                Upload &amp; Publish Record
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Current Document Repository ({documents.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Certificate</th>
                <th className="py-3.5 px-5">Reg Number</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Pages</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                    Loading vault records...
                  </td>
                </tr>
              ) : documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{doc.authority}</div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {doc.reg_number}
                    </td>
                    <td className="py-3.5 px-5 uppercase font-mono text-[10px]">
                      {doc.category}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <Layers className="w-3 h-3" />
                        {doc.pages?.length || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => toggleVisibility(doc.id, doc.is_public)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                          doc.is_public
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {doc.is_public ? (
                          <>
                            <Eye className="w-3 h-3" /> Public
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-2">
                      {doc.pages?.[0] && (
                        <a
                          href={doc.pages[0]}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Inspect Primary Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="inline-flex p-1.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    No documents uploaded yet. Use the form above to add your first statutory accreditation card.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
