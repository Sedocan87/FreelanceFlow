import * as z from "zod";

export const expenseFormSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  amount: z.number().min(0.01, { message: "Amount must be a positive number." }),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Date must be in YYYY-MM-DD format." }),
});
