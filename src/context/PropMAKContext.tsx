'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  Unit, 
  PaymentTransaction, 
  MaintenanceTicket, 
  UtilityBillRecord, 
  PredictiveAlert, 
  LandlordPayout, 
  CashDrawerState,
  UserRole,
  PropertyStatus,
  WhatsAppIngestedMessage,
  TradeCategory,
  TicketUrgency,
  TicketStatus,
  Stakeholder,
  Contractor
} from '../types';
import { 
  mockUnits, 
  mockTransactions, 
  mockTickets, 
  mockUtilityBills, 
  mockPredictiveAlerts, 
  mockLandlordPayouts, 
  mockCashDrawer,
  mockWhatsAppIngestionEvents,
  mockStakeholders,
  mockContractors
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface PropMAKContextType {
  // State
  units: Unit[];
  stakeholders: Stakeholder[];
  contractors: Contractor[];
  transactions: PaymentTransaction[];
  tickets: MaintenanceTicket[];
  utilityBills: UtilityBillRecord[];
  alerts: PredictiveAlert[];
  payouts: LandlordPayout[];
  cashDrawer: CashDrawerState;
  whatsAppIngestEvents: WhatsAppIngestedMessage[];
  currentRole: UserRole;
  searchQuery: string;
  activeTab: string;

  // Setters
  setCurrentRole: (role: UserRole) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: string) => void;

  // Actions
  addUnit: (unitData: Omit<Unit, 'id' | 'createdAt'>) => string;
  updateUnit: (unitId: string, unitData: Partial<Unit>) => void;
  deleteUnit: (unitId: string) => void;
  assignTenantToUnit: (
    unitId: string, 
    tenant: Stakeholder, 
    leaseStartDate: string, 
    leaseEndDate: string, 
    monthlyRent: number, 
    securityDeposit?: number, 
    escalationPercent?: number
  ) => void;
  addStakeholder: (stakeholderData: Omit<Stakeholder, 'id'>) => string;
  updateStakeholder: (stakeholderId: string, stakeholderData: Partial<Stakeholder>) => void;
  deleteStakeholder: (stakeholderId: string) => void;
  addContractor: (contractorData: Omit<Contractor, 'id'>) => string;
  updateContractor: (contractorId: string, contractorData: Partial<Contractor>) => void;
  deleteContractor: (contractorId: string) => void;
  addUtilityBill: (billData: Omit<UtilityBillRecord, 'id'>) => string;
  updateUtilityBill: (billId: string, billData: Partial<UtilityBillRecord>) => void;
  deleteUtilityBill: (billId: string) => void;
  verifyTransaction: (transactionId: string) => void;
  recordCashPayment: (payment: {
    unitId: string;
    amount: number;
    monthPeriod: string;
    collectedBy: string;
    notes?: string;
  }) => string;
  convertSoldToRent: (unitId: string, targetRent: number) => void;
  approveTicket: (ticketId: string) => void;
  completeTicket: (ticketId: string) => void;
  assignContractorToTicket: (
    ticketId: string, 
    contractor: { name: string; phone: string; trade: string },
    materialCost: number,
    labourCost: number
  ) => void;
  markJobFinishedByContractor: (ticketId: string) => void;
  verifyWorkByTenant: (ticketId: string, rating: number, photos?: string[], feedback?: string) => void;
  closeTicketAndMakeInvoicePayable: (ticketId: string) => void;
  createTicket: (ticketData: {
    unitId: string;
    title: string;
    description: string;
    category: TradeCategory;
    urgency: TicketUrgency;
    materialCost?: number;
    labourCost?: number;
  }) => string;
  deleteTicket: (ticketId: string) => void;
  depositCashDrawer: () => void;
  ingestWhatsAppMessage: (senderPhone: string, messageText: string, mediaUrl?: string) => WhatsAppIngestedMessage;
}

const PropMAKContext = createContext<PropMAKContextType | undefined>(undefined);

