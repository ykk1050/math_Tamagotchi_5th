// 5학년 1·2학기 수학 문제 생성기 (매번 새로운 숫자로 만든다)
// 문제 형식: { unit, type, q(HTML), fig(HTML|''), ans(HTML), choices:[HTML...], txt(글자 보기 여부) }
const Prob = (() => {
  const R = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const lcm = (a, b) => a / gcd(a, b) * b;

  // ---------- 분수 ----------
  const F = (n, d) => { const g = gcd(n, d); return { n: n / g, d: d / g }; };
  const fr = (n, d) => `<span class="fr"><span>${n}</span><span>${d}</span></span>`;
  // 기약분수, 가분수는 대분수로
  function fh(f, mixed = true) {
    const { n, d } = F(f.n, f.d);
    if (d === 1) return `${n}`;
    if (mixed && n > d) return `<span class="mx">${Math.floor(n / d)}${fr(n % d, d)}</span>`;
    return fr(n, d);
  }
  const fraw = (n, d) => fr(n, d); // 약분하지 않은 그대로
  const feq = (a, b) => a.n * b.d === b.n * a.d;
  const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fmul = (a, b) => F(a.n * b.n, a.d * b.d);
  const mixedF = (w, n, d) => F(w * d + n, d);
  const mh = (w, n, d) => `<span class="mx">${w}${fr(n, d)}</span>`;
  const properRand = (dmin = 2, dmax = 9) => { const d = R(dmin, dmax); let n = R(1, d - 1); while (gcd(n, d) !== 1) n = R(1, d - 1); return { n, d }; };

  // 분수 오답: 정답과 값이 같은 것은 빼고, 모자라면 주변 값으로 채운다
  function fracChoices(ans, cands, mixed = true) {
    const out = [ans];
    const add = (f) => {
      if (!f || f.n <= 0 || f.d <= 0) return;
      if (out.some(x => feq(x, f))) return;
      out.push(F(f.n, f.d));
    };
    cands.forEach(add);
    let k = 1;
    while (out.length < 4 && k < 40) {
      const d = ans.d;
      add({ n: ans.n + k, d }); if (out.length >= 4) break;
      add({ n: ans.n - k, d }); if (out.length >= 4) break;
      add({ n: ans.n, d: d + k });
      k++;
    }
    return { ans: fh(ans, mixed), choices: out.slice(0, 4).map(f => fh(f, mixed)) };
  }
  // 수 오답
  function numChoices(ans, cands, unit = '', fmt = (x) => x.toLocaleString('ko-KR')) {
    const out = [ans];
    cands.forEach(c => { if (Number.isFinite(c) && c >= 0 && !out.includes(c)) out.push(c); });
    let k = 1;
    while (out.length < 4) { const c = ans + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (ans >= 100 ? 10 : 1); if (c >= 0 && !out.includes(c)) out.push(c); k++; }
    const f = (x) => fmt(x) + unit;
    return { ans: f(ans), choices: out.slice(0, 4).map(f) };
  }
  const op = (s) => `<span class="op">${s}</span>`;

  // 조사 고르기: 앞말을 소리 내어 읽었을 때 받침이 있는지 본다.
  // 숫자(20 → 이십, 4,002 → 사천이), 소수(0.75 → 영 점 칠오), 분수(3/4 → 사 분의 삼), 단위(cm → 센티미터)까지 처리
  function hasBatchim(word) {
    let t = String(word).replace(/<span class="fr"><span>([^<]*)<\/span><span>[^<]*<\/span><\/span>/g, '$1').replace(/<[^>]+>/g, '').trim();
    const c = t.charCodeAt(t.length - 1);
    if (c >= 0xAC00 && c <= 0xD7A3) return (c - 0xAC00) % 28 > 0;
    const unit = { 'cm': false, 'cm²': false, 'm': false, 'm²': false, 'L': false, 'kg': true, '°': false };
    for (const u of ['cm²', 'm²', 'cm', 'kg', 'm', 'L', '°']) if (t.endsWith(u)) return unit[u];
    const m = t.match(/([\d,]+(?:\.\d+)?)$/);
    if (!m) return false;
    const num = m[1].replace(/,/g, '');
    const BAT = { 0: true, 1: true, 2: false, 3: true, 4: false, 5: false, 6: true, 7: true, 8: true, 9: false };
    if (num.includes('.')) return BAT[num[num.length - 1]];
    if (num === '0') return true;
    if (/0$/.test(num)) return true; // 십·백·천·만은 모두 받침이 있다
    return BAT[num[num.length - 1]];
  }
  const PAIR = { '을': ['을', '를'], '를': ['을', '를'], '이': ['이', '가'], '가': ['이', '가'], '은': ['은', '는'], '는': ['은', '는'], '과': ['과', '와'], '와': ['과', '와'],
    '이었': ['이었', '였'], '였': ['이었', '였'], '이야': ['이야', '야'], '야': ['이야', '야'], '이래': ['이래', '래'], '래': ['이래', '래'], '이다': ['이다', '다'], '다': ['이다', '다'], '이에요': ['이에요', '예요'], '예요': ['이에요', '예요'] };
  const jo = (word, p) => word + (hasBatchim(word) ? PAIR[p][0] : PAIR[p][1]);

  // ---------- 소수 (정수 v와 소수 자리 s로 표현: 1.25 = {v:125,s:2}) ----------
  const D = (v, s) => ({ v, s });
  const dval = (x) => x.v / Math.pow(10, x.s);
  function dstr(x) {
    let { v, s } = x;
    while (s > 0 && v % 10 === 0) { v /= 10; s--; }
    const neg = v < 0; let t = String(Math.abs(v));
    if (s > 0) { t = t.padStart(s + 1, '0'); t = t.slice(0, -s) + '.' + t.slice(-s); }
    return (neg ? '-' : '') + t;
  }
  const dmul = (a, b) => D(a.v * b.v, a.s + b.s);
  const dshift = (x, k) => (k >= 0 ? D(x.v * Math.pow(10, k), x.s) : D(x.v, x.s - k)); // ×10^k
  function decChoices(ans, cands, unit = '') {
    const out = [dstr(ans)];
    cands.forEach(c => { const t = dstr(c); if (!out.includes(t) && dval(c) > 0) out.push(t); });
    const step = D(1, Math.max(ans.s, 1));
    let k = 1;
    while (out.length < 4) { const t = dstr(D(ans.v * Math.pow(10, step.s - ans.s) + k, step.s)); if (!out.includes(t)) out.push(t); k++; }
    return { ans: out[0] + unit, choices: out.slice(0, 4).map(x => x + unit) };
  }

  // ---------- 도형 그림 ----------
  // 도형 그림: 주어진 길이의 비율 그대로 그린다 (300×150 안에 맞춤)
  function shapeSVG(kind, a, b, h) {
    const lab = (x, y, t, anchor = 'middle') => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="${anchor}" font-size="15" fill="#7A6283" font-family="Quicksand,Jua,sans-serif" font-weight="700">${t}</text>`;
    const st = 'fill="#FCE3EE" stroke="#E38DB0" stroke-width="3" stroke-linejoin="round"';
    const dash = 'stroke="#A996F0" stroke-width="2" stroke-dasharray="5 4"';
    const right = (x, y) => `<path d="M${x} ${y - 10} h10 v10" fill="none" stroke="#A996F0" stroke-width="1.6"/>`;
    // 도형의 실제 너비·높이(cm)를 받아 비율을 지키며 맞추는 배율
    const fit = (w, hh) => Math.min(210 / w, 100 / hh);
    let body = '';
    if (kind === 'rect') {
      const k = fit(a, b), W = a * k, H = b * k, x0 = 150 - W / 2, y0 = 70 - H / 2;
      body = `<rect x="${x0}" y="${y0}" width="${W}" height="${H}" rx="3" ${st}/>${lab(150, y0 + H + 20, a + ' cm')}${lab(x0 + W + 8, 75, b + ' cm', 'start')}`;
    }
    if (kind === 'para') {
      const off = Math.min(a * .35, h * .7), k = fit(a + off, h), W = a * k, O = off * k, H = h * k, x0 = 150 - (W + O) / 2, y0 = 70 - H / 2;
      body = `<path d="M${x0} ${y0 + H} L${x0 + W} ${y0 + H} L${x0 + W + O} ${y0} L${x0 + O} ${y0} Z" ${st}/><line x1="${x0 + O}" y1="${y0}" x2="${x0 + O}" y2="${y0 + H}" ${dash}/>${right(x0 + O, y0 + H)}${lab(x0 + W / 2, y0 + H + 20, a + ' cm')}${lab(x0 + O + 6, y0 + H / 2 + 5, h + ' cm', 'start')}`;
    }
    if (kind === 'tri') {
      const k = fit(a, h), W = a * k, H = h * k, x0 = 150 - W / 2, y0 = 70 - H / 2, ax = x0 + W * .62;
      body = `<path d="M${x0} ${y0 + H} L${x0 + W} ${y0 + H} L${ax} ${y0} Z" ${st}/><line x1="${ax}" y1="${y0}" x2="${ax}" y2="${y0 + H}" ${dash}/>${right(ax, y0 + H)}${lab(150, y0 + H + 20, a + ' cm')}${lab(ax + 6, y0 + H / 2 + 5, h + ' cm', 'start')}`;
    }
    if (kind === 'trap') {
      const k = fit(b, h), B = b * k, A = a * k, H = h * k, x0 = 150 - B / 2, y0 = 70 - H / 2, tx = x0 + (B - A) * .35;
      body = `<path d="M${x0} ${y0 + H} L${x0 + B} ${y0 + H} L${tx + A} ${y0} L${tx} ${y0} Z" ${st}/><line x1="${tx}" y1="${y0}" x2="${tx}" y2="${y0 + H}" ${dash}/>${right(tx, y0 + H)}${lab(tx + A / 2, y0 - 7, a + ' cm')}${lab(150, y0 + H + 20, b + ' cm')}${lab(tx + 6, y0 + H / 2 + 5, h + ' cm', 'start')}`;
    }
    if (kind === 'rhom') {
      const k = fit(a, b), W = a * k, H = b * k, cx = 150, cy = 72;
      body = `<path d="M${cx} ${cy - H / 2} L${cx + W / 2} ${cy} L${cx} ${cy + H / 2} L${cx - W / 2} ${cy} Z" ${st}/><line x1="${cx - W / 2}" y1="${cy}" x2="${cx + W / 2}" y2="${cy}" ${dash}/><line x1="${cx}" y1="${cy - H / 2}" x2="${cx}" y2="${cy + H / 2}" ${dash}/>${lab(cx + W / 4, cy - 6, a + ' cm')}${lab(cx + 6, cy + H / 4 + 6, b + ' cm', 'start')}`;
    }
    return `<svg viewBox="0 -8 300 158" aria-hidden="true">${body}</svg>`;
  }

  // =====================================================================
  // 단원별 생성기
  // =====================================================================
  const G = {};

  // 5-1 1단원 자연수의 혼합 계산
  G.u11 = [
    () => { const a = R(10, 60), b = R(2, 9), c = R(2, 9); const ans = a + b * c;
      return { q: `${a} + ${b} ${op('×')} ${c} = ?`, ...numChoices(ans, [(a + b) * c, ans + c, ans - b]) }; },
    () => { const a = R(3, 15), b = R(2, 12), c = R(2, 6); const ans = (a + b) * c;
      return { q: `(${a} + ${b}) ${op('×')} ${c} = ?`, ...numChoices(ans, [a + b * c, ans + c, ans - c]) }; },
    () => { const c = R(2, 9), k = R(2, 9), b = c * k, a = R(k + 5, 60); const ans = a - k;
      const wrong = (a - b) > 0 && (a - b) % c === 0 ? (a - b) / c : ans + 2;
      return { q: `${a} − ${b} ${op('÷')} ${c} = ?`, ...numChoices(ans, [wrong, ans + k, ans - 1]) }; },
    () => { const a = R(3, 9), b = R(3, 9), d = R(2, 6), k = R(2, Math.min(9, a * b - 1)), c = d * k; const ans = a * b - k;
      return { q: `${a} ${op('×')} ${b} − ${c} ${op('÷')} ${d} = ?`, ...numChoices(ans, [a * b - c, ans + 2 * k, ans + 1]) }; },
    () => { const d = R(2, 6), k = R(2, 8), s = d * k, b = R(1, s - 1), c = s - b, a = R(k + 3, 40); const ans = a - k;
      return { q: `${a} − (${b} + ${c}) ${op('÷')} ${d} = ?`, ...numChoices(ans, [ans + 1, a - b + Math.floor(c / d), ans - 2]) }; },
    () => { const x = R(3, 9) * 100, n = R(2, 4), y = R(2, 8) * 100, m = R(2, 4); const cost = x * n + y * m; const z = cost < 5000 ? 5000 : 10000; const ans = z - cost;
      return { q: `한 개에 ${x}원인 지우개 ${n}개와 한 자루에 ${y}원인 연필 ${m}자루를 사고 ${z.toLocaleString()}원을 냈어요. 거스름돈은 얼마일까요?`,
        ...numChoices(ans, [z - x * n - y, z - (x + y) * (n + m) > 0 ? z - (x + y) * (n + m) : ans + 100, ans + 100], '원'), txt: true }; }
  ];

  // 5-1 3단원 규칙과 대응
  G.u13 = [
    () => { const mul = Math.random() < .6, k = mul ? R(2, 9) : R(2, 15); const f = (x) => mul ? x * k : x + k; const n = R(7, 15); const ans = f(n);
      const tbl = `<table class="tbl"><tr><th>□</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>△</th><td>${f(1)}</td><td>${f(2)}</td><td>${f(3)}</td><td>${f(4)}</td></tr></table>`;
      return { fig: tbl, q: `□가 ${n}일 때 △는 얼마일까요?`, ...numChoices(ans, mul ? [n + k, ans + k, ans - k] : [n * k, ans + 1, ans + k]) }; },
    () => { const mul = Math.random() < .5, k = R(2, 9); const f = (x) => mul ? x * k : x + k;
      const tbl = `<table class="tbl"><tr><th>□</th><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><th>△</th><td>${f(1)}</td><td>${f(2)}</td><td>${f(3)}</td><td>${f(4)}</td></tr></table>`;
      const right = mul ? `△ = □ × ${k}` : `△ = □ + ${k}`;
      const c = new Set([right, mul ? `△ = □ + ${k}` : `△ = □ × ${k}`, mul ? `△ = □ × ${k + 1}` : `△ = □ + ${k + 1}`, mul ? `△ = □ + ${k * 2 - 1 > k ? k * 2 - 1 : k + 3}` : `△ = □ × ${k + 1}`]);
      let extra = 2; while (c.size < 4) { c.add(`△ = □ + ${k + extra}`); extra++; }
      return { fig: tbl, q: '□와 △ 사이의 대응 관계를 식으로 나타내면?', ans: right, choices: [...c], txt: true }; },
    () => { const [thing, u1, part, k, u2] = pick([['의자', '개', '다리', 4, '개'], ['세발자전거', '대', '바퀴', 3, '개'], ['문어', '마리', '다리', 8, '개'], ['오리', '마리', '다리', 2, '개'], ['육각형', '개', '꼭짓점', 6, '개'], ['상자', '개', '구슬', 5, '개'], ['꽃', '송이', '꽃잎', 5, '장']]);
      const n = R(6, 14), ans = n * k;
      return { q: `${thing} 1${u1}에 ${jo(part, '이')} ${k}${u2}씩 있어요. ${thing} ${n}${u1}에는 ${jo(part, '이')} 모두 몇 ${u2}일까요?`, ...numChoices(ans, [n + k, ans - k, ans + k], u2), txt: true }; },
    () => { const k = R(2, 6), n = R(9, 14), ans = n + k;
      return { q: `언니는 나보다 ${k}살 많아요. 내가 ${n}살일 때 언니는 몇 살일까요?`, ...numChoices(ans, [n - k, n * k > 60 ? ans + 1 : n * k, ans + 1], '살'), txt: true }; }
  ];

  // 5-1 4단원 약분과 통분
  G.u14 = [
    () => { const b = properRand(2, 9), k = R(2, 6), n = b.n * k, d = b.d * k;
      const cands = [{ n: b.n + 1, d: b.d }, { n: b.n, d: b.d + 1 }, { n: n - 1 > 0 ? n - 1 : n + 1, d }];
      const r = fracChoices(b, cands, false);
      if (k >= 4 && k % 2 === 0) r.choices[3] = fraw(n / 2, d / 2); // 덜 약분한 분수(값은 같지만 기약분수가 아님)
      return { q: `${jo(fraw(n, d), '를')} 기약분수로 나타내면?`, ...r }; },
    () => { let a, b; do { a = properRand(2, 9); b = properRand(2, 9); } while (feq(a, b) || a.d === b.d);
      const big = a.n * b.d > b.n * a.d ? a : b;
      return { q: `${jo(fh(a), '와')} ${fh(b)} 중 더 큰 분수는?`, ans: fh(big), choices: [fh(a), fh(b), '크기가 같아요'] }; },
    () => { let d1, d2; do { d1 = R(2, 9); d2 = R(2, 9); } while (d1 === d2 || lcm(d1, d2) === d1 * d2 && Math.random() < .5);
      const a = { n: R(1, d1 - 1), d: d1 }, b = { n: R(1, d2 - 1), d: d2 }; const L = lcm(d1, d2);
      return { q: `${jo(fraw(a.n, d1), '과')} ${jo(fraw(b.n, d2), '를')} 가장 작은 공통분모로 통분할 때, 공통분모는?`, ...numChoices(L, [d1 * d2 === L ? L * 2 : d1 * d2, d1 + d2, Math.max(d1, d2)]) }; },
    () => { const set = []; while (set.length < 4) { const f = properRand(2, 9); if (!set.some(x => feq(x, f))) set.push(f); }
      const big = set.reduce((m, f) => (f.n * m.d > m.n * f.d ? f : m));
      return { q: '다음 중 가장 큰 분수는?', ans: fh(big), choices: set.map(f => fh(f)) }; },
    () => { const d = pick([2, 4, 5, 10]); let n = R(1, d - 1); while (gcd(n, d) !== 1) n = R(1, d - 1);
      // 분모 2, 5, 10은 소수 한 자리, 4는 두 자리
      const val = d === 4 ? D(n * 25, 2) : D(n * (10 / d), 1);
      return { q: `${jo(fraw(n, d), '를')} 소수로 나타내면?`, ...decChoices(val, [D(n * 10 + d, 1), dshift(val, -1), dshift(val, 1)]) }; }
  ];

  // 5-1 5단원 분수의 덧셈과 뺄셈
  G.u15 = [
    () => { let a, b; do { a = properRand(2, 9); b = properRand(2, 9); } while (a.d === b.d);
      const ans = fadd(a, b); const L = lcm(a.d, b.d);
      return { q: `${fh(a)} ${op('+')} ${fh(b)} = ?`, ...fracChoices(ans, [{ n: a.n + b.n, d: a.d + b.d }, fadd(ans, { n: 1, d: L }), fsub(ans, { n: 1, d: L })]) }; },
    () => { let a, b; do { a = properRand(2, 9); b = properRand(2, 9); } while (a.d === b.d || a.n * b.d <= b.n * a.d);
      const ans = fsub(a, b); const L = lcm(a.d, b.d);
      return { q: `${fh(a)} ${op('−')} ${fh(b)} = ?`, ...fracChoices(ans, [{ n: Math.abs(a.n - b.n) || 1, d: Math.abs(a.d - b.d) || 1 }, fadd(ans, { n: 1, d: L }), fadd(ans, { n: 2, d: L })]) }; },
    () => { let a, b; do { a = properRand(2, 8); b = properRand(2, 8); } while (a.d === b.d);
      const w1 = R(1, 4), w2 = R(1, 4); const A = mixedF(w1, a.n, a.d), B = mixedF(w2, b.n, b.d); const ans = fadd(A, B);
      return { q: `${mh(w1, a.n, a.d)} ${op('+')} ${mh(w2, b.n, b.d)} = ?`, ...fracChoices(ans, [fadd(ans, { n: 1, d: 1 }), fsub(ans, { n: 1, d: 1 }), fadd(ans, { n: 1, d: lcm(a.d, b.d) })]) }; },
    () => { let a, b; do { a = properRand(2, 8); b = properRand(2, 8); } while (a.d === b.d);
      const w1 = R(3, 6), w2 = R(1, w1 - 1); const A = mixedF(w1, a.n, a.d), B = mixedF(w2, b.n, b.d); const ans = fsub(A, B);
      return { q: `${mh(w1, a.n, a.d)} ${op('−')} ${mh(w2, b.n, b.d)} = ?`, ...fracChoices(ans, [fadd(ans, { n: 1, d: 1 }), ans.n > ans.d ? fsub(ans, { n: 1, d: 1 }) : fadd(ans, { n: 2, d: 1 }), fadd(ans, { n: 1, d: lcm(a.d, b.d) })]) }; },
    () => { let a, b; do { a = properRand(2, 9); b = properRand(2, 9); } while (a.d === b.d);
      const ans = fadd(a, b);
      return { q: `주스 ${fh(a)} L와 우유 ${fh(b)} L를 섞었어요. 모두 몇 L일까요?`, ...fracChoices(ans, [{ n: a.n + b.n, d: a.d + b.d }, fadd(ans, { n: 1, d: lcm(a.d, b.d) }), fsub(ans, { n: 1, d: lcm(a.d, b.d) })]) }; }
  ];

  // 5-1 6단원 다각형의 둘레와 넓이
  G.u16 = [
    () => { const a = R(5, 15), b = R(3, 12); const ans = 2 * (a + b);
      return { fig: shapeSVG('rect', a, b), q: `가로 ${a} cm, 세로 ${b} cm인 직사각형의 둘레는 몇 cm일까요?`, ...numChoices(ans, [a + b, a * b, ans + 2], ' cm') }; },
    () => { const a = R(6, 15), h = R(3, 10);
      return { fig: shapeSVG('para', a, 0, h), q: `밑변 ${a} cm, 높이 ${h} cm인 평행사변형의 넓이는 몇 cm²일까요?`, ...numChoices(a * h, [a * h / 2 % 1 ? a * h + a : a * h / 2, 2 * (a + h), a * h + h], ' cm²') }; },
    () => { let a, h; do { a = R(4, 16); h = R(3, 12); } while ((a * h) % 2);
      return { fig: shapeSVG('tri', a, 0, h), q: `밑변 ${a} cm, 높이 ${h} cm인 삼각형의 넓이는 몇 cm²일까요?`, ...numChoices(a * h / 2, [a * h, a + h, a * h / 2 + h], ' cm²') }; },
    () => { let a, b, h; do { a = R(3, 9); b = R(a + 2, 16); h = R(3, 10); } while (((a + b) * h) % 2);
      return { fig: shapeSVG('trap', a, b, h), q: `윗변 ${a} cm, 아랫변 ${b} cm, 높이 ${h} cm인 사다리꼴의 넓이는 몇 cm²일까요?`, ...numChoices((a + b) * h / 2, [(a + b) * h, a * b * h % 2 ? a * h + b : a * b * h / 2 > 400 ? (a + b) * h / 2 + h : a * b * h / 2, (a + b) * h / 2 + a], ' cm²') }; },
    () => { let a, b; do { a = R(6, 16); b = R(4, 14); } while ((a * b) % 2);
      return { fig: shapeSVG('rhom', a, b), q: `두 대각선이 ${a} cm, ${b} cm인 마름모의 넓이는 몇 cm²일까요?`, ...numChoices(a * b / 2, [a * b, a + b, 2 * (a + b)], ' cm²') }; },
    () => { const p = pick([['정오각형', 5], ['정육각형', 6], ['정팔각형', 8], ['정삼각형', 3]]), s = R(4, 15);
      return { q: `한 변이 ${s} cm인 ${p[0]}의 둘레는 몇 cm일까요?`, ...numChoices(p[1] * s, [(p[1] - 1) * s, (p[1] + 1) * s, p[1] + s], ' cm'), txt: true }; },
    () => { const m = R(2, 9);
      return { q: `${m} m²는 몇 cm²일까요?`, ...numChoices(m * 10000, [m * 100, m * 1000, m * 100000], ' cm²') }; }
  ];

  // 5-2 1단원 수의 범위와 어림하기
  const placeName = { 10: '십', 100: '백', 1000: '천' };
  G.u21 = [
    () => { const p = pick([10, 100, 1000]); let x; do { x = R(1001, 9989); } while (x % p === 0 || (x % p) * 2 === p);
      const up = Math.ceil(x / p) * p, dn = Math.floor(x / p) * p, ro = Math.floor((x + p / 2) / p) * p;
      const m = pick(['올림', '버림', '반올림']); const ans = m === '올림' ? up : m === '버림' ? dn : ro;
      const p2 = p === 1000 ? 100 : p * 10;
      return { q: `${jo(x.toLocaleString(), '을')} ${m}하여 ${placeName[p]}의 자리까지 나타내면?`, ...numChoices(ans, [up, dn, Math.floor((x + p2 / 2) / p2) * p2, ans + p]) }; },
    () => { const lo = R(20, 60), hi = lo + R(4, 8);
      const kind = pick([['이상', '이하', true, true], ['이상', '미만', true, false], ['초과', '이하', false, true], ['초과', '미만', false, false]]);
      const inR = (v) => (kind[2] ? v >= lo : v > lo) && (kind[3] ? v <= hi : v < hi);
      const pool = []; for (let v = lo - 3; v <= hi + 3; v++) pool.push(v);
      const ins = pool.filter(inR), outs = pool.filter(v => !inR(v));
      const ans = pick(ins);
      const pref = shuffle(outs.filter(v => v === lo || v === hi || v === lo - 1 || v === hi + 1)).concat(shuffle(outs));
      const ch = [ans]; for (const v of pref) { if (!ch.includes(v)) ch.push(v); if (ch.length === 4) break; }
      return { q: `${lo} ${kind[0]} ${hi} ${kind[1]}인 수는?`, ans: String(ans), choices: ch.map(String) }; },
    () => { const k = pick([4, 5, 6, 8, 10]); let n; do { n = R(20, 70); } while (n % k === 0); const ans = Math.ceil(n / k);
      return { q: `${n}명이 한 대에 ${k}명씩 타는 보트에 모두 타려고 해요. 보트는 적어도 몇 대 필요할까요?`, ...numChoices(ans, [ans - 1, ans + 1, n - k], '대'), txt: true }; },
    () => { let x; do { x = R(12, 89) * 100 + R(1, 9) * 10; } while (x % 1000 === 0); const ans = Math.floor(x / 1000);
      return { q: `동전 ${x.toLocaleString()}원을 1000원짜리 지폐로 바꾸려고 해요. 최대 몇 장까지 바꿀 수 있을까요?`, ...numChoices(ans, [ans + 1, Math.floor(x / 100), ans - 1], '장'), txt: true }; },
    () => { const lim = R(110, 150), kind = pick(['이상', '초과']);
      const ok = (v) => kind === '이상' ? v >= lim : v > lim;
      const vals = shuffle([lim, lim - 1, lim + R(1, 6), lim - R(2, 8)]);
      const goods = vals.filter(ok);
      const ans = goods[0];
      const ch = vals.filter(v => v === ans || !ok(v));
      while (ch.length < 4) { const v = lim - R(9, 15); if (!ch.includes(v)) ch.push(v); }
      return { q: `키가 ${lim} cm ${kind}인 사람만 탈 수 있는 놀이 기구가 있어요. 탈 수 있는 키는?`, ans: ans + ' cm', choices: ch.slice(0, 4).map(v => v + ' cm') }; }
  ];

  // 5-2 2단원 분수의 곱셈
  G.u22 = [
    () => { const a = properRand(3, 9), n = R(2, 9); const ans = fmul(a, { n, d: 1 });
      return { q: `${fh(a)} ${op('×')} ${n} = ?`, ...fracChoices(ans, [{ n: a.n, d: a.d * n }, { n: a.n * n, d: a.d * n + 1 }, { n: a.n + n, d: a.d }]) }; },
    () => { const a = properRand(3, 9), n = R(2, 9); const ans = fmul({ n, d: 1 }, a);
      return { q: `${n} ${op('×')} ${fh(a)} = ?`, ...fracChoices(ans, [{ n: a.n, d: a.d * n }, { n: n * a.d, d: a.n }, { n: a.n + n, d: a.d }]) }; },
    () => { const a = properRand(2, 9), b = properRand(2, 9); const ans = fmul(a, b);
      return { q: `${fh(a)} ${op('×')} ${fh(b)} = ?`, ...fracChoices(ans, [{ n: a.n + b.n, d: a.d + b.d }, { n: a.n * b.d, d: a.d * b.n }, { n: a.n * b.n, d: a.d + b.d }]) }; },
    () => { const a = properRand(2, 6), w = R(1, 3), n = R(2, 5); const A = mixedF(w, a.n, a.d); const ans = fmul(A, { n, d: 1 });
      return { q: `${mh(w, a.n, a.d)} ${op('×')} ${n} = ?`, ...fracChoices(ans, [mixedF(w * n, a.n, a.d), F(w * n * a.d + a.n, a.d), fadd(ans, { n: 1, d: 1 })]) }; },
    () => { const a = properRand(2, 9), b = properRand(2, 9); const ans = fmul(a, b);
      return { q: `리본 ${fh(a)} m의 ${fh(b)} 만큼을 잘랐어요. 자른 리본은 몇 m일까요?`, ...fracChoices(ans, [{ n: a.n + b.n, d: a.d + b.d }, fadd(a, b), { n: a.n * b.d, d: a.d * b.n }]) }; },
    () => { const x = R(2, 9); let y = R(2, 9); if (y === x) y = x + 1; const ans = F(1, x * y);
      return { q: `${fraw(1, x)} ${op('×')} ${fraw(1, y)} = ?`, ...fracChoices(ans, [{ n: 1, d: x + y }, { n: 2, d: x * y }, { n: 1, d: x * y + 1 }]) }; }
  ];

  // 5-2 3단원 합동과 대칭
  const polys = [['정삼각형', 3], ['정사각형', 4], ['정오각형', 5], ['정육각형', 6], ['정팔각형', 8]];
  G.u23 = [
    () => { const p = pick(polys); return { q: `${p[0]}의 대칭축은 모두 몇 개일까요?`, ...numChoices(p[1], [p[1] - 1, p[1] + 1, p[1] * 2, 1], '개'), txt: true }; },
    () => ({ q: '점대칭도형은 대칭의 중심을 중심으로 몇 도 돌렸을 때 처음 도형과 완전히 겹쳐질까요?', ...numChoices(180, [90, 360, 270], '°') }),
    () => { const L = R(4, 15) * 2; return { q: `점대칭도형에서 대응점끼리 이은 선분의 길이가 ${L} cm예요. 대칭의 중심에서 한 대응점까지는 몇 cm일까요?`, ...numChoices(L / 2, [L, L * 2, L / 2 + 1], ' cm'), txt: true }; },
    () => ({ q: '선대칭도형에서 대응점끼리 이은 선분은 대칭축과 몇 도로 만날까요?', ...numChoices(90, [45, 180, 60], '°') }),
    () => { const x = R(3, 12); return { q: `선대칭도형에서 한 점과 대칭축 사이의 거리가 ${x} cm예요. 그 점과 대응점 사이의 거리는 몇 cm일까요?`, ...numChoices(x * 2, [x, x + 2, x * 3], ' cm'), txt: true }; },
    () => { const a = R(4, 9), b = R(5, 10), c = R(6, 12); const s = a + b + c;
      return { q: `두 삼각형은 서로 합동이에요. 한 삼각형의 세 변이 ${a} cm, ${b} cm, ${c} cm일 때 다른 삼각형의 둘레는 몇 cm일까요?`, ...numChoices(s, [s * 2, s - a, a + b], ' cm'), txt: true }; },
    () => { const x = R(5, 16) * 5; return { q: `합동인 두 사각형에서 한 각의 크기가 ${x}°예요. 이 각의 대응각은 몇 도일까요?`, ...numChoices(x, [180 - x, 90, x * 2 > 300 ? x + 10 : x * 2], '°'), txt: true }; },
    () => pick([
      { q: '다음 중 점대칭도형이 아닌 것은?', ans: '정삼각형', choices: ['정삼각형', '정사각형', '직사각형', '평행사변형'], txt: true },
      { q: '다음 중 선대칭도형이 아닌 것은?', ans: '평행사변형', choices: ['평행사변형', '정삼각형', '마름모', '이등변삼각형'], txt: true },
      { q: '다음 중 선대칭도형이면서 점대칭도형인 것은?', ans: '정사각형', choices: ['정사각형', '정삼각형', '평행사변형', '사다리꼴'], txt: true },
      { q: '서로 합동인 두 도형에서 겹쳐지는 변을 무엇이라고 할까요?', ans: '대응변', choices: ['대응변', '대응점', '대응각', '대칭축'], txt: true }
    ])
  ];

  // 5-2 4단원 소수의 곱셈
  G.u24 = [
    () => { const a = D(R(11, 99), pick([1, 2])), n = R(2, 9); const ans = dmul(a, D(n, 0));
      return { q: `${dstr(a)} ${op('×')} ${n} = ?`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, -1), D(ans.v + Math.pow(10, ans.s - 1 >= 0 ? 0 : 0), ans.s)]) }; },
    () => { const a = D(R(11, 99), 1), n = R(2, 9); const ans = dmul(D(n, 0), a);
      return { q: `${n} ${op('×')} ${dstr(a)} = ?`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, -1)]) }; },
    () => { const a = D(R(2, 29), 1), b = D(R(2, 9), 1); const ans = dmul(a, b);
      return { q: `${dstr(a)} ${op('×')} ${dstr(b)} = ?`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, 2), dshift(ans, -1)]) }; },
    () => { const a = D(R(101, 999), 2), k = pick([1, 2, 3]); const ans = dshift(a, k);
      return { q: `${dstr(a)} ${op('×')} ${Math.pow(10, k)} = ?`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, -1), dshift(ans, -2)]) }; },
    () => { const a = R(11, 999), k = pick([1, 2]); const ans = D(a, k);
      return { q: `${a} ${op('×')} ${k === 1 ? '0.1' : '0.01'} = ?`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, -1), D(a, k + 2)]) }; },
    () => { const price = R(2, 18) * 500, w = D(R(2, 9), 1); const ans = price * w.v / 10;
      return { q: `1 kg에 ${price.toLocaleString()}원인 밀가루 ${dstr(w)} kg의 값은 얼마일까요?`, ...numChoices(ans, [ans * 10, price - ans, ans + 100], '원'), txt: true }; },
    () => { const L = D(R(105, 295), 2), n = R(2, 6); const ans = dmul(L, D(n, 0));
      return { q: `길이가 ${dstr(L)} m인 리본 ${n}개를 이으면 모두 몇 m일까요? (겹치는 부분 없음)`, ...decChoices(ans, [dshift(ans, 1), dshift(ans, -1)], ' m'), txt: true }; }
  ];

  // 5-2 5단원 직육면체
  G.u25 = [
    () => { const w = pick([['면', 6], ['모서리', 12], ['꼭짓점', 8]]); return { q: `직육면체의 ${w[0]}${w[0]==='모서리'?'는':'은'} 모두 몇 개일까요?`, ...numChoices(w[1], [6, 12, 8, 4].filter(x => x !== w[1]), '개') }; },
    () => { const a = R(3, 12); return { q: `한 모서리가 ${a} cm인 정육면체의 모든 모서리 길이의 합은 몇 cm일까요?`, ...numChoices(12 * a, [6 * a, 8 * a, 4 * a], ' cm'), txt: true }; },
    () => { const a = R(3, 10), b = R(3, 10), c = R(3, 10); const s = a + b + c;
      return { q: `가로 ${a} cm, 세로 ${b} cm, 높이 ${c} cm인 직육면체의 모든 모서리 길이의 합은 몇 cm일까요?`, ...numChoices(4 * s, [2 * s, s, 3 * s], ' cm'), txt: true }; },
    () => { const w = pick([['보이는 모서리', 9], ['보이지 않는 모서리', 3], ['보이지 않는 꼭짓점', 1], ['보이는 면', 3]]);
      return { q: `직육면체의 겨냥도에서 ${w[0]}${w[0].endsWith('모서리')?'는':'은'} 몇 개일까요?`, ...numChoices(w[1], [w[1] + 3, w[1] === 1 ? 2 : w[1] - 1, w[1] === 3 ? 6 : 12].filter(x => x !== w[1]), '개'), txt: true }; },
    () => pick([
      { q: '직육면체에서 한 면과 수직인 면은 모두 몇 개일까요?', ...numChoices(4, [2, 1, 6], '개'), txt: true },
      { q: '직육면체에서 서로 평행한 면은 모두 몇 쌍일까요?', ...numChoices(3, [2, 4, 6], '쌍'), txt: true },
      { q: '직육면체에서 한 면과 평행한 면은 몇 개일까요?', ...numChoices(1, [2, 4, 3], '개'), txt: true },
      { q: '정육면체의 면은 모두 어떤 모양일까요?', ans: '정사각형', choices: ['정사각형', '직사각형', '삼각형', '마름모'], txt: true }
    ]),
    () => { const a = R(4, 12); return { q: `정육면체의 모든 모서리 길이의 합이 ${12 * a} cm예요. 한 모서리는 몇 cm일까요?`, ...numChoices(a, [a * 2, Math.round(12 * a / 6), a + 2].filter(x => x !== a), ' cm'), txt: true }; }
  ];

  // 5-2 6단원 평균과 가능성
  const prob = ['불가능하다', '~아닐 것 같다', '반반이다', '~일 것 같다', '확실하다'];
  G.u26 = [
    () => { const n = pick([4, 5]), m = R(5, 30); let v; do { v = Array.from({ length: n - 1 }, () => m + R(-4, 4)); } while (Math.abs(n * m - v.reduce((s, x) => s + x, 0) - m) > 4);
      v.push(n * m - v.reduce((s, x) => s + x, 0)); v = shuffle(v); const sum = v.reduce((s, x) => s + x, 0);
      return { q: `${v.join(', ')}의 평균은 얼마일까요?`, ...numChoices(m, [m + 1, m - 1, sum]) }; },
    () => { const m = R(70, 90), a = m + R(-8, 8), b = m + R(-8, 8), c = m + R(-8, 8); const x = 4 * m - a - b - c;
      if (x < 50 || x > 100) return G.u26[0]();
      return { q: `네 사람의 점수 평균이 ${m}점이에요. 세 사람이 ${a}점, ${b}점, ${c}점일 때 나머지 한 사람은 몇 점일까요?`, ...numChoices(x, [m, x + 4, x - 4], '점'), txt: true }; },
    () => { const days = 5, m = R(8, 25); let v; do { v = Array.from({ length: 4 }, () => m + R(-5, 5)); } while (Math.abs(5 * m - v.reduce((s, x) => s + x, 0) - m) > 5);
      v.push(5 * m - v.reduce((s, x) => s + x, 0));
      return { q: `5일 동안 읽은 책의 쪽수가 ${v.join('쪽, ')}쪽이에요. 하루에 평균 몇 쪽을 읽었을까요?`, ...numChoices(m, [m + 2, m - 2, 5 * m], '쪽'), txt: true }; },
    () => { const e = pick([
        ['주사위를 굴렸을 때 7 이상이 나올 가능성', 0], ['동전을 던졌을 때 그림 면이 나올 가능성', 2], ['1부터 6까지 쓰인 주사위를 굴렸을 때 6 이하가 나올 가능성', 4],
        ['빨간 공 9개, 파란 공 1개가 든 주머니에서 빨간 공을 꺼낼 가능성', 3], ['빨간 공 9개, 파란 공 1개가 든 주머니에서 파란 공을 꺼낼 가능성', 1],
        ['12월 다음에 1월이 올 가능성', 4], ['흰 바둑돌만 든 통에서 검은 바둑돌을 꺼낼 가능성', 0], ['주사위를 굴렸을 때 짝수가 나올 가능성', 2]]);
      const others = shuffle([0, 1, 2, 3, 4].filter(x => x !== e[1])).slice(0, 3);
      return { q: `${e[0]}은?`, ans: prob[e[1]], choices: [e[1], ...others].map(i => prob[i]), txt: true }; },
    () => { const e = pick([['동전을 던졌을 때 숫자 면이 나올 가능성', 1], ['주사위를 굴렸을 때 0이 나올 가능성', 0], ['흰 공만 든 상자에서 흰 공을 꺼낼 가능성', 2]]);
      const vals = [fh({ n: 0, d: 1 }), fraw(1, 2), '1', fraw(1, 4)]; const ansH = [vals[0], vals[1], vals[2]][e[1]];
      return { q: `${e[0]}을 수로 나타내면?`, ans: ansH, choices: vals }; }
  ];

  const UNITS = {
    u11: { sem: 1, name: '자연수의 혼합 계산' }, u13: { sem: 1, name: '규칙과 대응' }, u14: { sem: 1, name: '약분과 통분' },
    u15: { sem: 1, name: '분수의 덧셈과 뺄셈' }, u16: { sem: 1, name: '다각형의 둘레와 넓이' },
    u21: { sem: 2, name: '수의 범위와 어림하기' }, u22: { sem: 2, name: '분수의 곱셈' }, u23: { sem: 2, name: '합동과 대칭' },
    u24: { sem: 2, name: '소수의 곱셈' }, u25: { sem: 2, name: '직육면체' }, u26: { sem: 2, name: '평균과 가능성' }
  };

  // 한 문제 만들기. 보기를 섞고, 정답이 보기 안에 꼭 하나만 있도록 확인한다
  function make(unit, type) {
    const list = G[unit];
    if (type == null) type = Math.floor(Math.random() * list.length);
    for (let tries = 0; tries < 20; tries++) {
      let p;
      try { p = list[type](); } catch (e) { p = null; }
      if (!p) continue;
      const uniq = [...new Set(p.choices)];
      if (uniq.length < 3 || uniq.filter(c => c === p.ans).length !== 1) continue;
      return { unit, type, q: p.q, fig: p.fig || '', ans: p.ans, choices: shuffle(uniq), txt: !!p.txt || uniq.some(c => c.length > 12 && !c.includes('<')) };
    }
    return make('u11', 0);
  }

  // 돌아가며 내기: 11개 단원을 섞은 순서대로 한 바퀴씩 돌고,
  // 단원 안에서도 문제 유형을 섞은 순서대로 돌아가며 낸다.
  // 틀린 문제 종류는 몇 문제 뒤에 한 번 다시 끼워 넣는다(바로 앞 단원과 겹치지 않게).
  // rot = { bag:[단원...], types:{단원:[유형...]}, last:'단원' } 은 저장 데이터에 들어간다.
  function next(rot, review, total) {
    const keys = Object.keys(G);
    if (review && review.length) {
      const i = review.findIndex(r => r.due <= total && r.unit !== rot.last);
      if (i >= 0) { const r = review.splice(i, 1)[0]; rot.last = r.unit; return make(r.unit, r.type); }
    }
    if (!rot.bag || !rot.bag.length) {
      let b; do { b = shuffle(keys); } while (b[0] === rot.last && keys.length > 1);
      rot.bag = b;
    }
    const unit = rot.bag.shift();
    rot.types = rot.types || {};
    let tl = rot.types[unit];
    if (!tl || !tl.length || tl.some(t => t >= G[unit].length)) tl = rot.types[unit] = shuffle(G[unit].map((_, i) => i));
    const type = tl.shift();
    rot.last = unit;
    return make(unit, type);
  }
  return { make, next, UNITS, G, jo, hasBatchim };
})();
