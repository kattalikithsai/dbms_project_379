/**
 * PUBLIC GRIEVANCE REGISTRATION AND RESOLUTION SYSTEM (PGRRS)
 * Ministry of Public Affairs & Citizen Services
 * Prime Minister & Head of Chiefs: Mr. Prajwal
 * Core Application Controller, Supabase Integration & In-Memory Data Layer
 */

// ==============================================================================
// 1. SUPABASE CONFIGURATION
// ==============================================================================
const SUPABASE_URL = "https://kihkzjzgpuenbetlrsxp.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lOLfI3RI6pPPl_eCBnX5ZA_SQv-U0pk";

let supabaseClient = null;
let isSupabaseOnline = false;

// Initialize Supabase Client
try {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn("Supabase client initialization warning:", err);
}

// ==============================================================================
// 2. DEFAULT SEED DATA (Used for In-Memory Runtime & Seed Fallback)
// ==============================================================================
const DEFAULT_DEPARTMENTS = [
  {
    id: "dept_water",
    name: "Water Supply & Sewage Board",
    code: "WATER",
    description: "Potable water pipelines, sewage blockages, municipal drainage & water quality testing",
    head_official: "Er. Arvind Mehta",
    icon: "droplet",
    sla_hours: 24
  },
  {
    id: "dept_roads",
    name: "Public Works & Road Infrastructure",
    code: "ROADS",
    description: "Pothole restoration, highway carpeting, bridge safety, storm drains & sidewalk paving",
    head_official: "Er. Priya Sharma",
    icon: "car",
    sla_hours: 48
  },
  {
    id: "dept_elec",
    name: "Electricity & Power Distribution",
    code: "ELEC",
    description: "Power breakdown, hazardous transformer sparking, live wires & streetlight maintenance",
    head_official: "Er. Rajesh Verma",
    icon: "zap",
    sla_hours: 12
  },
  {
    id: "dept_waste",
    name: "Municipal Solid Waste Management",
    code: "WASTE",
    description: "Garbage collection, community dumpster hygiene, bio-waste disposal & sanitation drives",
    head_official: "Dr. S. K. Nambiar",
    icon: "trash-2",
    sla_hours: 24
  },
  {
    id: "dept_health",
    name: "Public Health & Healthcare Services",
    code: "HEALTH",
    description: "Civic clinics, vector epidemic control, sanitation compliance & food safety inspection",
    head_official: "Dr. Ananya Roy",
    icon: "activity",
    sla_hours: 24
  },
  {
    id: "dept_police",
    name: "Traffic & Law Enforcement",
    code: "POLICE",
    description: "Traffic signal management, illegal commercial parking, encroachment & emergency lane clearance",
    head_official: "Insp. Vikram Singh",
    icon: "shield",
    sla_hours: 24
  }
];

