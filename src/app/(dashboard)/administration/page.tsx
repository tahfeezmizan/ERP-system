"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PERMISSIONS, ROLES } from "@/constants/permissions";
import { PermissionGate } from "@/components/shared/PermissionGate";

export default function AdministrationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="User roles, permissions, and system configuration"
      />

      <PermissionGate
        permission="admin.view"
        fallback={
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              You do not have permission to view administration settings.
            </CardContent>
          </Card>
        }
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Roles</CardTitle>
              <CardDescription>System roles and their permission counts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(ROLES).map(([role, perms]) => (
                <div key={role} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium capitalize">{role.replace("_", " ")}</span>
                  <Badge variant="secondary">{perms.length} permissions</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
              <CardDescription>All available system permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {Object.entries(PERMISSIONS).map(([key, desc]) => (
                  <div key={key} className="flex items-start gap-2 text-sm rounded-lg border p-2">
                    <Badge variant="outline" className="shrink-0 font-mono text-[10px]">
                      {key}
                    </Badge>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PermissionGate>
    </div>
  );
}
