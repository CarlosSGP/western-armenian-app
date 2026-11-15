// ---------- helpers ----------
const $ = (s, e = document) => e.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const k in attrs) {
    const v = attrs[k];
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) { if (c == null || c === false) continue; e.append(c.nodeType ? c : document.createTextNode(c)); }
  return e;
};
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const day = off => { const d = new Date(); d.setDate(d.getDate() + off); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const norm = s => s.toLowerCase().replace(/[։,՝՞՛՜'’՚.?!\-]/g, '').replace(/և/g, 'եւ').replace(/\s+/g, ' ').trim();
const nEn = s => s.toLowerCase().replace(/\bshe\b/g, 'he').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
const tokHy = s => s.replace(/[։,]/g, '').trim().split(/\s+/);
const tokEn = s => s.replace(/[.,?!]/g, '').trim().split(/\s+/);
const PROPER_EN = /^(I|Armenian|Armenia|America|Lebanon|English|Aram|God|Christ|Christmas|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/;
const PROPER_HY = /^(Հայաստան|Ամերիկա|Լիբանան|Արամ|Աստուած|Քրիստոս|Նոր|Սուրբ|Զատիկ)/;

// ---------- data index ----------
const LESSONS = UNITS.flatMap(u => u.lessons);
const ITEMS = {}, ALLW = [], ALLS = [];
LESSONS.forEach(l => {
  (l.words || []).forEach(w => { w.kind = 'w'; if (!ITEMS[w.hy]) ITEMS[w.hy] = w; ALLW.push(w); });
  (l.sentences || []).forEach(s => { s.kind = 's'; ITEMS[s.hy] = s; ALLS.push(s); });
});
const keysOf = l => l.letters ? l.letters.map(i => 'L:' + i) : [...l.words, ...l.sentences].map(x => x.hy);

// ---------- state ----------
const KEY = 'parev.v1';
const def = () => ({ done: {}, srs: {}, streak: { last: '', n: 0 }, set: { tr: true, unlock: false, shim: true } });
let S = (() => { try { const d = def(), s = JSON.parse(localStorage.getItem(KEY) || '{}'); return Object.assign(d, s, { set: Object.assign(d.set, s.set || {}) }); } catch (e) { return def(); } })();
const save = () => { S.t = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); if (localStorage.getItem('parev.gh')) localStorage.setItem('parev.dirty', '1'); } catch (e) {} };
const IV = [0, 1, 2, 4, 8, 16, 32, 64];
function grade(k, ok) { const r = S.srs[k] || { b: 0, due: 0 }; r.b = ok ? Math.min(r.b + 1, 7) : 0; r.due = Date.now() + (ok ? IV[r.b] : 0) * 864e5; S.srs[k] = r; }
const valid = k => k.startsWith('L:') ? !!ALPHABET[+k.slice(2)] : !!ITEMS[k];
const dueKeys = () => { const n = Date.now(); return Object.keys(S.srs).filter(k => valid(k) && S.srs[k].due <= n); };
const streak = () => (S.streak.last === day(0) || S.streak.last === day(-1)) ? S.streak.n : 0;
function bumpStreak() { if (S.streak.last === day(0)) return; S.streak.n = S.streak.last === day(-1) ? S.streak.n + 1 : 1; S.streak.last = day(0); }

// ---------- GitHub sync (optional) ----------
const GH = () => { try { return JSON.parse(localStorage.getItem('parev.gh') || 'null'); } catch (e) { return null; } };
let ghMsg = '';
const b64e = t => btoa(unescape(encodeURIComponent(t))), b64d = t => decodeURIComponent(escape(atob(t.replace(/\s/g, ''))));
async function ghApi(method, body) {
  const g = GH();
  return fetch(`https://api.github.com/repos/${g.repo}/contents/${g.path || 'progress.json'}`, { method, cache: 'no-store', headers: { Authorization: 'Bearer ' + g.token, Accept: 'application/vnd.github+json' }, body: body ? JSON.stringify(body) : undefined });
}
async function ghPull() {
  const r = await ghApi('GET');
  if (r.status === 404) return null;
  if (r.status === 401) throw new Error('GitHub rejected the token. It may be mistyped or expired.');
  if (!r.ok) throw new Error('GitHub answered ' + r.status);
  const j = await r.json();
  return { sha: j.sha, data: JSON.parse(b64d(j.content)) };
}
// The private repository is the source of truth. This device only keeps a working copy, plus a
// "dirty" mark when it holds progress that has not reached GitHub yet (for example after studying offline).
const dirty = () => { try { return localStorage.getItem('parev.dirty') === '1'; } catch (e) { return false; } };
const setDirty = on => { try { on ? localStorage.setItem('parev.dirty', '1') : localStorage.removeItem('parev.dirty'); } catch (e) {} };
const clock = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
async function ghSync() {
  if (!GH()) return;
  try {
    const cur = await ghPull();
    const remote = cur && cur.data && cur.data.done ? cur.data : null;
    if (remote && !(dirty() && (S.t || 0) > (remote.t || 0))) {
      S = Object.assign(def(), remote, { set: Object.assign(def().set, remote.set || {}) });
      try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
      setDirty(false); ghMsg = 'Progress loaded from your GitHub repository at ' + clock();
    } else {
      if (!S.t) S.t = Date.now();
      const r = await ghApi('PUT', { message: 'Update Parev progress', content: b64e(JSON.stringify(S, null, 1)), sha: cur ? cur.sha : undefined });
      if (!r.ok) throw new Error(r.status === 404 ? 'GitHub cannot find "' + GH().repo + '" with this token. Check the name is exactly username/repository, and that the token\'s "Repository access" includes that repository.'
        : r.status === 403 ? 'the token can see the repository but may not write to it. Set its Contents permission to "Read and write".'
        : r.status === 401 ? 'GitHub rejected the token. It may be mistyped or expired.' : 'GitHub answered ' + r.status);
      setDirty(false); ghMsg = 'Progress saved to your GitHub repository at ' + clock();
    }
  } catch (e) { ghMsg = 'Not synced: ' + e.message + (dirty() ? ' Your latest progress is kept on this device and will upload on the next successful sync.' : ''); }
}

// ---------- speech ----------
let VOICE = null;
const hasTTS = typeof speechSynthesis !== 'undefined';
function findVoice() { try { VOICE = speechSynthesis.getVoices().find(v => /^hy/i.test(v.lang)) || null; } catch (e) { VOICE = null; } }
if (hasTTS) { findVoice(); speechSynthesis.onvoiceschanged = findVoice; }
// Armenian voices on computers are Eastern Armenian. This respells Western text so an Eastern voice
// produces (approximately) Western sounds: classical spelling rules first, then the consonant shift.
function toEastern(s) {
  s = s.toLowerCase().replace(/[՞՛՜'՚]/g, '');
  s = s.split(/(\s+)/).map(w => {
    if (!w.trim()) return w;
    w = w.replace(/^յ/, 'հ');
    if (!/^(հայ|վայ|այ|խոյ|նոյ)[։,]?$/.test(w)) w = w.replace(/([աո])յ([։,]?)$/, '$1$2');
    return w;
  }).join('');
  s = s.replace(/ու/g, '\u0001').replace(/իւ/g, 'յ\u0001').replace(/եա/g, 'յա').replace(/եօ/g, 'յո').replace(/ոյ/g, '\u0001յ').replace(/ւ/g, 'վ').replace(/\u0001/g, 'ու');
  const m = { բ: 'փ', պ: 'բ', գ: 'ք', կ: 'գ', դ: 'թ', տ: 'դ', ձ: 'ց', ծ: 'ձ', ջ: 'չ', ճ: 'ջ' };
  return s.replace(/[բպգկդտձծջճ]/g, c => m[c]);
}
function tts(hy) {
  if (!VOICE) return;
  const u = new SpeechSynthesisUtterance(S.set.shim ? toEastern(hy) : hy);
  u.voice = VOICE; u.lang = VOICE.lang; u.rate = 0.8;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
const spk = hy => hy && canHear(hy) ? h('button', { class: 'spk', title: 'Listen', onclick: e => { e.stopPropagation(); say(hy); } }, '🔊') : null;
// ---------- recorded audio ----------
// Clips come from two places: recordings made in this browser (IndexedDB) and files published in audio/ next to the page.
const clipId = hy => { let x = 2166136261; for (const c of norm(hy)) { x ^= c.codePointAt(0); x = Math.imul(x, 16777619) >>> 0; } return x.toString(16).padStart(8, '0'); };
let MANIFEST = {}, idb = null;
const LOCAL = new Set();
const idbReq = (mode, fn) => new Promise(res => { if (!idb) return res(null); try { const t = idb.transaction('clips', mode), q = fn(t.objectStore('clips')); t.oncomplete = () => res(q ? q.result : null); t.onerror = t.onabort = () => res(null); } catch (e) { res(null); } });
async function audioInit() {
  await new Promise(res => { try { const r = indexedDB.open('parev-audio', 1); r.onupgradeneeded = () => r.result.createObjectStore('clips'); r.onsuccess = () => { idb = r.result; res(); }; r.onerror = () => res(); } catch (e) { res(); } });
  ((await idbReq('readonly', st => st.getAllKeys())) || []).forEach(k => LOCAL.add(k));
  if (location.protocol !== 'file:') { try { const r = await fetch('audio/manifest.json', { cache: 'no-cache' }); if (r.ok) MANIFEST = await r.json(); } catch (e) {} }
}
const hasClip = hy => { const id = clipId(hy); return LOCAL.has(id) || !!MANIFEST[id]; };
const canHear = hy => hasClip(hy) || !!VOICE;
async function say(hy) {
  const id = clipId(hy);
  try {
    if (LOCAL.has(id)) { const b = await idbReq('readonly', st => st.get(id)); if (b) { await new Audio(URL.createObjectURL(b)).play(); return; } }
    if (MANIFEST[id]) { await new Audio('audio/' + MANIFEST[id]).play(); return; }
  } catch (e) {}
  tts(hy);
}
const trEl = (tr, always) => (always || S.set.tr) && tr ? h('div', { class: 'tr' }, tr) : null;

// ---------- exercise builders ----------
let POOL = ALLW;
function distract(item, f) {
  const seen = new Set([f(item)]), out = [];
  for (const src of [POOL, ALLW]) for (const w of shuffle(src.slice())) {
    if (out.length === 3) break;
    const v = f(w); if (seen.has(v)) continue; seen.add(v); out.push(w);
  }
  return out;
}
function mcW(item, dir) {
  const opts = shuffle([item, ...distract(item, w => dir === 'he' ? w.en : w.hy)]);
  return dir === 'he'
    ? { t: 'mc', key: item.hy, item, q: 'What does this mean?', big: item.hy, bigTr: item.tr, opts: opts.map(o => ({ label: o.en })), ans: opts.indexOf(item) }
    : { t: 'mc', key: item.hy, item, q: 'How do you say this?', text: item.en, opts: opts.map(o => ({ label: o.hy, sub: o.tr, hy: true })), ans: opts.indexOf(item) };
}
function mcListen(item) {
  const opts = shuffle([item, ...distract(item, w => w.en)]);
  return { t: 'mc', key: item.hy, item, q: 'Listen. What does it mean?', hear: item.hy, opts: opts.map(o => ({ label: o.en })), ans: opts.indexOf(item) };
}
function build(item, dir) {
  let tok = dir === 'he' ? tokEn(item.en) : tokHy(item.hy);
  if (dir === 'he' && !PROPER_EN.test(tok[0])) tok[0] = tok[0].toLowerCase();
  if (dir === 'eh' && !PROPER_HY.test(tok[0])) tok[0] = tok[0].toLowerCase();
  const low = tok.map(t => t.toLowerCase());
  const pron = low.includes('he') || low.includes('she');
  const others = shuffle(ALLS.filter(s => s !== item).flatMap(s => (dir === 'he' ? tokEn(s.en) : tokHy(s.hy)).slice(1)))
    .filter(t => !low.includes(t.toLowerCase()) && !(pron && /^(he|she)$/i.test(t)));
  return { t: 'build', key: item.hy, item, dir, tok, bank: shuffle([...tok, ...[...new Set(others)].slice(0, 3)]) };
}
const stoks = s => s.split(' · ');
function letterDistract(i) {
  const L = ALPHABET[i], ds = [];
  for (const j of shuffle(ALPHABET.map((_, j) => j))) {
    if (j === i || stoks(ALPHABET[j][3]).some(t => stoks(L[3]).includes(t))) continue;
    if (ds.some(d => stoks(ALPHABET[d][3]).some(t => stoks(ALPHABET[j][3]).includes(t)))) continue;
    ds.push(j); if (ds.length === 3) break;
  }
  return ds;
}
const glyph = L => L[0] + ' ' + L[1];
function mcL(i, dir) {
  const L = ALPHABET[i], opts = shuffle([i, ...letterDistract(i)]);
  return dir === 'ls'
    ? { t: 'mc', key: 'L:' + i, Li: i, q: 'What sound does this make?', big: glyph(L), opts: opts.map(j => ({ label: ALPHABET[j][3], sub: ALPHABET[j][4] })), ans: opts.indexOf(i) }
    : { t: 'mc', key: 'L:' + i, Li: i, q: 'Which one makes this sound?', text: `“${L[3]}” — ${L[4]}` + (L[2] ? ` (the letter “${L[2]}”)` : ''), opts: opts.map(j => ({ label: glyph(ALPHABET[j]), hy: true })), ans: opts.indexOf(i) };
}
function mcLhear(i) {
  const L = ALPHABET[i], opts = shuffle([i, ...letterDistract(i)]);
  return { t: 'mc', key: 'L:' + i, Li: i, q: 'Listen. Which letter is it?', hear: L[1], opts: opts.map(j => ({ label: glyph(ALPHABET[j]), hy: true })), ans: opts.indexOf(i) };
}
function mcRead(i) {
  const L = ALPHABET[i], seen = new Set([L[6]]), ds = [];
  for (const j of shuffle(ALPHABET.map((_, j) => j))) { if (seen.has(ALPHABET[j][6])) continue; seen.add(ALPHABET[j][6]); ds.push(ALPHABET[j][6]); if (ds.length === 3) break; }
  const opts = shuffle([L[6], ...ds]);
  return { t: 'mc', Li: i, q: 'How is this word read?', big: L[5], speak: L[5], opts: opts.map(o => ({ label: o })), ans: opts.indexOf(L[6]), note: `${L[5]} · ${L[6]} · ${L[7]}` };
}
function matchOf(pairs) { const seen = new Set(), out = []; for (const p of pairs) { if (seen.has(p[1])) continue; seen.add(p[1]); out.push(p); } return out.length > 1 ? { t: 'match', pairs: out } : null; }

function buildLesson(l) {
  const q = [];
  if (l.tip) q.push({ t: 'tip', title: l.title, html: l.tip, alpha: !!l.letters });
  if (l.letters) {
    for (let c = 0; c < l.letters.length; c += 3) {
      const ch = l.letters.slice(c, c + 3);
      ch.forEach(i => q.push({ t: 'lintro', Li: i }, { t: 'trace', Li: i }));
      shuffle(ch.slice()).forEach(i => q.push(mcL(i, 'ls')));
      shuffle(ch.slice()).forEach(i => q.push(mcL(i, 'sl')));
      shuffle(ch.filter(i => hasClip(ALPHABET[i][1]))).forEach(i => q.push(mcLhear(i)));
    }
    const m = []; l.letters.forEach(i => { if (!m.some(j => stoks(ALPHABET[j][3]).some(t => stoks(ALPHABET[i][3]).includes(t)))) m.push(i); });
    q.push(matchOf(m.slice(0, 5).map(i => [glyph(ALPHABET[i]), ALPHABET[i][3]])));
    shuffle(l.letters.slice()).slice(0, 4).forEach(i => q.push(mcRead(i)));
  } else {
    const W = l.words, X = l.sentences;
    for (let c = 0; c < W.length; c += 4) {
      const ch = W.slice(c, c + 4);
      ch.forEach(w => q.push({ t: 'intro', item: w }));
      shuffle(ch.slice()).forEach(w => q.push(mcW(w, 'he')));
      q.push(matchOf(ch.map(w => [w.hy, w.en])));
    }
    shuffle(W.slice()).slice(0, 3).forEach(w => q.push(mcW(w, 'eh')));
    const tw = shuffle(W.slice())[0]; q.push({ t: 'type', key: tw.hy, item: tw });
    const hw = shuffle(W.filter(w => canHear(w.hy)));
    hw.slice(0, 3).forEach(w => q.push(mcListen(w)));
    if (hw[3]) q.push({ t: 'type', key: hw[3].hy, item: hw[3], hear: true });
    X.forEach(s => q.push(build(s, 'he')));
    const sh = shuffle(X.slice());
    sh.slice(0, 3).forEach(s => q.push(build(s, 'eh')));
    const short = sh.find(s => tokHy(s.hy).length <= 3); if (short) q.push({ t: 'type', key: short.hy, item: short });
    q.push({ t: 'speak', key: sh[0].hy, item: sh[0] });
  }
  return q.filter(Boolean);
}
function revEx(k) {
  if (k.startsWith('L:')) { const i = +k.slice(2); return hasClip(ALPHABET[i][1]) && Math.random() < .34 ? mcLhear(i) : mcL(i, Math.random() < .5 ? 'ls' : 'sl'); }
  const it = ITEMS[k], r = Math.random();
  if (canHear(k) && Math.random() < .25) return it.kind === 'w' && Math.random() < .5 ? { t: 'type', key: k, item: it, hear: true } : mcListen(it);
  if (it.kind === 'w') return r < .35 ? mcW(it, 'he') : r < .65 ? mcW(it, 'eh') : r < .9 ? { t: 'type', key: k, item: it } : { t: 'speak', key: k, item: it };
  return r < .4 ? build(it, 'he') : r < .85 ? build(it, 'eh') : { t: 'speak', key: k, item: it };
}

// ---------- session ----------
let sess = null;
function startSession(q, meta) { sess = { q, i: 0, total: q.length, done: 0, att: 0, ok: 0, wrong: new Set(), graded: new Set(), meta }; keep(); renderEx(); }
// The lesson in progress is stored with the rest of the progress after every step, so leaving never loses it.
function keep() {
  if (sess) S.sess = { q: sess.q, i: sess.i, total: sess.total, done: sess.done, att: sess.att, ok: sess.ok, wrong: [...sess.wrong], graded: [...sess.graded], lesson: sess.meta.lesson ? sess.meta.lesson.id : null };
  save();
}
function resume() {
  const p = S.sess, l = p && p.lesson ? LESSONS.find(x => x.id === p.lesson) : null;
  if (!p || !Array.isArray(p.q) || !p.q.length || (p.lesson && !l)) { delete S.sess; return false; }
  POOL = ALLW;
  sess = { q: p.q, i: Math.max(0, Math.min(p.i, p.q.length - 1)), total: p.total, done: p.done, att: p.att, ok: p.ok, wrong: new Set(p.wrong), graded: new Set(p.graded), meta: l ? { lesson: l } : { review: true } };
  renderEx(); return true;
}
function leave() { keep(); ghSync(); sess = null; home(); }
function startLesson(l) {
  if (S.sess && S.sess.lesson === l.id && resume()) return;
  const idx = LESSONS.indexOf(l);
  const known = LESSONS.slice(0, idx + 1).flatMap(x => x.words || []);
  POOL = known.length > 6 ? known : ALLW;
  startSession(buildLesson(l), { lesson: l });
}
function startReview(force) {
  if (S.sess && !S.sess.lesson && resume()) return;
  let keys = shuffle(dueKeys()).slice(0, 15);
  if (!keys.length && force) keys = shuffle(Object.keys(S.srs).filter(valid)).slice(0, 12);
  if (!keys.length) return;
  const known = LESSONS.filter(l => S.done[l.id]).flatMap(x => x.words || []);
  POOL = known.length > 6 ? known : ALLW;
  startSession(keys.map(revEx), { review: true });
}
function record(ex, ok) {
  sess.att++; if (ok) sess.ok++;
  if (!ex.key) return;
  if (!ok) sess.wrong.add(ex.key);
  if (sess.graded.has(ex.key)) return;
  sess.graded.add(ex.key);
  if (sess.meta.review) { grade(ex.key, ok); save(); }
}
function next(ex, ok) {
  if (ok) sess.done++; else sess.q.push(ex);
  sess.i++;
  if (sess.i >= sess.q.length) return complete();
  keep(); if (sess.i % 8 === 0) ghSync();
  renderEx();
}
function complete() {
  const l = sess.meta.lesson;
  delete S.sess;
  if (l) {
    S.done[l.id] = 1;
    keysOf(l).forEach(k => { if (sess.wrong.has(k)) S.srs[k] = { b: 0, due: Date.now() }; else if (!S.srs[k]) S.srs[k] = { b: 1, due: Date.now() + 864e5 }; });
  }
  bumpStreak(); save(); ghSync();
  const pct = sess.att ? Math.round(100 * sess.ok / sess.att) : 100, app = $('#app');
  app.innerHTML = '';
  app.append(h('div', { class: 'center' },
    h('p', { class: 'big xl' }, 'Ապրի՛ս'),
    h('p', { class: 'tr' }, 'abris — well done'),
    h('h1', {}, l ? `“${l.title}” complete` : 'Review complete'),
    h('p', { class: 'note' }, `${pct}% correct on first tries · ${streak()}-day streak` + (sess.wrong.size ? ` · ${sess.wrong.size} item${sess.wrong.size > 1 ? 's' : ''} queued for review` : '')),
    h('p', {}, h('button', { class: 'btn primary', id: 'go', onclick: () => { sess = null; home(); } }, 'Continue'))));
}

function ansLine(ex) {
  if (ex.note) return h('span', { class: 'hy' }, ex.note);
  if (ex.item) return h('span', {}, h('span', { class: 'hy' }, ex.item.hy), ` · ${ex.item.tr} · ${ex.item.en}`);
  if (ex.Li != null) { const L = ALPHABET[ex.Li]; return h('span', {}, h('span', { class: 'hy' }, glyph(L)), ` · ${L[3]} · ${L[4]}`); }
  return null;
}

function renderEx() {
  const ex = sess.q[sess.i], app = $('#app');
  app.innerHTML = '';
  let answered = false;
  const body = h('div', { class: 'ex' });
  const fb = h('div', { class: 'fb' });
  const go = h('button', { class: 'btn primary', id: 'go' }, 'Check');
  const extra = h('span');
  app.append(
    h('div', { class: 'extop' }, h('button', { class: 'x', title: 'Your place is saved', onclick: leave }, '✕ Lessons'),
      h('div', { class: 'bar' }, h('i', { style: `width:${100 * sess.i / sess.q.length}%` })),
      h('button', { class: 'x', disabled: sess.i === 0, onclick: () => { sess.i--; keep(); renderEx(); } }, '← Back')),
    body, h('div', { class: 'foot' }, h('div', {}, fb, extra, go)));
  const done = ok => {
    if (answered) return; answered = true; record(ex, ok);
    fb.className = 'fb ' + (ok ? 'ok' : 'no'); fb.innerHTML = '';
    fb.append(h('b', {}, ok ? 'Correct' : 'Not quite'), ansLine(ex));
    extra.innerHTML = '';
    go.textContent = 'Continue'; go.disabled = false; go.onclick = () => next(ex, ok);
    if (ex.item && ex.t !== 'speak') say(ex.item.hy);
  };
  const passive = () => { go.textContent = 'Continue'; go.onclick = () => next(ex, true); };

  if (ex.t === 'tip') {
    body.append(h('p', { class: 'q' }, 'Before you start'), h('h1', { style: 'margin-top:0' }, ex.title), h('div', { class: 'tip', html: ex.html }), ex.alpha ? alphaPlayer() : null);
    passive();
  } else if (ex.t === 'lintro') {
    const L = ALPHABET[ex.Li];
    body.append(h('p', { class: 'q' }, L[2] ? 'New letter' : 'New letter pair'),
      h('div', { class: 'card' }, h('p', { class: 'big xl' }, glyph(L), hasClip(L[1]) ? spk(L[1]) : null),
        h('p', { class: 'en' }, (L[2] ? `“${L[2]}” — ` : '') + `sounds like ${L[3]}`), h('p', { class: 'note' }, L[4]),
        h('p', { class: 'big', style: 'font-size:30px;margin-top:18px' }, L[5], spk(L[5])), h('div', { class: 'tr' }, `${L[6]} — ${L[7]}`)));
    if (hasClip(L[1])) say(L[1]);
    passive();
  } else if (ex.t === 'trace') {
    const L = ALPHABET[ex.Li], c = traceCanvas(L);
    body.append(h('p', { class: 'q' }, 'Write it'), h('p', { class: 'text' }, `Trace the capital and the small letter (${L[3]})`), c.el,
      h('button', { class: 'btn small', onclick: c.clear }, 'Clear'));
    passive();
  } else if (ex.t === 'intro') {
    const it = ex.item;
    body.append(h('p', { class: 'q' }, it.kind === 's' ? 'New phrase' : 'New word'),
      h('div', { class: 'card' }, h('p', { class: 'big' }, it.hy, spk(it.hy)), trEl(it.tr, true), h('p', { class: 'en' }, it.en)));
    say(it.hy); passive();
  } else if (ex.t === 'mc') {
    let sel = -1;
    body.append(h('p', { class: 'q' }, ex.q));
    if (ex.big) body.append(h('p', { class: 'big' }, ex.big, spk(ex.speak || (ex.item && ex.item.hy))), trEl(ex.bigTr));
    if (ex.text) body.append(h('p', { class: 'text' }, ex.text));
    if (ex.hear) { body.append(h('button', { class: 'btn', onclick: () => say(ex.hear) }, '🔊 Play again')); say(ex.hear); }
    const els = ex.opts.map((o, i) => h('button', { class: 'opt' + (o.hy ? ' hy' : ''), onclick: () => { if (answered) return; sel = i; els.forEach((e, j) => e.classList.toggle('sel', j === i)); go.disabled = false; } },
      h('span', { class: 'num' }, i + 1), h('b', {}, o.label), o.sub && (o.hy ? S.set.tr : true) ? h('small', {}, o.sub) : null));
    body.append(h('div', { class: 'opts' }, els));
    go.disabled = true;
    go.onclick = () => { els[ex.ans].classList.add('right'); done(sel === ex.ans); };
  } else if (ex.t === 'match') {
    body.append(h('p', { class: 'q' }, 'Match the pairs'));
    let a = null, left = 0;
    const mk = (txt, side, id) => { const b = h('button', { class: side ? '' : 'hy' }, txt); b.dataset.id = id; b.dataset.side = side;
      b.onclick = () => {
        if (b.classList.contains('gone')) return;
        if (!a || a.dataset.side === b.dataset.side) { if (a) a.classList.remove('sel'); a = b; b.classList.add('sel'); return; }
        if (a.dataset.id === b.dataset.id) { a.classList.remove('sel'); a.classList.add('gone'); b.classList.add('gone'); a = null; if (--left === 0) go.disabled = false; }
        else { const x = a; a = null; x.classList.remove('sel'); x.classList.add('bad'); b.classList.add('bad'); setTimeout(() => { x.classList.remove('bad'); b.classList.remove('bad'); }, 500); }
      }; return b; };
    left = ex.pairs.length;
    const Ls = shuffle(ex.pairs.map((p, i) => mk(p[0], 0, i))), Rs = shuffle(ex.pairs.map((p, i) => mk(p[1], 1, i)));
    const grid = h('div', { class: 'match' }); Ls.forEach((l, i) => grid.append(l, Rs[i]));
    body.append(grid); go.disabled = true; passive();
  } else if (ex.t === 'build') {
    const it = ex.item, chosen = [], hyT = ex.dir === 'eh' ? ' hy' : '';
    body.append(h('p', { class: 'q' }, ex.dir === 'eh' ? 'Write this in Armenian' : 'Write this in English'));
    if (ex.dir === 'eh') body.append(h('p', { class: 'text' }, it.en));
    else body.append(h('p', { class: 'big', style: 'font-size:32px' }, it.hy, spk(it.hy)), trEl(it.tr));
    const ansRow = h('div', { class: 'ansrow' });
    const tiles = ex.bank.map((t, bi) => h('button', { class: 'tile' + hyT, onclick: () => { if (answered || chosen.includes(bi)) return; chosen.push(bi); paint(); } }, t));
    const paint = () => {
      ansRow.innerHTML = '';
      chosen.forEach((bi, ci) => ansRow.append(h('button', { class: 'tile' + hyT, onclick: () => { if (answered) return; chosen.splice(ci, 1); paint(); } }, ex.bank[bi])));
      tiles.forEach((el, bi) => el.classList.toggle('used', chosen.includes(bi)));
      go.disabled = !chosen.length;
    };
    body.append(ansRow, h('div', { class: 'bank' }, tiles)); paint();
    go.onclick = () => { const got = chosen.map(bi => ex.bank[bi]).join(' '), want = ex.tok.join(' '); done(ex.dir === 'eh' ? norm(got) === norm(want) : nEn(got) === nEn(want)); };
  } else if (ex.t === 'type') {
    const it = ex.item;
    const inp = h('input', { class: 'inp', lang: 'hy', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', placeholder: 'Type with the keys below' });
    inp.oninput = () => { go.disabled = !inp.value.trim(); };
    const press = k => { if (answered) return; inp.value = k === '⌫' ? inp.value.slice(0, -1) : inp.value + k; inp.oninput(); };
    const keys = ALPHABET.slice(0, 38).map(L => h('button', { onclick: () => press(L[1]) }, L[1]));
    keys.push(h('button', { onclick: () => press('՚') }, '՚'), h('button', { onclick: () => press('՞') }, '՞'),
      h('button', { class: 'wide', onclick: () => press(' ') }, 'space'), h('button', { class: 'wide', onclick: () => press('⌫') }, '⌫ delete'));
    if (ex.hear) { body.append(h('p', { class: 'q' }, 'Type what you hear'), h('button', { class: 'btn', onclick: () => say(it.hy) }, '🔊 Play again'), inp, h('div', { class: 'kb' }, keys)); say(it.hy); }
    else body.append(h('p', { class: 'q' }, 'Type this in Armenian'), h('p', { class: 'text' }, it.en), trEl('sounds like: ' + it.tr), inp, h('div', { class: 'kb' }, keys));
    go.disabled = true;
    go.onclick = () => { inp.disabled = true; done(norm(inp.value) === norm(it.hy)); };
    setTimeout(() => inp.focus(), 0);
  } else if (ex.t === 'speak') {
    const it = ex.item;
    const play = h('button', { class: 'btn small', disabled: true, onclick: () => audioURL && new Audio(audioURL).play() }, '▶ Play me back');
    const recB = h('button', { class: 'btn small', onclick: () => toggleRec(recB, play) }, '● Record myself');
    body.append(h('p', { class: 'q' }, 'Say it out loud'),
      h('div', { class: 'card' }, h('p', { class: 'big' }, it.hy, spk(it.hy)), trEl(it.tr, true), h('p', { class: 'en' }, it.en)),
      h('p', { style: 'display:flex;gap:10px;margin-top:18px' }, recB, play),
      h('p', { class: 'note' }, 'Say it three times. Record yourself and compare against the sounds you have learned, then mark honestly.'));
    extra.append(h('button', { class: 'btn', onclick: () => { record(ex, false); next(ex, false); } }, 'Again later'));
    go.textContent = 'I said it well';
    go.onclick = () => { record(ex, true); next(ex, true); };
  }
}

// ---------- recording & tracing ----------
let rec = null, chunks = [], audioURL = null;
async function toggleRec(btn, play) {
  if (rec && rec.state === 'recording') { rec.stop(); return; }
  try {
    const st = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec = new MediaRecorder(st); chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => { st.getTracks().forEach(t => t.stop()); audioURL = URL.createObjectURL(new Blob(chunks)); play.disabled = false; btn.textContent = '● Record again'; new Audio(audioURL).play(); };
    rec.start(); btn.textContent = '■ Stop';
  } catch (e) { btn.textContent = 'Microphone unavailable'; btn.disabled = true; }
}
function traceCanvas(L) {
  const W = 560, H = 300, el = h('canvas', { class: 'trace', width: W, height: H });
  const x = el.getContext ? el.getContext('2d') : null;
  const clear = () => {
    if (!x) return;
    x.clearRect(0, 0, W, H);
    let size = 210; const txt = glyph(L), font = s => `${s}px "Noto Sans Armenian","Mshtakan","Segoe UI",system-ui,sans-serif`;
    x.font = font(size); const w = x.measureText(txt).width; if (w > W - 60) size = size * (W - 60) / w;
    x.font = font(size); x.fillStyle = 'rgba(163,35,59,.17)'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, W / 2, H / 2 + 6);
    x.strokeStyle = '#2a2019'; x.lineWidth = 7; x.lineCap = 'round'; x.lineJoin = 'round';
  };
  if (x) {
    let on = false;
    const p = e => { const r = el.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
    el.addEventListener('pointerdown', e => { on = true; el.setPointerCapture(e.pointerId); x.beginPath(); x.moveTo(...p(e)); });
    el.addEventListener('pointermove', e => { if (!on) return; x.lineTo(...p(e)); x.stroke(); });
    ['pointerup', 'pointercancel'].forEach(t => el.addEventListener(t, () => { on = false; }));
    clear();
  }
  return { el, clear };
}

// ---------- views ----------
function topBar(active) {
  const due = dueKeys().length;
  const tab = (id, label, fn, n) => h('button', { class: active === id ? 'on' : '', onclick: fn }, label, n ? h('span', { class: 'n' }, n) : null);
  return h('header', {}, h('div', { class: 'brand' }, 'Բարեւ', h('small', {}, 'Parev · Western Armenian')),
    h('nav', {}, tab('home', 'Learn', home), tab('review', 'Review', review, due), tab('abc', 'Alphabet', abc), tab('grammar', 'Grammar', grammar), tab('set', 'Settings', settings)));
}
function home() {
  const app = $('#app'); app.innerHTML = '';
  const nDone = LESSONS.filter(l => S.done[l.id]).length;
  app.append(topBar('home'), h('div', { class: 'stats' },
    h('div', {}, h('b', {}, streak()), 'day streak'), h('div', {}, h('b', {}, `${nDone}/${LESSONS.length}`), 'lessons'),
    h('div', {}, h('b', {}, Object.keys(S.srs).filter(valid).length), 'items learned'), h('div', {}, h('b', {}, dueKeys().length), 'due for review')));
  if (GH()) app.append(h('p', { class: 'note', style: 'margin:0' }, ghMsg || 'Connected to your GitHub repository.'));
  if (S.sess && S.sess.q) {
    const l = S.sess.lesson ? LESSONS.find(x => x.id === S.sess.lesson) : null;
    app.append(h('div', { class: 'card', style: 'margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap' },
      h('div', { style: 'margin-right:auto' }, h('b', {}, l ? `Unfinished lesson: ${l.title}` : 'Unfinished review'), h('div', { class: 'note' }, `Saved at step ${S.sess.i + 1} of ${S.sess.q.length}`)),
      h('button', { class: 'btn small', onclick: () => { delete S.sess; save(); ghSync(); home(); } }, 'Discard'),
      h('button', { class: 'btn primary small', id: 'go', onclick: () => { if (!resume()) home(); } }, 'Continue')));
  }
  let firstOpen = true;
  UNITS.forEach((u, ui) => {
    const cards = u.lessons.map(l => {
      const idx = LESSONS.indexOf(l), isDone = !!S.done[l.id];
      const open = S.set.unlock || isDone || idx === 0 || !!S.done[LESSONS[idx - 1].id];
      const isNext = open && !isDone && firstOpen; if (isNext) firstOpen = false;
      return h('button', { class: 'lesson' + (isDone ? ' done' : '') + (isNext ? ' next' : ''), disabled: !open, onclick: () => startLesson(l) },
        h('div', { class: 'dot' }, isDone ? '✓' : idx + 1), h('span', {}, l.title));
    });
    app.append(h('section', { class: 'unit' }, h('div', { class: 'k' }, `Unit ${ui + 1}`), h('h2', {}, u.title), h('p', {}, u.desc), h('div', { class: 'lessons' }, cards)));
  });
}
function review() {
  const app = $('#app'); app.innerHTML = '';
  const due = dueKeys().length, any = Object.keys(S.srs).filter(valid).length;
  app.append(topBar('review'), h('h1', {}, 'Review'),
    h('p', {}, 'Everything you learn comes back here on a widening schedule: after 1 day, then 2, 4, 8, 16, 32 and 64. Anything you miss starts over. This is the part that makes it stick, so do it before new lessons.'),
    due ? h('p', {}, h('button', { class: 'btn primary', id: 'go', onclick: () => startReview() }, `Review ${Math.min(due, 15)} of ${due} due`))
      : h('p', { class: 'note' }, any ? 'Nothing is due right now.' : 'Finish your first lesson and items will start appearing here.'),
    !due && any ? h('p', {}, h('button', { class: 'btn', onclick: () => startReview(true) }, 'Practise anyway')) : null);
}
function alphaPlayer() {
  const src = location.protocol === 'file:' ? 'https://commons.wikimedia.org/wiki/Special:FilePath/Armenian_alphabet_(Western_Armenian).ogg' : 'audio/alphabet.mp3';
  const a = h('audio', { controls: true, preload: 'none', src, style: 'width:100%;margin-top:10px' });
  const rate = (r, label) => h('button', { class: 'btn small', onclick: () => { a.playbackRate = r; a.play(); } }, label);
  return h('div', { class: 'card', style: 'margin:16px 0;padding:18px 22px' }, h('b', {}, 'Hear the alphabet'),
    h('div', { class: 'note' }, 'A native speaker reads the letters in alphabet order with Western pronunciation (43 seconds). Follow along from Ա to Ֆ.'), a,
    h('div', { style: 'display:flex;gap:8px;align-items:center;margin-top:10px;flex-wrap:wrap' }, rate(1, 'Normal speed'), rate(0.6, 'Slow'),
      h('span', { class: 'note' }, 'Recording by Vahagn Petrosyan, ', h('a', { href: 'https://commons.wikimedia.org/wiki/File:Armenian_alphabet_(Western_Armenian).ogg', target: '_blank', rel: 'noopener' }, 'Wikimedia Commons'), '. Tap any letter above to hear it on its own.')));
}
function abc() {
  const app = $('#app'); app.innerHTML = '';
  const detail = h('div', { class: 'card' }, h('p', { class: 'note' }, 'Choose a letter.'));
  const show = (i, btn) => {
    const L = ALPHABET[i]; app.querySelectorAll('.grid button').forEach(b => b.classList.remove('on')); btn.classList.add('on');
    detail.innerHTML = '';
    if (hasClip(L[1])) say(L[1]);
    detail.append(h('p', { class: 'big xl' }, glyph(L), hasClip(L[1]) ? spk(L[1]) : null), h('p', { class: 'en' }, (L[2] ? `“${L[2]}” — ` : '') + `sounds like ${L[3]}`), h('p', { class: 'note' }, L[4]),
      h('p', { class: 'big', style: 'font-size:30px;margin-top:14px' }, L[5], spk(L[5])), h('div', { class: 'tr' }, `${L[6]} — ${L[7]}`));
  };
  const cell = (L, i) => { const b = h('button', { onclick: () => show(i, b) }, glyph(L), h('small', {}, L[3])); return b; };
  app.append(topBar('abc'), h('h1', {}, 'The alphabet'),
    h('div', { class: 'grid' }, ALPHABET.slice(0, 38).map(cell)), h('h3', {}, 'Letter pairs'),
    h('div', { class: 'grid' }, ALPHABET.slice(38).map((L, i) => cell(L, i + 38))), detail,
    alphaPlayer(),
    h('h3', {}, 'Western versus Eastern sounds'),
    h('div', { class: 'tip', html: `<p>If you compare with Eastern Armenian material, these letters will look "swapped". In Western Armenian:</p><table><tr><td>բ = p</td><td>պ = b</td><td>փ = p</td></tr><tr><td>գ = k</td><td>կ = g</td><td>ք = k</td></tr><tr><td>դ = t</td><td>տ = d</td><td>թ = t</td></tr><tr><td>ձ = ts</td><td>ծ = dz</td><td>ց = ts</td></tr><tr><td>ջ = ch</td><td>ճ = j</td><td>չ = ch</td></tr></table><p>Western Armenian also keeps the traditional spelling (<span class="hy">իւ, եա, ոյ, աւ</span>, silent final <span class="hy">յ</span>), which Armenia replaced in the 1920s.</p>` }));
}
function grammar() {
  const app = $('#app'); app.innerHTML = '';
  app.append(topBar('grammar'), h('h1', {}, 'Grammar notes'), h('p', { class: 'note' }, 'Every note from the lessons in one place.'));
  UNITS.slice(1).forEach(u => u.lessons.forEach(l => { if (l.tip) app.append(h('h3', {}, l.title), h('div', { class: 'tip', html: l.tip })); }));
}
function settings() {
  const app = $('#app'); app.innerHTML = '';
  const toggle = (k, label, sub) => h('div', { class: 'row' }, h('div', {}, h('b', {}, label), h('small', {}, sub)),
    h('button', { class: 'btn small' + (S.set[k] ? ' primary' : ''), onclick: () => { S.set[k] = !S.set[k]; save(); settings(); } }, S.set[k] ? 'On' : 'Off'));
  const file = h('input', { type: 'file', accept: '.json', style: 'display:none', onchange: e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); if (d.done && d.srs) { S = Object.assign(def(), d); save(); settings(); } } catch (err) {} }); } });
  app.append(topBar('set'), h('h1', {}, 'Settings'),
    toggle('tr', 'Show romanisation', 'Latin-letter pronunciation under Armenian text. Turn it off once the alphabet feels comfortable.'),
    toggle('unlock', 'Unlock every lesson', 'Skip ahead instead of going in order.'),
    h('div', { class: 'row' }, h('div', {}, h('b', {}, 'Audio'), h('small', {}, (() => {
      const all = studioItems(), n = all.filter(x => hasClip(x.hy)).length;
      return `${n} of ${all.length} words and sentences have a recorded clip. ` + (VOICE
        ? `Everything else is read by the computer voice “${VOICE.name}”, which is Eastern Armenian; the option below nudges it toward Western sounds.`
        : 'Everything else is silent, because this browser has no Armenian voice.') + ' Items with sound also get listening exercises.';
    })())), h('span', { style: 'display:flex;gap:8px' }, VOICE ? h('button', { class: 'btn small', onclick: () => tts('Բարեւ, ինչպէ՞ս ես։') }, 'Test voice') : null,
      h('button', { class: 'btn small', onclick: () => { stIdx = Math.max(0, studioItems().findIndex(x => !LOCAL.has(x.id))); studio(); } }, 'Recording studio'))),
    VOICE ? toggle('shim', 'Western pronunciation correction', 'Approximate. It fixes the consonants (բ = p, կ = g …) but the accent stays Eastern.') : null,
    h('div', { class: 'row' }, h('div', {}, h('b', {}, 'Back up progress'), h('small', {}, 'Progress is stored in this browser only. Export it to move browsers or keep a copy.')),
      h('span', { style: 'display:flex;gap:8px' }, h('button', { class: 'btn small', onclick: () => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })), download: 'parev-progress.json' }); document.body.append(a); a.click(); a.remove(); } }, 'Export'),
        h('button', { class: 'btn small', onclick: () => file.click() }, 'Import'), file)),
    ghRow(),
    location.protocol === 'file:' ? null : h('div', { class: 'row' }, h('div', {}, h('b', {}, 'Download for offline use'), h('small', {}, 'The whole course is one file. Save it and double-click it to study without a connection; progress then stays in that browser unless you set up sync.')),
      h('a', { class: 'btn small', href: location.pathname.endsWith('/') ? location.pathname + 'index.html' : location.pathname, download: 'parev.html', style: 'text-decoration:none' }, 'Download')),
    h('div', { class: 'row' }, h('div', {}, h('b', {}, 'About the content'), h('small', {}, 'Vocabulary, spelling and grammar were cross-checked against the open textbook “Ես ու դուն” (yes-oo-toon.github.io), the Arak29 Western Armenian essentials, krapar.org’s alphabet table, and Wikipedia and Wiktionary conjugation tables. Sentences either come from those sources or follow sentence patterns shown in them. No native speaker has reviewed the course.'))),
    h('div', { class: 'row' }, h('div', {}, h('b', {}, 'Reset'), h('small', {}, 'Erase all progress and start again.')),
      h('button', { class: 'btn small', onclick: () => { if (confirm('Erase all progress?')) { S = def(); save(); settings(); } } }, 'Reset')));
}

