---
title: "공통 헤더를 웹 컴포넌트로 뽑아 6개 서비스에 배포한 이유"
summary: "Next.js, Vite, Astro가 섞인 서비스들에 같은 헤더를 넣어야 했습니다. Declarative Shadow DOM으로 SSR까지 맞춘 방법을 공유합니다."
category: product
tags: ["웹컴포넌트","디자인시스템","SSR"]
author: { name: "도현", role: "Frontend Engineer" }
publishedAt: 2026-10-14
readingMinutes: 9
cover: ./cover.jpg
---

한국일보에는 Next.js, Vite, Astro로 만든 서비스가 섞여 있습니다. 같은 헤더를 서비스마다 따로 구현하다 보니 로고 위치와 로그인 버튼 동작이 조금씩 달랐습니다.

## 프레임워크마다 헤더를 다시 만들던 문제

디자인이 바뀌면 여섯 곳을 고쳐야 했고, 배포 일정도 서비스마다 달라서 한동안 두 가지 헤더가 함께 떠 있곤 했습니다.

## Declarative Shadow DOM으로 SSR까지

헤더를 웹 컴포넌트로 만들고, 서버가 HTML 조각을 받아 먼저 그린 뒤 스크립트가 하이드레이션하게 했습니다. Declarative Shadow DOM 덕분에 스크립트가 늦게 와도 레이아웃이 흔들리지 않습니다.

- 서버는 CDN에서 받은 HTML 조각을 그대로 넣는다
- 브라우저는 header.js가 로드되면 이벤트만 연결한다
- 다크 모드는 html의 data-theme을 읽어 스스로 맞춘다

## 남은 과제

서비스마다 메뉴를 조금씩 바꾸고 싶다는 요청이 많습니다. 슬롯을 열어 줄지, 설정값으로 받을지 정하는 중입니다.
