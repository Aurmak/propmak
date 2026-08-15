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
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 flex flex-col font-sans selection:bg-slate-900 selection:text-white text-sm">
      
      {/* Skip to Main Content for Accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-slate-900 focus:text-white focus:rounded-xl focus:shadow-lg focus:font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                
                {/* Operations Hero Section */}
                <Card className="p-7">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    {/* Left Column: Headline & Action Triggers (7 cols) */}
                    <div className="lg:col-span-7 space-y-3.5">
                      <Badge variant="secondary">
                        Operations Command Center
                      </Badge>

                      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        Enterprise Property Management with <span className="text-amber-600">Automated Intelligence</span>.
                      </h1>

                      <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
                        Automate lease renewals, ingest WhatsApp repair requests into tickets, verify bank transfers, and manage daily field cash collections in real time.
                      </p>

                      <div className="pt-2 flex flex-wrap items-center gap-3 text-sm">
                        <Button
                          onClick={() => setActiveTab('issues')}
                          variant="default"
                        >
                          <Wrench className="w-4 h-4 text-amber-400 mr-1.5" />
                          <span>Issues Pipeline ({tickets.filter(t => t.status !== 'COMPLETED').length} Open)</span>
                        </Button>

                        <Button
                          onClick={() => setActiveTab('finance')}
                          variant="emerald"
                        >
                          <Wallet className="w-4 h-4 mr-1.5" />
                          <span>Finance & Rent Roll</span>
                        </Button>
                      </div>
                    </div>

                    {/* Right Column: Live Operational Snapshot Card (5 cols) */}
                    <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
                        <span className="text-sm font-bold text-slate-900 uppercase tracking-wider">Today's Pulse</span>
                        <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-bold">
                          <ShieldCheck className="w-4 h-4" aria-hidden="true" /> All Systems Synced
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-600 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-amber-500" aria-hidden="true" />
                            <span>Leases Expiring (&lt; 30 Days):</span>
                          </span>
                          <span className="font-bold text-slate-900">Apt 402 (Grand Oak)</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-600 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                            <span>10% Rent Escalations Due:</span>
                          </span>
                          <span className="font-bold text-emerald-700">Retail Shop #1</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-600 flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                            <span>Portfolio Inventory:</span>
                          </span>
                          <span className="font-bold text-slate-900">{units.length} Units Active</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>

                {/* Financial & Portfolio KPI Cards */}
                <OverviewStats />

                {/* Proactive Intelligence Radar */}
                <PredictiveRadar onOpenWhatsAppWithMessage={(msg, phone) => {
                  setActiveTab('automations');
                }} />

                {/* Quick Operational Shortcuts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  
                  {/* Issues & Maintenance Quick Link */}
                  <Card 
                    onClick={() => setActiveTab('issues')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('issues'); } }}
                    aria-label="Open Issues & Maintenance Pipeline"
                    className="p-5 hover:border-slate-800 cursor-pointer transition-all group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center" aria-hidden="true">
                        <Wrench className="w-5 h-5" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-3">Issues & Maintenance</h3>
                    <p className="text-slate-600 text-sm font-medium mt-1">Multi-channel repair intake, mistri assignment, and tenant verification.</p>
                  </Card>

                  {/* Properties Quick Link */}
                  <Card 
                    onClick={() => setActiveTab('properties')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('properties'); } }}
                    aria-label="Open Properties & Tenancies"
                    className="p-5 hover:border-slate-800 cursor-pointer transition-all group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center" aria-hidden="true">
                        <Building2 className="w-5 h-5" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-3">Properties & Tenancies</h3>
                    <p className="text-slate-600 text-sm font-medium mt-1">Portfolio matrix, plaza floor breakdown, tenancy specs, and inspector drawer.</p>
                  </Card>

                  {/* Finance & Rent Roll Quick Link */}
                  <Card 
                    onClick={() => setActiveTab('finance')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveTab('finance'); } }}
                    aria-label="Open Finance & Rent Roll"
                    className="p-5 hover:border-slate-800 cursor-pointer transition-all group shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center" aria-hidden="true">
                        <Receipt className="w-5 h-5" />
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" aria-hidden="true" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-3">Finance & Rent Roll</h3>
                    <p className="text-slate-600 text-sm font-medium mt-1">Rent roll audit, bank slip verification, field cashbook, and landlord statements.</p>
                  </Card>

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
