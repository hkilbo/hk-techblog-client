import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { getPosts } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: '한국일보 기술 블로그',
    description: '한국일보 개발자와 프로덕트 팀이 일하면서 배운 것, 고민한 것, 만든 것을 씁니다.',
    // astro.config의 site. 커스텀 도메인 주소가 들어간다
    site: context.site ?? 'https://tech.hankookilbo.com',
    items: posts.map((post) => ({
      title: post.title,
      description: post.summary,
      pubDate: new Date(post.publishedAt),
      link: `/blog/${post.id}/`,
      categories: post.tags,
    })),
    customData: '<language>ko-kr</language>',
  });
}
