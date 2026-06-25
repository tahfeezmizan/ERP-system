import { z } from "zod";
import { CRM_PIPELINE_STAGES, LEAD_SOURCES } from "@/constants/app";

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
    .enum([
      "Purchase",
      "Joint Venture",
      "POA",
      "Inheritance",
      "Gift",
      "Lease",
      "Other",
    ])
    .optional(),

  acquisitionDate: z.string().optional(),

  // Record References
  csRecord: z.string().optional(),
  rsRecord: z.string().optional(),

  // Workflow Statuses
  status: z.enum(["Acquired", "Pending", "Verified"]),

  mutationStatus: z
    .enum([
      "Pending",
      "Processing",
      "Approved",
      "Rejected",
      "In Progress",
      "Completed",
    ])
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
  company: z.string().min(2, "Company name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum(LEAD_SOURCES),
  projectInterest: z.string().min(2, "Project interest is required"),
  budget: z.coerce.number().positive("Budget must be positive"),
  assignedTo: z.string().min(2, "Assigned to is required"),
  targetProperty: z.string().min(2, "Target property is required"),
  leadType: z.enum(["Commercial", "Residential"]),
  stage: z.enum(CRM_PIPELINE_STAGES),
  probability: z.coerce
    .number()
    .min(0, "Probability cannot be negative")
    .max(100, "Probability cannot exceed 100"),
  expectedCloseDate: z.string().optional(),
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
export const employeeGenderEnum = z.enum(["Male", "Female", "Other"]);
export const employmentTypeEnum = z.enum([
  "Permanent",
  "Contract",
  "Intern",
  "Consultant",
]);
export const employeeStatusEnum = z.enum([
  "Active",
  "Probation",
  "Resigned",
  "Terminated",
]);

export const createEmployeeSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: employeeGenderEnum,
  nidNumber: z.string().optional(),
  mobileNumber: z
    .string()
    .min(10, "Mobile number is required")
    .regex(/^\d+$/, "Mobile must be numeric"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  presentAddress: z.string().optional(),
  permanentAddress: z.string().optional(),
  department: z.string().min(2, "Department is required"),
  designation: z.string().min(2, "Designation is required"),
  employmentType: employmentTypeEnum,
  joiningDate: z.string().min(1, "Joining date is required"),
  reportingManagerId: z.string().optional(),
  salary: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  employeeStatus: employeeStatusEnum,
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  spouseName: z.string().optional(),
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name is required"),
  emergencyContactRelationship: z
    .string()
    .min(2, "Emergency contact relationship is required"),
  emergencyContactNumber: z
    .string()
    .min(10, "Emergency contact number is required")
    .regex(/^\d+$/, "Emergency contact number must be numeric"),
});

export const updateEmployeeSchema = createEmployeeSchema;
export type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeSchema>;

// ─── Payroll ──────────────────────────────────────────────────────────────────
/** Validates monetary values as DECIMAL(10,2). */
export const decimalMoneySchema = z
  .number()
  .min(0, "Amount cannot be negative")
  .max(99_999_999.99, "Amount exceeds DECIMAL(10,2) limit");

export const payrollPaymentMethodEnum = z.enum([
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Mobile Banking",
]);

export const payrollStatusEnum = z.enum([
  "Pending",
  "Processed",
  "Cancelled",
]);

export const createPayrollSchema = z
  .object({
    employeeRecordId: z.string().min(1, "Employee is required"),
    employeeId: z.string().min(1, "Employee ID is required"),
    employeeName: z.string().min(1, "Employee name is required"),
    department: z.string().min(1, "Department is required"),
    period: z.string().min(1, "Pay period is required"),
    paymentDate: z.string().min(1, "Payment date is required"),
    paymentMethod: payrollPaymentMethodEnum,
    gross: decimalMoneySchema.refine((v) => v > 0, "Gross pay must be positive"),
    deductions: decimalMoneySchema,
    leaveTaken: z
      .number()
      .min(0, "Leave taken cannot be negative")
      .max(31, "Leave taken cannot exceed 31 days"),
    overtimeHours: z
      .number()
      .min(0, "Overtime hours cannot be negative")
      .max(744, "Overtime hours exceeds monthly limit"),
    bonusAllowance: decimalMoneySchema,
    taxWithheld: decimalMoneySchema,
    approvedBy: z.string().min(2, "Approver name is required"),
    comments: z.string().max(500, "Comments cannot exceed 500 characters").optional(),
    status: payrollStatusEnum,
  })
  .superRefine((data, ctx) => {
    const deductionsPlusTax = data.deductions + data.taxWithheld;
    if (deductionsPlusTax > data.gross + data.bonusAllowance) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Deductions and tax cannot exceed gross pay plus bonus",
        path: ["deductions"],
      });
    }
  });

export const updatePayrollSchema = createPayrollSchema;
export type CreatePayrollFormData = z.infer<typeof createPayrollSchema>;
export type UpdatePayrollFormData = z.infer<typeof updatePayrollSchema>;

