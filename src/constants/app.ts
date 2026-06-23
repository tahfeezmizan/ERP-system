export const APP_NAME = "Real Estate ERP";
export const APP_DESCRIPTION =
  "Enterprise Real Estate ERP Platform for Bangladesh Developers";

export const COLORS = {
  primary: "#1D4ED8",
  secondary: "#3B82F6",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
  darkBackground: "#0F172A",
  darkCard: "#1E293B",
  darkText: "#E2E8F0",
} as const;

export const FISCAL_YEARS = ["2024-2025", "2025-2026", "2026-2027"] as const;

export const COMPANIES = [
  { id: "comp_1", name: "Bright Future Developers Ltd.", code: "BFD" },
  { id: "comp_2", name: "Green Valley Housing", code: "GVH" },
  { id: "comp_3", name: "Dhaka Skyline Properties", code: "DSP" },
] as const;

export const UNIT_STATUSES = [
  "Available",
  "Reserved",
  "Booked",
  "Sold",
  "Handover Pending",
  "Handed Over",
  "Cancelled",
] as const;

export const LEAD_SOURCES = [
  "Facebook",
  "Website",
  "Walk-In",
  "Referral",
  "Broker",
  "Campaign",
  "Exhibition",
  "Phone Inquiry",
  "Billboard",
  "TV",
  "Other",
] as const;

export const CRM_PIPELINE_STAGES = [
  "Lead",
  "Interested",
  "Site Visit",
  "Negotiation",
  "Booking",
  "Agreement",
  "Registration",
  "Handover",
] as const;

export const MOCK_CREDENTIALS = {
  email: "admin@brightfuture.bd",
  password: "admin123",
} as const;
