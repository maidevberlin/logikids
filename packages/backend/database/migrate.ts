#!/usr/bin/env bun
/**
 * Database Migration Runner
 *
 * Runs pending SQL migrations from the migrations directory.
 * Tracks applied migrations in the schema_migrations table.
 *
 * Usage:
 *   bun run database/migrate.ts
 *   docker compose exec backend-dev bun run migrate
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { pool } from './db';

const MIGRATIONS_DIR = join(import.meta.dir, 'migrations');

interface Migration {
  name: string;
  path: string;
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await pool.query(
    'SELECT migration_name FROM schema_migrations ORDER BY applied_at'
  );
  return new Set(result.rows.map(row => row.migration_name));
}

async function getPendingMigrations(): Promise<Migration[]> {
  const files = await readdir(MIGRATIONS_DIR);
  const sqlFiles = files
    .filter(file => file.endsWith('.sql'))
    .sort(); // Alphabetical order (001, 002, etc.)

  const appliedMigrations = await getAppliedMigrations();

  return sqlFiles
    .filter(file => !appliedMigrations.has(file))
    .map(file => ({
      name: file,
      path: join(MIGRATIONS_DIR, file)
    }));
}

async function applyMigration(migration: Migration): Promise<void> {
  console.log(`📝 Applying migration: ${migration.name}`);

  const sql = await readFile(migration.path, 'utf-8');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Run the migration SQL
    await client.query(sql);

    // Record the migration as applied
    await client.query(
      'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
      [migration.name]
    );

    await client.query('COMMIT');
    console.log(`✅ Successfully applied: ${migration.name}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Failed to apply migration: ${migration.name}`);
    throw error;
  } finally {
    client.release();
  }
}

async function ensureSchemaMigrationsTable(): Promise<void> {
  // Check if schema_migrations table exists
  const result = await pool.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_name = 'schema_migrations'
    );
  `);

  const tableExists = result.rows[0].exists;

  if (!tableExists) {
    console.log('🔧 Creating schema_migrations table...');
    const schemaMigrationPath = join(MIGRATIONS_DIR, '000_schema_migrations.sql');
    const sql = await readFile(schemaMigrationPath, 'utf-8');
    await pool.query(sql);

    // Record 000_schema_migrations.sql as applied
    await pool.query(
      'INSERT INTO schema_migrations (migration_name) VALUES ($1)',
      ['000_schema_migrations.sql']
    );
    console.log('✅ schema_migrations table created');
  }
}

async function runMigrations(): Promise<void> {
  console.log('🚀 Starting database migrations...\n');

  try {
    // Ensure schema_migrations table exists
    await ensureSchemaMigrationsTable();

    // Get pending migrations
    const pendingMigrations = await getPendingMigrations();

    if (pendingMigrations.length === 0) {
      console.log('✨ No pending migrations. Database is up to date!');
      return;
    }

    console.log(`📋 Found ${pendingMigrations.length} pending migration(s):\n`);
    pendingMigrations.forEach(m => console.log(`   - ${m.name}`));
    console.log('');

    // Apply each migration
    for (const migration of pendingMigrations) {
      await applyMigration(migration);
    }

    console.log(`\n✨ All migrations completed successfully!`);

    // Show applied migrations summary
    const appliedMigrations = await getAppliedMigrations();
    console.log(`\n📊 Total migrations applied: ${appliedMigrations.size}`);

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
void runMigrations();
