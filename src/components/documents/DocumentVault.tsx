'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileCheck2,
  IdCard,
  Landmark,
  Zap,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Check
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { DocumentType } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';
import { EmptyState } from '../ui/EmptyState';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';
const CARD = 'bg-white rounded-2xl shadow-[0_2px_16px_rgba(30,42,90,0.07)]';

const TYPE_META: Record<DocumentType, { label: string; icon: typeof FileText; variant: 'blue' | 'amber' | 'purple' | 'emerald' | 'teal' | 'secondary' }> = {
  TENANCY_AGREEMENT: { label: 'Tenancy Agreement', icon: FileCheck2, variant: 'blue' },
  CNIC_TENANT: { label: 'CNIC — Tenant', icon: IdCard, variant: 'amber' },
  CNIC_OWNER: { label: 'CNIC — Owner', icon: IdCard, variant: 'purple' },
  OWNERSHIP_PROOF: { label: 'Ownership Proof', icon: Landmark, variant: 'emerald' },
  UTILITY_TRANSFER: { label: 'Utility Transfer', icon: Zap, variant: 'teal' },
  OTHER: { label: 'Other', icon: MoreHorizontal, variant: 'secondary' }
};

// ─── Add Document Modal ──────────────────────────────────────────────────────

const AddDocumentModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { units, addDocument } = usePropMAK();

  const [unitId, setUnitId] = useState(units[0]?.id || '');
  const [documentType, setDocumentType] = useState<DocumentType>('TENANCY_AGREEMENT');
  const [title, setTitle] = useState('');
  const [relatedPersonName, setRelatedPersonName] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const selectedUnit = units.find(u => u.id === unitId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !unitId || !selectedUnit) return;
    addDocument({
      unitId,
      unitName: selectedUnit.unitNumber,
      propertyName: selectedUnit.propertyName,
      documentType,
      title,
      relatedPersonName: relatedPersonName || undefined,
      fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600',
      uploadedDate: new Date().toISOString().split('T')[0],
      notes: notes || undefined
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-slate-800 text-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: HEADING }}>Upload Document</h3>
              <p className="text-[13px] text-slate-500">Tenancy agreement, CNIC, ownership proof, etc.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="font-bold text-sm bg-white">
            Close
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto text-sm">
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Unit *</label>
            <ComboBox
              options={units.map(u => ({
                value: u.id,
                label: u.unitNumber,
                sublabel: u.propertyName,
                group: u.propertyName
              }))}
              value={unitId}
              onChange={setUnitId}
              placeholder="Select a unit…"
              searchPlaceholder="Search by unit or property…"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-2 text-sm">Document Type</label>
            <TogglePills
              options={[
                { value: 'TENANCY_AGREEMENT', label: 'Tenancy Agreement' },
                { value: 'CNIC_TENANT', label: 'CNIC — Tenant' },
                { value: 'CNIC_OWNER', label: 'CNIC — Owner' },
                { value: 'OWNERSHIP_PROOF', label: 'Ownership Proof' },
                { value: 'UTILITY_TRANSFER', label: 'Utility Transfer' },
                { value: 'OTHER', label: 'Other' }
              ]}
              value={documentType}
              onChange={val => setDocumentType(val as DocumentType)}
              columns={2}
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Document Title *</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Tenancy Agreement (Stamp Paper)" required className="text-sm bg-white font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Related Person</label>
            <Input value={relatedPersonName} onChange={e => setRelatedPersonName(e.target.value)} placeholder="e.g. Tenant or owner name" className="text-sm bg-white font-medium" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1.5 text-sm">Notes</label>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" className="text-sm bg-white font-medium" />
          </div>

          <div className="p-3 rounded-xl border border-dashed border-slate-300 text-center text-[13px] text-slate-500 font-medium" style={{ background: '#EEF1FA' }}>
            File upload preview is simulated in this demo build.
          </div>

          <div className="pt-2 flex justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="default">
              <Check className="w-4 h-4 mr-1.5" />
              Save Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────

