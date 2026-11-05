import type { PostCategory, TechTopic } from '@/lib/posts';

// 라벨을 Record로 적어 두면 PostCategory·TechTopic에 값이 늘 때 라벨이 빠진 채로는 타입 검사를 통과하지 못한다

export const CATEGORY_LABEL: Record<PostCategory, string> = { tech: 'Tech', product: 'Product', culture: 'Culture' };

/** GNB·카테고리 띠지 순서. 주소는 /<category>/ (src/pages/<category>.astro) */
export const POST_CATEGORIES = (Object.keys(CATEGORY_LABEL) as PostCategory[]).map((value) => ({
  value,
  label: CATEGORY_LABEL[value],
}));

export const TOPIC_LABEL: Record<TechTopic, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  'ai-db': 'AI/DB',
  cloud: 'Cloud',
};

/** Tech 세부 분야 칩 순서. 토스 테크의 직무 카테고리(Frontend·AI/ML·Data·Infra)를 참고해 4개로 묶었다 */
export const TECH_TOPICS = (Object.keys(TOPIC_LABEL) as TechTopic[]).map((value) => ({
  value,
  label: TOPIC_LABEL[value],
}));
