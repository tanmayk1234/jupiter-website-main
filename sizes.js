import fs from 'fs';
import https from 'https';

const url1 = 'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b0fa481c63dd41c659b_WGB_Preloader_Orbit_Blueflow.lottie';
const url2 = 'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b6ade2cd438e9b11a95_WGB_Loop_Zwart_Transparant_1000x1000.lottie';
const url3 = 'https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996eb2c7a740eb6e1debd8b_69b8f67476355b80033ea66492e38130_cirkels%202.lottie';

function check(url, name) {
  https.get(url, (res) => {
    let size = 0;
    res.on('data', chunk => size += chunk.length);
    res.on('end', () => console.log(name, size));
  });
}
check(url1, 'preloader');
check(url2, 'loop-1000');
check(url3, 'cirkel');
