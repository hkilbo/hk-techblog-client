import { getImage, inferRemoteSize } from 'astro:assets';
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
  /** 인터뷰 글만 가진다(개발자·기획자 등). author가 인터뷰한 사람이고, Culture 인터뷰 캐러셀에 나온다 */
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

/** frontmatter를 화면이 쓰는 모양으로 바꾼다. 썸네일은 빌드 때 800px webp로 줄인다(SVG 표지는 벡터 그대로 쓴다) */
async function toPost(entry: CollectionEntry<'posts'>): Promise<Post> {
  const { cover, publishedAt, series, ...data } = entry.data;
  const format = typeof cover !== 'string' && cover.format === 'svg' ? 'svg' : 'webp';
  // 주소로 받은 표지는 크기를 모르므로 받아서 잰다(inferSize)
  const thumbnail = await getImage({ src: cover, width: 800, format, inferSize: typeof cover === 'string' });
  return {
    ...data,
    id: entry.id,
    // 한국 날짜(YYYY-MM-DD). 시각까지 적은 글도 KST 기준 날짜가 된다
    publishedAt: publishedAt.toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' }),
    series: series && { id: series.id.id, order: series.order },
    thumbnail: thumbnail.src,
  };
}

let allPosts: Promise<Post[]> | undefined;

/** 최신순. category가 없으면 전체. 빌드 동안 한 번만 읽어 모든 페이지가 같이 쓴다(개발 서버에서는 글을 고치면 바로 보이게 매번 읽는다) */
export function getPosts(category?: PostCategory): Promise<Post[]> {
  if (!allPosts || import.meta.env.DEV) {
    allPosts = getCollection('posts')
      .then((entries) => Promise.all(entries.map(toPost)))
      .then((posts) => posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)));
  }
  // 같이 쓰는 배열이라 복사해서 준다. 받은 쪽이 정렬·수정해도 다른 페이지에 번지지 않는다
  return allPosts.then((posts) => (category ? posts.filter((post) => post.category === category) : [...posts]));
}

const OG_RATIO = 1200 / 630;

/**
 * 공유 미리보기 이미지. 카카오톡이 webp를 못 읽을 수 있어 JPG로 만든다.
 * 원본보다 키우지 않고 1.91:1로 가장 크게(최대 1200×630) 자르므로, 요청한 크기가 곧 파일 크기다(og:image:width·height)
 */
async function toOgImage(cover: CollectionEntry<'posts'>['data']['cover']) {
  const source = typeof cover === 'string' ? await inferRemoteSize(cover) : cover;
  const height = Math.min(630, source.height, Math.floor(source.width / OG_RATIO));
  const width = Math.round(height * OG_RATIO);
  // attention: 사람 얼굴처럼 눈에 띄는 곳을 남기고 자른다(인터뷰 세로 사진)
  const image = await getImage({ src: cover, width, height, fit: 'cover', position: 'attention', format: 'jpg' });
  return { src: image.src, width, height };
}

/** 없는 id면 undefined. 글 페이지의 본문(Content), 목차용 소제목(headings), 공유 미리보기 이미지(ogImage) */
export async function renderPost(id: string) {
  const entry = await getEntry('posts', id);
  if (!entry) return undefined;
  const [rendered, ogImage] = await Promise.all([render(entry), toOgImage(entry.data.cover)]);
  return { ...rendered, ogImage };
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

/** 태그 주소(/tags/<slug>/). 띄어쓰기와 주소에서 뜻이 바뀌는 / # ? %는 하이픈으로 바꾸고, 한글은 그대로 둔다(CI/CD → ci-cd) */
export function tagSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[\s/#?%]+/g, '-');
}
