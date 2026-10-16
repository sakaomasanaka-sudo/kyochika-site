// src/ のデータと tools/ の build.js・intl.js で site/ に全ページを書き出す。
// 使い方: node tools/gen.js 更新日(YYYY-MM-DD) 版
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const build = require('./build.js'); const { kyochikaIntl, kyochikaAll } = require('./intl.js');
const src = f => fs.readFileSync(path.join(R, 'src', f), 'utf8');
const D = new Function(src('data.js') + ';return {EV,SPOTS,GENRES,CRED,HOLIDAYS,SPOT_GROUPS};')();
const T = JSON.parse(src('tr.json'));
T.x = {}; for (const l of ['es', 'th', 'id']) { try { T.x[l] = JSON.parse(src(`tr_${l}.json`)); } catch (e) { T.x[l] = null; } }
try { D.GUIDES = JSON.parse(src('guides.json')); } catch (e) { D.GUIDES = []; }
const today = process.argv[2] || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
// 作り終えたシェア用画像（site/og/done.json）。ある催しだけ og:image を催しの画像にする。
const readDone = () => { try { return JSON.parse(fs.readFileSync(path.join(R, 'site', 'og', 'done.json'), 'utf8')); } catch (e) { return {}; } };
const writeAll = () => {
  D.OGDONE = readDone();
  const r = kyochikaAll(build, kyochikaIntl, D, T, src('about_main.html'), today, process.argv[3] || '12');
  const out = Object.assign({}, r.files, { 'data.js': src('data.js'), 'app.js': src('app.js'), 'style.css': src('style.css'), 'config.js': src('config.js') });
  for (const [p, t] of Object.entries(out)) { const f = path.join(R, 'site', p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); }
  return Object.keys(out).length;
};
let n = writeAll();
console.log(n, 'files', today);
// シェア用画像を作る（playwright がある環境だけ）。新しく作れたら、og:image を差しかえるためにもう一度書き出す。
if (!process.env.KYOCHIKA_NO_OG) require('./og.js').run().then(k => { if (k) { n = writeAll(); console.log(n, 'files（シェア用画像を反映）', today); } }).catch(e => console.log('og: スキップ', e.message));
