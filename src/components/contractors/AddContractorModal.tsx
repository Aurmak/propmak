'use client';

import React, { useState } from 'react';
import { 
  Users, 
  X, 
  Wrench, 
  Phone, 
  Star, 
  Check, 
  ShieldCheck, 
  DollarSign, 
  CreditCard 
} from 'lucide-react';
import { Contractor, TradeCategory } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

const HEADING = '#1B2559';

interface AddContractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContractor: (data: Omit<Contractor, 'id'>) => void;
}

export const AddContractorModal: React.FC<AddContractorModalProps> = ({
  isOpen,
  onClose,
  onAddContractor
}) => {
  const [name, setName] = useState('');
  const [trade, setTrade] = useState('Plumbing & Water Booster Pumps');
  const [category, setCategory] = useState<TradeCategory>('PLUMBER_PUMP_GEYSER');
  const [phone, setPhone] = useState('+1 (555) ');
  const [whatsapp, setWhatsapp] = useState('+1555');
  const [standardRate, setStandardRate] = useState('Rs. 2,500 / visit + parts');
  const [rating, setRating] = useState<number>(4.8);
  const [availability, setAvailability] = useState<'AVAILABLE' | 'ON_JOB'>('AVAILABLE');
  const [cnicNumber, setCnicNumber] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (cat: TradeCategory) => {
    setCategory(cat);
    switch (cat) {
      case 'PLUMBER_PUMP_GEYSER':
        setTrade('Plumbing, Overhead Tanks & Water Pumps');
        setStandardRate('Rs. 2,500 / visit + parts');
        break;
      case 'ELECTRICIAN_UPS':
        setTrade('Electrical Distribution Boards & Wiring');
        setStandardRate('Rs. 2,000 / visit + parts');
        break;
      case 'AC_TECHNICIAN':
        setTrade('HVAC, Split Inverters & Gas Top-up');
        setStandardRate('Rs. 3,500 service + gas');
        break;
      case 'PAINTER_SEEPAGE':
        setTrade('Waterproofing, Grouting & Epoxy');
        setStandardRate('Rs. 4,000 / day + materials');
        break;
      case 'CARPENTER_LOCKS':
        setTrade('Doors, Wardrobes & Lock Replacement');
        setStandardRate('Rs. 2,500 / lock + parts');
        break;
      case 'GENERAL_HANDYMAN':
        setTrade('General Handyman & Routine Fixes');
        setStandardRate('Rs. 2,000 / visit');
        break;
      default:
        setTrade('General Handyman & Repairs');
        setStandardRate('Rs. 2,000 / visit');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddContractor({
      name,
      trade,
      category,
      phone,
      whatsapp: whatsapp || phone.replace(/[^0-9+]/g, ''),
      rating,
      completedJobs: 0,
      standardRate,
      availability,
      cnicNumber: cnicNumber || undefined,
      notes: notes || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight" style={{ color: HEADING }}>Add Verified Contractor / Mistri</h3>
              <p className="text-xs text-slate-500">Register new trade specialist for rapid work order dispatch</p>
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
          
          {/* Name */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Contractor / Business Name *</label>
            <Input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ustad Imran (Master Electrician)"
              className="bg-white"
            />
          </div>

          {/* Trade Category Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Trade Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as TradeCategory)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                style={{ color: HEADING }}
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
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                style={{ color: HEADING }}
              >
                <option value="AVAILABLE">Available for Dispatch</option>
                <option value="ON_JOB">On Active Job</option>
              </select>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phone Number *</label>
              <Input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">WhatsApp Dispatch No.</label>
              <Input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="+15550000000"
                className="bg-white font-mono"
              />
            </div>
          </div>

          {/* Standard Rates & Rating */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Standard Callout Rate</label>
              <Input
                type="text"
                value={standardRate}
                onChange={(e) => setStandardRate(e.target.value)}
                placeholder="e.g. Rs. 2,500 / visit + parts"
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">CNIC / ID Number (Optional)</label>
              <Input
                type="text"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                placeholder="42201-XXXXXXX-X"
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
              placeholder="e.g. Verified by Haji Aslam. Expert in Italian mixer taps and inverter PCBs."
              className="bg-white"
            />
          </div>

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
              <span>Save & Register Contractor</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
