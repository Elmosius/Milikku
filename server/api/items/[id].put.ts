import { db } from '../../utils/db';
import { items } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);

  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Item ID is required' });
  }

  const body = await readBody(event);

  const updateData: Partial<typeof items.$inferInsert> = {
    updatedAt: new Date(),
  };

  if (body.name !== undefined) updateData.name = body.name;
  if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;
  if (body.locationId !== undefined) updateData.locationId = body.locationId || null;
  if (body.brand !== undefined) updateData.brand = body.brand || null;
  if (body.model !== undefined) updateData.model = body.model || null;
  if (body.serialNumber !== undefined) updateData.serialNumber = body.serialNumber || null;
  if (body.photoUrl !== undefined) updateData.photoUrl = body.photoUrl || null;
  if (body.purchaseDate !== undefined) updateData.purchaseDate = body.purchaseDate || null;
  if (body.purchasePrice !== undefined)
    updateData.purchasePrice = body.purchasePrice != null ? String(body.purchasePrice) : null;
  if (body.purchaseLocation !== undefined)
    updateData.purchaseLocation = body.purchaseLocation || null;
  if (body.warrantyExpiry !== undefined) updateData.warrantyExpiry = body.warrantyExpiry || null;
  if (body.condition !== undefined) updateData.condition = body.condition || null;
  if (body.status !== undefined) updateData.status = body.status || null;
  if (body.notes !== undefined) updateData.notes = body.notes || null;
  if (body.quantity !== undefined) updateData.quantity = body.quantity;
  if (body.isFavorite !== undefined) updateData.isFavorite = body.isFavorite;

  const [updatedItem] = await db
    .update(items)
    .set(updateData)
    .where(and(eq(items.id, id), eq(items.userId, userId)))
    .returning();

  if (!updatedItem) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' });
  }

  return updatedItem;
});
