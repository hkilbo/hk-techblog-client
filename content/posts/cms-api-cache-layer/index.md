---
title: "기사 CMS API에 캐시 계층을 넣어 응답 시간을 5분의 1로 줄이기"
summary: "속보가 몰리는 시간대마다 느려지던 기사 조회 API에 Redis 캐시와 무효화 규칙을 붙인 과정을 정리했습니다."
category: tech
topic: backend
tags: ["Redis","캐시","CMS"]
author: { name: "준호", role: "Backend Engineer" }
publishedAt: 2026-10-21
readingMinutes: 10
cover: ./cover.jpg
---

속보가 나오면 기사 조회 API 요청이 평소의 수십 배로 늘어납니다. 그때마다 DB 연결이 바닥나 응답이 2초를 넘기곤 했습니다.

## 읽기 요청은 캐시에서 끝낸다

기사 본문은 한 번 출고되면 거의 바뀌지 않습니다. 그래서 조회 API 앞에 Redis를 두고, 출고된 기사는 캐시에서 바로 돌려주게 했습니다.

```ts
const cached = await redis.get(key);
if (cached) return JSON.parse(cached);
const article = await db.findArticle(id);
await redis.set(key, JSON.stringify(article), 'EX', 600);
return article;
```

## 고칠 때만 지운다

기자가 기사를 고치면 CMS가 이벤트를 보내고, 그 기사 키만 지웁니다. 시간으로 만료시키는 것보다 오래된 기사가 남는 일이 훨씬 적었습니다.

- 평균 응답: 420ms → 80ms
- 속보 시간대 DB 연결 수: 1/6
- 캐시 적중률 94%
