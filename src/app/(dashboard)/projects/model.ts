export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  projectType?: string;
  landId?: string;
  landArea?: number;
  status: "Planning" | "Approved" | "Construction" | "Sales" | "Completed";
  budget: number;
  spent: number; // actual cost
  rajukApproval: boolean;
  startDate: string;
  endDate: string;
  completionPercent: number;
  availableUnits?: number;
  soldUnits?: number;
  reservedUnits?: number;
  collectionAmount?: number;
  dueAmount?: number;
  expectedCompletion?: string;
  projectManager?: string;
  createdAt?: string;
}
