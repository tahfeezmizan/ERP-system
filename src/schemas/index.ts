import { z } from "zod";
import { LEAD_SOURCES } from "@/constants/app";

// ─── Land ─────────────────────────────────────────────────────────────────────
// export const createLandRecordSchema = z.object({
//   mouza: z.string().min(2, "Mouza is required"),
//   khatian: z.string().min(1, "Khatian No. is required"),
//   dag: z.string().min(1, "Dag No. is required"),
//   area: z.coerce.number().positive("Area must be positive"),
//   valuation: z.coerce.number().positive("Valuation is required"),
//   status: z.enum(["Acquired", "Pending", "Verified"]),
//   // New optional fields
//   landId: z.string().optional(),
//   recordType: z.enum(["CS", "SA", "RS", "BRS"]).optional(),
//   district: z.string().optional(),
//   jlNo: z.string().optional(),
//   landType: z.string().optional(),
//   sharePercent: z.coerce.number().optional(),
//   acquisitionType: z.string().optional(),
//   acquisitionDate: z.string().optional(),
//   mutationStatus: z.string().optional(),
//   developmentAgreementStatus: z.string().optional(),
//   totalOwners: z.coerce.number().optional(),
//   availableArea: z.coerce.number().optional(),
//   csRecord: z.string().optional(),
//   rsRecord: z.string().optional(),
// });

const emptyToUndefined = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .union([z.literal(""), schema])
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val));

export const createLandRecordSchema = z.object({
  // Core Land Information
  landId: z.string().optional(),

  mouza: z.string().min(2, "Mouza is required"),
  khatian: z.string().min(1, "Khatian No. is required"),
  dag: z.string().min(1, "Dag No. is required"),

  recordType: z.enum(["CS", "SA", "RS", "BRS", "Other"]).optional(),

  district: z.string().optional(),
  upazila: z.string().optional(),
  jlNo: z.string().optional(),

  // Land Details
  landType: z
    .enum(["Residential", "Commercial", "Agricultural", "Industrial", "Mixed"])
    .optional(),

  area: z.coerce.number().positive("Area must be positive"),

  availableArea: emptyToUndefined(
    z.coerce.number().positive("Available area must be positive"),
  ),

  valuation: z.coerce.number().positive("Valuation is required"),

  // Ownership
  sharePercent: emptyToUndefined(
    z.coerce
      .number()
      .min(0, "Share percentage cannot be negative")
      .max(100, "Share percentage cannot exceed 100"),
  ),

  totalOwners: emptyToUndefined(
    z.coerce.number().int().positive("Total owners must be at least 1"),
  ),

  // Acquisition
  acquisitionType: z
    .enum(["Purchase", "Joint Venture", "POA", "Inheritance", "Gift", "Lease", "Other"])
    .optional(),

  acquisitionDate: z.string().optional(),

  // Record References
  csRecord: z.string().optional(),
  rsRecord: z.string().optional(),

  // Workflow Statuses
  status: z.enum(["Acquired", "Pending", "Verified"]),

  mutationStatus: z
    .enum(["Pending", "Processing", "Approved", "Rejected", "In Progress", "Completed"])
    .optional(),

  developmentAgreementStatus: z
    .enum(["Signed", "Pending", "Expired", "Active", "Completed", "Terminated"])
    .optional(),

  documentsStatus: z
    .enum(["Complete", "Incomplete", "Partial", "Missing"])
    .optional(),

  // Project Information
  estimatedProjectYield: z.string().optional(),

  // Audit
  lastUpdated: z.string().optional(),
});

export type CreateLandRecordFormData = z.infer<typeof createLandRecordSchema>;

// ─── Lead ─────────────────────────────────────────────────────────────────────
export const createLeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES),
  projectInterest: z.string().min(2, "Project interest is required"),
  budget: z.coerce.number().positive("Budget must be positive"),
  assignedTo: z.string().min(2, "Assigned to is required"),
});
export type CreateLeadFormData = z.infer<typeof createLeadSchema>;

// ─── Booking ──────────────────────────────────────────────────────────────────
export const createBookingSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  projectName: z.string().min(2, "Project name is required"),
  bookingDate: z.string().min(1, "Booking date is required"),
  bookingAmount: z.coerce.number().positive("Booking amount is required"),
  totalPrice: z.coerce.number().positive("Total price is required"),
});
export type CreateBookingFormData = z.infer<typeof createBookingSchema>;

