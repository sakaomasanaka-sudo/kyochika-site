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
