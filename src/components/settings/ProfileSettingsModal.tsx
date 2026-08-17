'use client';

import React, { useState } from 'react';
import {
  User,
  Shield,
  Save,
  X,
  Check,
  LogOut,
  KeyRound
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'security';
  onLogout?: () => void;
}

const HEADING = '#1B2559';

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'profile',
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>(initialTab);
  const [isSaved, setIsSaved] = useState(false);

  const [managerName, setManagerName] = useState('Ahsan Malik');
  const [managerTitle, setManagerTitle] = useState('Senior Property Manager');
  const [managerEmail, setManagerEmail] = useState('ahsan.pm@propmak.com');
  const [managerPhone, setManagerPhone] = useState('+92 300 1234567');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const tabs: { id: 'profile' | 'security'; label: string; icon: typeof User }[] = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <Card className="max-w-lg w-full bg-white overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">

        <div className="p-5 flex items-center justify-between" style={{ background: '#EEF1FA' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              AM
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-base font-bold" style={{ color: HEADING }}>
                My Profile
              </h2>
              <p className="text-[13px] text-slate-500">Personal details and account security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close profile settings"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Segmented tab control */}
        <div className="px-5 pt-4">
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

        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1 text-sm">

          {activeTab === 'profile' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-slate-500">{managerTitle}</span>
                <Badge variant="emerald">Active Session</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Full Name</label>
                  <Input value={managerName} onChange={(e) => setManagerName(e.target.value)} required className="bg-white font-medium text-sm" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Role / Position</label>
                  <Input value={managerTitle} onChange={(e) => setManagerTitle(e.target.value)} required className="bg-white font-medium text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Email Address</label>
                <Input type="email" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} required className="bg-white font-medium text-sm" />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 text-[13px]">Direct Phone / WhatsApp</label>
                <Input value={managerPhone} onChange={(e) => setManagerPhone(e.target.value)} required className="bg-white font-medium text-sm" />
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="rounded-xl p-4 space-y-3" style={{ background: '#EEF1FA' }}>
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-[13px]" style={{ color: HEADING }}>Authentication &amp; Session</h4>
                </div>
                <p className="text-[13px] text-slate-500">
                  Logged in as <strong>{managerEmail}</strong> (Session ID: <code>pm_sess_89410</code>).
                </p>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" size="sm" className="font-bold text-sm bg-white">Change Password</Button>
                  <Button type="button" variant="outline" size="sm" className="font-bold text-sm bg-white">View Audit Logs</Button>
                </div>
              </div>

              {onLogout && (
                <div className="rounded-xl p-4 bg-rose-50 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-rose-950 text-[13px]">Sign Out of PROPMAK</h4>
                    <p className="text-[13px] text-rose-700">End your session on this device.</p>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={onLogout} className="font-bold text-sm shrink-0">
                    <LogOut className="w-4 h-4 mr-1.5" />
                    Log Out
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button type="button" variant="outline" onClick={onClose} className="font-bold text-sm">Cancel</Button>
            <Button type="submit" variant="default" className="font-bold text-sm">
              {isSaved ? (
                <><Check className="w-4 h-4 mr-1.5" /><span>Saved!</span></>
              ) : (
                <><Save className="w-4 h-4 mr-1.5" /><span>Save Changes</span></>
              )}
            </Button>
          </div>

        </form>

      </Card>
    </div>
  );
};
