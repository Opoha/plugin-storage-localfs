import 'reflect-metadata';

/**
 * Plugin-owned TypeORM surface for CLI / host migration aggregation (E-04).
 */

import { StorageLocalfsSettingsEntity } from './entities/storage-localfs-settings.entity.js';
import { storageLocalfsEntities } from './entities/index.js';
import { StorageLocalfsInit1722685200000 } from './migrations/1722685200000-StorageLocalfsInit.js';
import { storageLocalfsMigrations } from './migrations/index.js';

export const PLUGIN_ID = 'storage-localfs' as const;

/** Namespaced migrations table — never shares core `migrations`. */
export const MIGRATIONS_TABLE_NAME = 'opoha_migrations_storage_localfs' as const;

export const entities = storageLocalfsEntities;
export const migrations = storageLocalfsMigrations;

export {
  StorageLocalfsSettingsEntity,
  StorageLocalfsInit1722685200000,
  storageLocalfsEntities,
  storageLocalfsMigrations,
};
