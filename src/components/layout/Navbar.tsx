'use client';

import React, { useState } from 'react';
import {
  Building2,
  Search,
  Bell,
  AlertTriangle,
  User,
  ChevronDown,
  LogOut,
  Shield,
  Check
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ProfileSettingsModal } from '../settings/ProfileSettingsModal';

interface NavbarProps {
  onOpenCashModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCashModal 
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    alerts, 
    cashDrawer,
    setActiveTab 
  } = usePropMAK();

  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'profile' | 'security'>('profile');
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

  const handleOpenSettings = (tab: 'profile' | 'security') => {
    setSettingsTab(tab);
    setIsProfileMenuOpen(false);
    setIsSettingsModalOpen(true);
  };

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    setIsSettingsModalOpen(false);
    setShowLogoutAlert(true);
    setTimeout(() => {
      setShowLogoutAlert(false);
    }, 2500);
  };

  return (
    <>
      <header role="banner" aria-label="Main Application Header" className="sticky top-0 z-40 bg-white border-b border-[#D0D5DD] shadow-2xs text-slate-800">
        <div className="flex items-center justify-between px-6 py-3 gap-6">
          
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-3.5 min-w-[320px]">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black shadow-md border border-slate-800 shrink-0" aria-hidden="true">
              <Building2 className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <span className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight block leading-none">
                PROPMAK
              </span>
              <p className="text-sm font-bold text-slate-600 mt-1">Property Management Platform</p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div role="search" aria-label="Global portfolio search" className="flex-1 max-w-xl relative hidden md:block">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <Input
              id="global-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search properties, units, tenants, maintenance tickets, payment slips..."
              aria-label="Search properties, units, tenants, maintenance tickets, payment slips"
              className="pl-10 text-sm"
            />
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Predictive Alerts Notification Bell */}
            <div className="relative">
              <Button
                onClick={() => {
                  setShowAlertsDropdown(!showAlertsDropdown);
                  setIsProfileMenuOpen(false);
                }}
                variant="outline"
                size="icon"
                aria-haspopup="dialog"
                aria-expanded={showAlertsDropdown}
                aria-label={`Predictive Operations Alerts (${alerts.length} total, ${criticalAlertsCount} critical)`}
                className="relative"
              >
                <Bell className="w-5 h-5 text-slate-700" aria-hidden="true" />
                {criticalAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-rose-600 text-sm font-bold text-white shadow-sm" aria-hidden="true">
                    {criticalAlertsCount}
                  </span>
                )}
              </Button>

              {/* Alerts Dropdown Drawer */}
              {showAlertsDropdown && (
                <div 
                  role="dialog"
                  aria-label="Predictive Operations Radar Alerts"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-xl border border-slate-200 z-50 p-4 max-h-[480px] overflow-y-auto animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                    <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                      <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                      <span>Predictive Operations Radar</span>
                    </div>
                    <Badge variant="secondary">{alerts.length} Active</Badge>
                  </div>
                  
                  <div className="space-y-2.5">
                    {alerts.map(alert => (
                      <div 
                        key={alert.id} 
                        className={`p-3.5 rounded-xl border transition-all ${
                          alert.severity === 'CRITICAL' 
                            ? 'bg-rose-50 border-rose-200 text-rose-900' 
                            : alert.severity === 'WARNING'
                            ? 'bg-amber-50 border-amber-200 text-amber-900'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 font-bold text-sm">
                          <span>{alert.title}</span>
                          {alert.metricValue && (
                            <Badge variant="outline" className="bg-white">
                              {alert.metricValue}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-800 mt-1.5 leading-relaxed">{alert.description}</p>
                        
                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-black/5">
                          <span className="text-sm font-semibold text-slate-700">
                            {alert.daysRemaining ? `${alert.daysRemaining} days left` : 'Immediate Attention'}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowAlertsDropdown(false);
                              setActiveTab('dashboard');
                            }}
                            className="h-7 text-sm font-bold text-slate-900 hover:text-amber-600 p-0"
                          >
                            Resolve Alert →
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Manager Operator Interactive Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                  setShowAlertsDropdown(false);
                }}
                aria-haspopup="menu"
                aria-expanded={isProfileMenuOpen}
                aria-label="Property Manager Profile & Settings Menu"
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-900 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm font-black shrink-0">
                  PM
                </div>
                <div className="hidden sm:block text-left leading-tight">
                  <p className="text-sm font-bold text-slate-900">Property Manager</p>
                  <p className="text-sm text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Active Session</span>
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 ml-0.5" />
              </button>

              {/* Profile Menu Dropdown */}
              {isProfileMenuOpen && (
                <div 
                  role="menu" 
                  aria-label="Property Manager Account Options"
                  className="absolute right-0 mt-2 w-80 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 z-50 p-2.5 space-y-1.5 animate-in fade-in"
                >
                  {/* Profile Header */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm">
                        AM
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm leading-tight">Ahsan Malik</p>
                        <p className="text-sm text-slate-600 font-medium">ahsan.pm@propmak.com</p>
                        <Badge variant="secondary" className="mt-1">Senior Property Manager</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Options */}
                  <button
                    role="menuitem"
                    onClick={() => handleOpenSettings('profile')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition-all cursor-pointer text-left"
                  >
                    <User className="w-4 h-4 text-slate-600" />
                    <span>My Profile</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleOpenSettings('security')}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-slate-950 transition-all cursor-pointer text-left"
                  >
                    <Shield className="w-4 h-4 text-slate-600" />
                    <span>Security</span>
                  </button>

                  <div className="pt-2 border-t border-slate-200">
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-rose-700 hover:bg-rose-50 hover:text-rose-900 transition-all cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Log Out of Session</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Personal Profile & Security Modal */}
      <ProfileSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsTab}
        onLogout={handleLogout}
      />

      {/* Logout Toast Notification */}
      {showLogoutAlert && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Session Ended</p>
            <p className="text-sm text-slate-300">You have been logged out of your Property Manager account.</p>
          </div>
        </div>
      )}
    </>
  );
};
