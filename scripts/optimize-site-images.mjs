import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const root = 'public';
const backupRoot = 'archived-resources/site-image-originals';
const files = [];
function walk(dir) { for (const item of fs.readdirSync(dir, { withFileTypes: true })) { const file = path.join(dir, item.name); if (item.isDirectory()) walk(file); else if (/\.(jpe?g|png|webp)$/i.test(file)) files.push(file); } }
walk(root);
let before = 0, after = 0, changed = 0;
const changes = [];
for (const file of files) {
  const stat = fs.statSync(file); before += stat.size;
  if (stat.size < 500000 || file.includes('poster-previews')) { after += stat.size; continue; }
  const original = fs.readFileSync(file);
  const meta = await sharp(original).metadata();
  if ((meta.pages ?? 1) > 1) { after += stat.size; continue; }
  let pipeline = sharp(original).rotate().resize({width: 2800, height: 2800, fit: 'inside', withoutEnlargement: true});
  if (/\.jpe?g$/i.test(file)) pipeline = pipeline.jpeg({quality: 90, mozjpeg: true, chromaSubsampling: '4:4:4'});
  else if (/\.png$/i.test(file)) pipeline = pipeline.png({compressionLevel: 9, adaptiveFiltering: true});
  else pipeline = pipeline.webp({lossless: true, effort: 6});
  const result = await pipeline.toBuffer();
  if (result.length < original.length * 0.95) {
    const backup = path.join(backupRoot, path.relative(root, file));
    fs.mkdirSync(path.dirname(backup), {recursive: true});
    if (!fs.existsSync(backup)) fs.writeFileSync(backup, original);
    fs.writeFileSync(file, result); changed++;
    changes.push({file, before: original.length, after: result.length, originalWidth: meta.width, originalHeight: meta.height});
    after += result.length;
  } else after += original.length;
}
console.log(JSON.stringify({scanned: files.length, changed, before, after, saved: before - after, reductionPercent: Math.round((1-after/before)*100), changes}, null, 2));
