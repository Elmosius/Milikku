import { serverSupabaseUser } from '#supabase/server';
import type { H3Event } from 'h3';

/**
 * Authenticates the request and returns only the user ID.
 * Use this when you only need the userId for DB queries.
 */
export async function getAuthenticatedUserId(event: H3Event): Promise<string> {
  const user = await serverSupabaseUser(event);
  const userId = (user as any)?.id || user?.sub;

  if (!user || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return userId;
}

/**
 * Authenticates the request and returns both the user object and userId.
 * Use this when you need access to user metadata (e.g. user_metadata, email).
 */
export async function getAuthenticatedUser(event: H3Event): Promise<{ userId: string; user: any }> {
  const user = await serverSupabaseUser(event);
  const userId = (user as any)?.id || user?.sub;

  if (!user || !userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return { userId, user };
}
