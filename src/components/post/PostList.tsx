import type { Post } from '@/lib/posts';
import { PostItem } from './PostItem';

/** 글 목록. 패널(흰 면) 안에 놓고 글 사이에 가로선을 긋는다. headingAs: 목록 바로 위 제목이 h1이면 'h2' */
export function PostList({ posts, headingAs }: { posts: Post[]; headingAs?: 'h2' | 'h3' }) {
  if (posts.length === 0) {
    return <p className="py-80 text-center text-15 text-muted">아직 올라온 글이 없어요. 첫 글을 준비하고 있어요.</p>;
  }

  return (
    <ul className="divide-y divide-line">
      {posts.map((post) => (
        <li key={post.id} className="py-20 first:pt-0 last:pb-0 md:py-24">
          <PostItem post={post} headingAs={headingAs} />
        </li>
      ))}
    </ul>
  );
}
