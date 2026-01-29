import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
}

// Create database connection (will fail gracefully if DATABASE_URL is not set)
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
export const db = sql ? drizzle(sql, { schema }) : null as any;

// Export schema for use in queries
export * from './schema';
