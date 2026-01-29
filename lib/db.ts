import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create database connection
// Note: Each API route should ideally create its own connection for serverless
function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
}

// Export a function to get db, or null if not configured
export function getDb() {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  return createDb();
}

// For backwards compatibility - create db if DATABASE_URL is set
export const db = process.env.DATABASE_URL ? createDb() : (null as any);

// Export schema for use in queries
export * from './schema';
