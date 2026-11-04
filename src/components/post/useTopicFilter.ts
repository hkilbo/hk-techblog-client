import { useState } from 'react';
import type { Post, TechTopic } from '@/lib/posts';

/** topic이 null이면 전체. 목록은 서버에서 받은 그대로 두고 화면에서만 거른다 */
export function useTopicFilter(posts: Post[]) {
  const [topic, setTopic] = useState<TechTopic | null>(null);
  const visiblePosts = topic ? posts.filter((post) => post.topic === topic) : posts;
  return { topic, setTopic, visiblePosts };
}
