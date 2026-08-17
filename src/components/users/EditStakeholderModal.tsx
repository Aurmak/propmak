'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  Check, 
  Trash2, 
  UserCheck 
} from 'lucide-react';
import { Stakeholder } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const HEADING = '#1B2559';

interface EditStakeholderModalProps {
  isOpen: boolean;
  stakeholder: Stakeholder | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Stakeholder>) => void;
  onDelete: (id: string) => void;
}

export const EditStakeholderModal: React.FC<EditStakeholderModalProps> = ({
  isOpen,
  stakeholder,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<Stakeholder['role']>('TENANT');
  const [notes, setNotes] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (stakeholder) {
      setName(stakeholder.name || '');
      setPhone(stakeholder.phone || '');
      setEmail(stakeholder.email || '');
      setLocation(stakeholder.location || '');
      setRole(stakeholder.role || 'TENANT');
      setNotes(stakeholder.notes || '');
      setIsConfirmingDelete(false);
    }
  }, [stakeholder]);

  if (!isOpen || !stakeholder) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onUpdate(stakeholder.id, {
      name,
      phone,
      whatsapp: phone,
      email: email || undefined,
      location,
      role,
      notes: notes || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    onDelete(stakeholder.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-900">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: HEADING }}>Edit Stakeholder Record</h3>
              <p className="text-xs text-slate-500">Update contact details, role permissions, or remove user</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Full Legal Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Role & Base Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Stakeholder Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                style={{ color: HEADING }}
              >
                <option value="OWNER_OVERSEAS">Overseas Landlord</option>
                <option value="OWNER_LOCAL">Local Landlord</option>
                <option value="TENANT">Tenant / Resident</option>
                <option value="OCCUPIER">Occupier / Sub-tenant</option>
                <option value="COLLECTOR">Agency Field Collector</option>
                <option value="BUYER">Investor / Buyer</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Location / Base City</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp *</label>
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Special Instructions & Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-white"
            />
          </div>

          {/* Delete Danger Zone */}
          {isConfirmingDelete ? (
            <div className="p-3 bg-rose-50 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Are you sure you want to delete this user?</span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsConfirmingDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="text-xs text-rose-600 font-bold hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete this user record</span>
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
            >
              <Check className="w-4 h-4 mr-1" />
              <span>Save Changes</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
