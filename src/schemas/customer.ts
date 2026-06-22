import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  nid: z.string().min(10, "NID is required"),
  address: z.string().min(5, "Address is required"),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
