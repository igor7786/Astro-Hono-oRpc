import { generateOgImage } from './Generate';

const image = await generateOgImage({
  title: 'Building Production OG Images',
  description: 'A step-by-step guide to dynamic social cards.',
  author: 'Igor',
  date: 'Apr 10, 2026',
});

// ⚠️ you're generating WEBP
await Bun.write('./test-og.png', image);

console.log('✅ Saved to test-og.webp');
