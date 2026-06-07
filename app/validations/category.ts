import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be 50 characters or less'),
  icon: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export type CategorySchema = z.infer<typeof categorySchema>;
