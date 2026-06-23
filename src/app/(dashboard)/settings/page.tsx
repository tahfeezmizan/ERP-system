"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { changePasswordSchema, type ChangePasswordFormData } from "@/schemas/auth";
import { useChangePasswordMutation } from "@/services/authApi";
import { useAuth } from "@/hooks/usePermissions";

export default function SettingsPage() {
  const { user } = useAuth();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      reset();
    } catch {
      toast.error("Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Account and application preferences" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-muted-foreground">Name</Label>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Role</Label>
              <p className="font-medium capitalize">{user?.role?.replace("_", " ")}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Department</Label>
              <p className="font-medium">{user?.department ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" {...register("currentPassword")} />
                {errors.currentPassword && (
                  <p className="text-sm text-danger">{errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" {...register("newPassword")} />
                {errors.newPassword && (
                  <p className="text-sm text-danger">{errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && (
                  <p className="text-sm text-danger">{errors.confirmPassword.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
