// ── Permission Levels ─────────────────────────────────────────────────────────
export const PERMISSION = {
  SUPER_ADMIN:  "SUPER_ADMIN",  // SAN TECH — manages tenant subscriptions
  FULL:         "FULL",         // System Administrator — full tenant access
  EXECUTIVE:    "EXECUTIVE",    // Owner / Director
  MANAGEMENT:   "MANAGEMENT",   // Store Manager, Branch Manager
  OPERATIONAL:  "OPERATIONAL",  // Cashier, Warehouse, Procurement, etc.
  FINANCIAL:    "FINANCIAL",    // Accountant, Payroll Officer
  SUPPORT:      "SUPPORT",      // HR, Customer Service, Marketing, IT
  READ_ONLY:    "READ_ONLY",    // Auditor, Data Analyst, Report Viewer
  PORTAL:       "PORTAL",       // Supplier, Customer
} as const;

export type PermissionLevel = typeof PERMISSION[keyof typeof PERMISSION];

// ── Roles ─────────────────────────────────────────────────────────────────────
export const ROLE = {
  SUPER_ADMIN:            "SUPER_ADMIN",
  SAN_TECH:               "SAN_TECH",
  SYSTEM_ADMIN:           "SYSTEM_ADMIN",
  OWNER:                  "OWNER",
  DIRECTOR:               "DIRECTOR",
  STORE_MANAGER:          "STORE_MANAGER",
  BRANCH_MANAGER:         "BRANCH_MANAGER",
  CASHIER:                "CASHIER",
  INVENTORY_MANAGER:      "INVENTORY_MANAGER",
  PROCUREMENT_OFFICER:    "PROCUREMENT_OFFICER",
  WAREHOUSE_OFFICER:      "WAREHOUSE_OFFICER",
  SALES_SUPERVISOR:       "SALES_SUPERVISOR",
  SHELF_ATTENDANT:        "SHELF_ATTENDANT",
  CUSTOMER_SERVICE:       "CUSTOMER_SERVICE",
  ACCOUNTANT:             "ACCOUNTANT",
  HR_OFFICER:             "HR_OFFICER",
  MARKETING_OFFICER:      "MARKETING_OFFICER",
  LOYALTY_OFFICER:        "LOYALTY_OFFICER",
  AUDITOR:                "AUDITOR",
  SECURITY_OFFICER:       "SECURITY_OFFICER",
  DELIVERY_OFFICER:       "DELIVERY_OFFICER",
  QUALITY_CONTROL:        "QUALITY_CONTROL",
  MAINTENANCE_OFFICER:    "MAINTENANCE_OFFICER",
  IT_SUPPORT:             "IT_SUPPORT",
  DATA_ANALYST:           "DATA_ANALYST",
  REPORT_VIEWER:          "REPORT_VIEWER",
  PAYROLL_OFFICER:        "PAYROLL_OFFICER",
  LOSS_PREVENTION:        "LOSS_PREVENTION",
  SUPPLIER:               "SUPPLIER",
} as const;

export type Role = typeof ROLE[keyof typeof ROLE];

// ── Modules ───────────────────────────────────────────────────────────────────
export const MODULE = {
  DASHBOARD:    "DASHBOARD",
  POS:          "POS",
  PRODUCTS:     "PRODUCTS",
  INVENTORY:    "INVENTORY",
  PURCHASING:   "PURCHASING",
  SUPPLIERS:    "SUPPLIERS",
  SALES:        "SALES",
  FINANCIALS:   "FINANCIALS",
  CUSTOMERS:    "CUSTOMERS",
  LOYALTY:      "LOYALTY",
  PROMOTIONS:   "PROMOTIONS",
  REPORTS:      "REPORTS",
  USERS:        "USERS",
  HR:           "HR",
  PAYROLL:      "PAYROLL",
  WAREHOUSE:    "WAREHOUSE",
  DELIVERY:     "DELIVERY",
  AUDIT_LOGS:   "AUDIT_LOGS",
  SETTINGS:     "SETTINGS",
  BACKUP:       "BACKUP",
} as const;

