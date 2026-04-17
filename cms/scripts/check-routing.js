const fs = require('fs');
const p = 'node_modules/@strapi/core/dist/services/server/routing.js';
const c = fs.readFileSync(p, 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('singleType') || l.includes('single') || l.includes('compose')) {
    console.log(i + 1, l.substring(0, 150));
  }
});
