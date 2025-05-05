// lib/validation.ts
import { z } from "zod"

export const mentorFormSchema = z.object({
  is_alumni: z.boolean(),
  available_slots: z.array(z.date()).min(1, { message: "Please select at least one slot" }),
})
