import { createSlice } from "@reduxjs/toolkit";

function createModuleSlice(name: string) {
  return createSlice({
    name,
    initialState: { filters: {} as Record<string, unknown> },
    reducers: {
      setFilters: (state, action) => {
        state.filters = action.payload;
      },
      clearFilters: (state) => {
        state.filters = {};
      },
    },
  });
}

export const landSlice = createModuleSlice("land");
export const projectSlice = createModuleSlice("project");
export const propertySlice = createModuleSlice("property");
export const crmSlice = createModuleSlice("crm");
export const bookingSlice = createModuleSlice("booking");
export const collectionSlice = createModuleSlice("collection");
export const customerSlice = createModuleSlice("customer");
export const constructionSlice = createModuleSlice("construction");
export const procurementSlice = createModuleSlice("procurement");
export const inventorySlice = createModuleSlice("inventory");
export const contractorSlice = createModuleSlice("contractor");
export const financeSlice = createModuleSlice("finance");
export const hrSlice = createModuleSlice("hr");
export const maintenanceSlice = createModuleSlice("maintenance");
export const reportSlice = createModuleSlice("report");
export const settingsSlice = createModuleSlice("settings");

export const landReducer = landSlice.reducer;
export const projectReducer = projectSlice.reducer;
export const propertyReducer = propertySlice.reducer;
export const crmReducer = crmSlice.reducer;
export const bookingReducer = bookingSlice.reducer;
export const collectionReducer = collectionSlice.reducer;
export const customerReducer = customerSlice.reducer;
export const constructionReducer = constructionSlice.reducer;
export const procurementReducer = procurementSlice.reducer;
export const inventoryReducer = inventorySlice.reducer;
export const contractorReducer = contractorSlice.reducer;
export const financeReducer = financeSlice.reducer;
export const hrReducer = hrSlice.reducer;
export const maintenanceReducer = maintenanceSlice.reducer;
export const reportReducer = reportSlice.reducer;
export const settingsReducer = settingsSlice.reducer;
