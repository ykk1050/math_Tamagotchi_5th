// 요리 단계 애니메이션: 재료·도구 그림과 동작 (모두 SVG·CSS로 직접 만듦)
const CookFX = (() => {
  const S = (vb, inner) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;
  // 재료와 도구 그림 (64×64)
  const ING = {
    berry: `<path d="M32 18 C48 14 56 28 50 42 C46 52 38 58 32 58 C26 58 18 52 14 42 C8 28 16 14 32 18Z" fill="#F2678F" stroke="#C9466F" stroke-width="2.4"/><path d="M22 14 l6 5 4 -9 4 9 6 -5 -3 9 h-14z" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1.8" stroke-linejoin="round"/><g fill="#FFE29A"><circle cx="26" cy="30" r="1.6"/><circle cx="36" cy="28" r="1.6"/><circle cx="31" cy="38" r="1.6"/><circle cx="40" cy="40" r="1.6"/><circle cx="23" cy="42" r="1.6"/></g>`,
    carrot: `<path d="M18 22 C30 18 44 26 46 30 L22 58 C14 46 12 30 18 22Z" fill="#FFA05A" stroke="#D9742F" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 34 l6 2 M22 44 l6 2" stroke="#D9742F" stroke-width="2" stroke-linecap="round"/><path d="M42 26 c4 -10 10 -12 14 -12 c-2 6 -6 10 -12 14 M44 28 c8 -4 12 -2 14 2 c-6 2 -10 2 -14 0" fill="#7FCF95" stroke="#4FAA6C" stroke-width="1.8"/>`,
    egg: `<ellipse cx="32" cy="34" rx="16" ry="21" fill="#FFF9EC" stroke="#E2C99A" stroke-width="2.4"/><ellipse cx="26" cy="26" rx="4" ry="6" fill="#fff"/>`,
    butter: `<path d="M12 30 l28 -10 l14 10 l-28 10z" fill="#FFE69A" stroke="#D9AE52" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 30 v12 l14 10 v-12z M26 40 v12 l28 -10 v-12z" fill="#FFD866" stroke="#D9AE52" stroke-width="2.2" stroke-linejoin="round"/>`,
    stick: `<rect x="29" y="4" width="6" height="56" rx="3" fill="#F2D3B6" stroke="#C99A6E" stroke-width="2"/>`,
    cream: `<path d="M14 48 h36 c0 -8 -6 -10 -10 -10 c4 -4 2 -12 -6 -12 c2 -6 -2 -12 -6 -14 c0 6 -4 10 -8 12 c-6 2 -8 8 -4 12 c-4 0 -2 12 -2 12z" fill="#fff" stroke="#E6DDF7" stroke-width="2.4" stroke-linejoin="round"/><path d="M22 36 q10 4 20 0" stroke="#F3D3E2" stroke-width="2" fill="none"/>`,
    milk: `<path d="M18 22 l8 -12 h12 l8 12 v34 a4 4 0 0 1 -4 4 h-20 a4 4 0 0 1 -4 -4z" fill="#fff" stroke="#9EC2F2" stroke-width="2.4" stroke-linejoin="round"/><path d="M18 30 h28 v12 h-28z" fill="#BFDCFF"/><circle cx="32" cy="36" r="4" fill="#fff"/><path d="M26 10 h12 v-4 h-12z" fill="#9EC2F2"/>`,
    honey: `<path d="M16 24 h32 v28 a6 6 0 0 1 -6 6 h-20 a6 6 0 0 1 -6 -6z" fill="#FFC54D" stroke="#D9962E" stroke-width="2.4"/><rect x="14" y="16" width="36" height="9" rx="3" fill="#F2A3C0" stroke="#D9628E" stroke-width="2"/><path d="M24 34 h16 v10 h-16z" fill="#FFF3C9" rx="2"/><path d="M30 37 l2 -2 l2 2 v4 l-2 2 l-2 -2z" fill="#FFC54D"/>`,
    flour: `<path d="M16 14 h32 l-4 8 l4 34 a4 4 0 0 1 -4 4 h-24 a4 4 0 0 1 -4 -4 l4 -34z" fill="#FFF6E8" stroke="#D9B98E" stroke-width="2.4" stroke-linejoin="round"/><path d="M24 32 c4 -6 12 -6 16 0 c-4 6 -12 6 -16 0z" fill="#F2D3B6"/><path d="M32 26 v-4" stroke="#D9B98E" stroke-width="2"/>`,
    sugar: `<rect x="16" y="14" width="32" height="44" rx="5" fill="#E9F3FF" stroke="#9EC2F2" stroke-width="2.4"/><g fill="#fff" stroke="#BFD6F5" stroke-width="1.4"><rect x="22" y="26" width="8" height="8" rx="1.5"/><rect x="33" y="28" width="8" height="8" rx="1.5"/><rect x="27" y="38" width="8" height="8" rx="1.5"/></g>`,
    whisk: `<path d="M32 4 v22" stroke="#C99A6E" stroke-width="5" stroke-linecap="round"/><path d="M32 26 c-12 6 -12 26 0 32 c12 -6 12 -26 0 -32z M32 26 c-6 6 -6 26 0 32 c6 -6 6 -26 0 -32z" fill="none" stroke="#9AA6B8" stroke-width="2.4"/>`,
    masher: `<path d="M32 4 v34" stroke="#C99A6E" stroke-width="5" stroke-linecap="round"/><path d="M16 40 h32 v6 h-32z" fill="#B7C3D6" stroke="#8D9AB0" stroke-width="2"/><path d="M20 46 v8 M28 46 v8 M36 46 v8 M44 46 v8" stroke="#8D9AB0" stroke-width="3" stroke-linecap="round"/>`,
    shaker: `<path d="M20 24 h24 v30 a6 6 0 0 1 -6 6 h-12 a6 6 0 0 1 -6 -6z" fill="#C9B8FF" stroke="#8F7BE0" stroke-width="2.4"/><path d="M22 24 c0 -10 20 -10 20 0z" fill="#FFE29A" stroke="#D9AE52" stroke-width="2"/><g fill="#8F7BE0"><circle cx="28" cy="18" r="1.4"/><circle cx="32" cy="16" r="1.4"/><circle cx="36" cy="18" r="1.4"/></g>`,
    pan: `<ellipse cx="28" cy="38" rx="22" ry="9" fill="#6E6A86" stroke="#4E4A66" stroke-width="2.4"/><ellipse cx="28" cy="36" rx="17" ry="6" fill="#8A86A3"/><path d="M48 36 l14 -6" stroke="#C99A6E" stroke-width="6" stroke-linecap="round"/>`,
    pancake: `<ellipse cx="32" cy="34" rx="20" ry="7" fill="#F9D99B" stroke="#C98A3D" stroke-width="2.4"/><ellipse cx="28" cy="32" rx="6" ry="2" fill="#FFF0C9"/>`,
    oven: `<rect x="6" y="8" width="52" height="50" rx="8" fill="#FFF4F7" stroke="#E5679A" stroke-width="2.6"/><rect x="12" y="20" width="40" height="30" rx="5" fill="#5A4A70"/><rect class="glow" x="14" y="22" width="36" height="26" rx="4" fill="#FFB25A"/><circle cx="16" cy="14" r="2.4" fill="#E5679A"/><circle cx="24" cy="14" r="2.4" fill="#F7A0C1"/><path d="M36 14 h16" stroke="#F3D3E2" stroke-width="3" stroke-linecap="round"/>`
  };
  const ing = (id) => S('0 0 64 64', ING[id] || '');
  const COLORS = { berry: '#F2678F', carrot: '#FFA05A', egg: '#FFE38A', butter: '#FFD866', milk: '#FFFFFF', honey: '#FFC54D', flour: '#FFF1DE', sugar: '#FFFFFF', cream: '#FFFFFF' };

  function el(cls, html, style = '') { const d = document.createElement('div'); d.className = 'cfx ' + cls; d.innerHTML = html; if (style) d.style.cssText = style; return d; }
  function splash(host, color, n = 6, wide = false) {
    for (let i = 0; i < n; i++) {
      const a = (-160 + i * (140 / (n - 1))) * Math.PI / 180, d = (wide ? 70 : 40) + Math.random() * 25;
      const s = el('drop-p', '', `background:${color};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;animation-delay:${Math.random() * .05}s`);
      host.appendChild(s); setTimeout(() => s.remove(), 900);
    }
  }
  // 한 단계 재생. host는 그릇 위에 놓인 상자, stage는 흔들기용 배경. 끝나는 시간(ms)을 돌려준다
  function play(host, bg, action, id, color, ok) {
    host.innerHTML = '';
    const c = COLORS[id] || color;
    const T = { drop: 1100, pour: 1500, stir: 1500, mash: 1400, bake: 1900, shake: 1200, sprinkle: 1400, spin: 1500, top: 1100, flip: 1400 }[action] || 1100;
    if (action === 'drop') {
      const n = id === 'berry' ? 3 : 1;
      for (let i = 0; i < n; i++) {
        const d = el('ing falling', ing(id), `left:${50 + (i - (n - 1) / 2) * 22}%;animation-delay:${i * .18}s`);
        host.appendChild(d);
      }
      setTimeout(() => splash(host, c === '#FFFFFF' ? '#DCEBFF' : c, 7), 520 + (n - 1) * 180);
    } else if (action === 'pour') {
      host.appendChild(el('ing pouring', ing(id)));
      host.appendChild(el('stream', '', `background:linear-gradient(${c},${c === '#FFFFFF' ? '#EAF2FF' : c})`));
      setTimeout(() => splash(host, c === '#FFFFFF' ? '#DCEBFF' : c, 5), 900);
    } else if (action === 'stir') {
      host.appendChild(el('swirl', S('0 0 100 40', `<ellipse cx="50" cy="20" rx="38" ry="12" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="18 10" opacity=".9"/><ellipse cx="50" cy="20" rx="22" ry="7" fill="none" stroke="${color}" stroke-width="4" stroke-dasharray="12 8"/>`)));
      host.appendChild(el('ing stirring', ing('whisk')));
    } else if (action === 'mash') {
      host.appendChild(el('ing mashing', ing('masher')));
      [350, 750, 1150].forEach(t => setTimeout(() => splash(host, color, 4), t));
    } else if (action === 'bake') {
      host.appendChild(el('ing oven', ing('oven')));
      host.appendChild(el('ding', '띵!'));
    } else if (action === 'shake') {
      bg.classList.remove('shaking'); void bg.offsetWidth; bg.classList.add('shaking');
      setTimeout(() => bg.classList.remove('shaking'), T);
      [200, 600].forEach(t => setTimeout(() => splash(host, color, 3), t));
    } else if (action === 'sprinkle') {
      host.appendChild(el('ing shaking-tool', ing('shaker')));
      const cols = ['#F7A0C1', '#8FE0C9', '#FFD36E', '#B9A7F5'];
      for (let i = 0; i < 18; i++) host.appendChild(el('sprk', '', `left:${40 + Math.random() * 30}%;background:${cols[i % 4]};animation-delay:${.3 + Math.random() * .7}s`));
    } else if (action === 'spin') {
      host.appendChild(el('spinner', S('0 0 100 100', `<g fill="none" stroke-width="7" stroke-linecap="round"><circle cx="50" cy="50" r="40" stroke="#E6DDF7" stroke-dasharray="40 20"/><circle cx="50" cy="50" r="28" stroke="${color}" stroke-dasharray="30 14"/><circle cx="50" cy="50" r="15" stroke="#FFC7D9" stroke-dasharray="18 10"/></g>`)));
    } else if (action === 'top') {
      host.appendChild(el('ing topping', ing(id)));
      setTimeout(() => splash(host, '#fff', 5), 600);
    } else if (action === 'flip') {
      host.appendChild(el('ing panbase', ing('pan')));
      host.appendChild(el('ing flipping', ing('pancake')));
    }
    if (!ok) setTimeout(() => { splash(host, color, 5, true); host.appendChild(el('oops', '앗, 조금 흘렸다!')); }, T * .6);
    setTimeout(() => { host.innerHTML = ''; }, T + 150);
    return T;
  }
  // 완성: 그릇 위로 간식이 솟아오른다
  function done(host, foodSvg) {
    host.innerHTML = '';
    host.appendChild(el('dish', foodSvg));
    const cols = ['#FFD36E', '#F7A0C1', '#B9A7F5', '#8FE0C9'];
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; host.appendChild(el('drop-p star-p', '', `background:${cols[i % 4]};--dx:${Math.cos(a) * 90}px;--dy:${Math.sin(a) * 70 - 40}px;animation-delay:.5s`)); }
    return 1300;
  }
  return { play, done, ing };
})();
