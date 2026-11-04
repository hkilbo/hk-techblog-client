---
title: "기사 체류 시간을 1분 단위로 모으는 데이터 파이프라인"
summary: "편집국이 실시간으로 보는 지표를 만들려고 로그 수집부터 집계 테이블까지 다시 설계했습니다."
category: tech
topic: ai-db
tags: ["데이터","BigQuery","지표"]
author: { name: "은지", role: "Data Engineer" }
publishedAt: 2026-09-09
readingMinutes: 9
cover: ./cover.jpg
---

편집국은 어떤 기사가 끝까지 읽히는지 바로 알고 싶어 했지만, 기존 지표는 하루가 지나야 나왔습니다.

## 읽는 동안 15초마다 신호를 보낸다

기사 화면이 보이는 동안 15초마다 가벼운 이벤트를 보내고, 서버는 이를 1분 단위로 묶어 BigQuery에 쌓습니다.

```sql
SELECT article_id, COUNT(DISTINCT session_id) AS readers
FROM events
WHERE event = 'heartbeat' AND ts > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 10 MINUTE)
GROUP BY article_id
```

## 편집국 대시보드

대시보드는 지금 읽히는 기사와 끝까지 읽은 비율을 1분마다 새로 그립니다. 제목을 바꾼 뒤 숫자가 어떻게 변하는지도 바로 보입니다.
