"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable, type Column } from "@/components/tables/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type CreateEmployeeFormData } from "@/schemas";
import { useCreateEmployeeMutation, useGetEmployeesQuery } from "@/services/moduleApis";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Employee = {
  id: string;
  name: string;
  department: string;
  designation: string;
  status: string;
};

const DEPARTMENTS = ["Sales", "Finance", "HR", "Construction", "Admin", "Legal", "IT"];

export default function HrPage() {
  const { data = [], isLoading, refetch } = useGetEmployeesQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createEmployee] = useCreateEmployeeMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateEmployeeFormData>({
    defaultValues: { name: "", department: "", designation: "", phone: "", email: "", joiningDate: "", salary: undefined, nid: "" },
  });

  const deptValue = watch("department");

  const columns: Column<Employee>[] = [
    { key: "name", header: "Employee", cell: (r) => r.name, sortable: true },
    { key: "department", header: "Department", cell: (r) => r.department, sortable: true },
    { key: "designation", header: "Designation", cell: (r) => r.designation },
    { key: "status", header: "Status", cell: (r) => <StatusBadge status={r.status} /> },
  ];

  async function onSubmit(values: CreateEmployeeFormData) {
    try {
      await createEmployee(values).unwrap();
      toast.success("Employee added successfully");
      reset();
      setIsModalOpen(false);
      void refetch();
    } catch {
      toast.error("Failed to add employee");
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="HR & Payroll" description="Employees, attendance, leave, and payroll management">
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Employee
        </Button>
      </PageHeader>
      <DataTable columns={columns} data={data} isLoading={isLoading} searchKeys={["name", "department"]} />

      <EntityCreateModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Employee"
        description="Create a new employee profile"
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="emp-name">Full Name</Label>
            <Input id="emp-name" placeholder="e.g. Karim Ahmed" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-phone">Phone</Label>
            <Input id="emp-phone" placeholder="01XXXXXXXXX" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-dept">Department</Label>
            <Select value={deptValue} onValueChange={(v) => setValue("department", v)}>
              <SelectTrigger id="emp-dept">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-designation">Designation</Label>
            <Input id="emp-designation" placeholder="e.g. Sales Executive" {...register("designation")} />
            {errors.designation && <p className="text-sm text-destructive">{errors.designation.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-nid">NID</Label>
            <Input id="emp-nid" placeholder="13/17-digit NID" {...register("nid")} />
            {errors.nid && <p className="text-sm text-destructive">{errors.nid.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-salary">Salary (৳)</Label>
            <Input id="emp-salary" type="number" placeholder="e.g. 30000" {...register("salary")} />
            {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-joining">Joining Date</Label>
            <Input id="emp-joining" type="date" {...register("joiningDate")} />
            {errors.joiningDate && <p className="text-sm text-destructive">{errors.joiningDate.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="emp-email">Email (optional)</Label>
            <Input id="emp-email" type="email" placeholder="emp@company.com" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
        </div>
      </EntityCreateModal>
    </div>
  );
}
