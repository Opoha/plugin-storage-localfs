# Local Filesystem Storage Plugin

Official `@opoha/plugin-storage-localfs` — implements the Opoha files storage port on local disk.

## What it registers

- Storage adapter `localfs` (`put` / `get` / `delete` / `getUrl`)
- GraphQL query contribution `localFsStorageRoot`
- Admin settings + nav under `/plugins/storage-localfs`
- Permission `plugin:storage-localfs:read`

## Root directory

Defaults to `OPOHA_STORAGE_LOCALFS_ROOT` or `<cwd>/.opoha-storage`.

## Load

```bash
pnpm install && pnpm build
export OPOHA_PLUGINS="$(pwd)"
```

Core discovers via `OPOHA_PLUGINS` / `OPOHA_PLUGINS_PATH` and dynamically imports `dist/index.js` — core never statically imports this package.
