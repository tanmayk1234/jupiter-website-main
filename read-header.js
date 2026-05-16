import fs from 'fs';
const buf = fs.readFileSync('test.lottie');
console.log(buf.slice(0, 50).toString());
