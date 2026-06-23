"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ForgotPasswordFormData } from "@/schemas/auth";
import { useForgotPasswordMutation } from "@/services/authApi";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const result = await forgotPassword(data).unwrap();
      toast.success(result.message);
    } catch {
      toast.error("Failed to send reset link");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a reset link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-danger">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/login" className="text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
