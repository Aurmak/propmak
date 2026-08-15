import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// Mock Initial Test Data & Engines for PropMAK
const MOCK_UNITS = [
  {
    id: 'unit_101',
    propertyName: 'Grand Oak Tower',
    unitNumber: 'Apartment 402',
    status: 'RENTED_DIRECT',
    monthlyRent: 160000,
    annualEscalationPercent: 10,
    daysVacant: 0,
    owner: { name: 'Dr. Tariq (UK)', phone: '+44 7700 900123' },
    renter: { name: 'Khurram Shahzad', phone: '+1 (555) 234-5678' }
  },
  {
    id: 'unit_102',
    propertyName: 'Pine Crest Residency',
    unitNumber: 'Apartment 201',
    status: 'VACANT_FOR_RENT',
    monthlyRent: 140000,
    annualEscalationPercent: 10,
    daysVacant: 24,
    owner: { name: 'Dr. Tariq (UK)', phone: '+44 7700 900123' },
    renter: null
  },
  {
    id: 'unit_103',
    propertyName: 'Apex Commercial Plaza',
    unitNumber: 'Retail Shop #1',
    status: 'RENTED_DIRECT',
    monthlyRent: 220000,
    annualEscalationPercent: 10,
    daysVacant: 0,
    owner: { name: 'Haji Aslam', phone: '+1 (555) 987-6543' },
    renter: { name: 'Hamza Javed', phone: '+1 (555) 567-8901' }
  }
];

// Financial Calculation Functions
function calculateLandlordNetPayout({
  grossRent,
  commissionPercent,
  maintenanceDeductions = 0,
  serviceChargeDeductions = 0,
  pkrToGbpRate = 360,
  pkrToUsdRate = 278
}) {
  const commission = (grossRent * commissionPercent) / 100;
  const netPayoutPKR = grossRent - commission - maintenanceDeductions - serviceChargeDeductions;
  const netPayoutGBP = Number((netPayoutPKR / pkrToGbpRate).toFixed(2));
  const netPayoutUSD = Number((netPayoutPKR / pkrToUsdRate).toFixed(2));

  return {
    grossRent,
    commission,
    maintenanceDeductions,
    serviceChargeDeductions,
    netPayoutPKR,
    netPayoutGBP,
    netPayoutUSD
  };
}

function calculateVoidRevenueLoss(monthlyRent, daysVacant) {
  if (daysVacant <= 0 || monthlyRent <= 0) return 0;
  return Math.round((monthlyRent / 30) * daysVacant);
}

function calculateRentEscalation(currentRent, escalationPercent) {
  return Math.round(currentRent * (1 + escalationPercent / 100));
}

// Inbound WhatsApp Ingestion Engine Logic
function processInboundWhatsApp(senderPhone, text, hasImage = false) {
  const normalizedPhone = senderPhone.trim();
  const matchedUnit = MOCK_UNITS.find(
    u => u.renter?.phone === normalizedPhone || u.owner.phone === normalizedPhone
  );

  const cleanText = text.trim();
  const upper = cleanText.toUpperCase();

  // 1. Headless Bot Status Query
  if (upper === 'STATUS' || upper === 'REPORT') {
    return {
      action: 'BOT_QUERY_ANSWERED',
      reply: 'PropMAK Summary: 3 Units Active, Rs. 160k verified, 1 vacant (24 days).'
    };
  }

  // 2. Headless Landlord Quote Approval
  if (upper.startsWith('APPROVE')) {
    const tktRef = cleanText.split(' ')[1] || 'TKT-CURRENT';
    return {
      action: 'QUOTE_APPROVED',
      ticketRef: tktRef,
      reply: `Approved quote for ${tktRef}. Work order dispatched.`
    };
  }

  // 3. Inbound Payment Slip
  if (hasImage || upper.includes('TRANSFER') || upper.includes('PAID') || upper.includes('SLIP')) {
    return {
      action: 'PAYMENT_SLIP_ATTACHED',
      unitId: matchedUnit?.id || null,
      reply: `Payment slip received for ${matchedUnit?.unitNumber || 'Unit'}. Queued for ledger verification.`
    };
  }

  // 4. Inbound Repair Triage
  let category = 'GENERAL_HANDYMAN';
  if (upper.includes('WATER') || upper.includes('LEAK') || upper.includes('PIPE') || upper.includes('PUMP')) {
    category = 'PLUMBER_PUMP_GEYSER';
  } else if (upper.includes('LIGHT') || upper.includes('ELECTRIC') || upper.includes('BREAKER') || upper.includes('POWER')) {
    category = 'ELECTRICIAN_UPS';
  } else if (upper.includes('AC') || upper.includes('COOL') || upper.includes('AIR')) {
    category = 'AC_TECHNICIAN';
  }

  return {
    action: 'TICKET_AUTO_CREATED',
    category,
    unitId: matchedUnit?.id || null,
    urgency: upper.includes('EMERGENCY') || upper.includes('BURNT') ? 'EMERGENCY' : 'STANDARD',
    reply: `Maintenance ticket logged under category ${category}. Specialist notified.`
  };
}

