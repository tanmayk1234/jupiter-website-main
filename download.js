import fs from 'fs';
import https from 'https';

https.get('https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996eb2c7a740eb6e1debd8b_69b8f67476355b80033ea66492e38130_cirkels%202.lottie', (res) => {
  const file = fs.createWriteStream('test.lottie');
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Downloaded test.lottie');
  });
});
