import { z } from "zod";


export const buyerSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email").optional(),

  city: z.enum([
    "CHANDIGARH",
    "MOHALI",
    "ZIRAKPUR",
    "PANCHKULA",
    "OTHER",
  ]),

  propertyType: z.enum([
    "APARTMENT",
    "VILLA",
    "PLOT",
    "OFFICE",
    "RETAIL",
  ]),

  purpose: z.enum(["BUY", "RENT"]),

  bhk: z.enum(["ONE", "TWO", "THREE", "FOUR", "STUDIO"]).optional(),

  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),

  timeline: z.enum([
    "ZERO_TO_THREE",
    "THREE_TO_SIX",
    "MORE_THAN_SIX",
    "EXPLORING",
  ]).default("EXPLORING"),

  source: z.enum([
    "WEBSITE",
    "REFERRAL",
    "WALKIN",
    "CALL",
    "OTHER",
  ]).default("OTHER"),

  status: z.enum([
    "NEW",
    "QUALIFIED",
    "CONTACTED",
    "VISITED",
    "NEGOTIATION",
    "CONVERTED",
    "DROPPED",
  ]).default("NEW"),

  notes: z.string().optional(),

  tags: z.array(z.string()).optional(),

  updatedAt: z.date().optional(),
});

// ✅ Type helper for forms
export type BuyerFormData = z.infer<typeof buyerSchema>;
// Helper to validate budget
export const validateBudget = (budgetMin?: number, budgetMax?: number) => {
  if (budgetMin !== undefined && budgetMax !== undefined && budgetMax < budgetMin) {
    return "Maximum budget must be greater than or equal to minimum budget";
  }
  return null;
};
