# Public Grievance Registration and Resolution System (PGRRS)
### Ministry of Public Affairs & Citizen Services • Government of India
**Prime Minister & Head of Chiefs: Mr. Prajwal**

A production-ready, high-security civic governance web application built with **HTML5, Tailwind CSS via CDN, and Vanilla JavaScript**, backed by **Supabase PostgreSQL & Supabase Storage**.

Engineered following the strict visual standards of national government portals: Deep Navy (`#0b192c`), Crimson & Gold government accents (`#b91c1c` / `#d97706`), official typography (Inter & Cinzel), heraldic National Emblem badges, and formal statutory footers.

---

## 🏛️ Key Capabilities & Portal Architecture

### 1. Official Header & Statutory Footer
- **Official Header**:
  - Heraldic National Emblem insignia styling.
  - Portal Title: **Public Grievance Registration and Resolution System**.
  - Subtitle: **Ministry of Public Affairs & Citizen Services**.
  - **Emergency Grievance Helpline Badge**: `1800-11-2026` (24x7 National Toll-Free).
  - Real-time navigation (`Home`, `Track Status`, `Public Grievance Archive`, `Lodge Grievance`, `My Grievances`, `Executive Redressal Desk`, dynamic User Profile / Sign In).
- **Formal Statutory Footer**:
  - Ministry accreditation & Government civic redressal statement.
  - Statutory copyright: `© 2026 Ministry of Public Affairs & Citizen Services. All rights reserved.`
  - Prominently displays: **Prime Minister & Head of Chiefs: Mr. Prajwal**.
  - Security badges: Supabase Cloud PostgreSQL Active, TLS 1.3 256-Bit SSL Secured, Citizen Charter Compliant.

### 2. Strict Authentication & Role Management (NO Demo Bypass Buttons)
- **Zero test shortcuts or quick demo login bypasses**: Every citizen, department official, and administrator must authenticate through formal credential validation against the `profiles` table.
- **Formal Sign-Up Flow**:
  - Fields: Full Legal Name, Official/Citizen Email, Mobile Phone (+91), District / Ward, Governance Role (`citizen`, `official`, `admin`), Department Allocation (for officials), Designation / Employee ID, and secure Password validation (minimum 8 characters with confirm password check).
  - Saves directly to the Supabase `profiles` table.
- **Dynamic Role Routing**:
  - **Citizen**: Routed to **My Grievances** and **Lodge Grievance** forms.
  - **Department Official**: Routed to the **Executive Redressal Desk** filtered to their assigned department queue with official credentials.
  - **Administrator**: Routed to the **Apex Secretariat Command Desk** with multi-department oversight, resolution audits, and system analytics.

### 3. Direct Supabase Storage Photo Uploads
- Direct integration with the Supabase Storage bucket named **`images`**.
- Grievance submission form includes a drag-and-drop / file picker for photographic evidence.
- Uploads directly using `@supabase/supabase-js` storage API (`supabaseClient.storage.from('images').upload(...)`).
- Obtains the encrypted public access URL and saves it into the **`image_url`** (and `attachment_url`) column of the `grievances` table.
- Click-to-zoom high-resolution Lightbox modal for reviewing photo evidence.

### 4. Public Transparency & Analytics Dashboard (Home / Landing)
- **Real-Time Statistics Counters Ribbon**:
  - **Total Resolved Grievances** (Verified with Ground Audit).
  - **Active Departments** (24x7 Municipal Coverage across 6 core civic boards).
  - **Total Grievances Lodged** & Active Redressal Counter.
  - **Prominently displaying 100% Citizen Satisfaction** under Activity Redressal metrics.
- **Public Search Tool**:
  - Allows anyone to enter a Tracking ID (e.g. `GRV-2026-1001`) to view live status, timeline logs, and attached photos without logging in.
- **Public Feed of Successfully Resolved Grievances**:
  - Dedicated public feed showing resolved cases, before/after details, department category, attached photos, and official resolution notes.

### 5. Citizen Portal & Grievance Lodging
- Secure submission form: Title, Category (dropdown from `departments`), Urgency Priority (with official SLA tags), Location & District, Detailed Description, and Photo Evidence upload.
- Generates an immutable tracking ID (e.g. `GRV-2026-XXXX`).
- Saves to `grievances` and writes initial entry to `grievance_logs` ("Grievance Registered" by Citizen).
- Printable **Official Citizen Acknowledgement Voucher** with civic stamp and `window.print()` formatting.

### 6. Department Official & Admin Dashboard
- Executive overview of all citizen submissions.
- Filterable and searchable by Department, Status (Pending, In Progress, Resolved, Rejected), and Priority (Urgent, High, Medium, Low).
- **Official Action Modal**:
  - Update ticket status.
  - Assign handling engineers / officers.
  - Write official action notes / resolution report.
  - Automatically appends timestamped records to `grievance_logs`.
- **Audit CSV Export**: Download complete grievance dockets for government audits.

---

## 🗄️ Supabase Backend Configuration

- **Supabase URL**: `https://kihkzjzgpuenbetlrsxp.supabase.co`
- **Supabase Anon Key**: `sb_publishable_lOLfI3RI6pPPl_eCBnX5ZA_SQv-U0pk`
- **Storage Bucket**: `images` (Public access for grievance evidence photos)
- **Database Tables**:
  1. `departments` - Civic boards, head officials, icons, SLA hours.
  2. `profiles` - Authenticated citizens, department officials, and administrators.
  3. `grievances` - Ticket submissions, locations, priorities, `image_url`, and resolution reports.
  4. `grievance_logs` - Immutable chronological audit trail for every action.

### Applying `schema.sql` in Supabase:
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/kihkzjzgpuenbetlrsxp/sql).
2. Copy and paste the contents of [`schema.sql`](./schema.sql).
3. Click **Run**.
4. In the portal header, click **Supabase SQL Setup** &rarr; **Check Connection Again** to immediately sync with live Supabase PostgreSQL and Storage!

---

## 🚀 Deployment to Vercel

Configured for zero-config, immediate static deployment on Vercel via [`vercel.json`](./vercel.json):

```bash
# Deploy with Vercel CLI
npx vercel --prod
```

Or import this repository directly into your [Vercel Dashboard](https://vercel.com).