export type Module = typeof MODULE[keyof typeof MODULE];

// ── Role → Permission Level ───────────────────────────────────────────────────
export const ROLE_PERMISSION: Record<string, PermissionLevel> = {
  SUPER_ADMIN:         PERMISSION.SUPER_ADMIN,
  SAN_TECH:            PERMISSION.SUPER_ADMIN,
  SYSTEM_ADMIN:        PERMISSION.FULL,
  OWNER:               PERMISSION.EXECUTIVE,
  DIRECTOR:            PERMISSION.EXECUTIVE,
  STORE_MANAGER:       PERMISSION.MANAGEMENT,
  BRANCH_MANAGER:      PERMISSION.MANAGEMENT,
  CASHIER:             PERMISSION.OPERATIONAL,
  INVENTORY_MANAGER:   PERMISSION.OPERATIONAL,
  PROCUREMENT_OFFICER: PERMISSION.OPERATIONAL,
  WAREHOUSE_OFFICER:   PERMISSION.OPERATIONAL,
  SALES_SUPERVISOR:    PERMISSION.OPERATIONAL,
  SHELF_ATTENDANT:     PERMISSION.OPERATIONAL,
  SECURITY_OFFICER:    PERMISSION.OPERATIONAL,
  DELIVERY_OFFICER:    PERMISSION.OPERATIONAL,
  QUALITY_CONTROL:     PERMISSION.OPERATIONAL,
  MAINTENANCE_OFFICER: PERMISSION.OPERATIONAL,
  LOSS_PREVENTION:     PERMISSION.OPERATIONAL,
  ACCOUNTANT:          PERMISSION.FINANCIAL,
  PAYROLL_OFFICER:     PERMISSION.FINANCIAL,
  CUSTOMER_SERVICE:    PERMISSION.SUPPORT,
  HR_OFFICER:          PERMISSION.SUPPORT,
  MARKETING_OFFICER:   PERMISSION.SUPPORT,
  LOYALTY_OFFICER:     PERMISSION.SUPPORT,
  IT_SUPPORT:          PERMISSION.SUPPORT,
  AUDITOR:             PERMISSION.READ_ONLY,
  DATA_ANALYST:        PERMISSION.READ_ONLY,
  REPORT_VIEWER:       PERMISSION.READ_ONLY,
  SUPPLIER:            PERMISSION.PORTAL,
};

// ── Role → Allowed Modules ────────────────────────────────────────────────────
const ALL = Object.values(MODULE) as Module[];

