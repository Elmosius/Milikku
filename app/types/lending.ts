export interface Lending {
  id: string;
  userId: string;
  itemId: string;
  borrowerName: string;
  borrowerContact: string | null;
  lentAt: string;
  expectedReturnAt: string | null;
  returnedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
  item?: {
    id: string;
    name: string;
    photoUrl: string | null;
  };
}
