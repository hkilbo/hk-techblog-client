import { useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { TECH_TOPICS, TOPIC_LABEL } from '@/data/categories';
import { withBase } from '@/lib/paths';
import type { Post, TechTopic } from '@/lib/posts';
import { Pagination } from './Pagination';
import { PostList } from './PostList';
import { useTopicFilter } from './useTopicFilter';

const CHIPS = [{ value: null, label: 'All' }, ...TECH_TOPICS];
const PAGE_SIZE = 8;

/**
 * Tech 세부 분야 칩 + 제목 줄 + 목록 + 페이지. 토스 테크의 직무 카테고리처럼 페이지를 옮기지 않고 제자리에서 거르고 넘긴다.
 * 글 목록 섬이다: .astro에서 client:load(또는 client:visible)로 붙인다
 */
export function PostFeed({
  posts,
  lead,
  title,
  withHomeLink = false,
}: {
  posts: Post[];
  /** 제목 앞에 붙이는 쉬운 말(HighlightTitle의 lead와 같다). 제목은 라임 형광 밑줄을 긋는다 */
  lead?: string;
  title: string;
  /** 칩 왼쪽에 홈으로 가는 ← 버튼. 홈 밖(Tech 페이지)에서만 켠다 */
  withHomeLink?: boolean;
}) {
  const { topic, setTopic, visiblePosts } = useTopicFilter(posts);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pageCount = Math.ceil(visiblePosts.length / PAGE_SIZE);
  const pagePosts = visiblePosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectTopic = (value: TechTopic | null) => {
    setTopic(value);
    setPage(1);
  };
  const goToPage = (next: number) => {
    setPage(next);
    topRef.current?.scrollIntoView({ block: 'start' }); // 칩 줄로 올라간다. scroll-mt로 고정 헤더 아래에 멈춘다
    titleRef.current?.focus({ preventScroll: true }); // 포커스도 목록 처음으로 옮겨 키보드·스크린리더가 아래 쪽 번호에 남지 않게 한다
  };

  return (
    <>
      <div ref={topRef} className="flex scroll-mt-132 items-start gap-8">
        {withHomeLink && (
          <a
            href={withBase('/')}
            aria-label="홈으로"
            className="flex size-40 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition-colors hover:border-foreground"
          >
            <ArrowLeft className="size-20" strokeWidth={1.75} aria-hidden="true" />
          </a>
        )}
        <div role="group" aria-label="Tech 분야" className="flex flex-wrap gap-8">
          {CHIPS.map(({ value, label }) => (
            <button
              key={label}
              type="button"
              aria-pressed={topic === value}
              onClick={() => selectTopic(value)}
              className={`flex h-40 items-center rounded-full px-20 text-14 font-semibold transition-colors ${
                topic === value
                  ? 'bg-foreground text-background'
                  : 'border border-line text-muted hover:border-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* 칩을 바꾸면 제목·글 수가 바뀌므로 스크린리더가 읽게 한다 */}
      <div className="mt-40 mb-24 flex items-center gap-12" aria-live="polite">
        <h2
          ref={titleRef}
          tabIndex={-1}
          className="flex flex-wrap items-center gap-x-6 text-18 font-medium text-foreground outline-none md:text-22"
        >
          {/* 뒤 공백은 스크린리더가 앞말과 제목을 띄어 읽게 둔다. 화면 간격은 gap이 맡는다 */}
          {lead && <span>{lead} </span>}
          <strong className="font-extrabold underline decoration-accent decoration-4 underline-offset-6">
            {topic ? TOPIC_LABEL[topic] : title}
          </strong>
        </h2>
        <span className="rounded-4 bg-accent px-8 py-2 text-12 font-bold text-background">{visiblePosts.length}</span>
      </div>
      <PostList posts={pagePosts} />
      <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
    </>
  );
}
