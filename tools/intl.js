// 英語・中国語のページを作る。kyochikaAll が日本語のページとあわせて一式にする。
// アフィリエイトの ID。登録が済んだらここに入れる。空なら何も表示しない。
// rakuten: 楽天アフィリエイトID（hgc の後ろの部分）／klook: Klook の affiliate ID（aid）、klookAd: サイト Kyochika Tokyo の aff_adid（10/11 登録）
const KYOCHIKA_AFF = { rakuten: '', klook: '138663', klookAd: '1493145' };
function kyochikaIntl(D, T, L, TODAY, VER) {
  const { EV, SPOTS, GENRES, CRED, HOLIDAYS } = D;
  const BASE = 'https://kyochika.jp', NAME = 'キョウチカ', P = '/' + L, EN = L === 'en', li = EN ? 0 : 1;
  const HL = { en: 'en', zh: 'zh-Hans' }, LANGNAME = { ja: '日本語', en: 'English', zh: '中文' };
  const S = EN ? {
    site: 'Kyochika Tokyo', loc: 'en_US',
    G: { art: ['Art exhibitions', 'Art'], live: ['Live music & concerts', 'Live music'], food: ['Food events', 'Food'], market: ['Markets & flea markets', 'Markets'], festival: ['Festivals & local events', 'Festivals'], popup: ['Pop-ups', 'Pop-ups'] },
    free: 'Free', weekend: 'This weekend', ig: 'From Instagram',
    h1: 'What’s on in Tokyo today?',
    sub: 'Museums, live music, food festivals, flea markets, shrine festivals. Tokyo’s events are scattered across official sites and Instagram accounts, mostly in Japanese. Here they are on one page, in English.',
    lead: (n, nv) => `${n} events now, from ${nv} venues and organisers, sorted by distance from your station.`,
    getapp: ['Add to your home screen and use it like an app', 'How to'],
    igcta: ['Weekly picks for the Tokyo weekend, every Thursday on Instagram', 'Follow'],
    follow: 'Every Thursday we post picks for the Tokyo weekend on Instagram at <a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a>. <a href="/en/app/">Add this site to your home screen</a> to open it like an app.',
    plate: ['Today', 'Day', 'Previous day', 'Next day', 'Tomorrow'],
    sub2: (n, nv) => `Exhibitions, live music, food festivals, flea markets and shrine festivals: ${n} events from ${nv} official sources, sorted by distance from your station.`,
    lDay: 'Which day?', lOther: 'Another day', lFrom: 'From which station? (nearest first)', lGenre: 'Type', lFilt: 'Filters',
    listed: 'Events listed', n: n => `${n} events`,
    time: 'Time', price: 'Price', date1: 'Date', dates: 'Dates', venue: 'Venue', station: 'Nearest station',
    details: 'Details', official: 'Official page (Japanese)', igpost: 'Instagram post', chkOff: 'Check the official page (Japanese)', chkIg: 'Check the Instagram post', map: 'Open in Google Maps',
    start: o => `${o} start`, endAbout: c => `expected to end around ${c}`, until: d => `until ${d}`, sta: s => `${s} Sta.`, staP: s => ` (${s} Sta.)`,
    lateOn: (ds, t) => `until ${t} on ${ds.join(' & ')}`, dows: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hol: ', holiday', sep: ' – ', joiner: '; ',
    capHours: 'Check closed days and last admission on the official page before you go.', capIg: 'Check the organiser’s Instagram for schedule changes or cancellations.',
    fromH: 'Distance from major stations', fromSt: s => `From ${s}`, capDist: 'Distances are straight-line; times are rough estimates.',
    affH: 'Tours and tickets nearby', affK: s => `Find tours, passes and tickets around ${s} on Klook`, affCap: 'Ad: Klook affiliate link.', affFoot: 'This site contains affiliate links (ads).',
    nearH: 'Other events nearby', fromHere: d => `${d} from here`, capPhoto: 'The photo shows the venue or its surroundings, not the event itself.', alt: 'Photo of the venue area',
    upd: (d, ig) => `Checked against the ${ig ? 'organiser’s Instagram post' : 'official page'} on ${d}. Titles and descriptions are our own translations.`,
    near: 'right there', walk: n => `about ${n} min on foot`, train: n => `about ${n} min by train`, km: (k, t) => `${k} km, ${t}`,
    home: 'Top', endSoon: 'Ending soonest first', listUpd: d => `As of ${d}. To search by day and station, use the <a href="${P}/">top page</a>.`,
    gH1: g => `${g} in Tokyo`, gTitle: g => `${g} in Tokyo – on now and this week | Kyochika Tokyo`,
    gDesc: (g, n, f) => `${n} ${g.toLowerCase()} in Tokyo, on now or this week, with dates, hours, prices and nearest stations in English. ${f} of them are free.`,
    freeH1: 'Free things to do in Tokyo', freeDesc: n => `${n} free events in Tokyo: art shows, live music, food events and festivals with free entry. Food, drinks and shopping may cost extra.`,
    igH1: 'Tokyo events found on Instagram', igDesc: n => `${n} Tokyo events announced on organisers’ Instagram accounts: small markets, gallery shows and gigs that are hard to find by search. Check each organiser’s Instagram for changes.`,
    wkH1: r => `This weekend in Tokyo: ${r}`, wkDesc: (n, r) => `${n} events you can go to in Tokyo this weekend (${r}), listed day by day with hours, prices and nearest stations.`,
    wkDay: (d, n) => `${d} — ${n} events`, wkOver: `This weekend is over. Find current events on the <a href="${P}/">top page</a>.`,
    ways1: 'Browse by type',
    foot: 'We list events we could confirm on the official page or official Instagram of the venue or organiser. Details can change, tickets sell out and venues close, so check the official page before you go. Distances are straight-line and travel times are rough estimates. Photos show the venue or its surroundings, not the event itself. Titles and descriptions are our own translations from Japanese.',
    navFind: 'Find events', navApp: 'Use it like an app', navAbout: 'About this site',
    idxTitle: 'Kyochika Tokyo | Tokyo events today, near you – art, live music, food, markets, festivals in English',
    idxDesc: n => `Tokyo art exhibitions, live music, food events, flea markets and festivals on one page, in English. Pick a day and your station to see what is on nearby. ${n} events listed now.`,
    intro: (cnt, d) => `Kyochika gathers Tokyo events from the official sites and Instagram accounts of venues and organisers, translates the essentials, and sorts them by distance from your station. Now listing ${cnt} (updated ${d}).`,
    cntJoin: ', ', cnt: (g, n) => `${n} ${g.toLowerCase()}`,
    evTitle: (t, v, s) => `${t} | ${v}, ${s} Sta. – dates, hours, price | Kyochika Tokyo`,
    evDesc: (kind, v, s, span, hrs, price, note) => `${kind} at ${v} (${s} Sta.), Tokyo. ${span}, ${hrs}. ${price}. ${note}`,
    kind: { art: 'Exhibition', live: 'Live show', food: 'Food event', market: 'Market', festival: 'Festival', popup: 'Pop-up' },
    orig: 'Japanese title',
    aboutT: 'About Kyochika', aboutD: 'About Kyochika Tokyo: what the site is, how the information is checked, who runs it and how to get in touch.',
    about: `    <p>Kyochika (キョウチカ, “today, nearby”) is an independent guide to events in Tokyo. We collect art exhibitions, live music, food events, markets and festivals from the official websites and Instagram accounts of venues and organisers, and list them by date and by distance from your station.</p>
    <h2>How to use it</h2>
    <p>On the top page, choose the day you want to go out and the station you start from. Events are listed nearest first. You can filter by type, free entry, evening hours and events found on Instagram.</p>
    <h2>About the information</h2>
    <p>We list only what we could confirm on an official page or an official Instagram account. Dates, hours and prices can change, so please check the official page before you go. Event titles and descriptions on these pages are our own translations; each event page also shows the original Japanese title. Most official pages are in Japanese only.</p>
    <h2>Who runs it</h2>
    <p>Kyochika is run by Masanaka Sakao (坂尾正中) in Tokyo. Contact: info@kyochika.jp</p>
    <h2>Photos</h2>
    <p>Photos come from Wikimedia Commons and show venues or their surroundings. Photographers and licences are listed on the <a href="/about.html" hreflang="ja">Japanese About page</a>.</p>`,
    appT: 'Use Kyochika like an app', appD: 'How to add Kyochika to your phone’s home screen and use it like an app, on iPhone, Android and desktop. No store download or sign-up needed.',
    app: `    <p>Add Kyochika to your home screen and it opens from an icon, full screen, without the address bar. There is nothing to download from an app store and no sign-up. It is free.</p>
    <p><button class="go pri" id="inst" type="button" hidden>Add to this device</button></p>
    <h2>iPhone and iPad</h2>
    <ol><li>Open kyochika.jp/en/ in Safari</li><li>Tap the Share button (a square with an arrow pointing up)</li><li>Scroll the list and choose “Add to Home Screen”</li><li>Tap “Add” at the top right</li></ol>
    <p class="cap">In Chrome on iPhone, the Share button offers the same option.</p>
    <h2>Android</h2>
    <ol><li>Open kyochika.jp/en/ in Chrome</li><li>Tap the “⋮” menu at the top right</li><li>Choose “Add to Home screen” or “Install app”</li><li>Tap “Add” or “Install”</li></ol>
    <h2>Desktop (Chrome, Edge)</h2>
    <ol><li>Open kyochika.jp/en/</li><li>Click the install button at the right end of the address bar</li></ol>
    <h2>After adding</h2>
    <p>A black icon with the katakana “キ” appears on your home screen. Your starting station is remembered after you choose it once. Event information is loaded fresh each time you open it.</p>
    <h2>To remove it</h2>
    <p>Press and hold the icon and choose “Remove” or “Delete”. Nothing else is left behind.</p>`,
    ui: { today: 'Today', hol: '', nowOnly: 'Still open now', free: 'Free', soon: 'Ending soon', night: 'Open after 7pm', ig: 'From Instagram', board: '{d} · nearest to {from} first', n: '{n} events', start: '{o} start', lastDay: 'Last day today', until: 'until {d}', now: 'On now', fromT: 'From {o}', over: 'Finished for today', endsToday: 'Ends today', left: '{n} days left', time: 'Time', dist: 'Distance', price: 'Price', fromSt: 'From {s}: ', near: 'right there', walk: 'about {n} min on foot', train: 'about {n} min by train', km: '{k} km, {t}', details: 'Details', official: 'Official page (Japanese)', igpost: 'Instagram post', igbd: 'Found on Instagram', alt: 'Photo of the venue area', sta: ' ({s} Sta.)', empty: 'No events match this day and these filters. Remove a filter or pick another day.' },
  } : {
    site: 'Kyochika 东京', loc: 'zh_CN',
    G: { art: ['艺术展览', '展览'], live: ['现场音乐·音乐会', '音乐'], food: ['美食活动', '美食'], market: ['市集·跳蚤市场', '市集'], festival: ['祭典·地方活动', '祭典'], popup: ['快闪店', '快闪'] },
    free: '免费', weekend: '本周末', ig: 'Instagram公告',
    h1: '今天，去东京哪儿玩？',
    sub: '美术馆、现场音乐、美食节、跳蚤市场、祭典。东京的活动信息分散在各官方网站和Instagram上，而且大多只有日文。这里把它们汇总在一页，用中文呈现。',
    lead: (n, nv) => `目前共${n}个活动，来自${nv}个场馆和主办方，按离你所在车站的远近排序。`,
    getapp: ['添加到主屏幕，像App一样使用', '查看方法'],
    igcta: ['每周四在Instagram发布东京周末活动精选', '关注'],
    follow: '每周四在Instagram <a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">@kyochika.tokyo</a> 发布东京周末活动精选。<a href="/zh/app/">添加到主屏幕</a>后，可以像App一样打开。',
    plate: ['今天', '日期', '前一天', '后一天', '明天'],
    sub2: (n, nv) => `展览、现场音乐、美食节、跳蚤市场、祭典。汇集${nv}个官方来源的${n}个活动，按离你所在车站的远近排序。`,
    lDay: '哪天去？', lOther: '其他日期', lFrom: '从哪个车站出发？（由近到远）', lGenre: '类型', lFilt: '筛选',
    listed: '当前活动', n: n => `${n}个`,
    time: '时间', price: '费用', date1: '日期', dates: '举办期间', venue: '场馆', station: '最近车站',
    details: '查看详情', official: '官方页面（日文）', igpost: 'Instagram公告', chkOff: '查看官方页面（日文）', chkIg: '查看Instagram公告', map: '在Google地图中打开',
    start: o => `${o} 开演`, endAbout: c => `预计${c}左右结束`, until: d => `至${d}`, sta: s => `${s}站`, staP: s => `（${s}站）`,
    lateOn: (ds, t) => `${ds.join('、')}至${t}`, dows: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'], hol: '·假日', sep: '〜', joiner: '；',
    capHours: '出发前请在官方页面确认休馆日和最后入场时间。', capIg: '日程变更或取消请在主办方的Instagram上确认。',
    fromH: '距主要车站', fromSt: s => `从${s}`, capDist: '距离为直线距离，时间为大致估算。',
    affH: '附近可预订的体验与门票', affK: s => `在Klook查看${s}周边的体验、通票和门票`, affCap: '广告：Klook联盟链接。', affFoot: '本站含有联盟广告链接。',
    nearH: '附近的其他活动', fromHere: d => `距此${d}`, capPhoto: '照片为场馆或周边的示意图，并非活动本身的照片。', alt: '场馆周边照片',
    upd: (d, ig) => `内容已于${d}根据${ig ? '主办方的Instagram公告' : '官方页面'}确认。标题和说明为本站翻译。`,
    near: '就在附近', walk: n => `步行约${n}分钟`, train: n => `乘电车等约${n}分钟`, km: (k, t) => `约${k}公里，${t}`,
    home: '首页', endSoon: '按结束日期排序', listUpd: d => `截至${d}。按日期和出发车站查找，请使用<a href="${P}/">首页</a>。`,
    gH1: g => `东京的${g}`, gTitle: g => `东京的${g}｜正在举办·本周一览｜Kyochika 东京`,
    gDesc: (g, n, f) => `汇总东京正在举办和本周举办的${g}共${n}个，日期、时间、费用、最近车站一目了然。其中${f}个免费。`,
    freeH1: '东京的免费活动', freeDesc: n => `东京可免费入场的展览、现场音乐、美食活动和祭典共${n}个。餐饮和购物可能需另付费用。`,
    igH1: '在Instagram上发现的东京活动', igDesc: n => `主办方在Instagram上公告的东京活动共${n}个，多为搜索很难找到的小型市集、个展和现场演出。变更或取消请查看各主办方的Instagram。`,
    wkH1: r => `本周末 ${r} 东京的活动`, wkDesc: (n, r) => `${r}这个周末在东京可以去的活动共${n}个，按天列出时间、费用和最近车站。`,
    wkDay: (d, n) => `${d}可去的活动（${n}个）`, wkOver: `这个周末已经结束。当前活动请在<a href="${P}/">首页</a>查找。`,
    ways1: '按类型查找',
    foot: '本站只刊登能在场馆或主办方的官方页面、官方Instagram上确认的活动。内容可能变更，也可能售罄或休馆，出发前请查看官方页面。距离为直线距离，所需时间为大致估算。照片为场馆或周边的示意图，并非活动本身的照片。标题和说明由本站从日文翻译。',
    navFind: '查找活动', navApp: '像App一样使用', navAbout: '关于本站',
    idxTitle: 'Kyochika 东京｜今天·附近的东京活动一览｜展览·现场音乐·美食·市集·祭典',
    idxDesc: n => `东京的展览、现场音乐、美食活动、跳蚤市场和祭典，汇总在一页并翻译成中文。选择日期和出发车站，就能由近到远查看。目前刊登${n}个活动。`,
    intro: (cnt, d) => `Kyochika从场馆和主办方的官方网站及Instagram收集东京的活动信息，翻译要点，并按离你所在车站的远近排序。目前刊登${cnt}（${d}更新）。`,
    cntJoin: '、', cnt: (g, n) => `${g}${n}个`,
    evTitle: (t, v, s) => `${t}｜${v}·${s}站｜日期·时间·费用｜Kyochika 东京`,
    evDesc: (kind, v, s, span, hrs, price, note) => `${v}（${s}站）的${kind}。${span}，${hrs}，${price}。${note}`,
    kind: { art: '展览', live: '演出', food: '美食活动', market: '市集', festival: '祭典', popup: '快闪活动' },
    orig: '日文名称',
    aboutT: '关于 Kyochika', aboutD: '关于 Kyochika 东京：网站介绍、信息的确认方式、运营者和联系方式。',
    about: `    <p>Kyochika（キョウチカ，意为“今天·附近”）是一个独立运营的东京活动指南。我们从场馆和主办方的官方网站及Instagram收集展览、现场音乐、美食活动、市集和祭典，并按日期和离你所在车站的远近列出。</p>
    <h2>使用方法</h2>
    <p>在首页选择想出门的日期和出发的车站，活动会由近到远排列。还可以按类型、免费、夜间开放、Instagram公告等条件筛选。</p>
    <h2>关于信息</h2>
    <p>本站只刊登能在官方页面或官方Instagram上确认的内容。日期、时间和费用可能变更，出发前请务必查看官方页面。中文页面上的活动名称和说明为本站翻译，各活动页面同时标注日文原名。大部分官方页面只有日文。</p>
    <h2>运营者</h2>
    <p>Kyochika 由坂尾正中（东京）运营。联系方式：info@kyochika.jp</p>
    <h2>照片</h2>
    <p>照片来自 Wikimedia Commons，为场馆或周边的示意图。摄影者和授权信息见<a href="/about.html" hreflang="ja">日文版“关于本站”页面</a>。</p>`,
    appT: '像App一样使用 Kyochika', appD: '把 Kyochika 添加到手机主屏幕、像App一样使用的方法，包括 iPhone、Android 和电脑的步骤。无需从应用商店下载，也无需注册。',
    app: `    <p>把 Kyochika 添加到主屏幕后，点一下图标就能打开，并以没有地址栏的全屏显示。无需从应用商店下载，也无需注册，完全免费。</p>
    <p><button class="go pri" id="inst" type="button" hidden>添加到此设备</button></p>
    <h2>iPhone·iPad</h2>
    <ol><li>用 Safari 打开 kyochika.jp/zh/</li><li>点击分享按钮（方框加向上箭头的图标）</li><li>向上滑动列表，选择“添加到主屏幕”</li><li>点击右上角的“添加”</li></ol>
    <p class="cap">在 iPhone 的 Chrome 中，也可以通过分享按钮同样添加。</p>
    <h2>Android</h2>
    <ol><li>用 Chrome 打开 kyochika.jp/zh/</li><li>点击右上角的“⋮”</li><li>选择“添加到主屏幕”或“安装应用”</li><li>点击“添加”或“安装”</li></ol>
    <h2>电脑（Chrome、Edge）</h2>
    <ol><li>打开 kyochika.jp/zh/</li><li>点击地址栏右端出现的安装按钮</li></ol>
    <h2>添加之后</h2>
    <p>主屏幕上会出现黑色的“キ”图标。出发车站选过一次后会自动记住。每次打开都会读取最新的活动信息。</p>
    <h2>不想用时</h2>
    <p>长按图标并选择“移除”或“删除”即可，不会留下其他内容。</p>`,
    ui: { today: '今天', hol: '', nowOnly: '现在还来得及', free: '免费', soon: '即将结束', night: '晚上19点后仍开放', ig: 'Instagram公告', board: '{d}·从{from}由近到远', n: '{n}个', start: '{o} 开演', lastDay: '今天是最后一天', until: '至{d}', now: '正在举办', fromT: '{o}开始', over: '今天已结束', endsToday: '今天截止', left: '还剩{n}天', time: '时间', dist: '距离', price: '费用', fromSt: '从{s}出发：', near: '就在附近', walk: '步行约{n}分钟', train: '乘电车等约{n}分钟', km: '约{k}公里，{t}', details: '查看详情', official: '官方页面（日文）', igpost: 'Instagram公告', igbd: '来自Instagram', alt: '场馆周边照片', sta: '（{s}站）', empty: '当前条件下没有符合的活动。请取消筛选或选择其他日期。' },
  };
  const GKEYS = Object.keys(S.G);
  const LDTYPE = { art: 'ExhibitionEvent', live: 'MusicEvent', food: 'FoodEvent', market: 'Event', festival: 'Festival', popup: 'Event' };
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], MONF = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  const dnum = iso => { const p = iso.split('-').map(Number); return Math.floor(Date.UTC(p[0], p[1] - 1, p[2]) / 864e5); };
  const isoOf = n => new Date(n * 864e5).toISOString().slice(0, 10);
  const dow = iso => new Date(dnum(iso) * 864e5).getUTCDay();
  const md = iso => { const p = iso.split('-').map(Number), h = iso in HOLIDAYS ? S.hol : ''; return EN ? `${MON[p[1] - 1]} ${p[2]} (${S.dows[dow(iso)]}${h})` : `${p[1]}月${p[2]}日(${S.dows[dow(iso)]}${h})`; };
  const ymd = iso => { const p = iso.split('-').map(Number); return EN ? `${MONF[p[1] - 1]} ${p[2]}, ${p[0]}` : `${p[0]}年${p[1]}月${p[2]}日`; };
  const mins = hm => { const p = hm.split(':').map(Number); return p[0] * 60 + p[1]; };
  const km = (a, b, c, e) => { const R = 6371, r = Math.PI / 180, x = (c - a) * r, y = (e - b) * r, h = Math.sin(x / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin(y / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const travel = d => d <= 1.5 ? S.walk(Math.max(1, Math.round(d * 16))) : S.train(Math.round((10 + d * 2.5) / 5) * 5);
  const far = d => d < 0.1 ? S.near : S.km(d.toFixed(1), travel(d));
  const activeOn = (ev, iso) => ev.s <= iso && iso <= ev.e && !ev.off.includes(iso);
  const ended = ev => ev.e < TODAY, oneDay = ev => ev.s === ev.e;
  const openOn = (ev, iso) => ((ev.hx || {})[iso] || [ev.o])[0];
  const closeOn = (ev, iso) => { const h = (ev.hx || {})[iso]; return h ? h[1] : ((ev.late || {})[String(dow(iso))] || ev.c); };
  const cmp = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  const url = p => BASE + p;
  const need = (o, k, what) => { if (!o || o[k] == null) throw new Error('翻訳がありません: ' + what + ' ' + k); return o[k]; };
  const tt = ev => need(T.e, ev.id, 'e')[li * 2], tn = ev => ev.note ? need(T.e, ev.id, 'e')[li * 2 + 1] : '', tv = ev => need(T.v, ev.v, 'v')[li], ts = s => need(T.st, s, 'st')[li];
  const tpS = s => { const p = T.p[s]; if (p && p[li]) return p[li]; const m = s.match(/^一般([\d,]+)円$/); if (m) return EN ? `Adults ¥${m[1]}` : `成人${m[1]}日元`; if (EN) throw new Error('料金の翻訳がありません: ' + s); return s.replace(/円/g, '日元').replace(/・/g, '·'); };
  const tp = ev => tpS(ev.price);
  const AFF = D.AFF || {};
  const affOn = !!(AFF.rakuten || AFF.klook);
  const klookUrl = ev => AFF.klook ? `https://affiliate.klook.com/redirect?aid=${AFF.klook}&aff_adid=${AFF.klookAd}&k_site=${encodeURIComponent(`https://www.klook.com/${L === 'zh' ? 'zh-CN' : 'en-US'}/search/result/?query=${encodeURIComponent(need(T.st, ev.st, 'st')[0] + ' Tokyo')}`)}` : '';
  const affBox = ev => { const u = klookUrl(ev); return u ? `<h2>${S.affH}</h2>
      <div class="row"><a class="go aff" href="${esc(u)}" target="_blank" rel="sponsored noopener">${S.affK(ts(ev.st))}</a></div>
      <p class="cap">${S.affCap}</p>` : ''; };
  const span = ev => oneDay(ev) ? md(ev.s) : md(ev.s) + S.sep + md(ev.e);
  const hrs = ev => ev.g === 'live' ? S.start(ev.o) : `${ev.o}–${ev.c}`;
  const when = ev => `${span(ev)} ${hrs(ev)}`;
  const lateText = ev => { if (!ev.late || !Object.keys(ev.late).length) return ''; const by = new Map(); for (const [k, v] of Object.entries(ev.late)) { if (!by.has(v)) by.set(v, []); by.get(v).push(S.dows[Number(k)]); } return [...by].map(([t, ds]) => S.lateOn(ds, t)).join(S.joiner); };
  const hxText = ev => Object.keys(ev.hx || {}).sort().map(iso => `${md(iso)}: ${ev.hx[iso][0]}–${ev.hx[iso][1]}`).join(S.joiner);
  const jaPath = p => p === '/about/' ? '/about.html' : p;
  const ICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23000'/%3E%3Ctext x='27' y='46' font-size='40' font-weight='900' text-anchor='middle' fill='%23fff' font-family='sans-serif'%3E%E3%82%AD%3C/text%3E%3Ccircle cx='52' cy='42' r='5.5' fill='%23ff4a1c'/%3E%3C/svg%3E";
  const head = (title, desc, path, ld = []) => `<!doctype html>
<html lang="${HL[L]}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="max-image-preview:large">
<link rel="canonical" href="${url(P + path)}">
<meta property="og:url" content="${url(P + path)}">
<link rel="alternate" hreflang="ja" href="${url(jaPath(path))}">
<link rel="alternate" hreflang="en" href="${url('/en' + path)}">
<link rel="alternate" hreflang="zh-Hans" href="${url('/zh' + path)}">
<link rel="alternate" hreflang="x-default" href="${url(jaPath(path))}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${S.loc}">
<meta property="og:site_name" content="${S.site}">
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
<meta name="apple-mobile-web-app-title" content="Kyochika">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=BIZ+UDPGothic:wght@400;700&display=swap">
<link rel="stylesheet" href="/style.css?v=${VER}">
${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>\n`).join('')}</head>
<body>
<div class="wrap">
`;
  const CURRENT = EV.filter(e => !ended(e)), HASIG = CURRENT.some(e => e.ig);
  const GNAV = GKEYS.map(g => [`/${g}/`, S.G[g][1]]).concat([['/free/', S.free], ['/weekend/', S.weekend]], HASIG ? [['/instagram/', 'Instagram']] : []);
  const sign = path => `  <header class="top">
    <a class="brand" href="${P}/"><b>${NAME}<i></i></b><span>KYOCHIKA TOKYO</span></a>
    <nav class="lang" aria-label="Language">${['ja', 'en', 'zh'].map(l => `<a href="${l === 'ja' ? jaPath(path) : '/' + l + path}" lang="${l === 'ja' ? 'ja' : HL[l]}"${l === L ? ' aria-current="true"' : ''}>${LANGNAME[l]}</a>`).join('')}</nav>
    <nav class="gnav" aria-label="${S.lGenre}">${GNAV.map(([p, n]) => `<a href="${P}${p}"${p === path ? ' aria-current="page"' : ''}>${n}</a>`).join('')}</nav>
  </header>
`;
  const crumbs = items => [`  <nav aria-label="Breadcrumb"><ol class="crumbs">${items.map(([n, p]) => p ? `<li><a href="${P}${p}">${esc(n)}</a></li>` : `<li aria-current="page">${esc(n)}</li>`).join('')}</ol></nav>\n`,
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map(([n, p], i) => Object.assign({ '@type': 'ListItem', position: i + 1, name: n }, p ? { item: url(P + p) } : {})) }];
  const order = evs => [...evs].sort((a, b) => cmp(a.e, b.e) || cmp(a.s, b.s) || cmp(a.o, b.o));
  const ways = cur => `  <nav class="ways" aria-label="${S.ways1}">
    <h2>${S.ways1}</h2><div class="links">${GNAV.map(([p, n]) => `<a href="${P}${p}"${p === cur ? ' aria-current="page"' : ''}>${p.length < 12 && S.G[p.slice(1, -1)] ? S.G[p.slice(1, -1)][0] : n}</a>`).join('')}</div>
  </nav>
`;
  const foot = (scripts = ['pages.js']) => `  <p class="follow">${S.follow}</p>
  <p class="foot">${S.foot}${affOn ? ' ' + S.affFoot : ''}</p>
  <nav class="nav"><a href="${P}/">${S.navFind}</a><a href="${P}/app/">${S.navApp}</a><a href="https://www.instagram.com/kyochika.tokyo/" target="_blank" rel="noopener">Instagram @kyochika.tokyo</a><a href="${P}/about/">${S.navAbout}</a></nav>
</div>
${scripts.map(s => `<script src="/${s}?v=${VER}"></script>\n`).join('')}</body>
</html>
`;
  const pic = (ev, eager) => ev.ph ? `<div class="pic"><img src="/photos/${ev.ph}.jpg" alt="${S.alt}" width="384" height="216"${eager ? '' : ' loading="lazy"'}><span class="kind">${S.G[ev.g][0]}</span></div>` : `<div class="pic none"><span class="kind">${S.G[ev.g][0]}</span></div>`;
  const LTM = { art: 'A', live: 'L', food: 'F', market: 'M', festival: 'S', popup: 'P' };
  const card = (ev, eager, i = 0) => `<li class="ev" style="--c:var(--${ev.g})" data-e="${ev.e}"><span class="sn" aria-hidden="true"><b>${LTM[ev.g] || 'E'}</b>${String(i + 1).padStart(2, '0')}</span>`
    + `<div class="hd"><p class="kd">${S.G[ev.g][0]}</p><h2><a href="${P}/event/${ev.id}/">${esc(tt(ev))}</a></h2><p class="where">${esc(tv(ev))}${esc(S.staP(ts(ev.st)))}</p></div>`
    + (ev.ph ? `<a class="th" href="${P}/event/${ev.id}/" tabindex="-1" aria-hidden="true"><img src="/photos/${ev.ph}.jpg" alt="" width="384" height="216"${eager ? '' : ' loading="lazy"'}></a>` : '')
    + `<div class="rest"><p class="when">${when(ev)}</p><p class="meta"><span class="price">${esc(tp(ev))}</span>${ev.free ? `<span class="bd free">${S.ui.free}</span>` : ''}${ev.ig ? `<span class="bd ig">${S.ui.igbd}</span>` : ''}</p>`
    + (ev.note ? `<p class="note">${esc(tn(ev))}</p>` : '')
    + `<a class="off" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.ig ? S.igpost : S.official}</a></div></li>`;
  const itemList = evs => ({ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: evs.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: url(`${P}/event/${e.id}/`), name: tt(e) })) });
  const OUT = {}, PAGES = [];
  const write = (path, text) => { OUT[(P + path + 'index.html').slice(1)] = text; PAGES.push(P + path); };

  for (const ev of EV) {
    const path = `/event/${ev.id}/`;
    const [cr, crLd] = crumbs([[S.home, '/'], [S.G[ev.g][0], `/${ev.g}/`], [tt(ev), null]]);
    const c = mins(ev.c) > mins(ev.o) ? ev.c : '23:59';
    const ld = { '@context': 'https://schema.org', '@type': LDTYPE[ev.g], name: tt(ev), startDate: `${ev.s}T${ev.o}:00+09:00`, endDate: `${ev.e}T${c}:00+09:00`, eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled', inLanguage: HL[L],
      location: { '@type': 'Place', name: tv(ev), address: { '@type': 'PostalAddress', addressRegion: 'Tokyo', addressCountry: 'JP' }, geo: { '@type': 'GeoCoordinates', latitude: ev.lat, longitude: ev.lng } },
      url: url(P + path), sameAs: ev.url, isAccessibleForFree: !!ev.free, description: tn(ev) || tt(ev) };
    if (ev.ph) ld.image = [`${BASE}/photos/${ev.ph}.jpg`];
    if (ev.free) ld.offers = { '@type': 'Offer', price: 0, priceCurrency: 'JPY', availability: 'https://schema.org/InStock', url: ev.url };
    const rows = [[oneDay(ev) ? S.date1 : S.dates, span(ev)],
      [S.time, [(ev.g === 'live' ? `${S.start(ev.o)} (${S.endAbout(ev.c)})` : `${ev.o}–${ev.c}`), lateText(ev), hxText(ev)].filter(x => x).join(S.joiner)],
      [S.price, tp(ev)], [S.venue, tv(ev)], [S.station, S.sta(ts(ev.st))]];
    const spots = Object.entries(SPOTS).map(([n, [la, ln]]) => [km(la, ln, ev.lat, ev.lng), n]).sort((a, b) => a[0] - b[0] || cmp(a[1], b[1])).slice(0, 4);
    const others = CURRENT.filter(x => x.id !== ev.id).map(x => [km(ev.lat, ev.lng, x.lat, x.lng) + ((x.s <= ev.e && x.e >= ev.s) ? 0 : 50), x]).sort((a, b) => a[0] - b[0]).slice(0, 6);
    const maps = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(ev.v.split('（')[0]);
    const body = `${cr}  <main class="page" style="--c:var(--${ev.g})" data-e="${ev.e}" data-detail>
    ${pic(ev, true)}
    <div class="body">
      <h1 class="pt">${esc(tt(ev))}</h1>
      <p class="orig" lang="ja">${S.orig}: ${esc(ev.t)}</p>
      <p class="lead">${esc(tv(ev))}${esc(S.staP(ts(ev.st)))}${ev.free ? ' · ' + S.free : ''}</p>
      ${ev.note ? `<p>${esc(tn(ev))}</p>` : ''}
      <dl class="facts">${rows.map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('')}<dt>${S.venue} (JA)</dt><dd lang="ja">${esc(ev.v)}</dd></dl>
      <p class="cap">${ev.ig ? S.capIg : S.capHours}</p>
      <div class="row"><a class="go pri" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.ig ? S.chkIg : S.chkOff}</a><a class="go" href="${maps}" target="_blank" rel="noopener">${S.map}</a></div>
      <h2>${S.fromH}</h2>
      <dl class="facts">${spots.map(([d, n]) => `<dt>${S.fromSt(ts(n))}</dt><dd>${far(d)}</dd>`).join('')}</dl>
      <p class="cap">${S.capDist}</p>
      <h2>${S.nearH}</h2>
      <ul class="near">${others.map(([d, x]) => `<li><a href="${P}/event/${x.id}/">${esc(tt(x))}</a><span>${esc(tv(x))}${esc(S.staP(ts(x.st)))} · ${S.fromHere(far(km(ev.lat, ev.lng, x.lat, x.lng)))} · ${span(x)}</span></li>`).join('')}</ul>
      ${affBox(ev)}
      ${ev.ph ? `<p class="cap">${S.capPhoto}</p>` : ''}
      <p class="upd">${S.upd(ymd(TODAY), ev.ig)}</p>
    </div>
  </main>
