"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
} from "@/services/moduleApis";
import { Plus } from "lucide-react";
import { useState } from "react";
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
    pending: "bg-orange-100 text-orange-700",
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

export default function HRPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: employees = [], refetch: refetchEmployees } =
    useGetEmployeesQuery();
  const [createEmployee, { isLoading: creatingEmployee }] =
    useCreateEmployeeMutation();

  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    department: "",
    designation: "",
    phone: "",
    email: "",
    joiningDate: "",
    salary: "",
    nid: "",
  });

  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  function openCreateEmployee() {
    setEmployeeForm({
      name: "",
      department: "",
      designation: "",
      phone: "",
      email: "",
      joiningDate: "",
      salary: "",
      nid: "",
    });
    setEmployeeModalOpen(true);
  }

  async function submitEmployee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await createEmployee({
        name: employeeForm.name,
        department: employeeForm.department,
        designation: employeeForm.designation,
        phone: employeeForm.phone,
        email: employeeForm.email || undefined,
        joiningDate: employeeForm.joiningDate,
        salary: parseFloat(employeeForm.salary),
        nid: employeeForm.nid,
      }).unwrap();
      toast.success("Employee added");
      setEmployeeModalOpen(false);
      void refetchEmployees();
    } catch {
      toast.error("Failed to add employee");
    }
  }

  const headerAction =
    activeTab === "employees" ? (
      <Button
        id="btn-add-employee"
        className="flex items-center gap-2 bg-gray-900 text-white hover:bg-gray-700"
        onClick={openCreateEmployee}
      >
        <Plus className="h-4 w-4" /> Add Employee
      </Button>
    ) : null;

  const thCls = "px-4 py-3 text-left text-sm font-semibold text-gray-700";
  const tdCls = "px-4 py-3 text-sm text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-start justify-between px-6 pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Human Resources</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Employee management, attendance, payroll, and performance
          </p>
        </div>
        {headerAction}
      </div>

      <div className="px-6 space-y-6 pb-10">
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
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className={thCls}>Employee ID</th>
                  <th className={thCls}>Name</th>
                  <th className={thCls}>Department</th>
                  <th className={thCls}>Designation</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-gray-400"
                    >
                      No employees yet. Click &quot;Add Employee&quot; to add
                      one.
                    </td>
                  </tr>
                )}
                {employees.map((emp: any, index: number) => (
                  <tr
                    key={emp.id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className={tdCls + " font-mono text-xs"}>
                      EMP-{String(index + 1).padStart(3, "0")}
                    </td>
                    <td className={tdCls}>{emp.name}</td>
                    <td className={tdCls}>{emp.department}</td>
                    <td className={tdCls}>{emp.designation}</td>
                    <td className={tdCls}>
                      <InlineStatusBadge status={emp.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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

      <EntityCreateModal
        open={employeeModalOpen}
        onOpenChange={setEmployeeModalOpen}
        title="Add Employee"
        description="Register a new employee in the system"
        submitLabel="Add Employee"
        isLoading={creatingEmployee}
        onSubmit={submitEmployee}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="emp-name">Full Name</Label>
            <Input
              id="emp-name"
              placeholder="e.g. John Smith"
              value={employeeForm.name}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-department">Department</Label>
            <Input
              id="emp-department"
              placeholder="e.g. Sales"
              value={employeeForm.department}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, department: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-designation">Designation</Label>
            <Input
              id="emp-designation"
              placeholder="e.g. Property Manager"
              value={employeeForm.designation}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, designation: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input
              id="emp-phone"
              placeholder="e.g. 01712345678"
              value={employeeForm.phone}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, phone: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-email">Email</Label>
            <Input
              id="emp-email"
              type="email"
              placeholder="e.g. john@company.com"
              value={employeeForm.email}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, email: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-joining">Joining Date</Label>
            <Input
              id="emp-joining"
              type="date"
              value={employeeForm.joiningDate}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, joiningDate: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-salary">Salary ($)</Label>
            <Input
              id="emp-salary"
              type="number"
              placeholder="e.g. 5000"
              value={employeeForm.salary}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, salary: e.target.value }))
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-nid">NID</Label>
            <Input
              id="emp-nid"
              placeholder="National ID number"
              value={employeeForm.nid}
              onChange={(e) =>
                setEmployeeForm((p) => ({ ...p, nid: e.target.value }))
              }
              required
            />
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
