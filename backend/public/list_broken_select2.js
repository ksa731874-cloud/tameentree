const fs = require('fs');
const path = 'd:/تيست كودات جميع المواقع/تامين مركبات/backend/public/select.html';
const text = fs.readFileSync(path, 'utf8');
const rx = /[ØÙ][^\s<]{5,}/g;
const raw = text.match(rx) || [];
const uniq = [...new Set(raw)];
uniq.sort((a,b)=>a.length-b.length);
console.log(uniq.join('\n'));
