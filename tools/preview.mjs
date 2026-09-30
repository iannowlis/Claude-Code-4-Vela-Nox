// Builds preview/vela-nox-preview.html: every page of the site in one file, using the real
// site script (src/), the real legal pages (ghl/legal/) and example data that is produced by
// running apps-script/Code.gs against a made-up sheet. Preview only: nothing here goes live.
//   node tools/build.mjs && node tools/preview.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import vm from 'node:vm';

const root = new URL('..', import.meta.url).pathname;
const read = (p) => readFileSync(root + p, 'utf8');

/* ---------- a made-up sheet (example names and places only) ---------- */
const people = [
  // credit name, city, country, show city, lat, lng
  ['Ferro', 'Lyon', 'France', 'yes', 45.76, 4.84],
  ['night bus', 'Glasgow', 'United Kingdom', 'yes', 55.86, -4.25],
  ['Mara K', 'Berlin', 'Germany', 'yes', 52.52, 13.4],
  ['tin roof', 'Porto', 'Portugal', 'yes', 41.15, -8.61],
  ['Ode', 'Lagos', 'Nigeria', 'yes', 6.52, 3.38],
  ['hum', 'Detroit', 'United States', 'yes', 42.33, -83.05],
  ['Sasha V', 'Tbilisi', 'Georgia', 'no', 41.72, 44.79],
  ['low floor', 'Montreal', 'Canada', 'yes', 45.5, -73.57],
  ['Ines', 'Mexico City', 'Mexico', 'yes', 19.43, -99.13],
  ['radiator', 'Leeds', 'United Kingdom', 'no', 53.8, -1.55],
  ['Kaito', 'Osaka', 'Japan', 'yes', 34.69, 135.5],
  ['June R', 'Melbourne', 'Australia', 'yes', -37.81, 144.96],
  ['vent', 'Berlin', 'Germany', 'yes', 52.52, 13.4],
  ['Pila', 'Bogotá', 'Colombia', 'yes', 4.71, -74.07],
  ['static cat', 'Seoul', 'South Korea', 'yes', 37.57, 126.98],
  ['Noor', 'Cairo', 'Egypt', 'yes', 30.04, 31.24],
  ['E.T.', 'Boston', 'United States', 'yes', 42.36, -71.06],
  ['cold tap', 'Oslo', 'Norway', 'yes', 59.91, 10.75]
];
const tracks = [
  [1, 'Low Ceiling', "The room you're in right now", '2026-10-12'],
  [2, 'Pipes', 'Water', '2026-10-19']
];
const credits = [
  [1, 'Ferro', 'my kettle', '0:14'], [1, 'radiator', 'radiator knock', '0:41'], [1, 'Mara K', 'fridge door', '1:02'],
  [1, 'night bus', 'window rattle', '1:37'], [1, 'Ode', 'ceiling fan', '2:14'], [1, 'hum', 'lamp buzz', '2:58'],
  [1, 'Kaito', 'floorboard', '3:31'], [1, 'Sasha V', 'door chain', '4:05'], [1, 'June R', 'chair creak', '4:48'],
  [2, 'Ferro', 'sink drip', '0:22'], [2, 'tin roof', 'rain on metal', '0:55'], [2, 'Ode', 'bucket', '1:19'],
  [2, 'low floor', 'kettle boil', '1:52'], [2, 'Ines', 'glass rim', '2:30'], [2, 'Mara K', 'bath drain', '3:06'],
  [2, 'vent', 'pipe tap', '3:44'], [2, 'Noor', 'fountain', '4:17'], [2, 'cold tap', 'ice cube', '4:51']
];
// week 1 and 2 senders, plus this week's (week 3) pool
const subs = [
  ...credits.map(([t, n, s]) => [t, n, s]),
  [1, 'static cat', 'rice cooker'], [2, 'Pila', 'shower'], [2, 'E.T.', 'dripping tap'],
  [3, 'Ferro', 'train door'], [3, 'Kaito', 'ticket gate'], [3, 'Pila', 'bus brakes'], [3, 'June R', 'tram bell'],
  [3, 'E.T.', 'subway rumble'], [3, 'static cat', 'escalator'], [3, 'Sasha V', 'metro chime']
];

// A made-up waveform: kicks, a breakdown and a build, for the layout only
function peaks(seconds, seed) {
  const p = [];
  for (let i = 0; i < 600; i++) {
    const t = (i / 600) * seconds, beat = (t * 2.1) % 1;
    const breakdown = t > seconds * 0.45 && t < seconds * 0.58 ? 0.35 : 1;
    const intro = Math.min(1, t / 30);
    const v = (0.35 + 0.55 * Math.exp(-beat * 6) + 0.1 * Math.abs(Math.sin(i * seed))) * breakdown * (0.4 + 0.6 * intro);
    p.push(Math.round(Math.min(1, v) * 100) / 100);
  }
  return JSON.stringify({ d: seconds, p });
}

const sheet = {
  Settings: [['key', 'value', 'note'], ['current_week', '3', ''], ['theme', 'Public transport', ''], ['theme_note', '', ''],
    ['status_override', 'auto', ''], ['deadline_override', '', '']],
  Contributors: [['credit name', 'instagram handle', 'email', 'city', 'country', 'show city', 'remove from public', 'lat', 'lng', 'first seen', 'last seen'],
    ...people.map(([n, c, co, s, la, lo]) => [n, '@x', n.replace(/\W/g, '') + '@example.com', c, co, s, '', la, lo, '', ''])],
  Tracks: [['number', 'title', 'theme', 'date sent', 'streaming links', 'cover image', 'cover alt text', 'waveform'],
    ...tracks.map(([n, t, th, d], i) => [String(n), t, th, d, '', '', '', peaks(312 + i * 14, 1.7 + i)])],
  Credits: [['track', 'contributor', 'sound title', 'timestamp'], ...credits.map((r) => r.map(String))],
  Submissions: [['week', 'contributor', 'sound title', 'received', 'status', 'email', 'description', 'file', 'city', 'country', 'show city', 'instagram handle'],
    ...subs.map(([w, n, s]) => [String(w), n, s, '', 'ok'])]
};

/* ---------- run the real Apps Script code against it ---------- */
const TODAY = '2026-10-26';
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
const example = ctx.buildPublic_();
if (/@example\.com|"@x"/.test(JSON.stringify(example))) throw new Error('private field leaked into public data');

/* ---------- assemble ---------- */
const legal = (n) => read(`ghl/legal/${n}.html`).replace(/^<!--.*-->\n/, '').replace(/<h1>/, '<h1>');
const html = read('preview/template.html')
  .replace('/*{{CSS}}*/', () => read('src/vela.css'))
  .replace('/*{{JS}}*/', () => read('src/vela.js'))
  .replace('/*{{LAND}}*/null', () => read('preview/land-110m.json').trim())
  .replace('/*{{EXAMPLE}}*/null', () => JSON.stringify(example))
  .replace('{{TERMS}}', () => legal('terms'))
  .replace('{{PRIVACY}}', () => legal('privacy'))
  .replace('{{CANCELLATION}}', () => legal('cancellation'));
writeFileSync(root + 'preview/vela-nox-preview.html', html);
console.log('Built preview/vela-nox-preview.html', Math.round(html.length / 1024) + ' KB',
  '| tracks', example.tracks.length, '| public contributors', example.contributors.length, '| counters', JSON.stringify(example.counters));
