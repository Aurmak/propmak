'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  MapPin,
  ShieldCheck,
  Search,
  Edit2,
  Trash2
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Stakeholder } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { EmptyState } from '../ui/EmptyState';
import { EditStakeholderModal } from './EditStakeholderModal';
import { cn } from '@/lib/utils';

const HEADING = '#1B2559';

export const StakeholderDirectory: React.FC<{ onOpenWhatsApp?: (msg: string, phone?: string) => void }> = ({
  onOpenWhatsApp
}) => {
  const { stakeholders, addStakeholder, updateStakeholder, deleteStakeholder, units, searchQuery, setSearchQuery } = usePropMAK();

  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('Central District');
  const [newRole, setNewRole] = useState<Stakeholder['role']>('TENANT');
  const [newNotes, setNewNotes] = useState('');

  const filteredStakeholders = stakeholders.filter(s => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = s.name.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q));
      if (!match) return false;
    }

    if (filterRole === 'ALL') return true;
    if (filterRole === 'LANDLORD') return s.role === 'OWNER_OVERSEAS' || s.role === 'OWNER_LOCAL';
    if (filterRole === 'TENANT') return s.role === 'TENANT' || s.role === 'OCCUPIER';
    if (filterRole === 'STAFF') return s.role === 'COLLECTOR';
    return true;
  });

  const selectedStakeholder = filteredStakeholders.find(s => s.id === selectedStakeholderId) || filteredStakeholders[0] || null;

  const getRoleBadge = (role: Stakeholder['role']) => {
    switch (role) {
      case 'OWNER_OVERSEAS':
        return <Badge variant="blue">Overseas Landlord</Badge>;
      case 'OWNER_LOCAL':
        return <Badge variant="secondary">Local Landlord</Badge>;
      case 'TENANT':
        return <Badge variant="emerald">Tenant / Resident</Badge>;
      case 'OCCUPIER':
        return <Badge variant="outline">Occupier</Badge>;
      case 'COLLECTOR':
        return <Badge variant="amber">Field Collector</Badge>;
      case 'BUYER':
        return <Badge variant="purple">Investor / Buyer</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    addStakeholder({
      name: newName,
      phone: newPhone,
      whatsapp: newPhone,
      email: newEmail,
      location: newLocation,
      role: newRole,
      notes: newNotes
    });

    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewNotes('');
    setIsAddUserModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-900 text-sm animate-in fade-in">
      
      {/* Top Banner */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold" style={{ color: HEADING }}>
                Stakeholder & User Directory
              </h1>
              <Badge variant="secondary">
                {stakeholders.length} Registered Users
              </Badge>
            </div>
            <p className="text-[13px] text-slate-500 mt-1">
              Centralized stakeholder registry: Overseas & local landlords, active tenants, occupiers, and agency field collectors
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddUserModalOpen(true)}
            className="font-bold text-sm"
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            <span>Add New User</span>
          </Button>
        </div>
      </Card>

      {/* Filter & Search Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* Role Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {[
              { id: 'ALL', label: `All Users (${stakeholders.length})` },
              { id: 'LANDLORD', label: 'Landlords & Owners' },
              { id: 'TENANT', label: 'Tenants & Residents' },
              { id: 'STAFF', label: 'Agency Field Staff' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterRole(tab.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-[13px] whitespace-nowrap transition-colors cursor-pointer',
                  filterRole === tab.id ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user name, phone, city..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Master-Detail: Stakeholder List + Profile Inspector */}
      {filteredStakeholders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No stakeholders found"
          description="No users or landlords match your current filter."
          actionLabel="Reset User Filter"
          onAction={() => {
            setFilterRole('ALL');
            setSearchQuery('');
          }}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="flex flex-col sm:flex-row" style={{ minHeight: '560px' }}>

            {/* LEFT: stakeholder list */}
            <div className="w-full sm:w-[340px] shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {filteredStakeholders.map((s) => {
                const isSelected = selectedStakeholder?.id === s.id;
                const ownedUnits = units.filter(u => u.owner.id === s.id || u.owner.name === s.name);
                const rentedUnits = units.filter(u => u.renter?.id === s.id || u.renter?.name === s.name);

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedStakeholderId(s.id)}
                    className={cn(
                      'w-full text-left px-4 py-3.5 border-b border-l-4 border-slate-100 cursor-pointer transition-colors block',
                      isSelected ? 'bg-blue-50 border-l-blue-600' : 'border-l-transparent hover:bg-slate-50'
                    )}
                  >
                    <div className="text-[14px] font-semibold truncate" style={{ color: isSelected ? '#2563EB' : HEADING }}>{s.name}</div>
                    <div className="text-[12px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{s.location} · {s.phone}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      {getRoleBadge(s.role)}
                      {ownedUnits.length > 0 && (
                        <Badge variant="blue">{ownedUnits.length} Owned Unit{ownedUnits.length > 1 ? 's' : ''}</Badge>
                      )}
                      {ownedUnits.length === 0 && rentedUnits.length > 0 && (
                        <Badge variant="emerald">{rentedUnits[0].unitNumber}</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT: detail panel */}
            <div className="flex-1 min-w-0 p-6 overflow-y-auto" style={{ maxHeight: '720px' }}>
              {selectedStakeholder && (
                <div className="space-y-6">

                  {/* Header */}
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {getRoleBadge(selectedStakeholder.role)}
                      <Badge variant="secondary">
                        <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                        <span>Verified Profile</span>
                      </Badge>
                    </div>
                    <h2 className="text-lg font-bold" style={{ color: HEADING }}>{selectedStakeholder.name}</h2>
                    <p className="text-[13px] text-slate-500 mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedStakeholder.location} • {selectedStakeholder.phone}
                    </p>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Contact information */}
                  <div>
                    <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">Contact Information</div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                      <div><span className="text-slate-400 block">Phone / Mobile</span><span className="font-medium font-mono" style={{ color: HEADING }}>{selectedStakeholder.phone}</span></div>
                      <div><span className="text-slate-400 block">Email Address</span><span className="font-medium" style={{ color: HEADING }}>{selectedStakeholder.email || 'Not on file'}</span></div>
                      <div><span className="text-slate-400 block">Primary Role</span><span className="font-medium" style={{ color: HEADING }}>{selectedStakeholder.role.replace(/_/g, ' ')}</span></div>
                      <div><span className="text-slate-400 block">City / Base</span><span className="font-medium" style={{ color: HEADING }}>{selectedStakeholder.location}</span></div>
                    </div>

                    {selectedStakeholder.notes && (
                      <div className="mt-3.5">
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                          Management Notes &amp; Special Instructions
                        </div>
                        <p className="text-slate-700 text-[13px] leading-relaxed font-medium rounded-xl p-3" style={{ background: '#EEF1FA' }}>
                          {selectedStakeholder.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Associated Portfolio Properties */}
                  {(() => {
                    const owned = units.filter(u => u.owner.id === selectedStakeholder.id || u.owner.name === selectedStakeholder.name);
                    const rented = units.filter(u => u.renter?.id === selectedStakeholder.id || u.renter?.name === selectedStakeholder.name);

                    return (
                      <div>
                        <div className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2.5">
                          Associated Property Assets ({owned.length + rented.length} Units)
                        </div>

                        <div className="space-y-3">
                          {owned.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[12px] font-semibold text-slate-400 block">Owned Units (Landlord):</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {owned.map(u => (
                                  <div key={u.id} className="p-3 bg-blue-50 rounded-xl text-sm">
                                    <span className="font-bold text-blue-900 block">{u.unitNumber}</span>
                                    <span className="text-xs text-blue-700 block">{u.propertyName}</span>
                                    <span className="text-xs font-bold block mt-1" style={{ color: HEADING }}>Rent: Rs. {u.monthlyRent.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {rented.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-[12px] font-semibold text-slate-400 block">Current Tenancy (Resident):</span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {rented.map(u => (
                                  <div key={u.id} className="p-3 bg-emerald-50 rounded-xl text-sm">
                                    <span className="font-bold text-emerald-900 block">{u.unitNumber}</span>
                                    <span className="text-xs text-emerald-700 block">{u.propertyName}</span>
                                    <span className="text-xs font-bold block mt-1" style={{ color: HEADING }}>Rent: Rs. {u.monthlyRent.toLocaleString()}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {owned.length === 0 && rented.length === 0 && (
                            <div className="p-4 bg-slate-50 rounded-xl text-slate-500 text-sm italic">
                              No currently linked properties in the portfolio.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="h-px bg-slate-100" />

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      variant="default"
                      className="w-full sm:flex-1 font-bold text-base h-12"
                      onClick={() => setEditingStakeholder(selectedStakeholder)}
                    >
                      <Edit2 className="w-5 h-5 mr-2" />
                      <span>Edit Stakeholder Record</span>
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full sm:w-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm h-12"
                      onClick={() => {
                        if (confirm(`Remove stakeholder ${selectedStakeholder.name} from directory?`)) {
                          deleteStakeholder(selectedStakeholder.id);
                          setSelectedStakeholderId(null);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <span>Delete</span>
                    </Button>
                  </div>

                </div>
              )}
            </div>

          </div>
        </Card>
      )}

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-sm text-slate-900">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

            <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: HEADING }}>Add New Stakeholder</h3>
                  <p className="text-sm text-slate-500">Register landlord, tenant, or staff member</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserModalOpen(false)}
                className="font-bold text-sm bg-white"
              >
                Close
              </Button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="p-6 space-y-4 text-sm overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Full Legal Name</label>
                <Input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Dr. Tariq Mahmood"
                  required
                  className="text-sm bg-white font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-sm">Direct Phone / Mobile</label>
                  <Input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    required
                    className="text-sm bg-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-sm">Email Address</label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="text-sm bg-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-sm">Stakeholder Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as Stakeholder['role'])}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 cursor-pointer"
                    style={{ color: HEADING }}
                  >
                    <option value="OWNER_OVERSEAS">Overseas Landlord</option>
                    <option value="OWNER_LOCAL">Local Landlord</option>
                    <option value="TENANT">Tenant / Resident</option>
                    <option value="OCCUPIER">Occupier</option>
                    <option value="COLLECTOR">Field Cash Collector</option>
                    <option value="BUYER">Investor / Buyer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-sm">City / Country Base</label>
                  <Input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. London, UK"
                    className="text-sm bg-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-sm">Operational Notes & Terms</label>
                <Textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Special payout arrangements, tax NTN, overseas contact times..."
                  className="text-sm bg-white font-medium"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full font-bold text-base h-12"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  <span>Register Stakeholder Profile</span>
                </Button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Edit Stakeholder Modal */}
      {editingStakeholder && (
        <EditStakeholderModal
          isOpen={!!editingStakeholder}
          stakeholder={editingStakeholder}
          onClose={() => setEditingStakeholder(null)}
          onUpdate={(id, data) => updateStakeholder(id, data)}
          onDelete={(id) => deleteStakeholder(id)}
        />
      )}

    </div>
  );
};
