// 게임 데이터: 음식(레시피), 장소, 아이템, 바람, 친구별 좋고 싫은 것, 이야기
// 저장 데이터는 id로 가리키므로 id를 바꾸지 말고, 새 것은 뒤에 덧붙인다.
const DATA = (() => {
  const FOODS = {
    milk:    { name: '딸기 우유',   color: '#F7A9C6', steps: ['딸기 씻기', '딸기 으깨기', '우유 붓기', '꿀 한 숟갈', '살살 흔들기'] },
    cake:    { name: '당근 케이크', color: '#FFB27A', steps: ['당근 갈기', '밀가루 넣기', '반죽 섞기', '오븐에 굽기', '크림 바르기'] },
    cotton:  { name: '솜사탕',      color: '#C9B8FF', steps: ['설탕 붓기', '기계 켜기', '빙글빙글 감기', '색 입히기', '막대 꽂기'] },
    cookie:  { name: '별 쿠키',     color: '#FFD36E', steps: ['버터 녹이기', '반죽하기', '별 모양 찍기', '오븐에 굽기', '반짝 가루'] },
    pudding: { name: '구름 푸딩',   color: '#FFF1C9', steps: ['우유 데우기', '달걀 풀기', '컵에 붓기', '찜기에 찌기', '구름 크림'] },
    pancake: { name: '꿀 팬케이크', color: '#F2C27B', steps: ['반죽 만들기', '팬 달구기', '동그랗게 붓기', '뒤집기', '꿀 뿌리기'] }
  };
  const PLACES = {
    garden: { name: '꽃밭',     sky: ['#DDF1FF', '#F3FBFF'], ground: '#BFE8C8', finds: ['flower', 'plant'], sights: ['나비가 팔랑팔랑 날아가요', '꽃향기가 솔솔 나요', '무당벌레가 인사해요'] },
    beach:  { name: '바닷가',   sky: ['#CFEFFF', '#F2FBFF'], ground: '#FBE7C2', finds: ['shell', 'cushion'], sights: ['파도가 철썩철썩', '갈매기가 끼룩끼룩', '모래가 반짝반짝해요'] },
    berry:  { name: '딸기밭',   sky: ['#FFE7EF', '#FFF7FA'], ground: '#C9EBC4', finds: ['berryhat', 'rug'], sights: ['빨간 딸기가 주렁주렁', '벌이 윙윙 날아다녀요', '달콤한 냄새가 나요'] },
    hill:   { name: '별빛 언덕', sky: ['#7E77C9', '#C9B6EE'], ground: '#A9D8C6', finds: ['lamp', 'crown'], sights: ['별똥별이 쉭 지나가요', '반딧불이가 반짝여요', '달님이 웃고 있어요'] }
  };
  // slot: 꾸미는 자리 / acc: 친구가 쓰는 것
  const ITEMS = {
    flower:   { name: '꽃핀',        kind: 'acc', price: 20 },
    crown:    { name: '작은 왕관',    kind: 'acc', price: 30 },
    berryhat: { name: '딸기 모자',    kind: 'acc', price: 25 },
    scarf:    { name: '포근 목도리',  kind: 'acc', price: 20 },
    bow:      { name: '분홍 리본',    kind: 'acc', price: 15 },
    shell:    { name: '조개 장식',    kind: 'decor', slot: 'sill', price: 15 },
    plant:    { name: '꽃 화분',      kind: 'decor', slot: 'floorL', price: 15 },
    lamp:     { name: '별 조명',      kind: 'decor', slot: 'shelf', price: 20 },
    cushion:  { name: '구름 쿠션',    kind: 'decor', slot: 'floorR', price: 20 },
    rug:      { name: '딸기 러그',    kind: 'decor', slot: 'rug', price: 25 },
    frame:    { name: '우리 사진 액자', kind: 'decor', slot: 'wall', price: 15 }
  };
  const CARE = {
    pet:    { name: '쓰다듬기',   wish: '쓰다듬어 줬으면 좋겠어…' },
    bath:   { name: '거품 목욕',  wish: '몸이 꼬질꼬질해. 씻고 싶어!' },
    play:   { name: '비눗방울 놀이', wish: '같이 비눗방울 놀이 하고 싶어!' },
    nap:    { name: '낮잠 재우기', wish: '하암… 낮잠 자고 싶어' }
  };
  // 친구마다 좋아하는 것과 싫어하는 것 (친구 수첩에서 하나씩 알아낸다)
  const TASTE = {
    cloud: {
      food: { cotton: 'love', pudding: 'love', milk: 'like', cookie: 'like', pancake: 'like', cake: 'hate' },
      place: { hill: 'love', beach: 'like', garden: 'like', berry: 'like' },
      acc: { crown: 'love', scarf: 'like', flower: 'like', bow: 'like', berryhat: 'hate' }
    },
    bunny: {
      food: { cake: 'love', milk: 'love', cookie: 'like', pudding: 'like', pancake: 'like', cotton: 'hate' },
      place: { berry: 'love', garden: 'like', beach: 'like', hill: 'like' },
      acc: { flower: 'love', berryhat: 'like', bow: 'like', scarf: 'like', crown: 'hate' }
    }
  };
  const TASTE_LINE = {
    cloud: {
      food: { love: ['우와아, {x}! 이거 세상에서 제일 좋아해!', '{x}… 입에서 사르르 녹아. 행복해.'], like: ['냠냠, {x} 맛있다!', '{x} 좋아. 고마워!'], hate: ['음… {x}는 조금 딱딱해서 별로야. 그래도 고마워.', '{x}는 내 입맛엔 좀… 헤헤, 미안.'] },
      place: { love: ['여기야, 여기! {x}는 내가 태어난 곳이랑 닮았어.'], like: ['{x} 좋다! 바람이 상쾌해.'] },
      acc: { love: ['{x}! 나 진짜 요정 같지? 너무 마음에 들어!'], like: ['{x} 잘 어울려?'], hate: ['{x}는… 왠지 나랑 안 어울리는 것 같아.'] }
    },
    bunny: {
      food: { love: ['꺄아, {x}! 내가 제일제일 좋아하는 거야!', '{x}… 귀가 저절로 쫑긋해져!'], like: ['냠냠, {x} 맛있다!', '{x} 좋아좋아!'], hate: ['으… {x}는 끈적끈적해서 싫어. 그래도 고마워.', '{x}는 수염에 붙어서 별로야…'] },
      place: { love: ['딸기밭이다! 여기 내 고향이야! 깡총깡총!'], like: ['{x} 좋다! 신나게 뛰어 볼래!'] },
      acc: { love: ['{x}! 너무 예쁘다, 거울 보여 줘!'], like: ['{x} 귀여워?'], hate: ['{x}는 귀 사이에서 자꾸 미끄러져…'] }
    }
  };
  // 우정 단계에서 열리는 이야기
  const STORY = {
    cloud: [
      { lv: 2, title: '구름의 고향', lines: ['있잖아, 나 사실 비밀이 하나 있어.', '나는 아주 높은 하늘, 별들이 사는 곳에서 왔어.', '어느 날 별똥별이 지나가다가 나를 톡 건드렸는데…', '눈을 떠 보니 이 둥지 안 알 속이었어.', '처음엔 무서웠는데, 네가 와 줘서 지금은 하나도 안 무서워.'] },
      { lv: 4, title: '비 오는 날', lines: ['나는 기분이 슬프면 몸에서 비가 내려.', '예전에는 그게 싫었어. 다들 비를 싫어하잖아.', '그런데 너랑 꽃밭에 갔을 때, 내 비 덕분에 꽃이 자랐잖아.', '그때 알았어. 내 눈물도 쓸모가 있구나.', '고마워. 네가 알려 준 거야.'] },
      { lv: 6, title: '제일 친한 친구', lines: ['오늘은 꼭 하고 싶은 말이 있어.', '하늘에는 구름이 아주 많지만, 서로 이름을 부르진 않아.', '그런데 너는 매일 내 이름을 불러 줘.', '그래서 나도 정했어.', '너는 내 제일 친한 친구야. 앞으로도 쭉!'] }
    ],
    bunny: [
      { lv: 2, title: '딸기밭에서 온 알', lines: ['나 어디서 왔는지 알려 줄까?', '나는 커다란 딸기밭 한가운데서 굴러왔어.', '데굴데굴 굴러서 언덕을 넘고 개울을 건너서…', '이 둥지에 쏙 들어갔지!', '그래서 딸기 냄새만 맡으면 마음이 콩콩 뛰어.'] },
      { lv: 4, title: '천둥이 무서워', lines: ['음… 이건 너한테만 말하는 건데.', '나는 천둥소리가 엄청 무서워.', '우르릉 쾅 하면 귀를 접고 이불 속에 숨어.', '근데 너랑 있으면 이상하게 덜 무서워.', '다음에 천둥 치면… 옆에 있어 줄 거지?'] },
      { lv: 6, title: '제일 친한 친구', lines: ['나 오늘 깡총 연습 백 번 했어!', '왜냐면 너한테 보여 주고 싶었거든.', '나는 신나는 일이 생기면 제일 먼저 네 얼굴이 떠올라.', '그게 제일 친한 친구라는 뜻이래.', '너는 내 제일제일 친한 친구야!'] }
    ]
  };
  const FRIEND_XP = [0, 0, 15, 40, 75, 120, 180, 250, 330, 420, 520];
  return { FOODS, PLACES, ITEMS, CARE, TASTE, TASTE_LINE, STORY, FRIEND_XP };
})();
