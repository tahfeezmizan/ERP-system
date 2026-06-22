import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { lastRefreshed: null as string | null },
  reducers: {
    setLastRefreshed: (state, action) => {
      state.lastRefreshed = action.payload;
    },
  },
});

export const { setLastRefreshed } = dashboardSlice.actions;
export default dashboardSlice.reducer;
