const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'index.js');
const content = fs.readFileSync(filePath, 'utf-8');

// Strip comments and excessive whitespace for size check
const minified = content
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*/g, '')
  .replace(/\n\s*\n/g, '\n')
  .trim();

const bytes = Buffer.byteLength(minified, 'utf-8');
const limit = 2048;

console.log(`Core library size: ${bytes} bytes (limit: ${limit} bytes)`);

if (bytes > limit) {
  console.log(`FAIL: Core library exceeds ${limit} byte limit (${bytes} bytes)`);
  process.exit(1);
} else {
  console.log('PASS: Core library is within size budget');
}
