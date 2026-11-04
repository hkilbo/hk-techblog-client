const cache = new Map<string, Promise<string | null>>();

/**
 * 사내 웹 컴포넌트(헤더·푸터)의 HTML 조각을 빌드 때 한 번만 받는다. 페이지마다 다시 받지 않는다.
 * 못 받으면 null이고 그 영역 없이 빌드한다(빌드를 깨지 않는다). 조각을 새로 받으려면 다시 빌드한다(MIGRATION.md §2.4).
 */
export function fetchHtmlFragment(url: string): Promise<string | null> {
  let html = cache.get(url);
  if (!html) {
    html = fetch(url, { signal: AbortSignal.timeout(5000) })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .catch((error: unknown) => {
        console.warn(`[web-component] ${url} 조각을 받지 못해 빼고 빌드합니다.`, error);
        return null;
      });
    cache.set(url, html);
  }
  return html;
}
