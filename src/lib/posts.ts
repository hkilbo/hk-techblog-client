import { getImage } from 'astro:assets';
import { type CollectionEntry, getCollection, getEntry, render } from 'astro:content';

export type PostCategory = 'tech' | 'product' | 'culture';

/** Tech 글의 세부 분야. 이름은 data/categories.ts의 TECH_TOPICS에 있다 */
export type TechTopic = 'frontend' | 'backend' | 'ai-db' | 'cloud';

/** 화면이 쓰는 글 모양. content/posts의 frontmatter를 getPosts가 이 모양으로 바꾼다(스키마는 src/content.config.ts) */
export interface Post {
  /** 주소 /posts/<id>/에 쓴다. 글 폴더 이름이다 */
  id: string;
  title: string;
  summary: string;
  category: PostCategory;
  /** Tech 글만 가진다 */
  topic?: TechTopic;
  /** 개발자 인터뷰 글만 가진다. author가 인터뷰한 개발자이고, Culture 첫 화면 캐러셀에 나온다 */
  kind?: 'interview';
  /** 시리즈에 속한 글만 가진다. order는 1부터 */
  series?: { id: string; order: number };
  tags: string[];
  author: { name: string; role: string };
  /** YYYY-MM-DD */
  publishedAt: string;
  readingMinutes: number;
  /** 빌드 때 줄인 썸네일 주소 */
  thumbnail: string;
}

/** frontmatter를 화면이 쓰는 모양으로 바꾼다. 썸네일은 빌드 때 800px webp로 줄인다 */
async function toPost(entry: CollectionEntry<'posts'>): Promise<Post> {
  const { cover, publishedAt, series, ...data } = entry.data;
  const thumbnail = await getImage({ src: cover, width: 800, format: 'webp' });
  return {
    ...data,
    id: entry.id,
    publishedAt: publishedAt.toISOString().slice(0, 10),
    series: series && { id: series.id.id, order: series.order },
    thumbnail: thumbnail.src,
  };
}

/** 최신순. category가 없으면 전체 */
export async function getPosts(category?: PostCategory): Promise<Post[]> {
  const entries = await getCollection('posts', (entry) => !category || entry.data.category === category);
  const posts = await Promise.all(entries.map(toPost));
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** 없는 id면 undefined. 본문(Content)과 목차용 소제목(headings)을 함께 돌려준다 */
export async function getPost(id: string) {
  const entry = await getEntry('posts', id);
  if (!entry) return undefined;
  const [post, { Content, headings }] = await Promise.all([toPost(entry), render(entry)]);
  return { post, Content, headings };
}

/** 같은 카테고리 글을 먼저, 모자라면 다른 글로 채워 최신순 3개 */
export async function getRelatedPosts(post: Post): Promise<Post[]> {
  const others = (await getPosts()).filter((p) => p.id !== post.id);
  return [
    ...others.filter((p) => p.category === post.category),
    ...others.filter((p) => p.category !== post.category),
  ].slice(0, 3);
}

/** 시리즈에 속한 글을 편 순서대로 */
export async function getSeriesPosts(seriesId: string): Promise<Post[]> {
  return (await getPosts())
    .filter((post) => post.series?.id === seriesId)
    .sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
}

/** 태그 주소(/tags/<slug>/). 띄어쓰기만 하이픈으로 바꾸고 한글은 그대로 둔다 */
export function tagSlug(tag: string) {
  return tag.trim().toLowerCase().replace(/\s+/g, '-');
}
