'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  Layers, 
  TrendingUp, 
  Clock, 
  Key, 
  ShieldCheck, 
  Plus, 
  Eye, 
  UserPlus 
} from 'lucide-react';
import { Unit, PropertyStatus } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const HEADING = '#1B2559';

interface FloorMatrixViewProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  onOpenAddPropertyModal: () => void;
}

export const FloorMatrixView: React.FC<FloorMatrixViewProps> = ({
  units,
  onSelectUnit,
  onOpenAddPropertyModal
}) => {
  // Extract buildings
  const buildings = Array.from(new Set(units.map(u => u.propertyName)));
  const [selectedBuilding, setSelectedBuilding] = useState<string>(buildings[0] || 'Grand Oak Tower');

  const buildingUnits = units.filter(u => u.propertyName === selectedBuilding);

  // Group units by floor
  const floorMap = buildingUnits.reduce((acc, unit) => {
    const floorNum = unit.floor !== undefined ? unit.floor : 0;
    if (!acc[floorNum]) {
      acc[floorNum] = [];
    }
    acc[floorNum].push(unit);
    return acc;
  }, {} as Record<number, Unit[]>);

  // Sort floors descending (Penthouse/Top floor at top, Ground floor at bottom)
  const sortedFloors = Object.keys(floorMap)
    .map(Number)
    .sort((a, b) => b - a);

  const getFloorName = (floorNum: number) => {
    if (floorNum === 0) return 'Ground Floor (Retail & Entrances)';
    if (floorNum === 1) return '1st Floor';
    if (floorNum === 2) return '2nd Floor';
    if (floorNum === 3) return '3rd Floor';
    if (floorNum === 4) return '4th Floor';
    if (floorNum >= 5) return `${floorNum}th Floor (Penthouses & Executive)`;
    return `Floor ${floorNum}`;
  };

  const getStatusColor = (status: PropertyStatus) => {
    switch (status) {
      case 'RENTED_DIRECT':
        return 'bg-emerald-50 border-emerald-300 text-emerald-950 hover:bg-emerald-100/70';
      case 'RENTED_BY_OWNER':
        return 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100/70';
      case 'VACANT_FOR_RENT':
        return 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100/70';
      case 'FOR_SALE':
        return 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100/70';
      case 'TOKEN_RECEIVED':
        return 'bg-purple-50 border-purple-300 text-purple-950 hover:bg-purple-100/70';
      case 'SOLD_CONVERTED_TO_RENT':
        return 'bg-teal-50 border-teal-300 text-teal-950 hover:bg-teal-100/70';
      case 'UNDER_RENOVATION':
        return 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/70';
      default:
        return 'bg-slate-50 border-slate-300 text-slate-900 hover:bg-slate-100';
    }
  };

  const getStatusBadge = (status: PropertyStatus) => {
    switch (status) {
      case 'RENTED_DIRECT':
        return <Badge variant="emerald">Rented</Badge>;
      case 'RENTED_BY_OWNER':
        return <Badge variant="blue">Sublet</Badge>;
      case 'VACANT_FOR_RENT':
        return <Badge variant="amber">Vacant</Badge>;
      case 'FOR_SALE':
        return <Badge variant="blue">For Sale</Badge>;
      case 'TOKEN_RECEIVED':
        return <Badge variant="purple">Token (Bayana)</Badge>;
      case 'SOLD_CONVERTED_TO_RENT':
        return <Badge variant="teal">Sold-to-Rent</Badge>;
      case 'UNDER_RENOVATION':
        return <Badge variant="destructive">Snagging</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalMonthlyRent = buildingUnits.reduce((acc, u) => acc + (u.monthlyRent || 0), 0);
  const rentedCount = buildingUnits.filter(u => u.status === 'RENTED_DIRECT' || u.status === 'RENTED_BY_OWNER' || u.status === 'SOLD_CONVERTED_TO_RENT').length;
  const vacantCount = buildingUnits.filter(u => u.status === 'VACANT_FOR_RENT').length;
  const forSaleCount = buildingUnits.filter(u => u.status === 'FOR_SALE' || u.status === 'TOKEN_RECEIVED').length;

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in">
      
      {/* Building Selector & Summary Metrics */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          {/* Building Tabs */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Select Development:</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-sm">
              {buildings.map(b => (
                <Button
                  key={b}
                  size="sm"
                  variant={selectedBuilding === b ? 'default' : 'outline'}
                  onClick={() => setSelectedBuilding(b)}
                  className="h-9 px-3.5 font-bold"
                >
                  <Building2 className="w-4 h-4 mr-1.5" />
                  <span>{b}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Key Plaza Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl text-xs" style={{ background: '#EEF1FA' }}>
            <div>
              <span className="text-slate-500 uppercase font-bold block">Total Units</span>
              <span className="text-base font-bold" style={{ color: HEADING }}>{buildingUnits.length} Units</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block">Occupancy Rate</span>
              <span className="text-base font-bold text-emerald-700">
                {buildingUnits.length > 0 ? `${Math.round((rentedCount / buildingUnits.length) * 100)}%` : '0%'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block">Monthly Rent Roll</span>
              <span className="text-base font-bold" style={{ color: HEADING }}>
                Rs. {(totalMonthlyRent / 100000).toFixed(2)} Lakh
              </span>
            </div>
            <div>
              <span className="text-slate-500 uppercase font-bold block">Vacant / Void</span>
              <span className="text-base font-bold" style={{ color: vacantCount > 0 ? '#B45309' : HEADING }}>
                {vacantCount} Vacant
              </span>
            </div>
          </div>

        </div>
      </Card>

      {/* Legend Bar */}
      <Card className="flex flex-wrap items-center justify-between gap-3 text-xs p-3">
        <span className="font-bold text-slate-700 uppercase tracking-wider">Floor Matrix Legend:</span>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-600"></span>
            <span className="text-slate-700 font-medium">Rented ({rentedCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-300 border border-amber-500"></span>
            <span className="text-slate-700 font-medium">Vacant ({vacantCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-300 border border-blue-500"></span>
            <span className="text-slate-700 font-medium">For Sale / Token ({forSaleCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-teal-300 border border-teal-500"></span>
            <span className="text-slate-700 font-medium">Sold-to-Rent</span>
          </span>
        </div>
      </Card>

      {/* Floor by Floor Layout Grid */}
      <div className="space-y-4">
        {sortedFloors.map(floorNum => {
          const floorUnits = floorMap[floorNum] || [];
          const floorRent = floorUnits.reduce((acc, u) => acc + (u.monthlyRent || 0), 0);

          return (
            <Card key={floorNum} className="p-5 space-y-3">

              {/* Floor Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {floorNum}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm" style={{ color: HEADING }}>{getFloorName(floorNum)}</h3>
                    <span className="text-xs text-slate-400 font-medium">{floorUnits.length} Demises on this floor</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">Floor Rent:</span>
                  <span className="text-sm font-bold" style={{ color: HEADING }}>
                    Rs. {floorRent.toLocaleString()} /mo
                  </span>
                </div>
              </div>

              {/* Units Tiles on this Floor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 pt-1">
                {floorUnits.map(unit => {
                  const colorClass = getStatusColor(unit.status);

                  return (
                    <div
                      key={unit.id}
                      onClick={() => onSelectUnit(unit)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-md ${colorClass} space-y-2`}
                    >
                      {/* Top Row: Unit number & badge */}
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-bold text-sm truncate" style={{ color: HEADING }}>{unit.unitNumber}</span>
                        {getStatusBadge(unit.status)}
                      </div>

                      {/* Area & Type */}
                      <p className="text-xs text-slate-700 font-semibold">
                        {unit.areaSqFt} sq ft • {unit.propertyType.replace(/_/g, ' ')}
                      </p>

                      {/* Tenant or Vacancy info */}
                      <div className="pt-2 border-t border-black/10 flex items-center justify-between text-xs">
                        {unit.renter ? (
                          <div>
                            <span className="text-slate-700 block text-xs font-bold">Tenant:</span>
                            <span className="font-bold block truncate max-w-[130px]" style={{ color: HEADING }}>{unit.renter.name}</span>
                          </div>
                        ) : (
                          <Badge variant="amber">Available</Badge>
                        )}

                        <div className="text-right">
                          <span className="text-slate-700 block text-xs font-bold">Rent / Price:</span>
                          <span className="font-bold text-sm" style={{ color: HEADING }}>
                            {unit.monthlyRent ? `Rs. ${(unit.monthlyRent / 1000).toFixed(0)}k` : unit.askingPrice ? `Rs. ${(unit.askingPrice / 10000000).toFixed(1)} Cr` : '—'}
                          </span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </Card>
          );
        })}
      </div>

    </div>
  );
};
