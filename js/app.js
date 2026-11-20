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
    seen: [], log: [], diary: [], pokeToday: 0
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
    if (v.x != null) t = t.split('{x}').join(v.x);
    if (v.a != null) { if (t.includes('{a}')) t = t.replace('{a}', v.a); else t += `<br><small style="font-size:.8em;color:#7A6283">정답은 ${v.a}</small>`; }
    return t;
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
  const wishText = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어 해요` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어 해요` : { pet: '쓰다듬어 주길 바라요', bath: '씻고 싶어 해요', play: '같이 놀고 싶어 해요', nap: '낮잠을 자고 싶어 해요' }[w.id];
  const wishSay = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어…` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어!` : CARE[w.id].wish;

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
    $('room-bg').innerHTML = Scene.room(S.kind, S.decor, isNight());
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
    $('think').innerHTML = w && !sleeping ? `<span class="ti">${wishIcon(w)}</span><span>${w.t === 'food' ? FOODS[w.id].name : w.t === 'place' ? PLACES[w.id].name : CARE[w.id].name}</span>` : '';
  }
  function renderCare() {
    const items = [['feed', '먹이기'], ['bath', '목욕'], ['play', '놀이'], ['nap', '낮잠']];
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
      else if (sleeping) wk.style.left = '34%';
      else if (S.stage >= 3 || Math.random() < .3) {
        const cur = parseFloat(wk.style.left) || 55; let nx = R(30, 80); if (Math.abs(nx - cur) < 8) nx = cur > 55 ? cur - 20 : cur + 20;
        wk.style.left = nx + '%';
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
    wk.classList.add('run'); wk.classList.toggle('egg', S.stage <= 2);
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

  let actClean = [];
  function actSay(t) { const b = $('act-bubble'); b.querySelector('span').innerHTML = t; b.style.display = 'flex'; }
  function actPet(mood) { $('act-pet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc()); }
  function runAct(id, foodId) {
    const room = $('act-room'), field = $('act-field'), bottom = $('act-bottom');
    room.classList.remove('dark'); bottom.innerHTML = ''; $('act-bubble').style.display = 'none';
    field.querySelectorAll('.bub,.zz,.spark,.float-heart').forEach(e => e.remove());
    const meter = $('act-meter'); meter.style.display = 'none'; meter.firstElementChild.style.width = '0';
    actPet('idle');
    $('act-title').textContent = id === 'feed' ? `${FOODS[foodId].name} 먹이기` : id === 'pet' && S.stage <= 2 ? '알 데우기' : CARE[id].name;
    overlay('ov-act', true);
    let done = false;
    const finish = () => {
      if (done) return; done = true; actClean.forEach(f => f()); actClean = []; room.classList.remove('dark');
      let ln = '', mood = 'happy';
      if (id === 'feed') {
        const ts = TASTE[S.kind].food[foodId]; S.known.food[foodId] = ts;
        addNeed('full', ts === 'love' ? 45 : 35); addNeed('mood', ts === 'love' ? 25 : ts === 'hate' ? 0 : 12);
        addFriend(ts === 'love' ? 8 : ts === 'hate' ? 1 : 4); if (ts === 'hate') mood = 'sad';
        ln = level() === 'talk' ? lineFrom(TASTE_LINE[S.kind].food[ts], 'tf' + ts).split('{x}').join(FOODS[foodId].name) : (ts === 'hate' ? line('no') : line('ok'));
        if (level() !== 'talk' && ts === 'love') ln += '<br><small style="font-size:.8em;color:#7A6283">엄청 좋아하는 것 같아요!</small>';
        if (level() !== 'talk' && ts === 'hate') ln += '<br><small style="font-size:.8em;color:#7A6283">별로 안 좋아하는 것 같아요</small>';
        S.foods[foodId]--; S.log.push({ e: 'feed', id: foodId, ts }); fulfill('food', foodId, 'act');
      } else {
        if (id === 'bath') addNeed('clean', 100); if (id === 'nap') addNeed('energy', 100);
        if (id === 'play') { addNeed('mood', 25); addNeed('energy', -10); } if (id === 'pet') addNeed('mood', 15);
        addFriend(3); S.log.push({ e: 'care', id }); fulfill('care', id, 'act');
        ln = level() === 'talk' ? lineFrom(LINES[S.kind].talk.act[{ bath: 'bubble', play: 'bubble', nap: 'nap', pet: 'pet' }[id]], 'act' + id) : line('ok');
        if (id === 'bath' && level() === 'talk') ln = S.kind === 'bunny' ? '뽀송뽀송! 털이 보들보들해졌어!' : '뽀송뽀송! 하얀 구름으로 돌아왔어!';
      }
      actPet(mood); Snd.heart(); if (mood === 'happy') sparks(field, 14);
      actSay(ln); if (level() !== 'egg') Snd.babble(2, S.kind);
      save();
      setTimeout(() => { overlay('ov-act', false); sleeping = false; renderHome(); react(mood, mood === 'happy' ? 'hop' : null); }, 2600);
    };
    const tm = setTimeout(finish, 30000); actClean.push(() => clearTimeout(tm));
    ({ feed: actFeed, pet: actRub, bath: actBubble, play: actBubble, nap: actNap })[id](field, bottom, finish, id, foodId);
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
        s.classList.add('gone'); Snd.munch(); actPet('happy'); setTimeout(finish, 700);
      } else s.style.transform = '';
    };
    s.addEventListener('pointerup', up); s.addEventListener('pointercancel', up);
    bottom.appendChild(s);
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
  function actNap(field, bottom, finish) {
    $('act-hint').textContent = '이불을 덮어 재워 줘요';
    const b = document.createElement('button'); b.className = 'btn big'; b.innerHTML = `<span style="display:inline-flex;width:34px;height:34px;vertical-align:middle;margin-right:8px">${Art.icon('moon')}</span>이불 덮어 주기`;
    b.onclick = () => {
      b.remove(); $('act-room').classList.add('dark'); actPet('sleep'); Snd.lullaby(); $('act-hint').textContent = '쉿, 새근새근…';
      const p = $('act-pet').getBoundingClientRect(), fr = field.getBoundingClientRect(); let k = 0;
      const iv = setInterval(() => { const z = document.createElement('div'); z.className = 'zz'; z.textContent = 'z'; z.style.left = (p.left - fr.left + p.width * .62) + 'px'; z.style.top = (p.top - fr.top + p.height * .2) + 'px'; field.appendChild(z); setTimeout(() => z.remove(), 2500); if (++k > 6) clearInterval(iv); }, 650);
      actClean.push(() => clearInterval(iv)); const t = setTimeout(finish, 5000); actClean.push(() => clearTimeout(t));
    };
    bottom.appendChild(b);
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
  $('btn-walk').onclick = () => { Snd.tap(); poked(); if (S.needs.energy < 15 && S.stage >= 3) { speak('home', level() === 'talk' ? line('sleepy') : line('idle')); toast('너무 졸려 해요. <b>낮잠</b>을 먼저 재워 줄까요?'); return; } openWalk(); };

  function startCook(id) { OUT = { type: 'cook', id, step: 0, n: 5, res: [], finds: [] }; beginOut(); }
  function startWalk(id) { OUT = { type: 'walk', id, step: 0, n: 6, res: [], finds: [] }; beginOut(); }
  function beginOut() {
    clearTimeout(wanderT); clearTimeout(idleT); if (sulking) { sulking = false; clearTimeout(sulkT); $('walker').classList.remove('sulk'); }
    show('scr-out'); S.combo = 0;
    const st = $('stage'); st.classList.toggle('cooking', OUT.type === 'cook');
    $('out-title').textContent = OUT.type === 'cook' ? `${FOODS[OUT.id].name} 만들기` : `${PLACES[OUT.id].name} 산책`;
    $('stage-bg').dataset.place = '';
    drawOutPet('idle'); renderOut(); speak('out', line(OUT.type === 'cook' ? 'cookStart' : 'walkStart'));
    if (OUT.type === 'walk') placeOutPet(0, true); else $('opet').style.left = '';
    nextQ();
  }
  function renderOut() {
    if (OUT.type === 'cook') {
      const F = FOODS[OUT.id];
      $('stage-bg').innerHTML = Scene.kitchen(OUT.step / OUT.n, F.color, OUT.step >= OUT.n);
      $('step-label').textContent = OUT.step < OUT.n ? `${OUT.step + 1}. ${F.steps[OUT.step]}` : '완성!';
    } else if ($('stage-bg').dataset.place !== OUT.id) {
      const r = $('stage').getBoundingClientRect();
      $('stage-bg').innerHTML = Scene.path(OUT.id, OUT.n, false, r.width / Math.max(1, r.height)); $('stage-bg').dataset.place = OUT.id;
    }
    $('steps').innerHTML = Array.from({ length: OUT.n }, (_, i) => `<i class="${OUT.res[i] === true ? 'ok' : OUT.res[i] === false ? 'no' : i === OUT.step ? 'cur' : ''}"></i>`).join('');
    $('hud-combo').textContent = S.combo || 0;
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
    const box = $('choices'); box.innerHTML = ''; box.className = 'choices' + (cur.choices.length === 3 ? ' c3' : '');
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
    OUT.res[OUT.step] = ok; OUT.step++;
    save(); renderOut();
    setTimeout(advance, ok ? 1300 : 2400);
  }
  function advance() {
    if (!$('scr-out').classList.contains('on')) return;
    if (OUT.type === 'cook') {
      const d = $('drop'); d.style.background = FOODS[OUT.id].color; d.classList.remove('go'); void d.offsetWidth; d.classList.add('go'); Snd.pop();
      setTimeout(() => { renderOut(); if (OUT.step >= OUT.n) finishOut(); else nextQ(); }, 650);
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
      $('res-line').innerHTML = level() === 'talk' ? lineFrom(TASTE_LINE[S.kind].place[ts], 'tp').split('{x}').join(P.name) : line('arrive');
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
        speak('home', level() === 'talk' ? lineFrom(TASTE_LINE[S.kind].acc[ts], 'ta').split('{x}').join(I.name) : (ts === 'hate' ? line('no') : line('ok')));
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
