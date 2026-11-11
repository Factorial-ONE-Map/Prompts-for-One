/* Prompts for One · idioma y modo noche. */
(function () {
  var NAV = {
    es: ['Mapa One', 'Conectores', 'Planes', 'Prompts'],
    en: ['One Map', 'Connectors', 'Plans', 'Prompts'],
    de: ['One-Karte', 'Konnektoren', 'Pläne', 'Prompts'],
    pt: ['Mapa One', 'Conectores', 'Planos', 'Prompts'],
    'pt-br': ['Mapa One', 'Conectores', 'Planos', 'Prompts'],
    fr: ['Carte One', 'Connecteurs', 'Offres', 'Prompts'],
    it: ['Mappa One', 'Connettori', 'Piani', 'Prompt'],
    pl: ['Mapa One', 'Konektory', 'Plany', 'Prompty']
  };
  var PAGES = ['', 'connectors/', 'plans/', 'prompts/'];
  var NAMES = { es: 'Español', en: 'English', de: 'Deutsch', pt: 'Português (Portugal)', 'pt-br': 'Português (Brasil)', fr: 'Français', it: 'Italiano', pl: 'Polski' };
  var qs = new URLSearchParams(location.search);
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var hm = /^#lang-([a-z-]+)$/.exec(location.hash || '');
  var lang = hm ? hm[1] : qs.get('lang');
  if (!NAV[lang]) lang = store('onemap-lang');
  if (!NAV[lang]) lang = 'es';
  var partner = qs.get('for') === 'partner';

  function query(l) { var q = new URLSearchParams(); if (l !== 'es') q.set('lang', l); if (partner) q.set('for', 'partner'); var s = q.toString(); return s ? '?' + s : ''; }

  window.SITE = {
    lang: lang, partner: partner, names: NAMES,
    /* menú arriba de todo; `current` es la carpeta de la página, p. ej. 'plans/' */
    bar: function (current) {
      var nav = document.createElement('nav');
      nav.className = 'sitebar'; nav.id = 'sitebar'; nav.setAttribute('aria-label', 'Factorial One');
      PAGES.forEach(function (p, i) {
        var a = document.createElement('a');
        a.href = '../' + p + 'index.html' + query(lang);
        a.textContent = NAV[lang][i];
        if (p === current) a.setAttribute('aria-current', 'page');
        nav.appendChild(a);
      });
      document.body.insertBefore(nav, document.body.firstChild);
    },
    /* selector de idioma: recarga la página con ?lang= */
    langSelect: function (sel, only) {
      Object.keys(NAMES).forEach(function (k) {
        if (only && only.indexOf(k) < 0) return;
        var o = document.createElement('option'); o.value = k; o.textContent = NAMES[k]; sel.appendChild(o);
      });
      sel.value = lang;
      sel.addEventListener('change', function () {
        store('onemap-lang', sel.value);
        /* dentro de un visor embebido solo funciona el #; en la web, ?lang= da un enlace por idioma */
        if (window.self !== window.top) { location.hash = 'lang-' + sel.value; location.reload(); return; }
        var u = new URL(location.href); u.hash = '';
        if (sel.value === 'es') u.searchParams.delete('lang'); else u.searchParams.set('lang', sel.value);
        location.href = u.toString();
      });
    },
    theme: function (btn) {
      var root = document.documentElement, mq = window.matchMedia && matchMedia('(prefers-color-scheme: dark)');
      function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : !!(mq && mq.matches); }
      function sync() { btn.setAttribute('aria-pressed', String(isDark())); }
      btn.addEventListener('click', function () {
        var dark = !isDark();
        root.setAttribute('data-theme', dark ? 'dark' : 'light');
        store('onemap-theme', dark ? 'dark' : 'light'); sync();
      });
      if (mq && mq.addEventListener) mq.addEventListener('change', sync);
      sync();
    },
    mapLink: function (hash) { return '../index.html' + query(lang) + (hash ? '#' + hash : ''); }
  };
})();
