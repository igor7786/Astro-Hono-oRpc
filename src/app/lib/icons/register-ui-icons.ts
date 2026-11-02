// src/lib/icons/register-ui-icons.ts
import { addCollection } from '@iconify/react';

type IconSet = Parameters<typeof addCollection>[0];
type IconData = IconSet['icons'][string];

// Vite loads every SVG in the folder as raw text at build time.
const files = import.meta.glob<string>('/src/assets/icons/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function parseSvg(svg: string): IconData {
  const attrs = svg.match(/<svg\b([^>]*)>/i)?.[1] ?? '';
  const body = svg
    .replace(/<\?xml[^>]*\?>/gi, '')
    .replace(/<svg\b[^>]*>/i, '')
    .replace(/<\/svg>\s*$/i, '')
    .trim();

  const viewBox = attrs
    .match(/viewBox\s*=\s*["']([^"']+)["']/i)?.[1]
    ?.trim()
    .split(/[\s,]+/)
    .map(Number);

  if (viewBox?.length === 4 && viewBox.every(Number.isFinite)) {
    const [left, top, width, height] = viewBox;
    return { body, left, top, width, height };
  }

  const width = Number.parseFloat(attrs.match(/\bwidth\s*=\s*["']([\d.]+)/i)?.[1] ?? '24');
  const height = Number.parseFloat(attrs.match(/\bheight\s*=\s*["']([\d.]+)/i)?.[1] ?? '24');
  return { body, width, height };
}

const icons: IconSet['icons'] = {};
for (const [path, svg] of Object.entries(files)) {
  const name = path
    .split('/')
    .pop()!
    .replace(/\.svg$/i, '');
  icons[name] = parseSvg(svg);
}

addCollection({ prefix: 'ui', icons });