export const PropMAKProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<Unit[]>(mockUnits);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(mockStakeholders);
  const [contractors, setContractors] = useState<Contractor[]>(mockContractors);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(mockTransactions);
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(mockTickets);
  const [utilityBills, setUtilityBills] = useState<UtilityBillRecord[]>(mockUtilityBills);
  const [alerts, setAlerts] = useState<PredictiveAlert[]>(mockPredictiveAlerts);
  const [payouts, setPayouts] = useState<LandlordPayout[]>(mockLandlordPayouts);
  const [cashDrawer, setCashDrawer] = useState<CashDrawerState>(mockCashDrawer);
  const [whatsAppIngestEvents, setWhatsAppIngestEvents] = useState<WhatsAppIngestedMessage[]>(mockWhatsAppIngestionEvents);
  
  const [currentRole, setCurrentRole] = useState<UserRole>('PROPERTY_MANAGER');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }
  };

  // Add New Property / Unit
  const addUnit = (unitData: Omit<Unit, 'id' | 'createdAt'>): string => {
    const newId = `unit_${Date.now()}`;
    const newUnit: Unit = {
      ...unitData,
      id: newId,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUnits(prev => [newUnit, ...prev]);
    triggerConfetti();
    return newId;
  };

  // Edit / Update Unit
  const updateUnit = (unitId: string, unitData: Partial<Unit>) => {
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          ...unitData
        };
      }
      return u;
    }));
    triggerConfetti();
  };

  // Delete Unit
  const deleteUnit = (unitId: string) => {
    setUnits(prev => prev.filter(u => u.id !== unitId));
    setTickets(prev => prev.filter(t => t.unitId !== unitId));
    setTransactions(prev => prev.filter(t => t.unitId !== unitId));
    setUtilityBills(prev => prev.filter(b => b.unitId !== unitId));
    setAlerts(prev => prev.filter(a => a.unitId !== unitId));
  };

  // Assign / Sign New Tenant Lease to a Unit
  const assignTenantToUnit = (
    unitId: string, 
    tenant: Stakeholder, 
    leaseStartDate: string, 
    leaseEndDate: string, 
    monthlyRent: number, 
    securityDeposit: number = 0, 
    escalationPercent: number = 10
  ) => {
    // Add to stakeholders directory if not present
    setStakeholders(prev => {
      if (!prev.some(s => s.id === tenant.id || s.phone === tenant.phone)) {
        return [tenant, ...prev];
      }
      return prev;
    });

    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status: 'RENTED_DIRECT',
          renter: tenant,
          occupier: tenant,
          monthlyRent,
          securityDeposit,
          annualEscalationPercent: escalationPercent,
          leaseStartDate,
          leaseEndDate,
          daysVacant: 0
        };
      }
      return u;
    }));

    // Remove any vacancy alerts for this unit
    setAlerts(prev => prev.filter(a => a.unitId !== unitId));
    triggerConfetti();
  };

  // Add New Stakeholder (Owner, Tenant, Staff)
  const addStakeholder = (stakeholderData: Omit<Stakeholder, 'id'>): string => {
    const newId = `usr_${Date.now()}`;
    const newStakeholder: Stakeholder = {
      ...stakeholderData,
      id: newId
    };

    setStakeholders(prev => [newStakeholder, ...prev]);
    triggerConfetti();
    return newId;
  };

  // Edit / Update Stakeholder
  const updateStakeholder = (stakeholderId: string, stakeholderData: Partial<Stakeholder>) => {
    setStakeholders(prev => prev.map(s => {
      if (s.id === stakeholderId) {
        return {
          ...s,
          ...stakeholderData
        };
      }
      return s;
    }));
    triggerConfetti();
  };

  // Delete Stakeholder
  const deleteStakeholder = (stakeholderId: string) => {
    setStakeholders(prev => prev.filter(s => s.id !== stakeholderId));
  };

  // Add New Contractor / Mistri
  const addContractor = (contractorData: Omit<Contractor, 'id'>): string => {
    const newId = `ct_${Date.now()}`;
    const newContractor: Contractor = {
      ...contractorData,
      id: newId
    };

    setContractors(prev => [newContractor, ...prev]);
    triggerConfetti();
    return newId;
  };

  // Edit / Update Contractor
  const updateContractor = (contractorId: string, contractorData: Partial<Contractor>) => {
    setContractors(prev => prev.map(c => {
      if (c.id === contractorId) {
        return {
          ...c,
          ...contractorData
        };
      }
      return c;
    }));
    triggerConfetti();
  };

  // Delete Contractor
  const deleteContractor = (contractorId: string) => {
    setContractors(prev => prev.filter(c => c.id !== contractorId));
  };

  // Add New Utility Bill
  const addUtilityBill = (billData: Omit<UtilityBillRecord, 'id'>): string => {
    const newId = `bill_${Date.now()}`;
    const newBill: UtilityBillRecord = {
      ...billData,
      id: newId
    };

    setUtilityBills(prev => [newBill, ...prev]);
    triggerConfetti();
    return newId;
  };

  // Edit / Update Utility Bill
  const updateUtilityBill = (billId: string, billData: Partial<UtilityBillRecord>) => {
    setUtilityBills(prev => prev.map(b => {
      if (b.id === billId) {
        return {
          ...b,
          ...billData
        };
      }
      return b;
    }));
    triggerConfetti();
  };

  // Delete Utility Bill
  const deleteUtilityBill = (billId: string) => {
    setUtilityBills(prev => prev.filter(b => b.id !== billId));
  };

  // Delete Maintenance Ticket
  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  // 1-Click Verification of Bank Transfers
  const verifyTransaction = (transactionId: string) => {
    setTransactions(prev => prev.map(tx => {
      if (tx.id === transactionId) {
        return {
          ...tx,
          status: 'VERIFIED',
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return tx;
    }));

    triggerConfetti();
  };

  // Record Field Cash Collection
  const recordCashPayment = (payment: {
    unitId: string;
    amount: number;
    monthPeriod: string;
    collectedBy: string;
    notes?: string;
  }): string => {
    const targetUnit = units.find(u => u.id === payment.unitId);
    const receiptNo = `REC-2026-CASH-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      unitId: payment.unitId,
      unitName: targetUnit?.unitNumber || 'Unit',
      propertyName: targetUnit?.propertyName || 'Property',
      tenantName: targetUnit?.renter?.name || 'Cash Tenant',
      tenantPhone: targetUnit?.renter?.phone || '+1 (555) 000-0000',
      amount: payment.amount,
      monthPeriod: payment.monthPeriod,
      method: 'CASH',
      status: 'VERIFIED',
      receiptNumber: receiptNo,
      collectedBy: payment.collectedBy,
      receivedDate: new Date().toISOString().split('T')[0],
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'FIELD_COLLECTOR'
    };

    setTransactions(prev => [newTx, ...prev]);

    setCashDrawer(prev => ({
      ...prev,
      cashInHand: prev.cashInHand + payment.amount,
      collectedToday: prev.collectedToday + payment.amount
    }));

    triggerConfetti();
    return receiptNo;
  };

  // 1-Click "Sold-to-Rent" Conversion
  const convertSoldToRent = (unitId: string, targetRent: number) => {
    setUnits(prev => prev.map(unit => {
      if (unit.id === unitId) {
        return {
          ...unit,
          status: 'SOLD_CONVERTED_TO_RENT',
          monthlyRent: targetRent,
          daysVacant: 0
        };
      }
      return unit;
    }));

    setAlerts(prev => prev.filter(a => a.unitId !== unitId));
    triggerConfetti();
  };

  // Landlord 1-Tap Cost Approval
  const approveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'IN_PROGRESS'
        };
      }
      return t;
    }));

    setAlerts(prev => prev.filter(a => !(a.type === 'APPROVAL_BOTTLENECK' && a.unitId === 'unit_101')));
    triggerConfetti();
  };

  // Complete Maintenance Ticket (Legacy)
  const completeTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'COMPLETED',
          contractorInvoiceStatus: 'PAYABLE',
          completedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    triggerConfetti();
  };

  // 1. Contractor finishes job -> sends verification request to Tenant & Agent
  const markJobFinishedByContractor = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'AWAITING_TENANT_VERIFICATION'
        };
      }
      return t;
    }));
  };

  // 2. Tenant marks work done in Tenant App / WhatsApp link and uploads photos
  const verifyWorkByTenant = (ticketId: string, rating: number, photos?: string[], feedback?: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'TENANT_VERIFIED',
          tenantVerification: {
            verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            rating,
            photos: photos || ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'],
            feedback
          }
        };
      }
      return t;
    }));
    triggerConfetti();
  };

  // 3. Agent reviews tenant verification & photos -> marks closed -> contractor invoice is now PAYABLE
  const closeTicketAndMakeInvoicePayable = (ticketId: string) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'COMPLETED',
          contractorInvoiceStatus: 'PAYABLE',
          completedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    triggerConfetti();
  };

  // Assign Contractor & Dispatch Work Order
  const assignContractorToTicket = (
    ticketId: string, 
    contractor: { name: string; phone: string; trade: string },
    materialCost: number,
    labourCost: number
  ) => {
    const totalCost = materialCost + labourCost;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          assignedMistri: contractor,
          materialCost,
          labourCost,
          totalCost,
          contractorInvoiceStatus: 'PENDING_COMPLETION',
          status: totalCost > 5000 ? 'LANDLORD_APPROVAL_REQUIRED' : 'IN_PROGRESS'
        };
      }
      return t;
    }));

    triggerConfetti();
  };

  // Create Maintenance Ticket
  const createTicket = (ticketData: {
    unitId: string;
    title: string;
    description: string;
    category: TradeCategory;
    urgency: TicketUrgency;
    materialCost?: number;
    labourCost?: number;
  }): string => {
    const targetUnit = units.find(u => u.id === ticketData.unitId);
    const ticketNo = `TKT-2026-${Math.floor(100 + Math.random() * 900)}`;

    const materialCost = ticketData.materialCost || 0;
    const labourCost = ticketData.labourCost || 0;
    const totalCost = materialCost + labourCost;
    const status: TicketStatus = totalCost === 0 
      ? 'REPORTED' 
      : totalCost > 5000 
      ? 'LANDLORD_APPROVAL_REQUIRED' 
      : 'IN_PROGRESS';

    const newTicket: MaintenanceTicket = {
      id: `tkt_${Date.now()}`,
      ticketNumber: ticketNo,
      unitId: ticketData.unitId,
      unitName: targetUnit?.unitNumber || 'Unit',
      propertyName: targetUnit?.propertyName || 'Property',
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      urgency: ticketData.urgency,
      status,
      tenantName: targetUnit?.renter?.name || 'Resident',
      tenantPhone: targetUnit?.renter?.phone || '+1 (555) 000-0000',
      owner: targetUnit?.owner || {
        id: 'usr_default_owner',
        name: 'Landlord',
        phone: '+1 (555) 000-0000',
        location: 'HQ',
        role: 'OWNER_LOCAL'
      },
      materialCost,
      labourCost,
      totalCost,
      source: 'PORTAL_REPORT',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setTickets(prev => [newTicket, ...prev]);
    triggerConfetti();
    return newTicket.id;
  };

  // Safe Deposit
  const depositCashDrawer = () => {
    setCashDrawer(prev => ({
      ...prev,
      cashInHand: 0,
      lastReconciledDate: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }));
    triggerConfetti();
  };

  // WhatsApp Webhook Ingestion Engine
  const ingestWhatsAppMessage = (
    senderPhone: string, 
    messageText: string, 
    mediaUrl?: string
  ): WhatsAppIngestedMessage => {
    const textLower = messageText.toLowerCase();

    // Match sender to unit
    const matchedUnit = units.find(u => 
      u.renter?.phone?.includes(senderPhone.slice(-7)) || 
      u.owner?.phone?.includes(senderPhone.slice(-7)) ||
      u.renter?.whatsapp?.includes(senderPhone.slice(-7))
    );

    let actionTaken: WhatsAppIngestedMessage['actionTaken'] = 'BOT_QUERY_ANSWERED';
    let replySent = 'Thank you for messaging PROPMAK Property Management. Our team has received your message.';
    let extractedEntityId: string | undefined = undefined;

    // 1. APPROVE Command from Landlord
    if (textLower.startsWith('approve')) {
      const ticketToApprove = tickets.find(t => t.status === 'LANDLORD_APPROVAL_REQUIRED');
      if (ticketToApprove) {
        approveTicket(ticketToApprove.id);
        actionTaken = 'QUOTE_APPROVED';
        extractedEntityId = ticketToApprove.id;
        replySent = `Estimate of Rs. ${ticketToApprove.totalCost?.toLocaleString()} approved! Work order dispatched to technician.`;
      }
    }
    // 2. Inbound Payment Slip
    else if (mediaUrl && (textLower.includes('slip') || textLower.includes('paid') || textLower.includes('transfer') || textLower.includes('rent'))) {
      const receiptNo = `REC-2026-WA-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTx: PaymentTransaction = {
        id: `tx_${Date.now()}`,
        unitId: matchedUnit?.id || 'unit_101',
        unitName: matchedUnit?.unitNumber || 'Apt 402',
        propertyName: matchedUnit?.propertyName || 'Grand Oak Tower',
        tenantName: matchedUnit?.renter?.name || 'Resident',
        tenantPhone: senderPhone,
        amount: matchedUnit?.monthlyRent || 160000,
        monthPeriod: 'August 2026',
        method: 'BANK_TRANSFER',
        status: 'PENDING_VERIFICATION',
        receiptNumber: receiptNo,
        bankName: 'Digital Wire Transfer',
        slipImageUrl: mediaUrl,
        receivedDate: new Date().toISOString().split('T')[0],
        source: 'WHATSAPP_AUTO_INGEST'
      };

      setTransactions(prev => [newTx, ...prev]);
      actionTaken = 'PAYMENT_SLIP_ATTACHED';
      extractedEntityId = newTx.id;
      replySent = `Payment slip received (Ref: ${receiptNo}). Attached to monthly rent roll ledger awaiting agency verification.`;
    }
    // 3. Inbound Repair / Maintenance Fault
    else if (textLower.includes('leak') || textLower.includes('pump') || textLower.includes('water') || textLower.includes('ac') || textLower.includes('electric') || textLower.includes('switch') || textLower.includes('broken')) {
      let category: TradeCategory = 'GENERAL_HANDYMAN';
      if (textLower.includes('pump') || textLower.includes('water') || textLower.includes('pipe') || textLower.includes('leak')) {
        category = 'PLUMBER_PUMP_GEYSER';
      } else if (textLower.includes('ac') || textLower.includes('cooling') || textLower.includes('gas')) {
        category = 'AC_TECHNICIAN';
      } else if (textLower.includes('electric') || textLower.includes('light') || textLower.includes('switch') || textLower.includes('ups')) {
        category = 'ELECTRICIAN_UPS';
      }

      const urgency: TicketUrgency = (textLower.includes('urgent') || textLower.includes('emergency') || textLower.includes('burst') || textLower.includes('no water')) ? 'EMERGENCY' : 'STANDARD';

      const createdId = createTicket({
        unitId: matchedUnit?.id || 'unit_101',
        title: messageText.length > 50 ? `${messageText.slice(0, 50)}...` : messageText,
        description: `Ingested from WhatsApp: "${messageText}"`,
        category,
        urgency,
        materialCost: 0,
        labourCost: 0
      });

      actionTaken = 'TICKET_AUTO_CREATED';
      extractedEntityId = createdId;
      replySent = `Issue #${createdId} logged for ${category.replace(/_/g, ' ')}. Our Property Management team has received your report and is reviewing it for contractor dispatch.`;
    }
    // 4. Status Check
    else if (textLower.includes('status') || textLower.includes('summary')) {
      actionTaken = 'BOT_QUERY_ANSWERED';
      replySent = `PROPMAK Status: ${units.length} Units Active | Rent Roll: Rs. ${(transactions.reduce((acc, t) => acc + t.amount, 0) / 100000).toFixed(1)}L | Cash in Safe: Rs. ${(cashDrawer.cashInHand / 1000).toFixed(0)}k.`;
    }

    const newEvent: WhatsAppIngestedMessage = {
      id: `msg_${Date.now()}`,
      senderPhone,
      senderName: matchedUnit?.renter?.name || matchedUnit?.owner?.name || 'WhatsApp Contact',
      rawMessageText: messageText,
      mediaUrl,
      matchedUnitId: matchedUnit?.id,
      matchedUnitName: matchedUnit?.unitNumber,
      matchedStakeholderRole: matchedUnit?.renter?.phone === senderPhone ? 'TENANT' : matchedUnit?.owner?.phone === senderPhone ? 'LANDLORD' : 'UNKNOWN',
      actionTaken,
      extractedEntityId,
      replySent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setWhatsAppIngestEvents(prev => [newEvent, ...prev]);
    return newEvent;
  };

  return (
    <PropMAKContext.Provider value={{
      units,
      stakeholders,
      contractors,
      transactions,
      tickets,
      utilityBills,
      alerts,
      payouts,
      cashDrawer,
      whatsAppIngestEvents,
      currentRole,
      searchQuery,
      activeTab,
      setCurrentRole,
      setSearchQuery,
      setActiveTab,
      addUnit,
      updateUnit,
      deleteUnit,
      assignTenantToUnit,
      addStakeholder,
      updateStakeholder,
      deleteStakeholder,
      addContractor,
      updateContractor,
      deleteContractor,
      addUtilityBill,
      updateUtilityBill,
      deleteUtilityBill,
      verifyTransaction,
      recordCashPayment,
      convertSoldToRent,
      approveTicket,
      completeTicket,
      markJobFinishedByContractor,
      verifyWorkByTenant,
      closeTicketAndMakeInvoicePayable,
      assignContractorToTicket,
      createTicket,
      deleteTicket,
      depositCashDrawer,
      ingestWhatsAppMessage
    }}>
      {children}
    </PropMAKContext.Provider>
  );
};

export const usePropMAK = () => {
  const context = useContext(PropMAKContext);
  if (!context) {
    throw new Error('usePropMAK must be used within a PropMAKProvider');
  }
  return context;
};
