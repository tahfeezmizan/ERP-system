import type { CreatePayrollFormData } from "@/schemas";
import type { Employee, PayrollRecord } from "@/types";

/** Standard working hours per month (2080 annual / 12). */
export const STANDARD_MONTHLY_HOURS = 173.33;

/** Overtime pay multiplier (time-and-a-half). */
export const OVERTIME_MULTIPLIER = 1.5;

/** Maximum value for DECIMAL(10,2) columns. */
export const MAX_DECIMAL_MONEY = 99_999_999.99;

/** Round to two decimal places (DECIMAL(10,2) semantics). */
export function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatPayrollMoney(amount: number): string {
  return (
    "$" +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Overtime pay = overtime hours × (gross / standard monthly hours) × 1.5
 */
export function calculateOvertimePay(
  gross: number,
  overtimeHours: number,
): number {
  if (overtimeHours <= 0 || gross <= 0) return 0;
  const hourlyRate = gross / STANDARD_MONTHLY_HOURS;
  return roundMoney(overtimeHours * hourlyRate * OVERTIME_MULTIPLIER);
}

/**
 * Net pay = gross + bonus/allowance + overtime pay − deductions − tax withheld
 */
export function calculateNetPay(input: {
  gross: number;
  bonusAllowance: number;
  overtimePay: number;
  deductions: number;
  taxWithheld: number;
}): number {
  const net =
    input.gross +
    input.bonusAllowance +
    input.overtimePay -
    input.deductions -
    input.taxWithheld;
  return roundMoney(Math.max(net, 0));
}

export function derivePayrollAmounts(data: {
  gross: number;
  deductions: number;
  overtimeHours: number;
  bonusAllowance: number;
  taxWithheld: number;
}): { overtimePay: number; net: number } {
  const overtimePay = calculateOvertimePay(data.gross, data.overtimeHours);
  const net = calculateNetPay({
    gross: data.gross,
    bonusAllowance: data.bonusAllowance,
    overtimePay,
    deductions: data.deductions,
    taxWithheld: data.taxWithheld,
  });
  return { overtimePay, net };
}

export function normalizePayrollRecord(
  raw: Record<string, unknown>,
): PayrollRecord {
  const gross = roundMoney(Number(raw.gross) || 0);
  const deductions = roundMoney(Number(raw.deductions) || 0);
  const overtimeHours = Number(raw.overtimeHours) || 0;
  const bonusAllowance = roundMoney(Number(raw.bonusAllowance) || 0);
  const taxWithheld = roundMoney(Number(raw.taxWithheld) || 0);
  const storedOvertimePay =
    raw.overtimePay !== undefined && raw.overtimePay !== null
      ? roundMoney(Number(raw.overtimePay))
      : calculateOvertimePay(gross, overtimeHours);
  const storedNet =
    raw.net !== undefined && raw.net !== null
      ? roundMoney(Number(raw.net))
      : calculateNetPay({
          gross,
          bonusAllowance,
          overtimePay: storedOvertimePay,
          deductions,
          taxWithheld,
        });

  return {
    id: String(raw.id ?? ""),
    employeeRecordId: String(raw.employeeRecordId ?? ""),
    employeeId: String(raw.employeeId ?? ""),
    employeeName: String(raw.employeeName ?? raw.employee ?? ""),
    department: String(raw.department ?? ""),
    period: String(raw.period ?? ""),
    paymentDate: String(raw.paymentDate ?? ""),
    paymentMethod: (raw.paymentMethod as PayrollRecord["paymentMethod"]) ??
      "Bank Transfer",
    gross,
    deductions,
    leaveTaken: Number(raw.leaveTaken) || 0,
    overtimeHours,
    overtimePay: storedOvertimePay,
    bonusAllowance,
    taxWithheld,
    net: storedNet,
    approvedBy: String(raw.approvedBy ?? ""),
    comments: raw.comments ? String(raw.comments) : undefined,
    status: (raw.status as PayrollRecord["status"]) ?? "Pending",
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  };
}

export function buildPayrollRecordFromForm(
  data: CreatePayrollFormData,
  employee: Employee | undefined,
  existing?: Pick<PayrollRecord, "id" | "createdAt">,
): PayrollRecord {
  const { overtimePay, net } = derivePayrollAmounts({
    gross: data.gross,
    deductions: data.deductions,
    overtimeHours: data.overtimeHours,
    bonusAllowance: data.bonusAllowance,
    taxWithheld: data.taxWithheld,
  });

  const now = new Date().toISOString();

  return {
    id: existing?.id ?? `pay_${Math.random().toString(36).slice(2, 10)}`,
    employeeRecordId: data.employeeRecordId,
    employeeId: employee?.employeeId ?? data.employeeId,
    employeeName: employee?.fullName ?? data.employeeName,
    department: employee?.department ?? data.department,
    period: data.period,
    paymentDate: data.paymentDate,
    paymentMethod: data.paymentMethod,
    gross: roundMoney(data.gross),
    deductions: roundMoney(data.deductions),
    leaveTaken: data.leaveTaken,
    overtimeHours: data.overtimeHours,
    overtimePay,
    bonusAllowance: roundMoney(data.bonusAllowance),
    taxWithheld: roundMoney(data.taxWithheld),
    net,
    approvedBy: data.approvedBy,
    comments: data.comments || undefined,
    status: data.status,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