`;
    const title = S.evTitle(tt(ev), tv(ev), ts(ev.st));
    const desc = S.evDesc(S.kind[ev.g], tv(ev), ts(ev.st), span(ev), hrs(ev), tp(ev), tn(ev));
    write(path, head(title, desc, path, [ld, crLd]) + sign(path) + body + ways() + foot());
  }

  const listPage = (path, h1, title, desc, evs0, crumbName) => {
    const evs = order(evs0), [cr, crLd] = crumbs([[S.home, '/'], [crumbName, null]]);
    const body = `${cr}  <h1 class="pt">${esc(h1)}</h1>
  <p class="intro">${esc(desc)}</p>
  <div class="board"><span>${S.endSoon}</span><b>${S.n(evs.length)}</b></div>
  <ul class="list">${evs.map((e, i) => card(e, i < 2, i)).join('')}</ul>
  <p class="upd">${S.listUpd(ymd(TODAY))}</p>
`;
    write(path, head(title, desc, path, [itemList(evs), crLd]) + sign(path) + body + ways(path) + foot());
  };
  for (const g of GKEYS) { const evs = CURRENT.filter(e => e.g === g), gn = S.G[g][0]; listPage(`/${g}/`, S.gH1(gn), S.gTitle(gn), S.gDesc(gn, evs.length, evs.filter(e => e.free).length), evs, gn); }
  { const evs = CURRENT.filter(e => e.free); listPage('/free/', S.freeH1, `${S.freeH1} | ${S.site}`.replace(' | ', EN ? ' | ' : '｜'), S.freeDesc(evs.length), evs, S.free); }
  if (HASIG) { const evs = CURRENT.filter(e => e.ig); listPage('/instagram/', S.igH1, `${S.igH1}${EN ? ' | ' : '｜'}${S.site}`, S.igDesc(evs.length), evs, S.ig); }

  {
    const t = dnum(TODAY), sat = t + ((6 - dow(TODAY)) % 7 + 7) % 7, wk = [isoOf(sat), isoOf(sat + 1)];
    if (isoOf(sat + 2) in HOLIDAYS) wk.push(isoOf(sat + 2));
    const evs = EV.filter(e => wk.some(x => activeOn(e, x))), rng = md(wk[0]) + S.sep + md(wk[wk.length - 1]);
    const [cr, crLd] = crumbs([[S.home, '/'], [S.weekend, null]]);
    let byDay = '';
    for (const x of wk) {
      const es = evs.filter(e => activeOn(e, x)).map(e => [(oneDay(e) || e.g === 'live') ? 0 : 1, mins(openOn(e, x)), e]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(p => p[2]);
      byDay += `<h2>${S.wkDay(md(x), es.length)}</h2><ul class="near">${es.map(e => `<li><a href="${P}/event/${e.id}/">${esc(tt(e))}</a><span>${esc(tv(e))}${esc(S.staP(ts(e.st)))} · ${e.g === 'live' ? S.start(openOn(e, x)) : openOn(e, x) + '–' + closeOn(e, x)} · ${esc(tp(e))}</span></li>`).join('')}</ul>`;
    }
    const desc = S.wkDesc(evs.length, rng);
    const body = `${cr}  <h1 class="pt">${S.wkH1(rng)}</h1>
  <p class="intro">${desc}</p>
  <p class="over" data-until="${wk[wk.length - 1]}" hidden>${S.wkOver}</p>
  <main class="page"><div class="body">${byDay}</div></main>
  <p class="upd">${S.listUpd(ymd(TODAY))}</p>