const DEFAULT_PROFILES = [
  {
    id: "usr_citizen_1",
    email: "citizen@civic.gov",
    password: "CitizenSecure#2026",
    full_name: "Likith Sai",
    phone: "+91 98765 43210",
    role: "citizen",
    department_id: null,
    official_designation: null,
    district: "Central District",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "usr_citizen_2",
    email: "aarti.sharma@example.com",
    password: "CitizenSecure#2026",
    full_name: "Aarti Sharma",
    phone: "+91 98765 11223",
    role: "citizen",
    department_id: null,
    official_designation: null,
    district: "North Ward",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: "usr_official_water",
    email: "official.water@civic.gov",
    password: "GovOfficial#2026",
    full_name: "Er. Arvind Mehta",
    phone: "+91 91234 56789",
    role: "official",
    department_id: "dept_water",
    official_designation: "Superintending Engineer",
    district: "Central District",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_official_roads",
    email: "official.roads@civic.gov",
    password: "GovOfficial#2026",
    full_name: "Er. Priya Sharma",
    phone: "+91 91234 98765",
    role: "official",
    department_id: "dept_roads",
    official_designation: "Executive Engineer (PWD)",
    district: "South Ward",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_official_elec",
    email: "official.elec@civic.gov",
    password: "GovOfficial#2026",
    full_name: "Er. Rajesh Verma",
    phone: "+91 91234 44556",
    role: "official",
    department_id: "dept_elec",
    official_designation: "Chief Electrical Inspector",
    district: "East Ward",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_admin_1",
    email: "admin@civic.gov",
    password: "Secretariat#2026",
    full_name: "Dr. K. S. Murthy",
    phone: "+91 99999 88888",
    role: "admin",
    department_id: null,
    official_designation: "Chief Director, Grievance Secretariat",
    district: "Apex Secretariat",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

const DEFAULT_GRIEVANCES = [
  {
    id: "grv_001",
    tracking_id: "GRV-2026-9001",
    citizen_id: "usr_citizen_1",
    citizen_name: "Likith Sai",
    citizen_email: "citizen@civic.gov",
    citizen_phone: "+91 98765 43210",
    title: "Severe Drinking Water Pipe Leakage at 4th Cross Road",
    department_id: "dept_water",
    department_name: "Water Supply & Sewage Board",
    priority: "Urgent",
    location: "Opposite City Library, 4th Cross Road, Ward 12",
    district: "Central District",
    description: "Main supply pipeline has ruptured causing massive potable water loss and road flooding for the last 2 days. Commuters unable to use sidewalk.",
    image_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
    attachment_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80",
    status: "In Progress",
    assigned_official_id: "usr_official_water",
    assigned_official_name: "Er. Arvind Mehta",
    resolution_notes: "Field repair crew dispatched with heavy excavation gear. Replacement ductile iron pipeline segment installation underway.",
    resolved_at: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "grv_002",
    tracking_id: "GRV-2026-1002",
    citizen_id: "usr_citizen_1",
    citizen_name: "Likith Sai",
    citizen_email: "citizen@civic.gov",
    citizen_phone: "+91 98765 43210",
    title: "Deep Hazardous Potholes on Main Bus Transit Route",
    department_id: "dept_roads",
    department_name: "Public Works & Road Infrastructure",
    priority: "High",
    location: "Between Metro Pillar 140 to 148, Outer Ring Road",
    district: "Central District",
    description: "Multiple deep potholes spanning 200 meters. Caused 2 two-wheeler skids yesterday. High safety hazard during evening peak transit.",
    image_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    attachment_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    status: "Resolved",
    assigned_official_id: "usr_official_roads",
    assigned_official_name: "Er. Priya Sharma",
    resolution_notes: "Emergency cold-mix asphalt patch work and heavy bitumen overlay completed. Surface tested and cleared by Junior Engineer on duty.",
    resolved_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: "grv_003",
    tracking_id: "GRV-2026-1003",
    citizen_id: "usr_citizen_2",
    citizen_name: "Aarti Sharma",
    citizen_email: "aarti.sharma@example.com",
    citizen_phone: "+91 98765 11223",
    title: "High Voltage Streetlight Pole Sparking Dangerously",
    department_id: "dept_elec",
    department_name: "Electricity & Power Distribution",
    priority: "Urgent",
    location: "Near Community Health Center, North Gate Junction",
    district: "North Ward",
    description: "Streetlight pole #NL-44 has loose dangling live wires that emit loud sparks whenever wind blows. Direct threat to school children and patients.",
    image_url: "https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80",
    attachment_url: "https://images.unsplash.com/photo-1509390144018-eeaf65052242?auto=format&fit=crop&w=800&q=80",
    status: "Pending",
    assigned_official_id: null,
    assigned_official_name: null,
    resolution_notes: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 14 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: "grv_004",
    tracking_id: "GRV-2026-1004",
    citizen_id: "usr_citizen_2",
    citizen_name: "Aarti Sharma",
    citizen_email: "aarti.sharma@example.com",
    citizen_phone: "+91 98765 11223",
    title: "Sanitation Bin Overflowing & Foul Odor Near School",
    department_id: "dept_waste",
    department_name: "Municipal Solid Waste Management",
    priority: "Medium",
    location: "Market Square, Corner of Vegetable Yard",
    district: "North Ward",
    description: "Community bin has not been cleared for 4 consecutive days. Debris spilled across 50 meters attracting stray animals and severe pest infestation.",
    image_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    attachment_url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    status: "Resolved",
    assigned_official_id: null,
    assigned_official_name: "Dr. S. K. Nambiar",
    resolution_notes: "Sanitation compactor squad cleared 4 metric tons of accumulated refuse. Area disinfected with high-grade bleaching powder and scheduled for daily 6 AM sweep.",
    resolved_at: new Date(Date.now() - 4 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "grv_005",
    tracking_id: "GRV-2026-1005",
    citizen_id: "usr_citizen_1",
    citizen_name: "Likith Sai",
    citizen_email: "citizen@civic.gov",
    citizen_phone: "+91 98765 43210",
    title: "Illegal Commercial Trucks Blocking Fire Hydrant Access",
    department_id: "dept_police",
    department_name: "Traffic & Law Enforcement",
    priority: "Low",
    location: "Old Grain Market Alley #3, Sector 5",
    district: "Central District",
    description: "Private transport logistics vehicles parked permanently across marked fire hydrant access zones, creating severe fire hazard.",
    image_url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    attachment_url: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
    status: "Resolved",
    assigned_official_id: null,
    assigned_official_name: "Insp. Vikram Singh",
    resolution_notes: "Traffic squad deployed heavy hydraulic tow trucks. Vehicles removed to impound lot, penalty challans issued, and yellow cautionary bollards installed.",
    resolved_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

const DEFAULT_LOGS = [
  {
    id: "log_001",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-9001",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Likith Sai",
    performed_by_role: "Citizen",
    remarks: "Grievance officially lodged through citizen self-service portal with photo evidence.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "log_002",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-9001",
    action: "Official Assigned",
    previous_status: "Pending",
    new_status: "Pending",
    performed_by_name: "Grievance Secretariat",
    performed_by_role: "Admin",
    remarks: "Assigned to Er. Arvind Mehta (Water Supply & Sewage Board).",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "log_003",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-9001",
    action: "Status Updated",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Er. Arvind Mehta",
    performed_by_role: "Department Official",
    remarks: "Inspection complete. Field team deployed with ductile iron pipe segment.",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "log_004",
    grievance_id: "grv_002",
    tracking_id: "GRV-2026-1002",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Likith Sai",
    performed_by_role: "Citizen",
    remarks: "Pothole issue submitted with ward marker and photo evidence.",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: "log_005",
    grievance_id: "grv_002",
    tracking_id: "GRV-2026-1002",
    action: "Status Updated",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Er. Priya Sharma",
    performed_by_role: "Department Official",
    remarks: "Emergency asphalt patch work batch approved for immediate night repair.",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "log_006",
    grievance_id: "grv_002",
    tracking_id: "GRV-2026-1002",
    action: "Grievance Resolved",
    previous_status: "In Progress",
    new_status: "Resolved",
    performed_by_name: "Er. Priya Sharma",
    performed_by_role: "Department Official",
    remarks: "Road resurfaced and leveled. Quality inspection passed by Junior Engineer.",
    created_at: new Date(Date.now() - 6 * 3600000).toISOString()
  },
  {
    id: "log_007",
    grievance_id: "grv_003",
    tracking_id: "GRV-2026-1003",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Aarti Sharma",
    performed_by_role: "Citizen",
    remarks: "Hazardous electric wire sparking reported under Urgent priority.",
    created_at: new Date(Date.now() - 14 * 3600000).toISOString()
  },
  {
    id: "log_008",
    grievance_id: "grv_004",
    tracking_id: "GRV-2026-1004",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Aarti Sharma",
    performed_by_role: "Citizen",
    remarks: "Waste overflow complaint registered.",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "log_009",
    grievance_id: "grv_004",
    tracking_id: "GRV-2026-1004",
    action: "Status Updated",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Dr. S. K. Nambiar",
    performed_by_role: "Department Official",
    remarks: "Sanitation compactor squad routed to North Ward.",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "log_010",
    grievance_id: "grv_004",
    tracking_id: "GRV-2026-1004",
    action: "Grievance Resolved",
    previous_status: "In Progress",
    new_status: "Resolved",
    performed_by_name: "Dr. S. K. Nambiar",
    performed_by_role: "Department Official",
    remarks: "Refuse cleared and area sanitized with disinfectant.",
    created_at: new Date(Date.now() - 4 * 3600000).toISOString()
  },
  {
    id: "log_011",
    grievance_id: "grv_005",
    tracking_id: "GRV-2026-1005",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Likith Sai",
    performed_by_role: "Citizen",
    remarks: "Fire hydrant obstruction reported.",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "log_012",
    grievance_id: "grv_005",
    tracking_id: "GRV-2026-1005",
    action: "Official Assigned",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Grievance Secretariat",
    performed_by_role: "Admin",
    remarks: "Forwarded to Central Traffic Police Station.",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "log_013",
    grievance_id: "grv_005",
    tracking_id: "GRV-2026-1005",
    action: "Grievance Resolved",
    previous_status: "In Progress",
    new_status: "Resolved",
    performed_by_name: "Insp. Vikram Singh",
    performed_by_role: "Department Official",
    remarks: "Vehicles towed away, challans issued, cautionary bollards installed.",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

// ==============================================================================
// 3. REPOSITORY LAYER (Supabase First, In-Memory Cache, ZERO Quota Errors)
// ==============================================================================
/**
 * Note: To completely avoid browser localStorage quota limits,
 * NO datasets, binary files, or base64 strings are stored in localStorage.
 * Only the lightweight session string 'pgrrs_session' is persisted.
 */
class DataRepository {
  constructor() {
    this.memDepartments = [...DEFAULT_DEPARTMENTS];
    this.memProfiles = [...DEFAULT_PROFILES];
    this.memGrievances = [...DEFAULT_GRIEVANCES];
    this.memLogs = [...DEFAULT_LOGS];
  }

  async testSupabase() {
    if (!supabaseClient) return false;
    try {
      const { data, error } = await supabaseClient
        .from("departments")
        .select("id")
        .limit(1);
      
      if (!error) {
        isSupabaseOnline = true;
        return true;
      }
      return false;
    } catch (err) {
      console.warn("Supabase test connectivity warning:", err);
      return false;
    }
  }

  // --- Departments ---
  async getDepartments() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("departments")
          .select("*")
          .order("name", { ascending: true });
        if (!error && data && data.length > 0) {
          this.memDepartments = data;
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory departments:", err);
      }
    }
    return this.memDepartments;
  }

  // --- Profiles (Strict User Directory) ---
  async getProfileByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("email", cleanEmail)
          .single();
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory profile query:", err);
      }
    }
    return this.memProfiles.find(p => p.email.toLowerCase() === cleanEmail) || null;
  }

  async getOfficials() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("role", "official");
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory officials:", err);
      }
    }
    return this.memProfiles.filter(p => p.role === "official");
  }

  async createProfile(profileData) {
    if (supabaseClient) {
      try {
        // Attempt full insert
        const { data, error } = await supabaseClient
          .from("profiles")
          .insert([profileData])
          .select()
          .single();

        if (!error && data) {
          this.memProfiles.push(data);
          return { data, error: null };
        }

        // If duplicate email constraint
        if (error && error.code === "23505") {
          return { data: null, error: new Error("An account with this email address already exists.") };
        }

        // If schema cache column mismatch (e.g. password column missing in existing schema)
        if (error && error.code === "PGRST204") {
          console.warn("Retrying profile insert with compatible schema:", error);
          const compatiblePayload = {
            id: profileData.id,
            email: profileData.email,
            full_name: profileData.full_name,
            role: profileData.role,
            phone: profileData.phone
          };
          const retryRes = await supabaseClient
            .from("profiles")
            .insert([compatiblePayload])
            .select()
            .single();

          if (!retryRes.error && retryRes.data) {
            this.memProfiles.push(profileData);
            return { data: profileData, error: null };
          }
        }
      } catch (err) {
        console.warn("Supabase createProfile error, storing in runtime memory:", err);
      }
    }

    // In-memory fallback
    if (this.memProfiles.some(p => p.email.toLowerCase() === profileData.email.toLowerCase())) {
      return { data: null, error: new Error("An account with this email address already exists.") };
    }
    this.memProfiles.push(profileData);
    return { data: profileData, error: null };
  }

  // --- Grievances ---
  async getGrievances() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          this.memGrievances = data;
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory grievances:", err);
      }
    }
    return this.memGrievances;
  }

  async getGrievanceByTrackingId(trackingId) {
    const cleanId = trackingId.trim().toUpperCase();
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .select("*")
          .eq("tracking_id", cleanId)
          .single();
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory trackingId query:", err);
      }
    }
    return this.memGrievances.find(g => g.tracking_id.toUpperCase() === cleanId) || null;
  }

  async createGrievance(grievanceData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .insert([grievanceData])
          .select()
          .single();

        if (!error && data) {
          this.memGrievances.unshift(data);
          return data;
        }

        // If remote table is missing the image_url column in schema cache
        if (error && error.code === "PGRST204" && error.message.includes("image_url")) {
          console.warn("Remote table lacks image_url column. Retrying insert with compatible fields...");
          const fallbackData = { ...grievanceData };
          delete fallbackData.image_url;
          delete fallbackData.attachment_url;
          const retryRes = await supabaseClient
            .from("grievances")
            .insert([fallbackData])
            .select()
            .single();

          if (!retryRes.error && retryRes.data) {
            // Keep image_url on the memory object so user sees their photo
            const merged = { ...retryRes.data, image_url: grievanceData.image_url };
            this.memGrievances.unshift(merged);
            return merged;
          }
        }
        console.warn("Supabase insert returned error, saving in memory:", error);
      } catch (err) {
        console.warn("Supabase createGrievance error, saving in memory:", err);
      }
    }
    this.memGrievances.unshift(grievanceData);
    return grievanceData;
  }

  async updateGrievance(id, updates) {
    const updatedWithTime = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .update(updatedWithTime)
          .eq("id", id)
          .select()
          .single();

        if (!error && data) {
          const idx = this.memGrievances.findIndex(g => g.id === id);
          if (idx !== -1) {
            this.memGrievances[idx] = data;
          }
          return data;
        }
      } catch (err) {
        console.warn("Supabase updateGrievance fallback:", err);
      }
    }

    const idx = this.memGrievances.findIndex(g => g.id === id);
    if (idx !== -1) {
      this.memGrievances[idx] = { ...this.memGrievances[idx], ...updatedWithTime };
      return this.memGrievances[idx];
    }
    return null;
  }

  // --- Logs / Timeline Audit ---
  async getLogs(grievanceId) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievance_logs")
          .select("*")
          .eq("grievance_id", grievanceId)
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn("Using in-memory logs:", err);
      }
    }
    return this.memLogs
      .filter(l => l.grievance_id === grievanceId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  async addLog(logData) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("grievance_logs")
          .insert([logData])
          .select()
          .single();

        if (!error && data) {
          this.memLogs.push(data);
          return data;
        }
      } catch (err) {
        console.warn("Supabase addLog fallback:", err);
      }
    }
    this.memLogs.push(logData);
    return logData;
  }

  // --- Storage Bucket Direct Image Upload ---
  /**
   * CRITICAL STORAGE IMPLEMENTATION:
   * Uploads file directly to the Supabase Storage bucket named "images".
   * Returns ONLY the public URL string.
   * NEVER returns base64 or saves binary data into localStorage.
   */
  async uploadGrievanceImage(file, trackingId) {
    if (!file) return null;
    if (!supabaseClient) {
      throw new Error("Supabase client is not connected. Please check internet connection.");
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `${trackingId}_${Date.now()}.${cleanExt}`;

    // Direct upload to Supabase Storage bucket 'images' using the Supabase client
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true
      });

    if (uploadError) {
      console.error("Supabase Storage bucket upload error:", uploadError);
      throw new Error(`Supabase Storage upload failed: ${uploadError.message}. Ensure bucket 'images' exists in Supabase Storage with public access enabled.`);
    }

    // Fetch the public URL using getPublicUrl
    const { data: urlData } = supabaseClient.storage
      .from("images")
      .getPublicUrl(fileName);

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Could not retrieve public URL from Supabase Storage.");
    }

    // Return ONLY the public URL text string
    return urlData.publicUrl;
  }
}

