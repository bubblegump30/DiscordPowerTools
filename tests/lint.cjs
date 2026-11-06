const { ESLint } = require('eslint');
const globals = require('globals');
const path = require('node:path');
(async () => {
  const eslint = new ESLint({ overrideConfigFile: true, overrideConfig: [{
    languageOptions: {ecmaVersion: 'latest', sourceType: 'script', globals: {...globals.browser, GM_getValue: 'readonly', GM_setValue: 'readonly'}},
    rules: {'no-undef': 'error', 'no-redeclare': 'error', 'no-dupe-args': 'error', 'no-dupe-keys': 'error', 'no-unreachable': 'error', 'constructor-super': 'error', 'valid-typeof': 'error'}
  }] });
  const results = await eslint.lintFiles([path.resolve(__dirname, '../Discord-PowerTools.user.js')]);
  console.log(await (await eslint.loadFormatter('stylish')).format(results));
  if (results.some(r => r.errorCount)) process.exitCode = 1;
  else console.log('PASS: full-script static analysis');
})();