// ─── Property (Portfolio) ─────────────────────────────────────────────────────
export const propertySchema = z.object({
  name: z.string().min(2, "Property name is required"),
  code: z.string().min(2, "Property code is required"),
  type: z.enum(["Commercial", "Residential", "Industrial"]),
  location: z.string().min(2, "Location is required"),
  status: z.enum(["active", "inactive"]),
  occupancy: z.coerce
    .number()
    .min(0, "Occupancy must be at least 0")
    .max(100, "Occupancy cannot exceed 100"),
  value: z.coerce.number().positive("Value must be positive"),
});
export type PropertyFormData = z.infer<typeof propertySchema>;

// ─── Unit ─────────────────────────────────────────────────────────────────────
export const unitSchema = z.object({
  unit: z.string().min(1, "Unit is required"),
  propertyName: z.string().min(2, "Property is required"),
  type: z.enum(["Office", "Apartment"]),
  floor: z.coerce.number().int().min(0, "Floor is required"),
  area: z.coerce.number().positive("Area must be positive"),
  status: z.enum(["occupied", "vacant"]),
  marketRent: z.coerce.number().positive("Market rent must be positive"),
});
export type UnitFormData = z.infer<typeof unitSchema>;

// Legacy alias
export const createPropertyUnitSchema = unitSchema;
export type CreatePropertyUnitFormData = UnitFormData;

// ─── Lease ────────────────────────────────────────────────────────────────────
export const leaseSchema = z.object({
  tenant: z.string().min(2, "Tenant is required"),
  propertyName: z.string().min(2, "Property is required"),
  unit: z.string().min(1, "Unit is required"),
  type: z.enum(["Commercial", "Residential"]),
  baseRent: z.coerce.number().positive("Base rent must be positive"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["active", "expiring", "expired", "terminated"]),
});
export type LeaseFormData = z.infer<typeof leaseSchema>;

// ─── Tenant ───────────────────────────────────────────────────────────────────
export const tenantSchema = z.object({
  company: z.string().min(2, "Company is required"),
  contact: z.string().min(2, "Contact is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  type: z.enum(["Commercial", "Residential"]),
  credit: z.coerce
    .number()
    .min(300, "Credit score must be at least 300")
    .max(850, "Credit score cannot exceed 850"),
  status: z.enum(["active", "inactive"]),
});
export type TenantFormData = z.infer<typeof tenantSchema>;

// ─── Project ──────────────────────────────────────────────────────────────────
export const createProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  code: z.string().min(2, "Project code is required"),
  location: z.string().min(2, "Location is required"),
  propertyName: z.string().min(2, "Associated property is required"),
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
  expectedCompletion: z.string().optional(),
  completionPercent: z.coerce
    .number()
    .min(0, "Progress must be at least 0")
    .max(100, "Progress cannot exceed 100"),
  status: z.enum([
    "Planning",
    "Approved",
    "Construction",
    "Sales",
    "Completed",
  ]),
  rajukApproval: z.boolean().default(false),
  projectManager: z.string().optional(),
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

export const vendorSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  contact: z.string().min(2, "Contact person is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Phone is required"),
  type: z.string().min(2, "Type is required"),
  rating: z.coerce
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  status: z.enum(["active", "inactive"]),
});
export type VendorFormData = z.infer<typeof vendorSchema>;

// ─── Inventory Stock-In ───────────────────────────────────────────────────────
export const createInventoryItemSchema = z.object({
  name: z.string().min(2, "Item name is required"),
  category: z.string().min(2, "Category is required"),
  stock: z.coerce.number().positive("Stock quantity must be positive"),
  unit: z.string().min(1, "Unit is required"),
  reorderLevel: z.coerce.number().min(0, "Reorder level is required"),
  value: z.coerce.number().min(0, "Value is required"),
});
export type CreateInventoryItemFormData = z.infer<
  typeof createInventoryItemSchema
>;

// ─── Finance – Journal Entry ──────────────────────────────────────────────────
export const createJournalEntrySchema = z.object({
  accountCode: z.string().min(1, "Account code is required"),
  accountName: z.string().min(2, "Account name is required"),
  type: z.enum(["Asset", "Liability", "Revenue", "Expense", "Equity"]),
  balance: z.coerce.number().min(0, "Balance is required"),
});
export type CreateJournalEntryFormData = z.infer<
  typeof createJournalEntrySchema
>;

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

// ─── Work Order ──────────────────────────────────────────────────────────────
export const workOrderSchema = z.object({
  title: z.string().min(2, "Title is required"),
  property: z.string().min(2, "Property is required"),
  category: z.string().min(2, "Category is required"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["open", "in progress", "completed", "scheduled"]),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
});
export type WorkOrderFormData = z.infer<typeof workOrderSchema>;

// ─── Document ────────────────────────────────────────────────────────────────
export const createDocumentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  fileName: z.string().min(1, "File name is required"),
  fileSize: z.string().default("1.0 MB"),
  version: z.string().min(1, "Version is required").default("v1"),
  expiresAt: z.string().default("Never"),
  isConfidential: z.boolean().default(false),
});
export type CreateDocumentFormData = z.infer<typeof createDocumentSchema>;

