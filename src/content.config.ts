import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection, reference } from 'astro:content';

// 글은 content/posts/<id>/index.md(x). 폴더 이름이 id이고 주소 /posts/<id>/가 된다.
// frontmatter가 이 스키마와 다르면 빌드가 실패하고 배포되지 않는다.
const posts = defineCollection({
  loader: glob({ base: './content/posts', pattern: '**/index.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      category: z.enum(['tech', 'product', 'culture']),
      /** Tech 글만 */
      topic: z.enum(['frontend', 'backend', 'ai-db', 'cloud']).optional(),
      /** 개발자 인터뷰만. author가 인터뷰한 사람이다 */
      kind: z.literal('interview').optional(),
      /** 시리즈 글만. order는 1부터 */
      series: z.object({ id: reference('series'), order: z.number().int().positive() }).optional(),
      tags: z.array(z.string()).default([]),
      author: z.object({ name: z.string(), role: z.string() }),
      publishedAt: z.coerce.date(),
      readingMinutes: z.number().int().positive(),
      cover: image(),
    }),
});

// 시리즈는 content/series/<id>.yaml. 표지는 같은 폴더에 둔다
const series = defineCollection({
  loader: glob({ base: './content/series', pattern: '*.yaml' }),
  schema: ({ image }) => z.object({ title: z.string(), description: z.string(), cover: image() }),
});

export const collections = { posts, series };
