const fs = require('fs');
const https = require('https');
const zlib = require('zlib');
const path = require('path');

// A simple script to download a JSON or buffer and extract info if needed.
// Wait, a .lottie is a ZIP file. I can use the built-in 'zlib' and some zip parsing? No, 'adm-zip' package is better.
// We can use npx to run a script with dependencies.
