"use client";

import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { can } = usePermissions();
  if (!can(permission)) return <>{fallback}</>;
  return <>{children}</>;
}
