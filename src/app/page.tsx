'use client';

import React from 'react';
import { PropMAKProvider, usePropMAK } from '../context/PropMAKContext';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { OverviewStats } from '../components/dashboard/OverviewStats';
import { PredictiveRadar } from '../components/dashboard/PredictiveRadar';
import { PropertyMatrix } from '../components/properties/PropertyMatrix';
import { MaintenanceHub } from '../components/maintenance/MaintenanceHub';
import { FinanceHub } from '../components/finance/FinanceHub';
import { AutomationsHub } from '../components/automations/AutomationsHub';
import { ContractorDirectory } from '../components/contractors/ContractorDirectory';
import { StakeholderDirectory } from '../components/users/StakeholderDirectory';
import { AssetInventory } from '../components/assets/AssetInventory';
import { DocumentVault } from '../components/documents/DocumentVault';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Building2, 
  Receipt, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Wrench,
  Wallet,
  Cpu,
  Users
} from 'lucide-react';

function DashboardContent() {
  const { activeTab, setActiveTab, currentRole, units, tickets } = usePropMAK();

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white text-sm" style={{ background: '#EEF1FA' }}>

      {/* Skip to Main Content for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:font-bold focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar 
        onOpenCashModal={() => setActiveTab('finance')}
      />

      {/* App Body (Sidebar + Dynamic Main Area) */}
      <div className="flex-1 flex">
        
        {/* Navigation Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace with Error Boundary */}
        <main 
          id="main-content"
          tabIndex={-1}
          role="main"
          aria-label="Main Application Content"
          className="flex-1 p-6 md:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full space-y-6 focus:outline-none"
        >
          
          <ErrorBoundary fallbackTitle="PROPMAK Workspace Error">
            
            {/* PILLAR 1: DASHBOARD & PREDICTIVE RADAR */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[22px] font-bold tracking-tight" style={{ color: '#1B2559' }}>Dashboard</h1>
                    <p className="text-[13px] text-slate-500 mt-1">
                      {units.length} units · {tickets.filter(t => t.status !== 'COMPLETED').length} open repairs · updated just now
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setActiveTab('finance')}
                      className="text-[13px] font-medium bg-white rounded-lg px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors shadow-[0_2px_8px_rgba(30,42,90,0.08)]"
                      style={{ color: '#1B2559' }}
                    >
                      Finance &amp; Rent Roll
                    </button>
                    <button
                      onClick={() => setActiveTab('issues')}
                      className="text-[13px] font-medium text-white bg-blue-600 rounded-lg px-4 py-2 hover:bg-blue-700 cursor-pointer transition-colors"
                    >
                      Issues Pipeline ({tickets.filter(t => t.status !== 'COMPLETED').length})
                    </button>
                  </div>
                </div>

                {/* Financial & Portfolio Snapshot */}
                <OverviewStats />

                {/* Proactive Intelligence Radar */}
                <PredictiveRadar onOpenWhatsAppWithMessage={(msg, phone) => {
                  setActiveTab('automations');
                }} />

                {/* Quiet Quick Links */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-slate-500">
                  {[
                    { id: 'properties', label: 'Properties & Tenancies' },
                    { id: 'assets', label: 'Asset Inventory' },
                    { id: 'documents', label: 'Document Vault' },
                    { id: 'users', label: 'Stakeholders & Users' },
                  ].map(link => (
                    <button
                      key={link.id}
                      onClick={() => setActiveTab(link.id)}
                      className="hover:text-blue-600 cursor-pointer transition-colors"
                    >
                      {link.label} →
                    </button>
                  ))}
                </div>

              </div>
            )}

            {/* PILLAR 2: ISSUES & MAINTENANCE */}
            {activeTab === 'issues' && (
              <div className="animate-in fade-in">
                <MaintenanceHub />
              </div>
            )}

            {/* PILLAR 3: PROPERTIES & TENANCIES */}
            {activeTab === 'properties' && (
              <div className="animate-in fade-in">
                <PropertyMatrix />
              </div>
            )}

            {/* PILLAR 4: FINANCE & RENT ROLL */}
            {activeTab === 'finance' && (
              <div className="animate-in fade-in">
                <FinanceHub />
              </div>
            )}

            {/* STAKEHOLDERS & USERS DIRECTORY */}
            {activeTab === 'users' && (
              <div className="animate-in fade-in">
                <StakeholderDirectory onOpenWhatsApp={(msg, phone) => {
                  setActiveTab('automations');
                }} />
              </div>
            )}

            {/* AUTOMATIONS & CHANNELS */}
            {activeTab === 'automations' && (
              <div className="animate-in fade-in">
                <AutomationsHub />
              </div>
            )}

            {/* CONTRACTOR DIRECTORY */}
            {activeTab === 'contractors' && (
              <div className="animate-in fade-in">
                <ContractorDirectory />
              </div>
            )}

            {/* ASSET INVENTORY */}
            {activeTab === 'assets' && (
              <div className="animate-in fade-in h-full">
                <AssetInventory />
              </div>
            )}

            {/* DOCUMENT VAULT */}
            {activeTab === 'documents' && (
              <div className="animate-in fade-in h-full">
                <DocumentVault />
              </div>
            )}

          </ErrorBoundary>

        </main>
      </div>

    </div>
  );
}

export default function PropMAKDashboardPage() {
  return (
    <PropMAKProvider>
      <DashboardContent />
    </PropMAKProvider>
  );
}
