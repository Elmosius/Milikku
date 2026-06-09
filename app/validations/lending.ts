import { z } from 'zod';

export const lendingSchema = z.object({
  itemId: z.string().min(1, 'Item is required'),
  borrowerName: z.string().min(1, 'Borrower name is required').max(100),
  borrowerContact: z.string().max(100).nullable().optional(),
  lentAt: z.string().min(1, 'Lent date is required'),
  expectedReturnAt: z.string().nullable().optional(),
  notes: z.string().max(500).nullable().optional(),
}).refine((data) => {
  if (data.expectedReturnAt && data.lentAt) {
    return new Date(data.expectedReturnAt) >= new Date(data.lentAt);
  }
  return true;
}, {
  message: "Expected return date cannot be before the lend date",
  path: ["expectedReturnAt"],
});

export const returnLendingSchema = z.object({
  returnedAt: z.string().min(1, 'Return date is required'),
});

export type LendingFormValues = z.infer<typeof lendingSchema>;
export type ReturnLendingFormValues = z.infer<typeof returnLendingSchema>;
