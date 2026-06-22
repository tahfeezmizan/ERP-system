import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, AuthTokens, User } from "@/types";
import { COMPANIES, FISCAL_YEARS } from "@/constants/app";

const AUTH_STORAGE_KEY = "erp_auth";

function loadAuthFromStorage(): Partial<AuthState> {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

function saveAuthToStorage(state: AuthState) {
  if (typeof window === "undefined") return;
  if (state.isAuthenticated && state.tokens) {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        companyId: state.companyId,
        fiscalYear: state.fiscalYear,
        rememberMe: state.rememberMe,
      })
    );
    document.cookie = `erp_token=${state.tokens.accessToken}; path=/; max-age=86400; SameSite=Lax`;
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "erp_token=; path=/; max-age=0";
  }
}

const stored = loadAuthFromStorage();

const initialState: AuthState = {
  user: stored.user ?? null,
  tokens: stored.tokens ?? null,
  isAuthenticated: stored.isAuthenticated ?? false,
  companyId: stored.companyId ?? COMPANIES[0].id,
  fiscalYear: stored.fiscalYear ?? FISCAL_YEARS[1],
  rememberMe: stored.rememberMe ?? false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        tokens: AuthTokens;
        rememberMe?: boolean;
      }>
    ) => {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
      state.isAuthenticated = true;
      state.companyId = action.payload.user.companyId;
      state.rememberMe = action.payload.rememberMe ?? false;
      saveAuthToStorage(state);
    },
    updateTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      saveAuthToStorage(state);
    },
    setCompany: (state, action: PayloadAction<string>) => {
      state.companyId = action.payload;
      saveAuthToStorage(state);
    },
    setFiscalYear: (state, action: PayloadAction<string>) => {
      state.fiscalYear = action.payload;
      saveAuthToStorage(state);
    },
    logout: (state) => {
      state.user = null;
      state.tokens = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      saveAuthToStorage(state);
    },
  },
});

export const { setCredentials, updateTokens, setCompany, setFiscalYear, logout } =
  authSlice.actions;
export default authSlice.reducer;
