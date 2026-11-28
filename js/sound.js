// 소리: Web Audio로 직접 만든 짧은 소리들 (코드로 직접 만듦)
// + sounds/ 폴더의 mp3 몇 개(정답·단계 오름 효과음, 강아지·고양이 울음, 방 배경음악). 출처는 credits.html
// 파일을 못 불러오면 코드로 만든 소리로 대신한다.
// 아이패드는 첫 터치 전에는 소리가 나지 않으므로 Snd.unlock()을 첫 터치에서 부른다.
const Snd = (() => {
  let ctx = null, on = true, master = null, low = false;
  // ---------- mp3 파일 소리 ----------
  const FILES = { correct: 'sounds/correct.mp3', levelup: 'sounds/levelup.mp3', dog1: 'sounds/dog1.mp3', dog2: 'sounds/dog2.mp3',
    cat1: 'sounds/cat1.mp3', cat2: 'sounds/cat2.mp3', cat3: 'sounds/cat3.mp3', bgm: 'sounds/bgm-home.mp3' };
  const buf = {}, loading = {};
  function load(name) {
    if (!ctx || buf[name] || loading[name] || !window.fetch) return;
    loading[name] = true;
    fetch(FILES[name]).then(r => { if (!r.ok) throw 0; return r.arrayBuffer(); })
      .then(a => new Promise((ok, no) => { const pr = ctx.decodeAudioData(a, ok, no); if (pr && pr.catch) pr.catch(no); }))
      .then(b => { buf[name] = b; if (name === 'bgm' && mWant === 'home' && mOn && !mSrc && mPend !== 'home') music('home', true); })
      .catch(() => {});
  }
  function loadAll() { Object.keys(FILES).forEach(n => { if (n !== 'bgm' || !low) load(n); }); }
  // 파일 소리를 틀었으면 true, 아직 없으면 false (그때는 코드 소리로 대신)
  function play(name, v = 1, rate = 1) {
    if (!on || !ctx || !buf[name]) return false;
    try {
      const s = ctx.createBufferSource(), g = ctx.createGain();
      s.buffer = buf[name]; s.playbackRate.value = rate; g.gain.value = v;
      s.connect(g); g.connect(master); s.start(); return true;
    } catch (e) { return false; }
  }
  function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
      loadAll();
      if (mWant && !mTimer && !mSrc && mOn) music(mWant);
    } catch (e) { ctx = null; }
  }
  function tone(f, d, type = 'sine', v = 0.25, t0 = 0, f2 = null) {
    if (!on || !ctx) return;
    try {
      const t = ctx.currentTime + t0;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.05);
    } catch (e) {}
  }
  // 잡음(바람·천 스치는 소리)
  let nbuf = null;
  function noise(d, v, f, t0 = 0, q = 1, swell = false) {
    if (!on || !ctx) return;
    try {
      if (!nbuf) { nbuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate); const a = nbuf.getChannelData(0); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; }
      const t = ctx.currentTime + t0, s = ctx.createBufferSource(), bf = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = nbuf; bf.type = 'bandpass'; bf.frequency.value = f; bf.Q.value = q;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + (swell ? d * .45 : .012)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(bf); bf.connect(g); g.connect(master); s.start(t); s.stop(t + d + .05);
    } catch (e) {}
  }
  // 친구마다 목소리 높이 (구름 낮고 둥글게, 고양이 높게)
  const VOICE = { cloud: [620, 780, .84, 620], bunny: [820, 980, 1, 760], puppy: [700, 880, .92, 680], kitty: [900, 1060, 1.06, 820], dragon: [760, 920, .96, 700] };
  const vc = (k) => VOICE[k] || VOICE.cloud;
  const S = {
    brush() { noise(.08, .07, 3000 + Math.random() * 900, 0, 1.6); },
    squirt() { noise(.35, .06, 900, 0, 1.2, true); tone(420, .25, 'sine', .08, .05, 620); },
    gargle() { for (let i = 0; i < 9; i++) tone(300 + (i % 2) * 90 + Math.random() * 40, .12, 'sine', .12, i * .15, 360); },
    spit() { noise(.22, .1, 1300, 0, .8); tone(500, .12, 'sine', .08, 0, 240); },
    wind() { noise(.42, .07, 620 + Math.random() * 200, 0, .7, true); },
    fluff() { noise(.11, .05, 2400 + Math.random() * 900, 0, .8); },
    boing() { tone(250, .12, 'sine', .2, 0, 520); tone(520, .24, 'sine', .14, .09, 280); },
    boop() { tone(1150, .07, 'sine', .18, 0, 1750); },
    giggle(kind = 'cloud') { const b = vc(kind)[1]; [0, .11, .22, .33, .44].forEach((t, i) => tone(b + (i % 2 ? 90 : 0) - i * 25, .08, 'sine', .12, t, b * 1.18)); },
    flap() { [0, .08, .16, .24].forEach(t => noise(.06, .07, 1700, t, 1.2)); },
    hum(kind = 'cloud') { const k = vc(kind)[2]; [523, 587, 659, 587, 523, 659, 784].forEach((f, i) => tone(f * k, .3, 'triangle', .07, i * .26)); },
    breath() { noise(1.2, .022, 520, 0, .6, true); noise(1.4, .016, 380, 1.5, .6, true); },
    tap() { tone(880, .08, 'sine', .15); },
    piano() { const sc = [523, 587, 659, 784, 880, 1047]; let t = 0; for (let i = 0; i < 7; i++) { tone(sc[Math.floor(Math.random() * sc.length)], .32, 'triangle', .2, t); t += .2 + (i % 3 === 2 ? .12 : 0); } },
    chime() { [1568, 2093, 2637, 2093].forEach((f, i) => tone(f, .5, 'sine', .1, i * .12)); },
    note(f, ok = true) { if (ok) { tone(f, .38, 'triangle', .2); tone(f * 2, .2, 'sine', .05); } else tone(f * .94, .22, 'square', .05); },
    drip() { [0, .25, .5].forEach(t => tone(1300, .12, 'sine', .14, t, 600)); },
    wave() { tone(220, 1.1, 'sine', .12, 0, 140); tone(260, 1.1, 'sine', .08, .7, 150); },
    prick() { tone(1400, .07, 'square', .08); tone(500, .2, 'sine', .15, .08, 300); },
    sneeze() { tone(600, .15, 'triangle', .14, 0, 900); tone(900, .18, 'sawtooth', .07, .3, 300); },
    ok() { if (play('correct', .9)) return; tone(784, .14, 'triangle', .25); tone(988, .14, 'triangle', .25, .09); tone(1319, .28, 'triangle', .22, .18); },
    combo() { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .16, 'triangle', .18, i * .06)); },
    no() { tone(392, .2, 'sine', .2, 0, 330); tone(330, .28, 'sine', .16, .16, 262); },
    pop() { tone(600, .09, 'sine', .25, 0, 1400); },
    munch() { tone(220, .07, 'square', .07); tone(200, .07, 'square', .07, .12); tone(240, .07, 'square', .07, .24); },
    heart() { tone(1175, .1, 'sine', .12); tone(1568, .16, 'sine', .1, .07); },
    level() { if (play('levelup', .9)) return; [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, .3, 'triangle', .2, i * .1)); tone(2093, .7, 'sine', .15, .65); },
    babble(n = 2, kind = 'cloud') {
      if (animal(kind)) return;
      const base = vc(kind)[0];
      for (let i = 0; i < n; i++) { const f = base + Math.random() * 260; tone(f, .09, 'sine', .14, i * .13, f * 1.25); }
    },
    sip() { tone(520, .22, 'sine', .12, 0, 760); },
    ouch() { tone(900, .12, 'triangle', .22, 0, 520); },
    cry(kind = 'cloud') {
      // 으앙~ : 떨리며 내려가는 소리 세 번
      const base = vc(kind)[3];
      [0, .42, .84].forEach((t, i) => { tone(base - i * 40, .38, 'sine', .16, t, base * .62 - i * 40); tone(base * 1.01 - i * 40, .38, 'triangle', .06, t + .02, base * .6); });
    },
    lullaby() { [659, 587, 523, 587, 659, 659, 659, 0, 587, 587, 587, 0, 659, 784, 784].forEach((f, i) => f && tone(f, .38, 'sine', .12, i * .32)); }
  };
  // 강아지·고양이는 가끔 진짜 울음소리(짧게 다듬음)로 말한다. 너무 자주 나면 시끄러우니 4초에 한 번까지
  let lastCry = 0;
  function animal(kind) {
    const set = kind === 'puppy' ? ['dog1', 'dog2'] : kind === 'kitty' ? ['cat1', 'cat2', 'cat3'] : null;
    if (!set || !ctx || Date.now() - lastCry < 4000) return false;
    const name = set[Math.floor(Math.random() * set.length)];
    if (!play(name, .8, .96 + Math.random() * .1)) return false;
    lastCry = Date.now(); return true;
  }
  // ---------- 배경 음악: 방은 mp3 곡(Abstraction, CC0)을 되풀이, 나머지는 코드로 만든 오르골 곡 (방 · 밤 · 산책 · 요리) ----------
  // 마디마다 화음 하나, 8분음표 8칸. 숫자는 MIDI 음 번호, 0은 쉼표
  const SONGS = {
    home: { bpm: 84, chords: [[48, 0], [45, 1], [41, 0], [43, 0]],
      mel: [76, 0, 79, 0, 81, 79, 76, 0, 72, 0, 76, 0, 74, 72, 69, 0, 69, 0, 72, 0, 77, 76, 74, 0, 74, 0, 71, 0, 67, 0, 0, 0] },
    night: { bpm: 66, chords: [[48, 0], [45, 1], [41, 0], [43, 0]],
      mel: [79, 0, 0, 0, 76, 0, 0, 0, 72, 0, 0, 0, 76, 0, 0, 0, 77, 0, 0, 0, 81, 0, 0, 0, 79, 0, 0, 0, 0, 0, 0, 0] },
    walk: { bpm: 104, chords: [[41, 0], [48, 0], [50, 1], [46, 0]],
      mel: [72, 69, 72, 77, 0, 76, 77, 0, 79, 0, 76, 72, 74, 76, 0, 0, 77, 0, 74, 69, 72, 74, 0, 77, 74, 72, 70, 0, 72, 0, 0, 0] },
    cook: { bpm: 112, chords: [[43, 0], [40, 1], [48, 0], [50, 0]],
      mel: [71, 74, 79, 74, 71, 74, 79, 0, 79, 78, 76, 0, 71, 0, 76, 0, 76, 79, 84, 79, 76, 0, 72, 0, 74, 78, 81, 78, 74, 0, 0, 0] }
  };
  const ARP = [0, 7, 12, 16, 12, 7, 0, 7]; // 화음 펼치기 (장3화음 기준, 단3화음은 16→15)
  let mOn = true, mTheme = null, mWant = null, mStep = 0, mNext = 0, mTimer = null, mBus = null, mSrc = null, mPend = null;
  const mf = (n) => 440 * Math.pow(2, (n - 69) / 12);
  function mNote(n, t, d, type, v) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(mf(n), t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(mBus); o.start(t); o.stop(t + d + 0.05);
  }
  function mTick() {
    if (!ctx || !mTheme) return;
    const S = SONGS[mTheme], e = 60 / S.bpm / 2;
    while (mNext < ctx.currentTime + 0.2) {
      const bar = Math.floor(mStep / 8) % 4, k = mStep % 8, [root, minor] = S.chords[bar];
      const iv = ARP[k] === 16 && minor ? 15 : ARP[k];
      mNote(root + 12 + iv, mNext, e * 1.8, 'triangle', mTheme === 'night' ? 0.05 : 0.06);         // 펼친 화음
      if (k === 0) { mNote(root, mNext, e * 7, 'sine', 0.09); mNote(root + 7, mNext, e * 7, 'sine', 0.04); } // 낮은 바탕음
      const m = S.mel[mStep % 32];
      if (m) { mNote(m, mNext, e * 2.6, 'sine', 0.11); mNote(m + 12, mNext, e * 1.2, 'sine', 0.025); } // 오르골 멜로디
      mStep++; mNext += e;
    }
  }
  const useFile = (theme) => theme === 'home' && !low && !!buf.bgm;
  function stopSrc() { if (mSrc) { try { mSrc.stop(); } catch (e) {} mSrc = null; } }
  function music(theme, force) {
    mWant = theme;
    if (!ctx || !mOn) return;
    if (!mBus) { mBus = ctx.createGain(); mBus.gain.value = 0; mBus.connect(master); }
    if (!force && (mPend === theme || (mTheme === theme && (mTimer || mSrc)))) return;
    mPend = theme;
    // 곡이 바뀔 때는 살짝 줄였다가 다시 키운다
    const now = ctx.currentTime;
    mBus.gain.cancelScheduledValues(now); mBus.gain.setValueAtTime(mBus.gain.value, now); mBus.gain.linearRampToValueAtTime(0, now + .4);
    setTimeout(() => {
      if (mPend === theme) mPend = null;
      if (!mOn || mWant !== theme) return;
      stopSrc(); clearInterval(mTimer); mTimer = null;
      mTheme = theme; mStep = 0; mNext = ctx.currentTime + 0.05;
      const t = ctx.currentTime; mBus.gain.cancelScheduledValues(t); mBus.gain.setValueAtTime(0, t);
      if (useFile(theme)) {
        mBus.gain.linearRampToValueAtTime(0.32, t + 1.5);
        try { mSrc = ctx.createBufferSource(); mSrc.buffer = buf.bgm; mSrc.loop = true; mSrc.connect(mBus); mSrc.start(); } catch (e) { mSrc = null; }
        if (mSrc) return;
      }
      mBus.gain.linearRampToValueAtTime(0.55, t + 1.2);
      mTimer = setInterval(mTick, 60);
    }, 420);
  }
  function musicStop() {
    clearInterval(mTimer); mTimer = null; mTheme = null; stopSrc(); mPend = null;
    if (mBus && ctx) { const t = ctx.currentTime; mBus.gain.cancelScheduledValues(t); mBus.gain.setValueAtTime(0, t); }
  }
  function musicSet(v) { mOn = v; if (!v) musicStop(); else if (mWant) music(mWant); }

  // 가볍게 모드: 큰 음악 파일을 쓰지 않고 코드 음악으로
  function setLow(v) { v = !!v; if (v === low) return; low = v; if (!low) loadAll(); if (mWant && mOn && ctx && (mTimer || mSrc)) music(mWant, true); }
  return { unlock, setLow, set(v) { on = v; }, get on() { return on; }, music, musicSet, musicStop, ...S };
})();
