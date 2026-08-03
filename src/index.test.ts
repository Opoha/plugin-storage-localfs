import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import storageLocalfs from './index.js';
import {
  LocalFsStorageAdapter,
  resolveLocalFsRoot,
  resolveSafeStoragePath,
} from './local-fs-adapter.js';

describe('@opoha/plugin-storage-localfs', () => {
  it('exports definePlugin definition with storage-localfs id', () => {
    expect(storageLocalfs.id).toBe('storage-localfs');
    expect(typeof storageLocalfs.boot).toBe('function');
  });

  it('registers storage adapter, GraphQL, and admin via boot context', () => {
    const adapters: Array<{ code: string }> = [];
    const graphql: Array<{ name: string; kind: string }> = [];
    const admin: unknown[] = [];

    storageLocalfs.boot?.({
      pluginId: 'storage-localfs',
      registerGraphQL(input) {
        graphql.push({ name: input.name, kind: input.kind });
      },
      registerProvider() {},
      registerListener() {},
      registerAdmin(contribution) {
        admin.push(contribution);
      },
      registerPaymentProvider() {},
      registerShippingMethod() {},
      registerStorageAdapter(adapter) {
        adapters.push({ code: adapter.code });
      },
    });

    expect(adapters).toEqual([{ code: 'localfs' }]);
    expect(graphql).toEqual([{ name: 'localFsStorageRoot', kind: 'query' }]);
    expect(admin).toHaveLength(1);
  });

  it('resolves root from env and rejects path traversal', () => {
    expect(
      resolveLocalFsRoot(undefined, { OPOHA_STORAGE_LOCALFS_ROOT: '/tmp/x' }, '/cwd'),
    ).toBe(path.resolve('/tmp/x'));
    expect(resolveLocalFsRoot(undefined, {}, '/cwd')).toBe(
      path.resolve('/cwd', '.opoha-storage'),
    );
    expect(() =>
      resolveSafeStoragePath('/tmp/root', '../escape'),
    ).toThrow(/invalid storage key/);
  });

  it('puts, gets, deletes, and builds URLs on disk', async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), 'opoha-localfs-'));
    try {
      const adapter = new LocalFsStorageAdapter({
        root,
        publicBaseUrl: 'http://localhost:3000/files',
      });
      const body = new TextEncoder().encode('hello-opoha');
      const put = await adapter.put({
        key: 'orders/receipt.txt',
        body,
        contentType: 'text/plain',
      });
      expect(put).toEqual({ key: 'orders/receipt.txt', size: body.byteLength });

      const got = await adapter.get('orders/receipt.txt');
      expect(new TextDecoder().decode(got)).toBe('hello-opoha');

      const url = await adapter.getUrl('orders/receipt.txt');
      expect(url).toBe('http://localhost:3000/files/orders/receipt.txt');

      await adapter.delete('orders/receipt.txt');
      await expect(adapter.get('orders/receipt.txt')).rejects.toThrow();
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
