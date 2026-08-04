import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { StorageAdapter, StoragePutInput, StoragePutResult } from '@opoha/plugin-sdk';

/**
 * Resolves the on-disk root for localfs storage.
 * Prefer `OPOHA_STORAGE_LOCALFS_ROOT`; otherwise `<cwd>/.opoha-storage`.
 */
export function resolveLocalFsRoot(
  explicitRoot?: string,
  env: NodeJS.ProcessEnv = process.env,
  cwd: string = process.cwd(),
): string {
  const fromEnv = env.OPOHA_STORAGE_LOCALFS_ROOT?.trim();
  if (explicitRoot && explicitRoot.trim().length > 0) {
    return path.resolve(explicitRoot);
  }
  if (fromEnv && fromEnv.length > 0) {
    return path.resolve(fromEnv);
  }
  return path.resolve(cwd, '.opoha-storage');
}

/**
 * Rejects keys that escape the storage root (path traversal).
 */
export function resolveSafeStoragePath(root: string, key: string): string {
  if (!key || key.trim().length === 0) {
    throw new Error('storage key is required');
  }
  if (key.includes('\0')) {
    throw new Error('storage key must not contain null bytes');
  }
  const normalizedKey = key.replace(/\\/g, '/').replace(/^\/+/, '');
  if (normalizedKey.split('/').some((segment) => segment === '..' || segment === '')) {
    throw new Error(`invalid storage key: ${key}`);
  }
  const resolved = path.resolve(root, normalizedKey);
  const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
  if (resolved !== root && !resolved.startsWith(rootWithSep)) {
    throw new Error(`storage key escapes root: ${key}`);
  }
  return resolved;
}

export type LocalFsStorageAdapterOptions = {
  root?: string;
  /** Optional base URL for getUrl (e.g. http://localhost:3000/files). */
  publicBaseUrl?: string;
};

/**
 * Local filesystem StorageAdapter — put/get/delete/getUrl on disk.
 */
export class LocalFsStorageAdapter implements StorageAdapter {
  readonly code = 'localfs' as const;
  readonly root: string;
  readonly publicBaseUrl?: string;

  constructor(options: LocalFsStorageAdapterOptions = {}) {
    this.root = resolveLocalFsRoot(options.root);
    this.publicBaseUrl = options.publicBaseUrl?.replace(/\/+$/, '');
  }

  async put(input: StoragePutInput): Promise<StoragePutResult> {
    const filePath = resolveSafeStoragePath(this.root, input.key);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, input.body);
    return { key: input.key, size: input.body.byteLength };
  }

  async get(key: string): Promise<Uint8Array> {
    const filePath = resolveSafeStoragePath(this.root, key);
    const buf = await readFile(filePath);
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }

  async delete(key: string): Promise<void> {
    const filePath = resolveSafeStoragePath(this.root, key);
    await rm(filePath, { force: true });
  }

  async getUrl(key: string): Promise<string | undefined> {
    // Validate key even when no public URL is configured.
    resolveSafeStoragePath(this.root, key);
    if (!this.publicBaseUrl) {
      return undefined;
    }
    const encoded = key
      .split('/')
      .map((segment) => encodeURIComponent(segment))
      .join('/');
    return `${this.publicBaseUrl}/${encoded}`;
  }
}
