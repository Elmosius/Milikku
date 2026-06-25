import {
  boolean,
  integer,
  numeric,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { authenticatedRole } from 'drizzle-orm/supabase';

const authenticatedUserOwns = (userIdColumn: AnyPgColumn) =>
  sql`(select auth.uid()) is not null and (select auth.uid()) = ${userIdColumn}`;

// Example profile table mapped to Supabase's auth.users table
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').primaryKey(), // matches Supabase auth.users.id
    fullName: text('full_name'),
    avatarUrl: text('avatar_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    pgPolicy('Users can view their own profile', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.id),
    }),
    pgPolicy('Users can create their own profile', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.id),
    }),
    pgPolicy('Users can update their own profile', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.id),
      withCheck: authenticatedUserOwns(table.id),
    }),
  ],
).enableRLS();

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    icon: text('icon'),
    color: text('color'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    pgPolicy('Users can view their own categories', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can create their own categories', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can update their own categories', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can delete their own categories', {
      for: 'delete',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
  ],
).enableRLS();

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    pgPolicy('Users can view their own locations', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can create their own locations', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can update their own locations', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can delete their own locations', {
      for: 'delete',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
  ],
).enableRLS();

export const items = pgTable(
  'items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
    locationId: uuid('location_id').references(() => locations.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    brand: text('brand'),
    model: text('model'),
    serialNumber: text('serial_number'),
    photoUrl: text('photo_url'),
    receiptUrl: text('receipt_url'),
    purchaseDate: text('purchase_date'), // ISO date string e.g. '2023-01-15'
    purchasePrice: numeric('purchase_price'), // stored as numeric for precision
    purchaseLocation: text('purchase_location'),
    warrantyExpiry: text('warranty_expiry'), // ISO date string
    condition: text('condition'), // ItemCondition values
    status: text('status'), // ItemStatus values
    notes: text('notes'),
    quantity: integer('quantity').notNull().default(1),
    isFavorite: boolean('is_favorite').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    pgPolicy('Users can view their own items', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can create their own items', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can update their own items', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can delete their own items', {
      for: 'delete',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
  ],
).enableRLS();

export const itemsRelations = relations(items, ({ one, many }) => ({
  category: one(categories, {
    fields: [items.categoryId],
    references: [categories.id],
  }),
  location: one(locations, {
    fields: [items.locationId],
    references: [locations.id],
  }),
  profile: one(profiles, {
    fields: [items.userId],
    references: [profiles.id],
  }),
  lendings: many(lendings),
}));

export const lendings = pgTable(
  'lendings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    itemId: uuid('item_id')
      .notNull()
      .references(() => items.id, { onDelete: 'cascade' }),
    borrowerName: text('borrower_name').notNull(),
    borrowerContact: text('borrower_contact'),
    lentAt: text('lent_at').notNull(),
    expectedReturnAt: text('expected_return_at'),
    returnedAt: text('returned_at'),
    notes: text('notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    pgPolicy('Users can view their own lendings', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can create their own lendings', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can update their own lendings', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can delete their own lendings', {
      for: 'delete',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
  ],
).enableRLS();

export const lendingsRelations = relations(lendings, ({ one }) => ({
  item: one(items, {
    fields: [lendings.itemId],
    references: [items.id],
  }),
  profile: one(profiles, {
    fields: [lendings.userId],
    references: [profiles.id],
  }),
}));

export const reminderStates = pgTable(
  'reminder_states',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => profiles.id, { onDelete: 'cascade' }),
    reminderKey: text('reminder_key').notNull(),
    readAt: timestamp('read_at'),
    dismissedAt: timestamp('dismissed_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('reminder_states_user_key_unique').on(table.userId, table.reminderKey),
    pgPolicy('Users can view their own reminder states', {
      for: 'select',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can create their own reminder states', {
      for: 'insert',
      to: authenticatedRole,
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can update their own reminder states', {
      for: 'update',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
      withCheck: authenticatedUserOwns(table.userId),
    }),
    pgPolicy('Users can delete their own reminder states', {
      for: 'delete',
      to: authenticatedRole,
      using: authenticatedUserOwns(table.userId),
    }),
  ],
).enableRLS();