// ─── Collection ───────────────────────────────────────────────────────────────
export const createCollectionSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  type: z.enum(["Booking Money", "Down Payment", "Installment", "Late Fee"]),
  paymentDate: z.string().min(1, "Payment date is required"),
  paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Mobile Banking"]),
});
export type CreateCollectionFormData = z.infer<typeof createCollectionSchema>;

// ─── Contractor ───────────────────────────────────────────────────────────────
export const createContractorSchema = z.object({
  name: z.string().min(2, "Contractor name is required"),
  type: z.string().min(2, "Type is required"),
  rating: z.coerce.number().min(1).max(5, "Rating must be between 1-5"),
});
export type CreateContractorFormData = z.infer<typeof createContractorSchema>;

// ─── Employee ─────────────────────────────────────────────────────────────────
export const createEmployeeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  joiningDate: z.string().min(1, "Joining date is required"),
  salary: z.coerce.number().positive("Salary must be positive"),
  nid: z.string().min(10, "NID is required"),
});
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

// ─── Property Unit ────────────────────────────────────────────────────────────
export const createPropertyUnitSchema = z.object({
  projectName: z.string().min(2, "Project is required"),
  building: z.string().min(1, "Building is required"),
  block: z.string().min(1, "Block is required"),
  floor: z.coerce.number().int().min(0, "Floor is required"),
  unitNumber: z.string().min(1, "Unit number is required"),
  unitType: z.enum(["Apartment", "Commercial", "Parking", "Shop", "Roof Rights"]),
  area: z.coerce.number().positive("Area must be positive"),
  facing: z.string().min(1, "Facing is required"),
  price: z.coerce.number().positive("Price must be positive"),
});
export type CreatePropertyUnitFormData = z.infer<typeof createPropertyUnitSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────
export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  code: z.string().min(2, "Project code is required"),
  location: z.string().min(2, "Location is required"),
  projectType: z.string().optional(),
  landArea: z.coerce.number().optional(),
  budget: z.coerce.number().positive("Budget must be positive"),
  actualCost: z.coerce.number().optional(),
  availableUnits: z.coerce.number().optional(),
  soldUnits: z.coerce.number().optional(),
  reservedUnits: z.coerce.number().optional(),
  collectionAmount: z.coerce.number().optional(),
  dueAmount: z.coerce.number().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  rajukApproval: z.boolean().default(false),
  projectManager: z.string().optional(),
  expectedCompletion: z.string().optional(),
});
export type CreateProjectFormData = z.infer<typeof createProjectSchema>;

// ─── Procurement ─────────────────────────────────────────────────────────────
export const createProcurementSchema = z.object({
  vendor: z.string().min(2, "Vendor is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(2, "Description is required"),
});
export type CreateProcurementFormData = z.infer<typeof createProcurementSchema>;

// ─── Inventory Stock-In ───────────────────────────────────────────────────────
export const createInventoryItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().positive("Stock quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  reorderLevel: z.coerce.number().min(0, "Reorder level is required"),
  value: z.coerce.number().min(0, "Value is required"),
});
export type CreateInventoryItemFormData = z.infer<typeof createInventoryItemSchema>;

// ─── Finance – Journal Entry ──────────────────────────────────────────────────
export const createJournalEntrySchema = z.object({
  accountCode: z.string().min(1, "Account code is required"),
  accountName: z.string().min(2, "Account name is required"),
  type: z.enum(["Asset", "Liability", "Revenue", "Expense", "Equity"]),
  balance: z.coerce.number().min(0, "Balance is required"),
});
export type CreateJournalEntryFormData = z.infer<typeof createJournalEntrySchema>;

// ─── Maintenance Ticket ───────────────────────────────────────────────────────
export const createComplaintSchema = z.object({
  customer: z.string().min(2, "Customer name is required"),
  unit: z.string().min(1, "Unit number is required"),
  issue: z.string().min(5, "Issue description is required"),
  priority: z.enum(["Low", "Medium", "High"]),
});
export type CreateComplaintFormData = z.infer<typeof createComplaintSchema>;

// ─── Construction Milestone ───────────────────────────────────────────────────
export const createMilestoneSchema = z.object({
  label: z.string().min(2, "Milestone label is required"),
  targetDate: z.string().min(1, "Target date is required"),
  assignedTo: z.string().min(2, "Assigned to is required"),
  notes: z.string().optional(),
});
export type CreateMilestoneFormData = z.infer<typeof createMilestoneSchema>;