const db = new DataRepository();

// ==============================================================================
// 4. GLOBAL APPLICATION STATE
// ==============================================================================
const state = {
  currentView: "home",
  currentUser: null, // { id, email, full_name, role, phone, department_id, official_designation, district }
  departments: [],
  officials: [],
  grievances: [],
  selectedFile: null,
  activeTrackingGrievance: null,
  activeUpdateGrievanceId: null
};

// ==============================================================================
// 5. HELPER UTILITIES
// ==============================================================================
function generateTrackingId() {
  const year = 2026;
  const seq = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${seq}`;
}

function formatDate(isoString) {
  if (!isoString) return "N/A";
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (e) {
    return isoString;
  }
}

function maskName(name) {
  if (!name) return "Anonymous Citizen";
  const parts = name.trim().split(" ");
  return parts
    .map(p => (p.length > 1 ? `${p[0]}${"*".repeat(p.length - 1)}` : p))
    .join(" ");
}

function getStatusBadgeHtml(status) {
  const map = {
    Pending: {
      text: "Pending Review",
      cls: "badge-status-pending"
    },
    "In Progress": {
      text: "In Progress (Field Action)",
      cls: "badge-status-inprogress"
    },
    Resolved: {
      text: "Resolved & Verified",
      cls: "badge-status-resolved"
    },
    Rejected: {
      text: "Rejected / Closed",
      cls: "badge-status-rejected"
    }
  };
  const c = map[status] || { text: status, cls: "bg-slate-100 text-slate-800" };
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${c.cls}">${c.text}</span>`;
}

function getPriorityBadgeHtml(priority) {
  const map = {
    Urgent: {
      cls: "badge-priority-urgent",
      label: "Urgent (24h SLA)"
    },
    High: {
      cls: "badge-priority-high",
      label: "High (48h SLA)"
    },
    Medium: {
      cls: "badge-priority-medium",
      label: "Medium"
    },
    Low: {
      cls: "badge-priority-low",
      label: "Low"
    }
  };
  const c = map[priority] || { cls: "bg-slate-100 text-slate-700", label: priority };
  return `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold ${c.cls}">${c.label}</span>`;
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgClass =
    type === "success"
      ? "bg-slate-900 border-l-4 border-emerald-500 text-white"
      : type === "error"
      ? "bg-slate-900 border-l-4 border-rose-500 text-white"
      : "bg-slate-900 border-l-4 border-amber-500 text-white";

  toast.className = `p-4 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold pointer-events-auto flex items-center space-x-3 transition-all transform duration-300 translate-y-2 opacity-0 max-w-sm ${bgClass}`;

  const icon =
    type === "success"
      ? `<svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`
      : type === "error"
      ? `<svg class="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`
      : `<svg class="w-5 h-5 text-amber-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.innerHTML = `
    ${icon}
    <div class="flex-1 leading-snug">${message}</div>
    <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white font-bold ml-2 text-sm">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

function triggerConfetti() {
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d97706", "#b91c1c", "#059669", "#ffffff"]
    });
  }
}

// ==============================================================================
// 6. INITIALIZATION & SESSION RESTORATION
// ==============================================================================
async function initApp() {
  // CRITICAL QUOTA FIX: Purge any legacy datasets from localStorage
  try {
    localStorage.removeItem("pgrrs_grievances");
    localStorage.removeItem("pgrrs_departments");
    localStorage.removeItem("pgrrs_profiles");
    localStorage.removeItem("pgrrs_logs");
  } catch (e) {
    console.warn("Storage cleanup notice:", e);
  }

  // Restore lightweight user session only
  const savedSession = localStorage.getItem("pgrrs_session");
  if (savedSession) {
    try {
      state.currentUser = JSON.parse(savedSession);
    } catch (e) {
      state.currentUser = null;
    }
  }

  // Test Supabase connection
  const online = await db.testSupabase();
  updateSupabaseStatusBadge(online);

  // Load initial data
  await refreshData();

  // Setup UI Listeners
  setupEventListeners();
  setupFileDropzone();

  // Render Navigation & Initial View
  renderNavigation();
  navigate("home");
}

async function refreshData() {
  state.departments = await db.getDepartments();
  state.officials = await db.getOfficials();
  state.grievances = await db.getGrievances();

  populateDepartmentDropdowns();
  renderHomeStats();
  renderArchiveFeed();

  if (state.currentUser) {
    if (state.currentUser.role === "citizen") {
      renderCitizenGrievances();
    } else {
      renderAdminDashboard();
    }
  }
}

function updateSupabaseStatusBadge(online) {
  const el = document.getElementById("supabase-status-indicator");
  if (!el) return;

  if (online) {
    el.innerHTML = `
      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-emerald-950/80 text-emerald-300 border border-emerald-800">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
        Supabase Cloud Connected
      </span>
    `;
  } else {
    el.innerHTML = `
      <span class="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-700">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5"></span>
        Supabase Offline (Dual Sync Fallback Active)
      </span>
    `;
  }
}

function populateDepartmentDropdowns() {
  const fileSelect = document.getElementById("grievance-department");
  if (fileSelect) {
    fileSelect.innerHTML = state.departments
      .map(d => `<option value="${d.id}">${d.name} (${d.sla_hours}h SLA)</option>`)
      .join("");
  }

  const signupDept = document.getElementById("signup-department");
  if (signupDept) {
    signupDept.innerHTML = state.departments
      .map(d => `<option value="${d.id}">${d.name}</option>`)
      .join("");
  }

  const filterDept = document.getElementById("filter-department");
  if (filterDept) {
    const currentVal = filterDept.value || "all";
    filterDept.innerHTML = `<option value="all">All Departments</option>` +
      state.departments
        .map(d => `<option value="${d.id}">${d.name}</option>`)
        .join("");
    filterDept.value = currentVal;
  }

  const archiveDept = document.getElementById("archive-dept-filter");
  if (archiveDept) {
    const currentVal = archiveDept.value || "all";
    archiveDept.innerHTML = `<option value="all">All Civic Boards</option>` +
      state.departments
        .map(d => `<option value="${d.id}">${d.name}</option>`)
        .join("");
    archiveDept.value = currentVal;
  }
}

// ==============================================================================
// 7. NAVIGATION & ROUTING
// ==============================================================================
function navigate(viewName) {
  // Guard protected citizen views
  if (viewName === "file-grievance" || viewName === "my-grievances") {
    if (!state.currentUser) {
      showToast("Please authenticate as a registered citizen to continue.", "info");
      openAuthModal("signin");
      return;
    }
  }

  // Guard protected official/admin views
  if (viewName === "dashboard") {
    if (!state.currentUser || (state.currentUser.role !== "official" && state.currentUser.role !== "admin")) {
      showToast("Access restricted to authorized Department Officials & Admins.", "error");
      openAuthModal("signin");
      return;
    }
  }

  state.currentView = viewName;

  const views = [
    "view-home",
    "view-file-grievance",
    "view-my-grievances",
    "view-dashboard",
    "view-archive",
    "view-public-track"
  ];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(`view-${viewName}`);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Update active state in navbar
  document.querySelectorAll("[data-nav-target]").forEach(a => {
    const isCurrent = a.getAttribute("data-nav-target") === viewName;
    if (isCurrent) {
      a.classList.add("text-amber-400", "border-amber-400");
      a.classList.remove("text-slate-200", "border-transparent");
    } else {
      a.classList.remove("text-amber-400", "border-amber-400");
      a.classList.add("text-slate-200", "border-transparent");
    }
  });

  if (viewName === "home") {
    renderHomeStats();
  } else if (viewName === "my-grievances") {
    renderCitizenGrievances();
  } else if (viewName === "dashboard") {
    renderAdminDashboard();
  } else if (viewName === "archive") {
    renderArchiveFeed();
  }

  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileMenu) mobileMenu.classList.add("hidden");
}

