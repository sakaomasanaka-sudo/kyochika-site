// 新しく変わったページを Bing・Yandex などに IndexNow で知らせる（ChatGPT の検索は Bing を使う）。
// 使い方: node tools/indexnow.js <前のコミット>   （省略時は直前のコミットとの差分）
const { execSync } = require('child_process'); const fs = require('fs'); const path = require('path');
const R = path.join(__dirname, '..'); const key = fs.readFileSync(path.join(__dirname, 'indexnow-key.txt'), 'utf8').trim();
const base = process.argv[2] || 'HEAD~1';
let files = [];
try { files = execSync(`git -C ${R} diff --name-only ${base} HEAD -- site`, { encoding: 'utf8' }).split('\n'); } catch (e) { files = []; }
const urls = files.filter(f => f.endsWith('index.html') || f.endsWith('.html')).map(f => 'https://kyochika.jp/' + f.replace(/^site\//, '').replace(/index\.html$/, '')).slice(0, 10000);
if (!urls.length) { console.log('no urls'); process.exit(0); }
fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host: 'kyochika.jp', key, keyLocation: `https://kyochika.jp/${key}.txt`, urlList: urls }) })
  .then(r => console.log('indexnow', r.status, urls.length)).catch(e => console.log('indexnow error', e.message));
