'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  User, 
  Clock, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { PropertyStatus, Stakeholder } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ComboBox } from '../ui/ComboBox';
import { TogglePills } from '../ui/TogglePills';

const HEADING = '#1B2559';

const BUILDING_OPTIONS = [
  'Grand Oak Tower',
  'Pine Crest Residency',
  'Palm Gardens Estate',
  'Apex Commercial Plaza',
  'Central Boulevard Villas',
];

interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddPropertyModal: React.FC<AddPropertyModalProps> = ({ isOpen, onClose }) => {
  const { addUnit, stakeholders, units } = usePropMAK();

  // Form State
  const [propertyName, setPropertyName] = useState('Grand Oak Tower');
  const [unitNumber, setUnitNumber] = useState('');
  const [location, setLocation] = useState('Central Boulevard');
  const [floor, setFloor] = useState<number>(1);
  const [areaSqFt, setAreaSqFt] = useState<number>(1450);
  const [propertyType, setPropertyType] = useState<any>('RESIDENTIAL_APARTMENT');
  const [status, setStatus] = useState<PropertyStatus>('RENTED_DIRECT');

  // Landlord
  const [isNewLandlord, setIsNewLandlord] = useState(false);
  const [selectedLandlordId, setSelectedLandlordId] = useState(stakeholders.find(s => s.role.startsWith('OWNER'))?.id || '');
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerLocation, setOwnerLocation] = useState('London, UK');
  const [ownerRole, setOwnerRole] = useState<'OWNER_OVERSEAS' | 'OWNER_LOCAL'>('OWNER_OVERSEAS');

  // Tenancy
  const [monthlyRent, setMonthlyRent] = useState<number>(120000);
  const [securityDeposit, setSecurityDeposit] = useState<number>(240000);
  const [annualEscalationPercent, setAnnualEscalationPercent] = useState<number>(10);
  const [tenantName, setTenantName] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [leaseStartDate, setLeaseStartDate] = useState('2026-09-01');
  const [leaseEndDate, setLeaseEndDate] = useState('2027-08-31');



  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitNumber) return;

    // Resolve owner
    let owner: Stakeholder;
    if (isNewLandlord) {
      owner = {
        id: `usr_owner_${Date.now()}`,
        name: ownerName || 'New Landlord',
        phone: ownerPhone || '+1 (555) 000-0000',
        location: ownerLocation,
        role: ownerRole
      };
    } else {
      const existing = stakeholders.find(s => s.id === selectedLandlordId);
      owner = existing || {
        id: 'usr_default_owner',
        name: 'Dr. Tariq Mahmood (Investor)',
        phone: '+44 7700 900123',
        location: 'London, UK',
        role: 'OWNER_OVERSEAS'
      };
    }

    // Resolve renter
    let renter: Stakeholder | undefined = undefined;
    if (status === 'RENTED_DIRECT' || status === 'RENTED_BY_OWNER') {
      renter = {
        id: `usr_renter_${Date.now()}`,
        name: tenantName || 'New Resident',
        phone: tenantPhone || '+1 (555) 000-0000',
        location: `${unitNumber}, ${propertyName}`,
        role: 'TENANT'
      };
    }

    addUnit({
      unitNumber,
      propertyName,
      buildingName: propertyName,
      location,
      floor,
      areaSqFt,
      propertyType,
      status,
      owner,
      renter,
      occupier: renter,
      monthlyRent: status === 'VACANT_FOR_RENT' ? 0 : monthlyRent,
      askingPrice: status === 'VACANT_FOR_RENT' ? monthlyRent : undefined,
      securityDeposit,
      annualEscalationPercent,
      leaseStartDate: status === 'RENTED_DIRECT' ? leaseStartDate : undefined,
      leaseEndDate: status === 'RENTED_DIRECT' ? leaseEndDate : undefined,
      daysVacant: status === 'VACANT_FOR_RENT' ? 1 : 0,
    });

    onClose();
  };

  const landlordList = stakeholders.filter(s => s.role === 'OWNER_OVERSEAS' || s.role === 'OWNER_LOCAL');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-slate-800">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-tight" style={{ color: HEADING }}>Add New Property & Unit</h2>
              <p className="text-xs text-slate-500">Register demise, assign landlord, and setup tenancy contract</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {/* Section 1: Demise & Property Details */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: HEADING }}>
              <Building2 className="w-4 h-4 text-slate-500" />
              1. Demise & Building Details
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Development / Building</label>
              <ComboBox
                options={BUILDING_OPTIONS.map(b => ({
                  value: b,
                  label: b,
                  sublabel: `${units.filter(u => u.propertyName === b).length} units`,
                }))}
                value={propertyName}
                onChange={setPropertyName}
                placeholder="Select a building…"
                searchPlaceholder="Search building…"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Unit Number / Demise Ref *</label>
                <Input
                  type="text"
                  value={unitNumber}
                  onChange={(e) => setUnitNumber(e.target.value)}
                  placeholder="e.g. Apt 504 (3-Bed Luxury)"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Covered Area (Sq Ft)</label>
                <Input
                  type="number"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Property Type</label>
              <TogglePills
                options={[
                  { value: 'RESIDENTIAL_APARTMENT', label: 'Residential Apartment' },
                  { value: 'INDEPENDENT_HOUSE', label: 'Independent House / Villa' },
                  { value: 'COMMERCIAL_SHOP', label: 'Commercial Retail Shop' },
                  { value: 'COMMERCIAL_OFFICE', label: 'Commercial Office Suite' },
                  { value: 'PENTHOUSE', label: 'Penthouse Duplex' },
                ]}
                value={propertyType}
                onChange={val => setPropertyType(val)}
                columns={2}
              />
            </div>
          </div>

          {/* Section 2: Landlord Assignment */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: HEADING }}>
                <User className="w-4 h-4 text-slate-500" />
                2. Landlord / Property Owner
              </h3>
              <button
                type="button"
                onClick={() => setIsNewLandlord(!isNewLandlord)}
                className="text-blue-600 font-bold hover:underline cursor-pointer"
              >
                {isNewLandlord ? '← Select Existing Landlord' : '+ New Landlord'}
              </button>
            </div>

            {!isNewLandlord ? (
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Landlord</label>
                <ComboBox
                  options={landlordList.map(l => ({
                    value: l.id,
                    label: l.name,
                    sublabel: `${l.role === 'OWNER_OVERSEAS' ? 'Overseas (UK/UAE)' : 'Local'} — ${l.phone}`,
                  }))}
                  value={selectedLandlordId}
                  onChange={setSelectedLandlordId}
                  placeholder="Select a landlord…"
                  searchPlaceholder="Search landlords…"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl" style={{ background: '#EEF1FA' }}>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Landlord Name</label>
                  <Input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="e.g. Dr. Salman Khan"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp</label>
                  <Input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="+44 7700..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Tenancy Status */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: HEADING }}>
              <Clock className="w-4 h-4 text-slate-500" />
              3. Tenancy & Rent Terms
            </h3>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Occupancy Status</label>
              <TogglePills
                options={[
                  { value: 'RENTED_DIRECT', label: 'Rented (Active Lease)' },
                  { value: 'VACANT_FOR_RENT', label: 'Vacant (Available for Rent)' },
                  { value: 'FOR_SALE', label: 'For Sale' },
                  { value: 'UNDER_RENOVATION', label: 'Under Renovation / Snagging' },
                ]}
                value={status}
                onChange={val => setStatus(val as PropertyStatus)}
                columns={2}
              />
            </div>

            <div className="md:w-1/2">
              <label className="block text-slate-700 font-bold mb-1">Monthly Rent (PKR)</label>
              <Input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
              />
            </div>

            {status === 'RENTED_DIRECT' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-xl" style={{ background: '#EEF1FA' }}>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tenant Name</label>
                  <Input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="e.g. Asim Raza"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tenant WhatsApp / Phone</label>
                  <Input
                    type="text"
                    value={tenantPhone}
                    onChange={(e) => setTenantPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lease Start Date</label>
                  <Input
                    type="date"
                    value={leaseStartDate}
                    onChange={(e) => setLeaseStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lease End Date</label>
                  <Input
                    type="date"
                    value={leaseEndDate}
                    onChange={(e) => setLeaseEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>



          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
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
              <Plus className="w-4 h-4 mr-1" />
              <span>Save & Onboard Property</span>
            </Button>
          </div>

        </form>

      </div>
    </div>
  );
};
