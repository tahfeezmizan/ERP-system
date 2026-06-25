"use client";

import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/utils";
import {
  getReportingManagerName,
} from "@/lib/hr-utils";
import {
  useDeleteEmployeeMutation,
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
} from "@/services/moduleApis";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const map: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    probation: "bg-yellow-100 text-yellow-700",
    resigned: "bg-orange-100 text-orange-700",
    terminated: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${map[s] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value ?? "—"}</p>
    </div>
  );
}

function ConfirmDeleteModal({
  open,
  name,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  name: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[min(95vw,400px)] rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <h2 className="text-base font-semibold text-gray-900">
          Delete {name}?
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

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: employee, isLoading } = useGetEmployeeByIdQuery(id);
  const { data: employees = [] } = useGetEmployeesQuery();
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [showDelete, setShowDelete] = useState(false);

  async function confirmDelete() {
    try {
      await deleteEmployee(id).unwrap();
      toast.success("Employee deleted");
      router.push("/hr?tab=employees");
    } catch {
      toast.error("Failed to delete employee");
    }
  }

  if (isLoading) {
    return (
      <div className="px-6 py-10 text-sm text-gray-500">
        Loading employee...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="py-10">
        <p className="text-sm text-gray-500">Employee not found.</p>
        <Link
          href="/hr?tab=employees"
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Back to Human Resources
        </Link>
      </div>
    );
  }

  const managerName = getReportingManagerName(
    employees,
    employee.reportingManagerId,
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/hr?tab=employees"
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Human Resources
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {employee.fullName}
              </h1>
              <StatusBadge status={employee.employeeStatus} />
            </div>
            <p className="mt-1 font-mono text-sm text-gray-500">
              {employee.employeeId}
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              {employee.designation} · {employee.department}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/hr/employees/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Employee
              </Link>
            </Button>
            <Button
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <DetailSection title="Employee Information">
          <DetailField label="Full Name" value={employee.fullName} />
          <DetailField label="Date of Birth" value={employee.dateOfBirth} />
          <DetailField label="Gender" value={employee.gender} />
          <DetailField label="NID Number" value={employee.nidNumber} />
          <DetailField label="Mobile Number" value={employee.mobileNumber} />
          <DetailField label="Email" value={employee.email} />
          <DetailField label="Present Address" value={employee.presentAddress} />
          <DetailField
            label="Permanent Address"
            value={employee.permanentAddress}
          />
        </DetailSection>

        <DetailSection title="Employment Information">
          <DetailField label="Department" value={employee.department} />
          <DetailField label="Designation" value={employee.designation} />
          <DetailField label="Employment Type" value={employee.employmentType} />
          <DetailField label="Joining Date" value={employee.joiningDate} />
          <DetailField label="Reporting Manager" value={managerName} />
          <DetailField
            label="Salary"
            value={employee.salary ? formatUSD(employee.salary) : undefined}
          />
          <DetailField label="Employee Status" value={employee.employeeStatus} />
        </DetailSection>

        <DetailSection title="Banking Information">
          <DetailField label="Bank Name" value={employee.bankName} />
          <DetailField
            label="Bank Account Number"
            value={employee.bankAccountNumber}
          />
        </DetailSection>

        <DetailSection title="Family Information">
          <DetailField label="Father's Name" value={employee.fatherName} />
          <DetailField label="Mother's Name" value={employee.motherName} />
          <DetailField label="Spouse Name" value={employee.spouseName} />
        </DetailSection>

        <DetailSection title="Emergency Contact Information">
          <DetailField
            label="Emergency Contact Name"
            value={employee.emergencyContactName}
          />
          <DetailField
            label="Relationship"
            value={employee.emergencyContactRelationship}
          />
          <DetailField
            label="Contact Number"
            value={employee.emergencyContactNumber}
          />
        </DetailSection>
      </div>

      <ConfirmDeleteModal
        open={showDelete}
        name={employee.fullName}
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
