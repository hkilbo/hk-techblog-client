import { getImage } from 'astro:assets';
import { type CollectionEntry, getCollection, getEntry } from 'astro:content';

export interface Series {
  /** 주소 /series/<id>/에 쓴다. content/series/<id>.yaml의 파일 이름이다. 글은 frontmatter의 series.id로 가리킨다 */
  id: string;
  title: string;
  description: string;
  /** 빌드 때 줄인 표지 주소 */
  cover: string;
}

async function toSeries(entry: CollectionEntry<'series'>): Promise<Series> {
  const cover = await getImage({ src: entry.data.cover, width: 1200, format: 'webp' });
  return { id: entry.id, title: entry.data.title, description: entry.data.description, cover: cover.src };
}

export async function getAllSeries(): Promise<Series[]> {
  return Promise.all((await getCollection('series')).map(toSeries));
}

/** 없는 id면 undefined */
export async function getSeries(id: string): Promise<Series | undefined> {
  const entry = await getEntry('series', id);
  return entry && toSeries(entry);
}
