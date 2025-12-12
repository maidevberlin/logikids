import type { Cleanable } from './types'

/**
 * Registry of resources that need periodic cleanup.
 *
 * REDIS MIGRATION: This registry exists because in-memory caches
 * need manual cleanup. When migrating to Redis:
 * 1. Redis-backed resources handle their own TTL
 * 2. Don't register Redis resources here
 * 3. Once all resources use Redis, this registry becomes optional
 */
class CleanupRegistry {
  private resources: Cleanable[] = []

  register(resource: Cleanable): void {
    this.resources.push(resource)
  }

  unregister(name: string): void {
    this.resources = this.resources.filter((r) => r.name !== name)
  }

  getAll(): Cleanable[] {
    return [...this.resources]
  }
}

export const cleanupRegistry = new CleanupRegistry()
