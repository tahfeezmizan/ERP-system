import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  sidebarCollapsed: boolean;
  sidebarMobileOpen: boolean;
  globalSearchOpen: boolean;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  globalSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setSidebarMobileOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarMobileOpen = action.payload;
    },
    setGlobalSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.globalSearchOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarMobileOpen,
  setGlobalSearchOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
