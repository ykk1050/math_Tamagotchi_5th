// 캐릭터 그림: 모두 SVG 코드로 직접 그림 (코드로 직접 만듦)
const Art = (() => {
  // 그라데이션은 문서에 한 번만 넣고 모든 그림이 같이 쓴다
  function installDefs() {
    if (document.getElementById('cn-defs')) return;
    const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    d.id = 'cn-defs'; d.setAttribute('width', '0'); d.setAttribute('height', '0');
    d.style.position = 'absolute';
    d.innerHTML = `<defs>
      <radialGradient id="cn-cloud" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#FBF9FF"/><stop offset="1" stop-color="#E7E0FF"/></radialGradient>
      <radialGradient id="cn-bun" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#FFF9FB"/><stop offset="1" stop-color="#FFE3EE"/></radialGradient>
      <linearGradient id="cn-egg-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#ECE6FF"/></linearGradient>
      <linearGradient id="cn-egg-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE6EF"/></linearGradient>
      <radialGradient id="cn-blush"><stop offset="0" stop-color="#F7A0C1" stop-opacity=".85"/><stop offset="1" stop-color="#F7A0C1" stop-opacity="0"/></radialGradient>
      <linearGradient id="cn-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D3E5FF"/></linearGradient>
      <linearGradient id="cn-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEFA8"/><stop offset="1" stop-color="#FFC24E"/></linearGradient>
      <linearGradient id="cn-rib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9CC0"/><stop offset="1" stop-color="#E5679A"/></linearGradient>
    </defs>`;
    document.body.appendChild(d);
  }
  const star = (x, y, s, rot = 0) =>
    `<polygon transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" points="0,-10 2.9,-3.4 10,-3.1 4.6,1.6 6.4,8.6 0,4.8 -6.4,8.6 -4.6,1.6 -10,-3.1 -2.9,-3.4" fill="url(#cn-star)" stroke="#E8A93C" stroke-width="1.4" stroke-linejoin="round"/>`;

  function face(mood, ink) {
    let eyes, mouth;
    if (mood === 'happy') {
      eyes = `<path d="M-12 3 Q-8.5 -2.5 -5 3 M5 3 Q8.5 -2.5 12 3" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M-4.5 8.5 Q0 15.5 4.5 8.5 Z" fill="#E26A97"/><path d="M-2.4 11.6 Q0 13.4 2.4 11.6" fill="#FFB3CC"/>`;
    } else if (mood === 'sad') {
      eyes = `<path d="M-12 1.5 Q-8.5 6 -5 1.5 M5 1.5 Q8.5 6 12 1.5" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M-3.5 12 Q0 9 3.5 12" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    } else if (mood === 'cry') {
      // 질끈 감은 눈(> <), 엉엉 우는 입, 흘러내리는 눈물
      eyes = `<path d="M-12.5 -0.5 L-6 3 L-12.5 6.5 M12.5 -0.5 L6 3 L12.5 6.5" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <g class="tears"><path class="tear" d="M-13 8 q-2.6 4.4 0 6.4 q2.6 -2 0 -6.4z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".7"/><path class="tear t2" d="M13 8 q-2.6 4.4 0 6.4 q2.6 -2 0 -6.4z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".7"/></g>`;
      mouth = `<path d="M-5 13.5 Q-5 7.5 0 7.5 Q5 7.5 5 13.5 Z" fill="#C9466F"/><path d="M-2.6 13.4 Q0 11 2.6 13.4" fill="#FF9CB8"/>`;
    } else if (mood === 'pout') {
      // 삐친 얼굴: 반쯤 감은 눈으로 옆을 흘깃, 부푼 볼, 삐죽 입
      eyes = `<path d="M-12.5 1 h8 M4.5 1 h8" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="-6.6" cy="3.6" r="2.2" fill="${ink}"/><circle cx="10.4" cy="3.6" r="2.2" fill="${ink}"/>`;
      mouth = `<path d="M-3.5 11.5 q1.75 -2.6 3.5 0 q1.75 2.6 3.5 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <ellipse cx="-15.5" cy="9.5" rx="6.6" ry="4.4" fill="#F7A0C1" opacity=".75"/><ellipse cx="15.5" cy="9.5" rx="6.6" ry="4.4" fill="#F7A0C1" opacity=".75"/>
        <g transform="translate(19 -13)" stroke="#E5679A" stroke-width="1.8" stroke-linecap="round"><path d="M-3 -1 q3 0 3 -3 M3 -1 q-3 0 -3 -3 M-3 3 q3 0 3 3 M3 3 q-3 0 -3 3" fill="none"/></g>`;
    } else if (mood === 'sleep') {
      eyes = `<path d="M-12 3 Q-8.5 5.5 -5 3 M5 3 Q8.5 5.5 12 3" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="0" cy="11" rx="1.8" ry="2.2" fill="${ink}" opacity=".7"/>`;
    } else {
      eyes = `<g class="eyes"><ellipse cx="-8.5" cy="2.5" rx="3.6" ry="4.4" fill="${ink}"/><ellipse cx="8.5" cy="2.5" rx="3.6" ry="4.4" fill="${ink}"/>
        <circle cx="-7.3" cy="0.9" r="1.5" fill="#fff"/><circle cx="9.7" cy="0.9" r="1.5" fill="#fff"/><circle cx="-9.6" cy="4.4" r=".7" fill="#fff"/><circle cx="7.4" cy="4.4" r=".7" fill="#fff"/></g>`;
      mouth = `<path d="M-3.2 9.5 Q0 12.8 3.2 9.5" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    }
    return `<ellipse cx="-15.5" cy="9.5" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="15.5" cy="9.5" rx="6" ry="3.8" fill="url(#cn-blush)"/>${eyes}${mouth}`;
  }

  // ---------- 구름 요정 ----------
  function cloudBody(mood) {
    const sh = [[-19, 5, 19], [0, -8, 23], [19, 5, 19]];
    const out = sh.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.6}"/>`).join('') + `<ellipse cx="0" cy="11" rx="35.6" ry="18.6"/>`;
    const inn = sh.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + `<ellipse cx="0" cy="11" rx="33" ry="16"/>`;
    let tear = mood === 'sad' ? `<path d="M19 12 q-3 5 0 7 q3 -2 0 -7z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".8"/>` : '';
    // 구름이 울면 몸 아래로 비가 내린다
    if (mood === 'cry') tear = `<g class="tears">${[-20, -8, 4, 16, 26].map((x, i) => `<path class="tear rain r${i}" d="M${x} 28 q-2.4 4.2 0 6 q2.4 -1.8 0 -6z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".7"/>`).join('')}</g>`;
    return `<g fill="#CFC4F6">${out}</g><g fill="url(#cn-cloud)">${inn}</g>
      <path d="M-26 -2 q4 -8 12 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
      <g transform="translate(0 4)">${face(mood, '#45346A')}</g>${tear}`;
  }
  const cloudWings = (s = 1) => `<g transform="scale(${s})">
    <path d="M-30 -2 C-50 -18 -62 -6 -54 6 C-48 14 -36 10 -30 4 Z" fill="url(#cn-wing)" stroke="#9EC2F2" stroke-width="2"/>
    <path d="M30 -2 C50 -18 62 -6 54 6 C48 14 36 10 30 4 Z" fill="url(#cn-wing)" stroke="#9EC2F2" stroke-width="2"/></g>`;

  function eggC(stage, mood) {
    const crack = stage >= 2;
    let peek = '';
    if (crack) {
      const ink = '#45346A';
      peek = mood === 'cry' ? `<path d="M-13 -20 L-7 -17 L-13 -14 M13 -20 L7 -17 L13 -14" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g class="tears"><path class="tear" d="M-14 -12 q-2 3.6 0 5 q2 -1.4 0 -5z" fill="#9CC8FF"/><path class="tear t2" d="M14 -12 q-2 3.6 0 5 q2 -1.4 0 -5z" fill="#9CC8FF"/></g>`
        : mood === 'pout' ? `<path d="M-13 -18 h7 M6 -18 h7" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="-7.5" cy="-15.6" r="2" fill="${ink}"/><circle cx="11.5" cy="-15.6" r="2" fill="${ink}"/>`
        : mood === 'happy'
        ? `<path d="M-13 -17 Q-9.5 -22 -6 -17 M6 -17 Q9.5 -22 13 -17" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        : `<g class="eyes"><ellipse cx="-9.5" cy="-17" rx="3.4" ry="4" fill="${ink}"/><ellipse cx="9.5" cy="-17" rx="3.4" ry="4" fill="${ink}"/><circle cx="-8.4" cy="-18.4" r="1.3" fill="#fff"/><circle cx="10.6" cy="-18.4" r="1.3" fill="#fff"/></g>`;
    }
    return `<g class="anim-egg">
      ${crack ? `<g fill="#fff" stroke="#CFC4F6" stroke-width="2"><circle cx="-14" cy="-50" r="7"/><circle cx="0" cy="-55" r="9"/><circle cx="14" cy="-50" r="7"/></g>` : ''}
      <ellipse cx="0" cy="10" rx="40" ry="50" fill="url(#cn-egg-c)" stroke="#C9BDF3" stroke-width="3"/>
      <g fill="#DCD3FB"><circle cx="-18" cy="22" r="9"/><circle cx="-4" cy="18" r="12"/><circle cx="12" cy="22" r="9"/><circle cx="24" cy="25" r="6"/><ellipse cx="2" cy="28" rx="28" ry="7"/></g>
      ${star(16, -8, .75, 12)}${star(-20, -2, .45, -10)}${star(26, 42, .35)}
      <path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${crack ? `<path d="M-38 -6 l9 -7 7 7 8 -8 8 8 8 -8 7 7 9 -6" fill="none" stroke="#9C8BE0" stroke-width="2.8" stroke-linejoin="round"/>` : ''}
      ${peek}
      ${crack ? `<ellipse cx="-17" cy="-9" rx="5" ry="2.8" fill="url(#cn-blush)"/><ellipse cx="17" cy="-9" rx="5" ry="2.8" fill="url(#cn-blush)"/>` : ''}
    </g>`;
  }

  function cloud(stage, mood = 'idle', acc = null) {
    if (stage <= 2) return wrap(eggC(stage, mood));
    const s = [0, 0, 0, 1.0, 1.16, 1.28, 1.34, 1.38, 1.42, 1.46, 1.5][stage] || 1.2;
    let back = '', front = '';
    if (stage >= 5) back += cloudWings(stage >= 7 ? 1.15 : .85);
    if (stage >= 4) front += star(15, -27, .62, 14);
    return wrap(`<g class="anim-float"><g transform="translate(0 ${50 - 30 * s}) scale(${s})">${back}${cloudBody(mood)}${front}${accSVG('cloud', acc)}</g></g>`);
  }

  // ---------- 아기 토끼 ----------
  const BS = '#EFA2C0', BW = 2.4;
  function bunnyEars(stage, mood) {
    const long = stage >= 4;
    const ry = long ? 17 : 10, cy = long ? -31 : -23;
    const rot = mood === 'sad' || mood === 'cry' ? 40 : mood === 'pout' ? 24 : mood === 'happy' ? -6 : 8;
    const ear = (sx) => `<g transform="translate(${sx * 8} -14) rotate(${sx * rot}) translate(${-sx * 8} 14)">
      <ellipse cx="${sx * 9}" cy="${cy}" rx="7" ry="${ry}" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/>
      <ellipse cx="${sx * 9}" cy="${cy + 1}" rx="3.2" ry="${ry - 6}" fill="#FAC9DB"/></g>`;
    return ear(-1) + ear(1);
  }
  function bunnyBody(stage, mood) {
    const foot = (x) => `<ellipse cx="${x}" cy="39" rx="7.5" ry="4.8" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/><ellipse cx="${x}" cy="39.6" rx="2.8" ry="1.9" fill="#FAC9DB"/>`;
    const armR = mood === 'happy' ? `<ellipse cx="14" cy="19" rx="4" ry="5.5" transform="rotate(-40 14 19)" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.2"/>` : `<ellipse cx="13" cy="26" rx="4" ry="5.4" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.2"/>`;
    const armL = mood === 'happy' ? `<ellipse cx="-14" cy="19" rx="4" ry="5.5" transform="rotate(40 -14 19)" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.2"/>` : `<ellipse cx="-13" cy="26" rx="4" ry="5.4" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.2"/>`;
    return `<circle cx="16" cy="33" r="6" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.2"/>
      <ellipse cx="0" cy="28" rx="15" ry="12.5" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/>
      <ellipse cx="0" cy="30" rx="8" ry="6.5" fill="#FFF3F7"/>
      ${foot(-8.5)}${foot(8.5)}${armL}${armR}`;
  }
  function bunnyHead(mood) {
    const ink = '#5E2B47';
    const f = face(mood, ink).replace(/M-3\.2 9\.5 Q0 12\.8 3\.2 9\.5/, 'M-4 10 Q-2 12.6 0 10 Q2 12.6 4 10');
    return `<circle r="23" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/>
      <path d="M-15 -11 q5 -7 12 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${f}<path d="M-1.8 6.6 L1.8 6.6 L0 8.6 Z" fill="#E26A97" stroke="#E26A97" stroke-width="1" stroke-linejoin="round"/>`;
  }
  const ribbon = `<g transform="translate(13 -18) rotate(12)"><path d="M0 0 C-6 -9 -13 -7 -12 0 C-13 7 -6 9 0 0 Z M0 0 C6 -9 13 -7 12 0 C13 7 6 9 0 0 Z" fill="url(#cn-rib)" stroke="#C9578A" stroke-width="1.3"/><circle r="3.2" fill="#D9628E"/></g>`;

  function eggB(stage, mood) {
    const crack = stage >= 2;
    let peek = '';
    if (crack) {
      const ink = '#5E2B47';
      peek = mood === 'cry' ? `<path d="M-13 -20 L-7 -17 L-13 -14 M13 -20 L7 -17 L13 -14" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g class="tears"><path class="tear" d="M-14 -12 q-2 3.6 0 5 q2 -1.4 0 -5z" fill="#9CC8FF"/><path class="tear t2" d="M14 -12 q-2 3.6 0 5 q2 -1.4 0 -5z" fill="#9CC8FF"/></g>`
        : mood === 'pout' ? `<path d="M-13 -18 h7 M6 -18 h7" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="-7.5" cy="-15.6" r="2" fill="${ink}"/><circle cx="11.5" cy="-15.6" r="2" fill="${ink}"/>`
        : mood === 'happy'
        ? `<path d="M-13 -17 Q-9.5 -22 -6 -17 M6 -17 Q9.5 -22 13 -17" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
        : `<g class="eyes"><ellipse cx="-9.5" cy="-17" rx="3.4" ry="4" fill="${ink}"/><ellipse cx="9.5" cy="-17" rx="3.4" ry="4" fill="${ink}"/><circle cx="-8.4" cy="-18.4" r="1.3" fill="#fff"/><circle cx="10.6" cy="-18.4" r="1.3" fill="#fff"/></g>`;
    }
    const seed = (x, y, r) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -3.4 C2.4 -1 2.2 2.6 0 3.4 C-2.2 2.6 -2.4 -1 0 -3.4Z" fill="#F7A9C6"/>`;
    const feet = crack ? `<g><ellipse cx="-14" cy="58" rx="9" ry="5.6" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/><ellipse cx="14" cy="58" rx="9" ry="5.6" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/><ellipse cx="-14" cy="58.8" rx="3.2" ry="2.2" fill="#FAC9DB"/><ellipse cx="14" cy="58.8" rx="3.2" ry="2.2" fill="#FAC9DB"/></g>` : '';
    return `<g class="anim-egg">${feet}
      <ellipse cx="0" cy="8" rx="40" ry="50" fill="url(#cn-egg-b)" stroke="${BS}" stroke-width="3"/>
      <path d="M-16 -42 q8 -10 16 -6 q8 -4 16 6 q-8 4 -16 2 q-8 2 -16 -2z" fill="#9FDDB4" stroke="#6CC08F" stroke-width="1.6" stroke-linejoin="round"/>
      ${seed(-20, 8, -20)}${seed(18, 0, 15)}${seed(-4, 24, 5)}${seed(22, 30, 30)}${seed(-22, 36, -35)}${seed(6, 42, 0)}${seed(-6, -6, 10)}
      <path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
      ${crack ? `<path d="M-38 -6 l9 -7 7 7 8 -8 8 8 8 -8 7 7 9 -6" fill="none" stroke="#E07FA6" stroke-width="2.8" stroke-linejoin="round"/>` : ''}
      ${peek}
      ${crack ? `<ellipse cx="-17" cy="-9" rx="5" ry="2.8" fill="url(#cn-blush)"/><ellipse cx="17" cy="-9" rx="5" ry="2.8" fill="url(#cn-blush)"/>` : ''}
    </g>`;
  }

  function bunny(stage, mood = 'idle', acc = null) {
    if (stage <= 2) return wrap(eggB(stage, mood));
    const s = [0, 0, 0, 1.05, 1.16, 1.24, 1.28, 1.32, 1.36, 1.4, 1.44][stage] || 1.2;
    const ty = 60 - 44 * s;
    const extra = stage >= 5 && acc !== 'bow' ? ribbon : '';
    return wrap(`<g class="anim-breathe"><g transform="translate(0 ${ty}) scale(${s})">${bunnyBody(stage, mood)}${bunnyEars(stage, mood)}${bunnyHead(mood)}${extra}${accSVG('bunny', acc)}</g></g>`);
  }

  function wrap(inner) {
    return `<svg viewBox="-80 -92 160 156" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  }
  // 친구가 쓰는 장식 (친구 그림의 좌표 안에서 그린다)
  const ACC = {
    flower: () => `<g>${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 4.6}" cy="${Math.sin(a * Math.PI / 180) * 4.6}" r="3.8" fill="#FFB3CF" stroke="#E5679A" stroke-width=".9"/>`).join('')}<circle r="2.8" fill="#FFD36E" stroke="#E8A93C" stroke-width=".8"/></g>`,
    crown: () => `<g><path d="M-11 4 L-11 -6 L-5.5 -1 L0 -10 L5.5 -1 L11 -6 L11 4 Z" fill="url(#cn-star)" stroke="#D9962E" stroke-width="1.4" stroke-linejoin="round"/><circle cx="0" cy="0" r="1.8" fill="#F28DB2"/><circle cx="-6" cy="1.5" r="1.2" fill="#8FD8C8"/><circle cx="6" cy="1.5" r="1.2" fill="#8FD8C8"/></g>`,
    berryhat: () => `<g><path d="M-19 3 C-19 -14 19 -14 19 3 Z" fill="#F2678F" stroke="#C9466F" stroke-width="1.6"/><path d="M-21 3 h42" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"/><g fill="#FFE29A"><circle cx="-9" cy="-4" r="1"/><circle cx="-2" cy="-8" r="1"/><circle cx="6" cy="-5" r="1"/><circle cx="11" cy="-1" r="1"/><circle cx="-12" cy="0" r="1"/></g><path d="M-5 -11 l3 -4 2 3 3 -4 1 5z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1"/></g>`,
    scarf: () => `<g><rect x="-20" y="-4.5" width="40" height="9" rx="4.5" fill="#9FD9F2" stroke="#5DB3D8" stroke-width="1.4"/><path d="M8 3 l5 11 l6 -2 l-4 -10z" fill="#9FD9F2" stroke="#5DB3D8" stroke-width="1.4" stroke-linejoin="round"/><path d="M-12 -4 v9 M-4 -4 v9 M4 -4 v9" stroke="#fff" stroke-width="1.6" opacity=".8"/></g>`,
    bow: () => `<g><path d="M0 0 C-6 -9 -13 -7 -12 0 C-13 7 -6 9 0 0 Z M0 0 C6 -9 13 -7 12 0 C13 7 6 9 0 0 Z" fill="url(#cn-rib)" stroke="#C9578A" stroke-width="1.3"/><circle r="3.2" fill="#D9628E"/></g>`
  };
  const ACC_POS = {
    cloud: { flower: [-16, -24, 1], crown: [0, -33, 1.1], berryhat: [0, -24, 1.05], scarf: [0, 22, 1.25], bow: [-16, -25, .9] },
    bunny: { flower: [-14, -14, .9], crown: [0, -21, .95], berryhat: [0, -15, 1], scarf: [0, 17, .9], bow: [13, -18, 1] }
  };
  function accSVG(kind, acc) {
    if (!acc || !ACC[acc]) return '';
    const [x, y, sc] = ACC_POS[kind][acc];
    return `<g transform="translate(${x} ${y}) scale(${sc})">${ACC[acc]()}</g>`;
  }
  function draw(kind, stage, mood, acc) { installDefs(); return kind === 'bunny' ? bunny(stage, mood, acc) : cloud(stage, mood, acc); }

  // ---------- 작은 그림 ----------
  const icons = {
    candy: `<svg viewBox="-20 -20 40 40">${star(0, 0, 1.6, 8)}<circle cx="-5" cy="-4" r="2" fill="#fff" opacity=".8"/></svg>`,
    berry: `<svg viewBox="-20 -20 40 40"><path d="M0 -8 C12 -10 16 0 10 10 C6 16 -6 16 -10 10 C-16 0 -12 -10 0 -8Z" fill="#F2678F" stroke="#C9466F" stroke-width="1.5"/><path d="M-7 -10 l4 3 3 -5 3 5 4 -3 -2 5 -10 0z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1.2" stroke-linejoin="round"/><g fill="#FFE29A"><circle cx="-4" cy="0" r="1"/><circle cx="3" cy="-1" r="1"/><circle cx="0" cy="5" r="1"/><circle cx="6" cy="5" r="1"/><circle cx="-6" cy="6" r="1"/></g></svg>`,
    hand: `<svg viewBox="0 0 64 64"><path d="M20 34V16a4 4 0 0 1 8 0v14V11a4 4 0 0 1 8 0v19V14a4 4 0 0 1 8 0v20l3-5a4 4 0 0 1 7 4l-8 15c-3 6-8 9-15 9h-3c-8 0-14-6-14-14v-9a4 4 0 0 1 8 0" fill="#FFE3D3" stroke="#E79A7C" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 6 l2 4 4 1 -4 1 -2 4 -2 -4 -4 -1 4 -1z" fill="#F7A0C1"/></svg>`,
    bubble: `<svg viewBox="0 0 64 64"><circle cx="26" cy="36" r="18" fill="#EEF4FF" stroke="#A996F0" stroke-width="2.5"/><circle cx="46" cy="18" r="10" fill="#FFEFF5" stroke="#F28DB2" stroke-width="2.5"/><circle cx="20" cy="29" r="4" fill="#fff"/><circle cx="43" cy="15" r="2.4" fill="#fff"/></svg>`,
    moon: `<svg viewBox="0 0 64 64"><path d="M40 8 A24 24 0 1 0 56 44 A19 19 0 1 1 40 8Z" fill="url(#cn-star)" stroke="#E8A93C" stroke-width="2.5" stroke-linejoin="round"/><path d="M48 14 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z" fill="#fff"/></svg>`
  };
  function icon(n) { installDefs(); return icons[n] || ''; }

  return { draw, icon, star, ACC, installDefs };
})();
