import { generateOgImage } from '@/lib/server/seo/og/Generate';

const image = await generateOgImage({
  title: 'Building Production OG Images',
  description: 'A step-by-step guide to dynamic social cards.',
  author: 'Alexandre Gomes',
  date: 'Apr 10, 2026',
});

// ⚠️ you're generating WEBP
await Bun.write(`${import.meta.dir}/test-og.webp`, image);

console.log('✅ Saved to test-og.webp');
