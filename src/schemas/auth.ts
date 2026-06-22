import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const landOwnerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  nid: z.string().min(10, "Valid NID is required"),
  tin: z.string().optional(),
  phone: z.string().min(11, "Valid phone number is required"),
  email: z.string().email().optional().or(z.literal("")),
  ownershipShare: z.number().min(0).max(100),
  address: z.string().min(5, "Address is required"),
});

export const landRecordSchema = z.object({
  mouza: z.string().min(1, "Mouza is required"),
  khatian: z.string().min(1, "Khatian is required"),
  dag: z.string().min(1, "Dag is required"),
  area: z.number().positive("Area must be positive"),
  valuation: z.number().positive("Valuation must be positive"),
});

export const customerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(11, "Valid phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  nid: z.string().min(10, "Valid NID is required"),
  tin: z.string().optional(),
  address: z.string().min(5, "Address is required"),
  nominee: z.string().optional(),
});

export const bookingSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  unitId: z.string().min(1, "Unit is required"),
  bookingAmount: z.number().positive("Booking amount must be positive"),
});

export const collectionSchema = z.object({
  bookingId: z.string().min(1, "Booking is required"),
  amount: z.number().positive("Amount must be positive"),
  type: z.enum(["Booking Money", "Down Payment", "Installment", "Late Fee"]),
  paymentMethod: z.enum(["Cash", "Bank Transfer", "Cheque", "Mobile Banking"]),
  paymentDate: z.string().min(1, "Payment date is required"),
});

export const leadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(11, "Valid phone is required"),
  email: z.string().email().optional().or(z.literal("")),
  source: z.string().min(1, "Source is required"),
  projectInterest: z.string().min(1, "Project interest is required"),
  budget: z.number().positive("Budget must be positive"),
});
