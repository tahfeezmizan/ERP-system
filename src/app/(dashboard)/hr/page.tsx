"use client";

import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  exportEmployeesToCsv,
  getReportingManagerName,
} from "@/lib/hr-utils";
import {
  useDeleteEmployeeMutation,
  useGetEmployeesQuery,
} from "@/services/moduleApis";
import type { Employee } from "@/types";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type TabId =
  | "overview"
  | "employees"
  | "attendance"
  | "payroll"
  | "leave"
  | "performance";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "employees", label: "Employees" },
  { id: "attendance", label: "Attendance" },
  { id: "payroll", label: "Payroll" },
  { id: "leave", label: "Leave Management" },
  { id: "performance", label: "Performance" },
];

const OVERVIEW_EMPLOYEES = [
  {
    id: "EMP-001",
    name: "John Smith",
    department: "Property Management",
    position: "Property Manager",
    status: "Active",
  },
  {
    id: "EMP-002",
    name: "Sarah Johnson",
    department: "Sales",
    position: "Leasing Executive",
    status: "Active",
  },
  {
    id: "EMP-003",
    name: "Michael Brown",
    department: "Maintenance",
    position: "Technician",
    status: "Active",
  },
];

const UPCOMING_ACTIONS = [
  {
    employee: "Sarah Johnson",
    action: "Performance Review",
    dueDate: "2026-05-20",
    status: "Pending",
  },
  {
    employee: "John Smith",
    action: "Contract Renewal",
    dueDate: "2026-05-25",
    status: "Pending",
  },
  {
    employee: "Michael Brown",
    action: "Training Completion",
    dueDate: "2026-05-30",
    status: "In Progress",
  },
];

const MOCK_ATTENDANCE = [
  {
    employee: "John Smith",
    date: "2026-06-25",
    checkIn: "08:55",
    checkOut: "17:30",
    status: "Present",
  },
  {
    employee: "Sarah Johnson",
    date: "2026-06-25",
    checkIn: "09:10",
    checkOut: "17:45",
    status: "Present",
  },
  {
    employee: "Michael Brown",
    date: "2026-06-25",
    checkIn: "08:30",
    checkOut: "16:00",
    status: "Present",
  },
  {
    employee: "Karim Ahmed",
    date: "2026-06-25",
    checkIn: "—",
    checkOut: "—",
    status: "On Leave",
  },
];

const MOCK_PAYROLL = [
  {
    employee: "John Smith",
    period: "June 2026",
    gross: 8500,
    deductions: 1200,
    net: 7300,
    status: "Processed",
  },
  {
    employee: "Sarah Johnson",
    period: "June 2026",
    gross: 7200,
    deductions: 980,
    net: 6220,
    status: "Processed",
  },
  {
    employee: "Michael Brown",
    period: "June 2026",
    gross: 5800,
    deductions: 750,
    net: 5050,
    status: "Pending",
  },
];

const MOCK_LEAVE = [
  {
    employee: "Karim Ahmed",
    type: "Annual Leave",
    from: "2026-06-24",
    to: "2026-06-28",
    days: 5,
    status: "Approved",
  },
  {
    employee: "Nusrat Jahan",
    type: "Sick Leave",
    from: "2026-06-26",
    to: "2026-06-26",
    days: 1,
    status: "Pending",
  },
  {
    employee: "Rashid Khan",
    type: "Personal Leave",
    from: "2026-07-01",
    to: "2026-07-03",
    days: 3,
    status: "Pending",
  },
];

const MOCK_PERFORMANCE = [
  {
    employee: "Sarah Johnson",
    period: "Q2 2026",
    rating: "4.5 / 5",
    reviewer: "HR Manager",
    status: "Pending",
  },
  {
    employee: "John Smith",
    period: "Q2 2026",
    rating: "4.8 / 5",
    reviewer: "Operations Director",
    status: "In Progress",
  },
  {
    employee: "Michael Brown",
    period: "Q2 2026",
    rating: "4.2 / 5",
    reviewer: "Maintenance Lead",
    status: "Completed",
  },
];