export const DocumentVault: React.FC = () => {
  const { documents, deleteDocument } = usePropMAK();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | DocumentType>('ALL');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = useMemo(() => documents.filter(d => {
    const matchSearch = !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.unitName.toLowerCase().includes(search.toLowerCase()) ||
      d.propertyName.toLowerCase().includes(search.toLowerCase()) ||
      (d.relatedPersonName?.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === 'ALL' || d.documentType === filterType;
    return matchSearch && matchType;
  }), [documents, search, filterType]);

  const selectedDoc = filtered.find(d => d.id === selectedDocId) || filtered[0] || null;

  return (
    <div className="space-y-6 text-slate-900 text-sm">

      {/* Header */}
      <div className={cn(CARD, 'p-6')}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>Document Vault</h1>
              <Badge variant="secondary">{documents.length} documents</Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">Tenancy agreements, CNIC copies &amp; ownership proofs per unit</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="default" className="font-bold text-sm shrink-0">
            <Plus className="w-4 h-4 mr-1.5" />
            Upload Document
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { label: 'Total', value: documents.length, icon: FileText },
            { label: 'Agreements', value: documents.filter(d => d.documentType === 'TENANCY_AGREEMENT').length, icon: FileCheck2 },
            { label: 'CNIC Copies', value: documents.filter(d => d.documentType === 'CNIC_TENANT' || d.documentType === 'CNIC_OWNER').length, icon: IdCard },
            { label: 'Ownership', value: documents.filter(d => d.documentType === 'OWNERSHIP_PROOF').length, icon: Landmark }
          ].map(s => (
            <div key={s.label} className="rounded-xl p-3.5 flex items-center gap-3" style={{ background: '#EEF1FA' }}>
              <s.icon className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[12px] text-slate-500 font-medium truncate">{s.label}</div>
                <div className="text-[15px] font-bold truncate" style={{ color: HEADING }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters + Table */}
      <div className={cn(CARD, 'overflow-hidden')}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 px-5 py-4" style={{ background: '#EEF1FA' }}>
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search documents, units, names..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-white"
            />
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['ALL', 'TENANCY_AGREEMENT', 'CNIC_TENANT', 'CNIC_OWNER', 'OWNERSHIP_PROOF', 'UTILITY_TRANSFER', 'OTHER'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-[13px] transition-colors cursor-pointer whitespace-nowrap',
                  filterType === t
                    ? 'bg-white text-blue-600 shadow-sm font-semibold'
                    : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {t === 'ALL' ? 'All Types' : TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* Master-detail split */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No documents found"
            description="No documents match your current filter."
            actionLabel="Reset Filter"
            onAction={() => { setSearch(''); setFilterType('ALL'); }}
          />
        ) : (
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: document list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filtered.map(doc => {
                const meta = TYPE_META[doc.documentType];
                const Icon = meta.icon;
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[12px] text-slate-500">{doc.unitName} · {doc.propertyName}</span>
                    </div>
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{doc.title}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5">{doc.relatedPersonName || 'No related person'} · {doc.uploadedDate}</div>
                    <div className="mt-2">
                      <Badge variant={meta.variant} className="text-xs whitespace-nowrap">
                        {meta.label}
                      </Badge>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedDoc && (
                <div className="space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <Badge variant={TYPE_META[selectedDoc.documentType].variant} className="text-xs whitespace-nowrap">
                          {TYPE_META[selectedDoc.documentType].label}
                        </Badge>
                      </div>
                      <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedDoc.title}</h2>
                      <p className="text-[13px] text-slate-500 mt-0.5">{selectedDoc.unitName} · {selectedDoc.propertyName}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('Delete this document?')) {
                          deleteDocument(selectedDoc.id);
                          setSelectedDocId(null);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Preview */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Preview</div>
                    <div className="rounded-xl overflow-hidden p-1.5" style={{ background: '#EEF1FA' }}>
                      <img src={selectedDoc.fileUrl} alt={selectedDoc.title} className="w-full h-56 object-cover rounded-lg" />
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Metadata */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Details</div>
                    <div className="rounded-xl divide-y divide-white text-sm" style={{ background: '#EEF1FA' }}>
                      {[
                        { label: 'Related Person', value: selectedDoc.relatedPersonName || '—' },
                        { label: 'Uploaded On', value: selectedDoc.uploadedDate },
                        { label: 'Notes', value: selectedDoc.notes || '—' }
                      ].map(row => (
                        <div key={row.label} className="flex justify-between px-4 py-2.5 gap-4">
                          <span className="text-slate-500 font-medium text-[13px] shrink-0">{row.label}</span>
                          <span className="font-semibold text-[13px] text-right" style={{ color: HEADING }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        )}
      </div>

      <AddDocumentModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  );
};
