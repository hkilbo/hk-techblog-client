import { postPath } from '@/lib/paths';
import type { Post } from '@/lib/posts';

// 인터뷰 캐러셀 카드. 벽에 건 거울처럼 카드 안에 3:4 조약돌 모양(rounded-pebble) 사람 사진을 두고, 아래에 사람 라벨·제목·날짜
export function InterviewCard({ post }: { post: Post }) {
  return (
    <a href={postPath(post.id)} className="group block h-full rounded-16 bg-background p-24">
      <div className="relative aspect-3/4 overflow-hidden rounded-pebble">
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <p className="mt-24 text-14 font-bold text-accent">{`${post.author.name} · ${post.author.role}`}</p>
      <h3 className="mt-8 line-clamp-2 text-18 font-bold text-foreground transition-colors group-hover:text-accent">
        {post.title}
      </h3>
      <p className="mt-12 text-12 text-muted">
        <time dateTime={post.publishedAt}>{post.publishedAt.replaceAll('-', '.')}</time>
      </p>
    </a>
  );
}
