/**
 * Vela Nox: Google Sheet data source.
 *
 * Bound to the Vela Nox Google Sheet (Extensions -> Apps Script). Deployed as a web app:
 *   doGet  -> the public JSON the website reads. Never contains emails, Instagram handles,
 *             files, descriptions, or the city of anyone who didn't opt in.
 *   doPost -> receives each GoHighLevel form submission (workflow "Custom Webhook" action)
 *             and writes it to the Submissions and Contributors tabs.
 *
 * Levels, counters and brightness are calculated here from the sheet, every time.
 * Nothing is invented: an empty sheet produces empty lists and zero counters.
 */

var TZ = 'America/New_York';
var LAUNCH = { open: '2026-09-30T00:00:00', close: '2026-10-08T23:59:59', regularStart: '2026-10-12T00:00:00' };

var HEADERS = {
  Settings: ['key', 'value', 'note'],
  Contributors: ['credit name', 'instagram handle', 'email', 'city', 'country', 'show city', 'remove from public', 'lat', 'lng', 'first seen', 'last seen'],
  Tracks: ['number', 'title', 'theme', 'date sent', 'streaming links', 'cover image', 'cover alt text', 'waveform', 'type', 'example marks', 'preview audio'],
  Credits: ['track', 'contributor', 'sound title', 'timestamp'],
  Submissions: ['week', 'contributor', 'sound title', 'received', 'status', 'email', 'description', 'file', 'city', 'country', 'show city', 'instagram handle']
};

var SETTINGS_DEFAULTS = [
  ['current_week', '1', 'Week number that new submissions are filed under. Change it every Monday.'],
  ['theme', "The room you're in right now", 'Theme of the week. Shown on every page that mentions it.'],
  ['theme_note', "Vela's pick", 'Small note after the theme on the Home strip. Clear it once the vote picks the themes.'],
  ['status_override', 'auto', 'auto = follow the schedule. open or closed = force the submission status.'],
  ['deadline_override', '', 'Leave empty. Text here (e.g. "Friday, 11:59 pm ET") replaces the deadline everywhere.']
];
var PUBLIC_SETTINGS = ['current_week', 'theme', 'theme_note', 'status_override', 'deadline_override'];

/* ---------------- setup ---------------- */

/** Run once from the editor: creates missing tabs, headers and settings, and a webhook secret. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  ss.setSpreadsheetTimeZone(TZ);
  Object.keys(HEADERS).forEach(function (name) {
    var sh = ss.getSheetByName(name) || ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, HEADERS[name].length).setValues([HEADERS[name]]).setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });
  // Timestamps must stay text: Sheets would read "2:14" as 2 hours 14 minutes.
  var cr = ss.getSheetByName('Credits');
  cr.getRange('D:D').setNumberFormat('@');
  var st = ss.getSheetByName('Settings');
  var have = rows_('Settings').map(function (r) { return r.key; });
  SETTINGS_DEFAULTS.forEach(function (d) { if (have.indexOf(d[0]) < 0) st.appendRow(d); });
  // The test transmission: Tumult, the producer's own track, shows how a release page works before Track 01.
  // type "demo" keeps it out of the counters, the map and contributor credits. Delete the row to remove it.
  var tr = ss.getSheetByName('Tracks');
  if (tr.getLastRow() < 2) tr.appendRow(['0', 'Tumult', 'Test transmission', '', '', '', '', '', 'demo', '', '']);
  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty('WEBHOOK_SECRET')) props.setProperty('WEBHOOK_SECRET', Utilities.getUuid());
  Logger.log('Webhook secret (paste into the GoHighLevel webhook body): ' + props.getProperty('WEBHOOK_SECRET'));
}

/* ---------------- sheet helpers ---------------- */

function norm_(h) { return String(h).trim().toLowerCase(); }

/** Rows as objects keyed by lower-case header. Keeps raw values in r._raw for dates and times. */
function rows_(name) {
  var sh = SpreadsheetApp.getActive().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  var rng = sh.getDataRange(), vals = rng.getValues(), disp = rng.getDisplayValues();
  var head = vals[0].map(norm_), out = [];
  for (var i = 1; i < vals.length; i++) {
    if (vals[i].join('') === '') continue;
    var o = { _raw: {}, _row: i + 1 };
    head.forEach(function (h, j) { o[h] = String(disp[i][j]).trim(); o._raw[h] = vals[i][j]; });
    out.push(o);
  }
  return out;
}