`;
    write('/weekend/', head(`${S.wkH1(rng)}${EN ? ' | ' : '｜'}${S.site}`, desc, '/weekend/', [itemList(evs), crLd]) + sign('/weekend/') + body + ways('/weekend/') + foot());
  }

  {
    const cnt = GKEYS.map(g => [g, CURRENT.filter(e => e.g === g).length]).filter(([, n]) => n);
    const desc = S.idxDesc(CURRENT.length);
    const siteLd = { '@context': 'https://schema.org', '@type': 'WebSite', name: S.site, alternateName: 'キョウチカ', url: BASE + P + '/', inLanguage: HL[L], description: desc };
    const LT = {art:'A',live:'L',food:'F',market:'M',festival:'S',popup:'P'};
    const lines = cnt.map(([g, n]) => `<a href="${P}/${g}/" style="--c:var(--${g})"><i>${LT[g]}</i>${S.G[g][1]}<b>${n}</b></a>`).join('');
    const nv = new Set(CURRENT.map(e => e.v)).size;
    const body = `  <section class="hero">
    <h1>${S.h1}</h1>
    <div class="plate" aria-label="${S.plate[1]}">
      <p class="pl-big" id="plBig">${S.plate[0]}</p>
      <p class="pl-sub" id="plSub"></p>
      <div class="pl-band"><button type="button" id="plPrev" data-act="dstep" aria-label="${S.plate[2]}"><span id="plPrevT"></span></button><button type="button" id="plNext" data-act="dstep" aria-label="${S.plate[3]}"><span id="plNextT">${S.plate[4]}</span></button></div>
    </div>
    <p class="sub">${S.sub2(CURRENT.length, nv)}</p>
    <nav class="lines" aria-label="${S.lGenre}">${lines}</nav>
  </section>
  <section class="ctl" aria-label="${S.lFilt}">
    <div><span class="lab">${S.lDay}</span><div class="days" id="days"></div><label class="other">${S.lOther} <input type="date" id="otherDay"></label></div>
    <div><span class="lab">${S.lFrom}</span><div class="chips scroll" id="from"></div></div>
    <div><span class="lab">${S.lGenre}</span><div class="chips" id="genres"></div></div>
    <div><span class="lab">${S.lFilt}</span><div class="chips scroll" id="filters"></div></div>
  </section>

  <div class="board" id="board" aria-live="polite"><span>${S.listed}</span><b>${S.n(CURRENT.length)}</b></div>
  <ul class="list" id="list">${order(CURRENT).map((e, i) => card(e, i < 2, i)).join('')}</ul>

  <p class="intro">${S.intro(cnt.map(([g, n]) => S.cnt(S.G[g][0], n)).join(S.cntJoin), ymd(TODAY))}</p>