// ---------- recording studio ----------
function studioItems() {
  const seen = new Set(), out = [];
  const add = (hy, tr, en) => { const id = clipId(hy); if (seen.has(id)) return; seen.add(id); out.push({ id, hy, tr, en }); };
  ALPHABET.forEach(L => { add(L[1], L[3], L[2] ? `the sound of the letter “${L[2]}” (not its name)` : 'the sound of this letter pair'); add(L[5], L[6], L[7]); });
  LESSONS.forEach(l => [...(l.words || []), ...(l.sentences || [])].forEach(x => add(x.hy, x.tr, x.en)));
  return out;
}
let stIdx = 0;
const blobB64 = b => new Promise(res => { const f = new FileReader(); f.onload = () => res(String(f.result).split(',')[1]); f.readAsDataURL(b); });
function studio() {
  const app = $('#app'); app.innerHTML = '';
  const items = studioItems(); stIdx = Math.max(0, Math.min(stIdx, items.length - 1));
  const it = items[stIdx], mine = LOCAL.has(it.id), nDone = items.filter(x => LOCAL.has(x.id)).length;
  const status = h('p', { class: 'note' }, mine ? 'Recorded in this browser.' : MANIFEST[it.id] ? 'A published clip exists. Recording here replaces it in this browser.' : 'Not recorded yet.');
  const go = d => { stIdx += d; studio(); };
  let r = null, ch = [];
  const recB = h('button', { class: 'btn primary', id: 'go', onclick: async () => {
    if (r && r.state === 'recording') { r.stop(); return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true });
      r = new MediaRecorder(st); ch = [];
      r.ondataavailable = e => ch.push(e.data);
      r.onstop = async () => { st.getTracks().forEach(t => t.stop()); await idbReq('readwrite', o => o.put(new Blob(ch, { type: r.mimeType || 'audio/webm' }), it.id)); LOCAL.add(it.id); studio(); say(it.hy); };
      r.start(); recB.textContent = '■ Stop';
    } catch (e) { status.textContent = 'Microphone unavailable. Use the hosted page (not a downloaded file) and allow microphone access.'; }
  } }, mine ? '● Record again' : '● Record');
  const file = h('input', { type: 'file', accept: '.json', style: 'display:none', onchange: async e => {
    const f = e.target.files[0]; if (!f) return;
    try { const d = JSON.parse(await f.text()); for (const id in d) { const bin = atob(d[id].data), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); await idbReq('readwrite', o => o.put(new Blob([u], { type: d[id].mime }), id)); LOCAL.add(id); } } catch (err) {}
    studio();
  } });
  const exportAll = async () => {
    const out = {};
    for (const x of items) { if (!LOCAL.has(x.id)) continue; const b = await idbReq('readonly', o => o.get(x.id)); if (b) out[x.id] = { hy: x.hy, mime: b.type, data: await blobB64(b) }; }
    const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(out)], { type: 'application/json' })), download: 'parev-recordings.json' }); document.body.append(a); a.click(); a.remove();
  };
  app.append(topBar('set'), h('h1', {}, 'Recording studio'),
    h('p', {}, 'For a Western Armenian speaker to give the course a voice. Read each item once, clearly, at a natural pace. Recordings are stored in this browser and play everywhere in the course straight away.'),
    h('p', { class: 'note' }, `${nDone} of ${items.length} recorded · item ${stIdx + 1}`),
    h('div', { class: 'card' }, h('p', { class: 'big' }, it.hy, hasClip(it.hy) ? spk(it.hy) : null), h('div', { class: 'tr' }, it.tr), h('p', { class: 'en' }, it.en), status),
    h('p', { style: 'display:flex;gap:10px;flex-wrap:wrap;margin-top:16px' }, recB,
      h('button', { class: 'btn', disabled: stIdx === 0, onclick: () => go(-1) }, '← Back'),
      h('button', { class: 'btn', disabled: stIdx >= items.length - 1, onclick: () => go(1) }, 'Next →'),
      h('button', { class: 'btn', onclick: () => { const n = items.findIndex((x, i) => i > stIdx && !LOCAL.has(x.id)); if (n >= 0) { stIdx = n; studio(); } } }, 'Next unrecorded'),
      mine ? h('button', { class: 'btn', onclick: async () => { await idbReq('readwrite', o => o.delete(it.id)); LOCAL.delete(it.id); studio(); } }, 'Delete') : null),
    h('h3', {}, 'Moving recordings'),
    h('p', { class: 'note' }, 'Export saves every recording made in this browser as one file. Import loads such a file into another browser. To publish the clips for everyone who uses the course, the file is unpacked into the audio folder of the repository (see the README); only do that with the speaker\'s consent, since their voice becomes public.'),
    h('p', { style: 'display:flex;gap:10px' }, h('button', { class: 'btn small', disabled: !nDone, onclick: exportAll }, 'Export recordings'), h('button', { class: 'btn small', onclick: () => file.click() }, 'Import recordings'), file,
      h('button', { class: 'btn small', onclick: settings }, 'Back to settings')));
}
function ghRow() {
  const g = GH() || {};
  const repo = h('input', { class: 'gh', placeholder: 'username/repository', value: g.repo || '' });
  const tok = h('input', { class: 'gh', type: 'password', placeholder: 'access token', value: g.token || '' });
  const msg = h('small', {}, ghMsg || (g.repo ? 'Connected to ' + g.repo : 'Not connected'));
  const go = async () => {
    if (repo.value.trim() && tok.value.trim()) { repo.value = repo.value.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/^\/+|\/+$/g, ''); localStorage.setItem('parev.gh', JSON.stringify({ repo: repo.value, token: tok.value.trim() })); }
    else { localStorage.removeItem('parev.gh'); setDirty(false); msg.textContent = 'Not connected'; return; }
    setDirty(false); msg.textContent = 'Syncing…'; await ghSync(); msg.textContent = ghMsg;
  };
  return h('div', { class: 'row' }, h('div', {}, h('b', {}, 'Sync progress to GitHub'),
    h('small', {}, 'Your private repository becomes the home of your progress: the app loads progress.json from it every time it opens and saves to it after every lesson. When you first connect, progress already in the repository replaces what is on this device. Needs a fine-grained access token with read and write access to Contents on that one repository. The token is kept only in this browser.'),
    h('div', { style: 'display:flex;gap:8px;margin-top:8px;flex-wrap:wrap' }, repo, tok), msg),
    h('button', { class: 'btn small', onclick: go }, 'Save & sync'));
}
document.addEventListener('keydown', e => {
  const typing = e.target && e.target.tagName === 'INPUT';
  if (e.key === 'Enter') { const g = $('#go'); if (g && !g.disabled) { e.preventDefault(); g.click(); } }
  else if (!typing && /^[1-4]$/.test(e.key)) { const o = document.querySelectorAll('.opt')[+e.key - 1]; if (o) o.click(); }
});
audioInit();
if (GH()) {
  $('#app').append(h('div', { class: 'center' }, h('p', { class: 'big' }, 'Բարեւ'), h('p', { class: 'note' }, 'Loading your progress from GitHub…')));
  Promise.race([ghSync(), new Promise(r => setTimeout(r, 8000))]).then(() => { if (!ghMsg) ghMsg = 'GitHub is slow to answer; showing the copy on this device for now.'; if (!sess) home(); });
} else home();