function settings_() {
  var s = {};
  rows_('Settings').forEach(function (r) { if (r.key) s[r.key.trim()] = r.value; });
  return s;
}

function yes_(v) {
  if (v === true) return true;
  var t = norm_(v == null ? '' : v);
  return t !== '' && ['no', 'n', 'false', '0', 'off'].indexOf(t) < 0;
}

function key_(name) { return norm_(name).replace(/\s+/g, ' '); }

/** "2:14" -> 134. Also copes with cells Sheets already turned into a time value. */
function seconds_(display, raw) {
  if (raw instanceof Date) return raw.getHours() * 60 + raw.getMinutes(); // "2:14" read as 02:14:00
  var p = String(display).trim().split(':').map(Number);
  if (p.some(isNaN)) return NaN;
  return p.reduce(function (a, b) { return a * 60 + b; }, 0);
}
function clock_(s) {
  var m = Math.floor(s / 60), r = Math.round(s % 60);
  return m + ':' + (r < 10 ? '0' : '') + r;
}

function dateStr_(display, raw) {
  if (raw instanceof Date) return Utilities.formatDate(raw, TZ, 'yyyy-MM-dd');
  var m = String(display).match(/(\d{4})-(\d{2})-(\d{2})/);
  return m ? m[0] : '';
}

function slug_(name, used) {
  var base = norm_(name).normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'contributor';
  var s = base, n = 2;
  while (used[s]) s = base + '-' + n++;
  used[s] = 1;
  return s;
}

/** "Label | https://..." per line (or separated by ;). A bare URL gets the label "Listen". */
function links_(v) {
  return String(v || '').split(/\n|;/).map(function (x) { return x.trim(); }).filter(String).map(function (x) {
    var parts = x.split('|').map(function (y) { return y.trim(); });
    var url = parts.length > 1 ? parts[1] : parts[0];
    return /^https?:\/\//i.test(url) ? { label: parts.length > 1 ? parts[0] : 'Listen', url: url } : null;
  }).filter(Boolean);
}

/* ---------------- public data ---------------- */

