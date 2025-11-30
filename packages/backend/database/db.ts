import { Pool } from 'pg'
import { DatabaseConnectionError } from '../src/common/errors'

/**
 * PostgreSQL connection pool for user sync data storage
 *
 * Configuration via DATABASE_URL environment variable:
 * postgresql://user:password@host:port/database
 */
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Maximum 10 connections in pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5000, // Fail fast if can't connect in 5 seconds
})

// Log pool errors
pool.on('error', (err) => {
  console.error('[Database] Unexpected pool error:', err)
})

/**
 * Initialize database connection and verify connectivity
 * Throws error if connection fails
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const client = await pool.connect()
    try {
      const result = await client.query('SELECT NOW()')
      console.log('[Database] Connection successful, server time:', result.rows[0].now)
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('[Database] Connection failed:', error)
    throw new DatabaseConnectionError()
  }
}

/**
 * Close all connections in the pool
 * Call on server shutdown
 */
export async function closeDatabase(): Promise<void> {
  await pool.end()
  console.log('[Database] Connection pool closed')
}
