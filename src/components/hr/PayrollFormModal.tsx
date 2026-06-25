"use client";

import { EntityCreateModal } from "@/components/shared/EntityCreateModal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  calculateOvertimePay,
  calculateNetPay,
  formatPayrollMoney,
} from "@/lib/payroll-utils";
import { createPayrollSchema, type CreatePayrollFormData } from "@/schemas";
import type { Employee, PayrollRecord } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const PAYMENT_METHODS = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Mobile Banking",
] as const;

const PAYROLL_STATUSES = ["Pending", "Processed", "Cancelled"] as const;

export const defaultPayrollFormValues: CreatePayrollFormData = {
  employeeRecordId: "",
  employeeId: "",
  employeeName: "",
  department: "",
  period: "",
  paymentDate: "",
  paymentMethod: "Bank Transfer",
  gross: 0,
  deductions: 0,
  leaveTaken: 0,
  overtimeHours: 0,
  bonusAllowance: 0,
  taxWithheld: 0,
  approvedBy: "",
  comments: "",
  status: "Pending",
};

function payrollToFormValues(record: PayrollRecord): CreatePayrollFormData {
  return {
    employeeRecordId: record.employeeRecordId,
    employeeId: record.employeeId,
    employeeName: record.employeeName,
    department: record.department,
    period: record.period,
    paymentDate: record.paymentDate,
    paymentMethod: record.paymentMethod,
    gross: record.gross,
    deductions: record.deductions,
    leaveTaken: record.leaveTaken,
    overtimeHours: record.overtimeHours,
    bonusAllowance: record.bonusAllowance,
    taxWithheld: record.taxWithheld,
    approvedBy: record.approvedBy,
    comments: record.comments ?? "",
    status: record.status,
  };
}

interface PayrollFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  editingRecord: PayrollRecord | null;
  isSubmitting: boolean;
  onSubmit: (data: CreatePayrollFormData) => Promise<void>;
}

