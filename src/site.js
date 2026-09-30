/* Vela Nox: page behaviour for the GoHighLevel paste-in kit (ghl/). Runs after src/vela.js, from the
 * footer tracking code, so every page block is already on the page. It does what the preview's own
 * script does, for real URLs instead of the preview's one-page switcher:
 * the header turning solid on scroll, the phone menu, the FAQ accordion, the current page in the nav,
 * the contributor levels list, and one VELA.render call for each live block present on the page. */
(function () {
  'use strict';
  var V = window.VELA;
  if (!V || !document.querySelector('.vn')) return;
  var C = V.config, R = V.render;
  var $ = function (id) { return document.getElementById(id); };

  // Pages that open with a full-bleed image: the header starts transparent over it
  var hasHero = !!document.querySelector('.vn .hero, .vn .band');
  document.body.classList.toggle('has-hero', hasHero);
  var head = $('site-head');
  function solid() { if (head) head.classList.toggle('is-solid', !hasHero || window.scrollY > 40); }
  window.addEventListener('scroll', solid, { passive: true });
  solid();

  // Current page in the main nav (the track page counts as Tracks, /sent as Submit)
  var here = location.pathname.replace(/\/+$/, '') || '/';
  var alias = {}; alias[C.paths.track] = C.paths.tracks; alias['/sent'] = C.paths.submit;
  here = alias[here] || here;
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var p = (a.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (p === here) a.setAttribute('aria-current', 'page');
  });

  // Links to the subscriber portal take the URL from the config
  document.querySelectorAll('a[data-vn-portal]').forEach(function (a) { if (C.portalUrl) a.href = C.portalUrl; });

  // Phone menu
  var menu = $('menu'), mOpen = $('menu-open'), mClose = $('menu-close');
  function closeMenu() { if (menu) { menu.hidden = true; mOpen.setAttribute('aria-expanded', 'false'); } }
  if (menu && mOpen && mClose) {
    mOpen.addEventListener('click', function () { menu.hidden = false; mOpen.setAttribute('aria-expanded', 'true'); mClose.focus(); });
    mClose.addEventListener('click', function () { closeMenu(); mOpen.focus(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { closeMenu(); mOpen.focus(); } });
  }

  // FAQ accordion
  var PLUS = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1v14M1 8h14" fill="none"/></svg>';
  document.querySelectorAll('.faq-q').forEach(function (q, i) {
    q.insertAdjacentHTML('beforeend', PLUS);
    var a = q.closest('.faq-item').querySelector('.faq-a');
    a.id = 'faq-a-' + i; q.setAttribute('aria-controls', a.id); q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', function () {
      var open = !a.classList.contains('is-open');
      a.classList.toggle('is-open', open); q.setAttribute('aria-expanded', open);
    });
  });

  // Contributors page: the four levels with their meters
  var levels = $('levels-list');
  if (levels) {
    var t = { Static: 'sent a sound, not credited yet.', Signal: '1 credit or more.', Frequency: '5 credits or more.', Broadcast: '10 credits or more.' };
    levels.innerHTML = Object.keys(t).map(function (k) { return '<li>' + V.meter(k) + '<span class="vn-fog">' + t[k] + '</span></li>'; }).join('');
  }

  // Live blocks: each one renders only if it's on this page
  var blocks = {
    'vn-hero-map': R.heroMap, 'vn-strip': R.strip, 'vn-timeline': R.timeline, 'vn-launch': R.launchNote,
    'vn-latest': R.latest, 'vn-strip-locked': R.strip, 'vn-signal-map': R.signalMap, 'vn-broadcast': R.broadcastWall,
    'vn-tracks': R.tracksIndex, 'vn-track': R.track, 'vn-contributors': R.contributors, 'vn-sent': R.confirmation,
    'vn-faq-vote': R.voteAnswer, 'vn-faq-deadline': R.deadlineAnswer
  };
  Object.keys(blocks).forEach(function (id) { if ($(id)) blocks[id]('#' + id); });
})();
