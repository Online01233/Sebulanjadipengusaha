// Memindai semua file .mp4 di folder videos/ dan menulis videos/daftar-otomatis.js
// (videos/videos.js yang kamu isi manual, termasuk link Instagram, TIDAK ditimpa.)
// Sampul (opsional): taruh gambar dengan nama sama, mis. profil.mp4 + profil.jpg
// Jalankan: node scripts/generate-videos.js
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '..', 'videos');
const all = fs.readdirSync(dir);
const files = all.filter((f) => /\.mp4$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
const data = files.map((f) => {
  const base = f.replace(/\.mp4$/i, '');
  const poster = all.find((x) => x.toLowerCase().startsWith(base.toLowerCase() + '.') && /\.(jpe?g|png|webp)$/i.test(x));
  const item = { file: f, title: base.replace(/[_-]+/g, ' ').trim() };
  if (poster) item.poster = poster;
  return item;
});
fs.writeFileSync(
  path.join(dir, 'daftar-otomatis.js'),
  '// File ini dibuat otomatis oleh scripts/generate-videos.js (jangan diedit)\nwindow.VIDEOS_AUTO = ' + JSON.stringify(data, null, 2) + ';\n'
);
console.log(`Selesai: ${data.length} file MP4 terdaftar di videos/daftar-otomatis.js`);
data.forEach((v) => console.log(' - ' + v.file + (v.poster ? '  (sampul: ' + v.poster + ')' : '')));
