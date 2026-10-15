#!/usr/bin/env node
// Builds a prototype from assets/template.html + the PROTOTYPE block (JS) + section 5 of the styles (CSS).
//   node assemble.mjs <out.html> <prototype.js> [prototype.css]   assemble (the shell comes from the current template)
//   node assemble.mjs --split <in.html> <dir>                      split a finished prototype/template into prototype.js + prototype.css
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'template.html');
const MARKERS = { JS_FROM: 'PROTOTYPE — edit this block', JS_TO: 'RUNTIME — no need to edit below' };
// Compat: prototypes built before the template went English use Russian markers. --split still accepts them;
// assembling always writes MARKERS from the current template.
const LEGACY_MARKERS = { JS_FROM: 'PROTOTYPE — правь этот блок', JS_TO: 'RUNTIME — ниже менять не нужно' };
const CSS_FROM = '/* ===== 5. PROTOTYPE STYLES';
const REQUIRED = ['PROTO', 'STEPS', 'SWITCHES', 'S', 'NOTES', 'VIEWS', 'ACTIONS'];

function fail(msg) { console.error('✗ ' + msg); process.exit(1); }
function once(src, needle, file) {
  const i = src.indexOf(needle);
  if (i < 0 || src.indexOf(needle, i + 1) >= 0) fail(`${file}: marker "${needle}" must occur exactly once`);
  return i;
}
/* bounds: JS — from the end of the PROTOTYPE banner to the start of the RUNTIME banner; CSS — from the line after the section 5 header to </style> */
function regions(src, file, legacy = false) {
  const m = legacy && !src.includes(MARKERS.JS_FROM) && !src.includes(MARKERS.JS_TO) ? LEGACY_MARKERS : MARKERS;
  const a = once(src, m.JS_FROM, file), b = once(src, m.JS_TO, file), c = once(src, CSS_FROM, file);
  const jsStart = src.indexOf('*/', a) + 2, jsEnd = src.lastIndexOf('/*', b);
  const cssStart = src.indexOf('\n', c) + 1, cssEnd = src.indexOf('</style>', cssStart);
  if (!(cssStart > 0 && cssStart < cssEnd && cssEnd < jsStart && jsStart < jsEnd)) fail(`${file}: PROTOTYPE block or styles section 5 not found`);
  return { jsStart, jsEnd, cssStart, cssEnd };
}

const args = process.argv.slice(2);
if (args[0] === '--split') {
  const [, input, dir] = args;
  if (!input || !dir) fail('usage: node assemble.mjs --split <in.html> <dir>');
  const src = readFileSync(input, 'utf8'), r = regions(src, input, true);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'prototype.js'), src.slice(r.jsStart, r.jsEnd).replace(/^\n+/, '').replace(/\s+$/, '') + '\n');
  writeFileSync(join(dir, 'prototype.css'), src.slice(r.cssStart, r.cssEnd).replace(/\s+$/, '') + '\n');
  console.log(`✓ ${join(dir, 'prototype.js')}, ${join(dir, 'prototype.css')}`);
} else {
  const [out, jsFile, cssFile] = args;
  if (!out || !jsFile) fail('usage: node assemble.mjs <out.html> <prototype.js> [prototype.css]');
  const js = readFileSync(jsFile, 'utf8').replace(/\s+$/, '');
  const css = cssFile ? readFileSync(cssFile, 'utf8').replace(/\s+$/, '') : "/* Only what k-* doesn't cover: specific layout, custom blocks. */";
  if ([MARKERS.JS_TO, LEGACY_MARKERS.JS_TO, '<script', '</script'].some(s => js.includes(s))) fail(`${jsFile}: only the contents of the PROTOTYPE block, without RUNTIME or <script> tags`);
  if (css.includes('</style')) fail(`${cssFile}: only the CSS of section 5, without </style>`);
  const missing = REQUIRED.filter(name => !new RegExp(`(\\b(const|let|var|function)\\s+|,\\s*)${name}\\s*[=(]`).test(js));
  if (missing.length) fail(`${jsFile}: missing declarations ${missing.join(', ')}`);
  try { new Function(js); } catch (e) { fail(`${jsFile}: syntax error — ${e.message}`); }
  const tpl = readFileSync(TEMPLATE, 'utf8'), r = regions(tpl, TEMPLATE);
  const html = tpl.slice(0, r.cssStart) + css + '\n' + tpl.slice(r.cssEnd, r.jsStart) + '\n' + js + '\n\n' + tpl.slice(r.jsEnd);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`✓ ${out} (${Math.round(html.length / 1024)} KB)`);
}
