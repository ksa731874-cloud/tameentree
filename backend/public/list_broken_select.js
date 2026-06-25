const fs = require('fs');
const path = 'd:/تيست كودات جميع المواقع/تامين مركبات/backend/public/select.html';
const text = fs.readFileSync(path, 'utf8');
const matches = text.match(/Ø[\x00-\xFF]*?(?=[\s<])/g);
if (!matches) {
  console.log('none');
  process.exit(0);
}
const uniq = [...new Set(matches)];
uniq.sort((a,b)=>a.length-b.length);
console.log(uniq.join('\n'));