export function PayrollFormModal({
  open,
  onOpenChange,
  employees,
  editingRecord,
  isSubmitting,
  onSubmit,
}: PayrollFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePayrollFormData>({
    resolver: zodResolver(createPayrollSchema),
    defaultValues: defaultPayrollFormValues,
  });

  const employeeRecordId = watch("employeeRecordId");
  const gross = watch("gross");
  const deductions = watch("deductions");
  const overtimeHours = watch("overtimeHours");
  const bonusAllowance = watch("bonusAllowance");
  const taxWithheld = watch("taxWithheld");
  const paymentMethod = watch("paymentMethod");
  const status = watch("status");

  const computedOvertimePay = calculateOvertimePay(
    Number(gross) || 0,
    Number(overtimeHours) || 0,
  );
  const computedNet = calculateNetPay({
    gross: Number(gross) || 0,
    bonusAllowance: Number(bonusAllowance) || 0,
    overtimePay: computedOvertimePay,
    deductions: Number(deductions) || 0,
    taxWithheld: Number(taxWithheld) || 0,
  });

  useEffect(() => {
    if (!open) return;
    if (editingRecord) {
      reset(payrollToFormValues(editingRecord));
    } else {
      reset(defaultPayrollFormValues);
    }
  }, [open, editingRecord, reset]);

  useEffect(() => {
    if (!employeeRecordId) return;
    const employee = employees.find((e) => e.id === employeeRecordId);
    if (!employee) return;
    setValue("employeeId", employee.employeeId, { shouldValidate: true });
    setValue("employeeName", employee.fullName, { shouldValidate: true });
    setValue("department", employee.department, { shouldValidate: true });
    if (!editingRecord && employee.salary) {
      setValue("gross", employee.salary, { shouldValidate: true });
    }
  }, [employeeRecordId, employees, setValue, editingRecord]);

  async function handleFormSubmit(data: CreatePayrollFormData) {
    await onSubmit(data);
  }

  return (
    <EntityCreateModal
      open={open}
      onOpenChange={onOpenChange}
      title={editingRecord ? "Edit Payroll Record" : "Add Payroll Record"}
      description="Overtime pay and net salary are calculated automatically."
      submitLabel={editingRecord ? "Update Payroll" : "Save Payroll"}
      isLoading={isSubmitting}
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-1">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payroll-employee">Employee *</Label>
            <Select
              value={employeeRecordId || undefined}
              onValueChange={(v) =>
                setValue("employeeRecordId", v, { shouldValidate: true })
              }
            >
              <SelectTrigger id="payroll-employee">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeRecordId && (
              <p className="text-xs text-red-600">
                {errors.employeeRecordId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-employee-id">Employee ID *</Label>
            <Input
              id="payroll-employee-id"
              readOnly
              className="bg-gray-50"
              {...register("employeeId")}
            />
            {errors.employeeId && (
              <p className="text-xs text-red-600">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-department">Department *</Label>
            <Input
              id="payroll-department"
              readOnly
              className="bg-gray-50"
              {...register("department")}
            />
            {errors.department && (
              <p className="text-xs text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-period">Pay Period *</Label>
            <Input
              id="payroll-period"
              placeholder="e.g. June 2026"
              {...register("period")}
            />
            {errors.period && (
              <p className="text-xs text-red-600">{errors.period.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-payment-date">Payment Date *</Label>
            <Input id="payroll-payment-date" type="date" {...register("paymentDate")} />
            {errors.paymentDate && (
              <p className="text-xs text-red-600">
                {errors.paymentDate.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-payment-method">Payment Method *</Label>
            <Select
              value={paymentMethod}
              onValueChange={(v) =>
                setValue(
                  "paymentMethod",
                  v as CreatePayrollFormData["paymentMethod"],
                  { shouldValidate: true },
                )
              }
            >
              <SelectTrigger id="payroll-payment-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-xs text-red-600">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-status">Status *</Label>
            <Select
              value={status}
              onValueChange={(v) =>
                setValue("status", v as CreatePayrollFormData["status"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="payroll-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {PAYROLL_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-red-600">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-gross">Gross Pay *</Label>
            <Input
              id="payroll-gross"
              type="number"
              step="0.01"
              min="0"
              {...register("gross", { valueAsNumber: true })}
            />
            {errors.gross && (
              <p className="text-xs text-red-600">{errors.gross.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-deductions">Deductions</Label>
            <Input
              id="payroll-deductions"
              type="number"
              step="0.01"
              min="0"
              {...register("deductions", { valueAsNumber: true })}
            />
            {errors.deductions && (
              <p className="text-xs text-red-600">{errors.deductions.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-leave">Leave Taken (days)</Label>
            <Input
              id="payroll-leave"
              type="number"
              step="0.5"
              min="0"
              max="31"
              {...register("leaveTaken", { valueAsNumber: true })}
            />
            {errors.leaveTaken && (
              <p className="text-xs text-red-600">{errors.leaveTaken.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-overtime-hours">Overtime Hours</Label>
            <Input
              id="payroll-overtime-hours"
              type="number"
              step="0.25"
              min="0"
              {...register("overtimeHours", { valueAsNumber: true })}
            />
            {errors.overtimeHours && (
              <p className="text-xs text-red-600">
                {errors.overtimeHours.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-overtime-pay">Overtime Pay (auto)</Label>
            <Input
              id="payroll-overtime-pay"
              readOnly
              className="bg-gray-50 font-medium"
              value={formatPayrollMoney(computedOvertimePay)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-bonus">Bonus / Allowance</Label>
            <Input
              id="payroll-bonus"
              type="number"
              step="0.01"
              min="0"
              {...register("bonusAllowance", { valueAsNumber: true })}
            />
            {errors.bonusAllowance && (
              <p className="text-xs text-red-600">
                {errors.bonusAllowance.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-tax">Tax Withheld</Label>
            <Input
              id="payroll-tax"
              type="number"
              step="0.01"
              min="0"
              {...register("taxWithheld", { valueAsNumber: true })}
            />
            {errors.taxWithheld && (
              <p className="text-xs text-red-600">{errors.taxWithheld.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payroll-net">Net Pay (auto)</Label>
            <Input
              id="payroll-net"
              readOnly
              className="bg-gray-50 font-semibold text-green-700"
              value={formatPayrollMoney(computedNet)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payroll-approved-by">Approved By *</Label>
            <Input
              id="payroll-approved-by"
              placeholder="Manager or HR approver name"
              {...register("approvedBy")}
            />
            {errors.approvedBy && (
              <p className="text-xs text-red-600">{errors.approvedBy.message}</p>
            )}
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="payroll-comments">Comments</Label>
            <Textarea
              id="payroll-comments"
              rows={3}
              placeholder="Optional notes about this payroll entry"
              {...register("comments")}
            />
            {errors.comments && (
              <p className="text-xs text-red-600">{errors.comments.message}</p>
            )}
          </div>
        </div>
      </div>
    </EntityCreateModal>
  );
}
