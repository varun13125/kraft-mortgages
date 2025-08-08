import { z } from "zod";

export const LeadSchema = z.object({
  province: z.enum(["BC","AB","ON"]),
  intent: z.string().min(2),
  income: z.number().optional(),
  downPayment: z.number().optional(),
  creditScore: z.number().int().min(300).max(900).optional()
});
