// 소리: 파일 없이 Web Audio로 직접 만든 짧은 소리들 (코드로 직접 만듦)
// 아이패드는 첫 터치 전에는 소리가 나지 않으므로 Snd.unlock()을 첫 터치에서 부른다.
const Snd = (() => {
  let ctx = null, on = true, master = null;
  function unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
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
  const S = {
    tap() { tone(880, .08, 'sine', .15); },
    ok() { tone(784, .14, 'triangle', .25); tone(988, .14, 'triangle', .25, .09); tone(1319, .28, 'triangle', .22, .18); },
    combo() { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, .16, 'triangle', .18, i * .06)); },
    no() { tone(392, .2, 'sine', .2, 0, 330); tone(330, .28, 'sine', .16, .16, 262); },
    pop() { tone(600, .09, 'sine', .25, 0, 1400); },
    munch() { tone(220, .07, 'square', .07); tone(200, .07, 'square', .07, .12); tone(240, .07, 'square', .07, .24); },
    heart() { tone(1175, .1, 'sine', .12); tone(1568, .16, 'sine', .1, .07); },
    level() { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, .3, 'triangle', .2, i * .1)); tone(2093, .7, 'sine', .15, .65); },
    babble(n = 2, kind = 'cloud') {
      const base = kind === 'bunny' ? 820 : 620;
      for (let i = 0; i < n; i++) { const f = base + Math.random() * 260; tone(f, .09, 'sine', .14, i * .13, f * 1.25); }
    },
    lullaby() { [659, 587, 523, 587, 659, 659, 659, 0, 587, 587, 587, 0, 659, 784, 784].forEach((f, i) => f && tone(f, .38, 'sine', .12, i * .32)); }
  };
  return { unlock, set(v) { on = v; }, get on() { return on; }, ...S };
})();