function buildPublic_() {
  var s = settings_();
  var today = Utilities.formatDate(new Date(), TZ, 'yyyy-MM-dd');
  var week = String(s.current_week || '').trim();

  // Contributors, keyed by credit name
  var people = {}, usedSlugs = {};
  rows_('Contributors').forEach(function (r) {
    var name = r['credit name'];
    if (!name) return;
    var hidden = yes_(r['remove from public']);
    people[key_(name)] = {
      name: name,
      hidden: hidden,
      opted: !hidden && yes_(r['show city']) && !!r.city,
      city: r.city, country: r.country,
      lat: parseFloat(r.lat), lng: parseFloat(r.lng),
      submitted: 0, credits: 0, tracks: [], inPool: false
    };
  });

  var subs = rows_('Submissions').filter(function (r) { return !r.status || norm_(r.status) === 'ok'; });
  var weekCities = {}, weekSounds = 0;
  subs.forEach(function (r) {
    var p = people[key_(r.contributor)];
    if (p) p.submitted++;
    if (week && String(r.week).trim() === week) {
      weekSounds++;
      if (p) {
        p.inPool = true;
        if (p.opted) weekCities[key_(p.city + '|' + p.country)] = 1;
      }
    }
  });

  // Released tracks: the early-access email has gone out (date sent is today or earlier, ET).
  // Demo tracks (type "demo", the test transmission) are always shown, never counted, never credited.
  var trackList = rows_('Tracks').map(function (r) {
    return {
      n: parseInt(r.number, 10), title: r.title, theme: r.theme,
      demo: norm_(r.type) === 'demo',
      audio: r['preview audio'],
      marks: String(r['example marks'] || '').split(/[,;|\s]+/).filter(Boolean).map(function (x) { return seconds_(x, null); }).filter(isFinite),
      sent: dateStr_(r['date sent'], r._raw['date sent']),
      links: links_(r['streaming links']),
      cover: r['cover image'], coverAlt: r['cover alt text'],
      waveform: r.waveform, credits: []
    };
  }).filter(function (t) { return isFinite(t.n) && t.title && (t.demo || (t.sent && t.sent <= today)); });
  var byNo = {};
  trackList.forEach(function (t) { if (!t.demo) byNo[t.n] = t; });

  var creditedKeys = {};
  rows_('Credits').forEach(function (r) {
    var t = byNo[parseInt(r.track, 10)];
    if (!t || !r.contributor) return;
    var k = key_(r.contributor), p = people[k];
    if (p && p.hidden) return; // asked to be removed from public credits
    var sec = seconds_(r.timestamp, r._raw.timestamp);
    var ts = isFinite(sec) ? clock_(sec) : r.timestamp;
    creditedKeys[k] = 1;
    if (p) {
      p.credits++;
      p.tracks.push({ n: t.n, title: t.title, t: ts, s: sec });
    }
    t.credits.push({ name: p ? p.name : r.contributor, sound: r['sound title'], t: ts, s: sec, key: k });
  });

  // Public contributors: opted in, and has submitted or been credited
  var pub = [];
  Object.keys(people).forEach(function (k) {
    var p = people[k];
    if (!p.opted || (p.submitted === 0 && p.credits === 0)) return;
    p.slug = slug_(p.name, usedSlugs);
    p.level = p.credits >= 10 ? 'Broadcast' : p.credits >= 5 ? 'Frequency' : p.credits >= 1 ? 'Signal' : 'Static';
    p.tracks.sort(function (a, b) { return b.n - a.n; });
    pub.push({
      slug: p.slug, name: p.name,
      city: p.country ? p.city + ', ' + p.country : p.city,
      lat: isFinite(p.lat) ? p.lat : null, lng: isFinite(p.lng) ? p.lng : null,
      level: p.level, credits: p.credits, submitted: p.submitted,
      tracks: p.tracks.map(function (x) { return { n: x.n, title: x.title, t: x.t }; }),
      inPool: p.inPool
    });
  });

  trackList.sort(function (a, b) { return b.n - a.n; });
  var tracksOut = trackList.map(function (t) {
    if (t.demo) return {
      n: t.n, title: t.title, theme: t.theme, demo: true, links: t.links, audio: t.audio,
      cover: t.cover, coverAlt: t.coverAlt, waveform: t.waveform,
      marks: t.marks.map(function (x) { return { s: x, t: clock_(x) }; }), credits: []
    };
    var cities = {}, names = {};
    // Timestamp order. People who didn't opt in keep their place but are sent as a name only:
    // no city, no timestamp, no sound title (Terms 6, Privacy 3).
    var credits = t.credits.slice().sort(function (a, b) {
      return (isFinite(a.s) ? a.s : Infinity) - (isFinite(b.s) ? b.s : Infinity);
    }).map(function (c) {
      var p = people[c.key], show = p && p.opted;
      names[c.key] = 1;
      if (!show) return { name: c.name };
      cities[key_(p.city + '|' + p.country)] = 1;
      return {
        name: c.name, sound: c.sound, t: c.t, s: c.s, slug: p.slug,
        city: p.country ? p.city + ', ' + p.country : p.city
      };
    });
    return {
      n: t.n, title: t.title, theme: t.theme, sent: t.sent, links: t.links,
      cover: t.cover, coverAlt: t.coverAlt, waveform: t.waveform,
      contributors: Object.keys(names).length, cities: Object.keys(cities).length,
      credits: credits
    };
  });

  var out = { settings: {}, generated: new Date().toISOString() };
  PUBLIC_SETTINGS.forEach(function (k) { out.settings[k] = s[k] == null ? '' : s[k]; });
  out.counters = {
    weekSounds: weekSounds,
    weekCities: Object.keys(weekCities).length,
    tracks: tracksOut.filter(function (t) { return !t.demo; }).length,
    credited: Object.keys(creditedKeys).length
  };
  out.tracks = tracksOut;
  out.contributors = pub;
  return out;
}

