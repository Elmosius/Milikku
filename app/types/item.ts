import type { ITEM_CONDITIONS, ITEM_STATUSES } from '~/constants/item';

export type ItemCondition = (typeof ITEM_CONDITIONS)[number];
export type ItemStatus = (typeof ITEM_STATUSES)[number];

export interface Item {
  id: string;
  name: string;
  categoryId: string;
  locationId: string;
  photoUrl?: string | null;
  receiptUrl?: string | null;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: string | null;
  purchaseLocation?: string | null;
  warrantyExpiry?: string | null;
  condition?: ItemCondition | null;
  status?: ItemStatus | null;
  notes?: string | null;
  quantity: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt?: string;
}
