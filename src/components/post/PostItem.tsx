import { CATEGORY_LABEL, TOPIC_LABEL } from '@/data/categories';
import { postPath } from '@/lib/paths';
import type { Post } from '@/lib/posts';

/**
 * 글 목록 한 줄. HDS Thumbnail List(News-sm)처럼 글은 왼쪽, 5:3 썸네일은 오른쪽에 두고 테두리·배경은 없다.
 * 글 목록 섬(PostFeed) 안에서도 쓰므로 React로 둔다. .astro에서 그대로 쓰면 빌드 때 HTML만 나온다
 */
export function PostItem({ post, headingAs: Heading = 'h3' }: { post: Post; headingAs?: 'h2' | 'h3' }) {
  return (
    <a href={postPath(post.id)} className="group flex items-start gap-16 md:gap-20">
      <div className="min-w-0 flex-1">
        <p className="text-12 font-extrabold text-muted uppercase md:text-14">
          {CATEGORY_LABEL[post.category]}
          {post.topic && ` · ${TOPIC_LABEL[post.topic]}`}
        </p>
        <Heading className="mt-4 line-clamp-2 text-16 font-semibold text-foreground transition-colors group-hover:text-accent md:text-18">
          {post.title}
        </Heading>
        <p className="mt-8 line-clamp-2 text-14 text-muted">{post.summary}</p>
        <p className="mt-12 text-12 text-muted">
          {post.author.name} · <time dateTime={post.publishedAt}>{post.publishedAt.replaceAll('-', '.')}</time> ·{' '}
          {post.readingMinutes} min
        </p>
      </div>
      <div className="relative aspect-5/3 w-100 shrink-0 overflow-hidden rounded-4 md:w-200">
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    </a>
  );
}
