<?php
// GitHub の sakaomasanaka-sudo/kyochika-site（main）の site/ を public_html/kyochika.jp に取り込む。
// cron から 10 分おきに `php ~/kyochika-pull.php` で動かす。中身が変わったファイルだけ書きかえる。削除はしない。
// このファイルはホーム（public_html と同じ階層）に置く。
$home = __DIR__;
$dest = $home . '/public_html/kyochika.jp';
$state = $home . '/.kyochika-pull-sha';
$lock = fopen($home . '/.kyochika-pull.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) exit(0);
if (!is_dir($dest)) exit(1);

// ── 利用状況の集計（30分に1回）。人数などの合計だけを書き出す。IP や個人の記録は出さない。
kyochika_stats($home, $dest . '/stats-adba1162b05a7d8cb23efb54.json');
function kyochika_stats($home, $out) {
  if (is_file($out) && time() - filemtime($out) < 1800) return;
  $dir = $home . '/logs/kyochika.jp';
  if (!is_dir($dir)) return;
  $files = glob($dir . '/access_log.*.gz') ?: [];
  rsort($files);
  $files = array_slice($files, 0, 8);
  $files[] = $dir . '/access_log';
  $bot = '/bot|crawl|spider|slurp|preview|python|curl|wget|headless|scan|monitor|java|okhttp|go-http|node|claude|gpt|bing|facebookexternal|meta-external|dataprovider|admake|lighthouse|nexus 5|semrush|ahrefs|petal|yandex|bytespider/i';
  $mine = '/^(126\.79\.99\.|219\.104\.121\.)/';
  $mon = ['Jan'=>1,'Feb'=>2,'Mar'=>3,'Apr'=>4,'May'=>5,'Jun'=>6,'Jul'=>7,'Aug'=>8,'Sep'=>9,'Oct'=>10,'Nov'=>11,'Dec'=>12];
  $rows = [];
  foreach ($files as $f) {
    if (!is_file($f)) continue;
    $lines = substr($f, -3) === '.gz' ? @gzfile($f) : @file($f);
    if (!$lines) continue;
    foreach ($lines as $l) {
      if (!preg_match('/^(\S+) \S+ \S+ \[(\d\d)\/(\w{3})\/(\d{4}):(\d\d)[^\]]*\] "\S+ (\S+)[^"]*" (\d+) \S+ "([^"]*)" "([^"]*)"/', $l, $m)) continue;
      if (preg_match($bot, $m[9]) || preg_match($mine, $m[1])) continue;
      $d = sprintf('%04d-%02d-%02d', $m[4], $mon[$m[3]] ?? 0, $m[2]);
      $rows[] = [$d, $m[1] . '|' . $m[9], $m[6], $m[7], $m[8], (int)$m[5]];
    }
  }
  $vis = [];
  foreach ($rows as $r) if (strpos($r[2], '/style.css') === 0) $vis[$r[0]][$r[1]] = 1;
  $days = [];
  foreach ($rows as $r) {
    [$d, $k, $p, $st, $ref] = $r;
    if (empty($vis[$d][$k])) continue;
    if (!isset($days[$d])) $days[$d] = ['visitors' => count($vis[$d]), 'pv' => 0, 'src' => [], 'top' => [], 'hours' => []];
    $D = &$days[$d];
    $path = explode('?', $p)[0];
    if (preg_match('/\.(css|js|png|jpe?g|ico|json|txt|svg|webp|xml)$/', $path)) { unset($D); continue; }
    if ($st !== '200' && $st !== '304') { unset($D); continue; }
    $D['pv']++;
    $D['top'][$p] = ($D['top'][$p] ?? 0) + 1;
    $s = null;
    if (strpos($p, 'utm_source=chatgpt') !== false || stripos($ref, 'chatgpt') !== false) $s = 'chatgpt';
    elseif (stripos($ref, 'google.') !== false) $s = 'google';
    elseif (stripos($ref, 'yahoo') !== false) $s = 'yahoo';
    elseif (stripos($ref, 'bing.') !== false) $s = 'bing';
    elseif (stripos($ref, 'instagram') !== false || strpos($p, 'utm_source=ig') !== false) $s = 'instagram';
    elseif (stripos($ref, 't.co/') !== false || stripos($ref, 'x.com') !== false) $s = 'x';
    elseif ($ref !== '-' && $ref !== '' && stripos($ref, 'kyochika.jp') === false) $s = 'other';
    if ($s) $D['src'][$s][$k] = 1;
    unset($D);
  }
  $seen = [];
  foreach ($rows as $r) { if (strpos($r[2], '/style.css') === 0 && empty($seen[$r[0]][$r[1]]) && isset($days[$r[0]])) { $seen[$r[0]][$r[1]] = 1; $h = sprintf('%02d', $r[5]); $days[$r[0]]['hours'][$h] = ($days[$r[0]]['hours'][$h] ?? 0) + 1; } }
  foreach ($days as $d => &$D) {
    foreach ($D['src'] as $s => $set) $D['src'][$s] = count($set);
    arsort($D['top']);
    $D['top'] = array_slice($D['top'], 0, 15, true);
    ksort($D['hours']);
  }
  unset($D);
  ksort($days);
  $json = json_encode(['updated' => date('c'), 'note' => 'style.css を読んだブラウザ（IP+UA）を1人と数える。ロボットと運営者を除く。', 'days' => $days], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($json) { file_put_contents($out . '.tmp', $json); rename($out . '.tmp', $out); }
}

// GitHub API が使えるときはコミットが変わったかで判断し、使えないとき（回数制限など）は zip の中身で判断する。
$ctx = stream_context_create(['http' => ['header' => "User-Agent: kyochika-pull\r\nAccept: application/vnd.github+json\r\n", 'timeout' => 30]]);
$info = @file_get_contents('https://api.github.com/repos/sakaomasanaka-sudo/kyochika-site/commits/main', false, $ctx);
$j = $info === false ? null : json_decode($info, true);
$sha = is_array($j) && isset($j['sha']) && preg_match('/^[0-9a-f]{40}$/', $j['sha']) ? $j['sha'] : '';
$prev = is_file($state) ? trim(file_get_contents($state)) : '';
if ($sha !== '' && $prev === $sha) exit(0);
$zipData = @file_get_contents('https://codeload.github.com/sakaomasanaka-sudo/kyochika-site/zip/' . ($sha !== '' ? $sha : 'refs/heads/main'), false, stream_context_create(['http' => ['header' => "User-Agent: kyochika-pull\r\n", 'timeout' => 120]]));
if ($zipData === false || strlen($zipData) < 1000) exit(1);
if ($sha === '') { $sha = 'zip-' . md5($zipData); if ($prev === $sha) exit(0); }
$tmp = tempnam(sys_get_temp_dir(), 'kyz');
file_put_contents($tmp, $zipData);
$zip = new ZipArchive();
if ($zip->open($tmp) !== true) { @unlink($tmp); exit(1); }

$ok = ['html', 'xml', 'txt', 'js', 'css', 'json', 'png', 'jpg', 'jpeg', 'svg', 'ico', 'webp'];
$skip = ['googleff614ddf3321ac24.html', '.htaccess'];
$n = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {
  $name = $zip->getNameIndex($i);
  $p = strpos($name, '/site/');
  if ($p === false || substr($name, -1) === '/') continue;
  if (strpos($name, '/') !== $p) continue; // 「<フォルダ名>/site/」だけ
  $rel = substr($name, $p + 6);
  if ($rel === '' || strpos($rel, '..') !== false || !preg_match('#^[A-Za-z0-9._/-]+$#', $rel)) continue;
  if (in_array($rel, $skip, true)) continue;
  $ext = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
  if (!in_array($ext, $ok, true)) continue;
  $data = $zip->getFromIndex($i);
  if ($data === false) continue;
  $to = $dest . '/' . $rel;
  if (is_file($to) && md5_file($to) === md5($data)) continue;
  $dir = dirname($to);
  if (!is_dir($dir)) mkdir($dir, 0755, true);
  file_put_contents($to . '.tmp', $data);
  rename($to . '.tmp', $to);
  $n++;
}
$zip->close();
@unlink($tmp);
file_put_contents($state, $sha);
file_put_contents($home . '/.kyochika-pull.log', date('c') . " $sha $n\n", FILE_APPEND);