export const ROLE_MODULES: Record<string, Module[]> = {
  SYSTEM_ADMIN: ALL,

  OWNER: [
    MODULE.DASHBOARD, MODULE.SALES, MODULE.FINANCIALS, MODULE.INVENTORY,
    MODULE.PRODUCTS, MODULE.PURCHASING, MODULE.SUPPLIERS, MODULE.CUSTOMERS,
    MODULE.LOYALTY, MODULE.PROMOTIONS, MODULE.REPORTS, MODULE.HR,
    MODULE.PAYROLL, MODULE.WAREHOUSE, MODULE.DELIVERY, MODULE.SETTINGS,
  ],

  DIRECTOR: [
    MODULE.DASHBOARD, MODULE.SALES, MODULE.FINANCIALS, MODULE.INVENTORY,
    MODULE.PRODUCTS, MODULE.PURCHASING, MODULE.SUPPLIERS, MODULE.CUSTOMERS,
    MODULE.LOYALTY, MODULE.PROMOTIONS, MODULE.REPORTS, MODULE.HR,
    MODULE.WAREHOUSE, MODULE.DELIVERY,
  ],

  STORE_MANAGER: [
    MODULE.DASHBOARD, MODULE.POS, MODULE.PRODUCTS, MODULE.INVENTORY,
    MODULE.SALES, MODULE.CUSTOMERS, MODULE.LOYALTY, MODULE.PROMOTIONS,
    MODULE.PURCHASING, MODULE.WAREHOUSE, MODULE.DELIVERY, MODULE.REPORTS,
    MODULE.HR, MODULE.SETTINGS,
  ],

  BRANCH_MANAGER: [
    MODULE.DASHBOARD, MODULE.POS, MODULE.PRODUCTS, MODULE.INVENTORY,
    MODULE.SALES, MODULE.CUSTOMERS, MODULE.PURCHASING, MODULE.WAREHOUSE,
    MODULE.REPORTS, MODULE.HR,
  ],

  CASHIER: [
    MODULE.POS, MODULE.CUSTOMERS, MODULE.SALES,
  ],

  INVENTORY_MANAGER: [
    MODULE.INVENTORY, MODULE.PRODUCTS, MODULE.WAREHOUSE, MODULE.REPORTS,
  ],

  PROCUREMENT_OFFICER: [
    MODULE.PURCHASING, MODULE.SUPPLIERS, MODULE.PRODUCTS, MODULE.INVENTORY,
  ],

  WAREHOUSE_OFFICER: [
    MODULE.WAREHOUSE, MODULE.INVENTORY, MODULE.PRODUCTS,
  ],

  SALES_SUPERVISOR: [
    MODULE.POS, MODULE.SALES, MODULE.CUSTOMERS, MODULE.REPORTS,
  ],

  SHELF_ATTENDANT: [
    MODULE.INVENTORY, MODULE.PRODUCTS,
  ],

  CUSTOMER_SERVICE: [
    MODULE.CUSTOMERS, MODULE.LOYALTY, MODULE.SALES,
  ],

  ACCOUNTANT: [
    MODULE.FINANCIALS, MODULE.REPORTS, MODULE.PURCHASING,
    MODULE.SUPPLIERS, MODULE.PAYROLL,
  ],

  PAYROLL_OFFICER: [
    MODULE.PAYROLL, MODULE.HR, MODULE.REPORTS,
  ],

  HR_OFFICER: [
    MODULE.HR, MODULE.PAYROLL, MODULE.REPORTS,
  ],

  MARKETING_OFFICER: [
    MODULE.PROMOTIONS, MODULE.LOYALTY, MODULE.CUSTOMERS, MODULE.REPORTS,
  ],

  LOYALTY_OFFICER: [
    MODULE.LOYALTY, MODULE.CUSTOMERS, MODULE.PROMOTIONS,
  ],

  AUDITOR: [
    MODULE.DASHBOARD, MODULE.REPORTS, MODULE.AUDIT_LOGS,
    MODULE.FINANCIALS, MODULE.INVENTORY, MODULE.SALES,
  ],

  DATA_ANALYST: [
    MODULE.DASHBOARD, MODULE.REPORTS, MODULE.SALES,
    MODULE.INVENTORY, MODULE.CUSTOMERS, MODULE.FINANCIALS,
  ],

  REPORT_VIEWER: [
    MODULE.DASHBOARD, MODULE.REPORTS,
  ],

  SECURITY_OFFICER: [
    MODULE.DASHBOARD, MODULE.AUDIT_LOGS,
  ],

  LOSS_PREVENTION: [
    MODULE.AUDIT_LOGS, MODULE.INVENTORY, MODULE.REPORTS,
  ],

  DELIVERY_OFFICER: [
    MODULE.DELIVERY,
  ],

  QUALITY_CONTROL: [
    MODULE.INVENTORY, MODULE.PRODUCTS,
  ],

  MAINTENANCE_OFFICER: [
    MODULE.DASHBOARD,
  ],

  IT_SUPPORT: [
    MODULE.SETTINGS, MODULE.BACKUP, MODULE.AUDIT_LOGS,
  ],

  SUPPLIER: [
    MODULE.PURCHASING, MODULE.SUPPLIERS,
  ],
};

