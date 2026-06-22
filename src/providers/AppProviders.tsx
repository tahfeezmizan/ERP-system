"use client";

import { Toaster } from "sonner";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";
import "@/services";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  );
}
