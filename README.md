# JanSeva | Public Grievance Registration and Resolution System (PGRRS)

A single-page, civic governance web application built with **HTML5, Tailwind CSS via CDN, and Vanilla JavaScript**, backed by **Supabase PostgreSQL**.

Designed following the visual aesthetics of official municipal portals (Deep Navy `#1e293b`, Gold Accents `#d97706`, and clean Slate backgrounds `#f8fafc`).

---

## 🏛️ Application Architecture & Key Modules

### 1. Header & Civic Navigation
- **Theme**: Deep Navy (`#0f172a` / `#1e293b`), Gold accents (`#d97706` / `#f59e0b`), National Emblem insignia, and accessibility bar.
- **Dynamic Navbar**:
  - **Guest / Logged Out**: "Home", "Track Status", "Public Analytics", "Sign In", "Register Citizen", and a 1-click **⚡ Quick Demo** dropdown.
  - **Citizen Role**: "Lodge Grievance", "My Grievances", user profile badge, and Sign Out.
  - **Official / Admin Role**: "Redressal Desk" (executive command dashboard), Department Queue banner, and Sign Out.

### 2. Authentication System (`profiles` Table Integration)
- Interacts with the `profiles` table in Supabase.
- Supports three role types:
  - **`Citizen`**: Can lodge complaints, review status, view detailed audit logs, and print acknowledgement vouchers.
  - **`Department Official`**: Assigned to a specific civic department (e.g. Water Board, Roads PWD, Electricity). Can update ticket status, add resolution notes, and assign engineers.
  - **`Admin`**: Cross-department command center with city-wide metrics, audit logs, and CSV report exports.
- **Instant Demo Accounts** (Pre-seeded for one-click testing):
  - **Citizen Demo**: `citizen@civic.gov` / `Citizen123!`
  - **Department Official Demo**: `official.water@civic.gov` / `Official123!`
  - **Portal Admin Demo**: `admin@civic.gov` / `Admin123!`

### 3. Citizen Portal
- **Submit Grievance Form**:
  - Title, Category (dynamically fetched from `departments`), Priority (Urgent, High, Medium, Low), District, Location/Landmark, and Detailed Description.
  - Generates a unique tracking token formatted as `GRV-2026-XXXX`.
  - Automatically logs the initial creation in `grievance_logs`.
  - Displays a printable **Official Citizen Acknowledgement Slip** with receipt format.
- **My Grievances View**:
  - Displays submitted tickets with live status badges:
    - **Pending**: Yellow (`bg-amber-100 text-amber-800 border-amber-300`)
    - **In Progress**: Blue (`bg-blue-100 text-blue-800 border-blue-300`)
    - **Resolved**: Green (`bg-emerald-100 text-emerald-800 border-emerald-300`)
    - **Rejected**: Red (`bg-rose-100 text-rose-800 border-rose-300`)
- **Lifecycle Timeline View**:
  - Displays sequential history from `grievance_logs` showing actor name, role, timestamp, state changes, and official remarks.

### 4. Official & Admin Dashboard
- **Overview Metrics**: Total Grievances, Pending Action, In Progress, Resolved, Rejected, and Resolution Percentage Rate.
- **Filterable Data Table**:
  - Filter by Department (e.g., Water Supply, Public Works, Electricity, Waste Management, Public Health, Traffic).
  - Filter by Status (Pending, In Progress, Resolved, Rejected).
  - Filter by Priority (Urgent, High, Medium, Low).
  - Real-time text search query (Tracking ID, Citizen Name, Location, Keyword).
  - **Export CSV**: Generates a downloadable CSV audit report.
- **Update Grievance Modal**:
  - Change status (Pending &rarr; In Progress &rarr; Resolved / Rejected).
  - Assign responsible official from the department staff.
  - Add official resolution notes / action summary.
  - **Automatic Audit Trail**: Every save automatically inserts a record into `grievance_logs` with timestamps, previous state, new state, and official remarks.
  - Trigger celebratory confetti animation on resolution.

### 5. Public Analytics & Tracking
- **Public Search**: Anyone can enter a tracking ID (e.g. `GRV-2026-1001`) without logging in to inspect the verified audit trail, masked citizen name, department, and current status.
- **Civic Transparency Analytics**:
  - Department-wise resolution rate progress bars.
  - Urgency & Priority distribution.
  - Live Ticker of recently resolved cases.

---

## 🗄️ Supabase Configuration & Schema Setup

### Connection Details
- **Supabase URL**: `https://kihkzjzgpuenbetlrsxp.supabase.co`
- **Supabase Anon Key**: `sb_publishable_lOLfI3RI6pPPl_eCBnX5ZA_SQv-U0pk`
- **Client Script**: Included via CDN `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`

### Dual-Mode Architecture (Supabase First + Local Fallback)
The application includes a dual-mode repository:
1. When Supabase tables exist, it performs real-time queries directly against Supabase.
2. If tables are not yet created in Supabase (or in offline mode), it uses a localStorage fallback seeded with sample records, ensuring 100% interactive functionality without errors.
3. The top banner displays the live connection status with a **Supabase SQL Setup** modal.

### How to Apply the PostgreSQL Schema in Supabase:
1. Open your Supabase Dashboard: [Supabase SQL Editor](https://supabase.com/dashboard/project/kihkzjzgpuenbetlrsxp/sql)
2. Copy and paste the contents of [`schema.sql`](./schema.sql).
3. Click **Run**.
4. Click **Check Connection Again** in the web app's top bar to immediately switch to live Supabase synchronization!

---

## 🚀 Deployment to Vercel

The application is pre-configured with [`vercel.json`](./vercel.json) and is static-host ready:

```bash
# Deploy with Vercel CLI
npx vercel --prod
```
Or simply connect this Git repository to [Vercel](https://vercel.com) — no build step is needed (`index.html` is served as the entry point).