`;
    write('/', head(S.idxTitle, desc, '/', [siteLd, itemList(order(CURRENT))]) + sign('/') + body + ways() + foot(['data.js', `i18n.${L}.js`, 'app.js']));
  }
  for (const [path, t, d, html] of [['/about/', S.aboutT, S.aboutD, S.about], ['/app/', S.appT, S.appD, S.app]]) {
    const [cr, crLd] = crumbs([[S.home, '/'], [t, null]]);
    write(path, head(`${t}${EN ? ' | ' : '｜'}${S.site}`, d, path, [crLd]) + sign(path) + cr + `  <main class="doc">\n    <h1 class="pt">${t}</h1>\n${html}\n  </main>\n` + ways() + foot());
  }
  const KT = { lang: L, pre: P, ui: S.ui, g: {}, st: {}, v: {}, p: {}, e: {} };
  for (const g of Object.keys(GENRES)) KT.g[g] = S.G[g][0];
  for (const k of new Set(EV.map(e => e.st).concat(Object.keys(SPOTS)))) KT.st[k] = ts(k);
  for (const e of EV) { KT.v[e.v] = tv(e); KT.p[e.price] = tp(e); KT.e[e.id] = [tt(e), tn(e)]; }
  OUT[`i18n.${L}.js`] = '// ' + (EN ? 'English' : '中文') + ' の表示用のことば。build から作られます。\nconst KT=' + JSON.stringify(KT) + ';\n';
  return { files: OUT, pages: PAGES };
}
function kyochikaAll(buildJa, buildIntl, D, T, about, TODAY, VER) {
  const D2 = Object.assign({}, D, { LANGS: ['en', 'zh'], AFF: D.AFF || KYOCHIKA_AFF });
  const r = buildJa(D2, about, TODAY, VER), files = Object.assign({}, r.files);
  let extra = '';
  for (const L of ['en', 'zh']) { const x = buildIntl(D2, T, L, TODAY, VER); Object.assign(files, x.files); extra += x.pages.map(p => `  <url><loc>https://kyochika.jp${p}</loc><lastmod>${TODAY}</lastmod><priority>${p.split('/').length <= 4 ? '0.7' : '0.5'}</priority></url>\n`).join(''); }
  files['sitemap.xml'] = files['sitemap.xml'].replace('</urlset>', extra + '</urlset>');
  return { files, pages: r.pages };
}
if (typeof module !== 'undefined') module.exports = { kyochikaIntl, kyochikaAll };
