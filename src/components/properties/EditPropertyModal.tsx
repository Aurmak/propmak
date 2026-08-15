'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  X, 
  Check, 
  Trash2, 
  DollarSign, 
  MapPin, 
  Layers 
} from 'lucide-react';
import { Unit, PropertyStatus, Stakeholder } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface EditPropertyModalProps {
  isOpen: boolean;
  unit: Unit | null;
  stakeholders: Stakeholder[];
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Unit>) => void;
  onDelete: (id: string) => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  unit,
  stakeholders,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [unitNumber, setUnitNumber] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [floor, setFloor] = useState<number>(1);
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState<Unit['propertyType']>('RESIDENTIAL_APARTMENT');
  const [status, setStatus] = useState<PropertyStatus>('RENTED_DIRECT');
  const [areaSqFt, setAreaSqFt] = useState<number>(1800);
  const [monthlyRent, setMonthlyRent] = useState<number>(150000);
  const [askingPrice, setAskingPrice] = useState<number>(0);
  const [annualEscalationPercent, setAnnualEscalationPercent] = useState<number>(10);
  const [ownerId, setOwnerId] = useState<string>('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (unit) {
      setUnitNumber(unit.unitNumber || '');
      setPropertyName(unit.propertyName || '');
      setFloor(unit.floor || 1);
      setLocation(unit.location || '');
      setPropertyType(unit.propertyType || 'RESIDENTIAL_APARTMENT');
      setStatus(unit.status || 'RENTED_DIRECT');
      setAreaSqFt(unit.areaSqFt || 1800);
      setMonthlyRent(unit.monthlyRent || 0);
      setAskingPrice(unit.askingPrice || 0);
      setAnnualEscalationPercent(unit.annualEscalationPercent || 10);
      setOwnerId(unit.owner?.id || stakeholders[0]?.id || '');
      setIsConfirmingDelete(false);
    }
  }, [unit, stakeholders]);

  if (!isOpen || !unit) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber || !propertyName) return;

    const matchedOwner = stakeholders.find(s => s.id === ownerId) || unit.owner;

    onUpdate(unit.id, {
      unitNumber,
      propertyName,
      buildingName: propertyName,
      floor,
      location,
      propertyType,
      status,
      areaSqFt,
      monthlyRent,
      askingPrice: askingPrice > 0 ? askingPrice : undefined,
      annualEscalationPercent,
      owner: matchedOwner
    });

    onClose();
  };

  const handleDelete = () => {
    onDelete(unit.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-900">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Edit Unit & Estate Specs</h3>
              <p className="text-xs text-slate-500">Update floor, rental financials, status, or remove unit</p>
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
          
          {/* Unit Ref & Development */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Unit Number / Code *</label>
              <Input
                type="text"
                required
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Development / Plaza *</label>
              <Input
                type="text"
                required
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Floor & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Floor Level (0 = Ground)</label>
              <Input
                type="number"
                value={floor}
                onChange={(e) => setFloor(Number(e.target.value))}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Location / Society Area</label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Property Type & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="RESIDENTIAL_APARTMENT">Residential Apartment</option>
                <option value="RESIDENTIAL_PORTION">Upper / Ground Portion</option>
                <option value="INDEPENDENT_HOUSE">Independent House / Villa</option>
                <option value="COMMERCIAL_SHOP">Commercial Retail Shop</option>
                <option value="COMMERCIAL_OFFICE">Corporate Office Floor</option>
                <option value="PENTHOUSE">Penthouse Suite</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Operational Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
              >
                <option value="RENTED_DIRECT">Rented (Agency Managed)</option>
                <option value="VACANT_FOR_RENT">Vacant (Available for Rent)</option>
                <option value="FOR_SALE">For Sale</option>
                <option value="TOKEN_RECEIVED">Token Received</option>
                <option value="SOLD_CONVERTED_TO_RENT">Sold-to-Rent (Investor)</option>
                <option value="UNDER_RENOVATION">Under Renovation</option>
              </select>
            </div>
          </div>

          {/* Financials: Rent & Area */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Area (Sq Ft)</label>
              <Input
                type="number"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Monthly Rent (Rs.)</label>
              <Input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="bg-white font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Annual Inc. (%)</label>
              <Input
                type="number"
                value={annualEscalationPercent}
                onChange={(e) => setAnnualEscalationPercent(Number(e.target.value))}
                className="bg-white"
              />
            </div>
          </div>

          {/* Owner Assignment */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Property Owner / Landlord</label>
            <select
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-slate-800"
            >
              {stakeholders.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.role.replace(/_/g, ' ')}) — {s.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Delete Danger Zone */}
          {isConfirmingDelete ? (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
              <span className="text-xs font-bold text-rose-900">Are you sure you want to delete this property?</span>
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
                <span>Delete this unit from portfolio</span>
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
              <span>Save Unit Changes</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
