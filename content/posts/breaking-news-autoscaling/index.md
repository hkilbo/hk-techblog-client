---
title: "속보 트래픽을 버티는 오토스케일링 설정기"
summary: "평소의 20배가 몰리는 속보 시간대에 서버를 미리 늘리는 규칙과, 끝난 뒤 비용을 다시 줄이는 방법을 공유합니다."
category: tech
topic: cloud
tags: ["쿠버네티스","오토스케일링","비용"]
author: { name: "태오", role: "Platform Engineer" }
publishedAt: 2026-08-26
readingMinutes: 11
cover: ./cover.jpg
---

속보가 뜨면 몇 분 만에 트래픽이 평소의 20배까지 오릅니다. CPU 사용률을 보고 서버를 늘리면 이미 늦었습니다.

## CPU 대신 출고 이벤트를 본다

CMS에서 '속보'로 출고하면 그 신호로 서버를 미리 늘립니다. 트래픽이 오기 전에 준비가 끝납니다.

```yaml
minReplicas: 6
maxReplicas: 60
behavior:
  scaleDown:
    stabilizationWindowSeconds: 900
```

## 끝나면 천천히 줄인다

속보가 잦아들면 15분에 걸쳐 서버를 줄입니다. 한꺼번에 줄였다가 두 번째 파도에 다시 늘리는 일을 막으려는 것입니다.

- 속보 시간대 5xx 오류: 0.8% → 0.02%
- 월 서버 비용: 18% 감소
