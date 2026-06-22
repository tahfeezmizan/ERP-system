export const PERMISSIONS = {
  // Land
  "land.view": "View land records",
  "land.create": "Create land records",
  "land.edit": "Edit land records",
  "land.delete": "Delete land records",
  // Project
  "project.view": "View projects",
  "project.create": "Create projects",
  "project.edit": "Edit projects",
  "project.delete": "Delete projects",
  // Property
  "property.view": "View properties",
  "property.create": "Create properties",
  "property.edit": "Edit properties",
  "property.delete": "Delete properties",
  // CRM
  "crm.view": "View CRM",
  "crm.create": "Create leads",
  "crm.edit": "Edit leads",
  "crm.delete": "Delete leads",
  // Booking
  "booking.view": "View bookings",
  "booking.create": "Create bookings",
  "booking.approve": "Approve bookings",
  "booking.cancel": "Cancel bookings",
  "booking.transfer": "Transfer bookings",
  // Collection
  "collection.view": "View collections",
  "collection.create": "Record collections",
  "collection.edit": "Edit collections",
  // Customer
  "customer.view": "View customers",
  "customer.create": "Create customers",
  "customer.edit": "Edit customers",
  // Construction
  "construction.view": "View construction",
  "construction.edit": "Edit construction",
  // Procurement
  "procurement.view": "View procurement",
  "procurement.create": "Create procurement",
  "procurement.approve": "Approve procurement",
  // Inventory
  "inventory.view": "View inventory",
  "inventory.edit": "Edit inventory",
  // Contractor
  "contractor.view": "View contractors",
  "contractor.edit": "Edit contractors",
  // Finance
  "finance.view": "View finance",
  "finance.create": "Create journal entries",
  "finance.approve": "Approve finance entries",
  // HR
  "hr.view": "View HR",
  "hr.edit": "Edit HR records",
  // Maintenance
  "maintenance.view": "View maintenance",
  "maintenance.edit": "Edit maintenance",
  // Reports
  "report.view": "View reports",
  "report.export": "Export reports",
  // Settings
  "settings.view": "View settings",
  "settings.edit": "Edit settings",
  // Admin
  "admin.view": "View administration",
  "admin.manage": "Manage users and roles",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ROLES = {
  super_admin: Object.keys(PERMISSIONS),
  admin: Object.keys(PERMISSIONS).filter((p) => !p.startsWith("admin.manage")),
  sales_manager: [
    "crm.view",
    "crm.create",
    "crm.edit",
    "booking.view",
    "booking.create",
    "booking.approve",
    "customer.view",
    "customer.create",
    "customer.edit",
    "property.view",
    "collection.view",
    "report.view",
  ],
  sales_executive: [
    "crm.view",
    "crm.create",
    "crm.edit",
    "booking.view",
    "booking.create",
    "customer.view",
    "customer.create",
    "property.view",
  ],
  finance_manager: [
    "finance.view",
    "finance.create",
    "finance.approve",
    "collection.view",
    "collection.create",
    "collection.edit",
    "customer.view",
    "report.view",
    "report.export",
  ],
  project_manager: [
    "project.view",
    "project.edit",
    "construction.view",
    "construction.edit",
    "procurement.view",
    "procurement.create",
    "inventory.view",
    "contractor.view",
    "report.view",
  ],
} as const;

export type Role = keyof typeof ROLES;

export function getPermissionsForRole(role: Role): string[] {
  return [...ROLES[role]];
}

export function hasPermission(
  userPermissions: string[],
  permission: string
): boolean {
  return userPermissions.includes(permission);
}

export function hasAnyPermission(
  userPermissions: string[],
  permissions: string[]
): boolean {
  return permissions.some((p) => userPermissions.includes(p));
}

export const FIELD_PERMISSIONS: Record<
  string,
  { read: string[]; write: string[] }
> = {
  "booking.approved_amount": {
    read: ["finance_manager", "super_admin", "admin"],
    write: ["finance_manager", "super_admin"],
  },
  "customer.nid": {
    read: ["sales_manager", "sales_executive", "finance_manager", "super_admin", "admin"],
    write: ["sales_manager", "finance_manager", "super_admin"],
  },
};