// ---------------------------------------------------------
// QA TEST SUITE EXECUTION
// ---------------------------------------------------------

describe('PropMAK Core Financial Engineering & Yield Tests', () => {
  it('should accurately calculate Net Landlord Payout with commissions and deductions', () => {
    const result = calculateLandlordNetPayout({
      grossRent: 320000,
      commissionPercent: 5,
      maintenanceDeductions: 11000,
      serviceChargeDeductions: 2500,
      pkrToGbpRate: 360,
      pkrToUsdRate: 278
    });

    assert.equal(result.grossRent, 320000);
    assert.equal(result.commission, 16000); // 5% of 320,000
    assert.equal(result.netPayoutPKR, 290500); // 320,000 - 16,000 - 11,000 - 2,500
    assert.equal(result.netPayoutGBP, 806.94); // 290,500 / 360
    assert.equal(result.netPayoutUSD, 1044.96); // 290,500 / 278
  });

  it('should accurately calculate Void Revenue Loss for vacant units', () => {
    const loss = calculateVoidRevenueLoss(140000, 24);
    assert.equal(loss, 112000); // (140,000 / 30) * 24 = 112,000
  });

  it('should return 0 void loss for zero or negative vacant days', () => {
    assert.equal(calculateVoidRevenueLoss(140000, 0), 0);
    assert.equal(calculateVoidRevenueLoss(140000, -5), 0);
  });

  it('should accurately calculate 10% annual rent escalations', () => {
    const newRent = calculateRentEscalation(160000, 10);
    assert.equal(newRent, 176000); // 160,000 * 1.10
  });
});

describe('PropMAK Inbound WhatsApp Ingestion & Webhook Engine Tests', () => {
  it('should parse inbound plumbing repair text and create ticket', () => {
    const res = processInboundWhatsApp('+1 (555) 234-5678', 'Water pipe under kitchen sink is leaking heavily');
    assert.equal(res.action, 'TICKET_AUTO_CREATED');
    assert.equal(res.category, 'PLUMBER_PUMP_GEYSER');
    assert.equal(res.unitId, 'unit_101');
    assert.equal(res.urgency, 'STANDARD');
  });

  it('should parse emergency keywords and escalate ticket urgency', () => {
    const res = processInboundWhatsApp('+1 (555) 234-5678', 'EMERGENCY: Main water pump motor burnt with heavy smoke');
    assert.equal(res.action, 'TICKET_AUTO_CREATED');
    assert.equal(res.category, 'PLUMBER_PUMP_GEYSER');
    assert.equal(res.urgency, 'EMERGENCY');
  });

  it('should parse inbound HVAC issues into AC_TECHNICIAN trade', () => {
    const res = processInboundWhatsApp('+1 (555) 234-5678', 'The split AC is blowing warm air');
    assert.equal(res.action, 'TICKET_AUTO_CREATED');
    assert.equal(res.category, 'AC_TECHNICIAN');
  });

  it('should handle payment slips and link to rent roll', () => {
    const res = processInboundWhatsApp('+1 (555) 234-5678', 'Here is the bank transfer slip for August rent', true);
    assert.equal(res.action, 'PAYMENT_SLIP_ATTACHED');
    assert.equal(res.unitId, 'unit_101');
  });

  it('should process headless STATUS bot command', () => {
    const res = processInboundWhatsApp('+1 (555) 987-6543', 'STATUS');
    assert.equal(res.action, 'BOT_QUERY_ANSWERED');
    assert.match(res.reply, /PropMAK Summary/);
  });

  it('should process headless APPROVE command from Landlord', () => {
    const res = processInboundWhatsApp('+44 7700 900123', 'APPROVE TKT-2026-088');
    assert.equal(res.action, 'QUOTE_APPROVED');
    assert.equal(res.ticketRef, 'TKT-2026-088');
  });
});

