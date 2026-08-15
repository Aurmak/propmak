# Fixflo Frontend Specification — Complete Rebuild Reference
**App:** Ahsan Inc Repair & Maintenance Management  
**Powered by:** Fixflo (Version 2.981.58.0)  
**Base URL:** https://ahsan.fixflo.com  
**User Role:** Agent (Ahsan Jalil)  
**Captured:** 2026-08-15

---

## 1. App Shell & Global Layout

### Top Header Bar
- Height: ~50px, white background, bottom border shadow
- **Left:** Hamburger menu icon (☰), Fixflo wordmark (blue ~#1565C0)
- **Right:** Global search bar ("Search for issues, places or people...") + blue search button (🔍) + dropdown arrow (▾)

### Left Sidebar
- Width: ~250px, light grey background (~#F5F5F5)
- **User Block (top):** Purple/blue avatar circle with initials "AJ", name "Ahsan Jalil", role "Agent", kebab menu (⋮)
- **Icon Row:** Chat bubble icon, paper plane icon, bell (notifications) icon — all clickable

#### Navigation Items
| Nav Item | Icon | Submenu Items |
|---|---|---|
| Dashboard | Grid icon | — |
| Contractor marketplace | Globe icon | — |
| Create issue | Wrench/link icon | (expands with ▾) |
| Issues | Wrench icon | Issue search, Issue assignment, Comments, Projects, Major works |
| Planned maintenance | Calendar/wrench icon | Compliance matrix, Service agreements, Service events, Buildings, Event templates, Service programmes |
| People | Group icon | (expands with ▾) |
| Properties | Building icon | (expands with ▾) |
| Calendar | Calendar icon | (expands with ▾) |
| Reports | Bar chart icon | (expands with ▾) |
| Setup | Gear icon | (expands with ▾) |
| Integrations | Plug icon | (expands with ▾) |
| Promote | Megaphone icon | — |
| Co-pilot | Bot/star icon | — |

- **Bottom:** "Need help?" (blue rounded pill button)
- Active nav item: white background + blue left border
- Submenus: indented with ○ bullets, smaller text

### Main Content Area
- White background, scrollable
- Top toolbar (Dashboard only): dashboard name dropdown + Edit | Copy | Delete | Add panel | Create new dashboard actions

### Design Tokens
| Token | Value |
|---|---|
| Primary blue | `#0B81C5` / `rgb(11, 129, 197)` |
| Header blue | `~#1565C0` |
| Body background | `rgb(249, 249, 249)` |
| Sidebar background | `~#F5F5F5` |
| Font family | `"Roboto, robotoregular, Arial, Helvetica, sans-serif"` |
| Sidebar width | `250px` |
| Header height | `~50px` |
| Tab bar blue | `~#1976D2` (filled blue, white text on active) |

### Common UI Patterns
- **KPI circles:** Large filled blue circle (~100px diameter) with white number centred — used for count metrics
- **Issue list rows:** ID + title line 1, address line 2, age/status badge right
- **Age badges:** Dark pill badge (e.g. "40 wks", "197") — red/dark background
- **Status badges:** Text pill (e.g. "Closed", "Request for quotes ended") — light grey background
- **Empty states:** Grey document/clipboard/question-mark illustration + caption text
- **Collapsible sections:** Blue underlined header with ∨ (expanded) or > (collapsed) arrow toggle
- **Tab bars:** Full-width blue bar, white text on active, inactive text white/semi-transparent
- **Action buttons:** Blue filled (primary), grey outlined (secondary)
- **Upload areas:** Dashed border box, cloud icon, "Click to upload" text
- **Change/View buttons:** Inline with field data — "✏ Change" and "👁 View"
- **Pagination:** Numbered page buttons top-right of lists
- **"Back" button:** "← Back" in header for detail pages

---

## 2. Dashboard Screen
**Route:** `/Dashboard/Home/#/Dashboard/DashboardSummary`

Configurable panel grid (3 columns desktop). Top toolbar: "My private dashboard ▾" + Edit | Copy | Delete | Add panel | Create new dashboard.

Each panel has:
- Title (top-left)
- Icons (top-right): settings/filter icon, info (?) icon, kebab (⋮) menu
- Resize handle (bottom-right corner drag)

### Dashboard Panels

| Panel | Type | Data |
|---|---|---|
| Comments recently received | Empty state | "No issues found" |
| Open issues | KPI circle | **10** (blue filled circle) |
| Issues requiring attention, by status | Colour matrix | 5 cols × 4 rows grid of coloured cells with white numbers |
| Declined works complete | Empty state | "No issues found" |
| Issues requiring attention | KPI circle | **10** |
| Quotes submitted | Issue list | IS17975990 — Boiler not working (Gas Boiler) — 19 Daylesford Grove — badge "40 wks" |
| Jobs awaiting invoice | Issue list | IS18438319 — HMO licence works — 19 Daylesford Grove — "Tue 11 Nov 25" |
| Issue status | KPI circle | **10** |
| Recently progressed | Issue list | 8 items with ID, title, address, date/status |
| Maintenance - least progressed | Issue list | 6 items sorted by age descending |
| Service events awaiting review | Empty state | "No events found" |
| Reported issues to do | KPI circle | Blue counter |

### Colour Matrix (Issues requiring attention, by status)
Grid values: 3, 0, 0, 4 / 0, 0, 1, 0 / 0, 0, 0, 0 / 0, 1, 0, 0 / 1, 0  
Cell colours (L→R): Blue, Purple, Pink/Red, Dark green, Orange, Teal, Light green, Blue-grey, Purple-light

### Recently Progressed Items
- IS21130057 — Gas Safety Certificate — 19 Daylesford Grove — 197 days
- IS20745939 — Basin blocked — 3 Daylesford Grove — **Closed**
- IS18746653 — Gas Safety Certificate (CP12) Only — 19 Daylesford Grove — 255 days
- IS20482956 — Gas Safety Certificate (CP12) Only — 255 days
- IS20319659 — To Let Board — 51 Olympic Crescent, Milton Keynes — 268 days
- IS20154549 — Radiator loose — 19 Daylesford Grove — 267 days
- IS18438319 — HMO licence works — 19 Daylesford Grove — 268 days
- IS17975990 — Boiler not working — 19 Daylesford Grove — 282 days

### Dashboard Footer
- "+ Add panel" link
- Footer text: "AHSAN INC - REPAIR AND MAINTENANCE MANAGEMENT SOFTWARE IS POWERED BY [Fixflo logo]"
- Version: `Version: 2.981.58.0 AG140998 Live`
- "Desktop" label

---

## 3. Create Issue (5-Step Wizard)
**Route:** Accessed via "Create issue" nav item (expands submenu)

Full-page 5-step accordion wizard. Steps lock until prior step completed. Step headers show step number and title. Active step expands, completed steps show tick ✓.

### Step 1 — Location
**Fields:**
- Address line 1* (text)
- Address line 2 (text)
- Town/city* (text)
- Postcode* (text)
- Country* (dropdown, default: United Kingdom)

### Step 2 — Fault Type
**Fields:**
- Fault category* — hierarchical category picker (e.g. "Heating and boiler > Gas Boiler or Heater > Gas Boiler")
- Appliance type (conditional, e.g. "Gas Boiler")
- Appliance make (conditional text)
- Appliance model (conditional text)

### Step 3 — Fault Details
**Fields:**
- Fault description* (textarea)
- Fault detail (text — additional detail)
- How urgent is this?* (radio: Emergency / Urgent / Non-urgent)
- Issue photos (file upload zone — "Click to upload or drag and drop")

### Step 4 — Contact Details
**Fields:**
- First name* (text)
- Last name* (text)
- Email address* (email)
- Mobile number (tel)
- Occupier type* (dropdown: Tenant / Owner-occupier / Other)
- Contact time preference (dropdown: Any time / Morning / Afternoon / Evening)

### Step 5 — Confirm & Submit
**Fields:**
- Summary review of all data
- Instruction notes (textarea — optional)
- Works due by date (date picker)
- Assigned agent (agent search/dropdown)
- Contractor (contractor search/dropdown)
- [Submit issue] button (blue, full-width)

---

## 4. Issues

### 4.1 Issue Search
**Route:** Issues → Issue search

**Page header:** "Issue search ▾" + "+ Saved search" button

**Filters:**
- Search issues: text input ("Enter id, address or name") + search button + ▾ dropdown
- Is open: dropdown ("Yes" default)
- Service event template: multi-select dropdown ("(Any)")

**Results header:** "10 results" + Options ▾ + Sort ▾

**Issue list row format:**
```
[Ref: IS########]          [Title (Category)]           [Status]              [Age] [Priority]
[Raised: date via source]  [Address]                    [Detail: days/assign]
```

**Visible issues (page 1, all open):**
| Ref | Title | Address | Status | Age | Priority |
|---|---|---|---|---|---|
| IS21130057 | Gas Safety Certificate | 19 Daylesford Grove, SL1 5AX | Awaiting instruction | 197 | 3 - Non-urgent (high) |
| IS20482956 | Gas Safety Certificate (CP12) Only | 19 Daylesford Grove, SL1 5AX | Awaiting instruction | 255 | 3 |
| IS20366791 | Other (Flat roof) | 19 Daylesford Grove, SL1 5AX | Job awarded, awaiting appointment date | — | 3 — also has "Project" badge |
| IS20319659 | To Let Board | 51 Olympic Crescent, Milton Keynes MK10 7LE | Awaiting instruction | 268 | 3 |
| IS20154549 | Radiator loose (Radiator) | 19 Daylesford Grove, SL1 5AX | Awaiting job completion | 267 | 3 |
| IS20035382 | Gas Safety Certificate | 19 Daylesford Grove, SL1 5AX | Reported | 277 | 3 |
| IS18746653 | Gas Safety Certificate (CP12) Only | 19 Daylesford Grove, SL1 5AX | Awaiting instruction | 255 | 3 |
| IS18491299 | Other (Microwave) | 3 Daylesford Grove, SL1 5AX | Reported | 432 | 3 |
| IS18438319 | HMO licence works | 19 Daylesford Grove, SL1 5AX | Job completed, awaiting contractor information | 268 | 3 |
| IS17975990 | Boiler not working (Gas Boiler) | 19 Daylesford Grove, SL1 5AX | Request for quotes ended | 282 | 3 |

**Row icons (right side):** Flag/priority icon + age badge (red filled pill) + priority text "3 - Non-urgent (high)"

### 4.2 Issue Detail — IS17975990 (Boiler not working)
**Header:**
- "← Back" + up/down arrows + "10 of 10" pagination
- Issue ID: **IS17975990** Boiler not working (Gas Boiler) + ✏ edit icon
- "☰ Actions ▾" button (blue, with list icon)
- Address link: 🏠 19 Daylesford Grove, Slough, SL1 5AX (blue, clickable)
- Status badge: "Request for quotes ended" (grey pill)
- Assignment: "Assigned to: Ahsan Inc (Ahsan Jalil)"
- "Add tag" button

**Tab Bar (full-width blue):**  
Next steps | Detail | Comments | Quotes | Appointments | Related | Documents | Assignment | Audit | Service level | Warranties

---

#### Tab: Next Steps

**Top info bar (3 cards):**
- 📅 Reminder date: Thu 06 Nov 25 — orange badge "282"
- 🔧 Issue priority: 3 - Non-urgent (high)
- 🔒 Issue visibility: Hidden

**"Task to do" badge** (orange pill with task icon)

**Stakeholder carousel (scrollable, ← →):**
- Agent (active, blue underline indicator)
- Occupiers (other)
- Landlord
- Contractor

**Left panel — Suggestions (collapsible ∨):**
- Contractor Coles Roofing (Mr Jordan Ball) declined the job. [See the audit for the reason]
- Issue not assigned to estate/building. [Click here to edit]
- Issue not linked to an asset. [Click here to edit]
- Match a leaseholder. [Click here to get started]

**Left panel — Linked issues (collapsible ∨):**
- Empty state: grey ? clipboard icon + "No linked issues"

**Right panel — Current state + Next step (two-column layout):**
- Header: "Request for quotes ended" (dark grey/charcoal, arrow pointing right) | "Next step" (light grey)
- **Current state section:**
  - Instructed contractor provided a quote instead of undertaking the works
  - Works due by: Thu, 29 May 2025
  - Buttons (icon + label): Review quotes | Edit quote request | Extend quotation period | Reset issue to reported
- **Actions section:**
  - "Once you have reviewed the quote received you can:"
    - award the work to the contractor
    - ask someone to review the quote
    - extend the quotation period and invite further contractors to quote
  - [+ Award job] button (blue)
  - [+ Request quote approval] button (blue)

---

#### Tab: Detail

**Section: Address information (collapsible ∨)**
| Field | Value | Buttons |
|---|---|---|
| Estate/building | (empty) | ✏ Change, 👁 View |
| Landlord | Ahsan Inc (Mr Ahsan Jalil) | ✏ Change, 👁 View |
| Leaseholder | (empty) | ✏ Change, 👁 View |
| External user | (empty) | ✏ Change, 👁 View |

**Section: Information (collapsible ∨)**
- Raised: Tue 15 Apr 25, 14:09 by Agent Ahsan Inc (Ahsan Jalil)

**Section: Report details (collapsible ∨)**
| Field | Value |
|---|---|
| Provided address | 19 Daylesford Grove / Slough / SL1 5AX |
| — | [🏠 Unit notes] button |
| Issue title | Boiler not working (Gas Boiler) |
| Category | Heating and boiler > Gas Boiler or Heater > Gas Boiler |
| Occupier warnings | No warnings shown |
| Appliance type | Gas Boiler |
| Appliance make | Vaillant |
| Appliance model | 233221 |
| Fault detail | Testing |

**Section: Job details (collapsible ∨)**
| Field | Value |
|---|---|
| Works due by | Thu, 29 May 2025 |
| Instruction notes | (empty) |
| Address invoices to | Ahsan Inc |

**Section: Media (collapsible ∨)**
- Instruction documents: "Click to upload" (cloud icon, dashed border)
- Issue photos (or documents): "Click to upload" (cloud icon, dashed border)

---

#### Tab: Comments

**Filter:** "All ▾" dropdown

**Thread view (chronological):**
- Date divider: "Wed, 06 May 2026"
- Comment bubble (right-aligned, outgoing): "Hello"
  - Avatar: "AJ" purple circle (right)
  - From: ahsan.jalil@aareon.com to Landlord (Ahsan Inc (Mr Ahsan Jalil)), Contractor (Coles Roofing (Mr Jordan Ball)) — 14:41

**Warning banner (orange/amber):**
"Cannot send comment to the following recipients. Their email address may not be set, may be invalid or the user may be locked.
• Ahsan Inc (Mr Ahsan Jalil) [person icon] © More"

**Compose area (sticky bottom):**
- Toggle: "Private note" (toggle switch, off by default)
- "Send to" dropdown (recipient picker)
- CC/BCC field (ⓘ icon + ▾)
- "Enter your message" textarea
- [📎 Add attachment] | [📋 View templates] | [⬆ Export template] | [Send] (blue button, right)

---

#### Tab: Quotes

1 quote entry:
- Contractor avatar (grey person silhouette)
- Amount: **£144.00**
- Status: **Submitted**
- Contractor: Coles Roofing (Mr Jordan Ball)
- Ref: C0005515 10
- [☰ Actions ▾] button

---

#### Tab: Appointments

1 appointment entry:
- Date/time: **Fri, 07 November 2025, anytime**
- Status: **Cancelled**
- Contractor: Coles Roofing (Mr Jordan Ball)
- Purpose: To carry out works

---

#### Tab: Related

**Sub-tabs:** Other occupiers at this unit **1** | Linked issues **0** | Interested people **0** | Assets **0** | Projects **0**

**Other occupiers sub-tab:**
- Actions (top-right): [📧 Send summary email] | [+ Add occupier]
- 1 result | Options ▾
- Row: Ahsan Jalil (TE26822699) / Ref: TE26822699 / Address 19 Daylesford Grove, Slough, SL1 5AX
  - Row icons (right): [person+], [flag], [edit pencil]

---

#### Tab: Documents

**Filters:**
- Document type: "(Any)" dropdown
- Certificate type: "(Any)" dropdown
- Tag: "Selec..." dropdown
- Sort By: "Created date" dropdown + "Desc ▾"
- Images only: toggle (off)
- [🔍 Search] button

0 results | Options ▾  
Empty state: grey ? document icon + "No documents found"

---

#### Tab: Assignment

**Section: Reassign issue (collapsible ∨)**
- Assigned agent: "AG69054053: Ahsan Inc (Ahsan Jalil)" × ▾
- Assigned team: "(Unassigned)" ▾
- [✓ Save] button (blue)

**Section: Recommended assignments (collapsible ∨)**
- Recommended building: None
- Why?: matching log (postcodes, address line1, address line2, keyword) — "No matches found"
- Recommended agent / team: No recommended agent / No recommended team
- Why?: matching explanation log

---

#### Tab: Audit

Table: Created | Type | Status | Detail

| Created | Type | Status | Detail |
|---|---|---|---|
| Wed 06 May, 14:41 | Email | Opened | Comment Notification to Contractor (C00551510) |
| Wed 06 May, 14:41 | Email | Failed | Comment Notification to Landlord — email not set |
| Thu 06 Nov 25, 14:45 | Email | Sent | Issue Digest Agent to ahsan.jalil@aareon.com |
| Thu 06 Nov 25, 14:45 | Status change | — | 'Quotes requested' → 'Request for quotes ended' by Coles Roofing |
| Thu 06 Nov 25, 14:45 | Status change | — | 'Awaiting job completion' → 'Quotes requested' |
| Thu 06 Nov 25, 14:45 | Status change | — | 'Job completed awaiting invoice' → 'Awaiting job completion' |
| Thu 06 Nov 25, 14:44 | Status change | — | 'Awaiting job completion' → 'Job completed awaiting invoice' |
| Thu 06 Nov 25, 14:42 | Email | Opened | Appointment set: Calendar Event to Contractor |

Pagination: page number display top-right of table

---

#### Tab: Service level
Empty state: grey ? document + "No applicable service level goals"

---

#### Tab: Warranties
Empty state: grey ? document + "There are no warranties relating to this issue"

---

### 4.3 Issue Actions Dropdown (☰ Actions ▾)

**Group 1:** Close/Cancel issue | Reset issue to reported | Report another issue | Add assets to issue | Duplicate issue  
**Group 2:** View issue as PDF | Landlord version | Photos only | Full Audit version  
**Group 3:** Landlord - FYI | External user - FYI | All occupiers & interested people - FYI | Landlord - Summary  
**Group 4:** Match leaseholder | Edit issue | Add to project

### 4.4 Issue Status Workflow (from Audit log)
Known status progression:
Reported → Awaiting instruction → Awaiting job completion → Job completed awaiting invoice → Quotes requested → Request for quotes ended

Other observed statuses: "Job awarded, awaiting appointment date", "Awaiting job completion"

---

## 5. Planned Maintenance — Service Events

### 5.1 Service Event Search
**Route:** Planned maintenance → Service events

**Page header:** "Service event search ▾" + "+ Saved search" button + "+ Add event" button (blue)

**Description text:** "Service events can be used to manage any type of planned work. Whoever is assigned to complete the work will be reminded at a custom interval that the due date is coming up."

**Filters:**
- Search events: "Enter address or series name" input + search button + ▾
- Is event active: "(Active or recently archived)" dropdown

**Results:** 13 results | Options ▾ | Sort ▾ | Pagination: 1 | 2

**Service event list row format:**
```
[Status badge]  [Ref: SE########]              [Event name]
                [Instruction date: DD/MM/YYYY]  [Address line]
                [Due date: DD/MM/YYYY]
```

**Status badge letters and colors:**
- **I** = In progress / Issued (red/orange square)
- **P** = Planned (dark grey/charcoal square — future)
- **C** = Completed (green circle)

**All 13 service events:**
| Ref | Name | Address | Status | Instruction Date | Due Date |
|---|---|---|---|---|---|
| SE704928318 | Gas Safety Certificate (CP12) Only | 19 Daylesford Grove | I | 03/12/2025 | 01/02/2026 |
| SE1855920458 | Gas Safety Certificate | 19 Daylesford Grove | P | 25/07/2025 | 01/08/2025 |
| SE1262766439 | Gas Safety Certificate | 19 Daylesford Grove | I | 30/01/2026 | 01/03/2026 |
| SE1205363199 | Gas Safety Certificate | 19 Daylesford Grove | I | 28/10/2025 | 28/10/2025 |
| SE1646119928 | Gas Safety Certificate (CP12) Only | 19 Daylesford Grove | P | 03/12/2026 | 01/02/2027 |
| SE1068514279 | To Let Board | 51 Olympic Crescent | C | 06/11/2025 | 06/11/2025 |
| SE1339614835 | Gas Safety Certificate (CP12) Only | 19 Daylesford Grove | I | 04/07/2025 | 04/07/2025 |
| SE1432055918 | Gas Safety Certificate (CP12) Only | 17 Daylesford Grove | P | 30/10/2025 | 30/10/2025 |
| SE1648407151 | To Let Board | 51 Olympic Crescent | I | 20/11/2025 | 20/11/2025 |
| SE187036601 | Gas Safety Certificate (CP12) Only | 17 Daylesford Grove | P | 30/10/2026 | 30/10/2026 |
| SE426001426 | HMO licence works | 19 Daylesford Grove | I | 04/06/2025 | 04/06/2025 |
| SE1497960307 | HMO licence works | 19 Daylesford Grove | P | 04/06/2025 | 04/06/2025 |
| SE938444351 | Gas Safety Certificate (CP12) Only | 17 Daylesford Grove | C | 30/10/2025 | 30/10/2025 |

---

### 5.2 Service Event Detail — SE704928318

**Header:**
- "← Back"
- Status badge: [I] red square
- Ref: **SE704928318** Gas Safety Certificate (CP12) Only
- Address: 19 Daylesford Grove, Slough, SL1 5AX ⓘ (info icon link)

**Tab Bar:** Event detail | Issue instructions | Completion | Documents | Planner | Related events

**Alert banner (yellow):** "This service event is overdue" × (dismissible)

---

#### Sub-tab: Event Detail

| Field | Value | Buttons |
|---|---|---|
| Unit | 19 Daylesford Grove | 👁 View |
| Assets | (empty dropdown) | 👁 View |
| Event series name | Gas Safety Certificate (CP12) Only | ✏ Edit |
| External ref | (empty) | — |
| Cost code | (empty) | ✏ Edit |
| Is statutory | Yes | — |
| Service agreement | (No service agreement) | 👁 View |
| Instruct contractor | (No contractor) | — |
| — | *Contractor who will be instructed to complete the planned maintenance issue* | — |
| Works authorisation limit | £ (empty) | — |
| — | *The works authorisation limit of each planned maintenance issue* | — |
| Assigned agent | (No assignee) | — |
| — | *Agent assigned to manage the planned maintenance issue* | — |
| Requires review | ● Yes  ○ No | — |
| — | *If no reviewer is required then the service event will be marked as closed once the last issue associated with it is closed* | — |
| Reviewing agent | (No reviewer) | — |
| — | *Notify agent on review; if no agent is selected the agent assigned to the issue will be notified.* | — |
| Status | In progress | — |
| Due date | 01-02-2026 | 📅 calendar |
| Instruction interval | 60 Days ▾ | — |
| — | *How far in advance of the due date to create an issue for the work* | — |
| Instruction date | 03-12-2025 | — |
| Instruction notes | (empty textarea) | — |
| — | *This is a statement of the works you require from the contractor* | — |
| Instruction documents | "Click to upload" (dashed border) | — |
| — | *Click on the + sign to select and upload your instruction document(s) from your computer / For example, permits to work and/or site specific information* | — |
| Event frequency | ✓ 1 Years ▾ Until: (date) 📅 | — |
| Updated by | System user (SYS4811747) on Wednesday, 3 December 2025 at 07:02 | — |

**Action buttons:** [✓ Save] (blue) | [📁 Archive] | [○ Cancel instruction/Reset]

---

#### Sub-tab: Issue instructions

1 result | Options ▾  
Issue row same format as Issue search:
- IS20482956 — Gas Safety Certificate (CP12) Only — 19 Daylesford Grove, Slough, SL1 5AX — Awaiting instruction — Raised 36 wks ago — Assigned to: (Unassigned) — **255** badge — 3 - Non-urgent (high)

---

#### Sub-tab: Completion

**Alert banner (yellow):** "All issues associated with this service event must be closed in order to complete the event."

| Field | Value / Notes |
|---|---|
| Works due by | 01-02-2026 |
| Works completed on | (empty date input 📅) — "Enter and save the completion date when the works are completed" |
| Completion notes | (empty textarea, 1000 characters remaining) |
| Completion documents | "Click to upload" (dashed border) — "Click the button to upload documents to demonstrate that the job is complete. Once uploaded click on [edit icon] to annotate these documents." |
| Certificate documents | "Click to upload" (dashed border) |

---

#### Sub-tab: Documents

Same filter/empty state layout as issue Documents tab:
- Document type | Certificate type | Tag | Sort By | Desc ▾ | Images only toggle | [🔍 Search]
- 0 results — Empty state: "No documents found"

---

#### Sub-tab: Planner

**Controls:**
- [+ Add events] button | [🖨 Print] button
- View: ● Years  ○ Months  ○ Weeks  ○ Days
- Navigation: ← -5Y | ← -1Y | Today | +1Y → | +5Y →
- "Hide sub headings" link

**Timeline grid columns:** Service name | Freq | Statutory | Year columns (2021–2032)
- Current year (2026) highlighted with orange/yellow background

**Data hierarchy:** Lettings planned maintenance > Lettings > Lettings maintenance  
**Row:** [I red] Gas Safety Certificate (CP12) Only | 1Y | ✓ | [I] 2025 | [I] 2026 | [P] 2027–2032

**Badge colour meanings in Planner:**
- [I] red = in progress / currently instructed
- [P] dark grey = planned (future)
- (empty) = not yet scheduled

---

#### Sub-tab: Related events

"**Next event due**"  
"This event is due every 1 Year"

Related events list (same row format as service event search):
| Ref | Name | Status | Instruction | Due |
|---|---|---|---|---|
| SE1646119928 | Gas Safety Certificate (CP12) Only | P | 03/12/2026 | 01/02/2027 |
| SE704928318 (current) | Gas Safety Certificate (CP12) Only | I | 03/12/2025 | 01/02/2026 |
| SE1339614835 | Gas Safety Certificate (CP12) Only | I | 04/07/2025 | 04/07/2025 |

---

### 5.3 Add Event Form
**Route:** Service event search → "+ Add event"

**Page title:** "Add event"

| Field | Type | Required | Notes |
|---|---|---|---|
| Event template | dropdown ("Please select") | ✱ | — |
| Event name | text input | ✱ | — |
| Buildings/Units | text input | ✱ | — |
| Cost code | text input | — | — |
| Assets | text input | — | — |
| Last completed date | date input (× to clear, 📅) | — | — |
| Works due by | date input (📅) | ✱ | — |
| Service agreement | dropdown ("Please select an agreement") | — | — |
| Assigned agent | searchable dropdown ("Enter the agent name") | — | "Agent assigned to manage the planned maintenance issue" |
| Instruct contractor | searchable dropdown ("Enter the contractor name") | — | "Contractor who will be instructed to complete the planned maintenance issue" |
| Works authorisation limit | text with £ prefix (× to clear) | — | "The works authorisation limit of each planned maintenance issue" |
| Requires review | radio: ● Yes  ○ No | — | "If no reviewer is required then the service event will be marked as closed once the last issue associated with it is closed" |
| Reviewing agent | searchable dropdown ("Enter the agent name") | — | "Notify agent on review; if no agent is selected the agent assigned to the issue will be notified." |
| Instruction interval | number (default: 7) + unit dropdown (Days) | — | "How far in advance of the due date to create an issue for the work" |
| Instruction date | (auto-calculated from works due by - interval) | — | — |
| Instruction notes | textarea (placeholder: "This is a statement of the works you require from the contractor") | — | — |
| Repeat | checkbox + number (1) + unit dropdown (Years) + Until date (📅) | — | — |

**Submit:** [✓ Save] button (blue)

---

## 6. People

### 6.1 People — Occupiers

**Route:** People → Occupiers

**List view:**
- Page title: "Occupiers" with search bar
- Columns: Name/Ref | Address | Contact info | Status

**Occupier detail:**
- Header: "Occupier [Name]" + entity ID + "Add tag" button
- Tab bar: Profile | Notification settings | Notification history

**Profile tab — General section (collapsible):**
| Field | — |
|---|---|
| Title | — |
| First name | — |
| Last name | — |
| Email address | — |
| Mobile number | — |
| Occupier type | Tenant / Owner-occupier / Other |
| Contact time preference | Any time / Morning / Afternoon / Evening |
| Unit (address) | — |
| Unit start date | — |
| Unit end date | — |
| Notes | — |

**Notification settings tab:** Email notification preferences (checkboxes for issue events)

**Notification history tab:** Log of notifications sent to this occupier

---

### 6.2 People — Landlords

**Route:** People → Landlords

**List view header:** "Landlords" + search  
**Columns:** Name | Company | Email | Phone | Properties count

**Landlord detail:**
- Header: "Landlord [Name]" + entity ID + "Add tag" button
- Tabs: Profile | Notification settings | Notification history

**Profile tab — General section:**
| Field | — |
|---|---|
| Title | — |
| First name | — |
| Last name | — |
| Company name | — |
| Email address | — |
| Phone number | — |
| Mobile number | — |
| Address line 1-3 | — |
| Town | — |
| Postcode | — |
| Country | — |
| Notes | — |

**Address section** (collapsible): Linked properties/units

---

### 6.3 People — Leaseholders

**Route:** People → Leaseholders

**Empty state view:** Grey document icon + "No leaseholders found" + [+ Add leaseholder] button

**Add leaseholder form fields:**
| Field | Type | Required |
|---|---|---|
| Title | dropdown | — |
| First name | text | ✱ |
| Last name | text | ✱ |
| Email address | email | ✱ |
| Phone number | tel | — |
| Mobile number | tel | — |
| Address line 1 | text | — |
| Town | text | — |
| Postcode | text | — |
| Country | dropdown | — |
| Notes | textarea | — |

---

### 6.4 People — Agents

**Route:** People → Agents

**List view:** Agent list with Name, Email, Role columns

**Agent detail ("My profile" view for current user):**
- Header: "My profile" + user ID
- Tabs: Profile | Notification settings | Issue allocations | Out of office

**Profile tab fields:**
| Field | — |
|---|---|
| First name | — |
| Last name | — |
| Email address | — |
| Phone number | — |
| Mobile number | — |
| Job title | — |
| Signature | textarea |

---

## 7. Properties

### 7.1 Properties — Units

**Route:** Properties → Units

**List view:**
- Page title: "Units" + search
- Columns: Ref | Address | Building | Occupier | Landlord | Status

**Unit detail tabs (8 tabs):**
Detail | Landlord | Occupiers | Issues | Documents | Reminders | Cost codes | Assets

**Unit detail — Detail tab:**
| Field | — |
|---|---|
| Address line 1-3 | — |
| Town | — |
| Postcode | — |
| Country | — |
| Unit type | — |
| Floor area (m²) | — |
| Bedrooms | — |
| Bathrooms | — |
| Unit notes | textarea |
| HMO licensed | Yes/No |

---

### 7.2 Properties — Estates

**Route:** Properties → Estates

**List view:** Estate list with Name, Address, Units count

**Estate detail:**
- Header: "Estate [Name]"
- Tabs: Detail | Properties | Issues | Documents

**Estate detail — Detail tab:**
| Field | — |
|---|---|
| Estate name | — |
| Address | — |
| Description | — |

---

### 7.3 Properties — Buildings

**Route:** Properties → Buildings

**List view:** Building list with Name/Address, Units count

**Building detail — 15 tabs:**
Detail | Landlord | Issues | Leaseholders | Occupiers | Contractors | Directors | Units | Assets | Building notifications | Reports | Documents | Reminders | Cost codes | Works planner

**Building detail — Detail tab fields (all collapsible sections):**

**General section:**
| Field | — |
|---|---|
| Building name | — |
| Address line 1-3 | — |
| Town | — |
| County | — |
| Postcode | — |
| Country | — |
| Type of building | dropdown |
| Notes | textarea |

**Additional section:**
| Field | — |
|---|---|
| Estate | linked estate |
| Property manager | agent dropdown |
| HMO licensed | Yes/No |
| HMO licence number | text |
| HMO licence expiry | date |

---

## 8. Calendar

### 8.1 Calendar Views

**Route:** Calendar → (submenu)

**View toggle (top-right):** Month | Week | Day

**Month view:**
- Standard calendar grid (7 days × 5-6 weeks)
- Events shown as coloured bars across days
- Navigation: ← prev | "Month Name YYYY" | next → | Today button
- Event types shown with colour indicators

**Week view:**
- 7-column grid with hourly time slots
- Events as vertical coloured blocks

**Day view:**
- Single column with hourly slots
- Events as full-width coloured blocks

**Event filter dropdown:** Filters events by type/category

### 8.2 Calendar Search

**Route:** Calendar → Calendar search

**Page title:** "Calendar search"
**Description:** "Create a new calendar item an entry via the actions menu on a unit or by setting an entry on a unit document or a contractor's certification."
**Link:** "Create a service event instead to assign someone to this work, automatically remind them nearer the time, and then track that it's completed."

**Search bar:** "Enter event summary" input + search button + ▾

**Results (3 found in sample):**
| Event | Due Date | Reminder Date |
|---|---|---|
| Auth User Unavailability - Coles Roofing unavailable | 13/11/2025 | 13/10/2025 |
| Contractor Certificate Validity - Test (Coles Roofing, Mr Jordan Ball) | 12/02/2026 | 12/01/2026 |
| Job Appointment - IS20154549: 19 Daylesford Grove, Slough, SL1 5AX (address repeat) | 21/11/2025 | 14/11/2025 |

**Row format:** [Event title / subtitle] | [Due date / Reminder date] | [✏ edit icon]

---

## 9. Data Models (Inferred from UI)

### Issue
```
id: string          // e.g. "IS17975990"
title: string       // e.g. "Boiler not working (Gas Boiler)"
address: string     // e.g. "19 Daylesford Grove, Slough, SL1 5AX"
status: string      // "Open" | "Closed" | "Awaiting instruction" | "Request for quotes ended" 
                    // | "Awaiting job completion" | "Job completed, awaiting contractor information"
                    // | "Job awarded, awaiting appointment date" | "Reported"
age_days: number    // days since opened
priority: number    // e.g. 3 (Non-urgent high)
priority_label: string // "3 - Non-urgent (high)"
category: string    // hierarchical "Heating and boiler > Gas Boiler or Heater > Gas Boiler"
assigned_to: string // "Ahsan Inc (Ahsan Jalil)"
raised_date: string // "Tue 15 Apr 25, 14:09"
raised_by: string   // "Agent Ahsan Inc (Ahsan Jalil)"
landlord: string    // "Ahsan Inc (Mr Ahsan Jalil)"
```

### Service Event
```
id: string          // e.g. "SE704928318"
name: string        // e.g. "Gas Safety Certificate (CP12) Only"
address: string     // unit address
status: "I" | "P" | "C"  // In progress | Planned | Completed
instruction_date: string
due_date: string
frequency: string   // "1Y" (1 year)
is_statutory: boolean
```

### Dashboard Panel
```
type: "kpi-circle" | "list" | "matrix" | "empty"
title: string
data: any
configurable: true
```

---

## 10. Colour Palette

| Use | Colour |
|---|---|
| Primary blue / CTA buttons | `#0B81C5` / `rgb(11, 129, 197)` |
| Header / Logo blue | `~#1565C0` |
| Tab bar (active bg) | `~#1976D2` |
| Sidebar background | `~#F5F5F5` |
| Body background | `rgb(249, 249, 249)` |
| KPI circles | Blue (same as primary) |
| Age badge (urgent) | Dark red/charcoal filled pill |
| Status badge | Light grey pill, dark text |
| Alert banner (overdue/warning) | Yellow/amber (`#FFF9C4` approx) |
| Alert banner text | Dark amber/orange |
| Service event badge I | Red/orange square `~#E53935` |
| Service event badge P | Dark grey/charcoal square `~#455A64` |
| Service event badge C | Green circle `~#4CAF50` |
| Matrix cell colours | Blue, Purple, Pink/Red, Dark green, Orange, Teal, Light green, Blue-grey, Purple-light |
| "Need help?" button | Blue pill |
| Avatar (current user) | Purple/blue `~#7B1FA2` |
| Success green | `~#4CAF50` |
| Warning orange | `~#FF9800` |

---

## 11. Screens Not Yet Captured

The following sections exist in the nav and need separate capture sessions:
- Issue assignment (Issues submenu)
- Comments (Issues submenu — standalone comments list)
- Projects (Issues submenu)
- Major works (Issues submenu)
- Planned maintenance → Compliance matrix
- Planned maintenance → Service agreements
- Planned maintenance → Buildings (PM view)
- Planned maintenance → Event templates
- Planned maintenance → Service programmes
- Reports (all sub-items)
- Setup (all sub-items)
- Integrations
- Contractor marketplace
- Co-pilot
- Building detail — remaining 14 tabs (Landlord through Works planner)

---

*Captured: 2026-08-15 | Source: https://ahsan.fixflo.com | Version: 2.981.58.0*
