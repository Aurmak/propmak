'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Receipt, 
  Zap, 
  Key, 
  TrendingUp, 
  MessageSquare
} from 'lucide-react';
import { Unit } from '../../types';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface PropertyDetailModalProps {
  unit: Unit | null;
  onClose: () => void;
  onConvertToRental?: (unitId: string, rent: number) => void;
  onOpenWhatsApp?: (msg: string, phone?: string) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  unit,
  onClose,
  onConvertToRental,
  onOpenWhatsApp
}) => {
  // WCAG: Keyboard Escape Key Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!unit) return null;

  const statusLabels: Record<string, { label: string; variant: "emerald" | "blue" | "amber" | "purple" | "secondary" | "teal" }> = {
    RENTED_DIRECT: { label: 'Rented Directly (Agency Managed)', variant: 'emerald' },
    RENTED_BY_OWNER: { label: 'Rented by Owner (Sublet/Managed)', variant: 'blue' },
    VACANT_FOR_RENT: { label: 'Vacant — Available for Rent', variant: 'amber' },
    FOR_SALE: { label: 'For Sale (New / Resale)', variant: 'blue' },
    TOKEN_RECEIVED: { label: 'Token Received (Deposit Agreement)', variant: 'purple' },
    SOLD_HANDOVER: { label: 'Sold — Under Handover/Registry', variant: 'secondary' },
    SOLD_CONVERTED_TO_RENT: { label: 'Sold-to-Rent (Investor Managed)', variant: 'teal' },
    UNDER_RENOVATION: { label: 'Under Renovation / Snagging', variant: 'amber' }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-unit-number"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in text-sm text-slate-800"
    >
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={statusLabels[unit.status]?.variant || 'secondary'}>
                {statusLabels[unit.status]?.label || unit.status}
              </Badge>
              <span className="text-xs text-slate-500 font-mono">{unit.unitNumber}</span>
            </div>
            <h2 id="modal-unit-number" className="text-2xl font-extrabold text-slate-900 mt-2">{unit.unitNumber}</h2>
            <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>{unit.propertyName} • {unit.location}</span>
            </p>
          </div>

          <Button
            onClick={onClose}
            aria-label="Close property details dialog"
            variant="outline"
            size="icon"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-800">
          
          {/* Key Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 text-xs block font-bold uppercase">Monthly Rent</span>
              <span className="text-xl font-extrabold text-slate-900">
                {unit.monthlyRent ? `Rs. ${unit.monthlyRent.toLocaleString()}` : 'N/A'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block font-bold uppercase">Asking / Valuation</span>
              <span className="text-xl font-extrabold text-slate-900">
                {unit.askingPrice ? `Rs. ${(unit.askingPrice / 10000000).toFixed(2)} Cr` : 'Rs. 2.4 Cr Est.'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block font-bold uppercase">Covered Area</span>
              <span className="text-base font-bold text-slate-800">{unit.areaSqFt} sq ft</span>
            </div>
            <div>
              <span className="text-slate-500 text-xs block font-bold uppercase">Bedrooms / Baths</span>
              <span className="text-base font-bold text-slate-800">
                {unit.bedrooms ? `${unit.bedrooms} Bed, ${unit.bathrooms} Bath` : 'Commercial'}
              </span>
            </div>
          </div>

          {/* Multi-Party Stakeholder Mapping */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Multi-Party Stakeholder Relationships</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Owner / Investor */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Property Owner</span>
                  <Badge variant="blue">
                    {unit.owner.role === 'OWNER_OVERSEAS' ? 'Overseas' : 'Local'}
                  </Badge>
                </div>
                <p className="font-bold text-slate-900 text-sm mt-2">{unit.owner.name}</p>
                <p className="text-xs text-slate-500">{unit.owner.location}</p>
                <p className="text-xs text-slate-900 mt-1 font-mono font-semibold">{unit.owner.phone}</p>
                {unit.owner.whatsapp && onOpenWhatsApp && (
                  <button
                    onClick={() => onOpenWhatsApp('Hello, regarding your property...', unit.owner.whatsapp)}
                    aria-label={`Send message to owner ${unit.owner.name}`}
                    className="mt-3 text-sm text-emerald-700 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <span>Message Owner</span>
                  </button>
                )}
              </div>

              {/* Renter / Tenant */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Renter (Lease Signatory)</span>
                  <Badge variant="emerald">
                    Tenant
                  </Badge>
                </div>
                <p className="font-bold text-slate-900 text-sm mt-2">
                  {unit.renter?.name || (unit.status === 'VACANT_FOR_RENT' ? '— Vacant —' : 'No Active Tenant')}
                </p>
                {unit.renter && (
                  <>
                    <p className="text-xs text-slate-500">{unit.renter.location}</p>
                    <p className="text-xs text-slate-900 mt-1 font-mono font-semibold">{unit.renter.phone}</p>
                    {onOpenWhatsApp && (
                      <button
                        onClick={() => onOpenWhatsApp('Hello, regarding your tenancy...', unit.renter?.whatsapp)}
                        aria-label={`Send message to tenant ${unit.renter.name}`}
                        className="mt-3 text-sm text-emerald-700 font-bold hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" aria-hidden="true" />
                        <span>Message Resident</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Physical Occupier / Resident */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                  <span>Physical Occupier</span>
                  <Badge variant="purple">
                    Resident
                  </Badge>
                </div>
                <p className="font-bold text-slate-900 text-sm mt-2">
                  {unit.occupier?.name || unit.renter?.name || 'Same as Tenant / Vacant'}
                </p>
                <p className="text-xs text-slate-500">On-site resident</p>
                <p className="text-xs text-slate-500 mt-1">Authorized for maintenance access</p>
              </div>

            </div>
          </div>

          {/* Lease & Annual Escalation Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tenancy Terms */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Tenancy & Escalation Terms</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Contract Duration:</span>
                  <span className="font-bold text-slate-900">11 Months (Standard Agreement)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Lease Dates:</span>
                  <span className="font-bold text-slate-900">
                    {unit.leaseStartDate || 'N/A'} &rarr; {unit.leaseEndDate || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Security Deposit:</span>
                  <span className="font-bold text-emerald-700">
                    {unit.securityDeposit ? `Rs. ${unit.securityDeposit.toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Annual Escalation Clause:</span>
                  <span className="font-bold text-amber-700">
                    {unit.annualEscalationPercent || 10}% Annual Increase
                  </span>
                </div>
              </div>
            </div>

            {/* Utility Meter Audit */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" aria-hidden="true" />
                <span>Registered Utility Meters</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Electricity Consumer No:</span>
                  <span className="font-mono font-bold text-slate-900">{unit.electricityMeterNo || '04-11223-998811'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Gas Consumer No:</span>
                  <span className="font-mono font-bold text-slate-900">{unit.gasMeterNo || '99887766-GAS'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Water Account:</span>
                  <span className="font-mono font-bold text-slate-900">{unit.waterAccountNo || 'WTR-01-9988'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Key Safe Box Location:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" /> {unit.keyLocation || 'Agency Office'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {unit.status === 'FOR_SALE' || unit.status === 'TOKEN_RECEIVED' ? (
              <span className="text-amber-800 font-semibold">Investor lead ready for rental onboarding upon handover</span>
            ) : (
              <span>Last Rent Review: {unit.lastRentReviewDate || '2025-09-01'}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {(unit.status === 'FOR_SALE' || unit.status === 'TOKEN_RECEIVED' || unit.status === 'SOLD_HANDOVER') && onConvertToRental && (
              <Button
                variant="teal"
                onClick={() => {
                  onConvertToRental(unit.id, unit.monthlyRent || 135000);
                  onClose();
                }}
              >
                <TrendingUp className="w-4 h-4" />
                <span>1-Click Convert to Managed Rental (Sold-to-Rent)</span>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
