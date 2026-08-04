# Local Filesystem Storage Plugin

Official [`@opoha/plugin-storage-localfs`](https://www.npmjs.com/package/@opoha/plugin-storage-localfs) — local filesystem storage adapter plugin.

| | |
| --- | --- |
| npm | `@opoha/plugin-storage-localfs` |
| Plugin id | `storage-localfs` |
| Contract | `0.1` |
| Repo | [Opoha/plugin-storage-localfs](https://github.com/Opoha/plugin-storage-localfs) |

## Install

```bash
pnpm add @opoha/plugin-storage-localfs
```

Add the package to your app `opoha.config.json` `"plugins"` array (or set `OPOHA_PLUGINS` / `OPOHA_PLUGINS_PATH` for a local checkout).

## What it registers

- Storage adapter `localfs` (`put` / `get` / `delete` / `getUrl`)
- Admin settings for root path / public URL prefix

## Load (local checkout)

```bash
pnpm install && pnpm build
export OPOHA_PLUGINS="$(pwd)"
```

Core discovers plugins dynamically and imports `dist/index.js` — **core never statically imports this package**.

## Develop

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
```

## License

MIT © [Opoha](https://github.com/Opoha)
