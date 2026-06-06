import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().max(500, 'Description must be 500 characters or less').optional().nullable(),
  icon: z.string().optional().nullable(),
})

export type LocationSchema = z.infer<typeof locationSchema>
