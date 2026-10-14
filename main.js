/* Jobless — shared behaviour for every page. Plain JavaScript, no build step. */
(() => {
  const { categories: baseCategories, jobs: seedJobs } = window.JOBLESS;
  const categories = [...baseCategories, 'Other'];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // localStorage can throw (private mode, blocked data), so every access is guarded.
  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };

  const icons = {
    search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 21s-7-4.4-9.3-9A5.4 5.4 0 0 1 12 6.4 5.4 5.4 0 0 1 21.3 12C19 16.6 12 21 12 21Z"/></svg>',
    sun: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 13.2A8.5 8.5 0 0 1 10.8 3a8.5 8.5 0 1 0 10.2 10.2Z"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    pin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6 7-12a7 7 0 1 0-14 0c0 6 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>'
  };
  const catIcon = { Engineering: '💻', Design: '🎨', Data: '📊', Product: '🧭', Marketing: '📣', Writing: '✍️', Other: '🧩' };

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeNow = () => root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function applyTheme(t) {
    root.dataset.theme = t;
    const b = $('#theme');
    if (b) {
      b.innerHTML = t === 'dark' ? icons.sun : icons.moon;
      b.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  /* ---------- toast ---------- */
  let toasts;
  function toast(msg) {
    if (!toasts) { toasts = document.createElement('div'); toasts.className = 'toasts'; toasts.setAttribute('role', 'status'); document.body.append(toasts); }
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    toasts.append(el);
    setTimeout(() => el.remove(), 3200);
  }

  /* ---------- layout (nav, drawer, footer) ---------- */
  const links = [['index.html', 'Home', 'home'], ['discover.html', 'Discover', 'discover'], ['post-job.html', 'Post a Job', 'post'], ['contact.html', 'Contact Us', 'contact']];
  const navLinks = (cls) => links.map(([h, t, p]) => `<a href="${h}"${p === page ? ' aria-current="page"' : ''}>${t}</a>`).join('');

  function mountLayout() {
    const main = $('main');
    main.id = 'main';
    document.body.insertAdjacentHTML('afterbegin', `
      <a class="skip" href="#main">Skip to content</a>
      <header class="nav" id="nav"><div class="container">
        <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">J</span>Jobless</a>
        <nav class="menu" aria-label="Main">${navLinks()}</nav>
        <div class="nav-actions">
          <button class="icon-btn" id="theme" type="button"></button>
          <button class="btn btn-primary btn-sm" id="signup" type="button">Sign Up</button>
          <button class="icon-btn hamburger" id="burger" type="button" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
        </div>
      </div></header>
      <div class="drawer-overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="Menu">
        <button class="icon-btn" id="drawer-close" type="button" aria-label="Close menu" style="align-self:flex-end">${icons.close}</button>
        ${navLinks()}
        <button class="btn btn-primary" id="signup-m" type="button" style="margin-top:12px">Sign Up</button>
      </aside>`);
    main.insertAdjacentHTML('afterend', `
      <footer class="footer"><div class="container">
        <div><b style="color:var(--ink)">Jobless</b> · Remote jobs, without the noise.<br>A practice project, built from a Code The Design challenge. Listings come from <a href="https://remotive.com" target="_blank" rel="noopener noreferrer">Remotive</a>.</div>
        <nav aria-label="Footer">${links.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="https://github.com/Alhammanazil/Jobless" target="_blank" rel="noopener">GitHub</a></nav>
      </div></footer>`);

    applyTheme(themeNow());
    $('#theme').addEventListener('click', () => { const t = themeNow() === 'dark' ? 'light' : 'dark'; applyTheme(t); store.set('jobless:theme', t); });

    const setDrawer = (open) => {
      document.body.classList.toggle('drawer-open', open);
      $('#burger').setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    };
    $('#burger').addEventListener('click', () => setDrawer(true));
    $('#overlay').addEventListener('click', () => setDrawer(false));
    $('#drawer-close').addEventListener('click', () => setDrawer(false));
    $$('#drawer a').forEach((a) => a.addEventListener('click', () => setDrawer(false)));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') setDrawer(false); });

    const nav = $('#nav');
    const onScroll = () => nav.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    $('#signup').addEventListener('click', openSignup);
    $('#signup-m').addEventListener('click', () => { setDrawer(false); openSignup(); });
  }

  /* ---------- reveal on scroll, counters, card spotlight ---------- */
  function reveal(scope = document) {
    const els = $$('.reveal:not(.in)', scope);
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e, i) => { e.style.setProperty('--d', `${Math.min(i % 6, 5) * 70}ms`); io.observe(e); });
  }
  function counters() {
    const els = $$('[data-count]');
    const run = (el) => {
      const end = +el.dataset.count, suffix = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(end * eased).toLocaleString('en-US') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { reduce ? (x.target.textContent = (+x.target.dataset.count).toLocaleString('en-US') + (x.target.dataset.suffix || '')) : run(x.target); io.unobserve(x.target); } }), { threshold: 0.6 });
    els.forEach((e) => io.observe(e));
  }
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest && e.target.closest('.job');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  /* ---------- jobs ---------- */
  const posted = () => store.get('jobless:posted', []);
  // Live listings come from /api/jobs (a cached proxy for Remotive). If it fails, the demo data in data.js is used.
  let liveJobs = null;
  let feed = { live: false, source: '', sourceUrl: '', fetchedAt: '' };
  const baseJobs = () => liveJobs || seedJobs;
  const allJobs = () => [...posted(), ...baseJobs()];
  const applyFeed = (data) => {
    liveJobs = data.jobs;
    feed = { live: true, source: data.source, sourceUrl: data.sourceUrl, fetchedAt: data.fetchedAt };
  };
  async function loadFeed() {
    const cached = store.get('jobless:feed', null);
    if (cached && cached.data && cached.data.jobs && cached.data.jobs.length && Date.now() - cached.at < 30 * 60 * 1000) { applyFeed(cached.data); return; }
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 7000);
      const r = await fetch('api/jobs', { signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) throw new Error('feed ' + r.status);
      const data = await r.json();
      if (!data.jobs || !data.jobs.length) throw new Error('empty feed');
      store.set('jobless:feed', { at: Date.now(), data });
      applyFeed(data);
    } catch { /* keep demo data */ }
  }
  const since = (iso) => {
    const m = Math.max(0, Math.round((Date.now() - Date.parse(iso)) / 60000));
    return m < 2 ? 'just now' : m < 60 ? m + ' minutes ago' : m < 120 ? '1 hour ago' : m < 1440 ? Math.round(m / 60) + ' hours ago' : Math.round(m / 1440) + ' days ago';
  };
  function renderSource(el) {
    if (!el) return;
    el.innerHTML = feed.live
      ? '<span class="dot"></span> Live listings from <a href="' + esc(feed.sourceUrl) + '" target="_blank" rel="noopener noreferrer">' + esc(feed.source) + '</a> · updated ' + since(feed.fetchedAt)
      : 'Showing demo listings because the live feed is unavailable right now.';
  }
  const skeleton = (n) => Array.from({ length: n }, () => '<div class="job skel" aria-hidden="true"><div class="job-top"><div class="avatar"></div><div style="flex:1"><div class="bar w60"></div><div class="bar w40"></div></div></div><div class="bar"></div><div class="bar w80"></div><div class="bar w50"></div></div>').join('');
  let saved = new Set(store.get('jobless:saved', []));
  const persistSaved = () => store.set('jobless:saved', [...saved]);

  const money = (n) => `$${Math.round(n / 1000)}k`;
  const salary = (j) => j.salaryText || (j.min && j.max ? `${money(j.min)} – ${money(j.max)}` : j.min ? `From ${money(j.min)}` : 'Salary not listed');
  const ago = (d) => (d === 0 ? 'Today' : d === 1 ? '1 day ago' : `${d} days ago`);
  const hue = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7);
  const gradient = (name) => `linear-gradient(135deg,hsl(${hue(name)} 70% 48%),hsl(${(hue(name) + 40) % 360} 70% 38%))`;
  const initial = (j) => (j.company.trim()[0] || '?').toUpperCase();
  const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : '');
  const avatar = (j) => (safeUrl(j.logo) || (j.logo && !/^https?:/i.test(j.logo))
    ? `<div class="avatar" data-initial="${esc(initial(j))}" data-bg="${esc(gradient(j.company))}"><img src="${esc(j.logo)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div>`
    : `<div class="avatar" style="background:${gradient(j.company)}" aria-hidden="true">${esc(initial(j))}</div>`);
  // Remote logos can fail to load, so fall back to the coloured initial.
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!img || img.tagName !== 'IMG') return;
    const box = img.closest('.avatar');
    if (!box || !box.dataset.initial) return;
    box.style.background = box.dataset.bg;
    box.textContent = box.dataset.initial;
    box.setAttribute('aria-hidden', 'true');
  }, true);

  function jobCard(j, opts = {}) {
    const isSaved = saved.has(j.id);
    return `<article class="job reveal" data-id="${esc(j.id)}" tabindex="${opts.static ? -1 : 0}" aria-label="${esc(j.title)} at ${esc(j.company)}">
      ${opts.static ? '' : `<button class="save" type="button" aria-pressed="${isSaved}" aria-label="${isSaved ? 'Remove from' : 'Save to'} saved jobs: ${esc(j.title)}">${icons.heart}</button>`}
      <div class="job-top">${avatar(j)}<div><h3>${esc(j.title)}</h3><p class="company">${esc(j.company)}</p></div></div>
      <p class="summary">${esc(j.summary)}</p>
      <div class="job-meta"><span class="tag type">${esc(j.type)}</span><span class="tag">${esc(j.level)}</span>${j.mine ? '<span class="tag mine">Posted by you</span>' : ''}${j.tags.slice(0, 2).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="job-foot"><span class="salary">${esc(salary(j))}</span><span class="posted">${ago(j.days)}</span></div>
    </article>`;
  }

  // One delegated handler opens details and toggles saves for every list on every page.
  function bindCards(container, onSaveChange) {
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.job');
      if (!card || card.tabIndex < 0) return;
      const id = card.dataset.id;
      if (e.target.closest('.save')) {
        saved.has(id) ? saved.delete(id) : saved.add(id);
        persistSaved();
        const on = saved.has(id), btn = card.querySelector('.save');
        btn.setAttribute('aria-pressed', String(on));
        toast(on ? 'Saved to your list' : 'Removed from your list');
        onSaveChange && onSaveChange();
        return;
      }
      openJob(allJobs().find((j) => j.id === id));
    });
    container.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('job')) { e.preventDefault(); e.target.click(); }
    });
  }

  /* ---------- dialogs ---------- */
  function makeDialog(html) {
    const d = document.createElement('dialog');
    d.innerHTML = `<div class="dialog-body">${html}</div>`;
    document.body.append(d);
    d.addEventListener('close', () => { d.remove(); document.documentElement.style.overflow = ''; });
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
    d.showModal();
    document.documentElement.style.overflow = 'hidden';
    return d;
  }
  const closeBtn = `<button class="icon-btn dialog-close" type="button" data-close aria-label="Close">${icons.close}</button>`;

  function openJob(j) {
    if (!j) return;
    const list = (t, a) => (a && a.length ? `<h4>${t}</h4><ul>${a.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : '');
    const applied = store.get('jobless:applied', []).includes(j.id);
    const d = makeDialog(`${closeBtn}
      <div class="dialog dialog-view">
        <div class="dialog-head">${avatar(j)}<div><h2>${esc(j.title)}</h2><p style="color:var(--muted)">${esc(j.company)} · Remote${j.location ? ' · ' + esc(j.location) : ''}</p></div></div>
        <div class="job-meta"><span class="tag type">${esc(j.type)}</span><span class="tag">${esc(j.level)}</span><span class="tag">${esc(j.category)}</span>${j.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <p style="margin-top:16px"><b>${esc(salary(j))}</b> <span class="posted">· ${ago(j.days)}</span></p>
        <h4>About the role</h4><p>${esc(j.about)}</p>
        ${list('What you will do', j.todo)}${list('What we are looking for', j.need)}
        <div class="actions">
          ${safeUrl(j.url)
            ? `<a class="btn btn-primary" href="${esc(j.url)}" target="_blank" rel="noopener noreferrer">Apply on ${esc(j.source || 'the source site')} ↗</a>`
            : `<button class="btn btn-primary" type="button" data-apply${applied ? ' disabled' : ''}>${applied ? 'Applied ✓' : 'Apply now'}</button>`}
          <button class="btn btn-ghost" type="button" data-share>Copy link</button>
        </div>
        ${safeUrl(j.url) ? `<p class="posted" style="margin-top:16px">Source: <a href="${esc(j.url)}" target="_blank" rel="noopener noreferrer">${esc(j.source || 'original posting')}</a>. See the full description and apply there.</p>` : ''}
      </div>`);
    d.querySelector('[data-close]').addEventListener('click', () => d.close());
    d.querySelector('[data-share]').addEventListener('click', async () => {
      const url = `${location.origin}${location.pathname.replace(/[^/]*$/, '')}discover.html?job=${encodeURIComponent(j.id)}`;
      try { await navigator.clipboard.writeText(url); toast('Link copied'); } catch { toast(url); }
    });
    const applyBtn = d.querySelector('[data-apply]');
    if (applyBtn) applyBtn.addEventListener('click', () => {
      const view = d.querySelector('.dialog-view');
      view.innerHTML = `<div class="dialog-head">${avatar(j)}<div><h2>Apply to ${esc(j.company)}</h2><p style="color:var(--muted)">${esc(j.title)}</p></div></div>
        <form class="form" novalidate>
          <div class="group"><label for="a-name">Full name</label><input class="input" id="a-name" name="name" autocomplete="name"><p class="error" data-err="name"></p></div>
          <div class="group"><label for="a-email">Email</label><input class="input" id="a-email" name="email" type="email" autocomplete="email"><p class="error" data-err="email"></p></div>
          <div class="group"><label for="a-note">Short note (optional)</label><textarea class="textarea" id="a-note" name="note" style="min-height:90px"></textarea></div>
          <div class="actions" style="margin-top:0"><button class="btn btn-primary" type="submit">Send application</button><button class="btn btn-ghost" type="button" data-cancel>Cancel</button></div>
        </form>`;
      const f = view.querySelector('form');
      view.querySelector('[data-cancel]').addEventListener('click', () => d.close());
      f.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validate(f, { name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'), email: (v) => (emailOk(v) ? '' : 'Enter a valid email address.') })) return;
        store.set('jobless:applied', [...new Set([...store.get('jobless:applied', []), j.id])]);
        toast(`Application sent to ${j.company} (demo)`);
        d.close();
      });
      f.elements.name.focus();
    });
  }

  function openSignup() {
    const d = makeDialog(`${closeBtn}
      <div class="dialog">
        <h2>Create your free account</h2>
        <p style="color:var(--muted);margin-top:6px">Save jobs, get alerts and apply faster. This is a demo, so nothing is stored.</p>
        <form class="form" novalidate style="margin-top:18px">
          <div class="group"><label for="s-email">Email</label><input class="input" id="s-email" name="email" type="email" autocomplete="email"><p class="error" data-err="email"></p></div>
          <div class="group"><label for="s-pass">Password</label><input class="input" id="s-pass" name="pass" type="password" autocomplete="new-password"><p class="error" data-err="pass"></p></div>
          <button class="btn btn-primary" type="submit">Sign up</button>
        </form>
      </div>`);
    d.querySelector('[data-close]').addEventListener('click', () => d.close());
    const f = d.querySelector('form');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(f, { email: (v) => (emailOk(v) ? '' : 'Enter a valid email address.'), pass: (v) => (v.length >= 8 ? '' : 'Use at least 8 characters.') })) return;
      toast('Welcome to Jobless! (demo)');
      d.close();
    });
    f.elements.email.focus();
  }

  /* ---------- validation ---------- */
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  function validate(form, rules) {
    let first = null;
    for (const [name, rule] of Object.entries(rules)) {
      const field = form.elements[name];
      const msg = rule(field.value, form);
      const out = form.querySelector(`[data-err="${name}"]`);
      if (out) out.textContent = msg;
      field.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (msg && !first) first = field;
    }
    if (first) first.focus();
    return !first;
  }
  function liveValidate(form, rules) {
    form.addEventListener('input', (e) => {
      const name = e.target.name, rule = rules[name];
      if (!rule || e.target.getAttribute('aria-invalid') !== 'true') return;
      const msg = rule(e.target.value, form);
      const out = form.querySelector(`[data-err="${name}"]`);
      if (out) out.textContent = msg;
      e.target.setAttribute('aria-invalid', msg ? 'true' : 'false');
    });
  }

  /* ---------- pages ---------- */
  function initHome() {
    const jobs = baseJobs();
    const feat = $('#featured');
    feat.innerHTML = [...jobs].sort((a, b) => a.days - b.days).slice(0, 3).map((j) => jobCard(j)).join('');
    bindCards(feat);
    renderSource($('#source'));
    const withJobs = categories.filter((c) => jobs.some((j) => j.category === c));
    const fresh = jobs.filter((j) => j.days <= 7).length;
    const names = [...new Set(jobs.map((j) => j.company))];
    $('#eyebrow').textContent = fresh ? `${fresh} new remote ${fresh === 1 ? 'role' : 'roles'} this week` : 'Fresh remote roles, updated every few hours';
    [['#st-jobs', jobs.length], ['#st-companies', names.length], ['#st-cats', withJobs.length], ['#st-new', fresh]].forEach(([s, n]) => { $(s).dataset.count = n; });
    // Popular searches: terms that appear in at least two listings, from tags and title words.
    const stop = new Set(['remote', 'the', 'and', 'for', 'with', 'full', 'stack', 'fullstack', 'united', 'states', 'part', 'time']);
    const freq = {};
    jobs.forEach((j) => {
      const terms = new Set([...j.tags, ...j.title.split(/[^A-Za-z0-9+#.]+/)].map((w) => w.toLowerCase()).filter((w) => w.length >= 3 && w.length <= 14 && !stop.has(w)));
      terms.forEach((k) => { freq[k] = (freq[k] || 0) + 1; });
    });
    const top = Object.entries(freq).filter(([, n]) => n >= 2).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);
    if (top.length >= 2) $('#popular').innerHTML = '<span>Popular:</span>' + top.map((k) => `<a class="chip" href="discover.html?q=${encodeURIComponent(k)}">${esc(k)}</a>`).join('');
    $('#cats').innerHTML = withJobs.map((c) => {
      const n = jobs.filter((j) => j.category === c).length;
      return `<a class="cat reveal" href="discover.html?category=${encodeURIComponent(c)}"><span class="ico" aria-hidden="true">${catIcon[c]}</span><div><b>${c}</b><span>${n} open ${n === 1 ? 'role' : 'roles'}</span></div></a>`;
    }).join('');
    $('#marquee').innerHTML = [...names.slice(0, 14), ...names.slice(0, 14)].map((n) => `<span>${esc(n)}</span>`).join('');
    $('#cat-select').innerHTML = '<option value="">All categories</option>' + withJobs.map((c) => `<option>${c}</option>`).join('');
    $('#hero-search').addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#hero-q').value.trim(), c = $('#cat-select').value;
      const p = new URLSearchParams();
      if (q) p.set('q', q);
      if (c) p.set('category', c);
      location.href = 'discover.html' + (p.toString() ? `?${p}` : '');
    });
    counters();
  }

  function initDiscover() {
    const params = new URLSearchParams(location.search);
    const state = { q: params.get('q') || '', cat: categories.includes(params.get('category')) ? params.get('category') : '', type: '', level: '', min: 0, savedOnly: false, sort: 'new' };
    const grid = $('#grid'), count = $('#count'), empty = $('#empty');
    $('#q').value = state.q;
    renderSource($('#source'));
    const chipCats = categories.filter((c) => allJobs().some((j) => j.category === c));
    $('#chips').innerHTML = ['All', ...chipCats].map((c) => `<button class="chip" type="button" data-cat="${c === 'All' ? '' : c}" aria-pressed="${(c === 'All' ? '' : c) === state.cat}">${c}</button>`).join('');

    function matches(j) {
      if (state.cat && j.category !== state.cat) return false;
      if (state.type && j.type !== state.type) return false;
      if (state.level && j.level !== state.level) return false;
      if (state.min && (j.max || j.min || 0) < state.min) return false;
      if (state.savedOnly && !saved.has(j.id)) return false;
      if (state.q) {
        const hay = [j.title, j.company, j.summary, j.category, ...j.tags].join(' ').toLowerCase();
        return state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
      }
      return true;
    }
    function render() {
      const list = allJobs().filter(matches).sort((a, b) => state.sort === 'pay' ? (b.max || 0) - (a.max || 0) : a.days - b.days);
      grid.innerHTML = list.map((j) => jobCard(j)).join('');
      reveal(grid);
      count.innerHTML = `<b>${list.length}</b> ${list.length === 1 ? 'job' : 'jobs'} found`;
      empty.hidden = list.length > 0;
      grid.hidden = list.length === 0;
      $('#clear').hidden = !(state.q || state.cat || state.type || state.level || state.min || state.savedOnly);
      const p = new URLSearchParams();
      if (state.q) p.set('q', state.q);
      if (state.cat) p.set('category', state.cat);
      history.replaceState(null, '', location.pathname + (p.toString() ? `?${p}` : ''));
    }
    let timer;
    $('#q').addEventListener('input', (e) => { clearTimeout(timer); timer = setTimeout(() => { state.q = e.target.value.trim(); render(); }, 120); });
    $('#chips').addEventListener('click', (e) => {
      const b = e.target.closest('.chip'); if (!b) return;
      state.cat = b.dataset.cat;
      $$('#chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
      render();
    });
    $('#type').addEventListener('change', (e) => { state.type = e.target.value; render(); });
    $('#level').addEventListener('change', (e) => { state.level = e.target.value; render(); });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    $('#min').addEventListener('input', (e) => { state.min = +e.target.value; $('#min-out').textContent = state.min ? `${money(state.min)}+` : 'Any'; $('#min-hint').hidden = !state.min; render(); });
    $('#saved-only').addEventListener('change', (e) => { state.savedOnly = e.target.checked; render(); });
    const reset = () => {
      Object.assign(state, { q: '', cat: '', type: '', level: '', min: 0, savedOnly: false, sort: 'new' });
      $('#q').value = ''; $('#type').value = ''; $('#level').value = ''; $('#sort').value = 'new'; $('#min').value = 0; $('#min-out').textContent = 'Any'; $('#min-hint').hidden = true; $('#saved-only').checked = false;
      $$('#chips .chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.cat === '')));
      render();
    };
    $('#clear').addEventListener('click', reset);
    $('#empty-clear').addEventListener('click', reset);
    bindCards(grid, () => { if (state.savedOnly) render(); });
    render();
    const deep = params.get('job');
    if (deep) openJob(allJobs().find((j) => j.id === deep));
  }

  function initPost() {
    const form = $('#post-form'), prev = $('#preview');
    $('#category').innerHTML = categories.map((c) => `<option>${c}</option>`).join('');
    const rules = {
      title: (v) => (v.trim().length >= 3 ? '' : 'Enter a job title (at least 3 characters).'),
      company: (v) => (v.trim().length >= 2 ? '' : 'Enter the company name.'),
      description: (v) => (v.trim().length >= 30 ? '' : 'Describe the role in at least 30 characters.'),
      max: (v, f) => (!v || !f.min.value || +v >= +f.min.value ? '' : 'Maximum must be at least the minimum.')
    };
    const read = () => {
      const f = form.elements;
      const desc = f.description.value.trim();
      return {
        id: 'u' + Date.now(), mine: true, days: 0,
        title: f.title.value.trim() || 'Your job title', company: f.company.value.trim() || 'Your company', logo: null,
        category: f.category.value, type: f.type.value, level: f.level.value,
        min: +f.min.value || 0, max: +f.max.value || 0,
        tags: f.tags.value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 6),
        summary: desc ? (desc.length > 130 ? desc.slice(0, 127) + '…' : desc) : 'A short summary of the role will appear here as you type.',
        about: desc, todo: [], need: []
      };
    };
    const draw = () => { prev.innerHTML = jobCard({ ...read(), mine: false }, { static: true }).replace('reveal', 'reveal in'); };
    form.addEventListener('input', draw);
    form.addEventListener('change', draw);
    liveValidate(form, rules);
    const counter = $('#desc-count');
    form.elements.description.addEventListener('input', (e) => { counter.textContent = `${e.target.value.length} characters`; });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form, rules)) return;
      const job = read();
      store.set('jobless:posted', [job, ...posted()].slice(0, 20));
      $('#post-wrap').innerHTML = `<div class="card success"><div class="check" aria-hidden="true">✓</div><h2>Your job is live</h2><p><b>${esc(job.title)}</b> at ${esc(job.company)} now appears on Discover. It is saved in this browser only.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="discover.html">See it on Discover</a><a class="btn btn-ghost" href="post-job.html">Post another</a></div></div>`;
      toast('Job posted');
      scrollTo({ top: 0, behavior: 'smooth' });
    });
    draw();
  }

  function initContact() {
    const form = $('#contact-form');
    const rules = {
      name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
      email: (v) => (emailOk(v) ? '' : 'Enter a valid email address.'),
      message: (v) => (v.trim().length >= 10 ? '' : 'Tell us a bit more (at least 10 characters).')
    };
    liveValidate(form, rules);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form, rules)) return;
      const first = esc(form.elements.name.value.trim().split(/\s+/)[0]);
      $('#contact-card').innerHTML = `<div class="success"><div class="check" aria-hidden="true">✓</div><h2>Thanks, ${first}!</h2><p>Your message is on its way. We usually reply within one business day. This is a demo, so nothing was actually sent.</p><a class="btn btn-ghost" href="contact.html">Send another</a></div>`;
      toast('Message sent (demo)');
    });
  }

  /* ---------- boot ---------- */
  const savedTheme = store.get('jobless:theme', null);
  if (savedTheme) root.dataset.theme = savedTheme;
  mountLayout();
  const init = { home: initHome, discover: initDiscover, post: initPost, contact: initContact }[page];
  if (page === 'home' || page === 'discover') {
    const target = $(page === 'home' ? '#featured' : '#grid');
    if (target) target.innerHTML = skeleton(page === 'home' ? 3 : 6);
    loadFeed().then(() => { init(); reveal(); });
  } else {
    if (init) init();
    reveal();
  }
})();
