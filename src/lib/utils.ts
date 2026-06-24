import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : "";
  const [whole, decimal = ""] = abs.toFixed(2).split(".");
  const lastThree = whole.slice(-3);
  const other = whole.slice(0, -3);
  const formatted =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (other ? "," : "") +
    lastThree;
  return `${sign}৳${formatted}${decimal !== "00" ? `.${decimal}` : ""}`;
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  const [whole, decimal = ""] = value.toString().split(".");
  const lastThree = whole.slice(-3);
  const other = whole.slice(0, -3);
  const formatted =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (other ? "," : "") +
    lastThree;
  return decimal ? `${formatted}.${decimal}` : formatted;
}

export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 11)}`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