function handleLodgeGrievanceClick() {
  if (!state.currentUser) {
    showToast("Please sign in or register to lodge an official grievance.", "info");
    openAuthModal("signin");
  } else if (state.currentUser.role === "citizen") {
    navigate("file-grievance");
  } else {
    showToast("You are logged in as an Official/Admin. Switch to a citizen account to lodge personal grievances.", "info");
  }
}

function renderNavigation() {
  const loggedOutNav = document.getElementById("nav-logged-out");
  const loggedInNav = document.getElementById("nav-logged-in");
  const mobileAuthOut = document.getElementById("mobile-auth-logged-out");
  const mobileAuthIn = document.getElementById("mobile-auth-logged-in");

  const citizenNavs = document.querySelectorAll(".nav-link-citizen");
  const officialNavs = document.querySelectorAll(".nav-link-official");

  if (state.currentUser) {
    if (loggedOutNav) loggedOutNav.classList.add("hidden");
    if (loggedInNav) loggedInNav.classList.remove("hidden");
    if (mobileAuthOut) mobileAuthOut.classList.add("hidden");
    if (mobileAuthIn) mobileAuthIn.classList.remove("hidden");

    const nameEl = document.getElementById("nav-user-name");
    const roleLabel = document.getElementById("nav-user-role-label");
    const roleBadge = document.getElementById("nav-role-badge");

    const mNameEl = document.getElementById("mobile-nav-user-name");
    const mRoleEl = document.getElementById("mobile-nav-user-role");

    if (nameEl) nameEl.textContent = state.currentUser.full_name;
    if (mNameEl) mNameEl.textContent = state.currentUser.full_name;

    const roleUpper = state.currentUser.role.toUpperCase();
    if (roleLabel) {
      if (state.currentUser.role === "official") {
        const d = state.departments.find(dep => dep.id === state.currentUser.department_id);
        roleLabel.textContent = `Official • ${d ? d.code : "Dept"}`;
      } else if (state.currentUser.role === "admin") {
        roleLabel.textContent = "Apex Administrator";
      } else {
        roleLabel.textContent = "Registered Citizen";
      }
    }

    if (mRoleEl) mRoleEl.textContent = roleUpper;

    if (roleBadge) {
      if (state.currentUser.role === "admin") {
        roleBadge.innerHTML = `<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-900/60 text-red-300 border border-red-700">ADMIN</span>`;
      } else if (state.currentUser.role === "official") {
        roleBadge.innerHTML = `<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-900/60 text-amber-300 border border-amber-700">OFFICIAL</span>`;
      } else {
        roleBadge.innerHTML = `<span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-900/60 text-emerald-300 border border-emerald-700">CITIZEN</span>`;
      }
    }

    if (state.currentUser.role === "citizen") {
      citizenNavs.forEach(el => el.classList.remove("hidden"));
      officialNavs.forEach(el => el.classList.add("hidden"));
    } else {
      citizenNavs.forEach(el => el.classList.add("hidden"));
      officialNavs.forEach(el => el.classList.remove("hidden"));
    }
  } else {
    if (loggedOutNav) loggedOutNav.classList.remove("hidden");
    if (loggedInNav) loggedInNav.classList.add("hidden");
    if (mobileAuthOut) mobileAuthOut.classList.remove("hidden");
    if (mobileAuthIn) mobileAuthIn.classList.add("hidden");

    citizenNavs.forEach(el => el.classList.add("hidden"));
    officialNavs.forEach(el => el.classList.add("hidden"));
  }
}

// ==============================================================================
// 8. STRICT AUTHENTICATION (NO QUICK DEMO SHORTCUTS)
// ==============================================================================
function openAuthModal(tab = "signin") {
  const modal = document.getElementById("auth-modal");
  if (!modal) return;
  modal.classList.remove("hidden");
  switchAuthTab(tab);
}

function closeAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) modal.classList.add("hidden");
}

function switchAuthTab(tab) {
  const signinForm = document.getElementById("auth-signin-form");
  const signupForm = document.getElementById("auth-signup-form");
  const tabSigninBtn = document.getElementById("tab-signin-btn");
  const tabSignupBtn = document.getElementById("tab-signup-btn");

  if (tab === "signin") {
    signinForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    tabSigninBtn.className = "flex-1 py-3 text-xs font-black uppercase tracking-wider text-amber-600 border-b-2 border-amber-500";
    tabSignupBtn.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 border-b-2 border-transparent";
  } else {
    signinForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    tabSignupBtn.className = "flex-1 py-3 text-xs font-black uppercase tracking-wider text-amber-600 border-b-2 border-amber-500";
    tabSigninBtn.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 border-b-2 border-transparent";
  }
}

async function handleSignIn(email, password) {
  const submitBtn = document.getElementById("signin-submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Authenticating with Profiles...`;
  }

  try {
    const user = await db.getProfileByEmail(email);

    if (!user) {
      showToast("No verified profile matches this email. Please register.", "error");
      return;
    }

    if (user.password && user.password !== password) {
      showToast("Authentication failed: Incorrect password.", "error");
      return;
    }

    // Success Authentication: Save ONLY lightweight session variables to localStorage
    state.currentUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      department_id: user.department_id,
      official_designation: user.official_designation,
      district: user.district
    };

    localStorage.setItem(
      "pgrrs_session",
      JSON.stringify({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        department_id: user.department_id,
        district: user.district
      })
    );

    showToast(`Welcome, ${state.currentUser.full_name}! (${state.currentUser.role.toUpperCase()})`, "success");
    closeAuthModal();

    renderNavigation();

    // Strict Role-Based Dynamic Routing
    if (state.currentUser.role === "citizen") {
      navigate("my-grievances");
    } else {
      navigate("dashboard");
    }
  } catch (err) {
    showToast(err.message || "Failed to authenticate.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Authenticate & Sign In";
    }
  }
}

async function handleSignUp(userData) {
  const submitBtn = document.getElementById("signup-submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Registering Profile in Supabase...`;
  }

  try {
    if (userData.password.length < 8) {
      showToast("Password must be at least 8 characters long.", "error");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    const newProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      full_name: userData.full_name.trim(),
      phone: userData.phone.trim(),
      role: userData.role,
      department_id: userData.role === "official" ? userData.department_id : null,
      official_designation: userData.role === "official" ? userData.official_designation : null,
      district: userData.district.trim(),
      created_at: new Date().toISOString()
    };

    const { data, error } = await db.createProfile(newProfile);
    if (error) {
      showToast(error.message, "error");
      return;
    }

    state.currentUser = {
      id: newProfile.id,
      email: newProfile.email,
      full_name: newProfile.full_name,
      role: newProfile.role,
      phone: newProfile.phone,
      department_id: newProfile.department_id,
      official_designation: newProfile.official_designation,
      district: newProfile.district
    };

    // Store ONLY lightweight session
    localStorage.setItem(
      "pgrrs_session",
      JSON.stringify({
        id: newProfile.id,
        email: newProfile.email,
        full_name: newProfile.full_name,
        role: newProfile.role,
        department_id: newProfile.department_id,
        district: newProfile.district
      })
    );

    showToast("Profile successfully created and authenticated!", "success");
    closeAuthModal();

    await refreshData();
    renderNavigation();

    if (state.currentUser.role === "citizen") {
      navigate("file-grievance");
    } else {
      navigate("dashboard");
    }
  } catch (err) {
    showToast(err.message || "Registration failed.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Verified Profile";
    }
  }
}

function handleSignOut() {
  state.currentUser = null;
  localStorage.removeItem("pgrrs_session");
  showToast("You have been signed out.", "info");
  renderNavigation();
  navigate("home");
}

// ==============================================================================
// 9. PHOTO DROPZONE & PREVIEW
// ==============================================================================
function setupFileDropzone() {
  const dropzone = document.getElementById("dropzone-area");
  const fileInput = document.getElementById("grievance-file-input");
  const emptyState = document.getElementById("dropzone-empty-state");
  const previewState = document.getElementById("dropzone-preview-state");
  const previewImg = document.getElementById("file-preview-img");
  const previewName = document.getElementById("file-preview-name");
  const previewSize = document.getElementById("file-preview-size");
  const removeBtn = document.getElementById("btn-remove-file");

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener("click", () => fileInput.click());

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  });

  if (removeBtn) {
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.selectedFile = null;
      fileInput.value = "";
      emptyState.classList.remove("hidden");
      previewState.classList.add("hidden");
    });
  }

  function handleSelectedFile(file) {
    if (file.size > 10 * 1024 * 1024) {
      showToast("File size exceeds 10MB limit. Please choose a smaller image.", "error");
      return;
    }

    state.selectedFile = file;
    emptyState.classList.add("hidden");
    previewState.classList.remove("hidden");

    if (previewName) previewName.textContent = file.name;
    if (previewSize) previewSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;

    // Local thumbnail preview via temporary Object URL (NOT saved to localStorage)
    if (file.type.startsWith("image/")) {
      const objUrl = URL.createObjectURL(file);
      if (previewImg) previewImg.src = objUrl;
    }
  }
}

