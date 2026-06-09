import { db } from '../../utils/db';
import { items } from '../../database/schema';
import { eq, desc, asc, and, ilike, or, count } from 'drizzle-orm';

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
  
  const page = Math.max(1, parseInt(query.page as string || '1', 10));
  const limit = Math.max(1, parseInt(query.limit as string || '10', 10));
  const offset = (page - 1) * limit;

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
  } else if (sortBy === 'price-asc') {
    orderFn = asc(items.purchasePrice);
  } else if (sortBy === 'price-desc') {
    orderFn = desc(items.purchasePrice);
  }

  // Get total count matching current filters
  const [totalResult] = await db
    .select({ total: count() })
    .from(items)
    .where(and(...filters));
  const totalItems = totalResult?.total || 0;

  // Get paginated items
  const userItems = await db
    .select()
    .from(items)
    .where(and(...filters))
    .orderBy(orderFn)
    .limit(limit)
    .offset(offset);

  return {
    items: userItems,
    pagination: {
      total: totalItems,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
});
