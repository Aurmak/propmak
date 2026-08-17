'use client';

import React, { useState } from 'react';
import {
  Building2,
  Percent,
  Bell,
  X,
  Check,
  Save
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface AgencyBusinessSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HEADING = '#1B2559';

interface NotificationRule {
  title: string;
  desc: string;
  enabled: boolean;
}

const DEFAULT_RULES: NotificationRule[] = [
  { title: 'Lease Expiration Alerts (30 Days Prior)', desc: 'Notify when tenant leases are within 30 days of end date.', enabled: true },
  { title: '10% Annual Rent Increment Due', desc: 'Alert 15 days before a tenant lease anniversary.', enabled: true },
  { title: 'Unpaid Utility Bill Warnings', desc: 'Flag utility bills pending clearance after due date.', enabled: true },
  { title: 'Emergency Repair Escalations', desc: 'Immediate priority alert on a plumbing or HVAC burst report.', enabled: false },
];

const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={cn(
      'w-10 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer',
      checked ? 'bg-blue-600' : 'bg-slate-300'
    )}
  >
    <span className={cn(
      'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
      checked ? 'translate-x-[18px]' : 'translate-x-0.5'
    )} />
  </button>
);

export const AgencyBusinessSettingsModal: React.FC<AgencyBusinessSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'organization' | 'financial' | 'notifications'>('organization');
  const [isSaved, setIsSaved] = useState(false);

  const [agencyName, setAgencyName] = useState('PROPMAK Real Estate Asset Management');
  const [officeAddress, setOfficeAddress] = useState('Level 4, Executive Plaza, Main Boulevard');

  const [managementFeePct, setManagementFeePct] = useState('8');
  const [annualRentEscalationPct, setAnnualRentEscalationPct] = useState('10');
  const [contractorApprovalThreshold, setContractorApprovalThreshold] = useState('5000');

  const [rules, setRules] = useState<NotificationRule[]>(DEFAULT_RULES);

  if (!isOpen) return null;

  const toggleRule = (idx: number) => {
    setRules(prev => prev.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => { setIsSaved(false); onClose(); }, 800);
  };

  const tabs: { id: typeof activeTab; label: string; icon: typeof Building2 }[] = [
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'financial', label: 'Commission & Escalation', icon: Percent },
    { id: 'notifications', label: 'Notification Rules', icon: Bell },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="agency-settings-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <Card className="max-w-2xl w-full bg-white overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">

        <div className="p-6 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div>
            <h2 id="agency-settings-title" className="text-xl font-bold" style={{ color: HEADING }}>Agency Settings</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              Business-wide configuration — applies across every property, not just your account
            </p>
          </div>
          <button onClick={onClose} aria-label="Close agency settings" className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-lg text-[13px] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap',
                    isActive ? 'bg-white text-blue-600 shadow-sm font-semibold' : 'text-slate-500 font-medium hover:text-slate-700'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5 flex-1 text-sm">

          {activeTab === 'organization' && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Agency Legal Name</label>
                <Input value={agencyName} onChange={(e) => setAgencyName(e.target.value)} required className="bg-white font-medium text-sm" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Head Office Address</label>
                <Input value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} required className="bg-white font-medium text-sm" />
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-xl p-4" style={{ background: '#EEF1FA' }}>
                <p className="font-semibold text-[13px]" style={{ color: HEADING }}>Automated Agency Financial Rules</p>
                <p className="text-[13px] text-slate-500 mt-0.5">
                  Governs landlord net payouts, annual rent escalations, and contractor quote thresholds across the whole portfolio.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-bold text-[13px]">Default Management Fee (%)</label>
                  <p className="text-slate-500 text-[12px]">Standard commission deducted from gross monthly rent.</p>
                  <Input type="number" value={managementFeePct} onChange={(e) => setManagementFeePct(e.target.value)} min="0" max="30" className="bg-white font-bold text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-bold text-[13px]">Annual Rent Increment (%)</label>
                  <p className="text-slate-500 text-[12px]">Automatic escalation applied on lease renewals.</p>
                  <Input type="number" value={annualRentEscalationPct} onChange={(e) => setAnnualRentEscalationPct(e.target.value)} min="0" max="50" className="bg-white font-bold text-sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold text-[13px]">Contractor Quote Approval Threshold (Rs.)</label>
                <p className="text-slate-500 text-[12px]">
                  Quotes below this are auto-authorized. Quotes above require explicit landlord WhatsApp approval.
                </p>
                <Input type="number" value={contractorApprovalThreshold} onChange={(e) => setContractorApprovalThreshold(e.target.value)} step="500" className="bg-white font-bold text-sm max-w-xs" />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-2.5 animate-in fade-in">
              {rules.map((rule, idx) => (
                <div key={rule.title} className="flex items-center justify-between gap-4 p-3.5 rounded-xl" style={{ background: '#EEF1FA' }}>
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px]" style={{ color: HEADING }}>{rule.title}</p>
                    <p className="text-[13px] text-slate-500 mt-0.5">{rule.desc}</p>
                  </div>
                  <Toggle checked={rule.enabled} onChange={() => toggleRule(idx)} />
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="font-bold text-sm">Cancel</Button>
            <Button type="submit" variant="default" className="font-bold text-sm">
              {isSaved ? (<><Check className="w-4 h-4 mr-1.5" /><span>Saved!</span></>) : (<><Save className="w-4 h-4 mr-1.5" /><span>Save Changes</span></>)}
            </Button>
          </div>

        </form>

      </Card>
    </div>
  );
};
