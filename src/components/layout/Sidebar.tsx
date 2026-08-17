'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Wrench,
  Building,
  Wallet,
  Users,
  UserCheck,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  FileText,
  Settings
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';
import { AgencyBusinessSettingsModal } from '../settings/AgencyBusinessSettingsModal';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    units
  } = usePropMAK();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showAgencySettings, setShowAgencySettings] = useState(false);

  const operationalNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'issues', label: 'Issues & Maintenance', icon: Wrench },
    { id: 'properties', label: 'Properties & Tenancies', icon: Building },
    { id: 'finance', label: 'Finance & Rent Roll', icon: Wallet },
    { id: 'assets', label: 'Asset Inventory', icon: Package },
    { id: 'documents', label: 'Document Vault', icon: FileText }
  ];

  const systemNavItems = [
    { id: 'users', label: 'Stakeholders & Users', icon: UserCheck },
    { id: 'automations', label: 'Inbound Messages & Activity', icon: MessageSquare },
    { id: 'contractors', label: 'Contractor Directory', icon: Users }
  ];

  return (
    <aside
      aria-label="Application Sidebar"
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } transition-all duration-300 ease-in-out flex flex-col h-[calc(100vh-68px)] sticky top-[68px] select-none text-white z-30 shrink-0`}
      style={{ background: 'linear-gradient(180deg, #2A3FA0 0%, #1B2559 100%)' }}
    >

      {/* Sidebar Header with Collapse / Expand Toggle Button */}
      <div className={`p-3 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
        {!isCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50 pl-2 whitespace-nowrap">
            Navigation Menu
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav role="navigation" aria-label="Management Modules Navigation" className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">

        {/* Section 1: Core Operations */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-white/40 whitespace-nowrap">
              Operations
            </div>
          )}

          {operationalNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-sm transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-3'
                    : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 font-medium hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Section 2: Automation & Directories */}
        <div className="space-y-1 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
          {!isCollapsed && (
            <div className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-white/40 whitespace-nowrap">
              Directory & Settings
            </div>
          )}

          {systemNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center rounded-xl text-sm transition-all group cursor-pointer ${
                  isCollapsed
                    ? 'justify-center p-3'
                    : 'px-3.5 py-2.5 gap-3'
                } ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/70 font-medium hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}

          {/* Agency Settings — business-wide config, deliberately separate from the personal profile menu */}
          <button
            onClick={() => setShowAgencySettings(true)}
            title={isCollapsed ? 'Agency Settings' : undefined}
            className={`w-full flex items-center rounded-xl text-sm transition-all group cursor-pointer ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'
            } text-white/70 font-medium hover:bg-white/10 hover:text-white`}
          >
            <Settings className="w-5 h-5 shrink-0" aria-hidden="true" />
            {!isCollapsed && <span className="whitespace-nowrap">Agency Settings</span>}
          </button>
        </div>

      </nav>

      <AgencyBusinessSettingsModal isOpen={showAgencySettings} onClose={() => setShowAgencySettings(false)} />

      {/* Sidebar Footer */}
      <div className="p-3 text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
        {!isCollapsed ? (
          <div className="flex items-center justify-between font-semibold px-1 whitespace-nowrap text-white/70">
            <span>Active Units:</span>
            <span className="text-white font-bold">{units.length} Managed</span>
          </div>
        ) : (
          <div className="text-center font-bold text-white text-sm" title={`${units.length} Units Managed`}>
            {units.length}
          </div>
        )}
      </div>

    </aside>
  );
};
