// src/ のデータと tools/ の build.js・intl.js で site/ に全ページを書き出す。
// 使い方: node tools/gen.js 更新日(YYYY-MM-DD) 版
const fs = require('fs'), path = require('path');
const R = path.join(__dirname, '..');
const build = require('./build.js'); const { kyochikaIntl, kyochikaAll } = require('./intl.js');
const src = f => fs.readFileSync(path.join(R, 'src', f), 'utf8');
const D = new Function(src('data.js') + ';return {EV,SPOTS,GENRES,CRED,HOLIDAYS};')();
const T = JSON.parse(src('tr.json'));
const today = process.argv[2] || new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const r = kyochikaAll(build, kyochikaIntl, D, T, src('about_main.html'), today, process.argv[3] || '12');
const out = Object.assign({}, r.files, { 'data.js': src('data.js'), 'app.js': src('app.js'), 'style.css': src('style.css') });
for (const [p, t] of Object.entries(out)) { const f = path.join(R, 'site', p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, t); }
console.log(Object.keys(out).length, 'files', today);
