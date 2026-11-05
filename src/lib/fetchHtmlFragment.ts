const cache = new Map<string, Promise<string | null>>();

/**
 * 사내 웹 컴포넌트(헤더·푸터)의 HTML 조각을 빌드 때 한 번만 받는다. 페이지마다 다시 받지 않는다.
 * 못 받으면 로컬에서는 null을 돌려 그 영역 없이 빌드하고, CI(배포)에서는 빌드를 멈춰 직전 배포를 그대로 둔다(README.md 'Deploy').
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
        // 머리·꼬리가 빠진 사이트를 배포하느니 실패시킨다. GitHub Actions는 CI=true를 넣어 준다
        if (import.meta.env.CI) throw error;
        console.warn(`[web-component] ${url} 조각을 받지 못해 빼고 빌드합니다.`, error);
        return null;
      });
    cache.set(url, html);
  }
  return html;
}
