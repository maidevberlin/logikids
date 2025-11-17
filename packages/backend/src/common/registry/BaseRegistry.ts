import { createLogger } from '../logger';
import type { Logger } from '../logger';
import { RegistryInitializationError } from '../errors';

/**
 * Abstract base class for registries that load and manage items
 * Provides common initialization, storage, and retrieval functionality
 */
export abstract class BaseRegistry<T, TId = string> {
  protected items = new Map<string, T>();
  protected initialized = false;

  /**
   * Initialize the registry by loading all items
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      this.getLogger().debug('Already initialized');
      return;
    }

    try {
      const ids = await this.getItemIds();
      const logger = this.getLogger();

      logger.debug(`[${this.getRegistryName()}] Loading ${ids.length} items...`);

      // Load each item
      for (const id of ids) {
        try {
          const item = await this.loadItem(id);
          const key = this.getItemKey(item);
          this.items.set(key, item);
          logger.debug(`[${this.getRegistryName()}] Loaded item: ${key}`);
        } catch (error: any) {
          logger.error(`[${this.getRegistryName()}] Failed to load item ${id}:`, error.message);
          throw error; // Fail fast on invalid items
        }
      }

      this.initialized = true;
      logger.debug(`[${this.getRegistryName()}] Initialization complete: ${this.items.size} items loaded`);

      // Call post-initialization hook
      await this.afterInitialize();
    } catch (error: any) {
      throw new RegistryInitializationError(this.getRegistryName(), error.message);
    }
  }

  /**
   * Get an item by its key
   */
  get(key: string): T | undefined {
    return this.items.get(key);
  }

  /**
   * Get all registered items
   */
  getAll(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Get all item IDs to load during initialization
   */
  protected abstract getItemIds(): Promise<TId[]>;

  /**
   * Load a single item by its ID
   */
  protected abstract loadItem(id: TId): Promise<T>;

  /**
   * Get the key to use for storing an item in the map
   */
  protected abstract getItemKey(item: T): string;

  /**
   * Get the logger instance for this registry
   */
  protected abstract getLogger(): Logger;

  /**
   * Get the registry name for logging purposes
   */
  protected abstract getRegistryName(): string;

  /**
   * Hook called after successful initialization
   * Override this to add custom post-initialization logic
   */
  protected async afterInitialize(): Promise<void> {
    // Default: no-op
  }
}
