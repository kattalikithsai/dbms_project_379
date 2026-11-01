/**
 * PUBLIC GRIEVANCE REGISTRATION AND RESOLUTION SYSTEM (PGRRS)
 * Core Application Logic, Supabase Integration, Local State & UI Controller
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
  console.warn("Supabase initialization warning:", err);
}

// ==============================================================================
// 2. DEFAULT SEED DATA (Used for Local Simulation & Seed Fallback)
// ==============================================================================
const DEFAULT_DEPARTMENTS = [
  {
    id: "dept_water",
    name: "Water Supply & Sewage Board",
    code: "WATER",
    description: "Potable water pipelines, drainage maintenance, sewage blockages, water quality",
    head_official: "Er. Arvind Mehta",
    icon: "droplet"
  },
  {
    id: "dept_roads",
    name: "Public Works & Road Infrastructure",
    code: "ROADS",
    description: "Pothole repair, road carpeting, footpaths, bridges, drainage channels",
    head_official: "Er. Priya Sharma",
    icon: "car"
  },
  {
    id: "dept_elec",
    name: "Electricity & Power Distribution",
    code: "ELEC",
    description: "Power outages, hazardous wiring, transformer failure, streetlight repairs",
    head_official: "Er. Rajesh Verma",
    icon: "zap"
  },
  {
    id: "dept_waste",
    name: "Municipal Solid Waste Management",
    code: "WASTE",
    description: "Garbage collection, community dumpsters, sanitation drives, debris disposal",
    head_official: "Dr. S. K. Nambiar",
    icon: "trash-2"
  },
  {
    id: "dept_health",
    name: "Public Health & Healthcare Services",
    code: "HEALTH",
    description: "Civic clinics, vector-borne disease control, sanitation inspection, food hygiene",
    head_official: "Dr. Ananya Roy",
    icon: "activity"
  },
  {
    id: "dept_police",
    name: "Traffic & Law Enforcement",
    code: "POLICE",
    description: "Traffic signal management, illegal parking, civic encroachment, public nuisance",
    head_official: "Insp. Vikram Singh",
    icon: "shield"
  }
];

const DEFAULT_PROFILES = [
  {
    id: "usr_citizen_1",
    email: "citizen@civic.gov",
    password: "Citizen123!",
    full_name: "Likith Sai",
    phone: "+91 98765 43210",
    role: "citizen",
    department_id: null,
    district: "Central District",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: "usr_citizen_2",
    email: "aarti.sharma@example.com",
    password: "Citizen123!",
    full_name: "Aarti Sharma",
    phone: "+91 98765 11223",
    role: "citizen",
    department_id: null,
    district: "North Ward",
    created_at: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: "usr_official_water",
    email: "official.water@civic.gov",
    password: "Official123!",
    full_name: "Er. Arvind Mehta",
    phone: "+91 91234 56789",
    role: "official",
    department_id: "dept_water",
    district: "Central District",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_official_roads",
    email: "official.roads@civic.gov",
    password: "Official123!",
    full_name: "Er. Priya Sharma",
    phone: "+91 91234 98765",
    role: "official",
    department_id: "dept_roads",
    district: "South Ward",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_official_elec",
    email: "official.elec@civic.gov",
    password: "Official123!",
    full_name: "Er. Rajesh Verma",
    phone: "+91 91234 44556",
    role: "official",
    department_id: "dept_elec",
    district: "East Ward",
    created_at: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "usr_admin_1",
    email: "admin@civic.gov",
    password: "Admin123!",
    full_name: "Dr. K. S. Murthy (Director)",
    phone: "+91 99999 88888",
    role: "admin",
    department_id: null,
    district: "Apex Secretariat",
    created_at: new Date(Date.now() - 60 * 86400000).toISOString()
  }
];

const DEFAULT_GRIEVANCES = [
  {
    id: "grv_001",
    tracking_id: "GRV-2026-1001",
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
    attachment_url: "https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=400&q=80",
    status: "In Progress",
    assigned_official_id: "usr_official_water",
    assigned_official_name: "Er. Arvind Mehta",
    resolution_notes: "Field repair crew dispatched with heavy excavation gear. Pipeline section replacement underway.",
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
    title: "Deep Hazardous Potholes on Main Bus Route",
    department_id: "dept_roads",
    department_name: "Public Works & Road Infrastructure",
    priority: "High",
    location: "Between Metro Pillar 140 to 148, Ring Road",
    district: "Central District",
    description: "Multiple deep potholes spanning 200 meters. Caused 2 two-wheeler skids yesterday. High hazard during night transit.",
    attachment_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80",
    status: "Resolved",
    assigned_official_id: "usr_official_roads",
    assigned_official_name: "Er. Priya Sharma",
    resolution_notes: "Emergency cold-mix asphalt patch work completed. Bitumen overlay leveled and inspected.",
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
    title: "High Voltage Streetlight Pole Sparking",
    department_id: "dept_elec",
    department_name: "Electricity & Power Distribution",
    priority: "Urgent",
    location: "Near Community Health Center, North Gate",
    district: "North Ward",
    description: "Streetlight pole #NL-44 has loose dangling live wires that emit loud sparks whenever it rains. Direct threat to school children walking by.",
    attachment_url: null,
    status: "Pending",
    assigned_official_id: null,
    assigned_official_name: null,
    resolution_notes: null,
    resolved_at: null,
    created_at: new Date(Date.now() - 12 * 3600000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 3600000).toISOString()
  },
  {
    id: "grv_004",
    tracking_id: "GRV-2026-1004",
    citizen_id: "usr_citizen_2",
    citizen_name: "Aarti Sharma",
    citizen_email: "aarti.sharma@example.com",
    citizen_phone: "+91 98765 11223",
    title: "Garbage Dump Overflowing and Stray Cattle Nuisance",
    department_id: "dept_waste",
    department_name: "Municipal Solid Waste Management",
    priority: "Medium",
    location: "Market Square, Corner of Vegetable Yard",
    district: "North Ward",
    description: "Community bin has not been cleared for 4 consecutive days. Debris spilled across 50 meters attracting flies and foul smell.",
    attachment_url: null,
    status: "In Progress",
    assigned_official_id: null,
    assigned_official_name: "Dr. S. K. Nambiar",
    resolution_notes: "Sanitation compactor scheduled for 6:00 AM route tomorrow with bleaching powder sanitization.",
    resolved_at: null,
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 18 * 3600000).toISOString()
  },
  {
    id: "grv_005",
    tracking_id: "GRV-2026-1005",
    citizen_id: "usr_citizen_1",
    citizen_name: "Likith Sai",
    citizen_email: "citizen@civic.gov",
    citizen_phone: "+91 98765 43210",
    title: "Illegal Commercial Vehicle Parking Blocking Fire Hydrant",
    department_id: "dept_police",
    department_name: "Traffic & Law Enforcement",
    priority: "Low",
    location: "Old Grain Market Alley #3",
    district: "Central District",
    description: "Private logistics trucks parked permanently over marked fire hydrant zones and obstructing emergency vehicle access.",
    attachment_url: null,
    status: "Resolved",
    assigned_official_id: null,
    assigned_official_name: "Insp. Vikram Singh",
    resolution_notes: "Traffic towing squad deployed. Fines issued to 4 offending vehicle owners. Hydrant cleared and no-parking warning sign board reinstalled.",
    resolved_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

const DEFAULT_LOGS = [
  {
    id: "log_001",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-1001",
    action: "Grievance Registered",
    previous_status: null,
    new_status: "Pending",
    performed_by_name: "Likith Sai",
    performed_by_role: "Citizen",
    remarks: "Grievance filed through Citizen Web Portal with location details.",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "log_002",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-1001",
    action: "Official Assigned",
    previous_status: "Pending",
    new_status: "Pending",
    performed_by_name: "Admin System",
    performed_by_role: "Admin",
    remarks: "Assigned to Er. Arvind Mehta (Water Supply & Sewage Board).",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "log_003",
    grievance_id: "grv_001",
    tracking_id: "GRV-2026-1001",
    action: "Status Updated",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Er. Arvind Mehta",
    performed_by_role: "Department Official",
    remarks: "Inspection complete. Field team deployed with replacement ductile iron pipe segment.",
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
    remarks: "Pothole issue submitted with ward marker.",
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
    remarks: "Material procurement arranged for rapid asphalt filling.",
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
    remarks: "Road resurfaced and leveled. Quality inspection cleared by Junior Engineer.",
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
    created_at: new Date(Date.now() - 12 * 3600000).toISOString()
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
    remarks: "Added to North Ward morning sanitation sweep route.",
    created_at: new Date(Date.now() - 18 * 3600000).toISOString()
  },
  {
    id: "log_010",
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
    id: "log_011",
    grievance_id: "grv_005",
    tracking_id: "GRV-2026-1005",
    action: "Official Assigned",
    previous_status: "Pending",
    new_status: "In Progress",
    performed_by_name: "Admin System",
    performed_by_role: "Admin",
    remarks: "Forwarded to Central Traffic Police Station.",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    id: "log_012",
    grievance_id: "grv_005",
    tracking_id: "GRV-2026-1005",
    action: "Grievance Resolved",
    previous_status: "In Progress",
    new_status: "Resolved",
    performed_by_name: "Insp. Vikram Singh",
    performed_by_role: "Department Official",
    remarks: "Vehicles towed away, challans issued, sign board fixed.",
    created_at: new Date(Date.now() - 24 * 3600000).toISOString()
  }
];

// ==============================================================================
// 3. REPOSITORY LAYER (Dual-Mode: Supabase First, LocalStorage Fallback)
// ==============================================================================
class DataRepository {
  constructor() {
    this.initLocalStorage();
  }

  initLocalStorage() {
    if (!localStorage.getItem("pgrrs_departments")) {
      localStorage.setItem("pgrrs_departments", JSON.stringify(DEFAULT_DEPARTMENTS));
    }
    if (!localStorage.getItem("pgrrs_profiles")) {
      localStorage.setItem("pgrrs_profiles", JSON.stringify(DEFAULT_PROFILES));
    }
    if (!localStorage.getItem("pgrrs_grievances")) {
      localStorage.setItem("pgrrs_grievances", JSON.stringify(DEFAULT_GRIEVANCES));
    }
    if (!localStorage.getItem("pgrrs_logs")) {
      localStorage.setItem("pgrrs_logs", JSON.stringify(DEFAULT_LOGS));
    }
  }

  async testSupabase() {
    if (!supabaseClient) return false;
    try {
      const { data, error } = await supabaseClient.from("departments").select("id").limit(1);
      if (error) {
        console.warn("Supabase query returned error:", error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn("Supabase connection check failed:", e);
      return false;
    }
  }

  // --- Departments ---
  async getDepartments() {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient.from("departments").select("*").order("name");
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn("Fallback to local departments:", e);
      }
    }
    return JSON.parse(localStorage.getItem("pgrrs_departments")) || DEFAULT_DEPARTMENTS;
  }

  // --- Profiles / Auth ---
  async getProfileByEmail(email) {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .eq("email", email.trim().toLowerCase())
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Fallback to local profiles:", e);
      }
    }
    const profiles = JSON.parse(localStorage.getItem("pgrrs_profiles")) || DEFAULT_PROFILES;
    return profiles.find(p => p.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  async getOfficials() {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .select("*")
          .in("role", ["official", "admin"]);
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn("Fallback to local officials:", e);
      }
    }
    const profiles = JSON.parse(localStorage.getItem("pgrrs_profiles")) || DEFAULT_PROFILES;
    return profiles.filter(p => p.role === "official" || p.role === "admin");
  }

  async createProfile(profileData) {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("profiles")
          .insert([profileData])
          .select()
          .single();
        if (!error && data) {
          // Sync locally as well
          const localProfiles = JSON.parse(localStorage.getItem("pgrrs_profiles")) || [];
          localProfiles.push(data);
          localStorage.setItem("pgrrs_profiles", JSON.stringify(localProfiles));
          return { data, error: null };
        }
        if (error) throw error;
      } catch (e) {
        console.warn("Supabase create profile error, falling back locally:", e.message);
      }
    }
    // Local creation
    const localProfiles = JSON.parse(localStorage.getItem("pgrrs_profiles")) || DEFAULT_PROFILES;
    if (localProfiles.some(p => p.email.toLowerCase() === profileData.email.toLowerCase())) {
      return { data: null, error: { message: "Email is already registered. Please sign in." } };
    }
    localProfiles.push(profileData);
    localStorage.setItem("pgrrs_profiles", JSON.stringify(localProfiles));
    return { data: profileData, error: null };
  }

  // --- Grievances ---
  async getGrievances() {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase getGrievances error, fallback:", e);
      }
    }
    return JSON.parse(localStorage.getItem("pgrrs_grievances")) || DEFAULT_GRIEVANCES;
  }

  async getGrievanceByTrackingId(trackingId) {
    const cleanId = trackingId.trim().toUpperCase();
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .select("*")
          .eq("tracking_id", cleanId)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn("Supabase lookup error:", e);
      }
    }
    const grievances = JSON.parse(localStorage.getItem("pgrrs_grievances")) || DEFAULT_GRIEVANCES;
    return grievances.find(g => g.tracking_id.toUpperCase() === cleanId) || null;
  }

  async createGrievance(grievanceData) {
    let savedGrievance = null;
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .insert([grievanceData])
          .select()
          .single();
        if (!error && data) {
          savedGrievance = data;
        }
      } catch (e) {
        console.warn("Supabase createGrievance error, using local:", e);
      }
    }
    if (!savedGrievance) {
      savedGrievance = grievanceData;
    }
    // Always keep local updated
    const local = JSON.parse(localStorage.getItem("pgrrs_grievances")) || DEFAULT_GRIEVANCES;
    local.unshift(savedGrievance);
    localStorage.setItem("pgrrs_grievances", JSON.stringify(local));

    return savedGrievance;
  }

  async updateGrievance(id, updates) {
    let updated = null;
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("grievances")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (!error && data) updated = data;
      } catch (e) {
        console.warn("Supabase updateGrievance error, fallback:", e);
      }
    }
    // Update local store
    const local = JSON.parse(localStorage.getItem("pgrrs_grievances")) || DEFAULT_GRIEVANCES;
    const index = local.findIndex(g => g.id === id);
    if (index !== -1) {
      local[index] = { ...local[index], ...updates };
      localStorage.setItem("pgrrs_grievances", JSON.stringify(local));
      if (!updated) updated = local[index];
    }
    return updated;
  }

  // --- Logs ---
  async getLogs(grievanceId) {
    if (isSupabaseOnline) {
      try {
        const { data, error } = await supabaseClient
          .from("grievance_logs")
          .select("*")
          .eq("grievance_id", grievanceId)
          .order("created_at", { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn("Supabase getLogs error:", e);
      }
    }
    const logs = JSON.parse(localStorage.getItem("pgrrs_logs")) || DEFAULT_LOGS;
    return logs
      .filter(l => l.grievance_id === grievanceId)
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  async addLog(logData) {
    if (isSupabaseOnline) {
      try {
        await supabaseClient.from("grievance_logs").insert([logData]);
      } catch (e) {
        console.warn("Supabase addLog error:", e);
      }
    }
    const localLogs = JSON.parse(localStorage.getItem("pgrrs_logs")) || DEFAULT_LOGS;
    localLogs.push(logData);
    localStorage.setItem("pgrrs_logs", JSON.stringify(localLogs));
    return logData;
  }
}

const db = new DataRepository();

// ==============================================================================
// 4. APPLICATION STATE
// ==============================================================================
const state = {
  currentUser: null, // { id, email, full_name, role, phone, department_id, district }
  activeView: "home", // 'home', 'file-grievance', 'my-grievances', 'dashboard', 'analytics', 'public-track'
  departments: [],
  allGrievances: [],
  officials: [],
  currentFilter: {
    department: "all",
    status: "all",
    priority: "all",
    search: ""
  },
  selectedGrievanceForModal: null
};

// ==============================================================================
// 5. UTILITY FUNCTIONS
// ==============================================================================
function generateTrackingId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `GRV-${year}-${randomNum}`;
}

function formatDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getRelativeTime(isoString) {
  if (!isoString) return "";
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

function maskName(name) {
  if (!name) return "Citizen";
  const parts = name.trim().split(" ");
  return parts
    .map(p => (p.length > 2 ? p[0] + "*".repeat(p.length - 2) + p[p.length - 1] : p[0] + "*"))
    .join(" ");
}

function getStatusBadgeHtml(status) {
  switch (status) {
    case "Pending":
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold badge-status-pending">
        <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500 animate-pulse"></span>Pending
      </span>`;
    case "In Progress":
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold badge-status-inprogress">
        <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-500 animate-pulse"></span>In Progress
      </span>`;
    case "Resolved":
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold badge-status-resolved">
        <svg class="w-3.5 h-3.5 mr-1 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>Resolved
      </span>`;
    case "Rejected":
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold badge-status-rejected">
        <svg class="w-3.5 h-3.5 mr-1 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>Rejected
      </span>`;
    default:
      return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">${status}</span>`;
  }
}

function getPriorityBadgeHtml(priority) {
  switch (priority) {
    case "Urgent":
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold badge-priority-urgent pulse-badge">
        <svg class="w-3 h-3 mr-1 text-rose-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>Urgent
      </span>`;
    case "High":
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold badge-priority-high">
        High
      </span>`;
    case "Medium":
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium badge-priority-medium">
        Medium
      </span>`;
    case "Low":
    default:
      return `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-normal badge-priority-low">
        Low
      </span>`;
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgClass =
    type === "success"
      ? "bg-slate-900 border-emerald-500 text-white"
      : type === "error"
      ? "bg-rose-900 border-rose-500 text-white"
      : "bg-slate-900 border-amber-500 text-white";

  const iconSvg =
    type === "success"
      ? `<svg class="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      : type === "error"
      ? `<svg class="w-5 h-5 text-rose-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
      : `<svg class="w-5 h-5 text-amber-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;

  toast.className = `flex items-center p-4 mb-3 max-w-md rounded-lg border shadow-xl transform transition-all duration-300 translate-y-2 opacity-0 ${bgClass}`;
  toast.innerHTML = `
    ${iconSvg}
    <div class="text-sm font-medium flex-1">${message}</div>
    <button onclick="this.parentElement.remove()" class="ml-3 text-slate-400 hover:text-white">&times;</button>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Confetti celebration for resolved grievance
function triggerConfetti() {
  if (window.confetti) {
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
}

// ==============================================================================
// 6. INITIALIZATION & DATA LOADING
// ==============================================================================
async function initApp() {
  // Check persisted user session
  const savedUser = localStorage.getItem("pgrrs_session");
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
    } catch (e) {
      localStorage.removeItem("pgrrs_session");
    }
  }

  // Probe Supabase Database
  isSupabaseOnline = await db.testSupabase();
  updateSupabaseStatusBadge(isSupabaseOnline);

  // Load Initial Data
  await refreshData();

  // Populate Dropdowns
  populateDepartmentDropdowns();

  // Setup Event Listeners
  setupEventListeners();

  // Render initial view
  renderNavigation();
  navigate(state.activeView);
}

async function refreshData() {
  state.departments = await db.getDepartments();
  state.allGrievances = await db.getGrievances();
  state.officials = await db.getOfficials();
}

function updateSupabaseStatusBadge(online) {
  const badge = document.getElementById("supabase-status-indicator");
  if (!badge) return;

  if (online) {
    badge.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50 cursor-pointer hover:bg-emerald-900 transition" onclick="openSqlModal()">
        <span class="w-2 h-2 mr-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        <span class="w-2 h-2 mr-1.5 rounded-full bg-emerald-400 -ml-3.5"></span>
        Supabase Live: Synchronized
      </span>
    `;
  } else {
    badge.innerHTML = `
      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/50 cursor-pointer hover:bg-amber-900 transition" onclick="openSqlModal()" title="Click to view schema setup SQL">
        <span class="w-2 h-2 mr-1.5 rounded-full bg-amber-400 animate-pulse"></span>
        Supabase: Local Simulation Active (Setup SQL)
      </span>
    `;
  }
}

function populateDepartmentDropdowns() {
  const grievanceDeptSelect = document.getElementById("grievance-department");
  const filterDeptSelect = document.getElementById("filter-department");
  const signupDeptSelect = document.getElementById("signup-department");

  if (grievanceDeptSelect) {
    grievanceDeptSelect.innerHTML = `<option value="" disabled selected>Select Responsible Civic Department</option>`;
    state.departments.forEach(dept => {
      grievanceDeptSelect.innerHTML += `<option value="${dept.id}">${dept.name} (${dept.code})</option>`;
    });
  }

  if (filterDeptSelect) {
    filterDeptSelect.innerHTML = `<option value="all">All Civic Departments</option>`;
    state.departments.forEach(dept => {
      filterDeptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
    });
  }

  if (signupDeptSelect) {
    signupDeptSelect.innerHTML = `<option value="">Select Official Department</option>`;
    state.departments.forEach(dept => {
      signupDeptSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
    });
  }
}

// ==============================================================================
// 7. NAVIGATION & ROUTING
// ==============================================================================
function navigate(viewName) {
  state.activeView = viewName;

  // View sections
  const views = {
    home: document.getElementById("view-home"),
    "file-grievance": document.getElementById("view-file-grievance"),
    "my-grievances": document.getElementById("view-my-grievances"),
    dashboard: document.getElementById("view-dashboard"),
    analytics: document.getElementById("view-analytics"),
    "public-track": document.getElementById("view-public-track")
  };

  // Hide all
  Object.values(views).forEach(v => {
    if (v) v.classList.add("hidden");
  });

  // Role Gatekeepers
  if (viewName === "file-grievance" && !state.currentUser) {
    showToast("Please log in or register to lodge a grievance", "info");
    openAuthModal("signin");
    viewName = "home";
  }

  if (viewName === "my-grievances" && (!state.currentUser || state.currentUser.role !== "citizen")) {
    if (!state.currentUser) {
      showToast("Please sign in as Citizen to view your grievances", "info");
      openAuthModal("signin");
      viewName = "home";
    }
  }

  if (viewName === "dashboard" && (!state.currentUser || (state.currentUser.role !== "official" && state.currentUser.role !== "admin"))) {
    showToast("Dashboard restricted to Officials & Administrators", "error");
    viewName = "home";
  }

  // Show active view
  const targetView = views[viewName] || views.home;
  if (targetView) {
    targetView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Trigger view specific re-renders
  if (viewName === "home") {
    renderHomeStats();
  } else if (viewName === "my-grievances") {
    renderCitizenGrievances();
  } else if (viewName === "dashboard") {
    renderAdminDashboard();
  } else if (viewName === "analytics") {
    renderPublicAnalytics();
  }

  renderNavigation();
}

function renderNavigation() {
  const loggedOutNav = document.getElementById("nav-logged-out");
  const loggedInNav = document.getElementById("nav-logged-in");
  const roleBadge = document.getElementById("nav-role-badge");
  const userNameDisplay = document.getElementById("nav-user-name");
  const citizenLinks = document.querySelectorAll(".nav-link-citizen");
  const officialLinks = document.querySelectorAll(".nav-link-official");

  if (state.currentUser) {
    if (loggedOutNav) loggedOutNav.classList.add("hidden");
    if (loggedInNav) loggedInNav.classList.remove("hidden");

    if (userNameDisplay) userNameDisplay.textContent = state.currentUser.full_name;

    if (roleBadge) {
      let roleHtml = "";
      if (state.currentUser.role === "admin") {
        roleHtml = `<span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">Portal Admin</span>`;
      } else if (state.currentUser.role === "official") {
        const dept = state.departments.find(d => d.id === state.currentUser.department_id);
        const deptCode = dept ? dept.code : "Official";
        roleHtml = `<span class="px-2 py-0.5 rounded text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/40">${deptCode} Official</span>`;
      } else {
        roleHtml = `<span class="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Verified Citizen</span>`;
      }
      roleBadge.innerHTML = roleHtml;
    }

    // Role-conditional nav elements
    if (state.currentUser.role === "citizen") {
      citizenLinks.forEach(el => el.classList.remove("hidden"));
      officialLinks.forEach(el => el.classList.add("hidden"));
    } else {
      citizenLinks.forEach(el => el.classList.add("hidden"));
      officialLinks.forEach(el => el.classList.remove("hidden"));
    }
  } else {
    if (loggedOutNav) loggedOutNav.classList.remove("hidden");
    if (loggedInNav) loggedInNav.classList.add("hidden");
    citizenLinks.forEach(el => el.classList.add("hidden"));
    officialLinks.forEach(el => el.classList.add("hidden"));
  }

  // Active link highlighters
  document.querySelectorAll("[data-nav-target]").forEach(link => {
    const target = link.getAttribute("data-nav-target");
    if (target === state.activeView) {
      link.classList.add("text-amber-400", "font-semibold");
      link.classList.remove("text-slate-300");
    } else {
      link.classList.remove("text-amber-400", "font-semibold");
      link.classList.add("text-slate-300");
    }
  });
}

// ==============================================================================
// 8. AUTHENTICATION MODULE (Profiles Table Integration)
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
    tabSigninBtn.className = "flex-1 py-3 text-sm font-semibold text-amber-500 border-b-2 border-amber-500";
    tabSignupBtn.className = "flex-1 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent";
  } else {
    signinForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
    tabSignupBtn.className = "flex-1 py-3 text-sm font-semibold text-amber-500 border-b-2 border-amber-500";
    tabSigninBtn.className = "flex-1 py-3 text-sm font-medium text-slate-400 hover:text-slate-200 border-b-2 border-transparent";
  }
}

async function handleSignIn(email, password) {
  const submitBtn = document.getElementById("signin-submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Authenticating...`;
  }

  try {
    const user = await db.getProfileByEmail(email);

    if (!user) {
      showToast("No account found with this email. Please register.", "error");
      return;
    }

    if (user.password !== password) {
      showToast("Incorrect password entered. Please try again.", "error");
      return;
    }

    // Success
    state.currentUser = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone,
      department_id: user.department_id,
      district: user.district
    };

    localStorage.setItem("pgrrs_session", JSON.stringify(state.currentUser));
    showToast(`Welcome back, ${state.currentUser.full_name}! (${state.currentUser.role.toUpperCase()})`, "success");
    closeAuthModal();

    if (state.currentUser.role === "citizen") {
      navigate("my-grievances");
    } else {
      navigate("dashboard");
    }
  } catch (err) {
    showToast(err.message || "Failed to sign in", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign In to Civic Portal";
    }
  }
}

async function handleSignUp(userData) {
  const submitBtn = document.getElementById("signup-submit-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Creating Profile...`;
  }

  try {
    const newProfile = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      full_name: userData.full_name.trim(),
      phone: userData.phone.trim(),
      role: userData.role,
      department_id: userData.role !== "citizen" ? userData.department_id : null,
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
      district: newProfile.district
    };

    localStorage.setItem("pgrrs_session", JSON.stringify(state.currentUser));
    showToast("Profile successfully registered in Supabase!", "success");
    closeAuthModal();

    await refreshData();

    if (state.currentUser.role === "citizen") {
      navigate("file-grievance");
    } else {
      navigate("dashboard");
    }
  } catch (err) {
    showToast(err.message || "Registration failed", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Complete Civic Registration";
    }
  }
}

function handleSignOut() {
  state.currentUser = null;
  localStorage.removeItem("pgrrs_session");
  showToast("You have been signed out successfully.", "info");
  navigate("home");
}

// Quick Demo Login Shortcut
function quickDemoLogin(role) {
  if (role === "citizen") {
    handleSignIn("citizen@civic.gov", "Citizen123!");
  } else if (role === "official") {
    handleSignIn("official.water@civic.gov", "Official123!");
  } else if (role === "admin") {
    handleSignIn("admin@civic.gov", "Admin123!");
  }
}

// ==============================================================================
// 9. CITIZEN PORTAL (Submit & My Grievances)
// ==============================================================================
async function handleGrievanceSubmit(e) {
  e.preventDefault();
  if (!state.currentUser) {
    showToast("You must be logged in as Citizen to submit a grievance", "error");
    openAuthModal("signin");
    return;
  }

  const title = document.getElementById("grievance-title").value.trim();
  const departmentId = document.getElementById("grievance-department").value;
  const priority = document.getElementById("grievance-priority").value;
  const district = document.getElementById("grievance-district").value.trim();
  const location = document.getElementById("grievance-location").value.trim();
  const description = document.getElementById("grievance-description").value.trim();
  const attachmentUrl = document.getElementById("grievance-attachment").value.trim() || null;

  if (!title || !departmentId || !priority || !location || !description) {
    showToast("Please fill in all mandatory fields", "error");
    return;
  }

  const dept = state.departments.find(d => d.id === departmentId);
  const departmentName = dept ? dept.name : "Civic Department";
  const trackingId = generateTrackingId();
  const grievanceId = `grv_${Date.now()}`;

  const submitBtn = document.getElementById("submit-grievance-btn");
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Registering Grievance in Supabase...`;
  }

  try {
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
      attachment_url: attachmentUrl,
      status: "Pending",
      assigned_official_id: null,
      assigned_official_name: null,
      resolution_notes: null,
      resolved_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save Grievance
    const saved = await db.createGrievance(newGrievance);

    // Add initial log entry into grievance_logs
    const initialLog = {
      id: `log_${Date.now()}`,
      grievance_id: saved.id,
      tracking_id: saved.tracking_id,
      action: "Grievance Registered",
      previous_status: null,
      new_status: "Pending",
      performed_by_name: state.currentUser.full_name,
      performed_by_role: "Citizen",
      remarks: "Grievance officially lodged through citizen self-service portal.",
      created_at: new Date().toISOString()
    };
    await db.addLog(initialLog);

    await refreshData();

    // Reset Form
    document.getElementById("form-file-grievance").reset();

    // Open Success Acknowledgement Modal
    showReceiptModal(saved);
  } catch (err) {
    showToast(err.message || "Failed to submit grievance", "error");
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Official Grievance";
    }
  }
}

function showReceiptModal(grievance) {
  const modal = document.getElementById("receipt-modal");
  if (!modal) return;

  document.getElementById("receipt-tracking-id").textContent = grievance.tracking_id;
  document.getElementById("receipt-title").textContent = grievance.title;
  document.getElementById("receipt-department").textContent = grievance.department_name;
  document.getElementById("receipt-priority").innerHTML = getPriorityBadgeHtml(grievance.priority);
  document.getElementById("receipt-location").textContent = `${grievance.location}, ${grievance.district}`;
  document.getElementById("receipt-citizen-name").textContent = grievance.citizen_name;
  document.getElementById("receipt-date").textContent = formatDate(grievance.created_at);

  modal.classList.remove("hidden");
}

function closeReceiptModal() {
  const modal = document.getElementById("receipt-modal");
  if (modal) modal.classList.add("hidden");
  navigate("my-grievances");
}

function renderCitizenGrievances() {
  const container = document.getElementById("citizen-grievances-list");
  if (!container) return;

  if (!state.currentUser) {
    container.innerHTML = `<div class="p-8 text-center text-slate-500">Please sign in to view your grievances.</div>`;
    return;
  }

  const myGrievances = state.allGrievances.filter(g => g.citizen_id === state.currentUser.id || g.citizen_email === state.currentUser.email);

  // Update Citizen summary counts
  const totalEl = document.getElementById("citizen-total-count");
  const pendingEl = document.getElementById("citizen-pending-count");
  const resolvedEl = document.getElementById("citizen-resolved-count");

  if (totalEl) totalEl.textContent = myGrievances.length;
  if (pendingEl) pendingEl.textContent = myGrievances.filter(g => g.status === "Pending" || g.status === "In Progress").length;
  if (resolvedEl) resolvedEl.textContent = myGrievances.filter(g => g.status === "Resolved").length;

  if (myGrievances.length === 0) {
    container.innerHTML = `
      <div class="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
        </div>
        <h3 class="text-lg font-bold text-slate-800 mb-1">No Grievances Lodged Yet</h3>
        <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">Have an issue in your locality? Register your first grievance and track each stage of redressal in real-time.</p>
        <button onclick="navigate('file-grievance')" class="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-sm transition">
          Lodge New Grievance
        </button>
      </div>
    `;
    return;
  }

  let html = `<div class="space-y-4">`;
  myGrievances.forEach(g => {
    html += `
      <div class="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="space-y-2 flex-1">
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-mono text-xs font-bold px-2.5 py-1 bg-slate-900 text-amber-400 rounded">${g.tracking_id}</span>
            ${getStatusBadgeHtml(g.status)}
            ${getPriorityBadgeHtml(g.priority)}
            <span class="text-xs text-slate-400">• Filed ${getRelativeTime(g.created_at)}</span>
          </div>
          <h3 class="text-base font-bold text-slate-900 leading-snug">${g.title}</h3>
          <div class="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
            <span class="flex items-center">
              <svg class="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              ${g.department_name}
            </span>
            <span class="flex items-center">
              <svg class="w-3.5 h-3.5 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
              ${g.location}
            </span>
            ${g.assigned_official_name ? `
              <span class="flex items-center text-sky-700 font-medium">
                <svg class="w-3.5 h-3.5 mr-1 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Assigned: ${g.assigned_official_name}
              </span>
            ` : `<span class="text-slate-400 italic">Official not yet assigned</span>`}
          </div>
        </div>
        <div class="flex items-center gap-2 self-start md:self-center">
          <button onclick="openTimelineModal('${g.id}')" class="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition flex items-center">
            <svg class="w-3.5 h-3.5 mr-1.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            View Lifecycle Timeline
          </button>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

// ==============================================================================
// 10. OFFICIAL & ADMIN DASHBOARD
// ==============================================================================
function renderAdminDashboard() {
  const tableBody = document.getElementById("admin-grievances-table-body");
  if (!tableBody) return;

  // Filter list
  let filtered = [...state.allGrievances];

  // If role is Department Official, highlight or default to their department
  if (state.currentUser && state.currentUser.role === "official" && state.currentUser.department_id) {
    const deptPill = document.getElementById("official-dept-banner");
    if (deptPill) {
      const myDept = state.departments.find(d => d.id === state.currentUser.department_id);
      deptPill.innerHTML = `Showing Department Queue: <strong class="text-amber-400">${myDept ? myDept.name : "My Department"}</strong>`;
      deptPill.classList.remove("hidden");
    }
  }

  // Apply filters
  if (state.currentFilter.department !== "all") {
    filtered = filtered.filter(g => g.department_id === state.currentFilter.department);
  }

  if (state.currentFilter.status !== "all") {
    filtered = filtered.filter(g => g.status === state.currentFilter.status);
  }

  if (state.currentFilter.priority !== "all") {
    filtered = filtered.filter(g => g.priority === state.currentFilter.priority);
  }

  if (state.currentFilter.search) {
    const q = state.currentFilter.search.toLowerCase();
    filtered = filtered.filter(
      g =>
        g.tracking_id.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.citizen_name.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q)
    );
  }

  // Update Overview Metrics Cards
  const total = state.allGrievances.length;
  const pending = state.allGrievances.filter(g => g.status === "Pending").length;
  const inProgress = state.allGrievances.filter(g => g.status === "In Progress").length;
  const resolved = state.allGrievances.filter(g => g.status === "Resolved").length;
  const rejected = state.allGrievances.filter(g => g.status === "Rejected").length;

  document.getElementById("metric-total").textContent = total;
  document.getElementById("metric-pending").textContent = pending;
  document.getElementById("metric-inprogress").textContent = inProgress;
  document.getElementById("metric-resolved").textContent = resolved;
  document.getElementById("metric-rejected").textContent = rejected;

  const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  document.getElementById("metric-rate").textContent = `${rate}%`;

  // Render Table Rows
  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="px-6 py-10 text-center text-slate-500">
          <p class="text-sm">No grievances match the selected filter criteria.</p>
        </td>
      </tr>
    `;
    return;
  }

  let rows = "";
  filtered.forEach(g => {
    rows += `
      <tr class="hover:bg-slate-50 transition border-b border-slate-100">
        <td class="px-4 py-3.5 text-xs font-mono font-bold text-slate-900">
          <a href="javascript:void(0)" onclick="openTimelineModal('${g.id}')" class="text-amber-600 hover:underline">
            ${g.tracking_id}
          </a>
        </td>
        <td class="px-4 py-3.5">
          <div class="text-sm font-semibold text-slate-900 line-clamp-1">${g.title}</div>
          <div class="text-xs text-slate-500 flex items-center mt-0.5">
            <span class="font-medium text-slate-700">${g.citizen_name}</span>
            <span class="mx-1">•</span>
            <span>${g.citizen_phone || "No phone"}</span>
          </div>
        </td>
        <td class="px-4 py-3.5 text-xs text-slate-600 font-medium">
          ${g.department_name}
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap">
          ${getPriorityBadgeHtml(g.priority)}
        </td>
        <td class="px-4 py-3.5 whitespace-nowrap">
          ${getStatusBadgeHtml(g.status)}
        </td>
        <td class="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">
          ${g.assigned_official_name ? `
            <span class="inline-flex items-center text-slate-800 font-medium">
              <span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>
              ${g.assigned_official_name}
            </span>
          ` : `<span class="text-slate-400 italic">Unassigned</span>`}
        </td>
        <td class="px-4 py-3.5 text-right whitespace-nowrap">
          <button onclick="openUpdateModal('${g.id}')" class="px-3 py-1.5 text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 shadow-sm transition">
            Action / Update
          </button>
        </td>
      </tr>
    `;
  });
  tableBody.innerHTML = rows;
}

// ==============================================================================
// 11. UPDATE GRIEVANCE MODAL & LOG ENTRY
// ==============================================================================
function openUpdateModal(grievanceId) {
  const grievance = state.allGrievances.find(g => g.id === grievanceId);
  if (!grievance) return;

  state.selectedGrievanceForModal = grievance;
  const modal = document.getElementById("update-grievance-modal");
  if (!modal) return;

  document.getElementById("modal-update-tracking-id").textContent = grievance.tracking_id;
  document.getElementById("modal-update-title").textContent = grievance.title;
  document.getElementById("modal-update-dept").textContent = grievance.department_name;
  document.getElementById("modal-update-citizen").textContent = `${grievance.citizen_name} (${grievance.citizen_phone})`;
  document.getElementById("modal-update-location").textContent = `${grievance.location}, ${grievance.district}`;
  document.getElementById("modal-update-description").textContent = grievance.description;

  // Set current status
  document.getElementById("update-status-select").value = grievance.status;

  // Populate official assignment options
  const officialSelect = document.getElementById("update-assigned-official");
  officialSelect.innerHTML = `<option value="">-- Leave Unassigned --</option>`;
  state.officials.forEach(off => {
    const isSelected = grievance.assigned_official_id === off.id ? "selected" : "";
    officialSelect.innerHTML += `<option value="${off.id}" ${isSelected}>${off.full_name} (${off.role})</option>`;
  });

  // Pre-fill existing resolution note if any
  document.getElementById("update-resolution-notes").value = grievance.resolution_notes || "";

  modal.classList.remove("hidden");
}

function closeUpdateModal() {
  const modal = document.getElementById("update-grievance-modal");
  if (modal) modal.classList.add("hidden");
  state.selectedGrievanceForModal = null;
}

async function handleSaveGrievanceUpdate() {
  const g = state.selectedGrievanceForModal;
  if (!g) return;

  const newStatus = document.getElementById("update-status-select").value;
  const assignedOfficialId = document.getElementById("update-assigned-official").value || null;
  const remarks = document.getElementById("update-resolution-notes").value.trim();

  let assignedOfficialName = null;
  if (assignedOfficialId) {
    const off = state.officials.find(o => o.id === assignedOfficialId);
    assignedOfficialName = off ? off.full_name : null;
  }

  const updates = {
    status: newStatus,
    assigned_official_id: assignedOfficialId,
    assigned_official_name: assignedOfficialName,
    resolution_notes: remarks,
    resolved_at: newStatus === "Resolved" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString()
  };

  const saveBtn = document.getElementById("btn-save-grievance-update");
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = `Saving Updates...`;
  }

  try {
    // 1. Update Grievances Table
    await db.updateGrievance(g.id, updates);

    // 2. Automatically insert record into grievance_logs
    const actorName = state.currentUser ? state.currentUser.full_name : "Department Official";
    const actorRole = state.currentUser ? (state.currentUser.role === "admin" ? "Admin" : "Department Official") : "Department Official";

    let actionName = "Status Updated";
    if (g.status !== newStatus) {
      actionName = newStatus === "Resolved" ? "Grievance Resolved" : (newStatus === "Rejected" ? "Grievance Rejected" : `Status Changed to ${newStatus}`);
    } else if (g.assigned_official_id !== assignedOfficialId) {
      actionName = "Official Reassigned";
    }

    const logEntry = {
      id: `log_${Date.now()}`,
      grievance_id: g.id,
      tracking_id: g.tracking_id,
      action: actionName,
      previous_status: g.status,
      new_status: newStatus,
      performed_by_name: actorName,
      performed_by_role: actorRole,
      remarks: remarks || `Status transitioned from ${g.status} to ${newStatus}.`,
      created_at: new Date().toISOString()
    };

    await db.addLog(logEntry);

    // Trigger celebration if resolved
    if (newStatus === "Resolved") {
      triggerConfetti();
    }

    showToast(`Grievance ${g.tracking_id} updated to [${newStatus}]!`, "success");
    closeUpdateModal();

    await refreshData();
    renderAdminDashboard();
  } catch (err) {
    showToast(err.message || "Failed to update grievance", "error");
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Changes & Log Audit Entry";
    }
  }
}

// ==============================================================================
// 12. LIFECYCLE TIMELINE MODAL (From grievance_logs)
// ==============================================================================
async function openTimelineModal(grievanceId) {
  let grievance = state.allGrievances.find(g => g.id === grievanceId);
  if (!grievance) {
    // Attempt lookup by tracking id if needed
    grievance = await db.getGrievanceByTrackingId(grievanceId);
  }
  if (!grievance) return;

  const modal = document.getElementById("timeline-modal");
  if (!modal) return;

  document.getElementById("modal-timeline-tracking-id").textContent = grievance.tracking_id;
  document.getElementById("modal-timeline-title").textContent = grievance.title;
  document.getElementById("modal-timeline-status-badge").innerHTML = getStatusBadgeHtml(grievance.status);
  document.getElementById("modal-timeline-priority-badge").innerHTML = getPriorityBadgeHtml(grievance.priority);
  document.getElementById("modal-timeline-dept").textContent = grievance.department_name;
  document.getElementById("modal-timeline-location").textContent = `${grievance.location}, ${grievance.district}`;
  document.getElementById("modal-timeline-citizen").textContent = state.currentUser ? grievance.citizen_name : maskName(grievance.citizen_name);
  document.getElementById("modal-timeline-desc").textContent = grievance.description;

  const container = document.getElementById("timeline-logs-container");
  container.innerHTML = `<div class="p-4 text-center text-slate-400">Loading audit trail logs...</div>`;

  modal.classList.remove("hidden");

  // Load logs
  const logs = await db.getLogs(grievance.id);

  if (logs.length === 0) {
    container.innerHTML = `<div class="p-4 text-center text-slate-400">No logs found for this grievance.</div>`;
    return;
  }

  let html = `<div class="relative pl-6 space-y-6">`;
  logs.forEach((log, index) => {
    const isLatest = index === logs.length - 1;
    const nodeColor =
      log.new_status === "Resolved"
        ? "bg-emerald-500 ring-4 ring-emerald-100"
        : log.new_status === "In Progress"
        ? "bg-blue-500 ring-4 ring-blue-100"
        : log.new_status === "Rejected"
        ? "bg-rose-500 ring-4 ring-rose-100"
        : "bg-amber-500 ring-4 ring-amber-100";

    html += `
      <div class="relative pb-2 timeline-item">
        <div class="timeline-stem"></div>
        <div class="absolute -left-6 top-1 w-4 h-4 rounded-full ${nodeColor} z-10"></div>
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-3.5 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <div class="font-bold text-xs text-slate-900">${log.action}</div>
            <div class="text-[11px] text-slate-400 font-mono">${formatDate(log.created_at)}</div>
          </div>
          <div class="text-xs text-slate-600 mb-2">
            By <span class="font-semibold text-slate-800">${log.performed_by_name}</span>
            <span class="text-slate-400">(${log.performed_by_role})</span>
          </div>
          ${log.remarks ? `
            <div class="text-xs text-slate-700 bg-white border border-slate-200 rounded p-2.5 italic">
              "${log.remarks}"
            </div>
          ` : ""}
          ${log.new_status ? `
            <div class="mt-2 flex items-center text-xs">
              <span class="text-slate-400 mr-1.5">State:</span>
              ${getStatusBadgeHtml(log.new_status)}
            </div>
          ` : ""}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function closeTimelineModal() {
  const modal = document.getElementById("timeline-modal");
  if (modal) modal.classList.add("hidden");
}

// ==============================================================================
// 13. PUBLIC TRACKING & SEARCH
// ==============================================================================
async function handlePublicSearch(trackingId) {
  if (!trackingId || !trackingId.trim()) {
    showToast("Please enter a valid Grievance Tracking ID", "error");
    return;
  }

  const cleanId = trackingId.trim().toUpperCase();
  const resultCard = document.getElementById("public-track-result");
  const notFoundCard = document.getElementById("public-track-notfound");
  const trackInput = document.getElementById("public-tracking-input");

  if (trackInput) trackInput.value = cleanId;

  // Make sure view is visible
  navigate("public-track");

  const grievance = await db.getGrievanceByTrackingId(cleanId);

  if (!grievance) {
    if (resultCard) resultCard.classList.add("hidden");
    if (notFoundCard) {
      notFoundCard.classList.remove("hidden");
      document.getElementById("notfound-id").textContent = cleanId;
    }
    return;
  }

  if (notFoundCard) notFoundCard.classList.add("hidden");
  if (resultCard) {
    resultCard.classList.remove("hidden");

    document.getElementById("track-res-id").textContent = grievance.tracking_id;
    document.getElementById("track-res-title").textContent = grievance.title;
    document.getElementById("track-res-status").innerHTML = getStatusBadgeHtml(grievance.status);
    document.getElementById("track-res-priority").innerHTML = getPriorityBadgeHtml(grievance.priority);
    document.getElementById("track-res-dept").textContent = grievance.department_name;
    document.getElementById("track-res-date").textContent = formatDate(grievance.created_at);
    document.getElementById("track-res-location").textContent = `${grievance.location}, ${grievance.district}`;
    document.getElementById("track-res-citizen").textContent = maskName(grievance.citizen_name);
    document.getElementById("track-res-desc").textContent = grievance.description;

    // Load Timeline into public result
    const logsContainer = document.getElementById("track-res-timeline");
    logsContainer.innerHTML = `<div class="p-3 text-xs text-slate-400">Loading audit trail...</div>`;

    const logs = await db.getLogs(grievance.id);
    if (logs.length === 0) {
      logsContainer.innerHTML = `<div class="text-xs text-slate-400">No logs found.</div>`;
    } else {
      let lHtml = `<div class="space-y-3">`;
      logs.forEach(log => {
        lHtml += `
          <div class="border-l-2 border-amber-500 pl-3 py-1">
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold text-slate-800">${log.action}</span>
              <span class="text-slate-400 text-[10px] font-mono">${formatDate(log.created_at)}</span>
            </div>
            <div class="text-xs text-slate-600 mt-0.5">${log.remarks || "Updated by civic authority."}</div>
          </div>
        `;
      });
      lHtml += `</div>`;
      logsContainer.innerHTML = lHtml;
    }
  }
}

// Quick Try Demo Search
function tryDemoTracking(demoId) {
  const input = document.getElementById("hero-tracking-input") || document.getElementById("public-tracking-input");
  if (input) input.value = demoId;
  handlePublicSearch(demoId);
}

// ==============================================================================
// 14. PUBLIC ANALYTICS & CIVIC TRANSPARENCY
// ==============================================================================
function renderHomeStats() {
  const grievances = state.allGrievances;
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === "Resolved").length;
  const inProgress = grievances.filter(g => g.status === "In Progress").length;
  const pending = grievances.filter(g => g.status === "Pending").length;

  const totalEl = document.getElementById("home-total-count");
  const resolvedEl = document.getElementById("home-resolved-count");
  const inProgressEl = document.getElementById("home-inprogress-count");
  const rateEl = document.getElementById("home-rate-count");

  if (totalEl) totalEl.textContent = total;
  if (resolvedEl) resolvedEl.textContent = resolved;
  if (inProgressEl) inProgressEl.textContent = inProgress;
  if (rateEl) rateEl.textContent = `${total > 0 ? Math.round((resolved / total) * 100) : 0}%`;
}

function renderPublicAnalytics() {
  const grievances = state.allGrievances;
  const total = grievances.length;
  const resolved = grievances.filter(g => g.status === "Resolved").length;
  const inProgress = grievances.filter(g => g.status === "In Progress").length;
  const pending = grievances.filter(g => g.status === "Pending").length;
  const rejected = grievances.filter(g => g.status === "Rejected").length;

  document.getElementById("analytics-total").textContent = total;
  document.getElementById("analytics-resolved").textContent = resolved;
  document.getElementById("analytics-inprogress").textContent = inProgress;
  document.getElementById("analytics-pending").textContent = pending;

  // Department Breakdown Bars
  const deptContainer = document.getElementById("analytics-department-breakdown");
  if (deptContainer) {
    let html = `<div class="space-y-4">`;
    state.departments.forEach(dept => {
      const deptGrievances = grievances.filter(g => g.department_id === dept.id);
      const deptTotal = deptGrievances.length;
      const deptResolved = deptGrievances.filter(g => g.status === "Resolved").length;
      const pct = deptTotal > 0 ? Math.round((deptResolved / deptTotal) * 100) : 0;

      html += `
        <div>
          <div class="flex justify-between items-center text-xs font-semibold mb-1">
            <span class="text-slate-800">${dept.name}</span>
            <span class="text-slate-500">${deptResolved} / ${deptTotal} Resolved (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div class="bg-gradient-to-r from-amber-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });
    html += `</div>`;
    deptContainer.innerHTML = html;
  }

  // Priority Breakdown Bars
  const priorityContainer = document.getElementById("analytics-priority-breakdown");
  if (priorityContainer) {
    const priorities = ["Urgent", "High", "Medium", "Low"];
    const colors = {
      Urgent: "bg-rose-500",
      High: "bg-orange-500",
      Medium: "bg-amber-400",
      Low: "bg-slate-400"
    };

    let pHtml = `<div class="space-y-4">`;
    priorities.forEach(p => {
      const count = grievances.filter(g => g.priority === p).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;

      pHtml += `
        <div>
          <div class="flex justify-between items-center text-xs font-semibold mb-1">
            <span class="text-slate-800">${p} Priority</span>
            <span class="text-slate-500">${count} (${pct}%)</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div class="${colors[p]} h-2.5 rounded-full" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    });
    pHtml += `</div>`;
    priorityContainer.innerHTML = pHtml;
  }

  // Recent Redressals Ticker / Feed
  const recentFeed = document.getElementById("analytics-recent-feed");
  if (recentFeed) {
    const recentResolved = grievances
      .filter(g => g.status === "Resolved")
      .slice(0, 5);

    if (recentResolved.length === 0) {
      recentFeed.innerHTML = `<div class="text-xs text-slate-400 p-4">No recent resolutions.</div>`;
    } else {
      let fHtml = `<div class="space-y-3">`;
      recentResolved.forEach(g => {
        fHtml += `
          <div class="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-3">
            <div class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              ✓
            </div>
            <div class="flex-1">
              <div class="text-xs font-bold text-slate-900">${g.title}</div>
              <div class="text-[11px] text-slate-600 mt-0.5">${g.department_name} • Resolved on ${formatDate(g.resolved_at || g.updated_at)}</div>
              <div class="text-[11px] text-emerald-800 font-medium mt-1">Resolution: "${g.resolution_notes || "Completed successfully"}"</div>
            </div>
          </div>
        `;
      });
      fHtml += `</div>`;
      recentFeed.innerHTML = fHtml;
    }
  }
}

// ==============================================================================
// 15. CSV EXPORT UTILITY
// ==============================================================================
function exportGrievancesToCSV() {
  const grievances = state.allGrievances;
  if (!grievances || grievances.length === 0) {
    showToast("No data to export", "info");
    return;
  }

  const headers = [
    "Tracking ID",
    "Title",
    "Citizen Name",
    "Citizen Email",
    "Citizen Phone",
    "Department",
    "Priority",
    "Location",
    "District",
    "Status",
    "Assigned Official",
    "Resolution Notes",
    "Created Date"
  ];

  const rows = grievances.map(g => [
    `"${g.tracking_id}"`,
    `"${(g.title || "").replace(/"/g, '""')}"`,
    `"${(g.citizen_name || "").replace(/"/g, '""')}"`,
    `"${g.citizen_email || ""}"`,
    `"${g.citizen_phone || ""}"`,
    `"${(g.department_name || "").replace(/"/g, '""')}"`,
    `"${g.priority}"`,
    `"${(g.location || "").replace(/"/g, '""')}"`,
    `"${(g.district || "").replace(/"/g, '""')}"`,
    `"${g.status}"`,
    `"${(g.assigned_official_name || "Unassigned").replace(/"/g, '""')}"`,
    `"${(g.resolution_notes || "").replace(/"/g, '""')}"`,
    `"${formatDate(g.created_at)}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `PGRRS_Grievances_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast("Grievance report exported successfully!", "success");
}

// ==============================================================================
// 16. SQL SETUP MODAL & SUPABASE HEALTH
// ==============================================================================
function openSqlModal() {
  const modal = document.getElementById("sql-setup-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeSqlModal() {
  const modal = document.getElementById("sql-setup-modal");
  if (modal) modal.classList.add("hidden");
}

async function retrySupabaseConnection() {
  const btn = document.getElementById("retry-supabase-btn");
  if (btn) btn.innerHTML = `Testing Connection...`;

  isSupabaseOnline = await db.testSupabase();
  updateSupabaseStatusBadge(isSupabaseOnline);

  if (isSupabaseOnline) {
    showToast("Connected to live Supabase database!", "success");
    await refreshData();
    closeSqlModal();
    navigate(state.activeView);
  } else {
    showToast("Supabase responded, but tables are pending. Run the SQL script in Supabase SQL Editor.", "info");
  }

  if (btn) btn.innerHTML = `Check Connection Again`;
}

function copySqlToClipboard() {
  const codeEl = document.getElementById("sql-code-snippet");
  if (!codeEl) return;
  navigator.clipboard.writeText(codeEl.innerText).then(() => {
    showToast("SQL Schema script copied to clipboard!", "success");
  });
}

// ==============================================================================
// 17. EVENT LISTENERS SETUP
// ==============================================================================
function setupEventListeners() {
  // Navigation Links
  document.querySelectorAll("[data-nav-target]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const target = btn.getAttribute("data-nav-target");
      navigate(target);
    });
  });

  // Hero Search
  const heroSearchBtn = document.getElementById("hero-track-btn");
  const heroSearchInput = document.getElementById("hero-tracking-input");
  if (heroSearchBtn && heroSearchInput) {
    heroSearchBtn.addEventListener("click", () => {
      handlePublicSearch(heroSearchInput.value);
    });
    heroSearchInput.addEventListener("keypress", e => {
      if (e.key === "Enter") handlePublicSearch(heroSearchInput.value);
    });
  }

  // Public Search View Search
  const publicSearchBtn = document.getElementById("public-track-btn");
  const publicSearchInput = document.getElementById("public-tracking-input");
  if (publicSearchBtn && publicSearchInput) {
    publicSearchBtn.addEventListener("click", () => {
      handlePublicSearch(publicSearchInput.value);
    });
    publicSearchInput.addEventListener("keypress", e => {
      if (e.key === "Enter") handlePublicSearch(publicSearchInput.value);
    });
  }

  // Sign In Form
  const signinForm = document.getElementById("auth-signin-form");
  if (signinForm) {
    signinForm.addEventListener("submit", e => {
      e.preventDefault();
      const email = document.getElementById("signin-email").value;
      const pass = document.getElementById("signin-password").value;
      handleSignIn(email, pass);
    });
  }

  // Sign Up Form
  const signupForm = document.getElementById("auth-signup-form");
  if (signupForm) {
    signupForm.addEventListener("submit", e => {
      e.preventDefault();
      const role = document.getElementById("signup-role").value;
      const dept = document.getElementById("signup-department").value;

      if (role !== "citizen" && !dept) {
        showToast("Please choose a department for official / admin roles", "error");
        return;
      }

      handleSignUp({
        full_name: document.getElementById("signup-name").value,
        email: document.getElementById("signup-email").value,
        phone: document.getElementById("signup-phone").value,
        password: document.getElementById("signup-password").value,
        role: role,
        department_id: dept,
        district: document.getElementById("signup-district").value
      });
    });

    // Show/hide department selector on role switch in signup
    const roleSelect = document.getElementById("signup-role");
    const deptWrapper = document.getElementById("signup-dept-wrapper");
    if (roleSelect && deptWrapper) {
      roleSelect.addEventListener("change", () => {
        if (roleSelect.value === "citizen") {
          deptWrapper.classList.add("hidden");
        } else {
          deptWrapper.classList.remove("hidden");
        }
      });
    }
  }

  // Citizen Submit Grievance Form
  const grievanceForm = document.getElementById("form-file-grievance");
  if (grievanceForm) {
    grievanceForm.addEventListener("submit", handleGrievanceSubmit);
  }

  // Dashboard Filters
  const filterDept = document.getElementById("filter-department");
  const filterStatus = document.getElementById("filter-status");
  const filterPriority = document.getElementById("filter-priority");
  const filterSearch = document.getElementById("filter-search");

  const applyFilters = () => {
    state.currentFilter.department = filterDept ? filterDept.value : "all";
    state.currentFilter.status = filterStatus ? filterStatus.value : "all";
    state.currentFilter.priority = filterPriority ? filterPriority.value : "all";
    state.currentFilter.search = filterSearch ? filterSearch.value.trim() : "";
    renderAdminDashboard();
  };

  if (filterDept) filterDept.addEventListener("change", applyFilters);
  if (filterStatus) filterStatus.addEventListener("change", applyFilters);
  if (filterPriority) filterPriority.addEventListener("change", applyFilters);
  if (filterSearch) filterSearch.addEventListener("input", applyFilters);

  // Save Grievance Update
  const saveUpdateBtn = document.getElementById("btn-save-grievance-update");
  if (saveUpdateBtn) {
    saveUpdateBtn.addEventListener("click", handleSaveGrievanceUpdate);
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

// Global bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", initApp);
