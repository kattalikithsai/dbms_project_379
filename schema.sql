-- ==============================================================================
-- PUBLIC GRIEVANCE REGISTRATION AND RESOLUTION SYSTEM (PGRRS)
-- Supabase PostgreSQL Schema & Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING TABLES (IF RE-RUNNING)
DROP TABLE IF EXISTS grievance_logs CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 3. DEPARTMENTS TABLE
CREATE TABLE departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    head_official TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES TABLE (Custom Auth / User directory)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'official', 'admin')),
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    district TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. GRIEVANCES TABLE
CREATE TABLE grievances (
    id TEXT PRIMARY KEY,
    tracking_id TEXT UNIQUE NOT NULL,
    citizen_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    citizen_name TEXT NOT NULL,
    citizen_email TEXT NOT NULL,
    citizen_phone TEXT,
    title TEXT NOT NULL,
    department_id TEXT REFERENCES departments(id) ON DELETE RESTRICT,
    department_name TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    location TEXT NOT NULL,
    district TEXT NOT NULL,
    description TEXT NOT NULL,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Rejected')),
    assigned_official_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_official_name TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GRIEVANCE LOGS / TIMELINE TABLE
CREATE TABLE grievance_logs (
    id TEXT PRIMARY KEY,
    grievance_id TEXT REFERENCES grievances(id) ON DELETE CASCADE,
    tracking_id TEXT NOT NULL,
    action TEXT NOT NULL,
    previous_status TEXT,
    new_status TEXT,
    performed_by_name TEXT NOT NULL,
    performed_by_role TEXT NOT NULL,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS) & PUBLIC ACCESS POLICIES
-- For public portal / anon API key access
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievances" ON grievances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievance_logs" ON grievance_logs FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 8. SEED DATA
-- ==============================================================================

-- Departments
INSERT INTO departments (id, name, code, description, head_official, icon) VALUES
('dept_water', 'Water Supply & Sewage Board', 'WATER', 'Potable water pipelines, drainage maintenance, sewage blockages, water quality', 'Er. Arvind Mehta', 'droplet'),
('dept_roads', 'Public Works & Road Infrastructure', 'ROADS', 'Pothole repair, road carpeting, footpaths, bridges, drainage channels', 'Er. Priya Sharma', 'car'),
('dept_elec', 'Electricity & Power Distribution', 'ELEC', 'Power outages, hazardous wiring, transformer failure, streetlight repairs', 'Er. Rajesh Verma', 'zap'),
('dept_waste', 'Municipal Solid Waste Management', 'WASTE', 'Garbage collection, community dumpsters, sanitation drives, debris disposal', 'Dr. S. K. Nambiar', 'trash-2'),
('dept_health', 'Public Health & Healthcare Services', 'HEALTH', 'Civic clinics, vector-borne disease control, sanitation inspection, food hygiene', 'Dr. Ananya Roy', 'activity'),
('dept_police', 'Traffic & Law Enforcement', 'POLICE', 'Traffic signal management, illegal parking, civic encroachment, public nuisance', 'Insp. Vikram Singh', 'shield');

-- Demo Profiles
-- Passwords stored for demo verification
INSERT INTO profiles (id, email, password, full_name, phone, role, department_id, district) VALUES
('usr_citizen_1', 'citizen@civic.gov', 'Citizen123!', 'Likith Sai', '+91 98765 43210', 'citizen', NULL, 'Central District'),
('usr_citizen_2', 'aarti.sharma@example.com', 'Citizen123!', 'Aarti Sharma', '+91 98765 11223', 'citizen', NULL, 'North Ward'),
('usr_official_water', 'official.water@civic.gov', 'Official123!', 'Er. Arvind Mehta', '+91 91234 56789', 'official', 'dept_water', 'Central District'),
('usr_official_roads', 'official.roads@civic.gov', 'Official123!', 'Er. Priya Sharma', '+91 91234 98765', 'official', 'dept_roads', 'South Ward'),
('usr_official_elec', 'official.elec@civic.gov', 'Official123!', 'Er. Rajesh Verma', '+91 91234 44556', 'official', 'dept_elec', 'East Ward'),
('usr_admin_1', 'admin@civic.gov', 'Admin123!', 'Dr. K. S. Murthy (Director)', '+91 99999 88888', 'admin', NULL, 'Apex Secretariat');

-- Demo Grievances
INSERT INTO grievances (id, tracking_id, citizen_id, citizen_name, citizen_email, citizen_phone, title, department_id, department_name, priority, location, district, description, status, assigned_official_id, assigned_official_name, resolution_notes, resolved_at, created_at, updated_at) VALUES
(
    'grv_001',
    'GRV-2026-1001',
    'usr_citizen_1',
    'Likith Sai',
    'citizen@civic.gov',
    '+91 98765 43210',
    'Severe Drinking Water Pipe Leakage at 4th Cross Road',
    'dept_water',
    'Water Supply & Sewage Board',
    'Urgent',
    'Opposite City Library, 4th Cross Road, Ward 12',
    'Central District',
    'Main supply pipeline has ruptured causing massive potable water loss and road flooding for the last 2 days. Commuters unable to use sidewalk.',
    'In Progress',
    'usr_official_water',
    'Er. Arvind Mehta',
    'Field repair crew dispatched with heavy excavation gear. Pipeline section replacement underway.',
    NULL,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '1 day'
),
(
    'grv_002',
    'GRV-2026-1002',
    'usr_citizen_1',
    'Likith Sai',
    'citizen@civic.gov',
    '+91 98765 43210',
    'Deep Hazardous Potholes on Main Bus Route',
    'dept_roads',
    'Public Works & Road Infrastructure',
    'High',
    'Between Metro Pillar 140 to 148, Ring Road',
    'Central District',
    'Multiple deep potholes spanning 200 meters. Caused 2 two-wheeler skids yesterday. High hazard during night transit.',
    'Resolved',
    'usr_official_roads',
    'Er. Priya Sharma',
    'Emergency cold-mix asphalt patch work completed on Nov 01. Bitumen overlay leveled and inspected.',
    NOW() - INTERVAL '6 hours',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '6 hours'
),
(
    'grv_003',
    'GRV-2026-1003',
    'usr_citizen_2',
    'Aarti Sharma',
    'aarti.sharma@example.com',
    '+91 98765 11223',
    'High Voltage Streetlight Pole Sparking',
    'dept_elec',
    'Electricity & Power Distribution',
    'Urgent',
    'Near Community Health Center, North Gate',
    'North Ward',
    'Streetlight pole #NL-44 has loose dangling live wires that emit loud sparks whenever it rains. Direct threat to school children walking by.',
    'Pending',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '12 hours',
    NOW() - INTERVAL '12 hours'
),
(
    'grv_004',
    'GRV-2026-1004',
    'usr_citizen_2',
    'Aarti Sharma',
    'aarti.sharma@example.com',
    '+91 98765 11223',
    'Garbage Dump Overflowing and Stray Cattle Nuisance',
    'dept_waste',
    'Municipal Solid Waste Management',
    'Medium',
    'Market Square, Corner of Vegetable Yard',
    'North Ward',
    'Community bin has not been cleared for 4 consecutive days. Debris spilled across 50 meters attracting flies and foul smell.',
    'In Progress',
    NULL,
    'Dr. S. K. Nambiar',
    'Sanitation compactor scheduled for 6:00 AM route tomorrow with bleaching powder sanitization.',
    NULL,
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '18 hours'
),
(
    'grv_005',
    'GRV-2026-1005',
    'usr_citizen_1',
    'Likith Sai',
    'citizen@civic.gov',
    '+91 98765 43210',
    'Illegal Commercial Vehicle Parking Blocking Fire Hydrant',
    'dept_police',
    'Traffic & Law Enforcement',
    'Low',
    'Old Grain Market Alley #3',
    'Central District',
    'Private logistics trucks parked permanently over marked fire hydrant zones and obstructing emergency vehicle access.',
    'Resolved',
    NULL,
    'Insp. Vikram Singh',
    'Traffic towing squad deployed. Fines issued to 4 offending vehicle owners. Hydrant cleared and no-parking warning sign board reinstalled.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '1 day'
);

-- Demo Logs
INSERT INTO grievance_logs (id, grievance_id, tracking_id, action, previous_status, new_status, performed_by_name, performed_by_role, remarks, created_at) VALUES
('log_001', 'grv_001', 'GRV-2026-1001', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Grievance filed through Citizen Web Portal with location details.', NOW() - INTERVAL '3 days'),
('log_002', 'grv_001', 'GRV-2026-1001', 'Official Assigned', 'Pending', 'Pending', 'Admin System', 'Admin', 'Assigned to Er. Arvind Mehta (Water Supply & Sewage Board).', NOW() - INTERVAL '2 days'),
('log_003', 'grv_001', 'GRV-2026-1001', 'Status Updated', 'Pending', 'In Progress', 'Er. Arvind Mehta', 'Department Official', 'Inspection complete. Field team deployed with replacement ductile iron pipe segment.', NOW() - INTERVAL '1 day'),

('log_004', 'grv_002', 'GRV-2026-1002', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Pothole issue submitted with ward marker.', NOW() - INTERVAL '5 days'),
('log_005', 'grv_002', 'GRV-2026-1002', 'Status Updated', 'Pending', 'In Progress', 'Er. Priya Sharma', 'Department Official', 'Material procurement arranged for rapid asphalt filling.', NOW() - INTERVAL '4 days'),
('log_006', 'grv_002', 'GRV-2026-1002', 'Grievance Resolved', 'In Progress', 'Resolved', 'Er. Priya Sharma', 'Department Official', 'Road resurfaced and leveled. Quality inspection cleared by Junior Engineer.', NOW() - INTERVAL '6 hours'),

('log_007', 'grv_003', 'GRV-2026-1003', 'Grievance Registered', NULL, 'Pending', 'Aarti Sharma', 'Citizen', 'Hazardous electric wire sparking reported under Urgent priority.', NOW() - INTERVAL '12 hours'),

('log_008', 'grv_004', 'GRV-2026-1004', 'Grievance Registered', NULL, 'Pending', 'Aarti Sharma', 'Citizen', 'Waste overflow complaint registered.', NOW() - INTERVAL '2 days'),
('log_009', 'grv_004', 'GRV-2026-1004', 'Status Updated', 'Pending', 'In Progress', 'Dr. S. K. Nambiar', 'Department Official', 'Added to North Ward morning sanitation sweep route.', NOW() - INTERVAL '18 hours'),

('log_010', 'grv_005', 'GRV-2026-1005', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Fire hydrant obstruction reported.', NOW() - INTERVAL '7 days'),
('log_011', 'grv_005', 'GRV-2026-1005', 'Official Assigned', 'Pending', 'In Progress', 'Admin System', 'Admin', 'Forwarded to Central Traffic Police Station.', NOW() - INTERVAL '4 days'),
('log_012', 'grv_005', 'GRV-2026-1005', 'Grievance Resolved', 'In Progress', 'Resolved', 'Insp. Vikram Singh', 'Department Official', 'Vehicles towed away, challans issued, sign board fixed.', NOW() - INTERVAL '1 day');