function KpiCard({
  label,
  value,
  borderColor,
}: {
  label: string;
  value: string;
  borderColor: string;
}) {
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white p-6 py-8 shadow-sm"
      style={{ borderLeft: `4px solid ${borderColor}` }}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function InlineStatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    present: "bg-green-100 text-green-700",
    approved: "bg-green-100 text-green-700",
    completed: "bg-green-100 text-green-700",
    processed: "bg-green-100 text-green-700",
    probation: "bg-yellow-100 text-yellow-700",
    pending: "bg-orange-100 text-orange-700",
    resigned: "bg-orange-100 text-orange-700",
    terminated: "bg-red-100 text-red-700",
    "in progress": "bg-blue-100 text-blue-700",
    "on leave": "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function ConfirmDeleteModal({
  open,
  label,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  label: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[min(95vw,400px)] rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <h2 className="text-base font-semibold text-gray-900">
          Delete {label}?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          This action cannot be undone. The employee record will be permanently
          removed.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function HRPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<TabId>(
    initialTab === "employees" ? "employees" : "overview",
  );

  const { data: employees = [], isLoading: loadingEmployees } =
    useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();

  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [designationFilter, setDesignationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const departments = useMemo(
    () =>
      [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees],
  );
  const designations = useMemo(
    () =>
      [...new Set(employees.map((e) => e.designation).filter(Boolean))].sort(),
    [employees],
  );

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      if (departmentFilter !== "all" && emp.department !== departmentFilter) {
        return false;
      }
      if (
        designationFilter !== "all" &&
        emp.designation !== designationFilter
      ) {
        return false;
      }
      if (
        statusFilter !== "all" &&
        emp.employeeStatus !== statusFilter
      ) {
        return false;
      }
      return true;
    });
  }, [employees, departmentFilter, designationFilter, statusFilter]);

  const employeeColumns: Column<Employee>[] = [
    {
      key: "employeeId",
      header: "Employee ID",
      cell: (row) => (
        <span className="font-mono text-xs">{row.employeeId}</span>
      ),
      sortable: true,
    },
    {
      key: "fullName",
      header: "Full Name",
      cell: (row) => <span className="font-medium">{row.fullName}</span>,
      sortable: true,
    },
    {
      key: "department",
      header: "Department",
      cell: (row) => row.department,
      sortable: true,
    },
    {
      key: "designation",
      header: "Designation",
      cell: (row) => row.designation,
      sortable: true,
    },
    {
      key: "mobileNumber",
      header: "Mobile Number",
      cell: (row) => row.mobileNumber,
      sortable: true,
    },
    {
      key: "employmentType",
      header: "Employment Type",
      cell: (row) => row.employmentType,
      sortable: true,
    },
    {
      key: "joiningDate",
      header: "Joining Date",
      cell: (row) => row.joiningDate,
      sortable: true,
    },
    {
      key: "employeeStatus",
      header: "Employee Status",
      cell: (row) => <InlineStatusBadge status={row.employeeStatus} />,
      sortable: true,
    },
    {
      key: "reportingManagerId",
      header: "Reporting Manager",
      cell: (row) =>
        getReportingManagerName(employees, row.reportingManagerId),
      sortable: true,
    },
  ];

  async function confirmDeleteEmployee() {
    if (!deleteTarget) return;
    try {
      await deleteEmployee(deleteTarget.id).unwrap();
      toast.success("Employee deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete employee");
    }
  }

  const headerAction =
    activeTab === "employees" ? (
      <Button
        id="btn-add-employee"
        className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700"
        asChild
      >
        <Link href="/hr/create-employee">
          <Plus className="h-4 w-4" /> Add Employee
        </Link>
      </Button>
    ) : null;

  const thCls = "px-4 py-3 text-left text-sm font-semibold text-gray-700";
  const tdCls = "px-4 py-3 text-sm text-gray-700";

  return (
    <div className="bg-gray-50">
      <div className="flex items-start justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Employee management, attendance, payroll, and performance
          </p>
        </div>
        {headerAction}
      </div>

      <div className="space-y-6 pb-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard
            label="Total Employees"
            value="148"
            borderColor="#22c55e"
          />
          <KpiCard
            label="Present Today"
            value="132"
            borderColor="#3b82f6"
          />
          <KpiCard
            label="Pending Leave Requests"
            value="8"
            borderColor="#f97316"
          />
          <KpiCard
            label="Payroll This Month"
            value="$245,000"
            borderColor="#a855f7"
          />
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Recent Employees
                </h2>
              </div>
              <table className="w-full">
                <thead className="border-t border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>Employee ID</th>
                    <th className={thCls}>Employee Name</th>
                    <th className={thCls}>Department</th>
                    <th className={thCls}>Position</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {OVERVIEW_EMPLOYEES.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className={tdCls + " font-mono text-xs"}>
                        {emp.id}
                      </td>
                      <td className={tdCls}>{emp.name}</td>
                      <td className={tdCls}>{emp.department}</td>
                      <td className={tdCls}>{emp.position}</td>
                      <td className={tdCls}>
                        <InlineStatusBadge status={emp.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                  Upcoming Actions
                </h2>
              </div>
              <table className="w-full">
                <thead className="border-t border-gray-100 bg-gray-50">
                  <tr>
                    <th className={thCls}>Employee</th>
                    <th className={thCls}>Action</th>
                    <th className={thCls}>Due Date</th>
                    <th className={thCls}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {UPCOMING_ACTIONS.map((row) => (
                    <tr
                      key={`${row.employee}-${row.action}`}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className={tdCls}>{row.employee}</td>
                      <td className={tdCls}>{row.action}</td>
                      <td className={tdCls}>{row.dueDate}</td>
                      <td className={tdCls}>
                        <InlineStatusBadge status={row.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "employees" && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DataTable
              columns={employeeColumns}
              data={filteredEmployees}
              isLoading={loadingEmployees}
              searchPlaceholder="Search by ID, name, mobile, or email..."
              searchKeys={[
                "employeeId",
                "fullName",
                "mobileNumber",
                "email",
              ]}
              onExportCsv={() => exportEmployeesToCsv(filteredEmployees)}
              emptyMessage="No employees yet. Click Add Employee to register one."
              rowActions={(row) => (
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    asChild
                  >
                    <Link
                      href={`/hr/employees/${row.id}`}
                      aria-label="View employee"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    asChild
                  >
                    <Link
                      href={`/hr/employees/${row.id}/edit`}
                      aria-label="Edit employee"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setDeleteTarget(row)}
                    aria-label="Delete employee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              toolbarExtra={
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={designationFilter}
                    onValueChange={setDesignationFilter}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Designations</SelectItem>
                      {designations.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Probation">Probation</SelectItem>
                      <SelectItem value="Resigned">Resigned</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              }
            />
          </div>
        )}

        {activeTab === "attendance" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Employee</th>
                  <th className={thCls}>Date</th>
                  <th className={thCls}>Check In</th>
                  <th className={thCls}>Check Out</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_ATTENDANCE.map((row) => (
                  <tr
                    key={`${row.employee}-${row.date}`}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdCls}>{row.employee}</td>
                    <td className={tdCls}>{row.date}</td>
                    <td className={tdCls}>{row.checkIn}</td>
                    <td className={tdCls}>{row.checkOut}</td>
                    <td className={tdCls}>
                      <InlineStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "payroll" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Employee</th>
                  <th className={thCls}>Period</th>
                  <th className={thCls}>Gross</th>
                  <th className={thCls}>Deductions</th>
                  <th className={thCls}>Net</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYROLL.map((row) => (
                  <tr
                    key={`${row.employee}-${row.period}`}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdCls}>{row.employee}</td>
                    <td className={tdCls}>{row.period}</td>
                    <td className={tdCls}>{fmt(row.gross)}</td>
                    <td className={tdCls}>{fmt(row.deductions)}</td>
                    <td className={tdCls}>{fmt(row.net)}</td>
                    <td className={tdCls}>
                      <InlineStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "leave" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Employee</th>
                  <th className={thCls}>Leave Type</th>
                  <th className={thCls}>From</th>
                  <th className={thCls}>To</th>
                  <th className={thCls}>Days</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LEAVE.map((row) => (
                  <tr
                    key={`${row.employee}-${row.from}`}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdCls}>{row.employee}</td>
                    <td className={tdCls}>{row.type}</td>
                    <td className={tdCls}>{row.from}</td>
                    <td className={tdCls}>{row.to}</td>
                    <td className={tdCls}>{row.days}</td>
                    <td className={tdCls}>
                      <InlineStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Employee</th>
                  <th className={thCls}>Review Period</th>
                  <th className={thCls}>Rating</th>
                  <th className={thCls}>Reviewer</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PERFORMANCE.map((row) => (
                  <tr
                    key={`${row.employee}-${row.period}`}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdCls}>{row.employee}</td>
                    <td className={tdCls}>{row.period}</td>
                    <td className={tdCls}>{row.rating}</td>
                    <td className={tdCls}>{row.reviewer}</td>
                    <td className={tdCls}>
                      <InlineStatusBadge status={row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        label={deleteTarget?.fullName ?? "employee"}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteEmployee}
      />
    </div>
  );
}
