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
  PanelLeftOpen
} from 'lucide-react';
import { usePropMAK } from '../../context/PropMAKContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    units 
  } = usePropMAK();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const operationalNavItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'issues',
      label: 'Issues & Maintenance',
      icon: Wrench
    },
    {
      id: 'properties',
      label: 'Properties & Tenancies',
      icon: Building
    },
    {
      id: 'finance',
      label: 'Finance & Rent Roll',
      icon: Wallet
    }
  ];

  const systemNavItems = [
    {
      id: 'users',
      label: 'Stakeholders & Users',
      icon: UserCheck
    },
    {
      id: 'automations',
      label: 'Inbound Messages & Activity',
      icon: MessageSquare
    },
    {
      id: 'contractors',
      label: 'Contractor Directory',
      icon: Users
    }
  ];

  return (
    <aside 
      aria-label="Application Sidebar" 
      className={`${
        isCollapsed ? 'w-20' : 'w-72'
      } transition-all duration-300 ease-in-out bg-white border-r border-[#D0D5DD] flex flex-col h-[calc(100vh-68px)] sticky top-[68px] select-none text-slate-900 z-30 shrink-0`}
    >
      
      {/* Sidebar Header with Collapse / Expand Toggle Button */}
      <div className={`p-3 border-b border-slate-200 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <span className="text-sm font-bold uppercase tracking-wider text-slate-700 pl-2 whitespace-nowrap">
            Navigation Menu
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5 text-slate-800" />
          ) : (
            <PanelLeftClose className="w-5 h-5 text-slate-800" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav role="navigation" aria-label="Management Modules Navigation" className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        
        {/* Section 1: Core Operations */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-sm font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
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
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-900 font-semibold hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-amber-400' : 'text-slate-700 group-hover:text-slate-950'
                }`} aria-hidden="true" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Section 2: Automation & Directories */}
        <div className="space-y-1 pt-3 border-t border-slate-200">
          {!isCollapsed && (
            <div className="px-3 pb-2 text-sm font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
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
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'text-slate-900 font-semibold hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                  isActive ? 'text-amber-400' : 'text-slate-700 group-hover:text-slate-950'
                }`} aria-hidden="true" />
                {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </div>

      </nav>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-200 text-sm text-slate-700 bg-slate-50/80">
        {!isCollapsed ? (
          <div className="flex items-center justify-between font-bold px-1 whitespace-nowrap">
            <span>Active Units:</span>
            <span className="text-slate-900 font-extrabold">{units.length} Managed</span>
          </div>
        ) : (
          <div className="text-center font-extrabold text-slate-900 text-sm" title={`${units.length} Units Managed`}>
            {units.length}
          </div>
        )}
      </div>

    </aside>
  );
};
