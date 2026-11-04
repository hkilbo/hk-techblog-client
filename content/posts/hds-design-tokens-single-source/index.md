---
title: "HDS 디자인 토큰을 TypeScript 단일 소스로 관리하기"
summary: "Figma, CSS, React가 각자 들고 있던 색과 간격 값을 한 곳으로 모으고, 바뀔 때마다 세 곳이 함께 갱신되게 만든 구조입니다."
category: tech
topic: frontend
tags: ["디자인시스템","토큰","vanilla-extract"]
author: { name: "민재", role: "Frontend Engineer" }
publishedAt: 2026-09-16
readingMinutes: 13
cover: ./cover.jpg
---

HDS는 Figma의 색·글꼴·간격을 코드로 옮긴 한국일보 디자인 시스템입니다. 처음엔 토큰을 JSON, CSS 변수, Tailwind 설정에 따로 적어 두었고 셋이 어긋나는 일이 잦았습니다.

## Figma에서 TypeScript로

Figma REST API로 스타일을 내려받고, 스크립트가 TypeScript 토큰 파일을 만듭니다. 사람은 생성된 파일을 고치지 않습니다.

```ts
export const color = {
  text: { textBody: '#444444', textStrong: '#1a1a1a' },
  stroke: { line: '#dddddd' },
} as const;
```

## 쓰는 쪽은 CSS 한 번만 불러온다

vanilla-extract로 빌드해 정적 CSS로 배포합니다. 서비스는 빌드 도구와 상관없이 CSS 파일 하나만 불러오면 됩니다.

- 라이트·다크·게임 테마를 속성 하나로 바꾼다
- WCAG AA 대비를 CI에서 검사한다
- 토큰 이름이 바뀌면 타입 에러로 바로 드러난다
