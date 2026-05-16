import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';
import path from 'path';

import AdmZip from 'adm-zip';

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

const removeUnwantedLayers = (layers) => {
  if (!layers) return layers;
  return layers.filter(l => {
    const name = (l.nm || '').toLowerCase();
    if (name.includes('capture') || name.includes('amplify') || name.includes('create') || name.includes('bolletje') || name.includes('blauw')) {
      console.log('Removing layer:', l.nm);
      return false;
    }
    return true;
  }).map(l => {
    if (l.layers) {
      l.layers = removeUnwantedLayers(l.layers);
    }
    return l;
  });
};

function processLottie(url, outFilename) {
  return new Promise((resolve) => {
    const zipName = outFilename.replace('.lottie', '.zip');
    https.get(url, (res) => {
      const dest = fs.createWriteStream(zipName);
      res.pipe(dest);
      dest.on('finish', () => {
        console.log(`Downloaded ${outFilename}. Extracting with adm-zip...`);
        const zip = new AdmZip(zipName);
        const extractDir = 'lottie_temp_' + outFilename;
        zip.extractAllTo(extractDir, true);
        
        const animPath = path.join(extractDir, 'animations', 'animation.json');
        let data = JSON.parse(fs.readFileSync(animPath, 'utf8'));
        
        data.layers = removeUnwantedLayers(data.layers);
        if (data.assets) {
          data.assets = data.assets.map(asset => {
            if (asset.layers) {
              asset.layers = removeUnwantedLayers(asset.layers);
            }
            return asset;
          });
        }
        
        fs.writeFileSync(animPath, JSON.stringify(data));
        
        console.log(`Re-zipping ${outFilename}...`);
        const outZip = new AdmZip();
        outZip.addLocalFolder(extractDir);
        outZip.writeZip(`public/${outFilename}`);
        fs.rmSync(extractDir, { recursive: true, force: true });
        fs.unlinkSync(zipName);
        console.log(`Done! Saved to public/${outFilename}`);
        resolve();
      });
    });
  });
}

async function main() {
  await processLottie(
    'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b6ade2cd438e9b11a95_WGB_Loop_Zwart_Transparant_1000x1000.lottie',
    'loop.lottie'
  );
  await processLottie(
    'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b0fa481c63dd41c659b_WGB_Preloader_Orbit_Blueflow.lottie',
    'preloader.lottie'
  );
  await processLottie(
    'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996e894cc60581e3809b70b_5e1623f61e8588ecd8933bab16c4e6c5_Comp%201.lottie',
    'loader.lottie'
  );
}

main();
