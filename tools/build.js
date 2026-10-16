// キョウチカのページをまとめて作る。ブラウザでも node でも動く。
function kyochikaBuild(D, aboutMain, TODAY, VER) {
  const { EV, SPOTS, GENRES, CRED, HOLIDAYS } = D;
  const KDV = (() => { let h = 5381; const t = JSON.stringify(EV); for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; return h.toString(36); })(); // data.js を毎回読み直させる
  const BASE = 'https://kyochika.jp', NAME = 'キョウチカ';
  const ids = new Set(EV.map(e => e.id));
  if (ids.size !== EV.length) throw new Error('id が重なっています');
  for (const e of EV) if (!/^[a-z0-9-]+$/.test(e.id)) throw new Error('id が正しくありません: ' + e.id);

  // エリア: 最寄り駅をまとめる。2件以上あるエリアだけページにする。
  const AREAS = [
    ['ueno', '上野', ['上野']],
    ['roppongi', '六本木・乃木坂', ['六本木', '乃木坂', '六本木一丁目']],
    ['ginza', '銀座・有楽町', ['銀座', '東銀座', '有楽町', '銀座一丁目']],
    ['shibuya', '渋谷・原宿・表参道', ['渋谷', '原宿', '表参道']],
    ['shinjuku', '新宿', ['新宿', '都庁前', '新宿三丁目', '西武新宿']],
    ['ebisu', '恵比寿・目黒', ['恵比寿', '目黒']],
    ['ikebukuro', '池袋', ['池袋', '東池袋']],
    ['shimokitazawa', '下北沢', ['下北沢']],
    ['kichijoji', '吉祥寺・高円寺', ['吉祥寺', '高円寺']],
    ['shirokane', '白金・麻布・東京タワー', ['白金台', '白金高輪', '広尾', '麻布十番', '神谷町', '赤羽橋', '芝公園', '御成門']],
    ['kiyosumi', '清澄白河', ['清澄白河']],
    ['odaiba', 'お台場', ['台場']],
    ['arakawa', '荒川区（町屋・日暮里・南千住）', ['町屋', '日暮里', '西日暮里', '南千住', '三河島']],
    ['katsushika', '葛飾区（亀有・金町・柴又）', ['亀有', '金町', '柴又', '青砥', '新小岩', '堀切菖蒲園', '京成立石', 'お花茶屋']],
    ['edogawa', '江戸川区（葛西・小岩・船堀）', ['葛西', '西葛西', '葛西臨海公園', '小岩', '船堀', '一之江', '瑞江', '平井']],
  ];
  const GENRE_PAGES = { art: ['art', '美術展・アート展'], live: ['live', 'ライブ・コンサート'], food: ['food', 'フードイベント'], market: ['market', 'マーケット・蚤の市'], festival: ['festival', '祭り・地域の催し'], popup: ['popup', 'ポップアップ・期間限定の店'] };
  const SHORT = { art: '美術展', live: 'ライブ', food: 'フード', market: 'マーケット', festival: '祭り', popup: 'ポップアップ' };
  const GKEYS = Object.keys(GENRE_PAGES);
  const GNAV = GKEYS.map(g => [`/${GENRE_PAGES[g][0]}/`, SHORT[g]]).concat([['/today/', '今日'], ['/free/', '無料'], ['/weekend/', '今週末']], EV.some(e => e.kid && e.e >= TODAY) ? [['/kids/', '子どもと']] : [], EV.some(e => e.ig && e.e >= TODAY) ? [['/instagram/', 'インスタ']] : []);
  // 子どもと：年齢の重なりで集める。2件以上のときだけページにする（/kids/ は1件から）。
  const KIDP0 = [['/kids/', '東京の子どもと行けるイベント', 0, 99, '子どもと'], ['/kids/baby/', '東京の赤ちゃん（0〜2歳）と行けるイベント', 0, 2, '0〜2歳と'], ['/kids/preschool/', '東京の未就学児（3〜6歳）と行けるイベント', 3, 6, '3〜6歳と'], ['/kids/elementary/', '東京の小学生と行けるイベント', 6, 12, '小学生と']];
  const KIDP = KIDP0.filter(([p, , lo, hi]) => EV.filter(e => e.kid && e.e >= TODAY && e.kid[0] <= hi && e.kid[1] >= lo).length >= (p === '/kids/' ? 1 : 2));
  const PLACES = [['yoyogi-park', '代々木公園', /代々木公園/], ['hibiya-park', '日比谷公園', /日比谷公園/], ['ueno-park', '上野公園', /上野恩賜公園|上野公園/], ['kasai-rinkai-park', '葛西臨海公園', /葛西臨海/], ['unu', '国連大学前（青山）', /国際連合大学|国連大学/], ['roppongi-hills', '六本木ヒルズ', /六本木ヒルズ/], ['tokyo-midtown', '東京ミッドタウン', /東京ミッドタウン(?!日比谷)/], ['shibuya-parco', '渋谷PARCO', /渋谷PARCO/], ['bonus-track', '下北沢 BONUS TRACK・線路街', /BONUS TRACK|下北線路街/], ['tokyo-dome-city', '東京ドームシティ', /東京ドーム/], ['skytree-town', '東京スカイツリータウン', /スカイツリータウン|ソラマチ/], ['azabudai-hills', '麻布台ヒルズ', /麻布台ヒルズ/], ['omotesando-hills', '表参道ヒルズ', /表参道ヒルズ/], ['nippori-ekimae', '日暮里駅前', /日暮里駅前/], ['futakotamagawa-rise', '二子玉川ライズ', /二子玉川ライズ/], ['sunshine-city', '池袋サンシャインシティ', /サンシャインシティ/], ['shibuya-hikarie', '渋谷ヒカリエ', /ヒカリエ/], ['tokyo-intl-forum', '東京国際フォーラム', /東京国際フォーラム/], ['ebisu-garden-place', '恵比寿ガーデンプレイス', /恵比寿ガーデンプレイス/], ['star-pines-cafe', '吉祥寺スターパインズカフェ', /スターパインズカフェ/], ['sunpearl-arakawa', 'サンパール荒川', /サンパール荒川/], ['tower-hall-funabori', 'タワーホール船堀', /タワーホール船堀/]];
  const PLACES_LIVE = PLACES.filter(([, , re]) => EV.filter(e => e.e >= TODAY && re.test(e.v)).length >= 2);
  const KIND = { art: '展示', live: '公演', food: '催し', market: '市', festival: '祭り', popup: '催し' };
  const LDTYPE = { art: 'ExhibitionEvent', live: 'MusicEvent', food: 'FoodEvent', market: 'Event', festival: 'Festival', popup: 'Event' };

  const DOWS = '日月火水木金土';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  const dnum = iso => { const p = iso.split('-').map(Number); return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 864e5); };
  const isoOf = n => new Date(n * 864e5).toISOString().slice(0, 10);
  const dow = iso => new Date(dnum(iso) * 864e5).getUTCDay();
  const md = iso => { const p = iso.split('-').map(Number); return `${p[1]}/${p[2]}(${DOWS[dow(iso)]}${iso in HOLIDAYS ? '・祝' : ''})`; };
  const ymd = iso => { const p = iso.split('-').map(Number); return `${p[0]}年${p[1]}月${p[2]}日`; };
  const mins = hm => { const p = hm.split(':').map(Number); return p[0] * 60 + p[1]; };
  const km = (a, b, c, e) => { const R = 6371, r = Math.PI / 180, x = (c - a) * r, y = (e - b) * r, h = Math.sin(x / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const pyround = x => { const f = Math.floor(x), d = x - f; return d > 0.5 ? f + 1 : d < 0.5 ? f : (f % 2 === 0 ? f : f + 1); };
  // アフィリエイト。D.AFF の ID が空なら何も出さない。
  const AFF = D.AFF || {};
  // 近くでごはん：食べログ（条件つき）・ホットペッパー・Google マップの検索。バリューコマースの ID（AFF.vc = {sid, tabelog, hotpepper}）が入ったら広告リンクにする。
  const vcWrap = (u, k) => (AFF.vc && AFF.vc.sid && AFF.vc[k]) ? [`https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=${AFF.vc.sid}&pid=${AFF.vc[k]}&vc_url=${encodeURIComponent(u)}`, 1] : [u, 0];
  const eatLinks = ev => {
    const sk = encodeURIComponent(ev.st + '駅'), tb = c => vcWrap(`https://tabelog.com/rst/rstsearch?sk=${sk}&SrtT=trend${c}`, 'tabelog');
    const L = [['食べログで探す', ...tb('')], ['ペット可のお店', ...tb('&ChkPet=1')], ['子連れOKのお店', ...tb('&ChkKids=1')], ['車椅子OKのお店', ...tb('&ChkWheelchair=1')],
      ['ホットペッパー（クーポン・予約）', ...vcWrap(`https://www.hotpepper.jp/CSP/psh010/doBasic?SA=SA11&FWT=${sk}`, 'hotpepper')],
      ['地図でカフェ', `https://www.google.com/maps/search/${encodeURIComponent('カフェ')}/@${ev.lat},${ev.lng},17z`, 0]];
    return L;
  };
  const affOn = !!(AFF.rakuten || AFF.klook);
  // 楽天トラベルのキーワード検索は Shift_JIS で受け取るので、駅名を Shift_JIS でエンコードする。
  let SJ = null;
  const sjis = str => { if (!SJ) { SJ = new Map(); const dec = new TextDecoder('shift_jis'); for (let a = 0x81; a <= 0xfc; a++) { if (a > 0x9f && a < 0xe0) continue; for (let b = 0x40; b <= 0xfc; b++) { if (b === 0x7f) continue; const c = dec.decode(new Uint8Array([a, b])); if (c.length === 1 && c !== '\ufffd' && !SJ.has(c)) SJ.set(c, [a, b]); } } } return [...str].map(ch => ch.charCodeAt(0) < 0x80 ? encodeURIComponent(ch) : (SJ.get(ch) || []).map(x => '%' + x.toString(16).toUpperCase()).join('')).join(''); };
  const rakutenHotel = ev => AFF.rakuten ? `https://hb.afl.rakuten.co.jp/hgc/${AFF.rakuten}/?pc=${encodeURIComponent('https://kw.travel.rakuten.co.jp/keyword/Search.do?f_query=' + sjis(ev.st + '駅'))}&link_type=text` : '';
  const affBox = ev => { const u = rakutenHotel(ev); return u ? `<h2>この近くで泊まる</h2>
      <div class="row"><a class="go aff" href="${esc(u)}" target="_blank" rel="sponsored noopener">${esc(ev.st)}駅の近くのホテルを楽天トラベルで見る</a></div>
      <p class="cap">PR・楽天アフィリエイトのリンクです。</p>` : ''; };
  const travel = dist => dist <= 1.5 ? `徒歩で約${Math.max(1, pyround(dist * 16))}分` : `電車などで約${pyround((10 + dist * 2.5) / 5) * 5}分`;
  const far = dist => dist < 0.1 ? 'すぐ' : `約${dist.toFixed(1)}km、${travel(dist)}`;
  const activeOn = (ev, iso) => ev.s <= iso && iso <= ev.e && !ev.off.includes(iso);
  const ended = ev => ev.e < TODAY;
  const oneDay = ev => ev.s === ev.e;
  const areaOf = ev => { for (const [slug, name, sts] of AREAS) if (sts.includes(ev.st)) return [slug, name]; return [null, null]; };
  const span = ev => oneDay(ev) ? md(ev.s) : `${md(ev.s)}〜${md(ev.e)}`;
  // 催しごとのシェア用画像（og/<id>.jpg）。tools/og.js が作る。作れたもの（D.OGDONE の hash が合うもの）だけ og:image に使う。
  const OGCOL = { art: '#00a7db', live: '#e60012', food: '#f39700', market: '#009944', festival: '#c1a470', popup: '#9b7cb6' };
  const ogData = ev => ({ t: ev.t, d: span(ev) + (ev.g === 'live' ? ` ${ev.o}開演` : ` ${ev.o}〜${ev.c}`), v: ev.v, st: ev.st, p: ev.free ? '無料' : String(ev.price).slice(0, 40), c: OGCOL[ev.g] || '#000', k: ev.kid ? '子どもと' : '', dog: !!ev.dog });
  const ogHash = ev => { let h = 5381; const t = JSON.stringify(ogData(ev)) + '|1'; for (let i = 0; i < t.length; i++) h = ((h * 33) ^ t.charCodeAt(i)) >>> 0; return h.toString(36); };
  const OGDONE = D.OGDONE || {};
  const FEATURES = [
    { slug: 'thats-fashion-weekend-2026', main: 'thats-fashion-weekend-2026-market', also: ['tokyo-tower-voice-of-earth-ten-2026'], until: '2026-10-18',
      h1: "THAT'S FASHION WEEKEND 2026｜東京タワーで人気ブランドが70〜90%オフ、入場無料",
      title: `THAT'S FASHION WEEKEND 2026｜東京タワーのチャリティファッションマーケット（10/16〜18・入場無料）｜${NAME}`,
      desc: `10月16日〜18日、東京タワーで人気ブランドの服 約7,000着が70〜90%オフになるチャリティマーケット「THAT'S FASHION WEEKEND 2026」（入場無料）。日程、時間、会場、行き方、あわせて行ける近くの催しをまとめました。`,
      crumb: "THAT'S FASHION WEEKEND 2026",
      lead: '人気ブランドの服 約7,000着が70〜90%オフになるチャリティマーケットが、10月16日（金）〜18日（日）に東京タワーで開かれます。入場は無料です。',
      img: ['/feature/tfw/logo.jpg', 800, 572, "THAT'S FASHION WEEKEND supported by SENSE TRUST"], credit: "THAT'S FASHION WEEKEND",
      facts: [['日程', '10月16日（金）・17日（土）11:00〜21:00、18日（日）10:00〜15:30'], ['会場', '東京タワー タワーホールA（東京都港区芝公園4-2-8）'], ['最寄り駅', '芝公園・赤羽橋・神谷町'], ['入場', '無料（主催者に確認済み）']],
      points: [['70〜90%オフ', '人気ブランドの倉庫に眠っていた商品、デッドストック、ビンテージ、B品、サンプル品など約7,000着。'], ['買うと寄付になる', '1着買うごとに、新品の服1着が熊本の被災地に寄付される。'], ['チャリティフリマも', '著名人や文化人が私物を出品するチャリティフリーマーケットを同時開催。売上は熊本支援に。']],
      faq: [['入場料はかかる？', '入場は無料です（主催者に確認済み）。'], ['何時まで開いている？', '16日・17日は21:00まで、最終日の18日は15:30までです。'], ['最寄り駅は？', '都営三田線の芝公園駅、大江戸線の赤羽橋駅、日比谷線の神谷町駅が近くです。'], ['同じ時期に東京タワーで見られるものは？', 'TOWER GALLERY の VOICE OF EARTH展、MAIN DECK 1F Club333 の Jeff Hamilton展（9:00〜23:00）がいずれも10/18まで開かれています。']],
      official: 'https://thatsfashionweekend.com/', area: ['shirokane', '白金・麻布・東京タワー'], station: ['shibakoen', '芝公園'] },
  ];
  const calUrl = ev => { const d = x => x.replace(/-/g, ''); const nx = iso => isoOf(dnum(iso) + 1).replace(/-/g, ''); const dates = oneDay(ev) && /^\d\d:\d\d$/.test(ev.o) && /^\d\d:\d\d$/.test(ev.c) && ev.c > ev.o ? `${d(ev.s)}T${ev.o.replace(':', '')}00/${d(ev.s)}T${ev.c.replace(':', '')}00` : `${d(ev.s)}/${nx(ev.e)}`; return `https://calendar.google.com/calendar/render?action=TEMPLATE&amp;text=${quote(ev.t)}&amp;dates=${dates}&amp;ctz=Asia/Tokyo&amp;location=${quote(ev.v + '（' + ev.st + '駅）')}&amp;details=${quote(url('/event/' + ev.id + '/'))}`; };
  const ogUrl = ev => OGDONE[ev.id] === ogHash(ev) ? `${BASE}/og/${ev.id}.jpg?v=${OGDONE[ev.id]}` : null;
  const when = ev => ev.g === 'live' ? `${span(ev)} ${ev.o} 開演` : `${span(ev)} ${ev.o}〜${ev.c}`;
  const lateText = ev => {
    if (!ev.late || !Object.keys(ev.late).length) return '';
    const by = new Map();
    for (const [k, v] of Object.entries(ev.late)) { if (!by.has(v)) by.set(v, []); by.get(v).push(DOWS[Number(k)] + '曜'); }
    return [...by].map(([t, ds]) => `${ds.join('と')}は${t}まで`).join('、');
  };
  const openOn = (ev, iso) => ((ev.hx || {})[iso] || [ev.o])[0];
  const closeOn = (ev, iso) => { const h = (ev.hx || {})[iso]; return h ? h[1] : ((ev.late || {})[String(dow(iso))] || ev.c); };
  const hxText = ev => {
    const out = [];
    for (const iso of Object.keys(ev.hx || {}).sort()) {
      const [o, c] = ev.hx[iso];
      if (o !== ev.o && c !== ev.c) out.push(`${md(iso)}は${o}〜${c}`);
      else if (c !== ev.c) out.push(`${md(iso)}は${c}まで`);
      else if (o !== ev.o) out.push(`${md(iso)}は${o}から`);
    }
    return out.join('、');
  };
  const url = path => BASE + path;
  // 構造化データは、項目のあいだに空白を入れる書き方にそろえる。
  const pyjson = v => {
    if (v === null || v === undefined) return 'null';
    if (Array.isArray(v)) return '[' + v.map(pyjson).join(', ') + ']';
    if (typeof v === 'object') return '{' + Object.entries(v).map(([k, x]) => JSON.stringify(k) + ': ' + pyjson(x)).join(', ') + '}';
    return JSON.stringify(v);
  };
  const quote = s => encodeURIComponent(s).replace(/[!*'()]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase()).replace(/%2F/g, '/');
  const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;

  const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23000'/%3E%3Ctext x='27' y='46' font-size='40' font-weight='900' text-anchor='middle' fill='%23fff' font-family='sans-serif'%3E%E3%82%AD%3C/text%3E%3Ccircle cx='52' cy='42' r='5.5' fill='%23ff4a1c'/%3E%3C/svg%3E";

  // ほかの言語の同じページ。D.LANGS があるときだけ使う。エリアのページと404にはない。
  const LANGS = D.LANGS || [];
  const HREFLANG = { en: 'en', zh: 'zh-Hans', es: 'es', th: 'th', id: 'id' }, LANGNAME = { en: 'English', zh: '中文', es: 'Español', th: 'ไทย', id: 'Indonesia' };
  const altPath = (l, path) => (path.startsWith('/area/') || path.startsWith('/station/') || path === '/plan/' || path === '/stats/' || path.startsWith('/pick/') || path.startsWith('/kids/') || path.startsWith('/place/') || path === '/404.html' || path === '/drama/' || path === '/christmas/' || path === '/illumination/' || path === '/halloween/' || path === '/newyear/' || path === '/koyo/' || path === '/torinoichi/' || path === '/rainy/' || path === '/barrierfree/' || path === '/dog/' || path === '/stroller/' || path === '/ekichika/' || path === '/night/' || path === '/noreserve/' || path === '/kids/workshop/' || path === '/kids/rainy/' || path === '/suiteru/' || path === '/bento/' || path === '/cashless/' || path === '/kids/bento/' || path === '/kids/free/' || path === '/kids/weekend/' || ['/monday/','/lastchance/','/new/','/cheap/','/morning/','/photo-ok/','/anime/','/cat/','/sake/','/flea/','/workshop/','/parking/'].includes(path) || path.startsWith('/date/') || path === '/today/' || /^\/weekend\/\d/.test(path)) ? null : `/${l}` + (path === '/about.html' ? '/about/' : path);
  const head = (title, desc, path, ld = [], noindex = false, og = null) => {
    const alts = (noindex || !LANGS.length || !altPath('en', path)) ? '' : `<link rel="alternate" hreflang="ja" href="${url(path)}">\n` + LANGS.map(l => `<link rel="alternate" hreflang="${HREFLANG[l]}" href="${url(altPath(l, path))}">\n`).join('') + `<link rel="alternate" hreflang="x-default" href="${url(path)}">\n`;
    const lds = ld.map(x => `<script type="application/ld+json">${pyjson(x)}</script>\n`).join('');
    const robots = noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="max-image-preview:large">';
    const canon = noindex ? '' : `<link rel="canonical" href="${url(path)}">\n<meta property="og:url" content="${url(path)}">\n`;
    return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}
${canon}${alts}<meta property="og:type" content="website">
<meta property="og:locale" content="ja_JP">
<meta property="og:site_name" content="${NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og || BASE + '/og.png?v=' + VER}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${og || BASE + '/og.png?v=' + VER}">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.ico?v=${VER}" sizes="48x48">
<link rel="icon" href="${ICON}" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png?v=${VER}">
<link rel="manifest" href="/manifest.json?v=${VER}">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="${NAME}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap">
<link rel="stylesheet" href="/style.css?v=${VER}">
${lds}<script async src="https://www.googletagmanager.com/gtag/js?id=G-0T0FYH7TTZ"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","G-0T0FYH7TTZ");</script>
</head>
<body>
<div class="wrap">
`;
  };

  const sign = (cur = null, path = '/') => {
    const nav = GNAV.map(([p, n]) => `<a href="${p}"${p === cur ? ' aria-current="page"' : ''}>${n}</a>`).join('');
    const lang = LANGS.length ? `\n    <nav class="lang" aria-label="言語"><a href="${path}" lang="ja" aria-current="true">日本語</a>` + LANGS.map(l => `<a href="${altPath(l, path) || `/${l}/`}" lang="${HREFLANG[l]}" hreflang="${HREFLANG[l]}">${LANGNAME[l]}</a>`).join('') + '</nav>' : '';
    return `  <header class="top">
    <a class="brand" href="/"><b>${NAME}<i></i></b><span>KYOCHIKA TOKYO</span></a>${lang}
    <nav class="gnav" aria-label="ジャンル">${nav}</nav>
  </header>
`;
  };

  // 見える案内と構造化データの両方を返す。items: [[名前, 場所 か null]]
  const crumbs = items => {
    const vis = items.map(([n, p]) => p ? `<li><a href="${p}">${esc(n)}</a></li>` : `<li aria-current="page">${esc(n)}</li>`).join('');
    const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => Object.assign({ '@type': 'ListItem', position: i + 1, name: n }, p ? { item: url(p) } : {})) };
    return [`  <nav aria-label="現在地"><ol class="crumbs">${vis}</ol></nav>\n`, ld];
  };

  const CURRENT = EV.filter(e => !ended(e));
  const order = evs => [...evs].sort((a, b) => cmp(a.e, b.e) || cmp(a.s, b.s) || cmp(a.o, b.o));
  const LIVE_AREAS = AREAS.filter(([, , sts]) => CURRENT.filter(e => sts.includes(e.st)).length >= 2);
  const DOG_ST = ['渋谷', '代官山', '二子玉川', '吉祥寺', '中目黒', '表参道', '自由が丘', '恵比寿', '下北沢', '豊洲', '清澄白河', '代々木公園'];
  const DOG_EXTRA = `  <section class="dogeat"><h2>愛犬と入れるお店をエリアで探す</h2><p class="cap">食べログの「ペット可」のお店を、駅のまわりで探せます（食べログのページがひらきます）。</p><div class="row eat">${DOG_ST.map(st => `<a class="go" href="https://tabelog.com/rst/rstsearch?sk=${encodeURIComponent(st + '駅')}&amp;SrtT=trend&amp;ChkPet=1" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','eat_click',{eat_type:'dogpage_${st}'})">${st}</a>`).join('')}</div></section>\n`;
  const COND_FAQ = {
    '/kids/workshop/': evs => [['子どもと行けるワークショップは東京のどこで探せますか？', `このページに、子どもが参加できる東京のワークショップ・工作・ものづくり体験を${evs.length}件、対象年齢つきでまとめています。毎日更新しています。`], ['予約は必要ですか？', '多くのワークショップは事前予約や先着順です。各催しのページの料金・説明と公式ページで、申し込み方法を確かめてください。'], ['何歳から参加できますか？', '催しごとに対象年齢が決まっています。一覧の「子ども」の印に、公式ページに書かれた対象年齢をのせています。']],
    '/stroller/': evs => [['ベビーカーで行ける東京のイベントは？', `公式ページでベビーカーでの来場について案内がある催しを${evs.length}件まとめています。子ども向けの催しは「子どもと行けるイベント」のページで対象年齢つきで探せます。`], ['ベビーカーで行くときの注意は？', '混雑する時間帯はベビーカーをたたむようお願いされることがあります。エレベーターやベビーカー置き場の場所は、各催しの公式ページで確かめてください。']],
    '/ekichika/': evs => [['駅から近い東京のイベントは？', `最寄り駅から直線で約400m以内（歩いて5分ほど）の会場の催しを${evs.length}件まとめています。`], ['自分の駅から近い順に探すには？', 'トップページで出発する駅を選ぶと、すべての催しを近い順にならべ替えられます。']],
    '/night/': evs => [['仕事帰りに行ける東京のイベントは？', `夜21時まで（またはそれより遅くまで）開いている催しを${evs.length}件まとめています。美術館の夜間開館は金曜・土曜が多いです。`], ['夜間開館の曜日はどこでわかりますか？', '各催しのページの「時間」に、曜日ごとの開館時間をのせています。']],
    '/noreserve/': evs => [['予約なしで行ける東京のイベントは？', `公式ページで予約不要と書かれている催しを${evs.length}件まとめています。思い立った日にそのまま行けます。`], ['当日行っても入れないことはありますか？', '混雑時は入場を制限したり、待ち時間が出たりすることがあります。人気の催しは早めの時間がおすすめです。']],
    '/dog/': evs => [['東京で犬連れOKのイベントはどこで探せますか？', `このページに、公式ページでペット同伴可と書かれている東京の催しを${evs.length}件まとめています。屋外のマルシェや公園の催し、ドッグフェスが多く、毎日更新しています。`], ['犬連れで行くときに気をつけることは？', '多くの催しでリードの着用が必要で、飲食エリアや屋内への同伴はできないことがあります。行く前に、各催しの公式ページで同伴の決まりを確かめてください。'], ['今週末に愛犬と行けるイベントは？', `終わりが近い順にならべているので、上から見ると今週末に行ける催しが見つかります。日付と出発する駅で探すときは、トップページから選べます。`]],
    '/barrierfree/': evs => [['車椅子で行ける東京のイベントはありますか？', `会場や主催者の公式ページで、車椅子での来場やバリアフリー設備の案内がある催しを${evs.length}件まとめています。`], ['設備の細かい情報はどこで確かめられますか？', '段差・エレベーター・多目的トイレ・貸し出し用の車椅子などは、各催しの公式ページや会場のバリアフリー案内で確かめてください。混雑する日時は会場に問い合わせると安心です。']],
    '/suiteru/': evs => [['東京で空いているイベントはどう探せばいいですか？', `このページに、混雑を避けやすい条件（夜間開館、会期の始まったばかり、公式の混雑状況あり）に当てはまる催しを${evs.length}件まとめています。毎日更新しています。`], ['美術展が空いている時間帯は？', '一般に、平日の開館直後と夜間開館の時間は空きやすく、会期の終わり近くと土日の昼は混みやすいと言われます。公式に混雑状況を出している美術館もあるので、各催しのページのリンクから確かめてください。']],
    '/bento/': evs => [['東京でお弁当を持って行ける屋内の施設は？', `このページに、館内に持ち込みのお弁当を食べられる場所がある催しを${evs.length}件まとめています。科学館・博物館・ホールなど、公式ページで休憩室やランチスペースの案内を確かめたものです。`], ['展示室の中で食べてもいいですか？', 'いいえ。食べられるのは決められた休憩室・ランチスペースだけです。場所や使える時間、団体の予約で埋まる日があるかは、公式ページで確かめてください。']],
    '/cashless/': evs => [['イベントでクレジットカードは使えますか？', `催しによってちがいます。このページに、公式ページでカード・交通系IC・PayPayなどが使えると書かれている催しを${evs.length}件まとめています。各催しのページの「支払い」の欄で、使えるものを確かめられます。`], ['マーケットやお祭りは現金だけですか？', '屋台や出店は現金だけのことがまだ多いです。「現金のみ」と公式に書かれている催しは、催しのページの「支払い」の欄に出しています。']],
    '/rainy/': evs => [['雨の日に東京で行けるイベントは？', `美術館・ギャラリーの展示や屋内の催しを${evs.length}件まとめています。駅から近い会場も多く、雨の日の外出に向いています。`], ['子どもと雨の日に行ける場所は？', '子ども向けの催しは「子どもと行けるイベント」のページで、対象年齢つきで探せます。']],
  };
  const stSlug = st => (SPOTS[st] && SPOTS[st][2] ? String(SPOTS[st][2]).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : '');
  const stPage = st => { const sl = stSlug(st), n = CURRENT.filter(e => e.st === st).length, ar = AREAS.find(([, , ss]) => ss.includes(st)); return sl && n >= 5 && !(ar && n >= CURRENT.filter(e => ar[2].includes(e.st)).length * 0.9) ? `/station/${sl}/` : null; };
  const staDist = e => { const p = SPOTS[e.st]; return p ? km(p[0], p[1], e.lat, e.lng) : 9; };
  const lateNight = e => e.g !== 'live' && ((e.c >= '21:00' && e.c > e.o) || Object.values(e.late || {}).some(t => t >= '21:00') || Object.values(e.hx || {}).some(h => h[1] >= '21:00'));
  const monOpen = e => { const t0 = dnum(TODAY); for (let i = 0; i < 14; i++) { const d = isoOf(t0 + i); if (dow(d) === 1 && e.s <= d && d <= e.e && !e.off.includes(d)) return true; } return false; };
  const quietPick = e => e.g !== 'live' && (!!e.crowd || !!e.quiet || (e.g === 'art' && lateNight(e)) || (e.g === 'art' && dnum(e.e) - dnum(e.s) >= 28 && dnum(TODAY) >= dnum(e.s) && dnum(TODAY) - dnum(e.s) <= 10));
  const PAYN = { cash: '現金', card: 'クレジットカード', ic: '交通系IC（Suicaなど）', paypay: 'PayPay', qr: 'QRコード決済', emoney: '電子マネー' };
  const payTxt = e => (e.pay.length === 1 && e.pay[0] === 'cash' ? '現金のみ' : e.pay.map(x => PAYN[x] || x).join('・')) + (e.paynote ? `（${e.paynote}）` : '（公式ページより）');
  const priceMax = p => { p = String(p); const a = p.match(/(?:一般|大人)[^\d]{0,6}([\d,]+)\s*円/); if (a) return Number(a[1].replace(/,/g, '')); const all = [...p.matchAll(/([\d,]+)\s*円/g)]; return all.length === 1 ? Number(all[0][1].replace(/,/g, '')) : 99999; };
  const WKD = (() => { const t0 = dnum(TODAY), sat = t0 + ((6 - dow(TODAY)) % 7 + 7) % 7; return [isoOf(sat), isoOf(sat + 1)]; })();
  const PICK_PATH = `/pick/${WKD[0]}/`;
  const pickEvs = (() => {
    const open = CURRENT.filter(e => WKD.some(d => e.s <= d && d <= e.e && !(e.off || []).includes(d)));
    const GW = { festival: 2, food: 2, market: 1.5, art: 1.5, popup: 1, live: 0.5 };
    const short = e => oneDay(e) || dnum(e.e) - dnum(e.s) <= 3;
    const sc = e => (GW[e.g] || 0) + (e.free ? 1 : 0) + (!short(e) && dnum(e.e) - dnum(WKD[1]) <= 7 ? 1.5 : 0) + (short(e) ? 1 : 0) + (e.ig ? 1 : 0) + (e.kid ? 0.5 : 0) + (e.dog ? 0.5 : 0) + (e.ph ? 0.5 : 0) - (/おはなし会|児童館|学び交流館|ひろば館|観察会|教室/.test(e.t) ? 2.5 : 0);
    const out = [], gN = {}, aN = {}; let kN = 0;
    for (const e of open.slice().sort((a, b) => sc(b) - sc(a) || cmp(a.e, b.e) || cmp(a.id, b.id))) {
      const a = areaOf(e)[0] || e.st;
      if ((gN[e.g] || 0) >= 3 || (aN[a] || 0) >= 2 || (e.kid && kN >= 3)) continue;
      gN[e.g] = (gN[e.g] || 0) + 1; aN[a] = (aN[a] || 0) + 1; if (e.kid) kN++; out.push(e);
      if (out.length >= 10) break;
    }
    return out;
  })();
  const COND_PAGES = [
    ['/rainy/', '雨の日でも行ける東京のイベント', `雨の日でも行ける東京のイベント｜屋内の美術展・催し（今日・今週末）｜${NAME}`, n => `雨の日でも楽しめる東京の屋内イベントを${n}件まとめました。美術館・ギャラリーの展示や屋内の催しの会期、時間、料金、最寄り駅がひと目でわかります。`, e => (e.g === 'art' || e.indoor) && !e.outdoor, '雨の日でも行ける', n => `屋内で楽しめる催しを${n}件のせています（美術展と、公式ページで屋内と確かめた催し）。終わりが近い順です。`],
    ['/barrierfree/', '車椅子で行ける東京のイベント', `車椅子で行ける東京のイベント｜バリアフリーの会場の催し（今日・今週末）｜${NAME}`, n => `車椅子で行ける東京のイベントを${n}件まとめました。会場の公式ページでバリアフリー（段差なし・エレベーター・車椅子対応のトイレなど）を確かめた催しです。`, e => e.bf, '車椅子で行ける', n => `会場や主催者の公式ページで、車椅子での来場について書かれている催しを${n}件のせています。設備の細かい点は、行く前に公式ページや会場に確かめてください。`],
    ['/dog/', '愛犬と行ける東京のイベント', `愛犬と行ける東京のイベント｜犬連れOK・ペット同伴可・ドッグイベント（今日・今週末）｜${NAME}`, n => `愛犬と一緒に行ける東京のイベントを${n}件まとめました。犬連れOKのマルシェや公園の催し、ドッグフェスなど、公式ページで「ペット同伴可」と確かめた催しの会期、時間、場所、最寄り駅がひと目でわかります。`, e => e.dog, '愛犬と行ける', n => `公式ページで犬（ペット）の同伴ができると書かれている催しを${n}件のせています。リードの決まりなどは公式ページで確かめてください。`],
    ['/stroller/', 'ベビーカーで行ける東京のイベント', `ベビーカーで行ける東京のイベント｜子連れにやさしい会場の催し（今日・今週末）｜${NAME}`, n => `ベビーカーで行ける東京のイベントを${n}件まとめました。公式ページでベビーカーでの来場やベビーカー置き場の案内がある催しです。`, e => e.stroller, 'ベビーカーで行ける', n => `公式ページで、ベビーカーで入れる・ベビーカー置き場がある、と書かれている催しを${n}件のせています。混む時間帯は公式ページで確かめてください。`],
    ['/ekichika/', '駅から徒歩5分以内で行ける東京のイベント', `駅から徒歩5分以内の東京のイベント｜駅近で行ける催し（今日・今週末）｜${NAME}`, n => `最寄り駅から歩いて5分以内（直線で約400m以内）の会場で開かれる東京のイベントを${n}件まとめました。雨の日や子連れ、時間がないときに。`, e => staDist(e) <= 0.4, '駅から徒歩5分以内', n => `最寄り駅から直線で約400m以内（歩いて5分ほど）の会場の催しを${n}件のせています。実際の道のりは少し長くなることがあります。`],
    ['/night/', '夜9時まで開いている東京のイベント', `夜9時まで開いている東京のイベント｜仕事帰りに寄れる催し（今日・今週末）｜${NAME}`, n => `夜21時まで（またはそれより遅くまで）開いている東京のイベントを${n}件まとめました。仕事帰りに寄れる美術展の夜間開館や、夜まで続く催しの日時がひと目でわかります。`, lateNight, '夜9時まで開いている', n => `夜21時まで（またはそれより遅くまで）開いている催しを${n}件のせています。夜間開館は曜日が決まっていることが多いので、各催しのページで曜日と時間を確かめてください。`],
    ['/noreserve/', '予約なしで行ける東京のイベント', `予約なしで行ける東京のイベント｜当日ふらっと行ける催し（今日・今週末）｜${NAME}`, n => `予約や事前申し込みなしで、当日ふらっと行ける東京のイベントを${n}件まとめました。公式ページで「予約不要」と確かめた催しです。`, e => e.noresv, '予約なしで行ける', n => `公式ページで「予約不要」「当日自由に入場」などと書かれている催しを${n}件のせています。混雑時は入場を制限することがあります。`],
    ['/monday/', '月曜日も開いている東京の美術展', `月曜日も開いている東京の美術展・展覧会｜月曜休館じゃない美術館・ギャラリー｜${NAME}`, n => `美術館の多くが休む月曜日にも開いている東京の展覧会を${n}件まとめました。会期、時間、料金、最寄り駅がひと目でわかります。`, e => e.g === 'art' && monOpen(e), '月曜も開いている', n => `これから2週間のうちに、月曜日も開いている美術展を${n}件のせています。祝日の翌日などで休む日があるので、各催しのページで確かめてください。`],
    ['/lastchance/', 'まもなく終わる東京の展覧会', `まもなく終わる東京の展覧会｜会期終了間近（1週間以内）の美術展｜${NAME}`, n => `会期があと1週間以内に終わる東京の美術展・展覧会を${n}件まとめました。見逃したくない展示を終わりが近い順にならべています。`, e => e.g === 'art' && dnum(e.e) - dnum(TODAY) <= 7, 'まもなく終わる展覧会', n => `今日から1週間以内に会期が終わる展覧会を${n}件、終わりが近い順にのせています。`],
    ['/new/', '今週から始まる東京のイベント', `今週から始まる東京のイベント｜新しく始まった展覧会・催し｜${NAME}`, n => `この1週間で始まった、またはこれから1週間のうちに始まる東京のイベントを${n}件まとめました。`, e => Math.abs(dnum(e.s) - dnum(TODAY)) <= 7 && e.s !== e.e, '今週から始まる', n => `始まったばかりの催しと、これから1週間のうちに始まる催しを${n}件のせています。`],
    ['/cheap/', '1,000円以下で行ける東京のイベント', `1,000円以下で行ける東京のイベント｜安く楽しめる展覧会・催し｜${NAME}`, n => `入場料が1,000円以下（無料をふくむ）の東京のイベントを${n}件まとめました。`, e => e.free || priceMax(e.price) <= 1000, '1,000円以下', n => `入場料が1,000円以下の催しを${n}件のせています（無料をふくむ。大人1人の料金で判断）。`],
    ['/morning/', '朝から行ける東京のイベント', `朝から行ける東京のイベント｜朝9時台から開いている催し｜${NAME}`, n => `朝9時台までに始まる東京のイベントを${n}件まとめました。朝の時間を使ってお出かけしたいときに。`, e => e.g !== 'live' && e.o <= '09:30', '朝から行ける', n => `朝9時半までに開く催しを${n}件のせています。`],
    ['/photo-ok/', '写真撮影OKの東京の展覧会', `写真撮影OKの東京の展覧会・美術展｜撮影できる展示（今日・今週末）｜${NAME}`, n => `公式ページで写真撮影ができると書かれている東京の展覧会を${n}件まとめました。`, e => e.photo, '写真撮影OK', n => `公式ページで撮影可と書かれている展示を${n}件のせています。一部の作品は撮影できないことがあります。`],
    ['/anime/', 'アニメ・推し活の東京のイベント', `アニメ・推し活の東京のイベント｜ポップアップストア・コラボカフェ・原画展｜${NAME}`, n => `東京で開かれるアニメ・漫画・キャラクターのポップアップストア、コラボカフェ、原画展などを${n}件まとめました。`, e => (e.k || []).includes('anime'), 'アニメ・推し活', n => `アニメ・漫画・キャラクターの催しを${n}件のせています。整理券や予約が必要なものが多いので公式ページで確かめてください。`],
    ['/cat/', '猫のイベント（東京）', `東京の猫のイベント｜保護猫の譲渡会・猫の写真展・猫グッズの催し｜${NAME}`, n => `東京で開かれる猫のイベントを${n}件まとめました。保護猫の譲渡会、猫の写真展、猫グッズのマーケットなど。`, e => (e.k || []).includes('cat'), '猫のイベント', n => `猫が主役の催しを${n}件のせています。`],
    ['/sake/', '日本酒・クラフトビールのイベント（東京）', `東京の日本酒・クラフトビールのイベント｜酒蔵・ビアフェス・試飲会｜${NAME}`, n => `東京で開かれる日本酒・クラフトビール・ワインのイベントを${n}件まとめました。`, e => (e.k || []).some(k => k === 'sake' || k === 'beer' || k === 'wine'), '日本酒・ビール', n => `お酒が主役の催しを${n}件のせています。20歳未満の飲酒は法律で禁止されています。`],
    ['/flea/', '東京の蚤の市・骨董市・古着市', `東京の蚤の市・骨董市・古着市｜今週末の開催日と場所｜${NAME}`, n => `東京で開かれる蚤の市・骨董市・古着市・アンティークマーケットを${n}件まとめました。`, e => (e.k || []).some(k => k === 'flea' || k === 'furugi') || /蚤の市|骨董|古着|アンティーク|フリーマーケット|フリマ/.test(e.t), '蚤の市・古着市', n => `蚤の市・骨董市・古着市を${n}件のせています。`],
    ['/workshop/', '東京のワークショップ・体験イベント', `東京のワークショップ・体験イベント｜大人も子どもも作って楽しむ催し｜${NAME}`, n => `東京で参加できるワークショップ・ものづくり体験のイベントを${n}件まとめました。`, e => ((e.k || []).includes('workshop') || /ワークショップ|体験会|工作/.test(e.t)), 'ワークショップ・体験', n => `参加して作ったり体験したりできる催しを${n}件のせています。`],
    ['/kids/workshop/', '子どもと行けるワークショップ（東京）', `子どもと行ける東京のワークショップ・体験｜親子で工作・ものづくり（対象年齢つき）｜${NAME}`, n => `子どもと参加できる東京のワークショップ・ものづくり体験を${n}件まとめました。対象年齢、日時、料金、申し込み方法、最寄り駅がひと目でわかります。`, e => e.kid && ((e.k || []).includes('workshop') || /ワークショップ|体験会|工作/.test(e.t)), '子どもとワークショップ', n => `子どもが参加できるワークショップ・工作・体験を${n}件、対象年齢つきでのせています。予約が必要なものが多いので、公式ページで申し込み方法を確かめてください。`],
    ['/kids/rainy/', '雨の日に子どもと行ける東京のイベント', `雨の日に子どもと行ける東京のイベント｜屋内で親子で楽しめる催し（対象年齢つき）｜${NAME}`, n => `雨の日でも子どもと楽しめる東京の屋内イベントを${n}件まとめました。対象年齢、日時、料金、最寄り駅がひと目でわかります。`, e => e.kid && (e.g === 'art' || e.indoor) && !e.outdoor, '雨の日に子どもと', n => `屋内で子どもと楽しめる催しを${n}件、対象年齢つきでのせています。`],
    ['/kids/free/', '無料で子どもと行ける東京のイベント', `無料で子どもと行ける東京のイベント｜入場無料の親子の催し（対象年齢つき）｜${NAME}`, n => `入場無料で子どもと行ける東京のイベントを${n}件まとめました。対象年齢、日時、場所、最寄り駅がひと目でわかります。`, e => e.kid && e.free, '無料で子どもと', n => `入場無料で子どもが楽しめる催しを${n}件、対象年齢つきでのせています。`],
    ['/kids/weekend/', '今週末に子どもと行ける東京のイベント', `今週末に子どもと行ける東京のイベント｜親子のお出かけ（対象年齢つき）｜${NAME}`, n => `今週末に子どもと行ける東京のイベントを${n}件まとめました。対象年齢、時間、料金、最寄り駅つき。`, e => e.kid && WKD.some(d => e.s <= d && d <= e.e && !e.off.includes(d)), '今週末に子どもと', n => `今週末に開いている子ども向け・親子向けの催しを${n}件、対象年齢つきでのせています。`],
    ['/suiteru/', '空いてる時間に行ける東京のイベント', `空いてる時間に行ける東京のイベント｜混雑を避けやすい美術展・穴場の催し（今日・今週末）｜${NAME}`, n => `混雑を避けて行きやすい東京のイベントを${n}件まとめました。平日夜の夜間開館、始まったばかりの展覧会、公式に混雑状況を出している催しなど、空いている時間をねらえる催しの日時がひと目でわかります。`, quietPick, '空いてる時間に行ける', n => `混雑を避けやすい催しを${n}件のせています。選び方は、①夜間開館のある美術展（夜は空きやすい）、②始まって10日以内の長い会期の展覧会（会期の終わりほど混みやすい）、③公式ページで混雑状況を出している催し、です。混み具合をこのサイトが保証するものではないので、当日の様子は公式ページで確かめてください。`],
    ['/bento/', '館内でお弁当を食べられる東京のイベント', `館内でお弁当を食べられる東京のイベント｜持ち込みOKの休憩室・ランチスペースがある施設の催し｜${NAME}`, n => `施設の中にお弁当を食べられる場所（持ち込みOKの休憩室・ランチスペース）がある東京のイベントを${n}件まとめました。公式ページで確かめた催しです。雨の日や子連れのお出かけに。`, e => e.bento, '館内でお弁当OK', n => `会場の公式ページで、館内に持ち込みのお弁当を食べられる場所があると書かれている催しを${n}件のせています。使える時間や席の数は公式ページで確かめてください。`],
    ['/kids/bento/', '子どもと行けて館内でお弁当を食べられるイベント（東京）', `子どもと行けて館内でお弁当を食べられる東京のイベント｜持ち込みOKの休憩室がある親子の催し（対象年齢つき）｜${NAME}`, n => `子どもと行けて、施設の中でお弁当を食べられる東京のイベントを${n}件まとめました。対象年齢、時間、料金、最寄り駅つき。`, e => e.kid && e.bento, '子どもとお弁当OK', n => `子どもが楽しめて、館内に持ち込みのお弁当を食べられる場所がある催しを${n}件、対象年齢つきでのせています。`],
    ['/cashless/', 'カードや電子マネーで払える東京のイベント', `キャッシュレスで払える東京のイベント｜クレジットカード・交通系IC・PayPayが使える催し｜${NAME}`, n => `入場料や会場での買い物を、クレジットカード・交通系IC・PayPayなどで払える東京のイベントを${n}件まとめました。公式ページで支払い方法を確かめた催しです。`, e => (e.pay || []).some(x => x !== 'cash'), 'キャッシュレスOK', n => `公式ページで、カード・電子マネー・QRコード決済が使えると書かれている催しを${n}件のせています。出店ごとに使える支払いがちがう催しもあるので、現金も少し持っていくと安心です。`],
    ['/parking/', '駐車場がある東京のイベント', `駐車場がある東京のイベント｜車で行ける催し（今日・今週末）｜${NAME}`, n => `会場に駐車場がある東京のイベントを${n}件まとめました。公式ページで駐車場の案内を確かめた催しです。`, e => e.parking, '駐車場あり', n => `公式ページで駐車場の案内がある催しを${n}件のせています。台数や料金は公式ページで確かめてください。`],
  ];
  // 終わった催し：次回（ser が同じで、まだ終わっていない催し）と、いま行ける近くの同じジャンルの催しを上に出す
  const endedBox = ev => {
    if (!ended(ev)) return '';
    const nx = ev.ser ? CURRENT.filter(x => x.ser === ev.ser && x.id !== ev.id).sort((a, b) => cmp(a.s, b.s))[0] : null;
    const alt = CURRENT.filter(x => x.g === ev.g).map(x => [km(ev.lat, ev.lng, x.lat, x.lng), x]).sort((a, b) => a[0] - b[0]).slice(0, 4).map(p => p[1]);
    return `<div class="endedbox"><p><b>この催しは${ymd(ev.e)}に終わりました。</b></p>${nx ? `<p>次回：<a href="/event/${nx.id}/">${esc(nx.t)}</a>（${span(nx)}）</p>` : ''}${alt.length ? `<p>いま行ける近くの${esc(GENRES[ev.g].n)}：</p><ul>${alt.map(x => `<li><a href="/event/${x.id}/">${esc(x.t)}</a>（${esc(x.st)}駅・${span(x)}）</li>`).join('')}</ul>` : ''}</div>`;
  };
  const condLinks = ev => { const l = COND_PAGES.filter(c => c[4](ev) && CURRENT.filter(c[4]).length >= 3).map(c => `<a href="${c[0]}">${esc(c[1])}</a>`); if (!ended(ev) && stPage(ev.st)) l.push(`<a href="${stPage(ev.st)}">${esc(ev.st)}駅の近くのイベント</a>`); return l.length ? `\n      <p class="cap">この催しは ${l.join('、')} にも載っています。</p>` : ''; };
  // 月ごとのページ（今月から3か月、5件以上ある月だけ）。「東京 11月 イベント」で探す人向け。外国語版（intl.js）と同じ月の集め方。
  const JMONTHS = [];
  {
    const p0 = TODAY.split('-').map(Number);
    for (let i = 0; i < 3; i++) {
      const y = p0[0] + Math.floor((p0[1] - 1 + i) / 12), m = (p0[1] - 1 + i) % 12 + 1, key = `${y}-${String(m).padStart(2, '0')}`;
      const first = i === 0 ? TODAY : `${key}-01`, last = `${key}-${String(new Date(Date.UTC(y, m, 0)).getUTCDate()).padStart(2, '0')}`;
      const evs = CURRENT.filter(e => e.s <= last && e.e >= first);
      if (evs.length >= 5) JMONTHS.push([key, y, m, evs]);
    }
  }

  const ways = (current = null) => {
    const a = (p, n) => `<a href="${p}"${p === current ? ' aria-current="page"' : ''}>${esc(n)}</a>`;
    const g = Object.values(GENRE_PAGES).map(([s, n]) => a(`/${s}/`, n)).join('') + a('/free/', '無料で行ける') + COND_PAGES.filter(c => CURRENT.filter(c[4]).length >= 3).map(c => a(c[0], c[5])).join('') + (KIDP.length ? KIDP.map(([p, , , , n]) => a(p, n)).join('') : '') + a('/weekend/', '今週末') + JMONTHS.map(([k, , m]) => a(`/month/${k}/`, `${m}月のイベント`)).join('') + (pickEvs.length >= 6 ? a(PICK_PATH, '今週末のおすすめ') : '') + a('/date/', '日付から') + a('/stats/', '数字で見る東京のイベント') + a('/plan/', '行きたいリスト・週末プラン') + (EV.some(e => e.ig && !ended(e)) ? a('/instagram/', 'インスタ告知') : '') + (CURRENT.some(e => (e.k || []).includes('halloween')) ? a('/halloween/', 'ハロウィン') : '') + (CURRENT.some(e => (e.k || []).includes('newyear')) ? a('/newyear/', '年末年始') : '') + (CURRENT.some(e => (e.k || []).includes('xmas')) ? a('/christmas/', 'クリスマスマーケット') : '') + (CURRENT.some(e => (e.k || []).includes('illumi')) ? a('/illumination/', 'イルミネーション') : '') + (CURRENT.filter(e => (e.k || []).includes('koyo') || /紅葉|もみじ|モミジ|錦秋|いちょう祭|イチョウ祭|銀杏祭|黄葉/.test(e.t)).length >= 3 ? a('/koyo/', '紅葉・ライトアップ') : '') + (CURRENT.filter(e => (e.k || []).includes('torinoichi') || /酉の市|酉のまち|おとりさま/.test(e.t)).length >= 3 ? a('/torinoichi/', '酉の市') : '');
    const ar = LIVE_AREAS.map(([s, n]) => a(`/area/${s}/`, n)).join('') + PLACES_LIVE.map(([s, n]) => a(`/place/${s}/`, n)).join('');
    return `  <nav class="ways" aria-label="ほかのさがし方">
    <h2>ジャンル・条件からさがす</h2><div class="links">${g}</div>
    <h2>エリアからさがす</h2><div class="links">${ar}</div>
  </nav>
`;
  };

  const FOOT_NOTE = '掲載しているのは、会場や主催者の公式ページ、または公式のインスタグラムで確認できた催しです。内容は変わることがあり、売り切れや休館もあるので、出かける前に公式ページを確認してください。距離は直線、所要時間はおおよその目安です。写真は会場やその周辺のイメージで、催しそのものの写真ではありません。';
  const foot = (scripts = ['pages.js']) => {
    const sc = scripts.map(s => `<script src="/${s}?v=${VER}${/^(data|i18n)/.test(s) ? '.' + KDV : ''}"></script>\n`).join('');
    return `  <p class="follow">毎週木曜、東京の週末のまとめをインスタグラム <a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a> で配信しています。<a href="/app/">ホーム画面に追加</a>すると、アプリのように開けます。</p>
  <p class="foot">${FOOT_NOTE}${affOn ? '当サイトはアフィリエイト広告（PR）を含みます。' : ''}</p>
  <nav class="nav"><a href="/">催しをさがす</a><a href="/app/">アプリのように使う</a><a href="/drama/">連続アニメ『東京、あと80日』</a><a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">インスタグラム @kyochika.tokyo</a><a href="/about.html">このサイトについて・運営者情報・写真の出典</a><a href="/about.html#contact">お問い合わせ</a></nav>
</div>
${sc}</body>
</html>
`;
  };

  // インスタのフォローへの案内（10/15〜、坂尾さん「フォロワー100人が勝負」）。日本語のページだけ。クリックは GA の ig_follow_click。
  const igFollow = where => `<aside class="igf"><p><b>インスタの告知もお知らせ。</b>Googleに出てこない東京の催しを、毎週まとめて届ける。</p><a class="go igbtn" href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','ig_follow_click',{where:'${where}'})">@kyochika.tokyo をフォロー</a></aside>`;
  const pic = (ev, eager = false) => {
    const g = GENRES[ev.g].n;
    if (ev.ph) return `<div class="pic"><img src="/photos/${ev.ph}.jpg" alt="${esc(CRED[ev.ph][0])}の写真" width="384" height="216"${eager ? '' : ' loading="lazy"'}><span class="kind">${g}</span></div>`;
    return `<div class="pic none"><span class="kind">${g}</span></div>`;
  };

  // 一覧の1件。トップの app.js と同じ形（駅名標の番号・見出し・写真・時間と料金）にする。
  const LTM = { art: 'A', live: 'L', food: 'F', market: 'M', festival: 'S', popup: 'P' };
  // 子ども向けの目安（公式に年齢の記載があるものだけ ev.kid=[下限,上限] を持つ。99＝親子で全年齢）
  const kidTxt = k => k[1] >= 99 ? `親子で・${k[0]}歳から` : `${k[0]}歳〜${k[1] === 12 ? '小学生' : k[1] === 15 ? '中学生' : k[1] + '歳'}`;
  const card = (ev, eager = false, i = 0) =>
    `<li class="ev" style="--c:var(--${ev.g})" data-e="${ev.e}"><span class="sn" aria-hidden="true"><b>${LTM[ev.g] || 'E'}</b>${String(i + 1).padStart(2, '0')}</span>`
    + `<div class="hd"><p class="kd">${GENRES[ev.g].n}</p><h2><a href="/event/${ev.id}/">${esc(ev.t)}</a></h2><p class="where">${esc(ev.v)}（${esc(ev.st)}駅）</p></div>`
    + (ev.fl ? `<a class="th" href="/event/${ev.id}/" tabindex="-1" aria-hidden="true"><img src="/fl/${ev.id}.jpg" alt="" width="384" height="216"${eager ? '' : ' loading="lazy"'}></a>` : ev.ph ? `<a class="th" href="/event/${ev.id}/" tabindex="-1" aria-hidden="true"><img src="/photos/${ev.ph}.jpg" alt="" width="384" height="216"${eager ? '' : ' loading="lazy"'}></a>` : '')
    + `<div class="rest"><p class="when">${when(ev)}</p><p class="meta"><span class="price">${esc(ev.price)}</span>${ev.free ? '<span class="bd free">無料</span>' : ''}${ev.ig ? '<span class="bd ig">インスタで告知</span>' : ''}${ev.kid ? `<span class="bd kid">子ども ${kidTxt(ev.kid)}</span>` : ''}${ev.bf ? '<span class="bd bf">車椅子OK</span>' : ''}${ev.dog ? '<span class="bd dog">犬連れOK</span>' : ''}</p>`
    + (ev.note ? `<p class="note">${esc(ev.note)}</p>` : '')
    + `<a class="off" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.ig ? 'インスタの告知' : '公式ページ'}</a></div></li>`;

  const itemList = evs => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: evs.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: url(`/event/${e.id}/`), name: e.t })) });

  const eventLd = ev => {
    const c = mins(ev.c) > mins(ev.o) ? ev.c : '23:59';
    const ld = {
      '@context': 'https://schema.org', '@type': LDTYPE[ev.g],
      name: ev.t, startDate: `${ev.s}T${ev.o}:00+09:00`, endDate: `${ev.e}T${c}:00+09:00`,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: { '@type': 'Place', name: ev.v, address: { '@type': 'PostalAddress', addressRegion: '東京都', addressCountry: 'JP' }, geo: { '@type': 'GeoCoordinates', latitude: ev.lat, longitude: ev.lng } },
      url: url(`/event/${ev.id}/`), sameAs: ev.url,
      isAccessibleForFree: !!ev.free, description: ev.note || ev.t,
    };
    if (ev.kid) { ld.typicalAgeRange = ev.kid[1] >= 99 ? `${ev.kid[0]}-` : `${ev.kid[0]}-${ev.kid[1]}`; ld.audience = { '@type': 'PeopleAudience', suggestedMinAge: ev.kid[0], ...(ev.kid[1] < 99 ? { suggestedMaxAge: ev.kid[1] } : {}) }; }
    if (ev.ph) ld.image = [`${BASE}/photos/${ev.ph}.jpg`];
    if (ev.fl) ld.image = [`${BASE}/fl/${ev.id}.jpg`].concat(ld.image || []);
    { const og = ogUrl(ev); if (og) ld.image = (ld.image || []).concat([og.replace(/\?.*$/, '')]); }
    // 料金（Google の検索のイベント枠に出るため）。無料か、一般・大人の料金が読めるときだけ。
    { const pm = ev.free ? 0 : priceMax(ev.price); if (pm < 99999) ld.offers = { '@type': 'Offer', price: pm, priceCurrency: 'JPY', url: ev.url, availability: 'https://schema.org/InStock', validFrom: `${ev.s}T00:00:00+09:00` }; }
    if (/^東京都/.test(ev.addr || '')) ld.location.address.streetAddress = ev.addr;
    if (ev.free) ld.offers = { '@type': 'Offer', price: 0, priceCurrency: 'JPY', availability: 'https://schema.org/InStock', url: ev.url };
    return ld;
  };

  const OUT = {}, PAGES = [];
  const write = (path, text) => {
    OUT[(path.endsWith('/') ? path + 'index.html' : path).replace(/^\//, '')] = text;
    if (!path.endsWith('404.html')) PAGES.push(path);
  };

  // ── 催しごとのページ ──
  for (const ev of EV) {
    const path = `/event/${ev.id}/`;
    const [aslug, aname] = areaOf(ev);
    const hasArea = aslug && LIVE_AREAS.some(([s]) => s === aslug);
    const [gslug, gname] = GENRE_PAGES[ev.g];
    const [cr, crLd] = crumbs([['トップ', '/'], [gname, `/${gslug}/`]].concat(hasArea ? [[aname, `/area/${aslug}/`]] : [], [[ev.t, null]]));
    const kind = KIND[ev.g];
    const title = `${ev.t}｜${ev.v}・${ev.st}駅｜日程・時間・料金｜${NAME}`;
    const desc = `${ev.v}（${ev.st}駅）の${kind}。${oneDay(ev) ? '開催日' : '会期'}は${span(ev)}、${ev.o}${ev.g === 'live' ? '開演' : '〜' + ev.c}、料金は${ev.price}。${ev.note || ''}`;
    const rows = [[oneDay(ev) ? '開催日' : '会期', span(ev) + (oneDay(ev) ? '' : `（${ymd(ev.e)}まで）`)],
      ['時間', [(ev.g === 'live' ? `${ev.o} 開演（終わりは${ev.c}ごろの見込み）` : `${ev.o}〜${ev.c}`), lateText(ev), hxText(ev)].filter(x => x).join('　')],
      ['料金', ev.price]].concat(ev.kid ? [['子ども', ev.kidnote || kidTxt(ev.kid)]] : [], ev.bf ? [['車椅子', '公式ページにバリアフリーの案内あり']] : [], ev.dog ? [['愛犬', '公式ページでペット同伴可']] : [], ev.stroller ? [['ベビーカー', '公式ページにベビーカーの案内あり']] : [], ev.noresv ? [['予約', '予約不要（公式ページより）']] : [], ev.pay && ev.pay.length ? [['支払い', payTxt(ev)]] : [], ev.bento ? [['お弁当', ev.bentonote || '館内にお弁当を食べられる場所あり（公式ページより）']] : [], [['会場', ev.v], ['最寄り駅', ev.st + '駅']]);
    const facts = rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
    const spots = Object.entries(SPOTS).map(([n, [la, ln]]) => [km(la, ln, ev.lat, ev.lng), n]).sort((a, b) => a[0] - b[0] || cmp(a[1], b[1])).slice(0, 4);
    const from = spots.map(([dist, n]) => `<dt>${n}から</dt><dd>${far(dist)}</dd>`).join('');
    const others = CURRENT.filter(x => x.id !== ev.id).map(x => [km(ev.lat, ev.lng, x.lat, x.lng) + ((x.s <= ev.e && x.e >= ev.s) ? 0 : 50), x]).sort((a, b) => a[0] - b[0]).slice(0, 6).map(p => p[1]);
    const near = others.map(x => `<li><a href="/event/${x.id}/">${esc(x.t)}</a><span>${esc(x.v)}（${esc(x.st)}駅）・ここから${far(km(ev.lat, ev.lng, x.lat, x.lng))}・${span(x)}</span></li>`).join('');
    const cap = ev.ph ? `<p class="cap">写真は${esc(CRED[ev.ph][0])}です。会場やその周辺のイメージで、${kind}そのものの写真ではありません。</p>` : '';
    const maps = 'https://www.google.com/maps/search/?api=1&query=' + quote(ev.v.split('（')[0]);
    // よくある質問（「〇〇展 いつまで」「〇〇 何時まで」「〇〇 料金」「〇〇 最寄り駅」の検索向け）。data.js の値だけで作る。
    const evFaq = (() => {
      const q = [], t = ev.t.length > 40 ? ev.t.slice(0, 40) + '…' : ev.t, d0 = staDist(ev);
      q.push([oneDay(ev) ? `${t}はいつ？` : `${t}はいつまで？`, oneDay(ev) ? `${ymd(ev.s)}（${md(ev.s).replace(/^.*\(/, '').replace(')', '')}）に開かれます。` : `会期は${ymd(ev.s)}から${ymd(ev.e)}までです。${(ev.off || []).filter(d => d >= TODAY).length ? `休みの日：${(ev.off || []).filter(d => d >= TODAY).slice(0, 6).map(md).join('、')}${(ev.off || []).filter(d => d >= TODAY).length > 6 ? 'ほか' : ''}。` : ''}`]);
      q.push([ev.g === 'live' ? `${t}は何時から？` : `${t}は何時から何時まで？`, (ev.g === 'live' ? `${ev.o}開演です。` : `${ev.o}から${ev.c}までです。`) + [lateText(ev), hxText(ev)].filter(x => x).join('　') + (ev.g === 'live' ? '' : '最終入場の時刻は公式ページで確かめてください。')]);
      q.push([`${t}の料金は？`, ev.free ? `無料です（${ev.price}）。` : `${ev.price}。`]);
      q.push([`${t}の会場と最寄り駅は？`, `会場は${ev.v}、最寄り駅は${ev.st}駅です${d0 < 3 ? `（駅から直線で約${Math.max(100, Math.round(d0 * 10) * 100)}m、歩いて${Math.max(1, Math.round(d0 * 1000 / 80))}分ほど）` : ''}。`]);
      if (ev.kid) q.push([`${t}は子どもも楽しめる？`, `主催者は子ども向け・親子向けとしています。${ev.kidnote || kidTxt(ev.kid)}。`]);
      if (ev.dog) q.push([`${t}は犬連れで行ける？`, '公式ページにペット同伴可と書かれています。リードなどの決まりは公式ページで確かめてください。']);
      if (ev.bf) q.push([`${t}は車椅子で行ける？`, '会場の公式ページにバリアフリーの案内があります。設備の細かい点は公式ページで確かめてください。']);
      if (ev.crowd) q.push([`${t}は混んでいる？`, '公式に混雑状況が出ています。このページの「公式の混雑状況を見る」から確かめられます。']);
      if (ev.pay && ev.pay.length) q.push([`${t}で使える支払いは？`, payTxt(ev) + '。']);
      return q;
    })();
    const body = `${cr}  <main class="page" style="--c:var(--${ev.g})" data-e="${ev.e}" data-detail>
    ${ev.fl ? `<figure class="pic fl"><img src="/fl/${ev.id}.jpg" alt="${esc(ev.t)}の告知画像" loading="eager"><figcaption>告知画像：${esc(ev.flby || '主催者')}（掲載の許可をいただいています）</figcaption></figure>` : !ev.ph && ogUrl(ev) ? `<div class="pic og"><img src="/og/${ev.id}.jpg?v=${OGDONE[ev.id]}" alt="${esc(ev.t)}（日程と会場のカード）" width="1200" height="630"><span class="kind">${GENRES[ev.g].n}</span></div>` : pic(ev, true)}
    <div class="body">
      <h1 class="pt">${esc(ev.t)}</h1>
      <p class="lead">${esc(ev.v)}（${esc(ev.st)}駅）${ev.free ? '・無料' : ''}</p>
      ${endedBox(ev)}
      ${ev.note ? `<p>${esc(ev.note)}</p>` : ''}
      <dl class="facts">${facts}</dl>${ev.crowd ? `\n      <p class="cap"><a href="${esc(ev.crowd)}" target="_blank" rel="noopener">公式の混雑状況を見る</a></p>` : ''}${condLinks(ev)}
      <p class="cap">${ev.ig ? '日程の変更や中止は、主催者のインスタグラムで確かめてください。' : '休みの日や最終入場の時刻は、公式ページで確かめてください。'}</p>
      <div class="row"><a class="go pri" href="${esc(ev.url)}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','official_click',{ev_id:'${ev.id}'})">${ev.ig ? 'インスタの告知で確かめる' : '公式ページで確かめる'}</a><a class="go" href="${maps}" target="_blank" rel="noopener">地図でひらく</a></div>
      <div class="row share"><a class="go line" href="https://social-plugins.line.me/lineit/share?url=${quote(url(path))}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','share',{method:'line',ev_id:'${ev.id}'})">LINEで友だちに送る</a><a class="go" href="https://x.com/intent/post?text=${quote(ev.t + '（' + span(ev) + '・' + ev.st + '駅）')}&amp;url=${quote(url(path))}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','share',{method:'x',ev_id:'${ev.id}'})">Xでポスト</a><button class="go fav" type="button" data-fav="${ev.id}">☆ 行きたいに保存</button><a class="go" href="${calUrl(ev)}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','calendar_add',{ev_id:'${ev.id}'})">カレンダーに追加</a></div>
      ${(() => { const F = FEATURES.find(f => (f.main === ev.id || (f.also || []).includes(ev.id)) && TODAY <= f.until); return F ? `<a class="igcta feat-in" href="/feature/${F.slug}/" onclick="window.gtag&&gtag('event','feature_in',{feature:'${F.slug}',from:'event'})"><b>特集：${esc(F.crumb)}</b><span>日程・行き方・あわせて行ける近くの催しをまとめて見る →</span></a>` : ''; })()}
      ${igFollow('event')}
      <p class="cap" id="favlink" hidden><a href="/plan/">行きたいリストから週末プランを作る →</a></p>
      <section class="faq"><h2>よくある質問</h2>${evFaq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>
      <h2>主な駅からの近さ</h2>
      <dl class="facts">${from}</dl>
      <p class="cap">距離は直線、時間はおおよその目安です。</p>
      <h2>近くでやっているほかの催し</h2>
      <ul class="near">${near}</ul>
      <h2>近くでごはん・カフェ</h2>
      <p class="sub2">${esc(ev.st)}駅のまわりのお店</p>
      <div class="row eat">${eatLinks(ev).map(([n, u, pr]) => `<a class="go" href="${esc(u)}" target="_blank" rel="${pr ? 'sponsored ' : ''}noopener" onclick="window.gtag&&gtag('event','eat_click',{eat_type:'${esc(n)}'})">${n}</a>`).join('')}</div>
      <p class="cap">食べログ・ホットペッパー・Google マップの検索がひらきます。点数や口コミはそれぞれのサイトでご覧ください。${eatLinks(ev).some(x => x[2]) ? '一部は広告（アフィリエイト）リンクです。' : ''}</p>
      ${affBox(ev)}
      ${cap}
      <p class="upd">${ymd(TODAY)}に${ev.ig ? '主催者のインスタグラムの告知' : '公式ページ'}で確認した内容です。</p>
    </div>
  </main>
`;
    write(path, head(title, desc, path, [eventLd(ev), crLd].concat(evFaq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: evFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : []), false, ev.fl ? `${BASE}/fl/${ev.id}.jpg` : ogUrl(ev)) + sign(null, path) + body + ways() + foot());
  }

  // ── 一覧ページ（ジャンル・無料・エリア・今週末） ──
  // アソビュー（バリューコマース、PR）。日本語のページだけ。クリックは GA の aso_click で数える。
  const ASO_ALL = 'https://www.asoview.com/search/?adultQuantity=1&destinationId=prf130000&destinationType=prefecture';
  const ASO_CRAFT = ASO_ALL + '&leisureId=grp4&leisureType=categoryGroup';
  const ASO = { '/workshop/': [ASO_CRAFT, '東京のものづくり体験（陶芸・ガラス・レザークラフトなど）をアソビューで探す'], '/kids/workshop/': [ASO_CRAFT, '親子で行ける東京のものづくり体験をアソビューで探す'], '/kids/': [ASO_ALL, '子どもと行ける東京の遊び・チケットをアソビューで探す'], '/kids/rainy/': [ASO_ALL, '雨の日に子どもと行ける東京の遊び・チケットをアソビューで探す'], '/kids/weekend/': [ASO_ALL, '今週末に子どもと行ける東京の遊び・チケットをアソビューで探す'], '/rainy/': [ASO_ALL, '雨の日の東京の遊び・体験をアソビューで探す'], '/weekend/': [ASO_ALL, '今週末の東京の遊び・体験・チケットをアソビューで探す'] };
  const asoBox = (key, label, tag) => { const w = vcWrap(key, 'asoview'); return `  <section class="aso"><a class="go" href="${esc(w[0])}" target="_blank" rel="${w[1] ? 'sponsored ' : ''}noopener" onclick="window.gtag&&gtag('event','aso_click',{aso_type:'${tag}'})">${esc(label)} →</a><p class="cap">${w[1] ? 'PR・' : ''}アソビュー！のページがひらきます。前売りや予約ができる施設・体験が見つかります。</p></section>\n`; };
  // いつもの検索（行く日×駅）を一覧ページの上にも。送るとトップが /?d=&s= で開く（app.js が読む）。10/16 坂尾さん「いつも通りの検索できるところがトップにないと離脱が増える」
  const searchBar = (defSt = '渋谷') => {
    const d0 = dnum(TODAY), jd = iso => { const p = iso.split('-').map(Number); return `${p[1]}/${p[2]}（${DOWS[dow(iso)]}${iso in HOLIDAYS ? '・祝' : ''}）`; };
    const days = Array.from({ length: 7 }, (_, i) => isoOf(d0 + i)).map((d, i) => `<option value="${d}">${i === 0 ? 'きょう ' : i === 1 ? 'あした ' : ''}${jd(d)}</option>`).join('');
    const sts = ['渋谷', '新宿', '池袋', '東京', '銀座', '上野', '表参道', '六本木', '恵比寿', '下北沢', '吉祥寺', '品川'].concat(defSt && !['渋谷'].includes(defSt) ? [defSt] : []).filter((x, i, a) => a.indexOf(x) === i && SPOTS[x]);
    return `  <form class="qbar" action="/" method="get" onsubmit="window.gtag&&gtag('event','qbar_search',{page:location.pathname})"><b>東京のイベントをさがす</b><label>いつ<select name="d">${days}</select></label><label>どこから<select name="s">${sts.map(x => `<option${x === defSt ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select></label><label>条件<select name="c"><option value="">指定なし</option><option value="free">無料</option><option value="dog">愛犬と</option><option value="kid">子どもと</option><option value="bf">車椅子OK</option><option value="stroller">ベビーカーOK</option><option value="night">夜19時以降も</option></select></label><button type="submit">近い順に見る</button></form>\n`;
  };
  const listPage = (path, h1, title, desc, evs0, crumbName, intro, faq = [], extra = '', top = '', og = null, pre = '') => {
    const evs = order(evs0);
    const [cr, crLd] = crumbs([['トップ', '/'], [crumbName, null]]);
    const cards = evs.map((e, i) => card(e, i < 2, i)).join('');
    const body = `${cr}${pre || searchBar((path.startsWith('/station/') && Object.keys(SPOTS).find(x => stSlug(x) === path.split('/')[2])) || '渋谷')}  <h1 class="pt">${esc(h1)}</h1>
  <p class="intro">${esc(intro)}</p>
${top}  <div class="board"><span>終わりが近い順</span><b>${evs.length}件</b></div>
  <ul class="list">${cards}</ul>
${extra}${ASO[path] ? asoBox(ASO[path][0], ASO[path][1], path) : ''}${faq.length ? `  <section class="faq"><h2>よくある質問</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>\n` : ''}  <p class="upd">${ymd(TODAY)}時点の掲載分です。行く日や出発する駅からさがすときは、<a href="/">トップページ</a>が便利です。</p>
  <div class="row share"><a class="go line" href="https://social-plugins.line.me/lineit/share?url=${quote(url(path))}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','share',{method:'line',page:'${path}'})">このページをLINEで送る</a></div>
  ${igFollow('list')}
  <a class="igcta" href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener"><b>週末どこ行く？をインスタでも</b><span>キョウチカのインスタ @kyochika.tokyo をフォローすると、東京の催しのおすすめが届きます →</span></a>
`;
    const faqLd = faq.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : [];
    write(path, head(title, desc, path, [itemList(evs), crLd].concat(faqLd), false, og) + sign(path, path) + body + ways(path) + foot());
  };

  // 特集ページ用「ほかのイベントもさがす」（10/16、坂尾さん「他の検索どこからやるのかわからない」）
  const moreBox = (area, station) => {
    const t = TODAY, sat = (() => { let d = dnum(t); while (dow(isoOf(d)) !== 6) d++; return isoOf(d); })();
    const jd = iso => { const p = iso.split('-').map(Number); return `${p[1]}/${p[2]}`; };
    const L = [['/', '駅から近い順にさがす', '行く日と駅を選ぶだけ'], ['/today/', `今日（${jd(t)}）行ける`, '開いている催しだけ'], [`/weekend/${sat}/`, `今週末（${jd(sat)}〜）`, '土日に行ける催し'], ['/free/', '無料で行ける', '入場無料の催し'], ['/dog/', '愛犬と行ける', 'ペット同伴OKの催し']]
      .concat(area ? [[`/area/${area[0]}/`, area[1], 'このあたりの催し']] : []).concat(station ? [[`/station/${station[0]}/`, `${station[1]}駅の近く`, '駅が最寄りの催し']] : []).concat([['/night/', '夜21時以降も', '仕事帰りに行ける']]);
    return `  <section class="more" id="more"><h2>ほかのイベントもさがす</h2><div class="more-g">${L.map(([h, n, s]) => `<a href="${h}"><b>${esc(n)}</b><span>${esc(s)}</span></a>`).join('')}</div></section>\n`;
  };

  // 特集（2026-10-16〜、坂尾さん「特集ページは将来売る大事なページ。間違いなく効果が出る形を今から」）
  // 型：検索欄 → 見出し → 画像 → ひと目でわかる表 → 行動ボタン（公式・行き方・カレンダー・LINE）→ ここがいい3つ → 催し → あわせて行ける近くの催し → よくある質問 → ほかのイベントもさがす。
  // 効果は GA の feature_cta（feature＝slug、type＝official/route/calendar/line/near/more）と official_click で数える（主催者に見せる数字）。
  const ACTIVE_FEATURES = [];
  for (const F of FEATURES) {
    const main = EV.find(e => e.id === F.main);
    if (!main || TODAY > F.until) continue;
    const evs = CURRENT.filter(e => e.id === F.main || (F.also || []).includes(e.id));
    const ga = t => `onclick="window.gtag&&gtag('event','feature_cta',{feature:'${F.slug}',type:'${t}'})"`;
    const days = []; for (let d = dnum(TODAY > main.s ? TODAY : main.s); d <= dnum(main.e); d++) days.push(isoOf(d));
    const near = CURRENT.filter(e => e.id !== F.main && !(F.also || []).includes(e.id) && days.some(d => activeOn(e, d)) && km(main.lat, main.lng, e.lat, e.lng) <= 1.5)
      .sort((a, b) => km(main.lat, main.lng, a.lat, a.lng) - km(main.lat, main.lng, b.lat, b.lng)).slice(0, 6);
    const route = `https://www.google.com/maps/dir/?api=1&amp;travelmode=transit&amp;destination=${main.lat},${main.lng}`;
    const top = `  <section class="feat">
    <figure><img src="${F.img[0]}" width="${F.img[1]}" height="${F.img[2]}" alt="${esc(F.img[3])}"></figure>
    <dl class="feat-dl">${F.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>
    <div class="feat-cta">
      <a class="c1" href="${F.official}" target="_blank" rel="noopener" onclick="window.gtag&&(gtag('event','feature_cta',{feature:'${F.slug}',type:'official'}),gtag('event','official_click',{ev_id:'${main.id}'}))">公式サイトを見る</a>
      <a href="${route}" target="_blank" rel="noopener" ${ga('route')}>行き方（地図）</a>
      <a href="${calUrl(main)}" target="_blank" rel="noopener" ${ga('calendar')}>カレンダーに追加</a>
      <a href="https://social-plugins.line.me/lineit/share?url=${quote(url('/feature/' + F.slug + '/'))}" target="_blank" rel="noopener" ${ga('line')}>LINEで送る</a>
    </div>
    <h2 class="feat-h">ここがいい</h2>
    <ol class="feat-pt">${F.points.map(([a, b]) => `<li><b>${esc(a)}</b><span>${esc(b)}</span></li>`).join('')}</ol>
    ${F.credit ? `<p class="feat-note">画像提供：${esc(F.credit)}（掲載の許可をいただいています）。最新の情報は公式サイトで確かめてください。</p>` : ''}
  </section>
`;
    const nearHtml = near.length ? `  <section class="feat-near"><h2 class="feat-h">あわせて行ける近くの催し</h2><ul class="list">${near.map((e, i) => card(e, false, i)).join('').replace(/<a /g, `<a ${ga('near')} `)}</ul></section>\n` : '';
    listPage(`/feature/${F.slug}/`, F.h1, F.title, F.desc, evs, F.crumb, F.lead, F.faq || [], nearHtml + moreBox(F.area, F.station).replace(/<a /g, `<a ${ga('more')} `), `  <p class="more-top"><a href="#more">ほかのイベントは、行く日と駅からさがせる ↓</a></p>\n` + top, url(F.img[0]), searchBar(F.station ? F.station[1] : '渋谷'));
    ACTIVE_FEATURES.push(F);
  }

  for (const [g, [slug, gname]] of Object.entries(GENRE_PAGES)) {
    const evs = CURRENT.filter(e => e.g === g), freeN = evs.filter(e => e.free).length;
    listPage(`/${slug}/`, `東京の${gname}`, `東京の${gname}｜開催中・今週の一覧｜${NAME}`,
      `東京で開催中・今週開かれる${gname}を${evs.length}件まとめました。会期、時間、料金、最寄り駅がひと目でわかります。無料で行けるものは${freeN}件です。`,
      evs, gname, `東京で開催中か、今週開かれる${gname}を${evs.length}件のせています。そのうち無料で行けるものは${freeN}件です。`);
  }

  {
    const evs = CURRENT.filter(e => e.free);
    listPage('/free/', '東京で無料で行ける催し', `東京の無料で行けるイベント｜開催中・今週の一覧｜${NAME}`,
      `東京で無料で入れる美術展・ライブ・フードイベント・祭りなどを${evs.length}件まとめました。会期、時間、最寄り駅がひと目でわかります。`,
      evs, '無料で行ける', `入場やチャージが無料の催しを${evs.length}件のせています。飲食や物販は別にお金がかかることがあります。`);
  }
  // 条件のページ（10/14〜）。公式ページに書いてあることだけで印を付ける（bf・dog・indoor）。雨の日は美術展（屋内）と indoor:true。
  for (const [path, h1, title, desc, test, cname, intro] of COND_PAGES) {
    const evs = CURRENT.filter(test);
    if (evs.length >= (path === '/dog/' ? 1 : 3)) listPage(path, h1, title, desc(evs.length), evs, cname, intro(evs.length), (COND_FAQ[path] || (() => []))(evs), path === '/dog/' ? DOG_EXTRA : '');
  }

  for (const [p, h1, lo, hi, n] of KIDP) {
    const evs = CURRENT.filter(e => e.kid && e.kid[0] <= hi && e.kid[1] >= lo);
    const all = p === '/kids/';
    listPage(p, h1, `${h1}｜今週末・親子で楽しめる催し（対象年齢つき）｜${NAME}`,
      `${all ? '子どもと' : n + 'の子どもと'}一緒に行ける東京の催しを${evs.length}件まとめました。対象年齢は主催者の公式ページに書かれたもので、会期、時間、料金、最寄り駅がひと目でわかります。`,
      evs, n, `主催者が公式ページで子ども向け・親子向けと書いている催しを${evs.length}件のせています。対象年齢は公式の記載どおりです（年齢の書き方は催しごとに違うので、くわしくは各ページで確かめてください）。`);
  }

  {
    const evs = CURRENT.filter(e => e.ig);
    if (evs.length) listPage('/instagram/', 'インスタの告知から見つけた東京の催し', `インスタで見つけた東京のイベント｜蚤の市・個展・ライブ｜${NAME}`,
      `主催者や会場がインスタグラムで告知している東京の催しを${evs.length}件まとめました。検索では見つけにくい小さな市や個展、ライブの日程、時間、最寄り駅がわかります。`,
      evs, 'インスタ告知', `主催者や会場がインスタグラムで告知している催しを${evs.length}件のせています。検索では見つけにくい、小さな市や個展、ライブが中心です。日程の変更や中止は、各主催者のインスタグラムで確かめてください。`);
  }

  // 季節の特集。催しの k（例 ['xmas']）で集める。1件もなければページを作らない。
  const SEASONS = [
    ['xmas', '/christmas/', '東京のクリスマスマーケット2026', `東京のクリスマスマーケット2026｜日程・場所・入場料の一覧｜${NAME}`, n => `2026年に東京で開かれるクリスマスマーケットを${n}件まとめました。日比谷・六本木・恵比寿など、会期、時間、入場料、最寄り駅がひと目でわかります。`, 'クリスマスマーケット', n => `2026年の冬に東京で開かれるクリスマスマーケットを${n}件のせています。会期や入場料は公式の発表で確かめたものです。混みやすいので、平日の夕方や開場すぐがおすすめです。`],
    ['illumi', '/illumination/', '東京のイルミネーション2026', `東京のイルミネーション2026｜期間・点灯時間・場所の一覧｜${NAME}`, n => `2026年の冬に東京で見られるイルミネーションを${n}件まとめました。期間、点灯時間、料金、最寄り駅がひと目でわかります。`, 'イルミネーション', n => `2026年の冬に東京で見られるイルミネーションを${n}件のせています。点灯時間は公式の発表で確かめたものです。`],
    ['newyear', '/newyear/', '東京の年末年始イベント2026-2027', `東京の年末年始イベント2026-2027｜カウントダウン・初詣・初売り・年末の市｜${NAME}`, n => `2026年の年末から2027年の年始に東京で行けるイベントを${n}件まとめました。カウントダウン、初詣の屋台、年末の市、正月の催しの日程・時間・最寄り駅がひと目でわかります。`, '年末年始', n => `2026年の年末から2027年の年始にかけて、東京で行ける催しを${n}件まとめました。カウントダウン、初詣、年の市、正月の催しなど。終わりが近い順にならべています。`],
    ['halloween', '/halloween/', '東京のハロウィンイベント2026', `東京のハロウィンイベント2026｜日程・場所・料金の一覧｜${NAME}`, n => `2026年に東京で開かれるハロウィンイベントを${n}件まとめました。池袋のコスプレフェス、スカイツリータウン、花やしきなど、日程、時間、料金、最寄り駅がひと目でわかります。`, 'ハロウィン', n => `2026年のハロウィンに東京で開かれるイベントを${n}件のせています。日程や料金は主催者の発表で確かめたものです。渋谷駅周辺の路上の集まりは、イベントではないので載せていません。`],
    ['koyo', '/koyo/', '東京の紅葉・ライトアップ2026', `東京の紅葉・ライトアップ2026｜見ごろ・ライトアップの時間・紅葉まつり｜${NAME}`, n => `2026年の秋に東京で開かれる紅葉のライトアップ・紅葉まつりを${n}件まとめました。期間、ライトアップの時間、料金、最寄り駅がひと目でわかります。`, '紅葉・ライトアップ', n => `2026年の秋に東京で開かれる紅葉のライトアップや紅葉まつりを${n}件のせています。見ごろは天候で変わるので、各催しの公式ページで色づきの情報を確かめてください。`, /紅葉|もみじ|モミジ|錦秋|いちょう祭|イチョウ祭|銀杏祭|黄葉/],
    ['torinoichi', '/torinoichi/', '東京の酉の市2026', `東京の酉の市2026｜一の酉・二の酉の日程と時間・場所（浅草・新宿・府中ほか）｜${NAME}`, n => `2026年に東京で開かれる酉の市を${n}件まとめました。一の酉・二の酉の日程、時間、最寄り駅がひと目でわかります。`, '酉の市', n => `2026年の酉の市を${n}件のせています。熊手の露店が並び、夜遅くまで開いているところが多いです。時間は各神社の公式ページで確かめてください。`, /酉の市|酉のまち|おとりさま/],
  ];
  for (const [k, path, h1, title, desc, cname, intro, re] of SEASONS) {
    const evs = CURRENT.filter(e => (e.k || []).includes(k) || (re && re.test(e.t)));
    if (evs.length >= (re ? 3 : 1)) listPage(path, h1, title, desc(evs.length), evs, cname, intro(evs.length));
  }
  for (const [key, y, m, evs] of JMONTHS) {
    const nf = evs.filter(e => e.free).length, nk = evs.filter(e => e.kid).length;
    const GN = { art: '美術展', live: 'ライブ', food: 'フードイベント', market: 'マーケット・蚤の市', festival: '祭り', popup: 'ポップアップ' };
    const parts = Object.keys(GN).map(g => [GN[g], evs.filter(e => e.g === g).length]).filter(x => x[1]).map(([n, c]) => `${n}${c}件`).join('、');
    listPage(`/month/${key}/`, `東京の${m}月のイベント${y}`, `東京の${m}月のイベント${y}｜祭り・マーケット・美術展・ライブ・子どもと行ける催し${evs.length}件｜${NAME}`,
      `${y}年${m}月に東京で行けるイベント${evs.length}件（${parts}）。無料${nf}件、子どもと行ける催し${nk}件。日程・時間・料金・最寄り駅つき。`,
      evs, `${m}月のイベント`, `${y}年${m}月に東京で開かれる・開催中のイベントを${evs.length}件まとめました（${parts}）。入場無料は${nf}件、子どもと行ける催しは${nk}件です。終わりが近い順にならべています。`);
  }

  // 日付ごとのページ（今日から6週間ぶん）と、その先の週末ページ。毎日アップロードしなくても、その日には正しい中身になる。
  {
    const t0 = dnum(TODAY), DAYS = [];
    for (let i = 0; i < 42; i++) DAYS.push(isoOf(t0 + i));
    const jd = iso => { const p = iso.split('-').map(Number); return `${p[1]}月${p[2]}日`; };
    const made = [];
    for (const d of DAYS) {
      const evs = CURRENT.filter(e => activeOn(e, d));
      if (evs.length < 3) continue;
      const w = DOWS[dow(d)] + (d in HOLIDAYS ? '・祝' : '');
      const freeN = evs.filter(e => e.free).length;
      listPage(`/date/${d}/`, `${jd(d)}（${w}）東京で行けるイベント`, `${jd(d)}（${w}）東京のイベント${evs.length}件｜美術展・ライブ・マーケット・祭り｜${NAME}`,
        `${ymd(d)}（${w}）に東京で行ける美術展・ライブ・フードイベント・マーケット・祭りを${evs.length}件まとめました。無料は${freeN}件。時間、料金、最寄り駅がわかります。`,
        evs, `${jd(d)}のイベント`, `${ymd(d)}（${w}）に東京で開いている催しを${evs.length}件のせています（無料は${freeN}件）。駅から近い順にさがすときは、トップページで日付と駅を選んでください。`);
      made.push([d, w, evs.length]);
    }
    for (const d of DAYS) {
      if (dow(d) !== 6) continue;
      const sun = isoOf(dnum(d) + 1);
      const evs = CURRENT.filter(e => activeOn(e, d) || activeOn(e, sun));
      if (evs.length < 3) continue;
      listPage(`/weekend/${d}/`, `${jd(d)}・${jd(sun)}の週末 東京のイベント`, `${jd(d)}・${jd(sun)}の週末 東京のイベント${evs.length}件｜${NAME}`,
        `${ymd(d)}（土）と${jd(sun)}（日）の週末に東京で行ける美術展・ライブ・フード・マーケット・祭りを${evs.length}件まとめました。`,
        evs, `${jd(d)}の週末`, `${jd(d)}（土）・${jd(sun)}（日）に東京で開いている催しを${evs.length}件のせています。`);
    }
    // 「今日 イベント 東京」向けの固定ページ。中身は毎回の書き出しでその日のものに入れかわる（URL は変わらないので評価がたまる）。
    {
      const d = TODAY, evs = CURRENT.filter(e => activeOn(e, d));
      if (evs.length >= 3) {
        const w = DOWS[dow(d)] + (d in HOLIDAYS ? '・祝' : '');
        const freeN = evs.filter(e => e.free).length, nightN = evs.filter(e => (e.c || '') >= '20:00' || e.late).length, kidN = evs.filter(e => e.kid).length;
        const faqT = [['今日、東京で行けるイベントは？', `${ymd(d)}（${w}）に東京で開いている催しは${evs.length}件です。美術展・ライブ・フードイベント・マーケット・祭りを、このページにまとめています。`], ['今日、無料で行けるイベントは？', `今日開いている催しのうち、入場無料は${freeN}件です。無料の催しだけを見るときは「無料で行ける」のページから探せます。`], ['今日の夜に行けるイベントは？', `20時以降も開いている催しが${nightN}件あります。夜遅くまで開いている催しは「夜に行ける」のページにまとめています。`], ['今日、子どもと行けるイベントは？', `子どもと行ける催しが${kidN}件あります。年齢で探すときは「子どもと行ける」のページから選べます。`], ['近くのイベントを探すには？', 'トップページで今日の日付と出発する駅を選ぶと、駅から近い順にならびます。']];
        listPage('/today/', `今日（${jd(d)}・${w}）東京で行けるイベント`, `今日 東京のイベント ${jd(d)}（${w}）${evs.length}件｜無料・夜・子どもと｜${NAME}`,
          `今日${jd(d)}（${w}）に東京で行けるイベント${evs.length}件。無料${freeN}件、夜20時以降も開いている${nightN}件、子どもと行ける${kidN}件。美術展・ライブ・フード・マーケット・祭りの時間、料金、最寄り駅がわかります。毎日更新。`,
          evs, '今日のイベント', `今日（${ymd(d)}・${w}）に東京で開いている催しを${evs.length}件のせています。無料は${freeN}件、夜20時以降も開いているのは${nightN}件、子どもと行けるのは${kidN}件。毎日、その日の催しに入れかわります。`, faqT);
      }
    }
    if (made.length) {
      const [cr, crLd] = crumbs([['トップ', '/'], ['日付からさがす', null]]);
      const li = made.map(([d, w, n]) => `<li><a href="/date/${d}/">${jd(d)}（${w}）</a><span>${n}件</span></li>`).join('');
      write('/date/', head(`日付から東京のイベントをさがす｜${NAME}`, `今日から6週間先まで、東京で行ける美術展・ライブ・マーケット・祭りを日付ごとにまとめています。`, '/date/', [crLd]) + sign(null, '/date/') + cr + `  <main class="doc"><h1 class="pt">日付から東京のイベントをさがす</h1><ul class="near">${li}</ul></main>\n` + ways('/date/') + foot());
    }
  }

  // 会場・場所のページ（「代々木公園 イベント 今日」のように場所の名前で探す人向け）。いま2件以上あるところだけ。
  for (const [slug, pname, re] of PLACES_LIVE) {
    const evs = CURRENT.filter(e => re.test(e.v));
    const kidN = evs.filter(e => e.kid).length;
    listPage(`/place/${slug}/`, `${pname}のイベント`, `${pname}のイベント（今日・今週末）｜開催中の催し一覧｜${NAME}`,
      `${pname}で開催中・これから開かれるイベントを${evs.length}件まとめました${kidN ? `（子どもと行ける催し${kidN}件）` : ''}。日程、時間、料金、最寄り駅がひと目でわかります。`,
      evs, pname, `${pname}で開かれる催しを${evs.length}件のせています。日程の変更や中止は、各催しの公式ページで確かめてください。`);
  }

  // 区・エリア × 子ども（「江戸川区 子ども イベント」向け）。子ども向けが2件以上あるところだけ。
  for (const [slug, aname, sts] of LIVE_AREAS) {
    const evs = CURRENT.filter(e => sts.includes(e.st) && e.kid);
    if (evs.length < 2) continue;
    const nm = (aname.match(/^(.+?区)（/) || [])[1] || aname;
    listPage(`/area/${slug}/kids/`, `${nm}の子どもと行けるイベント`, `${nm}の子どもと行けるイベント｜親子で楽しめる催し（対象年齢つき）｜${NAME}`,
      `${nm}で子どもと一緒に行ける催しを${evs.length}件まとめました。対象年齢は主催者の公式ページの記載どおりで、日程、時間、料金、最寄り駅がひと目でわかります。`,
      evs, `${nm}・子どもと`, `${nm}で、主催者が子ども向け・親子向けと書いている催しを${evs.length}件のせています。対象年齢は各催しのページで確かめてください。`);
  }

  // 区・エリア × 条件（「渋谷 無料 イベント」「上野 雨の日」「吉祥寺 犬連れ」向け）。3件以上あるところだけ。
  const AREA_COND = [
    ['free', '無料で行ける', e => e.free, '入場無料の催し', '無料'],
    ['weekend', '今週末に行ける', e => WKD.some(d => e.s <= d && d <= e.e && !(e.off || []).includes(d)), '今週末（' + WKD.map(md).join('・') + '）に開いている催し', '今週末'],
    ['rainy', '雨の日でも行ける', e => (e.g === 'art' || e.indoor) && !e.outdoor, '美術展と屋内の催し', '雨の日'],
    ['dog', '愛犬と行ける', e => e.dog, '公式ページでペット同伴可と書かれている催し', '愛犬と'],
  ];
  // 条件を満たさなくなった自動ページは消せない（サーバーはファイルを消さない）ので、検索に出さない案内ページで上書きする。サイトマップにも入れない。
  const stubPage = (path, h1, toPath, toName) => { OUT[path.replace(/^\//, '') + 'index.html'] = head(`${h1}｜${NAME}`, `${h1}。`, path, [], true) + sign(null, path) + `  <main class="page"><div class="body"><h1 class="pt">${esc(h1)}</h1><p>いまはこのページに載せる催しが少ないため、<a href="${toPath}">${esc(toName)}</a>にまとめています。</p></div></main>\n` + ways() + foot(); };
  const AREA_COND_PAGES = [];
  for (const [slug, aname, sts] of LIVE_AREAS) {
    const nm = (aname.match(/^(.+?区)（/) || [])[1] || aname;
    for (const [cs, cn, test, what, short] of AREA_COND) {
      const evs = CURRENT.filter(e => sts.includes(e.st) && test(e));
      // 中身の薄いページを量産しない（Google の「入口だけのページ」対策）。5件以上で、エリアのページとほぼ同じにならないときだけ。
      if (evs.length < 5 || evs.length >= CURRENT.filter(e => sts.includes(e.st)).length * 0.9) { if (evs.length >= 3) stubPage(`/area/${slug}/${cs}/`, `${nm}で${cn}イベント`, `/area/${slug}/`, `${nm}のイベント`); continue; }
      AREA_COND_PAGES.push([`/area/${slug}/${cs}/`, `${nm}・${short}`]);
      listPage(`/area/${slug}/${cs}/`, `${nm}で${cn}イベント`, `${nm}で${cn}イベント｜${short}の催し一覧（${evs.length}件）｜${NAME}`,
        `${nm}（${sts.slice(0, 4).join('・')}駅の近く）で${cn}イベントを${evs.length}件まとめました。日程、時間、料金、最寄り駅がひと目でわかります。`,
        evs, `${nm}・${short}`, `${nm}の${what}を${evs.length}件のせています。終わりが近い順です。`);
    }
  }
  const areaMore = (slug, used) => { const l = AREA_COND_PAGES.filter(([p]) => p.startsWith(`/area/${slug}/`)).map(([p, n]) => `<a href="${p}">${esc(n)}</a>`).concat(used.filter(stPage).map(st => `<a href="${stPage(st)}">${esc(st)}駅</a>`)); return l.length ? `  <nav class="ways"><p class="cap">しぼって探す：</p>${l.join('')}</nav>\n` : ''; };
  // 駅ごとのページ（「〇〇駅 イベント 今日」向け）。その駅が最寄りの催しが3件以上ある駅だけ。
  const STATION_PAGES = [];
  {
    const seen = new Set();
    const sts = [...new Set(CURRENT.map(e => e.st))].sort();
    for (const st of sts) {
      const sl = stSlug(st);
      if (!sl || seen.has(sl)) continue;
      const evs = CURRENT.filter(e => e.st === st);
      // 5件以上、かつそのエリアのページとほぼ同じにならない駅だけ。
      const ar = AREAS.find(([, , ss]) => ss.includes(st));
      if (evs.length < 5 || (ar && evs.length >= CURRENT.filter(e => ar[2].includes(e.st)).length * 0.9)) { if (evs.length >= 3) stubPage(`/station/${sl}/`, `${st}駅の近くのイベント`, ar ? `/area/${ar[0]}/` : '/', ar ? `${ar[1]}のイベント` : 'トップページ'); continue; }
      seen.add(sl);
      STATION_PAGES.push([`/station/${sl}/`, `${st}駅`]);
      const near = CURRENT.filter(e => e.st !== st && SPOTS[st] && km(SPOTS[st][0], SPOTS[st][1], e.lat, e.lng) <= 1).length;
      listPage(`/station/${sl}/`, `${st}駅の近くのイベント`, `${st}駅の近くのイベント（今日・今週末）｜駅から行ける催し一覧｜${NAME}`,
        `${st}駅が最寄りのイベントを${evs.length}件まとめました。美術展、ライブ、マーケット、祭りなどの日程、時間、料金がひと目でわかります。`,
        evs, `${st}駅`, `最寄り駅が${st}駅の催しを${evs.length}件のせています${near ? `（ほかに、駅から1km以内の催しが${near}件あります。トップページで${st}を出発駅に選ぶと近い順に出ます）` : ''}。`);
    }
  }

  for (const [slug, aname, sts] of LIVE_AREAS) {
    const evs = CURRENT.filter(e => sts.includes(e.st));
    const cnt = GKEYS.map(g => [g, evs.filter(e => e.g === g).length]).filter(([, n]) => n);
    const kinds = cnt.length > 3 ? 'イベント' : cnt.map(([g]) => SHORT[g]).join('・');
    const used = sts.filter(s => evs.some(e => e.st === s));
    // 区のエリアは「◯◯区 イベント」で探されるので、区の名前を先に出す。子ども向けの件数も書く。
    const ward = (aname.match(/^(.+?区)（/) || [])[1];
    const kidN = evs.filter(e => e.kid).length;
    if (ward) listPage(`/area/${slug}/`, `${ward}のイベント`, `${ward}のイベント情報｜開催中・今週末・子どもと行ける催し｜${NAME}`,
      `${ward}（${used.join('・')}駅の近く）で開催中・今週開かれるイベントを${evs.length}件まとめました${kidN ? `（子どもと行ける催し${kidN}件）` : ''}。区民まつり、マルシェ、博物館、コンサートなど、会期、時間、料金がひと目でわかります。`,
      evs, ward, `最寄り駅が${used.map(s => s + '駅').join('・')}の催しを${evs.length}件のせています（${cnt.map(([g, n]) => GENRES[g].n + n + '件').join('、')}${kidN ? `、うち子ども向け${kidN}件` : ''}）。`, [], areaMore(slug, used));
    else listPage(`/area/${slug}/`, `${aname}の${kinds}`, `${aname}の${kinds}｜開催中・今週の催し一覧｜${NAME}`,
      `${aname}エリアで開催中・今週開かれる${kinds}を${evs.length}件まとめました。最寄り駅は${used.join('・')}。会期、時間、料金がひと目でわかります。`,
      evs, aname, `最寄り駅が${used.map(s => s + '駅').join('・')}の催しを${evs.length}件のせています（${cnt.map(([g, n]) => GENRES[g].n + n + '件').join('、')}）。`, [], areaMore(slug, used));
  }

  // 今週末: 次の土曜と日曜。月曜が祝日ならそこまで。
  let wk, wkEvs;
  {
    const t = dnum(TODAY), sat = t + ((6 - dow(TODAY)) % 7 + 7) % 7;
    wk = [isoOf(sat), isoOf(sat + 1)];
    if (isoOf(sat + 2) in HOLIDAYS) wk.push(isoOf(sat + 2));
    const evs = wkEvs = EV.filter(e => wk.some(x => activeOn(e, x)));
    const rng = `${md(wk[0])}〜${md(wk[wk.length - 1])}`;
    const [cr, crLd] = crumbs([['トップ', '/'], ['今週末', null]]);
    let byDay = '';
    for (const x of wk) {
      const es = evs.filter(e => activeOn(e, x)).map(e => [(oneDay(e) || e.g === 'live') ? 0 : 1, mins(openOn(e, x)), e]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(p => p[2]);
      const lis = es.map(e => `<li><a href="/event/${e.id}/">${esc(e.t)}</a><span>${esc(e.v)}（${esc(e.st)}駅）・${openOn(e, x)}${e.g === 'live' ? ' 開演' : '〜' + closeOn(e, x)}・${esc(e.price)}</span></li>`).join('');
      byDay += `<h2>${md(x)}に行ける催し（${es.length}件）</h2><ul class="near">${lis}</ul>`;
    }
    const body = `${cr}  <h1 class="pt">今週末 ${rng}に東京で行ける催し</h1>
  <p class="intro">${rng}に東京で開かれている美術展・ライブ・フードイベント・マーケット・祭りを${evs.length}件のせています。その日だけの公演を先に、会期の長い催しをあとにならべています。</p>
  <p class="over" data-until="${wk[wk.length - 1]}" hidden>この週末は終わりました。いまの催しは<a href="/">トップページ</a>でさがせます。</p>
  <main class="page"><div class="body">${byDay}</div></main>
  <p class="upd">${ymd(TODAY)}時点の掲載分です。</p>
`;
    write('/weekend/', head(`今週末 ${rng} 東京のイベント｜美術展・ライブ・フード・祭り｜${NAME}`, `${rng}の週末に東京で行ける美術展・ライブ・フードイベント・マーケット・祭りを${evs.length}件、日ごとにまとめました。時間、料金、最寄り駅がわかります。`, '/weekend/', [itemList(evs), crLd]) + sign('/weekend/', '/weekend/') + body + ways('/weekend/') + foot());
  }

  // ── トップ ──
  {
    const cnt = GKEYS.map(g => [g, CURRENT.filter(e => e.g === g).length]).filter(([, n]) => n);
    const title = `${NAME}｜東京のイベントをまとめて、きょう・近くで探す｜美術展・ライブ・フード・マーケット・祭り`;
    const desc = `東京の美術展・ライブ・フードイベント・マーケット・祭りを、公式サイトをまわらずにまとめて見られます。行く日と出発する駅から近い順に探せて、無料や夜までの催しにもしぼれます。いま${CURRENT.length}件を掲載中。`;
    const siteLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: NAME, alternateName: 'KYO-CHIKA TOKYO', url: BASE + '/', inLanguage: 'ja', description: desc, sameAs: ['https://www.instagram.com/kyochika.tokyo/'] };
    const body = `  <details class="fold"><summary>日付・駅・ジャンル・エリアでしぼる</summary>
    <nav class="areas" aria-label="エリアからさがす"><span class="lab">エリアから（えらぶと下の一覧がそのエリアだけになります）</span><div class="chips scroll"><button class="chip reset" type="button" data-act="area" data-k="" aria-pressed="true">すべてのエリア</button>${LIVE_AREAS.map(([sl, n]) => `<button class="chip" type="button" data-act="area" data-k="${sl}" aria-pressed="false">${esc(n)}</button>`).join('')}</div><script>const AREAS_UI=${JSON.stringify(Object.fromEntries(LIVE_AREAS.map(([sl, , sts]) => [sl, sts])))};</script></nav>
  <section class="ctl" aria-label="さがす条件">
    <div><span class="lab">どこから？（近い順にならべます）</span><div class="chips scroll" id="from"></div></div>
    <div><span class="lab">いつ行く？</span><div class="days" id="days"></div><label class="other">ほかの日 <input type="date" id="otherDay"></label></div>
    <div><span class="lab">ジャンル</span><div class="chips" id="genres"></div></div>
    <div><span class="lab">しぼりこみ</span><div class="chips" id="filters"></div></div>
  </section></details>
<!--ctlend-->
  <div class="board" id="board" aria-live="polite"><span>掲載中の催し</span><b>${CURRENT.length}件</b></div>
  <ul class="list" id="list">${order(CURRENT).map((e, i) => card(e, i < 2, i)).join('')}</ul>

  <section class="join" id="join" hidden>
    <h2>催しをのせたい主催者の方へ</h2>
    <p>インスタグラムなどで告知している催しを、無料で掲載します。内容を確認してからのせます。</p>
    <a class="go" id="joinLink" href="#" target="_blank" rel="noopener">登録フォームをひらく</a>
  </section>

  <ul class="intro dots"><li>${NAME}は、東京の美術展・ライブ・フードイベント・マーケット・祭りなどの情報を、会場や主催者の公式サイトやインスタグラムから集めて1か所にまとめ、行く日と出発する駅から近い順にならべるサイトです。いまは${cnt.map(([g, n]) => GENRES[g].n + n + '件').join('、')}をのせています（${ymd(TODAY)}更新）。</li><li>スマホの<a href="/app/">ホーム画面に追加</a>すると、アプリのように使えます。</li></ul>
`;
    const LT = {art:'A',live:'L',food:'F',market:'M',festival:'S',popup:'P'};
    const lines = cnt.map(([g, n]) => `<a href="/${GENRE_PAGES[g][0]}/" style="--c:var(--${g})"><i>${LT[g]}</i>${SHORT[g]}<b>${n}</b></a>`).join('');
    // 子どもと：押すと年齢をえらんで、下の一覧をしぼりこむ（app.js の kidopen / kidage）
    const nKid = CURRENT.filter(e => e.kid).length;
    const nIg = CURRENT.filter(e => e.ig).length;
    const nDog = CURRENT.filter(e => e.dog).length;
    const kidLine = nKid ? `<button type="button" class="kidline" data-act="kidopen" aria-expanded="false" aria-controls="kidAges" style="--c:var(--kid)"><i>K</i>子どもと<b>${nKid}</b></button><div class="kidages" id="kidAges" hidden><span>何歳の子と行く？</span><button type="button" class="chip" data-act="kidage" data-k="kA" aria-pressed="false">0〜2歳</button><button type="button" class="chip" data-act="kidage" data-k="kB" aria-pressed="false">3〜6歳</button><button type="button" class="chip" data-act="kidage" data-k="kC" aria-pressed="false">小学生</button><button type="button" class="chip" data-act="kidage" data-k="all" aria-pressed="false">年齢を問わず</button><p class="kidnote" id="kidNote" hidden></p><a href="/kids/">子どもと行ける催しの一覧 →</a></div>` : '';
    const nv = new Set(CURRENT.map(e => e.v)).size;
    // きょう行ける：今日開いている催しを、ジャンルがばらけるように最大8件。会場の写真かシェア用画像があるものだけ。
    const todayRail = (() => {
      const ok = CURRENT.filter(e => activeOn(e, TODAY) && (e.fl || e.ph || ogUrl(e)));
      const seen = new Set(), pick = [];
      const order0 = ['market', 'food', 'art', 'festival', 'popup', 'live'];
      for (let r = 0; r < 3 && pick.length < 8; r++) for (const g of order0) { const e = ok.filter(x => x.g === g && !seen.has(x.id)).sort((a, b) => (b.free - a.free) || (a.e < b.e ? -1 : 1))[0]; if (e && pick.length < 8) { seen.add(e.id); pick.push(e); } }
      if (pick.length < 3) return '';
      const img = e => e.fl ? `/fl/${e.id}.jpg` : e.ph ? `/photos/${e.ph}.jpg` : `/og/${e.id}.jpg?v=${OGDONE[e.id]}`;
      return `    <section class="today" aria-labelledby="todayH"><h2 id="todayH">きょう行ける <a href="/today/">もっと見る →</a></h2><div class="rail">${pick.map((e, k) => `<a class="tcard" style="--c:var(--${e.g})" href="/event/${e.id}/"><img src="${img(e)}" alt="" width="1200" height="630" loading="${k < 2 ? 'eager' : 'lazy'}"><div><span class="tag">${SHORT[e.g]}${e.free ? '・無料' : ''}</span><b>${esc(e.t)}</b><small>${esc(e.st)}駅・${esc(e.o)}${e.g === 'live' ? '開演' : '〜' + esc(e.c)}</small></div></a>`).join('')}</div></section>\n`;
    })();
    const hero = `  <section class="hero">
    <h1>きょう、東京でどこ行く？</h1>
    <div class="pl-hang" aria-hidden="true"><img class="pl-bird" src="/photos/chara/pochika.png?v=${VER}" alt="" width="58" height="53"></div>
    <div class="plate eki" aria-label="行く日">
      <div class="pl-top"><span class="pl-no">KC<b id="plNo">${Number(TODAY.slice(8))}</b></span><span class="pl-ward"><i>東</i><i>京</i></span></div>
      <p class="pl-hira" id="plHira">きょう</p>
      <p class="pl-big" id="plBig">今日</p>
      <p class="pl-kr"><span id="plRoma">Kyo</span></p>
      <p class="pl-sub" id="plSub"></p>
      <div class="pl-band"><button type="button" id="plPrev" data-act="dstep" aria-label="前の日"><span id="plPrevT"></span></button><button type="button" id="plNext" data-act="dstep" aria-label="次の日"><span id="plNextT">あした</span></button></div>
      <div class="pl-romas"><span id="plPrevR"></span><span id="plNextR">Ashita</span></div>
    </div>
${ACTIVE_FEATURES.length ? `    <section class="featrail" aria-labelledby="featH"><h2 id="featH">特集</h2>${ACTIVE_FEATURES.map(F => `<a href="/feature/${F.slug}/" onclick="window.gtag&&gtag('event','feature_in',{feature:'${F.slug}',from:'top'})"><img src="${F.img[0]}" alt="" width="${F.img[1]}" height="${F.img[2]}"><div><b>${esc(F.crumb)}</b><span>${esc(F.facts[0][1])}</span></div></a>`).join('')}</section>\n` : ''}${todayRail}    <nav class="lines" aria-label="ジャンル">${lines}${kidLine}${nDog ? `<a href="/dog/" style="--c:#a0662d" onclick="window.gtag&&gtag('event','dog_line',{from:'top'})"><i>D</i>愛犬と<b>${nDog}</b></a>` : ''}${nIg ? `<a href="/instagram/" style="--c:#c13584"><i>I</i>インスタだけの告知<b>${nIg}</b></a>` : ''}</nav>
  </section>
`;
    const dramaBan = `  <a class="dban" href="/drama/" style="display:flex;align-items:center;gap:12px;border:2px solid var(--ink);border-radius:4px;padding:8px 14px;margin:12px 0;text-decoration:none;color:inherit;background:#fff8cc"><img src="/photos/chara/pochika.png?v=${VER}" alt="" width="56" style="flex:none;height:auto"><span><b>連続アニメ『東京、あと80日』</b><br><small>ミカは東京に残る？ 帰る？ 登場人物とあらすじ →</small></span></a>
`;
    const pochi = `  <section class="pochi" id="pochi" aria-labelledby="pochiH">
    <div class="pc-head"><img src="/photos/chara/pochika.png?v=${VER}" alt="ポチカ" width="72" height="72" id="pochiImg"><p class="pc-say"><b id="pochiH">ボクのおすすめ、きょうの3つ</b><small id="pochiSub">駅に住む案内役ポチカが、えらんだよ</small></p></div>
    <ol class="pc-list" id="pochiList"></ol>
    <div class="pc-pick"><button type="button" class="pc-btn" data-act="pick" id="pickBtn">迷ったら、ポチカに決めてもらう</button><div id="pickOut" aria-live="polite"></div></div>
    <a class="pc-ig" href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">ポチカとミカのアニメは、インスタで3日おきに更新中 → @kyochika.tokyo</a>
  </section>
`;
    write('/', head(title, desc, '/', [siteLd, itemList(order(CURRENT))]) + sign(null, '/') + hero + body.split('<!--ctlend-->')[0] + pochi + dramaBan + body.split('<!--ctlend-->')[1] + ways() + foot(['config.js', 'data.js', 'app.js']));
  }

  // ── 連続アニメ『東京、あと80日』とキャラクター ──
  {
    const [cr, crLd] = crumbs([['トップ', '/'], ['連続アニメ『東京、あと80日』', null]]);
    const left = Math.max(0, dnum('2026-12-31') - dnum(TODAY));
    const IG = 'https://www.instagram.com/kyochika.tokyo/';
    const C = [
      ['mika', 'ミカ', '28歳・会社員', '半年前に地方から東京へ転職。仕事ばかりで、東京を「疲れる街」だと思っている。年末に地元へ帰るか迷っている。', '黄色のヘアピン2本、左目の下の泣きぼくろ、紺のカーディガン', '「……まあ、悪くないかも」'],
      ['yuto', 'ユウト', '29歳・ミカの同僚', '東京生まれなのに、東京をよく知らない。ミカが気になっている。デート先はこっそりキョウチカで探している（「俺、東京詳しいから」と見栄）。', '気持ちで動くアホ毛（嬉しいとハート、落ち込むとしおれる）、青いパーカー', '「任せとけって」'],
      ['pochika', 'ポチカ', '駅に住む黄色いハト', 'ユウトにだけ見える、キョウチカの案内役。東京のことなら何でも知っている。', '頭に赤い駅ランプ、おなかに「チカ」', '「東京なら、ボクに任せるっポ！」'],
      ['take', 'タケル', '29歳・ユウトの同期', '東京の遊び人。ユウトの見栄をいつも見抜いている。', '頭にサングラス、緑の上着', ''],
      ['saki', 'サキ', '28歳・ミカの地元の幼なじみ', '「帰ってきなよ」派。ミカの一番の味方。', 'ポニーテールに赤いマフラー', ''],
      ['mama', 'ミカの母', '56歳', '電話の向こうから「年末で東京は終わりにして、帰ってきなさい」。', '丸メガネとお団子', ''],
    ];
    const cards = C.map(([id, n, a, d, m, q]) => `<li class="ch"><img src="/photos/chara/${id}.png?v=${VER}" alt="${esc(n)}のイラスト" width="180" height="180" loading="lazy"><div><h3>${esc(n)}<small>${esc(a)}</small></h3><p>${esc(d)}</p><p class="cm">目印：${esc(m)}</p>${q ? `<p class="cq">${esc(q)}</p>` : ''}</div></li>`).join('');
    const EPS = [['#1', 'プロローグ', '10/11'], ['#2', '帰るの？', '10/12'], ['#3', '雨の美術館', '10/15'], ['#4', '給料日前', '10/18'], ['#5', 'バレる', '10/21']];
    const main = `  <style>
.drama .key{display:flex;gap:16px;align-items:flex-end;flex-wrap:wrap;margin:8px 0 4px}
.drama .key img{width:118px;height:auto}
.drama .left{display:inline-block;background:#ffd400;color:#111;font-weight:700;padding:6px 14px;border-radius:4px;font-size:18px}
.drama .chs{list-style:none;padding:0;margin:0;display:grid;gap:14px}
.drama .ch{display:flex;gap:14px;align-items:flex-start;border-top:1px solid #ddd;padding-top:14px}
.drama .ch img{width:120px;height:auto;flex:none}
.drama .ch h3{margin:0 0 4px;font-size:19px}.drama .ch small{font-size:13px;font-weight:400;margin-left:8px;color:#555}
.drama .ch p{margin:0 0 4px}.drama .cm{font-size:13px;color:#555}.drama .cq{font-weight:700}
.drama .eps{list-style:none;padding:0;margin:0}.drama .eps li{display:flex;gap:10px;padding:6px 0;border-bottom:1px solid #eee}.drama .eps span{margin-left:auto;color:#555;font-size:13px}
@media(max-width:480px){.drama .ch img{width:88px}.drama .key img{width:84px}}
</style>
  <main class="doc drama">
    <h1 class="pt">連続アニメ『東京、あと80日』</h1>
    <div class="key"><img src="/photos/chara/mika.png?v=${VER}" alt="ミカ"><img src="/photos/chara/pochika.png?v=${VER}" alt="ポチカ"><img src="/photos/chara/yuto.png?v=${VER}" alt="ユウト"></div>
    <p class="lead">東京に疲れたミカは、年末に地元へ帰るか迷っている。同僚のユウトは、ミカに東京を好きになってほしくて、毎回こっそりキョウチカで行き先を探す――。</p>
    <p><span class="left">大みそかに答えが出るまで あと${left}日</span></p>
    <p>インスタグラム <a href="${IG}" target="_blank" rel="noopener">@kyochika.tokyo</a> で3日おきに更新しています。毎話、その週に東京で本当にやっている催しに出かけます。ミカは東京に残る？ 帰る？ 予想はコメントで。</p>
    <p><a class="go pri" href="${IG}" target="_blank" rel="noopener">インスタで見る・フォローする</a></p>
    <h2>登場人物</h2>
    <ul class="chs">${cards}</ul>
    <h2>放送予定</h2>
    <ul class="eps">${EPS.map(([n, t, d]) => `<li><b>${n}</b>${esc(t)}<span>${d}</span></li>`).join('')}</ul>
    <p class="cap">登場人物とお話はフィクションです。出かける先の催しは、キョウチカに載っている実在の催しです。</p>
    <h2>ふたりが使っている「キョウチカ」</h2>
    <p>行く日と出発する駅を選ぶと、東京の美術展・ライブ・マーケット・祭りを近い順にならべます。<a href="/">さっそく、きょう行けるところをさがす</a></p>
  </main>
`;
    write('/drama/', head(`連続アニメ『東京、あと80日』登場人物・あらすじ｜${NAME}`, `東京に疲れたミカは年末に帰る？ 残る？ 同僚ユウトと駅のハト・ポチカが東京の催しへ連れ出す連続アニメ。登場人物、あらすじ、放送予定。インスタ@kyochika.tokyoで3日おきに更新。`, '/drama/', [crLd]) + sign(null, '/drama/') + cr + main + ways() + foot([]));
  }

  // ── このサイトについて ──
  {
    const [cr, crLd] = crumbs([['トップ', '/'], ['このサイトについて', null]]);
    write('/about.html', head(`このサイトについて・運営者情報｜${NAME}`, `${NAME}の運営者情報、掲載している情報の扱い、プライバシー、写真の出典です。`, '/about.html', [crLd]) + sign(null, '/about.html') + cr + aboutMain + foot([]));
  }

  // ── アプリのように使う（ホーム画面に追加する手順） ──
  {
    const [cr, crLd] = crumbs([['トップ', '/'], ['アプリのように使う', null]]);
    const main = `  <main class="doc">
    <h1 class="pt">${NAME}を<br>アプリのように使う</h1>
    <p>ホーム画面に追加すると、アイコンを押すだけで開けて、アドレスバーのない全画面で見られます。アプリストアからのインストールや会員登録は要りません。無料です。</p>
    <p><button class="go pri" id="inst" type="button" hidden>この端末に追加する</button></p>
    <h2>iPhone・iPad</h2>
    <ol>
      <li>Safari で kyochika.jp をひらく</li>
      <li>画面の下（iPad は上）にある共有ボタン（四角から矢印が上に出ている形）を押す</li>
      <li>出てきた一覧を上に送って「ホーム画面に追加」をえらぶ</li>
      <li>右上の「追加」を押す</li>
    </ol>
    <p class="cap">Chrome を使っているときも、共有ボタンから同じように追加できます。</p>
    <h2>Android</h2>
    <ol>
      <li>Chrome で kyochika.jp をひらく</li>
      <li>右上の「︙」を押す</li>
      <li>「ホーム画面に追加」または「アプリをインストール」をえらぶ</li>
      <li>「追加」または「インストール」を押す</li>
    </ol>
    <h2>パソコン（Chrome・Edge）</h2>
    <ol>
      <li>kyochika.jp をひらく</li>
      <li>アドレスバーの右はしに出るインストールのボタンを押す</li>
    </ol>
    <h2>追加したあと</h2>
    <p>ホーム画面に黒い「キ」のアイコンができます。出発する駅は一度えらぶと次からも覚えています。催しの情報は、ひらくたびに新しいものを読みこみます。</p>
    <h2>やめるとき</h2>
    <p>アイコンを長押しして「削除」をえらぶだけです。ほかに消すものはありません。</p>
  </main>
`;
    write('/app/', head(`アプリのように使う｜ホーム画面に追加する方法｜${NAME}`, `${NAME}をスマホのホーム画面に追加して、アプリのように使う方法です。iPhone、Android、パソコンでの手順をのせています。インストールや会員登録は要りません。`, '/app/', [crLd]) + sign(null, '/app/') + cr + main + ways() + foot());
  }

  // ── 見つからないとき ──
  {
    const nf = `  <main class="doc"><h1 class="pt">ページが見つかりません</h1><p>終わった催しのページか、アドレスのまちがいかもしれません。</p><p><a class="go" href="/">催しをさがす</a></p></main>
`;
    write('/404.html', head(`ページが見つかりません｜${NAME}`, 'お探しのページは見つかりませんでした。', '/404.html', [], true) + sign(null, '/404.html') + nf + ways() + foot([]));
  }

  // ── 検索エンジン向け ──
  const prio = p => p === '/' ? '1.0' : ((p.split('/').length - 1) <= 3 && !p.startsWith('/event/')) ? '0.8' : '0.6';
  OUT['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + PAGES.filter(p => { if (p === '/plan/') return false; const m = p.match(/^\/event\/([^/]+)\/$/); if (!m) return true; const e = EV.find(x => x.id === m[1]); return !e || dnum(TODAY) - dnum(e.e) <= 30; }).map(p => `  <url><loc>${url(p)}</loc><lastmod>${TODAY}</lastmod><priority>${prio(p)}</priority></url>\n`).join('') + '</urlset>\n';
  OUT['manifest.json'] = JSON.stringify({ name: NAME + '｜東京のイベントをまとめて探す', short_name: NAME, start_url: '/', scope: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#ffffff', lang: 'ja', icons: [{ src: '/icon-192.png?v=' + VER, sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png?v=' + VER, sizes: '512x512', type: 'image/png' }, { src: '/icon-512.png?v=' + VER, sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 1) + '\n';
  OUT['llms.txt'] = `# ${NAME}（kyochika.jp）\n\n> 東京の美術展・ライブ・フードイベント・マーケット・祭り・ポップアップ・子ども向けの催しを、会場や主催者の公式情報から毎日集めてまとめ、行く日と駅から近い順に探せるサイト。日本語・英語・中国語。${TODAY}更新、掲載${CURRENT.length}件。日付・時間・料金・対象年齢は公式ページで確かめたものだけを載せています。\n\n## よく使うページ\n- 今日・行く日と駅から探す: ${BASE}/\n- 今週末: ${BASE}/weekend/\n- 無料で行ける: ${BASE}/free/\n- 日付から: ${BASE}/date/\n${KIDP.map(([p, h]) => `- ${h}: ${BASE}${p}`).join('\n')}\n\n## ジャンル\n${Object.values(GENRE_PAGES).map(([sl, n]) => `- ${n}: ${BASE}/${sl}/`).join('\n')}\n\n## エリア・区\n${LIVE_AREAS.map(([sl, n]) => `- ${n}: ${BASE}/area/${sl}/`).join('\n')}\n\n## 場所\n${PLACES_LIVE.map(([sl, n]) => `- ${n}: ${BASE}/place/${sl}/`).join('\n')}\n\n## English / 中文\n- ${BASE}/en/\n- ${BASE}/zh/\n`;
  OUT['llms.txt'] += `\n## 条件から探す\n` + COND_PAGES.filter(c => CURRENT.filter(c[4]).length >= 3).map(c => `- [${c[1]}](${BASE}${c[0]})`).join('\n') + '\n';
  // 今週末のおすすめ10（/pick/<土曜>/）。毎回の書き出しで、その週末の分を作りなおす。選び方はページに書く（無料・まもなく終わる・子どもと・インスタだけの告知などを点にして、ジャンルとエリアがばらけるように）。
  if (pickEvs.length >= 6) {
    const why = e => [e.free ? '入場無料' : '', (oneDay(e) || dnum(e.e) - dnum(e.s) <= 3) ? 'この週末だけ' : (dnum(e.e) - dnum(WKD[1]) <= 7 ? `${md(e.e)}まで` : ''), e.kid ? (e.kidnote || '子どもと行ける') : '', e.ig ? 'インスタだけの告知' : '', e.dog ? '愛犬OK' : '', lateNight(e) ? '夜9時まで' : ''].filter(x => x).slice(0, 3).join('・');
    const items = pickEvs.map((e, i) => `  <article class="pick"><h2>${i + 1}. <a href="/event/${e.id}/">${esc(e.t)}</a></h2>${OGDONE[e.id] ? `<a href="/event/${e.id}/"><img src="/og/${e.id}.jpg?v=${OGDONE[e.id]}" width="1200" height="630" alt="${esc(e.t)}" loading="${i < 2 ? 'eager' : 'lazy'}"></a>` : ''}<p class="why">${esc(why(e) || GENRES[e.g].n)}</p><p>${esc(span(e))}　${esc(e.o)}${e.g === 'live' ? '開演' : '〜' + esc(e.c)}<br>${esc(e.v)}（${esc(e.st)}駅）・${esc(e.free ? '無料' : e.price)}</p>${e.note ? `<p>${esc(e.note)}</p>` : ''}</article>`).join('\n');
    const h1 = `今週末（${WKD.map(md).join('・')}）、東京でどこ行く？おすすめ${pickEvs.length}選`;
    const body = `${crumbs([['トップ', '/'], ['今週末', '/weekend/'], [`おすすめ${pickEvs.length}選`, null]])[0]}  <main class="page"><div class="body">
  <h1 class="pt">${esc(h1)}</h1>
  <p class="intro">今週末に東京で開いている${CURRENT.filter(e => WKD.some(d => e.s <= d && d <= e.e && !(e.off || []).includes(d))).length}件の催しから、無料のもの、まもなく終わるもの、この週末だけのもの、子どもと行けるもの、インスタだけで告知されたものを選び、ジャンルとエリアがばらけるように${pickEvs.length}件にしました（${ymd(TODAY)}時点）。</p>
${items}
  <div class="row share"><a class="go line" href="https://social-plugins.line.me/lineit/share?url=${quote(url(PICK_PATH))}" target="_blank" rel="noopener" onclick="window.gtag&&gtag('event','share',{method:'line',page:'pick'})">この記事をLINEで送る</a><a class="go" href="/weekend/">今週末の催しを全部見る</a></div>
  ${igFollow('pick')}
  <p class="cap">日程・時間・料金は会場や主催者の公式ページで確かめたものです。出かける前に、各催しの公式ページで最新の情報を確かめてください。</p>
  </div></main>
`;
    write(PICK_PATH, head(`${h1}｜${NAME}`, `今週末（${WKD.map(md).join('・')}）に東京で行けるイベントのおすすめ${pickEvs.length}選。${pickEvs.slice(0, 3).map(e => e.t).join('、')}など、無料・まもなく終わる・この週末だけの催しを選びました。`, PICK_PATH, [{ '@context': 'https://schema.org', '@type': 'Article', headline: h1, datePublished: `${TODAY}T05:00:00+09:00`, dateModified: `${TODAY}T05:00:00+09:00`, image: pickEvs.filter(e => OGDONE[e.id]).slice(0, 3).map(e => `${BASE}/og/${e.id}.jpg`), author: { '@type': 'Organization', name: NAME, url: BASE }, publisher: { '@type': 'Organization', name: NAME, url: BASE } }], false, OGDONE[pickEvs[0].id] ? `${BASE}/og/${pickEvs[0].id}.jpg?v=${OGDONE[pickEvs[0].id]}` : null) + sign(null, PICK_PATH) + body + ways() + foot());
  }
  // 数字で見る東京のイベント（/stats/）。毎回の書き出しで自動で作りなおす。メディアやブログに引用してもらうためのページ。
  {
    const N = CURRENT.length, pc = x => N ? Math.round(x / N * 100) : 0;
    const GN = { art: '美術展・アート', live: 'ライブ・音楽', food: 'フード・グルメ', market: 'マーケット・蚤の市', festival: '祭り・地域の催し', popup: 'ポップアップ' };
    const byG = GKEYS.map(g => [GN[g], CURRENT.filter(e => e.g === g).length]).sort((a, b) => b[1] - a[1]);
    const free = CURRENT.filter(e => e.free).length, kid = CURRENT.filter(e => e.kid).length, dog = CURRENT.filter(e => e.dog).length, bf = CURRENT.filter(e => e.bf).length, ig = CURRENT.filter(e => e.ig).length;
    const artP = CURRENT.filter(e => e.g === 'art' && !e.free).map(e => priceMax(e.price)).filter(x => x < 99999).sort((a, b) => a - b);
    const med = artP.length ? artP[Math.floor(artP.length / 2)] : 0;
    const wk = CURRENT.filter(e => WKD.some(d => e.s <= d && d <= e.e && !(e.off || []).includes(d))).length;
    const ar = LIVE_AREAS.map(([sl, n, sts]) => [n, CURRENT.filter(e => sts.includes(e.st)).length, sl]).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const ym = TODAY.slice(0, 7).split('-'), when = `${ym[0]}年${Number(ym[1])}月`;
    const rows = (a) => a.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(String(v))}</td></tr>`).join('');
    const body = `${crumbs([['トップ', '/'], ['数字で見る東京のイベント', null]])[0]}  <main class="page"><div class="body">
  <h1 class="pt">数字で見る東京のイベント（${when}）</h1>
  <p class="intro">キョウチカに載っている、東京で開催中・これから開かれる催し${N}件を数えました（${ymd(TODAY)}時点）。催しは会場や主催者の公式ページで確かめたものだけです。引用するときは「キョウチカ調べ」とこのページへのリンクを付けてください。</p>
  <h2>ひと目で</h2>
  <table class="stats">${rows([['開催中・これからの催し', N + '件'], ['入場無料', `${free}件（${pc(free)}%）`], ['子どもと行ける（対象年齢つき）', `${kid}件（${pc(kid)}%）`], ['愛犬と行ける（公式にペット同伴可）', `${dog}件`], ['車椅子で行ける（公式にバリアフリーの案内）', `${bf}件`], ['インスタだけで告知された催し', `${ig}件`], [`今週末（${WKD.map(md).join('・')}）に開いている`, `${wk}件`], ['有料の美術展の入場料（一般・中央値）', med ? `${med.toLocaleString()}円` : '—']])}</table>
  <h2>ジャンル別</h2>
  <table class="stats">${rows(byG.map(([n, v]) => [n, `${v}件（${pc(v)}%）`]))}</table>
  <h2>催しの多いエリア</h2>
  <table class="stats">${ar.map(([n, v, sl]) => `<tr><th><a href="/area/${sl}/">${esc(n)}</a></th><td>${v}件</td></tr>`).join('')}</table>
  <h2>月ごと</h2>
  <table class="stats">${JMONTHS.map(([k, , m, evs]) => `<tr><th><a href="/month/${k}/">${m}月に行ける催し</a></th><td>${evs.length}件（無料${evs.filter(e => e.free).length}件）</td></tr>`).join('')}</table>
  <p class="cap">数え方：会期が今日以降の催しを数えています。入場料は「一般」「大人」の料金で、学生料金などは除いています。毎日更新しています。</p>
  </div></main>
`;
    write('/stats/', head(`数字で見る東京のイベント（${when}）｜無料は${pc(free)}%、子どもと行ける催しは${kid}件｜${NAME}`, `東京で開催中・これから開かれるイベント${N}件を数えました。入場無料は${pc(free)}%、子どもと行ける催し${kid}件、愛犬と行ける催し${dog}件、美術展の入場料の中央値は${med.toLocaleString()}円（キョウチカ調べ・${ymd(TODAY)}時点）。`, '/stats/', [{ '@context': 'https://schema.org', '@type': 'Dataset', name: `東京のイベントの数字（${when}）`, description: `キョウチカに載っている東京のイベント${N}件の集計`, creator: { '@type': 'Organization', name: NAME, url: BASE }, dateModified: TODAY, url: url('/stats/') }]) + sign(null, '/stats/') + body + ways('/stats/') + foot());
  }
  // 主催者向けの掲載プラン（一般には見せない：noindex・サイトマップに入れない・どこからもリンクしない。DM で URL を送る）。料金は坂尾さんの確認待ちの案。
  OUT['partners-k7q2/index.html'] = head(`掲載プランのご案内（主催者の方へ）｜${NAME}`, '主催者の方向けの掲載プランのご案内です。', '/partners-k7q2/', [], true) + sign(null, '/partners-k7q2/') + `  <main class="page"><div class="body">
  <h1 class="pt">掲載プランのご案内</h1>
  <p class="intro">${NAME}（kyochika.jp）は、東京の美術展・ライブ・フードイベント・マーケット・祭りを、行く日と出発する駅から近い順に探せるサイトです。いま${CURRENT.length}件を掲載し、1日4回更新しています。このページは主催者の方だけにお送りしています。</p>
  <h2>プラン</h2>
  <h3>通常掲載　<b>無料</b></h3>
  <p>公式情報を確認して掲載します。日時・会場・最寄り駅・料金・子ども連れや車椅子などの条件を整理してのせます。</p>
  <h3>PR掲載　<b>5,000円／1催し（会期中、最長1か月）</b></h3>
  <p>トップ・ジャンル・エリアの一覧で上のほうに表示（「PR」と表示します）／催しのページに主催者からの紹介文と画像／「チケットを買う」ボタンでチケットのページへご案内／終了後に、ページが見られた回数と、公式・チケットのページへ送った回数をご報告</p>
  <h3>PR掲載＋SNS　<b>12,000円／1催し</b></h3>
  <p>PR掲載に加えて、インスタグラム（フィード1回・ストーリーズ1回）、X・Threads（各1回）でご紹介（「PR」と表示します）</p>
  <h3>前売り券の販売　<b>準備中</b></h3>
  <p>チケットの仕組みをお持ちでない主催者の方向けに、キョウチカで前売り券を販売できるよう準備しています。</p>
  <h2>ご注意</h2>
  <ul class="dots"><li>広告であることが分かるよう、PR掲載・SNSでのご紹介には必ず「PR」と表示します（景品表示法のステルスマーケティング規制に沿った対応です）。</li><li>掲載する内容は公式の情報で確認します。体験したような書き方や、確認できない内容はのせません。</li><li>サイトの内容に合わない催しは、掲載をお断りすることがあります。</li><li>「キョウチカに掲載中」などのバッジやリンクを、主催者の方のサイトに貼っていただく必要はありません。</li></ul>
  <h2>お申し込み・お問い合わせ</h2>
  <p>インスタグラム <a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a> にダイレクトメッセージでお送りください。催しの名前・会期・公式ページの URL・ご希望のプランをお知らせいただければ、こちらから折り返します。</p>
  </div></main>
` + foot();
  // 行きたいリスト・週末プラン（/plan/）。保存した催しを日付順に並べ、地図のルートと LINE で送れるリンクを作る。#i=id,id で同じプランを人に見せられる。
  write('/plan/', head(`行きたいリスト・週末プラン｜${NAME}`, '保存した東京のイベントを日付順に並べて、地図のルートつきの週末プランにして、LINE で友だちに送れます。', '/plan/', [], true) + sign(null, '/plan/') + `  <main class="page"><div class="body">
  <h1 class="pt">行きたいリスト・週末プラン</h1>
  <p class="intro" id="pl-intro">催しのページの「☆ 行きたいに保存」を押すと、ここに集まります。日付の順にならべて、地図のルートと、友だちに送れるリンクを作ります。</p>
  <div id="pl-list"></div>
  <div class="row share" id="pl-share" hidden><a class="go line" id="pl-line" target="_blank" rel="noopener">このプランをLINEで送る</a><a class="go" id="pl-map" target="_blank" rel="noopener">地図でルートを見る</a><button class="go" type="button" id="pl-copy">リンクをコピー</button></div>
  <p class="cap" id="pl-note"></p>
  <p><a href="/weekend/">今週末のイベントから探す →</a></p>
  </div></main>
<script src="/data.js?v=${VER}.${KDV}"></script>
<script>
(function(){
  var K='kyochika_fav',mine=[];try{mine=JSON.parse(localStorage.getItem(K)||'[]')}catch(e){}
  var h=location.hash.match(/i=([a-z0-9,-]+)/),shared=h?h[1].split(',').filter(Boolean):null,ids=shared||mine;
  var by={};EV.forEach(function(e){by[e.id]=e;});
  var n=new Date(),p=function(x){return String(x).padStart(2,'0')},today=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate());
  var evs=ids.map(function(i){return by[i]}).filter(Boolean).sort(function(a,b){return (a.s<today?today:a.s)<(b.s<today?today:b.s)?-1:1});
  var md=function(iso){var q=iso.split('-');return (+q[1])+'/'+(+q[2])};
  var L=document.getElementById('pl-list');
  if(shared)document.getElementById('pl-intro').textContent='友だちから届いた週末プランです。気になる催しは「☆ 行きたいに保存」で自分のリストにも入れられます。';
  if(!evs.length){L.innerHTML='<p>まだ保存した催しがありません。</p>';return;}
  L.innerHTML='<ol class="plan">'+evs.map(function(e){var end=e.e<today;return '<li'+(end?' class="ended"':'')+'><a href="/event/'+e.id+'/"><b>'+e.t.replace(/[<&]/g,'')+'</b></a><span>'+(e.s===e.e?md(e.s):md(e.s)+'〜'+md(e.e))+'　'+e.o+(e.g==='live'?'開演':'〜'+e.c)+'</span><span>'+e.v.replace(/[<&]/g,'')+'（'+e.st+'駅）</span>'+(end?'<span>終わりました</span>':'')+(shared?'':'<button type="button" class="go" data-rm="'+e.id+'">リストから外す</button>')+'</li>'}).join('')+'</ol>';
  L.querySelectorAll('[data-rm]').forEach(function(b){b.addEventListener('click',function(){mine=mine.filter(function(x){return x!==b.dataset.rm});try{localStorage.setItem(K,JSON.stringify(mine))}catch(e){}location.reload();});});
  var u='https://kyochika.jp/plan/#i='+evs.map(function(e){return e.id}).join(',');
  var live=evs.filter(function(e){return e.e>=today});
  var pts=live.map(function(e){return e.lat+','+e.lng});
  document.getElementById('pl-share').hidden=false;
  document.getElementById('pl-line').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(u);
  document.getElementById('pl-line').addEventListener('click',function(){if(window.gtag)gtag('event','share',{method:'line',page:'plan',n:evs.length});});
  var m=document.getElementById('pl-map');if(pts.length){m.href='https://www.google.com/maps/dir/?api=1&travelmode=transit&destination='+pts[pts.length-1]+(pts.length>1?'&waypoints='+encodeURIComponent(pts.slice(0,-1).join('|')):'');}else m.hidden=true;
  document.getElementById('pl-copy').addEventListener('click',function(){try{navigator.clipboard.writeText(u);this.textContent='コピーしました';}catch(e){prompt('このリンクを送ってください',u);}});
  document.getElementById('pl-note').textContent='保存したリストはこのスマホ・パソコンの中だけにあります。日程や時間は、行く前に各催しの公式ページで確かめてください。';
})();
</script>
` + foot());
  OUT['og/manifest.json'] = JSON.stringify(Object.fromEntries(EV.filter(e => dnum(TODAY) - dnum(e.e) <= 30).map(e => [e.id, Object.assign({ h: ogHash(e) }, ogData(e))])));
  OUT['robots.txt'] = `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`;
  OUT['.htaccess'] = `# 見つからないページの案内と、画像などの読みこみを軽くする設定
ErrorDocument 404 /404.html
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/html "access plus 0 seconds"
ExpiresByType image/jpeg "access plus 30 days"
ExpiresByType image/png "access plus 30 days"
ExpiresByType image/x-icon "access plus 30 days"
ExpiresByType text/css "access plus 1 day"
ExpiresByType application/javascript "access plus 1 day"
ExpiresByType text/javascript "access plus 1 day"
</IfModule>
`;
  OUT['pages.js'] = `// 終わった催しに印をつける（ページを作りなおす前でも、古い情報のまま見せないため）。
(function(){
  var n=new Date(),p=function(x){return String(x).padStart(2,'0')},today=n.getFullYear()+'-'+p(n.getMonth()+1)+'-'+p(n.getDate());
  document.querySelectorAll('[data-e]').forEach(function(el){
    if(el.dataset.e>=today)return;
    if(el.hasAttribute('data-detail')){var m=document.createElement('p');m.className='over';m.textContent='この催しは終わりました。';var b=el.querySelector('.body');b.insertBefore(m,b.firstChild);}
    else{el.classList.add('ended');var s=document.createElement('span');s.className='bd next';s.textContent='終了しました';var h=el.querySelector('h2');h.parentNode.insertBefore(s,h.nextSibling);s.style.alignSelf='flex-start';el.parentNode.appendChild(el);}
  });
  document.querySelectorAll('[data-until]').forEach(function(el){if(el.dataset.until<today)el.hidden=false;});
  var ib=document.getElementById('inst'),dp=null;
  if(ib){window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();dp=e;ib.hidden=false;});ib.addEventListener('click',function(){if(dp){dp.prompt();dp=null;ib.hidden=true;}});}
  // 行きたいリスト（このブラウザの中だけに保存。登録はいらない）
  var K='kyochika_fav',get=function(){try{return JSON.parse(localStorage.getItem(K)||'[]')}catch(e){return []}},put=function(a){try{localStorage.setItem(K,JSON.stringify(a))}catch(e){}};
  document.querySelectorAll('[data-fav]').forEach(function(b){
    var id=b.dataset.fav,paint=function(){var on=get().indexOf(id)>=0;b.textContent=on?'★ 行きたいに保存済み':'☆ 行きたいに保存';b.setAttribute('aria-pressed',on);var l=document.getElementById('favlink');if(l)l.hidden=!get().length;};
    paint();
    b.addEventListener('click',function(){var a=get(),i=a.indexOf(id);if(i>=0)a.splice(i,1);else{a.push(id);if(window.gtag)gtag('event','fav_add',{ev_id:id});}put(a);paint();});
  });
})();
`;
  return { files: OUT, pages: PAGES.length, areas: LIVE_AREAS.map(a => a[1]), weekend: wk, weekendCount: wkEvs.length };
}
if (typeof module !== 'undefined') module.exports = kyochikaBuild;
