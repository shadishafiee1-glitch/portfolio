import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
const ratios = {};
function scan(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? scan(file) : /\.(jpg|jpeg|png|webp)$/i.test(file) ? [file] : [];
  });
}
for (const file of scan("public/resources")) {
  const { width, height } = await sharp(file).metadata();
  ratios[file.replaceAll("\\", "/").replace(/^public\//, "")] = width / height;
}
fs.writeFileSync("src/data/mobile-image-ratios.generated.ts", "// Artwork proportions for the mobile gallery.\nexport const MOBILE_IMAGE_RATIOS: Record<string, number> = " + JSON.stringify(ratios, null, 2) + ";\n");
