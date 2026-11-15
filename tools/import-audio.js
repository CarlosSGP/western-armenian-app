// Unpacks a parev-recordings.json export into audio/<id>.<ext> files plus audio/manifest.json,
// which the app reads so that everyone who opens the course hears the clips.
// Usage: node tools/import-audio.js path/to/parev-recordings.json
const fs = require('fs'), path = require('path');
const src = process.argv[2];
if (!src) { console.error('Usage: node tools/import-audio.js parev-recordings.json'); process.exit(1); }
const clips = JSON.parse(fs.readFileSync(src, 'utf8'));
const dir = path.join(__dirname, '..', 'audio'), mp = path.join(dir, 'manifest.json');
fs.mkdirSync(dir, { recursive: true });
const manifest = fs.existsSync(mp) ? JSON.parse(fs.readFileSync(mp, 'utf8')) : {};
for (const id in clips) {
  if (!/^[0-9a-f]{8}$/.test(id)) continue;
  const mime = clips[id].mime || '', ext = /mp4|aac|m4a/.test(mime) ? 'm4a' : /ogg/.test(mime) ? 'ogg' : 'webm';
  fs.writeFileSync(path.join(dir, id + '.' + ext), Buffer.from(clips[id].data, 'base64'));
  manifest[id] = id + '.' + ext;
}
fs.writeFileSync(mp, JSON.stringify(manifest));
console.log(Object.keys(manifest).length + ' clips in audio/');
