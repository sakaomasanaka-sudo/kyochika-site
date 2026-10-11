# キョウチカ（https://kyochika.jp/）公開用

- `src/`：催しのデータ（data.js）、訳（tr.json）、このサイトについて（about_main.html）、そのまま置く app.js・style.css。
- `tools/`：ページを作る build.js（日本語）・intl.js（英語・中国語）と gen.js。
- `node tools/gen.js 2026-10-15 13` で `site/` に全ページを書き出す。
- `site/` をお名前.com のサーバーの public_html/kyochika.jp に取り込んで公開する。
