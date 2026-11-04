---
title: "FSD를 Next.js App Router에 적용하며 겪은 것"
summary: "pages 레이어와 app 라우터가 충돌하는 문제부터 배럴 파일을 없앤 이유까지, 폴더 구조를 정하면서 내린 결정들을 정리했습니다."
category: tech
topic: frontend
tags: ["FSD","Next.js","아키텍처"]
author: { name: "서윤", role: "Frontend Engineer" }
publishedAt: 2026-07-22
readingMinutes: 12
cover: ./cover.jpg
---

기술 블로그를 새로 만들면서 폴더 구조를 Feature-Sliced Design으로 잡았습니다. App Router의 app 폴더와 FSD 레이어를 같이 쓰려니 몇 군데가 부딪혔습니다.

## pages 레이어는 두지 않는다

src/pages를 만들면 Next.js가 Pages Router로 읽어서 빌드가 깨집니다. 그래서 라우트 파일이 widgets를 바로 re-export하게 했습니다.

```tsx
export { HomePage as default } from '@/widgets/Home/HomePage';
```

## 규칙은 린트가 지킨다

import 깊이, ../ 금지, index 파일 금지를 ESLint 규칙으로 막았습니다. 문서로만 적어 둔 규칙은 두 달을 못 갔습니다.

- 아래 레이어만 import한다
- 같은 레이어의 다른 슬라이스는 import하지 않는다
- 세그먼트는 ui, api, model, lib, config만 쓴다
