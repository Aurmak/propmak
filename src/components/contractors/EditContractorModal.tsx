'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  Check, 
  Trash2, 
  Wrench, 
  Star 
} from 'lucide-react';
import { Contractor, TradeCategory } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface EditContractorModalProps {
  isOpen: boolean;
  contractor: Contractor | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Contractor>) => void;
  onDelete: (id: string) => void;
}

export const EditContractorModal: React.FC<EditContractorModalProps> = ({
  isOpen,
  contractor,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('');
  const [category, setCategory] = useState<TradeCategory>('PLUMBER_PUMP_GEYSER');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [standardRate, setStandardRate] = useState('');
  const [rating, setRating] = useState<number>(4.8);
  const [availability, setAvailability] = useState<'AVAILABLE' | 'ON_JOB' | 'UNAVAILABLE'>('AVAILABLE');
  const [cnicNumber, setCnicNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (contractor) {
      setName(contractor.name || '');
      setTrade(contractor.trade || '');
      setCategory(contractor.category || 'PLUMBER_PUMP_GEYSER');
      setPhone(contractor.phone || '');
      setWhatsapp(contractor.whatsapp || '');
      setStandardRate(contractor.standardRate || '');
      setRating(contractor.rating || 4.8);
      setAvailability(contractor.availability || 'AVAILABLE');
      setCnicNumber(contractor.cnicNumber || '');
      setNotes(contractor.notes || '');
      setIsConfirmingDelete(false);
    }
  }, [contractor]);

  if (!isOpen || !contractor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onUpdate(contractor.id, {
      name,
      trade,
      category,
      phone,
      whatsapp: whatsapp || phone.replace(/[^0-9+]/g, ''),
      rating,
      standardRate,
      availability,
      cnicNumber: cnicNumber || undefined,
      notes: notes || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    onDelete(contractor.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Edit Contractor / Mistri</h3>
              <p className="text-xs text-slate-500">Update trade specialties, callout rates, or remove vendor</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Contractor / Business Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Trade Category & Availability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Trade Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TradeCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="PLUMBER_PUMP_GEYSER">Plumber & Water Motors</option>
                <option value="ELECTRICIAN_UPS">Electrician & DB Wiring</option>
                <option value="AC_TECHNICIAN">HVAC & Split AC Inverters</option>
                <option value="PAINTER_SEEPAGE">Painter & Seepage Expert</option>
                <option value="CARPENTER_LOCKS">Carpenter & Locksmith</option>
                <option value="GENERAL_HANDYMAN">General Handyman</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Availability Status</label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="AVAILABLE">Available for Dispatch</option>
                <option value="ON_JOB">On Active Job</option>
                <option value="UNAVAILABLE">Temporarily Unavailable</option>
              </select>
            </div>
          </div>

          {/* Phone & WhatsApp */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp Dispatch No.</label>
              <Input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="bg-white font-mono"
              />
            </div>
          </div>

          {/* Rates & Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Standard Callout Rate</label>
              <Input
                type="text"
                value={standardRate}
                onChange={(e) => setStandardRate(e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">CNIC / ID Number</label>
              <Input
                type="text"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                className="bg-white font-mono"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Specialties & Vetting Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="bg-white"
            />
          </div>

          {/* Delete Danger Zone */}
          {isConfirmingDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Delete this contractor from directory?</span>
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
                <span>Delete contractor record</span>
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
              <Check className="w-4 h-4 text-amber-400 mr-1" />
              <span>Save Changes</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
