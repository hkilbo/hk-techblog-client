import type { Post } from '@/lib/posts';

// 인터뷰 캐러셀 카드. 커리업 일잼원정대처럼 흰 카드에 3:2 사진, 사람 라벨, 제목, 날짜
export function InterviewCard({ post }: { post: Post }) {
  return (
    <a href={`/posts/${post.id}/`} className="group block h-full overflow-hidden rounded-16 bg-background">
      <div className="relative aspect-3/2 overflow-hidden">
        <img
          src={post.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-24">
        <p className="text-14 font-bold text-accent">{`${post.author.name} · ${post.author.role}`}</p>
        <h3 className="mt-8 line-clamp-2 text-18 font-bold text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        <p className="mt-12 text-12 text-muted">
          <time dateTime={post.publishedAt}>{post.publishedAt.replaceAll('-', '.')}</time>
        </p>
      </div>
    </a>
  );
}
