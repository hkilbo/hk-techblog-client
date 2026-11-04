---
title: "Next.js 16 Cache Components로 홈페이지 정적 셸 만들기"
summary: "요청마다 쿠키를 읽던 루트 레이아웃을 정적 셸로 바꾸고, 사용자별 영역만 Suspense로 흘려보내기까지의 과정을 정리했습니다."
category: tech
topic: frontend
tags: ["Next.js","캐시","성능"]
author: { name: "서윤", role: "Frontend Engineer" }
publishedAt: 2026-10-28
readingMinutes: 11
cover: ./cover.jpg
---

한국일보 홈은 요청마다 쿠키를 읽어 로그인 상태를 그렸습니다. 그 탓에 페이지 전체가 동적 렌더링이 됐고, 첫 바이트가 오기까지 평균 600ms가 걸렸습니다.

## 쿠키 하나가 페이지 전체를 동적으로 만든다

루트 레이아웃에서 cookies()를 부르면 그 아래 모든 라우트가 요청 시점 렌더링으로 바뀝니다. 로그인 여부는 헤더 오른쪽 구석에서만 쓰는데, 기사 목록까지 매번 새로 그리고 있었습니다.

## 사용자별 영역만 Suspense로 떼어 내기

Cache Components를 켜면 정적인 부분과 'use cache'가 붙은 부분은 빌드할 때 셸로 굳고, Suspense 안쪽만 요청 시점에 흘려보냅니다. 헤더의 로그인 영역을 따로 빼서 Suspense로 감쌌습니다.

```tsx
export default function Layout({ children }) {
  return (
    <>
      <Suspense fallback={<LoginSkeleton />}>
        <LoginStatus />
      </Suspense>
      {children}
    </>
  );
}
```

## 바뀐 숫자

- 첫 바이트까지 걸린 시간: 600ms → 90ms
- CDN 캐시 적중률: 12% → 87%
- 로그인 영역은 셸이 뜬 뒤 평균 120ms 안에 채워진다

> 정적으로 둘 수 있는 것부터 찾고, 동적인 부분을 가장 작게 만드는 게 전부였습니다.
