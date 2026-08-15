'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Percent, 
  Save, 
  X, 
  Check, 
  LogOut,
  Bell,
  Sliders,
  KeyRound
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

interface AgencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'financial' | 'notifications' | 'security';
  onLogout?: () => void;
}

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'financial' | 'notifications' | 'security'>(initialTab);
  const [isSaved, setIsSaved] = useState(false);

  // Form State
  const [managerName, setManagerName] = useState('Ahsan Malik');
  const [managerTitle, setManagerTitle] = useState('Senior Property Manager');
  const [managerEmail, setManagerEmail] = useState('ahsan.pm@propmak.com');
  const [managerPhone, setManagerPhone] = useState('+92 300 1234567');
  const [agencyName, setAgencyName] = useState('PROPMAK Real Estate Asset Management');
  const [officeAddress, setOfficeAddress] = useState('Level 4, Executive Plaza, Main Boulevard');

  // Financial Rules State
  const [managementFeePct, setManagementFeePct] = useState('8');
  const [annualRentEscalationPct, setAnnualRentEscalationPct] = useState('10');
  const [contractorApprovalThreshold, setContractorApprovalThreshold] = useState('5000');
  const [currencyCode, setCurrencyCode] = useState('PKR');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <Card className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Sliders className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 id="settings-modal-title" className="text-xl font-black text-slate-900 tracking-tight">
                Property Manager & Agency Settings
              </h2>
              <p className="text-sm font-medium text-slate-600">
                Configure manager profile, agency commission rules, and operations security
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Settings Modal"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto text-sm">
          {[
            { id: 'profile', label: 'Manager Profile & Agency', icon: User },
            { id: 'financial', label: 'Commission & Escalation Rules', icon: Percent },
            { id: 'notifications', label: 'Operations & Alerts', icon: Bell },
            { id: 'security', label: 'Security & Access', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive 
                    ? 'border-slate-900 text-slate-950 bg-slate-50/50' 
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* TAB 1: Profile & Agency */}
          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg">
                    AM
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{managerName}</h3>
                    <p className="text-sm text-slate-600 font-medium">{managerTitle} • {agencyName}</p>
                  </div>
                </div>
                <Badge variant="emerald">Active Manager Session</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Full Name</label>
                  <Input 
                    value={managerName} 
                    onChange={(e) => setManagerName(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Role / Position</label>
                  <Input 
                    value={managerTitle} 
                    onChange={(e) => setManagerTitle(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
                  <Input 
                    type="email"
                    value={managerEmail} 
                    onChange={(e) => setManagerEmail(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Direct Phone / WhatsApp</label>
                  <Input 
                    value={managerPhone} 
                    onChange={(e) => setManagerPhone(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-900 text-base">Agency Organization Details</h4>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Agency Legal Name</label>
                  <Input 
                    value={agencyName} 
                    onChange={(e) => setAgencyName(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Head Office Address</label>
                  <Input 
                    value={officeAddress} 
                    onChange={(e) => setOfficeAddress(e.target.value)} 
                    required 
                    className="bg-white font-medium text-sm"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Financial Rules */}
          {activeTab === 'financial' && (
            <div className="space-y-5 animate-in fade-in">
              
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
                <p className="font-bold text-sm">Automated Agency Financial Rules</p>
                <p className="text-sm text-amber-900 mt-0.5">
                  These parameters govern automated landlord net payouts, annual rent escalations, and contractor quote thresholds.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="block text-slate-900 font-bold">Default Agency Management Fee (%)</label>
                  <p className="text-slate-600 text-sm font-medium">Standard commission deducted from gross monthly rent.</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={managementFeePct} 
                      onChange={(e) => setManagementFeePct(e.target.value)} 
                      min="0"
                      max="30"
                      className="bg-white font-bold text-sm"
                    />
                    <span className="text-slate-700 font-extrabold text-sm">%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <label className="block text-slate-900 font-bold">Standard Annual Rent Increment (%)</label>
                  <p className="text-slate-600 text-sm font-medium">Automatic escalation percentage applied on lease renewals.</p>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number"
                      value={annualRentEscalationPct} 
                      onChange={(e) => setAnnualRentEscalationPct(e.target.value)} 
                      min="0"
                      max="50"
                      className="bg-white font-bold text-sm"
                    />
                    <span className="text-slate-700 font-extrabold text-sm">%</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <label className="block text-slate-900 font-bold">Contractor Quote Approval Threshold (Rs.)</label>
                <p className="text-slate-600 text-sm font-medium">
                  Quotes below this amount can be auto-authorized by the property manager. Quotes exceeding this require explicit Landlord WhatsApp approval.
                </p>
                <div className="flex items-center gap-2 max-w-xs">
                  <span className="text-slate-700 font-extrabold text-sm">Rs.</span>
                  <Input 
                    type="number"
                    value={contractorApprovalThreshold} 
                    onChange={(e) => setContractorApprovalThreshold(e.target.value)} 
                    step="500"
                    className="bg-white font-bold text-sm"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-base">Predictive Radar Notification Rules</h4>
                
                {[
                  { title: 'Lease Expiration Alerts (30 Days Prior)', desc: 'Notify manager when tenant leases are within 30 days of end date.', enabled: true },
                  { title: '10% Annual Rent Increment Due', desc: 'Alert manager 15 days before tenant lease anniversary.', enabled: true },
                  { title: 'Unpaid Utility Bill Warnings', desc: 'Flag utility bills pending clearance after due date.', enabled: true },
                  { title: 'Emergency Repair Escalations', desc: 'Immediate priority alert when plumbing or HVAC burst is reported.', enabled: true }
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-200">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{rule.title}</p>
                      <p className="text-sm text-slate-600 font-medium">{rule.desc}</p>
                    </div>
                    <Badge variant="emerald">Active</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Security & Session */}
          {activeTab === 'security' && (
            <div className="space-y-5 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold text-slate-900 text-base">Manager Authentication & Session</h4>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Logged in as <strong>{managerEmail}</strong> (Session ID: <code>pm_sess_89410</code>).
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <Button type="button" variant="outline" className="font-bold text-sm">
                    Change Password
                  </Button>
                  <Button type="button" variant="outline" className="font-bold text-sm">
                    View Security Audit Logs
                  </Button>
                </div>
              </div>

              {onLogout && (
                <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-rose-950 text-base">Sign Out of PROPMAK</h4>
                    <p className="text-sm text-rose-800 font-medium">End your active Property Manager session on this device.</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={onLogout}
                    className="font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4 mr-1.5" />
                    <span>Log Out</span>
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="font-bold text-sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="default"
              className="font-bold text-sm"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 text-emerald-400" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5 text-amber-400" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>

        </form>

      </Card>
    </div>
  );
};