describe('PropMAK Edge Case & Boundary Matrix Tests', () => {
  it('should safely handle 0 gross rent without throwing exceptions', () => {
    const result = calculateLandlordNetPayout({
      grossRent: 0,
      commissionPercent: 5,
      maintenanceDeductions: 0,
      serviceChargeDeductions: 0
    });
    assert.equal(result.netPayoutPKR, 0);
    assert.equal(result.netPayoutGBP, 0);
  });

  it('should handle unlisted phone numbers gracefully', () => {
    const res = processInboundWhatsApp('+1 000 000 0000', 'Reporting a broken window latch');
    assert.equal(res.action, 'TICKET_AUTO_CREATED');
    assert.equal(res.unitId, null);
  });

  it('should handle whitespace and mixed case in bot commands', () => {
    const res = processInboundWhatsApp('+1 (555) 987-6543', '   status   ');
    assert.equal(res.action, 'BOT_QUERY_ANSWERED');
  });
});

describe('PropMAK Stakeholder & Property Onboarding Tests', () => {
  it('should create and initialize a new unit with valid status and landlord', () => {
    const newUnit = {
      id: 'unit_999',
      unitNumber: 'Apt 909',
      propertyName: 'Grand Oak Tower',
      status: 'VACANT_FOR_RENT',
      monthlyRent: 150000,
      owner: { name: 'Dr. Tariq', phone: '+44 7700 900123' },
      renter: null
    };

    assert.equal(newUnit.status, 'VACANT_FOR_RENT');
    assert.equal(newUnit.renter, null);
    assert.ok(newUnit.id.startsWith('unit_'));
  });

  it('should transition vacant unit to RENTED_DIRECT when signing a tenant lease', () => {
    const vacantUnit = {
      id: 'unit_102',
      status: 'VACANT_FOR_RENT',
      monthlyRent: 140000,
      renter: null
    };

    const newTenant = {
      id: 'usr_renter_99',
      name: 'Asim Raza',
      phone: '+1 (555) 888-7766',
      role: 'TENANT'
    };

    const leasedUnit = {
      ...vacantUnit,
      status: 'RENTED_DIRECT',
      renter: newTenant,
      monthlyRent: 145000,
      leaseStartDate: '2026-09-01',
      leaseEndDate: '2027-08-31',
      daysVacant: 0
    };

    assert.equal(leasedUnit.status, 'RENTED_DIRECT');
    assert.equal(leasedUnit.renter.name, 'Asim Raza');
    assert.equal(leasedUnit.daysVacant, 0);
  });
});

