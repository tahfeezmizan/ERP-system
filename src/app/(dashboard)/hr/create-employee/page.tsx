"use client";

import { EmployeeForm } from "@/components/hr/EmployeeForm";
import { generateEmployeeId } from "@/lib/hr-utils";
import type { CreateEmployeeFormData } from "@/schemas";
import {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
} from "@/services/moduleApis";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

export default function CreateEmployeePage() {
  const router = useRouter();
  const { data: employees = [] } = useGetEmployeesQuery();
  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const nextEmployeeId = useMemo(
    () => generateEmployeeId(employees),
    [employees],
  );

  async function handleSubmit(
    data: CreateEmployeeFormData,
    action: "save" | "another",
  ) {
    try {
      await createEmployee(data).unwrap();
      toast.success("Employee created successfully");
      if (action === "save") {
        router.push("/hr?tab=employees");
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === "object" &&
        "data" in err &&
        typeof (err as { data: unknown }).data === "string"
          ? (err as { data: string }).data
          : "Failed to create employee";
      toast.error(message);
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Register a new employee in the system
        </p>
      </div>

      <EmployeeForm
        mode="create"
        employeeIdDisplay={nextEmployeeId}
        managers={employees}
        isLoading={isLoading}
        onCancel={() => router.push("/hr?tab=employees")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
