const fs = require('node:fs');
const assert = require('node:assert/strict');
const { JSDOM } = require('jsdom');
const acorn = require('acorn');
const path = require('node:path');
const file = path.resolve(__dirname, '../Discord-PowerTools.user.js');
const source = fs.readFileSync(file, 'utf8');
const ast = acorn.parse(source, { ecmaVersion: 'latest' });
const body = ast.body[0].expression.callee.body.body;
const declarations = body.filter(n => n.type === 'FunctionDeclaration').map(n => n.id.name);
assert.equal(new Set(declarations).size, declarations.length, 'No duplicate top-level functions');
assert.ok(Buffer.byteLength(source) < 2 * 1024 * 1024);
assert.equal((source.match(/new MutationObserver/g) || []).length, 1);
assert.ok(source.includes('// @noframes'));
assert.ok(!/\beval\s*\(|new Function\s*\(|@require|@connect/.test(source));
let assertions = 5;
function check(value, message) { assert.ok(value, message); assertions++; }
function setup(values = {}, failStorage = false) {
  const dom = new JSDOM('<!doctype html><html><head><title>Discord</title></head><body><main><ol id="chat-messages"></ol></main></body></html>', {
    url: 'https://discord.com/channels/123/456', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const w = dom.window;
  const saved = new Map(Object.entries(values));
  w.GM_getValue = (key, fallback) => saved.has(key) ? saved.get(key) : fallback;
  w.GM_setValue = (key, value) => { if (failStorage) throw Error('quota'); saved.set(key, value); };
  w.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
  w.HTMLElement.prototype.scrollIntoView = function() {};
  w.HTMLElement.prototype.scrollTo = function() {};
  w.confirm = () => false;
  const errors = [];
  w.addEventListener('error', e => errors.push(e.message));
  w.console.warn = () => {};
  const instrumented = source.replace('  function boot() {', `  window.__audit = {
    normalizeSettings, normalizeFocusData, normalizePerformance2Data,
    parseDiscordRoute, sanitizeUrl, safeHttpUrl, isAnalyticsUrl, isErrorReportingUrl,
    applyMediaHints, setSetting, setDashboardTab, boot, readStoredValue, writeStoredValue, downloadLocalSnapshot,
    getSettings: () => settings, getTabs: () => DASHBOARD_TABS,
    issues: () => runtimeIssues
  };\n  function boot() {`);
  w.eval(instrumented);
  w.__audit.boot();
  return { dom, w, saved, errors };
}
(async () => {
  const {dom, w, saved, errors} = setup();
  const a = w.__audit;
  check(w.document.querySelectorAll('#dpt-panel').length === 1, 'Boot mounts one dashboard');
  check(w.document.querySelectorAll('[role="tab"]').length === 17, 'All 17 dashboard tabs preserved');
  for (const tab of a.getTabs()) {
    a.setDashboardTab(tab.id, {scroll: false});
    check(w.document.querySelector(`[data-dpt-tab-button="${tab.id}"]`).getAttribute('aria-selected') === 'true', `${tab.id} renders and selects`);
  }
  check(errors.length === 0, 'No uncaught boot/tab errors: ' + errors.join(';'));
  check(a.issues().length === 0, 'No caught renderer failures');
  let snapshotBlob, snapshotName, revoked = false;
  w.URL.createObjectURL = blob => {snapshotBlob = blob; return 'blob:local-test';};
  w.URL.revokeObjectURL = url => {revoked = url === 'blob:local-test';};
  w.HTMLAnchorElement.prototype.click = function() {snapshotName = this.download;};
  a.downloadLocalSnapshot();
  check(snapshotBlob.type === 'application/json' && snapshotName.startsWith('Discord-PowerTools-1.6.0-'), 'Snapshot creates downloadable JSON with versioned filename');
  check(!w.document.querySelector('a[download]'), 'Snapshot temporary anchor removed');
  await new Promise(r => setTimeout(r, 1100));
  check(revoked, 'Snapshot object URL released after download request');
  check(a.normalizeFocusData({timerMinutes: 'broken', timerEndAt: Infinity}).timerMinutes === 25, 'Corrupt timer duration defaults safely');
  check(a.normalizeFocusData({timerEndAt: Infinity}).timerEndAt === 0, 'Non-finite timer deadline rejected');
  check(a.normalizePerformance2Data({highLoadDomThreshold: 'broken'}).highLoadDomThreshold === 5500, 'Corrupt diagnostic threshold defaults safely');
  const launcher = w.document.querySelector('#dpt-launcher');
  launcher.click();
  check(launcher.getAttribute('aria-expanded') === 'true', 'Opening announces expanded');
  w.document.querySelector('#dpt-panel').dispatchEvent(new w.KeyboardEvent('keydown', {key: 'Escape', bubbles: true}));
  check(w.document.querySelector('#dpt-panel').hidden && w.document.activeElement === launcher, 'Escape closes and restores focus');
  const result = a.normalizeSettings({enabled: 'false', panelWidth: 'bad', panelOpacity: Infinity, launcherSize: 1000, uiTheme: '__proto__', fpsPosition: 'bad', bogus: true});
  check(result.enabled === true && result.panelWidth === 360 && result.panelOpacity === 96 && result.launcherSize === 76 && result.uiTheme === 'purple-dragon' && !('bogus' in result), 'Malformed settings cannot enter runtime state');
  a.setSetting('__proto__', {polluted: true});
  check(!a.getSettings().polluted, 'Unknown setting keys rejected');
  a.setSetting('panelWidth', 9999);
  check(saved.get('DiscordPowerTools:settingsV3').panelWidth === 460, 'Settings normalized before persistence');
  check(w.localStorage.getItem('DiscordPowerTools:settingsV3') === null, 'No site-storage mirror on successful GM writes');
  check(a.isAnalyticsUrl('https://discord.com/api/v9/science'), 'Known Discord telemetry endpoint matched');
  check(a.isAnalyticsUrl(new w.URL('https://ptb.discord.com/api/v10/science')), 'URL-object telemetry input supported');
  for (const url of ['https://example.com/track-order', 'https://discord.com/api/v9/channels/123/metrics', 'https://notdiscord.com/api/v9/science']) {
    check(!a.isAnalyticsUrl(url), 'Unrelated route not blocked: ' + url);
  }
  check(a.isErrorReportingUrl('https://o1.ingest.sentry.io/api/123/envelope/'), 'Sentry ingestion matched');
  check(!a.isErrorReportingUrl('https://example.com/errors') && !a.isErrorReportingUrl('https://sentry.io.evil.test/api/123/store'), 'Error classifier avoids broad substring matches');
  check(a.safeHttpUrl('javascript:alert(1)') === '', 'Executable URLs rejected');
  const chat = w.document.querySelector('#chat-messages');
  const first = w.document.createElement('img'); first.width = 800;
  const second = w.document.createElement('img'); second.width = 800;
  chat.append(first);
  await new Promise(r => setTimeout(r, 20));
  chat.append(second);
  const dialog = w.document.createElement('div'); dialog.setAttribute('role', 'dialog');
  dialog.innerHTML = '<img width="800">'; chat.append(dialog);
  await new Promise(r => setTimeout(r, 250));
  check(first.decoding === 'async' && second.decoding === 'async', 'Observer processes standalone media across queued batches');
  check(!dialog.querySelector('img').decoding, 'Floating dialog media untouched');
  a.setSetting('performancePlus', false);
  const third = w.document.createElement('img'); third.width = 800; chat.append(third);
  await new Promise(r => setTimeout(r, 250));
  check(third.decoding === 'async', 'Performance 2 works independently of core Performance+');
  const count = w.document.querySelectorAll('#dpt-panel').length;
  w.eval(source);
  check(w.document.querySelectorAll('#dpt-panel').length === count, 'Reinjection does not duplicate UI');
  dom.window.close();
  const fallback = setup({}, true);
  fallback.w.__audit.setSetting('panelWidth', 420);
  check(JSON.parse(fallback.w.localStorage.getItem('DiscordPowerTools:settingsV3')).panelWidth === 420, 'Manager failure falls back to local storage');
  fallback.saved.set('DiscordPowerTools:settingsV3', {panelWidth: 320});
  check(fallback.w.__audit.readStoredValue('DiscordPowerTools:settingsV3').panelWidth === 420, 'New fallback value wins over stale manager data');
  fallback.w.GM_setValue = (key, value) => fallback.saved.set(key, value);
  fallback.w.__audit.writeStoredValue('DiscordPowerTools:settingsV3', {panelWidth: 430});
  check(fallback.w.localStorage.getItem('DiscordPowerTools:settingsV3') === null, 'Manager recovery removes fallback copy');
  check(fallback.w.__audit.readStoredValue('DiscordPowerTools:settingsV3').panelWidth === 430, 'Recovered manager value is authoritative');
  fallback.dom.window.close();
  const reload = setup({'DiscordPowerTools:settingsV3': { panelWidth: 'broken', fpsPosition: 'wrong', enabled: false }});
  check(reload.w.__audit.getSettings().panelWidth === 360 && reload.w.__audit.getSettings().enabled === false, 'Saved settings validated on reload and explicit false preserved');
  reload.dom.window.close();
  console.log(`PASS: ${assertions} checks; all 17 tabs rendered in simulated Discord DOM.`);
})().catch(e => { console.error(e); process.exit(1); });
