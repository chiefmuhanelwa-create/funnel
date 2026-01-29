import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create database connection lazily
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not set');
    return null;
  }

  if (!_db) {
    const sql = neon(process.env.DATABASE_URL);
    _db = drizzle(sql, { schema });
  }

  return _db;
}

// For backwards compatibility with existing code that imports db directly
// This will be null if DATABASE_URL is not set, so callers must handle that
export const db = (() => {
  if (!process.env.DATABASE_URL) {
    // Return a dummy object that will throw helpful errors when used
    return new Proxy({} as any, {
      get(_, prop) {
        if (prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete') {
          return () => {
            throw new Error('Database not configured. Set DATABASE_URL environment variable.');
          };
        }
        return undefined;
      }
    });
  }
  const sql = neon(process.env.DATABASE_URL);
  return drizzle(sql, { schema });
})();

// Export schema for use in queries
export * from './schema';
