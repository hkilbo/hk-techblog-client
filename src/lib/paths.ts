/**
 * 사이트 안 주소 앞에 astro.config의 base를 붙인다. 블로그는 도메인 루트가 아니라 하위 경로에서도 돈다
 * (hkilbo.github.io/hk-techblog-client, tech.hankookilbo.com/blog). 그래서 '/posts/…', '/brand/….svg'처럼
 * 루트 기준으로 쓰던 주소는 모두 이 함수를 거친다. base가 '/'이면 그대로 돌려준다
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function withBase(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${BASE}${normalized}`;
}

export const postPath = (id: string) => withBase(`/posts/${id}/`);
export const seriesPath = (id: string) => withBase(`/series/${id}/`);
