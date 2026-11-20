// 구름 둥지 · 수학 친구 키우기
// VERSION은 js/version.js에 있음

(() => {
  const $ = (id) => document.getElementById(id);
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  document.querySelectorAll('.ver').forEach(e => (e.textContent = VERSION));

  // ---------- 저장 ----------
  const KEY = 'cloudnest.v1';
  const fresh = () => ({ kind: null, name: null, stage: 1, xp: 0, candy: 0, love: 0, total: 0, correct: 0, best: 0,
    stats: {}, review: [], since: 0, last: 0, day: '', today: 0, sound: true, lowfx: false });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // ---------- 친구 정보 ----------
  const MAX_STAGE = 5; // 시험판은 5단계까지
  const STAGE_XP = [0, 0, 5, 14, 28, 48];
  const STAGE_NAME = {
    cloud: ['', '별빛 알', '톡톡 알', '솜뭉치', '몽글 구름', '새싹 날개'],
    bunny: ['', '딸기 알', '톡톡 알', '솜털 아기', '깡총 토끼', '리본 토끼']
  };
  const NAMES = { cloud: ['몽실', '구름이', '솜이', '포근이', '뭉게'], bunny: ['콩이', '딸기', '보리', '말랑이', '토토'] };
  const LV_MSG = {
    cloud: ['', '', '알에 금이 갔어요! 누군가 빼꼼 내다봐요.', '알에서 나왔어요! 첫마디는 "몽!"', '"좋아!" 처음으로 말을 했어요.', '"나 날개가 생겼어! 다 네 덕분이야."'],
    bunny: ['', '', '알에 금이 가고 발이 쏙 나왔어요!', '알에서 나왔어요! 첫마디는 "콩!"', '"깡총!" 귀가 쭉 자랐어요.', '"리본 예쁘지? 나 이제 말 잘해!"']
  };
  const level = () => (S.stage <= 2 ? 'egg' : S.stage === 3 ? 'babble' : S.stage === 4 ? 'word' : 'talk');

  // ---------- 화면 전환 ----------
  function show(id) { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id)); }
  function overlay(id, on) { $(id).classList.toggle('on', on); }
  function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), 2200); }
  function applyFx() { document.body.classList.toggle('lowfx', !!S.lowfx); Snd.set(!!S.sound); }
  function applyTime() { const h = new Date().getHours(); document.body.classList.toggle('night', h >= 18 || h < 6); }
  applyFx(); applyTime();

  // 첫 터치에서 소리 켜기 (아이패드)
  window.addEventListener('pointerdown', () => Snd.unlock(), { passive: true });
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- 시작 화면 ----------
  $('title-eggs').innerHTML = `<div>${Art.draw('cloud', 1, 'idle')}</div><div>${Art.draw('bunny', 1, 'idle')}</div>`;
  $('btn-start').textContent = S.kind ? '이어하기' : '시작하기';
  $('btn-start').onclick = () => { Snd.unlock(); Snd.tap(); if (S.kind && S.name) startPlay(true); else openChoose(); };

  // ---------- 알 고르기 ----------
  let choice = null;
  function openChoose() {
    $('egg-cloud').innerHTML = Art.draw('cloud', 1, 'idle');
    $('egg-bunny').innerHTML = Art.draw('bunny', 1, 'idle');
    choice = null; $('btn-pick').disabled = true;
    document.querySelectorAll('.egg-card').forEach(c => c.classList.remove('sel'));
    show('scr-choose');
  }
  document.querySelectorAll('.egg-card').forEach(card => {
    card.onclick = () => {
      choice = card.dataset.kind; Snd.babble(2, choice);
      document.querySelectorAll('.egg-card').forEach(c => c.classList.toggle('sel', c === card));
      $('btn-pick').disabled = false;
    };
  });
  $('btn-pick').onclick = () => { if (!choice) return; Snd.tap(); openName(); };

  let nameSel = null;
  function openName() {
    $('name-art').innerHTML = Art.draw(choice, 1, 'idle');
    nameSel = null; $('btn-name').disabled = true;
    $('name-chips').innerHTML = '';
    NAMES[choice].forEach(n => {
      const b = document.createElement('button'); b.className = 'name-chip-btn'; b.textContent = n;
      b.onclick = () => { nameSel = n; Snd.tap(); [...$('name-chips').children].forEach(x => x.classList.toggle('sel', x === b)); $('btn-name').disabled = false; };
      $('name-chips').appendChild(b);
    });
    show('scr-name');
  }
  $('btn-name-back').onclick = () => { Snd.tap(); openChoose(); };
  $('btn-name').onclick = () => {
    if (!nameSel) return;
    Object.assign(S, fresh(), { kind: choice, name: nameSel, sound: S.sound, lowfx: S.lowfx });
    save(); Snd.level(); startPlay(false);
  };

  // ---------- 말하기 ----------
  const lastLine = {};
  function lineFrom(arr, key) {
    if (!arr || !arr.length) return '';
    let t, n = 0; do { t = pick(arr); n++; } while (arr.length > 1 && t === lastLine[key] && n < 6);
    lastLine[key] = t; return t;
  }
  function say(cat, opt = {}) {
    const L = LINES[S.kind]; const lv = level(); const pack = L[lv];
    let arr = pack[cat];
    if (!arr) arr = ['c3', 'c5', 'c10'].includes(cat) ? pack.ok : pack.idle;
    let t = opt.text || lineFrom(arr, lv + cat);
    if (opt.a != null) {
      if (t.includes('{a}')) t = t.replace('{a}', opt.a);
      else t += `<br><small style="font-size:.8em;color:#7A6283">정답은 ${opt.a}</small>`;
    }
    speak(t, lv);
  }
  function speak(html, lv = level()) {
    const b = $('bubble'), tx = $('bubble-txt');
    tx.innerHTML = html;
    b.classList.toggle('act', lv === 'egg' && html.startsWith('('));
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    if (lv === 'babble' || lv === 'word') Snd.babble(lv === 'babble' ? 2 : 3, S.kind);
    else if (lv === 'talk') Snd.babble(1, S.kind);
  }

  // ---------- 캐릭터 ----------
  let moodTimer = null;
  function drawPet(mood = 'idle') { $('pet').innerHTML = Art.draw(S.kind, S.stage, mood); }
  function setMood(mood, anim) {
    drawPet(mood);
    const p = $('pet'); p.classList.remove('hop', 'shake', 'squish');
    if (anim) { void p.offsetWidth; p.classList.add(anim); }
    clearTimeout(moodTimer);
    if (mood !== 'idle') moodTimer = setTimeout(() => { drawPet('idle'); p.classList.remove('hop', 'shake', 'squish'); }, 1700);
  }
  function sparks(n = 10, host = $('fx'), cx = null, cy = null) {
    if (S.lowfx) n = Math.min(n, 3);
    const r = host.getBoundingClientRect();
    const x0 = cx ?? r.width / 2, y0 = cy ?? r.height * .55;
    const cols = ['#FFD36E', '#F7A0C1', '#B9A7F5', '#8FE0C9'];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i'); s.className = 'spark';
      const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 90;
      s.style.left = x0 + 'px'; s.style.top = y0 + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      s.style.setProperty('--c', pick(cols));
      host.appendChild(s); setTimeout(() => s.remove(), 950);
    }
  }
  function heartUp(host = $('fx'), x = null, y = null) {
    const r = host.getBoundingClientRect();
    const h = document.createElement('i'); h.className = 'float-heart ico heart';
    h.style.left = (x ?? r.width / 2 + R(-50, 30)) + 'px'; h.style.top = (y ?? r.height * .45) + 'px';
    host.appendChild(h); setTimeout(() => h.remove(), 1250);
  }
  function trail() {
    const t = $('trail'); const n = Math.min(S.combo || 0, 8);
    if (t.children.length > n) t.innerHTML = '';
    while (t.children.length < n) { const s = document.createElement('span'); s.className = S.kind === 'bunny' ? 'paw' : 'bow'; t.appendChild(s); }
  }

  // ---------- HUD ----------
  function hud() {
    $('hud-name').textContent = S.name;
    $('hud-stage').textContent = `${S.stage}단계 ${STAGE_NAME[S.kind][S.stage]}`;
    $('hud-candy').textContent = S.candy; $('hud-love').textContent = S.love;
    $('hud-combo').textContent = S.combo || 0;
    if (S.stage >= MAX_STAGE) { $('grow-fill').style.width = '100%'; $('grow-txt').textContent = '시험판 최고 단계'; }
    else {
      const a = STAGE_XP[S.stage], b = STAGE_XP[S.stage + 1];
      $('grow-fill').style.width = Math.max(4, (S.xp - a) / (b - a) * 100) + '%';
      $('grow-txt').textContent = `${S.xp - a} / ${b - a}`;
    }
    const left = Math.max(0, 8 - S.since);
    $('act-left').textContent = left === 0 ? '같이 하기 시간!' : `같이 하기까지 ${left}문제`;
    $('today').textContent = `오늘 맞힌 문제 ${S.today}`;
  }

  // ---------- 문제 ----------
  let cur = null, lock = false, lastUnit = null;
  function chooseUnit() {
    const due = S.review.findIndex(r => r.due <= S.total);
    if (due >= 0 && Math.random() < .6) { const r = S.review.splice(due, 1)[0]; return [r.unit, r.type]; }
    const keys = Object.keys(Prob.UNITS).filter(k => k !== lastUnit);
    const w = keys.map(k => { const st = S.stats[k] || { c: 0, w: 0 }; return 1 + 2 * (st.w / (st.c + st.w + 2)); });
    let x = Math.random() * w.reduce((a, b) => a + b, 0);
    for (let i = 0; i < keys.length; i++) { x -= w[i]; if (x <= 0) return [keys[i], null]; }
    return [keys[0], null];
  }
  function nextQ() {
    const [u, t] = chooseUnit(); lastUnit = u;
    cur = Prob.make(u, t);
    const U = Prob.UNITS[u];
    const tag = $('qtag'); tag.textContent = `${U.sem}학기 · ${U.name}`; tag.classList.toggle('s1', U.sem === 1);
    $('qfig').innerHTML = cur.fig; $('qtext').innerHTML = cur.q;
    $('qtext').classList.toggle('long', cur.q.replace(/<[^>]+>/g, '').length > 34 || !!cur.fig);
    const box = $('choices'); box.innerHTML = '';
    box.className = 'choices' + (cur.choices.length === 3 ? ' c3' : '');
    cur.choices.forEach(c => {
      const b = document.createElement('button'); b.className = 'ch' + (cur.txt ? ' txt' : ''); b.innerHTML = c;
      b.onclick = () => answer(b, c); box.appendChild(b);
    });
    const qc = $('qcard'); qc.classList.remove('in'); void qc.offsetWidth; qc.classList.add('in');
    lock = false;
    if (level() === 'talk' && Math.random() < .2) setTimeout(() => { if (!lock) say('x', { text: lineFrom(LINES[S.kind].talk.unit[u], 'u' + u) }); }, 500);
  }
  function answer(btn, c) {
    if (lock) return; lock = true; poked();
    const ok = c === cur.ans;
    const st = S.stats[cur.unit] || (S.stats[cur.unit] = { c: 0, w: 0 });
    S.total++; S.since++;
    const allBtns = [...$('choices').children];
    if (ok) {
      btn.classList.add('ok'); allBtns.forEach(b => b !== btn && b.classList.add('dim'));
      st.c++; S.correct++; S.today++; S.combo = (S.combo || 0) + 1; S.best = Math.max(S.best, S.combo);
      const bonus = S.combo % 5 === 0 ? 1 : 0;
      S.candy += 1 + bonus; S.xp += 1 + bonus;
      if (S.combo === 3 || S.combo === 5 || S.combo === 10 || (S.combo > 10 && S.combo % 5 === 0)) {
        Snd.combo(); say(S.combo === 3 ? 'c3' : S.combo === 5 ? 'c5' : 'c10');
        const cw = $('hud-combo-wrap'); cw.classList.remove('hot'); void cw.offsetWidth; cw.classList.add('hot');
      } else { Snd.ok(); say('ok'); }
      setMood('happy', 'hop'); sparks(S.combo >= 5 ? 16 : 10);
    } else {
      btn.classList.add('no');
      allBtns.forEach(b => { if (b.innerHTML === cur.ans) b.classList.add('ok'); else if (b !== btn) b.classList.add('dim'); });
      st.w++; S.combo = 0;
      if (!S.review.some(r => r.unit === cur.unit && r.type === cur.type)) S.review.push({ unit: cur.unit, type: cur.type, due: S.total + R(3, 6) });
      if (S.review.length > 12) S.review.shift();
      Snd.no(); say('no', { a: cur.ans }); setMood('sad', 'shake');
    }
    trail(); hud(); save();
    setTimeout(after, ok ? 1250 : 2300);
  }
  function after() {
    if (S.stage < MAX_STAGE && S.xp >= STAGE_XP[S.stage + 1]) { levelUp(); return; }
    if (S.since >= 8) { openPick(); return; }
    nextQ();
  }

  // ---------- 자랐어요 ----------
  function levelUp() {
    S.stage++; save(); Snd.level();
    $('level-art').innerHTML = Art.draw(S.kind, S.stage, 'happy');
    const la = $('level-art'); la.classList.remove('grow-in'); void la.offsetWidth; la.classList.add('grow-in');
    $('level-title').textContent = `${S.stage}단계 ${STAGE_NAME[S.kind][S.stage]}`;
    let msg = LV_MSG[S.kind][S.stage] || pick(LINES[S.kind].talk.level);
    if (S.stage >= MAX_STAGE) msg += '<br><small>시험판은 5단계까지예요. 계속 문제를 풀며 별사탕과 하트를 모아 보세요!</small>';
    $('level-line').innerHTML = msg;
    overlay('ov-level', true);
  }
  $('btn-level').onclick = () => {
    Snd.tap(); overlay('ov-level', false); drawPet('idle'); hud();
    setTimeout(() => say('ok'), 200);
    if (S.since >= 8) openPick(); else nextQ();
  };

  // ---------- 같이 하기 ----------
  const ACTS = {
    pet: { name: '쓰다듬기', egg: '알 데우기', icon: 'hand', small: '살살 문질러 줘요', min: 1 },
    bubble: { name: '비눗방울 놀이', icon: 'bubble', small: '방울을 톡톡!', min: 1 },
    snack: { name: '간식 주기', icon: 'candy', small: '끌어서 입에 쏙', min: 3 },
    nap: { name: '낮잠 재우기', icon: 'moon', small: '이불을 덮어 줘요', min: 3 }
  };
  function openPick() {
    const ids = Object.keys(ACTS).filter(k => S.stage >= ACTS[k].min);
    const two = ids.sort(() => Math.random() - .5).slice(0, 2);
    const box = $('act-cards'); box.innerHTML = '';
    two.forEach(id => {
      const a = ACTS[id]; const b = document.createElement('button'); b.className = 'act-card';
      const nm = S.stage <= 2 && a.egg ? a.egg : a.name;
      const ic = id === 'snack' && S.kind === 'bunny' ? 'berry' : a.icon;
      b.innerHTML = `<div class="ai">${Art.icon(ic)}</div><div><b>${nm}</b><br><small>${a.small}</small></div>`;
      b.onclick = () => { Snd.tap(); overlay('ov-pick', false); runAct(id); };
      box.appendChild(b);
    });
    const c = S.name.charCodeAt(S.name.length - 1); const bat = c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0;
    $('pick-sub').textContent = `${S.name}${bat ? '과' : '와'} 무엇을 같이 할까요?`;
    overlay('ov-pick', true);
  }
  $('btn-act-skip').onclick = () => { Snd.tap(); S.since = 0; save(); overlay('ov-pick', false); hud(); nextQ(); };

  let actClean = [];
  function actSay(t) { const b = $('act-bubble'); b.querySelector('span').innerHTML = t; b.style.display = 'flex'; }
  function actPet(mood) { $('act-pet').innerHTML = Art.draw(S.kind, S.stage, mood); }
  function runAct(id) {
    const room = $('act-room'), field = $('act-field'), bottom = $('act-bottom');
    room.classList.remove('dark'); bottom.innerHTML = ''; $('act-bubble').style.display = 'none';
    field.querySelectorAll('.bub,.zz,.spark,.float-heart').forEach(e => e.remove());
    const meter = $('act-meter'); meter.style.display = 'none'; meter.firstElementChild.style.width = '0';
    actPet('idle');
    const a = ACTS[id]; $('act-title').textContent = S.stage <= 2 && a.egg ? a.egg : a.name;
    overlay('ov-act', true);
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      actClean.forEach(f => f()); actClean = [];
      room.classList.remove('dark');
      actPet('happy'); Snd.heart(); sparks(14, field);
      const lv = level();
      const t = lv === 'talk' ? lineFrom(LINES[S.kind].talk.act[id], 'act' + id) : lineFrom(LINES[S.kind][lv].ok, 'actok');
      actSay(t); if (lv !== 'egg') Snd.babble(2, S.kind);
      S.love += 3; S.since = 0; save(); hud();
      setTimeout(() => { overlay('ov-act', false); drawPet('happy'); setTimeout(() => drawPet('idle'), 1200); nextQ(); }, 2000);
    };
    const tm = setTimeout(finish, 30000); actClean.push(() => clearTimeout(tm));
    ({ snack: actSnack, pet: actRub, bubble: actBubble, nap: actNap })[id](field, bottom, finish);
  }
  function actSnack(field, bottom, finish) {
    $('act-hint').textContent = '간식을 끌어서 입에 쏙 넣어 줘요';
    let eaten = 0;
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div'); s.className = 'snack';
      s.innerHTML = Art.icon(S.kind === 'bunny' ? 'berry' : 'candy');
      let sx = 0, sy = 0, on = false;
      s.addEventListener('pointerdown', (e) => { on = true; sx = e.clientX; sy = e.clientY; s.classList.add('drag'); s.setPointerCapture(e.pointerId); e.preventDefault(); });
      s.addEventListener('pointermove', (e) => { if (!on) return; s.style.transform = `translate(${e.clientX - sx}px,${e.clientY - sy}px) scale(1.1)`; });
      const up = () => {
        if (!on) return; on = false; s.classList.remove('drag');
        const a = s.getBoundingClientRect(), p = $('act-pet').getBoundingClientRect();
        const dx = (a.left + a.width / 2) - (p.left + p.width / 2), dy = (a.top + a.height / 2) - (p.top + p.height * .5);
        if (Math.hypot(dx, dy) < p.width * .42) {
          s.classList.add('gone'); Snd.munch(); eaten++; actPet('happy');
          const fr = field.getBoundingClientRect(); heartUp(field, p.left - fr.left + p.width / 2, p.top - fr.top + p.height * .3);
          if (S.candy > 0) S.candy--;
          setTimeout(() => actPet('idle'), 600);
          if (eaten >= 3) setTimeout(finish, 500);
        } else { s.style.transform = ''; }
      };
      s.addEventListener('pointerup', up); s.addEventListener('pointercancel', up);
      bottom.appendChild(s);
    }
  }
  function actRub(field, bottom, finish) {
    $('act-hint').textContent = '손가락으로 살살 문질러 줘요';
    const meter = $('act-meter'); meter.style.display = 'block';
    const pet = $('act-pet'); let on = false, lx = 0, ly = 0, dist = 0, nextHeart = 200;
    const down = (e) => { on = true; lx = e.clientX; ly = e.clientY; e.preventDefault(); };
    const move = (e) => {
      if (!on) return;
      dist += Math.hypot(e.clientX - lx, e.clientY - ly); lx = e.clientX; ly = e.clientY;
      meter.firstElementChild.style.width = Math.min(100, dist / 16) + '%';
      if (dist > nextHeart) { nextHeart += 200; const fr = field.getBoundingClientRect(); heartUp(field, e.clientX - fr.left - 15, e.clientY - fr.top - 30); Snd.heart(); actPet('happy'); }
      if (dist >= 1600) { on = false; finish(); }
    };
    const up = () => { on = false; actPet('idle'); };
    pet.addEventListener('pointerdown', down); field.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    actClean.push(() => { pet.removeEventListener('pointerdown', down); field.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); });
  }
  function actBubble(field, bottom, finish) {
    let n = 0; const goal = 8;
    $('act-hint').textContent = `방울을 톡톡 터뜨려요 0 / ${goal}`;
    const spawn = () => {
      const b = document.createElement('div'); b.className = 'bub';
      const s = R(64, 110); b.style.setProperty('--s', s + 'px'); b.style.setProperty('--t', R(5, 8) + 's');
      b.style.left = R(4, 86) + '%'; b.style.top = '100%';
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); if (b.classList.contains('popped')) return;
        b.classList.add('popped'); Snd.pop(); n++; $('act-hint').textContent = `방울을 톡톡 터뜨려요 ${n} / ${goal}`;
        actPet('happy'); setTimeout(() => actPet('idle'), 400);
        setTimeout(() => b.remove(), 260); if (n >= goal) finish();
      });
      field.appendChild(b); setTimeout(() => b.remove(), 8500);
    };
    spawn(); const iv = setInterval(spawn, 650);
    actClean.push(() => clearInterval(iv));
  }
  function actNap(field, bottom, finish) {
    $('act-hint').textContent = '이불을 덮어 재워 줘요';
    const b = document.createElement('button'); b.className = 'btn big'; b.innerHTML = `<span style="display:inline-flex;width:34px;height:34px;vertical-align:middle;margin-right:8px">${Art.icon('moon')}</span>이불 덮어 주기`;
    b.onclick = () => {
      b.remove(); $('act-room').classList.add('dark'); actPet('sleep'); Snd.lullaby();
      $('act-hint').textContent = '쉿, 새근새근…';
      const p = $('act-pet').getBoundingClientRect(), fr = field.getBoundingClientRect();
      let k = 0; const iv = setInterval(() => {
        const z = document.createElement('div'); z.className = 'zz'; z.textContent = 'z';
        z.style.left = (p.left - fr.left + p.width * .62) + 'px'; z.style.top = (p.top - fr.top + p.height * .2) + 'px';
        field.appendChild(z); setTimeout(() => z.remove(), 2500); if (++k > 6) clearInterval(iv);
      }, 650);
      actClean.push(() => clearInterval(iv));
      const t = setTimeout(finish, 5000); actClean.push(() => clearTimeout(t));
    };
    bottom.appendChild(b);
  }

  // ---------- 가만히 있을 때 · 쓰다듬기 ----------
  let idleT = null;
  function poked() { clearTimeout(idleT); idleT = setTimeout(idleTalk, 15000); }
  function idleTalk() {
    if ($('scr-play').classList.contains('on') && !document.querySelector('.overlay.on') && !lock) say('idle');
    idleT = setTimeout(idleTalk, 24000);
  }
  let lastPoke = 0;
  $('pet').onclick = () => {
    poked(); const now = Date.now(); if (now - lastPoke < 900) return; lastPoke = now;
    setMood('happy', 'squish'); say('poke'); heartUp();
    S.love++; hud(); save();
  };

  // ---------- 놀이 시작 ----------
  function startPlay(returning) {
    applyTime();
    const d = new Date(), today = d.toISOString().slice(0, 10);
    if (S.day !== today) { S.day = today; S.today = 0; }
    show('scr-play'); drawPet('idle'); trail(); hud();
    nextQ(); poked();
    const away = S.last ? (Date.now() - S.last) / 86400000 : 0;
    S.last = Date.now(); save();
    setTimeout(() => {
      const lv = level();
      if (!returning) { speak(S.kind === 'bunny' ? '(딸기 알이 둥지에 쏙 들어갔어요. 문제를 맞히면 알이 자라요!)' : '(별빛 알이 둥지에 쏙 들어갔어요. 문제를 맞히면 알이 자라요!)', 'egg'); return; }
      if (lv !== 'talk') { say('idle'); return; }
      if (away >= 2) { say('x', { text: lineFrom(LINES[S.kind].talk.back, 'back') }); return; }
      const m = d.getMonth() + 1, h = d.getHours();
      if (Math.random() < .35) {
        const sea = m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'fall' : 'winter';
        const arr = LINES[S.kind].talk.season[m === 11 ? 'winter' : sea];
        say('x', { text: pick(arr) }); return;
      }
      const g = LINES[S.kind].talk.greet; say('x', { text: pick(h < 12 ? g.morning : h < 17 ? g.day : g.evening) });
    }, 400);
  }
  window.addEventListener('pagehide', () => { S.last = Date.now(); save(); });

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
    overlay('ov-set', false); toast('처음부터 다시 시작해요'); openChoose();
  };
})();