// ── Role Labels ───────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN:         "Super Administrator",
  SAN_TECH:            "SAN TECH Admin",
  SYSTEM_ADMIN:        "System Administrator",
  OWNER:               "Owner / Director",
  DIRECTOR:            "Director",
  STORE_MANAGER:       "Store Manager",
  BRANCH_MANAGER:      "Branch Manager",
  CASHIER:             "Cashier",
  INVENTORY_MANAGER:   "Inventory Manager",
  PROCUREMENT_OFFICER: "Procurement Officer",
  WAREHOUSE_OFFICER:   "Warehouse Officer",
  SALES_SUPERVISOR:    "Sales Supervisor",
  SHELF_ATTENDANT:     "Shelf Attendant",
  CUSTOMER_SERVICE:    "Customer Service Officer",
  ACCOUNTANT:          "Accountant",
  PAYROLL_OFFICER:     "Payroll Officer",
  HR_OFFICER:          "HR Officer",
  MARKETING_OFFICER:   "Marketing Officer",
  LOYALTY_OFFICER:     "Loyalty Program Officer",
  AUDITOR:             "Auditor",
  SECURITY_OFFICER:    "Security Officer",
  DELIVERY_OFFICER:    "Delivery Officer",
  QUALITY_CONTROL:     "Quality Control Officer",
  MAINTENANCE_OFFICER: "Maintenance Officer",
  IT_SUPPORT:          "IT Support Officer",
  DATA_ANALYST:        "Data Analyst",
  REPORT_VIEWER:       "Report Viewer",
  LOSS_PREVENTION:     "Loss Prevention Officer",
  PAYROLL:             "Payroll Officer",
  SUPPLIER:            "Supplier",
};

// ── Role → Landing Route ──────────────────────────────────────────────────────
export const ROLE_ROUTES: Record<string, string> = {
  SUPER_ADMIN:         "/super-admin",
  SAN_TECH:            "/super-admin",
  SYSTEM_ADMIN:        "/dashboard",
  OWNER:               "/dashboard",
  DIRECTOR:            "/dashboard",
  STORE_MANAGER:       "/dashboard",
  BRANCH_MANAGER:      "/dashboard",
  CASHIER:             "/dashboard/pos",
  INVENTORY_MANAGER:   "/dashboard/inventory",
  PROCUREMENT_OFFICER: "/dashboard/purchasing",
  WAREHOUSE_OFFICER:   "/dashboard/warehouse",
  SALES_SUPERVISOR:    "/dashboard/sales",
  SHELF_ATTENDANT:     "/dashboard/inventory",
  CUSTOMER_SERVICE:    "/dashboard/customers",
  ACCOUNTANT:          "/dashboard/financials",
  PAYROLL_OFFICER:     "/dashboard/payroll",
  HR_OFFICER:          "/dashboard/hr",
  MARKETING_OFFICER:   "/dashboard/promotions",
  LOYALTY_OFFICER:     "/dashboard/loyalty",
  AUDITOR:             "/dashboard/reports",
  DATA_ANALYST:        "/dashboard/reports",
  REPORT_VIEWER:       "/dashboard/reports",
  SECURITY_OFFICER:    "/dashboard/audit",
  DELIVERY_OFFICER:    "/dashboard/delivery",
  QUALITY_CONTROL:     "/dashboard/inventory",
  MAINTENANCE_OFFICER: "/dashboard",
  IT_SUPPORT:          "/dashboard/settings",
  LOSS_PREVENTION:     "/dashboard/audit",
  SUPPLIER:            "/dashboard/suppliers",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
export function getPermissionLevel(role: string): PermissionLevel {
  return ROLE_PERMISSION[role?.toUpperCase()] ?? PERMISSION.READ_ONLY;
}

export function canAccessModule(role: string, module: Module): boolean {
  const r = role?.toUpperCase();
  // System admins always have full access within their tenant
  if (r === ROLE.SYSTEM_ADMIN) return true;
  return (ROLE_MODULES[r] ?? []).includes(module);
}

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role?.toUpperCase()] ?? role ?? "User";
}

export function getRoleRoute(role: string): string {
  return ROLE_ROUTES[role?.toUpperCase()] ?? "/dashboard";
}

export function isSuperAdmin(role: string): boolean {
  const r = role?.toUpperCase();
  return r === ROLE.SUPER_ADMIN || r === ROLE.SAN_TECH;
}
