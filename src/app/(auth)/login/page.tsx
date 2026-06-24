// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { APP_NAME, MOCK_CREDENTIALS } from "@/constants/app";
// import { useAppDispatch } from "@/hooks/redux";
// import { type LoginFormData } from "@/schemas/auth";
// import { useLoginMutation } from "@/services/authApi";
// import { setCredentials } from "@/store/slices/authSlice";
// import { Building2, Loader2 } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";

// export default function LoginPage() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const [login, { isLoading }] = useLoginMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     defaultValues: {
//       email: MOCK_CREDENTIALS.email,
//       password: MOCK_CREDENTIALS.password,
//       rememberMe: true,
//     },
//   });

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const result = await login(data).unwrap();
//       dispatch(
//         setCredentials({
//           user: result.user,
//           tokens: result.tokens,
//           rememberMe: data.rememberMe,
//         }),
//       );
//       toast.success("Welcome back!");
//       router.push("/dashboard");
//     } catch (err: unknown) {
//       const message =
//         err && typeof err === "object" && "data" in err
//           ? (err as { data?: { message?: string } }).data?.message
//           : "Login failed";
//       toast.error(message ?? "Login failed");
//     }
//   };

//   return (
//     <Card>
//       <CardHeader className="text-center">
//         <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
//           <Building2 className="h-6 w-6 text-white" />
//         </div>
//         <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
//         <CardDescription>Sign in to your enterprise account</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="email" {...register("email")} />
//             {errors.email && (
//               <p className="text-sm text-danger">{errors.email.message}</p>
//             )}
//           </div>
//           <div className="space-y-2">
//             <Label htmlFor="password">Password</Label>
//             <Input id="password" type="password" {...register("password")} />
//             {errors.password && (
//               <p className="text-sm text-danger">{errors.password.message}</p>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="rememberMe"
//               {...register("rememberMe")}
//             />
//             <Label htmlFor="rememberMe" className="font-normal">
//               Remember me
//             </Label>
//           </div>
//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
//             Sign In
//           </Button>
//         </form>
//         <div className="mt-4 text-center text-sm">
//           <Link
//             href="/forgot-password"
//             className="text-primary hover:underline"
//           >
//             Forgot password?
//           </Link>
//         </div>
//         <p className="mt-4 text-xs text-center text-muted-foreground">
//           Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_CREDENTIALS } from "@/constants/app";
import { useAppDispatch } from "@/hooks/redux";
import { useLoginMutation } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { Building2, Loader2, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface LoginPageFormData {
  workspace: string;
  email: string;
  password: string;
  rememberMe?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPageFormData>({
    defaultValues: {
      workspace: "main",
      email: MOCK_CREDENTIALS.email,
      password: MOCK_CREDENTIALS.password,
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginPageFormData) => {
    const { email, password, rememberMe = true } = data;

    try {
      const result = await login({ email, password, rememberMe }).unwrap();

      dispatch(
        setCredentials({
          user: result.user,
          tokens: result.tokens,
          rememberMe,
        }),
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
    <div>
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
            <Building2 className="h-12 w-12 text-blue-400" />
          </div>

          <h1 className="text-3xl font-bold text-white">Real Estate ERP</h1>

          <p className="mt-1 text-slate-300">Sign in to your workspace</p>
        </div>

        {/* Login Card */}
        <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">
                Welcome back
              </h2>

              <p className="text-slate-500">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Workspace */}
              <div>
                <Label
                  htmlFor="workspace"
                  className="mb-2 block text-base font-medium"
                >
                  Workspace
                </Label>

                <div className="relative">
                  <select
                    id="workspace"
                    {...register("workspace", {
                      required: "Workspace is required",
                    })}
                    className="
                      h-11
                      w-full
                      appearance-none
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      text-sm
                      outline-none
                      transition
                      focus:border-blue-500
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                  >
                    <option value="">Select Workspace</option>
                    <option value="main">Main Workspace</option>
                    <option value="admin">Admin Workspace</option>
                  </select>

                  <ChevronDown className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>

                {errors.workspace && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.workspace.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="mb-2 block text-base font-medium"
                >
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                  })}
                  className="
                    h-11
                    rounded-xl
                    border-slate-200
                  "
                />

                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label
                  htmlFor="password"
                  className="mb-2 block text-base font-medium"
                >
                  Password
                </Label>

                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className="
                    h-11
                    rounded-xl
                    border-slate-200
                  "
                />

                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="
                  mt-4
                  h-11
                  w-full
                  rounded-xl
                  bg-black
                  text-base
                  font-medium
                  text-white
                  hover:bg-black/90
                "
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <span className="text-slate-500">Don't have an account?</span>

              <Link
                href="/register"
                className="ml-1 font-medium text-blue-600 hover:underline"
              >
                Get Started
              </Link>
            </div>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
