"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/hooks/redux";
import { hasPermission, hasAnyPermission } from "@/constants/permissions";

export function usePermissions() {
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? []);
  const role = useAppSelector((state) => state.auth.user?.role);

  return useMemo(
    () => ({
      permissions,
      role,
      can: (permission: string) => hasPermission(permissions, permission),
      canAny: (perms: string[]) => hasAnyPermission(permissions, perms),
    }),
    [permissions, role]
  );
}

export function useAuth() {
  const auth = useAppSelector((state) => state.auth);
  return auth;
}
