import fs from 'fs';
import https from 'https';
import unzipper from 'unzipper';

https.get('https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b0fa481c63dd41c659b_WGB_Preloader_Orbit_Blueflow.lottie', (res) => {
  res.pipe(unzipper.Parse())
    .on('entry', function (entry) {
      if (entry.path.endsWith('.json')) {
        entry.buffer().then(buf => {
          console.log('Preloader dims: ', JSON.parse(buf.toString()).w, JSON.parse(buf.toString()).h);
        });
      } else {
        entry.autodrain();
      }
    });
});

https.get('https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/69a83b6ade2cd438e9b11a95_WGB_Loop_Zwart_Transparant_1000x1000.lottie', (res) => {
  res.pipe(unzipper.Parse())
    .on('entry', function (entry) {
      if (entry.path.endsWith('.json')) {
        entry.buffer().then(buf => {
          console.log('Loop 1000 dims: ', JSON.parse(buf.toString()).w, JSON.parse(buf.toString()).h);
        });
      } else {
        entry.autodrain();
      }
    });
});

https.get('https://cdn.prod.website-files.com/697c605c74f4a5968ab8d9c6/6996eb2c7a740eb6e1debd8b_69b8f67476355b80033ea66492e38130_cirkels%202.lottie', (res) => {
  res.pipe(unzipper.Parse())
    .on('entry', function (entry) {
      if (entry.path.endsWith('.json')) {
        entry.buffer().then(buf => {
          console.log('Cirkels 2 dims: ', JSON.parse(buf.toString()).w, JSON.parse(buf.toString()).h);
        });
      } else {
        entry.autodrain();
      }
    });
});
