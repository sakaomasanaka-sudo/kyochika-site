// キョウチカのページをまとめて作る。ブラウザでも node でも動く。
function kyochikaBuild(D, aboutMain, TODAY, VER) {
  const { EV, SPOTS, GENRES, CRED, HOLIDAYS } = D;
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
    ['kiyosumi', '清澄白河', ['清澄白河']],
    ['odaiba', 'お台場', ['台場']],
  ];
  const GENRE_PAGES = { art: ['art', '美術展・アート展'], live: ['live', 'ライブ・コンサート'], food: ['food', 'フードイベント'], market: ['market', 'マーケット・蚤の市'], festival: ['festival', '祭り・地域の催し'], popup: ['popup', 'ポップアップ・期間限定の店'] };
  const SHORT = { art: '美術展', live: 'ライブ', food: 'フード', market: 'マーケット', festival: '祭り', popup: 'ポップアップ' };
  const GKEYS = Object.keys(GENRE_PAGES);
  const GNAV = GKEYS.map(g => [`/${GENRE_PAGES[g][0]}/`, SHORT[g]]).concat([['/free/', '無料'], ['/weekend/', '今週末']], EV.some(e => e.ig && e.e >= TODAY) ? [['/instagram/', 'インスタ']] : []);
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
  const affOn = !!(AFF.rakuten || AFF.klook);
  const rakutenHotel = ev => AFF.rakuten ? `https://hb.afl.rakuten.co.jp/hgc/${AFF.rakuten}/?pc=${encodeURIComponent('https://kw.travel.rakuten.co.jp/keyword/Search.do?f_keyword=' + encodeURIComponent(ev.st + '駅'))}` : '';
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
  const HREFLANG = { en: 'en', zh: 'zh-Hans' }, LANGNAME = { en: 'English', zh: '中文' };
  const altPath = (l, path) => (path.startsWith('/area/') || path === '/404.html' || path === '/drama/' || path === '/christmas/' || path === '/illumination/' || path === '/halloween/' || path.startsWith('/date/') || /^\/weekend\/\d/.test(path)) ? null : `/${l}` + (path === '/about.html' ? '/about/' : path);
  const head = (title, desc, path, ld = [], noindex = false) => {
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
<meta property="og:image" content="${BASE}/og.png?v=${VER}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
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
${lds}</head>
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

  const ways = (current = null) => {
    const a = (p, n) => `<a href="${p}"${p === current ? ' aria-current="page"' : ''}>${esc(n)}</a>`;
    const g = Object.values(GENRE_PAGES).map(([s, n]) => a(`/${s}/`, n)).join('') + a('/free/', '無料で行ける') + a('/weekend/', '今週末') + a('/date/', '日付から') + (EV.some(e => e.ig && !ended(e)) ? a('/instagram/', 'インスタ告知') : '') + (CURRENT.some(e => (e.k || []).includes('halloween')) ? a('/halloween/', 'ハロウィン') : '') + (CURRENT.some(e => (e.k || []).includes('xmas')) ? a('/christmas/', 'クリスマスマーケット') : '') + (CURRENT.some(e => (e.k || []).includes('illumi')) ? a('/illumination/', 'イルミネーション') : '');
    const ar = LIVE_AREAS.map(([s, n]) => a(`/area/${s}/`, n)).join('');
    return `  <nav class="ways" aria-label="ほかのさがし方">
    <h2>ジャンル・条件からさがす</h2><div class="links">${g}</div>
    <h2>エリアからさがす</h2><div class="links">${ar}</div>
  </nav>
`;
  };

  const FOOT_NOTE = '掲載しているのは、会場や主催者の公式ページ、または公式のインスタグラムで確認できた催しです。内容は変わることがあり、売り切れや休館もあるので、出かける前に公式ページを確認してください。距離は直線、所要時間はおおよその目安です。写真は会場やその周辺のイメージで、催しそのものの写真ではありません。';
  const foot = (scripts = ['pages.js']) => {
    const sc = scripts.map(s => `<script src="/${s}?v=${VER}"></script>\n`).join('');
    return `  <p class="follow">毎週木曜、東京の週末のまとめをインスタグラム <a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a> で配信しています。<a href="/app/">ホーム画面に追加</a>すると、アプリのように開けます。</p>
  <p class="foot">${FOOT_NOTE}${affOn ? '当サイトはアフィリエイト広告（PR）を含みます。' : ''}</p>
  <nav class="nav"><a href="/">催しをさがす</a><a href="/app/">アプリのように使う</a><a href="/drama/">連続アニメ『東京、あと80日』</a><a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">インスタグラム @kyochika.tokyo</a><a href="/about.html">このサイトについて・運営者情報・写真の出典</a></nav>
</div>
${sc}</body>
</html>
`;
  };

  const pic = (ev, eager = false) => {
    const g = GENRES[ev.g].n;
    if (ev.ph) return `<div class="pic"><img src="/photos/${ev.ph}.jpg" alt="${esc(CRED[ev.ph][0])}の写真" width="384" height="216"${eager ? '' : ' loading="lazy"'}><span class="kind">${g}</span></div>`;
    return `<div class="pic none"><span class="kind">${g}</span></div>`;
  };

  // 一覧の1件。トップの app.js と同じ形（駅名標の番号・見出し・写真・時間と料金）にする。
  const LTM = { art: 'A', live: 'L', food: 'F', market: 'M', festival: 'S', popup: 'P' };
  const card = (ev, eager = false, i = 0) =>
    `<li class="ev" style="--c:var(--${ev.g})" data-e="${ev.e}"><span class="sn" aria-hidden="true"><b>${LTM[ev.g] || 'E'}</b>${String(i + 1).padStart(2, '0')}</span>`
    + `<div class="hd"><p class="kd">${GENRES[ev.g].n}</p><h2><a href="/event/${ev.id}/">${esc(ev.t)}</a></h2><p class="where">${esc(ev.v)}（${esc(ev.st)}駅）</p></div>`
    + (ev.ph ? `<a class="th" href="/event/${ev.id}/" tabindex="-1" aria-hidden="true"><img src="/photos/${ev.ph}.jpg" alt="" width="384" height="216"${eager ? '' : ' loading="lazy"'}></a>` : '')
    + `<div class="rest"><p class="when">${when(ev)}</p><p class="meta"><span class="price">${esc(ev.price)}</span>${ev.free ? '<span class="bd free">無料</span>' : ''}${ev.ig ? '<span class="bd ig">インスタで告知</span>' : ''}</p>`
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
    if (ev.ph) ld.image = [`${BASE}/photos/${ev.ph}.jpg`];
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
      ['料金', ev.price], ['会場', ev.v], ['最寄り駅', ev.st + '駅']];
    const facts = rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
    const spots = Object.entries(SPOTS).map(([n, [la, ln]]) => [km(la, ln, ev.lat, ev.lng), n]).sort((a, b) => a[0] - b[0] || cmp(a[1], b[1])).slice(0, 4);
    const from = spots.map(([dist, n]) => `<dt>${n}から</dt><dd>${far(dist)}</dd>`).join('');
    const others = CURRENT.filter(x => x.id !== ev.id).map(x => [km(ev.lat, ev.lng, x.lat, x.lng) + ((x.s <= ev.e && x.e >= ev.s) ? 0 : 50), x]).sort((a, b) => a[0] - b[0]).slice(0, 6).map(p => p[1]);
    const near = others.map(x => `<li><a href="/event/${x.id}/">${esc(x.t)}</a><span>${esc(x.v)}（${esc(x.st)}駅）・ここから${far(km(ev.lat, ev.lng, x.lat, x.lng))}・${span(x)}</span></li>`).join('');
    const cap = ev.ph ? `<p class="cap">写真は${esc(CRED[ev.ph][0])}です。会場やその周辺のイメージで、${kind}そのものの写真ではありません。</p>` : '';
    const maps = 'https://www.google.com/maps/search/?api=1&query=' + quote(ev.v.split('（')[0]);
    const body = `${cr}  <main class="page" style="--c:var(--${ev.g})" data-e="${ev.e}" data-detail>
    ${pic(ev, true)}
    <div class="body">
      <h1 class="pt">${esc(ev.t)}</h1>
      <p class="lead">${esc(ev.v)}（${esc(ev.st)}駅）${ev.free ? '・無料' : ''}</p>
      ${ev.note ? `<p>${esc(ev.note)}</p>` : ''}
      <dl class="facts">${facts}</dl>
      <p class="cap">${ev.ig ? '日程の変更や中止は、主催者のインスタグラムで確かめてください。' : '休みの日や最終入場の時刻は、公式ページで確かめてください。'}</p>
      <div class="row"><a class="go pri" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.ig ? 'インスタの告知で確かめる' : '公式ページで確かめる'}</a><a class="go" href="${maps}" target="_blank" rel="noopener">地図でひらく</a></div>
      <h2>主な駅からの近さ</h2>
      <dl class="facts">${from}</dl>
      <p class="cap">距離は直線、時間はおおよその目安です。</p>
      <h2>近くでやっているほかの催し</h2>
      <ul class="near">${near}</ul>
      ${affBox(ev)}
      ${cap}
      <p class="upd">${ymd(TODAY)}に${ev.ig ? '主催者のインスタグラムの告知' : '公式ページ'}で確認した内容です。</p>
    </div>
  </main>
`;
    write(path, head(title, desc, path, [eventLd(ev), crLd]) + sign(null, path) + body + ways() + foot());
  }

  // ── 一覧ページ（ジャンル・無料・エリア・今週末） ──
  const listPage = (path, h1, title, desc, evs0, crumbName, intro) => {
    const evs = order(evs0);
    const [cr, crLd] = crumbs([['トップ', '/'], [crumbName, null]]);
    const cards = evs.map((e, i) => card(e, i < 2, i)).join('');
    const body = `${cr}  <h1 class="pt">${esc(h1)}</h1>
  <p class="intro">${esc(intro)}</p>
  <div class="board"><span>終わりが近い順</span><b>${evs.length}件</b></div>
  <ul class="list">${cards}</ul>
  <p class="upd">${ymd(TODAY)}時点の掲載分です。行く日や出発する駅からさがすときは、<a href="/">トップページ</a>が便利です。</p>
`;
    write(path, head(title, desc, path, [itemList(evs), crLd]) + sign(path, path) + body + ways(path) + foot());
  };

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
    ['halloween', '/halloween/', '東京のハロウィンイベント2026', `東京のハロウィンイベント2026｜日程・場所・料金の一覧｜${NAME}`, n => `2026年に東京で開かれるハロウィンイベントを${n}件まとめました。池袋のコスプレフェス、スカイツリータウン、花やしきなど、日程、時間、料金、最寄り駅がひと目でわかります。`, 'ハロウィン', n => `2026年のハロウィンに東京で開かれるイベントを${n}件のせています。日程や料金は主催者の発表で確かめたものです。渋谷駅周辺の路上の集まりは、イベントではないので載せていません。`],
  ];
  for (const [k, path, h1, title, desc, cname, intro] of SEASONS) {
    const evs = CURRENT.filter(e => (e.k || []).includes(k));
    if (evs.length) listPage(path, h1, title, desc(evs.length), evs, cname, intro(evs.length));
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
    if (made.length) {
      const [cr, crLd] = crumbs([['トップ', '/'], ['日付からさがす', null]]);
      const li = made.map(([d, w, n]) => `<li><a href="/date/${d}/">${jd(d)}（${w}）</a><span>${n}件</span></li>`).join('');
      write('/date/', head(`日付から東京のイベントをさがす｜${NAME}`, `今日から6週間先まで、東京で行ける美術展・ライブ・マーケット・祭りを日付ごとにまとめています。`, '/date/', [crLd]) + sign(null, '/date/') + cr + `  <main class="doc"><h1 class="pt">日付から東京のイベントをさがす</h1><ul class="near">${li}</ul></main>\n` + ways('/date/') + foot());
    }
  }

  for (const [slug, aname, sts] of LIVE_AREAS) {
    const evs = CURRENT.filter(e => sts.includes(e.st));
    const cnt = GKEYS.map(g => [g, evs.filter(e => e.g === g).length]).filter(([, n]) => n);
    const kinds = cnt.length > 3 ? 'イベント' : cnt.map(([g]) => SHORT[g]).join('・');
    const used = sts.filter(s => evs.some(e => e.st === s));
    listPage(`/area/${slug}/`, `${aname}の${kinds}`, `${aname}の${kinds}｜開催中・今週の催し一覧｜${NAME}`,
      `${aname}エリアで開催中・今週開かれる${kinds}を${evs.length}件まとめました。最寄り駅は${used.join('・')}。会期、時間、料金がひと目でわかります。`,
      evs, aname, `最寄り駅が${used.map(s => s + '駅').join('・')}の催しを${evs.length}件のせています（${cnt.map(([g, n]) => GENRES[g].n + n + '件').join('、')}）。`);
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
    const body = `  <section class="ctl" aria-label="さがす条件">
    <div><span class="lab">いつ行く？</span><div class="days" id="days"></div><label class="other">ほかの日 <input type="date" id="otherDay"></label></div>
    <div><span class="lab">どこから？（近い順にならべます）</span><div class="chips scroll" id="from"></div></div>
    <div><span class="lab">ジャンル</span><div class="chips" id="genres"></div></div>
    <div><span class="lab">しぼりこみ</span><div class="chips scroll" id="filters"></div></div>
  </section>

  <div class="board" id="board" aria-live="polite"><span>掲載中の催し</span><b>${CURRENT.length}件</b></div>
  <ul class="list" id="list">${order(CURRENT).map((e, i) => card(e, i < 2, i)).join('')}</ul>

  <section class="join" id="join" hidden>
    <h2>催しをのせたい主催者の方へ</h2>
    <p>インスタグラムなどで告知している催しを、無料で掲載します。内容を確認してからのせます。</p>
    <a class="go" id="joinLink" href="#" target="_blank" rel="noopener">登録フォームをひらく</a>
  </section>

  <p class="intro">${NAME}は、東京の美術展・ライブ・フードイベント・マーケット・祭りなどの情報を、会場や主催者の公式サイトやインスタグラムから集めて1か所にまとめ、行く日と出発する駅から近い順にならべるサイトです。いまは${cnt.map(([g, n]) => GENRES[g].n + n + '件').join('、')}をのせています（${ymd(TODAY)}更新）。スマホのホーム画面に追加すると、アプリのように使えます。</p>
`;
    const LT = {art:'A',live:'L',food:'F',market:'M',festival:'S',popup:'P'};
    const lines = cnt.map(([g, n]) => `<a href="/${GENRE_PAGES[g][0]}/" style="--c:var(--${g})"><i>${LT[g]}</i>${SHORT[g]}<b>${n}</b></a>`).join('');
    const nv = new Set(CURRENT.map(e => e.v)).size;
    const hero = `  <section class="hero">
    <h1>きょう、東京でどこ行く？</h1>
    <div class="plate" aria-label="行く日">
      <p class="pl-big" id="plBig">きょう</p>
      <p class="pl-sub" id="plSub"></p>
      <div class="pl-band"><button type="button" id="plPrev" data-act="dstep" aria-label="前の日"><span id="plPrevT"></span></button><button type="button" id="plNext" data-act="dstep" aria-label="次の日"><span id="plNextT">あした</span></button></div>
    </div>
    <p class="sub">美術展、ライブ、フードフェス、蚤の市、祭り。${nv}か所の会場や主催者の公式情報から集めた${CURRENT.length}件を、あなたの駅から近い順にならべます。</p>
    <nav class="lines" aria-label="ジャンル">${lines}</nav>
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
    write('/', head(title, desc, '/', [siteLd, itemList(order(CURRENT))]) + sign(null, '/') + hero + pochi + dramaBan + body + ways() + foot(['config.js', 'data.js', 'app.js']));
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
  OUT['sitemap.xml'] = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + PAGES.map(p => `  <url><loc>${url(p)}</loc><lastmod>${TODAY}</lastmod><priority>${prio(p)}</priority></url>\n`).join('') + '</urlset>\n';
  OUT['manifest.json'] = JSON.stringify({ name: NAME + '｜東京のイベントをまとめて探す', short_name: NAME, start_url: '/', scope: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#ffffff', lang: 'ja', icons: [{ src: '/icon-192.png?v=' + VER, sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png?v=' + VER, sizes: '512x512', type: 'image/png' }, { src: '/icon-512.png?v=' + VER, sizes: '512x512', type: 'image/png', purpose: 'maskable' }] }, null, 1) + '\n';
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
})();
`;
  return { files: OUT, pages: PAGES.length, areas: LIVE_AREAS.map(a => a[1]), weekend: wk, weekendCount: wkEvs.length };
}
if (typeof module !== 'undefined') module.exports = kyochikaBuild;
