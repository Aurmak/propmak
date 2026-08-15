'use client';

import React, { useState } from 'react';
import { 
  Wrench, 
  Camera, 
  Upload, 
  CheckCircle, 
  Zap, 
  MessageSquare, 
  Check, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';

export const MobileCompanionPreview: React.FC = () => {
  const { approveTicket } = usePropMAK();
  const [mobileMode, setMobileMode] = useState<'TENANT' | 'LANDLORD' | 'BUYER'>('TENANT');
  const [hasUploadedSlip, setHasUploadedSlip] = useState(false);
  const [hasApprovedRepair, setHasApprovedRepair] = useState(false);

  return (
    <div className="space-y-6 text-sm text-slate-800">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Resident & Landlord Mobile Companion
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
              React Native / Expo
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Dedicated customer native app for Tenants (Rent & 30s repairs), Overseas Landlords (Live cashflow & 1-tap approvals), and Buyers
          </p>
        </div>

        {/* Mobile Mode Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-sm">
          <button
            onClick={() => setMobileMode('TENANT')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              mobileMode === 'TENANT' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tenant Mode
          </button>
          <button
            onClick={() => setMobileMode('LANDLORD')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              mobileMode === 'LANDLORD' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Landlord Mode
          </button>
          <button
            onClick={() => setMobileMode('BUYER')}
            className={`px-4 py-2 rounded-lg font-bold transition-all ${
              mobileMode === 'BUYER' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buyer / Investor Mode
          </button>
        </div>
      </div>

      {/* Centered Mobile Phone Container */}
      <div className="flex justify-center py-4">
        <div className="w-full max-w-[390px] bg-slate-900 border-8 border-slate-800 rounded-[44px] shadow-2xl p-3 relative overflow-hidden flex flex-col min-h-[640px]">
          
          {/* Phone Speaker & Dynamic Island */}
          <div className="w-28 h-4 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
            <div className="w-8 h-1.5 rounded-full bg-slate-800"></div>
          </div>

          {/* Mobile Screen Area */}
          <div className="flex-1 bg-white rounded-[30px] p-4 text-sm text-slate-800 overflow-y-auto space-y-4 shadow-inner">
            
            {/* Top App Header inside Mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  PM
                </div>
                <div>
                  <span className="font-extrabold text-sm text-slate-900 block">PropMAK</span>
                  <span className="text-xs text-slate-500">
                    {mobileMode === 'TENANT' && 'Tenant: Khurram Shahzad'}
                    {mobileMode === 'LANDLORD' && 'Landlord: Dr. Tariq (UK)'}
                    {mobileMode === 'BUYER' && 'Investor: Usman Qureshi'}
                  </span>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            {/* SCREEN 1: TENANT MODE */}
            {mobileMode === 'TENANT' && (
              <div className="space-y-3.5 animate-in fade-in">
                
                {/* Rent Due Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-semibold">August 2026 Rent</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                      Due in 5 Days
                    </span>
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    Rs. 160,000 <span className="text-xs font-normal text-slate-500">PKR</span>
                  </div>
                  <p className="text-xs text-slate-500">Apartment 402, Grand Oak Tower</p>

                  <div className="pt-2">
                    {hasUploadedSlip ? (
                      <div className="p-2.5 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-700" />
                        <span>Transfer Slip Uploaded & Verified</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setHasUploadedSlip(true);
                          alert('✅ Bank transfer screenshot uploaded! Property Manager notified.');
                        }}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                      >
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Upload Bank Transfer Slip</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 30-Second Camera Repair Report */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <Wrench className="w-4 h-4 text-amber-600" />
                      <span>Report a Repair (30s)</span>
                    </span>
                    <span className="text-xs text-amber-700 font-bold flex items-center gap-0.5">
                      <Sparkles className="w-3.5 h-3.5" /> AI Triage
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">Snap a photo of the leaking pipe, motor, or AC to dispatch a technician.</p>
                  
                  <button
                    onClick={() => alert('📸 Camera opened: Snap photo of the issue to auto-triage!')}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-xs border border-slate-200 flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-slate-600" />
                    <span>Snap Issue Photo & Submit</span>
                  </button>
                </div>

                {/* Utility Bill Clearance Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Monthly Utility Bill Upload</span>
                  </span>
                  <p className="text-xs text-slate-500">Upload your paid electricity or gas receipt to clear monthly ledger.</p>
                  <button
                    onClick={() => alert('📄 Upload paid bill photo')}
                    className="w-full py-2 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-slate-200"
                  >
                    Upload Paid Bill Photo
                  </button>
                </div>

                {/* Quick WhatsApp Link */}
                <button
                  onClick={() => window.open('https://wa.me/18007767625', '_blank')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with PropMAK Bot on WhatsApp</span>
                </button>
              </div>
            )}

            {/* SCREEN 2: LANDLORD MODE */}
            {mobileMode === 'LANDLORD' && (
              <div className="space-y-3.5 animate-in fade-in">
                
                {/* Net Payout Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 shadow-sm">
                  <span className="text-xs text-amber-400 uppercase font-bold">August 2026 Net Payout</span>
                  <div className="text-2xl font-extrabold text-white">
                    Rs. 290,500 <span className="text-xs text-amber-300 font-semibold">(£806.94 GBP)</span>
                  </div>
                  <p className="text-xs text-slate-400">Wire transfer ready to London Account</p>
                </div>

                {/* 1-Tap Cost Approval Card */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-900">🛠️ Urgent Repair Approval Needed</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white text-amber-900 font-bold border border-amber-200">Rs. 11,000</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Water pump motor capacitor burnt at Apartment 402. Ustaad Rafiq quote: Rs. 11,000.
                  </p>

                  {hasApprovedRepair ? (
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-center font-bold text-xs flex items-center justify-center gap-1">
                      <Check className="w-4 h-4 text-emerald-700" /> Approved by Dr. Tariq!
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          approveTicket('tkt_201');
                          setHasApprovedRepair(true);
                        }}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs"
                      >
                        1-Tap Approve
                      </button>
                      <button
                        onClick={() => alert('Quote rejected. Property manager will source another technician.')}
                        className="px-3 py-2 bg-white text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Portfolio Status Cards */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">My Managed Properties</span>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Apartment 402</span>
                      <span className="text-xs text-emerald-700 font-bold">Rented • Rs. 160k/mo</span>
                    </div>
                    <span className="text-xs text-slate-500">Grand Oak Tower</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">Upper Floor Villa</span>
                      <span className="text-xs text-amber-700 font-bold">Vacant (24 Days)</span>
                    </div>
                    <span className="text-xs text-slate-500">Asking Rs. 140k</span>
                  </div>
                </div>

              </div>
            )}

            {/* SCREEN 3: BUYER / INVESTOR MODE */}
            {mobileMode === 'BUYER' && (
              <div className="space-y-3.5 animate-in fade-in">
                
                {/* Purchased Unit Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 shadow-sm">
                  <span className="text-xs text-amber-400 uppercase font-bold">My Purchased Unit</span>
                  <div className="text-base font-extrabold text-white">
                    Corner Retail Shop #2
                  </div>
                  <p className="text-xs text-slate-400">Apex Commercial Plaza</p>
                  
                  <div className="pt-2 flex justify-between items-center text-xs border-t border-white/10">
                    <span className="text-slate-300">Token Deposit Paid:</span>
                    <span className="font-bold text-amber-400">Rs. 10 Lacs</span>
                  </div>
                </div>

                {/* 1-Click 'Sold-to-Rent' Request */}
                <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                  <span className="font-bold text-teal-900 block text-xs">💡 Want PropMAK to Rent This Out For You?</span>
                  <p className="text-xs text-teal-800 leading-relaxed">
                    We will find corporate tenants, vet them, collect monthly rent, and disburse directly to your account.
                  </p>
                  <button
                    onClick={() => alert('✅ Request received! PropMAK agent will list your property for rent upon handover.')}
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>Request Agency: "Rent Out My Unit"</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Bottom Phone Indicator */}
          <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-2"></div>
        </div>
      </div>

    </div>
  );
};
