"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME, MOCK_CREDENTIALS } from "@/constants/app";
import { useAppDispatch } from "@/hooks/redux";
import { type LoginFormData } from "@/schemas/auth";
import { useLoginMutation } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: MOCK_CREDENTIALS.email,
      password: MOCK_CREDENTIALS.password,
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          tokens: result.tokens,
          rememberMe: data.rememberMe,
        })
      );
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message
          : "Login failed";
      toast.error(message ?? "Login failed");
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
        <CardDescription>Sign in to your enterprise account</CardDescription>
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
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-sm text-danger">{errors.password.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="rememberMe" {...register("rememberMe")} />
            <Label htmlFor="rememberMe" className="font-normal">
              Remember me
            </Label>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <p className="mt-4 text-xs text-center text-muted-foreground">
          Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
        </p>
      </CardContent>
    </Card>
  );
}
