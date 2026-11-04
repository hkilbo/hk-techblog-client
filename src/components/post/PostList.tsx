import type { Post } from '@/lib/posts';
import { PostItem } from './PostItem';

export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-16 border border-line py-80 text-center text-15 text-muted">
        아직 올라온 글이 없어요. 첫 글을 준비하고 있어요.
      </p>
    );
  }

  return (
    <ul className="flex max-w-896 flex-col gap-32 md:gap-40">
      {posts.map((post) => (
        <li key={post.id}>
          <PostItem post={post} />
        </li>
      ))}
    </ul>
  );
}
