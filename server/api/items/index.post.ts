import { db } from '../../utils/db';
import { items, profiles } from '../../database/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const { userId, user } = await getAuthenticatedUser(event);

  const body = await readBody(event);

  if (!body.name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' });
  }
  if (!body.categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Category is required' });
  }
  if (!body.locationId) {
    throw createError({ statusCode: 400, statusMessage: 'Location is required' });
  }

  try {
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.id, userId),
    });
    if (!existingProfile) {
      await db.insert(profiles).values({
        id: userId,
        fullName: user.user_metadata?.full_name || user.email || 'User',
      });
    }

    const [newItem] = await db
      .insert(items)
      .values({
        userId,
        categoryId: body.categoryId || null,
        locationId: body.locationId || null,
        name: body.name,
        brand: body.brand || null,
        model: body.model || null,
        serialNumber: body.serialNumber || null,
        photoUrl: body.photoUrl || null,
        receiptUrl: body.receiptUrl || null,
        purchaseDate: body.purchaseDate || null,
        purchasePrice: body.purchasePrice != null ? String(body.purchasePrice) : null,
        purchaseLocation: body.purchaseLocation || null,
        warrantyExpiry: body.warrantyExpiry || null,
        condition: body.condition || null,
        status: body.status || null,
        notes: body.notes || null,
        quantity: body.quantity ?? 1,
        isFavorite: body.isFavorite ?? false,
      })
      .returning();

    return newItem;
  } catch (error: any) {
    console.error('Create item error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save item data. Please try again.',
    });
  }
});
