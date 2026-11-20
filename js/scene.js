// 배경과 물건 그림: 친구의 방, 부엌, 산책길, 음식, 아이템 (모두 SVG 코드로 직접 그림)
const Scene = (() => {
  const svg = (vb, inner, par = 'xMidYMid meet') => `<svg viewBox="${vb}" preserveAspectRatio="${par}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

  // ---------- 음식 ----------
  const FOOD = {
    milk: `<path d="M20 14 h24 l-3 40 a4 4 0 0 1 -4 4 h-10 a4 4 0 0 1 -4 -4z" fill="#fff" stroke="#E79AB6" stroke-width="2.4"/><path d="M21.6 26 h20.8 l-2.2 27 a3 3 0 0 1 -3 3 h-10.4 a3 3 0 0 1 -3 -3z" fill="#F7B3CC"/><path d="M38 6 l-4 24" stroke="#8FD8C8" stroke-width="3" stroke-linecap="round"/><path d="M46 12 c6 -2 9 4 5 8 c-3 4 -9 3 -10 -2 c-1 -3 2 -5 5 -6z" fill="#F2678F" stroke="#C9466F" stroke-width="1.4"/>`,
    cake: `<path d="M10 40 L54 30 L54 50 L10 58 Z" fill="#FFC79A" stroke="#D98A52" stroke-width="2"/><path d="M10 40 L54 30 L36 22 Z" fill="#FFF4E8" stroke="#E8B48C" stroke-width="2" stroke-linejoin="round"/><path d="M10 48 L54 39" stroke="#fff" stroke-width="3"/><path d="M32 24 l6 -12" stroke="#FF9A4D" stroke-width="5" stroke-linecap="round"/><path d="M38 12 l3 -5 M38 12 l5 -2" stroke="#6CC08F" stroke-width="2.2" stroke-linecap="round"/>`,
    cotton: `<path d="M32 58 V34" stroke="#E8C79A" stroke-width="3.4" stroke-linecap="round"/><g fill="#D9CCFF" stroke="#A996F0" stroke-width="2"><circle cx="22" cy="24" r="11"/><circle cx="36" cy="18" r="13"/><circle cx="44" cy="30" r="10"/><circle cx="28" cy="34" r="10"/></g><circle cx="30" cy="16" r="3" fill="#fff" opacity=".8"/>`,
    cookie: `<polygon points="32,6 39,22 56,23 43,34 47,51 32,42 17,51 21,34 8,23 25,22" fill="#FFD884" stroke="#D9962E" stroke-width="2.4" stroke-linejoin="round"/><g fill="#B5651D"><circle cx="28" cy="28" r="2"/><circle cx="37" cy="31" r="2"/><circle cx="31" cy="37" r="1.8"/></g><circle cx="24" cy="22" r="1.4" fill="#F28DB2"/><circle cx="40" cy="24" r="1.4" fill="#8FD8C8"/>`,
    pudding: `<path d="M14 54 h36 l-5 -26 h-26z" fill="#FFE7A3" stroke="#D9AE52" stroke-width="2.2" stroke-linejoin="round"/><path d="M19 28 h26 l-1 -5 h-24z" fill="#C98A3D"/><g fill="#fff" stroke="#E6DDF7" stroke-width="1.6"><circle cx="24" cy="20" r="7"/><circle cx="33" cy="15" r="9"/><circle cx="42" cy="20" r="7"/></g><path d="M8 56 h48" stroke="#E79AB6" stroke-width="3" stroke-linecap="round"/>`,
    pancake: `<ellipse cx="32" cy="48" rx="24" ry="7" fill="#F2C27B" stroke="#C98A3D" stroke-width="2"/><ellipse cx="32" cy="40" rx="23" ry="7" fill="#F7CF8C" stroke="#C98A3D" stroke-width="2"/><ellipse cx="32" cy="32" rx="22" ry="7" fill="#F9D99B" stroke="#C98A3D" stroke-width="2"/><path d="M18 30 q14 -8 28 0 q-2 6 -6 4 q-2 8 -4 0 q-8 4 -12 0 q-4 4 -6 -4z" fill="#FFB938" opacity=".9"/><rect x="28" y="22" width="8" height="5" rx="1.5" fill="#FFF6D6"/>`
  };
  const food = (id) => svg('0 0 64 64', FOOD[id] || '');

  // ---------- 아이템 ----------
  const DECOR = {
    shell: `<path d="M32 12 C48 12 58 30 52 46 L12 46 C6 30 16 12 32 12Z" fill="#FFD3C4" stroke="#E7957C" stroke-width="2.4"/><path d="M32 46 L32 14 M32 46 L20 16 M32 46 L44 16 M32 46 L13 28 M32 46 L51 28" stroke="#E7957C" stroke-width="1.8"/><rect x="24" y="46" width="16" height="7" rx="3" fill="#FFD3C4" stroke="#E7957C" stroke-width="2"/>`,
    plant: `<path d="M18 38 h28 l-4 20 h-20z" fill="#FFB9A6" stroke="#D9776A" stroke-width="2.2" stroke-linejoin="round"/><path d="M32 38 C30 26 22 22 16 22 C18 30 24 36 32 38 C34 26 42 22 48 22 C46 30 40 36 32 38" fill="#9FDDB4" stroke="#5DB07D" stroke-width="2"/><g><circle cx="32" cy="14" r="5" fill="#F7A0C1"/><circle cx="26" cy="18" r="4" fill="#F7A0C1"/><circle cx="38" cy="18" r="4" fill="#F7A0C1"/><circle cx="32" cy="18" r="3" fill="#FFE08A"/></g>`,
    lamp: `<path d="M32 4 l6 13 l14 1 l-11 9 l4 14 l-13 -8 l-13 8 l4 -14 l-11 -9 l14 -1z" fill="#FFE59A" stroke="#E8A93C" stroke-width="2.2" stroke-linejoin="round"/><circle cx="32" cy="24" r="17" fill="#FFE59A" opacity=".25"/><rect x="26" y="44" width="12" height="12" rx="3" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="2"/>`,
    cushion: `<g fill="#fff" stroke="#C9BDF3" stroke-width="2.4"><circle cx="20" cy="38" r="12"/><circle cx="32" cy="30" r="15"/><circle cx="45" cy="38" r="12"/></g><rect x="10" y="38" width="44" height="14" rx="7" fill="#fff"/><path d="M8 44 q24 14 48 0" fill="none" stroke="#C9BDF3" stroke-width="2.4"/>`,
    rug: `<ellipse cx="32" cy="36" rx="28" ry="16" fill="#FFC7D9" stroke="#E5679A" stroke-width="2.2"/><ellipse cx="32" cy="36" rx="20" ry="10" fill="none" stroke="#fff" stroke-width="2.4" stroke-dasharray="4 4"/><path d="M28 32 c6 -2 9 4 5 8 c-3 3 -8 2 -8 -2 c0 -3 1 -5 3 -6z" fill="#F2678F"/>`,
    frame: `<rect x="10" y="10" width="44" height="40" rx="5" fill="#FFF4E0" stroke="#D9AE52" stroke-width="3"/><rect x="16" y="16" width="32" height="28" rx="3" fill="#DDEBFF"/><circle cx="26" cy="32" r="6" fill="#fff" stroke="#C9BDF3" stroke-width="1.6"/><circle cx="38" cy="32" r="6" fill="#fff" stroke="#EFA2C0" stroke-width="1.6"/><path d="M32 22 l1.6 3.4 3.6 .4 -2.7 2.4 .8 3.6 -3.3 -1.9 -3.3 1.9 .8 -3.6 -2.7 -2.4 3.6 -.4z" fill="#FFD36E"/>`
  };
  function item(id) {
    if (DECOR[id]) return svg('0 0 64 64', DECOR[id]);
    if (Art.ACC[id]) { Art.installDefs(); return svg('-22 -22 44 44', `<g transform="scale(1.3)">${Art.ACC[id]()}</g>`); }
    return '';
  }

  // ---------- 상태 아이콘 ----------
  const NEED = {
    full: `<path d="M8 12 h16 a8 9 0 0 1 -16 0z" fill="#FFD7A8" stroke="#E79A55" stroke-width="2"/><path d="M12 9 q2 -4 0 -6 M16 9 q2 -4 0 -6 M20 9 q2 -4 0 -6" stroke="#E79A55" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
    mood: `<path d="M16 27 s-10 -6 -12 -12 c-1.6 -5 4 -10 8 -6 l4 3 l4 -3 c4 -4 9.6 1 8 6 c-2 6 -12 12 -12 12z" fill="#F7A0C1" stroke="#D9628E" stroke-width="2"/>`,
    clean: `<circle cx="13" cy="17" r="8" fill="#DCEBFF" stroke="#7FB0EA" stroke-width="2"/><circle cx="22" cy="10" r="5" fill="#DCEBFF" stroke="#7FB0EA" stroke-width="2"/><circle cx="10" cy="14" r="2" fill="#fff"/>`,
    energy: `<path d="M20 4 A12 12 0 1 0 28 22 A9.6 9.6 0 1 1 20 4Z" fill="#FFE08A" stroke="#E8A93C" stroke-width="2" stroke-linejoin="round"/>`
  };
  const need = (k) => svg('0 0 32 32', NEED[k]);

  // ---------- 친구의 방 ----------
  function room(kind, decor, night, weather = 'sun') {
    const wall = kind === 'bunny' ? ['#FFF1F5', '#FFE4EE'] : ['#F4F0FF', '#E9E2FF'];
    const dot = kind === 'bunny' ? '#FBD3E1' : '#DCD3FB';
    const sky = night ? ['#4E4A8C', '#8E7CC4'] : ['#BFE3FF', '#EAF6FF'];
    const has = (k) => decor && decor.includes(k);
    const it = (id, x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${DECOR[id]}</g>`;
    const bedC = kind === 'bunny' ? '#FFC7D9' : '#D9CCFF', bedS = kind === 'bunny' ? '#E5679A' : '#8F7BE0';
    return svg('0 0 1000 640', `
      <defs>
        <linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>
        <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E6D6"/><stop offset="1" stop-color="#F1D6C2"/></linearGradient>
        <linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
        <pattern id="rp" width="46" height="46" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="3.4" fill="${dot}"/><circle cx="34" cy="34" r="3.4" fill="${dot}"/></pattern>
      </defs>
      <rect width="1000" height="430" fill="url(#rw)"/><rect width="1000" height="430" fill="url(#rp)"/>
      <rect y="410" width="1000" height="24" fill="#fff" opacity=".9"/>
      <rect y="430" width="1000" height="210" fill="url(#rf)"/>
      ${[0, 1, 2, 3, 4].map(i => `<path d="M0 ${470 + i * 38} H1000" stroke="#E9CDB8" stroke-width="2" opacity=".6"/>`).join('')}
      <!-- 창문 -->
      <g transform="translate(-40 0)"><rect x="590" y="70" width="250" height="200" rx="26" fill="#fff"/>
      <rect x="606" y="86" width="218" height="168" rx="18" fill="url(#rs)"/>
      ${night ? `<circle cx="780" cy="128" r="18" fill="#FFF3B0"/><circle cx="772" cy="122" r="16" fill="url(#rs)"/>${[[650, 120], [700, 170], [740, 110], [800, 200], [668, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`).join('')}`
        : `<circle cx="780" cy="130" r="20" fill="#FFE59A"/><g fill="#fff"><circle cx="660" cy="190" r="16"/><circle cx="682" cy="180" r="20"/><circle cx="704" cy="192" r="15"/></g>`}
      <clipPath id="wclip"><rect x="606" y="86" width="218" height="168" rx="18"/></clipPath>
      <g clip-path="url(#wclip)">
        ${weather === 'rain' ? `<rect x="600" y="80" width="230" height="180" fill="#8E9BBD" opacity=".55"/><g fill="#fff" opacity=".9"><circle cx="650" cy="110" r="22"/><circle cx="680" cy="100" r="26"/><circle cx="712" cy="112" r="20"/><circle cx="760" cy="104" r="18"/><circle cx="786" cy="112" r="20"/></g><g class="wrain" stroke="#DCEBFF" stroke-width="3" stroke-linecap="round">${[620, 645, 670, 695, 720, 745, 770, 795, 815].map((x, i) => `<path d="M${x} ${120 + (i % 3) * 30} l-6 16"/>`).join('')}</g>` : ''}
        ${weather === 'snow' ? `<rect x="600" y="80" width="230" height="180" fill="#C9D6F0" opacity=".45"/><g class="wsnow" fill="#fff">${[[625, 110], [660, 150], [690, 105], [720, 180], [750, 125], [790, 160], [640, 210], [770, 220], [705, 230], [815, 120]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4"/>`).join('')}</g><path d="M606 244 q60 -14 110 -4 t108 -6 v20 h-218z" fill="#fff"/>` : ''}
        ${weather === 'rainbow' ? `<g fill="none" stroke-width="9" opacity=".9"><path d="M620 250 a95 95 0 0 1 190 0" stroke="#F7A0C1"/><path d="M632 250 a83 83 0 0 1 166 0" stroke="#FFD36E"/><path d="M644 250 a71 71 0 0 1 142 0" stroke="#8FE0C9"/><path d="M656 250 a59 59 0 0 1 118 0" stroke="#9EC2F2"/></g>` : ''}
      </g>
      <path d="M715 86 V254 M606 170 H824" stroke="#fff" stroke-width="8"/>
      <path d="M580 64 h270" stroke="${bedS}" stroke-width="8" stroke-linecap="round" opacity=".5"/>
      <path d="M584 68 q20 80 -2 200 q40 -60 30 -200z" fill="${bedC}" opacity=".9"/>
      <path d="M846 68 q-20 80 2 200 q-40 -60 -30 -200z" fill="${bedC}" opacity=".9"/>
      <rect x="575" y="270" width="280" height="16" rx="8" fill="#fff"/>
      ${has('shell') ? it('shell', 668, 216, .9) : ''}</g>
      <!-- 선반 -->
      <rect x="210" y="205" width="230" height="14" rx="7" fill="#F2D3B6"/>
      <g transform="translate(230 150)"><rect width="22" height="55" rx="4" fill="#C9B8FF"/><rect x="26" y="8" width="18" height="47" rx="4" fill="#FFC7D9"/><rect x="48" y="2" width="20" height="53" rx="4" fill="#9FDDB4"/></g>
      ${has('lamp') ? it('lamp', 350, 150, .9) : `<circle cx="380" cy="190" r="14" fill="#FFE59A" opacity=".8"/>`}
      ${has('frame') ? it('frame', 440, 66, 1.4) : ''}
      <!-- 러그 -->
      ${has('rug') ? `<ellipse cx="520" cy="560" rx="260" ry="62" fill="#FFC7D9" stroke="#E5679A" stroke-width="5"/><ellipse cx="520" cy="560" rx="200" ry="42" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="14 12"/>`
        : `<ellipse cx="520" cy="560" rx="250" ry="58" fill="${kind === 'bunny' ? '#FFE0EA' : '#E9E2FF'}"/><ellipse cx="520" cy="560" rx="200" ry="40" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="12 12" opacity=".8"/>`}
      <!-- 침대 -->
      <g transform="translate(170 352) scale(.86)">
        <rect x="0" y="60" width="250" height="100" rx="30" fill="#fff" stroke="${bedS}" stroke-width="5" opacity=".95"/>
        <rect x="14" y="40" width="80" height="44" rx="20" fill="#fff" stroke="${bedS}" stroke-width="4"/>
        <path d="M70 70 h170 a14 14 0 0 1 0 28 v40 h-170z" fill="${bedC}"/>
        <path d="M70 100 h184" stroke="#fff" stroke-width="5" stroke-dasharray="10 10" opacity=".8"/>
        <rect x="10" y="150" width="20" height="26" rx="6" fill="${bedS}" opacity=".6"/><rect x="222" y="150" width="20" height="26" rx="6" fill="${bedS}" opacity=".6"/>
      </g>
      ${has('plant') ? it('plant', 712, 336, 1.45) : ''}
      ${has('cushion') ? it('cushion', 620, 476, 1.5) : ''}
      ${night ? '<rect width="1000" height="640" fill="#3E3570" opacity=".22"/>' : ''}
    `, 'xMidYMax slice');
  }

  // ---------- 부엌 ----------
  function kitchen(fill, color, done) {
    const lvl = Math.min(1, fill);
    const h = 54 * lvl;
    return svg('0 0 600 420', `
      <defs><linearGradient id="kw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6E8"/><stop offset="1" stop-color="#FFEBD9"/></linearGradient>
      <pattern id="kt" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="none" stroke="#F8DCC3" stroke-width="2"/></pattern>
      <clipPath id="kb"><path d="M220 270 h160 a80 70 0 0 1 -160 0z"/></clipPath></defs>
      <rect width="600" height="420" fill="url(#kw)"/><rect width="600" height="300" fill="url(#kt)"/>
      <rect x="40" y="60" width="150" height="90" rx="14" fill="#fff" opacity=".9"/><path d="M60 80 h110 M60 105 h80 M60 130 h95" stroke="#F3D3E2" stroke-width="8" stroke-linecap="round"/>
      <g transform="translate(440 60)"><rect width="110" height="110" rx="55" fill="#fff" opacity=".9"/><path d="M55 25 v30 l20 12" stroke="#E5679A" stroke-width="6" stroke-linecap="round" fill="none"/></g>
      <rect x="0" y="300" width="600" height="120" fill="#F7D9C4"/><rect x="0" y="292" width="600" height="18" rx="6" fill="#fff"/>
      <g class="bowlg"><g transform="translate(360 300) scale(.66) translate(-300 -300)"><ellipse cx="300" cy="352" rx="100" ry="14" fill="#E9C2A9" opacity=".7"/>
      <path d="M220 270 h160 a80 70 0 0 1 -160 0z" fill="#EAF4FF" stroke="#9EC2F2" stroke-width="5"/>
      <rect id="bowlfill" x="220" y="${340 - h}" width="160" height="${h + 2}" fill="${color}" clip-path="url(#kb)" opacity=".9"/>
      <path d="M210 270 h180" stroke="#9EC2F2" stroke-width="10" stroke-linecap="round"/>
      ${done ? '<g fill="#FFD36E"><circle cx="250" cy="240" r="5"/><circle cx="350" cy="236" r="6"/><circle cx="300" cy="222" r="4"/></g>' : ''}</g></g>
    `, 'xMidYMax slice');
  }

  // ---------- 산책길 ----------
  function path(placeId, steps, night, aspect = 600 / 420) {
    const W = Math.max(200, Math.round(420 * aspect)), k = W / 600;
    const P = DATA.PLACES[placeId];
    const sky = P.sky;
    const deco = {
      garden: () => [80, 170, 260, 350, 440, 520].map((x, i) => `<g transform="translate(${x} ${300 + (i % 2) * 18})"><path d="M0 0 v22" stroke="#6CC08F" stroke-width="3"/><g fill="${['#F7A0C1', '#FFD36E', '#C9B8FF'][i % 3]}"><circle cx="-5" cy="-2" r="5"/><circle cx="5" cy="-2" r="5"/><circle cx="0" cy="-8" r="5"/><circle cx="0" cy="3" r="5"/></g><circle r="3" fill="#fff"/></g>`).join(''),
      beach: () => `<rect x="-700" y="170" width="2000" height="70" fill="#9FD9F2"/><path d="M-660 200 ${'q30 -10 60 0 '.repeat(32)}" stroke="#fff" stroke-width="4" fill="none"/><g transform="translate(470 290)">${DECOR.shell.replace(/<rect[^>]*\/>/, '')}</g>`,
      berry: () => [70, 160, 250, 340, 430, 520].map((x, i) => `<g transform="translate(${x} ${296 + (i % 2) * 16})"><ellipse cx="0" cy="6" rx="22" ry="10" fill="#7FCF95"/><path d="M-6 0 c8 -3 12 5 6 10 c-4 4 -11 2 -10 -3 c0 -4 2 -6 4 -7z" fill="#F2678F"/></g>`).join(''),
      hill: () => [[60, 40], [150, 90], [260, 30], [380, 70], [480, 40], [550, 110], [210, 130]].map(([x, y]) => `<path transform="translate(${x} ${y}) scale(.9)" d="M0 -8 l2.4 5.4 5.8 .6 -4.4 3.8 1.3 5.8 -5.1 -3 -5.1 3 1.3 -5.8 -4.4 -3.8 5.8 -.6z" fill="#FFF3B0"/>`).join('') + '<circle cx="500" cy="70" r="26" fill="#FFF3B0"/><circle cx="488" cy="62" r="24" fill="#8E86D2"/>'
    }[placeId]();
    const nodes = pathNodes(W, steps);
    return svg(`0 0 ${W} 420`, `
      <defs><linearGradient id="ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient></defs>
      <rect width="${W}" height="420" fill="url(#ps)"/><g transform="translate(${(W - 600) / 2} 0)">
      ${placeId !== 'hill' && !night ? '<g fill="#fff" opacity=".9"><circle cx="90" cy="70" r="20"/><circle cx="116" cy="60" r="26"/><circle cx="142" cy="72" r="18"/><circle cx="420" cy="90" r="14"/><circle cx="440" cy="82" r="18"/></g>' : ''}
      </g><path transform="scale(${k} 1)" d="M-20 260 Q150 200 300 240 T620 230 V420 H-20Z" fill="${P.ground}"/>
      <g transform="translate(${(W - 600) / 2} 0)">${deco}</g>
      <path d="M${W * .06} 372 C${W * .27} 352 ${W * .37} 392 ${W * .5} 376 S${W * .77} 352 ${W * .94} 372" stroke="#fff" stroke-width="26" fill="none" stroke-linecap="round" opacity=".85"/>
      ${nodes.map((x, i) => `<g class="pnode" data-i="${i}"><circle cx="${x}" cy="${372 + Math.sin(i) * 6}" r="11" fill="#fff" stroke="#E3C9D9" stroke-width="3"/></g>`).join('')}
      <g transform="translate(${nodes[steps - 1]} ${330})"><path d="M0 40 V0" stroke="#C98A3D" stroke-width="4"/><path d="M0 0 l26 8 l-26 8z" fill="#F28DB2"/></g>
    `, 'xMidYMid meet');
  }
  const pathNodes = (W, steps) => Array.from({ length: steps }, (_, i) => W * .17 + i * (W * .66 / (steps - 1)));

  // 공
  const ball = () => svg('0 0 64 64', `<circle cx="32" cy="32" r="26" fill="#FFF4F8" stroke="#E5679A" stroke-width="3"/><path d="M8 30 q24 -14 48 0 M10 42 q22 12 44 0" fill="none" stroke="#8FE0C9" stroke-width="5"/><path d="M26 7 q-10 25 2 50" fill="none" stroke="#FFD36E" stroke-width="5"/><circle cx="22" cy="20" r="5" fill="#fff"/>`);
  return { food, item, need, room, kitchen, path, pathNodes, ball };
})();
