'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Plus, 
  X,
  Search,
  Check,
  Edit2,
  Trash2,
  ArrowRight,
  MessageSquare,
  FileText
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Stakeholder } from '../../types';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '../ui/sheet';
import { EmptyState } from '../ui/EmptyState';
import { EditStakeholderModal } from './EditStakeholderModal';

export const StakeholderDirectory: React.FC<{ onOpenWhatsApp?: (msg: string, phone?: string) => void }> = ({
  onOpenWhatsApp
}) => {
  const { stakeholders, addStakeholder, updateStakeholder, deleteStakeholder, units } = usePropMAK();

  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);
  const [activeInspectorStakeholder, setActiveInspectorStakeholder] = useState<Stakeholder | null>(null);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newLocation, setNewLocation] = useState('Central District');
  const [newRole, setNewRole] = useState<Stakeholder['role']>('TENANT');
  const [newNotes, setNewNotes] = useState('');

  const filteredStakeholders = stakeholders.filter(s => {
    if (search) {
      const q = search.toLowerCase();
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Stakeholder & User Directory
              </h1>
              <Badge variant="secondary">
                {stakeholders.length} Registered Users
              </Badge>
            </div>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Centralized stakeholder registry: Overseas & local landlords, active tenants, occupiers, and agency field collectors
            </p>
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddUserModalOpen(true)}
            className="font-bold text-sm"
          >
            <UserPlus className="w-4 h-4 text-amber-400 mr-1.5" />
            <span>Add New User</span>
          </Button>
        </div>
      </Card>

      {/* Filter & Search Toolbar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Role Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto text-sm">
            {[
              { id: 'ALL', label: `All Users (${stakeholders.length})` },
              { id: 'LANDLORD', label: 'Landlords & Owners' },
              { id: 'TENANT', label: 'Tenants & Residents' },
              { id: 'STAFF', label: 'Agency Field Staff' }
            ].map(tab => (
              <Button
                key={tab.id}
                size="sm"
                variant={filterRole === tab.id ? 'default' : 'ghost'}
                onClick={() => setFilterRole(tab.id)}
                className="h-9 px-3.5 text-sm font-bold whitespace-nowrap cursor-pointer"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name, phone, city..."
              className="pl-9 h-9 text-sm bg-white font-medium"
            />
          </div>

        </div>
      </Card>

      {/* Streamlined 5-Column Stakeholders Table */}
      {filteredStakeholders.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No stakeholders found"
          description="No users or landlords match your current filter."
          actionLabel="Reset User Filter"
          onAction={() => {
            setFilterRole('ALL');
            setSearch('');
          }}
        />
      ) : (
        <Card className="overflow-hidden shadow-sm">
          <Table aria-label="Stakeholders Directory Table">
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-sm">Stakeholder & Role</TableHead>
                <TableHead className="font-bold text-sm">Contact Phone</TableHead>
                <TableHead className="font-bold text-sm">Location / Base</TableHead>
                <TableHead className="font-bold text-sm">Portfolio Demise</TableHead>
                <TableHead className="text-right font-bold text-sm">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStakeholders.map((s) => {
                const ownedUnits = units.filter(u => u.owner.id === s.id || u.owner.name === s.name);
                const rentedUnits = units.filter(u => u.renter?.id === s.id || u.renter?.name === s.name);

                return (
                  <TableRow 
                    key={s.id} 
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setActiveInspectorStakeholder(s)}
                  >
                    
                    {/* Column 1: Stakeholder & Role */}
                    <TableCell>
                      <span className="font-bold text-slate-900 text-sm block">{s.name}</span>
                      <div className="mt-1">
                        {getRoleBadge(s.role)}
                      </div>
                    </TableCell>

                    {/* Column 2: Contact Phone */}
                    <TableCell className="font-mono text-sm font-semibold text-slate-900">
                      {s.phone}
                    </TableCell>

                    {/* Column 3: Location */}
                    <TableCell>
                      <span className="text-sm text-slate-700 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{s.location}</span>
                      </span>
                    </TableCell>

                    {/* Column 4: Associated Demise */}
                    <TableCell>
                      {ownedUnits.length > 0 ? (
                        <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {ownedUnits.length} Owned Unit{ownedUnits.length > 1 ? 's' : ''}
                        </span>
                      ) : rentedUnits.length > 0 ? (
                        <span className="text-xs font-bold text-emerald-900 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {rentedUnits[0].unitNumber}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 font-medium">—</span>
                      )}
                    </TableCell>

                    {/* Column 5: Action */}
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="font-bold text-sm h-8 px-3"
                        onClick={() => setActiveInspectorStakeholder(s)}
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 text-amber-500" />
                      </Button>
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Slide-Over Stakeholder Inspector Drawer (`Sheet`) */}
      <Sheet open={!!activeInspectorStakeholder} onOpenChange={(open) => { if (!open) setActiveInspectorStakeholder(null); }}>
        {activeInspectorStakeholder && (
          <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
            
            <SheetHeader className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                {getRoleBadge(activeInspectorStakeholder.role)}
                <Badge variant="secondary">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span>Verified Profile</span>
                </Badge>
              </div>
              <SheetTitle className="text-xl font-black text-slate-900">{activeInspectorStakeholder.name}</SheetTitle>
              <SheetDescription className="flex items-center gap-1.5 text-slate-700 font-medium text-sm mt-1">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{activeInspectorStakeholder.location} • {activeInspectorStakeholder.phone}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 my-5 text-sm text-slate-800">
              
              {/* Profile Details Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Contact Information</span>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-600 font-medium block">Phone / Mobile:</span>
                    <strong className="text-slate-900 font-mono block">{activeInspectorStakeholder.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Email Address:</span>
                    <strong className="text-slate-900 block">{activeInspectorStakeholder.email || 'Not on file'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">Primary Role:</span>
                    <strong className="text-slate-900 block">{activeInspectorStakeholder.role.replace(/_/g, ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-600 font-medium block">City / Base:</span>
                    <strong className="text-slate-900 block">{activeInspectorStakeholder.location}</strong>
                  </div>
                </div>

                {activeInspectorStakeholder.notes && (
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Management Notes & Special Instructions
                    </span>
                    <p className="text-slate-800 text-sm leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                      {activeInspectorStakeholder.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Associated Portfolio Properties */}
              {(() => {
                const owned = units.filter(u => u.owner.id === activeInspectorStakeholder.id || u.owner.name === activeInspectorStakeholder.name);
                const rented = units.filter(u => u.renter?.id === activeInspectorStakeholder.id || u.renter?.name === activeInspectorStakeholder.name);

                return (
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Associated Property Assets ({owned.length + rented.length} Units)
                    </span>
                    
                    {owned.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-blue-900 block">Owned Units (Landlord):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {owned.map(u => (
                            <div key={u.id} className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-sm">
                              <span className="font-bold text-blue-950 block">{u.unitNumber}</span>
                              <span className="text-xs text-blue-800 block">{u.propertyName}</span>
                              <span className="text-xs font-bold text-slate-900 block mt-1">Rent: Rs. {u.monthlyRent.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {rented.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-900 block">Current Tenancy (Resident):</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rented.map(u => (
                            <div key={u.id} className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-sm">
                              <span className="font-bold text-emerald-950 block">{u.unitNumber}</span>
                              <span className="text-xs text-emerald-800 block">{u.propertyName}</span>
                              <span className="text-xs font-bold text-slate-900 block mt-1">Rent: Rs. {u.monthlyRent.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {owned.length === 0 && rented.length === 0 && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-sm italic">
                        No currently linked properties in the portfolio.
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-200">
                <Button
                  variant="default"
                  className="w-full sm:flex-1 font-black text-base h-12 shadow-sm"
                  onClick={() => {
                    setEditingStakeholder(activeInspectorStakeholder);
                    setActiveInspectorStakeholder(null);
                  }}
                >
                  <Edit2 className="w-5 h-5 mr-2 text-amber-400" />
                  <span>Edit Stakeholder Record</span>
                </Button>

                <Button
                  variant="ghost"
                  className="w-full sm:w-auto text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold text-sm h-12"
                  onClick={() => {
                    if (confirm(`Remove stakeholder ${activeInspectorStakeholder.name} from directory?`)) {
                      deleteStakeholder(activeInspectorStakeholder.id);
                      setActiveInspectorStakeholder(null);
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  <span>Delete</span>
                </Button>
              </div>

            </div>

          </SheetContent>
        )}
      </Sheet>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in text-sm text-slate-900">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Stakeholder</h3>
                  <p className="text-sm text-slate-600">Register landlord, tenant, or staff member</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddUserModalOpen(false)}
                className="font-bold text-sm"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-bold text-sm focus:outline-none focus:border-slate-800 cursor-pointer"
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
                  <UserPlus className="w-4 h-4 text-amber-400 mr-2" />
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
