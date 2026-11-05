import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { copyFile, mkdir, writeFile } from 'node:fs/promises';

// 블로그는 늘 /blog 아래에 있다(tech.hankookilbo.com/blog). 빌드 결과는 dist/blog/에 쓰고, 루트(/)는 /blog/로 넘긴다.
// GitHub Pages가 앞에 붙이는 경로(커스텀 도메인이 없을 때 /hk-techblog-client)는 배포 워크플로가 PAGES_BASE_PATH로
// 넘긴다. 사이트 안 링크는 src/lib/paths.ts의 withBase를 거친다. README '사이트 주소와 /blog' 참고
const BLOG_PATH = '/blog';
const pagesBasePath = process.env.PAGES_BASE_PATH ?? '';
const site = process.env.SITE_URL || 'https://tech.hankookilbo.com';
const base = `${pagesBasePath}${BLOG_PATH}`;

/** 루트에 /blog/로 보내는 index.html을 쓰고, GitHub Pages가 사이트 루트에서만 읽는 404.html을 복사한다 */
function rootRedirect() {
  return {
    name: 'root-redirect',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = new URL('../', dir);
        await mkdir(root, { recursive: true });
        await writeFile(
          new URL('index.html', root),
          `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=${base}/" />
    <link rel="canonical" href="${new URL(`${BLOG_PATH}/`, site).href}" />
    <title>한국일보 기술 블로그</title>
  </head>
  <body>
    <a href="${base}/">한국일보 기술 블로그로 이동</a>
  </body>
</html>
`,
        );
        await copyFile(new URL('404.html', dir), new URL('404.html', root));
      },
    },
  };
}

export default defineConfig({
  site,
  base,
  outDir: `./dist${BLOG_PATH}`,
  integrations: [mdx(), react(), rootRedirect()],
  vite: { plugins: [tailwindcss()] },
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
