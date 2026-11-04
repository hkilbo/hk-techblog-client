---
title: "대규모 프론트엔드 아키텍처의 새로운 패러다임 - Part 2. 모듈 페더레이션 PoC"
summary: "환경별 MF 구성 PoC 기록"
category: tech
topic: frontend
series: { id: "micro-frontend-architecture", order: 2 }
tags: ["Module Federation","Next.js","Micro Frontend"]
author: { name: "문지훈", role: "Front-end Engineer" }
publishedAt: 2025-11-06
readingMinutes: 19
cover: ./cover.jpg
---

목업 본문입니다. 올리브영 테크블로그의 같은 제목 글을 자리표시로 옮겨 왔고, 본문은 가져오지 않았습니다. 원문: https://oliveyoung.tech/2025-11-06/what-is-MFE-part2/

## Module Federation PoC

Next.js 호스트 앱과 리모트 앱을 두고, 클라이언트 렌더링과 서버 렌더링에서 각각 모듈을 가져오는 구성을 환경별로 시험한 기록입니다.
