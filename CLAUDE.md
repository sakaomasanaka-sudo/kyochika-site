# キョウチカ（kyochika.jp）作業メモ

## 多言語（2026-10-13〜）
- ページは ja / en / zh / es / th / id。en・zh の訳は src/tr.json（これまでどおり、ないと gen.js が止まる）。
- es・th・id の訳は src/tr_es.json / src/tr_th.json / src/tr_id.json。形は
  `{"e":{"催しid":["タイトル","説明"]},"v":{"会場(日本語)":"訳"},"p":{"料金(日本語)":"訳"},"st":{"駅(日本語)":"訳"}}`。
  ないものは英語で表示される（止まらない）。
- 催しを足したら、tr.json の en・zh に加えて、tr_es / tr_th / tr_id にもタイトルと説明の訳を入れる（英語の訳から訳してよい）。
  スペイン語は中立的な表現、タイ語は自然な口語寄り、インドネシア語はくだけすぎない標準語。固有名詞は英語表記のままでよい。
- JSON はコンパクトに書く（separators=(',', ':')、ensure_ascii=False）。
- 書き出し: `node tools/gen.js YYYY-MM-DD 版`。版は最新の「版を◯に」の数字を使う。
