import * as z from "zod";

export const formSchema = z.object({
  description: z.string().min(2, { message: "Description must be at least 2 characters." }),
  hours: z.number().min(0, { message: "Hours must be a positive number." }),
});
