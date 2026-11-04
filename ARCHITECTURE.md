# hk-tech-client 구조

Astro로 만든 정적 사이트다(GitHub Pages 배포). 페이지가 몇 개 안 되는 작은 사이트라 FSD 레이어를 두지 않고 Astro 기본 폴더를 쓴다.

## 1. 폴더

```
hk-tech-client/
├── content/                # 글과 시리즈. 글을 쓸 때는 여기만 고친다
│   ├── posts/<id>/         # index.md(frontmatter + 본문) + cover.jpg. 폴더 이름이 주소 /posts/<id>/
│   └── series/<id>.yaml
├── public/                 # 그대로 복사된다: CNAME, favicon, 폰트, 로고 SVG
└── src/
    ├── pages/              # 라우트 = 페이지. 페이지 마크업을 여기에 바로 쓴다
    ├── layouts/            # BaseLayout: <head>, 헤더·GNB·푸터
    ├── components/<영역>/  # 화면 조각. 영역 폴더 한 단계만 둔다
    │   ├── layout/         # 헤더·GNB·푸터
    │   ├── home/           # 홈 섹션
    │   ├── post/           # 글 목록·글 행·글 페이지 조각
    │   ├── culture/        # 인터뷰 캐러셀
    │   └── series/         # 시리즈 카드
    ├── lib/                # 데이터 읽기와 헬퍼: posts.ts, series.ts, fetchHtmlFragment.ts
    ├── data/               # 고정 목록·상수: 카테고리, Product 서비스, Culture 복지
    ├── assets/             # 빌드 때 최적화할 이미지
    ├── styles/global.css   # 색·글꼴 토큰, Tailwind
    └── content.config.ts   # 글·시리즈 frontmatter 스키마(Astro가 이 위치에서 찾는다)
```

데이터는 한 방향으로 흐른다: `content/` → `content.config.ts`(검증) → `lib/posts.ts`·`lib/series.ts` → `pages/` → `components/`.

## 2. 무엇을 어디에

| 무엇                             | 어디                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| 새 페이지                        | `src/pages/<주소>.astro`. `BaseLayout`으로 감싼다                                          |
| 한 페이지에서만 쓰는 섹션        | 페이지 파일 안에 바로 쓴다. 길어지면 `components/<영역>/`으로 뺀다                         |
| 여러 곳에서 쓰는 조각            | `components/<영역>/`                                                                       |
| 브라우저에서 돌아가는 조각(섬)   | React(`.tsx`). 페이지에서 `client:load`(첫 화면) 또는 `client:visible`로 붙인다. 지금은 `PostFeed`, `InterviewCarousel` |
| 조각 하나만 쓰는 CSS·훅          | 그 조각 옆: `interviewCarousel.css`, `useTopicFilter.ts`                                   |
| 글·시리즈 읽기, `Post`·`Series` 타입 | `lib/posts.ts`, `lib/series.ts`. 컬렉션(`astro:content`)은 여기서만 읽는다             |
| 상수·고정 목록                   | `data/`                                                                                    |

- 브라우저에서 돌 필요가 없는 조각은 `.astro`로 쓴다. 아이콘은 `.astro`에서 `@lucide/astro`, `.tsx`에서 `lucide-react`.
- React 섬은 `astro:content` 같은 Astro 모듈을 import하지 않는다. 데이터는 페이지가 props로 넘기고, 타입은 `import type`으로만 가져온다.

## 3. import 규칙

1. 폴더 밖은 `@/` 경로, 같은 폴더는 `./파일`로 쓴다. `../`는 쓰지 않는다.
2. 깊이는 `@/<폴더>/<파일>`까지, 컴포넌트만 `@/components/<영역>/<파일>`까지다. 폴더를 더 만들지 않는다.
3. `index.ts` 같은 index 파일로 경로를 줄이지 않는다. `src/pages/`의 `index.astro`는 라우팅 규칙이라 뺀다.

1~3은 `pnpm lint`가 막는다.

## 4. 이름

| 대상                       | 규칙       | 예                                              |
| -------------------------- | ---------- | ----------------------------------------------- |
| 컴포넌트·레이아웃 파일     | PascalCase | `PostCard.astro`, `PostFeed.tsx`                |
| 그 밖의 파일               | camelCase  | `posts.ts`, `useTopicFilter.ts`, `interviewCarousel.css` |
| 폴더                       | 소문자     | `components/post/`                              |

`src/pages/`의 파일 이름은 주소가 되므로 이 규칙에서 뺀다.

## 5. 포맷과 검사

- `pnpm format`(전체 포맷), `pnpm format:check`(검사만)
- `.ts`·`.tsx`의 import 순서는 Prettier가 정렬한다: react → astro → 외부 패키지 → `@/` → `./`
- `.astro`의 import는 Prettier가 정렬하지 않는다(astro 플러그인이 frontmatter를 `babel-ts`로 넘기는데 trivago 플러그인은 이 파서를 감싸지 않는다). 같은 순서로 손으로 쓰고, 페이지에서는 `BaseLayout`을 `@/` 가운데 맨 앞에 둔다. 전역 CSS가 컴포넌트 CSS보다 먼저 붙는다.
- PR을 올리기 전에 `pnpm lint`, `pnpm format:check`, `pnpm check`, `pnpm build`가 통과해야 한다. CI(`.github/workflows/ci.yml`)도 같은 순서로 돌린다.
