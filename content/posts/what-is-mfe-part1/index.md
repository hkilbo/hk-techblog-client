---
title: "대규모 프론트엔드 아키텍처의 새로운 패러다임 - Part 1. 마이크로프론트엔드 너 뭐야?"
summary: "마이크로프론트엔드의 개념, 구조, 장단점에 대해 살펴보자"
category: tech
topic: frontend
series: { id: "micro-frontend-architecture", order: 1 }
tags: ["마이크로프론트엔드","Module Federation","Frontend Architecture"]
author: { name: "애플", role: "Front-end Engineer" }
publishedAt: 2025-07-22
readingMinutes: 14
cover: ./cover.jpg
---

목업 본문입니다. 올리브영 테크블로그의 같은 제목 글을 자리표시로 옮겨 왔고, 본문은 가져오지 않았습니다. 원문: https://oliveyoung.tech/2025-07-22/what-is-MFE-part1/

## 마이크로프론트엔드란

하나의 큰 프론트엔드를 팀 단위로 나눠 따로 개발하고 배포한 뒤, 브라우저나 빌드 시점에 다시 하나로 합치는 구조입니다. 팀마다 배포 주기를 가져가는 대신, 합치는 비용을 치릅니다.
