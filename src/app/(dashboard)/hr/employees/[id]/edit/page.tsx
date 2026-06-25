"use client";

import { EmployeeForm } from "@/components/hr/EmployeeForm";
import type { CreateEmployeeFormData } from "@/schemas";
import {
  useGetEmployeeByIdQuery,
  useGetEmployeesQuery,
  useUpdateEmployeeMutation,
} from "@/services/moduleApis";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use } from "react";
import { toast } from "sonner";

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: employee, isLoading: loadingEmployee } =
    useGetEmployeeByIdQuery(id);
  const { data: employees = [] } = useGetEmployeesQuery();
  const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

  const initialValues: Partial<CreateEmployeeFormData> | undefined = employee
    ? {
        fullName: employee.fullName,
        dateOfBirth: employee.dateOfBirth,
        gender: employee.gender,
        nidNumber: employee.nidNumber ?? "",
        mobileNumber: employee.mobileNumber,
        email: employee.email ?? "",
        presentAddress: employee.presentAddress ?? "",
        permanentAddress: employee.permanentAddress ?? "",
        department: employee.department,
        designation: employee.designation,
        employmentType: employee.employmentType,
        joiningDate: employee.joiningDate,
        reportingManagerId: employee.reportingManagerId ?? "",
        salary: employee.salary ? String(employee.salary) : "",
        bankName: employee.bankName ?? "",
        bankAccountNumber: employee.bankAccountNumber ?? "",
        employeeStatus: employee.employeeStatus,
        fatherName: employee.fatherName ?? "",
        motherName: employee.motherName ?? "",
        spouseName: employee.spouseName ?? "",
        emergencyContactName: employee.emergencyContactName,
        emergencyContactRelationship: employee.emergencyContactRelationship,
        emergencyContactNumber: employee.emergencyContactNumber,
      }
    : undefined;

  async function handleSubmit(data: CreateEmployeeFormData) {
    try {
      await updateEmployee({ id, data }).unwrap();
      toast.success("Employee updated successfully");
      router.push(`/hr/employees/${id}`);
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof (err as { data: unknown }).data === "string"
          ? (err as { data: string }).data
          : "Failed to update employee";
      toast.error(message);
    }
  }

  if (loadingEmployee) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10 text-sm text-gray-500">
        Loading employee...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-10">
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-6 pb-4">
        <Link
          href={`/hr/employees/${id}`}
          className="mb-3 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Employee Profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Update employee information for {employee.fullName}
        </p>
      </div>

      <div className="px-6 pb-10">
        <EmployeeForm
          mode="edit"
          employeeIdDisplay={employee.employeeId}
          managers={employees}
          excludeManagerId={id}
          initialValues={initialValues}
          isLoading={isLoading}
          showSaveAnother={false}
          onCancel={() => router.push(`/hr/employees/${id}`)}
          onSubmit={(data) => handleSubmit(data)}
        />
      </div>
    </div>
  );
}
