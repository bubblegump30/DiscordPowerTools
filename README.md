# Discord PowerTools

Created by **KyleAustin85**. Version **1.6.0**.

A readable, self-contained userscript for the Discord website, intended for distribution on **Greasy Fork**. It runs on discord.com, ptb.discord.com and canary.discord.com. It does not work inside the Discord desktop application.

## Install

1. Install a userscript manager such as Tampermonkey or Violentmonkey and enable userscript execution in your browser.
2. Install `Discord-PowerTools.user.js` through your manager, or paste its complete contents into a new script and save.
3. Reload the Discord website. Click the Purple Dragon launcher to open the dashboard; drag it to reposition it.
4. When updating an existing installation, keep the existing script name and namespace. Disable duplicate older copies.

No Node.js build or npm installation is needed to use the script. The npm dependencies in this repository are only for development tests.

## Tools

- Core Performance+ and Performance+ 2.0 with media hints, rendering settings and load diagnostics.
- Workspace profiles and per-server workspaces, favorite channels, navigation history and local notes.
- Smart Search across locally saved PowerTools records; this is not a server-wide Discord message search.
- Message selection, copy tools, local message bookmarks, comparisons and timestamp formats.
- Media inspection, attachment links and local media bookmarks.
- Focus layouts, a focus/break timer and local notification display controls.
- Theme Studio, panel customization and an optional render-cadence FPS badge.
- Local cosmetic profile previews. These do not grant Nitro or change what other people see.
- Link cleaning, private external opening and experimental request guards.
- Diagnostics, safe mode and copy/download snapshot exports.

All 17 dashboard tabs are retained. Use Left/Right, Home and End to move through tabs. Escape closes the dashboard and returns focus to the launcher. Nested tools may handle Escape first.

## Data and permissions

The script requests only `GM_getValue` and `GM_setValue`. It includes no remote JavaScript dependencies, token extraction, self-bot messaging, account changes or billing changes. It does not send PowerTools records to an author-operated service. Opening external links or displaying media can still contact the selected destination.

Notes, bookmarks, settings and saved message text are stored in your userscript manager. Existing local storage is read for migration. If manager storage is unavailable or a write fails, Discord-origin local storage is used as a recovery fallback. A successful later manager write removes that recovery copy. Older local-storage copies from previous versions are not automatically deleted.

Settings are local to the browser/manager profile, **not separated by Discord account**. If you switch Discord accounts in the same browser profile, saved PowerTools records remain available. Keep exports private: they can contain message text, channel/server IDs, notes and signed media URLs.

The Stable tab's JSON snapshot is an export for inspection/manual recovery. There is **no automatic restore/import interface**. Local cosmetic image data is omitted from the export. It is not a complete portable backup of every asset.

## Compatibility limits

Discord changes its DOM frequently. Message extraction, focus layouts and visual selectors need checking against the current Discord interface. Media hints are scoped to message containers and avoid dialog/menu/listbox/tooltip descendants. The existing v1.5.4 protection for floating command menus is preserved.

Advanced fetch/beacon guards are off by default. They only wrap APIs visible in the userscript's execution context; a manager's isolated sandbox can prevent them from intercepting Discord's own requests. They do not provide a network-wide privacy guarantee. Notification controls affect local presentation/media and do not update Discord account notification settings.

The FPS badge measures browser animation-frame cadence, not Discord server performance or a guaranteed frame rate. Performance options are tuning choices, not benchmarked speed gains. The dashboard's built-in module checks verify component availability; they are not live integration tests.

## Greasy Fork publishing

Upload the **complete `Discord-PowerTools.user.js` source**, not this repository ZIP or a loader. Retain the name, namespace and MIT license metadata; use the increased version 1.6.0. The code is readable and below Greasy Fork's 2 MB script limit. There is no custom update checker or alternate update URL.

Use `GREASYFORK-INFO.md` for the listing and `CHANGELOG.md` for release notes. Greasy Fork publication and moderation approval have not been performed by this repository update.

## Development validation

With Node.js 24 or newer:

```sh
npm ci
npm test
```

Checks cover syntax, static analysis, metadata/size, all 17 tabs in jsdom, corrupt settings, storage recovery, queued media mutations, overlay exclusion, keyboard behavior and duplicate injection. See `VALIDATION.md` for results and remaining live checks.
