"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useGetEmployeesQuery } from "@/services/moduleApis";

type Employee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: string;
};

export default function HrPage() {
  const { data = [], isLoading } = useGetEmployeesQuery();

  const columns: Column<Employee>[] = [
    { key: "name", header: "Employee", cell: (r) => r.name, sortable: true },
    { key: "department", header: "Department", cell: (r) => r.department, sortable: true },
    { key: "designation", header: "Designation", cell: (r) => r.designation },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="HR & Payroll" description="Employees, attendance, leave, and payroll management">
        <Button><Plus className="h-4 w-4 mr-1" /> Add Employee</Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "department"]} />
    </div>
  );
}
