# Changelog

## 1.6.0 — Reliability and accessibility

- Preserve all 17 dashboard tabs and the existing author, script identity and MIT metadata.
- Validate all core settings when loading, migrating and saving. Reject unknown setting keys and non-finite stored timer/diagnostic numbers.
- Unify storage for all 11 feature data stores. Stop mirroring every successful manager write into Discord local storage; report failures and recover fallback writes without reading stale manager data first.
- Fix shared observer batches dropping new nodes while an idle pass is queued. Include standalone added images/videos, bound queued roots and support Performance+ 2.0 when core Performance+ is off.
- Scope media optimizations to message containers, avoid floating UI descendants and stop changing picture-in-picture behavior.
- Narrow request classifiers to Discord science and Sentry ingestion endpoints; handle URL objects and document sandbox limitations.
- Add no-frame metadata and a reinjection guard; avoid early settings application when the document root is unavailable.
- Add dashboard region labeling, launcher expanded state, connected tab/panel relationships, Escape close, focus restoration, visible focus outlines, reduced-motion UI support and live status announcements.
- Add a downloadable JSON snapshot in Stable, alongside the existing clipboard export.
- Include reproducible syntax/static/DOM checks, a development lockfile and GitHub Actions validation.

## 1.5.4 — Supplied baseline

Overlay Compatibility Rebuild: performance CSS was scoped away from Discord slash-command menus, autocomplete, dialogs and other floating interaction surfaces. This behavior is preserved. The original ZIP remains unchanged.
