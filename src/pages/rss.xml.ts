import type { APIContext } from 'astro';
import rss from '@astrojs/rss';
import { postPath, withBase } from '@/lib/paths';
import { getPosts } from '@/lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: '한국일보 기술 블로그',
    description: '다양한 관점과 아이디어를 디지털 서비스로 구현하는 한국일보 개발팀의 기술과 개발 이야기를 공유합니다.',
    // 채널 주소 = astro.config의 site + base. 글 link도 base를 붙여 하위 경로 배포에서도 맞는다
    site: new URL(withBase('/'), context.site ?? 'https://tech.hankookilbo.com').href,
    items: posts.map((post) => ({
      title: post.title,
      description: post.summary,
      pubDate: new Date(post.publishedAt),
      link: postPath(post.id),
      categories: post.tags,
    })),
    customData: '<language>ko-kr</language>',
  });
}
