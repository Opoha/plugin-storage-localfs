import { definePlugin } from '@opoha/plugin-sdk';

import { LocalFsStorageAdapter } from './local-fs-adapter.js';

export {
  LocalFsStorageAdapter,
  resolveLocalFsRoot,
  resolveSafeStoragePath,
} from './local-fs-adapter.js';
export type { LocalFsStorageAdapterOptions } from './local-fs-adapter.js';

/**
 * Official local filesystem storage plugin.
 * Registers StorageAdapter with put/get/delete/getUrl on local disk.
 */
export default definePlugin({
  id: 'storage-localfs',
  boot(ctx) {
    const adapter = new LocalFsStorageAdapter({
      publicBaseUrl: process.env.OPOHA_STORAGE_LOCALFS_PUBLIC_URL,
    });
    ctx.registerStorageAdapter(adapter);
    ctx.registerGraphQL({
      name: 'localFsStorageRoot',
      kind: 'query',
      descriptor: {
        resolve: () => adapter.root,
      },
    });
    ctx.registerAdmin({
      navigation: [
        {
          id: 'storage-localfs-nav',
          label: 'Local Storage',
          path: '/plugins/storage-localfs',
          permission: 'plugin:storage-localfs:read',
        },
      ],
      settings: [
        {
          id: 'storage-localfs-settings',
          title: 'Local Filesystem Storage',
          path: '/plugins/storage-localfs/settings',
          permission: 'plugin:storage-localfs:read',
        },
      ],
      permissions: ['plugin:storage-localfs:read'],
    });
  },
});
