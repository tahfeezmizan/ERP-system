"use client";

import { Toaster } from "sonner";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";
import { useEffect } from "react";
import { initializeStorage } from "@/lib/storage-utils";
import "@/services";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <ReduxProvider>
      <ThemeProvider>
        {children}
        <Toaster richColors closeButton position="top-right" />
      </ThemeProvider>
    </ReduxProvider>
  );
}

