"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/redux";
import { useAuth } from "@/hooks/usePermissions";
import { changePasswordSchema, type ChangePasswordFormData } from "@/schemas/auth";
import { useChangePasswordMutation } from "@/services/authApi";
import { updateProfile } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Building2,
  Loader2,
  Lock,
  Mail,
  Pencil,
  Phone,
  Save,
  User as UserIcon
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Edit Profile Form Schema
const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  department: z.string().optional().or(z.literal("")),
  jobTitle: z.string().optional().or(z.literal("")),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const [changePassword, { isLoading: isPasswordLoading }] = useChangePasswordMutation();

  // Helper to extract first and last name from the full name string
  const getFirstAndLastName = (fullName: string) => {
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(" ");
    if (spaceIndex === -1) {
      return { firstName: trimmed, lastName: "" };
    }
    return {
      firstName: trimmed.substring(0, spaceIndex),
      lastName: trimmed.substring(spaceIndex + 1),
    };
  };

  // ─── Profile Edit Form Setup ───
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      department: "",
      jobTitle: "",
    },
  });

  // Pre-populate profile form once user data is loaded
  useEffect(() => {
    if (user) {
      const { firstName, lastName } = getFirstAndLastName(user.name);
      setProfileValue("firstName", firstName);
      setProfileValue("lastName", lastName);
      setProfileValue("email", user.email);
      setProfileValue("phone", user.phone ?? "");
      setProfileValue("department", user.department ?? "");
      setProfileValue("jobTitle", user.jobTitle ?? "");
    }
  }, [user, setProfileValue]);

  // Handle Profile Update Save
  const onProfileSubmit = async (data: EditProfileFormData) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();
      
      // Dispatch action to update Redux store and LocalStorage
      dispatch(
        updateProfile({
          name: fullName,
          email: data.email.trim(),
          phone: data.phone?.trim() || undefined,
          department: data.department?.trim() || undefined,
          jobTitle: data.jobTitle?.trim() || undefined,
        })
      );
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile information");
    }
  };

  // ─── Password Change Form Setup ───
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      resetPasswordForm();
    } catch {
      toast.error("Failed to change password");
    }
  };

  // Helper to compute initials for the avatar
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0 || !parts[0]) return "??";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Settings" description="Account and application preferences" />

      {/* 1. User Profile Preview Card */}
      <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar with Initials & Blue-Purple Gradient */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-2xl shadow-md border-2 border-white dark:border-zinc-800">
              {user ? getInitials(user.name) : "??"}
            </div>

            <div className="space-y-1.5 min-w-0">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {user?.name ?? "Loading User..."}
              </h2>
              
              <div className="flex items-center justify-center sm:justify-start gap-1.5 text-zinc-500 dark:text-zinc-400">
                <Mail className="h-4 w-4 shrink-0 text-zinc-400" />
                <span className="text-sm truncate">{user?.email ?? "—"}</span>
              </div>
              
              <div className="pt-1 flex justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 px-3 py-0.5 rounded-full border border-blue-100/50 dark:border-blue-900/30 capitalize">
                  {user?.role?.replace("_", " ") ?? "—"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Edit Profile Card */}
      <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Pencil className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg font-bold">Edit Profile</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Update your personal information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
            
            {/* Form Fields Grid */}
            <div className="grid gap-5 md:grid-cols-2">
              
              {/* First Name */}
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <UserIcon className="h-4 w-4 text-zinc-400" /> First Name
                </Label>
                <Input
                  id="firstName"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="First Name"
                  {...registerProfile("firstName")}
                />
                {profileErrors.firstName && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <UserIcon className="h-4 w-4 text-zinc-400" /> Last Name
                </Label>
                <Input
                  id="lastName"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="Last Name"
                  {...registerProfile("lastName")}
                />
                {profileErrors.lastName && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.lastName.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <Mail className="h-4 w-4 text-zinc-400" /> Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="Email Address"
                  {...registerProfile("email")}
                />
                {profileErrors.email && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <Phone className="h-4 w-4 text-zinc-400" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="+1 (555) 000-0000"
                  {...registerProfile("phone")}
                />
                {profileErrors.phone && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.phone.message}</p>
                )}
              </div>

              {/* Department */}
              <div className="space-y-1.5">
                <Label htmlFor="department" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <Building2 className="h-4 w-4 text-zinc-400" /> Department
                </Label>
                <Input
                  id="department"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="e.g., Property Management"
                  {...registerProfile("department")}
                />
                {profileErrors.department && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.department.message}</p>
                )}
              </div>

              {/* Job Title */}
              <div className="space-y-1.5">
                <Label htmlFor="jobTitle" className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                  <Briefcase className="h-4 w-4 text-zinc-400" /> Job Title
                </Label>
                <Input
                  id="jobTitle"
                  className="rounded-lg border-zinc-200 bg-white focus:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 focus-visible:ring-1"
                  placeholder="e.g., Property Manager"
                  {...registerProfile("jobTitle")}
                />
                {profileErrors.jobTitle && (
                  <p className="text-xs font-semibold text-red-500 mt-1">{profileErrors.jobTitle.message}</p>
                )}
              </div>

            </div>

            {/* Save Changes Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isProfileSubmitting}
                className="rounded-lg bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm font-semibold flex items-center gap-1.5 px-5 py-2.5 transition dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {isProfileSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 3. Change Password Card */}
      <Card className="rounded-xl border border-zinc-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <CardHeader className="pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
            <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-lg font-bold">Change Password</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-0.5">
            Update your account password
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4 max-w-md">
            
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                className="rounded-lg border-zinc-200"
                {...registerPassword("currentPassword")} 
              />
              {passwordErrors.currentPassword && (
                <p className="text-xs font-semibold text-red-500 mt-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                className="rounded-lg border-zinc-200"
                {...registerPassword("newPassword")} 
              />
              {passwordErrors.newPassword && (
                <p className="text-xs font-semibold text-red-500 mt-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                className="rounded-lg border-zinc-200"
                {...registerPassword("confirmPassword")} 
              />
              {passwordErrors.confirmPassword && (
                <p className="text-xs font-semibold text-red-500 mt-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isPasswordLoading}
                className="rounded-lg bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm font-semibold flex items-center gap-1.5 px-4 py-2 transition dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {isPasswordLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
