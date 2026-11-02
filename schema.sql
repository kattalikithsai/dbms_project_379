-- ==============================================================================
-- PUBLIC GRIEVANCE REGISTRATION AND RESOLUTION SYSTEM (PGRRS)
-- Ministry of Public Affairs & Citizen Services
-- Prime Minister & Head of Chiefs: Mr. Prajwal
-- Supabase PostgreSQL Schema, Storage Setup & Seed Data
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. DROP EXISTING TABLES (IF RESETTING)
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
    sla_hours INTEGER DEFAULT 48,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROFILES TABLE (Custom Auth / User Directory)
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('citizen', 'official', 'admin')),
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    official_designation TEXT,
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
    image_url TEXT,
    attachment_url TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Resolved', 'Rejected')),
    assigned_official_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    assigned_official_name TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. GRIEVANCE LOGS / TIMELINE AUDIT TABLE
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

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievances" ON grievances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievance_logs" ON grievance_logs FOR ALL USING (true) WITH CHECK (true);

-- 8. STORAGE BUCKET CREATION & PUBLIC STORAGE POLICIES
-- Creates the 'images' storage bucket for grievance photo evidence uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: allow public anon upload and read
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access to Grievance Images'
    ) THEN
        CREATE POLICY "Public Access to Grievance Images" 
        ON storage.objects FOR SELECT 
        USING (bucket_id = 'images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Upload to Grievance Images'
    ) THEN
        CREATE POLICY "Public Upload to Grievance Images" 
        ON storage.objects FOR INSERT 
        WITH CHECK (bucket_id = 'images');
    END IF;
END $$;

-- ==============================================================================
-- 9. SEED DATA
-- ==============================================================================

-- Departments
INSERT INTO departments (id, name, code, description, head_official, icon, sla_hours) VALUES
('dept_water', 'Water Supply & Sewage Board', 'WATER', 'Potable water pipelines, sewage blockages, municipal drainage & water quality testing', 'Er. Arvind Mehta', 'droplet', 24),
('dept_roads', 'Public Works & Road Infrastructure', 'ROADS', 'Pothole restoration, highway carpeting, bridge safety, storm drains & sidewalk paving', 'Er. Priya Sharma', 'car', 48),
('dept_elec', 'Electricity & Power Distribution', 'ELEC', 'Power breakdown, hazardous transformer sparking, live wires & streetlight maintenance', 'Er. Rajesh Verma', 'zap', 12),
('dept_waste', 'Municipal Solid Waste Management', 'WASTE', 'Garbage collection, community dumpster hygiene, bio-waste disposal & sanitation drives', 'Dr. S. K. Nambiar', 'trash-2', 24),
('dept_health', 'Public Health & Healthcare Services', 'HEALTH', 'Civic clinics, vector epidemic control, sanitation compliance & food safety inspection', 'Dr. Ananya Roy', 'activity', 24),
('dept_police', 'Traffic & Law Enforcement', 'POLICE', 'Traffic signal management, illegal commercial parking, encroachment & emergency lane clearance', 'Insp. Vikram Singh', 'shield', 24);

-- Initial Profiles (Registered Officials, Admins and Verified Citizens)
INSERT INTO profiles (id, email, password, full_name, phone, role, department_id, official_designation, district) VALUES
('usr_official_water', 'official.water@civic.gov', 'GovOfficial#2026', 'Er. Arvind Mehta', '+91 91234 56789', 'official', 'dept_water', 'Superintending Engineer', 'Central District'),
('usr_official_roads', 'official.roads@civic.gov', 'GovOfficial#2026', 'Er. Priya Sharma', '+91 91234 98765', 'official', 'dept_roads', 'Executive Engineer (PWD)', 'South Ward'),
('usr_official_elec', 'official.elec@civic.gov', 'GovOfficial#2026', 'Er. Rajesh Verma', '+91 91234 44556', 'official', 'dept_elec', 'Chief Electrical Inspector', 'East Ward'),
('usr_admin_1', 'admin@civic.gov', 'Secretariat#2026', 'Dr. K. S. Murthy', '+91 99999 88888', 'admin', NULL, 'Chief Director, Grievance Secretariat', 'Apex Secretariat'),
('usr_citizen_1', 'citizen@civic.gov', 'CitizenSecure#2026', 'Likith Sai', '+91 98765 43210', 'citizen', NULL, NULL, 'Central District'),
('usr_citizen_2', 'aarti.sharma@example.com', 'CitizenSecure#2026', 'Aarti Sharma', '+91 98765 11223', 'citizen', NULL, NULL, 'North Ward');