// ==============================================================================
// 10. CITIZEN GRIEVANCE SUBMISSION (Direct Supabase Storage Bucket Upload)
// ==============================================================================
async function handleGrievanceSubmit(e) {
  e.preventDefault();
  if (!state.currentUser) {
    showToast("You must be signed in as a Citizen to lodge a grievance.", "error");
    openAuthModal("signin");
    return;
  }

  const title = document.getElementById("grievance-title").value.trim();
  const departmentId = document.getElementById("grievance-department").value;
  const priority = document.getElementById("grievance-priority").value;
  const district = document.getElementById("grievance-district").value.trim();
  const location = document.getElementById("grievance-location").value.trim();
  const description = document.getElementById("grievance-description").value.trim();

  if (!title || !departmentId || !priority || !location || !description) {
    showToast("Please fill in all mandatory fields marked with *", "error");
    return;
  }

  const dept = state.departments.find(d => d.id === departmentId);
  const departmentName = dept ? dept.name : "Civic Department";
  const trackingId = generateTrackingId();
  const grievanceId = `grv_${Date.now()}`;

  const submitBtn = document.getElementById("submit-grievance-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Uploading Evidence to Supabase Storage & Registering...`;
  }

  try {
    // 1. Direct upload to Supabase Storage bucket 'images' (fetches ONLY the public URL string)
    let uploadedImageUrl = null;
    if (state.selectedFile) {
      try {
        uploadedImageUrl = await db.uploadGrievanceImage(state.selectedFile, trackingId);
      } catch (uploadErr) {
        showToast(uploadErr.message, "error");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "Submit Official Grievance";
        }
        return;
      }
    }

    // 2. Prepare Grievance Payload saving ONLY the public URL string in image_url
    const newGrievance = {
      id: grievanceId,
      tracking_id: trackingId,
      citizen_id: state.currentUser.id,
      citizen_name: state.currentUser.full_name,
      citizen_email: state.currentUser.email,
      citizen_phone: state.currentUser.phone || "+91 98765 00000",
      title,
      department_id: departmentId,
      department_name: departmentName,
      priority,
      district: district || state.currentUser.district || "Central District",
      location,
      description,
      image_url: uploadedImageUrl,
      attachment_url: uploadedImageUrl,
      status: "Pending",
      assigned_official_id: null,
      assigned_official_name: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // 3. Save Grievance in Supabase
    const saved = await db.createGrievance(newGrievance);

    // 4. Append Initial Lifecycle Log into Supabase grievance_logs
    const initialLog = {
      id: `log_${Date.now()}`,
      grievance_id: saved.id,
      tracking_id: saved.tracking_id,
      action: "Grievance Registered",
      previous_status: null,
      new_status: "Pending",
      performed_by_name: state.currentUser.full_name,
      performed_by_role: "Citizen",
      remarks: "Grievance officially registered through Citizen Portal with photographic evidence.",
      created_at: new Date().toISOString()
    };
    await db.addLog(initialLog);

    // 5. Trigger celebration & reset form
    triggerConfetti();
    document.getElementById("form-file-grievance").reset();
    state.selectedFile = null;
    const emptyState = document.getElementById("dropzone-empty-state");
    const previewState = document.getElementById("dropzone-preview-state");
    if (emptyState) emptyState.classList.remove("hidden");
    if (previewState) previewState.classList.add("hidden");

    await refreshData();

    // 6. Display Acknowledgement Voucher
    showReceiptModal(saved);
  } catch (err) {
    showToast(err.message || "Failed to register grievance.", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Official Grievance";
    }
  }
}

// ==============================================================================
// 11. ACKNOWLEDGEMENT RECEIPT VOUCHER
// ==============================================================================
function showReceiptModal(grievance) {
  const modal = document.getElementById("receipt-modal");
  if (!modal) return;

  document.getElementById("receipt-tracking-id").textContent = grievance.tracking_id;
  document.getElementById("receipt-citizen-name").textContent = grievance.citizen_name;
  document.getElementById("receipt-date").textContent = formatDate(grievance.created_at);
  document.getElementById("receipt-department").textContent = grievance.department_name;
  document.getElementById("receipt-priority").innerHTML = getPriorityBadgeHtml(grievance.priority);
  document.getElementById("receipt-location").textContent = `${grievance.location}, ${grievance.district}`;
  document.getElementById("receipt-title").textContent = grievance.title;

  modal.classList.remove("hidden");
}

function closeReceiptModal() {
  const modal = document.getElementById("receipt-modal");
  if (modal) modal.classList.add("hidden");
  navigate("my-grievances");
}

