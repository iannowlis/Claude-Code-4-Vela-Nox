// Builds preview/vela-nox-preview.html: every page of the site in one file, using the real
// site script (src/), the real legal pages (ghl/legal/) and launch-day data produced by
// running apps-script/Code.gs against a made-up sheet. Preview only: nothing here goes live.
//   node tools/build.mjs && node tools/preview.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(root + p, 'utf8');

/* ---------- the launch-day sheet: settings and the Tumult test transmission, nobody else ---------- */
// Optional: preview/tumult-waveform.json (from tools/waveform-peaks.html) and preview/tumult-marks.txt ("0:42, 1:37, 2:58").
const opt = (f) => { try { return readFileSync(root + f, 'utf8').trim(); } catch (e) { return ''; } };
const sheet = {
  Settings: [['key', 'value', 'note'], ['current_week', '1', ''], ['theme', "The room you're in right now", ''], ['theme_note', "Vela's pick", ''],
    ['status_override', 'auto', ''], ['deadline_override', '', '']],
  Contributors: [['credit name', 'instagram handle', 'email', 'city', 'country', 'show city', 'remove from public', 'lat', 'lng', 'first seen', 'last seen']],
  Tracks: [['number', 'title', 'theme', 'date sent', 'streaming links', 'cover image', 'cover alt text', 'waveform', 'type', 'example marks', 'preview audio'],
    ['0', 'Tumult', 'Test transmission', '', '', '', '', opt('preview/tumult-waveform.json'), 'demo', opt('preview/tumult-marks.txt'), 'https://preview.local/tumult.mp3']],
  Credits: [['track', 'contributor', 'sound title', 'timestamp']],
  Submissions: [['week', 'contributor', 'sound title', 'received', 'status', 'email', 'description', 'file', 'city', 'country', 'show city', 'instagram handle']]
};

/* ---------- run the real Apps Script code against it ---------- */
const TODAY = '2026-09-30';
const tab = (name) => {
  const d = sheet[name];
  return d && {
    getLastRow: () => d.length, getLastColumn: () => d[0].length,
    getDataRange: () => ({ getValues: () => d.map((r) => r.slice()), getDisplayValues: () => d.map((r) => r.map(String)) })
  };
};
const ctx = {
  SpreadsheetApp: { getActive: () => ({ getSheetByName: tab }) },
  Utilities: { formatDate: () => TODAY },
  CacheService: { getScriptCache: () => ({ get: () => null, put() {}, remove() {} }) },
  ContentService: { createTextOutput: (t) => ({ t, setMimeType() { return this; } }), MimeType: { JSON: 1 } }
};
vm.createContext(ctx);
vm.runInContext(read('apps-script/Code.gs'), ctx);
const launch = ctx.buildPublic_();
// The preview carries Tumult's audio inline (the file itself is never committed). Pass its path as the first argument.
const audioPath = process.argv[2];
const AUDIO = audioPath ? 'data:audio/mpeg;base64,' + readFileSync(audioPath).toString('base64') : '';

/* ---------- assemble ---------- */
const legal = (n) => read(`ghl/legal/${n}.html`).replace(/^<!--.*-->\n/, '').replace(/<h1>/, '<h1>');
const html = read('preview/template.html')
  .replace('/*{{CSS}}*/', () => read('src/vela.css'))
  .replace('/*{{JS}}*/', () => read('src/vela.js'))
  .replace('/*{{LAND}}*/null', () => read('preview/land-110m.json').trim())
  .replace('/*{{LAUNCH}}*/null', () => JSON.stringify(launch).replace('https://preview.local/tumult.mp3', AUDIO))
  .replace(/\{\{IMG:([\w-]+)\}\}/g, (m, n) => 'data:image/webp;base64,' + readFileSync(root + 'assets/' + n + '.webp').toString('base64'))
  .replace('{{TERMS}}', () => legal('terms'))
  .replace('{{PRIVACY}}', () => legal('privacy'))
  .replace('{{CANCELLATION}}', () => legal('cancellation'));
writeFileSync(root + 'preview/vela-nox-preview.html', html);
console.log('Built preview/vela-nox-preview.html', Math.round(html.length / 1024) + ' KB | tracks', launch.tracks.length, '| contributors', launch.contributors.length, '| counters', JSON.stringify(launch.counters));
