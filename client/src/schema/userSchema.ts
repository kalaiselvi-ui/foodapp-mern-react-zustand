import { z } from "zod";

export const userSignupSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  contact: z.string().min(10, { message: "Contact number must be 10 digits" }),
});

export type SignupInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;
