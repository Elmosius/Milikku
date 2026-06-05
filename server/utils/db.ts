import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../database/schema';

// For HMR safety in Nuxt/Nitro development
let db: any;

if (process.env.NODE_ENV === 'production') {
  // Disable prepared statements for Supabase Transaction Pooler (port 6543)
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  db = drizzle(client, { schema });
} else {
  const globalConnection = global as typeof globalThis & {
    postgresClient?: postgres.Sql;
  };

  if (!globalConnection.postgresClient) {
    globalConnection.postgresClient = postgres(process.env.DATABASE_URL!, { prepare: false });
  }
  db = drizzle(globalConnection.postgresClient, { schema });
}

export { db };
