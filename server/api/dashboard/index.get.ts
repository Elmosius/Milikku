import { db } from '../../utils/db';
import { items, categories, locations } from '../../database/schema';
import { eq, sum, count, desc, sql } from 'drizzle-orm';
import { getAuthenticatedUserId } from '../../utils/auth';

export interface DashboardData {
  totalItems: number;
  totalValue: number;
  totalCategories: number;
  totalLocations: number;
  recentItems: any[];
  itemsByCategory: { name: string; value: number }[];
  valueByLocation: { name: string; totalValue: number }[];
}

export default defineEventHandler(async (event): Promise<DashboardData> => {
  const userId = await getAuthenticatedUserId(event);

  // 1. Total Items
  const [itemsTotalRes] = await db
    .select({ total: sum(items.quantity) })
    .from(items)
    .where(eq(items.userId, userId));

  // 2. Total Value
  const [valueTotalRes] = await db
    .select({
      total: sql<number>`SUM(${items.quantity} * COALESCE(${items.purchasePrice}, 0))`.mapWith(Number),
    })
    .from(items)
    .where(eq(items.userId, userId));

  // 3. Total Categories
  const [catsTotalRes] = await db
    .select({ total: count() })
    .from(categories)
    .where(eq(categories.userId, userId));

  // 4. Total Locations
  const [locsTotalRes] = await db
    .select({ total: count() })
    .from(locations)
    .where(eq(locations.userId, userId));

  // 5. Recent Items
  const recentItems = await db.query.items.findMany({
    where: eq(items.userId, userId),
    orderBy: [desc(items.createdAt)],
    limit: 5,
    with: {
      category: true,
      location: true,
    },
  });

  // 6. Items by Category (Donut Chart)
  const itemsByCategory = await db
    .select({
      name: sql<string>`COALESCE(${categories.name}, 'Uncategorized')`,
      value: sum(items.quantity).mapWith(Number),
    })
    .from(items)
    .leftJoin(categories, eq(items.categoryId, categories.id))
    .where(eq(items.userId, userId))
    .groupBy(categories.id);

  // 7. Value by Location (Bar Chart)
  const valueByLocation = await db
    .select({
      name: sql<string>`COALESCE(${locations.name}, 'No Location')`,
      totalValue: sql<number>`SUM(${items.quantity} * COALESCE(${items.purchasePrice}, 0))`.mapWith(Number),
    })
    .from(items)
    .leftJoin(locations, eq(items.locationId, locations.id))
    .where(eq(items.userId, userId))
    .groupBy(locations.id)
    .orderBy(desc(sql<number>`SUM(${items.quantity} * COALESCE(${items.purchasePrice}, 0))`));

  return {
    totalItems: Number(itemsTotalRes?.total || 0),
    totalValue: Number(valueTotalRes?.total || 0),
    totalCategories: catsTotalRes?.total || 0,
    totalLocations: locsTotalRes?.total || 0,
    recentItems,
    itemsByCategory: itemsByCategory.filter((c: any) => c.value > 0),
    valueByLocation: valueByLocation.filter((l: any) => l.totalValue > 0),
  };
});
