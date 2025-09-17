import { z } from "zod";

export const buyerSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,15}$/, "Phone must be 10–15 digits"),
  city: z.string().optional(),
  propertyType: z.enum(["Apartment", "Villa", "Plot", "Other"]),
  bhk: z.number().int().optional(),
  purpose: z.string().optional(),
  budgetMin: z.number().int().optional(),
  budgetMax: z.number().int().optional(),
  timeline: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).refine((data) => {
  if ((data.propertyType === "Apartment" || data.propertyType === "Villa") && !data.bhk) {
    return false;
  }
  return true;
}, { message: "BHK is required for Apartment/Villa", path: ["bhk"] })
.refine((data) => {
  if (data.budgetMin && data.budgetMax) {
    return data.budgetMax >= data.budgetMin;
  }
  return true;
}, { message: "Max budget must be >= Min budget", path: ["budgetMax"] });
