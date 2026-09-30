/* Vela Nox: shared script for the GoHighLevel custom code elements.
 *
 * Loaded once per page (Website settings -> Head tracking code, see ghl/site-head.html).
 * Every custom code element on the site calls one VELA.render.* function.
 *
 * Weekly edits never happen here. Theme, week number and submission status live in
 * the Google Sheet "Settings" tab and reach every page through the data endpoint.
 * The only values set here are one-time setup values (URLs) and the fixed launch dates.
 */
(function () {
  'use strict';
  if (window.VELA) return;

  var C = {
    // Apps Script web app URL (ends in /exec). See apps-script/Code.gs.
    dataUrl: '',
    // GoHighLevel page that holds the Stripe checkout for the weekly subscription.
    subscribeUrl: '/subscribe',
    // GoHighLevel client portal login (where the Submit lesson lives).
    portalUrl: '',
    paths: {
      home: '/', submit: '/submit', map: '/signal-map', tracks: '/tracks', track: '/track',
      contributors: '/contributors', rules: '/rules-faq', terms: '/terms', cancellation: '/cancellation'
    },
    // Launch week. Fixed dates, all Eastern Time. The site switches to the regular cycle at regularStart.
    launch: {
      theme: "The room you're in right now",
      open: '2026-09-30T00:00:00',
      close: '2026-10-08T23:59:59',
      regularStart: '2026-10-12T00:00:00',
      firstEmail: '2026-10-12'
    },
    cacheSeconds: 300
  };
  var over = window.VELA_CONFIG || {};
  Object.keys(over).forEach(function (k) {
    if (k === 'paths' || k === 'launch') Object.assign(C[k], over[k]); else C[k] = over[k];
  });

  var CTA = 'Send me a sound — $3/week';
  var LEVELS = ['Static', 'Signal', 'Frequency', 'Broadcast'];
  var MSG_ERROR = 'The signal isn’t coming through right now. Try again in a minute.';

  /* ---------- small helpers ---------- */
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function safeUrl(u) { return /^https?:\/\//i.test(String(u || '').trim()) ? String(u).trim() : ''; }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function trackNo(n) { return 'Track ' + pad2(Number(n)); }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  function levelIndex(name) { var i = LEVELS.indexOf(name); return i < 0 ? 0 : i; }
  function trackUrl(n, c) { return C.paths.track + '?n=' + encodeURIComponent(n) + (c ? '&c=' + encodeURIComponent(c) : ''); }
  function profileUrl(slug) { return C.paths.contributors + '#c-' + encodeURIComponent(slug); }

  /* ---------- Eastern Time ---------- */
  var etFmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23', weekday: 'short'
  });
  function et(d) {
    var p = {};
    etFmt.formatToParts(d || (C.now ? new Date(C.now) : new Date())).forEach(function (x) { p[x.type] = x.value; });
    var date = p.year + '-' + p.month + '-' + p.day;
    return { date: date, iso: date + 'T' + p.hour + ':' + p.minute + ':' + p.second,
      wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday) };
  }
  function utcDate(s) { var a = s.split('-'); return new Date(Date.UTC(+a[0], +a[1] - 1, +a[2])); }
  function addDays(s, n) { var d = utcDate(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function weekday(s) { return utcDate(s).getUTCDay(); }
  function longDate(s, withYear) {
    var o = { timeZone: 'UTC', weekday: 'long', month: 'long', day: 'numeric' };
    if (withYear) o.year = 'numeric';
    return utcDate(s).toLocaleDateString('en-US', o);
  }

  /* The week, as the site should describe it right now. */
  function schedule(settings, now) {
    var s = settings || {}, L = C.launch, t = et(now), w = t.iso;
    var launch = w < L.regularStart;
    var phase;
    if (launch) phase = w < L.open ? 'before' : (w <= L.close ? 'open' : 'making');
    else phase = (t.wd >= 2 && t.wd <= 4) ? 'open' : (t.wd === 1 ? 'monday' : 'making');
    var ov = String(s.status_override || 'auto').trim().toLowerCase();
    if (ov === 'open') phase = 'open';
    else if (ov === 'closed') phase = 'closed';

    var nextOpen = null;
    if (phase === 'before') nextOpen = longDate(L.open.slice(0, 10)) + ', 12:00 am ET';
    else if (phase === 'making' || phase === 'monday') {
      var d = t.date;
      do { d = addDays(d, 1); } while (weekday(d) !== 2);
      nextOpen = longDate(d) + ', 12:00 am ET';
    }

    var dl = String(s.deadline_override || '').trim();
    var r = {
      launch: launch, phase: phase, open: phase === 'open', nextOpen: nextOpen,
      theme: String(s.theme || '').trim() || L.theme,
      themeNote: String(s.theme_note || '').trim(),
      week: s.current_week || ''
    };
    r.stripStatus = {
      open: dl ? 'Submissions open until ' + dl : (launch ? 'Submissions open until Thursday, October 8, 11:59 pm ET' : 'Submissions open until Thursday, 11:59 pm ET'),
      making: 'Submissions closed — the track is being made',
      monday: 'Submissions closed. They open ' + nextOpen,
      before: 'Submissions open ' + nextOpen,
      closed: 'Submissions closed for now'
    }[phase];
    r.submitDeadline = dl ? 'Closes ' + dl : (launch ? 'Closes Thursday, October 8, 11:59 pm ET' : 'Closes Thursday, 11:59 pm ET');
    r.voteStrip = 'Next week’s theme is being voted on now, in Vela’s Close Friends story.' +
      (launch ? ' The vote closes Sunday, October 11, 11:59 pm ET.' : '');
    r.voteSubmit = launch
      ? 'Want a say in next week’s theme? The vote is open until Sunday, October 11, 11:59 pm ET, in Vela’s Close Friends story.'
      : 'Want a say in next week’s theme? The vote is open all week in Vela’s Close Friends story.';
    r.confirmation = 'Got it. Your sound is in the pool for ' + r.theme + '. The track lands in your inbox on Monday' +
      (launch ? ', October 12.' : '.');
    return r;
  }

  /* ---------- data ---------- */
  var dataPromise = null;
  function data() {
    if (dataPromise) return dataPromise;
    // C.data: inline data, used only by the local preview page
    if (C.data !== undefined) { dataPromise = Promise.resolve(C.data); return dataPromise; }
    if (!C.dataUrl) { dataPromise = Promise.resolve(null); return dataPromise; }
    var key = 'vela:data', cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(key) || 'null'); } catch (e) { /* storage unavailable */ }
    if (cached && Date.now() - cached.at < C.cacheSeconds * 1000) { dataPromise = Promise.resolve(cached.d); return dataPromise; }
    dataPromise = fetch(C.dataUrl, { redirect: 'follow' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        if (!d || d.error) throw new Error((d && d.error) || 'empty');
        try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), d: d })); } catch (e) { /* ignore */ }
        return d;
      })
      .catch(function (e) { if (window.console) console.warn('Vela data:', e); return null; });
    return dataPromise;
  }
  function pick(el) { return typeof el === 'string' ? document.querySelector(el) : el; }
  function mount(el, html) { el = pick(el); if (el) { el.classList.add('vn'); el.innerHTML = html; } return el; }
  function tracks(d) { return (d && d.tracks) || []; }
  // Real releases only. The test transmission (type "demo" in the sheet) is never a release.
  function releases(d) { return tracks(d).filter(function (t) { return !t.demo; }); }
  function demoTrack(d) { return tracks(d).filter(function (t) { return t.demo; })[0]; }
  function people(d) { return (d && d.contributors) || []; }
  function bySlug(d) { var m = {}; people(d).forEach(function (p) { m[p.slug] = p; }); return m; }

  /* ---------- geo (loaded only on pages with a map) ---------- */
  var LIBS = [
    'https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js',
    'https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/dist/d3-geo.min.js',
    'https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js'
  ];
  var LAND = C.landUrl || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json';
  function loadScript(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s);
    });
  }
  var geoPromise = null;
  function geo() {
    if (geoPromise) return geoPromise;
    var libs = (C.libs || LIBS).reduce(function (p, src) { return p.then(function () { return loadScript(src); }); },
      (window.d3 && window.d3.geoPath && window.topojson) ? Promise.reject('skip') : Promise.resolve())
      .catch(function (e) { if (e !== 'skip') throw e; });
    geoPromise = Promise.all([libs, C.land ? C.land : fetch(LAND).then(function (r) { return r.json(); })])
      .then(function (res) { return window.topojson.feature(res[1], res[1].objects.land); });
    return geoPromise;
  }

  var W = 960, H = 500;
  // Lights, per the design system: radius in screen px, colour, opacity, glow in px
  var LIGHT = [
    { r: 3, c: '#8E9AAE', o: 0.6, g: 0 },   // Static
    { r: 4, c: '#A6DCFF', o: 0.75, g: 6 },   // Signal
    { r: 5, c: '#A6DCFF', o: 0.9, g: 10 },   // Frequency
    { r: 6, c: '#E3F5FF', o: 1, g: 16 }     // Broadcast
  ];
  var METER = [0, 1, 3, 4];
  var CLOSE_ICON = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M1 1l12 12M13 1L1 13" fill="none"/></svg>';

  function meter(level) {
    var n = METER[levelIndex(level)], s = '';
    for (var i = 0; i < 4; i++) s += '<i' + (i < n ? ' class="on"' : '') + '></i>';
    return '<span class="vn-level"><span class="vn-meter" aria-hidden="true">' + s + '</span>' + esc(level) + '</span>';
  }
  function reduced() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  // The one orchestrated animation plays once per visit
  function firstVisit() {
    try { if (sessionStorage.getItem('vela:lit')) return false; sessionStorage.setItem('vela:lit', '1'); } catch (e) { /* ignore */ }
    return true;
  }

  function groupByCity(list) {
    var groups = {}, order = [];
    (list || []).forEach(function (p) {
      if (!isFinite(p.lat) || !isFinite(p.lng) || p.lat === null) return;
      var k = p.lat.toFixed(2) + ',' + p.lng.toFixed(2);
      if (!groups[k]) { groups[k] = { lat: p.lat, lng: p.lng, city: p.city, list: [] }; order.push(k); }
      groups[k].list.push(p);
    });
    return order.map(function (k) {
      var g = groups[k];
      g.lvl = Math.max.apply(null, g.list.map(function (p) { return levelIndex(p.level); }));
      g.credits = g.list.reduce(function (a, p) { return a + p.credits; }, 0);
      return g;
    });
  }

  /* Draws a map into el. opts.people: contributors to light up (city centres only).
   * opts.full: full-bleed hero size. opts.empty: line over the sea. opts.popups: tap for detail. */
  function drawMap(el, land, opts) {
    var d3 = window.d3;
    // Full-width maps frame the lived-in world (Cape Horn to the Arctic coast), so they can be short and wide
    // without cropping cities. Framed maps show the whole globe.
    var VH = opts.full ? 400 : H;
    var frame = opts.full
      ? { type: 'MultiPoint', coordinates: [[-180, -56], [180, -56], [-180, 0], [180, 0], [-180, 76], [180, 76], [0, 76], [0, -56]] }
      : { type: 'Sphere' };
    var proj = d3.geoEqualEarth().fitExtent([[10, 10], [W - 10, VH - 10]], frame);
    var path = d3.geoPath(proj);
    var id = 'vn' + Math.random().toString(36).slice(2, 8);
    var groups = groupByCity(opts.people);
    var svg = '<svg viewBox="0 0 ' + W + ' ' + VH + '" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(opts.label) + '">' +
      '<defs><filter id="' + id + 'g" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="4"/></filter>' +
      '</defs>' + (opts.full ? '' : '<rect width="' + W + '" height="' + VH + '" fill="#0D1624"/>') +
      '<path d="' + path(land) + '" fill="#243048" fill-opacity="0.55" stroke="#A6DCFF" stroke-opacity="0.14" stroke-width="0.5"/>' +
      groups.map(function (g, i) {
        var xy = proj([g.lng, g.lat]);
        if (!xy) return '';
        g.xy = xy;
        var L = LIGHT[g.lvl], x = xy[0].toFixed(1), y = xy[1].toFixed(1);
        var label = g.city + ': ' + plural(g.list.length, 'contributor', 'contributors');
        return '<g class="vn-pt" data-k="' + i + '"' + (opts.popups ? ' tabindex="0" role="button" aria-label="' + esc(label) + '"' : ' aria-hidden="true"') + '>' +
          (L.g ? '<circle class="vn-pt-glow" data-px="' + (L.r + L.g / 2) + '" cx="' + x + '" cy="' + y + '" fill="' + L.c + '" opacity="0.45" filter="url(#' + id + 'g)"/>' : '') +
          '<circle class="vn-pt-core" data-px="' + (L.r + Math.min(g.list.length - 1, 3) * 0.6) + '" cx="' + x + '" cy="' + y + '" fill="' + L.c + '" opacity="' + L.o + '"/>' +
          '<circle class="vn-pt-ring" data-px="' + (L.r + 4) + '" cx="' + x + '" cy="' + y + '" fill="none" stroke="none"/>' +
          (opts.popups ? '<circle data-px="22" cx="' + x + '" cy="' + y + '" fill="transparent"/>' : '') + '</g>';
      }).join('') +
      '</svg>';

    el.innerHTML = '<div class="vn-map-wrap' + (opts.full ? ' is-full' : ' is-framed') + '">' + svg +
      (groups.length ? '' : '<p class="vn-map-msg">' + esc(opts.empty) + '</p>') + '</div>';
    var wrap = el.firstChild, s = wrap.querySelector('svg');

    // Keep lights at their pixel size whatever the map's width
    function size() {
      var w = wrap.clientWidth, h = wrap.clientHeight;
      if (!w || !h) return;
      var k = Math.max(W / w, VH / h);
      Array.prototype.forEach.call(s.querySelectorAll('[data-px]'), function (c) { c.setAttribute('r', (c.getAttribute('data-px') * k).toFixed(2)); });
    }
    size();
    if (window.ResizeObserver) new ResizeObserver(size).observe(wrap);

    // Lights fade in city by city, about two seconds in all, once per visit
    if (opts.animate && groups.length && !reduced() && firstVisit()) {
      var pts = s.querySelectorAll('.vn-pt'), step = 2000 / Math.max(pts.length, 1);
      Array.prototype.forEach.call(pts, function (p, i) {
        p.style.opacity = 0;
        setTimeout(function () { p.classList.add('is-in'); p.style.opacity = 1; }, 300 + i * step);
      });
    }

    if (!opts.popups) return;
    var pop = null;
    function close() { if (pop) { pop.remove(); pop = null; } }
    function open(node) {
      close();
      var g = groups[+node.getAttribute('data-k')];
      pop = document.createElement('div');
      pop.className = 'vn-pop';
      pop.setAttribute('role', 'dialog');
      pop.setAttribute('aria-label', g.city);
      pop.innerHTML = '<button class="vn-pop-close" aria-label="Close">' + CLOSE_ICON + '</button>' + g.list.map(function (p) {
        return '<div class="vn-pop-row"><b>' + esc(p.name) + '</b><br><span class="vn-fog">' + esc(p.city) + '</span><br>' +
          meter(p.level) + '<br><span class="vn-num">' + plural(p.credits, 'credit', 'credits') + '</span><br>' +
          '<a href="' + profileUrl(p.slug) + '">See their credits</a></div>';
      }).join('');
      wrap.appendChild(pop);
      var r = s.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
      var pt = s.createSVGPoint(); pt.x = g.xy[0]; pt.y = g.xy[1];
      var sp = pt.matrixTransform(s.getScreenCTM());
      var x = sp.x - wr.left, y = sp.y - wr.top;
      var left = Math.min(Math.max(8, x + 14), wrap.clientWidth - pop.offsetWidth - 8);
      var top = y + 14 + pop.offsetHeight > wrap.clientHeight ? Math.max(8, y - pop.offsetHeight - 14) : y + 14;
      pop.style.left = left + 'px'; pop.style.top = top + 'px';
      pop.querySelector('.vn-pop-close').onclick = function () { close(); node.focus(); };
      pop.querySelector('a').focus({ preventScroll: true });
      void r;
    }
    wrap.addEventListener('click', function (e) {
      var n = e.target.closest('.vn-pt');
      if (n) open(n); else if (!e.target.closest('.vn-pop')) close();
    });
    wrap.addEventListener('keydown', function (e) {
      var n = e.target.closest('.vn-pt');
      if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(n); }
      if (e.key === 'Escape') close();
    });
  }

  function credited(d, n) {
    var t = tracks(d).filter(function (x) { return String(x.n) === String(n); })[0];
    if (!t) return [];
    var m = bySlug(d), seen = {};
    return t.credits.filter(function (c) { return c.slug && m[c.slug] && !seen[c.slug] && (seen[c.slug] = 1); })
      .map(function (c) { return m[c.slug]; });
  }

  /* ---------- renderers ---------- */
  var render = {};
  var EMPTY_MAP = 'The map is dark. The first signals arrive with the first track.';

  function strip(s, big) {
    var status = s.open
      ? '<div class="vn-strip-status is-live"><span class="vn-dot is-live" aria-hidden="true"></span><span>' + esc(big ? s.submitDeadline : s.stripStatus) + '</span></div>'
      : '<div class="vn-strip-status"><span class="vn-dot" aria-hidden="true"></span><span>' + esc(big
          ? (s.nextOpen ? 'Submissions for this week are closed. The next theme opens ' + s.nextOpen + '.' : 'Submissions are closed for now.')
          : s.stripStatus) + '</span></div>';
    var head = big
      ? '<h1 class="vn-theme-h"><span class="k">This week’s theme:</span> <span class="v">' + esc(s.theme) + '</span></h1>'
      : '<div class="vn-strip-k">This week' + (s.themeNote ? ' · ' + esc(s.themeNote) : '') + '</div><p class="vn-strip-theme">' + esc(s.theme) + '</p>';
    return '<div class="vn-strip" aria-live="polite">' + head + status + '<p class="vn-strip-vote">' + esc(s.voteStrip) + '</p></div>';
  }

  // Home: the theme strip
  render.strip = function (el) {
    el = mount(el, '');
    data().then(function (d) { mount(el, strip(schedule(d && d.settings))); });
  };

  // Home: how a week works, with "you are here"
  render.timeline = function (el) {
    var t = et(), w = t.iso, L = C.launch, here;
    if (w < L.regularStart) here = w <= L.close ? (t.wd === 4 ? 2 : 1) : 3;
    else here = [3, 0, 1, 1, 2, 3, 3][t.wd];
    var steps = [
      ['Mon', 'The theme is announced, in Vela’s Close Friends story and on this site. Last week’s vote picked it. The vote for next week’s theme opens.'],
      ['Tue', 'Submissions open. Record one sound for the theme and send it. Ten seconds, anything that fits.'],
      ['Thu', 'Submissions close at 11:59 pm ET.'],
      ['Fri', 'The track is made from the sounds that came in. The vote for next week’s theme closes Sunday at 11:59 pm ET.'],
      ['Mon', 'The finished track lands in your inbox, with the credits and timestamps. About a month later, once the distributor has reviewed everything, it reaches streaming platforms. You’ll get an email when it’s out.']
    ];
    mount(el, '<ol class="vn-timeline">' + steps.map(function (st, i) {
      return '<li><span class="day">' + st[0] + '</span><p>' + st[1] + '</p>' +
        (i === here ? '<span class="here" role="img" aria-label="This week is here"></span>' : '') + '</li>';
    }).join('') + '</ol><p class="vn-meta">All times Eastern Time.</p>');
  };

  // Home: a launch-week line that disappears on October 12
  render.launchNote = function (el) {
    var s = schedule();
    if (!s.launch) { el = pick(el); if (el) el.style.display = 'none'; return; }
    mount(el, '<p class="vn-fog vn-read">Launch week runs long. Submissions for Track 01 are open until Thursday, October 8, 11:59 pm ET. ' +
      'The first vote, for week 2’s theme, runs until Sunday, October 11, 11:59 pm ET. Track 01 reaches subscribers on Monday, October 12. ' +
      'The regular week starts after that.</p>');
  };

  function cover(t, size) {
    return safeUrl(t.cover)
      ? '<img src="' + esc(safeUrl(t.cover)) + '" alt="' + esc(t.coverAlt || ('Cover art for ' + trackNo(t.n) + ', ' + t.title)) + '"' + (size ? ' width="' + size + '" height="' + size + '"' : '') + ' loading="lazy">'
      : '<div class="vn-cover-ph" aria-hidden="true">' + pad2(Number(t.n)) + '</div>';
  }
  function trackRow(t) {
    if (t.demo) return '<li><a class="vn-row" href="' + trackUrl(t.n) + '">' + cover(t, 96) + '<div>' +
      '<p class="vn-row-title">' + esc(trackNo(t.n)) + ' · ' + esc(t.title) + '</p>' +
      '<p class="vn-meta">Test transmission · by the human producer behind Vela Nox</p>' +
      '<p class="vn-count">Not built from subscriber sounds.</p>' +
      '</div></a></li>';
    return '<li><a class="vn-row" href="' + trackUrl(t.n) + '">' + cover(t, 96) + '<div>' +
      '<p class="vn-row-title">' + esc(trackNo(t.n)) + ' · ' + esc(t.title) + '</p>' +
      '<p class="vn-meta">' + esc(t.theme) + ' · Sent ' + esc(longDate(t.sent, true)) + '</p>' +
      '<p class="vn-count">' + plural(t.contributors, 'contributor', 'contributors') + ' · ' + plural(t.cities, 'city', 'cities') + '</p>' +
      '</div></a></li>';
  }

  // Home: latest track
  render.latest = function (el) {
    el = mount(el, '');
    data().then(function (d) {
      var t = releases(d)[0], demo = demoTrack(d);
      if (t) return mount(el, '<ul class="vn-rows">' + trackRow(t) + '</ul><p style="margin-top:1.25rem"><a class="vn-btn-2" href="' + trackUrl(t.n) + '">See the credits</a></p>');
      mount(el, '<p>' + (et().date <= C.launch.firstEmail
        ? 'Track 01 lands in subscribers’ inboxes on Monday, October 12.'
        : 'Track 01 is on its way to subscribers’ inboxes.') + '</p>' +
        (demo ? '<p class="vn-fog vn-read">Until then, a test transmission shows how a release page works.</p>' +
          '<ul class="vn-rows">' + trackRow(demo) + '</ul><p style="margin-top:1.25rem"><a class="vn-btn-2" href="' + trackUrl(demo.n) + '">See how credits work</a></p>' : ''));
    });
  };

  // Home hero: the full-bleed map. The headline sits over it in the page, not in here.
  render.heroMap = function (el) {
    el = mount(el, '<div class="vn-map-wrap is-full"></div>');
    Promise.all([data(), geo()]).then(function (res) {
      drawMap(el, res[1], {
        people: people(res[0]), full: true, animate: true, popups: false, empty: '',
        label: 'Night map of the world. Each point of light is the city of someone who sent a sound.'
      });
    }).catch(function () { /* the hero stays dark */ });
  };
  render.mapPreview = render.heroMap;

  // Signal Map page: counters, filters, map, legend, list view
  render.signalMap = function (el) {
    el = mount(el, '<p class="vn-fog">Tuning in…</p>');
    Promise.all([data(), geo()]).then(function (res) {
      var d = res[0], land = res[1], c = (d && d.counters) || {};
      var n = function (v) { return d ? (v || 0) : '—'; };
      var counters = [
        [n(c.weekSounds), c.weekSounds === 1 ? 'sound received this week' : 'sounds received this week'],
        [n(c.weekCities), c.weekCities === 1 ? 'city this week' : 'cities this week'],
        [n(c.tracks), c.tracks === 1 ? 'track released' : 'tracks released'],
        [n(c.credited), c.credited === 1 ? 'contributor credited' : 'contributors credited']
      ];
      var filters = [['all', 'Everyone'], ['week', 'This week’s pool']].concat(releases(d).map(function (t) { return ['t' + t.n, trackNo(t.n)]; }));
      mount(el,
        '<div class="vn-map-top"><div class="vn-counters">' + counters.map(function (x) { return '<span class="vn-counter"><b>' + x[0] + '</b>' + x[1] + '</span>'; }).join('') + '</div>' +
        '<div class="vn-filters" role="group" aria-label="Show on the map">' + filters.map(function (f, i) {
          return '<button type="button" class="vn-filter" data-f="' + esc(f[0]) + '" aria-pressed="' + (i === 0) + '">' + esc(f[1]) + '</button>';
        }).join('') + '</div></div>' +
        '<div class="vn-bleed vn-map-box vn-map-page"></div>' +
        '<div class="vn-map-foot">' +
          '<div><p class="vn-map-note">Each point of light is someone who sent a sound and chose to show their city. City only, placed at the city center, nothing more precise. The more credits, the brighter the light.</p>' +
          '<div class="vn-map-actions"><button type="button" class="vn-btn-2 vn-list-btn" aria-expanded="false" aria-controls="vn-map-list">View as list</button>' +
          '<a href="' + esc(C.paths.contributors) + '">Everyone on the map, as cards</a></div></div>' +
          '<div class="vn-map-key"><p class="vn-key-title">Signal levels</p><ul class="vn-legend">' + LEVELS.map(function (l, i) {
            return '<li>' + meter(l) + '<span class="vn-fog">' + ['sent a sound', '1+ credits', '5+ credits', '10+ credits'][i] + '</span></li>';
          }).join('') + '</ul></div>' +
        '</div>' +
        '<div class="vn-list" id="vn-map-list" hidden></div>');
      var box = el.querySelector('.vn-map-box'), list = el.querySelector('.vn-list'), tog = el.querySelector('.vn-list-btn');
      var current = 'all';
      function selected() {
        var all = people(d);
        if (current === 'week') return { people: all.filter(function (p) { return p.inPool; }), empty: 'No one in this week’s pool has chosen to show their city yet.' };
        if (current.charAt(0) === 't') return { people: credited(d, current.slice(1)), empty: 'No one credited on this track chose to show their city.' };
        return { people: all, empty: d ? EMPTY_MAP : MSG_ERROR };
      }
      function drawList(ppl) {
        var g = groupByCity(ppl);
        list.innerHTML = g.length
          ? '<div class="vn-table-wrap"><table class="vn-table"><thead><tr><th scope="col">City</th><th scope="col">Contributors</th><th scope="col">Credits</th></tr></thead><tbody>' +
            g.map(function (x) {
              return '<tr><td>' + esc(x.city) + '</td><td>' + x.list.map(function (p) { return '<a href="' + profileUrl(p.slug) + '">' + esc(p.name) + '</a>'; }).join(', ') + '</td><td>' + x.credits + '</td></tr>';
            }).join('') + '</tbody></table></div>'
          : '<p class="vn-fog">Nothing to list yet.</p>';
      }
      function show(first) {
        var o = selected();
        o.popups = true; o.full = true; o.animate = first;
        o.label = 'Night map of the world with points of light for contributors’ cities. Tap a light for details, or use View as list.';
        drawMap(box, land, o);
        drawList(o.people);
      }
      el.querySelector('.vn-filters').addEventListener('click', function (e) {
        var b = e.target.closest('.vn-filter');
        if (!b) return;
        current = b.getAttribute('data-f');
        Array.prototype.forEach.call(el.querySelectorAll('.vn-filter'), function (x) { x.setAttribute('aria-pressed', x === b); });
        show(false);
      });
      tog.addEventListener('click', function () {
        var open = list.hidden;
        list.hidden = !open;
        tog.setAttribute('aria-expanded', open);
        tog.textContent = open ? 'Hide the list' : 'View as list';
      });
      show(true);
    }).catch(function () { mount(el, '<p class="vn-fog">' + MSG_ERROR + '</p>'); });
  };

  function card(p) {
    return '<article class="vn-card" id="c-' + esc(p.slug) + '">' +
      '<h3 class="vn-card-name">' + esc(p.name) + '</h3><p class="vn-card-city">' + esc(p.city) + '</p>' + meter(p.level) +
      '<p class="vn-card-stats">' + plural(p.credits, 'credit', 'credits') + ' · ' + plural(p.submitted, 'sound sent', 'sounds sent') + '</p>' +
      (p.tracks.length ? '<ul class="vn-card-tracks">' + p.tracks.map(function (x) {
        return '<li><a href="' + trackUrl(x.n, p.slug) + '">' + esc(trackNo(x.n)) + '</a><span>at ' + esc(x.t) + '</span></li>';
      }).join('') + '</ul>' : '<p class="vn-meta" style="margin:0">Not credited on a track yet.</p>') +
      '</article>';
  }

  // Signal Map page: Broadcast wall. Hidden until someone reaches Broadcast.
  render.broadcastWall = function (el) {
    el = pick(el);
    if (!el) return;
    el.style.display = 'none';
    data().then(function (d) {
      var list = people(d).filter(function (p) { return p.level === 'Broadcast'; });
      if (!list.length) return;
      el.style.display = '';
      mount(el, '<h2>Broadcast wall</h2><p class="vn-fog">Ten credits or more. The brightest lights on the map.</p><div class="vn-grid">' + list.map(card).join('') + '</div>');
    });
  };

  // Tracks & Credits: index
  render.tracksIndex = function (el) {
    el = mount(el, '');
    data().then(function (d) {
      if (!d) return mount(el, '<p class="vn-fog">' + MSG_ERROR + '</p>');
      var list = releases(d), demo = demoTrack(d);
      mount(el, (list.length
        ? '<ul class="vn-rows">' + list.map(trackRow).join('') + '</ul>'
        : '<p class="vn-fog">No tracks yet. Track 01 is being built from the rooms you’re in right now.</p>') +
        (demo ? '<div class="vn-demo-block"><p class="vn-key-title">Test transmission</p>' +
          '<p class="vn-fog vn-read">Not a release. It shows how a release page works until Track 01 arrives.</p>' +
          '<ul class="vn-rows">' + trackRow(demo) + '</ul></div>' : ''));
    });
  };

  function parsePeaks(w) {
    try { var o = JSON.parse(w); if (o && isFinite(o.d) && o.p && o.p.length) return o; } catch (e) { /* not peaks */ }
    return null;
  }
  function peaksFromAudio(url) {
    // Needs the audio host to allow cross-origin reads (CORS). Falls back to a flat line if not.
    return fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (buf) {
      var AC = window.AudioContext || window.webkitAudioContext, ac = new AC();
      return new Promise(function (ok, fail) { ac.decodeAudioData(buf, ok, fail); });
    }).then(function (ab) {
      var ch = ab.getChannelData(0), n = 600, step = Math.floor(ch.length / n), p = [], max = 0;
      for (var i = 0; i < n; i++) { var m = 0; for (var j = i * step; j < (i + 1) * step; j += 16) m = Math.max(m, Math.abs(ch[j])); p.push(m); max = Math.max(max, m); }
      return { d: ab.duration, p: p.map(function (v) { return max ? v / max : 0; }) };
    });
  }
  function durationFromAudio(url) {
    return new Promise(function (ok) {
      var a = new Audio(); a.preload = 'metadata';
      a.onloadedmetadata = function () { ok(isFinite(a.duration) ? { d: a.duration, p: null } : null); };
      a.onerror = function () { ok(null); };
      a.src = url;
    });
  }
  function waveformData(w) {
    var pk = parsePeaks(w);
    if (pk) return Promise.resolve(pk);
    var url = safeUrl(w);
    if (!url) return Promise.resolve(null);
    return peaksFromAudio(url).catch(function () { return durationFromAudio(url); });
  }
  function creditLine(c) { return (c.example ? 'Example · ' : '') + [c.sound, c.name, c.city, c.t].filter(Boolean).join(' · '); }

  // Waveform credits: thin concrete bars, ice-blue markers under them at each timestamp.
  // Hover, focus or tap a marker: nearby bars brighten, the panel shows the credit, its row lights up.
  function drawWave(el, wf, credits, rows, preselect) {
    var n = wf.p ? wf.p.length : 200, bw = 1000 / n, bars = '';
    for (var i = 0; i < n; i++) {
      var v = wf.p ? wf.p[i] : 0.02, h = Math.max(1.5, v * 110);
      bars += '<rect class="vn-bar" x="' + (i * bw).toFixed(2) + '" y="' + (60 - h / 2).toFixed(1) + '" width="' + Math.max(bw * 0.55, 0.6).toFixed(2) + '" height="' + h.toFixed(1) + '"/>';
    }
    var marks = credits.map(function (c, i) {
      if (!c.slug || !isFinite(c.s) || c.s > wf.d) return '';
      return '<button type="button" class="vn-mark" data-i="' + i + '" style="left:' + (c.s / wf.d * 100).toFixed(3) + '%" aria-label="' + esc(creditLine(c)) + '"></button>';
    }).join('');
    el.innerHTML = '<div class="vn-wave-scroll"><div class="vn-wave"><svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">' + bars + '</svg>' + marks + '</div></div>';
    var wave = el.querySelector('.vn-wave'), rects = wave.querySelectorAll('.vn-bar'), tip = null, lit = [];
    function clear() {
      if (tip) { tip.remove(); tip = null; }
      lit.forEach(function (x) { x.classList.remove('is-lit'); }); lit = [];
    }
    function show(b) {
      clear();
      var c = credits[+b.getAttribute('data-i')], centre = Math.round(c.s / wf.d * n), span = Math.max(2, Math.round(n / 100));
      for (var j = centre - span; j <= centre + span; j++) if (rects[j]) { rects[j].classList.add('is-lit'); lit.push(rects[j]); }
      var row = rows && rows.querySelector('[data-i="' + b.getAttribute('data-i') + '"]');
      if (row) { row.classList.add('is-lit'); lit.push(row); }
      tip = document.createElement('div'); tip.className = 'vn-tip'; tip.textContent = creditLine(c);
      wave.appendChild(tip);
      var half = tip.offsetWidth / 2, x = b.offsetLeft;
      tip.style.left = Math.min(Math.max(x, half + 2), wave.clientWidth - half - 2) + 'px';
    }
    Array.prototype.forEach.call(wave.querySelectorAll('.vn-mark'), function (b) {
      b.addEventListener('mouseenter', function () { show(b); });
      b.addEventListener('focus', function () { show(b); });
      b.addEventListener('click', function () { show(b); });
      b.addEventListener('mouseleave', function () { if (document.activeElement !== b) clear(); });
      b.addEventListener('blur', clear);
    });
    if (preselect) {
      var idx = credits.map(function (c) { return c.slug; }).indexOf(preselect);
      var pre = idx >= 0 && wave.querySelector('.vn-mark[data-i="' + idx + '"]');
      if (pre) { show(pre); pre.scrollIntoView({ block: 'center', inline: 'center' }); }
    }
  }

  // Tracks & Credits: one track (the page reads ?n= and, from a profile, ?c=)
  render.track = function (el, opts) {
    el = mount(el, '');
    var q = new URLSearchParams(location.search);
    var n = (opts && opts.n) || q.get('n'), pre = (opts && opts.c) || q.get('c');
    data().then(function (d) {
      if (!d) return mount(el, '<p class="vn-fog">' + MSG_ERROR + '</p>');
      var t = tracks(d).filter(function (x) { return String(x.n) === String(n); })[0];
      if (!t) return mount(el, '<h1>No track here</h1><p class="vn-fog">This track hasn’t gone out yet, or the link is wrong. <a href="' + esc(C.paths.tracks) + '">All tracks</a></p>');
      if (t.demo) return demoPage(el, t);
      document.title = trackNo(t.n) + ', ' + t.title + ': credits | Vela Nox';
      var credits = t.credits; // already in timestamp order; name-only entries carry no time
      var links = (t.links || []).filter(function (l) { return safeUrl(l.url); });
      var names = [], seen = {};
      credits.forEach(function (c) { if (!seen[c.name]) { seen[c.name] = 1; names.push(c.name); } });
      mount(el,
        '<div class="vn-track-head"><div>' +
        '<p class="vn-track-no">' + esc(trackNo(t.n)) + '</p><h1>' + esc(t.title) + '</h1>' +
        '<p class="vn-fog" style="margin:0">Theme: ' + esc(t.theme) + '<br>Sent to subscribers ' + esc(longDate(t.sent, true)) + '<br>' +
        '<span class="vn-num" style="color:var(--mist)">' + plural(t.contributors, 'contributor', 'contributors') + ' · ' + plural(t.cities, 'city', 'cities') + '</span></p>' +
        (links.length
          ? '<div class="vn-links">' + links.map(function (l) { return '<a class="vn-btn-2" href="' + esc(safeUrl(l.url)) + '" rel="noopener" target="_blank">' + esc(l.label || 'Listen') + '</a>'; }).join('') + '</div>'
          : '<p class="vn-fog vn-read" style="margin-top:1.25rem">Not on streaming platforms yet. Tracks go out there about a month after the subscriber email, once the distributor has reviewed everything. Subscribers get an email when it’s out.</p>') +
        '</div>' + cover(t) + '</div>' +
        '<section class="vn-section"><h2>Waveform credits</h2><p class="vn-fog vn-read">Each mark is a sound someone sent. Hover or tap it to see whose. People who chose not to show their city are credited by name only, in the list below.</p><div class="vn-wave-box"><p class="vn-fog">Reading the waveform…</p></div></section>' +
        '<section class="vn-section"><h2>Credits</h2>' + (credits.length
          ? '<ol class="vn-credits">' + credits.map(function (c, i) {
            if (!c.slug) return '<li data-i="' + i + '"><span class="vn-ts"></span><span>' + esc(c.name) + '</span></li>';
            return '<li data-i="' + i + '"><span class="vn-ts">' + esc(c.t) + '</span><span>' + esc(c.sound) + ' · ' +
              '<a href="' + profileUrl(c.slug) + '">' + esc(c.name) + '</a> · <span class="vn-fog">' + esc(c.city) + '</span></span></li>';
          }).join('') + '</ol>'
          : '<p class="vn-fog">No public credits on this track.</p>') + '</section>' +
        '<section class="vn-section"><h2>Streaming credits</h2><p class="vn-fog vn-read">Names only. This is the text used on streaming platforms, where they allow it. The artist field says Vela Nox.</p>' +
        '<p class="vn-stream-credits">' + (names.length ? names.map(esc).join(', ') : '—') + '</p></section>' +
        '<section class="vn-section"><h2>Where this track came from</h2><div class="vn-track-map"></div></section>');

      var waveBox = el.querySelector('.vn-wave-box'), rows = el.querySelector('.vn-credits');
      waveformData(t.waveform).then(function (wf) {
        if (!wf) return (waveBox.innerHTML = '<p class="vn-fog">No waveform for this track. The credits below have every timestamp.</p>');
        drawWave(waveBox, wf, credits, rows, pre);
      });
      var list = credited(d, t.n), mapBox = el.querySelector('.vn-track-map');
      geo().then(function (land) {
        drawMap(mapBox, land, {
          people: list, popups: true, empty: 'No one credited on this track chose to show their city.',
          label: 'Night map with the cities of people credited on ' + trackNo(t.n) + '.'
        });
      }).catch(function () { mapBox.innerHTML = '<p class="vn-fog">' + MSG_ERROR + '</p>'; });
    });
  };

  // The test transmission: the producer's own track, shown with example marks so people can see
  // how a release page works. No real people, no real credits, nothing on the map.
  function demoPage(el, t) {
    document.title = t.title + ', a test transmission | Vela Nox';
    var links = (t.links || []).filter(function (l) { return safeUrl(l.url); });
    var ex = (t.marks && t.marks.length ? t.marks : [{ t: '—:—' }, { t: '—:—' }, { t: '—:—' }]).map(function (m) {
      return { example: true, slug: 'example', s: m.s, t: m.t, sound: 'your sound', name: 'your name', city: 'your city' };
    });
    mount(el,
      '<div class="vn-track-head"><div>' +
      '<p class="vn-track-no">' + esc(trackNo(t.n)) + ' · Test transmission</p><h1>' + esc(t.title) + '</h1>' +
      (links.length ? '<div class="vn-links">' + links.map(function (l) { return '<a class="vn-btn-2" href="' + esc(safeUrl(l.url)) + '" rel="noopener" target="_blank">' + esc(l.label || 'Listen') + '</a>'; }).join('') + '</div>' : '') +
      '<div class="vn-demo-note"><p><b>This one isn’t built from your sounds.</b> ' + esc(t.title) + ' is a track by the human producer behind Vela Nox, sent out ahead of Track 01 so you can see how a release page works.</p>' +
      '<p>The marks on the waveform show where credits go. From Track 01, every mark is someone’s sound: their credit name, their city if they chose to show it, and the exact second it plays.</p></div>' +
      '</div>' + cover(t) + '</div>' +
      '<section class="vn-section"><h2>Waveform credits</h2><p class="vn-fog vn-read">Example marks. Hover or tap one to see how a credit will read.</p><div class="vn-wave-box"><p class="vn-fog">Reading the waveform…</p></div></section>' +
      '<section class="vn-section"><h2>Credits</h2><p class="vn-fog vn-read">No subscriber sounds in this one. From Track 01, the list looks like this, in the order the sounds play:</p>' +
      '<ol class="vn-credits vn-credits-example">' + ex.map(function (c, i) {
        return '<li data-i="' + i + '"><span class="vn-ts">' + esc(c.t) + '</span><span>' + c.sound + ' · ' + c.name + ' · <span class="vn-fog">' + c.city + '</span></span></li>';
      }).join('') + '</ol></section>' +
      '<section class="vn-section"><h2>Streaming credits</h2><p class="vn-fog vn-read">' + esc(t.title) + ' is credited to Vela Nox. From Track 01, contributors’ names go here, in the order their sounds play, and on streaming platforms where they allow it.</p></section>' +
      '<section class="vn-section"><h2>Where this track came from</h2><div class="vn-track-map"></div></section>');
    var waveBox = el.querySelector('.vn-wave-box'), rows = el.querySelector('.vn-credits');
    waveformData(t.waveform).then(function (wf) {
      if (!wf) return (waveBox.innerHTML = '<p class="vn-fog">The waveform for ' + esc(t.title) + ' appears here once its audio is added.</p>');
      drawWave(waveBox, wf, ex, rows, null);
    });
    var mapBox = el.querySelector('.vn-track-map');
    geo().then(function (land) {
      drawMap(mapBox, land, {
        people: [], popups: false, empty: 'No lights for this one: ' + t.title + ' has no contributors. The first ones arrive with Track 01.',
        label: 'Night map with no lights: the test transmission has no contributors.'
      });
    }).catch(function () { mapBox.innerHTML = ''; });
  }

  // Contributor profiles: one card each, opted-in only
  render.contributors = function (el) {
    el = mount(el, '');
    data().then(function (d) {
      if (!d) return mount(el, '<p class="vn-fog">' + MSG_ERROR + '</p>');
      var list = people(d).slice().sort(function (a, b) { return b.credits - a.credits || a.name.localeCompare(b.name); });
      if (!list.length) return mount(el, '<p class="vn-fog">No one here yet. Cards appear once people send sounds and choose to show their city.</p>');
      mount(el, '<div class="vn-grid">' + list.map(card).join('') + '</div>');
      function target() {
        Array.prototype.forEach.call(el.querySelectorAll('.is-target'), function (c) { c.classList.remove('is-target'); });
        var h = decodeURIComponent(location.hash.slice(1)), c = h && document.getElementById(h);
        if (c && el.contains(c)) { c.classList.add('is-target'); c.scrollIntoView({ block: 'center' }); }
      }
      window.addEventListener('hashchange', target);
      target();
    });
  };

  // Submit (inside the subscriber portal). opts.form: GoHighLevel form embed URL.
  render.submit = function (el, opts) {
    el = mount(el, '');
    data().then(function (d) {
      var s = schedule(d && d.settings);
      var intro = strip(s, true);
      if (!s.open) return mount(el, intro);
      mount(el, intro +
        '<p class="vn-reminder">Your sound only. No one else’s voice, no music playing.</p>' +
        '<p class="vn-fog">' + esc(s.voteSubmit) + '</p>' +
        '<div class="vn-form-frame"></div>');
      var frame = el.querySelector('.vn-form-frame');
      if (opts && opts.formHtml) return (frame.innerHTML = opts.formHtml); // preview only
      var src = safeUrl(opts && opts.form);
      if (!src) return (frame.innerHTML = '<p class="vn-fog">Form not connected. Add the GoHighLevel form URL to this element.</p>');
      var f = document.createElement('iframe');
      f.src = src; f.title = 'Send this week’s sound'; f.loading = 'lazy';
      if (opts.formId) f.id = 'inline-' + opts.formId;
      frame.appendChild(f);
      if (!document.querySelector('script[src*="form_embed.js"]')) loadScript('https://link.msgsndr.com/js/form_embed.js').catch(function () {});
    });
  };

  // After a submission: the one centred moment. A light, and a line rising to the tower.
  render.confirmation = function (el) {
    el = mount(el, '');
    data().then(function (d) {
      var s = schedule(d && d.settings);
      mount(el, '<div class="vn-confirm"><div class="vn-confirm-signal" aria-hidden="true"><b></b><i></i></div>' +
        '<h1>Got it. Your sound is in the pool for ' + esc(s.theme) + '.</h1>' +
        '<p>The track lands in your inbox on Monday' + (s.launch ? ', October 12.' : '.') + '</p>' +
        '<p style="margin-top:2rem"><a class="vn-btn-2" href="' + esc(C.paths.map) + '">See the Signal Map</a></p></div>');
    });
  };

  // Second attempt in the same week
  render.alreadySent = function (el) {
    el = mount(el, '');
    data().then(function (d) {
      var s = schedule(d && d.settings);
      mount(el, '<h1>You’ve already sent this week’s sound</h1>' +
        '<p class="vn-read">Your sound is in the pool for ' + esc(s.theme) + '. The track lands in your inbox on Monday' + (s.launch ? ', October 12.' : '.') +
        ' The next theme opens Tuesday.</p>' +
        '<p class="vn-fog vn-read">' + esc(s.voteSubmit) + '</p>');
    });
  };

  // Rules & FAQ: answer to "How does the theme vote work?"
  render.voteAnswer = function (el) {
    var s = schedule();
    mount(el, s.launch
      ? '<p>Launch week is longer. The first vote runs from Wednesday, September 30 until Sunday, October 11, 11:59 pm ET, and decides week 2’s theme. ' +
        'After that, the vote runs all week, Monday to Sunday, closing Sunday at 11:59 pm ET. Each vote decides next week’s theme.</p>' +
        '<p>The vote is a Google Form linked in Vela’s Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site.</p>'
      : '<p>The vote runs all week, Monday to Sunday, and closes Sunday at 11:59 pm ET. It decides next week’s theme, not this week’s.</p>' +
        '<p>It’s a Google Form linked in Vela’s Close Friends story on Instagram and pinned in a Close Friends highlight. The winning theme is announced on Monday, in the story and on this site.</p>');
  };

  // Rules & FAQ: the current deadline
  render.deadlineAnswer = function (el) {
    var s = schedule();
    mount(el, s.launch
      ? '<p>For Track 01: Thursday, October 8, 11:59 pm ET. From October 12, the regular week applies: submissions open Tuesday at 12:00 am ET and close Thursday at 11:59 pm ET.</p>'
      : '<p>Submissions open Tuesday at 12:00 am ET and close Thursday at 11:59 pm ET, every week.</p>');
  };

  window.VELA = { reset: function () { dataPromise = null; }, config: C, render: render, schedule: schedule, data: data, esc: esc, CTA: CTA, meter: meter };
})();
