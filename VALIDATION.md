# Validation — 1.6.0

Completed November 6, 2026.

## Passed

- Node.js syntax check of the complete userscript.
- ESLint static checks: undefined names, duplicate declarations/arguments/object keys, unreachable code, constructor/super usage and typeof values.
- 55 assertions in the jsdom/Acorn suite, including all 17 tabs rendering without caught or uncaught renderer errors.
- Single shared MutationObserver, no duplicate top-level functions, no eval/dynamic Function or remote code grants, no-frame metadata and script size below 2 MB.
- Corrupt settings and non-finite timer/diagnostic values; unknown keys; explicit false values; normalized persistence.
- No new local mirror for successful manager writes; manager failure recovery, stale manager data and successful manager recovery.
- Standalone media nodes across queued mutation batches; floating dialog exclusion; Performance+ 2.0 independent of core Performance+.
- Launcher expanded state, Escape close/focus restoration and duplicate script injection.
- Exact telemetry/error-ingestion URL checks, URL-object inputs and executable URL rejection.

These checks run a simulated DOM. They do not establish live Discord compatibility, actual FPS improvement or provider/network interception.

- JSON snapshot Blob type/filename, temporary-anchor cleanup and object-URL release (simulated download).

## Live acceptance still required

1. Install the script in your actual userscript manager. Open Discord, PTB and Canary as applicable; confirm one launcher and persistence across reloads.
2. Open each tab and exercise the tools against visible messages, code blocks, attachments, DMs and server channels. Confirm no console errors.
3. Open slash commands, autocomplete, tooltips, menus and dialogs with performance presets enabled; verify native backgrounds, layering and keyboard selection.
4. Test focus layouts, timer pause/resume/completion and local notification controls. Confirm the master switch restores expected presentation.
5. Test narrow windows, zoom, launcher/panel dragging, keyboard focus and reduced-motion preferences.
6. Copy/download a snapshot and inspect its contents. Confirm clipboard fallback and JSON download in the real browser.
7. Check advanced privacy guards in browser network tools before relying on them. Sandboxed managers may not intercept page API calls.
8. Review Greasy Fork's submission feedback. No Greasy Fork upload or moderation approval is implied by these checks.
