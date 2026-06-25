import type { Employee } from "@/types";

export function normalizeEmployee(raw: Record<string, unknown>): Employee {
  const now = new Date().toISOString();
  return {
    id: String(raw.id ?? ""),
    employeeId: String(raw.employeeId ?? raw.employee_id ?? ""),
    fullName: String(raw.fullName ?? raw.full_name ?? raw.name ?? ""),
    dateOfBirth: String(raw.dateOfBirth ?? raw.date_of_birth ?? ""),
    gender: (raw.gender as Employee["gender"]) ?? "Male",
    nidNumber: raw.nidNumber
      ? String(raw.nidNumber)
      : raw.nid_number
        ? String(raw.nid_number)
        : raw.nid
          ? String(raw.nid)
          : undefined,
    mobileNumber: String(
      raw.mobileNumber ?? raw.mobile_number ?? raw.phone ?? "",
    ),
    email: raw.email ? String(raw.email) : undefined,
    presentAddress: raw.presentAddress
      ? String(raw.presentAddress)
      : raw.present_address
        ? String(raw.present_address)
        : undefined,
    permanentAddress: raw.permanentAddress
      ? String(raw.permanentAddress)
      : raw.permanent_address
        ? String(raw.permanent_address)
        : undefined,
    department: String(raw.department ?? ""),
    designation: String(raw.designation ?? ""),
    employmentType: (raw.employmentType ??
      raw.employment_type ??
      "Permanent") as Employee["employmentType"],
    joiningDate: String(raw.joiningDate ?? raw.joining_date ?? ""),
    reportingManagerId: raw.reportingManagerId
      ? String(raw.reportingManagerId)
      : raw.reporting_manager_id
        ? String(raw.reporting_manager_id)
        : undefined,
    salary:
      typeof raw.salary === "number"
        ? raw.salary
        : raw.salary
          ? Number(raw.salary)
          : undefined,
    bankName: raw.bankName
      ? String(raw.bankName)
      : raw.bank_name
        ? String(raw.bank_name)
        : undefined,
    bankAccountNumber: raw.bankAccountNumber
      ? String(raw.bankAccountNumber)
      : raw.bank_account_number
        ? String(raw.bank_account_number)
        : undefined,
    employeeStatus: (raw.employeeStatus ??
      raw.employee_status ??
      raw.status ??
      "Active") as Employee["employeeStatus"],
    fatherName: raw.fatherName
      ? String(raw.fatherName)
      : raw.father_name
        ? String(raw.father_name)
        : undefined,
    motherName: raw.motherName
      ? String(raw.motherName)
      : raw.mother_name
        ? String(raw.mother_name)
        : undefined,
    spouseName: raw.spouseName
      ? String(raw.spouseName)
      : raw.spouse_name
        ? String(raw.spouse_name)
        : undefined,
    emergencyContactName: String(
      raw.emergencyContactName ?? raw.emergency_contact_name ?? "",
    ),
    emergencyContactRelationship: String(
      raw.emergencyContactRelationship ?? raw.emergency_contact_relationship ?? "",
    ),
    emergencyContactNumber: String(
      raw.emergencyContactNumber ?? raw.emergency_contact_number ?? "",
    ),
    createdAt: String(raw.createdAt ?? raw.created_at ?? now),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? now),
  };
}

export function generateEmployeeId(employees: Employee[]): string {
  const nums = employees.map((e) => {
    const match = e.employeeId?.match(/^EMP-(\d+)$/i);
    return match ? parseInt(match[1], 10) : 0;
  });
  const next = Math.max(0, ...nums, employees.length) + 1;
  return `EMP-${String(next).padStart(3, "0")}`;
}

export function getReportingManagerName(
  employees: Employee[],
  managerId?: string,
): string {
  if (!managerId) return "—";
  const manager = employees.find((e) => e.id === managerId);
  return manager?.fullName ?? "—";
}

export function exportEmployeesToCsv(employees: Employee[]) {
  const headers = [
    "Employee ID",
    "Full Name",
    "Department",
    "Designation",
    "Mobile Number",
    "Email",
    "Employment Type",
    "Joining Date",
    "Employee Status",
    "Reporting Manager ID",
  ];

  const rows = employees.map((emp) => [
    emp.employeeId,
    emp.fullName,
    emp.department,
    emp.designation,
    emp.mobileNumber,
    emp.email ?? "",
    emp.employmentType,
    emp.joiningDate,
    emp.employeeStatus,
    emp.reportingManagerId ?? "",
  ]);

  const escape = (value: string) =>
    `"${String(value).replace(/"/g, '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escape(String(cell))).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `employees-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
