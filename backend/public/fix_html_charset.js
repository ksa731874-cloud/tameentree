const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname);
const htmlFiles = fs.readdirSync(dir).filter(file => file.toLowerCase().endsWith('.html'));

function normalizeCharsetMeta(text) {
  const headOpen = /<head\b[^>]*>/i;
  if (!headOpen.test(text)) return text;

  // Normalize any charset meta to canonical form.
  text = text.replace(/<meta\s+charset=["']?utf-8["']?\s*\/?>/gi, '<meta charset="UTF-8">');

  // Remove duplicated charset meta after first, keeping only the first.
  const headMatch = text.match(/<head\b[^>]*>([\s\S]*?)<\//i);
  if (headMatch) {
    const headContent = headMatch[1];
    const charsetMatches = headContent.match(/<meta charset="UTF-8">/g);
    if (charsetMatches && charsetMatches.length > 1) {
      let removed = 0;
      text = text.replace(/<head\b([^>]*)>([\s\S]*?)<\/head>/i, (match, attrs, content) => {
        let firstSeen = false;
        const updated = content.replace(/<meta charset="UTF-8">/g, (m) => {
          if (!firstSeen) {
            firstSeen = true;
            return m;
          }
          removed += 1;
          return '';
        });
        return `<head${attrs}>${updated}</head>`;
      });
    }
  }

  // Ensure first element inside head is the charset meta.
  text = text.replace(/(<head\b[^>]*>)([\s\S]*?)(?=<\/head>)/i, (match, headTag, content) => {
    const trimmed = content.replace(/^\s+/, '');
    if (trimmed.startsWith('<meta charset="UTF-8">')) {
      return headTag + content;
    }

    // If charset meta exists later, move it first.
    const charsetIndex = content.search(/<meta charset="UTF-8">/i);
    if (charsetIndex >= 0) {
      const before = content.slice(0, charsetIndex);
      const after = content.slice(charsetIndex + '<meta charset="UTF-8">'.length);
      return headTag + '<meta charset="UTF-8">' + before + after;
    }

    // Insert at head start if missing.
    return headTag + '<meta charset="UTF-8">' + content;
  });

  return text;
}

for (const file of htmlFiles) {
  const filePath = path.join(dir, file);
  let contents = fs.readFileSync(filePath, 'utf8');
  const normalized = normalizeCharsetMeta(contents);
  if (normalized !== contents) {
    fs.writeFileSync(filePath, normalized, 'utf8');
    console.log(`updated ${file}`);
  } else {
    fs.writeFileSync(filePath, contents, 'utf8');
    console.log(`rewrote ${file}`);
  }
}
