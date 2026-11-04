import type { PostCategory, TechTopic } from '@/lib/posts';

/** GNB·카테고리 띠지 순서. 주소는 /<category>/ (src/pages/<category>.astro) */
export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'tech', label: 'Tech' },
  { value: 'product', label: 'Product' },
  { value: 'culture', label: 'Culture' },
];

export const CATEGORY_LABEL = Object.fromEntries(POST_CATEGORIES.map((c) => [c.value, c.label])) as Record<
  PostCategory,
  string
>;

/** Tech 세부 분야 칩 순서. 토스 테크의 직무 카테고리(Frontend·AI/ML·Data·Infra)를 참고해 4개로 묶었다 */
export const TECH_TOPICS: { value: TechTopic; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'ai-db', label: 'AI/DB' },
  { value: 'cloud', label: 'Cloud' },
];

export const TOPIC_LABEL = Object.fromEntries(TECH_TOPICS.map((t) => [t.value, t.label])) as Record<TechTopic, string>;