-- Seed Grievances
INSERT INTO grievances (id, tracking_id, citizen_id, citizen_name, citizen_email, citizen_phone, title, department_id, department_name, priority, location, district, description, image_url, attachment_url, status, assigned_official_id, assigned_official_name, resolution_notes, resolved_at, created_at, updated_at) VALUES
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
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    'In Progress',
    'usr_official_water',
    'Er. Arvind Mehta',
    'Field repair crew dispatched with heavy excavation gear. Replacement ductile iron pipeline segment installation underway.',
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
    'Deep Hazardous Potholes on Main Bus Transit Route',
    'dept_roads',
    'Public Works & Road Infrastructure',
    'High',
    'Between Metro Pillar 140 to 148, Outer Ring Road',
    'Central District',
    'Multiple deep potholes spanning 200 meters. Caused 2 two-wheeler skids yesterday. High safety hazard during evening peak transit.',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    'Resolved',
    'usr_official_roads',
    'Er. Priya Sharma',
    'Emergency cold-mix asphalt patch work and heavy bitumen overlay completed. Surface tested and cleared by Junior Engineer on duty.',
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
    'High Voltage Streetlight Pole Sparking Dangerously',
    'dept_elec',
    'Electricity & Power Distribution',
    'Urgent',
    'Near Community Health Center, North Gate Junction',
    'North Ward',
    'Streetlight pole #NL-44 has loose dangling live wires that emit loud sparks whenever wind blows. Direct threat to school children and patients.',
    'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80',
    'Pending',
    NULL,
    NULL,
    NULL,
    NULL,
    NOW() - INTERVAL '14 hours',
    NOW() - INTERVAL '14 hours'
),
(
    'grv_004',
    'GRV-2026-1004',
    'usr_citizen_2',
    'Aarti Sharma',
    'aarti.sharma@example.com',
    '+91 98765 11223',
    'Sanitation Bin Overflowing & Foul Odor Near School',
    'dept_waste',
    'Municipal Solid Waste Management',
    'Medium',
    'Market Square, Corner of Vegetable Yard',
    'North Ward',
    'Community bin has not been cleared for 4 consecutive days. Debris spilled across 50 meters attracting stray animals and severe pest infestation.',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    'Resolved',
    NULL,
    'Dr. S. K. Nambiar',
    'Sanitation compactor squad cleared 4 metric tons of accumulated refuse. Area disinfected with high-grade bleaching powder and scheduled for daily 6 AM sweep.',
    NOW() - INTERVAL '4 hours',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '4 hours'
),
(
    'grv_005',
    'GRV-2026-1005',
    'usr_citizen_1',
    'Likith Sai',
    'citizen@civic.gov',
    '+91 98765 43210',
    'Illegal Commercial Trucks Blocking Fire Hydrant Access',
    'dept_police',
    'Traffic & Law Enforcement',
    'Low',
    'Old Grain Market Alley #3, Sector 5',
    'Central District',
    'Private transport logistics vehicles parked permanently across marked fire hydrant access zones, creating severe fire hazard.',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    'Resolved',
    NULL,
    'Insp. Vikram Singh',
    'Traffic squad deployed heavy hydraulic tow trucks. Vehicles removed to impound lot, penalty challans issued, and yellow cautionary bollards installed.',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '1 day'
);

-- Seed Logs
INSERT INTO grievance_logs (id, grievance_id, tracking_id, action, previous_status, new_status, performed_by_name, performed_by_role, remarks, created_at) VALUES
('log_001', 'grv_001', 'GRV-2026-1001', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Grievance filed through Citizen Web Portal with location and photographic evidence.', NOW() - INTERVAL '3 days'),
('log_002', 'grv_001', 'GRV-2026-1001', 'Official Assigned', 'Pending', 'Pending', 'Grievance Secretariat', 'Admin', 'Assigned to Er. Arvind Mehta (Water Supply & Sewage Board).', NOW() - INTERVAL '2 days'),
('log_003', 'grv_001', 'GRV-2026-1001', 'Status Updated', 'Pending', 'In Progress', 'Er. Arvind Mehta', 'Department Official', 'Inspection complete. Field team deployed with ductile iron pipe segment.', NOW() - INTERVAL '1 day'),

('log_004', 'grv_002', 'GRV-2026-1002', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Pothole issue submitted with ward marker and photo.', NOW() - INTERVAL '5 days'),
('log_005', 'grv_002', 'GRV-2026-1002', 'Status Updated', 'Pending', 'In Progress', 'Er. Priya Sharma', 'Department Official', 'Emergency asphalt patch work batch approved for immediate night repair.', NOW() - INTERVAL '4 days'),
('log_006', 'grv_002', 'GRV-2026-1002', 'Grievance Resolved', 'In Progress', 'Resolved', 'Er. Priya Sharma', 'Department Official', 'Road resurfaced and leveled. Quality inspection passed by Junior Engineer.', NOW() - INTERVAL '6 hours'),

('log_007', 'grv_003', 'GRV-2026-1003', 'Grievance Registered', NULL, 'Pending', 'Aarti Sharma', 'Citizen', 'Hazardous electric wire sparking reported under Urgent priority.', NOW() - INTERVAL '14 hours'),

('log_008', 'grv_004', 'GRV-2026-1004', 'Grievance Registered', NULL, 'Pending', 'Aarti Sharma', 'Citizen', 'Waste overflow complaint registered.', NOW() - INTERVAL '2 days'),
('log_009', 'grv_004', 'GRV-2026-1004', 'Status Updated', 'Pending', 'In Progress', 'Dr. S. K. Nambiar', 'Department Official', 'Sanitation compactor squad routed to North Ward.', NOW() - INTERVAL '1 day'),
('log_010', 'grv_004', 'GRV-2026-1004', 'Grievance Resolved', 'In Progress', 'Resolved', 'Dr. S. K. Nambiar', 'Department Official', 'Refuse cleared and area sanitized with disinfectant.', NOW() - INTERVAL '4 hours'),

('log_011', 'grv_005', 'GRV-2026-1005', 'Grievance Registered', NULL, 'Pending', 'Likith Sai', 'Citizen', 'Fire hydrant obstruction reported.', NOW() - INTERVAL '7 days'),
('log_012', 'grv_005', 'GRV-2026-1005', 'Official Assigned', 'Pending', 'In Progress', 'Grievance Secretariat', 'Admin', 'Forwarded to Central Traffic Police Station.', NOW() - INTERVAL '4 days'),
('log_013', 'grv_005', 'GRV-2026-1005', 'Grievance Resolved', 'In Progress', 'Resolved', 'Insp. Vikram Singh', 'Department Official', 'Vehicles towed away, challans issued, cautionary bollards installed.', NOW() - INTERVAL '1 day');
