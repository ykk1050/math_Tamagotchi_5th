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

  // ---------- 새 가구 그림 (64×64, 아래 가운데가 바닥에 닿는 점) ----------
  Object.assign(DECOR, {
    chair: `<path d="M18 8 h28 a6 6 0 0 1 6 6 v20 h-40 v-20 a6 6 0 0 1 6 -6z" fill="#FFC7D9" stroke="#E5679A" stroke-width="2.4"/><path d="M32 14 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z" fill="#fff"/><rect x="8" y="34" width="48" height="10" rx="5" fill="#FFE0EA" stroke="#E5679A" stroke-width="2.4"/><path d="M14 44 v18 M50 44 v18" stroke="#E5679A" stroke-width="4" stroke-linecap="round"/>`,
    table: `<ellipse cx="32" cy="22" rx="28" ry="9" fill="#FFF4E0" stroke="#D9AE52" stroke-width="2.4"/><path d="M6 22 v4 a26 9 0 0 0 52 0 v-4" fill="#F2D3B6" stroke="#D9AE52" stroke-width="2.4"/><path d="M32 34 v26 M22 62 h20" stroke="#D9AE52" stroke-width="4" stroke-linecap="round"/><path d="M26 18 q6 -8 12 0" fill="#F7A0C1"/><circle cx="32" cy="12" r="4" fill="#F2678F"/>`,
    teddy: `<circle cx="18" cy="14" r="7" fill="#D9A276" stroke="#A8724C" stroke-width="2"/><circle cx="46" cy="14" r="7" fill="#D9A276" stroke="#A8724C" stroke-width="2"/><ellipse cx="32" cy="48" rx="18" ry="15" fill="#D9A276" stroke="#A8724C" stroke-width="2.4"/><circle cx="32" cy="24" r="15" fill="#E3B48A" stroke="#A8724C" stroke-width="2.4"/><ellipse cx="32" cy="29" rx="6" ry="4.5" fill="#FFF1DE"/><circle cx="26" cy="22" r="2" fill="#4A3552"/><circle cx="38" cy="22" r="2" fill="#4A3552"/><ellipse cx="32" cy="27" rx="2" ry="1.4" fill="#4A3552"/><path d="M24 38 l8 4 l8 -4 l-2 6 h-12z" fill="#F7A0C1"/><ellipse cx="20" cy="60" rx="7" ry="4" fill="#E3B48A" stroke="#A8724C" stroke-width="2"/><ellipse cx="44" cy="60" rx="7" ry="4" fill="#E3B48A" stroke="#A8724C" stroke-width="2"/>`,
    books: `<rect x="8" y="48" width="48" height="12" rx="2" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="2"/><rect x="12" y="36" width="42" height="12" rx="2" fill="#FFC7D9" stroke="#E5679A" stroke-width="2"/><rect x="6" y="24" width="44" height="12" rx="2" fill="#FFE29A" stroke="#D9AE52" stroke-width="2"/><path d="M14 30 h24 M18 42 h22 M14 54 h28" stroke="#fff" stroke-width="2"/><rect x="40" y="10" width="8" height="14" rx="2" fill="#9FDDB4" stroke="#4FAA6C" stroke-width="1.8"/>`,
    cactus: `<path d="M18 46 h28 l-4 16 h-20z" fill="#FFB9A6" stroke="#D9776A" stroke-width="2.2" stroke-linejoin="round"/><path d="M26 46 v-28 a6 6 0 0 1 12 0 v28" fill="#8FD8A8" stroke="#4FAA6C" stroke-width="2.2"/><path d="M26 34 h-6 a4 4 0 0 1 -4 -4 v-6 a3 3 0 0 1 6 0 v4 h4 M38 30 h6 a4 4 0 0 0 4 -4 v-4 a3 3 0 0 0 -6 0 v2 h-4" fill="#8FD8A8" stroke="#4FAA6C" stroke-width="2.2"/><circle cx="32" cy="12" r="4" fill="#F7A0C1"/>`,
    heart: `<path d="M32 60 s-26 -14 -26 -32 c0 -10 8 -16 15 -16 c5 0 9 3 11 7 c2 -4 6 -7 11 -7 c7 0 15 6 15 16 c0 18 -26 32 -26 32z" fill="#FFB3CF" stroke="#E5679A" stroke-width="2.6"/><path d="M18 26 q4 -8 10 -6" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    mobile: `<path d="M32 2 v10 M10 14 h44" stroke="#C99A6E" stroke-width="2.4" stroke-linecap="round"/><path d="M14 14 v16 M32 14 v26 M50 14 v14" stroke="#B9A7C4" stroke-width="1.6"/><path d="M14 30 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1z" fill="#FFD36E"/><path d="M32 40 a8 8 0 1 0 8 10 a6 6 0 1 1 -8 -10z" fill="#C9B8FF"/><g fill="#fff" stroke="#9EC2F2" stroke-width="1.4"><circle cx="46" cy="32" r="5"/><circle cx="53" cy="31" r="6"/><circle cx="58" cy="34" r="4"/></g>`,
    lights: `<path d="M2 14 q30 22 60 0" fill="none" stroke="#8C6248" stroke-width="1.6"/>${[[8, 18, '#F7A0C1'], [18, 24, '#FFD36E'], [30, 26, '#8FE0C9'], [42, 24, '#B9A7F5'], [54, 18, '#9EC2F2']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y + 6}" rx="3.6" ry="5" fill="${c}"/><circle cx="${x}" cy="${y + 6}" r="7" fill="${c}" opacity=".3"/>`).join('')}`,
    piano: `<rect x="6" y="14" width="52" height="34" rx="6" fill="#FFF4F8" stroke="#E5679A" stroke-width="2.4"/><rect x="10" y="30" width="44" height="12" fill="#fff" stroke="#C9A9B8" stroke-width="1.4"/>${[16, 22, 34, 40, 46].map(x => `<rect x="${x}" y="30" width="3.4" height="7" fill="#4A3552"/>`).join('')}<path d="M12 48 v14 M52 48 v14" stroke="#E5679A" stroke-width="4" stroke-linecap="round"/><path d="M18 22 q4 -6 8 0 M36 20 l6 -4 v8" stroke="#B9A7F5" stroke-width="2" fill="none"/>`,
    vase: `<path d="M24 30 q-10 14 0 30 h16 q10 -16 0 -30z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="2.2"/><path d="M26 30 h12" stroke="#5D8FD0" stroke-width="2.2"/><path d="M32 30 v-14 M28 30 l-6 -12 M36 30 l6 -10" stroke="#4FAA6C" stroke-width="2"/>${[[32, 14, '#FFD36E'], [22, 16, '#F7A0C1'], [42, 18, '#C9B8FF']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x}" cy="${y}" r="2" fill="#fff"/>`).join('')}`,
    toybox: `<rect x="6" y="26" width="52" height="34" rx="6" fill="#FFE29A" stroke="#D9AE52" stroke-width="2.4"/><rect x="4" y="20" width="56" height="10" rx="4" fill="#FFB9A6" stroke="#D9776A" stroke-width="2.2"/><path d="M26 40 l2 4 4 .5 -3 3 1 4 -4 -2 -4 2 1 -4 -3 -3 4 -.5z" fill="#fff"/><circle cx="44" cy="44" r="6" fill="#9EC2F2"/><circle cx="16" cy="14" r="7" fill="#F7A0C1" stroke="#E5679A" stroke-width="1.6"/><rect x="40" y="8" width="10" height="12" rx="2" fill="#8FE0C9"/>`,
    mirror: `<ellipse cx="32" cy="30" rx="20" ry="26" fill="#FFF4E0" stroke="#D9AE52" stroke-width="3"/><ellipse cx="32" cy="30" rx="15" ry="21" fill="#DDEBFF"/><path d="M24 20 l8 -6 M24 30 l14 -12" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M32 4 l2 -3 2 3" fill="#F7A0C1"/>`
  });
  // 벽지·바닥
  const WALLS = {
    dots: { name: '물방울 벽지' }, stripe: { name: '줄무늬 벽지' }, star: { name: '별 벽지' }, heart: { name: '하트 벽지' }, sky: { name: '하늘 벽지' }
  };
  const FLOORS = { wood: { name: '나무 바닥' }, check: { name: '체크 타일' }, mint: { name: '민트 카펫' }, night: { name: '별밤 바닥' } };
  function wallDefs(style, kind) {
    const w = kind === 'bunny' ? ['#FFF1F5', '#FFE4EE', '#FBD3E1'] : ['#F4F0FF', '#E9E2FF', '#DCD3FB'];
    const pat = {
      dots: `<circle cx="11" cy="11" r="3.4" fill="${w[2]}"/><circle cx="34" cy="34" r="3.4" fill="${w[2]}"/>`,
      stripe: `<rect width="23" height="46" fill="${w[2]}" opacity=".55"/>`,
      star: `<path d="M12 4 l2 5 5 .5 -4 3 1.4 5 -4.4 -2.6 -4.4 2.6 1.4 -5 -4 -3 5 -.5z" fill="#FFE29A"/><circle cx="34" cy="32" r="2" fill="${w[2]}"/>`,
      heart: `<path d="M12 18 s-7 -4 -7 -9 c0 -3 2 -4 4 -4 c1.4 0 2.4 1 3 2 c.6 -1 1.6 -2 3 -2 c2 0 4 1 4 4 c0 5 -7 9 -7 9z" fill="#F7A0C1" opacity=".7"/><circle cx="34" cy="34" r="2" fill="${w[2]}"/>`,
      sky: `<g fill="#fff" opacity=".9"><circle cx="10" cy="14" r="6"/><circle cx="17" cy="11" r="7"/><circle cx="24" cy="14" r="5"/></g>`
    }[style] || '';
    const bg = style === 'sky' ? ['#D6EBFF', '#EAF4FF'] : [w[0], w[1]];
    return `<linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient><pattern id="rp" width="46" height="46" patternUnits="userSpaceOnUse">${pat}</pattern>`;
  }
  function floorSVG(style, y0) {
    const h = 640 - y0;
    if (style === 'check') return `<rect y="${y0}" width="1000" height="${h}" fill="#FFF6F0"/>${Array.from({ length: 13 }, (_, i) => Array.from({ length: 4 }, (_, j) => (i + j) % 2 ? `<rect x="${i * 80}" y="${y0 + j * 55}" width="80" height="55" fill="#FFD9E4" opacity=".7"/>` : '').join('')).join('')}`;
    if (style === 'mint') return `<rect y="${y0}" width="1000" height="${h}" fill="#CFF0E4"/>${Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 1000}" cy="${y0 + 20 + (i * 53) % (h - 30)}" r="3" fill="#fff" opacity=".6"/>`).join('')}`;
    if (style === 'night') return `<rect y="${y0}" width="1000" height="${h}" fill="#5F5A9E"/>${Array.from({ length: 30 }, (_, i) => `<circle cx="${(i * 131) % 1000}" cy="${y0 + 14 + (i * 71) % (h - 20)}" r="${i % 3 ? 2 : 3.4}" fill="#FFF3B0"/>`).join('')}`;
    return `<rect y="${y0}" width="1000" height="${h}" fill="url(#rf)"/>${[0, 1, 2, 3, 4].map(i => `<path d="M0 ${y0 + 40 + i * 38} H1000" stroke="#E9CDB8" stroke-width="2" opacity=".6"/>`).join('')}`;
  }
  // 놓는 자리 규칙: 벽에 거는 것, 바닥에 놓는 것, 러그
  const LAYER = { shell: 'wall', lamp: 'wall', frame: 'wall', mobile: 'wall', lights: 'wall', mirror: 'wall', rug: 'rug' };
  const SCALE = { shell: .9, plant: 1.45, lamp: .9, cushion: 1.5, frame: 1.4, chair: 1.7, table: 1.9, teddy: 1.5, books: 1.3, cactus: 1.4, heart: 1.3, mobile: 1.7, lights: 2.6, piano: 2.2, vase: 1.2, toybox: 1.7, mirror: 1.7 };
  const layerOf = (id) => LAYER[id] || 'floor';
  const scaleOf = (id) => SCALE[id] || 1.4;
  // 처음 놓는 자리 (예전 정해진 자리와 같게)
  const DEF_POS = { shell: [657, 274], plant: [758, 429], lamp: [379, 208], cushion: [668, 572], frame: [485, 156], rug: [520, 590] };
  function clampPos(id, x, y) {
    const L = layerOf(id);
    x = Math.max(60, Math.min(940, x));
    if (L === 'wall') y = Math.max(70, Math.min(405, y)); else if (L === 'rug') y = Math.max(520, Math.min(625, y)); else y = Math.max(455, Math.min(632, y));
    return [Math.round(x), Math.round(y)];
  }
  // 그림 상자(방 좌표): 놓인 점은 아래 가운데
  function itemBox(id, x, y) {
    if (id === 'rug') return [x - 250, y - 70, x + 250, y];
    const s = scaleOf(id) * 64; return [x - s / 2, y - s, x + s / 2, y];
  }
  function itemSVG(id, x, y) {
    if (id === 'rug') return `<g transform="translate(${x} ${y - 32})"><ellipse rx="250" ry="58" fill="#FFC7D9" stroke="#E5679A" stroke-width="5"/><ellipse rx="190" ry="40" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="14 12"/></g>`;
    const s = scaleOf(id); return `<g transform="translate(${x - 32 * s} ${y - 64 * s}) scale(${s})">${DECOR[id]}</g>`;
  }

  // ---------- 친구의 방 (내 방 / 다락방) ----------
  // o = { kind, place:{id:[x,y]}, night, weather, wall, floor, roomId, balloons, hide }
  function room(o) {
    const kind = o.kind, night = o.night, weather = o.weather || 'sun', attic = o.roomId === 'attic';
    const sky = night ? ['#4E4A8C', '#8E7CC4'] : ['#BFE3FF', '#EAF6FF'];
    const bedC = kind === 'bunny' ? '#FFC7D9' : '#D9CCFF', bedS = kind === 'bunny' ? '#E5679A' : '#8F7BE0';
    const place = o.place || {};
    const ids = Object.keys(place).filter(k => k !== o.hide && DECOR[k] !== undefined);
    const rugs = ids.filter(k => layerOf(k) === 'rug'), walls = ids.filter(k => layerOf(k) === 'wall'), floors = ids.filter(k => layerOf(k) === 'floor').sort((a, b) => place[a][1] - place[b][1]);
    const draw = (k) => itemSVG(k, place[k][0], place[k][1]);
    const weatherIn = (x0, y0, w, h) => `
        ${weather === 'rain' ? `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#8E9BBD" opacity=".55"/><g class="wrain" stroke="#DCEBFF" stroke-width="3" stroke-linecap="round">${Array.from({ length: 9 }, (_, i) => `<path d="M${x0 + 14 + i * (w / 9)} ${y0 + 30 + (i % 3) * 30} l-6 16"/>`).join('')}</g>` : ''}
        ${weather === 'snow' ? `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" fill="#C9D6F0" opacity=".45"/><g class="wsnow" fill="#fff">${Array.from({ length: 10 }, (_, i) => `<circle cx="${x0 + 12 + (i * 37) % (w - 20)}" cy="${y0 + 20 + (i * 53) % (h - 30)}" r="4"/>`).join('')}</g>` : ''}
        ${weather === 'rainbow' ? `<g fill="none" stroke-width="9" opacity=".9" transform="translate(${x0 + w / 2} ${y0 + h})">${['#F7A0C1', '#FFD36E', '#8FE0C9', '#9EC2F2'].map((c, i) => `<path d="M${-w * .42 + i * 12} 0 a${w * .42 - i * 12} ${w * .42 - i * 12} 0 0 1 ${2 * (w * .42 - i * 12)} 0" stroke="${c}"/>`).join('')}</g>` : ''}`;
    const sun = (cx, cy) => night ? `<circle cx="${cx}" cy="${cy}" r="18" fill="#FFF3B0"/><circle cx="${cx - 8}" cy="${cy - 6}" r="16" fill="url(#rs)"/>` : `<circle cx="${cx}" cy="${cy}" r="20" fill="#FFE59A"/>`;
    let base;
    if (!attic) {
      base = `
      <rect width="1000" height="430" fill="url(#rw)"/><rect width="1000" height="430" fill="url(#rp)"/>
      <rect y="410" width="1000" height="24" fill="#fff" opacity=".9"/>
      ${floorSVG(o.floor, 430)}
      <g transform="translate(-40 0)"><rect x="590" y="70" width="250" height="200" rx="26" fill="#fff"/>
      <rect x="606" y="86" width="218" height="168" rx="18" fill="url(#rs)"/>
      ${sun(780, 128)}${night ? [[650, 120], [700, 170], [740, 110], [800, 200], [668, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff"/>`).join('') : '<g fill="#fff"><circle cx="660" cy="190" r="16"/><circle cx="682" cy="180" r="20"/><circle cx="704" cy="192" r="15"/></g>'}
      <clipPath id="wclip"><rect x="606" y="86" width="218" height="168" rx="18"/></clipPath>
      <g clip-path="url(#wclip)">${weatherIn(600, 80, 230, 180)}</g>
      <path d="M715 86 V254 M606 170 H824" stroke="#fff" stroke-width="8"/>
      <path d="M580 64 h270" stroke="${bedS}" stroke-width="8" stroke-linecap="round" opacity=".5"/>
      <path d="M584 68 q20 80 -2 200 q40 -60 30 -200z" fill="${bedC}" opacity=".9"/>
      <path d="M846 68 q-20 80 2 200 q-40 -60 -30 -200z" fill="${bedC}" opacity=".9"/>
      <rect x="575" y="270" width="280" height="16" rx="8" fill="#fff"/></g>
      <rect x="210" y="205" width="230" height="14" rx="7" fill="#F2D3B6"/>
      <g transform="translate(230 150)"><rect width="22" height="55" rx="4" fill="#C9B8FF"/><rect x="26" y="8" width="18" height="47" rx="4" fill="#FFC7D9"/><rect x="48" y="2" width="20" height="53" rx="4" fill="#9FDDB4"/></g>
      ${place.lamp ? '' : `<circle cx="380" cy="190" r="14" fill="#FFE59A" opacity=".8"/>`}
      ${rugs.length ? '' : `<ellipse cx="520" cy="560" rx="250" ry="58" fill="${kind === 'bunny' ? '#FFE0EA' : '#E9E2FF'}"/><ellipse cx="520" cy="560" rx="200" ry="40" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="12 12" opacity=".8"/>`}
      ${rugs.map(draw).join('')}
      <g transform="translate(170 352) scale(.86)">
        <rect x="0" y="60" width="250" height="100" rx="30" fill="#fff" stroke="${bedS}" stroke-width="5" opacity=".95"/>
        <rect x="14" y="40" width="80" height="44" rx="20" fill="#fff" stroke="${bedS}" stroke-width="4"/>
        <path d="M70 70 h170 a14 14 0 0 1 0 28 v40 h-170z" fill="${bedC}"/>
        <path d="M70 100 h184" stroke="#fff" stroke-width="5" stroke-dasharray="10 10" opacity=".8"/>
        <rect x="10" y="150" width="20" height="26" rx="6" fill="${bedS}" opacity=".6"/><rect x="222" y="150" width="20" height="26" rx="6" fill="${bedS}" opacity=".6"/>
      </g>`;
    } else {
      // 다락방: 비스듬한 지붕, 동그란 창, 나무 기둥
      base = `
      <rect width="1000" height="430" fill="url(#rw)"/><rect width="1000" height="430" fill="url(#rp)"/>
      <rect y="410" width="1000" height="24" fill="#fff" opacity=".9"/>
      ${floorSVG(o.floor, 430)}
      <circle cx="500" cy="170" r="92" fill="#fff"/><circle cx="500" cy="170" r="78" fill="url(#rs)"/>
      ${sun(530, 140)}
      <clipPath id="wclip"><circle cx="500" cy="170" r="78"/></clipPath>
      <g clip-path="url(#wclip)">${weatherIn(420, 90, 160, 160)}</g>
      <path d="M500 92 V248 M422 170 H578" stroke="#fff" stroke-width="7"/>
      ${rugs.length ? '' : `<ellipse cx="520" cy="570" rx="230" ry="52" fill="#F7E7C9"/>`}
      ${rugs.map(draw).join('')}
      <path d="M0 0 L300 0 L0 330 Z" fill="#C99A6E"/><path d="M1000 0 L700 0 L1000 330 Z" fill="#C99A6E"/>
      <path d="M0 330 L300 0 M1000 330 L700 0" stroke="#A8724C" stroke-width="12"/>
      <path d="M0 140 L140 0 M1000 140 L860 0" stroke="#A8724C" stroke-width="6" opacity=".7"/>
      <rect x="40" y="250" width="16" height="190" fill="#A8724C"/><rect x="944" y="250" width="16" height="190" fill="#A8724C"/>`;
    }
    return svg('0 0 1000 640', `
      <defs>${wallDefs(o.wall || 'dots', kind)}
        <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E6D6"/><stop offset="1" stop-color="#F1D6C2"/></linearGradient>
        <linearGradient id="rs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
      </defs>
      ${base}
      ${walls.map(draw).join('')}
      ${o.balloons ? [['#F7A0C1', 470, 80], ['#FFD36E', 500, 60], ['#9EC2F2', 530, 86]].map(([c, x, y]) => `<g transform="translate(${x} ${y})"><path d="M0 60 q-6 18 4 40" fill="none" stroke="#B9A7C4" stroke-width="2"/><ellipse cx="0" cy="30" rx="22" ry="28" fill="${c}"/><ellipse cx="-8" cy="20" rx="5" ry="8" fill="#fff" opacity=".5"/></g>`).join('') + '<path d="M420 60 q90 40 180 0" fill="none" stroke="#F7A0C1" stroke-width="4"/>' + [440, 470, 500, 530, 560, 590].map((x, i) => `<path d="M${x} ${70 + Math.sin(i) * 6} l10 22 l10 -22z" fill="${['#FFD36E', '#8FE0C9', '#B9A7F5'][i % 3]}"/>`).join('') : ''}
      ${floors.map(draw).join('')}
      ${night ? '<rect width="1000" height="640" fill="#3E3570" opacity=".22"/>' : ''}
    `, 'xMidYMax slice');
  }
  // 벽지·바닥 견본 그림
  function swatch(type, style, kind) {
    if (type === 'wall') return svg('0 0 92 92', `<defs>${wallDefs(style, kind)}</defs><rect width="92" height="92" fill="url(#rw)"/><rect width="92" height="92" fill="url(#rp)"/>`).replace(/id="r([wp])"/g, `id="sw$1${style}"`).replace(/url\(#r([wp])\)/g, `url(#sw$1${style})`);
    return svg('0 380 1000 260', `<defs><linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8E6D6"/><stop offset="1" stop-color="#F1D6C2"/></linearGradient></defs>${floorSVG(style, 430)}`, 'xMidYMid slice');
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
  // 꾸미기 모드에서 끌 때 손가락을 따라다니는 가구 그림
  function itemAlone(id) {
    if (id === 'rug') return svg('-250 -70 500 70', `<ellipse cx="0" cy="-32" rx="250" ry="58" fill="#FFC7D9" stroke="#E5679A" stroke-width="5"/><ellipse cx="0" cy="-32" rx="190" ry="40" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="14 12"/>`, 'none');
    return svg('0 0 64 64', DECOR[id] || '', 'none');
  }
  return { food, item, need, room, kitchen, path, pathNodes, ball, itemBox, itemAlone, clampPos, layerOf, DEF_POS, WALLS, FLOORS, swatch };
})();
