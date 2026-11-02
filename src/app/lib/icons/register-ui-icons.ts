// src/lib/icons/register-ui-icons.ts
import { addCollection, type IconifyIcon } from '@iconify/react';
import { convertParsedSVG, parseSVGContent } from '@iconify/utils';

// Vite loads every SVG in the folder as a string at build time.
const files = import.meta.glob<string>('/src/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const icons: Record<string, IconifyIcon> = {};

for (const [path, rawSvg] of Object.entries(files)) {
  const name = path
    .split('/')
    .pop()!
    .replace(/\.svg(\?raw)?$/i, '')
    .toLowerCase();

  if (!rawSvg) continue;

  // 1. Strip the <?xml ...?> tag and any leading whitespace
  let svg = rawSvg.replace(/^<\?xml[^?]*\?>/i, '').trim();

  // 2. Fallback: Iconify requires viewBox. If missing, inject it from width/height attributes
  if (!svg.includes('viewBox=') && svg.includes('width=') && svg.includes('height=')) {
    const widthMatch = svg.match(/width="(\d+)"/);
    const heightMatch = svg.match(/height="(\d+)"/);
    if (widthMatch && heightMatch) {
      const w = widthMatch[1];
      const h = heightMatch[1];
      svg = svg.replace('<svg', `<svg viewBox="0 0 ${w} ${h}"`);
    }
  }

  const parsed = parseSVGContent(svg);
  const icon = parsed ? convertParsedSVG(parsed) : null;

  if (icon) {
    icons[name] = icon;
  } else {
    console.warn(`[icons] could not parse icon asset: ${name}`);
  }
}

addCollection({ prefix: 'ui', icons });
