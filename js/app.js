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
  if (S.acc) { S.wear = S.wear || {}; const SL = { flower: 'head', crown: 'head', berryhat: 'head', phat: 'head', bow: 'head', scarf: 'neck' }; S.wear[SL[S.acc] || 'head'] = S.acc; S.acc = null; }

  // ---------- 친구 정보 ----------
  const MAX_STAGE = 10;
  const STAGE_XP = [0, 0, 5, 15, 35, 70, 115, 170, 235, 310, 400];
  const STAGE_NAME = { cloud: ['', '별빛 알', '톡톡 알', '솜뭉치', '몽글 구름', '새싹 날개', '무지개 구름', '금빛 날개 구름', '달빛 구름', '오로라 구름', '하늘 수호 구름'], bunny: ['', '딸기 알', '톡톡 알', '솜털 아기', '깡총 토끼', '리본 토끼', '클로버 토끼', '달님 토끼', '요정 날개 토끼', '별꼬리 토끼', '별나라 수호 토끼'] };
  const NAMES = { cloud: ['몽실', '구름이', '솜이', '포근이', '뭉게'], bunny: ['콩이', '딸기', '보리', '말랑이', '토토'] };
  const LV_MSG = {
    cloud: ['', '', '알에 금이 갔어요! 누군가 빼꼼 내다봐요.', '알에서 나왔어요! 첫마디는 "몽!"', '"좋아!" 처음으로 말을 했어요.', '"나 날개가 생겼어! 이제 하고 싶은 말 다 할 수 있어!"',
      '"내 뒤에 무지개가 떴어! 비 온 뒤처럼 마음이 반짝반짝해."', '"날개가 금빛으로 바뀌었어! 이제 더 높이 날 수 있어."', '"머리 위에 달님이 내려앉았어. 밤에도 무섭지 않아."', '"오로라 꼬리가 생겼어! 하늘에서 제일 예쁜 색이야."', '"하늘 수호 구름이 됐어! 이 왕관은 너랑 같이 받은 거야."'],
    bunny: ['', '', '알에 금이 가고 발이 쏙 나왔어요!', '알에서 나왔어요! 첫마디는 "콩!"', '"깡총!" 귀가 쭉 자랐어요.', '"리본 예쁘지? 나 이제 말 잘해!"',
      '"네잎클로버를 찾았어! 행운이 우리한테 올 거야."', '"이마에 달 모양이 생겼어. 나 진짜 달토끼 같지?"', '"등에 작은 날개가 생겼어! 깡총 뛰면 둥실 떠."', '"꼬리가 별처럼 반짝여! 어두워도 길을 찾을 수 있어."', '"별나라 수호 토끼가 됐어! 왕관은 너랑 나랑 같이 쓴 거야."']
  };
  const level = () => (S.stage <= 2 ? 'egg' : S.stage === 3 ? 'babble' : S.stage === 4 ? 'word' : 'talk');
  const bat = (w) => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0; };
  const NM = () => S.name + (bat(S.name) ? '이' : ''); // 몽실 → 몽실이, 콩이 → 콩이
  const obj = (w) => w + (bat(w) ? '을' : '를');
  const SC = (t) => `<i class="sc">★${t}</i>`;
  const showAcc = () => (S.stage >= 3 ? { wear: S.wear || {}, tint: S.tint || 'base', col: S.wcol || {}, dirt: S.needs && S.needs.clean < 65 ? Math.min(1, Math.round((65 - S.needs.clean) / 5) / 10) : 0 } : null);
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; };
  const isNight = () => { const h = new Date().getHours(); return h >= 18 || h < 6; };

  // ---------- 화면 ----------
  function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }
  function overlay(id, on) { $(id).classList.toggle('on', on); }
  document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => { Snd.tap(); overlay(b.dataset.close, false); });
  function toast(t) { const el = $('toast'); el.innerHTML = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2400); }
  function applyFx() { document.body.classList.toggle('lowfx', !!S.lowfx); Snd.set(!!S.sound); Snd.musicSet(S.music !== false); }
  function applyTime() { document.body.classList.toggle('night', isNight()); }
  applyFx(); applyTime();
  window.addEventListener('pointerdown', () => Snd.unlock(), { passive: true });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- 말하기 ----------
  const lastLine = {};
  // 지금 상황(낮·밤, 날씨, 계절, 산책 장소)에 맞지 않는 대사는 고르지 않는다
  function ctxOK(t) {
    if (typeof t !== 'string') return true;
    const h = new Date().getHours(), mo = new Date().getMonth() + 1, W = S.weather;
    const night = isNight() || (typeof OUT !== 'undefined' && OUT && OUT.type === 'walk' && OUT.id === 'hill');
    if (!night && /별빛|별이 반짝|별 세|별 하나 떴|별들이|달님|밤하늘|깜깜|잘 자|별 보러|반딧불/.test(t)) return false;
    if (night && /햇님|햇살|해님|좋은 아침|아침이|점심|낮잠|파란 하늘|맑은 하늘/.test(t)) return false;
    if ((h < 16 || h >= 20) && /노을|저녁/.test(t)) return false;
    if (h >= 12 && /좋은 아침|아침이|아침 하늘/.test(t)) return false;
    if (W !== 'rain' && /비가 (와|오|내)|빗소리|비다!|비 싫어|다 젖었/.test(t)) return false;
    if (W !== 'snow' && /눈이 (와|온|펑)|하얀 눈|눈이다/.test(t)) return false;
    if (W !== 'rainbow' && /무지개다!/.test(t)) return false;
    if ((W !== 'sun' || night) && /햇님이 반짝|해님이다/.test(t)) return false;
    if (!(mo >= 3 && mo <= 5) && /봄바람|꽃잎이 날아/.test(t)) return false;
    if (!(mo >= 6 && mo <= 8) && /더워서|덥다|부채처럼/.test(t)) return false;
    if (!(mo >= 9 && mo <= 11) && /하늘이 높아|낙엽|단풍/.test(t)) return false;
    if (!(mo === 12 || mo <= 2) && /차가워졌|목도리 있으면|추워/.test(t)) return false;
    return true;
  }
  function lineFrom(arr, key) {
    if (!arr || !arr.length) return '';
    { const ok = arr.filter(ctxOK); if (ok.length) arr = ok; }
    let t, n = 0; do { t = pick(arr); n++; } while (arr.length > 1 && t === lastLine[key] && n < 6);
    lastLine[key] = t; return t;
  }
  const POS = ['wishDone', 'allWish', 'cookStart', 'cookOk', 'sewOk', 'cookDone', 'walkStart', 'walkOk', 'find', 'arrive', 'welcome', 'happy', 'wear', 'ok', 'c3', 'c5', 'c10', 'poke'];
  // 대사 고르기: 5단계부터 문장, 그 전에는 몸짓·옹알이
  function line(cat, v = {}) {
    const lv = level(); let t;
    if (lv === 'talk') {
      const a = (LINES2[S.kind][cat]) || (LINES[S.kind].talk[cat]);
      t = lineFrom(a || LINES[S.kind].talk.idle, cat);
    } else {
      const pack = LINES[S.kind][lv];
      const neg = ['cookNo', 'walkNo', 'sewNo', 'no'].includes(cat);
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
    b._who = opt.who === 'N' ? $('nbw') : opt.emo === 'visitor' ? $('visitor') : where === 'out' ? $('opet') : $('walker');
    $('walker').classList.toggle('talking', where === 'home'); followBubbles();
    b.classList.toggle('act', html.startsWith('('));
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    const lv = level();
    if (!opt.silent) { if (lv === 'babble' || lv === 'word') Snd.babble(lv === 'babble' ? 2 : 3, S.kind); else if (lv === 'talk') Snd.babble(1, S.kind); }
    if (where === 'home') { clearTimeout(speak.t); speak.t = setTimeout(() => { b.classList.add('hide'); $('walker').classList.remove('talking'); }, 6500); }
    if (!opt.noEmo) emoteText(opt.emo || (opt.who === 'N' ? 'nbw' : where === 'out' ? 'out' : 'home'), html);
  }
  // 말풍선 위치: 말하는 캐릭터 머리 바로 위. 화면 밖으로 나가지 않게 막고, 꼬리는 머리를 가리킨다
  function placeBubble(b) {
    const host = b.parentElement, who = b._who; if (!host || !who || who.style.display === 'none') return;
    const hr = host.getBoundingClientRect(); if (!hr.width) return;
    const art = who.querySelector('svg') || who, tr = (who.id === 'walker' ? $('pet') : who).getBoundingClientRect();
    const headX = tr.left + tr.width / 2 - hr.left, headY = tr.top - hr.top + tr.height * (who.id === 'nbw' ? .02 : .1);
    const bw = b.offsetWidth, bh = b.offsetHeight;
    const left = Math.max(8, Math.min(hr.width - bw - 8, headX - bw / 2));
    const top = Math.max(8, headY - bh - 16);
    b.style.left = left + 'px'; b.style.top = top + 'px'; b.style.right = 'auto';
    b.style.setProperty('--tx', Math.max(22, Math.min(bw - 22, headX - left)) + 'px');
    b.classList.toggle('below', headY - bh - 16 < 8 && false);
  }
  function followBubbles() {
    if (followBubbles.on) return; followBubbles.on = true;
    const tick = () => {
      let any = false;
      [['bubble', 'scr-home'], ['obubble', 'scr-out']].forEach(([id, scr]) => {
        const b = $(id); if ($(scr).classList.contains('on') && !b.classList.contains('hide') && b._who) { placeBubble(b); any = true; }
      });
      if (any) requestAnimationFrame(tick); else followBubbles.on = false;
    };
    requestAnimationFrame(tick);
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
  const EGG_WISH = () => [{ t: 'care', id: 'pet', done: false }, { t: 'care', id: 'sing', done: false }];
  const EGG_CARE = ['pet', 'warm', 'cool', 'sing'];
  // 알 단계에는 쓰다듬기 바람만, 알을 깨고 나오면 그날 바람을 새로 만든다
  function fixWishes() {
    if (!S.wishes) return;
    const eggOnly = S.wishes.length && S.wishes.every(w => w.t === 'care' && EGG_CARE.includes(w.id));
    if (S.stage <= 2 && !eggOnly) S.wishes = EGG_WISH().map(w => Object.assign(w, { done: S.wishes.some(x => x.t === 'care' && x.id === w.id && x.done) }));
    else if (S.stage >= 3 && eggOnly) S.wishes = [{ t: 'food', id: pick(Object.keys(FOODS)), done: false }, { t: 'place', id: pick(Object.keys(PLACES)), done: false }, { t: 'care', id: pick(Object.keys(CARE).filter(k => k !== 'pet')), done: false }];
  }
  function newDay() {
    const t = todayStr();
    if (S.day === t) return;
    if (S.day && S.log.length) { S.diary.unshift({ day: S.day, text: diaryText(S.log, S.day) }); S.diary = S.diary.slice(0, 14); }
    S.ylog = S.day ? (S.log || []).slice(-30) : []; S.day = t; S.today = 0; S.log = []; S.pokeToday = 0; S.days++;
    { const mo = new Date().getMonth() + 1, winter = mo === 12 || mo <= 2; S.weather = pick(winter ? ['sun', 'sun', 'snow', 'snow', 'rain'] : ['sun', 'sun', 'sun', 'rain', 'rain', 'rainbow']); }
    const f = pick(Object.keys(FOODS)), p = pick(Object.keys(PLACES)), c = pick(Object.keys(CARE));
    S.wishes = S.stage <= 2 ? EGG_WISH() : [{ t: 'food', id: f, done: false }, { t: 'place', id: p, done: false }, { t: 'care', id: c, done: false }];
    save();
  }
  // 알이 있는 방의 온도: 밤·겨울·비·눈이면 서늘, 해 쨍쨍 여름이면 따끈. 둥지가 포근할수록 덜 식는다
  function eggEnv() {
    const mo = new Date().getMonth() + 1; let t = 50;
    if (isNight()) t -= 14; if (mo === 12 || mo <= 2) t -= 14; else if (mo >= 6 && mo <= 8) t += 14;
    if (S.weather === 'sun' && !isNight()) t += 8; else if (S.weather === 'rain') t -= 6; else if (S.weather === 'snow') t -= 12;
    return t + [0, 5, 9][S.nest || 0];
  }
  const eggTempOk = () => S.temp == null || (S.temp >= 30 && S.temp <= 70);
  function tickNeeds() {
    const now = Date.now(), h = Math.min(48, (now - (S.needT || now)) / 3600000);
    const N = S.needs;
    N.full = clamp(N.full - 6 * h, 15, 100); N.clean = clamp(N.clean - 4 * h, 15, 100);
    N.mood = clamp(N.mood - 3 * h, 20, 100);
    N.energy = S.asleep ? clamp(N.energy + 12 * h, 0, 100) : clamp(N.energy - 4 * h, 10, 100); // 기운은 잘 때만 오른다
    if (S.stage <= 2) { N.full = N.clean = N.energy = 100; // 알은 먹거나 씻거나 자지 않는다. 대신 따뜻함이 바뀐다
      if (S.temp == null) S.temp = 50;
      const tg = eggEnv(), rate = [8, 6, 4][S.nest || 0] * h, d = tg - S.temp;
      S.temp = clamp(S.temp + Math.sign(d) * Math.min(Math.abs(d), rate), 0, 100);
    }
    S.needT = now;
  }
  // 기운이 25보다 낮으면 스르르 잠들고, 자는 동안 기운이 차서 가득 차면 깬다
  function syncSleep() {
    if (!S.asleep && S.stage >= 3 && S.needs.energy < 25) S.asleep = true;
    if (S.asleep && (S.needs.energy >= 100 || S.stage < 3)) S.asleep = false;
    const z = !!S.asleep; if (z === sleeping) return false; sleeping = z; return true;
  }
  // 하루 한도: 같은 활동으로 우정이 끝없이 오르지 않게 (날이 바뀌면 다시)
  function dayCap(key, n) {
    if (!S.cap || S.cap.day !== S.day) S.cap = { day: S.day };
    if ((S.cap[key] || 0) >= n) return false; S.cap[key] = (S.cap[key] || 0) + 1; return true;
  }
  // ---------- 성장 조건 ----------
  // 단원별 최근 5문제 정답 기록 (1=맞힘)
  function rec(u, ok) { if (!u || !Prob.UNITS[u]) return 0; S.ur = S.ur || {}; const a = S.ur[u] || (S.ur[u] = []); a.push(ok ? 1 : 0); if (a.length > 5) a.shift(); return 0; }
  const unitGood = (u, n) => ((S.ur || {})[u] || []).reduce((a, b) => a + b, 0) >= n;
  // 약한 단원: 2번 넘게 풀었는데 최근 정답이 3개가 안 되는 단원 → 더 자주 낸다
  const weakUnits = () => Object.keys(Prob.UNITS).filter(u => { const a = (S.ur || {})[u] || []; return a.length >= 2 && a.reduce((x, y) => x + y, 0) < Math.min(3, a.length); });
  // 단계별 조건: f=우정 단계, d=함께한 날, u=[학기(0=모두), 최근 5문제 중 맞힌 수]
  const GROW = { 4: { f: 2, d: 2 }, 5: { f: 3, d: 4 }, 6: { f: 4, d: 7, u: [1, 3] }, 7: { f: 5, d: 10, u: [2, 3] }, 8: { f: 6, d: 14, u: [0, 3] }, 9: { f: 8, d: 19, u: [0, 4] }, 10: { f: 10, d: 25, u: [0, 4] } };
  function growChecks(st) {
    const g = GROW[st] || {}, out = [{ k: 'xp', t: '자라기 막대 가득 채우기', ok: S.xp >= STAGE_XP[st] }];
    if (st <= 3) out.push({ k: 't', t: '알을 알맞게 따뜻하게 해 주기', ok: eggTempOk(), now: S.temp < 30 ? '지금 추워요' : S.temp > 70 ? '지금 더워요' : '' });
    if (g.f) out.push({ k: 'f', t: `우정 ${g.f}단계 되기`, ok: S.flv >= g.f, now: `지금 ${S.flv}단계` });
    if (g.d) out.push({ k: 'd', t: `함께한 날 ${g.d}일`, ok: S.days >= g.d, now: `지금 ${S.days}일` });
    if (g.u) {
      const us = Object.keys(Prob.UNITS).filter(u => !g.u[0] || Prob.UNITS[u].sem === g.u[0]), bad = us.filter(u => !unitGood(u, g.u[1]));
      out.push({ k: 'u', t: `${g.u[0] ? g.u[0] + '학기' : '모든'} 단원 골고루 잘하기`, ok: !bad.length, now: bad.length ? `더 풀어 볼 단원: ${bad.slice(0, 2).map(u => Prob.UNITS[u].name).join(', ')}${bad.length > 2 ? ` 외 ${bad.length - 2}개` : ''}` : '' });
    }
    if (st >= 4) { const N = S.needs, low = [['full', '배부름'], ['clean', '깨끗함'], ['energy', '기운']].filter(([k]) => N[k] < 40); out.push({ k: 'h', t: '배부름·깨끗함·기운 넉넉히', ok: !low.length, now: low.length ? `부족: ${low.map(x => x[1]).join(', ')}` : '' }); }
    return out;
  }
  const canGrow = () => S.stage < MAX_STAGE && growChecks(S.stage + 1).every(c => c.ok);
  // 막대는 찼는데 다른 조건이 남았을 때: 하루에 한 번 알려 준다
  function growHint() {
    if (S.stage >= MAX_STAGE || S.xp < STAGE_XP[S.stage + 1] || canGrow()) return;
    const key = S.day + '-' + S.stage; if (S.growHint === key) return; S.growHint = key; save();
    const miss = growChecks(S.stage + 1).filter(c => !c.ok);
    setTimeout(() => {
      if (miss.length === 1 && miss[0].k === 'h' && level() === 'talk') speak('home', S.needs.full < 40 ? '배고파서 못 자라겠어… 맛있는 거 먹고 싶어.' : S.needs.clean < 40 ? '몸이 찝찝해서 못 자라겠어… 씻고 싶어.' : '졸려서 못 자라겠어… 푹 자고 싶어.');
      toast('자랄 준비가 거의 됐어요! 위쪽 <b>자라기</b>를 눌러 남은 조건을 봐요');
    }, 1500);
  }
  function addNeed(k, v) { S.needs[k] = clamp(S.needs[k] + v, 0, 100); }
  function lowNeed() { const N = S.needs; if (N.full < 35) return 'hungry'; if (N.clean < 35) return 'dirty'; if (N.energy < 30) return 'sleepy'; return null; }

  // ---------- 우정 ----------
  function addFriend(v) {
    S.fxp += v; let up = false;
    while (S.flv < FRIEND_XP.length - 1 && S.fxp >= FRIEND_XP[S.flv + 1]) { S.flv++; up = true; }
    if (up) { Snd.level(); setTimeout(() => toast(`우정이 <b>${S.flv}단계</b>가 됐어요!`), 400); if (S.flv >= 3 && !S.atticNoted) { S.atticNoted = true; setTimeout(() => { toast('<b>다락방</b>이 열렸어요! 방 오른쪽 위 버튼으로 올라가 봐요'); if ($('scr-home').classList.contains('on')) renderRoomNav(); }, 2800); } }
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
    $('name-input').value = '';
    NAMES[choice].forEach(n => { const b = document.createElement('button'); b.className = 'name-chip-btn'; b.textContent = n;
      b.onclick = () => { nameSel = n; Snd.tap(); [...$('name-chips').children].forEach(x => x.classList.toggle('sel', x === b)); $('name-input').value = ''; $('btn-name').disabled = false; };
      $('name-chips').appendChild(b); });
    show('scr-name');
  }
  // 직접 짓는 이름: 한글·영어·숫자만, 8글자까지
  const cleanName = (v) => String(v || '').replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim().slice(0, 8);
  const okName = (v) => /[가-힣a-zA-Z]/.test(v) && !/^[ㄱ-ㅎㅏ-ㅣ]+$/.test(v);
  $('name-input').addEventListener('input', () => {
    const v = cleanName($('name-input').value); [...$('name-chips').children].forEach(x => x.classList.remove('sel'));
    nameSel = okName(v) ? v : null; $('btn-name').disabled = !nameSel;
  });
  $('name-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('name-input').blur(); } });
  function renameOpen() { $('set-name').value = S.name || ''; }
  $('btn-rename').onclick = () => {
    const v = cleanName($('set-name').value);
    if (!okName(v)) { Snd.no(); toast('한글이나 영어로 이름을 써 주세요 (8글자까지)'); return; }
    if (v === S.name) { toast('지금과 같은 이름이에요'); return; }
    S.name = v; save(); hud(); Snd.level(); $('set-name').value = v;
    toast(`이제 친구 이름은 <b>${v}</b>예요!`);
    if (level() === 'talk') setTimeout(() => speak('home', `새 이름 좋아! 나는 이제 ${v}${bat(v) ? '이야' : '야'}!`), 400);
  };
  $('set-name').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); $('btn-rename').click(); } });
  $('btn-name-back').onclick = () => { Snd.tap(); openChoose(); };
  $('btn-name').onclick = () => {
    if (!nameSel) return; nameSel = cleanName(nameSel); if (!okName(nameSel)) return;
    S = Object.assign(fresh(), { kind: choice, name: nameSel, sound: S.sound, lowfx: S.lowfx }); save(); Snd.level(); enterHome('new');
  };

  // =====================================================================
  // 친구의 방
  // =====================================================================
  let wanderT = null, idleT = null, sleeping = false, objBusy = 0, lastTouch = 0, lastObj = null;
  const ICON_SHOP = '<svg viewBox="0 0 32 32"><path d="M7 11 h18 l-1.6 15 a2 2 0 0 1 -2 1.8 H10.6 a2 2 0 0 1 -2 -1.8z" fill="#FFC7D9" stroke="#E5679A" stroke-width="2" stroke-linejoin="round"/><path d="M12 11 v-2 a4 4 0 0 1 8 0 v2" fill="none" stroke="#E5679A" stroke-width="2"/><path d="M16 14.5 l1.4 2.9 3.2 .4 -2.3 2.2 .6 3.1 -2.9 -1.5 -2.9 1.5 .6 -3.1 -2.3 -2.2 3.2 -.4z" fill="#FFD36E" stroke="#D9962E" stroke-width="1" stroke-linejoin="round"/></svg>';
  const ICON = {
    warm: `<svg viewBox="0 0 32 32"><path d="M5 12 Q16 4 27 12 L28 26 Q16 30 4 26Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="2" stroke-linejoin="round"/><path d="M7 15 Q16 9 25 15" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="3 3"/><circle cx="12" cy="21" r="1.6" fill="#fff"/><circle cx="20" cy="21" r="1.6" fill="#fff"/></svg>`,
    cool: `<svg viewBox="0 0 32 32"><path d="M16 26 L5 8 Q16 2 27 8 Z" fill="#B9E3FF" stroke="#5D8FD0" stroke-width="2" stroke-linejoin="round"/><path d="M16 26 L11 6 M16 26 L21 6 M16 26 L16 4" stroke="#5D8FD0" stroke-width="1.4"/><path d="M16 26 v4" stroke="#C99A64" stroke-width="3" stroke-linecap="round"/></svg>`,
    sing: `<svg viewBox="0 0 32 32"><path d="M12 22 V7 l13 -3 v15" fill="none" stroke="#A996F0" stroke-width="2.4" stroke-linejoin="round"/><ellipse cx="9" cy="22" rx="4" ry="3.2" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="1.8"/><ellipse cx="22" cy="19" rx="4" ry="3.2" fill="#FFC7D9" stroke="#E5679A" stroke-width="1.8"/></svg>`,
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
  $('mi-garden').innerHTML = `<svg viewBox="0 0 32 32"><path d="M16 26 v-10" stroke="#4FAA6C" stroke-width="2.6"/><path d="M16 17 c-8 0 -10 -6 -10 -9 c6 0 10 3 10 9 c0 -6 4 -9 10 -9 c0 3 -2 9 -10 9" fill="#9FDDB4" stroke="#4FAA6C" stroke-width="1.8"/><path d="M5 27 h22" stroke="#B98A6A" stroke-width="4" stroke-linecap="round"/></svg>`;
  $('mi-book').innerHTML = ICON.book; $('mi-closet').innerHTML = ICON.closet; $('mi-shop').innerHTML = ICON_SHOP; $('mi-diary').innerHTML = ICON.diary;
  const wishIcon = (w) => w.t === 'food' ? Scene.food(w.id) : w.t === 'place' ? ICON.walk.replace(/#fff/g, '#55C3A3') : ICON[w.id];
  const wishText = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어 해요` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어 해요` : { pet: S.stage <= 2 ? '따뜻하게 쓰다듬어 주길 바라요' : '쓰다듬어 주길 바라요', bath: '씻고 싶어 해요', play: '같이 놀고 싶어 해요', sing: '노래를 듣고 싶어 해요', warm: '따뜻한 담요를 바라요', cool: '시원한 바람을 바라요', nap: isNight() ? '이제 자고 싶어 해요' : '낮잠을 자고 싶어 해요' }[w.id];
  const napName = () => (isNight() ? '밤잠 재우기' : '낮잠 재우기');
  const careName = (id) => (id === 'nap' ? napName() : CARE[id].name);
  const wishSay = (w) => w.t === 'food' ? `${obj(FOODS[w.id].name)} 먹고 싶어…` : w.t === 'place' ? `${PLACES[w.id].name}에 가 보고 싶어!` : w.id === 'nap' && isNight() ? '하암… 밤이 깊었어. 이제 자고 싶어' : CARE[w.id].wish;

  function enterHome(mode) {
    const away0 = S.last ? (Date.now() - S.last) / 86400000 : 0; // 마지막으로 본 뒤 지난 날 (아래에서 last가 바뀌기 전에 잰다)
    applyTime(); newDay(); tickNeeds(); growGarden(); const bday = checkBirthday();
    if (S.fxp < (FRIEND_XP[S.flv] || 0)) S.fxp = FRIEND_XP[S.flv]; save();
    show('scr-home'); renderHome(); neighborVisit();
    if (bday) setTimeout(() => { toast(`오늘은 <b>${NM()}의 생일</b>이에요! 파티를 준비해 줘요`); Snd.level(); }, 900);
    else if (canGrow()) setTimeout(() => { if (!document.querySelector('.overlay.on')) levelUp(); }, 1400); else growHint();
    Snd.music(isNight() ? 'night' : 'home');
    clearInterval(enterHome.iv); enterHome.iv = setInterval(() => { tickNeeds(); renderNeeds(); if (syncSleep() && $('scr-home').classList.contains('on') && !sulking && !toyOn && !editing && !document.querySelector('.overlay.on')) renderHome(); }, 60000);
    setTimeout(() => {
      const lv = level();
      if (mode === 'new') { speak('home', S.kind === 'bunny' ? '(딸기 알이 둥지에 쏙 들어갔어요. 바람을 들어주고 나들이에서 문제를 풀면 알이 자라요!)' : '(별빛 알이 둥지에 쏙 들어갔어요. 바람을 들어주고 나들이에서 문제를 풀면 알이 자라요!)'); return; }
      if (mode === 'out') { speak('home', line('welcome')); return; }
      if (sleeping) { speak('home', lv === 'talk' ? 'Zzz… 음냐… (기운이 없어서 자고 있어요)' : '(새근새근…)', { silent: true }); return; }
      if (lv !== 'talk') { speak('home', line('idle')); return; }
      const away = away0;
      if (away >= 1 && !sleeping && !sulking) {
        const wk = $('walker'); wk.classList.add('fast'); wk.style.left = '64%'; drawPet('wide'); speak('home', '(창밖을 보며 기다리고 있었어요)', { silent: true, noEmo: true });
        setTimeout(() => { wk.classList.remove('fast'); goTo(46, () => { react('happy', 'hop'); heartAtPet(); speak('home', lineFrom(LINES[S.kind].talk.back, 'back')); }, true); }, 1800);
      }
      else { const h = new Date().getHours(), g = LINES[S.kind].talk.greet; speak('home', pick(h < 12 ? g.morning : h < 17 ? g.day : g.evening)); }
    }, 350);
    S.last = Date.now(); save();
    startWander(); poked();
    const ps = pendingStory(); if (ps != null && ps >= 0) setTimeout(() => toast('친구 수첩에 <b>새 이야기</b>가 열렸어요!'), 1500);
  }
  function renderHome() {
    if (toyAbort) { const f = toyAbort; toyAbort = null; f(); }
    initRooms(); fixWishes();
    $('room-bg').innerHTML = roomSVG();
    renderParty(); renderRoomNav();
    placeHotspots();
    syncSleep();
    drawPet(); drawNest(); renderNeeds(); renderWishes(); renderCare(); hud(); growHint();
  }
  function drawPet(mood) {
    if (mood) emoLock.home = Date.now();
    mood = mood || (sulking ? 'pout' : sleeping ? 'sleep' : S.needs.mood < 35 || lowNeed() ? 'sad' : 'idle');
    const p = $('pet'); p.innerHTML = Art.draw(S.kind, S.stage, mood, showAcc());
    if (drawPet.m && drawPet.m !== mood && !S.lowfx) { p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); }
    drawPet.m = mood;
    $('walker').classList.toggle('sleep', sleeping);
  }
  // 눈이 손가락을 따라본다 (기본 눈일 때)
  function lookAt(petEl, x, y) {
    if (!petEl) return; const r = petEl.getBoundingClientRect(); if (!r.width) return;
    let dx = (x - (r.left + r.width / 2)) / r.width * 3.2, dy = (y - (r.top + r.height * .45)) / r.height * 3.2;
    dx = Math.max(-2.2, Math.min(2.2, dx)); dy = Math.max(-1.6, Math.min(1.6, dy));
    const svg = petEl.querySelector('svg'); if (svg && getComputedStyle(svg).transform.startsWith('matrix(-1')) dx = -dx;
    petEl.style.setProperty('--lx', dx.toFixed(2)); petEl.style.setProperty('--ly', dy.toFixed(2));
    clearTimeout(petEl._lookT); petEl._lookT = setTimeout(() => { petEl.style.setProperty('--lx', 0); petEl.style.setProperty('--ly', 0); }, 1600);
  }
  [['room', 'pet'], ['act-field', 'act-pet'], ['wd-mirror', 'wd-pet'], ['stage', 'opet']].forEach(([area, pet]) => {
    const a = $(area); if (!a) return;
    const f = (e) => lookAt($(pet), e.clientX, e.clientY);
    a.addEventListener('pointermove', f, { passive: true }); a.addEventListener('pointerdown', f, { passive: true });
  });
  let moodT = null;
  function react(mood, anim) {
    drawPet(mood); const p = $('pet'); p.classList.remove('hop', 'shake', 'squish', 'wobble', ...ACT_CLS);
    if (anim && S.stage <= 2) anim = 'wobble';
    if (anim) { void p.offsetWidth; p.classList.add(anim); }
    clearTimeout(moodT); moodT = setTimeout(() => { drawPet(); p.classList.remove('hop', 'shake', 'squish', 'wobble'); }, 1700);
  }
  function renderNeeds() {
    if (S.stage <= 2) {
      const t = S.temp == null ? 50 : S.temp, cls = t < 30 ? 't-cold' : t > 70 ? 't-hot' : 't-good';
      $('needs').innerHTML = `<div class="need ${S.needs.mood < 35 ? 'low' : ''}" title="기분">${Scene.need('mood')}<span class="nb"><i style="width:${S.needs.mood}%"></i></span></div>
        <div class="need eggtemp ${cls}" title="따뜻함"><span class="thermo"><svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="13" rx="3" fill="#fff" stroke="#E5679A" stroke-width="1.8"/><circle cx="12" cy="18" r="4" fill="${cls === 't-cold' ? '#7FB0EA' : cls === 't-hot' ? '#F2678F' : '#8FE0C9'}" stroke="#E5679A" stroke-width="1.8"/></svg></span><span class="nb tb"><i style="left:${t}%"></i></span><b>${cls === 't-cold' ? '추워요' : cls === 't-hot' ? '더워요' : '딱 좋아요'}</b></div>`;
      return;
    }
    const L = { full: '배부름', mood: '기분', clean: '깨끗함', energy: '기운' };
    $('needs').innerHTML = Object.keys(L).map(k => `<div class="need ${S.needs[k] < 35 ? 'low' : ''}" title="${L[k]}">${Scene.need(k)}<span class="nb"><i style="width:${S.needs[k]}%"></i></span></div>`).join('');
  }
  function renderWishes() {
    const done = S.wishes.filter(w => w.done).length;
    $('wish-count').innerHTML = `${done < S.wishes.length && S.wishes.length > 1 ? SC('+10 모두') + ' ' : ''}${done} / ${S.wishes.length}`;
    $('wish-list').innerHTML = S.wishes.map((w, i) => `<div class="wish ${w.done ? 'done' : ''}" data-i="${i}"><span class="wi">${wishIcon(w)}</span><span class="wt">${NM()}는 ${wishText(w)}<small>${w.t === 'food' ? '간식 만들기 → 먹이기' : w.t === 'place' ? '산책 가기' : w.id === 'pet' ? (S.stage <= 2 ? '알을 손가락으로 살살 문질러요' : '친구를 손가락으로 쓰다듬어요') : w.id === 'sing' ? '알 돌보기 → 노래 불러 주기' : '돌보기'}${w.done ? '' : ' ' + SC('+5')}</small></span><span class="wc">${w.done ? '✓' : ''}</span></div>`).join('');
    const w = S.wishes.find(x => !x.done);
    $('think').innerHTML = w && !sleeping ? `<span class="ti">${wishIcon(w)}</span><span>${w.t === 'food' ? FOODS[w.id].name : w.t === 'place' ? PLACES[w.id].name : careName(w.id)}</span>` : '';
  }
  function renderCare() {
    const items = S.stage <= 2 ? [['warm', '담요 덮기'], ['cool', '부채질'], ['sing', '노래 불러 주기']] : [['feed', '먹이기'], ['bath', '목욕'], ['play', '놀이'], ['nap', '재우기']];
    const want = { warm: S.temp != null && S.temp < 35, cool: S.temp != null && S.temp > 65, feed: S.needs.full < 40 || S.wishes.some(w => !w.done && w.t === 'food' && S.foods[w.id]), bath: S.needs.clean < 40, nap: S.needs.energy < 35, play: S.needs.mood < 45 };
    S.wishes.forEach(w => { if (!w.done && w.t === 'care' && (w.id !== 'pet' || S.stage <= 2)) want[w.id] = true; });
    $('care-row').classList.toggle('egg', S.stage <= 2);
    $('care-row').innerHTML = items.map(([k, n]) => `<button class="care ${want[k] ? 'want' : ''}" data-care="${k}">${k === 'play' ? SC('+6') : ''}<span class="ci">${ICON[k]}</span>${n}</button>`).join('');
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
      else if (Date.now() < objBusy) { wanderT = setTimeout(step, objBusy - Date.now() + 300); return; }
      else if (S.stage >= 3 && Math.random() < .4 && objPlay()) { /* 물건 가지고 노는 중 */ }
      else if (S.stage >= 3) {
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
  function poked() { lastTouch = Date.now(); clearTimeout(idleT); idleT = setTimeout(idleTalk, 16000); }
  // 친구가 먼저 앞으로 다가와서 말을 건다
  function comeSay(fn) {
    if (S.stage < 3 || sleeping || sulking || toyOn || editing) return fn();
    const ok = goTo(48, () => { drawPet('wide'); setTimeout(fn, 250); }, true); if (ok === false) fn();
  }
  // 어제 함께한 일 떠올리기
  function memLine() {
    const y = (S.ylog || []).filter(e => ['cook', 'walk', 'wear', 'read', 'harvest', 'photo', 'party'].includes(e.e)); if (!y.length) return '';
    const e = y[(S.days * 7 + new Date().getHours()) % y.length];
    if (e.e === 'cook' && FOODS[e.id]) return `어제 같이 만든 ${FOODS[e.id].name}, 정말 맛있었어!`;
    if (e.e === 'walk' && PLACES[e.id]) return `어제 ${PLACES[e.id].name}에 간 거 자꾸 생각나. 재밌었지?`;
    if (e.e === 'wear' && ITEMS[e.id]) return `어제 입은 ${ITEMS[e.id].name}, 오늘도 입고 싶다~`;
    if (e.e === 'read') return '어제 같이 읽은 책 이야기, 아직도 기억나!';
    if (e.e === 'harvest' && ING_NAME[e.id]) return `어제 텃밭에서 ${ING_NAME[e.id]} 거둔 거 신났지?`;
    if (e.e === 'photo') return '어제 찍은 사진 또 보고 싶어. 옷장 앨범에 있어!';
    if (e.e === 'party') return '어제 생일 파티 정말 고마웠어. 평생 기억할 거야!';
    return '';
  }
  // 하루 한 번: 너 주려고 찾았다며 작은 선물 상자를 가져온다
  function petGift() {
    comeSay(() => {
      S.giftDay = S.day; save();
      const room = $('room'), r = room.getBoundingClientRect(), pr = $('pet').getBoundingClientRect();
      const g = document.createElement('button'); g.className = 'petgift'; g.setAttribute('aria-label', '선물 상자');
      g.innerHTML = '<svg viewBox="0 0 40 40"><rect x="7" y="16" width="26" height="18" rx="3" fill="#FFC7D9" stroke="#E5679A" stroke-width="2"/><rect x="5" y="11" width="30" height="7" rx="2" fill="#F7A0C1" stroke="#E5679A" stroke-width="2"/><path d="M20 11v23" stroke="#FFD36E" stroke-width="4"/><path d="M20 11 C14 2 8 6 12 10 M20 11 C26 2 32 6 28 10" fill="none" stroke="#FFD36E" stroke-width="2.6" stroke-linecap="round"/></svg>';
      Object.assign(g.style, { left: (pr.left - r.left + pr.width * .78) + 'px', top: (pr.top - r.top + pr.height * .55) + 'px' });
      room.appendChild(g); react('happy', 'hop'); speak('home', pick(['짜잔! 너 주려고 찾았어. 열어 봐!', '선물이야! 몰래 숨겨 뒀던 거야.', '이거 받아! 우리 우정 선물!']));
      g.onclick = (e) => { e.stopPropagation(); Snd.combo(); const n = 2 + (S.flv >= 6 ? 1 : 0); S.candy += n; S.log.push({ e: 'gift' }); save(); hud(); sparks(room, 10); toast(`선물 상자에서 <b>별사탕 ${n}개</b>가 나왔어요!`); speak('home', '헤헤, 마음에 들어? 또 찾아 올게!'); g.remove(); };
      setTimeout(() => g.isConnected && g.remove(), 30000);
    });
  }
  function idleTalk() {
    if ($('scr-home').classList.contains('on') && !document.querySelector('.overlay.on')) {
      const ln = lowNeed(), w = S.wishes.find(x => !x.done);
      if (S.stage <= 2 && S.wishes.some(w => !w.done && w.t === 'care' && w.id === 'pet') && Math.random() < .55) { speak('home', pick(['(저를 쓰다듬어 주세요…)', '(알이 손길을 기다리는 것 같아요. 살살 문질러 주세요)', '(쓰담쓰담 해 줄래요?)']), { silent: true }); petFx('heart', $('pet')); }
      else if (S.stage <= 2 && S.temp != null && S.temp < 30) speak('home', pick(['(알이 바들바들 떨어요… 추운가 봐요)', '(알이 오들오들… 담요가 필요해 보여요)']), { silent: true });
      else if (S.stage <= 2 && S.temp != null && S.temp > 70) speak('home', pick(['(알이 땀을 뻘뻘… 너무 더운가 봐요)', '(알이 뜨끈뜨끈해요. 시원한 바람이 필요해 보여요)']), { silent: true });
      else if (sulking) speak('home', L3('sulk'), { silent: true });
      else if (sleeping) speak('home', level() === 'egg' ? '(새근새근…)' : 'Zzz… 음냐…', { silent: true });
      else if (ln && level() === 'talk') comeSay(() => { react('sad'); speak('home', line(ln)); });
      else if (level() === 'talk' && S.flv >= 3 && S.giftDay !== S.day && Math.random() < .25) petGift();
      else if (w && level() === 'talk' && Math.random() < .5) comeSay(() => { react('happy', 'hop'); speak('home', wishSay(w)); });
      else if (level() === 'talk' && memLine() && Math.random() < .35) comeSay(() => speak('home', memLine()));
      else if (level() === 'talk' && S.read && Object.keys(S.read).length && Math.random() < .3) speak('home', BOOKS[pick(Object.keys(S.read))].mem);
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
    const ml = L3('makeup'); speak('home', ml); addNeed('mood', 8); addFriend(2); S.log.push({ e: 'makeup' }); renderNeeds(); renderWishes(); save();
    if (/무지개/.test(ml)) { rainbowUnder(); objBusy = Date.now() + 4200; setTimeout(() => { if (!sulking) startWander(); }, 4200); } else startWander();
  }
  // 친구 발밑에 진짜 무지개가 떴다가 사라진다
  function rainbowUnder() {
    const wk = $('walker'); wk.querySelectorAll('.rbow').forEach(e => e.remove());
    const C = ['#F58A8A', '#F8B46A', '#F7DC6F', '#8ED79A', '#7FB8F0', '#B39AF0'];
    const el = document.createElement('div'); el.className = 'rbow';
    el.innerHTML = `<svg viewBox="0 0 200 92" aria-hidden="true">${C.map((c, i) => `<path d="M${8 + i * 8} 90 A${92 - i * 8} ${82 - i * 8} 0 0 1 ${192 - i * 8} 90" fill="none" stroke="${c}" stroke-width="8.4" stroke-linecap="round"/>`).join('')}
      <g fill="#fff" stroke="#E4E0F5" stroke-width="2"><circle cx="16" cy="86" r="10"/><circle cx="30" cy="88" r="8"/><circle cx="6" cy="89" r="7"/><circle cx="184" cy="86" r="10"/><circle cx="170" cy="88" r="8"/><circle cx="194" cy="89" r="7"/></g></svg>`;
    wk.insertBefore(el, wk.firstChild); Snd.chime && Snd.chime();
    setTimeout(() => el.classList.add('out'), 3600); setTimeout(() => el.remove(), 4400);
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
    const pet = $('pet'); let down = false, lx = 0, ly = 0, moved = 0, rub = 0, nextHeart = 220, rubLog = [], tiredT = 0, tiredSaid = 0;
    pet.addEventListener('pointerdown', (e) => { down = true; lx = e.clientX; ly = e.clientY; moved = 0; try { pet.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    pet.addEventListener('pointermove', (e) => {
      if (!down) return; const d = Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY; moved += d;
      if (moved < 15) return;
      rub += d; poked();
      const now = Date.now();
      if (!sulking && now < tiredT) { if (now - tiredSaid > 2500) { tiredSaid = now; speak('home', S.stage <= 2 ? '(알이 충분히 따뜻해졌어요. 조금 쉬게 해 줘요)' : level() === 'talk' ? pick(['간지러워! 이제 그만~', '털이 다 헝클어지겠어!']) : '(몸을 배배 꼬아요)', { silent: level() !== 'talk' }); }
        rub = 0; nextHeart = 220; return; }
      rubLog.push([now, d]); rubLog = rubLog.filter(([t]) => now - t < 12000);
      if (!sulking && rubLog.reduce((a, [, v]) => a + v, 0) > 2800) {
        // 12초 안에 너무 많이 문지르면 싫어서 몸을 빼고, 20초 동안은 쓰다듬어도 좋아하지 않는다
        tiredT = now + 20000; tiredSaid = now; rubLog = []; rub = 0; nextHeart = 220;
        if (S.stage <= 2) { react('idle', 'wobble'); speak('home', '(알이 데굴 흔들려요. 조금 쉬게 해 줘요)', { silent: true }); }
        else { petNo('tickle'); speak('home', level() === 'talk' ? pick(['으앙, 너무 많이 쓰다듬었어! 조금 쉬자.', '간지러워! 이제 그만~']) : '(몸을 배배 꼬아요)', { silent: level() !== 'talk' }); addNeed('mood', -2); renderNeeds(); }
        return;
      }
      if (rub > nextHeart) { nextHeart = rub + 220; heartAtPet(); Snd.heart(); if (!sulking && Date.now() - madeAt > 2500) { react('happy'); addNeed('mood', 2); renderNeeds(); } }
      if (sulking && rub > 900) { rub = 0; nextHeart = 220; makeUp(); }
    });
    const up = () => {
      if (!down) return; down = false;
      if (moved < 15) { const r = $('room').getBoundingClientRect(), p = pet.getBoundingClientRect(); onTap((p.left + p.width / 2 - r.left) / r.width * 100); }
      else if (!sulking && rub > 600 && Date.now() - madeAt > 2500) { rub = 0; nextHeart = 220; if (S.pokeToday < 10) { S.pokeToday++; addFriend(1); } S.log.push({ e: 'care', id: 'pet' }); speak('home', line('poke')); if (fulfill('care', 'pet')) { renderWishes(); renderCare(); hud(); } save(); }
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
    const h = $('hots'); h.innerHTML = ''; initRooms();
    const attic = S.roomId === 'attic';
    const list = attic ? [{ id: 'window', box: [410, 80, 590, 260], name: '동그란 창문' }] : HOTS.map(o => {
      if (o.id !== 'cushion') return o; const p = S.place.main.cushion; if (!p) return null;
      return Object.assign({}, o, { box: Scene.itemBox('cushion', p[0], p[1]) });
    }).filter(Boolean);
    list.forEach(o => {
      const b = roomBox(...o.box); const el = document.createElement('button'); el.className = 'hot'; el.setAttribute('aria-label', o.name);
      Object.assign(el.style, { left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px' });
      el.onclick = () => { Snd.tap(); poked(); useObject(o.id, b.cx); };
      h.appendChild(el);
    });
    const PT = S.place[S.roomId || 'main'] || {};
    let th = $('toyhots'); if (!th) { th = document.createElement('div'); th.id = 'toyhots'; th.className = 'toyhots'; $('room').appendChild(th); } th.innerHTML = '';
    TOYS.filter(k => PT[k]).forEach(k => {
      const b = roomBox(...Scene.itemBox(k, PT[k][0], PT[k][1])), el = document.createElement('button'); el.className = 'hot toy'; el.dataset.toy = k; el.setAttribute('aria-label', ITEMS[k].name);
      Object.assign(el.style, { left: b.left + 'px', top: b.top + 'px', width: b.width + 'px', height: b.height + 'px' });
      el.addEventListener('pointerdown', (e) => toyDown(k, e, el, b)); th.appendChild(el);
    });
    if (!ballState.flying) resetBall();
    $('ball').style.display = attic || S.stage < 3 ? 'none' : '';
  }
  window.addEventListener('resize', () => { if ($('scr-home').classList.contains('on')) placeHotspots(); });

  // 친구를 방의 어느 위치(가로 %)로 데려간다. 도착하면 cb
  function goTo(pct, cb, quick) {
    const wk = $('walker'); if (sulking) { speak('home', L3('sulk'), { silent: true }); return false; }
    if (S.stage <= 2) { cb && cb(); return true; } // 알은 제자리에 가만히
    clearTimeout(wanderT); wk.classList.remove('flying'); wk.style.bottom = '';
    const cur = parseFloat(wk.style.left) || 55, dist = Math.abs(pct - cur);
    wk.classList.add('go'); wk.style.transitionDuration = Math.max(.35, dist / (quick ? 90 : 55)) + 's';
    wk.style.left = pct + '%';
    const p = $('pet'); if (S.stage >= 3) { p.classList.remove('walking'); void p.offsetWidth; p.classList.add('walking'); }
    setTimeout(() => { wk.classList.remove('go'); wk.style.transitionDuration = ''; p.classList.remove('walking'); cb && cb(); startWander(); }, Math.max(350, dist / (quick ? 90 : 55) * 1000));
    return true;
  }
  function useObject(id, cx) {
    if (editing) return;
    if (sleeping && id !== 'bed') { speak('home', level() === 'egg' ? '(새근새근…)' : '음냐… 지금은 졸려…', { silent: true }); return; }
    if (S.stage <= 2 && (id === 'bed' || id === 'cushion')) { speak('home', '(알은 둥지에서 꼼짝하지 않아요. 살살 쓰다듬어 줄까요?)', { silent: true }); return; }
    if (id === 'window') {
      // 창밖 구경: 오늘 날씨를 이야기한다 (날씨는 하루에 한 번 정해진다)
      goTo(Math.min(78, cx), () => {
        if (isNight()) { react('happy', 'hop'); speak('home', level() === 'talk' ? pick(['밤하늘에 별이 반짝반짝…', '달님, 안녕! 오늘도 고마웠어.', '깜깜한 밤이야. 별 세어 볼까? 하나, 둘…']) : L3('care')); return; }
        const sad = S.kind === 'bunny' && S.weather === 'rain';
        react(sad ? 'sad' : 'happy', sad ? 'shake' : 'hop'); speak('home', L4(S.weather));
        if (S.kind === 'cloud' && S.weather === 'rain') addNeed('mood', 4);
        renderNeeds(); save();
      });
    } else if (id === 'shelf') {
      const rn = readNo(); if (rn) { refuse('read', rn[1], rn[0]); return; }
      goTo(Math.max(26, cx), () => { react('happy', 'squish'); speak('home', level() === 'talk' ? pick(['같이 책 읽자!', '오늘은 무슨 책 읽을까?']) : L3('care')); setTimeout(openShelf, 500); });
    } else if (id === 'bed') {
      goTo(cx, () => {
        // 침대 위로 올라가서 뒹군다
        const wk = $('walker'), bb = roomBox(170, 380, 390, 505), rh = $('room').getBoundingClientRect().height;
        clearTimeout(wanderT); wk.style.bottom = (rh - bb.top - bb.height * .47) + 'px'; setTimeout(() => { wk.style.bottom = ''; startWander(); }, 2400);
        const p = $('pet'); p.classList.remove('roll'); void p.offsetWidth; p.classList.add('roll');
        drawPet('happy'); speak('home', L4('bed')); addNeed('mood', 3); renderNeeds();
        setTimeout(() => { p.classList.remove('roll'); drawPet(); }, 2200);
      });
    } else if (id === 'cushion') {
      const pc = S.place[S.roomId || 'main'].cushion; if (!pc) return;
      const b = roomBox(...Scene.itemBox('cushion', pc[0], pc[1])); lastObj = 'cushion';
      goTo(b.cx, () => objReact('cushion', OBJ_PLAY.cushion, b));
    }
  }

  // ---------- 혼자 돌아다니다 방 물건을 가지고 논다 ----------
  // pet: 친구 몸짓, it: 물건 움직임, fx: 떠오르는 것, at: 'under'(벽 물건 아래) | 'side'(옆에 서기) | 'on'(위에 올라가기)
  const OBJ_PLAY = {
    shell:   { pet: 'squish', it: 'wiggle', fx: 'wave', snd: 'wave', at: 'under' },
    plant:   { pet: 'squish', it: 'grow', fx: 'drop', snd: 'drip', at: 'side' },
    lamp:    { pet: 'hop', it: 'glow', fx: 'star', snd: 'chime', at: 'under' },
    cushion: { pet: 'boing', it: 'squash', fx: 'heart', snd: 'pop3', at: 'on', up: .8 },
    rug:     { pet: 'roll', it: '', fx: 'heart', snd: 'pop', at: 'on', up: 0 },
    frame:   { pet: 'hop', it: 'tilt', fx: 'heart', snd: 'heart', at: 'under' },
    chair:   { pet: 'squish', it: 'squash', fx: 'star', snd: 'pop', at: 'on', up: .8 },
    table:   { pet: 'squish', it: '', fx: '', snd: 'sip', at: 'side', cup: true },
    teddy:   { pet: 'squish', it: 'squash', fx: 'heart', snd: 'heart', at: 'side' },
    books:   { pet: 'squish', it: 'wiggle', fx: 'star', snd: 'pop', at: 'side' },
    cactus:  { pet: 'shake', it: 'wiggle', fx: 'prick', snd: 'prick', at: 'side', mood: 'sad' },
    heart:   { pet: 'boing', it: 'squash', fx: 'heart', snd: 'heart', at: 'side' },
    mobile:  { pet: 'hop', it: 'swing', fx: 'star', snd: 'chime', at: 'under' },
    lights:  { pet: 'hop', it: 'twinkle', fx: 'star', snd: 'chime', at: 'under' },
    piano:   { pet: 'dance', it: 'bounce', fx: 'note', snd: 'piano', at: 'side' },
    vase:    { pet: 'squish', it: 'wiggle', fx: 'petal', snd: 'pop', at: 'side' },
    toybox:  { pet: 'hop', it: 'bounce', fx: 'toy', snd: 'pop', at: 'side' },
    mirror:  { pet: 'hop', it: 'glow', fx: 'star', snd: 'chime', at: 'under' },
    window:  { pet: 'hop', it: '', fx: '', snd: 'tap', at: 'under', box: [550, 64, 800, 286] },
    shelf:   { pet: 'squish', it: '', fx: 'star', snd: 'pop', at: 'under', box: [210, 136, 445, 222] },
    bed:     { pet: 'roll', it: '', fx: 'zz', snd: 'pop', at: 'on', up: .47, box: [170, 380, 390, 505] }
  };
  function objPlay(force) {
    if (toyOn || sulking || sleeping || editing || S.stage < 3 || ballState.flying || ballState.fetching) return false;
    if (document.querySelector('.overlay.on') || Date.now() - lastTouch < 6000) return false;
    const wk = $('walker'); if (wk.classList.contains('flying')) return false;
    const R0 = S.roomId || 'main', P = S.place[R0] || {};
    let ids = Object.keys(P).filter(k => OBJ_PLAY[k]);
    if (R0 === 'main') ids.push('window', 'shelf', 'bed');
    ids = ids.filter(k => k !== lastObj); if (!ids.length) return false;
    const id = force || pick(ids), o = OBJ_PLAY[id];
    const box = o.box || Scene.itemBox(id, P[id][0], P[id][1]);
    const b = roomBox(...box), rw = $('room').getBoundingClientRect().width;
    let x = b.cx;
    if (o.at === 'side') { const half = b.width / rw * 100 / 2 + 6; x = b.cx > 55 ? b.cx - half : b.cx + half; }
    x = Math.max(12, Math.min(86, x)); lastObj = id;
    objBusy = Date.now() + 9000;
    return goTo(x, () => objReact(id, o, b), false) !== false;
  }
  if (/[?&]dev/.test(location.search)) window.__objPlay = (id) => { lastTouch = 0; lastObj = null; objBusy = 0; return objPlay(id); };
  if (/[?&]dev/.test(location.search)) window.__makeUp = () => { sulking = true; makeUp(); };
  if (/[?&]dev/.test(location.search)) window.__petNo = (k) => petNo(k);
  if (/[?&]dev/.test(location.search)) window.__emoOf = (t) => emoOf(t);
  if (/[?&]dev/.test(location.search)) window.__petGift = () => petGift();
  if (/[?&]dev/.test(location.search)) window.__nbArt = (id, m) => nbArt(id, m);
  function objReact(id, o, b) {
    if (toyOn) return; // 놀잇감으로 노는 중이면 물건 놀이는 그만
    if (sulking || sleeping || document.querySelector('.overlay.on')) { objBusy = 0; return; }
    const wk = $('walker'), p = $('pet'), room = $('room'), rh = room.getBoundingClientRect().height, DUR = 2600;
    objBusy = Date.now() + DUR + 600; clearTimeout(wanderT);
    if (o.at === 'on' && o.up) wk.style.bottom = (rh - b.top - b.height * o.up) + 'px';
    // 물건이 움직인다
    const g = $('room-bg').querySelector(`[data-it="${id}"]`);
    if (g && o.it && !S.lowfx) { g.classList.remove('it-' + o.it); void g.getBoundingClientRect(); g.classList.add('it-' + o.it); setTimeout(() => g.classList.remove('it-' + o.it), DUR); }
    // 친구 몸짓
    const anim = o.pet === 'dance' ? 'hop' : o.pet;
    drawPet(o.mood || 'happy'); p.classList.remove('hop', 'shake', 'squish', 'roll', 'boing'); void p.offsetWidth; p.classList.add(anim);
    if (o.pet === 'dance') setTimeout(() => { p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); }, 1100);
    if (o.mood) setTimeout(() => drawPet('happy'), 1200);
    // 소리와 떠오르는 것
    if (o.snd === 'pop3') { Snd.pop(); setTimeout(() => Snd.pop(), 420); setTimeout(() => Snd.pop(), 840); }
    else if (id === 'vase' && S.kind === 'bunny') setTimeout(() => Snd.sneeze(), 700);
    else if (Snd[o.snd]) Snd[o.snd]();
    objFx(o.fx, b);
    if (o.cup) objCup(b, parseFloat(wk.style.left) < b.cx);
    // 말
    let t;
    if (level() === 'talk') {
      t = (lineFrom(LINES5[S.kind][id], 'l5' + id) || '헤헤.').replace('{d}', S.days || 1);
      if (id === 'mirror') { const w = Object.values(S.wear || {}).filter(Boolean); if (w.length && Math.random() < .6) t = `거울아 거울아, 오늘 ${Prob.jo(ITEMS[pick(w)].name, '이')} 잘 어울리지?`; }
      if (id === 'window' && isNight()) t = pick(['밤하늘에 별이 반짝반짝…', '달님, 안녕! 잘 자요.']);
    } else t = LINES5.baby[id] || '(헤헤)';
    if (Math.random() < .8 || level() !== 'talk') speak('home', t, { silent: level() !== 'talk' });
    if (!S.objT) S.objT = {};
    if (Date.now() - (S.objT[id] || 0) > 5 * 60000) { S.objT[id] = Date.now(); addNeed('mood', 2); renderNeeds(); save(); }
    setTimeout(() => {
      p.classList.remove(anim); wk.style.bottom = ''; drawPet(); objBusy = Date.now() + 300; startWander();
    }, DUR);
  }
  // 물건 둘레에 떠오르는 것 (음표, 하트, 별, 물방울 …)
  function objFx(kind, b) {
    if (!kind) return;
    const room = $('room'), n = S.lowfx ? 2 : kind === 'drop' ? 6 : 5;
    const CH = { note: ['♪', '♫', '♬'], heart: ['♥'], star: ['✦', '★'], drop: ['●'], petal: ['✿', '❀'], zz: ['z', 'Z'], wave: ['∿', '~'], prick: ['!', '✱'], steam: ['∿'], toy: ['★'] }[kind] || ['✦'];
    for (let i = 0; i < n; i++) {
      const e = document.createElement('span'); e.className = 'objfx fx-' + kind; e.textContent = pick(CH);
      const x = b.left + b.width * (.2 + Math.random() * .6), y = kind === 'drop' ? b.top + b.height * .05 : b.top + b.height * (.1 + Math.random() * .3);
      Object.assign(e.style, { left: x + 'px', top: y + 'px', animationDelay: (i * .22) + 's' });
      room.appendChild(e); setTimeout(() => e.remove(), 2400 + i * 220);
    }
    if (kind === 'toy') {
      const t = document.createElement('div'); t.className = 'objtoy'; t.innerHTML = Scene.item(pick(['teddy', 'heart', 'cushion', 'books'].filter(k => !(S.place[S.roomId || 'main'] || {})[k]).concat(['heart'])));
      Object.assign(t.style, { left: (b.left + b.width / 2) + 'px', top: (b.top + b.height * .2) + 'px', width: b.width * .45 + 'px', height: b.width * .45 + 'px' });
      room.appendChild(t); setTimeout(() => t.remove(), 2400);
    }
  }
  // 탁자 위에 찻잔이 놓이고 김이 오른다
  function objCup(b, petLeft) {
    // 탁자 윗면(그림 64칸 중 y 13~31, 가운데 꽃병)에서 친구가 서 있는 쪽 가장자리에 찻잔을 내려놓는다
    const c = document.createElement('div'); c.className = 'objcup';
    c.innerHTML = `<svg viewBox="0 -18 40 48"><g class="steam" fill="none" stroke="#C9B6C2" stroke-width="1.8" stroke-linecap="round"><path class="s0" d="M13 6 q-3 -4 0 -8 q3 -4 0 -8"/><path class="s1" d="M21 6 q-3 -4 0 -8 q3 -4 0 -8"/></g>
      <ellipse cx="17" cy="27.4" rx="15" ry="2.4" fill="#F3D3E2" stroke="#E5679A" stroke-width="1"/><path d="M6 10 h22 v8 a11 11 0 0 1 -22 0z" fill="#fff" stroke="#E5679A" stroke-width="2"/><path d="M28 12 a5 5 0 0 1 0 9" fill="none" stroke="#E5679A" stroke-width="2"/><ellipse cx="17" cy="11" rx="10" ry="2.4" fill="#C98B5A"/></svg>`;
    const w = b.width * .3, h = w * 48 / 40, surf = b.top + b.height * (24 / 64);
    const cx = b.left + b.width * (petLeft ? .24 : .76);
    Object.assign(c.style, { left: (cx - w * 17 / 40) + 'px', top: (surf - h * (47.5 / 48)) + 'px', width: w + 'px', height: h + 'px' });
    $('room').appendChild(c); setTimeout(() => c.remove(), 2700);
  }

  // ---------- 공: 손가락으로 던지면 굴러가고, 친구가 쫓아가 물어 온다 ----------
  const ballState = { x: 0, y: 0, vx: 0, vy: 0, flying: false, raf: 0, hist: [] };
  const ballSize = () => Math.max(46, $('room').getBoundingClientRect().width * .055);
  function floorY() { const r = $('room').getBoundingClientRect(); return r.height * .94 - ballSize(); }
  function drawBall() { const b = $('ball'); b.style.transform = `translate(${ballState.x}px,${ballState.y}px) rotate(${ballState.carry ? 0 : ballState.x * 2}deg) scale(${ballState.sc || 1})`; }
  function resetBall(x) {
    const r = $('room').getBoundingClientRect(), b = $('ball'); b.innerHTML = Scene.ball(); b.style.width = b.style.height = ballSize() + 'px';
    ballState.x = x != null ? x : r.width * .7; ballState.y = floorY(); b.style.display = S.stage >= 3 ? '' : 'none'; drawBall();
  }
  function stopBall() { cancelAnimationFrame(ballState.raf); cancelAnimationFrame(ballState.craf); ballState.flying = false; ballState.carry = false; ballState.sc = 1; ballState.fetching = false; }
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
  function throwBall(noFetch) {
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
      if (ballState.y >= fy && Math.abs(ballState.vx) < 25 && ballState.vy === 0) { ballState.flying = false; if (!noFetch) fetchBall(); return; }
      ballState.raf = requestAnimationFrame(step);
    };
    ballState.raf = requestAnimationFrame(step);
    if (!noFetch && !sleeping && !sulking && S.stage >= 3) speak('home', L4('ballGo'));
  }
  function fetchBall() {
    if (sleeping || sulking || S.stage < 3 || !$('scr-home').classList.contains('on')) return;
    const r = $('room').getBoundingClientRect(), pct = Math.max(12, Math.min(88, (ballState.x + ballSize() / 2) / r.width * 100));
    ballState.fetching = true;
    goTo(pct, () => {
      // 공을 입(구름이는 머리 위)에 물고 돌아온다
      react('happy', 'squish'); Snd.pop(); ballState.carry = true; ballState.sc = .8;
      const carry = () => {
        if (!ballState.carry) return;
        const rr = $('room').getBoundingClientRect(), pr = $('pet').getBoundingClientRect(), s = ballSize() * ballState.sc;
        const [mx, my] = Art.mouth(S.kind, S.stage);
        ballState.x = pr.left - rr.left + pr.width * mx - ballSize() / 2;
        ballState.y = S.kind === 'cloud' ? pr.top - rr.top + pr.height * (my - .34) - s * .55 : pr.top - rr.top + pr.height * my - ballSize() * .38;
        drawBall(); ballState.craf = requestAnimationFrame(carry);
      };
      carry();
      const back = R(40, 62);
      setTimeout(() => goTo(back, () => {
        // 내려놓기: 고개를 숙여 바로 앞 바닥에 살며시 놓는다
        ballState.carry = false; cancelAnimationFrame(ballState.craf);
        const rr2 = $('room').getBoundingClientRect(), pr2 = $('pet').getBoundingClientRect();
        const [mx2, my2] = Art.mouth(S.kind, S.stage), s0 = .8, side = Math.random() < .5 ? -1 : 1;
        const x0 = pr2.left - rr2.left + pr2.width * mx2 - ballSize() / 2;
        const y0 = S.kind === 'cloud' ? pr2.top - rr2.top + pr2.height * (my2 - .34) - ballSize() * s0 * .55 : pr2.top - rr2.top + pr2.height * my2 - ballSize() * .38;
        const x1 = Math.max(0, Math.min(rr2.width - ballSize(), pr2.left - rr2.left + pr2.width / 2 - ballSize() / 2 + side * pr2.width * .42)), y1 = floorY();
        const p2 = $('pet'); p2.classList.remove('bow'); void p2.offsetWidth; p2.classList.add('bow');
        const t0 = performance.now(), D = 650;
        const ease = (t) => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const lower = (now) => {
          const t = Math.max(0, Math.min(1, (now - t0) / D)), e = ease(t);
          ballState.x = x0 + (x1 - x0) * e; ballState.y = y0 + (y1 - y0) * e - Math.sin(Math.PI * t) * 10; ballState.sc = s0 + (1 - s0) * e; drawBall();
          if (t < 1) ballState.craf = requestAnimationFrame(lower); else { ballState.sc = 1; drawBall(); setTimeout(() => p2.classList.remove('bow'), 200); }
        };
        ballState.craf = requestAnimationFrame(lower); ballState.fetching = false;
        speak('home', L4('ballBack')); heartAtPet(); addNeed('mood', 4); addNeed('energy', -2);
        if (S.playToday < 10) { S.playToday++; addFriend(1); } renderNeeds(); save();
      }, true), 500);
    }, true);
  }

  // =====================================================================
  // 놀잇감: 상점에서 사서 방에 놓으면, 손가락으로 움직여 친구와 같이 논다
  // =====================================================================
  const TOYS = ['feather', 'bubbles', 'blocks', 'plane', 'yarn'];
  let toyOn = null, toySeq = 0, toyAbort = null;
  const TOY_LINE = {
    feather: { go: ['깃털이다! 잡아 볼 거야!', '살랑살랑~ 기다려, 잡는다!'], end: ['헥헥, 재밌었다! 또 하자!', '깃털 잡기 최고야!'] },
    bubbles: { go: ['비눗방울이다! 내가 다 터뜨릴 거야!', '방울방울~ 예쁘다!'], end: ['톡톡! 방울 터뜨리기 재밌어!', '무지개 방울이었어. 또 불어 줘!'] },
    plane: { go: ['종이비행기 날리는 거야? 두근두근!', '멀리멀리 날려 줘!'], end: ['내가 물어 왔어! 또 날려 줘!', '비행기 찾았다! 잘했지?'] },
    yarn: { go: ['털실 공이다! 데굴데굴~', '굴려 줘, 굴려 줘!'], end: ['털실 다 감았어! 영차영차.', '털실 공이랑 노는 거 재밌어!'] },
    blocks: { go: ['블록 쌓기 하자! 높이높이!', '내가 옆에서 볼게. 차곡차곡 쌓아 줘!'], end: ['와르르! 하하, 또 쌓자!', '무너뜨리는 게 제일 재밌어!'] }
  };
  const TL = (id, k) => level() === 'talk' ? pick(TOY_LINE[id][k]) : L3('care');
  const rr = () => $('room').getBoundingClientRect();
  function petBox() { const r = rr(), p = $('pet').getBoundingClientRect(); return { x: p.left - r.left + p.width / 2, top: p.top - r.top, w: p.width, h: p.height }; }
  // 친구가 손가락을 따라 빠르게 쫓아간다
  function chase(px) {
    const r = rr(), wk = $('walker'), pct = clamp(px / r.width * 100, 10, 88), cur = parseFloat(wk.style.left) || 55;
    if (Math.abs(pct - cur) < 2.5) { $('pet').classList.remove('walking'); return; }
    wk.style.transitionDuration = Math.max(.25, Math.abs(pct - cur) / 110) + 's'; wk.style.left = pct + '%';
    const p = $('pet'); if (!p.classList.contains('walking')) { p.classList.add('walking'); setTimeout(() => p.classList.remove('walking'), 900); }
  }
  function petHop() { const p = $('pet'); p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); drawPet('happy'); }
  function toyBegin(id) {
    if (S.stage < 3) { speak('home', '(알에서 나오면 같이 놀 수 있어요)', { silent: true }); return 0; }
    if (sulking) { speak('home', L3('sulk'), { silent: true }); return 0; }
    if (sleeping) { speak('home', level() === 'talk' ? '음냐… 지금은 졸려…' : '(새근새근…)', { silent: true }); return 0; }
    if (toyOn || ballState.fetching || ballState.flying || editing) return 0;
    if (S.needs.energy < 20) { refuse('toy', level() === 'talk' ? '너무 졸려서 못 놀겠어… 먼저 재워 줘.' : '(하암…)', 'sleepy'); return 0; }
    toyOn = id; clearTimeout(wanderT); objBusy = Date.now() + 36e5;
    const wk = $('walker'); wk.classList.remove('flying'); wk.style.bottom = ''; poked();
    return ++toySeq;
  }
  function toyEnd(tok, ln) {
    if (tok !== toySeq || !toyOn) return;
    toyOn = null; toyAbort = null; toySeq++;
    const wk = $('walker'); wk.style.transitionDuration = ''; $('pet').classList.remove('walking');
    $('room-bg').innerHTML = roomSVG();
    objBusy = Date.now() + 2500; startWander(); lastTouch = Date.now();
    if (ln) { react('happy', 'hop'); speak('home', ln); heartAtPet(); }
    addNeed('mood', 5); addNeed('energy', -3); if (S.playToday < 10) { S.playToday++; addFriend(1); } renderNeeds(); save();
  }
  const homeOn = () => $('scr-home').classList.contains('on') && !document.querySelector('.overlay.on');
  function toyDown(k, e, el, b) {
    const tok = toyBegin(k); if (!tok) return;
    e.preventDefault(); try { el.setPointerCapture(e.pointerId); } catch (x) {}
    Snd.tap();
    ({ feather: featherPlay, bubbles: bubblePlay, blocks: blockPlay, plane: planePlay, yarn: yarnPlay })[k](tok, e, el, b);
  }
  function listen(el, move, up) {
    const u = (ev) => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', u); el.removeEventListener('pointercancel', u); up(ev); };
    el.addEventListener('pointermove', move); el.addEventListener('pointerup', u); el.addEventListener('pointercancel', u);
  }
  const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; d.innerHTML = html; $('room').appendChild(d); return d; };

  // ---- 1. 깃털 낚싯대: 손가락으로 흔들면 친구가 쫓아와 폴짝 뛰어 잡는다 ----
  function featherPlay(tok, e, el) {
    $('room-bg').innerHTML = roomSVG('feather');
    const f = mk('tfeather', `<svg viewBox="0 0 60 110" aria-hidden="true"><path d="M30 0 V56" stroke="#A8A3B8" stroke-width="1.6"/><g class="fsw"><path d="M30 56 c-13 4 -17 24 -10 42 c11 -5 17 -22 10 -42z" fill="#F7A0C1" stroke="#E5679A" stroke-width="2"/><path d="M30 58 l-8 36" stroke="#E5679A" stroke-width="1.4"/><path d="M30 56 c9 6 11 20 6 32 c-4 -6 -6 -18 -6 -32z" fill="#FFD3E4" stroke="#E5679A" stroke-width="1.4"/></g></svg>`);
    let px = 0, py = 0, lastX = 0, vx = 0, held = true, catches = 0, hopT = 0, chaseT = 0;
    const move = (ev) => { const r = rr(); px = ev.clientX - r.left; py = Math.min(ev.clientY - r.top, r.height * .8); };
    move(e); lastX = px; speak('home', TL('feather', 'go'));
    const stop = () => { held = false; f.classList.add('away'); setTimeout(() => f.remove(), 300); };
    toyAbort = () => { stop(); toyEnd(tok); };
    const tick = (t) => {
      if (!held) return;
      if (!homeOn()) { toyAbort && toyAbort(); return; }
      vx = vx * .8 + (px - lastX) * .2; lastX = px;
      const fh = f.offsetHeight, fw = f.offsetWidth;
      f.style.transform = `translate(${px - fw / 2}px, ${py - 8}px) rotate(${clamp(-vx * 1.6, -38, 38)}deg)`;
      const fx = px, fy = py + fh * .75;
      if (t - chaseT > 150) { chaseT = t; chase(fx); }
      const pb = petBox();
      if (Math.abs(pb.x - fx) < pb.w * .45 && fy > pb.top - pb.h * .7 && fy < pb.top + pb.h * .9 && t - hopT > 850) {
        hopT = t; petHop(); Snd.pop();
        if (Math.random() < .65) { catches++; heartAtPet(); f.classList.remove('caught'); void f.offsetWidth; f.classList.add('caught'); if (catches % 3 === 1) speak('home', level() === 'talk' ? pick(['잡았다!', '폴짝! 잡았어!', '깃털 냠!']) : L3('care'), { silent: true }); }
        else if (Math.random() < .3) speak('home', level() === 'talk' ? '앗, 놓쳤다! 다시!' : L3('care'), { silent: true });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    listen(el, move, () => { stop(); setTimeout(() => toyEnd(tok, TL('feather', 'end') + (catches && level() === 'talk' ? ` 깃털을 ${catches}번이나 잡았어!` : '')), 350); });
  }

  // ---- 2. 비눗방울: 막대를 휘두르면 방울이 퍼지고, 친구가 쫓아가 터뜨린다 ----
  function bubblePlay(tok, e, el) {
    const wand = mk('twand', `<svg viewBox="0 0 40 80" aria-hidden="true"><circle cx="20" cy="14" r="11" fill="rgba(220,240,255,.4)" stroke="#F7A0C1" stroke-width="3.4"/><path d="M20 25 V78" stroke="#F7A0C1" stroke-width="4" stroke-linecap="round"/></svg>`);
    const bubs = []; let px = 0, py = 0, lx = null, ly = null, held = true, pops = 0, last = performance.now(), lastSpawn = 0, chaseT = 0, hopT = 0, ended = false;
    const move = (ev) => { const r = rr(); px = ev.clientX - r.left; py = ev.clientY - r.top; };
    move(e); speak('home', TL('bubbles', 'go'));
    const spawn = (x, y) => {
      if (bubs.length > 22) return; const s = R(26, 50), d = document.createElement('i'); d.className = 'tbub';
      d.style.width = d.style.height = s + 'px'; $('room').appendChild(d);
      bubs.push({ el: d, x, y, s, vy: R(28, 56), ph: Math.random() * 6, age: 0 });
    };
    const finish = () => { if (ended) return; ended = true; bubs.forEach(B => B.el.remove()); bubs.length = 0; wand.remove(); toyEnd(tok, TL('bubbles', 'end') + (pops && level() === 'talk' ? ` 방울을 ${pops}개나 터뜨렸어!` : '')); };
    toyAbort = () => { held = false; ended = true; bubs.forEach(B => B.el.remove()); bubs.length = 0; wand.remove(); toyEnd(tok); };
    const tick = (t) => {
      if (ended) return;
      if (!homeOn()) { toyAbort && toyAbort(); return; }
      const dt = Math.min(.05, (t - last) / 1000); last = t; const r = rr(), floor = r.height * .93;
      if (held) {
        wand.style.transform = `translate(${px - wand.offsetWidth / 2}px, ${py - wand.offsetHeight * .18}px)`;
        const dist = lx == null ? 99 : Math.hypot(px - lx, py - ly);
        if (dist > 30 && t - lastSpawn > 80) { lastSpawn = t; lx = px; ly = py; spawn(px + R(-8, 8), py - 6); }
      }
      const pb = petBox();
      for (let i = bubs.length - 1; i >= 0; i--) {
        const B = bubs[i]; B.age += dt; B.y += B.vy * dt; B.x += Math.sin(B.age * 2.2 + B.ph) * 22 * dt;
        B.el.style.transform = `translate(${B.x - B.s / 2}px, ${B.y - B.s / 2}px)`;
        const hit = Math.abs(B.x - pb.x) < pb.w * .38 && B.y > pb.top + pb.h * .05 && B.y < pb.top + pb.h;
        if (hit || B.y > floor || B.age > 10) {
          B.el.classList.add('pop'); const d = B.el; setTimeout(() => d.remove(), 220); bubs.splice(i, 1);
          if (hit) { pops++; Snd.pop(); if (t - hopT > 450) { hopT = t; petHop(); } if (pops % 5 === 0) bubbleCandy(); }
        }
      }
      if (bubs.length && t - chaseT > 200) { chaseT = t; const tgt = bubs.reduce((a, b2) => (b2.y > a.y ? b2 : a)); chase(tgt.x); }
      if (held || bubs.length) requestAnimationFrame(tick); else finish();
    };
    requestAnimationFrame(tick);
    listen(el, move, () => { held = false; wand.classList.add('away'); });
  }
  function bubbleCandy() {
    if (S.bubDay !== S.day) { S.bubDay = S.day; S.bubN = 0; }
    if (S.bubN < 5) { S.bubN++; S.candy++; hud(); toast('방울 5개를 터뜨렸어요! <b>별사탕 +1</b>'); }
  }

  // ---- 3. 종이비행기: 끌어서 날리면 친구가 쫓아가 물어 온다 ----
  const PLANE = `<svg viewBox="0 0 100 60" aria-hidden="true"><path d="M98 30 L4 6 L30 30 Z" fill="#fff" stroke="#7FB0EA" stroke-width="2.6" stroke-linejoin="round"/><path d="M98 30 L30 30 L18 54 Z" fill="#E3EEFF" stroke="#7FB0EA" stroke-width="2.6" stroke-linejoin="round"/><path d="M60 22 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z" fill="#FFD36E"/></svg>`;
  function planePlay(tok, e, el, b) {
    $('room-bg').innerHTML = roomSVG('plane');
    const pl = mk('tplane', PLANE), st = { x: 0, y: 0, vx: 0, vy: 0, a: 0, dir: 1 }, hist = [];
    const set = () => { const w = pl.offsetWidth; pl.style.transform = `translate(${st.x - w / 2}px, ${st.y - w * .3}px) scaleX(${st.dir}) rotate(${st.a}deg)`; };
    const move = (ev) => { const r = rr(); st.x = ev.clientX - r.left; st.y = Math.min(ev.clientY - r.top, r.height * .88); hist.push([st.x, st.y, performance.now()]); if (hist.length > 6) hist.shift(); set(); };
    move(e); speak('home', TL('plane', 'go'));
    let alive = true;
    toyAbort = () => { alive = false; pl.remove(); toyEnd(tok); };
    listen(el, move, () => {
      const a = hist[0], z = hist[hist.length - 1], dt = Math.max(16, z[2] - a[2]) / 1000, r = rr();
      st.vx = (z[0] - a[0]) / dt; st.vy = (z[1] - a[1]) / dt; const sp = Math.hypot(st.vx, st.vy);
      if (sp > 1700) { st.vx *= 1700 / sp; st.vy *= 1700 / sp; }
      if (sp < 160) { st.vx = (st.x < r.width / 2 ? 1 : -1) * 650; st.vy = -160; }
      const x0 = st.x; let last = performance.now(); Snd.tap();
      const step = (t) => {
        if (!alive) return; if (!homeOn()) { toyAbort && toyAbort(); return; }
        const d = Math.min(.033, (t - last) / 1000); last = t; const R0 = rr(), floor = R0.height * .9;
        st.vy += (430 - Math.min(300, Math.abs(st.vx) * .32)) * d; st.vx *= Math.pow(.62, d);
        st.x += st.vx * d; st.y += st.vy * d;
        if (st.x < 24) { st.x = 24; st.vx = Math.abs(st.vx) * .4; } if (st.x > R0.width - 24) { st.x = R0.width - 24; st.vx = -Math.abs(st.vx) * .4; }
        if (st.y < 12) { st.y = 12; st.vy = Math.abs(st.vy) * .3; }
        st.dir = st.vx < 0 ? -1 : 1; st.a = clamp(Math.atan2(st.vy, Math.abs(st.vx)) * 180 / Math.PI * .7, -30, 40);
        if (st.y >= floor) { st.y = floor; st.a = 0; set(); return landed(Math.abs(st.x - x0)); }
        set(); requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const landed = (dist) => {
      Snd.pop(); const r = rr(), m = (dist / r.width * 4).toFixed(1);
      if (level() === 'talk') speak('home', `우와, ${m} m나 날아갔어! 내가 가져올게!`);
      setTimeout(() => {
        if (!alive || tok !== toySeq) return;
        goTo(clamp(st.x / r.width * 100, 10, 88), () => {
          if (!alive || tok !== toySeq) return;
          petHop(); Snd.pop();
          const carry = () => { if (!alive) return; const pb = petBox(); st.x = pb.x + pb.w * .22 * st.dir; st.y = pb.top + pb.h * .42; st.a = -8; set(); pl._raf = requestAnimationFrame(carry); };
          carry();
          setTimeout(() => goTo(clamp((b.left + b.width / 2) / rr().width * 100, 10, 88), () => {
            alive = false; cancelAnimationFrame(pl._raf); pl.classList.add('away'); setTimeout(() => pl.remove(), 300);
            toyEnd(tok, TL('plane', 'end'));
          }, true), 400);
        }, true);
      }, 700);
    };
  }

  // ---- 4. 털실 공: 굴리면 실이 풀리고, 친구가 공을 굴려 오며 실을 감는다 ----
  function yarnPlay(tok, e, el, b) {
    $('room-bg').innerHTML = roomSVG('yarn');
    const r0 = rr(), ys = Math.max(38, Math.min(60, r0.width * .045));
    const yb = mk('tyarn', `<svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#F7A0C1" stroke="#E5679A" stroke-width="2"/><path d="M5 14 q15 6 30 -2 M3 22 q17 8 34 -2 M9 32 q12 3 22 -6 M15 3 q-5 17 4 34" stroke="#E5679A" stroke-width="1.7" fill="none"/></svg>`);
    yb.style.width = yb.style.height = ys + 'px';
    const th = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); th.setAttribute('class', 'tthread'); th.innerHTML = '<path d=""/>'; $('room').appendChild(th);
    const floorTop = () => rr().height * .93 - ys;
    const st = { x: clamp(b.left + b.width / 2 - ys / 2, 0, r0.width - ys), rot: 0, vx: 0 }, sx = st.x + ys / 2, hist = [];
    const draw = () => {
      yb.style.transform = `translate(${st.x}px, ${floorTop()}px) rotate(${st.rot}deg)`;
      const cx = st.x + ys / 2, fy = floorTop() + ys * .9;
      th.firstChild.setAttribute('d', Math.abs(cx - sx) < 2 ? '' : `M${sx} ${fy} C${(sx * 2 + cx) / 3} ${fy + 5} ${(sx + cx * 2) / 3} ${fy - 4} ${cx} ${fy}`);
    };
    draw(); speak('home', TL('yarn', 'go'));
    let alive = true;
    const clean = () => { alive = false; yb.remove(); th.remove(); };
    toyAbort = () => { clean(); toyEnd(tok); };
    const move = (ev) => { const r = rr(), nx = clamp(ev.clientX - r.left - ys / 2, 0, r.width - ys); st.rot += (nx - st.x) / (Math.PI * ys) * 360; st.x = nx; hist.push([ev.clientX, performance.now()]); if (hist.length > 6) hist.shift(); draw(); };
    listen(el, move, () => {
      const r = rr(); if (hist.length > 1) { const a = hist[0], z = hist[hist.length - 1]; st.vx = (z[0] - a[0]) / Math.max(16, z[1] - a[1]) * 1000; }
      if (Math.abs(st.vx) < 160) st.vx = (st.x + ys / 2 < r.width / 2 ? 1 : -1) * 750;
      st.vx = clamp(st.vx, -1500, 1500);
      let last = performance.now();
      const roll = (t) => {
        if (!alive) return; if (!homeOn()) { toyAbort && toyAbort(); return; }
        const d = Math.min(.033, (t - last) / 1000); last = t; const R0 = rr();
        st.vx *= Math.pow(.35, d); st.x += st.vx * d; st.rot += st.vx * d / (Math.PI * ys) * 360;
        if (st.x < 0) { st.x = 0; st.vx = Math.abs(st.vx) * .5; Snd.pop(); } if (st.x > R0.width - ys) { st.x = R0.width - ys; st.vx = -Math.abs(st.vx) * .5; Snd.pop(); }
        draw();
        if (Math.abs(st.vx) < 18) return stopped();
        requestAnimationFrame(roll);
      };
      requestAnimationFrame(roll);
    });
    const stopped = () => {
      const r = rr(), cm = Math.round(Math.abs(st.x + ys / 2 - sx) / r.width * 400 / 10) * 10;
      speak('home', level() === 'talk' ? (cm > 0 ? `털실이 ${cm} cm나 풀렸어! 내가 감아 올게.` : '데굴… 하나도 안 굴러갔네? 헤헤.') : L3('care'));
      setTimeout(() => {
        if (!alive || tok !== toySeq) return;
        const dir = st.x + ys / 2 > sx ? 1 : -1;
        goTo(clamp((st.x + ys / 2 - dir * ys * .9) / r.width * 100, 10, 88), () => {
          if (!alive || tok !== toySeq) return;
          // 친구 앞에서 공을 밀며 돌아온다: 실이 줄어든다
          const push = () => { if (!alive) return; const pb = petBox(), nx = clamp(pb.x - ys / 2 - dir * pb.w * .4, 0, rr().width - ys); st.rot += (nx - st.x) / (Math.PI * ys) * 360; st.x = nx; draw(); yb._raf = requestAnimationFrame(push); };
          push();
          goTo(clamp((sx + dir * ys) / rr().width * 100, 10, 88), () => { cancelAnimationFrame(yb._raf); clean(); toyEnd(tok, TL('yarn', 'end')); }, false);
        }, true);
      }, 900);
    };
  }

  // ---- 5. 블록 쌓기: 블록을 끌어다 쌓으면 친구가 세어 주고, 다 쌓으면 와르르 ----
  function blockPlay(tok, e, el, b) {
    const r = rr(), u = clamp(r.width * .05, 34, 58), floor = r.height * .93;
    const SPEC = [[1, 1, '#F7A0C1'], [2, 1, '#8FE0C9'], [1, 1, '#9EC2F2'], [1, 2, '#FFB9A6'], [2, 1, '#C9B8FF'], [1, 1, '#FFD36E']];
    const toyRight = b.left + b.width / 2 > r.width / 2, baseX = r.width * (toyRight ? .3 : .68);
    const lay = mk('tblocks', `<div class="tmat" style="left:${baseX - u * 1.5}px;top:${floor - 5}px;width:${u * 3}px"></div><button class="btn small tdone">그만할래요</button>`);
    speak('home', TL('blocks', 'go')); goTo(clamp((baseX + (toyRight ? -1 : 1) * u * 2.6) / r.width * 100, 10, 88), null, true);
    let stackTop = floor, alive = true; const stack = [];
    const trayW = SPEC.reduce((t, q) => t + q[0] * u + 8, 0), trayX0 = toyRight ? r.width - trayW - 70 : 16;
    const blocks = SPEC.map(([w, h, c], i) => {
      const d = document.createElement('div'); d.className = 'tblk'; d.style.width = w * u + 'px'; d.style.height = h * u + 'px'; d.style.background = c; lay.appendChild(d);
      const B = { el: d, cube: w === h, w: w * u, h: h * u, hx: 0, hy: 0, x: 0, y: 0 };
      B.hx = trayX0 + SPEC.slice(0, i).reduce((s, q) => s + q[0] * u + 8, 0); B.hy = floor - B.h; B.x = B.hx; B.y = B.hy;
      return B;
    });
    const put = (B) => { B.el.style.transform = `translate(${B.x}px, ${B.y}px) rotate(${B.rot || 0}deg)`; };
    blocks.forEach(put);
    const close = (ln) => { if (!alive) return; alive = false; lay.classList.add('away'); setTimeout(() => lay.remove(), 300); toyEnd(tok, ln); };
    toyAbort = () => { alive = false; lay.remove(); toyEnd(tok); };
    lay.querySelector('.tdone').onclick = () => { Snd.tap(); close(stack.length ? TL('blocks', 'end') : null); };
    blocks.forEach(B => {
      B.el.addEventListener('pointerdown', (ev) => {
        if (B.stacked || !alive) return; ev.preventDefault(); try { B.el.setPointerCapture(ev.pointerId); } catch (x) {}
        const R0 = rr(), ox = ev.clientX - R0.left - B.x, oy = ev.clientY - R0.top - B.y; B.el.classList.remove('anim'); B.el.classList.add('held'); poked();
        const mv = (m) => { const R1 = rr(); B.x = m.clientX - R1.left - ox; B.y = m.clientY - R1.top - oy; put(B); };
        listen(B.el, mv, () => {
          B.el.classList.remove('held'); B.el.classList.add('anim');
          const cx = B.x + B.w / 2;
          if (Math.abs(cx - baseX) < u * 1.8 && B.y + B.h < stackTop + u) {
            B.stacked = true; B.x = baseX - B.w / 2 + R(-4, 4); B.y = stackTop - B.h; stackTop = B.y; stack.push(B); put(B); B.el.classList.add('stacked');
            Snd.pop(); petHop();
            if (stack.length < blocks.length) speak('home', level() === 'talk' ? pick([`${stack.length}층!`, `${stack.length}층이야! 더 높이!`, '차곡차곡~']) : L3('care'), { silent: true });
            else allDone();
          } else { B.x = B.hx; B.y = B.hy; put(B); }
        });
      });
    });
    const allDone = () => {
      const c = stack.filter(B => B.cube).length, n = stack.length - c;
      speak('home', level() === 'talk' ? `정육면체 ${c}개, 직육면체 ${n}개로 쌓았어! 우와, 높다~` : L3('care')); Snd.combo(); sparks($('room'), 12, baseX, stackTop);
      setTimeout(() => {
        if (!alive || tok !== toySeq) return;
        goTo(clamp((baseX + (toyRight ? -1 : 1) * u * 1.4) / rr().width * 100, 10, 88), () => {
          if (!alive) return; petHop();
          stack.forEach((B, i) => { B.el.classList.remove('anim'); B.el.classList.add('fall'); B.x += (toyRight ? 1 : -1) * R(20, 90) * (1 + i * .5); B.y = floor - B.h; B.rot = R(-90, 90); setTimeout(() => put(B), i * 60); setTimeout(() => Snd.pop(), 300 + i * 90); });
          setTimeout(() => close(TL('blocks', 'end')), 1700);
        }, true);
      }, 2200);
    };
  }

  // ---------- 책장: 책 속 수수께끼 (문제 1개씩, 계속 읽을 수 있다) ----------
  let rq = null;
  function openRiddle() {
    $('riddle-pet').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    nextRiddle(); overlay('ov-riddle', true);
  }
  function rsay(t) { const b = $('riddle-say'); b.querySelector('span').innerHTML = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); emoteText('riddle', t); }
  function nextRiddle() {
    rq = Prob.next(S.rot, S.review, S.total, weakUnits()); const U = Prob.UNITS[rq.unit];
    rsay(L4('read')); $('rq-more').style.display = 'none';
    const tag = $('rq-tag'); tag.innerHTML = `${U.sem}학기 · ${U.name} ${SC('+1')}`; tag.classList.toggle('s1', U.sem === 1);
    $('rq-fig').innerHTML = rq.fig; $('rq-text').innerHTML = rq.q; $('rq-text').classList.toggle('long', rq.q.replace(/<[^>]+>/g, '').length > 34 || !!rq.fig);
    const box = $('rq-choices'); box.innerHTML = ''; box.className = 'choices' + (rq.choices.length === 3 ? ' three' : '');
    rq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (rq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => riddleAnswer(b, c); box.appendChild(b); });
    rq.lock = false; save();
  }
  function riddleAnswer(btn, c) {
    if (rq.lock) return; rq.lock = true; const ok = c === rq.ans, st = S.stats[rq.unit] || (S.stats[rq.unit] = { c: 0, w: 0 }); S.total++; rec(rq.unit, ok);
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
    if (canGrow()) setTimeout(() => levelUp(), 300);
  };

  // =====================================================================
  // 텃밭: 씨앗을 심고, 문제를 풀어 물을 주면 실제 하루가 지날 때마다 자란다. 수확물은 요리 재료
  // =====================================================================
  const SEEDS = {
    berry: { name: '딸기', get: 'berry', getName: '딸기' },
    carrot: { name: '당근', get: 'carrot', getName: '당근' },
    flower: { name: '꿀꽃', get: 'honey', getName: '꿀' }
  };
  const ING_NAME = { berry: '딸기', carrot: '당근', honey: '꿀' };
  const NEED = { milk: 'berry', cake: 'carrot', pancake: 'honey' }; // 요리에 필요한 재료
  const RIPE = 3; // 0 씨앗 → 1 새싹 → 2 잎 → 3 수확
  function initGarden() {
    if (!S.garden) S.garden = [null, null, null, null];
    if (!S.pantry) S.pantry = { berry: 2, carrot: 2, honey: 2 }; // 처음엔 조금 나눠 준다
  }
  // 물을 준 다음 날이 되면 한 단계 자란다
  function growGarden() {
    initGarden();
    S.garden.forEach(p => { if (p && p.stage < RIPE && p.watered != null && p.watered < S.days) { p.stage++; p.watered = null; } });
  }
  function plantSVG(seed, stage) {
    const soil = `<ellipse cx="40" cy="66" rx="34" ry="10" fill="#B98A6A"/><ellipse cx="40" cy="63" rx="30" ry="7" fill="#C99A78"/>`;
    if (!seed) return `<svg viewBox="0 0 80 80">${soil}<g fill="#A37656"><circle cx="30" cy="63" r="1.6"/><circle cx="48" cy="62" r="1.6"/></g></svg>`;
    const leaf = (x, y, r, s = 1) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 C-6 -10 -2 -20 0 -22 C2 -20 6 -10 0 0Z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1.6"/>`;
    let g = '';
    if (stage === 0) g = `<ellipse cx="40" cy="60" rx="7" ry="4" fill="#8C6248"/><circle cx="40" cy="58" r="2" fill="#C9A27E"/>`;
    if (stage === 1) g = `<path d="M40 62 v-10" stroke="#4FAA6C" stroke-width="3"/>${leaf(40, 52, -40, .6)}${leaf(40, 52, 40, .6)}`;
    if (stage === 2) g = `<path d="M40 62 v-20" stroke="#4FAA6C" stroke-width="3.4"/>${leaf(40, 50, -55, .9)}${leaf(40, 50, 55, .9)}${leaf(40, 42, -20, .8)}${leaf(40, 42, 20, .8)}`;
    if (stage >= RIPE) {
      if (seed === 'berry') g = `<path d="M40 62 v-16" stroke="#4FAA6C" stroke-width="3"/>${leaf(32, 50, -60)}${leaf(48, 50, 60)}${leaf(40, 44, 0, .9)}${[[26, 54], [54, 54], [40, 36]].map(([x, y]) => `<path transform="translate(${x} ${y})" d="M0 -6 C7 -7 9 0 6 6 C4 9 -4 9 -6 6 C-9 0 -7 -7 0 -6Z" fill="#F2678F" stroke="#C9466F" stroke-width="1.4"/><path transform="translate(${x} ${y - 6})" d="M-4 0 l2 -3 2 2 2 -2 2 3z" fill="#7FCF95"/>`).join('')}`;
      if (seed === 'carrot') g = `${leaf(40, 52, -30, 1.1)}${leaf(40, 52, 30, 1.1)}${leaf(40, 52, 0, 1.2)}<path d="M33 56 h14 l-7 10z" fill="#FFA05A" stroke="#D9742F" stroke-width="1.8" stroke-linejoin="round"/>`;
      if (seed === 'flower') g = `<path d="M40 62 v-26" stroke="#4FAA6C" stroke-width="3"/>${leaf(40, 52, -50, .8)}${leaf(40, 52, 50, .8)}${[0, 72, 144, 216, 288].map(a => `<circle cx="${40 + Math.cos(a * Math.PI / 180) * 7}" cy="${30 + Math.sin(a * Math.PI / 180) * 7}" r="6" fill="#FFD36E" stroke="#E8A93C" stroke-width="1.2"/>`).join('')}<circle cx="40" cy="30" r="5" fill="#E5679A"/><g transform="translate(58 22)"><ellipse rx="5" ry="4" fill="#FFD36E" stroke="#4A3552" stroke-width="1.2"/><path d="M-1 -4 v8 M2 -4 v8" stroke="#4A3552" stroke-width="1.2"/><ellipse cx="-2" cy="-5" rx="3" ry="2" fill="#fff" opacity=".9"/></g>`;
    }
    return `<svg viewBox="0 0 80 80">${soil}${g}</svg>`;
  }
  const ingIcon = (k) => CookFX.ing(k === 'honey' ? 'honey' : k);
  let gq = null, gPlot = -1;
  function openGarden() {
    growGarden(); save(); gq = null; renderGarden(); overlay('ov-garden', true);
  }
  function renderGarden() {
    initGarden();
    $('garden-pantry').innerHTML = Object.keys(ING_NAME).map(k => `<span class="pan"><span class="pi">${ingIcon(k)}</span>${ING_NAME[k]} <b>${S.pantry[k] || 0}</b></span>`).join('');
    $('garden-quiz').style.display = gq ? '' : 'none'; $('garden-plots').style.display = gq ? 'none' : '';
    if (gq) return;
    $('garden-plots').innerHTML = S.garden.map((p, i) => {
      let st = '', btn = '';
      if (!p) { st = '빈 밭'; btn = `<button class="btn primary" data-act="plant" data-i="${i}">씨앗 심기</button>`; }
      else if (p.stage >= RIPE) { st = `${SEEDS[p.seed].name} 다 자랐어요!`; btn = `<button class="btn primary" data-act="harvest" data-i="${i}">수확하기</button>`; }
      else if (p.watered != null) { st = `${SEEDS[p.seed].name} · 물을 줬어요`; btn = `<small class="wait">내일 자라요</small>`; }
      else { st = `${SEEDS[p.seed].name} · ${['씨앗', '새싹', '잎'][p.stage]}`; btn = `<button class="btn" data-act="water" data-i="${i}">물 주기 (문제 1개) ${SC('+1')}</button>`; }
      return `<div class="plot ${p && p.watered != null ? 'wet' : ''}"><span class="pa">${plantSVG(p && p.seed, p ? p.stage : 0)}</span><b>${st}</b>${p && p.stage < RIPE ? `<span class="pbar"><i style="width:${(p.stage / RIPE) * 100}%"></i></span>` : ''}${btn}</div>`;
    }).join('');
    $('garden-plots').querySelectorAll('[data-act]').forEach(b => b.onclick = () => { Snd.tap(); gardenAct(b.dataset.act, +b.dataset.i); });
  }
  function gardenAct(act, i) {
    if (act === 'plant') {
      $('garden-plots').innerHTML = `<div class="seed-pick"><p class="sub">무엇을 심을까요?</p>${Object.keys(SEEDS).map(k => `<button class="pick" data-seed="${k}"><span class="pa">${plantSVG(k, RIPE)}</span><b>${SEEDS[k].name}</b><small>${SEEDS[k].getName} 2개 수확</small></button>`).join('')}</div>`;
      $('garden-plots').querySelectorAll('[data-seed]').forEach(b => b.onclick = () => { Snd.pop(); S.garden[i] = { seed: b.dataset.seed, stage: 0, watered: null }; S.log.push({ e: 'plant', id: b.dataset.seed }); save(); renderGarden(); toast('씨앗을 심었어요. <b>물</b>을 주면 내일 싹이 나요!'); });
    } else if (act === 'harvest') {
      const p = S.garden[i], k = SEEDS[p.seed].get; S.pantry[k] = (S.pantry[k] || 0) + 2; S.garden[i] = null;
      Snd.combo(); S.log.push({ e: 'harvest', id: k }); addFriend(2); save(); renderGarden(); toast(`<b>${ING_NAME[k]} 2개</b>를 거뒀어요! 요리에 쓸 수 있어요`);
    } else if (act === 'water') { gPlot = i; nextGardenQ(); }
  }
  // ---------- 물 주기: 물뿌리개를 손가락으로 끌어 흙 위에서 기울이면 물이 쏟아진다 ----------
  // 물뿌리개 그림: 몸통 안에 물 높이(lv 0~1)를 그린다. tap=true면 위에 수도꼭지와 물줄기까지
  let canN = 0;
  const CAN_BODY = 'M30 30 h50 a6 6 0 0 1 6 6 v40 a8 8 0 0 1 -8 8 h-46 a8 8 0 0 1 -8 -8 v-40 a6 6 0 0 1 6 -6z';
  function canSVG(tap) {
    const id = 'cnb' + (++canN);
    return `<svg viewBox="0 ${tap ? -46 : 0} 120 ${tap ? 136 : 90}" aria-hidden="true"><defs><clipPath id="${id}"><path d="${CAN_BODY}"/></clipPath></defs>
    ${tap ? `<path d="M4 -36 H50 a8 8 0 0 1 8 8 v4" fill="none" stroke="#AEB9C8" stroke-width="10" stroke-linecap="round"/><rect x="48" y="-24" width="20" height="8" rx="3" fill="#8F9CAE"/><path d="M30 -36 v-6" stroke="#8F9CAE" stroke-width="4"/><rect x="22" y="-46" width="16" height="6" rx="3" fill="#F28F8F"/>
      <rect class="cstream" x="53" y="-16" width="10" height="0" rx="4" fill="#7FB0EA"/>` : ''}
    <path d="M86 40 q24 -4 24 22 q0 12 -14 16" fill="none" stroke="#5D8FD0" stroke-width="5" stroke-linecap="round"/>
    <path d="M26 44 L6 22" stroke="#5D8FD0" stroke-width="7" stroke-linecap="round"/><ellipse cx="5" cy="20" rx="6" ry="8" transform="rotate(-40 5 20)" fill="#7FB0EA" stroke="#5D8FD0" stroke-width="2.4"/>
    <path d="${CAN_BODY}" fill="#E4EFFC"/>
    <g clip-path="url(#${id})"><rect class="cw" x="20" y="84" width="72" height="0" fill="#6EA8EE"/><rect class="cws" x="20" y="84" width="72" height="3" fill="#B5D5FA" opacity="0"/></g>
    <path d="M36 40 v30" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/><path d="M58 52 l2 4 4.5 .6 -3.3 3.1 .8 4.5 -4 -2.2 -4 2.2 .8 -4.5 -3.3 -3.1 4.5 -.6z" fill="#FFD36E"/>
    <path d="${CAN_BODY}" fill="none" stroke="#5D8FD0" stroke-width="3"/></svg>`;
  }
  function setCan(el, lv, stream) {
    if (!el) return; const y = 84 - 54 * Math.max(0, Math.min(1, lv));
    const w = el.querySelector('.cw'), ws = el.querySelector('.cws'), sm = el.querySelector('.cstream');
    if (w) { w.setAttribute('y', y); w.setAttribute('height', 84 - y); }
    if (ws) { ws.setAttribute('y', y - 1); ws.setAttribute('opacity', lv > .02 ? 1 : 0); }
    if (sm) sm.setAttribute('height', stream ? Math.max(0, y + 16) : 0);
  }
  let wcan = null;
  function startWatering(i) {
    const p = S.garden[i], N = 8;
    $('garden-quiz').style.display = 'none'; const box = $('garden-plots'); box.style.display = '';
    box.innerHTML = `<div class="wstage" id="wstage"><p class="sub whint">물뿌리개를 끌어다 흙 위에서 물을 뿌려 주세요</p>
      <div class="wplant">${plantSVG(p.seed, p.stage).replace(/<ellipse cx="40" cy="6[36]"[^>]*\/>/g, '')}</div>
      <div class="wsoil" id="wsoil">${'<i></i>'.repeat(N)}</div>
      <div class="wbar"><i id="wbar"></i></div>
      <div class="wcan" id="wcan">${canSVG(false)}</div></div>`;
    const st = $('wstage'), can = $('wcan'), soil = $('wsoil'), cells = [...soil.children], wet = new Array(N).fill(0);
    let drag = null, pour = false, last = 0, dripT = 0, raf = 0, done = false;
    wcan = { stop: () => { cancelAnimationFrame(raf); done = true; } };
    setCan(can, 1);
    const place = (x, y) => { can.style.left = x + 'px'; can.style.top = y + 'px'; };
    const sr = () => st.getBoundingClientRect();
    place(sr().width * .74, sr().height * .12);
    can.addEventListener('pointerdown', (e) => { const r = can.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top }; try { can.setPointerCapture(e.pointerId); } catch (x) {} can.classList.add('held'); e.preventDefault(); });
    can.addEventListener('pointermove', (e) => { if (!drag) return; const r = sr(); place(Math.max(-20, Math.min(r.width - can.offsetWidth + 20, e.clientX - r.left - drag.dx)), Math.max(0, Math.min(r.height - can.offsetHeight, e.clientY - r.top - drag.dy))); });
    const up = () => { drag = null; can.classList.remove('held', 'pour'); pour = false; };
    can.addEventListener('pointerup', up); can.addEventListener('pointercancel', up);
    const tick = (t) => {
      if (done) return; raf = requestAnimationFrame(tick);
      const r = sr(), c = can.getBoundingClientRect(), so = soil.getBoundingClientRect();
      // 물뿌리개 주둥이(왼쪽 위) 끝: 기울이면 아래쪽으로
      const sx = c.left + c.width * .06, sy = c.top + c.height * .3;
      pour = !!drag && sx > so.left - 10 && sx < so.right + 10 && sy < so.top - 10;
      can.classList.toggle('pour', pour);
      if (!pour) return;
      if (t - last > 45) {
        last = t; const d = document.createElement('i'); d.className = 'wdrop';
        const x0 = sx - r.left + (Math.random() * 14 - 7); d.style.left = x0 + 'px'; d.style.top = (sy - r.top) + 'px'; d.style.setProperty('--fall', (so.top - sy + 6) + 'px');
        st.appendChild(d); setTimeout(() => d.remove(), 520);
        const k = Math.floor((sx - so.left) / so.width * N);
        [k - 1, k, k + 1].forEach((j, q) => { if (j >= 0 && j < N) { wet[j] = Math.min(1, wet[j] + (q === 1 ? .06 : .025)); cells[j].style.setProperty('--w', wet[j]); cells[j].classList.toggle('full', wet[j] >= 1); } });
        const tot = wet.reduce((a, b) => a + b, 0) / N; $('wbar').style.width = (tot * 100) + '%'; setCan(can, 1 - tot);
        if (t - dripT > 380) { dripT = t; Snd.drip(); }
        if (wet.every(w => w >= 1)) finishWater(i);
      }
    };
    raf = requestAnimationFrame(tick);
  }
  function finishWater(i) {
    if (!wcan) return; wcan.stop(); wcan = null;
    const p = S.garden[i]; p.watered = S.days; S.log.push({ e: 'water' }); save();
    Snd.combo(); const st = $('wstage'); if (st) { st.classList.add('done'); sparks(st, 14); $('wstage').querySelector('.whint').textContent = '흙이 촉촉해졌어요! 내일 쑥 자랄 거예요'; }
    setTimeout(() => { if ($('ov-garden').classList.contains('on')) renderGarden(); }, 1800);
  }
  function nextGardenQ() {
    gq = Prob.next(S.rot, S.review, S.total, weakUnits()); renderGarden();
    const U = Prob.UNITS[gq.unit]; const tag = $('gq-tag'); tag.innerHTML = `${U.sem}학기 · ${U.name} ${SC('+1')}`; tag.classList.toggle('s1', U.sem === 1);
    $('gq-fig').innerHTML = gq.fig; $('gq-text').innerHTML = gq.q; $('gq-text').classList.toggle('long', gq.q.replace(/<[^>]+>/g, '').length > 34 || !!gq.fig);
    $('gq-msg').textContent = '맞히면 물뿌리개에 물이 가득 차요!';
    $('gq-can').className = 'gcan'; $('gq-can').innerHTML = canSVG(true); setCan($('gq-can'), 0);
    const box = $('gq-choices'); box.innerHTML = ''; box.className = 'choices' + (gq.choices.length === 3 ? ' three' : '');
    gq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (gq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => gardenAnswer(b, c); box.appendChild(b); });
    gq.lock = false;
  }
  function gardenAnswer(btn, c) {
    if (gq.lock) return; gq.lock = true; const ok = c === gq.ans, st = S.stats[gq.unit] || (S.stats[gq.unit] = { c: 0, w: 0 }); S.total++; rec(gq.unit, ok);
    const all = [...$('gq-choices').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.xp++; S.candy++;
      Snd.ok(); $('gq-msg').textContent = '정답! 물뿌리개에 물을 받아요';
      const gc = $('gq-can'), D = 1400; let t0 = 0, dr = 0; gc.classList.add('filling');
      const fill = (t) => {
        if (!gq || !$('ov-garden').classList.contains('on')) return;
        if (!t0) t0 = t; const k = Math.min(1, (t - t0) / D); setCan(gc, 1 - Math.pow(1 - k, 2), k < 1);
        if (t - dr > 260 && k < 1) { dr = t; Snd.drip(); }
        if (k < 1) return requestAnimationFrame(fill);
        gc.classList.remove('filling'); gc.classList.add('full'); Snd.pop(); $('gq-msg').textContent = '물뿌리개에 물이 가득 찼어요!';
        setTimeout(() => { if (!gq) return; gq = null; save(); hud(); startWatering(gPlot); }, 800);
      };
      setTimeout(() => requestAnimationFrame(fill), 350);
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === gq.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++;
      if (!S.review.some(r => r.unit === gq.unit && r.type === gq.type)) S.review.push({ unit: gq.unit, type: gq.type, due: S.total + R(3, 6) });
      Snd.no(); $('gq-msg').innerHTML = `정답은 ${gq.ans}. 다른 문제로 다시 해 봐요!`; $('gq-can').classList.add('sad');
      setTimeout(nextGardenQ, 2200);
    }
    save();
  }
  $('btn-garden').onclick = () => { Snd.tap(); poked(); openGarden(); };
  $('garden-close').onclick = () => {
    Snd.tap(); overlay('ov-garden', false); gq = null; if (wcan) { wcan.stop(); wcan = null; }
    if (canGrow()) setTimeout(() => levelUp(), 300);
  };

  // =====================================================================
  // 생일 파티: 함께한 지 7일째 되는 날. 케이크 만들기 · 풍선 달기 · 케이크 먹여 주기
  // =====================================================================
  function checkBirthday() {
    if (S.days >= 7 && !S.bdayDone && (!S.party || S.party.day !== S.days) && !S.partyStarted) { S.party = { day: S.days, cake: false, balloons: false, fed: false }; S.partyStarted = true; save(); return true; }
    return false;
  }
  const partyOn = () => S.party && S.party.day === S.days && !S.bdayDone;
  function renderParty() {
    const box = $('party-card');
    if (!partyOn()) { box.style.display = 'none'; return; }
    const P = S.party; box.style.display = '';
    box.innerHTML = `<div class="party-head"><b>🎂 오늘은 ${NM()}의 생일!</b><small>함께한 지 ${S.days}일째</small></div>
      ${[['cake', '당근 케이크 만들기', '간식 만들기에서'], ['balloons', '방에 풍선 달기', '눌러서 시작'], ['fed', '생일 케이크 먹여 주기', '먹이기에서']].map(([k, t, s]) => `<button class="pm ${P[k] ? 'done' : ''}" data-pm="${k}"><span class="wc">${P[k] ? '✓' : ''}</span><span>${t}<small>${s}</small></span></button>`).join('')}`;
    box.querySelectorAll('[data-pm]').forEach(b => b.onclick = () => {
      Snd.tap(); const k = b.dataset.pm; if (P[k]) return;
      if (k === 'cake') openCook(); else if (k === 'balloons') runAct('balloon'); else doCare('feed');
    });
  }
  function partyProgress(k) {
    if (!partyOn() || S.party[k]) return; S.party[k] = true; save(); renderParty();
    if (S.party.cake && S.party.balloons && S.party.fed) setTimeout(throwParty, 1200);
  }
  function throwParty() {
    S.bdayDone = true; if (!S.items.includes('phat')) S.items.push('phat'); initWear(); S.wear.head = 'phat'; S.candy += 20; addFriend(20); S.log.push({ e: 'party' }); save();
    renderHome(); $('party-art').innerHTML = Art.draw(S.kind, S.stage, 'happy', S.stage >= 3 ? 'phat' : null);
    $('party-line').innerHTML = level() === 'talk' ? (S.kind === 'bunny' ? '내 생일을 기억해 줬구나! 오늘이 세상에서 제일 행복한 날이야! 깡총!' : '내 생일을 챙겨 줘서 고마워… 구름 위로 날아갈 것 같아!') : line('ok');
    overlay('ov-party', true); Snd.level(); setTimeout(() => Snd.combo(), 900);
    const f = $('party-fx'); f.innerHTML = ''; const cols = ['#F7A0C1', '#FFD36E', '#8FE0C9', '#B9A7F5', '#9EC2F2'];
    for (let i = 0; i < (S.lowfx ? 10 : 40); i++) { const c = document.createElement('i'); c.className = 'confetti'; c.style.left = Math.random() * 100 + '%'; c.style.background = cols[i % 5]; c.style.animationDelay = Math.random() * 1.2 + 's'; c.style.animationDuration = (2 + Math.random() * 1.5) + 's'; f.appendChild(c); }
  }
  $('party-ok').onclick = () => { Snd.tap(); overlay('ov-party', false); renderHome(); react('happy', 'hop'); };

  // 풍선 달기: 풍선 3개를 끌어서 벽 위쪽에 붙인다
  function actBalloon(field, bottom, finish) {
    $('act-hint').textContent = '풍선을 끌어서 벽 위쪽에 달아 줘요';
    actPet('happy'); let n = 0;
    ['#F7A0C1', '#FFD36E', '#9EC2F2'].forEach((c) => {
      const bl = document.createElement('div'); bl.className = 'balloon'; bl.innerHTML = BALLOON(c);
      let sx = 0, sy = 0, on = false;
      bl.addEventListener('pointerdown', (e) => { if (bl.classList.contains('stuck')) return; on = true; sx = e.clientX; sy = e.clientY; bl.classList.add('drag'); try { bl.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
      bl.addEventListener('pointermove', (e) => { if (on) bl.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px)`; });
      const up = (e) => {
        if (!on) return; on = false; bl.classList.remove('drag');
        const f = field.getBoundingClientRect(), r = bl.getBoundingClientRect();
        if (r.top + r.height / 2 < f.top + f.height * .45) {
          const st = document.createElement('div'); st.className = 'balloon stuck'; st.innerHTML = BALLOON(c);
          st.style.left = (r.left - f.left) + 'px'; st.style.top = (r.top - f.top) + 'px'; field.appendChild(st); bl.remove();
          n++; Snd.pop(); sparks(field, 6, r.left - f.left + r.width / 2, r.top - f.top + 30);
          if (n >= 3) { actPet('happy'); setTimeout(finish, 600); }
        } else bl.style.transform = '';
      };
      bl.addEventListener('pointerup', up); bl.addEventListener('pointercancel', up);
      bottom.appendChild(bl);
    });
    actClean.push(() => field.querySelectorAll('.balloon').forEach(e => e.remove()));
  }
  const BALLOON = (c) => `<svg viewBox="0 0 60 110" aria-hidden="true"><path d="M30 70 q-6 14 4 24 q-8 8 -2 16" fill="none" stroke="#B9A7C4" stroke-width="2"/><ellipse cx="30" cy="34" rx="24" ry="30" fill="${c}"/><path d="M26 64 h8 l-4 6z" fill="${c}"/><ellipse cx="21" cy="22" rx="6" ry="9" fill="#fff" opacity=".5"/></svg>`;

  // =====================================================================
  // 산책길 이웃: 장소마다 사는 동물이 이야기 속 수학 부탁을 한다
  // =====================================================================
  const NEIGH = {
    garden: { id: 'squirrel', name: '다람쥐 토리', gift: ['honey', 1], hi: '안녕! 나는 꽃밭에 사는 다람쥐 토리야. 부탁 하나만 들어줄래?', thx: '고마워! 덕분에 겨울 준비 끝! 이건 꽃밭에서 모은 꿀이야.', miss: '괜찮아, 같이 생각해 줘서 고마워!' },
    beach: { id: 'penguin', name: '펭귄 펭이', gift: ['candy', 5], hi: '어서 와! 나는 바닷가 펭귄 펭이야. 이것 좀 도와줄래?', thx: '우와, 정답이야! 바닷가에서 주운 별사탕 줄게!', miss: '헤헤, 괜찮아. 다음에 또 같이 풀자!' },
    berry: { id: 'hedgehog', name: '고슴도치 도치', gift: ['berry', 2], hi: '반가워! 나는 딸기밭 주인 고슴도치 도치야. 계산 좀 도와줄래?', thx: '고마워! 내 딸기 두 개 가져가!', miss: '괜찮아! 도와주러 와 준 것만으로도 기뻐.' },
    hill: { id: 'owl', name: '부엉이 박사', gift: ['candy', 5], hi: '부엉~ 별빛 언덕에 온 걸 환영하네. 내 수수께끼를 풀어 보겠나?', thx: '훌륭하군! 별사탕을 선물로 주겠네.', miss: '부엉, 괜찮네. 틀리면서 배우는 법이지.' }
  };
  // 이웃 표정: 눈(과 부리가 없는 이웃은 입)을 감정에 맞게 그린다
  const NB_FACE = {
    squirrel: { e: [[35, 44], [50, 44]], r: 3.4, ink: '#4A3552', m: [42.5, 55.5] },
    penguin: { e: [[41, 44], [59, 44]], r: 3.6, ink: '#2C2C2A', m: null },
    hedgehog: { e: [[30, 62], [46, 62]], r: 3.4, ink: '#4A3552', m: [38, 76.5] },
    owl: { e: [[38, 47], [62, 47]], r: 4.6, ink: '#4A3552', m: null }
  };
  function nbFace(id, mood) {
    const F = NB_FACE[id], r = F.r, k = F.ink, sw = `stroke="${k}" stroke-width="${(r * .62).toFixed(1)}" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
    const dot = (x, y, sc = 1) => `<circle cx="${x}" cy="${y}" r="${r * sc}" fill="${k}"/><circle cx="${x + r * .3 * sc}" cy="${y - r * .32 * sc}" r="${r * .32 * sc}" fill="#fff"/>`;
    const up = (x, y) => `<path d="M${x - r} ${y + r * .45} Q${x} ${y - r * 1.15} ${x + r} ${y + r * .45}" ${sw}/>`;      // ^ 웃는 눈
    const cup = (x, y) => `<path d="M${x - r} ${y - r * .3} Q${x} ${y + r * 1.1} ${x + r} ${y - r * .3}" ${sw}/>`;     // ∪ 새침·만족
    const line = (x, y) => `<path d="M${x - r} ${y} h${r * 2}" ${sw}/>`;
    const each = (fn) => F.e.map(([x, y], i) => fn(x, y, i)).join('');
    let eyes, mouth = '';
    switch (mood) {
      case 'happy': case 'chew': eyes = each(up); break;
      case 'smug': case 'full': eyes = each(cup); break;
      case 'wide': eyes = each((x, y) => dot(x, y, 1.35)); break;
      case 'sleepy': case 'sleep': eyes = each(line); break;
      case 'sad': eyes = each((x, y, i) => dot(x, y + r * .2, .85) + `<path d="M${x - r * (i ? .4 : 1.2)} ${y - r * (i ? 2.2 : 1.5)} L${x + r * (i ? 1.2 : .4)} ${y - r * (i ? 1.5 : 2.2)}" ${sw}/>`); break;
      case 'tickle': eyes = each((x, y, i) => `<path d="M${x + (i ? 1 : -1) * r} ${y - r} L${x - (i ? 1 : -1) * r * .6} ${y} L${x + (i ? 1 : -1) * r} ${y + r}" ${sw}/>`); break;
      case 'pout': eyes = each((x, y) => line(x, y - r * .4) + `<circle cx="${x + r * .4}" cy="${y + r * .4}" r="${r * .6}" fill="${k}"/>`); break;
      case 'dizzy': eyes = each((x, y) => `<path d="M${x - r} ${y - r} L${x + r} ${y + r} M${x + r} ${y - r} L${x - r} ${y + r}" ${sw}/>`); break;
      default: eyes = each((x, y) => dot(x, y));
    }
    if (F.m) {
      const [x, y] = F.m, w = r * .95;
      if (mood === 'happy' || mood === 'smug') mouth = `<path d="M${x - w} ${y} Q${x} ${y + w * 1.3} ${x + w} ${y}" ${sw}/>`;
      else if (mood === 'sad' || mood === 'pout') mouth = `<path d="M${x - w} ${y + w * .7} Q${x} ${y - w * .5} ${x + w} ${y + w * .7}" ${sw}/>`;
      else if (mood === 'wide' || mood === 'sleepy') mouth = `<ellipse cx="${x}" cy="${y + w * .3}" rx="${w * .55}" ry="${w * .7}" fill="${k}"/>`;
      else if (mood === 'chew' || mood === 'full') mouth = `<path d="M${x - w} ${y} q${w * .5} ${w * .7} ${w} 0 q${w * .5} ${w * .7} ${w} 0" ${sw}/>`;
      else if (mood === 'tickle') mouth = `<path d="M${x - w} ${y - w * .2} Q${x} ${y + w * 1.4} ${x + w} ${y - w * .2} Z" fill="#E26A97"/>`;
    }
    return eyes + mouth;
  }
  const NB_SVG = {
    squirrel: (F) => `<svg viewBox="0 0 100 100"><path d="M70 78 C96 70 96 30 76 22 C62 16 54 30 64 38 C74 46 70 60 60 64" fill="#D9A276" stroke="#A8724C" stroke-width="3" stroke-linejoin="round"/><ellipse cx="44" cy="70" rx="20" ry="18" fill="#E3B48A" stroke="#A8724C" stroke-width="3"/><ellipse cx="44" cy="74" rx="11" ry="10" fill="#FFF1DE"/><circle cx="42" cy="44" r="20" fill="#E3B48A" stroke="#A8724C" stroke-width="3"/><path d="M28 30 l-2 -12 l10 8z M54 28 l4 -12 l4 14z" fill="#E3B48A" stroke="#A8724C" stroke-width="2.6" stroke-linejoin="round"/><path d="M28 37 q3 -9 12 -11" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".75"/>${F}<ellipse cx="42.5" cy="51" rx="3" ry="2.2" fill="#8C5A3C"/><ellipse cx="29" cy="52" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="56" cy="52" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="44" cy="70" rx="6" ry="5" fill="#C98A3D"/><path d="M40 66 h8" stroke="#8C5A3C" stroke-width="2"/></svg>`,
    penguin: (F) => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="28" ry="34" fill="#4E5A8C" stroke="#323C66" stroke-width="3"/><ellipse cx="50" cy="64" rx="19" ry="25" fill="#fff"/><path d="M22 58 q-10 10 -2 20 M78 58 q10 10 2 20" stroke="#323C66" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M31 38 q4 -11 14 -13" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".45"/>${F}<path d="M44 51 l6 6 l6 -6z" fill="#FFB25A" stroke="#E08A2E" stroke-width="1.6" stroke-linejoin="round"/><ellipse cx="34" cy="53" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="66" cy="53" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="40" cy="93" rx="8" ry="4" fill="#FFB25A"/><ellipse cx="60" cy="93" rx="8" ry="4" fill="#FFB25A"/><path d="M36 22 q14 -8 28 0" stroke="#F7A0C1" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`,
    hedgehog: (F) => `<svg viewBox="0 0 100 100"><path d="M14 72 C10 40 30 22 54 24 C76 26 90 46 86 72 Z" fill="#9C7254" stroke="#6E4C36" stroke-width="3" stroke-linejoin="round"/>${[[22, 40], [34, 28], [48, 22], [62, 24], [76, 32], [84, 46], [18, 56]].map(([x, y]) => `<path d="M${x} ${y} l-6 -8 l10 2z" fill="#9C7254" stroke="#6E4C36" stroke-width="2" stroke-linejoin="round"/>`).join('')}<ellipse cx="38" cy="66" rx="24" ry="20" fill="#F6DEC0" stroke="#C9A27E" stroke-width="2.6"/><path d="M19 61 q3 -8 11 -10" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>${F}<circle cx="38" cy="71" r="3.4" fill="#E5679A"/><ellipse cx="24" cy="70" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="52" cy="70" rx="6" ry="3.8" fill="url(#cn-blush)"/><path d="M62 34 c6 -2 9 4 5 8 c-3 3 -8 2 -8 -2 c0 -3 1 -5 3 -6z" fill="#F2678F"/></svg>`,
    owl: (F) => `<svg viewBox="0 0 100 100"><ellipse cx="50" cy="58" rx="30" ry="32" fill="#9C86C9" stroke="#6E5CA3" stroke-width="3"/><path d="M24 34 l-4 -16 l14 10z M76 34 l4 -16 l-14 10z" fill="#9C86C9" stroke="#6E5CA3" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="50" cy="70" rx="18" ry="16" fill="#E9E1FF"/><path d="M40 66 q4 4 8 0 M52 72 q4 4 8 0 M42 78 q4 4 8 0" stroke="#C9B8FF" stroke-width="2" fill="none"/><circle cx="38" cy="46" r="11" fill="#fff" stroke="#6E5CA3" stroke-width="2.4"/><circle cx="62" cy="46" r="11" fill="#fff" stroke="#6E5CA3" stroke-width="2.4"/><path d="M27 33 q4 -9 12 -11" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".5"/>${F}<path d="M46 55 l4 6 l4 -6z" fill="#FFB25A"/><path d="M27 38 h22 M51 38 h22" stroke="#4A3552" stroke-width="2.4"/><circle cx="38" cy="46" r="12.5" fill="none" stroke="#4A3552" stroke-width="2"/><circle cx="62" cy="46" r="12.5" fill="none" stroke="#4A3552" stroke-width="2"/><path d="M50.5 46 h-0" stroke="#4A3552" stroke-width="2"/></svg>`
  };
  const nbArt = (id, mood) => NB_SVG[id] ? NB_SVG[id](nbFace(id, mood || 'idle')) : '';
  const NB_ART = Object.fromEntries(Object.keys(NB_SVG).map(k => [k, nbArt(k)]));
  let nq = null, nPlace = null;
  function openNeighbor(place) {
    const N = NEIGH[place]; if (!N) return; nPlace = place;
    if (!S.nb) S.nb = {};
    $('nb-art').innerHTML = NB_ART[N.id]; $('nb-art').dataset.id = N.id; $('nb-name').textContent = N.name;
    const met = S.nb[N.id] || 0;
    nq = Prob.story(N.id);
    nsay(met ? `또 왔구나! ${pick(['이번에도 도와줄래?', '오늘도 부탁 하나 있어!', '기다리고 있었어!'])}` : N.hi);
    const U = Prob.UNITS[nq.unit] || { sem: 1, name: '' }; const tag = $('nq-tag'); tag.innerHTML = `${U.sem}학기 · ${U.name}${N.gift[0] === 'candy' ? ' ' + SC('+' + N.gift[1]) : ''}`; tag.classList.toggle('s1', U.sem === 1);
    $('nq-text').innerHTML = nq.q; $('nq-text').classList.add('long');
    const box = $('nq-choices'); box.innerHTML = ''; box.className = 'choices' + (nq.choices.length === 3 ? ' three' : '');
    nq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (nq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => nbAnswer(b, c); box.appendChild(b); });
    $('nb-ok').style.display = 'none'; nq.lock = false;
    overlay('ov-neighbor', true); Snd.babble(2, 'bunny');
  }
  function nsay(t) { const b = $('nb-say'); b.querySelector('span').innerHTML = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); emoteText('nbart', t); }
  function nbAnswer(btn, c) {
    if (nq.lock) return; nq.lock = true; const N = NEIGH[nPlace], ok = c === nq.ans; S.total++; rec(nq.unit, ok);
    const st = S.stats[nq.unit] || (S.stats[nq.unit] = { c: 0, w: 0 });
    const all = [...$('nq-choices').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.xp++;
      S.nb[N.id] = (S.nb[N.id] || 0) + 1; const [g, n] = N.gift;
      if (g === 'candy') S.candy += n; else { initGarden(); S.pantry[g] = (S.pantry[g] || 0) + n; }
      Snd.combo(); nsay(N.thx + `<br><small style="font-size:.8em;color:#7A6283">${g === 'candy' ? `별사탕 +${n}` : `${ING_NAME[g]} +${n}`} · ${N.name}${Prob.jo(N.name, '와').slice(N.name.length)} 더 친해졌어요</small>`);
      S.log.push({ e: 'help', id: N.id });
      if (S.nb[N.id] === 3) setTimeout(() => toast(`<b>${N.name}</b>${Prob.jo(N.name, '이').slice(N.name.length)} 가끔 방에 놀러 온대요!`), 900);
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === nq.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++;
      Snd.no(); nsay(`${N.miss}<br><small style="font-size:.8em;color:#7A6283">정답은 ${nq.ans}</small>`);
    }
    $('nb-ok').style.display = ''; hud(); save();
  }
  $('nb-ok').onclick = () => { Snd.tap(); overlay('ov-neighbor', false); };

  // 친해진 이웃(부탁 3번 이상)이 가끔 방에 놀러 온다
  function neighborVisit() {
    const v = $('visitor'); v.innerHTML = ''; v.style.display = 'none';
    if (!S.nb) return;
    const friends = Object.keys(NEIGH).map(k => NEIGH[k]).filter(N => (S.nb[N.id] || 0) >= 3);
    if (!friends.length || Math.random() > .5) return;
    const N = pick(friends); v.innerHTML = NB_ART[N.id]; v.style.display = ''; v.dataset.id = N.id;
    v.onclick = () => {
      Snd.babble(2, 'bunny'); poked();
      speak('home', `<b>${N.name}</b>: ${pick(['놀러 왔어! 지난번에 도와줘서 고마워.', '너희 방 정말 예쁘다!', `${NM()}${Prob.jo(NM(), '와').slice(NM().length)} 너는 정말 사이좋구나.`, '다음에 우리 동네에도 또 놀러 와!'])}`, { silent: true, emo: 'visitor' });
    };
  }

  // =====================================================================
  // 방 꾸미기: 자유 배치 · 벽지 · 바닥 · 다락방
  // =====================================================================
  const WALL_PRICE = { dots: 0, stripe: 20, star: 25, heart: 25, sky: 30 };
  const FLOOR_PRICE = { wood: 0, check: 20, mint: 25, night: 30 };
  function initRooms() {
    if (!S.place) { S.place = { main: {}, attic: {} }; (S.decor || []).forEach(id => { S.place.main[id] = Scene.DEF_POS[id] || (Scene.layerOf(id) === 'wall' ? [500, 250] : [500, 600]); }); }
    if (!S.place.attic) S.place.attic = {};
    S.wall = S.wall || { main: 'dots', attic: 'dots' }; S.floor = S.floor || { main: 'wood', attic: 'wood' };
    S.walls = S.walls || ['dots']; S.floors = S.floors || ['wood'];
    if (!S.roomId || (S.roomId === 'attic' && !atticOpen())) S.roomId = 'main';
    syncDecor();
  }
  const atticOpen = () => S.flv >= 3;
  function syncDecor() { S.decor = Object.keys(S.place.main); }
  const placedIn = (id) => (S.place.main[id] ? 'main' : S.place.attic[id] ? 'attic' : null);
  function roomSVG(hide) {
    const R0 = S.roomId || 'main';
    return Scene.room({ kind: S.kind, place: S.place[R0], night: isNight(), weather: S.weather || 'sun', wall: S.wall[R0], floor: S.floor[R0], roomId: R0, hide,
      balloons: R0 === 'main' && S.party && S.party.day === S.days && S.party.balloons });
  }
  // 방 좌표 ↔ 화면 픽셀
  function roomMap() { const r = $('room').getBoundingClientRect(), sc = Math.max(r.width / 1000, r.height / 640); return { r, sc, ox: (r.width - 1000 * sc) / 2, oy: r.height - 640 * sc }; }

  // ---------- 다락방 오가기 ----------
  function renderRoomNav() {
    const b = $('btn-attic'); b.style.display = atticOpen() && !editing ? '' : 'none';
    b.innerHTML = S.roomId === 'attic' ? '<span>▼</span> 내 방' : '<span>▲</span> 다락방';
  }
  $('btn-attic').onclick = () => {
    Snd.tap(); poked(); S.roomId = S.roomId === 'attic' ? 'main' : 'attic'; save();
    const wk = $('walker'); wk.classList.add('go'); wk.style.transitionDuration = '0s'; wk.style.left = '50%'; setTimeout(() => { wk.classList.remove('go'); wk.style.transitionDuration = ''; }, 50);
    renderHome(); react('happy', 'hop');
    speak('home', level() === 'talk' ? (S.roomId === 'attic' ? pick(['다락방이다! 여기 비밀 기지 같아.', '동그란 창문으로 하늘이 보여!']) : pick(['내 방으로 돌아왔다!', '역시 내 방이 포근해.'])) : L3('care'));
  };

  // ---------- 꾸미기 모드 ----------
  let editing = false, sel = null, drag = null, panel = 'items';
  function enterEdit() {
    initRooms(); editing = true; sel = null; panel = 'items';
    $('room').classList.add('editing'); document.querySelector('.home').classList.add('editing'); clearTimeout(wanderT); $('bubble').classList.add('hide');
    renderEdit(); renderRoomNav();
  }
  function exitEdit() {
    editing = false; sel = null; $('room').classList.remove('editing'); document.querySelector('.home').classList.remove('editing'); $('edit-layer').innerHTML = ''; $('edit-bar').innerHTML = '';
    syncDecor(); save(); renderHome(); startWander(); renderRoomNav();
    speak('home', level() === 'talk' ? pick(['우와, 방이 새로워졌어!', '여기 진짜 마음에 들어!', '우리 방 최고야!']) : L3('care')); react('happy', 'hop');
  }
  function renderEdit() {
    if (!editing) return;
    $('room-bg').innerHTML = roomSVG(drag && drag.id);
    const m = roomMap(), L = $('edit-layer'); L.innerHTML = '';
    const P = S.place[S.roomId];
    Object.keys(P).forEach(id => {
      const [x0, y0, x1, y1] = Scene.itemBox(id, P[id][0], P[id][1]);
      const h = document.createElement('div'); h.className = 'handle' + (sel === id ? ' sel' : ''); h.dataset.id = id;
      Object.assign(h.style, { left: (m.ox + x0 * m.sc) + 'px', top: (m.oy + y0 * m.sc) + 'px', width: ((x1 - x0) * m.sc) + 'px', height: ((y1 - y0) * m.sc) + 'px' });
      if (sel === id) { const x = document.createElement('button'); x.className = 'h-del'; x.textContent = '✕'; x.setAttribute('aria-label', '치우기'); x.onpointerdown = (e) => e.stopPropagation(); x.onclick = (e) => { e.stopPropagation(); Snd.pop(); delete P[id]; sel = null; save(); renderEdit(); }; h.appendChild(x); }
      h.addEventListener('pointerdown', (e) => startDrag(e, id, h));
      L.appendChild(h);
    });
    renderEditBar();
  }
  function startDrag(e, id, h) {
    e.preventDefault(); sel = id; const P = S.place[S.roomId];
    drag = { id, sx: e.clientX, sy: e.clientY, x: P[id][0], y: P[id][1], moved: false };
    $('room-bg').innerHTML = roomSVG(id);
    h.classList.add('sel', 'drag'); h.innerHTML = Scene.itemAlone(id);
    try { h.setPointerCapture(e.pointerId); } catch (x) {}
    const m = roomMap();
    const move = (ev) => {
      const dx = (ev.clientX - drag.sx) / m.sc, dy = (ev.clientY - drag.sy) / m.sc; if (Math.hypot(dx, dy) > 3) drag.moved = true;
      const [nx, ny] = Scene.clampPos(id, drag.x + dx, drag.y + dy);
      const [x0, y0, x1, y1] = Scene.itemBox(id, nx, ny);
      Object.assign(h.style, { left: (m.ox + x0 * m.sc) + 'px', top: (m.oy + y0 * m.sc) + 'px' }); drag.nx = nx; drag.ny = ny;
    };
    const up = () => {
      h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); h.removeEventListener('pointercancel', up);
      if (drag.moved && drag.nx != null) { P[id] = [drag.nx, drag.ny]; Snd.pop(); save(); }
      drag = null; renderEdit();
    };
    h.addEventListener('pointermove', move); h.addEventListener('pointerup', up); h.addEventListener('pointercancel', up);
  }
  function renderEditBar() {
    const bar = $('edit-bar'), R0 = S.roomId;
    const tabs = `<div class="eb-tabs"><button class="eb-tab ${panel === 'items' ? 'on' : ''}" data-p="items">가구</button><button class="eb-tab ${panel === 'wall' ? 'on' : ''}" data-p="wall">벽지</button><button class="eb-tab ${panel === 'floor' ? 'on' : ''}" data-p="floor">바닥</button><span class="eb-hint">${panel === 'items' ? '가구를 끌어서 옮기고, 아래에서 눌러 놓아요' : '눌러서 바꿔요'}</span><button class="btn small primary eb-done">다 했어요</button></div>`;
    let body = '';
    if (panel === 'items') {
      const free = S.items.filter(k => ITEMS[k] && ITEMS[k].kind === 'decor' && !placedIn(k));
      body = free.length ? free.map(k => `<button class="eb-item" data-add="${k}"><span>${Scene.item(k)}</span><small>${ITEMS[k].name}</small></button>`).join('')
        : `<p class="eb-empty">놓을 가구가 없어요.</p>`;
      body += `<button class="eb-item eb-shop" data-shop="1"><span>${ICON_SHOP}</span><small>가구·놀잇감 주문하기</small></button>`;
    } else {
      const isW = panel === 'wall', list = isW ? Scene.WALLS : Scene.FLOORS, own = isW ? S.walls : S.floors, cur = isW ? S.wall[R0] : S.floor[R0], price = isW ? WALL_PRICE : FLOOR_PRICE;
      body = Object.keys(list).map(k => `<button class="eb-item sw ${cur === k ? 'cur' : ''}" data-sw="${k}"><span>${Scene.swatch(isW ? 'wall' : 'floor', k, S.kind)}</span><small>${list[k].name}${own.includes(k) ? '' : ` · 별사탕 ${price[k]}`}</small></button>`).join('');
    }
    bar.innerHTML = tabs + `<div class="eb-row">${body}</div>`;
    bar.querySelectorAll('.eb-tab').forEach(b => b.onclick = () => { Snd.tap(); panel = b.dataset.p; renderEditBar(); });
    bar.querySelector('.eb-done').onclick = () => { Snd.tap(); exitEdit(); };
    const sh = bar.querySelector('[data-shop]'); if (sh) sh.onclick = () => { Snd.tap(); exitEdit(); wdFromEdit = true; openWardrobe('shop'); };
    bar.querySelectorAll('[data-add]').forEach(b => b.onclick = () => {
      const k = b.dataset.add; Snd.pop(); S.place[R0][k] = Scene.clampPos(k, ...(Scene.DEF_POS[k] || (Scene.layerOf(k) === 'wall' ? [500, 250] : [500, 600])));
      if (R0 === 'attic' && Scene.layerOf(k) === 'wall') S.place[R0][k] = Scene.clampPos(k, R(200, 300), 330);
      if (Scene.layerOf(k) === 'floor' && !Scene.DEF_POS[k]) S.place[R0][k] = Scene.clampPos(k, R(300, 760), R(560, 610));
      sel = k; S.log.push({ e: 'decor', id: k }); save(); renderEdit();
    });
    bar.querySelectorAll('[data-sw]').forEach(b => b.onclick = () => {
      const k = b.dataset.sw, isW = panel === 'wall', own = isW ? S.walls : S.floors, price = (isW ? WALL_PRICE : FLOOR_PRICE)[k];
      if (!own.includes(k)) {
        if (S.candy < price) { toast(`별사탕이 ${price - S.candy}개 더 필요해요`); Snd.no(); return; }
        S.candy -= price; own.push(k); Snd.combo(); hud();
      } else Snd.tap();
      if (isW) S.wall[R0] = k; else S.floor[R0] = k; save(); renderEdit();
    });
  }
  window.addEventListener('resize', () => { if (editing) renderEdit(); });
  $('btn-deco').onclick = () => { Snd.tap(); poked(); editing ? exitEdit() : enterEdit(); };

  // =====================================================================
  // 그림책: 책장에서 골라 친구와 한 쪽씩 읽고, 마지막 장의 '책 속 수수께끼'를 푼다
  // =====================================================================
  const BOOKS = {
    cloudland: { title: '구름 나라의 생일 잔치', color: '#C9B8FF', from: 'start', mem: '구름 나라 생일 잔치 이야기 또 읽고 싶다!',
      pages: ['구름 나라에 아기 구름 뭉게가 살았어요. 오늘은 뭉게의 생일이에요.', '친구 구름들이 케이크를 만들었어요. 케이크를 똑같이 4조각으로 나누었더니 한 조각은 전체의 1/4이 되었어요.', '그런데 친구가 한 명 더 왔어요! 이번엔 5조각으로 나누니 한 조각이 1/5이 되었어요. 조각은 조금 작아졌지만 모두 웃었어요.', '뭉게는 생각했어요. "나눠 먹으니까 더 달콤해!" 그날 밤 하늘에는 무지개 구름이 떴대요.'],
      chat: ['케이크를 나누면 조각이 작아져도 기분은 커져!', '나도 생일 때 이렇게 나눠 먹고 싶어.'] },
    moonrabbit: { title: '달토끼의 떡방아', color: '#FFE29A', from: 'start', mem: '달토끼 떡방아 이야기 기억나? 쿵덕쿵덕!',
      pages: ['둥근 보름달에 달토끼가 살았어요. 달토끼는 매일 떡방아를 찧었어요.', '한 번 찧을 때마다 떡이 3개씩 생겼어요. 2번 찧으면 6개, 3번 찧으면 9개!', '"규칙이 보인다!" 달토끼는 신이 났어요. "찧은 횟수에 3을 곱하면 떡의 수야."', '달토끼는 만든 떡을 별님들에게 나눠 주었어요. 그래서 밤하늘 별들은 늘 배가 부르대요.'],
      chat: ['쿵덕쿵덕! 규칙을 찾으면 계산이 쉬워져.', '떡 먹고 싶다… 달토끼한테 하나만 달라고 할까?'] },
    owlstars: { title: '별을 세는 부엉이', color: '#9C86C9', from: 'owl', mem: '부엉이 박사님처럼 별을 어림해서 세 보고 싶어.',
      pages: ['별빛 언덕의 부엉이 박사는 밤마다 별을 셌어요.', '"하나, 둘, 셋… 1,467개!" 너무 많아서 머리가 빙글빙글했어요.', '그래서 박사는 반올림을 쓰기로 했어요. "백의 자리까지 반올림하면 약 1,500개구나!"', '어림하니 별 세기가 훨씬 쉬워졌어요. 박사는 기분 좋게 "부엉~" 하고 노래했대요.'],
      chat: ['어림하면 큰 수도 무섭지 않아!', '나도 오늘 밤 별 세어 볼래.'] },
    berryhide: { title: '딸기밭 숨바꼭질', color: '#F7A0C1', from: 'hedgehog', mem: '딸기밭 숨바꼭질처럼 우리도 숨바꼭질하자!',
      pages: ['딸기밭에서 고슴도치 도치와 친구들이 숨바꼭질을 했어요.', '도치는 가로 8 m, 세로 5 m인 딸기밭 둘레를 한 바퀴 돌며 친구들을 찾았어요. 둘레는 26 m였어요.', '친구들은 딸기 잎 뒤에 쏙쏙 숨었어요. 딸기밭 넓이가 40 m²나 되어서 찾기가 쉽지 않았어요.', '마지막으로 찾은 친구는 딸기를 먹다 들킨 토끼였어요. 모두 깔깔 웃었대요.'],
      chat: ['둘레는 한 바퀴, 넓이는 안쪽 전부!', '딸기 먹다 들킨 토끼… 혹시 나 아니겠지?'] },
    seafriends: { title: '바닷속 친구들', color: '#9EC2F2', from: 'penguin', mem: '바닷속 친구들 책에 나온 문어 정말 귀여웠어.',
      pages: ['펭귄 펭이는 바닷속 친구들을 만나러 풍덩 들어갔어요.', '문어는 다리가 8개예요. 문어 3마리가 모이니 다리가 모두 24개나 되었어요.', '물고기 떼는 0.5 m씩 헤엄치는 걸 4번 했어요. 모두 2 m를 간 셈이에요.', '펭이는 친구들과 손을 잡고 빙글빙글 춤을 추었어요. 바다가 반짝반짝 빛났대요.'],
      chat: ['문어 다리 24개! 손잡기 놀이 하면 엄청 길겠다.', '나도 바다에서 헤엄쳐 보고 싶어!'] },
    rainbow: { title: '무지개 다리 건너기', color: '#8FE0C9', from: 'squirrel', mem: '무지개 다리 책처럼 우리도 무지개 다리 건너 보자!',
      pages: ['비가 그친 뒤 꽃밭에 무지개 다리가 생겼어요.', '다람쥐 토리는 다리를 건너고 싶었어요. 다리는 접으면 양쪽이 똑같이 겹치는 선대칭 모양이었어요.', '토리는 다리 가운데 대칭축에 서서 양쪽을 바라보았어요. 왼쪽과 오른쪽 색깔이 똑같았어요.', '다리 끝에는 도토리가 가득한 상자가 있었어요. 토리는 친구들과 나눠 먹었대요.'],
      chat: ['접으면 똑같이 겹치는 모양, 선대칭!', '무지개 다리 끝에 뭐가 있을지 궁금해.'] }
  };
  const BOOK_FROM = { owl: '부엉이 박사', hedgehog: '고슴도치 도치', penguin: '펭귄 펭이', squirrel: '다람쥐 토리' };
  function bookCover(id) {
    const B = BOOKS[id], m = {
      cloudland: '<g fill="#fff"><circle cx="34" cy="50" r="12"/><circle cx="48" cy="44" r="15"/><circle cx="62" cy="50" r="11"/><rect x="24" y="50" width="48" height="10" rx="5"/></g><path d="M40 30 l3 6 6 .6 -4.5 4 1.3 6 -5.8 -3.2 -5.8 3.2 1.3 -6 -4.5 -4 6 -.6z" fill="#FFE29A"/>',
      moonrabbit: '<circle cx="48" cy="46" r="20" fill="#FFF6C9"/><ellipse cx="44" cy="36" rx="3.4" ry="9" fill="#fff" stroke="#E5679A" stroke-width="1.4"/><ellipse cx="52" cy="36" rx="3.4" ry="9" fill="#fff" stroke="#E5679A" stroke-width="1.4"/><circle cx="48" cy="50" r="9" fill="#fff" stroke="#E5679A" stroke-width="1.4"/>',
      owlstars: '<circle cx="40" cy="46" r="8" fill="#fff"/><circle cx="56" cy="46" r="8" fill="#fff"/><circle cx="40" cy="46" r="3.4" fill="#4A3552"/><circle cx="56" cy="46" r="3.4" fill="#4A3552"/>' + [[24, 26], [70, 30], [48, 22], [30, 64], [68, 62]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#FFF3B0"/>`).join(''),
      berryhide: '<path d="M48 34 C64 30 70 46 64 58 C60 66 36 66 32 58 C26 46 32 30 48 34Z" fill="#F2678F" stroke="#C9466F" stroke-width="2"/><path d="M40 32 l4 4 4 -6 4 6 4 -4 -2 6 h-12z" fill="#7FCF95"/>',
      seafriends: '<path d="M20 58 q8 -8 16 0 t16 0 t16 0 t16 0" stroke="#fff" stroke-width="4" fill="none"/><path d="M40 30 c14 0 20 14 14 24 l-28 0 c-6 -10 0 -24 14 -24z" fill="#FFD3C4" stroke="#E7957C" stroke-width="2"/>',
      rainbow: '<g fill="none" stroke-width="5"><path d="M22 62 a26 26 0 0 1 52 0" stroke="#F7A0C1"/><path d="M28 62 a20 20 0 0 1 40 0" stroke="#FFD36E"/><path d="M34 62 a14 14 0 0 1 28 0" stroke="#9EC2F2"/></g>'
    }[id];
    return `<svg viewBox="0 0 96 120" aria-hidden="true"><rect x="6" y="4" width="84" height="112" rx="8" fill="${B.color}" stroke="rgba(74,53,82,.25)" stroke-width="2"/><rect x="6" y="4" width="10" height="112" rx="4" fill="rgba(255,255,255,.35)"/><g transform="translate(0 6)">${m}</g><rect x="20" y="86" width="56" height="18" rx="6" fill="rgba(255,255,255,.8)"/></svg>`;
  }
  const ownBooks = () => { S.books = S.books || ['cloudland', 'moonrabbit']; return S.books; };
  function openShelf() {
    const own = ownBooks();
    $('shelf-grid').innerHTML = Object.keys(BOOKS).map(id => {
      const B = BOOKS[id], has = own.includes(id), n = (S.read || {})[id] || 0;
      return `<button class="bookbtn ${has ? '' : 'lock'}" data-book="${id}"><span class="cover">${bookCover(id)}</span><b>${has ? B.title : '???'}</b><small>${has ? (n ? `${n}번 읽었어요` : '아직 안 읽었어요') : B.from === 'start' ? '' : `${BOOK_FROM[B.from]}에게 받아요`}</small></button>`;
    }).join('');
    $('shelf-grid').querySelectorAll('.bookbtn:not(.lock)').forEach(b => b.onclick = () => { Snd.tap(); openBook2(b.dataset.book); });
    overlay('ov-shelf', true);
  }
  let rb = null; // 읽는 중인 책 { id, page }
  function openBook2(id) {
    overlay('ov-shelf', false); rb = { id, page: 0 };
    $('read-cover').innerHTML = bookCover(id); $('read-pet').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    showPage(); overlay('ov-read', true);
  }
  function readSay(t) { const b = $('read-say'); b.querySelector('span').innerHTML = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); emoteText('read', t); }
  function showPage() {
    const B = BOOKS[rb.id], last = rb.page >= B.pages.length;
    $('read-title').textContent = B.title;
    $('read-pageno').textContent = last ? '마지막 장 · 책 속 수수께끼' : `${rb.page + 1} / ${B.pages.length}`;
    $('read-text').style.display = last ? 'none' : ''; $('read-quiz').style.display = last ? '' : 'none';
    $('read-next').style.display = last ? 'none' : ''; $('read-close').style.display = 'none';
    if (!last) {
      $('read-text').textContent = B.pages[rb.page];
      $('read-next').textContent = rb.page === B.pages.length - 1 ? '수수께끼 보기' : '다음 장 ▸';
      const t = level() === 'talk' ? (rb.page === 1 ? B.chat[0] : rb.page === 2 ? B.chat[1] : rb.page === 0 ? pick(['이 책 재밌어 보여!', '같이 읽자!', '두근두근, 무슨 이야기일까?']) : '오, 그다음은?') : L3('care');
      readSay(t); Snd.pop();
    } else {
      rq = Prob.next(S.rot, S.review, S.total, weakUnits()); const U = Prob.UNITS[rq.unit];
      readSay(level() === 'talk' ? '마지막 장에 수수께끼가 있어! 같이 풀어 보자.' : L3('care'));
      const tag = $('rd-tag'); tag.innerHTML = `${U.sem}학기 · ${U.name} ${SC('+2')}`; tag.classList.toggle('s1', U.sem === 1);
      $('rd-fig').innerHTML = rq.fig; $('rd-text').innerHTML = rq.q; $('rd-text').classList.toggle('long', rq.q.replace(/<[^>]+>/g, '').length > 30 || !!rq.fig);
      const box = $('rd-choices'); box.innerHTML = ''; box.className = 'choices' + (rq.choices.length === 3 ? ' three' : '');
      rq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (rq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => readAnswer(b, c); box.appendChild(b); });
      rq.lock = false;
    }
  }
  function readAnswer(btn, c) {
    if (rq.lock) return; rq.lock = true; const ok = c === rq.ans, st = S.stats[rq.unit] || (S.stats[rq.unit] = { c: 0, w: 0 }); S.total++; rec(rq.unit, ok);
    const all = [...$('rd-choices').children];
    if (ok) { btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.xp++; S.candy += 2; Snd.ok(); readSay(L4('riddleOk') + '<br><small style="font-size:.8em;color:#7A6283">별사탕 +2</small>'); }
    else { btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === rq.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++; Snd.no(); readSay(L4('riddleNo', { a: rq.ans })); if (!S.review.some(r => r.unit === rq.unit && r.type === rq.type)) S.review.push({ unit: rq.unit, type: rq.type, due: S.total + R(3, 6) }); }
    S.read = S.read || {}; S.read[rb.id] = (S.read[rb.id] || 0) + 1; S.readT = (S.readT || []).filter(t => Date.now() - t < 40 * 60000).concat(Date.now()); if (dayCap('read', 3)) addFriend(3); S.log.push({ e: 'read', id: rb.id });
    $('read-close').style.display = ''; hud(); save();
  }
  $('read-next').onclick = () => { Snd.tap(); rb.page++; showPage(); };
  $('read-close').onclick = () => {
    Snd.tap(); overlay('ov-read', false); react('happy', 'hop');
    if (canGrow()) setTimeout(() => levelUp(), 300);
  };
  $('shelf-close').onclick = () => { Snd.tap(); overlay('ov-shelf', false); };
  // 이웃이 처음 고마워할 때 그림책을 선물로 준다
  function giveBook(nbId) {
    const id = Object.keys(BOOKS).find(k => BOOKS[k].from === nbId); if (!id) return '';
    const own = ownBooks(); if (own.includes(id)) return ''; own.push(id); return id;
  }

  // =====================================================================
  // 산책 끝: 이웃이 왼쪽에서 걸어와 인사하고 이야기하다가, 오른쪽 문제 칸에 부탁을 낸다
  // =====================================================================
  const NB_CHAT = {
    squirrel: { first: [['N', '어? 안녕! 나는 꽃밭에 사는 다람쥐 토리야.'], ['F', '안녕, 토리! 꽃밭 정말 예쁘다.'], ['N', '겨울 준비로 도토리를 모으는 중인데, 셈이 너무 어려워…'], ['F', '우리가 도와줄게!']],
      again: [['N', '또 왔구나! 반가워!'], ['F', '토리, 도토리는 많이 모았어?'], ['N', '응! 그런데 또 궁금한 게 생겼어.']] },
    penguin: { first: [['N', '뒤뚱뒤뚱~ 안녕! 나는 바닷가에 사는 펭귄 펭이야.'], ['F', '안녕, 펭이! 바다 냄새가 좋다.'], ['N', '물고기를 잡았는데 무게를 계산하다가 헷갈렸어.'], ['F', '같이 생각해 볼래?']],
      again: [['N', '어서 와! 오늘 바다 엄청 반짝이지?'], ['F', '응! 펭이도 잘 지냈어?'], ['N', '응! 그런데 또 셈할 게 생겼어.']] },
    hedgehog: { first: [['N', '앗, 손님이다! 나는 딸기밭 주인 고슴도치 도치야.'], ['F', '안녕, 도치! 딸기가 정말 많다.'], ['N', '딸기밭을 넓히려는데 계산이 막혔어. 가시는 안 찌를게!'], ['F', '헤헤, 우리가 도와줄게.']],
      again: [['N', '또 놀러 왔구나! 딸기 하나 먹을래?'], ['F', '고마워, 도치!'], ['N', '그 대신 이번에도 하나만 도와줘.']] },
    owl: { first: [['N', '부엉~ 별빛 언덕에 손님이 오다니. 나는 부엉이 박사라네.'], ['F', '안녕하세요, 박사님! 별이 정말 많아요.'], ['N', '허허, 별을 세다 보면 재미있는 수수께끼가 많지.'], ['F', '저희도 들려주세요!']],
      again: [['N', '부엉, 또 왔구먼. 반갑네.'], ['F', '박사님, 오늘도 별을 세셨어요?'], ['N', '물론이지. 그래서 오늘의 수수께끼가 있다네.']] }
  };
  const ASK = { squirrel: '내가 내는 문제 풀어 볼래?', penguin: '내가 내는 문제, 같이 풀어 볼래?', hedgehog: '내 문제 한번 풀어 볼래?', owl: '내 수수께끼를 풀어 보겠나?' };
  let nbs = null; // 이웃 만남 진행 상태
  function neighborScene(done) {
    const N = NEIGH[OUT.id]; if (!N) { done(); return; }
    if (!S.nb) S.nb = {};
    const met = (S.nb[N.id] || 0) > 0;
    const lines = (met ? NB_CHAT[N.id].again : NB_CHAT[N.id].first).concat([['N', ASK[N.id]]]);
    const el = $('nbw'); el.innerHTML = NB_ART[N.id]; el.dataset.id = N.id; el.className = 'nbw in'; el.style.display = '';
    // 대화 중에는 문제 칸에 이웃 이름표
    $('qtag').textContent = `${N.name}${met ? '' : ' · 처음 만났어요'}`; $('qtag').classList.remove('s1');
    $('qfig').innerHTML = `<div class="nb-portrait">${NB_ART[N.id]}</div>`; $('qtext').innerHTML = '<span class="nb-wait">이야기하는 중… 화면을 누르면 다음 말로 넘어가요</span>'; $('qtext').classList.remove('long'); $('choices').innerHTML = '';
    nbs = { N, lines, i: -1, done, phase: 'walk' };
    Snd.babble(2, 'bunny');
    setTimeout(() => { el.classList.remove('in'); el.classList.add('here'); nbs.phase = 'talk'; nextNbLine(); }, 1500);
  }
  function nextNbLine() {
    if (!nbs || nbs.phase !== 'talk') return;
    nbs.i++;
    if (nbs.i >= nbs.lines.length) { nbs.phase = 'ask'; nbAsk(); return; }
    const [who, t] = nbs.lines[nbs.i];
    if (who === 'N') { speak('out', `<b class="spk">${nbs.N.name}</b> ${t}`, { silent: true, who: 'N' }); Snd.babble(2, 'bunny'); }
    else { speak('out', level() === 'talk' ? t : line('poke')); bounce($('opet')); }
    clearTimeout(nbs.t); nbs.t = setTimeout(nextNbLine, 2600);
  }
  function bounce(el) { el.classList.remove('talk'); void el.offsetWidth; el.classList.add('talk'); }
  $('stage').addEventListener('click', () => { if (nbs && nbs.phase === 'talk') { clearTimeout(nbs.t); nextNbLine(); } });
  function nbAsk() {
    const N = nbs.N; nq = Prob.story(N.id); nPlace = OUT.id;
    const U = Prob.UNITS[nq.unit] || { sem: 1, name: '' };
    const tag = $('qtag'); tag.textContent = `${N.name}의 부탁 · ${U.sem}학기 ${U.name}`; tag.classList.toggle('s1', U.sem === 1);
    $('qfig').innerHTML = ''; $('qtext').innerHTML = nq.q; $('qtext').classList.add('long');
    const box = $('choices'); box.innerHTML = ''; box.className = 'choices' + (nq.choices.length === 3 ? ' three' : '');
    nq.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch' + (nq.txt ? ' txt' : ''); b.innerHTML = c; b.onclick = () => nbBoardAnswer(b, c); box.appendChild(b); });
    const qc = $('qcard'); qc.classList.remove('in'); void qc.offsetWidth; qc.classList.add('in'); nq.lock = false;
  }
  function nbBoardAnswer(btn, c) {
    if (nq.lock) return; nq.lock = true; const N = nbs.N, ok = c === nq.ans; S.total++; rec(nq.unit, ok);
    const st = S.stats[nq.unit] || (S.stats[nq.unit] = { c: 0, w: 0 }); const all = [...$('choices').children];
    let msg;
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.xp++;
      S.nb[N.id] = (S.nb[N.id] || 0) + 1; const [g, n] = N.gift;
      if (g === 'candy') S.candy += n; else { initGarden(); S.pantry[g] = (S.pantry[g] || 0) + n; }
      const book = giveBook(N.id);
      msg = `${N.thx}${book ? ` 그리고 이 그림책 <b>「${BOOKS[book].title}」</b>도 선물이야!` : ''}<br><small style="font-size:.8em;color:#7A6283">${g === 'candy' ? `별사탕 +${n}` : `${ING_NAME[g]} +${n}`}${book ? ' · 그림책 +1' : ''}</small>`;
      Snd.combo(); outReact('happy', 'hop'); S.log.push({ e: 'help', id: N.id });
      if (S.nb[N.id] === 3) setTimeout(() => toast(`<b>${N.name}</b>${Prob.jo(N.name, '이').slice(N.name.length)} 가끔 방에 놀러 온대요!`), 1500);
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === nq.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++;
      Snd.no(); msg = `${N.miss}<br><small style="font-size:.8em;color:#7A6283">정답은 ${nq.ans}</small>`;
    }
    speak('out', `<b class="spk">${N.name}</b> ${msg}`, { silent: true, who: 'N' }); save(); hud();
    // 인사하고 왼쪽으로 걸어 나간다
    setTimeout(() => { speak('out', `<b class="spk">${N.name}</b> ${pick(['또 놀러 와! 안녕~', '고마웠어! 다음에 또 만나!', '잘 가! 조심히 가!'])}`, { silent: true, who: 'N' }); $('nbw').classList.add('bye'); }, 3200);
    setTimeout(() => { $('nbw').style.display = 'none'; $('nbw').className = 'nbw'; const d = nbs.done; nbs = null; d(); }, 5000);
  }

  // =====================================================================
  // 옷장: 거울 앞에서 부위별로 입히기 · 코디 저장 · 몸 색 · 옷 만들기 · 주문
  // =====================================================================
  const SLOTS = [['head', '머리'], ['face', '얼굴'], ['neck', '목'], ['body', '몸'], ['hand', '손'], ['back', '등']];
  const TINT_NAME = { base: '처음 색', sunset: '노을 분홍', sky: '하늘', mint: '민트', lav: '라벤더', rainbow: '무지개', cream: '크림', choco: '초코', berry: '딸기', gray: '구름 회색' };
  const SEWABLE = ['apron', 'cape', 'pajama', 'dress', 'bag', 'tie'];
  let wdTab = 'wear', wdSlot = 'head', paintQ = null;
  function initWear() {
    S.wear = S.wear || {}; S.tint = S.tint || 'base'; S.tints = S.tints || ['base']; S.outfits = S.outfits || [null, null, null];
    if (S.acc && ITEMS[S.acc]) { S.wear[ITEMS[S.acc].slot || 'head'] = S.acc; S.acc = null; }
  }
  function wdSay(t) { const b = $('wd-say'); b.querySelector('span').innerHTML = t; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); emoteText('wd', t); }
  function wdPet(mood = 'idle') { if (mood !== 'idle') emoLock.wd = Date.now(); $('wd-pet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc()); }
  let wdFromEdit = false;
  function openWardrobe(tab) {
    initWear(); wdTab = tab || 'wear'; paintQ = null; wdPet('happy');
    wdSay(S.stage < 3 ? '(알에서 나오면 옷을 입을 수 있어요)' : level() === 'talk' ? pick(['오늘은 뭐 입을까?', '거울 앞에 서니까 두근두근!', '예쁘게 꾸며 줘!']) : L3('care'));
    renderWd(); overlay('ov-wd', true);
  }
  function renderWd() {
    document.querySelectorAll('#wd-tabs .tab').forEach(b => b.classList.toggle('on', b.dataset.tab === wdTab));
    renderPresets();
    const body = $('wd-body'), own = (id) => S.items.includes(id);
    if (wdTab === 'wear') {
      const ids = Object.keys(ITEMS).filter(k => ITEMS[k].kind === 'acc' && ITEMS[k].slot === wdSlot);
      body.innerHTML = `<div class="slot-row">${SLOTS.map(([k, n]) => `<button class="slot ${wdSlot === k ? 'on' : ''}" data-slot="${k}">${n}${S.wear[k] ? ' ●' : ''}</button>`).join('')}</div>
        <div class="wd-grid"><button class="wd-item off" data-off="1"><span class="ia"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="none" stroke="#C9B8D9" stroke-width="3"/><path d="M10 30 L30 10" stroke="#C9B8D9" stroke-width="3"/></svg></span><b>안 입기</b></button>
        ${ids.map(k => { const I = ITEMS[k], o = own(k), on = S.wear[wdSlot] === k; return `<button class="wd-item ${o ? '' : 'lock'} ${on ? 'on' : ''}" data-wear="${k}"><span class="ia">${Art.wearIcon(k, S.kind, S.wcol)}</span><b>${I.name}</b><small>${o ? (on ? '입는 중 · 누르면 벗기' : '') : I.sew ? '재봉 공방에서 만들어요' : I.gift ? '생일 선물' : `주문 · 별사탕 ${I.price}`}</small></button>`; }).join('')}</div>`;
      const curW = S.wear[wdSlot];
      if (curW && Art.WEAR[curW] && Art.WEAR[curW].cm) {
        const cc = (S.wcol || {})[curW] || 'base';
        body.insertAdjacentHTML('beforeend', `<div class="col-row"><b>${ITEMS[curW].name} 색</b>${['base', ...Object.keys(Art.PAL)].map(c => `<button class="col-sw ${cc === c ? 'on' : ''}" data-col="${c}" aria-label="${c === 'base' ? '원래 색' : Art.PAL[c][0]}" style="background:${c === 'base' ? 'conic-gradient(#FFC7D9,#C9B8FF,#A8E6CF,#FFE08A,#FFC7D9)' : Art.PAL[c][1]};border-color:${c === 'base' ? '#C9B8D9' : Art.PAL[c][2]}">${c === 'base' ? '<i>원래</i>' : ''}</button>`).join('')}</div>`);
        body.querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
          S.wcol = S.wcol || {}; const c = b.dataset.col; if (c === 'base') delete S.wcol[curW]; else S.wcol[curW] = c;
          Snd.pop(); save(); wdPet('happy'); sparks($('wd-mirror'), 8);
          wdSay(level() === 'talk' ? pick(['우와, 이 색 예쁘다!', '이 색 나한테 어울려?', '새 옷 같아!', '이 색 마음에 쏙 들어!']) : L3('care')); renderWd();
        });
      }
      body.querySelectorAll('[data-slot]').forEach(b => b.onclick = () => { Snd.tap(); wdSlot = b.dataset.slot; renderWd(); });
      body.querySelector('[data-off]').onclick = () => { Snd.tap(); delete S.wear[wdSlot]; save(); wdPet(); renderWd(); };
      body.querySelectorAll('[data-wear]').forEach(b => b.onclick = () => {
        const k = b.dataset.wear;
        if (!own(k)) { Snd.no(); if (ITEMS[k].sew) { wdTab = 'sew'; renderWd(); } else if (!ITEMS[k].gift) { wdTab = 'shop'; renderWd(); } return; }
        if (S.stage < 3) { toast('알에서 나오면 입을 수 있어요'); return; }
        if (S.wear[wdSlot] === k) { delete S.wear[wdSlot]; Snd.tap(); save(); wdPet(); wdSay(level() === 'talk' ? `${Prob.jo(ITEMS[k].name, '을')} 벗었어.` : L3('care')); renderWd(); return; }
        S.wear[wdSlot] = k; Snd.pop();
        const ts = (TASTE[S.kind].acc || {})[k] || 'like', first = !S.known.acc[k]; S.known.acc[k] = ts; if (first) addFriend(ts === 'love' ? 6 : 2);
        wdPet(ts === 'hate' ? 'sad' : 'happy'); const p = $('wd-pet'); p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop');
        wdSay(level() === 'talk' ? fillJo(lineFrom(TASTE_LINE[S.kind].acc[ts], 'ta'), '{x}', ITEMS[k].name) : ts === 'hate' ? L3('yuck') : L3('care'));
        S.log.push({ e: 'wear', id: k }); save(); renderWd();
      });
    } else if (wdTab === 'album') {
      const al = S.album || [];
      body.innerHTML = `<div class="al-top"><button class="btn primary" id="al-snap">${CAMERA} 지금 모습 찍기</button><small>사진은 12장까지 모여요</small></div>
        <div class="al-grid">${al.length ? al.map((ph, i) => `<div class="al-ph"><span class="al-pic">${Art.draw(ph.k, ph.st, ph.m || 'happy', { wear: ph.wear, tint: ph.tint, col: ph.col })}</span><small>${ph.d}</small><button class="al-use" data-use="${i}">이 옷 입기</button></div>`).join('') : '<p class="sub">아직 사진이 없어요. 예쁘게 입히고 찍어 봐요!</p>'}</div>`;
      $('al-snap').onclick = snapPhoto;
      body.querySelectorAll('[data-use]').forEach(b => b.onclick = () => {
        const ph = al[+b.dataset.use]; if (ph.k !== S.kind) return; Snd.pop();
        S.wear = Object.fromEntries(Object.entries(ph.wear || {}).filter(([, id]) => S.items.includes(id))); S.wcol = Object.assign({}, ph.col || {}); if (S.tints.includes(ph.tint)) S.tint = ph.tint;
        save(); wdPet('happy'); wdSay(level() === 'talk' ? '그때 그 옷이다! 기억나?' : L3('care')); renderWd();
      });
    } else if (wdTab === 'tint') {
      if (paintQ) return renderPaint();
      const tints = Object.keys(Art.TINT_DEF[S.kind]);
      body.innerHTML = `<p class="sub">물감 공방에서 물감을 만들면 몸 색을 바꿀 수 있어요</p><div class="wd-grid">${tints.map(t => { const o = S.tints.includes(t), on = S.tint === t;
        return `<button class="wd-item ${on ? 'on' : ''}" data-tint="${t}"><span class="ia">${Art.draw(S.kind, Math.max(3, S.stage), 'happy', { wear: {}, tint: t })}</span><b>${TINT_NAME[t]}</b><small>${o ? (on ? '지금 색' : '바꾸기') : '물감 만들기 (문제 2개)'}</small></button>`; }).join('')}</div>`;
      body.querySelectorAll('[data-tint]').forEach(b => b.onclick = () => {
        const t = b.dataset.tint; Snd.tap();
        if (S.stage < 3) { toast('알에서 나오면 색을 바꿀 수 있어요'); return; }
        if (S.tints.includes(t)) { S.tint = t; save(); wdPet('happy'); sparks($('wd-mirror'), 14); wdSay(level() === 'talk' ? pick(['우와, 새 색이다! 어울려?', '몸이 반짝반짝해!', '나 이 색 마음에 들어!']) : L3('care')); renderWd(); }
        else { paintQ = { tint: t, got: 0 }; renderPaint(); }
      });
    } else if (wdTab === 'sew') {
      body.innerHTML = `<p class="sub">단계마다 문제를 풀면 옷이 완성돼요 (문제 4개)</p><div class="wd-grid">${SEWABLE.map(k => `<button class="wd-item ${own(k) ? 'on' : ''}" data-sew="${k}"><span class="ia">${Art.wearIcon(k, S.kind, S.wcol)}</span><b>${ITEMS[k].name}</b><small>${own(k) ? '만들었어요 · 다시 만들기' : '만들기'}</small></button>`).join('')}</div>`;
      body.querySelectorAll('[data-sew]').forEach(b => b.onclick = () => { Snd.tap(); overlay('ov-wd', false); startSew(b.dataset.sew); });
    } else {
      const rank = (k) => (ITEMS[k].kind === 'acc' ? 0 : ITEMS[k].toy ? 1 : 2) * (wdFromEdit ? -1 : 1);
      const ids = Object.keys(ITEMS).filter(k => !own(k) && ITEMS[k].price && !ITEMS[k].sew && !ITEMS[k].gift).sort((a, b) => rank(a) - rank(b));
      body.innerHTML = `<p class="sub">가진 별사탕 <b>${S.candy}</b>개</p><div class="wd-grid">${ids.map(k => `<button class="wd-item" data-buy="${k}"><span class="ia">${ITEMS[k].kind === 'acc' ? Art.wearIcon(k, S.kind) : Scene.item(k)}</span><b>${ITEMS[k].name}</b><small>${ITEMS[k].kind === 'acc' ? '옷' : ITEMS[k].toy ? '놀잇감' : '가구'} · 별사탕 ${ITEMS[k].price}</small></button>`).join('') || '<p class="sub">모두 모았어요!</p>'}</div>`;
      body.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
        const k = b.dataset.buy, I = ITEMS[k];
        if (S.candy < I.price) { Snd.no(); toast(`별사탕이 ${I.price - S.candy}개 더 필요해요. 나들이에서 문제를 풀어 모아요!`); return; }
        S.candy -= I.price; S.items.push(k); Snd.combo(); hud(); save();
        toast(`<b>${I.name}</b>${Prob.jo(I.name, '이').slice(I.name.length)} 도착했어요!`);
        if (I.kind === 'acc') { wdSlot = I.slot; wdTab = 'wear'; } else setTimeout(() => toast(I.toy ? `<b>꾸미기</b>에서 방에 놓으면 ${NM()}랑 같이 놀 수 있어요!` : '<b>꾸미기</b>에서 방에 놓을 수 있어요'), 2500); renderWd();
      });
    }
  }
  const CAMERA = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  // 사진 찍기: 거울이 번쩍 하고, 지금 모습이 앨범에 모인다
  function snapPhoto() {
    if (S.stage < 3) { toast('알에서 나오면 사진을 찍을 수 있어요'); return; }
    const m = $('wd-mirror'), f = document.createElement('div'); f.className = 'snapflash'; m.appendChild(f); setTimeout(() => f.remove(), 600);
    Snd.pop(); setTimeout(() => Snd.chime && Snd.chime(), 120);
    const d = new Date(), pose = pick(['happy', 'smug', 'wide']);
    S.album = S.album || []; S.album.unshift({ k: S.kind, st: S.stage, m: pose, wear: Object.assign({}, S.wear), tint: S.tint, col: Object.assign({}, S.wcol || {}), d: `${d.getMonth() + 1}월 ${d.getDate()}일` });
    if (S.album.length > 12) S.album.length = 12;
    S.log.push({ e: 'photo' }); save(); wdPet(pose);
    wdSay(level() === 'talk' ? pick(['찰칵! 예쁘게 나왔어?', '브이~ 한 장 더 찍자!', '우와, 사진 속 나 진짜 귀엽다!']) : L3('care'));
    if (wdTab === 'album') setTimeout(renderWd, 350);
  }
  function renderPresets() {
    $('wd-presets').innerHTML = S.outfits.map((o, i) => `<div class="preset"><button class="pre-load" data-load="${i}" ${o ? '' : 'disabled'}>${o ? Art.draw(S.kind, Math.max(3, S.stage), 'idle', { wear: o.wear, tint: o.tint }) : `<span>코디 ${i + 1}</span>`}</button><button class="pre-save" data-save="${i}">저장</button></div>`).join('');
    $('wd-presets').querySelectorAll('[data-load]').forEach(b => b.onclick = () => {
      const o = S.outfits[+b.dataset.load]; if (!o) return; Snd.pop();
      S.wear = Object.assign({}, Object.fromEntries(Object.entries(o.wear).filter(([, id]) => S.items.includes(id)))); if (S.tints.includes(o.tint)) S.tint = o.tint;
      save(); wdPet('happy'); wdSay(level() === 'talk' ? '이 코디 좋아!' : L3('care')); renderWd();
    });
    $('wd-presets').querySelectorAll('[data-save]').forEach(b => b.onclick = () => { Snd.combo(); S.outfits[+b.dataset.save] = { wear: Object.assign({}, S.wear), tint: S.tint, col: Object.assign({}, S.wcol || {}) }; save(); toast(`지금 모습을 <b>코디 ${+b.dataset.save + 1}</b>에 저장했어요`); renderPresets(); });
  }
  // 물감 공방: 분수 문제 2개를 맞히면 새 색 물감이 완성
  function renderPaint() {
    const body = $('wd-body'), P = paintQ;
    P.q = Prob.themed('paint');
    body.innerHTML = `<div class="paint-head"><span class="paint-pot" style="--c:${(Art.TINT_DEF[S.kind][P.tint].g || Art.TINT_DEF[S.kind][P.tint].lin || ['#fff'])[2] || '#FFD3E2'}"></span><b>${TINT_NAME[P.tint]} 물감 만들기</b><span>${P.got} / 2</span></div>
      <div class="qcard small"><div class="qtag">물감 공방</div><div class="qtext long">${P.q.q}</div></div><div class="choices${P.q.choices.length === 3 ? ' three' : ''}" id="paint-ch"></div><button class="btn ghost" id="paint-stop">그만할래요</button>`;
    P.q.choices.forEach(c => { const b = document.createElement('button'); b.className = 'ch'; b.innerHTML = c; b.onclick = () => paintAnswer(b, c); $('paint-ch').appendChild(b); });
    $('paint-stop').onclick = () => { Snd.tap(); paintQ = null; renderWd(); };
    P.lock = false;
  }
  function paintAnswer(btn, c) {
    const P = paintQ; if (P.lock) return; P.lock = true; const q = P.q, ok = c === q.ans, _r = rec(q.unit, ok), st = S.stats[q.unit] || (S.stats[q.unit] = { c: 0, w: 0 }); S.total++;
    const all = [...$('paint-ch').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim')); st.c++; S.correct++; S.today++; S.xp++; P.got++; Snd.ok();
      if (P.got >= 2) {
        S.tints.push(P.tint); S.tint = P.tint; S.log.push({ e: 'tint', id: P.tint }); paintQ = null; save();
        setTimeout(() => { Snd.level(); wdPet('happy'); sparks($('wd-mirror'), 20); wdSay(level() === 'talk' ? `${TINT_NAME[P.tint]} 색이 됐어! 나 어때?` : L3('care')); renderWd(); }, 700);
        return;
      }
    } else { btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === q.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); }); st.w++; Snd.no(); }
    save(); setTimeout(renderPaint, ok ? 800 : 1800);
  }
  document.querySelectorAll('#wd-tabs .tab').forEach(b => b.onclick = () => { Snd.tap(); wdTab = b.dataset.tab; paintQ = null; renderWd(); });
  $('wd-close').onclick = () => { Snd.tap(); overlay('ov-wd', false); paintQ = null; renderHome(); if (wdFromEdit) { wdFromEdit = false; setTimeout(enterEdit, 200); return; } react('happy', 'hop'); if (canGrow()) setTimeout(() => levelUp(), 300); };

  // ---------- 재봉 공방 (나들이처럼 단계마다 문제) ----------
  const SEW_STEPS = [['천 자르기', 'cut', 'area'], ['바느질하기', 'stitch', 'rule'], ['무늬 넣기', 'pattern', 'sym'], ['리본·레이스 달기', 'ribbon', 'frac']];
  const SEW_COLOR = { apron: '#FFE0EA', cape: '#D9CCFF', pajama: '#D6E7FF', dress: '#FFC7D9', bag: '#FFD3C4', tie: '#BFDCFF' };
  function startSew(id) { initWear(); OUT = { type: 'sew', id, step: 0, n: 4, res: [], finds: [], fill: 0, anim: false }; beginOut(); }

  // ---------- 바람 들어주기 ----------
  function fulfill(t, id, where = 'home') {
    const w = S.wishes.find(x => !x.done && x.t === t && x.id === id); if (!w) return false;
    w.done = true; S.candy += 5; addFriend(10); S.log.push({ e: 'wish', t, id });
    setTimeout(() => { toast(`바람을 들어줬어요! <b>우정 +10 · 별사탕 +5</b>`); Snd.combo(); }, 600);
    if (S.wishes.every(x => x.done)) { S.candy += 10; addFriend(10); S.log.push({ e: 'allwish' }); setTimeout(() => { toast('오늘의 바람을 모두 들어줬어요! <b>보너스 별사탕 +10</b>'); if (where === 'home') speak('home', line('allWish')); }, 3000); }
    save(); return true;
  }

  // ---------- 돌보기 (같이 하기) ----------
  // 거절: 싫다고 했는데 90초 안에 같은 걸 또 권하면, 세 번째부터 속상해하고 우정이 조금 준다
  function loseFriend(v) { S.fxp = Math.max(FRIEND_XP[S.flv] || 0, S.fxp - v); hud(); }
  // 거절 모습: 표정(art) + 몸짓(css) + 둘레 효과
  const NO_FX = {
    dizzy: { mood: 'dizzy', cls: 'act-dizzy', fx: 'orbit' },   // 눈이 뱅글뱅글
    sleepy: { mood: 'sleepy', cls: 'act-yawn', fx: 'zz' },     // 하품하며 졸려
    full: { mood: 'full', cls: 'act-belly', fx: 'puff' },      // 배를 통통
    clean: { mood: 'smug', cls: 'act-nono', fx: 'shine' },     // 뽀송뽀송 반짝
    awake: { mood: 'wide', cls: 'act-boing', fx: 'bang' },     // 말똥말똥 통통 튐
    later: { mood: 'smug', cls: 'act-sway', fx: 'heart' },     // 이따 또 해 줘
    blue: { mood: 'sad', cls: 'act-droop', fx: 'cloud' },      // 기분이 별로
    tickle: { mood: 'tickle', cls: 'act-squirm', fx: 'tick' }, // 간지러워
    upset: { mood: 'pout', cls: 'act-turn', fx: 'fume' }       // 속상해
  };
  // ---------- 대사마다 어울리는 표정·몸짓·효과 ----------
  // 말하는 내용(낱말)을 보고 감정을 고른다. 위에서부터 먼저 맞는 것.
  const EMO_RULES = [
    ['sleepy', /졸려|졸리|하암|잘 자|Zzz|새근|음냐|자고 싶|낮잠|꿈나라|눈꺼풀|눈이 자꾸 감/],
    ['hungry', /배고|꼬르륵|출출|먹고 싶|배가 고|뭐 먹을/],
    ['dirty', /찝찝|씻고 싶|씻겨|꼬질|더러|먼지가 묻/],
    ['scared', /무서|천둥|깜짝|으악|덜덜|번쩍/],
    ['cheer', /괜찮아|힘내|다음엔 (우리|꼭|맞|같이)|할 수 있|정답은|천천히|같이 해 보/],
    ['excited', /안 아파|덕분|꺄아|행복|반가/],
    ['sad', /슬퍼|속상|미안|흑|흐엉|으앙|훌쩍|아파|외로|시무룩|못 했|틀렸|싫어|그만|별로|우웩|저리 가|젖었/],
    ['yum', /맛있|냠|쩝|오물|달콤|꿀꺽|맛이|고소|새콤|배부르|냄새 좋|냄새가 (나|벌써)|킁킁/],
    ['sing', /♪|♫|노래|흥얼|랄라|룰루|피아노/],
    ['love', /사랑|고마워|좋아해|소중|제일 친한|단짝|♥|보고 싶었|기다렸/],
    ['proud', /정답!|맞았|맞혔|잘했|해냈|성공|완성|연속|다 모았|또 하나/],
    ['excited', /우와|와아|야호|신나|최고|대단|멋져|좋아!|짱|깡총|폴짝|두근|재밌/],
    ['wonder', /별|달님|무지개|하늘|구름|반짝|예쁘|노을|오로라|신기/],
    ['curious', /\?|궁금|뭐지|어디|무슨|할까|일까/]
  ];
  // 대사가 몸짓을 말하면(데굴데굴, 빙글, 바들바들 …) 그 몸짓을 꼭 한다
  const ACT_RULES = [
    [/데굴|굴러|굴렀|뒹굴/, { cls: 'act-roll' }], [/빙글|빙그르|한 바퀴/, { cls: 'act-spin' }], [/춤/, { cls: 'act-dance', fx: 'note' }],
    [/바들|오들|덜덜|떨어요/, { cls: 'act-shiver', fx: 'cold' }], [/땀을|뜨끈뜨끈|너무 더운/, { cls: 'act-droop', fx: 'sweat' }],
    [/움찔|깜짝|기우뚱/, { cls: 'act-startle' }], [/두리번|빼꼼|누구지/, { cls: 'act-look', fx: 'q' }], [/등을 돌/, { cls: 'act-turn' }],
    [/발.{0,3}동동|발로|꼼지락/, { cls: 'act-stomp' }], [/둥실|날아갈/, { cls: 'act-float' }], [/꼬옥|토닥/, { cls: 'act-hug', fx: 'heart' }],
    [/킁킁/, { cls: 'act-sniff' }], [/꾸벅|새근|꿈을|쿨쿨/, { cls: 'act-yawn', fx: 'zz' }], [/♪|노래/, { cls: 'act-sway', fx: 'note' }],
    [/따뜻|따끈|포근/, { cls: 'act-hug', fx: 'warm' }], [/시원/, { cls: 'act-sway', fx: 'breeze' }],
    [/반짝|빛나|별빛/, { cls: 'act-nod', fx: 'shine' }], [/뛰었|깡총|콩콩|폴짝|퐁퐁|통통|콩!/, { cls: 'act-boing' }],
    [/흔들|꿈틀/, { cls: 'act-wobble' }], [/쏙/, { cls: 'act-hug' }]
  ];
  const actOf = (html) => { const t = String(html).replace(/<[^>]+>/g, ''); const r = ACT_RULES.find(([re]) => re.test(t)); return r ? r[1] : null; };
  const emoOf = (html) => { const t = String(html).replace(/<[^>]+>/g, ''); const r = EMO_RULES.find(([, re]) => re.test(t)); return r ? r[0] : 'talk'; };
  const EMO = {
    // 거절
    dizzy: { mood: 'dizzy', cls: 'act-dizzy', fx: 'orbit' }, full: { mood: 'full', cls: 'act-belly', fx: 'puff' },
    clean: { mood: 'smug', cls: 'act-nono', fx: 'shine' }, awake: { mood: 'wide', cls: 'act-boing', fx: 'bang' },
    later: { mood: 'smug', cls: 'act-sway', fx: 'heart' }, blue: { mood: 'sad', cls: 'act-droop', fx: 'cloud' },
    tickle: { mood: 'tickle', cls: 'act-squirm', fx: 'tick' }, upset: { mood: 'pout', cls: 'act-turn', fx: 'fume' },
    // 여러 대사
    sleepy: { mood: 'sleepy', cls: 'act-yawn', fx: 'zz' }, hungry: { mood: 'sad', cls: 'act-belly', fx: 'growl' },
    dirty: { mood: 'sad', cls: 'act-squirm', fx: 'stink' }, scared: { mood: 'wide', cls: 'act-shiver', fx: 'sweat' },
    cheer: { mood: 'happy', cls: 'act-nod', fx: 'shine' }, sad: { mood: 'sad', cls: 'act-droop', fx: 'cloud' },
    yum: { mood: 'chew', cls: 'act-munch', fx: 'heart' }, sing: { mood: 'happy', cls: 'act-sway', fx: 'note' },
    love: { mood: 'happy', cls: 'act-sway', fx: 'heart' }, proud: { mood: 'smug', cls: 'act-boing', fx: 'star' },
    excited: { mood: 'happy', cls: 'act-boing', fx: 'shine' }, wonder: { mood: 'wide', cls: 'act-lookup', fx: 'shine' },
    curious: { mood: null, cls: 'act-tilt', fx: 'q' }, talk: { mood: null, cls: 'act-nod', fx: null }
  };
  const ACT_CLS = [...new Set(Object.values(EMO).map(x => x.cls).concat(['act-roll', 'act-spin', 'act-dance', 'act-startle', 'act-look', 'act-stomp', 'act-float', 'act-hug', 'act-sniff', 'act-wobble']))];
  // 화면마다 친구 그림이 다르다: 방, 나들이(요리·산책·바느질), 돌보기, 책 읽기, 옷장, 수수께끼
  const emoLock = {};
  const nbDraw = (id) => (m) => { const e = $(id); if (e && e.dataset.id) e.innerHTML = nbArt(e.dataset.id, m); };
  const EMO_CTX = {
    home: () => ({ el: $('pet'), draw: (m) => drawPet(m), ok: () => !sleeping && !sulking && !toyOn }),
    out: () => ({ el: $('opet'), draw: (m) => drawOutPet(m || 'idle'), ok: () => true }),
    act: () => ({ el: $('act-pet'), draw: (m) => actPet(m || 'idle'), ok: () => S.stage >= 3 }),
    read: () => ({ el: $('read-pet'), draw: (m) => { $('read-pet').innerHTML = Art.draw(S.kind, S.stage, m || 'happy', showAcc()); }, ok: () => S.stage >= 3 }),
    wd: () => ({ el: $('wd-pet'), draw: (m) => wdPet(m || 'idle'), ok: () => S.stage >= 3 }),
    // 이웃: 표정·몸짓·효과 (그림 위 data-id 로 누구인지 안다)
    nbw: () => ({ el: $('nbw'), draw: nbDraw('nbw'), ok: () => $('nbw').style.display !== 'none' }),
    nbart: () => ({ el: $('nb-art'), draw: nbDraw('nb-art'), ok: () => true }),
    visitor: () => ({ el: $('visitor'), draw: nbDraw('visitor'), ok: () => $('visitor').style.display !== 'none' }),
    riddle: () => ({ el: $('riddle-pet'), draw: (m) => { $('riddle-pet').innerHTML = Art.draw(S.kind, S.stage, m || 'happy', showAcc()); }, ok: () => S.stage >= 3 })
  };
  // F: EMO 항목. soft=true면 다른 동작이 방금 정한 표정·몸짓은 두고 둘레 효과만 낸다
  function emote(where, F, soft, force) {
    const C = EMO_CTX[where] && EMO_CTX[where](); if (!C || !C.el || !C.ok()) return;
    const el = C.el; if (!el.getBoundingClientRect().width) return;
    const egg = S.stage <= 2 && !['nbw', 'nbart', 'visitor'].includes(where);
    if (!soft || force) {
      clearTimeout(el._emoT);
      if (F.mood && !soft && !egg) C.draw(F.mood);
      el.classList.remove(...ACT_CLS, 'hop', 'shake', 'squish', 'wobble', 'talk'); void el.offsetWidth; el.classList.add(F.cls);
      el._emoT = setTimeout(() => { el.classList.remove(F.cls); if (F.mood && !soft && !egg) C.draw(); }, 2400);
    }
    if (F.fx) petFx(F.fx, el);
  }
  // 대사를 띄울 때 부른다: 방금 다른 동작(react 등)이 있었으면 효과만
  function emoteText(where, html) {
    const k = emoOf(html), A = actOf(html), F = A ? Object.assign({}, EMO[k], A, { fx: A.fx || EMO[k].fx }) : EMO[k];
    const soft = Date.now() - (emoLock[where] || 0) < 500;
    if (soft && k === 'talk' && !A) return;
    emote(where, F, soft, !!A);
  }
  function petNo(kind) { emoLock.home = 0; emote('home', EMO[kind] || EMO.upset); emoLock.home = Date.now(); }
  // 친구 머리 둘레에 떠오르는 것 (그 친구 그림이 들어 있는 상자 기준)
  function petFx(kind, el) {
    if (S.lowfx && kind !== 'zz') return;
    el = el || $('pet');
    const host = el.offsetParent || $('room'), r = host.getBoundingClientRect(), pr = el.getBoundingClientRect();
    const cx = pr.left - r.left + pr.width / 2, top = pr.top - r.top + pr.height * .18, w = pr.width;
    if (kind === 'orbit') {
      const o = document.createElement('div'); o.className = 'petorbit'; o.innerHTML = '<i>★</i><i>✦</i><i>★</i>';
      Object.assign(o.style, { left: cx + 'px', top: top + 'px', width: w * .55 + 'px', height: w * .2 + 'px' }); host.appendChild(o); setTimeout(() => o.remove(), 2400); return;
    }
    const CH = { zz: ['z', 'Z', 'z'], puff: ['통', '통'], shine: ['✦', '✧', '✦', '✧'], bang: ['!', '!'], heart: ['♥', '♥'], cloud: ['☁'], tick: ['~', '~', '~'], fume: ['#'],
      growl: ['꼬르륵'], stink: ['~', '~'], sweat: ['', ''], note: ['♪', '♫', '♪'], star: ['★', '✦'], q: ['?'], cold: ['*', '*', '*'], warm: ['♥', '~', '♥'], breeze: ['~', '~', '~'] }[kind] || [];
    CH.forEach((ch, i) => {
      const e = document.createElement('span'); e.className = 'petfx pf-' + kind; e.textContent = ch;
      const side = (i % 2 ? 1 : -1);
      const dx = kind === 'tick' || kind === 'stink' || kind === 'cold' || kind === 'breeze' ? side * .42 * w : kind === 'shine' ? (i - 1.5) * w * .26 : kind === 'puff' || kind === 'sweat' ? side * .34 * w : kind === 'growl' ? 0 : (i - (CH.length - 1) / 2) * w * .16 + w * .2;
      const dy = kind === 'puff' || kind === 'growl' ? pr.height * .45 : kind === 'shine' ? pr.height * (.1 + (i % 2) * .25) : kind === 'tick' || kind === 'stink' || kind === 'cold' || kind === 'breeze' ? pr.height * (.2 + i * .12) : kind === 'sweat' ? pr.height * .08 : 0;
      Object.assign(e.style, { left: (cx + dx) + 'px', top: (top + dy) + 'px', animationDelay: (i * .25) + 's' });
      host.appendChild(e); setTimeout(() => e.remove(), 2600 + i * 250);
    });
  }
  function refuse(key, text, kind) {
    const now = Date.now(), r = S.refuse && S.refuse.key === key && now - S.refuse.t < 90000 ? S.refuse : { key, n: 0 };
    r.n++; r.t = now; S.refuse = r;
    if (r.n >= 3) {
      const talk = level() === 'talk';
      speak('home', talk ? pick(['싫다고 했잖아… 자꾸 그러면 속상해.', '내 말 안 들어 주는 거야? 흥.', '아까 말했는데… 나 지금은 정말 싫어.']) : '(시무룩… 고개를 홱 돌려요)', { silent: !talk });
      petNo('upset'); addNeed('mood', -4);
      if (dayCap('scold', 5)) { loseFriend(2); toast('싫다는 걸 자꾸 권해서 속상해해요. <b>우정이 조금 줄었어요</b>'); }
    } else { speak('home', text, { silent: level() !== 'talk' }); petNo(kind || 'upset'); if (r.n === 2) setTimeout(() => toast('친구가 싫다고 해요. 자꾸 권하면 <b>속상해할 수 있어요</b>'), 900); }
    renderNeeds(); save();
  }
  // 책 읽기: 졸리거나, 기분이 너무 안 좋거나, 방금 많이 읽었으면 싫어한다
  function readNo() {
    if (S.stage <= 2) return null;
    const N = S.needs, talk = level() === 'talk', now = Date.now();
    if (N.energy < 20) return ['sleepy', talk ? '졸려서 글씨가 가물가물해… 먼저 재워 줘.' : '(하암… 눈이 감겨요)'];
    if (N.mood < 25) return ['blue', talk ? '지금은 책 읽을 기분이 아니야…' : '(시무룩)'];
    const recent = (S.readT || []).filter(t => now - t < 40 * 60000);
    if (recent.length >= 3) return ['dizzy', talk ? '책을 너무 많이 읽었더니 눈이 뱅글뱅글~ 조금 이따 읽자.' : '(눈이 뱅글뱅글)'];
    return null;
  }
  // ---------- 알 돌보기: 담요·부채·노래 (방에서 바로) ----------
  function eggCare(id) {
    const t = S.temp == null ? 50 : S.temp, now = Date.now(), wk = $('walker');
    if (id === 'warm' && t >= 62 && !wished('care', id)) return refuse('egg-warm', '(알이 벌써 따끈따끈해요. 더 덮으면 더울 거예요)', 'awake');
    if (id === 'cool' && t <= 38 && !wished('care', id)) return refuse('egg-cool', '(알이 벌써 서늘해요. 부채질하면 추울 거예요)', 'awake');
    if (id === 'sing' && S.singT && now - S.singT < 5 * 60000 && !wished('care', id)) return refuse('egg-sing', '(알이 노래를 듣고 새근새근 자고 있어요. 조금 이따 불러 줘요)', 'sleepy');
    if (eggBusy) return; if (id === 'warm') return blanketPlay(); if (id === 'cool') return fanPlay(); if (id === 'sing') return singPlay();
  }
  // 알 돌보기를 끝까지 해냈을 때
  function eggDone(id, lv = 1) {
    const t = S.temp == null ? 50 : S.temp;
    if (id === 'warm') { S.temp = Math.min(100, t + 24); Snd.heart(); speak('home', pick(['(포근한 담요를 덮어 줬어요. 알이 따뜻해졌어요)', '(담요 속에서 알이 따끈따끈해졌어요)']), { silent: true }); }
    if (id === 'cool') { S.temp = Math.max(0, t - 24); Snd.pop(); speak('home', pick(['(살랑살랑 부채질… 알이 시원해졌어요)', '(시원한 바람에 알이 살랑 흔들려요)']), { silent: true }); }
    if (id === 'sing') { S.singT = Date.now(); addNeed('mood', lv >= 2 ? 14 : 7); if (lv >= 2 && dayCap('egg-sing', 3)) addFriend(2);
      speak('home', lv >= 2 ? pick(['(♪ 노래에 맞춰 알이 신나게 흔들흔들 춤을 춰요!)', '(알 속에서 콩콩, 박자에 맞춰 대답해요!)']) : '(알이 노래를 듣고 살랑 흔들려요)', { silent: true }); }
    S.eggCare = (S.eggCare || 0) + 1; S.log.push({ e: 'care', id }); fulfill('care', id);
    nestGrow(); save(); renderNeeds(); renderWishes(); renderCare();
    if (canGrow()) setTimeout(() => levelUp(), 1800);
  }
  let eggBusy = false;
  const roomPt = (e) => { const r = $('room').getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  const eggBox = () => { const r = $('room').getBoundingClientRect(), p = $('pet').getBoundingClientRect(); return { x: p.left - r.left + p.width / 2, y: p.top - r.top + p.height * .55, w: p.width, h: p.height }; };
  function eggHint(t) { const h = document.createElement('div'); h.className = 'egghint'; h.textContent = t; $('room').appendChild(h); return h; }
  // 담요 덮기: 방 한쪽의 담요를 손가락으로 끌어다 알 위에 놓는다
  function blanketPlay() {
    eggBusy = true; poked(); const room = $('room'), E = eggBox();
    const bl = document.createElement('div'); bl.className = 'dragprop blanket'; bl.innerHTML = EGG_BLANKET;
    const w = E.w * .9; Object.assign(bl.style, { width: w + 'px', height: w + 'px', left: Math.max(8, E.x - E.w * 1.7) + 'px', top: (E.y - w * .55) + 'px' });
    room.appendChild(bl); const hint = eggHint('담요를 끌어다 알 위에 덮어 주세요');
    let drag = null;
    const end = (ok) => { hint.remove(); bl.remove(); eggBusy = false; if (ok) { const wk = $('walker'), prop = document.createElement('div'); prop.className = 'eggprop warm'; prop.innerHTML = EGG_BLANKET; wk.querySelectorAll('.eggprop').forEach(e => e.remove()); wk.appendChild(prop); setTimeout(() => prop.remove(), 4200); eggDone('warm'); } };
    bl.addEventListener('pointerdown', (e) => { const [x, y] = roomPt(e); drag = { dx: x - bl.offsetLeft, dy: y - bl.offsetTop }; bl.classList.add('held'); try { bl.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    bl.addEventListener('pointermove', (e) => { if (!drag) return; const [x, y] = roomPt(e); bl.style.left = (x - drag.dx) + 'px'; bl.style.top = (y - drag.dy) + 'px'; });
    const up = () => { if (!drag) return; drag = null; bl.classList.remove('held'); const E2 = eggBox(), cx = bl.offsetLeft + bl.offsetWidth / 2, cy = bl.offsetTop + bl.offsetHeight / 2;
      if (Math.abs(cx - E2.x) < E2.w * .45 && Math.abs(cy - E2.y) < E2.h * .55) end(true); else { Snd.tap(); hint.textContent = '조금 더 알 쪽으로! 알 위에 놓아 주세요'; } };
    bl.addEventListener('pointerup', up); bl.addEventListener('pointercancel', up);
    setTimeout(() => { if (bl.isConnected) end(false); }, 25000);
  }
  // 부채질: 부채를 손가락으로 잡고 좌우로 살랑살랑 흔든다
  function fanPlay() {
    eggBusy = true; poked(); const room = $('room'), E = eggBox();
    const fan = document.createElement('div'); fan.className = 'dragprop fan'; fan.innerHTML = EGG_FAN;
    const w = E.w * .8; Object.assign(fan.style, { width: w + 'px', height: w + 'px', left: (E.x + E.w * .25) + 'px', top: (E.y - w * .8) + 'px' });
    room.appendChild(fan); const hint = eggHint('부채를 잡고 좌우로 살랑살랑 흔들어 주세요');
    const bar = document.createElement('div'); bar.className = 'eggmeter'; bar.innerHTML = '<i></i>'; room.appendChild(bar);
    Object.assign(bar.style, { left: (E.x - E.w * .4) + 'px', top: (E.y + E.h * .55) + 'px', width: E.w * .8 + 'px' });
    let drag = null, lx = 0, dir = 0, swings = 0, lastWind = 0; const NEED = 8;
    const end = (ok) => { hint.remove(); fan.remove(); bar.remove(); eggBusy = false; if (ok) eggDone('cool'); };
    fan.addEventListener('pointerdown', (e) => { const [x] = roomPt(e); drag = { dx: x - fan.offsetLeft }; lx = x; fan.classList.add('held'); try { fan.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); });
    fan.addEventListener('pointermove', (e) => {
      if (!drag) return; const [x] = roomPt(e); fan.style.left = (x - drag.dx) + 'px';
      const d = x - lx; if (Math.abs(d) < 14) return; const nd = Math.sign(d); lx = x;
      fan.style.transform = `rotate(${nd * 14}deg)`;
      if (nd !== dir) { dir = nd; swings++; bar.firstChild.style.width = Math.min(100, swings / NEED * 100) + '%';
        const now = Date.now(); if (now - lastWind > 250) { lastWind = now; petFx('breeze', $('pet')); Snd.tap(); const p = $('pet'); p.classList.remove('act-sway'); void p.offsetWidth; p.classList.add('act-sway'); }
        if (swings >= NEED) end(true); }
    });
    const up = () => { drag = null; fan.classList.remove('held'); fan.style.transform = ''; };
    fan.addEventListener('pointerup', up); fan.addEventListener('pointercancel', up);
    setTimeout(() => { if (fan.isConnected) end(false); }, 25000);
  }
  // 노래 불러 주기: 음표가 줄을 따라 알 쪽으로 오면, 하트 고리에 닿을 때 박자 맞춰 톡!
  const SONGS = [
    { name: '반짝반짝 작은 별', n: [[523, 1], [523, 1], [784, 1], [784, 1], [880, 1], [880, 1], [784, 2]] },
    { name: '나비야', n: [[784, 1], [659, 1], [659, 2], [698, 1], [587, 1], [587, 2], [523, 1], [587, 1], [659, 1], [698, 1], [784, 1], [784, 1], [784, 2]] },
    { name: '산토끼', n: [[784, 1], [659, 1], [659, 1], [784, 1], [659, 1], [523, 1], [587, 1], [659, 1], [587, 1], [523, 2]] }
  ];
  function singPlay() {
    eggBusy = true; poked(); const room = $('room'), E = eggBox(), song = pick(SONGS), BEAT = 520, TRAVEL = 1900;
    const lane = document.createElement('div'); lane.className = 'singlane'; room.appendChild(lane);
    const tx = E.x + E.w * .62, ty = E.y - E.h * .05, laneW = room.getBoundingClientRect().width - tx;
    Object.assign(lane.style, { left: tx + 'px', top: ty + 'px', width: Math.max(80, laneW - 10) + 'px' });
    const ring = document.createElement('button'); ring.className = 'singring'; ring.setAttribute('aria-label', '박자 맞추기'); ring.innerHTML = '<span>♥</span>';
    Object.assign(ring.style, { left: tx + 'px', top: ty + 'px' }); room.appendChild(ring);
    const hint = eggHint(`🎵 ${song.name} · 음표가 하트에 닿을 때 하트를 톡!`);
    const notes = []; let t = 900, hits = 0, done = 0;
    song.n.forEach(([f, len]) => { notes.push({ f, at: t, hit: false }); t += BEAT * len; });
    const t0 = performance.now(); let raf = 0;
    notes.forEach(nt => { const el = document.createElement('i'); el.className = 'singnote'; el.textContent = '♪'; room.appendChild(el); nt.el = el; });
    const judge = (txt, cls) => { const j = document.createElement('b'); j.className = 'singjudge ' + cls; j.textContent = txt; Object.assign(j.style, { left: tx + 'px', top: (ty - 40) + 'px' }); room.appendChild(j); setTimeout(() => j.remove(), 700); };
    const step = () => {
      const now = performance.now() - t0;
      notes.forEach(nt => {
        if (nt.gone) return; const k = (nt.at - now) / TRAVEL;
        nt.el.style.left = (tx + Math.max(-.08, k) * Math.max(80, laneW - 30)) + 'px'; nt.el.style.top = (ty - 14) + 'px'; nt.el.style.opacity = k > 1 ? 0 : 1;
        if (!nt.hit && now - nt.at > 230) { nt.gone = true; nt.el.classList.add('miss'); setTimeout(() => nt.el.remove(), 300); judge('앗', 'miss'); Snd.note(nt.f, false); done++; }
      });
      if (done >= notes.length) return finish(); raf = requestAnimationFrame(step);
    };
    const tap = (e) => {
      e && e.preventDefault(); const now = performance.now() - t0;
      const nt = notes.filter(n => !n.gone && !n.hit).sort((a, b) => Math.abs(a.at - now) - Math.abs(b.at - now))[0];
      ring.classList.remove('pulse'); void ring.offsetWidth; ring.classList.add('pulse');
      if (!nt) return; const d = Math.abs(nt.at - now);
      if (d <= 230) { nt.hit = true; nt.gone = true; hits++; done++; Snd.note(nt.f, true); nt.el.classList.add('hit'); setTimeout(() => nt.el.remove(), 300); judge(d <= 110 ? '딱!' : '좋아', d <= 110 ? 'great' : 'good');
        const p = $('pet'); p.classList.remove('act-wobble'); void p.offsetWidth; p.classList.add('act-wobble'); petFx('note', p); }
      else if (d < 600) { Snd.tap(); }
    };
    ring.addEventListener('pointerdown', tap);
    const finish = () => {
      cancelAnimationFrame(raf); ring.remove(); lane.remove(); hint.remove(); notes.forEach(n => n.el && n.el.remove()); eggBusy = false;
      const r = hits / notes.length;
      if (r >= .7) { Snd.combo(); eggDone('sing', 2); }
      else if (r >= .4) eggDone('sing', 1);
      else { speak('home', '(알이 갸우뚱… 박자가 조금 어려웠나 봐요. 다시 불러 줄래요?)', { silent: true }); }
      toast(`${song.name} · 박자 <b>${hits} / ${notes.length}</b>`);
    };
    raf = requestAnimationFrame(step);
  }
  // 둥지: 알을 돌볼수록 포근해진다 (짚 둥지 → 깃털 둥지 → 구름 요람)
  function nestGrow() {
    const lv = S.eggCare >= 10 ? 2 : S.eggCare >= 4 ? 1 : 0;
    if (lv <= (S.nest || 0)) return; S.nest = lv; drawNest();
    setTimeout(() => { Snd.combo(); sparks($('room'), 14); toast(lv === 1 ? '알을 잘 돌봐 줘서 둥지에 <b>폭신한 깃털 이불</b>을 깔았어요!' : '둥지가 <b>구름 요람</b>으로 바뀌었어요! 이제 알이 더 포근해요'); }, 900);
  }
  function drawNest() {
    const wk = $('walker'); wk.querySelectorAll('.nest').forEach(e => e.remove());
    if (S.stage > 2) return;
    const lv = S.nest || 0;
    wk.insertAdjacentHTML('afterbegin', `<div class="nest nest-b n${lv}">${NEST_BACK[lv]}</div>` + (lv === 2 ? `<div class="nest nest-c">${NEST_CANOPY}</div>` : ''));
    wk.insertAdjacentHTML('beforeend', `<div class="nest nest-f n${lv}">${NEST_FRONT[lv]}</div>`);
  }
  const NEST_BACK = [
    `<svg viewBox="0 0 200 90"><ellipse cx="100" cy="52" rx="84" ry="24" fill="#B98A57"/><ellipse cx="100" cy="50" rx="72" ry="17" fill="#8C6440"/>${[...Array(9)].map((_, i) => `<path d="M${30 + i * 17} ${40 + (i % 2) * 4} q8 -6 16 0" stroke="#D9AE7A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}</svg>`,
    `<svg viewBox="0 0 200 90"><ellipse cx="100" cy="52" rx="84" ry="24" fill="#B98A57"/><ellipse cx="100" cy="50" rx="72" ry="17" fill="#FFE6EF"/><path d="M40 48 q60 -14 120 0" stroke="#F7A0C1" stroke-width="3" fill="none" stroke-dasharray="6 6"/>${[[38, 40, -30], [160, 40, 30], [70, 36, -12]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 0 c-4 -10 2 -20 0 -24 c4 6 8 14 0 24z" fill="#fff" stroke="#E8D9EC" stroke-width="1.2"/>`).join('')}</svg>`,
    `<svg viewBox="0 0 200 90"><ellipse cx="100" cy="54" rx="80" ry="20" fill="#C9B8FF"/><ellipse cx="100" cy="52" rx="68" ry="14" fill="#FFF6FA"/></svg>`
  ];
  // 구름 요람의 지붕과 별·달 모빌
  const NEST_CANOPY = `<svg viewBox="0 0 200 150"><path d="M18 150 Q14 24 100 14 Q186 24 182 150" fill="none" stroke="#C9B8FF" stroke-width="10" stroke-linecap="round"/><path d="M18 150 Q14 24 100 14 Q186 24 182 150" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M28 120 Q30 40 100 26 Q60 50 50 120Z" fill="#EEE8FF" opacity=".85"/><path d="M172 120 Q170 40 100 26 Q140 50 150 120Z" fill="#EEE8FF" opacity=".85"/><g class="mob"><path d="M100 14 v18 M70 32 h60 M70 32 v12 M100 32 v20 M130 32 v12" stroke="#B39AF0" stroke-width="1.6"/><path d="M70 44 l2 4.4 4.8.6 -3.5 3.3 .9 4.7 -4.2 -2.3 -4.2 2.3 .9 -4.7 -3.5 -3.3 4.8 -.6z" fill="#FFD36E" stroke="#E8A93C" stroke-width="1"/><path d="M100 52 a6 6 0 1 0 4.5 -9 a4.8 4.8 0 1 1 -4.5 9z" fill="#FFE08A" stroke="#E8A93C" stroke-width="1"/><circle cx="130" cy="49" r="5" fill="#FFC7D9" stroke="#E5679A" stroke-width="1"/></g></svg>`;
  const NEST_FRONT = [
    `<svg viewBox="0 0 200 90"><path d="M16 50 Q100 70 184 50 Q176 86 100 88 Q24 86 16 50Z" fill="#C99A64" stroke="#8C6440" stroke-width="2.4"/>${[...Array(8)].map((_, i) => `<path d="M${30 + i * 19} ${60 + (i % 2) * 6} q9 7 18 0" stroke="#E8C08C" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join('')}<path d="M24 56 q10 -4 14 4 M170 56 q-8 -6 -14 2" stroke="#8C6440" stroke-width="2" fill="none"/></svg>`,
    `<svg viewBox="0 0 200 90"><path d="M16 50 Q100 70 184 50 Q176 86 100 88 Q24 86 16 50Z" fill="#C99A64" stroke="#8C6440" stroke-width="2.4"/><path d="M22 52 Q100 72 178 52 Q172 62 100 66 Q28 62 22 52Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="1.6"/>${[...Array(6)].map((_, i) => `<circle cx="${38 + i * 25}" cy="${60 + (i % 2) * 2}" r="2" fill="#fff"/>`).join('')}${[...Array(7)].map((_, i) => `<path d="M${34 + i * 20} ${72 + (i % 2) * 4} q9 6 18 0" stroke="#E8C08C" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('')}</svg>`,
    `<svg viewBox="0 0 200 90"><path d="M20 50 Q100 68 180 50 L172 74 Q100 90 28 74Z" fill="#F7E3C8" stroke="#C99A64" stroke-width="2.4"/><path d="M24 58 Q100 74 176 58" stroke="#FFC7D9" stroke-width="4" fill="none"/><path d="M100 64 c-5 -5 -9 -1 -5 3 l5 5 5 -5 c4 -4 0 -8 -5 -3z" fill="#F28DB2"/><path d="M14 74 Q100 104 186 74" stroke="#C99A64" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`
  ];
  const EGG_BLANKET = '<svg viewBox="0 0 160 156"><path d="M34 100 Q50 84 80 84 Q110 84 126 100 L132 138 Q80 148 28 138Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="3" stroke-linejoin="round"/><path d="M38 104 Q80 88 122 104" stroke="#fff" stroke-width="3" fill="none" stroke-dasharray="7 7"/><path d="M34 100 q-8 14 -6 38 M126 100 q8 14 6 38" stroke="#E5679A" stroke-width="2" fill="none" opacity=".5"/>' + [[54, 118], [80, 112], [106, 118], [66, 130], [94, 130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff" opacity=".9"/>`).join('') + '</svg>';
  const EGG_FAN = '<svg viewBox="0 0 160 156"><g class="fanw"><path d="M120 60 L150 20 Q160 40 156 62 Z" fill="#B9E3FF" stroke="#5D8FD0" stroke-width="2.6" stroke-linejoin="round"/><path d="M120 60 L152 34 M120 60 L156 48" stroke="#5D8FD0" stroke-width="1.6"/><path d="M120 60 l-10 14" stroke="#C99A64" stroke-width="5" stroke-linecap="round"/></g><path d="M100 50 q-8 6 0 12 M92 70 q-8 6 0 12" stroke="#9CC8FF" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg>';
  const wished = (t, id) => S.wishes.some(w => !w.done && w.t === t && w.id === id);
  // 지금 이 돌보기가 필요 없으면 친구가 하는 말 (필요하면 null)
  function careNo(id) {
    if (S.stage <= 2) return null;
    const N = S.needs, talk = level() === 'talk', now = Date.now();
    if (wished('care', id)) return null;
    if (id === 'bath' && N.clean >= 70) return ['clean', talk ? pick(['아직 뽀송뽀송해! 목욕은 나중에 할래.', '나 지금 깨끗한걸? 냄새 맡아 봐!']) : '(고개를 절레절레)'];
    if (id === 'nap' && S.napT && now - S.napT < 60 * 60000 && N.energy >= 30) return ['awake', talk ? '방금 일어났는걸? 하나도 안 졸려!' : '(눈이 말똥말똥)'];
    if (id === 'nap' && N.energy >= 60) return ['awake', talk ? pick(['하나도 안 졸려! 더 놀고 싶어.', '아직 기운이 펄펄해!']) : '(눈이 말똥말똥)'];
    if (id === 'play' && N.energy < 25) return ['sleepy', talk ? '너무 졸려서 못 놀겠어… 먼저 재워 줘.' : '(하암…)'];
    if (id === 'pet' && S.petT && now - S.petT < 10 * 60000) return ['later', talk ? '아까 많이 쓰다듬어 줬잖아. 이따 또 해 줘!' : '(헤헤, 이따가!)'];
    return null;
  }
  // 쓰다듬기는 창을 따로 띄우지 않는다: 방에서 친구를 직접 문지르도록 손가락 모양으로 알려 준다
  function rubHint() {
    const wk = $('walker'); wk.querySelectorAll('.rubhint').forEach(e => e.remove());
    const h = document.createElement('div'); h.className = 'rubhint'; h.innerHTML = Art.icon('hand'); wk.appendChild(h); setTimeout(() => h.remove(), 2600);
    speak('home', S.stage <= 2 ? '(손가락으로 알을 살살 문질러 주세요)' : level() === 'talk' ? '여기! 손가락으로 살살 쓰다듬어 줘~' : '(손가락으로 살살 쓰다듬어 주세요)', { silent: S.stage <= 2 || level() !== 'talk' });
  }
  function doCare(id) {
    if (id === 'pet') return rubHint();
    if (S.stage <= 2) return eggCare(id);
    if (id !== 'feed') { const no = careNo(id); if (no) { refuse('care-' + id, no[1], no[0]); return; } }
    if (id === 'feed') {
      let own = Object.keys(S.foods).filter(k => S.foods[k] > 0);
      if (own.length && S.stage >= 3 && S.needs.full >= 85) {
        own = own.filter(k => wished('food', k));
        if (!own.length) { refuse('feed', level() === 'talk' ? pick(['배불러… 이따 먹을래.', '배가 빵빵해! 조금 있다가 먹을게.']) : '(배를 통통)', 'full'); return; }
        toast('배부르지만 <b>먹고 싶다던 간식</b>은 먹을 수 있어요');
      }
      if (!own.length) { speak('home', level() === 'talk' ? line('noFood') : line('idle')); toast('냉장고가 비었어요. <b>간식 만들기</b>로 만들어요!'); return; }
      openPick('무엇을 먹여 줄까요?', '냉장고에 있는 간식이에요', own.map(k => ({ id: k, art: Scene.food(k), name: FOODS[k].name, small: `${S.foods[k]}개`, badge: wishBadge('food', k) || tasteBadge('food', k) })), (k) => runAct('feed', k));
      return;
    }
    if (sleeping && id !== 'nap') { sleeping = false; S.asleep = false; S.needs.energy = Math.max(S.needs.energy, 30); }
    runAct(id);
  }
  function wishBadge(t, id) { return S.wishes.some(w => !w.done && w.t === t && w.id === id) ? '<span class="badge wishb">바람</span>' : ''; }
  function tasteBadge(t, id) { const k = S.known[t][id]; return k === 'love' ? '<span class="badge love">좋아해</span>' : k === 'hate' ? '<span class="badge hate">별로래</span>' : ''; }

  let actClean = [], actGot = 0;
  function actSay(t) { const b = $('act-bubble'); b.querySelector('span').innerHTML = t; b.style.display = 'flex'; emoteText('act', t); }
  function actPet(mood) { if (mood && mood !== 'idle') emoLock.act = Date.now(); $('act-pet').innerHTML = Art.draw(S.kind, S.stage, mood, showAcc()); }
  function runAct(id, foodId) {
    const room = $('act-room'), field = $('act-field'), bottom = $('act-bottom');
    room.classList.remove('dark'); bottom.innerHTML = ''; $('act-bubble').style.display = 'none';
    field.querySelectorAll('.bub,.zz,.spark,.float-heart').forEach(e => e.remove());
    const meter = $('act-meter'); meter.style.display = 'none'; meter.firstElementChild.style.width = '0';
    actPet('idle');
    $('act-title').textContent = id === 'feed' ? `${FOODS[foodId].name} 먹이기` : id === 'balloon' ? '풍선 달기' : id === 'pet' && S.stage <= 2 ? '알 데우기' : careName(id);
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
        S.foods[foodId]--; S.log.push({ e: 'feed', id: foodId, ts }); fulfill('food', foodId, 'act'); if (foodId === 'cake') partyProgress('fed');
      } else if (id === 'balloon') {
        partyProgress('balloons'); addFriend(3);
        ln = level() === 'talk' ? (S.kind === 'bunny' ? '와아, 풍선이다! 진짜 파티 같아! 깡총!' : '풍선이 둥실둥실! 나랑 닮았다!') : L3('care');
      } else {
        if (id === 'bath') addNeed('clean', 100); if (id === 'nap') addNeed('energy', 100);
        if (id === 'play') { addNeed('mood', 25); addNeed('energy', -10); } if (id === 'pet') addNeed('mood', 15);
        if (dayCap('care-' + id, 2)) addFriend(3); if (id === 'pet') S.petT = Date.now(); if (id === 'nap') S.napT = Date.now(); S.log.push({ e: 'care', id }); fulfill('care', id, 'act');
        ln = level() === 'talk' ? lineFrom(LINES[S.kind].talk.act[{ bath: 'bubble', play: 'bubble', nap: 'nap', pet: 'pet' }[id]], 'act' + id) : L3('care');
        if (id === 'play' && actGot) { S.candy += actGot; ln += `<br><small style="font-size:.8em;color:#7A6283">규칙에 맞는 방울 ${actGot}개! 별사탕 +${actGot}</small>`; }
        if (id === 'bath' && level() === 'talk') ln = S.kind === 'bunny' ? '뽀송뽀송! 털이 보들보들해졌어!' : '뽀송뽀송! 하얀 구름으로 돌아왔어!';
      }
      actPet(mood); Snd.heart(); if (mood === 'happy') sparks(field, 14);
      actSay(ln); if (level() !== 'egg') Snd.babble(2, S.kind);
      save();
      setTimeout(() => { overlay('ov-act', false); sleeping = false; if (S.needs.energy >= 30) S.asleep = false; renderHome(); react(mood, mood === 'happy' ? 'hop' : null); if (canGrow()) setTimeout(() => levelUp(), 1200); else growHint(); }, 2600);
    };
    const tm = setTimeout(finish, id === 'play' ? 60000 : 40000); actClean.push(() => clearTimeout(tm));
    ({ feed: actFeed, pet: actRub, bath: actBath, play: actMathBubble, balloon: actBalloon, nap: actNap })[id](field, bottom, finish, id, foodId);
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
    initGarden();
    openPick('무엇을 만들까요?', '단계마다 문제를 풀면 간식이 완성돼요', Object.keys(FOODS).map(k => { const nd = NEED[k]; return { id: k, art: Scene.food(k), name: FOODS[k].name, small: (nd ? `${ING_NAME[nd]} 1개 필요 (${S.pantry[nd] || 0}개 있음)` : '재료 넉넉해요') + (S.foods[k] ? ` · 냉장고 ${S.foods[k]}` : ''), badge: (partyOn() && k === 'cake' && !S.party.cake ? '<span class="badge wishb">생일</span>' : '') || wishBadge('food', k) || tasteBadge('food', k) }; }), startCook);
  }
  function openWalk() {
    openPick('어디로 산책 갈까요?', '한 걸음마다 문제를 풀며 걸어가요', Object.keys(PLACES).map(k => ({ id: k, art: Scene.path(k, 6, false, 2.65), name: PLACES[k].name, small: (S.known.place[k] ? '가 본 곳' : '처음 가 봐요') + (NEIGH[k] && NEIGH[k].gift[0] === 'candy' ? ' ' + SC('+' + NEIGH[k].gift[1] + ' 선물') : ''), badge: wishBadge('place', k) || tasteBadge('place', k) })), startWalk, true);
  }
  $('btn-cook').onclick = () => { Snd.tap(); poked(); openCook(); };
  $('btn-walk').onclick = () => { Snd.tap(); poked(); if (S.needs.energy < 25 && S.stage >= 3) { refuse('walk', level() === 'talk' ? '너무 졸려서 산책 못 가겠어… 먼저 재워 줘.' : '(하암…)', 'sleepy'); toast(`너무 졸려 해요. 먼저 <b>${isNight() ? '재워' : '낮잠을 재워'}</b> 줄까요?`); return; } openWalk(); };

  const ADDS = ['drop', 'pour', 'crack', 'top'];
  function startCook(id) {
    const nd = NEED[id];
    if (nd && !(S.pantry[nd] > 0)) { toast(`<b>${ING_NAME[nd]}</b>${Prob.jo(ING_NAME[nd], '이').slice(ING_NAME[nd].length)} 없어요. 텃밭에서 키워 오거나 다른 간식을 만들어요`); return; }
    if (nd) S.pantry[nd]--;
    startCook2(id);
  }
  function startCook2(id) { OUT = { type: 'cook', id, step: 0, n: 5, res: [], finds: [], fill: 0, anim: false, adds: FOODS[id].steps.filter(st => ADDS.includes(st[1])).length }; beginOut(); }
  function setFill() {
    const r = document.getElementById('bowlfill'); if (!r || !OUT || OUT.type !== 'cook') return;
    const h = 54 * Math.min(1, OUT.fill / Math.max(1, OUT.adds));
    r.setAttribute('y', 340 - h); r.setAttribute('height', h + 2);
  }
  function startWalk(id) { OUT = { type: 'walk', id, step: 0, n: 6, res: [], finds: [] }; beginOut(); }
  function beginOut() {
    $('nbw').style.display = 'none'; nbs = null;
    if (editing) { editing = false; $('room').classList.remove('editing'); document.querySelector('.home').classList.remove('editing'); $('edit-layer').innerHTML = ''; $('edit-bar').innerHTML = ''; }
    stopBall(); clearTimeout(wanderT); clearTimeout(idleT); if (sulking) { sulking = false; clearTimeout(sulkT); $('walker').classList.remove('sulk'); }
    show('scr-out'); S.combo = 0;
    const st = $('stage'); st.classList.toggle('cooking', OUT.type !== 'walk'); st.classList.toggle('sewing', OUT.type === 'sew');
    $('out-title').textContent = OUT.type === 'cook' ? `${FOODS[OUT.id].name} 만들기` : OUT.type === 'sew' ? `${ITEMS[OUT.id].name} 만들기` : `${PLACES[OUT.id].name} 산책`;
    $('stage-bg').dataset.place = '';
    drawOutPet('idle'); renderOut(); speak('out', OUT.type === 'sew' && level() === 'talk' ? pick(['옷 만들기다! 두근두근.', '내 옷을 만들어 준다고? 고마워!']) : line(OUT.type === 'walk' ? 'walkStart' : 'cookStart'));
    st.classList.toggle('walking-scene', OUT.type === 'walk'); $('opet').style.left = ''; $('stage-bg').style.background = '';
    if (OUT.type === 'walk') { renderOut(); placeOutPet(0, true); } else { $('cook-fx').innerHTML = ''; placeCookFx(); }
    Snd.music(OUT.type === 'walk' ? 'walk' : 'cook');
    nextQ();
  }
  function renderOut() {
    if (OUT.type === 'sew') {
      if ($('stage-bg').dataset.place !== 'sew-' + OUT.id) {
        $('stage-bg').innerHTML = Scene.sewroom() + `<div id="sew-piece"><div class="cloth" style="background:${SEW_COLOR[OUT.id]}"></div><div class="garm">${Art.wearIcon(OUT.id, S.kind)}</div></div>`;
        $('stage-bg').dataset.place = 'sew-' + OUT.id;
      }
      placeCookFx(); const fx = $('cook-fx'), pc = $('sew-piece');
      if (pc) { Object.assign(pc.style, { left: fx.style.left, top: (parseFloat(fx.style.top) + parseFloat(fx.style.height) * .28) + 'px', width: fx.style.width, height: (parseFloat(fx.style.height) * .72) + 'px' }); pc.className = 's' + OUT.fill; }
      if (!OUT.anim) $('step-label').textContent = OUT.step < OUT.n ? `${OUT.step + 1}. ${SEW_STEPS[OUT.step][0]}` : '완성!';
    } else if (OUT.type === 'cook') {
      const F = FOODS[OUT.id];
      // 부엌은 한 번만 그리고, 그릇 내용물은 재료가 실제로 들어간 만큼만 채운다
      if ($('stage-bg').dataset.place !== 'cook-' + OUT.id) { $('stage-bg').innerHTML = Scene.kitchen(0, F.color, false); $('stage-bg').dataset.place = 'cook-' + OUT.id; }
      setFill();
      // 애니메이션이 도는 동안에는 지금 단계 이름을 그대로 둔다
      if (!OUT.anim) $('step-label').textContent = OUT.step < OUT.n ? `${OUT.step + 1}. ${F.steps[OUT.step][0]}` : '완성!';
    } else if ($('stage-bg').dataset.place !== OUT.id) {
      // 걸어가는 동안 풍경이 지나가는 산책길 (먼 하늘 · 중간 · 길가 세 겹)
      const r = $('stage').getBoundingClientRect(), W = Scene.walkScene(OUT.id, r.width / Math.max(1, r.height));
      $('stage-bg').innerHTML = `<div class="wl far">${W.far}</div><div class="wl mid">${W.mid}</div><div class="wl near">${W.near}</div>`;
      $('stage-bg').style.background = W.sky; $('stage-bg').dataset.place = OUT.id;
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
  function drawOutPet(mood) {
    if (mood && mood !== 'idle') emoLock.out = Date.now(); const p = $('opet'); const pram = S.stage <= 2 && OUT && OUT.type === 'walk';
    p.innerHTML = pram ? `<div class="pram-b">${PRAM_BACK}</div><div class="pram-egg">${Art.draw(S.kind, S.stage, mood, showAcc())}</div><div class="pram-f">${PRAM_FRONT}</div>` : Art.draw(S.kind, S.stage, mood, showAcc());
    p.classList.toggle('egg', S.stage <= 2); p.classList.toggle('pram', pram);
  }
  // 알 산책용 유모차 (바퀴는 걸을 때 굴러간다)
  const PRAM_BACK = '<svg viewBox="0 0 160 156"><path d="M30 86 Q30 28 86 24 L86 86Z" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="3" stroke-linejoin="round"/><path d="M40 80 Q42 40 80 34" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/><path d="M44 30 L48 86 M62 25 L64 86" stroke="#B39AF0" stroke-width="2"/><path d="M128 84 L146 44 L156 44" stroke="#8C99AB" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const PRAM_FRONT = '<svg viewBox="0 0 160 156"><path d="M22 84 H138 Q136 120 100 124 H60 Q24 120 22 84Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="3"/><path d="M28 94 H132" stroke="#fff" stroke-width="3" stroke-dasharray="8 6"/><path d="M80 104 c-5 -5 -9 -1 -5 3 l5 5 5 -5 c4 -4 0 -8 -5 -3z" fill="#fff"/><path d="M48 124 L44 132 M112 124 L116 132" stroke="#8C99AB" stroke-width="4" stroke-linecap="round"/>' + [44, 116].map(x => `<g class="wheel" style="transform-origin:${x}px 140px"><circle cx="${x}" cy="140" r="13" fill="#fff" stroke="#6E7A8C" stroke-width="4"/><path d="M${x - 9} 140 H${x + 9} M${x} 131 V149" stroke="#AEB9C8" stroke-width="2.4"/><circle cx="${x}" cy="140" r="3" fill="#6E7A8C"/></g>`).join('') + '</svg>';
  function placeOutPet(i, instant) {
    // 친구는 제자리에서 걷고, 풍경 세 겹이 서로 다른 속도로 뒤로 지나간다
    const p = Math.max(0, Math.min(1, i / (OUT.n - 1)));
    $('stage-bg').querySelectorAll('.wl').forEach(L => {
      const f = Scene.WALK_F[L.classList[1]];
      if (instant) L.style.transition = 'none';
      L.style.transform = `translateX(${(-p * (f - 1) / f * 100).toFixed(3)}%)`;
      if (instant) { void L.offsetWidth; L.style.transition = ''; }
    });
  }
  function outReact(mood, anim) {
    drawOutPet(mood); const p = $('opet'); p.classList.remove('hop', 'shake', 'walking', 'wobble', ...ACT_CLS); emoLock.out = Date.now(); if (anim && S.stage <= 2) anim = 'wobble'; if (anim) { void p.offsetWidth; p.classList.add(anim); }
    clearTimeout(outReact.t); outReact.t = setTimeout(() => drawOutPet('idle'), 1500);
  }
  function nextQ() {
    cur = OUT.type === 'sew' ? Prob.themed(SEW_STEPS[OUT.step][2]) : Prob.next(S.rot, S.review, S.total, weakUnits());
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
  // 요리·재봉은 동작 애니메이션이 끝난 뒤에 말한다 (넣기도 전에 '넣었다'고 하지 않게)
  function oSay(t) { if (OUT.type === 'walk') { speak('out', t); return; } OUT.say = t; $('obubble').classList.add('hide'); }
  function sayLater() { if (OUT.say && OUT.step < OUT.n) speak('out', OUT.say); OUT.say = null; }
  function answer(btn, c) {
    if (lock) return; lock = true;
    const ok = c === cur.ans; const st = S.stats[cur.unit] || (S.stats[cur.unit] = { c: 0, w: 0 });
    S.total++; rec(cur.unit, ok); const all = [...$('choices').children];
    if (ok) {
      btn.classList.add('ok'); all.forEach(b => b !== btn && b.classList.add('dim'));
      st.c++; S.correct++; S.today++; S.combo++; S.best = Math.max(S.best, S.combo);
      const bonus = S.combo % 5 === 0 ? 1 : 0; S.candy += 1 + bonus; S.xp += 1 + bonus;
      const big = S.combo === 3 || S.combo === 5 || S.combo === 10 || (S.combo > 10 && S.combo % 5 === 0);
      if (big) { Snd.combo(); oSay(line(S.combo === 3 ? 'c3' : S.combo === 5 ? 'c5' : 'c10')); const cw = $('hud-combo-wrap'); cw.classList.remove('hot'); void cw.offsetWidth; cw.classList.add('hot'); }
      else { Snd.ok(); oSay(line(OUT.type === 'walk' ? 'walkOk' : OUT.type === 'sew' ? 'sewOk' : 'cookOk')); }
      outReact('happy', 'hop'); sparks($('ofx'), S.combo >= 5 ? 16 : 10);
    } else {
      btn.classList.add('no'); all.forEach(b => { if (b.innerHTML === cur.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); });
      st.w++; S.combo = 0;
      if (!S.review.some(r => r.unit === cur.unit && r.type === cur.type)) S.review.push({ unit: cur.unit, type: cur.type, due: S.total + R(3, 6) });
      if (S.review.length > 12) S.review.shift();
      Snd.no(); oSay(line(OUT.type === 'walk' ? 'walkNo' : OUT.type === 'sew' ? 'sewNo' : 'cookNo', { a: cur.ans })); outReact('sad', 'shake');
    }
    OUT.res[OUT.step] = ok; OUT.step++; if (OUT.type !== 'walk') OUT.anim = true; // 답을 고른 순간부터 애니메이션이 끝날 때까지 단계 이름을 바꾸지 않는다
    save(); renderOut();
    setTimeout(advance, ok ? 1300 : 2400);
  }
  function advance() {
    if (!$('scr-out').classList.contains('on')) return;
    if (OUT.type === 'sew') {
      const st = SEW_STEPS[OUT.step - 1]; placeCookFx(); OUT.anim = true;
      $('step-label').textContent = `${OUT.step}. ${st[0]}`;
      const T = CookFX.sew($('cook-fx'), st[1], OUT.res[OUT.step - 1]);
      setTimeout(() => { OUT.fill++; const pc = $('sew-piece'); if (pc) pc.className = 's' + OUT.fill; Snd.pop(); }, T * .6);
      setTimeout(() => {
        OUT.anim = false; renderOut(); sayLater();
        if (OUT.step >= OUT.n) { Snd.level(); outReact('happy', 'hop'); const pc = $('sew-piece'); if (pc) pc.classList.add('done'); setTimeout(finishOut, 2600); }
        else nextQ();
      }, T);
      return;
    }
    if (OUT.type === 'cook') {
      // 방금 푼 단계의 동작을 보여 준 뒤 그릇을 채우고 다음 단계로
      const F = FOODS[OUT.id], st = F.steps[OUT.step - 1]; placeCookFx();
      OUT.anim = true; $('step-label').textContent = `${OUT.step}. ${st[0]}`;
      const T = CookFX.play($('cook-fx'), $('stage-bg'), st[1], st[2], F.color, OUT.res[OUT.step - 1]);
      // 재료가 그릇에 닿는 순간에 내용물이 늘어난다
      if (ADDS.includes(st[1])) setTimeout(() => { OUT.fill++; setFill(); Snd.pop(); }, T * CookFX.land(st[1]));
      setTimeout(() => {
        OUT.anim = false; renderOut(); sayLater();
        if (OUT.step >= OUT.n) { Snd.level(); outReact('happy', 'hop'); OUT.anim = true; $('step-label').textContent = '완성!'; setTimeout(() => speak('out', level() === 'talk' ? fillJo(pick(['우와, {x} 완성! 냄새 좋다~', '{x} 다 됐다! 진짜 맛있겠다.', '짠! {x} 완성이야!']), '{x}', FOODS[OUT.id].name) : line('happy')), 500); setTimeout(finishOut, CookFX.done($('cook-fx'), Scene.food(OUT.id))); }
        else nextQ();
      }, T);
    } else {
      placeOutPet(Math.min(OUT.step, OUT.n - 1)); const p = $('opet'); p.classList.remove('walking'); void p.offsetWidth; if (S.stage >= 3) p.classList.add('walking');
      const P = PLACES[OUT.id];
      if (OUT.step === 3 || OUT.step === OUT.n) {
        const cand = P.finds.filter(k => !S.items.includes(k) && !OUT.finds.includes(k));
        const f = OUT.step === 3 ? cand[0] : cand[0] && Math.random() < .5 ? cand[0] : null;
        if (f) { OUT.finds.push(f); S.items.push(f); setTimeout(() => { speak('out', line('find', { x: ITEMS[f].name })); Snd.combo(); sparks($('ofx'), 12); }, 1200); }
        else if (OUT.step === 3) { S.candy += 3; setTimeout(() => speak('out', level() === 'talk' ? '반짝반짝! 별사탕 세 개를 주웠어!' : line('find')), 1200); }
      } else if (Math.random() < .5) setTimeout(() => speak('out', `<span style="color:#7A6283">(${pick(P.sights)})</span>`, { silent: true }), 1200);
      setTimeout(() => { if (OUT.step >= OUT.n) neighborScene(finishOut); else nextQ(); }, OUT.step === 3 ? 2400 : 1300);
    }
  }
  function finishOut() {
    const good = OUT.res.filter(Boolean).length; let gets = [];
    const o = OUT;
    if (o.type === 'sew') {
      const I = ITEMS[o.id], first = !S.items.includes(o.id); if (first) S.items.push(o.id);
      addFriend(3); S.log.push({ e: 'sew', id: o.id, good });
      $('res-art').innerHTML = Art.wearIcon(o.id, S.kind);
      $('res-title').innerHTML = `${I.name} 완성!`;
      $('res-line').innerHTML = level() === 'talk' ? pick(['우와, 내 옷이야? 빨리 입어 보고 싶어!', '한 땀 한 땀 정성이 느껴져. 고마워!']) : L3('care');
      $('res-gets').innerHTML = [`맞힌 문제 ${good} / ${o.n}`, first ? `${I.name} +1` : '한 벌 더 만들었어요'].map(g => `<span>${g}</span>`).join('');
      $('res-btns').innerHTML = `<button class="btn big primary" id="rb-wear">바로 입혀 주기</button><button class="btn" id="rb-home">옷장에 넣기</button>`;
      overlay('ov-result', true);
      $('rb-wear').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(() => { initWear(); if (S.stage >= 3) S.wear[I.slot] = o.id; save(); renderHome(); react('happy', 'hop'); speak('home', level() === 'talk' ? fillJo(lineFrom(TASTE_LINE[S.kind].acc[(TASTE[S.kind].acc || {})[o.id] || 'like'], 'ta'), '{x}', I.name) : L3('care')); }); };
      $('rb-home').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(); };
      save(); return;
    }
    if (o.type === 'cook') {
      const stars = good >= 5 ? 3 : good >= 3 ? 2 : 1;
      S.foods[o.id] = (S.foods[o.id] || 0) + 1; S.asleep = false; addNeed('full', -5); addNeed('mood', 5); if (dayCap('cook', 2)) addFriend(3);
      S.log.push({ e: 'cook', id: o.id, stars, good }); if (o.id === 'cake') partyProgress('cake');
      $('res-art').innerHTML = Scene.food(o.id);
      $('res-title').innerHTML = `${FOODS[o.id].name} 완성! <span class="stars">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3 - stars)}</span></span>`;
      $('res-line').innerHTML = line('cookDone');
      gets = [`맞힌 문제 ${good} / ${o.n}`, `${FOODS[o.id].name} +1`];
      $('res-btns').innerHTML = S.stage <= 2 ? `<button class="btn big primary" id="rb-home">냉장고에 넣기</button><span id="rb-feed" hidden></span>` : `<button class="btn big primary" id="rb-feed">지금 먹여 주기</button><button class="btn" id="rb-home">냉장고에 넣기</button>`;
      if (S.stage <= 2) $('res-line').innerHTML = '간식은 냉장고에 넣어 두었어요. 알을 깨고 나오면 같이 먹어요!';
      $('res-gets').innerHTML = gets.map(g => `<span>${g}</span>`).join('');
      overlay('ov-result', true);
      $('rb-feed').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(() => runAct('feed', o.id)); };
      $('rb-home').onclick = () => { Snd.tap(); overlay('ov-result', false); backHome(); };
    } else {
      const P = PLACES[o.id]; const first = !S.known.place[o.id]; const ts = TASTE[S.kind].place[o.id]; S.known.place[o.id] = ts;
      S.asleep = false; addNeed('energy', -20); addNeed('clean', -15); addNeed('full', -12); addNeed('mood', ts === 'love' ? 25 : 12); if (dayCap('walk', 2)) addFriend(ts === 'love' ? 8 : 5);
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
      if (canGrow()) levelUp(then);
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
    S.stage++; afterLevel = then || null; fixWishes(); save(); Snd.level();
    $('level-art').innerHTML = Art.draw(S.kind, S.stage, 'happy', showAcc());
    const la = $('level-art'); la.classList.remove('grow-in'); void la.offsetWidth; la.classList.add('grow-in');
    $('level-title').textContent = `${S.stage}단계 ${STAGE_NAME[S.kind][S.stage]}`;
    let msg = LV_MSG[S.kind][S.stage]; if (S.stage === 5) msg += '<br><small>이제 친구가 이야기를 들려줄 수 있어요.</small>'; if (S.stage >= MAX_STAGE) msg += '<br><small>가장 높은 단계까지 다 자랐어요! 정말 잘했어요.</small>';
    $('level-line').innerHTML = msg; overlay('ov-level', true); S.log.push({ e: 'grow', stage: S.stage });
  }
  // ---------- 성장 기록: 1~10단계, 아직 못 간 단계는 실루엣 ----------
  function openGrow() {
    const cur = S.stage, nx = cur + 1, max = cur >= MAX_STAGE;
    $('gr-title').textContent = `${NM()}의 성장 기록`;
    $('gr-sub').innerHTML = max ? '가장 높은 10단계까지 다 자랐어요!' : `지금은 <b>${cur}단계 ${STAGE_NAME[S.kind][cur]}</b>예요. 문제를 맞힐수록 자라요!`;
    const cd = $('gr-conds'); cd.style.display = max ? 'none' : '';
    if (!max) cd.innerHTML = `<h4>${nx}단계가 되려면</h4>` + growChecks(nx).map(c => `<div class="grcond ${c.ok ? 'ok' : ''}"><span class="ck">${c.ok ? '✓' : ''}</span><span>${c.t}</span>${c.now && !c.ok ? `<small>${c.now}</small>` : ''}</div>`).join('');
    $('gr-fill').style.width = max ? '100%' : Math.max(4, (S.xp - STAGE_XP[cur]) / (STAGE_XP[nx] - STAGE_XP[cur]) * 100) + '%';
    let h = '';
    for (let st = 1; st <= MAX_STAGE; st++) {
      const got = st <= cur, now = st === cur, next = st === nx;
      const look = st >= 3 ? { wear: {}, tint: 'base' } : null;
      h += `<div class="grc ${got ? 'got' : 'lock'} ${now ? 'now' : ''} ${next ? 'next' : ''}">${now ? '<span class="grnow">지금</span>' : ''}
        <span class="grart">${got ? Art.draw(S.kind, st, 'happy', look) : '<span class="grq">?</span>'}</span>
        <b>${st}단계</b><small>${got || next ? STAGE_NAME[S.kind][st] : '???'}</small></div>`;
    }
    $('gr-grid').innerHTML = h; overlay('ov-grow', true);
    $('ov-grow').querySelector('.sheet').scrollTop = 0;
  }
  $('btn-grow').onclick = () => { Snd.tap(); poked(); openGrow(); };
  $('btn-level').onclick = () => {
    Snd.tap(); overlay('ov-level', false); renderHome(); react('happy', 'hop');
    if (canGrow()) { setTimeout(() => levelUp(afterLevel), 400); return; }
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
      sec('좋아하는 옷과 장식', 'acc', Object.keys(ITEMS).filter(k => ITEMS[k].kind === 'acc'), id => ITEMS[id].name, id => Art.wearIcon(id, S.kind)) +
      `<div class="book-sec"><h4>산책길 이웃</h4><div class="book-items">${Object.keys(NEIGH).map(k => { const N = NEIGH[k], n = (S.nb || {})[N.id] || 0; return `<span class="bi ${n ? '' : 'unk'}"><span class="bic">${NB_ART[N.id]}</span>${n ? N.name : '???'}${n ? `<em class="love">${'♥'.repeat(Math.min(5, n))}</em>` : `<em>${PLACES[k].name}</em>`}</span>`; }).join('')}</div></div>` +
      `<div class="book-sec"><h4>그림책</h4><div class="book-items">${Object.keys(BOOKS).map(id => { const has = ownBooks().includes(id), n = (S.read || {})[id] || 0; return `<span class="bi ${has ? '' : 'unk'}">${has ? BOOKS[id].title : '???'}${n ? `<em class="like">${n}번 읽음</em>` : ''}</span>`; }).join('')}</div></div>` +
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
    const ids = Object.keys(ITEMS).filter(k => tab === 'shop' ? !S.items.includes(k) && !ITEMS[k].gift : ITEMS[k].kind === tab);
    if (tab === 'decor') setTimeout(() => { const g = $('item-grid'); if (g && !g.querySelector('.go-edit')) { const b = document.createElement('button'); b.className = 'btn big primary go-edit'; b.textContent = '방에서 직접 옮기며 꾸미기'; b.onclick = () => { Snd.tap(); overlay('ov-closet', false); enterEdit(); }; g.parentNode.insertBefore(b, g); } }, 0);
    else { const old = document.querySelector('.go-edit'); old && old.remove(); }
    $('closet-sub').innerHTML = tab === 'shop' ? `별사탕으로 주문할 수 있어요 · 가진 별사탕 <b>${S.candy}</b>개` : tab === 'acc' ? (S.stage < 3 ? '알에서 나오면 장식을 할 수 있어요' : '눌러서 친구에게 해 주세요') : '눌러서 방에 놓거나 치워요';
    $('item-grid').innerHTML = ids.length ? ids.map(k => {
      const I = ITEMS[k], own = S.items.includes(k), on = I.kind === 'acc' ? S.acc === k : (initRooms(), !!placedIn(k));
      let btn;
      if (tab === 'shop') btn = `<button class="btn ${S.candy >= I.price ? 'primary' : ''}" data-buy="${k}">별사탕 ${I.price}</button>`;
      else if (!own) btn = `<small style="color:#A893AE;text-align:center">${I.gift ? '생일 선물로<br>받아요' : '산책에서 찾거나<br>주문해요'}</small>`;
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
      initRooms(); const where = placedIn(k);
      if (where) delete S.place[where][k]; else { S.place.main[k] = Scene.clampPos(k, ...(Scene.DEF_POS[k] || (Scene.layerOf(k) === 'wall' ? [500, 250] : [500, 600]))); S.log.push({ e: 'decor', id: k }); }
      syncDecor();
    }
    save(); renderHome(); openCloset();
  }
  function buyItem(k) {
    const I = ITEMS[k];
    if (S.candy < I.price) { toast(`별사탕이 ${I.price - S.candy}개 더 필요해요. 나들이에서 문제를 풀어 모아요!`); return; }
    S.candy -= I.price; S.items.push(k); Snd.combo(); toast(`<b>${I.name}</b>${bat(I.name) ? '이' : '가'} 도착했어요!`); save(); hud(); openCloset(I.kind === 'acc' ? 'acc' : 'decor');
  }
  $('btn-closet').onclick = () => { Snd.tap(); poked(); openWardrobe(); };
  $('btn-shop').onclick = () => { Snd.tap(); poked(); openWardrobe('shop'); };

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
    if (log.some(e => e.e === 'party')) out.push(talk ? '오늘은 내 생일이었어! 케이크도, 풍선도, 고깔모자도… 평생 잊지 못할 거야.' : '생일 파티를 했어요!');
    [...new Set(log.filter(e => e.e === 'help').map(e => e.id))].forEach(id => { const N = Object.values(NEIGH).find(x => x.id === id); out.push(talk ? `${N.name}의 부탁을 들어줬어. 우리 이웃이 생겼어!` : `${N.name}${Prob.jo(N.name, '을').slice(N.name.length)} 도와줬어요.`); });
    [...new Set(log.filter(e => e.e === 'read').map(e => e.id))].forEach(id => out.push(talk ? `같이 「${BOOKS[id].title}」${Prob.hasBatchim(BOOKS[id].title) ? '을' : '를'} 읽었어. ${BOOKS[id].chat[1]}` : `「${BOOKS[id].title}」${Prob.hasBatchim(BOOKS[id].title) ? '을' : '를'} 읽었어요.`));
    [...new Set(log.filter(e => e.e === 'sew').map(e => e.id))].forEach(id => out.push(talk ? `너랑 ${Prob.jo(ITEMS[id].name, '을')} 만들었어. 내 옷이 생겼어!` : `${Prob.jo(ITEMS[id].name, '을')} 만들었어요.`));
    if (log.some(e => e.e === 'tint')) out.push(talk ? '물감 공방에서 새 색 물감을 만들어서 몸 색을 바꿨어!' : '몸 색을 바꿨어요.');
    if (log.some(e => e.e === 'plant')) out.push(talk ? '텃밭에 씨앗을 심었어. 빨리 자랐으면 좋겠다.' : '텃밭에 씨앗을 심었어요.');
    if (log.some(e => e.e === 'water')) out.push(talk ? '텃밭에 물도 줬어. 내일 쑥 자라 있겠지?' : '텃밭에 물을 줬어요.');
    log.filter(e => e.e === 'harvest').forEach(e => out.push(talk ? `${ING_NAME[e.id]}${Prob.jo(ING_NAME[e.id], '을').slice(ING_NAME[e.id].length)} 거뒀어! 우리가 키운 거야.` : `${ING_NAME[e.id]}${Prob.jo(ING_NAME[e.id], '을').slice(ING_NAME[e.id].length)} 거뒀어요.`));
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
  function syncSet() { $('t-music').setAttribute('aria-pressed', S.music !== false); $('t-sound').setAttribute('aria-pressed', !!S.sound); $('t-lowfx').setAttribute('aria-pressed', !!S.lowfx); }
  let resetArm = false;
  $('btn-set').onclick = () => { Snd.tap(); syncSet(); renameOpen(); resetArm = false; $('btn-reset').textContent = '다시 하기'; overlay('ov-set', true); };
  $('btn-set-close').onclick = () => { Snd.tap(); overlay('ov-set', false); };
  $('t-music').onclick = () => { S.music = S.music === false; applyFx(); syncSet(); save(); Snd.tap(); };
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
