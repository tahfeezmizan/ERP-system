import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import dashboardReducer from "./slices/dashboardSlice";
import {
  landReducer,
  projectReducer,
  propertyReducer,
  crmReducer,
  bookingReducer,
  collectionReducer,
  customerReducer,
  constructionReducer,
  procurementReducer,
  inventoryReducer,
  contractorReducer,
  financeReducer,
  hrReducer,
  maintenanceReducer,
  reportReducer,
  settingsReducer,
} from "./slices/moduleSlices";
import { baseApi } from "@/services/baseApi";

const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  dashboard: dashboardReducer,
  land: landReducer,
  project: projectReducer,
  property: propertyReducer,
  crm: crmReducer,
  booking: bookingReducer,
  collection: collectionReducer,
  customer: customerReducer,
  construction: constructionReducer,
  procurement: procurementReducer,
  inventory: inventoryReducer,
  contractor: contractorReducer,
  finance: financeReducer,
  hr: hrReducer,
  maintenance: maintenanceReducer,
  report: reportReducer,
  settings: settingsReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
