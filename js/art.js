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
      <radialGradient id="cn-pup" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".65" stop-color="#FFF6E8"/><stop offset="1" stop-color="#F3DDBF"/></radialGradient>
      <radialGradient id="cn-kit" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FFFCF6"/><stop offset=".65" stop-color="#FFE9D0"/><stop offset="1" stop-color="#FFCB98"/></radialGradient>
      <linearGradient id="cn-egg-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFEFD8"/></linearGradient>
      <linearGradient id="cn-egg-k" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE6CC"/></linearGradient>
      <radialGradient id="cn-dra" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="#FBFDFF"/><stop offset=".62" stop-color="#DCEEFF"/><stop offset="1" stop-color="#A9D0F5"/></radialGradient>
      <linearGradient id="cn-egg-d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D9ECFF"/></linearGradient>
      <linearGradient id="cn-egg-c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#ECE6FF"/></linearGradient>
      <linearGradient id="cn-egg-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#FFE6EF"/></linearGradient>
      <radialGradient id="cn-blush"><stop offset="0" stop-color="#F7A0C1" stop-opacity=".85"/><stop offset="1" stop-color="#F7A0C1" stop-opacity="0"/></radialGradient>
      <linearGradient id="cn-wing" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D3E5FF"/></linearGradient>
      <linearGradient id="cn-star" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEFA8"/><stop offset="1" stop-color="#FFC24E"/></linearGradient>
      <linearGradient id="cn-wing2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#FFF6D6"/><stop offset="1" stop-color="#FFE08A"/></linearGradient>
      <linearGradient id="cn-aur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9EEBC9"/><stop offset=".5" stop-color="#A9C8FF"/><stop offset="1" stop-color="#D7A8F5"/></linearGradient>
      <radialGradient id="cn-glow"><stop offset="0" stop-color="#FFF4B8" stop-opacity=".95"/><stop offset="1" stop-color="#FFF4B8" stop-opacity="0"/></radialGradient>
      <linearGradient id="cn-rib" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF9CC0"/><stop offset="1" stop-color="#E5679A"/></linearGradient>
      ${tintDefs()}
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
    } else if (mood === 'chomp') {
      // 앙! 크게 벌린 입
      eyes = `<path d="M-12 3 Q-8.5 -2.5 -5 3 M5 3 Q8.5 -2.5 12 3" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="0" cy="11.5" rx="5.6" ry="5.2" fill="#C9466F"/><ellipse cx="0" cy="14" rx="3.4" ry="2" fill="#FF9CB8"/>`;
    } else if (mood === 'chew') {
      // 오물오물: 볼이 빵빵
      eyes = `<path d="M-12 3 Q-8.5 -2.5 -5 3 M5 3 Q8.5 -2.5 12 3" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M-3.5 10.5 q1.75 2 3.5 0 q1.75 2 3.5 0" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="-15" cy="9" rx="7.4" ry="5.6" fill="#F7A0C1" opacity=".55"/><ellipse cx="15" cy="9" rx="7.4" ry="5.6" fill="#F7A0C1" opacity=".55"/>`;
    } else if (mood === 'sip') {
      // 쪼옥: 오므린 입
      eyes = `<path d="M-12 3 Q-8.5 5.5 -5 3 M5 3 Q8.5 5.5 12 3" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="0" cy="11" rx="2.6" ry="2.4" fill="none" stroke="#C9466F" stroke-width="2"/>`;
    } else if (mood === 'dizzy') {
      // 눈이 뱅글뱅글 (소용돌이가 돈다), 꼬불꼬불 입
      const sp = (x) => `<g transform="translate(${x} 2.5)"><g class="spiral"><path d="M0 0 m-.8 0 a.8 .8 0 1 1 1.6 0 a1.8 1.8 0 1 1 -3.6 0 a2.8 2.8 0 1 1 5.6 0 a3.8 3.8 0 1 1 -7.6 0" stroke="${ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/></g></g>`;
      eyes = sp(-8.5) + sp(8.5);
      mouth = `<path d="M-4.5 11 q1.5 -2 3 0 q1.5 2 3 0 q1.5 -2 3 0" stroke="${ink}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
    } else if (mood === 'sleepy') {
      // 반쯤 감긴 눈 + 하품하는 입
      eyes = `<path d="M-12.5 2 h8 M4.5 2 h8" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><path d="M-11.5 2 q3 3.4 6 0 M5.5 2 q3 3.4 6 0" fill="${ink}"/>`;
      mouth = `<ellipse class="yawn" cx="0" cy="11.5" rx="3.6" ry="4.6" fill="#C9466F"/><ellipse cx="0" cy="13.8" rx="2.2" ry="1.4" fill="#FF9CB8"/>`;
    } else if (mood === 'full') {
      // 배불러: 만족스레 감은 눈, 빵빵한 볼
      eyes = `<path d="M-12 2 Q-8.5 5.5 -5 2 M5 2 Q8.5 5.5 12 2" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M-3 10 Q0 12.6 3 10" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/><ellipse cx="-15" cy="9" rx="7.6" ry="5.6" fill="#F7A0C1" opacity=".6"/><ellipse cx="15" cy="9" rx="7.6" ry="5.6" fill="#F7A0C1" opacity=".6"/>`;
    } else if (mood === 'smug') {
      // 에헴: 눈을 감고 새침하게 웃는 얼굴
      eyes = `<path d="M-12 3.5 Q-8.5 0.5 -5 3.5 M5 3.5 Q8.5 0.5 12 3.5" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      mouth = `<path d="M-3.5 9.5 Q0.5 12.5 4.5 8.5" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    } else if (mood === 'wide') {
      // 눈이 말똥말똥: 크게 뜬 반짝 눈
      eyes = `<g><circle cx="-8.5" cy="2" r="5" fill="${ink}"/><circle cx="8.5" cy="2" r="5" fill="${ink}"/><circle cx="-6.8" cy="0" r="2" fill="#fff"/><circle cx="10.2" cy="0" r="2" fill="#fff"/><circle cx="-10" cy="4" r="1" fill="#fff"/><circle cx="7" cy="4" r="1" fill="#fff"/></g>`;
      mouth = `<path d="M-4 9 Q0 14.5 4 9 Z" fill="#E26A97"/>`;
    } else if (mood === 'tickle') {
      // 간지러워: > < 눈, 웃음 참는 입
      eyes = `<path d="M-12.5 -0.5 L-6 3 L-12.5 6.5 M12.5 -0.5 L6 3 L12.5 6.5" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      mouth = `<path d="M-5 10 Q0 15 5 10 Z" fill="#E26A97"/><path d="M-19 -2 q2 2 0 4 M19 -2 q-2 2 0 4" stroke="#E5679A" stroke-width="1.4" fill="none"/>`;
    } else if (mood === 'sleep') {
      eyes = `<path d="M-12 3 Q-8.5 5.5 -5 3 M5 3 Q8.5 5.5 12 3" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
      mouth = `<ellipse cx="0" cy="11" rx="1.8" ry="2.2" fill="${ink}" opacity=".7"/>`;
    } else {
      eyes = `<g class="look"><g class="eyes"><ellipse cx="-8.5" cy="2.5" rx="3.6" ry="4.4" fill="${ink}"/><ellipse cx="8.5" cy="2.5" rx="3.6" ry="4.4" fill="${ink}"/>
        <circle cx="-7.3" cy="0.9" r="1.5" fill="#fff"/><circle cx="9.7" cy="0.9" r="1.5" fill="#fff"/><circle cx="-9.6" cy="4.4" r=".7" fill="#fff"/><circle cx="7.4" cy="4.4" r=".7" fill="#fff"/></g></g>`;
      mouth = `<path d="M-3.2 9.5 Q0 12.8 3.2 9.5" stroke="${ink}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    }
    return `<g class="face"><ellipse cx="-15.5" cy="9.5" rx="6" ry="3.8" fill="url(#cn-blush)"/><ellipse cx="15.5" cy="9.5" rx="6" ry="3.8" fill="url(#cn-blush)"/>${eyes}${mouth}</g>`;
  }

  // ---------- 구름 요정 ----------
  function cloudBody(mood) {
    const sh = [[-19, 5, 19], [0, -8, 23], [19, 5, 19]].concat(CUR_STAGE >= 6 ? [[13, -14, 13]] : []);
    const out = sh.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + 2.6}"/>`).join('') + `<ellipse cx="0" cy="11" rx="35.6" ry="18.6"/>`;
    const inn = sh.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + `<ellipse cx="0" cy="11" rx="33" ry="16"/>`;
    let tear = mood === 'sad' ? `<path d="M19 12 q-3 5 0 7 q3 -2 0 -7z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".8"/>` : '';
    // 구름이 울면 몸 아래로 비가 내린다
    if (mood === 'cry') tear = `<g class="tears">${[-20, -8, 4, 16, 26].map((x, i) => `<path class="tear rain r${i}" d="M${x} 28 q-2.4 4.2 0 6 q2.4 -1.8 0 -6z" fill="#9CC8FF" stroke="#6EA6F0" stroke-width=".7"/>`).join('')}</g>`;
    return `<g fill="${T.o}">${out}</g><g fill="${T.f}">${inn}</g>
      <ellipse cx="0" cy="21" rx="27" ry="6.5" fill="${T.o}" opacity=".28"/><circle cx="-6" cy="-21" r="6" fill="#fff" opacity=".75"/><circle cx="4" cy="-25" r="2.6" fill="#fff" opacity=".8"/><circle cx="-27" cy="-3" r="3.4" fill="#fff" opacity=".6"/>
      <path d="M-26 -2 q4 -8 12 -9" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/>
      <g transform="translate(0 4)">${face(mood, '#45346A')}</g>${tear}`;
  }
  const cloudWings = (s = 1, gold = false) => `<g transform="scale(${s})">
    <path class="wing wl pw pwl" d="M-30 -2 C-50 -18 -62 -6 -54 6 C-48 14 -36 10 -30 4 Z" fill="url(#${gold ? 'cn-wing2' : 'cn-wing'})" stroke="${gold ? '#E8B94A' : '#9EC2F2'}" stroke-width="2"/>
    <path class="wing wr pw pwr" d="M30 -2 C50 -18 62 -6 54 6 C48 14 36 10 30 4 Z" fill="url(#${gold ? 'cn-wing2' : 'cn-wing'})" stroke="${gold ? '#E8B94A' : '#9EC2F2'}" stroke-width="2"/></g>`;
  // 6단계 이후 꾸밈 (단계가 오를수록 하나씩 더해진다)
  const moonMark = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M2 -7 A7 7 0 1 0 6 5 A5.6 5.6 0 1 1 2 -7Z" fill="url(#cn-star)" stroke="#E8A93C" stroke-width="1.3" stroke-linejoin="round"/>`;
  const crown = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-11 4 L-12 -7 L-5 -1 L0 -10 L5 -1 L12 -7 L11 4 Z" fill="url(#cn-star)" stroke="#E0A030" stroke-width="1.4" stroke-linejoin="round"/><circle cx="0" cy="-10" r="1.8" fill="#F28DB2"/><circle cx="-12" cy="-7" r="1.4" fill="#9CC8F5"/><circle cx="12" cy="-7" r="1.4" fill="#9CC8F5"/><circle cx="0" cy="0.5" r="2" fill="#F28DB2"/></g>`;
  const sparkle = (x, y, s) => `<path class="spk" transform="translate(${x} ${y}) scale(${s})" d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6Z" fill="#FFF3B0" stroke="#F2C75C" stroke-width=".8"/>`;
  const rainbowAura = () => `<g opacity=".8">${['#F7A3A3', '#F9D27A', '#9EDFA9', '#9CC8F5', '#C3A9F2'].map((c, i) => `<path d="M${-46 + i * 4.4} 6 A${46 - i * 4.4} ${44 - i * 4.4} 0 0 1 ${46 - i * 4.4} 6" fill="none" stroke="${c}" stroke-width="4.6"/>`).join('')}</g>`;
  const auroraTail = () => `<g opacity=".9" fill="none" stroke-linecap="round"><path class="aur" d="M-18 24 C-30 30 -38 22 -46 30 C-50 34 -54 32 -53 27" stroke="url(#cn-aur)" stroke-width="6.5"/><path class="aur" d="M-10 28 C-22 38 -32 34 -42 40" stroke="url(#cn-aur)" stroke-width="4.2" opacity=".75"/></g>`;

// ---------- 알: 금이 가면 껍데기 윗부분이 들려 올라가고, 그 틈으로 아기가 빼꼼 ----------
  // 껍데기 = 타원(가운데 0,10 / 가로 40 세로 50). 금은 가장자리에서 가장자리까지 한 줄로 이어진다.
  const ZIG = 'L-30 -6 L-20 2 L-10 -6 L0 2 L10 -6 L20 2 L30 -6';
  const SHELL_LOW = `M-39.2 0 ${ZIG} L39.2 0 A40 50 0 1 1 -39.2 0 Z`;
  const SHELL_TOP = `M-39.2 0 ${ZIG} L39.2 0 A40 50 0 0 0 -39.2 0 Z`;
  const LID = 'translate(-4 -21) rotate(-13 0 -20)';
  function eggEyes(ink, mood, y) {
    if (mood === 'cry') return `<path d="M-13 ${y - 3} L-7 ${y} L-13 ${y + 3} M13 ${y - 3} L7 ${y} L13 ${y + 3}" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-14 ${y + 4} q-2 3.6 0 5 q2 -1.4 0 -5z" fill="#9CC8FF"/>`;
    if (mood === 'pout') return `<path d="M-13 ${y - 1} h7 M6 ${y - 1} h7" stroke="${ink}" stroke-width="2.4" stroke-linecap="round"/><circle cx="-7.5" cy="${y + 1.4}" r="2" fill="${ink}"/><circle cx="11.5" cy="${y + 1.4}" r="2" fill="${ink}"/>`;
    if (mood === 'sleepy' || mood === 'sleep') return `<path d="M-13 ${y} Q-9.5 ${y + 3.6} -6 ${y} M6 ${y} Q9.5 ${y + 3.6} 13 ${y}" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    if (mood === 'happy') return `<path d="M-13 ${y + 1} Q-9.5 ${y - 4} -6 ${y + 1} M6 ${y + 1} Q9.5 ${y - 4} 13 ${y + 1}" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    return `<g class="look"><g class="eyes"><ellipse cx="-9.5" cy="${y}" rx="3.4" ry="4" fill="${ink}"/><ellipse cx="9.5" cy="${y}" rx="3.4" ry="4" fill="${ink}"/><circle cx="-8.4" cy="${y - 1.4}" r="1.3" fill="#fff"/><circle cx="10.6" cy="${y - 1.4}" r="1.3" fill="#fff"/></g></g>`;
  }
  function eggC(stage, mood) {
    const crack = stage >= 2, sh = 'fill="url(#cn-egg-c)" stroke="#C9BDF3" stroke-width="3" stroke-linejoin="round"';
    const lowDeco = `<g fill="#DCD3FB"><circle cx="-18" cy="22" r="9"/><circle cx="-4" cy="18" r="12"/><circle cx="12" cy="22" r="9"/><circle cx="24" cy="25" r="6"/><ellipse cx="2" cy="28" rx="28" ry="7"/></g>${star(-22, 8, .45, -10)}${star(26, 42, .35)}`;
    const topDeco = `${star(16, -16, .7, 12)}<path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (!crack) return `<g class="anim-egg"><ellipse cx="0" cy="10" rx="40" ry="50" ${sh}/>${lowDeco}${topDeco}</g>`;
    // 틈으로 보이는 아기 구름: 몽글몽글 머리, 눈, 볼
    const baby = `<g fill="#fff" stroke="#CFC4F6" stroke-width="2.4"><circle cx="-15" cy="-4" r="15"/><circle cx="15" cy="-4" r="15"/><circle cx="0" cy="-12" r="18"/></g><g fill="#fff"><circle cx="-15" cy="-4" r="12.6"/><circle cx="15" cy="-4" r="12.6"/><circle cx="0" cy="-12" r="15.6"/></g>`;
    return `<g class="anim-egg">${baby}${eggEyes('#45346A', mood, -12)}<ellipse cx="-17" cy="-6" rx="4.6" ry="2.6" fill="url(#cn-blush)"/><ellipse cx="17" cy="-6" rx="4.6" ry="2.6" fill="url(#cn-blush)"/>
      <path d="${SHELL_LOW}" ${sh}/>${lowDeco}
      <g transform="${LID}"><path d="${SHELL_TOP}" ${sh}/>${topDeco}</g>
      <path d="M-34 -20 l-4 -3 M36 -26 l5 -2 M-30 -28 l-2 -5" stroke="#B9A7F5" stroke-width="2" stroke-linecap="round"/></g>`;
  }

  function eggB(stage, mood) {
    const crack = stage >= 2, sh = `fill="url(#cn-egg-b)" stroke="${BS}" stroke-width="3" stroke-linejoin="round"`;
    const seed = (x, y, r) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -3.4 C2.4 -1 2.2 2.6 0 3.4 C-2.2 2.6 -2.4 -1 0 -3.4Z" fill="#F7A9C6"/>`;
    const lowDeco = `${seed(-20, 12, -20)}${seed(18, 8, 15)}${seed(-4, 24, 5)}${seed(22, 30, 30)}${seed(-22, 36, -35)}${seed(6, 42, 0)}`;
    const topDeco = `<path d="M-16 -42 q8 -10 16 -6 q8 -4 16 6 q-8 4 -16 2 q-8 2 -16 -2z" fill="#9FDDB4" stroke="#6CC08F" stroke-width="1.6" stroke-linejoin="round"/>${seed(-6, -14, 10)}${seed(14, -22, -15)}<path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    if (!crack) return `<g class="anim-egg"><ellipse cx="0" cy="8" rx="40" ry="50" ${sh}/>${lowDeco}${topDeco}</g>`;
    const feet = `<g><ellipse cx="-14" cy="58" rx="9" ry="5.6" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/><ellipse cx="14" cy="58" rx="9" ry="5.6" fill="url(#cn-bun)" stroke="${BS}" stroke-width="${BW}"/><ellipse cx="-14" cy="58.8" rx="3.2" ry="2.2" fill="#FAC9DB"/><ellipse cx="14" cy="58.8" rx="3.2" ry="2.2" fill="#FAC9DB"/></g>`;
    // 틈으로 보이는 아기 토끼: 둥근 머리, 양옆으로 삐져나온 귀 끝
    const baby = `<g fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.4"><ellipse cx="-33" cy="-14" rx="6" ry="12" transform="rotate(-58 -33 -14)"/><ellipse cx="33" cy="-14" rx="6" ry="12" transform="rotate(58 33 -14)"/></g><ellipse cx="-33" cy="-14" rx="2.6" ry="7" transform="rotate(-58 -33 -14)" fill="#FAC9DB"/><ellipse cx="33" cy="-14" rx="2.6" ry="7" transform="rotate(58 33 -14)" fill="#FAC9DB"/><circle cx="0" cy="-6" r="28" fill="url(#cn-bun)" stroke="${BS}" stroke-width="2.4"/>`;
    return `<g class="anim-egg">${feet}${baby}${eggEyes('#5E2B47', mood, -13)}<path d="M-1.8 -7.4 L1.8 -7.4 L0 -5.4 Z" fill="#E26A97"/><ellipse cx="-17" cy="-8" rx="4.6" ry="2.6" fill="url(#cn-blush)"/><ellipse cx="17" cy="-8" rx="4.6" ry="2.6" fill="url(#cn-blush)"/>
      <path d="${SHELL_LOW.replace('A40 50', 'A40 50').replace(/(-?\d+(\.\d+)?) (-?\d+) /g, (m) => m)}" transform="translate(0 -2)" ${sh}/>${lowDeco}
      <g transform="translate(0 -2) ${LID}"><path d="${SHELL_TOP}" ${sh}/>${topDeco}</g>
      <path d="M-34 -22 l-4 -3 M36 -28 l5 -2" stroke="#E07FA6" stroke-width="2" stroke-linecap="round"/></g>`;
  }

  // 깨끗함이 줄면 몸에 얼룩·먼지가 묻는다 (lv 0~1). 많이 더러우면 먼지 냄새 줄이 피어오른다
  const DIRT_AT = { cloud: [[-27, 12, 20], [24, 17, -15], [11, -21, 30], [-13, -19, -25], [-3, 25, 10], [29, 1, 40], [16, 25, -30], [-24, -4, 15]],
    bunny: [[-15, -13, 20], [16, -9, -20], [-9, 31, 10], [8, 35, -15], [-14, 8, 30], [6, -18, -30], [12, 24, 15], [-4, 37, 0]] };
  function dirt(kind, lv) {
    if (!lv) return '';
    const n = Math.max(1, Math.round(lv * 8)), P = (DIRT_AT[kind] || DIRT_AT.bunny).slice(0, n);
    let s = P.map(([x, y, r], i) => `<g transform="translate(${x} ${y}) rotate(${r})" opacity="${(.35 + .35 * lv).toFixed(2)}"><ellipse rx="${4 + (i % 3)}" ry="${2.6 + (i % 2)}" fill="#8B6845"/><circle cx="${3 + (i % 3)}" cy="2.6" r="1.1" fill="#8B6845"/><circle cx="-4" cy="-2" r=".8" fill="#8B6845"/></g>`).join('');
    if (lv > .55) s += `<g class="dustfx" fill="none" stroke="#A8957F" stroke-width="1.6" stroke-linecap="round">${[[-40, -6], [40, -12], [-34, -26]].map(([x, y], i) => `<path class="df d${i}" d="M${x} ${y} q3 -4 0 -8 q-3 -4 0 -8"/>`).join('')}</g>`;
    return `<g class="dirt">${s}</g>`;
  }
  // 6단계부터 생기는 특성 무늬: 많이 맞힌 영역에 따라 (수와 연산=별, 도형=세모·네모·동그라미, 규칙과 자료=막대)
  const TRAIT_AT = { cloud: [[-24, 14, -12], [26, 16, 14], [-6, 25, 0], [10, 23, 8], [-28, -2, -18], [29, 2, 18]], bunny: [[-8, 32, -10], [8, 27, 12], [1, 37, 0], [-19, 9, -15], [19, 9, 15], [-6, 22, 8]] };
  function traitDeco(kind, trait) {
    if (!trait) return '';
    const P = TRAIT_AT[kind] || TRAIT_AT.bunny, C = ['#FFC24E', '#F28DB2', '#8FD3C0', '#9CC8FF', '#C9B8FF', '#FFB27A'];
    const one = (x, y, r, i) => {
      if (trait === 'num') return `<g transform="translate(${x} ${y}) rotate(${r}) scale(.48)"><polygon points="0,-10 2.9,-3.4 10,-3.1 4.6,1.6 6.4,8.6 0,4.8 -6.4,8.6 -4.6,1.6 -10,-3.1 -2.9,-3.4" fill="${C[i]}" opacity=".9"/></g>`;
      if (trait === 'shape') return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.6)" fill="${C[i]}" opacity=".85">${i % 3 === 0 ? '<path d="M0 -3.4 L3.2 2.4 H-3.2Z"/>' : i % 3 === 1 ? '<rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx=".8"/>' : '<circle r="2.8"/>'}</g>`;
      return `<g transform="translate(${x} ${y}) rotate(${r}) scale(1.5)" fill="${C[i]}" opacity=".85"><rect x="-3.6" y="-1" width="1.8" height="4" rx=".6"/><rect x="-.9" y="-3" width="1.8" height="6" rx=".6"/><rect x="1.8" y="-2" width="1.8" height="5" rx=".6"/></g>`;
    };
    return `<g class="trait">${P.map(([x, y, r], i) => one(x, y, r, i)).join('')}</g>`;
  }
  function cloud(stage, mood = 'idle', look = null) {
    if (stage <= 2) return wrap(eggC(stage, mood));
    const L = normLook(look); setTint('cloud', L.tint);
    const s = [0, 0, 0, 1.0, 1.16, 1.28, 1.34, 1.38, 1.42, 1.46, 1.5][stage] || 1.2;
    let back = '', front = '';
    if (stage >= 10) back += `<circle cy="-4" r="52" fill="url(#cn-glow)"/>`;
    if (stage >= 6) back += rainbowAura();
    if (stage >= 9) back += auroraTail();
    if (stage >= 5 && L.wear.back !== 'wings') back += cloudWings(stage >= 7 ? 1.22 / s : .85, stage >= 7);
    // 머리 장식을 해도 별·달은 보이게: 장식이 있는 자리를 피해 옮긴다 (왼쪽 장식: 꽃·리본, 귀마개는 아래쪽이라 그대로)
    const hd = L.wear.head, hLeft = hd === 'flower' || hd === 'bow', hTop = hd && !hLeft && hd !== 'earmuff';
    if (stage >= 4 && stage < 10) front += hTop ? star(-33, -6, .55, -10) : star(15, -27, .62, 14);
    if (stage >= 8) front += hd && hd !== 'earmuff' ? moonMark(34, -6, .7) : moonMark(-17, -29, .78);
    if (stage >= 10 && !L.wear.head) front += crown(4, -33, .95);
    if (stage >= 7) front += sparkle(-40, -20, .6) + sparkle(42, 14, .5);
    const ws = (ly) => wearSVG('cloud', L.wear, ly, L.col);
    return wrap(`<g class="anim-float"><g transform="translate(0 ${50 - 30 * s}) scale(${s})">${back}${ws('back')}${cloudBody(mood)}${stage >= 6 ? traitDeco('cloud', L.trait) : ''}${dirt('cloud', L.dirt)}${ws('body')}${ws('neck')}<g transform="translate(0 0)">${ws('face')}</g>${front}${ws('head')}${ws('hand')}</g></g>`);
  }

  // ---------- 아기 토끼 ----------
  const BS = '#EFA2C0', BW = 2.4;
  function bunnyEars(stage, mood) {
    const long = stage >= 4;
    const ry = stage >= 9 ? 20.5 : stage >= 6 ? 18.8 : long ? 17 : 10, cy = long ? -14 - ry : -23;
    const rot = mood === 'sad' || mood === 'cry' ? 40 : mood === 'pout' ? 24 : mood === 'happy' ? -6 : 8;
    const ear = (sx) => `<g transform="translate(${sx * 8} -14) rotate(${sx * rot}) translate(${-sx * 8} 14)"><g class="ear ${sx < 0 ? 'el' : 'er'}">
      <ellipse cx="${sx * 9}" cy="${cy}" rx="7" ry="${ry}" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
      <ellipse cx="${sx * 9}" cy="${cy + 1}" rx="3.2" ry="${ry - 6}" fill="${T.i}"/><path d="M${sx * 6.5} ${cy - ry + 5} q${sx * 1.5} -2 ${sx * 3} -1" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/></g></g>`;
    return ear(-1) + ear(1);
  }
  function bunnyBody(stage, mood, tail) {
    const foot = (x) => `<ellipse cx="${x}" cy="39" rx="7.5" ry="4.8" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/><ellipse cx="${x}" cy="39.6" rx="2.8" ry="1.9" fill="${T.i}"/>`;
    const armR = mood === 'happy' ? `<ellipse cx="14" cy="19" rx="4" ry="5.5" transform="rotate(-40 14 19)" fill="${T.f}" stroke="${T.s}" stroke-width="2.2"/>` : `<ellipse cx="13" cy="26" rx="4" ry="5.4" fill="${T.f}" stroke="${T.s}" stroke-width="2.2"/>`;
    const armL = mood === 'happy' ? `<ellipse cx="-14" cy="19" rx="4" ry="5.5" transform="rotate(40 -14 19)" fill="${T.f}" stroke="${T.s}" stroke-width="2.2"/>` : `<ellipse cx="-13" cy="26" rx="4" ry="5.4" fill="${T.f}" stroke="${T.s}" stroke-width="2.2"/>`;
    return `${tail || `<g class="tail"><circle cx="16" cy="33" r="6" fill="${T.f}" stroke="${T.s}" stroke-width="2.2"/><circle cx="17.5" cy="31" r="2" fill="#fff" opacity=".8"/></g>`}
      <ellipse cx="0" cy="28" rx="15" ry="12.5" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
      <ellipse cx="0" cy="30" rx="8" ry="6.5" fill="${T.b || '#FFF3F7'}"/>${T.b ? `<path d="M-5.6 27.4 h11.2 M-6.4 30.4 h12.8 M-5.6 33.4 h11.2" stroke="${T.s}" stroke-width=".9" opacity=".35"/>` : ''}${stage >= 8 ? `<path d="M0 33.5 C-4 30 -4.5 26.5 -2 26 C-.8 25.8 0 27 0 27.6 C0 27 .8 25.8 2 26 C4.5 26.5 4 30 0 33.5Z" fill="${T.i}" opacity=".9"/>` : ''}
      <ellipse cx="0" cy="37" rx="12" ry="2.4" fill="${T.s}" opacity=".14"/>
      ${foot(-8.5)}${foot(8.5)}${armL}<g class="arm-r">${armR}</g>`;
  }
  function bunnyHead(mood) {
    const ink = '#5E2B47';
    const f = face(mood, ink).replace(/M-3\.2 9\.5 Q0 12\.8 3\.2 9\.5/, 'M-4 10 Q-2 12.6 0 10 Q2 12.6 4 10');
    const st = CUR_STAGE;
    return `<circle r="23" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
      <path d="M-4 -22.4 q1.2 -5.4 3.6 -1.2 q2 -4.6 4.2 .4" fill="${T.f}" stroke="${T.s}" stroke-width="1.6" stroke-linejoin="round"/>
      ${st >= 6 ? `<path d="M-22.6 4 q-3.6 2 -1.4 4.6 q-3 2.6 .6 4.4 M22.6 4 q3.6 2 1.4 4.6 q3 2.6 -.6 4.4" fill="${T.f}" stroke="${T.s}" stroke-width="1.5" stroke-linejoin="round"/>` : ''}
      <ellipse cx="0" cy="14" rx="15" ry="6" fill="${T.s}" opacity=".07"/>
      <path d="M-15 -11 q5 -7 12 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${f}${st >= 8 ? `<path d="M-12.6 .8 l-2.6 -1.6 M-12.2 2.6 l-2.8 -.4 M12.6 .8 l2.6 -1.6 M12.2 2.6 l2.8 -.4" stroke="${ink}" stroke-width="1.3" stroke-linecap="round"/>` : ''}<path d="M-1.8 6.6 L1.8 6.6 L0 8.6 Z" fill="#E26A97" stroke="#E26A97" stroke-width="1" stroke-linejoin="round"/>`;
  }
  const ribbon = `<g transform="translate(13 -18) rotate(12)"><path d="M0 0 C-6 -9 -13 -7 -12 0 C-13 7 -6 9 0 0 Z M0 0 C6 -9 13 -7 12 0 C13 7 6 9 0 0 Z" fill="url(#cn-rib)" stroke="#C9578A" stroke-width="1.3"/><circle r="3.2" fill="#D9628E"/></g>`;



  // ---------- 강아지 · 고양이: 토끼와 같은 뼈대(머리·몸·팔·발)에 귀·꼬리·코·무늬만 다르다 ----------
  // 그래서 토끼에게 맞춘 옷·모자·우산·날개 자리를 그대로 쓸 수 있다
  const tailOf = (d, w = 7.2) => `<g class="tail"><path d="${d}" fill="none" stroke="${T.s}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${T.f}" stroke-width="${w - 2.6}" stroke-linecap="round"/>`;
  const PUP_TAIL = 'M13 31 C21 31 26 24 24 15';
  const KIT_TAIL = 'M13 33 C27 36 31 22 26 12 C23 6 26 1 30 2';
  const PARTS = {
    puppy: {
      ink: '#4A3030', tip: [24, 14], earsFront: true,
      tail: () => tailOf(PUP_TAIL) + '</g>',
      ears: (stage, mood) => {
        const len = stage >= 6 ? 1.12 : stage >= 4 ? 1.05 : .9, rot = mood === 'sad' || mood === 'cry' ? 10 : mood === 'happy' ? -14 : mood === 'wide' ? -20 : 0;
        const ear = (sx) => `<g transform="scale(${sx} 1)"><g transform="rotate(${rot} -13 -17)"><g class="ear hang ${sx < 0 ? 'er' : 'el'}"><path transform="translate(-13 -17) scale(${len}) translate(13 17)" d="M-12 -18 C-24 -24 -33 -10 -30 5 C-28 14 -19 13 -18 4 C-17 -4 -14 -10 -10 -15 Z" fill="${T.e}" stroke="${T.s}" stroke-width="${BW}" stroke-linejoin="round"/><path transform="translate(-13 -17) scale(${len}) translate(13 17)" d="M-24 -10 q-3 6 -2 12" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".45"/></g></g></g>`;
        return ear(-1) + ear(1);
      },
      head: (mood, st) => `<circle r="23" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
        <path d="M-4 -22.4 q1.2 -5.4 3.6 -1.2 q2 -4.6 4.2 .4" fill="${T.f}" stroke="${T.s}" stroke-width="1.6" stroke-linejoin="round"/>
        ${st >= 6 ? `<path d="M-22.6 4 q-3.6 2 -1.4 4.6 q-3 2.6 .6 4.4 M22.6 4 q3.6 2 1.4 4.6 q3 2.6 -.6 4.4" fill="${T.f}" stroke="${T.s}" stroke-width="1.5" stroke-linejoin="round"/>` : ''}
        <path d="M5 -11 C9 -16 18 -14 18.5 -6 C19 1 13 4 8.5 1 C5 -1 3 -7 5 -11Z" fill="${T.e}" opacity=".8"/>
        <ellipse cx="0" cy="14" rx="15" ry="6" fill="${T.s}" opacity=".07"/><path d="M-15 -11 q5 -7 12 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${face(mood, '#4A3030').replace(/M-3\.2 9\.5 Q0 12\.8 3\.2 9\.5/, 'M-4 10.6 Q-2 13.2 0 10.6 Q2 13.2 4 10.6')}
        <ellipse cx="0" cy="6.9" rx="3.3" ry="2.4" fill="#4A3030"/><ellipse cx="-1" cy="6.1" rx="1.1" ry=".7" fill="#fff" opacity=".8"/>`,
      clip: `<g transform="translate(14 -18) rotate(-25)"><g fill="#fff" stroke="#C9A27E" stroke-width="1.2"><circle cx="-6.4" cy="-2" r="2.6"/><circle cx="-6.4" cy="2" r="2.6"/><circle cx="6.4" cy="-2" r="2.6"/><circle cx="6.4" cy="2" r="2.6"/></g><rect x="-6.6" y="-2.2" width="13.2" height="4.4" fill="#fff"/><path d="M-5.6 -2.2 h11.2 M-5.6 2.2 h11.2" stroke="#C9A27E" stroke-width="1.2"/></g>`,
      mark: `<g fill="#F28DB2"><ellipse cx="0" cy="2" rx="3.4" ry="2.8"/><circle cx="-3.6" cy="-2.6" r="1.4"/><circle cx="0" cy="-4" r="1.4"/><circle cx="3.6" cy="-2.6" r="1.4"/></g>`
    },
    kitty: {
      ink: '#4A3552', tip: [30, 2], earsFront: false,
      tail: () => tailOf(KIT_TAIL, 6.6) + [[22, 33.5, 20], [28.6, 22, 80], [26, 11, 30]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M0 -1.6 v3.2" stroke="${T.e}" stroke-width="2.2" stroke-linecap="round"/>`).join('') + '</g>',
      ears: (stage, mood) => {
        const h = stage >= 6 ? 3 : stage >= 4 ? 1.5 : 0, rot = mood === 'sad' || mood === 'cry' ? -30 : mood === 'pout' ? -18 : mood === 'wide' ? 6 : 0;
        const ear = (sx) => `<g transform="scale(${sx} 1)"><g transform="rotate(${rot} -12 -17)"><g class="ear ${sx < 0 ? 'er' : 'el'}"><path d="M-21.5 -9 L${-17.5 - h * .3} ${-31 - h} L-4 -21 Z" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}" stroke-linejoin="round"/><path d="M-17.8 -13 L${-16.4 - h * .3} ${-25.5 - h} L-8.5 -19.5 Z" fill="${T.i}"/></g></g></g>`;
        return ear(-1) + ear(1);
      },
      head: (mood, st) => `<circle r="23" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
        ${st >= 6 ? `<path d="M-22.6 4 q-3.6 2 -1.4 4.6 q-3 2.6 .6 4.4 M22.6 4 q3.6 2 1.4 4.6 q3 2.6 -.6 4.4" fill="${T.f}" stroke="${T.s}" stroke-width="1.5" stroke-linejoin="round"/>` : ''}
        <path d="M-5.5 -21.5 v6.5 M0 -22.8 v8 M5.5 -21.5 v6.5 M-21 -4 h5 M21 -4 h-5" stroke="${T.e}" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse cx="0" cy="14" rx="15" ry="6" fill="${T.s}" opacity=".07"/><path d="M-15 -11 q5 -7 12 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${face(mood, '#4A3552').replace(/M-3\.2 9\.5 Q0 12\.8 3\.2 9\.5/, 'M-4 10 Q-2 12.6 0 10 Q2 12.6 4 10')}
        <path d="M-13.5 7.4 l-9.5 -2.2 M-13.5 10 l-9.5 1.2 M13.5 7.4 l9.5 -2.2 M13.5 10 l9.5 1.2" stroke="#4A3552" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>
        <path d="M-2 6.4 L2 6.4 L0 8.6 Z" fill="#F28DB2" stroke="#F28DB2" stroke-width="1" stroke-linejoin="round"/>`,
      clip: `<g transform="translate(14 -18) rotate(-20)"><path d="M-7 0 C-4 -5 4 -5 6 0 C4 5 -4 5 -7 0Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.2"/><path d="M6 0 L11 -4 L11 4 Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.2" stroke-linejoin="round"/><circle cx="-3.6" cy="-.6" r="1" fill="#2F4A6E"/><path d="M-.5 -2.4 q1.4 2.4 0 4.8" stroke="#5D8FD0" stroke-width=".9" fill="none"/></g>`,
      mark: `<path d="M0 3.6 C-5 0 -5 -4 -2.4 -4.4 C-1 -4.6 0 -3.4 0 -2.6 C0 -3.4 1 -4.6 2.4 -4.4 C5 -4 5 0 0 3.6Z" fill="#F28DB2"/>`
    },
    dragon: {
      ink: '#2F3F66', tip: [30, 14], earsFront: false,
      tail: () => `<g class="tail"><path d="M12 33 C22 37 30 31 31 20 L29 14" fill="none" stroke="${T.s}" stroke-width="8" stroke-linecap="round"/><path d="M12 33 C22 37 30 31 31 20 L29 14" fill="none" stroke="${T.f}" stroke-width="5.4" stroke-linecap="round"/>${[[21, 34.6, 70], [27.6, 29.4, 35], [30.6, 21.4, 5]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M-2.6 0 L0 -5 L2.6 0Z" fill="${T.e}" stroke="${T.s}" stroke-width=".9" stroke-linejoin="round"/>`).join('')}<path d="M29 14 L25 8 L31 9.4 L34 3.6 L33.6 11 Z" fill="${T.e}" stroke="${T.s}" stroke-width="1.2" stroke-linejoin="round"/></g>`,
      ears: (stage, mood) => {
        const rot = mood === 'sad' || mood === 'cry' ? 18 : mood === 'happy' ? -12 : mood === 'wide' ? -18 : 0;
        const fin = (sx) => `<g transform="scale(${sx} 1)"><g transform="rotate(${rot} -20 -6)"><g class="ear ${sx < 0 ? 'er' : 'el'}"><path d="M-19 -11 L-29 -16 L-27 -8 L-32 -3 L-25 -1 L-28 4 L-19 1 Z" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}" stroke-linejoin="round"/><path d="M-22 -9 L-28 -12 M-23 -4 L-30 -4" stroke="#fff" stroke-width="1.1" opacity=".55" stroke-linecap="round"/></g></g></g>`;
        // 뿔: 자랄수록 길어진다
        const h = stage >= 8 ? 9 : stage >= 6 ? 7.5 : stage >= 4 ? 6 : 4.2;
        const horn = (sx) => `<path d="M${sx * 4.5} -19.5 Q${sx * 5} ${-23 - h} ${sx * 9.5} ${-25 - h} Q${sx * 13} ${-21 - h * .45} ${sx * 14} -15.5 Z" fill="#FFEFB3" stroke="#D9A23A" stroke-width="1.8" stroke-linejoin="round"/><path d="M${sx * 7} ${-21 - h * .3} q${sx * 2} -1 ${sx * 4} 0" stroke="#E8BD5C" stroke-width="1.1" fill="none"/>`;
        return fin(-1) + fin(1) + horn(-1) + horn(1);
      },
      head: (mood, st) => `<circle r="23" fill="${T.f}" stroke="${T.s}" stroke-width="${BW}"/>
        ${[-5, 0, 5].map((x, i) => `<path d="M${x - 2.6} ${-21.6 + Math.abs(x) * .12} L${x} ${-27.5 + (i === 1 ? -1 : 0)} L${x + 2.6} ${-21.6 + Math.abs(x) * .12} Z" fill="${T.e}" stroke="${T.s}" stroke-width="1.2" stroke-linejoin="round"/>`).join('')}
        <circle r="23" fill="none" stroke="${T.s}" stroke-width="${BW}" stroke-dasharray="0 999"/>
        <ellipse cx="0" cy="14" rx="15" ry="6" fill="${T.s}" opacity=".07"/><path d="M-15 -11 q5 -7 12 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>
        ${[[-13, -9], [-9, -13], [13, -9], [9, -13]].map(([x, y]) => `<path d="M${x - 2} ${y} q2 -2 4 0" stroke="${T.s}" stroke-width="1" fill="none" opacity=".4"/>`).join('')}
        ${face(mood, '#2F3F66').replace(/M-3\.2 9\.5 Q0 12\.8 3\.2 9\.5/, 'M-4 10.4 Q0 13.4 4 10.4')}
        <ellipse cx="-2.2" cy="6.4" rx=".9" ry=".7" fill="#2F3F66" opacity=".7"/><ellipse cx="2.2" cy="6.4" rx=".9" ry=".7" fill="#2F3F66" opacity=".7"/>`,
      back: (stage) => { // 등의 작은 박쥐 날개: 3단계부터, 5·8단계에 커진다
        const k = stage >= 8 ? 1.25 : stage >= 5 ? 1.05 : .8;
        const w = (sx) => `<g transform="scale(${sx} 1)"><g transform="translate(-10 16) scale(${k}) translate(10 -16)"><path class="pw" d="M-10 16 C-22 2 -36 0 -40 8 C-35 9 -33 13 -34 17 C-30 15 -27 18 -27 22 C-22 19 -16 21 -12 24 Z" fill="${T.e}" stroke="${T.s}" stroke-width="1.8" stroke-linejoin="round"/><path d="M-12 18 L-34 9 M-13 20 L-30 17" stroke="#fff" stroke-width="1" opacity=".5"/></g></g>`;
        return w(-1) + w(1);
      },
      clip: `<g transform="translate(14 -16) rotate(-15)"><path d="M0 -6 L5 -1.5 L3 5 L-3 5 L-5 -1.5 Z" fill="#9EE6F2" stroke="#3FA7C2" stroke-width="1.3" stroke-linejoin="round"/><path d="M-5 -1.5 H5 M0 -6 L-1.4 -1.5 L0 5 M0 -6 L1.4 -1.5" stroke="#3FA7C2" stroke-width=".7" fill="none"/><circle cx="-1.6" cy="-2.6" r=".9" fill="#fff"/></g>`,
      mark: `<path d="M0 4.4 C-4 4 -5 0 -2.4 -2.4 C-2.6 -.6 -1.4 0 -.8 -.6 C-1.4 -3 0 -5.4 1.6 -6 C1 -3.6 4.4 -2 4 1.2 C3.8 3.4 2 4.4 0 4.4Z" fill="#FFB26B" stroke="#E5763F" stroke-width=".9" stroke-linejoin="round"/><path d="M0 3.4 C-1.6 3 -1.6 1 -.4 .2 C0 1.2 1.6 1.4 1.4 2.6 C1.2 3.2 .6 3.4 0 3.4Z" fill="#FFE29A"/>`
    }
  };
  // 알: 강아지는 점박이 알(뼈다귀), 고양이는 줄무늬 알(물고기). 금이 가면 아기 얼굴과 귀가 빼꼼
  const EGG_P = {
    puppy: { g: 'cn-egg-p', s: '#DDB07C', ink: '#4A3030', crack: '#C99A64', f: '#FFF8EE', fs: '#D6A570', e: '#E2B07E',
      low: [[-20, 14, 7, 5], [16, 8, 5, 4], [-2, 30, 8, 5.5], [22, 32, 4.5, 3.5], [-24, 38, 4, 3]].map(([x, y, rx, ry]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#EBC79C" opacity=".85"/>`).join(''),
      top: `<g transform="translate(0 -40) rotate(-8)"><g fill="#fff" stroke="#C9A27E" stroke-width="1.6"><circle cx="-11" cy="-3" r="4"/><circle cx="-11" cy="3" r="4"/><circle cx="11" cy="-3" r="4"/><circle cx="11" cy="3" r="4"/></g><rect x="-11" y="-3.4" width="22" height="6.8" fill="#fff"/><path d="M-9 -3.4 h18 M-9 3.4 h18" stroke="#C9A27E" stroke-width="1.6"/></g><ellipse cx="-14" cy="-16" rx="5" ry="3.6" fill="#EBC79C" opacity=".85"/><path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ears: (s) => `<g fill="${s.e}" stroke="${s.fs}" stroke-width="2.4" stroke-linejoin="round"><path d="M-22 -24 C-36 -26 -44 -10 -38 2 C-34 8 -27 4 -27 -4 C-27 -12 -24 -18 -18 -22Z"/><path d="M22 -24 C36 -26 44 -10 38 2 C34 8 27 4 27 -4 C27 -12 24 -18 18 -22Z"/></g>`,
      nose: '<ellipse cx="0" cy="-5.8" rx="2.8" ry="2" fill="#4A3030"/>' },
    kitty: { g: 'cn-egg-k', s: '#F0B27A', ink: '#4A3552', crack: '#E39A5C', f: '#FFF6EC', fs: '#E39A5C', e: '#F0A060',
      low: [[-26, 8, -20], [-8, 26, 0], [12, 14, 15], [26, 34, 25], [-18, 40, -10]].map(([x, y, r]) => `<path transform="translate(${x} ${y}) rotate(${r})" d="M-7 0 q7 -5 14 0" stroke="#F7C99A" stroke-width="3.2" fill="none" stroke-linecap="round"/>`).join(''),
      top: `<g transform="translate(2 -40) rotate(-10)"><path d="M-10 0 C-6 -6 5 -6 8 0 C5 6 -6 6 -10 0Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.6"/><path d="M8 0 L14 -5 L14 5 Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.6" stroke-linejoin="round"/><circle cx="-5" cy="-1" r="1.3" fill="#2F4A6E"/></g><path d="M-18 -18 q7 -5 14 0" stroke="#F7C99A" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ears: (s) => `<g fill="${s.f}" stroke="${s.fs}" stroke-width="2.4" stroke-linejoin="round"><path d="M-27 -20 L-30 -42 L-12 -31Z"/><path d="M27 -20 L30 -42 L12 -31Z"/></g><g fill="#FFC2C9"><path d="M-25 -24 L-27 -37 L-16 -30Z"/><path d="M25 -24 L27 -37 L16 -30Z"/></g>`,
      nose: '<path d="M-2 -6.6 L2 -6.6 L0 -4.6 Z" fill="#F28DB2"/>' },
    dragon: { g: 'cn-egg-d', s: '#7FB0EA', ink: '#2F3F66', crack: '#5D8FD0', f: '#EAF4FF', fs: '#5D8FD0', e: '#7FB0EA',
      low: [[-24, 10], [-8, 14], [8, 14], [24, 10], [-16, 26], [0, 30], [16, 26], [-8, 42], [8, 42]].map(([x, y]) => `<path d="M${x - 7} ${y} q7 8 14 0" stroke="#A9CCF2" stroke-width="2.6" fill="none" stroke-linecap="round"/>`).join(''),
      top: `<g transform="translate(2 -41)"><path d="M0 -7 L6 -2 L4 6 L-4 6 L-6 -2 Z" fill="#9EE6F2" stroke="#3FA7C2" stroke-width="1.6" stroke-linejoin="round"/><path d="M-6 -2 H6 M0 -7 L-1.6 -2 L0 6 M0 -7 L1.6 -2" stroke="#3FA7C2" stroke-width=".9" fill="none"/><circle cx="-2" cy="-3" r="1.1" fill="#fff"/></g><path d="M-22 -14 q7 8 14 0" stroke="#A9CCF2" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M-24 -22 q6 -14 18 -18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`,
      ears: (s) => `<g fill="${s.e}" stroke="${s.fs}" stroke-width="2.2" stroke-linejoin="round"><path d="M-25 -14 L-40 -22 L-36 -10 L-43 -4 L-27 -4 Z"/><path d="M25 -14 L40 -22 L36 -10 L43 -4 L27 -4 Z"/></g><g fill="#FFF3C4" stroke="#D9A23A" stroke-width="1.6" stroke-linejoin="round"><path d="M-9 -31 Q-9 -40 -14 -42 Q-13 -36 -15 -30Z"/><path d="M9 -31 Q9 -40 14 -42 Q13 -36 15 -30Z"/></g>`,
      nose: '<ellipse cx="-2.2" cy="-6.4" rx="1" ry=".8" fill="#2F3F66" opacity=".7"/><ellipse cx="2.2" cy="-6.4" rx="1" ry=".8" fill="#2F3F66" opacity=".7"/>' }
  };
  function eggP(kind, stage, mood) {
    const E = EGG_P[kind], crack = stage >= 2, sh = `fill="url(#${E.g})" stroke="${E.s}" stroke-width="3" stroke-linejoin="round"`;
    if (!crack) return `<g class="anim-egg"><ellipse cx="0" cy="8" rx="40" ry="50" ${sh}/>${E.low}${E.top}</g>`;
    const feet = [-14, 14].map(x => `<ellipse cx="${x}" cy="58" rx="9" ry="5.6" fill="${E.f}" stroke="${E.fs}" stroke-width="${BW}"/><ellipse cx="${x}" cy="58.8" rx="3.2" ry="2.2" fill="#F9C9B4"/>`).join('');
    const baby = `${kind !== 'puppy' ? E.ears(E) : ''}<circle cx="0" cy="-6" r="28" fill="${E.f}" stroke="${E.fs}" stroke-width="2.4"/>${kind === 'puppy' ? E.ears(E) : ''}`;
    return `<g class="anim-egg">${feet}${baby}${eggEyes(E.ink, mood, -13)}${E.nose}<ellipse cx="-17" cy="-8" rx="4.6" ry="2.6" fill="url(#cn-blush)"/><ellipse cx="17" cy="-8" rx="4.6" ry="2.6" fill="url(#cn-blush)"/>
      <path d="${SHELL_LOW}" transform="translate(0 -2)" ${sh}/>${E.low}
      <g transform="translate(0 -2) ${LID}"><path d="${SHELL_TOP}" ${sh}/>${E.top}</g>
      <path d="M-34 -22 l-4 -3 M36 -28 l5 -2" stroke="${E.crack}" stroke-width="2" stroke-linecap="round"/></g>`;
  }

  function bunny(stage, mood = 'idle', look = null, kind = 'bunny') {
    const K = PARTS[kind];
    if (stage <= 2) return wrap(K ? eggP(kind, stage, mood) : eggB(stage, mood));
    const L = normLook(look); setTint(kind, L.tint);
    const s = [0, 0, 0, 1.05, 1.16, 1.24, 1.28, 1.32, 1.36, 1.4, 1.44][stage] || 1.2;
    const ty = 60 - 44 * s;
    // 머리 장식을 해도 자라며 얻은 표시(리본·네잎클로버·달)는 보이게: 겹치는 것만 자리를 옮긴다
    const hd = L.wear.head, hTop = hd && hd !== 'flower' && hd !== 'bow';
    let extra = stage >= 5 && hd !== 'bow' ? (K ? K.clip : ribbon) : '', back = '';
    if (stage >= 10) back += `<circle cy="4" r="48" fill="url(#cn-glow)"/>`;
    if (K && K.back && L.wear.back !== 'wings') back += K.back(stage);
    if (stage >= 8 && L.wear.back !== 'wings' && !(K && K.back)) back += `<g opacity=".95"><path d="M-12 18 C-30 4 -40 14 -34 24 C-30 30 -20 28 -12 24Z" fill="url(#cn-wing)" stroke="#9EC2F2" stroke-width="1.8"/><path d="M12 18 C30 4 40 14 34 24 C30 30 20 28 12 24Z" fill="url(#cn-wing)" stroke="#9EC2F2" stroke-width="1.8"/></g>`;
    const tp = K ? K.tip : [24, 31]; let tail = stage >= 9 ? `<circle cx="${tp[0]}" cy="${tp[1]}" r="11" fill="url(#cn-glow)"/>` + star(tp[0] + 1, tp[1] + 2, .6, 10) : '';
    if (stage >= 6) extra += `<g transform="translate(${hd === 'flower' || hTop ? '-21 -2' : '-15 -15'}) rotate(-18)${hd === 'flower' || hTop ? ' scale(.85)' : ''}">${K ? K.mark : [0, 90, 180, 270].map(r => `<path transform="rotate(${r})" d="M0 0 C-4 -3 -4 -8 0 -6 C4 -8 4 -3 0 0Z" fill="#8ED79A" stroke="#4FAA6C" stroke-width=".9"/>`).join('') + '<circle r="1.3" fill="#4FAA6C"/>'}</g>`;
    if (stage >= 7) extra += hTop ? moonMark(21, -2, .5) : moonMark(0, -16, .55);
    if (stage >= 10 && !L.wear.head) extra += crown(0, -26, .8);
    if (stage >= 7) extra += sparkle(-30, -8, .55) + sparkle(30, 20, .5);
    const ws = (ly) => wearSVG(kind, L.wear, ly, L.col);
    const ears = K ? K.ears(stage, mood) : bunnyEars(stage, mood), head = K ? K.head(mood, stage) : bunnyHead(mood);
    const out = `<g class="anim-breathe"><g transform="translate(0 ${ty}) scale(${s})">${back}${tail}${ws('back')}${bunnyBody(stage, mood, K && K.tail())}${ws('body')}${K && K.earsFront ? head + ears : ears + head}${stage >= 6 ? traitDeco(kind, L.trait) : ''}${dirt(kind, L.dirt)}${ws('face')}${ws('neck')}${hTop && hd !== 'earmuff' ? ws('head') + extra : extra + ws('head')}${ws('hand')}</g></g>`;
    setTint(kind, 'base'); return wrap(out);
  }

  let CUR_MOOD = 'idle', CUR_STAGE = 3;
  function wrap(inner) {
    return `<svg class="pet-svg m-${CUR_MOOD}" viewBox="-80 -92 160 156" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  }
  // 친구가 쓰는 장식 (친구 그림의 좌표 안에서 그린다)
  const ACC = {
    flower: () => `<g>${[0, 72, 144, 216, 288].map(a => `<circle cx="${Math.cos(a * Math.PI / 180) * 4.6}" cy="${Math.sin(a * Math.PI / 180) * 4.6}" r="3.8" fill="#FFB3CF" stroke="#E5679A" stroke-width=".9"/>`).join('')}<circle r="2.8" fill="#FFD36E" stroke="#E8A93C" stroke-width=".8"/></g>`,
    crown: () => `<g><path d="M-11 4 L-11 -6 L-5.5 -1 L0 -10 L5.5 -1 L11 -6 L11 4 Z" fill="url(#cn-star)" stroke="#D9962E" stroke-width="1.4" stroke-linejoin="round"/><circle cx="0" cy="0" r="1.8" fill="#F28DB2"/><circle cx="-6" cy="1.5" r="1.2" fill="#8FD8C8"/><circle cx="6" cy="1.5" r="1.2" fill="#8FD8C8"/></g>`,
    berryhat: () => `<g><path d="M-19 3 C-19 -14 19 -14 19 3 Z" fill="#F2678F" stroke="#C9466F" stroke-width="1.6"/><path d="M-21 3 h42" stroke="#FFFFFF" stroke-width="3.4" stroke-linecap="round"/><g fill="#FFE29A"><circle cx="-9" cy="-4" r="1"/><circle cx="-2" cy="-8" r="1"/><circle cx="6" cy="-5" r="1"/><circle cx="11" cy="-1" r="1"/><circle cx="-12" cy="0" r="1"/></g><path d="M-5 -11 l3 -4 2 3 3 -4 1 5z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1"/></g>`,
    scarf: () => `<g><rect x="-20" y="-4.5" width="40" height="9" rx="4.5" fill="#9FD9F2" stroke="#5DB3D8" stroke-width="1.4"/><path d="M8 3 l5 11 l6 -2 l-4 -10z" fill="#9FD9F2" stroke="#5DB3D8" stroke-width="1.4" stroke-linejoin="round"/><path d="M-12 -4 v9 M-4 -4 v9 M4 -4 v9" stroke="#fff" stroke-width="1.6" opacity=".8"/></g>`,
    phat: () => `<g><path d="M-10 4 L0 -22 L10 4 Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.4" stroke-linejoin="round"/><path d="M-6.5 -4 L5 -9 M-8.5 1 L7.5 -4.5" stroke="#FFD36E" stroke-width="2.6"/><circle cx="0" cy="-23" r="3.6" fill="#F7A0C1"/><path d="M-11 4 h22" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></g>`,
    bow: () => `<g><path d="M0 0 C-6 -9 -13 -7 -12 0 C-13 7 -6 9 0 0 Z M0 0 C6 -9 13 -7 12 0 C13 7 6 9 0 0 Z" fill="url(#cn-rib)" stroke="#C9578A" stroke-width="1.3"/><circle r="3.2" fill="#D9628E"/></g>`
  };
  const ACC_POS = {
    cloud: { phat: [-6, -28, 1.05], flower: [-16, -24, 1], crown: [0, -33, 1.1], berryhat: [0, -24, 1.05], scarf: [0, 25.5, 1.2], bow: [-16, -25, .9] },
    bunny: { phat: [0, -20, .95], flower: [-14, -14, .9], crown: [0, -21, .95], berryhat: [0, -15, 1], scarf: [0, 17, .9], bow: [13, -18, 1] }
  };
  function accSVG(kind, acc) {
    if (!acc || !ACC[acc]) return '';
    const [x, y, sc] = (ACC_POS[kind] || ACC_POS.bunny)[acc];
    return `<g transform="translate(${x} ${y}) scale(${sc})">${ACC[acc]()}</g>`;
  }
  // ---------- 몸 색(물감) ----------
  const TINT_DEF = {
    cloud: {
      base: { f: 'url(#cn-cloud)', o: '#CFC4F6' },
      sunset: { g: ['#FFF5F8', '#FFD3E2', '#F7A9C6'], o: '#F2A9C4' },
      sky: { g: ['#F6FBFF', '#D6EBFF', '#A9D2F7'], o: '#9EC6EE' },
      mint: { g: ['#F4FFFB', '#CFF3E6', '#9EE0C8'], o: '#8DD3BA' },
      lav: { g: ['#FBF8FF', '#E3D8FF', '#C3B0F7'], o: '#B29EF0' },
      rainbow: { lin: ['#FFD3E2', '#FFF0B8', '#D3F5E6', '#D6EBFF', '#E3D8FF'], o: '#E3B8D6' }
    },
    bunny: {
      base: { f: 'url(#cn-bun)', s: '#EFA2C0', i: '#FAC9DB' },
      cream: { g: ['#FFFDF6', '#FFF1D8', '#F5DDB2'], s: '#E0BF8A', i: '#F7D9B5' },
      choco: { g: ['#F7E9DC', '#E2C2A4', '#C79C78'], s: '#A8724C', i: '#F0C9B0' },
      berry: { g: ['#FFF7FA', '#FFD9E6', '#FFB3CC'], s: '#E5679A', i: '#FF9CB8' },
      gray: { g: ['#FFFFFF', '#ECECF2', '#CFCFDA'], s: '#A6A6B8', i: '#F3C9D8' }
    },
    puppy: {
      base: { f: 'url(#cn-pup)', s: '#D6A570', i: '#F9C9B4', e: '#E2B07E' },
      choco: { g: ['#FBF1E6', '#E6C7A8', '#C99D76'], s: '#9C6A44', i: '#F0C9B0', e: '#8C5A3C' },
      snow: { g: ['#FFFFFF', '#F8F8FC', '#E4E4EE'], s: '#B4B4C8', i: '#F7C9D6', e: '#D9D4E6' },
      gray: { g: ['#FFFFFF', '#EBEBF1', '#CDCDDA'], s: '#9898AE', i: '#F3C9D8', e: '#A6A6BC' }
    },
    kitty: {
      base: { f: 'url(#cn-kit)', s: '#E39A5C', i: '#FFC2C9', e: '#F0A060' },
      gray: { g: ['#FFFFFF', '#E9E9F0', '#C9C9D6'], s: '#9A9AB0', i: '#F7C3D0', e: '#A3A3B8' },
      snow: { g: ['#FFFFFF', '#FBF8F4', '#ECE4DA'], s: '#C2B4A4', i: '#FFC2C9', e: '#E0D2C2' },
      choco: { g: ['#FBF1E6', '#E6C7A8', '#C99D76'], s: '#9C6A44', i: '#F7C3C3', e: '#8C5A3C' }
    },
    dragon: {
      base: { f: 'url(#cn-dra)', s: '#5D8FD0', i: '#FFE29A', e: '#7FB0EA', b: '#FFF1BF' },
      mint: { g: ['#FBFFFD', '#D8F5E8', '#A6E2C8'], s: '#3FAE86', i: '#FFE29A', e: '#6CCBA6', b: '#FFF4C8' },
      lav: { g: ['#FDFBFF', '#E6DCFF', '#C3B0F7'], s: '#8F7BE0', i: '#FFE29A', e: '#B39AF0', b: '#FFF1D2' },
      berry: { g: ['#FFFBFC', '#FFDCE8', '#FFB3CC'], s: '#E5679A', i: '#FFE29A', e: '#F28DB2', b: '#FFF3D6' }
    }
  };
  function tintDefs() {
    let out = '';
    for (const kind of Object.keys(TINT_DEF)) for (const [k, t] of Object.entries(TINT_DEF[kind])) {
      if (t.g) out += `<radialGradient id="cn-t-${kind}-${k}" cx="40%" cy="30%" r="80%"><stop offset="0" stop-color="${t.g[0]}"/><stop offset=".65" stop-color="${t.g[1]}"/><stop offset="1" stop-color="${t.g[2]}"/></radialGradient>`;
      if (t.lin) out += `<linearGradient id="cn-t-${kind}-${k}" x1="0" y1="0" x2="1" y2="1">${t.lin.map((c, i) => `<stop offset="${i / (t.lin.length - 1)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
    }
    return out;
  }
  // 지금 그리는 친구의 색
  let T = { f: 'url(#cn-cloud)', o: '#CFC4F6', s: '#EFA2C0', i: '#FAC9DB', e: '#EFA2C0' };
  function setTint(kind, tint) {
    const d = TINT_DEF[kind][tint] || TINT_DEF[kind].base;
    T = kind === 'cloud' ? { f: d.f || `url(#cn-t-cloud-${tint})`, o: d.o } : { f: d.f || `url(#cn-t-${kind}-${tint})`, s: d.s, i: d.i, e: d.e || d.s, b: d.b };
  }

  // ---------- 옷: 부위(slot)와 그리는 층(layer) ----------
  // 그림은 친구 그림 좌표 안에서 그린다. P = [x, y, 크기] (구름, 토끼)
  const heart = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 3 s-4 -2.5 -4 -5 c0 -2 2.5 -3 4 -1 c1.5 -2 4 -1 4 1 c0 2.5 -4 5 -4 5z" fill="${c}"/>`;
  // 재봉 공방의 마지막 단계(리본 달기)에서 다는 작은 리본
  const rbn = (x, y, sc = 1, c = '#FF9CC0', d = '#C9578A') => `<g class="rbn" transform="translate(${x} ${y}) scale(${sc})"><path d="M0 0 C-3 -5 -8 -4 -7.5 0 C-8 4 -3 5 0 0 Z M0 0 C3 -5 8 -4 7.5 0 C8 4 3 5 0 0 Z" fill="${c}" stroke="${d}" stroke-width=".9"/><path d="M-1 1 l-2.6 5 M1 1 l2.6 5" stroke="${d}" stroke-width="1.3" stroke-linecap="round"/><circle r="1.8" fill="${d}"/></g>`;
  const W = {
    // 머리
    flower: { cm: { '#FFB3CF': 'f', '#E5679A': 's' }, slot: 'head', P: { cloud: [-16, -24, 1], bunny: [-14, -14, .9] }, g: () => ACC.flower() },
    crown: { slot: 'head', P: { cloud: [0, -33, 1.1], bunny: [0, -21, .95] }, g: () => ACC.crown() },
    berryhat: { slot: 'head', P: { cloud: [0, -24, 1.05], bunny: [0, -15, 1] }, g: () => ACC.berryhat() },
    phat: { cm: { '#9EC2F2': 'f', '#5D8FD0': 's' }, slot: 'head', P: { cloud: [-6, -28, 1.05], bunny: [0, -20, .95] }, g: () => ACC.phat() },
    bow: { cm: { 'url(#cn-rib)': 'f', '#C9578A': 's', '#D9628E': 's' }, slot: 'head', P: { cloud: [-16, -25, .9], bunny: [13, -18, 1] }, g: () => ACC.bow() },
    earmuff: { cm: { '#F28DB2': 's', '#F7A0C1': 's', '#FFD3E4': 'l' }, slot: 'head', P: { cloud: [0, -10, 1.15], bunny: [0, 0, 1] }, g: (kind, real) => real === 'puppy' ? `<path d="M-22 -8 Q0 -40 22 -8" stroke="#F28DB2" stroke-width="2.8" fill="none"/>${[-1, 1].map(x => `<circle cx="${x * 23}" cy="-6" r="6.6" fill="#fff" stroke="#F7A0C1" stroke-width="1.8"/><circle cx="${x * 23}" cy="-6" r="3.3" fill="#FFD3E4"/>`).join('')}` : real === 'kitty' ? `<path d="M-15 -21 Q0 -33 15 -21" stroke="#F28DB2" stroke-width="2.6" fill="none"/>${[-1, 1].map(x => `<circle cx="${x * 15.5}" cy="-20" r="6.2" fill="#fff" stroke="#F7A0C1" stroke-width="1.8"/><circle cx="${x * 15.5}" cy="-20" r="3.1" fill="#FFD3E4"/>`).join('')}` : kind === 'bunny' ? `<path d="M-9 -19 Q0 -29 9 -19" stroke="#F28DB2" stroke-width="2.6" fill="none"/><circle cx="-9" cy="-18" r="6" fill="#fff" stroke="#F7A0C1" stroke-width="1.8"/><circle cx="9" cy="-18" r="6" fill="#fff" stroke="#F7A0C1" stroke-width="1.8"/><circle cx="-9" cy="-18" r="3" fill="#FFD3E4"/><circle cx="9" cy="-18" r="3" fill="#FFD3E4"/>` : `<path d="M-20 2 Q0 -22 20 2" stroke="#F28DB2" stroke-width="3" fill="none"/><circle cx="-20" cy="4" r="7" fill="#fff" stroke="#F7A0C1" stroke-width="2"/><circle cx="20" cy="4" r="7" fill="#fff" stroke="#F7A0C1" stroke-width="2"/><circle cx="-20" cy="4" r="3.5" fill="#FFD3E4"/><circle cx="20" cy="4" r="3.5" fill="#FFD3E4"/>` },
    beret: { cm: { '#B9A7F5': 'f', '#8F7BE0': 's' }, slot: 'head', P: { cloud: [5, -29, 1.15], bunny: [-5, -19, 1.05] }, g: () => `<ellipse rx="16" ry="6.5" fill="#B9A7F5" stroke="#8F7BE0" stroke-width="1.6" transform="rotate(-12)"/><path d="M-2 -6 q1 -4 3 -5" stroke="#8F7BE0" stroke-width="2" fill="none"/>` },
    strawhat: { cm: { '#F28DB2': 's' }, slot: 'head', P: { cloud: [0, -27, 1.2], bunny: [0, -17, 1.1] }, g: () => `<ellipse cx="0" cy="2" rx="24" ry="6" fill="#F7DCA0" stroke="#D9AE52" stroke-width="1.6"/><path d="M-12 2 q0 -16 12 -16 q12 0 12 16z" fill="#F9E3B0" stroke="#D9AE52" stroke-width="1.6"/><path d="M-12 -1 h24" stroke="#F28DB2" stroke-width="3.4"/><circle cx="9" cy="-2" r="3" fill="#FFD36E"/>` },
    // 얼굴
    glasses: { slot: 'face', P: { cloud: [0, 6.5, 1], bunny: [0, 2.5, 1] }, g: () => `<g fill="rgba(220,235,255,.35)" stroke="#6E5CA3" stroke-width="1.8"><circle cx="-8.5" r="6.2"/><circle cx="8.5" r="6.2"/></g><path d="M-2.4 0 h4.8" stroke="#6E5CA3" stroke-width="1.8"/>` },
    sticker: { slot: 'face', P: { cloud: [0, 12, 1], bunny: [0, 8, 1] }, g: () => heart(-15.5, 0, 1, '#F28DB2') + heart(15.5, 0, 1, '#F28DB2') },
    freckle: { slot: 'face', P: { cloud: [0, 12, 1], bunny: [0, 8, 1] }, g: () => [[-17, -1], [-13, 2], [13, 2], [17, -1]].map(([x, y]) => star(x, y, .24)).join('') },
    // 목
    scarf: { cm: { '#9FD9F2': 'f', '#5DB3D8': 's' }, slot: 'neck', P: { cloud: [0, 25.5, 1.2], bunny: [0, 17, .9] }, g: () => ACC.scarf() },
    pearl: { slot: 'neck', P: { cloud: [0, 19, 1.25], bunny: [0, 15, .85] }, g: () => [-14, -9, -4.5, 0, 4.5, 9, 14].map(x => `<circle cx="${x}" cy="${(4 - Math.abs(x) * .22).toFixed(1)}" r="2.4" fill="#fff" stroke="#D3CBE6" stroke-width=".9"/>`).join('') },
    tie: { cm: { '#7FB0EA': 'f', '#5D8FD0': 's' }, slot: 'neck', P: { cloud: [0, 22, .9], bunny: [0, 17, .75] }, g: () => `<path d="M0 0 L-9 -5 L-9 5 Z M0 0 L9 -5 L9 5 Z" fill="#7FB0EA" stroke="#5D8FD0" stroke-width="1.2"/><g class="rbn"><path d="M-7 -2.5 v5 M-4.5 -3.5 v7 M7 -2.5 v5 M4.5 -3.5 v7" stroke="#fff" stroke-width=".9" stroke-dasharray="1.2 1"/><circle r="2.6" fill="#FFD36E" stroke="#D9962E" stroke-width=".8"/></g>` },
    // 몸 (친구마다 모양이 다르다)
    apron: { cm: { '#F7A0C1': 's', '#FFE0EA': 'l', '#FFE1EC': 'l', '#E5679A': 's', '#F28DB2': 's' }, slot: 'body', layer: 'body', k: {
      cloud: () => `<path d="M-18 21 h36 v10 a8 8 0 0 1 -8 8 h-20 a8 8 0 0 1 -8 -8z" fill="#fff" stroke="#F7A0C1" stroke-width="1.8"/><path d="M-18 21 l-11 -4 M18 21 l11 -4" stroke="#F7A0C1" stroke-width="2"/><rect x="-6" y="26" width="12" height="7" rx="2" fill="#FFE0EA" stroke="#F7A0C1" stroke-width="1.2"/>${rbn(0, 21.5, .75)}`,
      bunny: () => `<path d="M-10 19 h20 v10 a7 7 0 0 1 -7 7 h-6 a7 7 0 0 1 -7 -7z" fill="#FFE1EC" stroke="#E5679A" stroke-width="1.7"/><path d="M-8.5 33 q1.5 2 3 0 q1.5 2 3 0 q1.5 2 3 0 q1.5 2 3 0 q1.5 2 3 0" fill="none" stroke="#fff" stroke-width="1.3"/><path d="M-10 19 l-3 -3 M10 19 l3 -3" stroke="#E5679A" stroke-width="1.6"/><rect x="-4" y="23.5" width="8" height="5" rx="1.5" fill="#fff" stroke="#F28DB2" stroke-width=".9"/>${rbn(0, 19.5, .55)}` } },
    cape: { cm: { '#B9A7F5': 'f', '#8F7BE0': 's', '#C9B8FF': 'l' }, slot: 'body', layer: 'back', k: {
      cloud: () => `<path d="M-30 -4 Q0 6 30 -4 L40 34 Q0 44 -40 34 Z" fill="#B9A7F5" stroke="#8F7BE0" stroke-width="1.8"/><path d="M-36 30 Q0 39 36 30 L38 33 Q0 43 -38 33Z" fill="#C9B8FF" opacity=".9"/><path d="M-20 2 L-27 30 M20 2 L27 30" stroke="#8F7BE0" stroke-width="1" opacity=".45"/>${star(-26, 28, .35)}${star(24, 30, .3)}${rbn(0, 1, .9, '#FFD36E', '#D9962E')}`,
      bunny: () => `<path d="M-12 15 Q0 19 12 15 L27 43 Q0 50 -27 43 Z" fill="#B9A7F5" stroke="#8F7BE0" stroke-width="1.6"/>${star(-21, 38, .28)}${star(21, 39, .24)}` },
      kf: { bunny: () => `<path d="M-11 15 L-3 19 L-7 25 Z M11 15 L3 19 L7 25 Z" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="1.3" stroke-linejoin="round"/>${rbn(0, 19, .6, '#FFD36E', '#D9962E')}` } },
    pajama: { cm: { '#CFE3FF': 'l', '#9EC2F2': 'f', '#5D8FD0': 's' }, slot: 'body', layer: 'body', k: {
      cloud: () => `<path d="M-33 12 Q0 22 33 12 Q36 22 30 26 Q0 34 -30 26 Q-36 22 -33 12Z" fill="#CFE3FF" stroke="#9EC2F2" stroke-width="1.6"/>${[[-18, 21], [0, 25], [18, 21]].map(([x, y]) => star(x, y, .3)).join('')}${rbn(-24, 16, .6, '#9EC2F2', '#5D8FD0')}${rbn(24, 16, .6, '#9EC2F2', '#5D8FD0')}`,
      bunny: () => `<ellipse cx="0" cy="29" rx="11.5" ry="10" fill="#CFE3FF" stroke="#9EC2F2" stroke-width="1.6"/>${star(-4, 27, .26)}${star(5, 32, .22)}${rbn(0, 21, .5, '#9EC2F2', '#5D8FD0')}` } },
    dress: { cm: { '#FFC7D9': 'f', '#E5679A': 's' }, slot: 'body', layer: 'body', k: {
      cloud: () => `<path d="M-30 16 Q0 24 30 16 L36 32 Q24 38 12 33 Q0 39 -12 33 Q-24 38 -36 32 Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="1.6"/>${[-20, -6, 8, 22].map(x => `<circle cx="${x}" cy="27" r="2" fill="#fff"/>`).join('')}<g class="rbn"><path d="M-34 31 Q-30 35 -26 33 Q-22 37 -18 34 Q-14 38 -10 35 Q-6 39 0 36 Q6 39 10 35 Q14 38 18 34 Q22 37 26 33 Q30 35 34 31" fill="none" stroke="#fff" stroke-width="1.8"/></g>${rbn(-22, 18, .7)}`,
      bunny: () => `<path d="M-12 22 Q0 25 12 22 L17 38 Q8 42 0 39 Q-8 42 -17 38 Z" fill="#FFC7D9" stroke="#E5679A" stroke-width="1.6"/>${[-8, 0, 8].map(x => `<circle cx="${x}" cy="33" r="1.6" fill="#fff"/>`).join('')}${rbn(0, 23, .55)}` } },
    // 손 (구름이는 옆에 띄워 든다)
    balloon: { cm: { '#F7A0C1': 'f', '#E5679A': 's' }, slot: 'hand', H: true, rot: { bunny: 36 }, g: () => `<path d="M0 0 q4 -16 -2 -34" stroke="#B9A7C4" stroke-width="1.2" fill="none"/><ellipse cx="-2" cy="-44" rx="9" ry="11" fill="#F7A0C1" stroke="#E5679A" stroke-width="1.2"/><ellipse cx="-5" cy="-48" rx="2.4" ry="3.6" fill="#fff" opacity=".6"/><path d="M-2 -33 l-2 3 h4z" fill="#E5679A"/>` },
    umbrella: { cm: { '#9EC2F2': 'f', '#5D8FD0': 's' }, slot: 'hand', H: true, rot: { bunny: 48 }, g: () => `<path d="M0 4 V-30" stroke="#8C6248" stroke-width="2"/><path d="M0 6 q0 4 -4 4" stroke="#8C6248" stroke-width="2" fill="none"/><path d="M-20 -30 Q0 -52 20 -30 Q15 -34 10 -30 Q5 -34 0 -30 Q-5 -34 -10 -30 Q-15 -34 -20 -30Z" fill="#9EC2F2" stroke="#5D8FD0" stroke-width="1.4"/><path d="M0 -48 Q-6 -40 -10 -30 M0 -48 Q6 -40 10 -30" stroke="#5D8FD0" stroke-width=".9" fill="none" opacity=".7"/><path d="M-12 -40 q4 -5 9 -6" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="0" cy="-49" r="1.6" fill="#5D8FD0"/>` },
    wand: { slot: 'hand', H: true, rot: { bunny: 14 }, g: () => `<path d="M0 6 L8 -16" stroke="#C99A6E" stroke-width="2.6" stroke-linecap="round"/>${star(9, -19, .6, 12)}` },
    bouquet: { slot: 'hand', H: true, g: () => `<path d="M-4 8 L0 -6 L4 8Z" fill="#9FDDB4" stroke="#4FAA6C" stroke-width="1.2"/>${[[-5, -9, '#F7A0C1'], [0, -13, '#FFD36E'], [5, -9, '#C9B8FF'], [0, -7, '#FFB9A6']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4" fill="${c}"/>`).join('')}<path d="M-4 3 h8" stroke="#F28DB2" stroke-width="2"/>` },
    // 등
    bag: { cm: { '#FFB9A6': 'f', '#D9776A': 's', '#FFD3C7': 'l', '#FFE0D6': 'l' }, slot: 'back', layer: 'body', k: {
      cloud: () => `<path d="M-31 -1 Q-41 6 -34 15" fill="none" stroke="#D9776A" stroke-width="2.6" stroke-linecap="round"/><g transform="translate(-32 22) rotate(-8)"><rect x="-8" y="-8" width="16" height="15" rx="5" fill="#FFB9A6" stroke="#D9776A" stroke-width="1.6"/><path d="M-8 -3 h16 v3 a5 5 0 0 1 -5 0 h-6 a5 5 0 0 1 -5 0z" fill="#FFD3C7" stroke="#D9776A" stroke-width="1.2"/>${rbn(0, 0, .55)}</g>`,
      bunny: () => `<path d="M9 16 Q0 24 -11 30" fill="none" stroke="#D9776A" stroke-width="1.8" stroke-linecap="round"/><g transform="translate(-12 32) rotate(-8) scale(.62)"><rect x="-8" y="-8" width="16" height="15" rx="5" fill="#FFB9A6" stroke="#D9776A" stroke-width="2"/><path d="M-8 -3 h16 v3 a5 5 0 0 1 -5 0 h-6 a5 5 0 0 1 -5 0z" fill="#FFD3C7" stroke="#D9776A" stroke-width="1.4"/>${rbn(0, 0, .6)}</g>` } },
    wings: { cm: { '#FFC7E6': 'f', '#E5679A': 's' }, slot: 'back', layer: 'back', P: { cloud: [0, 8, 1.4], bunny: [0, 22, .8] }, g: () => `<path d="M0 0 C-14 -22 -36 -18 -30 -2 C-36 10 -16 16 0 4 Z M0 0 C14 -22 36 -18 30 -2 C36 10 16 16 0 4Z" fill="#FFC7E6" stroke="#E5679A" stroke-width="1.4" opacity=".95"/><circle cx="-20" cy="-6" r="3" fill="#fff"/><circle cx="20" cy="-6" r="3" fill="#fff"/>` }
  };
  const HAND_AT = { cloud: [36, 10], bunny: [15, 25] };
  // 옷 색: 원래 색(base) + 6가지. f=바탕, s=테두리·진한 색, l=연한 색
  const PAL = { pink: ['분홍', '#FFC7D9', '#E5679A', '#FFE6EF'], lav: ['보라', '#C9B8FF', '#8F7BE0', '#EEE8FF'], mint: ['민트', '#A8E6CF', '#3FAE86', '#E2F7EE'],
    sky: ['하늘', '#A9D2F7', '#5D8FD0', '#E3F0FF'], lemon: ['노랑', '#FFE08A', '#D9A23A', '#FFF6D6'], peach: ['살구', '#FFC2A6', '#D9776A', '#FFE9DE'] };
  function recolor(svg, id, col) {
    const w = W[id], c = col && col[id]; if (!w || !w.cm || !c || !PAL[c]) return svg;
    const P = PAL[c], role = { f: P[1], s: P[2], l: P[3] };
    for (const [from, r] of Object.entries(w.cm)) svg = svg.split(from).join(role[r]).split(from.toLowerCase()).join(role[r]);
    return svg;
  }
  const layerOfW = (id) => W[id].layer || (W[id].slot === 'hand' ? 'hand' : W[id].slot);
  function wearSVG(kind, wear, layer, col) {
    if (!wear) return '';
    const fk = kind === 'cloud' ? 'cloud' : 'bunny', fr = layer === 'neck' ? Object.values(wear).filter(id => W[id] && W[id].kf && W[id].kf[fk]).map(id => recolor(W[id].kf[fk](), id, col)).join('') : '';
    return fr + Object.values(wear).filter(id => W[id] && layerOfW(id) === layer).map(id => recolor((() => {
      const w = W[id];
      const bk = kind === 'cloud' ? 'cloud' : 'bunny';
      if (w.k) return w.k[bk]();
      if (w.H) { const [x, y] = HAND_AT[bk]; return `<g transform="translate(${x} ${y}) rotate(${(w.rot && w.rot[bk]) || 0}) scale(${bk === 'bunny' ? .8 : 1})">${w.g(bk)}</g>`; }
      const [x, y, sc] = w.P[bk]; return `<g transform="translate(${x} ${y}) scale(${sc})">${w.g(bk, kind)}</g>`;
    })(), id, col)).join('');
  }
  // look: 예전 방식(장식 이름 문자열) 또는 { wear: {부위: 옷}, tint }
  function normLook(look) {
    if (!look) return { wear: {}, tint: 'base' };
    if (typeof look === 'string') return { wear: W[look] ? { [W[look].slot]: look } : {}, tint: 'base' };
    return { wear: look.wear || {}, tint: look.tint || 'base', dirt: look.dirt || 0, col: look.col || {}, trait: look.trait || null };
  }
  // 옷 하나만 따로 (옷장 칸 그림)
  function wearIcon(id, kind = 'bunny', col) {
    return recolor(wearIcon0(id, kind), id, col);
  }
  function wearIcon0(id, kind) {
    installDefs(); const w = W[id]; if (!w) return ''; if (kind !== 'cloud') kind = 'bunny';
    let inner;
    if (id === 'bag') inner = `<g transform="translate(0 -4) scale(2.3)"><path d="M-6 -7 Q0 -16 6 -7" fill="none" stroke="#D9776A" stroke-width="1.6"/><rect x="-8" y="-8" width="16" height="15" rx="5" fill="#FFB9A6" stroke="#D9776A" stroke-width="1.4"/><path d="M-8 -3 h16 v3 a5 5 0 0 1 -5 0 h-6 a5 5 0 0 1 -5 0z" fill="#FFD3C7" stroke="#D9776A" stroke-width="1.1"/>${rbn(0, 0, .55)}</g>`;
    else if (w.k) inner = `<g transform="translate(0 ${kind === 'bunny' ? -28 : -20}) scale(${kind === 'bunny' ? 1.6 : 1})">${w.k[kind]()}</g>`;
    else if (w.H) inner = `<g transform="translate(0 14) scale(1.3)">${w.g()}</g>`;
    else inner = `<g transform="scale(1.5)">${w.g()}</g>`;
    return `<svg viewBox="-30 -36 60 60" aria-hidden="true">${inner}</svg>`;
  }

  // 입 위치(그림 상자 안 비율, 0~1). 먹는 애니메이션이 여기에 간식을 놓는다
  function mouth(kind, stage) {
    if (stage <= 2) return [.5, .62];
    if (kind !== 'cloud') { const s = [0, 0, 0, 1.05, 1.16, 1.24, 1.28, 1.32, 1.36, 1.4, 1.44][stage] || 1.2; const ty = 60 - 44 * s; return [.5, (ty + 10.5 * s + 92) / 156]; }
    const s = [0, 0, 0, 1.0, 1.16, 1.28, 1.34, 1.38, 1.42, 1.46, 1.5][stage] || 1.2; return [.5, (50 - 30 * s + 14 * s + 92) / 156];
  }
  function draw(kind, stage, mood, look) { installDefs(); CUR_MOOD = mood || 'idle'; CUR_STAGE = stage; const r = kind === 'cloud' ? cloud(stage, mood, look) : bunny(stage, mood, look, PARTS[kind] ? kind : 'bunny'); setTint(kind, 'base'); return r; }

  // ---------- 작은 그림 ----------
  const icons = {
    candy: `<svg viewBox="-20 -20 40 40">${star(0, 0, 1.6, 8)}<circle cx="-5" cy="-4" r="2" fill="#fff" opacity=".8"/></svg>`,
    berry: `<svg viewBox="-20 -20 40 40"><path d="M0 -8 C12 -10 16 0 10 10 C6 16 -6 16 -10 10 C-16 0 -12 -10 0 -8Z" fill="#F2678F" stroke="#C9466F" stroke-width="1.5"/><path d="M-7 -10 l4 3 3 -5 3 5 4 -3 -2 5 -10 0z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1.2" stroke-linejoin="round"/><g fill="#FFE29A"><circle cx="-4" cy="0" r="1"/><circle cx="3" cy="-1" r="1"/><circle cx="0" cy="5" r="1"/><circle cx="6" cy="5" r="1"/><circle cx="-6" cy="6" r="1"/></g></svg>`,
    hand: `<svg viewBox="0 0 64 64"><path d="M20 34V16a4 4 0 0 1 8 0v14V11a4 4 0 0 1 8 0v19V14a4 4 0 0 1 8 0v20l3-5a4 4 0 0 1 7 4l-8 15c-3 6-8 9-15 9h-3c-8 0-14-6-14-14v-9a4 4 0 0 1 8 0" fill="#FFE3D3" stroke="#E79A7C" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 6 l2 4 4 1 -4 1 -2 4 -2 -4 -4 -1 4 -1z" fill="#F7A0C1"/></svg>`,
    bubble: `<svg viewBox="0 0 64 64"><circle cx="26" cy="36" r="18" fill="#EEF4FF" stroke="#A996F0" stroke-width="2.5"/><circle cx="46" cy="18" r="10" fill="#FFEFF5" stroke="#F28DB2" stroke-width="2.5"/><circle cx="20" cy="29" r="4" fill="#fff"/><circle cx="43" cy="15" r="2.4" fill="#fff"/></svg>`,
    moon: `<svg viewBox="0 0 64 64"><path d="M40 8 A24 24 0 1 0 56 44 A19 19 0 1 1 40 8Z" fill="url(#cn-star)" stroke="#E8A93C" stroke-width="2.5" stroke-linejoin="round"/><path d="M48 14 l1.6 3.4 3.4 1.6 -3.4 1.6 -1.6 3.4 -1.6 -3.4 -3.4 -1.6 3.4 -1.6z" fill="#fff"/></svg>`
  };
  function icon(n) { installDefs(); return icons[n] || ''; }

  function frame(kind, stage) {
    if (stage <= 2) return { s: 1, ty: 0 };
    if (kind !== 'cloud') { const s = [0, 0, 0, 1.05, 1.16, 1.24, 1.28, 1.32, 1.36, 1.4, 1.44][stage] || 1.2; return { s, ty: 60 - 44 * s }; }
    const s = [0, 0, 0, 1.0, 1.16, 1.28, 1.34, 1.38, 1.42, 1.46, 1.5][stage] || 1.2; return { s, ty: 50 - 30 * s };
  }
  const KINDS = ['cloud', 'bunny', 'puppy', 'kitty', 'dragon'];
  return { frame, draw, icon, star, ACC, installDefs, mouth, WEAR: W, wearIcon, TINT_DEF, PAL, KINDS };
})();
