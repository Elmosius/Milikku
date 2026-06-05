import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

// Example profile table mapped to Supabase's auth.users table
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // matches Supabase auth.users.id
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
