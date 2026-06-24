import type { Role } from "@/constants/permissions";
import type { CRM_PIPELINE_STAGES, LEAD_SOURCES, UNIT_STATUSES } from "@/constants/app";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
  avatar?: string;
  companyId: string;
  department?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  companyId: string;
  fiscalYear: string;
  rememberMe: boolean;
}

export interface Company {
  id: string;
  name: string;
  code: string;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: string;
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

export interface ChartDataPoint {
  name: string;
  value?: number;
  [key: string]: string | number | undefined;
}

export type UnitStatus = (typeof UNIT_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type PipelineStage = (typeof CRM_PIPELINE_STAGES)[number];

export interface LandOwner {
  id: string;
  name: string;
  nid: string;
  tin?: string;
  phone: string;
  email?: string;
  ownershipShare: number;
  address: string;
}

// export interface LandRecord {
//   id: string;
//   mouza: string;
//   khatian: string;
//   dag: string;
//   // New fields
//   landId?: string; // Land ID / Land Code
//   recordType?: "CS" | "SA" | "RS" | "BRS"; // Record Type
//   district?: string;
//   jlNo?: string;
//   landType?: string;
//   sharePercent?: number;
//   acquisitionType?: string;
//   acquisitionDate?: string;
//   mutationStatus?: string;
//   developmentAgreementStatus?: string;
//   totalOwners?: number;
//   availableArea?: number;
//   csRecord?: string;
//   saRecord?: string;
//   rsRecord?: string;
//   brsRecord?: string;
//   area: number;
//   valuation: number;
//   status: "Acquired" | "Pending" | "Verified";
//   owners: LandOwner[];
//   projectId?: string;
// }


export interface LandRecord {
  id: string;

  // Land Identification
  landId?: string;
  recordType?: "CS" | "SA" | "RS" | "BRS" | "Other";

  // Location
  district?: string;
  upazila?: string;
  mouza: string;
  jlNo?: string;

  // Land Records
  khatian: string;
  dag: string;
  csRecord?: string;
  saRecord?: string;
  rsRecord?: string;
  brsRecord?: string;

  // Land Details
  landType?: "Residential" | "Commercial" | "Agricultural" | "Industrial" | "Mixed";

  area: number;
  availableArea?: number;
  valuation: number;

  // Ownership
  sharePercent?: number;
  totalOwners?: number;
  owners: LandOwner[];

  // Acquisition
  acquisitionType?:
    | "Purchase"
    | "Joint Venture"
    | "POA"
    | "Inheritance"
    | "Gift"
    | "Lease"
    | "Other";

  acquisitionDate?: string;

  // Statuses
  status: "Acquired" | "Pending" | "Verified";

  mutationStatus?:
    | "Pending"
    | "Processing"
    | "Approved"
    | "Rejected"
    | "In Progress"
    | "Completed";

  developmentAgreementStatus?:
    | "Signed"
    | "Pending"
    | "Expired"
    | "Active"
    | "Completed"
    | "Terminated";

  documentsStatus?: "Complete" | "Incomplete" | "Partial" | "Missing";

  // Project Information
  estimatedProjectYield?: string;

  // Audit
  lastUpdated?: string;

  // Relations
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  landId?: string;
  status: "Planning" | "Approved" | "Construction" | "Sales" | "Completed";
  budget: number;
  spent: number;
  rajukApproval: boolean;
  startDate: string;
  endDate: string;
  completionPercent: number;
}

// NOTE: `Project` model moved to `src/app/(dashboard)/projects/model.ts`

export type PropertyType = "Commercial" | "Residential" | "Industrial";
export type PropertyStatus = "active" | "inactive";

export interface Property {
  id: string;
  name: string;
  code: string;
  type: PropertyType;
  location: string;
  status: PropertyStatus;
  occupancy: number;
  value: number;
}

export type UnitOccupancyStatus = "occupied" | "vacant";
export type UnitSpaceType = "Office" | "Apartment";

export interface PropertyUnit {
  id: string;
  unit: string;
  propertyName: string;
  propertyId?: string;
  type: UnitSpaceType;
  floor: number;
  area: number;
  status: UnitOccupancyStatus;
  marketRent: number;
}

export type LeaseType = "Commercial" | "Residential";
export type LeaseStatus = "active" | "expiring" | "expired" | "terminated";

export interface Lease {
  id: string;
  leaseNumber: string;
  tenant: string;
  propertyName: string;
  unit: string;
  type: LeaseType;
  baseRent: number;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  stage: PipelineStage;
  assignedTo: string;
  projectInterest: string;
  budget: number;
  createdAt: string;
  lastFollowUp?: string;
}

export interface Booking {
  id: string;
  bookingNo: string;
  customerId: string;
  customerName: string;
  unitId: string;
  unitNumber: string;
  projectName: string;
  bookingDate: string;
  bookingAmount: number;
  totalPrice: number;
  status: "Pending" | "Approved" | "Cancelled" | "Transferred";
  paymentScheduleId?: string;
}

export interface Collection {
  id: string;
  receiptNo: string;
  bookingId: string;
  customerName: string;
  amount: number;
  type: "Booking Money" | "Down Payment" | "Installment" | "Late Fee";
  paymentDate: string;
  paymentMethod: "Cash" | "Bank Transfer" | "Cheque" | "Mobile Banking";
  status: "Received" | "Pending" | "Bounced";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  nid: string;
  tin?: string;
  address: string;
  nominee?: string;
  totalDue: number;
  totalPaid: number;
  status: "Active" | "Inactive";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  status: number;
  message: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  assignedTo: string;
}
