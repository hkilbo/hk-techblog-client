---
title: "모노레포 빌드 시간을 40% 줄인 pnpm + Turborepo 설정"
summary: "여섯 개 앱이 매번 전부 빌드되던 CI를 바꾼 기록입니다. 캐시 키를 어떻게 잡았는지, 무엇이 캐시를 깨뜨렸는지 적었습니다."
category: tech
topic: cloud
tags: ["모노레포","CI","Turborepo"]
author: { name: "태오", role: "Platform Engineer" }
publishedAt: 2026-08-19
readingMinutes: 10
cover: ./cover.jpg
---

패키지 열두 개가 든 모노레포의 CI가 PR마다 18분씩 걸렸습니다. 바뀌지 않은 패키지까지 매번 다시 빌드했기 때문입니다.

## 바뀐 것만 다시 빌드한다

Turborepo 원격 캐시를 켜고 태스크마다 입력 파일을 좁혔습니다. 문서만 바뀐 PR은 이제 빌드를 건너뜁니다.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["src/**", "package.json"],
      "outputs": ["dist/**"]
    }
  }
}
```

## 설치 시간도 줄이기

pnpm store를 CI 캐시에 올리고 frozen-lockfile로 설치합니다. 설치만 3분에서 40초가 됐습니다.

- CI 전체: 18분 → 11분
- 캐시가 맞으면 4분 이하
- 로컬 빌드도 같은 원격 캐시를 쓴다
