import { StorageLocalfsSettingsEntity } from './storage-localfs-settings.entity.js';

/** TypeORM entities owned by this plugin (ADR-0005). */
export const storageLocalfsEntities = [StorageLocalfsSettingsEntity] as const;

export { StorageLocalfsSettingsEntity };
