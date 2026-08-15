export type PropertyStatus = 
  | 'RENTED_DIRECT'
  | 'RENTED_BY_OWNER'
  | 'VACANT_FOR_RENT'
  | 'FOR_SALE'
  | 'TOKEN_RECEIVED'
  | 'SOLD_HANDOVER'
  | 'SOLD_CONVERTED_TO_RENT'
  | 'UNDER_RENOVATION';

export type UserRole = 
  | 'PROPERTY_MANAGER'
  | 'AGENCY_DIRECTOR'
  | 'OVERSEAS_LANDLORD'
  | 'LOCAL_LANDLORD'
  | 'TENANT'
  | 'CASH_COLLECTOR'
  | 'BUYER';

export type PaymentMethod = 
  | 'BANK_TRANSFER'
  | 'CASH'
  | 'CHEQUE'
  | 'ONLINE_PAYMENT';

export type PaymentStatus = 
  | 'VERIFIED'
  | 'PENDING_VERIFICATION'
  | 'OVERDUE'
  | 'REJECTED';

export type TradeCategory = 
  | 'PLUMBER_PUMP_GEYSER'
  | 'ELECTRICIAN_UPS'
  | 'AC_TECHNICIAN'
  | 'PAINTER_SEEPAGE'
  | 'CARPENTER_LOCKS'
  | 'GENERAL_HANDYMAN';

export type TicketStatus = 
  | 'REPORTED'
  | 'INSPECTION_SCHEDULED'
  | 'QUOTE_SUBMITTED'
  | 'LANDLORD_APPROVAL_REQUIRED'
  | 'IN_PROGRESS'
  | 'AWAITING_TENANT_VERIFICATION'
  | 'TENANT_VERIFIED'
  | 'COMPLETED'
  | 'CANCELLED';

export type TicketUrgency = 'LOW' | 'STANDARD' | 'EMERGENCY';

export type UtilityType = 
  | 'ELECTRICITY'
  | 'GAS'
  | 'WATER'
  | 'BUILDING_SERVICE_CHARGE';

export interface Stakeholder {
  id: string;
  name: string;
  phone: string;
  email?: string;
  whatsapp?: string;
  location: string;
  role: 'OWNER_OVERSEAS' | 'OWNER_LOCAL' | 'TENANT' | 'OCCUPIER' | 'BUYER' | 'COLLECTOR';
  notes?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  propertyName: string;
  buildingName?: string;
  floor?: number;
  location: string;
  propertyType: 'RESIDENTIAL_APARTMENT' | 'RESIDENTIAL_PORTION' | 'INDEPENDENT_HOUSE' | 'COMMERCIAL_SHOP' | 'COMMERCIAL_OFFICE' | 'PENTHOUSE';
  status: PropertyStatus;
  areaSqFt: number;
  bedrooms?: number;
  bathrooms?: number;
  
  // Stakeholder Relationships
  owner: Stakeholder;
  renter?: Stakeholder;
  occupier?: Stakeholder;
  buyer?: Stakeholder;

  // Financials
  monthlyRent: number;
  askingPrice?: number;
  securityDeposit?: number;
  tokenDeposit?: number;
  annualEscalationPercent?: number;

  // Key Dates
  leaseStartDate?: string;
  leaseEndDate?: string;
  lastRentReviewDate?: string;
  daysVacant?: number;

  // Meters & Keys
  electricityMeterNo?: string;
  gasMeterNo?: string;
  waterAccountNo?: string;
  keyLocation?: string;

  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  tenantName: string;
  tenantPhone: string;
  amount: number;
  monthPeriod: string;
  method: PaymentMethod;
  status: PaymentStatus;
  receiptNumber: string;
  bankName?: string;
  transactionRefId?: string;
  slipImageUrl?: string;
  collectedBy?: string;
  receivedDate: string;
  verifiedAt?: string;
  source: 'WHATSAPP_AUTO_INGEST' | 'MOBILE_APP_UPLOAD' | 'FIELD_COLLECTOR' | 'MANUAL_ENTRY';
}

export interface MaintenanceTicket {
  id: string;
  ticketNumber: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  title: string;
  description: string;
  category: TradeCategory;
  urgency: TicketUrgency;
  status: TicketStatus;
  
  tenantName: string;
  tenantPhone: string;
  owner: Stakeholder;

  assignedMistri?: {
    name: string;
    phone: string;
    trade: string;
  };

  materialCost?: number;
  labourCost?: number;
  totalCost?: number;
  contractorInvoiceStatus?: 'PENDING_COMPLETION' | 'PAYABLE' | 'PAID';

  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  receiptPhotoUrl?: string;

  tenantVerification?: {
    verifiedAt: string;
    rating: number;
    photos?: string[];
    feedback?: string;
  };

  source: 'WHATSAPP_AUTO_INGEST' | 'PORTAL_REPORT' | 'MANUAL_ENTRY';
  createdAt: string;
  completedAt?: string;
}

export interface UtilityBillRecord {
  id: string;
  unitId: string;
  unitName: string;
  propertyName: string;
  tenantName: string;
  utilityType: UtilityType;
  consumerNumber: string;
  monthPeriod: string;
  amount: number;
  dueDate: string;
  paidStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  billSlipUrl?: string;
  verifiedAt?: string;
}

export interface PredictiveAlert {
  id: string;
  type: 'EXPIRY_SOON' | 'ESCALATION_DUE' | 'VACANCY_LOSS' | 'APPROVAL_BOTTLENECK' | 'UTILITY_MISSING';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  unitId: string;
  unitName: string;
  actionLabel: string;
  daysRemaining?: number;
  metricValue?: string;
  whatsappMessage?: string;
  contactNumber?: string;
}

export interface LandlordPayout {
  id: string;
  landlordName: string;
  landlordCountry: string;
  period: string;
  grossRentCollected: number;
  agencyCommissionPercent: number;
  agencyCommission: number;
  maintenanceDeductions: number;
  serviceChargeDeductions: number;
  netPayout: number;
  netPayoutUSD?: number;
  netPayoutGBP?: number;
  generatedDate: string;
  isPaid: boolean;
}

export interface CashDrawerState {
  cashInHand: number;
  collectedToday: number;
  disbursedToMistrisToday: number;
  lastReconciledDate: string;
}

export interface WhatsAppIngestedMessage {
  id: string;
  senderPhone: string;
  senderName: string;
  rawMessageText: string;
  mediaUrl?: string;
  matchedUnitId?: string;
  matchedUnitName?: string;
  matchedStakeholderRole?: 'TENANT' | 'LANDLORD' | 'PROPERTY_MANAGER' | 'UNKNOWN';
  actionTaken: 'TICKET_AUTO_CREATED' | 'PAYMENT_SLIP_ATTACHED' | 'BOT_QUERY_ANSWERED' | 'QUOTE_APPROVED' | 'CASH_LOGGED';
  extractedEntityId?: string;
  replySent: string;
  timestamp: string;
}

export interface Contractor {
  id: string;
  name: string;
  trade: string;
  category: TradeCategory;
  phone: string;
  whatsapp: string;
  rating: number;
  completedJobs: number;
  standardRate: string;
  availability: 'AVAILABLE' | 'ON_JOB' | 'UNAVAILABLE';
  cnicNumber?: string;
  notes?: string;
}

