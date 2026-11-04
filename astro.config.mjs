import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://tech.hankookilbo.com',
  integrations: [mdx(), react()],
  vite: { plugins: [tailwindcss()] },
  // 목업 사진(Unsplash)도 빌드 때 받아 webp로 줄인다. 실제 사진으로 바꾸면 지운다
  image: { domains: ['images.unsplash.com'] },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
