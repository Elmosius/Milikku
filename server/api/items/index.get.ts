import { db } from '../../utils/db';
import { items } from '../../database/schema';
import { eq, desc, asc, and, ilike, or } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const userId = await getAuthenticatedUserId(event);
  const query = getQuery(event);

  const search = query.search as string | undefined;
  const categoryId = query.categoryId as string | undefined;
  const locationId = query.locationId as string | undefined;
  const condition = query.condition as string | undefined;
  const status = query.status as string | undefined;
  const isFavorite = query.isFavorite as string | undefined;
  const sortBy = query.sortBy as string | undefined;

  const filters: any[] = [eq(items.userId, userId)];

  if (search) {
    const searchTerm = `%${search}%`;
    filters.push(
      or(
        ilike(items.name, searchTerm),
        ilike(items.brand, searchTerm),
        ilike(items.model, searchTerm)
      )
    );
  }

  if (categoryId && categoryId !== 'all') filters.push(eq(items.categoryId, categoryId));
  if (locationId && locationId !== 'all') filters.push(eq(items.locationId, locationId));
  if (condition && condition !== 'all') filters.push(eq(items.condition, condition));
  if (status && status !== 'all') filters.push(eq(items.status, status));
  if (isFavorite === 'true') filters.push(eq(items.isFavorite, true));

  let orderFn: any = desc(items.createdAt);
  
  if (sortBy === 'oldest') {
    orderFn = asc(items.createdAt);
  } else if (sortBy === 'name-asc') {
    orderFn = asc(items.name);
  } else if (sortBy === 'name-desc') {
    orderFn = desc(items.name);
  }

  const userItems = await db
    .select()
    .from(items)
    .where(and(...filters))
    .orderBy(orderFn);

  return userItems;
});