// ==============================================================================
// 12. CITIZEN DASHBOARD ("My Grievances")
// ==============================================================================
function renderCitizenGrievances() {
  if (!state.currentUser) return;

  const container = document.getElementById("citizen-grievances-list");
  if (!container) return;

  const myGrievances = state.grievances.filter(
    g => g.citizen_id === state.currentUser.id || g.citizen_email === state.currentUser.email
  );

  const total = myGrievances.length;
  const pending = myGrievances.filter(g => g.status === "Pending" || g.status === "In Progress").length;
  const resolved = myGrievances.filter(g => g.status === "Resolved").length;

  const totalEl = document.getElementById("citizen-total-count");
  const pendingEl = document.getElementById("citizen-pending-count");
  const resolvedEl = document.getElementById("citizen-resolved-count");

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (resolvedEl) resolvedEl.textContent = resolved;

  if (myGrievances.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center space-y-4">
        <div class="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border border-amber-200">
          📝
        </div>
        <h3 class="text-base font-bold text-slate-800">No Grievances Registered Yet</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto">
          You have not submitted any civic grievances yet. If you have an issue with water, roads, power, or sanitation, lodge a grievance below.
        </p>
        <button onclick="navigate('file-grievance')" class="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition">
          Lodge Your First Grievance
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = myGrievances
    .map(g => {
      const hasPhoto = g.image_url || g.attachment_url;
      return `
        <div class="bg-white rounded-2xl border-2 border-slate-200 p-5 sm:p-6 hover:border-amber-400 transition shadow-sm space-y-4">
          <div class="flex flex-wrap justify-between items-start gap-3">
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-xs font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ${g.tracking_id}
                </span>
                <span class="text-xs text-slate-400 font-medium">${formatDate(g.created_at)}</span>
              </div>
              <h3 class="text-base font-black text-slate-900 mt-1.5 font-emblem">${g.title}</h3>
              <p class="text-xs text-slate-500 mt-0.5">
                <strong>Department:</strong> ${g.department_name} • <strong>Location:</strong> ${g.location}, ${g.district}
              </p>
            </div>

            <div class="flex items-center gap-2">
              ${getStatusBadgeHtml(g.status)}
              ${getPriorityBadgeHtml(g.priority)}
            </div>
          </div>

          <p class="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
            ${g.description}
          </p>

          ${
            hasPhoto
              ? `
            <div class="flex items-center space-x-3 pt-1">
              <img src="${hasPhoto}" alt="Evidence thumbnail" class="w-12 h-12 rounded-lg object-cover border border-slate-200 cursor-pointer shadow-sm hover:scale-105 transition" onclick="zoomImage('${hasPhoto}')" />
              <div class="text-[11px] text-slate-500">
                <span class="font-bold text-slate-700">Attached Photographic Evidence</span> (Stored in Supabase: images)
              </div>
            </div>
          `
              : ""
          }

          ${
            g.resolution_notes
              ? `
            <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-slate-800 space-y-1">
              <div class="font-bold text-emerald-800 uppercase text-[10px] flex items-center">
                ✓ Official Action Report:
              </div>
              <p class="italic">${g.resolution_notes}</p>
            </div>
          `
              : ""
          }

          <div class="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
            <div class="text-slate-500 text-[11px]">
              Assigned Official: <strong>${g.assigned_official_name || "Grievance Intake Desk"}</strong>
            </div>
            <div class="flex items-center space-x-2">
              <button onclick="showReceiptModal(${JSON.stringify(g).replace(/"/g, "&quot;")})" class="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-[11px] transition">
                Print Slip
              </button>
              <button onclick="openTimelineModal('${g.id}')" class="px-3.5 py-1.5 rounded-lg bg-gov-navy-900 hover:bg-gov-navy-950 text-white font-bold text-[11px] transition">
                View Timeline History
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

// ==============================================================================
// 13. DEPARTMENT OFFICIAL & ADMIN DASHBOARD
// ==============================================================================
function renderAdminDashboard() {
  if (!state.currentUser) return;

  const tableBody = document.getElementById("admin-grievances-table-body");
  if (!tableBody) return;

  const deptBanner = document.getElementById("official-dept-banner");
  if (deptBanner) {
    if (state.currentUser.role === "official") {
      const d = state.departments.find(dep => dep.id === state.currentUser.department_id);
      deptBanner.innerHTML = `Logged in as: <strong class="text-white">${state.currentUser.full_name}</strong> • Allocated Department: <strong class="text-amber-400">${d ? d.name : "Civic Board"}</strong> (${state.currentUser.official_designation || "Executive Officer"})`;
      deptBanner.classList.remove("hidden");
    } else {
      deptBanner.innerHTML = `Logged in as: <strong class="text-white">${state.currentUser.full_name}</strong> • <strong class="text-amber-400">Apex Administrative Directorate</strong> (Complete Multi-Department Access)`;
      deptBanner.classList.remove("hidden");
    }
  }

  const deptFilter = document.getElementById("filter-department").value;
  const statusFilter = document.getElementById("filter-status").value;
  const priorityFilter = document.getElementById("filter-priority").value;
  const searchKeyword = (document.getElementById("filter-search").value || "").toLowerCase().trim();

  let baseList = state.grievances;
  if (state.currentUser.role === "official" && state.currentUser.department_id) {
    const filterDeptEl = document.getElementById("filter-department");
    if (filterDeptEl && filterDeptEl.value === "all") {
      filterDeptEl.value = state.currentUser.department_id;
    }
  }

  const filtered = baseList.filter(g => {
    if (deptFilter !== "all" && g.department_id !== deptFilter) return false;
    if (statusFilter !== "all" && g.status !== statusFilter) return false;
    if (priorityFilter !== "all" && g.priority !== priorityFilter) return false;
    if (searchKeyword) {
      const targetStr = `${g.tracking_id} ${g.title} ${g.citizen_name} ${g.location} ${g.district} ${g.description}`.toLowerCase();
      if (!targetStr.includes(searchKeyword)) return false;
    }
    return true;
  });

  const total = baseList.length;
  const pending = baseList.filter(g => g.status === "Pending").length;
  const inProgress = baseList.filter(g => g.status === "In Progress").length;
  const resolved = baseList.filter(g => g.status === "Resolved").length;
  const rejected = baseList.filter(g => g.status === "Rejected").length;
  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  document.getElementById("metric-total").textContent = total;
  document.getElementById("metric-pending").textContent = pending;
  document.getElementById("metric-inprogress").textContent = inProgress;
  document.getElementById("metric-resolved").textContent = resolved;
  document.getElementById("metric-rejected").textContent = rejected;
  document.getElementById("metric-rate").textContent = `${rate}%`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-12 text-center text-slate-400">
          No citizen grievance records match the current filter query.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered
    .map(g => {
      return `
      <tr class="hover:bg-slate-50/80 transition">
        <td class="px-4 py-3.5 whitespace-nowrap">
          <span class="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            ${g.tracking_id}
          </span>
          <div class="text-[10px] text-slate-400 mt-1">${formatDate(g.created_at)}</div>
        </td>
        <td class="px-4 py-3.5 max-w-xs">
          <div class="font-bold text-slate-900 truncate" title="${g.title}">${g.title}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">${g.citizen_name} • <span class="font-mono">${g.citizen_phone || ""}</span></div>
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap">
          <span class="text-xs font-bold text-slate-800">${g.department_name}</span>
          <div class="text-[10px] text-slate-400">${g.district}</div>
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap">
          ${getPriorityBadgeHtml(g.priority)}
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap">
          ${getStatusBadgeHtml(g.status)}
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap text-slate-600">
          <div class="font-semibold text-slate-800 text-[11px]">${g.assigned_official_name || "Unassigned"}</div>
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap text-right space-x-1">
          <button onclick="openUpdateModal('${g.id}')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition">
            Take Action
          </button>
          <button onclick="openTimelineModal('${g.id}')" class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] rounded-lg transition" title="Inspect Timeline">
            Logs
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function openUpdateModal(grievanceId) {
  const g = state.grievances.find(item => item.id === grievanceId);
  if (!g) return;

  state.activeUpdateGrievanceId = grievanceId;

  document.getElementById("modal-update-tracking-id").textContent = g.tracking_id;
  document.getElementById("modal-update-title").textContent = g.title;
  document.getElementById("modal-update-dept").textContent = g.department_name;
  document.getElementById("modal-update-citizen").textContent = `${g.citizen_name} (${g.citizen_email})`;
  document.getElementById("modal-update-location").textContent = `${g.location}, ${g.district}`;
  document.getElementById("modal-update-description").textContent = `"${g.description}"`;

  document.getElementById("update-status-select").value = g.status;
  document.getElementById("update-resolution-notes").value = g.resolution_notes || "";

  const officialSelect = document.getElementById("update-assigned-official");
  if (officialSelect) {
    const deptOfficials = state.officials.filter(
      o => !o.department_id || o.department_id === g.department_id
    );

    officialSelect.innerHTML =
      `<option value="">-- Leave Unassigned / Intake Pool --</option>` +
      deptOfficials
        .map(
          o =>
            `<option value="${o.id}" ${o.id === g.assigned_official_id ? "selected" : ""}>${o.full_name} (${o.official_designation || "Officer"})</option>`
        )
        .join("");
  }

  const modal = document.getElementById("update-grievance-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeUpdateModal() {
  const modal = document.getElementById("update-grievance-modal");
  if (modal) modal.classList.add("hidden");
  state.activeUpdateGrievanceId = null;
}

async function handleSaveGrievanceUpdate() {
  if (!state.activeUpdateGrievanceId) return;

  const g = state.grievances.find(item => item.id === state.activeUpdateGrievanceId);
  if (!g) return;

  const newStatus = document.getElementById("update-status-select").value;
  const assignedOfficialId = document.getElementById("update-assigned-official").value || null;
  const resolutionNotes = document.getElementById("update-resolution-notes").value.trim();

  let assignedOfficialName = g.assigned_official_name;
  if (assignedOfficialId) {
    const officialObj = state.officials.find(o => o.id === assignedOfficialId);
    assignedOfficialName = officialObj ? officialObj.full_name : null;
  }

  const updates = {
    status: newStatus,
    assigned_official_id: assignedOfficialId,
    assigned_official_name: assignedOfficialName,
    resolution_notes: resolutionNotes || g.resolution_notes,
    resolved_at: newStatus === "Resolved" ? new Date().toISOString() : g.resolved_at
  };

  const saveBtn = document.getElementById("btn-save-grievance-update");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Saving & Logging...`;
  }

  try {
    await db.updateGrievance(g.id, updates);

    let actionDesc = "Status Updated";
    if (newStatus === "Resolved") actionDesc = "Grievance Resolved";
    else if (newStatus === "Rejected") actionDesc = "Grievance Rejected";
    else if (assignedOfficialName && assignedOfficialName !== g.assigned_official_name) actionDesc = "Official Assigned";

    const logEntry = {
      id: `log_${Date.now()}`,
      grievance_id: g.id,
      tracking_id: g.tracking_id,
      action: actionDesc,
      previous_status: g.status,
      new_status: newStatus,
      performed_by_name: state.currentUser.full_name,
      performed_by_role: state.currentUser.role === "admin" ? "Administrative Officer" : "Department Official",
      remarks: resolutionNotes || `Status updated from ${g.status} to ${newStatus}.`,
      created_at: new Date().toISOString()
    };
    await db.addLog(logEntry);

    showToast(`Docket ${g.tracking_id} updated successfully and audit log saved!`, "success");
    closeUpdateModal();
    await refreshData();
  } catch (err) {
    showToast(err.message || "Failed to update grievance.", "error");
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Action & Append Audit Log";
    }
  }
}

// ==============================================================================
// 14. TIMELINE AUDIT MODAL (grievance_logs)
// ==============================================================================
async function openTimelineModal(grievanceId) {
  const g = state.grievances.find(item => item.id === grievanceId);
  if (!g) return;

  const modal = document.getElementById("timeline-modal");
  if (!modal) return;

  document.getElementById("modal-timeline-tracking-id").textContent = g.tracking_id;
  document.getElementById("modal-timeline-title").textContent = g.title;
  document.getElementById("modal-timeline-dept").textContent = g.department_name;
  document.getElementById("modal-timeline-citizen").textContent = maskName(g.citizen_name);
  document.getElementById("modal-timeline-location").textContent = `${g.location}, ${g.district}`;
  document.getElementById("modal-timeline-desc").textContent = `"${g.description}"`;

  document.getElementById("modal-timeline-status-badge").innerHTML = getStatusBadgeHtml(g.status);
  document.getElementById("modal-timeline-priority-badge").innerHTML = getPriorityBadgeHtml(g.priority);

  const container = document.getElementById("timeline-logs-container");
  container.innerHTML = `<div class="text-center py-4 text-xs text-slate-400">Loading verified timeline from grievance_logs...</div>`;

  modal.classList.remove("hidden");

  const logs = await db.getLogs(g.id);

  if (logs.length === 0) {
    container.innerHTML = `<div class="text-center py-6 text-xs text-slate-400">No logs found for this docket.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="relative pl-6 space-y-6">
      ${logs
        .map((log, index) => {
          const isLast = index === logs.length - 1;
          const statusCls =
            log.new_status === "Resolved"
              ? "bg-emerald-500"
              : log.new_status === "In Progress"
              ? "bg-sky-500"
              : log.new_status === "Rejected"
              ? "bg-rose-500"
              : "bg-amber-500";

          return `
            <div class="timeline-item relative">
              ${!isLast ? `<div class="timeline-stem"></div>` : ""}
              <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${statusCls} border-2 border-white shadow"></div>
              
              <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-slate-900">${log.action}</span>
                  <span class="text-[10px] text-slate-400 font-mono">${formatDate(log.created_at)}</span>
                </div>
                <div class="text-slate-600">
                  By: <strong class="text-slate-800">${log.performed_by_name}</strong> 
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">${log.performed_by_role}</span>
                </div>
                ${log.remarks ? `<p class="text-slate-700 italic pt-1 border-t border-slate-100 mt-1">${log.remarks}</p>` : ""}
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function closeTimelineModal() {
  const modal = document.getElementById("timeline-modal");
  if (modal) modal.classList.add("hidden");
}

// ==============================================================================
// 15. PUBLIC TRACKING & SEARCH (No Login Required)
// ==============================================================================
async function handlePublicSearch(trackingId) {
  const cleanId = (trackingId || "").trim().toUpperCase();
  if (!cleanId) {
    showToast("Please enter an official tracking code (e.g. GRV-2026-9001)", "info");
    return;
  }

  const trackBtn = document.getElementById("public-track-btn");
  if (trackBtn) {
    trackBtn.disabled = true;
    trackBtn.innerHTML = `<svg class="animate-spin h-3.5 w-3.5 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>`;
  }

  try {
    const g = await db.getGrievanceByTrackingId(cleanId);
    state.activeTrackingGrievance = g;

    const resultCard = document.getElementById("public-track-result");
    const notfoundCard = document.getElementById("public-track-notfound");

    if (g) {
      if (notfoundCard) notfoundCard.classList.add("hidden");
      if (resultCard) resultCard.classList.remove("hidden");

      document.getElementById("track-res-id").textContent = g.tracking_id;
      document.getElementById("track-res-title").textContent = g.title;
      document.getElementById("track-res-dept").textContent = g.department_name;
      document.getElementById("track-res-date").textContent = formatDate(g.created_at);
      document.getElementById("track-res-location").textContent = `${g.location}, ${g.district}`;
      document.getElementById("track-res-citizen").textContent = maskName(g.citizen_name);
      document.getElementById("track-res-desc").textContent = g.description;

      document.getElementById("track-res-status").innerHTML = getStatusBadgeHtml(g.status);
      document.getElementById("track-res-priority").innerHTML = getPriorityBadgeHtml(g.priority);

      // Photographic Evidence Display (from Supabase Storage URL)
      const photoContainer = document.getElementById("track-res-photo-container");
      const photoImg = document.getElementById("track-res-img");
      const photoUrl = g.image_url || g.attachment_url;
      if (photoUrl && photoContainer && photoImg) {
        photoImg.src = photoUrl;
        photoContainer.classList.remove("hidden");
      } else if (photoContainer) {
        photoContainer.classList.add("hidden");
      }

      // Resolution Report
      const resContainer = document.getElementById("track-res-resolution-container");
      if (g.resolution_notes && resContainer) {
        document.getElementById("track-res-resolution-notes").textContent = `"${g.resolution_notes}"`;
        document.getElementById("track-res-official").textContent = g.assigned_official_name || "Assigned Officer";
        document.getElementById("track-res-resolved-at").textContent = formatDate(g.resolved_at || g.updated_at);
        resContainer.classList.remove("hidden");
      } else if (resContainer) {
        resContainer.classList.add("hidden");
      }

      // Timeline Logs
      const timelineContainer = document.getElementById("track-res-timeline");
      timelineContainer.innerHTML = `<div class="text-xs text-slate-400 py-3 text-center">Loading audit trail...</div>`;

      const logs = await db.getLogs(g.id);
      if (logs.length === 0) {
        timelineContainer.innerHTML = `<div class="text-xs text-slate-400 py-3 text-center">Initial registration recorded. Further departmental action pending.</div>`;
      } else {
        timelineContainer.innerHTML = `
          <div class="relative pl-6 space-y-5">
            ${logs
              .map((l, idx) => {
                const isLast = idx === logs.length - 1;
                const statusCls =
                  l.new_status === "Resolved"
                    ? "bg-emerald-500"
                    : l.new_status === "In Progress"
                    ? "bg-sky-500"
                    : l.new_status === "Rejected"
                    ? "bg-rose-500"
                    : "bg-amber-500";

                return `
                  <div class="timeline-item relative">
                    ${!isLast ? `<div class="timeline-stem"></div>` : ""}
                    <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${statusCls} border-2 border-white shadow"></div>
                    <div class="bg-white p-3.5 rounded-xl border border-slate-200 text-xs shadow-sm">
                      <div class="flex justify-between items-center mb-1">
                        <span class="font-extrabold text-slate-900">${l.action}</span>
                        <span class="text-[10px] text-slate-400 font-mono">${formatDate(l.created_at)}</span>
                      </div>
                      <div class="text-slate-600 text-[11px]">
                        Recorded by: <strong>${l.performed_by_name}</strong> (${l.performed_by_role})
                      </div>
                      ${l.remarks ? `<p class="italic text-slate-700 mt-1 border-t border-slate-100 pt-1">${l.remarks}</p>` : ""}
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        `;
      }

      resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      if (resultCard) resultCard.classList.add("hidden");
      if (notfoundCard) {
        notfoundCard.classList.remove("hidden");
        document.getElementById("notfound-id").textContent = cleanId;
        notfoundCard.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  } catch (err) {
    showToast(err.message || "Error searching grievance record.", "error");
  } finally {
    if (trackBtn) {
      trackBtn.disabled = false;
      trackBtn.textContent = "Search";
    }
  }
}

function printCurrentTrackingGrievance() {
  if (state.activeTrackingGrievance) {
    showReceiptModal(state.activeTrackingGrievance);
  }
}

// ==============================================================================
// 16. PUBLIC GRIEVANCE ARCHIVE (Resolved Cases Feed)
// ==============================================================================
function renderArchiveFeed() {
  const container = document.getElementById("archive-feed-container");
  if (!container) return;

  const deptFilter = document.getElementById("archive-dept-filter") ? document.getElementById("archive-dept-filter").value : "all";
  const search = document.getElementById("archive-search-input") ? (document.getElementById("archive-search-input").value || "").toLowerCase().trim() : "";

  const resolvedCases = state.grievances.filter(g => g.status === "Resolved");

  const filtered = resolvedCases.filter(g => {
    if (deptFilter !== "all" && g.department_id !== deptFilter) return false;
    if (search) {
      const text = `${g.tracking_id} ${g.title} ${g.location} ${g.description} ${g.resolution_notes || ""}`.toLowerCase();
      if (!text.includes(search)) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-white rounded-2xl border-2 border-slate-200 p-12 text-center text-slate-400">
        No resolved grievance dockets match this filter criteria.
      </div>
    `;
    return;
  }

  container.innerHTML = filtered
    .map(g => {
      const photo = g.image_url || g.attachment_url;
      return `
        <div class="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
          <div>
            ${
              photo
                ? `
              <div class="relative h-44 w-full bg-slate-900 overflow-hidden cursor-pointer group" onclick="zoomImage('${photo}')">
                <img src="${photo}" alt="Resolved grievance evidence" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                <div class="absolute top-3 left-3 bg-gov-navy-950/80 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-slate-700">
                  ${g.tracking_id}
                </div>
                <div class="absolute bottom-2 right-2 bg-emerald-900/90 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-black border border-emerald-700 flex items-center">
                  ✓ Verified Resolution
                </div>
              </div>
            `
                : `
              <div class="h-24 bg-gradient-to-r from-gov-navy-900 to-slate-900 p-4 flex items-center justify-between text-white">
                <span class="font-mono text-xs font-black text-amber-400">${g.tracking_id}</span>
                <span class="bg-emerald-900/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-700">✓ Resolved</span>
              </div>
            `
            }

            <div class="p-5 space-y-3 text-xs">
              <div>
                <span class="inline-block text-[10px] font-extrabold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded mb-1">
                  ${g.department_name}
                </span>
                <h3 class="text-sm font-black text-slate-900 font-emblem leading-snug">${g.title}</h3>
                <p class="text-[11px] text-slate-400 mt-0.5">Location: ${g.location}, ${g.district}</p>
              </div>

              <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 leading-relaxed text-[11px]">
                <strong class="text-slate-800 block text-[10px] uppercase">Reported Issue:</strong>
                ${g.description}
              </div>

              ${
                g.resolution_notes
                  ? `
                <div class="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 text-slate-800 text-[11px] leading-relaxed">
                  <strong class="text-emerald-900 block text-[10px] uppercase flex items-center mb-0.5">
                    Official Remediation Taken:
                  </strong>
                  ${g.resolution_notes}
                </div>
              `
                  : ""
              }
            </div>
          </div>

          <div class="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div>Officer: <strong class="text-slate-700">${g.assigned_official_name || "Civic Officer"}</strong></div>
            <button onclick="handlePublicSearch('${g.tracking_id}')" class="text-amber-700 hover:text-amber-800 font-bold underline">
              View Audit Log &rarr;
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// ==============================================================================
// 17. HOME SCREEN STATS & DIRECTORY
// ==============================================================================
function renderHomeStats() {
  const total = state.grievances.length;
  const resolved = state.grievances.filter(g => g.status === "Resolved").length;
  const inProgress = state.grievances.filter(g => g.status === "In Progress" || g.status === "Pending").length;
  const deptsCount = state.departments.length;

  const totalEl = document.getElementById("home-total-count");
  const resolvedEl = document.getElementById("home-resolved-count");
  const inprogEl = document.getElementById("home-inprogress-count");
  const deptsEl = document.getElementById("home-departments-count");

  if (totalEl) totalEl.textContent = total;
  if (resolvedEl) resolvedEl.textContent = resolved;
  if (inprogEl) inprogEl.textContent = inProgress;
  if (deptsEl) deptsEl.textContent = deptsCount;

  // Render department directory cards on landing page
  const deptGrid = document.getElementById("home-department-grid");
  if (deptGrid && state.departments.length > 0) {
    deptGrid.innerHTML = state.departments
      .map(d => {
        return `
        <div class="bg-white p-5 rounded-2xl border-2 border-slate-200 hover:border-amber-500 transition shadow-sm space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center border border-amber-200">
              🏛️
            </div>
            <span class="text-[11px] font-mono font-extrabold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              SLA: ${d.sla_hours}h
            </span>
          </div>
          <div>
            <h4 class="text-sm font-black text-slate-900 font-emblem">${d.name}</h4>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">${d.description}</p>
          </div>
          <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Head: <strong class="text-slate-700">${d.head_official}</strong></span>
            <button onclick="handleLodgeGrievanceClick()" class="text-amber-600 font-bold hover:underline">
              File &rarr;
            </button>
          </div>
        </div>
      `;
      })
      .join("");
  }

  // Render Resolved Feed Preview on Landing Page
  const feedPreview = document.getElementById("home-resolved-feed-preview");
  if (feedPreview) {
    const resolvedCases = state.grievances.filter(g => g.status === "Resolved").slice(0, 3);
    if (resolvedCases.length === 0) {
      feedPreview.innerHTML = `<div class="col-span-full text-center text-xs text-slate-400 py-6">No resolved cases archived yet.</div>`;
    } else {
      feedPreview.innerHTML = resolvedCases
        .map(g => {
          const photo = g.image_url || g.attachment_url;
          return `
          <div class="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-3 text-xs flex flex-col justify-between">
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                  ${g.tracking_id}
                </span>
                <span class="text-[10px] text-slate-400">${formatDate(g.resolved_at || g.created_at)}</span>
              </div>
              <h4 class="font-black text-slate-900 font-emblem line-clamp-1">${g.title}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-2">${g.description}</p>
              ${
                photo
                  ? `<div class="h-28 rounded-lg overflow-hidden border border-slate-200 cursor-pointer" onclick="zoomImage('${photo}')">
                      <img src="${photo}" alt="Evidence" class="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    </div>`
                  : ""
              }
              ${
                g.resolution_notes
                  ? `<div class="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-[11px] text-slate-800">
                      <strong class="text-emerald-900 text-[10px] uppercase block">Action Taken:</strong>
                      <span class="italic line-clamp-2">${g.resolution_notes}</span>
                    </div>`
                  : ""
              }
            </div>
            <div class="pt-2 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-500">
              <span>Department: <strong class="text-slate-700">${g.department_name}</strong></span>
              <button onclick="handlePublicSearch('${g.tracking_id}')" class="text-amber-700 font-bold hover:underline">
                Audit Trail &rarr;
              </button>
            </div>
          </div>
        `;
        })
        .join("");
    }
  }
}

// ==============================================================================
// 18. CSV AUDIT EXPORT (Officials / Admins)
// ==============================================================================
function exportGrievancesToCSV() {
  if (!state.grievances || state.grievances.length === 0) {
    showToast("No grievance records available to export.", "error");
    return;
  }

  const headers = [
    "Tracking ID",
    "Lodged Date",
    "Citizen Name",
    "Citizen Email",
    "Citizen Phone",
    "Subject",
    "Department",
    "Priority",
    "Status",
    "District",
    "Location",
    "Assigned Official",
    "Resolution Notes",
    "Resolved Date"
  ];

  const rows = state.grievances.map(g => [
    `"${g.tracking_id || ""}"`,
    `"${g.created_at || ""}"`,
    `"${(g.citizen_name || "").replace(/"/g, '""')}"`,
    `"${g.citizen_email || ""}"`,
    `"${g.citizen_phone || ""}"`,
    `"${(g.title || "").replace(/"/g, '""')}"`,
    `"${(g.department_name || "").replace(/"/g, '""')}"`,
    `"${g.priority || ""}"`,
    `"${g.status || ""}"`,
    `"${(g.district || "").replace(/"/g, '""')}"`,
    `"${(g.location || "").replace(/"/g, '""')}"`,
    `"${(g.assigned_official_name || "").replace(/"/g, '""')}"`,
    `"${(g.resolution_notes || "").replace(/"/g, '""')}"`,
    `"${g.resolved_at || ""}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `PGRRS_Government_Grievance_Report_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Government audit CSV report exported successfully.", "success");
}

// ==============================================================================
// 19. PHOTO ZOOM LIGHTBOX
// ==============================================================================
function zoomImage(src) {
  const modal = document.getElementById("image-zoom-modal");
  const img = document.getElementById("zoom-modal-img");
  if (!modal || !img || !src) return;
  img.src = src;
  modal.classList.remove("hidden");
}

function closeImageZoom() {
  const modal = document.getElementById("image-zoom-modal");
  if (modal) modal.classList.add("hidden");
}

// ==============================================================================
// 20. SUPABASE SQL SCHEMA MODAL
// ==============================================================================
function openSqlModal() {
  const modal = document.getElementById("sql-setup-modal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const codeEl = document.getElementById("sql-code-snippet");
  if (codeEl && (!codeEl.textContent || codeEl.textContent.length < 20)) {
    codeEl.textContent = `-- SUPABASE POSTGRESQL & STORAGE ARCHITECTURE
-- Run in your Supabase SQL Editor: https://supabase.com/dashboard/project/kihkzjzgpuenbetlrsxp/sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS grievance_logs CASCADE;
DROP TABLE IF EXISTS grievances CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

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

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;
ALTER TABLE grievance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on departments" ON departments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on profiles" ON profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievances" ON grievances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all on grievance_logs" ON grievance_logs FOR ALL USING (true) WITH CHECK (true);

-- STORAGE BUCKET CREATION FOR GRIEVANCE IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('images', 'images', true) 
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads to images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Allow public select from images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'images');`;
  }
}

function closeSqlModal() {
  const modal = document.getElementById("sql-setup-modal");
  if (modal) modal.classList.add("hidden");
}

async function retrySupabaseConnection() {
  const btn = document.getElementById("retry-supabase-btn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Checking Connection...";
  }

  const online = await db.testSupabase();
  updateSupabaseStatusBadge(online);

  if (online) {
    showToast("Successfully connected to live Supabase PostgreSQL & Storage!", "success");
    await refreshData();
  } else {
    showToast("Supabase did not respond yet. Please execute schema.sql in Supabase SQL editor.", "error");
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = "Check Connection Again";
  }
}

function copySqlToClipboard() {
  const codeEl = document.getElementById("sql-code-snippet");
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.textContent).then(
    () => showToast("SQL setup script copied to clipboard!", "success"),
    () => showToast("Could not copy script automatically. Please select text.", "error")
  );
}

// ==============================================================================
// 21. EVENT LISTENERS SETUP
// ==============================================================================
function setupEventListeners() {
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("data-nav-target");
      navigate(target);
    });
  });

  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  const heroBtn = document.getElementById("hero-track-btn");
  const heroInput = document.getElementById("hero-tracking-input");
  if (heroBtn && heroInput) {
    heroBtn.addEventListener("click", () => {
      const val = heroInput.value.trim();
      if (val) {
        navigate("public-track");
        const pubInput = document.getElementById("public-tracking-input");
        if (pubInput) pubInput.value = val;
        handlePublicSearch(val);
      }
    });
    heroInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        heroBtn.click();
      }
    });
  }

  const pubBtn = document.getElementById("public-track-btn");
  const pubInput = document.getElementById("public-tracking-input");
  if (pubBtn && pubInput) {
    pubBtn.addEventListener("click", () => {
      handlePublicSearch(pubInput.value);
    });
    pubInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        pubBtn.click();
      }
    });
  }

  const grievanceForm = document.getElementById("form-file-grievance");
  if (grievanceForm) {
    grievanceForm.addEventListener("submit", handleGrievanceSubmit);
  }

  const signinForm = document.getElementById("auth-signin-form");
  if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value;
      const pass = document.getElementById("signin-password").value;
      handleSignIn(email, pass);
    });
  }

  const signupForm = document.getElementById("auth-signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const full_name = document.getElementById("signup-name").value;
      const email = document.getElementById("signup-email").value;
      const phone = document.getElementById("signup-phone").value;
      const district = document.getElementById("signup-district").value;
      const role = document.getElementById("signup-role").value;
      const department_id = document.getElementById("signup-department").value;
      const official_designation = document.getElementById("signup-designation") ? document.getElementById("signup-designation").value : null;
      const password = document.getElementById("signup-password").value;
      const confirmPassword = document.getElementById("signup-confirm-password").value;

      handleSignUp({
        full_name,
        email,
        phone,
        district,
        role,
        department_id,
        official_designation,
        password,
        confirmPassword
      });
    });
  }

  const roleSelect = document.getElementById("signup-role");
  const deptWrapper = document.getElementById("signup-dept-wrapper");
  if (roleSelect && deptWrapper) {
    roleSelect.addEventListener("change", (e) => {
      if (e.target.value === "official") {
        deptWrapper.classList.remove("hidden");
      } else {
        deptWrapper.classList.add("hidden");
      }
    });
  }

  const filterDept = document.getElementById("filter-department");
  const filterStatus = document.getElementById("filter-status");
  const filterPriority = document.getElementById("filter-priority");
  const filterSearch = document.getElementById("filter-search");

  [filterDept, filterStatus, filterPriority].forEach(el => {
    if (el) el.addEventListener("change", renderAdminDashboard);
  });
  if (filterSearch) {
    filterSearch.addEventListener("input", renderAdminDashboard);
  }

  const saveUpdateBtn = document.getElementById("btn-save-grievance-update");
  if (saveUpdateBtn) {
    saveUpdateBtn.addEventListener("click", handleSaveGrievanceUpdate);
  }

  const archiveDept = document.getElementById("archive-dept-filter");
  const archiveSearch = document.getElementById("archive-search-input");
  if (archiveDept) archiveDept.addEventListener("change", renderArchiveFeed);
  if (archiveSearch) archiveSearch.addEventListener("input", renderArchiveFeed);
}

// Start application when DOM is ready
document.addEventListener("DOMContentLoaded", initApp);