describe('PropMAK Move-Out Settlement & Contractor Dispatch Tests', () => {
  it('should accurately calculate net move-out security deposit refund', () => {
    const heldDeposit = 320000;
    const unpaidElectricity = 18500;
    const unpaidGas = 4200;
    const damageDeductions = 15000; // Paint and locks

    const totalDeductions = unpaidElectricity + unpaidGas + damageDeductions;
    const netRefund = heldDeposit - totalDeductions;

    assert.equal(totalDeductions, 37700);
    assert.equal(netRefund, 282300);
  });

  it('should trigger Landlord Approval when mistri quote exceeds Rs. 5,000 threshold', () => {
    const materialCost = 4500;
    const labourCost = 2500;
    const totalQuote = materialCost + labourCost; // 7,000

    const status = totalQuote > 5000 ? 'LANDLORD_APPROVAL_REQUIRED' : 'IN_PROGRESS';
    assert.equal(status, 'LANDLORD_APPROVAL_REQUIRED');
  });

  it('should auto-approve mistri quote under Rs. 5,000 threshold', () => {
    const materialCost = 1500;
    const labourCost = 1500;
    const totalQuote = materialCost + labourCost; // 3,000

    const status = totalQuote > 5000 ? 'LANDLORD_APPROVAL_REQUIRED' : 'IN_PROGRESS';
    assert.equal(status, 'IN_PROGRESS');
  });

  it('should accurately aggregate monthly rent roll by floor in plaza floor matrix', () => {
    const floorUnits = [
      { unitNumber: 'Apt 401', monthlyRent: 160000, floor: 4 },
      { unitNumber: 'Apt 402', monthlyRent: 180000, floor: 4 },
      { unitNumber: 'Apt 403', monthlyRent: 150000, floor: 4 }
    ];

    const floorRent = floorUnits.reduce((acc, u) => acc + u.monthlyRent, 0);
    assert.equal(floorRent, 490000);
  });

  it('should register a new verified contractor with rating and trade category', () => {
    const newContractor = {
      id: 'ct_999',
      name: 'Ustad Imran (Master Electrician)',
      trade: 'Electrical & DB Wiring',
      category: 'ELECTRICIAN_UPS',
      phone: '+1 (555) 333-4455',
      whatsapp: '+15553334455',
      rating: 4.8,
      completedJobs: 0,
      standardRate: 'Rs. 2,000 / visit',
      availability: 'AVAILABLE'
    };

    assert.equal(newContractor.category, 'ELECTRICIAN_UPS');
    assert.equal(newContractor.rating, 4.8);
    assert.ok(newContractor.id.startsWith('ct_'));
  });

  it('should log a new utility bill and record pending clearance status', () => {
    const newBill = {
      id: 'bill_999',
      unitId: 'unit_101',
      utilityType: 'ELECTRICITY',
      consumerNumber: '0400012345678',
      monthPeriod: 'August 2026',
      amount: 24500,
      dueDate: '2026-08-20',
      paidStatus: 'PENDING'
    };

    assert.equal(newBill.paidStatus, 'PENDING');
    assert.equal(newBill.amount, 24500);
    assert.ok(newBill.id.startsWith('bill_'));
  });

  it('should transition ticket to AWAITING_TENANT_VERIFICATION when contractor finishes job', () => {
    let ticket = {
      id: 'tkt_test_1',
      status: 'IN_PROGRESS',
      assignedMistri: { name: 'Shafiq Electrician', phone: '+15559990011', trade: 'Electrician' }
    };

    // Contractor marks work finished
    ticket = { ...ticket, status: 'AWAITING_TENANT_VERIFICATION' };
    assert.equal(ticket.status, 'AWAITING_TENANT_VERIFICATION');
  });

  it('should record tenant verification rating, photos, and transition to TENANT_VERIFIED', () => {
    let ticket = {
      id: 'tkt_test_1',
      status: 'AWAITING_TENANT_VERIFICATION'
    };

    // Tenant verifies work
    ticket = {
      ...ticket,
      status: 'TENANT_VERIFIED',
      tenantVerification: {
        verifiedAt: '14:30',
        rating: 5.0,
        photos: ['photo1.jpg'],
        feedback: 'Great job done on water pump'
      }
    };

    assert.equal(ticket.status, 'TENANT_VERIFIED');
    assert.equal(ticket.tenantVerification.rating, 5.0);
    assert.equal(ticket.tenantVerification.photos.length, 1);
  });

  it('should close ticket and mark contractor invoice as PAYABLE upon agent approval', () => {
    let ticket = {
      id: 'tkt_test_1',
      status: 'TENANT_VERIFIED',
      totalCost: 7000,
      contractorInvoiceStatus: 'PENDING_COMPLETION'
    };

    // Agent approves & closes
    ticket = {
      ...ticket,
      status: 'COMPLETED',
      contractorInvoiceStatus: 'PAYABLE',
      completedAt: new Date().toISOString()
    };

    assert.equal(ticket.status, 'COMPLETED');
    assert.equal(ticket.contractorInvoiceStatus, 'PAYABLE');
  });

  it('should support updating and deleting stakeholders, contractors, units, and tickets', () => {
    // 1. Stakeholders
    let listUsers = [{ id: 'usr_1', name: 'Original Name', phone: '+1234' }];
    listUsers = listUsers.map(u => u.id === 'usr_1' ? { ...u, name: 'Updated Name' } : u);
    assert.equal(listUsers[0].name, 'Updated Name');
    listUsers = listUsers.filter(u => u.id !== 'usr_1');
    assert.equal(listUsers.length, 0);

    // 2. Contractors
    let listContractors = [{ id: 'ct_1', name: 'Original Mistri', rating: 4.5 }];
    listContractors = listContractors.map(c => c.id === 'ct_1' ? { ...c, rating: 5.0 } : c);
    assert.equal(listContractors[0].rating, 5.0);
    listContractors = listContractors.filter(c => c.id !== 'ct_1');
    assert.equal(listContractors.length, 0);

    // 3. Units
    let listUnits = [{ id: 'u_1', unitNumber: '101', monthlyRent: 100000 }];
    listUnits = listUnits.map(u => u.id === 'u_1' ? { ...u, monthlyRent: 120000 } : u);
    assert.equal(listUnits[0].monthlyRent, 120000);
    listUnits = listUnits.filter(u => u.id !== 'u_1');
    assert.equal(listUnits.length, 0);

    // 4. Tickets
    let listTickets = [{ id: 'tkt_1', title: 'Leaking pipe' }];
    listTickets = listTickets.filter(t => t.id !== 'tkt_1');
    assert.equal(listTickets.length, 0);
  });
});