function doGet() {
  var cache = CacheService.getScriptCache(), body = cache.get('public');
  if (!body) {
    body = JSON.stringify(buildPublic_());
    if (body.length < 90000) cache.put('public', body, 300);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

/** Any edit to the sheet clears the cache, so the site shows it within a minute or so. */
function onEdit() {
  try { CacheService.getScriptCache().remove('public'); } catch (e) { /* ignore */ }
}

/* ---------------- submissions from GoHighLevel ---------------- */

function windowOpen_(s, now) {
  var ov = norm_(s.status_override || 'auto');
  if (ov === 'open') return true;
  if (ov === 'closed') return false;
  var w = Utilities.formatDate(now, TZ, "yyyy-MM-dd'T'HH:mm:ss");
  if (w < LAUNCH.regularStart) return w >= LAUNCH.open && w <= LAUNCH.close;
  var wd = Number(Utilities.formatDate(now, TZ, 'u')); // 1 = Monday ... 7 = Sunday
  return wd >= 2 && wd <= 4;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var b = {};
    try { b = JSON.parse(e.postData.contents); } catch (err) { b = e.parameter || {}; }
    if (b.secret !== PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET')) return json_({ ok: false, error: 'bad secret' });

    var email = norm_(b.email || '');
    var name = String(b.credit_name || '').trim();
    if (!email || !name) return json_({ ok: false, error: 'missing email or credit name' });

    var s = settings_(), now = new Date(), week = String(s.current_week || '').trim();
    var showCity = yes_(b.show_city);
    var ss = SpreadsheetApp.getActive();

    // One sound per subscriber per week. Duplicates and late sends are logged, never counted.
    var dup = rows_('Submissions').some(function (r) {
      return norm_(r.email) === email && String(r.week).trim() === week && (!r.status || norm_(r.status) === 'ok');
    });
    var status = dup ? 'duplicate' : (windowOpen_(s, now) ? 'ok' : 'late');

    ss.getSheetByName('Submissions').appendRow([
      week, name, b.sound_title || '', now, status, email, b.description || '', b.file || '',
      b.city || '', b.country || '', showCity ? 'yes' : 'no', b.instagram || ''
    ]);

    if (status === 'ok') upsertContributor_(email, name, b, showCity, now);
    CacheService.getScriptCache().remove('public');
    return json_({ ok: true, status: status });
  } finally {
    lock.releaseLock();
  }
}

function upsertContributor_(email, name, b, showCity, now) {
  var sh = SpreadsheetApp.getActive().getSheetByName('Contributors');
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(norm_);
  var col = function (h) { return head.indexOf(h); };
  var existing = rows_('Contributors').filter(function (r) { return norm_(r.email) === email; })[0];
  var city = String(b.city || '').trim(), country = String(b.country || '').trim();
  var row = existing ? sh.getRange(existing._row, 1, 1, head.length).getValues()[0] : head.map(function () { return ''; });
  var moved = !existing || norm_(existing.city) !== norm_(city) || norm_(existing.country) !== norm_(country) || !existing.lat;

  row[col('credit name')] = name;
  row[col('instagram handle')] = b.instagram || row[col('instagram handle')];
  row[col('email')] = email;
  row[col('city')] = city;
  row[col('country')] = country;
  row[col('show city')] = showCity ? 'yes' : 'no';
  if (!existing) row[col('first seen')] = now;
  row[col('last seen')] = now;
  if (moved) {
    var ll = geocode_(city, country);
    row[col('lat')] = ll ? ll.lat : '';
    row[col('lng')] = ll ? ll.lng : '';
  }
  if (existing) sh.getRange(existing._row, 1, 1, head.length).setValues([row]);
  else sh.appendRow(row);
}

/** City center only, rounded to two decimals. Never a street or an address. */
function geocode_(city, country) {
  if (!city) return null;
  try {
    var res = Maps.newGeocoder().geocode(city + (country ? ', ' + country : ''));
    var loc = res.results && res.results[0] && res.results[0].geometry.location;
    return loc ? { lat: Math.round(loc.lat * 100) / 100, lng: Math.round(loc.lng * 100) / 100 } : null;
  } catch (e) { return null; }
}

/** Run from the editor after adding contributors by hand: fills missing lat/lng. */
function geocodeMissing() {
  var sh = SpreadsheetApp.getActive().getSheetByName('Contributors');
  var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(norm_);
  rows_('Contributors').forEach(function (r) {
    if (r.lat && r.lng) return;
    var ll = geocode_(r.city, r.country);
    if (!ll) return;
    sh.getRange(r._row, head.indexOf('lat') + 1).setValue(ll.lat);
    sh.getRange(r._row, head.indexOf('lng') + 1).setValue(ll.lng);
  });
  CacheService.getScriptCache().remove('public');
}

function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
