import { z } from 'zod';
import { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item';

export const itemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  categoryId: z.string({ required_error: 'Category is required' }).min(1, 'Category is required'),
  locationId: z.string({ required_error: 'Location is required' }).min(1, 'Location is required'),
  brand: z.string().max(100).nullable().optional(),
  model: z.string().max(100).nullable().optional(),
  serialNumber: z.string().max(100).nullable().optional(),
  purchaseDate: z.string().nullable().optional(),
  purchasePrice: z.coerce.number().nonnegative().nullable().optional(),
  purchaseLocation: z.string().max(150).nullable().optional(),
  warrantyExpiry: z.string().nullable().optional(),
  condition: z.enum(ITEM_CONDITIONS).nullable().optional(),
  status: z.enum(ITEM_STATUSES).nullable().optional(),
  notes: z.string().max(1000).nullable().optional(),
  quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1').default(1),
  isFavorite: z.boolean().default(false),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
