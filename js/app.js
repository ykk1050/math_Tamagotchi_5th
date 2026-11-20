// 구름 둥지 · 수학 친구 키우기 (VERSION은 js/version.js)
(() => {
  const $ = (id) => document.getElementById(id);
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  document.querySelectorAll('.ver').forEach(e => (e.textContent = VERSION));
  const { FOODS, PLACES, ITEMS, CARE, TASTE, TASTE_LINE, STORY, FRIEND_XP } = DATA;

  // ---------- 저장 ----------
  const KEY = 'cloudnest.v1';
  const fresh = () => ({
    kind: null, name: null, stage: 1, xp: 0, candy: 0, fxp: 0, flv: 1,
    total: 0, correct: 0, best: 0, combo: 0, stats: {}, review: [], rot: {},
    last: 0, day: '', today: 0, days: 0, sound: true, lowfx: false,
    needs: { full: 80, mood: 80, clean: 80, energy: 80 }, needT: Date.now(),
    wishes: [], foods: {}, items: [], acc: null, decor: [], known: { food: {}, place: {}, acc: {} },
    seen: [], log: [], diary: [], pokeToday: 0, weather: 'sun', playToday: 0
  });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) { const o = JSON.parse(raw); S = Object.assign(fresh(), o); S.needs = Object.assign(fresh().needs, o.needs || {}); S.known = Object.assign(fresh().known, o.known || {}); } } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // ---------- 친구 정보 ----------
  const MAX_STAGE = 5; // 시험판은 5단계까지
  const STAGE_XP = [0, 0, 5, 14, 28, 48];
  const STAGE_NAME = { cloud: ['', '별빛 알', '톡톡 알', '솜뭉치', '몽글 구름', '새싹 날개'], bunny: ['', '딸기 알', '톡톡 알', '솜털 아기', '깡총 토끼', '리본 토끼'] };
  const NAMES = { cloud: ['몽실', '구름이', '솜이', '포근이', '뭉게'], bunny: ['콩이', '딸기', '보리', '말랑이', '토토'] };
  const LV_MSG = {
    cloud: ['', '', '알에 금이 갔어요! 누군가 빼꼼 내다봐요.', '알에서 나왔어요! 첫마디는 "몽!"', '"좋아!" 처음으로 말을 했어요.', '"나 날개가 생겼어! 이제 하고 싶은 말 다 할 수 있어!"'],
    bunny: ['', '', '알에 금이 가고 발이 쏙 나왔어요!', '알에서 나왔어요! 첫마디는 "콩!"', '"깡총!" 귀가 쭉 자랐어요.', '"리본 예쁘지? 나 이제 말 잘해!"']
  };
  const level = () => (S.stage <= 2 ? 'egg' : S.stage === 3 ? 'babble' : S.stage === 4 ? 'word' : 'talk');
  const bat = (w) => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
  const NM = () => S.name + (bat(S.name) ? '이' : ''); // 몽실 → 몽실이, 콩이 → 콩이
  const obj = (w) => w + (bat(w) ? '을' : '를');
  const showAcc = () => (S.stage >= 3 ? S.acc : null);
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const isNight = () => { const h = new Date().getHours(); return h >= 18 || h < 6; };

  // ---------- 화면 ----------
  function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }
  function overlay(id, on) { $(id).classList.toggle('on', on); }
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { Snd.tap(); overlay(b.dataset.close, false); });
  function toast(t) { const el = $('toast'); el.innerHTML = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2400); }
  function applyFx() { document.body.classList.toggle('lowfx', !!S.lowfx); Snd.set(!!S.sound); }
  function applyTime() { document.body.classList.toggle('night', isNight()); }
  applyFx(); applyTime();
  window.addEventListener('pointerdown', () => Snd.unlock(), { passive: true });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- 말하기 ----------
  const lastLine = {};
  function lineFrom(arr, key) {
    if (!arr || !arr.length) return '';
    let t, n = 0; do { t = pick(arr); n++; } while (arr.length > 1 && t === lastLine[key] && n < 6);
    lastLine[key] = t; return t;
  }
  const POS = ['wishDone', 'allWish', 'cookStart', 'cookOk', 'cookDone', 'walkStart', 'walkOk', 'find', 'arrive', 'welcome', 'happy', 'wear', 'ok', 'c3', 'c5', 'c10', 'poke'];
  // 대사 고르기: 5단계부터 문장, 그 전에는 몸짓·옹알이
  function line(cat, v = {}) {
    const lv = level(); let t;
    if (lv === 'talk') {
      const a = (LINES2[S.kind][cat]) || (LINES[S.kind].talk[cat]);
      t = lineFrom(a || LINES[S.kind].talk.idle, cat);
    } else {
      const pack = LINES[S.kind][lv];
      const neg = ['cookNo', 'walkNo', 'no'].includes(cat);
      t = lineFrom(neg ? pack.no : POS.includes(cat) ? (cat === 'poke' ? pack.poke : pack.ok) : pack.idle, lv + cat);
    }
    if (v.x != null) t = fillJo(t, '{x}', v.x);
    if (v.a != null) { if (t.includes('{a}')) t = fillJo(t, '{a}', v.a); else t += `<br><small style="font-size:.8em;color:#7A6283">정답은 ${v.a}</small>`; }
    return t;
  }
  // '{x}는', '{a}였대'처럼 자리표시 바로 뒤의 조사를 앞말 받침에 맞게 바꿔 끼운다
  function fillJo(t, key, word) {
    const re = new RegExp(key.replace(/[{}]/g, '\\$&') + '(이었|였|이야|야|이래|래|이다|다|은|는|이|가|을|를|과|와)?', 'g');
    return t.replace(re, (m, p) => (p ? Prob.jo(word, p) : word));
  }
  function speak(where, html, opt = {}) {
    const b = $(where === 'out' ? 'obubble' : 'bubble'), tx = $(where === 'out' ? 'obubble-txt' : 'bubble-txt');
    tx.innerHTML = html; b.classList.remove('hide');
    b.classList.toggle('act', html.startsWith('('));
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    const lv = level();
    if (!opt.silent) { if (lv === 'babble' || lv === 'word') Snd.babble(lv === 'babble' ? 2 : 3, S.kind); else if (lv === 'talk') Snd.babble(1, S.kind); }
    if (where === 'home') { clearTimeout(speak.t); speak.t = setTimeout(() => b.classList.add('hide'), 6500); }
  }

  // ---------- 효과 ----------
  function sparks(host, n = 10, cx = null, cy = null) {
    if (S.lowfx) n = Math.min(n, 3);
    const r = host.getBoundingClientRect(); const x0 = cx ?? r.width / 2, y0 = cy ?? r.height * .6;
    const cols = ['#FFD36E', '#F7A0C1', '#B9A7F5', '#8FE0C9'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'); s.className = 'spark'; const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      s.style.left = x0 + 'px'; s.style.top = y0 + 'px'; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px'); s.style.setProperty('--c', pick(cols));
      host.appendChild(s); setTimeout(() => s.remove(), 950);
    }
  }
  function heartUp(host, x, y) { const h = document.createElement('i'); h.className = 'float-heart ico heart'; h.style.left = x + 'px'; h.style.top = y + 'px'; host.appendChild(h); setTimeout(() => h.remove(), 1250); }
  function heartAtPet() { const room = $('room'), p = $('pet').getBoundingClientRect(), r = room.getBoundingClientRect(); heartUp($('fx'), p.left - r.left + p.width / 2 - 15, p.top - r.top + p.height * .2); }

  // ---------- 하루 바뀜 · 상태 ----------
  function newDay() {
    const t = todayStr();
    if (S.day === t) return;
    if (S.day && S.log.length) { S.diary.unshift({ day: S.day, text: diaryText(S.log, S.day) }); S.diary = S.diary.slice(0, 14); }
    S.day = t; S.today = 0; S.log = []; S.pokeToday = 0; S.days++;
    const f = pick(Object.keys(FOODS)), p = pick(Object.keys(PLACES)), c = pick(Object.keys(CARE));
    S.wishes = [{ t: 'food', id: f, done: false }, { t: 'place', id: p, done: false }, { t: 'care', id: c, done: false }];
    save();
  }
  function tickNeeds() {
    const now = Date.now(), h = Math.min(48, (now - (S.needT || now)) / 3600000);
    const N = S.needs;
    N.full = clamp(N.full - 6 * h, 15, 100); N.clean = clamp(N.clean - 4 * h, 15, 100);
    N.mood = clamp(N.mood - 3 * h, 20, 100); N.energy = clamp(N.energy + 10 * h, 0, 100);
    S.needT = now;
  }
  function addNeed(k, v) { S.needs[k] = clamp(S.needs[k] + v, 0, 100); }
  function lowNeed() { const N = S.needs; if (N.full < 35) return 'hungry'; if (N.clean < 35) return 'dirty'; if (N.energy < 30) return 'sleepy'; return null; }

  // ---------- 우정 ----------
  function addFriend(v) {
    S.fxp += v; let up = false;
    while (S.flv < FRIEND_XP.length - 1 && S.fxp >= FRIEND_XP[S.flv + 1]) { S.flv++; up = true; }
    if (up) { Snd.level(); setTimeout(() => toast(`우정이 <b>${S.flv}단계</b>가 됐어요!`), 400); }
    save(); hud();
  }
  function pendingStory() { if (S.stage < 5) return null; return STORY[S.kind].findIndex((s, i) => S.flv >= s.lv && !S.seen.includes(i)); }

  // ---------- HUD ----------
  function hud() {
    $('hud-name').textContent = S.name;
    $('hud-stage').textContent = `${S.stage}단계 ${STAGE_NAME[S.kind][S.stage]}`;
    $('hud-candy').textContent = S.candy;
    $('grow-fill').style.width = S.stage >= MAX_STAGE ? '100%' : Math.max(4, (S.xp - STAGE_XP[S.stage]) / (STAGE_XP[S.stage + 1] - STAGE_XP[S.stage]) * 100) + '%';
    $('hud-flv').textContent = S.flv;
    const a = FRIEND_XP[S.flv], b = FRIEND_XP[S.flv + 1] || a + 100;
    $('friend-fill').style.width = Math.max(4, (S.fxp - a) / (b - a) * 100) + '%';
    const ps = pendingStory(); $('btn-book').classList.toggle('new', ps != null && ps >= 0);
  }

  // =====================================================================
  // 시작 · 알 고르기 · 이름
  // =====================================================================
  $('title-eggs').innerHTML = `<div>${Art.draw('cloud', 1, 'idle')}</div><div>${Art.draw('bunny', 1, 'idle')}</div>`;
  $('btn-start').textContent = S.kind ? '이어하기' : '시작하기';
  $('btn-start').onclick = () => { Snd.unlock(); Snd.tap(); if (S.kind && S.name) enterHome('back'); else openChoose(); };
  let choice = null, nameSel = null;
  function openChoose() {
    $('egg-cloud').innerHTML = Art.draw('cloud', 1, 'idle'); $('egg-bunny').innerHTML = Art.draw('bunny', 1, 'idle');
    choice = null; $('btn-pick').disabled = true; document.querySelectorAll('.egg-card').forEach(c => c.classList.remove('sel')); show('scr-choose');
  }
  document.querySelectorAll('.egg-card').forEach(card => card.onclick = () => {
    choice = card.dataset.kind; Snd.babble(2, choice);
    document.querySelectorAll('.egg-card').forEach(c => c.classList.toggle('sel', c === card)); $('btn-pick').disabled = false;
  });
  $('btn-pick').onclick = () => { if (!choice) return; Snd.tap(); openName(); };
  function openName() {
    $('name-art').innerHTML = Art.draw(choice, 1, 'idle'); nameSel = null; $('btn-name').disabled = true; $('name-chips').innerHTML = '';
    NAMES[choice].forEach(n => { const b = document.createElement('button'); b.className = 'name-chip-btn'; b.textContent = n;
      b.onclick = () => { nameSel = n; Snd.tap(); [...$('name-chips').children].forEach(x => x.classList.toggle('sel', x === b)); $('btn-name').disabled = false; };
      $('name-chips').appendChild(b); });
    show('scr-name');
  }
  $('btn-name-back').onclick = () => { Snd.tap(); openChoose(); };
  $('btn-name').onclick = () => {
    if (!nameSel) return;
    S = Object.assign(fresh(), { kind: choice, name: nameSel, sound: S.sound, lowfx: S.lowfx }); save(); Snd.level(); enterHome('new');
  };

  // =====================================================================
  // 친구의 방
  // =====================================================================
  let wanderT = null, idleT = null, sleeping = false;
  const ICON = {
    cook: `<svg viewBox="0 0 64 64"><path d="M14 30 h36 v6 a18 16 0 0 1 -36 0z" fill="#fff"/><path d="M18 30 q2 -10 8 -6 q2 -10 10 -4 q6 -6 10 4 q6 -2 4 6z" fill="#fff" opacity=".8"/><path d="M10 30 h44" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`,
    walk: `<svg viewBox="0 0 64 64"><path d="M14 46 q18 -26 36 -10" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-dasharray="2 8"/><path d="M46 14 v24" stroke="#fff" stroke-width="4" stroke-linecap="round"/><path d="M46 14 l14 5 -14 5z" fill="#fff"/></svg>`,
    book: `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="4" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="2"/><path d="M16 12 s-5 -3 -5 1 c0 3 5 6 5 6 s5 -3 5 -6 c0 -4 -5 -1 -5 -1z" fill="#fff"/></svg>`,
    closet: `<svg viewBox="0 0 32 32"><path d="M16 6 a3 3 0 1 1 3 3 l-3 2 L4 22 h24 L16 11" fill="none" stroke="#E5679A" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    diary: `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="3" fill="#FFE59A" stroke="#E8A93C" stroke-width="2"/><path d="M11 11 h10 M11 16 h10 M11 21 h6" stroke="#C98A3D" stroke-width="2" stroke-linecap="round"/></svg>`,
    feed: `<svg viewBox="0 0 32 32"><circle cx="16" cy="18" r="11" fill="#FFF1E2" stroke="#E79A55" stroke-width="2"/><path d="M12 15 c3 -1 5 2 3 4 c-2 2 -5 1 -5 -1 c0 -2 1 -3 2 -3z" fill="#F2678F"/><path d="M18 14 h6 M19 19 h5" stroke="#FFB27A" stroke-width="3" stroke-linecap="round"/></svg>`,
    bath: `<svg viewBox="0 0 32 32"><path d="M4 16 h24 v4 a8 8 0 0 1 -8 8 h-8 a8 8 0 0 1 -8 -8z" fill="#DCEBFF" stroke="#7FB0EA" stroke-width="2"/><circle cx="10" cy="11" r="4" fill="#fff" stroke="#7FB0EA" stroke-width="1.6"/><circle cx="18" cy="8" r="3" fill="#fff" stroke="#7FB0EA" stroke-width="1.6"/><circle cx="23" cy="12" r="2.4" fill="#fff" stroke="#7FB0EA" stroke-width="1.6"/></svg>`,
    play: `<svg viewBox="0 0 32 32"><circle cx="13" cy="18" r="9" fill="#EEF4FF" stroke="#A996F0" stroke-width="2"/><circle cx="23" cy="9" r="5" fill="#FFEFF5" stroke="#F28DB2" stroke-width="2"/><circle cx="10" cy="15" r="2" fill="#fff"/></svg>`,
    nap: `<svg viewBox="0 0 32 32"><path d="M20 4 A12 12 0 1 0 28 22 A9.6 9.6 0 1 1 20 4Z" fill="#FFE08A" stroke="#E8A93C" stroke-width="2" stroke-linejoin="round"/><path d="M6 6 h5 l-5 5 h5" stroke="#8F7BE0" stroke-width="1.8" fill="none" stroke-linejoin="round"/></svg>`,
    pet: Art.icon('hand')
  };
  $('gi-cook').innerHTML = ICON.cook; $('gi-walk').innerHTML = ICON.walk;
  $('mi-book').innerHTML = ICON.book; $('mi-closet').innerHTML = ICON.closet; $('mi-diary').innerHTML = ICON.diary;
  const wishIcon = (w) => w.t === 'food' ? Scene.food(w.id) : w.t === 'place' ? ICON.walk.replace(/#fff/g, '#55C3A3') : ICON[w.id];
  const wishText = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어 해요` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어 해요` : { pet: '쓰다듬어 주길 바라요', bath: '씻고 싶어 해요', play: '같이 놀고 싶어 해요', nap: isNight() ? '이제 자고 싶어 해요' : '낮잠을 자고 싶어 해요' }[w.id];
  const napName = () => (isNight() ? '밤잠 재우기' : '낮잠 재우기');
  const careName = (id) => (id === 'nap' ? napName() : CARE[id].name);
  const wishSay = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어…` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어!` : w.id === 'nap' && isNight() ? '하암… 밤이 깊었어. 이제 자고 싶어' : CARE[w.id].wish;

  function enterHome(mode) {
    applyTime(); newDay(); tickNeeds(); save();
    show('scr-home'); renderHome();
    clearInterval(enterHome.iv); enterHome.iv = setInterval(() => { tickNeeds(); renderNeeds(); }, 60000);
    setTimeout(() => {
      const lv = level();
      if (mode === 'new') { speak('home', S.kind === 'bunny' ? '(딸기 알이 둥지에 쏙 들어갔어요. 바람을 들어주고 나들이에서 문제를 풀면 알이 자라요!)' : '(별빛 알이 둥지에 쏙 들어갔어요. 바람을 들어주고 나들이에서 문제를 풀면 알이 자라요!)'); return; }
      if (mode === 'out') { speak('home', line('welcome')); return; }
      if (lv !== 'talk') { speak('home', line('idle')); return; }
      const away = S.last ? (Date.now() - S.last) / 86400000 : 0;
      if (away >= 2) speak('home', lineFrom(LINES[S.kind].talk.back, 'back'));
      else { const h = new Date().getHours(), g = LINES[S.kind].talk.greet; speak('home', pick(h < 12 ? g.morning : h < 17 ? g.day : g.evening)); }
    }, 350);
    S.last = Date.now(); save();
    startWander(); poked();
    const ps = pendingStory(); if (ps != null && ps >= 0) setTimeout(() => toast('친구 수첩에 <b>새 이야기</b>가 열렸어요!'), 1500);
  }
  function renderHome() {
    $('room-bg').innerHTML = Scene.room(S.kind, S.decor, isNight(), S.weather || 'sun');
    placeHotspots();
    sleeping = S.needs.energy < 25 && S.stage >= 3;
    drawPet(); renderNeeds(); renderWishes(); renderCare(); hud();
  }
  function drawPet(mood) {
    mood = mood || (sulking ? 'pout' : sleeping ? 'sleep' : S.needs.mood < 35 || lowNeed() ? 'sad' : 'idle');
    $('pet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc());
    $('walker').classList.toggle('sleep', sleeping);
  }
  let moodT = null;
  function react(mood, anim) {
    drawPet(mood); const p = $('pet'); p.classList.remove('hop', 'shake', 'squish');
    if (anim) { void p.offsetWidth; p.classList.add(anim); }
    clearTimeout(moodT); moodT = setTimeout(() => { drawPet(); p.classList.remove('hop', 'shake', 'squish'); }, 1700);
  }
  function renderNeeds() {
    const L = { full: '배부름', mood: '기분', clean: '깨끗함', energy: '기운' };
    $('needs').innerHTML = Object.keys(L).map(k => `<div class="need ${S.needs[k] < 35 ? 'low' : ''}" title="${L[k]}">${Scene.need(k)}<span class="nb"><i style="width:${S.needs[k]}%"></i></span></div>`).join('');
  }
  function renderWishes() {
    const done = S.wishes.filter(w => w.done).length;
    $('wish-count').textContent = `${done} / ${S.wishes.length}`;
    $('wish-list').innerHTML = S.wishes.map((w, i) => `<div class="wish ${w.done ? 'done' : ''}" data-i="${i}"><span class="wi">${wishIcon(w)}</span><span class="wt">${NM()}는 ${wishText(w)}<small>${w.t === 'food' ? '간식 만들기 → 먹이기' : w.t === 'place' ? '산책 가기' : '돌보기'}</small></span><span class="wc">${w.done ? '✓' : ''}</span></div>`).join('');
    const w = S.wishes.find(x => !x.done);
    $('think').innerHTML = w && !sleeping ? `<span class="ti">${wishIcon(w)}</span><span>${w.t === 'food' ? FOODS[w.id].name : w.t === 'place' ? PLACES[w.id].name : careName(w.id)}</span>` : '';
  }
  function renderCare() {
    const items = [['feed', '먹이기'], ['bath', '목욕'], ['play', '놀이'], ['nap', '재우기']];
    const want = { feed: S.needs.full < 40 || S.wishes.some(w => !w.done && w.t === 'food' && S.foods[w.id]), bath: S.needs.clean < 40, nap: S.needs.energy < 35, play: S.needs.mood < 45 };
    S.wishes.forEach(w => { if (!w.done && w.t === 'care' && w.id !== 'pet') want[w.id] = true; });
    $('care-row').innerHTML = items.map(([k, n]) => `<button class="care ${want[k] ? 'want' : ''}" data-care="${k}"><span class="ci">${ICON[k]}</span>${n}</button>`).join('');
    $('care-row').querySelectorAll('.care').forEach(b => b.onclick = () => { Snd.tap(); poked(); doCare(b.dataset.care); });
  }
  $('think').onclick = () => { const w = S.wishes.find(x => !x.done); if (!w) return; Snd.tap(); speak('home', level() === 'talk' ? wishSay(w) : line('idle')); react('idle', 'squish'); };
  $('wish-list').onclick = (e) => {
    const el = e.target.closest('.wish'); if (!el) return; const w = S.wishes[+el.dataset.i]; if (w.done) return; Snd.tap();
    if (w.t === 'food') S.foods[w.id] ? doCare('feed') : openCook(); else if (w.t === 'place') openWalk(); else doCare(w.id);
  };

  function startWander() {
    clearTimeout(wanderT);
    const step = () => {
      if (!$('scr-home').classList.contains('on')) return;
      const wk = $('walker');
      if (sulking) { /* 구석에서 삐쳐 있음 */ }
      else if (sleeping) { wk.style.left = '34%'; wk.style.bottom = ''; wk.classList.remove('flying'); }
      else if (S.stage >= 3 || Math.random() < .3) {
        const cur = parseFloat(wk.style.left) || 55; let nx = R(30, 80); if (Math.abs(nx - cur) < 8) nx = cur > 55 ? cur - 20 : cur + 20;
        wk.style.left = nx + '%';
        // 날개가 생긴 구름 요정은 가끔 날아올라 방을 한 바퀴 돌다 내려온다
        if (S.kind === 'cloud' && S.stage >= 5 && !wk.classList.contains('flying') && Math.random() < .45) {
          wk.classList.add('flying'); wk.style.bottom = R(24, 40) + '%';
          clearTimeout(startWander.land); startWander.land = setTimeout(() => { wk.style.bottom = ''; setTimeout(() => wk.classList.remove('flying'), 1200); }, R(2600, 4200));
        }
        if (S.stage >= 3) { const p = $('pet'); p.classList.remove('walking'); void p.offsetWidth; p.classList.add('walking'); setTimeout(() => p.classList.remove('walking'), 2600); }
      }
      wanderT = setTimeout(step, R(4500, 8000));
    };
    if (sleeping) $('walker').style.left = '34%';
    wanderT = setTimeout(step, 2500);
  }
  function poked() { clearTimeout(idleT); idleT = setTimeout(idleTalk, 16000); }
  function idleTalk() {
    if ($('scr-home').classList.contains('on') && !document.querySelector('.overlay.on')) {
      const ln = lowNeed(), w = S.wishes.find(x => !x.done);
      if (sulking) speak('home', L3('sulk'), { silent: true });
      else if (sleeping) speak('home', level() === 'egg' ? '(새근새근…)' : 'Zzz… 음냐…', { silent: true });
      else if (ln && level() === 'talk') speak('home', line(ln));
      else if (w && level() === 'talk' && Math.random() < .5) speak('home', wishSay(w));
      else speak('home', level() === 'talk' && Math.random() < .4 ? line('happy') : line('idle'));
    }
    idleT = setTimeout(idleTalk, 22000);
  }
  // ---------- 누르기 · 쓰다듬기 · 마구 두드리기 ----------
  // 한 번 누르면 반가워하고, 문지르면 좋아하고, 짧은 시간에 여러 번 두드리면 아파서 울며 도망간다.
  // 울고 나면 한동안 삐쳐 있고, 살살 문질러 달래 주면 화해한다(벌은 기분이 조금 떨어지는 것뿐).
  let lastPoke = 0, taps = [], sulking = false, sulkT = null, sulkHint = false, ouchAt = 0, madeAt = 0;
  const L3 = (cat) => lineFrom(LINES3[S.kind][level()][cat], 'l3' + cat);
  function runAway(fromX) {
    const wk = $('walker'), cur = parseFloat(wk.style.left) || 55;
    wk.classList.remove('flying'); wk.style.bottom = ''; wk.classList.add('run'); wk.classList.toggle('egg', S.stage <= 2);
    wk.style.left = (fromX != null ? (fromX > 50 ? R(14, 22) : R(78, 86)) : (cur > 50 ? R(14, 22) : R(78, 86))) + '%';
    setTimeout(() => wk.classList.remove('run', 'egg'), 800);
  }
  function ouch() {
    ouchAt = Date.now(); Snd.ouch(); react('sad', 'ouch'); speak('home', L3('ouch'), { silent: true }); addNeed('mood', -2); renderNeeds();
  }
  function cry(fromX) {
    sulking = true; taps = []; clearTimeout(sulkT); clearTimeout(moodT);
    Snd.cry(S.kind); drawPet('cry'); runAway(fromX);
    $('walker').classList.add('sulk');
    speak('home', L3('cry'), { silent: true });
    addNeed('mood', -10); S.log.push({ e: 'cry' }); renderNeeds(); save();
    setTimeout(() => { if (sulking) drawPet('pout'); }, 2600);
    if (!sulkHint) { sulkHint = true; setTimeout(() => toast('아파서 울고 있어요. <b>살살 문질러서</b> 달래 주세요'), 1400); }
    sulkT = setTimeout(sulkEnd, 22000);
  }
  function sulkEnd() {
    if (!sulking) return; sulking = false; $('walker').classList.remove('sulk');
    drawPet(); speak('home', L3('end')); startWander();
  }
  function makeUp() {
    if (!sulking) return; sulking = false; madeAt = Date.now(); clearTimeout(sulkT); sulkHint = false; $('walker').classList.remove('sulk');
    react('happy', 'hop'); heartAtPet(); setTimeout(heartAtPet, 250); Snd.heart(); Snd.combo();
    speak('home', L3('makeup')); addNeed('mood', 8); addFriend(2); S.log.push({ e: 'makeup' }); renderNeeds(); renderWishes(); save(); startWander();
  }
  function onTap(x) {
    poked(); const now = Date.now();
    taps = taps.filter(t => now - t < 1800); taps.push(now);
    if (sulking) { Snd.ouch(); speak('home', L3('sulk'), { silent: true }); drawPet('pout'); if (taps.length >= 3) { taps = []; runAway(x); } return; }
    if (taps.length >= 5 || (taps.length >= 3 && now - ouchAt < 4000)) { cry(x); return; }
    if (taps.length >= 3) { ouch(); return; }
    if (sleeping) { if (now - lastPoke > 900) speak('home', level() === 'egg' ? '(알이 꿈틀… 다시 새근새근)' : '음냐… 오 분만 더…', { silent: true }); lastPoke = now; return; }
    if (now - lastPoke < 700) return; lastPoke = now;
    react('happy', 'squish'); speak('home', line('poke')); heartAtPet(); addNeed('mood', 3);
    if (S.pokeToday < 10) { S.pokeToday++; addFriend(1); }
    renderNeeds(); save();
  }
  (() => {
    const pet = $('pet'); let down = false, lx = 0, ly = 0, moved = 0, rub = 0, nextHeart = 220;
    pet.addEventListener('pointerdown', (e) => { down = true; lx = e.clientX; ly = e.clientY; moved = 0; try { pet.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    pet.addEventListener('pointermove', (e) => {
      if (!down) return; const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; moved += d;
      if (moved < 15) return;
      rub += d; poked();
      if (rub > nextHeart) { nextHeart = rub + 220; heartAtPet(); Snd.heart(); if (!sulking && Date.now() - madeAt > 2500) { react('happy'); addNeed('mood', 2); renderNeeds(); } }
      if (sulking && rub > 900) { rub = 0; nextHeart = 220; makeUp(); }
    });
    const up = () => {
      if (!down) return; down = false;
      if (moved < 15) { const r = $('room').getBoundingClientRect(), p = pet.getBoundingClientRect(); onTap((p.left + p.width / 2 - r.left) / r.width * 100); }
      else if (!sulking && rub > 600 && Date.now() - madeAt > 2500) { rub = 0; nextHeart = 220; if (S.pokeToday < 10) { S.pokeToday++; addFriend(1); } speak('home', line('poke')); save(); }
    };
    pet.addEventListener('pointerup', up); pet.addEventListener('pointercancel', up);
    pet.addEventListener('click', (e) => e.preventDefault());
  })();

  // =====================================================================
  // 방 안 물건 놀이: 공 던지기, 책장 수수께끼, 창문 날씨, 침대·쿠션
  // =====================================================================
  const L4 = (cat, v = {}) => level() === 'talk' ? fillJo(lineFrom(LINES4[S.kind][cat], 'l4' + cat), '{a}', v.a || '') : (cat === 'riddleNo' ? line('no', v) : cat === 'rain' && S.kind === 'bunny' ? L3('sulk') : L3('care'));
  // 방 그림(1000×640, 아래 가운데 맞춤으로 잘림) 좌표 → 방 상자 안 픽셀
  function roomBox(x0, y0, x1, y1) {
    const r = $('room').getBoundingClientRect(), sc = Math.max(r.width / 1000, r.height / 640), ox = (r.width - 1000 * sc) / 2, oy = r.height - 640 * sc;
    return { left: ox + x0 * sc, top: oy + y0 * sc, width: (x1 - x0) * sc, height: (y1 - y0) * sc, cx: (ox + (x0 + x1) / 2 * sc) / r.width * 100 };
  }
  const HOTS = [
    { id: 'window', box: [550, 64, 800, 286], name: '창문' },
    { id: 'shelf', box: [210, 136, 445, 222], name: '책장' },
    { id: 'bed', box: [170, 380, 390, 505], name: '침대' },
    { id: 'cushion', box: [615, 470, 720, 566], name: '쿠션', need: 'cushion' }
  ];
  function placeHotspots() {
    const h = $('hots'); h.innerHTML = '';
    HOTS.forEach(o => {
      if (o.need && !S.decor.includes(o.need)) return;
      const b = roomBox(...o.box); const el = document.createElement('button'); el.className = 'hot'; el.setAttribute('aria-label', o.name);
      Object.assign(el.style, { left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px' });
      el.onclick = () => { Snd.tap(); poked(); useObject(o.id, b.cx); };
      h.appendChild(el);
    });
    if (!ballState.flying) resetBall();
  }
  window.addEventListener('resize', () => { if ($('scr-home').classList.contains('on')) placeHotspots(); });

  // 친구를 방의 어느 위치(가로 %)로 데려간다. 도착하면 cb
  function goTo(pct, cb, quick) {
    const wk = $('walker'); if (sulking) { speak('home', L3('sulk'), { silent: true }); return false; }
    clearTimeout(wanderT); wk.classList.remove('flying'); wk.style.bottom = '';
    const cur = parseFloat(wk.style.left) || 55, dist = Math.abs(pct - cur);
    wk.classList.add('go'); wk.style.transitionDuration = Math.max(.35, dist / (quick ? 90 : 55)) + 's';
    wk.style.left = pct + '%';
    const p = $('pet'); if (S.stage >= 3) { p.classList.remove('walking'); void p.offsetWidth; p.classList.add('walking'); }
    setTimeout(() => { wk.classList.remove('go'); wk.style.transitionDuration = ''; p.classList.remove('walking'); cb && cb(); startWander(); }, Math.max(350, dist / (quick ? 90 : 55) * 1000));
    return true;
  }
  function useObject(id, cx) {
    if (sleeping && id !== 'bed') { speak('home', level() === 'egg' ? '(새근새근…)' : '음냐… 지금은 졸려…', { silent: true }); return; }
    if (id === 'window') {
      const order = ['sun', 'rain', 'rainbow', 'snow'];
      S.weather = order[(order.indexOf(S.weather || 'sun') + 1) % order.length]; save();
      $('room-bg').innerHTML = Scene.room(S.kind, S.decor, isNight(), S.weather);
      goTo(Math.min(78, cx), () => {
        const sad = S.kind === 'bunny' && S.weather === 'rain';
        react(sad ? 'sad' : 'happy', sad ? 'shake' : 'hop'); speak('home', L4(S.weather));
        if (S.kind === 'cloud' && S.weather === 'rain') addNeed('mood', 4);
        renderNeeds(); save();
      });
    } else if (id === 'shelf') {
      goTo(Math.max(26, cx), () => { react('happy', 'squish'); setTimeout(openRiddle, 450); });
    } else if (id === 'bed') {
      goTo(cx, () => {
        // 침대 위로 올라가서 뒹군다
        const wk = $('walker'), bb = roomBox(170, 380, 390, 505), rh = $('room').getBoundingClientRect().height;
        clearTimeout(wanderT); wk.style.bottom = (rh - bb.top - bb.height * .55) + 'px'; setTimeout(() => { wk.style.bottom = ''; startWander(); }, 2400);
        const p = $('pet'); p.classList.remove('roll'); void p.offsetWidth; p.classList.add('roll');
        drawPet('happy'); speak('home', L4('bed')); addNeed('mood', 3); renderNeeds();
        setTimeout(() => { p.classList.remove('roll'); drawPet(); }, 2200);
      });
    } else if (id === 'cushion') {
      goTo(cx, () => {
        const p = $('pet'); p.classList.remove('boing'); void p.offsetWidth; p.classList.add('boing');
        drawPet('happy'); speak('home', L4('cushion')); Snd.pop(); setTimeout(() => Snd.pop(), 420); setTimeout(() => Snd.pop(), 840);
        addNeed('mood', 3); renderNeeds(); setTimeout(() => { p.classList.remove('boing'); drawPet(); }, 1500);
      });
    }
  }

  // ---------- 공: 손가락으로 던지면 굴러가고, 친구가 쫓아가 물어 온다 ----------
  const ballState = { x: 0, y: 0, vx: 0, vy: 0, flying: false, raf: 0, hist: [] };
  const ballSize = () => Math.max(46, $('room').getBoundingClientRect().width * .055);
  function floorY() { const r = $('room').getBoundingClientRect(); return r.height * .94 - ballSize(); }
  function drawBall() { const b = $('ball'); b.style.transform = `translate(${ballState.x}px,${ballState.y}px) rotate(${ballState.x * 2}deg)`; }
  function resetBall(x) {
    const r = $('room').getBoundingClientRect(), b = $('ball'); b.innerHTML = Scene.ball(); b.style.width = b.style.height = ballSize() + 'px';
    ballState.x = x != null ? x : r.width * .7; ballState.y = floorY(); b.style.display = S.stage >= 3 ? '' : 'none'; drawBall();
  }
  function stopBall() { cancelAnimationFrame(ballState.raf); ballState.flying = false; }
  (() => {
    const b = $('ball'); let down = false, sx = 0, sy = 0, bx = 0, by = 0;
    b.addEventListener('pointerdown', (e) => {
      if (ballState.fetching) return; stopBall(); down = true; sx = e.clientX; sy = e.clientY; bx = ballState.x; by = ballState.y; ballState.hist = [[e.clientX, e.clientY, performance.now()]];
      try { b.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); poked();
    });
    b.addEventListener('pointermove', (e) => {
      if (!down) return; const r = $('room').getBoundingClientRect(), s = ballSize();
      ballState.x = Math.max(0, Math.min(r.width - s, bx + e.clientX - sx)); ballState.y = Math.max(0, Math.min(floorY(), by + e.clientY - sy)); drawBall();
      ballState.hist.push([e.clientX, e.clientY, performance.now()]); if (ballState.hist.length > 6) ballState.hist.shift();
    });
    const up = () => {
      if (!down) return; down = false;
      const h = ballState.hist, a = h[0], z = h[h.length - 1], dt = Math.max(16, z[2] - a[2]) / 1000;
      ballState.vx = (z[0] - a[0]) / dt; ballState.vy = (z[1] - a[1]) / dt;
      const sp = Math.hypot(ballState.vx, ballState.vy); if (sp > 2600) { ballState.vx *= 2600 / sp; ballState.vy *= 2600 / sp; }
      if (sp < 120) { ballState.vx = (Math.random() < .5 ? -1 : 1) * 500; ballState.vy = -500; } // 톡 누르기만 해도 굴러간다
      throwBall();
    };
    b.addEventListener('pointerup', up); b.addEventListener('pointercancel', up);
  })();
  function throwBall() {
    ballState.flying = true; let last = performance.now(), bounces = 0;
    const r = $('room').getBoundingClientRect(), s = ballSize();
    const step = (now) => {
      const dt = Math.min(.033, (now - last) / 1000); last = now;
      ballState.vy += 2200 * dt; ballState.x += ballState.vx * dt; ballState.y += ballState.vy * dt;
      if (ballState.x < 0) { ballState.x = 0; ballState.vx *= -.7; } if (ballState.x > r.width - s) { ballState.x = r.width - s; ballState.vx *= -.7; }
      if (ballState.y < 0) { ballState.y = 0; ballState.vy *= -.5; }
      const fy = floorY();
      if (ballState.y > fy) { ballState.y = fy; if (Math.abs(ballState.vy) > 160) { ballState.vy *= -.55; bounces++; Snd.pop(); } else ballState.vy = 0; ballState.vx *= .86; }
      drawBall();
      if (ballState.y >= fy && Math.abs(ballState.vx) < 25 && ballState.vy === 0) { ballState.flying = false; fetchBall(); return; }
      ballState.raf = requestAnimationFrame(step);
    };
    ballState.raf = requestAnimationFrame(step);
    if (!sleeping && !sulking && S.stage >= 3) speak('home', L4('ballGo'));
  }
  function fetchBall() {
    if (sleeping || sulking || S.stage < 3 || !$('scr-home').classList.contains('on')) return;
    const r = $('room').getBoundingClientRect(), pct = Math.max(12, Math.min(88, (ballState.x + ballSize() / 2) / r.width * 100));
    ballState.fetching = true;
    goTo(pct, () => {
      $('ball').style.display = 'none'; react('happy', 'hop'); Snd.heart();
      const back = R(40, 62);
      setTimeout(() => goTo(back, () => {
        resetBall(r.width * (back / 100) + r.width * .07); ballState.fetching = false;
        speak('home', L4('ballBack')); heartAtPet(); addNeed('mood', 4); addNeed('energy', -2);
        if (S.playToday < 10) { S.playToday++; addFriend(1); } renderNeeds(); save();
      }, true), 500);
    }, true);
  }

  // ---------- 책장: 책 속 수수께끼 (문제 1개씩, 계속 읽을 수 있다) ----------
  let rq = null;
  function openRiddle() {
    $('riddle-pet').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    nextRiddle(); overlay('ov-riddle', true);
  }
  function rsay(t) { const b = $('riddle-say'); b.querySelector('span').innerHTML = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  function nextRiddle() {
    rq = Prob.next(S.rot, S.review, S.total); const U = Prob.UNITS[rq.unit];
    rsay(L4('read')); $('rq-more').style.display = 'none';
    const tag = $('rq-tag'); tag.textContent = `${U.sem}학기 · ${U.name}`; tag.classList.toggle('s1', U.sem === 1);
    $('rq-fig').innerHTML = rq.fig; $('rq-text').innerHTML = rq.q; $('rq-text').classList.toggle('long', rq.q.replace(/<[^>]+>/g, '').length > 34 || !!rq.fig);
    const box = $('rq-choices'); box.innerHTML = ''; box.className = 'choices' + (rq.choices.length === 3 ? ' three' : '');
    rq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (rq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => riddleAnswer(b, c); box.appendChild(b); });
    rq.lock = false; save();
  }
  function riddleAnswer(btn, c) {
    if (rq.lock) return; rq.lock = true; const ok = c === rq.ans, st = S.stats[rq.unit] || (S.stats[rq.unit] = { c: 0, w: 0 }); S.total++;
    const all = [...$('rq-choices').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.candy += 1; S.xp += 1;
      Snd.ok(); rsay(L4('riddleOk')); $('riddle-pet').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === rq.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++;
      if (!S.review.some(r => r.unit === rq.unit && r.type === rq.type)) S.review.push({ unit: rq.unit, type: rq.type, due: S.total + R(3, 6) });
      Snd.no(); rsay(L4('riddleNo', { a: rq.ans })); $('riddle-pet').innerHTML = Art.draw(S.kind, S.stage, 'sad', showAcc());
    }
    $('rq-more').style.display = ''; hud(); save();
  }
  $('rq-more').onclick = () => { Snd.tap(); nextRiddle(); };
  $('rq-close').onclick = () => {
    Snd.tap(); overlay('ov-riddle', false);
    if (S.stage < MAX_STAGE && S.xp >= STAGE_XP[S.stage + 1]) setTimeout(() => levelUp(), 300);
  };

  // ---------- 바람 들어주기 ----------
  function fulfill(t, id, where = 'home') {
    const w = S.wishes.find(x => !x.done && x.t === t && x.id === id); if (!w) return false;
    w.done = true; S.candy += 5; addFriend(10); S.log.push({ e: 'wish', t, id });
    setTimeout(() => { toast(`바람을 들어줬어요! <b>우정 +10 · 별사탕 +5</b>`); Snd.combo(); }, 600);
    if (S.wishes.every(x => x.done)) { S.candy += 10; addFriend(10); S.log.push({ e: 'allwish' }); setTimeout(() => { toast('오늘의 바람을 모두 들어줬어요! <b>보너스 별사탕 +10</b>'); if (where === 'home') speak('home', line('allWish')); }, 3000); }
    save(); return true;
  }

  // ---------- 돌보기 (같이 하기) ----------
  function doCare(id) {
    if (id === 'feed') {
      const own = Object.keys(S.foods).filter(k => S.foods[k] > 0);
      if (!own.length) { speak('home', level() === 'talk' ? line('noFood') : line('idle')); toast('냉장고가 비었어요. <b>간식 만들기</b>로 만들어요!'); return; }
      openPick('무엇을 먹여 줄까요?', '냉장고에 있는 간식이에요', own.map(k => ({ id: k, art: Scene.food(k), name: FOODS[k].name, small: `${S.foods[k]}개`, badge: wishBadge('food', k) || tasteBadge('food', k) })), (k) => runAct('feed', k));
      return;
    }
    if (sleeping && id !== 'nap') { sleeping = false; S.needs.energy = Math.max(S.needs.energy, 30); }
    runAct(id);
  }
  function wishBadge(t, id) { return S.wishes.some(w => !w.done && w.t === t && w.id === id) ? '<span class="badge wishb">바람</span>' : ''; }
  function tasteBadge(t, id) { const k = S.known[t][id]; return k === 'love' ? '<span class="badge love">좋아해</span>' : k === 'hate' ? '<span class="badge hate">별로래</span>' : ''; }

  let actClean = [], actGot = 0;
  function actSay(t) { const b = $('act-bubble'); b.querySelector('span').innerHTML = t; b.style.display = 'flex'; }
  function actPet(mood) { $('act-pet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc()); }
  function runAct(id, foodId) {
    const room = $('act-room'), field = $('act-field'), bottom = $('act-bottom');
    room.classList.remove('dark'); bottom.innerHTML = ''; $('act-bubble').style.display = 'none';
    field.querySelectorAll('.bub,.zz,.spark,.float-heart').forEach(e => e.remove());
    const meter = $('act-meter'); meter.style.display = 'none'; meter.firstElementChild.style.width = '0';
    actPet('idle');
    $('act-title').textContent = id === 'feed' ? `${FOODS[foodId].name} 먹이기` : id === 'pet' && S.stage <= 2 ? '알 데우기' : careName(id);
    overlay('ov-act', true);
    let done = false;
    const finish = () => {
      if (done) return; done = true; actClean.forEach(f => f()); actClean = []; room.classList.remove('dark');
      let ln = '', mood = 'happy';
      if (id === 'feed') {
        const ts = TASTE[S.kind].food[foodId]; S.known.food[foodId] = ts;
        addNeed('full', ts === 'love' ? 45 : 35); addNeed('mood', ts === 'love' ? 25 : ts === 'hate' ? 0 : 12);
        addFriend(ts === 'love' ? 8 : ts === 'hate' ? 1 : 4); if (ts === 'hate') mood = 'sad';
        ln = level() === 'talk' ? fillJo(lineFrom(TASTE_LINE[S.kind].food[ts], 'tf' + ts), '{x}', FOODS[foodId].name) : L3(ts === 'hate' ? 'yuck' : 'yum');
        if (level() !== 'talk' && ts === 'love') ln += '<br><small style="font-size:.8em;color:#7A6283">엄청 좋아하는 것 같아요!</small>';
        if (level() !== 'talk' && ts === 'hate') ln += '<br><small style="font-size:.8em;color:#7A6283">별로 안 좋아하는 것 같아요</small>';
        S.foods[foodId]--; S.log.push({ e: 'feed', id: foodId, ts }); fulfill('food', foodId, 'act');
      } else {
        if (id === 'bath') addNeed('clean', 100); if (id === 'nap') addNeed('energy', 100);
        if (id === 'play') { addNeed('mood', 25); addNeed('energy', -10); } if (id === 'pet') addNeed('mood', 15);
        addFriend(3); S.log.push({ e: 'care', id }); fulfill('care', id, 'act');
        ln = level() === 'talk' ? lineFrom(LINES[S.kind].talk.act[{ bath: 'bubble', play: 'bubble', nap: 'nap', pet: 'pet' }[id]], 'act' + id) : L3('care');
        if (id === 'play' && actGot) { S.candy += actGot; ln += `<br><small style="font-size:.8em;color:#7A6283">규칙에 맞는 방울 ${actGot}개! 별사탕 +${actGot}</small>`; }
        if (id === 'bath' && level() === 'talk') ln = S.kind === 'bunny' ? '뽀송뽀송! 털이 보들보들해졌어!' : '뽀송뽀송! 하얀 구름으로 돌아왔어!';
      }
      actPet(mood); Snd.heart(); if (mood === 'happy') sparks(field, 14);
      actSay(ln); if (level() !== 'egg') Snd.babble(2, S.kind);
      save();
      setTimeout(() => { overlay('ov-act', false); sleeping = false; renderHome(); react(mood, mood === 'happy' ? 'hop' : null); }, 2600);
    };
    const tm = setTimeout(finish, id === 'play' ? 60000 : 40000); actClean.push(() => clearTimeout(tm));
    ({ feed: actFeed, pet: actRub, bath: actBath, play: actMathBubble, nap: actNap })[id](field, bottom, finish, id, foodId);
  }
  function actFeed(field, bottom, finish, id, foodId) {
    $('act-hint').textContent = '간식을 끌어서 입에 쏙 넣어 줘요';
    const s = document.createElement('div'); s.className = 'snack'; s.innerHTML = Scene.food(foodId);
    let sx = 0, sy = 0, on = false;
    s.addEventListener('pointerdown', (e) => { on = true; sx = e.clientX; sy = e.clientY; s.classList.add('drag'); try { s.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    s.addEventListener('pointermove', (e) => { if (on) s.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) scale(1.1)`; });
    const up = () => {
      if (!on) return; on = false; s.classList.remove('drag');
      const a = s.getBoundingClientRect(), p = $('act-pet').getBoundingClientRect();
      if (Math.hypot(a.left + a.width / 2 - (p.left + p.width / 2), a.top + a.height / 2 - (p.top + p.height * .5)) < p.width * .45) {
        s.classList.add('gone'); eat(field, foodId, finish);
      } else s.style.transform = '';
    };
    s.addEventListener('pointerup', up); s.addEventListener('pointercancel', up);
    bottom.appendChild(s);
  }
  // 입에 들어간 간식을 실제로 먹는 모습: 딱딱한 것은 세 입에 냠냠, 마실 것은 쭈욱~ 꿀꺽
  function eat(field, foodId, finish) {
    const p = $('act-pet').getBoundingClientRect(), f = field.getBoundingClientRect();
    const [mx, my] = Art.mouth(S.kind, S.stage); const x = p.left - f.left + p.width * mx, y = p.top - f.top + p.height * my;
    const sz = Math.max(56, p.width * .3), egg = S.stage <= 2, drink = foodId === 'milk';
    const el = document.createElement('div'); el.className = 'eating' + (drink ? ' drink' : ''); el.innerHTML = Scene.food(foodId);
    Object.assign(el.style, { width: sz + 'px', height: sz + 'px', left: (x - sz / 2 + (drink ? sz * .45 : 0)) + 'px', top: (y - sz * (drink ? .7 : .55)) + 'px' });
    field.appendChild(el);
    const pop = (t, dx = 0) => { const w = document.createElement('div'); w.className = 'eat-word'; w.textContent = t; w.style.left = (x + dx) + 'px'; w.style.top = (y - sz * .9) + 'px'; field.appendChild(w); setTimeout(() => w.remove(), 900); };
    const crumbs = () => { const c = FOODS[foodId].color; for (let i = 0; i < 5; i++) { const k = document.createElement('i'); k.className = 'crumb'; k.style.background = c; k.style.left = (x + R(-sz * .3, sz * .3)) + 'px'; k.style.top = (y + 4) + 'px'; k.style.setProperty('--dx', R(-30, 30) + 'px'); field.appendChild(k); setTimeout(() => k.remove(), 800); } };
    const T = [];
    const at = (ms, fn) => T.push(setTimeout(fn, ms));
    actClean.push(() => { T.forEach(clearTimeout); el.remove(); });
    if (egg) {
      // 알은 간식을 품듯 빨아들인다
      el.classList.add('absorb'); at(150, () => Snd.munch()); at(700, () => { pop('(쏙!)'); actPet('happy'); }); at(1300, finish); return;
    }
    if (drink) {
      actPet('sip'); pop(S.kind === 'bunny' ? '쭈욱~' : '쪼옥~', sz * .3);
      [0, 380, 760, 1140].forEach(t => at(t, () => Snd.sip()));
      at(300, () => el.classList.add('lv1')); at(800, () => el.classList.add('lv2')); at(1300, () => el.classList.add('lv3'));
      at(1700, () => { el.classList.add('done'); actPet('chew'); pop('꿀꺽!'); Snd.munch(); });
      at(2300, () => { actPet('happy'); if (Math.random() < .35 && level() !== 'egg') pop(S.kind === 'bunny' ? '끅! 헤헤' : '꺼억? 히히'); });
      at(2700, finish); return;
    }
    // 냠 · 오물오물 세 번
    [0, 750, 1500].forEach((t, i) => {
      at(t, () => { actPet('chomp'); Snd.munch(); el.className = 'eating bite' + (i + 1); crumbs(); pop(pick(['냠!', '앙!', '냠냠']), R(-20, 20)); });
      at(t + 300, () => actPet('chew'));
    });
    at(2250, () => { el.remove(); actPet('chew'); pop('오물오물…'); });
    at(2800, () => { actPet('happy'); if (Math.random() < .3) pop(S.kind === 'bunny' ? '끅! 헤헤' : '꺼억? 히히'); });
    at(3200, finish);
  }
  function actRub(field, bottom, finish) {
    $('act-hint').textContent = '손가락으로 살살 문질러 줘요';
    const meter = $('act-meter'); meter.style.display = 'block';
    const pet = $('act-pet'); let on = false, lx = 0, ly = 0, dist = 0, nh = 200;
    const down = (e) => { on = true; lx = e.clientX; ly = e.clientY; e.preventDefault(); };
    const move = (e) => {
      if (!on) return; dist += Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY;
      meter.firstElementChild.style.width = Math.min(100, dist / 14) + '%';
      if (dist > nh) { nh += 200; const fr = field.getBoundingClientRect(); heartUp(field, e.clientX - fr.left - 15, e.clientY - fr.top - 30); Snd.heart(); actPet('happy'); }
      if (dist >= 1400) { on = false; finish(); }
    };
    const up = () => { on = false; };
    pet.addEventListener('pointerdown', down); field.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    actClean.push(() => { pet.removeEventListener('pointerdown', down); field.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
  }
  function actBubble(field, bottom, finish, id) {
    let n = 0; const goal = 8, word = id === 'bath' ? '거품' : '방울';
    $('act-hint').textContent = `${word}을 톡톡 터뜨려요 0 / ${goal}`;
    if (id === 'bath') actPet('happy');
    const spawn = () => {
      const b = document.createElement('div'); b.className = 'bub'; b.style.setProperty('--s', R(64, 110) + 'px'); b.style.setProperty('--t', R(5, 8) + 's');
      b.style.left = R(4, 86) + '%'; b.style.top = '100%';
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); if (b.classList.contains('popped')) return; b.classList.add('popped'); Snd.pop(); n++;
        $('act-hint').textContent = `${word}을 톡톡 터뜨려요 ${n} / ${goal}`; actPet('happy'); setTimeout(() => b.remove(), 260); if (n >= goal) finish();
      });
      field.appendChild(b); setTimeout(() => b.remove(), 8500);
    };
    spawn(); const iv = setInterval(spawn, 650); actClean.push(() => clearInterval(iv));
  }
  // 이불을 끌어다 친구 위에 놓으면 덮이고, 자장가를 들으며 잠든다
  const QUILT = `<svg viewBox="0 0 120 80" aria-hidden="true"><rect x="4" y="6" width="112" height="68" rx="18" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="3"/><path d="M4 30 h112 M4 52 h112 M42 6 v68 M80 6 v68" stroke="#fff" stroke-width="2.4" stroke-dasharray="6 6" opacity=".8"/><g fill="#FFE29A"><path d="M23 18 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z"/><path d="M61 40 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z"/><path d="M99 62 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z"/></g><rect x="4" y="6" width="112" height="16" rx="10" fill="#fff" opacity=".9"/></svg>`;
  function actNap(field, bottom, finish) {
    $('act-hint').textContent = isNight() ? '이불을 끌어다 덮어 주세요. 이제 잘 시간이에요' : '이불을 끌어다 덮어 주세요';
    if (isNight()) $('act-room').classList.add('dark');
    actPet(level() === 'egg' ? 'idle' : 'sad');
    const q = document.createElement('div'); q.className = 'quilt'; q.innerHTML = QUILT;
    let sx = 0, sy = 0, on = false;
    q.addEventListener('pointerdown', (e) => { on = true; sx = e.clientX; sy = e.clientY; q.classList.add('drag'); try { q.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    q.addEventListener('pointermove', (e) => { if (on) q.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) scale(1.15)`; });
    const up = () => {
      if (!on) return; on = false; q.classList.remove('drag');
      const a = q.getBoundingClientRect(), p = $('act-pet').getBoundingClientRect();
      if (Math.hypot(a.left + a.width / 2 - (p.left + p.width / 2), a.top + a.height / 2 - (p.top + p.height * .6)) < p.width * .55) cover();
      else q.style.transform = '';
    };
    q.addEventListener('pointerup', up); q.addEventListener('pointercancel', up);
    bottom.appendChild(q);
    function cover() {
      q.remove(); Snd.heart();
      const p = $('act-pet').getBoundingClientRect(), fr = field.getBoundingClientRect();
      const on2 = document.createElement('div'); on2.className = 'quilt-on'; on2.innerHTML = QUILT;
      Object.assign(on2.style, { left: (p.left - fr.left + p.width * .08) + 'px', top: (p.top - fr.top + p.height * .7) + 'px', width: (p.width * .84) + 'px' });
      field.appendChild(on2); actClean.push(() => on2.remove());
      $('act-room').classList.add('dark'); actPet('sleep'); Snd.lullaby(); $('act-hint').textContent = '쉿, 새근새근…';
      let k = 0;
      const iv = setInterval(() => { const z = document.createElement('div'); z.className = 'zz'; z.textContent = 'z'; z.style.left = (p.left - fr.left + p.width * .62) + 'px'; z.style.top = (p.top - fr.top + p.height * .2) + 'px'; field.appendChild(z); setTimeout(() => z.remove(), 2500); if (++k > 6) clearInterval(iv); }, 650);
      actClean.push(() => clearInterval(iv)); const t = setTimeout(finish, 5000); actClean.push(() => clearTimeout(t));
    }
  }

  // ---------- 뽀득뽀득 목욕: ① 샤워기로 적시기 → ② 비누로 문질러 거품 → ③ 샤워기로 헹구기 (모두 직접 끌어서) ----------
  const SHOWER = `<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M50 60 C50 40 46 30 34 26" fill="none" stroke="#A9B9D3" stroke-width="6" stroke-linecap="round"/><path d="M12 14 a20 20 0 0 1 36 6 l-4 6 h-28 z" fill="#DCE6F5" stroke="#8EA0BF" stroke-width="2.4" stroke-linejoin="round"/><g fill="#7FB0EA"><circle cx="20" cy="22" r="1.8"/><circle cx="27" cy="23" r="1.8"/><circle cx="34" cy="23" r="1.8"/><circle cx="41" cy="22" r="1.8"/></g></svg>`;
  const SOAP = `<svg viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="20" width="44" height="30" rx="12" fill="#FFC7D9" stroke="#E5679A" stroke-width="2.6"/><path d="M18 28 q6 -4 12 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/><g fill="#fff" stroke="#C9BDF3" stroke-width="1.4"><circle cx="46" cy="16" r="6"/><circle cx="54" cy="10" r="4"/><circle cx="38" cy="10" r="3.4"/></g></svg>`;
  function actBath(field, bottom, finish) {
    actPet('sad');
    const fr0 = field.getBoundingClientRect(), pr0 = $('act-pet').getBoundingClientRect();
    // 연한 얼룩(먼지·흙물 자국)
    const smudges = [];
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div'); d.className = 'smudge'; const sz = R(40, 64);
      Object.assign(d.style, { width: sz + 'px', height: sz * .75 + 'px', left: (pr0.left - fr0.left + pr0.width * (.32 + Math.random() * .36) - sz / 2) + 'px', top: (pr0.top - fr0.top + pr0.height * (.5 + Math.random() * .3) - sz * .37) + 'px' });
      d.style.setProperty('--c', pick(['rgba(92,70,58,.42)', 'rgba(70,62,70,.36)', 'rgba(120,88,60,.38)']));
      field.appendChild(d); smudges.push(d);
    }
    const STEPS = [
      { tool: 'shower', need: 520, hint: '① 샤워기를 끌어서 몸을 물로 적셔요' },
      { tool: 'soap', need: 1100, hint: '② 비누를 끌어서 문질러 거품을 내요' },
      { tool: 'shower', need: 700, hint: '③ 샤워기로 거품을 깨끗이 헹궈요' }
    ];
    let step = 0, prog = 0;
    const meter = $('act-meter'); meter.style.display = 'block';
    const setHint = () => { $('act-hint').textContent = STEPS[step].hint; meter.firstElementChild.style.width = Math.min(100, prog / STEPS[step].need * 100) + '%'; };
    const tray = {};
    [['shower', SHOWER, '샤워기'], ['soap', SOAP, '비누']].forEach(([k, svg, nm]) => {
      const t = document.createElement('div'); t.className = 'tool'; t.dataset.tool = k; t.innerHTML = svg + `<span>${nm}</span>`;
      bottom.appendChild(t); tray[k] = t;
    });
    const syncTray = () => Object.keys(tray).forEach(k => tray[k].classList.toggle('off', k !== STEPS[step].tool));
    setHint(); syncTray();
    let held = null, lx = 0, ly = 0, acc = 0;
    const inPet = (x, y) => { const p = $('act-pet').getBoundingClientRect(); return x > p.left + p.width * .1 && x < p.right - p.width * .1 && y > p.top + p.height * .2 && y < p.bottom; };
    const place = (x, y) => { const f = field.getBoundingClientRect(); held.style.left = (x - f.left) + 'px'; held.style.top = (y - f.top) + 'px'; };
    Object.values(tray).forEach(t => t.addEventListener('pointerdown', (e) => {
      if (t.classList.contains('off')) { Snd.no(); return; }
      e.preventDefault(); held = document.createElement('div'); held.className = 'tool held ' + t.dataset.tool; held.innerHTML = t.dataset.tool === 'soap' ? SOAP : SHOWER;
      field.appendChild(held); t.classList.add('using'); lx = e.clientX; ly = e.clientY; place(lx, ly);
      try { t.setPointerCapture(e.pointerId); } catch (x) {}
    }));
    const move = (e) => {
      if (!held) return; place(e.clientX, e.clientY);
      const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY;
      if (!inPet(e.clientX, e.clientY + (STEPS[step].tool === 'shower' ? 70 : 0))) return;
      prog += d; acc += d;
      const f = field.getBoundingClientRect(), x = e.clientX - f.left, y = e.clientY - f.top;
      if (STEPS[step].tool === 'shower' && acc > 14) {
        acc = 0;
        for (let i = 0; i < 3; i++) { const w = document.createElement('i'); w.className = 'water'; w.style.left = (x + R(-22, 22)) + 'px'; w.style.top = (y + 18) + 'px'; field.appendChild(w); setTimeout(() => w.remove(), 700); }
        if (step === 2) { const fs = field.querySelectorAll('.foam.stay'); const n = Math.ceil(fs.length * Math.min(1, d / 120)); [...fs].slice(0, n).forEach(fo => { fo.classList.add('gone'); setTimeout(() => fo.remove(), 400); }); }
        if (step === 0) smudges.forEach(s => (s.style.opacity = Math.max(.75, 1 - prog / 2000)));
      }
      if (STEPS[step].tool === 'soap' && acc > 22) {
        acc = 0; Snd.pop();
        const fo = document.createElement('i'); fo.className = 'foam stay'; fo.style.left = (x + R(-18, 18)) + 'px'; fo.style.top = (y + R(-18, 18)) + 'px'; fo.style.setProperty('--s', R(16, 34) + 'px'); field.appendChild(fo);
        smudges.forEach(s => (s.style.opacity = Math.max(0, .75 * (1 - prog / STEPS[1].need))));
        actPet('happy');
      }
      meter.firstElementChild.style.width = Math.min(100, prog / STEPS[step].need * 100) + '%';
      if (prog >= STEPS[step].need) next();
    };
    const up = () => { if (!held) return; held.remove(); held = null; Object.values(tray).forEach(t => t.classList.remove('using')); };
    function next() {
      up(); Snd.heart(); sparks(field, 8); prog = 0; step++;
      if (step === 1) { actPet('idle'); if (level() === 'talk') actSay(S.kind === 'bunny' ? '시원하다! 이제 비누칠!' : '촉촉해졌어! 이제 비누 거품!'); }
      if (step === 2) { smudges.forEach(s => s.remove()); if (level() === 'talk') actSay(S.kind === 'bunny' ? '거품이 보글보글! 간지러워!' : '거품 구름이 됐어! 헤헤.'); }
      if (step >= STEPS.length) {
        field.querySelectorAll('.foam').forEach(fo => fo.remove()); meter.style.display = 'none';
        actPet('happy'); sparks(field, 18); setTimeout(finish, 500); return;
      }
      setHint(); syncTray();
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    actClean.push(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); field.querySelectorAll('.smudge,.foam,.water,.tool.held').forEach(e => e.remove()); });
  }

  // ---------- 수수께끼 방울 놀이: 친구가 낸 규칙에 맞는 방울만 터뜨린다 (수학) ----------
  const frh = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  const gcd2 = (a, b) => (b ? gcd2(b, a % b) : a);
  const dec2 = (v) => (v / 100).toFixed(2).replace(/0$/, '').replace(/\.$/, '');
  const BUB_RULES = [
    () => { // 크기가 같은 분수 (약분과 통분)
      const [a, b] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]);
      return { title: `${Prob.jo(frh(a, b), '과')} 크기가 같은 분수`, gen: (ok) => { const m = R(2, 5); if (ok) return frh(a * m, b * m); let n = a * m + (Math.random() < .5 ? 1 : -1); if (n <= 0) n = a * m + 1; return Math.random() < .5 ? frh(n, b * m) : frh(a * m, b * m + 1); } };
    },
    () => ({ // 기약분수 (약분과 통분)
      title: '기약분수', gen: (ok) => { if (ok) { let d = R(3, 12), n = R(1, d - 1); while (gcd2(n, d) !== 1) n = R(1, d - 1); return frh(n, d); } let d = R(2, 6), n = R(1, d - 1), k = R(2, 3); return frh(n * k, d * k); }
    }),
    () => { // 수의 범위
      const lo = R(15, 60), hi = lo + R(4, 7), k1 = pick(['이상', '초과']), k2 = pick(['이하', '미만']);
      const inR = (v) => (k1 === '이상' ? v >= lo : v > lo) && (k2 === '이하' ? v <= hi : v < hi);
      return { title: `${lo} ${k1} ${hi} ${k2}인 수`, gen: (ok) => { let v; do { v = ok ? R(lo, hi) : pick([lo, hi, lo - R(1, 4), hi + R(1, 4)]); } while (inR(v) !== ok); return String(v); } };
    },
    () => { // 반올림 (어림하기)
      const T = R(2, 9) * 10;
      return { title: `반올림하여 십의 자리까지 나타내면 ${T}인 수`, gen: (ok) => String(ok ? R(T - 5, T + 4) : pick([R(T - 12, T - 6), R(T + 5, T + 11)])) };
    },
    () => { // 소수의 크기
      const x = R(2, 8) * 10;
      return { title: `${dec2(x)}보다 큰 소수`, gen: (ok) => { let v; do { v = ok ? R(x + 1, 99) : R(5, x - 1); } while (v % 10 === 0 && Math.random() < .6); return dec2(v); } };
    },
    () => ({ // 1/2보다 큰 분수 (분수의 크기 비교)
      title: `${frh(1, 2)} 보다 큰 분수`, gen: (ok) => { let d, n; do { d = R(3, 12); n = R(1, d - 1); } while (n * 2 === d || (n * 2 > d) !== ok); return frh(n, d); }
    })
  ];
  function actMathBubble(field, bottom, finish) {
    const rule = pick(BUB_RULES)(); const goal = 6; let got = 0, miss = 0; actGot = 0;
    const card = document.createElement('div'); card.className = 'rule-card';
    card.innerHTML = `<span class="rq">${level() === 'talk' ? `${S.name === NM() ? S.name : NM()}의 수수께끼!` : '규칙'}</span><b>${rule.title}</b>만 톡!`;
    bottom.appendChild(card);
    const hint = () => { $('act-hint').innerHTML = `맞힌 방울 ${got} / ${goal}${miss ? ` · 앗! ${miss}` : ''}`; };
    hint();
    if (level() === 'talk') actSay(S.kind === 'bunny' ? '내가 문제 낼게! 규칙에 맞는 방울만 터뜨려 줘!' : '수수께끼 방울이야. 규칙에 맞는 것만 톡 해 줘!');
    let n = 0;
    const spawn = () => {
      const ok = n % 2 === 0 ? Math.random() < .6 : Math.random() < .45; n++;
      const b = document.createElement('div'); b.className = 'bub mbub';
      b.style.setProperty('--s', R(92, 118) + 'px'); b.style.setProperty('--t', R(7, 10) + 's');
      b.style.left = R(3, 80) + '%'; b.style.top = '100%';
      b.innerHTML = `<span>${rule.gen(ok)}</span>`;
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); if (b.classList.contains('popped') || b.classList.contains('wrong')) return;
        if (ok) {
          b.classList.add('popped'); Snd.ok(); got++; actGot = got; hint(); actPet('happy');
          const r = b.getBoundingClientRect(), f = field.getBoundingClientRect(), p = $('act-pet').getBoundingClientRect();
          const st = document.createElement('i'); st.className = 'star-fly'; st.style.left = (r.left - f.left + r.width / 2 - 12) + 'px'; st.style.top = (r.top - f.top + r.height / 2 - 12) + 'px';
          st.style.setProperty('--tx', (p.left - r.left + p.width / 2 - r.width / 2) + 'px'); st.style.setProperty('--ty', (p.top - r.top + p.height * .3 - r.height / 2) + 'px');
          field.appendChild(st); setTimeout(() => { st.remove(); Snd.heart(); }, 700);
          setTimeout(() => b.remove(), 260);
          if (got >= goal) { clearInterval(iv); setTimeout(finish, 700); }
        } else {
          b.classList.add('wrong'); Snd.no(); miss++; hint(); actPet('sad'); setTimeout(() => actPet('idle'), 700);
          if (level() === 'talk') actSay(pick(['앗, 그건 규칙이랑 달라!', '음… 다시 한번 볼까?', '아깝다! 그건 아니야.']));
        }
      });
      field.appendChild(b); setTimeout(() => b.remove(), 11000);
    };
    spawn(); const iv = setInterval(spawn, 1100); actClean.push(() => { clearInterval(iv); field.querySelectorAll('.mbub,.star-fly').forEach(e => e.remove()); });
  }

  // ---------- 고르기 창 (공용) ----------
  function openPick(title, sub, list, cb, place = false) {
    $('choose-title').textContent = title; $('choose-sub').textContent = sub;
    $('pick-grid').innerHTML = list.map(o => `<button class="pick ${place ? 'place' : ''}" data-id="${o.id}">${o.badge || ''}<span class="pa">${o.art}</span><b>${o.name}</b><small>${o.small || ''}</small></button>`).join('');
    $('pick-grid').querySelectorAll('.pick').forEach(b => b.onclick = () => { Snd.tap(); overlay('ov-choose', false); cb(b.dataset.id); });
    overlay('ov-choose', true);
  }

  // =====================================================================
  // 나들이: 간식 만들기 · 산책
  // =====================================================================
  let OUT = null, cur = null, lock = false;
  function openCook() {
    openPick('무엇을 만들까요?', '단계마다 문제를 풀면 간식이 완성돼요', Object.keys(FOODS).map(k => ({ id: k, art: Scene.food(k), name: FOODS[k].name, small: S.foods[k] ? `냉장고에 ${S.foods[k]}개` : '', badge: wishBadge('food', k) || tasteBadge('food', k) })), startCook);
  }
  function openWalk() {
    openPick('어디로 산책 갈까요?', '한 걸음마다 문제를 풀며 걸어가요', Object.keys(PLACES).map(k => ({ id: k, art: Scene.path(k, 6, false, 2.65), name: PLACES[k].name, small: S.known.place[k] ? '가 본 곳' : '처음 가 봐요', badge: wishBadge('place', k) || tasteBadge('place', k) })), startWalk, true);
  }
  $('btn-cook').onclick = () => { Snd.tap(); poked(); openCook(); };
  $('btn-walk').onclick = () => { Snd.tap(); poked(); if (S.needs.energy < 15 && S.stage >= 3) { speak('home', level() === 'talk' ? line('sleepy') : line('idle')); toast(`너무 졸려 해요. 먼저 <b>${isNight() ? '재워' : '낮잠을 재워'}</b> 줄까요?`); return; } openWalk(); };

  const ADDS = ['drop', 'pour', 'crack', 'top'];
  function startCook(id) { OUT = { type: 'cook', id, step: 0, n: 5, res: [], finds: [], fill: 0, anim: false, adds: FOODS[id].steps.filter(st => ADDS.includes(st[1])).length }; beginOut(); }
  function setFill() {
    const r = document.getElementById('bowlfill'); if (!r || !OUT || OUT.type !== 'cook') return;
    const h = 54 * Math.min(1, OUT.fill / Math.max(1, OUT.adds));
    r.setAttribute('y', 340 - h); r.setAttribute('height', h + 2);
  }
  function startWalk(id) { OUT = { type: 'walk', id, step: 0, n: 6, res: [], finds: [] }; beginOut(); }
  function beginOut() {
    stopBall(); clearTimeout(wanderT); clearTimeout(idleT); if (sulking) { sulking = false; clearTimeout(sulkT); $('walker').classList.remove('sulk'); }
    show('scr-out'); S.combo = 0;
    const st = $('stage'); st.classList.toggle('cooking', OUT.type === 'cook');
    $('out-title').textContent = OUT.type === 'cook' ? `${FOODS[OUT.id].name} 만들기` : `${PLACES[OUT.id].name} 산책`;
    $('stage-bg').dataset.place = '';
    drawOutPet('idle'); renderOut(); speak('out', line(OUT.type === 'cook' ? 'cookStart' : 'walkStart'));
    if (OUT.type === 'walk') placeOutPet(0, true); else { $('opet').style.left = ''; $('cook-fx').innerHTML = ''; placeCookFx(); }
    nextQ();
  }
  function renderOut() {
    if (OUT.type === 'cook') {
      const F = FOODS[OUT.id];
      // 부엌은 한 번만 그리고, 그릇 내용물은 재료가 실제로 들어간 만큼만 채운다
      if ($('stage-bg').dataset.place !== 'cook-' + OUT.id) { $('stage-bg').innerHTML = Scene.kitchen(0, F.color, false); $('stage-bg').dataset.place = 'cook-' + OUT.id; }
      setFill();
      // 애니메이션이 도는 동안에는 지금 단계 이름을 그대로 둔다
      if (!OUT.anim) $('step-label').textContent = OUT.step < OUT.n ? `${OUT.step + 1}. ${F.steps[OUT.step][0]}` : '완성!';
    } else if ($('stage-bg').dataset.place !== OUT.id) {
      const r = $('stage').getBoundingClientRect();
      $('stage-bg').innerHTML = Scene.path(OUT.id, OUT.n, false, r.width / Math.max(1, r.height)); $('stage-bg').dataset.place = OUT.id;
    }
    $('steps').innerHTML = Array.from({ length: OUT.n }, (_, i) => `<i class="${OUT.res[i] === true ? 'ok' : OUT.res[i] === false ? 'no' : i === OUT.step ? 'cur' : ''}"></i>`).join('');
    $('hud-combo').textContent = S.combo || 0;
  }
  // 부엌 그림(600×420, 아래 가운데 맞춤)에서 그릇 위치를 찾아 애니메이션 상자를 놓는다
  function placeCookFx() {
    const st = $('stage').getBoundingClientRect(), w = st.width, h = st.height;
    const sc = Math.max(w / 600, h / 420), ox = (w - 600 * sc) / 2, oy = h - 420 * sc;
    const x = ox + 360 * sc, y = oy + 280 * sc, bw = 160 * .66 * sc;
    const fx = $('cook-fx'), W = bw * 1.7, H = bw * 1.9;
    Object.assign(fx.style, { left: (x - W / 2) + 'px', top: (y - H * .82) + 'px', width: W + 'px', height: H + 'px' });
  }
  function drawOutPet(mood) { $('opet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc()); }
  function placeOutPet(i, instant) {
    // 산책길 그림은 무대 비율에 맞춰 그리므로 칸 위치를 그대로 화면 비율로 옮긴다
    const st = $('stage').getBoundingClientRect(); const W = Math.max(200, Math.round(420 * st.width / Math.max(1, st.height)));
    const x = Scene.pathNodes(W, OUT.n)[i];
    const op = $('opet'); if (instant) op.style.transition = 'none';
    op.style.left = (x / W * 100) + '%'; if (instant) { void op.offsetWidth; op.style.transition = ''; }
  }
  function outReact(mood, anim) {
    drawOutPet(mood); const p = $('opet'); p.classList.remove('hop', 'shake', 'walking'); if (anim) { void p.offsetWidth; p.classList.add(anim); }
    clearTimeout(outReact.t); outReact.t = setTimeout(() => drawOutPet('idle'), 1500);
  }
  function nextQ() {
    cur = Prob.next(S.rot, S.review, S.total);
    const U = Prob.UNITS[cur.unit];
    const tag = $('qtag'); tag.textContent = `${U.sem}학기 · ${U.name}`; tag.classList.toggle('s1', U.sem === 1);
    $('qfig').innerHTML = cur.fig; $('qtext').innerHTML = cur.q;
    $('qtext').classList.toggle('long', cur.q.replace(/<[^>]+>/g, '').length > 34 || !!cur.fig);
    const box = $('choices'); box.innerHTML = ''; box.className = 'choices' + (cur.choices.length === 3 ? ' three' : '');
    cur.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (cur.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => answer(b, c); box.appendChild(b); });
    const qc = $('qcard'); qc.classList.remove('in'); void qc.offsetWidth; qc.classList.add('in');
    lock = false; renderOut(); save();
    if (level() === 'talk' && Math.random() < .2) setTimeout(() => { if (!lock) speak('out', lineFrom(LINES[S.kind].talk.unit[cur.unit], 'u' + cur.unit), { silent: true }); }, 700);
  }
  function answer(btn, c) {
    if (lock) return; lock = true;
    const ok = c === cur.ans; const st = S.stats[cur.unit] || (S.stats[cur.unit] = { c: 0, w: 0 });
    S.total++; const all = [...$('choices').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim'));
      st.c++; S.correct++; S.today++; S.combo++; S.best = Math.max(S.best, S.combo);
      const bonus = S.combo % 5 === 0 ? 1 : 0; S.candy += 1 + bonus; S.xp += 1 + bonus;
      const big = S.combo === 3 || S.combo === 5 || S.combo === 10 || (S.combo > 10 && S.combo % 5 === 0);
      if (big) { Snd.combo(); speak('out', line(S.combo === 3 ? 'c3' : S.combo === 5 ? 'c5' : 'c10')); const cw = $('hud-combo-wrap'); cw.classList.remove('hot'); void cw.offsetWidth; cw.classList.add('hot'); }
      else { Snd.ok(); speak('out', line(OUT.type === 'cook' ? 'cookOk' : 'walkOk')); }
      outReact('happy', 'hop'); sparks($('ofx'), S.combo >= 5 ? 16 : 10);
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === cur.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); });
      st.w++; S.combo = 0;
      if (!S.review.some(r => r.unit === cur.unit && r.type === cur.type)) S.review.push({ unit: cur.unit, type: cur.type, due: S.total + R(3, 6) });
      if (S.review.length > 12) S.review.shift();
      Snd.no(); speak('out', line(OUT.type === 'cook' ? 'cookNo' : 'walkNo', { a: cur.ans })); outReact('sad', 'shake');
    }
    OUT.res[OUT.step] = ok; OUT.step++; if (OUT.type === 'cook') OUT.anim = true; // 답을 고른 순간부터 애니메이션이 끝날 때까지 단계 이름을 바꾸지 않는다
    save(); renderOut();
    setTimeout(advance, ok ? 1300 : 2400);
  }
  function advance() {
    if (!$('scr-out').classList.contains('on')) return;
    if (OUT.type === 'cook') {
      // 방금 푼 단계의 동작을 보여 준 뒤 그릇을 채우고 다음 단계로
      const F = FOODS[OUT.id], st = F.steps[OUT.step - 1]; placeCookFx();
      OUT.anim = true; $('step-label').textContent = `${OUT.step}. ${st[0]}`;
      const T = CookFX.play($('cook-fx'), $('stage-bg'), st[1], st[2], F.color, OUT.res[OUT.step - 1]);
      // 재료가 그릇에 닿는 순간에 내용물이 늘어난다
      if (ADDS.includes(st[1])) setTimeout(() => { OUT.fill++; setFill(); Snd.pop(); }, T * CookFX.land(st[1]));
      setTimeout(() => {
        OUT.anim = false; renderOut();
        if (OUT.step >= OUT.n) { Snd.level(); outReact('happy', 'hop'); setTimeout(finishOut, CookFX.done($('cook-fx'), Scene.food(OUT.id))); }
        else nextQ();
      }, T);
    } else {
      placeOutPet(Math.min(OUT.step, OUT.n - 1)); const p = $('opet'); p.classList.remove('walking'); void p.offsetWidth; p.classList.add('walking');
      const P = PLACES[OUT.id];
      if (OUT.step === 3 || OUT.step === OUT.n) {
        const cand = P.finds.filter(k => !S.items.includes(k) && !OUT.finds.includes(k));
        const f = OUT.step === 3 ? cand[0] : cand[0] && Math.random() < .5 ? cand[0] : null;
        if (f) { OUT.finds.push(f); S.items.push(f); setTimeout(() => { speak('out', line('find', { x: ITEMS[f].name })); Snd.combo(); sparks($('ofx'), 12); }, 1200); }
        else if (OUT.step === 3) { S.candy += 3; setTimeout(() => speak('out', level() === 'talk' ? '반짝반짝! 별사탕 세 개를 주웠어!' : line('find')), 1200); }
      } else if (Math.random() < .5) setTimeout(() => speak('out', `<span style="color:#7A6283">(${pick(P.sights)})</span>`, { silent: true }), 1200);
      setTimeout(() => { if (OUT.step >= OUT.n) finishOut(); else nextQ(); }, OUT.step === 3 ? 2400 : 1300);
    }
  }
  function finishOut() {
    const good = OUT.res.filter(Boolean).length; let gets = [];
    const o = OUT;
    if (o.type === 'cook') {
      const stars = good >= 5 ? 3 : good >= 3 ? 2 : 1;
      S.foods[o.id] = (S.foods[o.id] || 0) + 1; addNeed('full', -5); addNeed('mood', 5); addFriend(3);
      S.log.push({ e: 'cook', id: o.id, stars, good });
      $('res-art').innerHTML = Scene.food(o.id);
      $('res-title').innerHTML = `${FOODS[o.id].name} 완성! <span class="stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></span>`;
      $('res-line').innerHTML = line('cookDone');
      gets = [`맞힌 문제 ${good} / ${o.n}`, `${FOODS[o.id].name} +1`];
      $('res-btns').innerHTML = `<button class="btn big primary" id="rb-feed">지금 먹여 주기</button><button class="btn" id="rb-home">냉장고에 넣기</button>`;
      $('res-gets').innerHTML = gets.map(g => `<span>${g}</span>`).join('');
      overlay('ov-result', true);
      $('rb-feed').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(() => runAct('feed', o.id)); };
      $('rb-home').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(); };
    } else {
      const P = PLACES[o.id]; const first = !S.known.place[o.id]; const ts = TASTE[S.kind].place[o.id]; S.known.place[o.id] = ts;
      addNeed('energy', -20); addNeed('clean', -15); addNeed('full', -12); addNeed('mood', ts === 'love' ? 25 : 12); addFriend(ts === 'love' ? 8 : 5);
      S.log.push({ e: 'walk', id: o.id, good, finds: o.finds.slice() });
      $('res-art').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
      $('res-title').textContent = `${P.name} 도착!`;
      $('res-line').innerHTML = level() === 'talk' ? fillJo(lineFrom(TASTE_LINE[S.kind].place[ts], 'tp'), '{x}', P.name) : line('arrive');
      gets = [`맞힌 문제 ${good} / ${o.n}`, ...o.finds.map(f => `${ITEMS[f].name} 얻음`)];
      if (first) gets.push('처음 와 본 곳!');
      $('res-gets').innerHTML = gets.map(g => `<span>${g}</span>`).join('');
      $('res-btns').innerHTML = `<button class="btn big primary" id="rb-home">집으로 가기</button>`;
      overlay('ov-result', true);
      $('rb-home').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(); };
      fulfill('place', o.id, 'out');
    }
    save();
  }
  function backHome(then) {
    enterHome('out');
    setTimeout(() => {
      if (S.stage < MAX_STAGE && S.xp >= STAGE_XP[S.stage + 1]) levelUp(then);
      else if (then) then();
    }, 500);
  }
  $('btn-home').onclick = () => {
    Snd.tap(); const b = $('btn-home');
    if (!b.dataset.arm) { b.dataset.arm = '1'; b.textContent = '정말 갈까요?'; setTimeout(() => { delete b.dataset.arm; b.textContent = '← 집으로'; }, 2500); return; }
    delete b.dataset.arm; b.textContent = '← 집으로'; backHome();
  };

  // ---------- 자랐어요 ----------
  let afterLevel = null;
  function levelUp(then) {
    S.stage++; afterLevel = then || null; save(); Snd.level();
    $('level-art').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    const la = $('level-art'); la.classList.remove('grow-in'); void la.offsetWidth; la.classList.add('grow-in');
    $('level-title').textContent = `${S.stage}단계 ${STAGE_NAME[S.kind][S.stage]}`;
    let msg = LV_MSG[S.kind][S.stage]; if (S.stage >= MAX_STAGE) msg += '<br><small>이제 친구가 이야기를 들려줄 수 있어요. 시험판은 5단계까지예요.</small>';
    $('level-line').innerHTML = msg; overlay('ov-level', true); S.log.push({ e: 'grow', stage: S.stage });
  }
  $('btn-level').onclick = () => {
    Snd.tap(); overlay('ov-level', false); renderHome(); react('happy', 'hop');
    if (S.stage < MAX_STAGE && S.xp >= STAGE_XP[S.stage + 1]) { setTimeout(() => levelUp(afterLevel), 400); return; }
    if (afterLevel) { const f = afterLevel; afterLevel = null; setTimeout(f, 300); }
    const ps = pendingStory(); if (ps != null && ps >= 0) setTimeout(() => toast('친구 수첩에 <b>새 이야기</b>가 열렸어요!'), 800);
  };

  // ---------- 이야기 ----------
  function playStory(i) {
    const st = STORY[S.kind][i]; let k = 0;
    $('story-title').textContent = `이야기 ${i + 1} · ${st.title}`;
    $('story-art').innerHTML = Art.draw(S.kind, S.stage, 'idle', showAcc());
    const showLine = () => { $('story-text').textContent = st.lines[k]; Snd.babble(1, S.kind); };
    showLine(); overlay('ov-story', true);
    $('ov-story').onclick = () => {
      k++; if (k < st.lines.length) { showLine(); if (k === st.lines.length - 1) $('story-art').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc()); return; }
      overlay('ov-story', false);
      if (!S.seen.includes(i)) { S.seen.push(i); addFriend(5); S.log.push({ e: 'story', i }); save(); }
      hud(); if ($('ov-book').classList.contains('on')) openBook(); else react('happy', 'hop');
    };
  }

  // ---------- 친구 수첩 ----------
  function openBook() {
    const tn = { love: '좋아해', like: '괜찮아', hate: '별로래' };
    const sec = (title, type, ids, nameOf, artOf) => `<div class="book-sec"><h4>${title}</h4><div class="book-items">${ids.map(id => { const k = S.known[type][id]; return `<span class="bi ${k ? '' : 'unk'}"><span class="bic">${artOf(id)}</span>${k ? nameOf(id) : '???'}${k ? `<em class="${k}">${tn[k]}</em>` : ''}</span>`; }).join('')}</div></div>`;
    const stories = STORY[S.kind].map((s, i) => {
      const open = S.flv >= s.lv && S.stage >= 5;
      return `<button class="story-btn ${open ? '' : 'lock'}" data-i="${i}" ${open ? '' : 'disabled'}><span>이야기 ${i + 1} · ${open ? s.title : '???'}</span><small>${open ? (S.seen.includes(i) ? '다시 듣기' : '새 이야기!') : S.stage < 5 ? '말을 하게 되면' : `우정 ${s.lv}단계`}</small></button>`;
    }).join('');
    $('book-title').textContent = `${NM()}의 수첩`;
    $('book-body').innerHTML =
      sec('좋아하는 간식', 'food', Object.keys(FOODS), id => FOODS[id].name, id => Scene.food(id)) +
      sec('좋아하는 장소', 'place', Object.keys(PLACES), id => PLACES[id].name, () => ICON.walk.replace(/#fff/g, '#55C3A3')) +
      sec('좋아하는 장식', 'acc', Object.keys(ITEMS).filter(k => ITEMS[k].kind === 'acc'), id => ITEMS[id].name, id => Scene.item(id)) +
      `<div class="book-sec"><h4>이야기</h4>${stories}</div>` +
      `<div class="book-sec"><h4>함께한 기록</h4><div class="book-items"><span class="bi">함께한 날 ${S.days}일</span><span class="bi">맞힌 문제 ${S.correct}개</span><span class="bi">최고 연속 ${S.best}번</span><span class="bi">우정 ${S.flv}단계</span></div></div>`;
    $('book-body').querySelectorAll('.story-btn:not(.lock)').forEach(b => b.onclick = () => { Snd.tap(); playStory(+b.dataset.i); });
    overlay('ov-book', true);
  }
  $('btn-book').onclick = () => { Snd.tap(); poked(); openBook(); };

  // ---------- 꾸미기 ----------
  let tab = 'acc';
  function openCloset(t) {
    tab = t || tab;
    document.querySelectorAll('#closet-tabs .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    const ids = Object.keys(ITEMS).filter(k => tab === 'shop' ? !S.items.includes(k) : ITEMS[k].kind === tab);
    $('closet-sub').innerHTML = tab === 'shop' ? `별사탕으로 주문할 수 있어요 · 가진 별사탕 <b>${S.candy}</b>개` : tab === 'acc' ? (S.stage < 3 ? '알에서 나오면 장식을 할 수 있어요' : '눌러서 친구에게 해 주세요') : '눌러서 방에 놓거나 치워요';
    $('item-grid').innerHTML = ids.length ? ids.map(k => {
      const I = ITEMS[k], own = S.items.includes(k), on = I.kind === 'acc' ? S.acc === k : S.decor.includes(k);
      let btn;
      if (tab === 'shop') btn = `<button class="btn ${S.candy >= I.price ? 'primary' : ''}" data-buy="${k}">별사탕 ${I.price}</button>`;
      else if (!own) btn = `<small style="color:#A893AE;text-align:center">산책에서 찾거나<br>주문해요</small>`;
      else btn = `<button class="btn ${on ? '' : 'primary'}" data-use="${k}" ${I.kind === 'acc' && S.stage < 3 ? 'disabled' : ''}>${on ? (I.kind === 'acc' ? '벗기' : '치우기') : (I.kind === 'acc' ? '해 주기' : '놓기')}</button>`;
      return `<div class="item ${own || tab === 'shop' ? '' : 'lock'} ${on && tab !== 'shop' ? 'on' : ''}"><span class="ia">${Scene.item(k)}</span><b>${I.name}</b>${btn}</div>`;
    }).join('') : '<p class="sub">모두 모았어요!</p>';
    $('item-grid').querySelectorAll('[data-use]').forEach(b => b.onclick = () => useItem(b.dataset.use));
    $('item-grid').querySelectorAll('[data-buy]').forEach(b => b.onclick = () => buyItem(b.dataset.buy));
    overlay('ov-closet', true);
  }
  document.querySelectorAll('#closet-tabs .tab').forEach(b => b.onclick = () => { Snd.tap(); openCloset(b.dataset.tab); });
  function useItem(k) {
    const I = ITEMS[k]; Snd.tap();
    if (I.kind === 'acc') {
      if (S.acc === k) S.acc = null;
      else {
        S.acc = k; const ts = TASTE[S.kind].acc[k]; const first = !S.known.acc[k]; S.known.acc[k] = ts;
        if (first) addFriend(ts === 'love' ? 6 : 2);
        overlay('ov-closet', false); renderHome(); react(ts === 'hate' ? 'sad' : 'happy', ts === 'hate' ? 'shake' : 'hop');
        speak('home', level() === 'talk' ? fillJo(lineFrom(TASTE_LINE[S.kind].acc[ts], 'ta'), '{x}', I.name) : (ts === 'hate' ? line('no') : line('ok')));
        S.log.push({ e: 'wear', id: k }); save(); return;
      }
    } else {
      if (S.decor.includes(k)) S.decor = S.decor.filter(x => x !== k); else { S.decor.push(k); S.log.push({ e: 'decor', id: k }); }
    }
    save(); renderHome(); openCloset();
  }
  function buyItem(k) {
    const I = ITEMS[k];
    if (S.candy < I.price) { toast(`별사탕이 ${I.price - S.candy}개 더 필요해요. 나들이에서 문제를 풀어 모아요!`); return; }
    S.candy -= I.price; S.items.push(k); Snd.combo(); toast(`<b>${I.name}</b>${bat(I.name) ? '이' : '가'} 도착했어요!`); save(); hud(); openCloset(I.kind === 'acc' ? 'acc' : 'decor');
  }
  $('btn-closet').onclick = () => { Snd.tap(); poked(); openCloset('acc'); };

  // ---------- 일기 ----------
  function diaryText(log) {
    const talk = level() === 'talk', you = talk ? '너랑 ' : '';
    const out = [];
    const cook = log.filter(e => e.e === 'cook'), walk = log.filter(e => e.e === 'walk'), feed = log.filter(e => e.e === 'feed'), finds = walk.flatMap(w => w.finds || []);
    if (!talk) out.push(`(${NM()}의 그림일기를 대신 써 줬어요)`);
    walk.forEach(w => out.push(`${you}${PLACES[w.id].name}에 산책을 갔${talk ? '어.' : '어요.'}`));
    finds.forEach(f => out.push(`${obj(ITEMS[f].name)} 주웠${talk ? '어! 보물이야.' : '어요.'}`));
    cook.forEach(c => out.push(`${you}${obj(FOODS[c.id].name)} 만들었${talk ? '어.' : '어요.'}`));
    feed.forEach(f => out.push(talk ? (f.ts === 'love' ? `${FOODS[f.id].name}… 정말 정말 맛있었어!` : f.ts === 'hate' ? `${FOODS[f.id].name}${bat(FOODS[f.id].name) ? '은' : '는'} 사실 좀 별로였어. 헤헤.` : `${obj(FOODS[f.id].name)} 먹었어. 맛있었어.`) : `${obj(FOODS[f.id].name)} 먹었어요.`));
    if (log.some(e => e.e === 'allwish')) out.push(talk ? '내 바람을 전부 들어줬어. 세상에서 제일 행복한 하루!' : '바람을 모두 들어줬어요!');
    else if (log.some(e => e.e === 'wish')) out.push(talk ? '내 바람을 들어줘서 고마웠어.' : '바람을 들어줬어요.');
    if (log.some(e => e.e === 'grow')) out.push(talk ? '그리고… 나 오늘 자랐어!' : '오늘 쑥 자랐어요!');
    if (log.some(e => e.e === 'cry')) out.push(talk ? (log.some(e => e.e === 'makeup') ? '누가 나를 막 두드려서 엉엉 울었어… 그래도 살살 쓰다듬어 줘서 금방 나았어.' : '누가 나를 막 두드려서 엉엉 울었어. 다음엔 살살 해 줘.') : '세게 두드려서 울었어요.');
    const n = log.filter(e => e.e === 'cook' || e.e === 'walk').reduce((s, e) => s + (e.good || 0), 0);
    if (n) out.push(talk ? `오늘 우리 문제를 ${n}개나 맞혔어.` : `문제를 ${n}개 맞혔어요.`);
    if (out.length <= (talk ? 0 : 1)) return talk ? '오늘은 조용한 하루였어. 내일은 같이 나들이 가자!' : '(조용한 하루였어요)';
    out.push(talk ? '내일도 같이 놀자!' : '(내일도 또 와 주세요)');
    return out.join(' ');
  }
  function openDiary() {
    const today = { day: S.day, text: diaryText(S.log) };
    const fmt = (d) => { const p = d.split('-'); return `${p[1]}월 ${p[2]}일`; };
    $('diary-title').textContent = `${NM()}의 일기`;
    $('diary-body').innerHTML = [today, ...S.diary].map((d, i) => `<div class="diary-page"><h4>${fmt(d.day)}${i === 0 ? ' · 오늘' : ''}</h4>${d.text}</div>`).join('');
    overlay('ov-diary', true);
  }
  $('btn-diary').onclick = () => { Snd.tap(); poked(); openDiary(); };

  // ---------- 설정 ----------
  function syncSet() { $('t-sound').setAttribute('aria-pressed', !!S.sound); $('t-lowfx').setAttribute('aria-pressed', !!S.lowfx); }
  let resetArm = false;
  $('btn-set').onclick = () => { Snd.tap(); syncSet(); resetArm = false; $('btn-reset').textContent = '다시 하기'; overlay('ov-set', true); };
  $('btn-set-close').onclick = () => { Snd.tap(); overlay('ov-set', false); };
  $('t-sound').onclick = () => { S.sound = !S.sound; applyFx(); syncSet(); save(); Snd.tap(); };
  $('t-lowfx').onclick = () => { S.lowfx = !S.lowfx; applyFx(); syncSet(); save(); Snd.tap(); };
  $('btn-reset').onclick = () => {
    if (!resetArm) { resetArm = true; $('btn-reset').textContent = '정말요? 한 번 더'; return; }
    const keep = { sound: S.sound, lowfx: S.lowfx }; S = Object.assign(fresh(), keep); save();
    overlay('ov-set', false); clearTimeout(wanderT); clearTimeout(idleT); toast('처음부터 다시 시작해요'); openChoose();
  };
  window.addEventListener('pagehide', () => { if (S.kind) { S.last = Date.now(); save(); } });
  window.addEventListener('resize', () => { if (OUT && OUT.type === 'walk' && $('scr-out').classList.contains('on')) { $('stage-bg').dataset.place = ''; renderOut(); placeOutPet(Math.min(OUT.step, OUT.n - 1), true); } });
})();
