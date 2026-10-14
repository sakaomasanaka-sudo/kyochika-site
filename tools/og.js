// 催しごとのシェア用画像（site/og/<id>.jpg、1200x630）を作る。
// site/og/manifest.json（build.js が書く）と site/og/done.json（作り終えた id → hash）をくらべて、変わったものだけ作る。
// 使い方: node tools/og.js   （gen.js からも呼ばれる）。playwright が無い環境では何もしない。
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..'), DIR = path.join(R, 'site', 'og');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function html(d) {
  const n = [...d.t].length, fs1 = n <= 14 ? 76 : n <= 24 ? 64 : n <= 36 ? 54 : n <= 52 ? 46 : 40;
  const tags = [d.p === '無料' ? '<b class="free">無料</b>' : '', d.k ? `<b>${esc(d.k)}</b>` : '', d.dog ? '<b>愛犬OK</b>' : ''].join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#fff;font-family:'Noto Sans CJK JP','Noto Sans JP',sans-serif;color:#111;position:relative;overflow:hidden}
.band{position:absolute;left:0;top:0;bottom:0;width:28px;background:${d.c}}
.top{position:absolute;left:70px;right:60px;top:46px;display:flex;align-items:center;gap:14px;font-weight:900;font-size:28px}
.top i{display:inline-block;width:18px;height:18px;border-radius:50%;background:#ff4a1c}
.t{position:absolute;left:70px;right:70px;top:120px;font-weight:900;font-size:${fs1}px;line-height:1.22;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;word-break:break-all}
.meta{position:absolute;left:70px;right:70px;bottom:118px;font-size:34px;font-weight:700;line-height:1.45}
.meta span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tags{position:absolute;left:70px;bottom:48px;display:flex;gap:12px}
.tags b{font-size:28px;padding:6px 16px;border:3px solid #111;border-radius:10px}
.tags b.free{background:#ffd100;border-color:#ffd100}
.url{position:absolute;right:60px;bottom:52px;font-size:30px;font-weight:900;background:#ffd100;padding:6px 18px}
</style></head><body><div class="band"></div>
<div class="top">キョウチカ<i></i><span style="font-weight:700;font-size:24px;color:#555">東京のイベントを、行く日と駅から</span></div>
<div class="t">${esc(d.t)}</div>
<div class="meta"><span>📅 ${esc(d.d)}</span><span>📍 ${esc(d.v)}（${esc(d.st)}駅）</span></div>
<div class="tags">${tags}</div><div class="url">kyochika.jp</div></body></html>`;
}

async function run(max = 2000) {
  let pw; try { pw = require('/opt/npm-tools/node_modules/playwright'); } catch (e) { try { pw = require('playwright'); } catch (e2) { console.log('og: playwright が無いので画像は作りません'); return 0; } }
  const man = JSON.parse(fs.readFileSync(path.join(DIR, 'manifest.json'), 'utf8'));
  const donePath = path.join(DIR, 'done.json');
  let done = {}; try { done = JSON.parse(fs.readFileSync(donePath, 'utf8')); } catch (e) { }
  const todo = Object.entries(man).filter(([id, d]) => done[id] !== d.h || !fs.existsSync(path.join(DIR, id + '.jpg'))).slice(0, max);
  if (!todo.length) { console.log('og: 新しく作る画像はありません'); return 0; }
  let browser; try { browser = await pw.chromium.launch(); } catch (e) { try { browser = await pw.chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); } catch (e2) { console.log('og: ブラウザを起動できないので画像は作りません'); return 0; } }
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  let n = 0;
  for (const [id, d] of todo) {
    try {
      await page.setContent(html(d), { waitUntil: 'load' });
      await page.screenshot({ path: path.join(DIR, id + '.jpg'), type: 'jpeg', quality: 82 });
      done[id] = d.h; n++;
      if (n % 50 === 0) fs.writeFileSync(donePath, JSON.stringify(done));
    } catch (e) { console.log('og: 失敗', id, e.message); }
  }
  await browser.close();
  fs.writeFileSync(donePath, JSON.stringify(done));
  console.log('og:', n, '枚を作りました');
  return n;
}
if (require.main === module) run().catch(e => { console.error(e); process.exit(1); });
module.exports = { run, html };
