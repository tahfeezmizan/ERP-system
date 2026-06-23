import {
  mockBookings,
  mockCollections,
  mockComplaints,
  mockContractors,
  mockCustomers,
  mockEmployees,
  mockFinanceAccounts,
  mockInventoryItems,
  mockLandRecords,
  mockLeads,
  mockProcurementOrders,
  mockProjects,
  mockProperties,
  mockUnits,
} from "./mock-data";
import type { LandRecord, Property, PropertyUnit, Lead, Booking, Collection, Customer } from "@/types";
import type { Project } from "@/app/(dashboard)/projects/model";

// Helper function to safely read from localStorage
export function getLocalStorageData<T>(key: string, fallbackData: T[]): T[] {
  if (typeof window === "undefined") {
    return fallbackData;
  }
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      // Initialize with fallback/mock data
      window.localStorage.setItem(key, JSON.stringify(fallbackData));
      return fallbackData;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return fallbackData;
  }
}

// Helper function to safely write to localStorage
export function setLocalStorageData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing key "${key}" to localStorage:`, error);
  }
}

// Initialize all localStorage keys on first load
export function initializeStorage() {
  if (typeof window === "undefined") return;

  // 1. Land records and its sub-keys
  const landRecords = getLocalStorageData<LandRecord>("landRecords", mockLandRecords);
  syncLandRecordSubkeys(landRecords);

  // 2. Projects
  getLocalStorageData<Project>("projects", mockProjects);

  // 2b. Portfolio properties
  getLocalStorageData<Property>("properties", mockProperties);

  // 3. Property units (apartments) and buildings
  const units = getLocalStorageData<PropertyUnit>("apartments", mockUnits);
  syncPropertyUnitSubkeys(units);

  // 4. Customers
  getLocalStorageData<Customer>("customers", mockCustomers);

  // 5. Leads
  getLocalStorageData<Lead>("leads", mockLeads);

  // 6. Bookings
  getLocalStorageData<Booking>("bookings", mockBookings);

  // 7. Collections
  getLocalStorageData<Collection>("collections", mockCollections);

  // 8. Vendors (procurement orders)
  getLocalStorageData<any>("vendors", mockProcurementOrders);

  // 9. Contractors
  getLocalStorageData<any>("contractors", mockContractors);

  // 10. Employees
  getLocalStorageData<any>("employees", mockEmployees);

  // 11. Complaints
  getLocalStorageData<any>("complaints", mockComplaints);

  // 12. Inventory items
  getLocalStorageData<any>("inventory", mockInventoryItems);

  // 13. Accounts/Finance
  getLocalStorageData<any>("accounts", mockFinanceAccounts);
}

// Helper to sync land record fields with their individual storage keys
export function syncLandRecordSubkeys(records: LandRecord[]) {
  if (typeof window === "undefined") return;
  
  // Extract unique land owners
  const ownersMap = new Map();
  records.forEach((r) => {
    if (r.owners) {
      r.owners.forEach((o) => {
        ownersMap.set(o.id, o);
      });
    }
  });
  const landOwners = Array.from(ownersMap.values());
  setLocalStorageData("landOwners", landOwners);

  // Extract unique mouzas, khatians, dags
  const mouzas = Array.from(new Set(records.map((r) => r.mouza).filter(Boolean)));
  const khatians = Array.from(new Set(records.map((r) => r.khatian).filter(Boolean)));
  const dags = Array.from(new Set(records.map((r) => r.dag).filter(Boolean)));

  setLocalStorageData("mouzas", mouzas);
  setLocalStorageData("khatians", khatians);
  setLocalStorageData("dags", dags);
}

// Helper to sync unit fields with building storage keys
export function syncPropertyUnitSubkeys(units: PropertyUnit[]) {
  if (typeof window === "undefined") return;
  const buildings = Array.from(new Set(units.map((u) => u.building).filter(Boolean)));
  setLocalStorageData("buildings", buildings);
}
