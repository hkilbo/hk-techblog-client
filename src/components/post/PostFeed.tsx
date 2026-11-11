import { useRef, useState } from 'react';
import { TECH_TOPICS, TOPIC_LABEL } from '@/data/categories';
import type { Post, TechTopic } from '@/lib/posts';
import { Pagination } from './Pagination';
import { PostList } from './PostList';
import { useTopicFilter } from './useTopicFilter';

const CHIPS = [{ value: null, label: 'All' }, ...TECH_TOPICS];
const PAGE_SIZE = 8;

/**
 * 제목 줄 + Tech 세부 분야 칩 + 글 목록 + 페이지. 토스 테크의 직무 카테고리처럼 페이지를 옮기지 않고 제자리에서 거르고 넘긴다.
 * 글 목록 섬이다: .astro에서 client:load(또는 client:visible)로 붙인다
 */
export function PostFeed({ posts, title }: { posts: Post[]; title: string }) {
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
    topRef.current?.scrollIntoView({ block: 'start' }); // 제목 줄로 올라간다. scroll-mt로 고정 헤더 아래에 멈춘다
    titleRef.current?.focus({ preventScroll: true }); // 포커스도 목록 처음으로 옮겨 키보드·스크린리더가 아래 쪽 번호에 남지 않게 한다
  };

  return (
    <>
      <div ref={topRef} className="flex scroll-mt-132 flex-wrap items-center gap-x-12 gap-y-16">
        {/* 칩을 바꾸면 제목·글 수가 바뀌므로 스크린리더가 읽게 한다 */}
        <div className="flex items-center gap-8" aria-live="polite">
          <h2 ref={titleRef} tabIndex={-1} className="text-20 font-extrabold text-foreground outline-none">
            {topic ? TOPIC_LABEL[topic] : title}
          </h2>
          <span className="text-14 font-bold text-accent tabular-nums">{visiblePosts.length}</span>
        </div>
        {/* 좁은 화면에서는 칩이 다음 줄로 내려가 옆으로 밀린다 */}
        <div
          role="group"
          aria-label="Tech 분야"
          className="flex w-full gap-8 overflow-x-auto [scrollbar-width:none] md:ml-auto md:w-auto"
        >
          {CHIPS.map(({ value, label }) => (
            <button
              key={label}
              type="button"
              aria-pressed={topic === value}
              onClick={() => selectTopic(value)}
              className={`flex h-36 shrink-0 items-center rounded-full px-16 text-14 font-semibold transition active:scale-96 ${
                topic === value ? 'bg-accent text-background' : 'bg-chip text-foreground hover:text-accent'
              }`}
            >
              <span aria-hidden="true" className="mr-2 opacity-50">
                #
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-24">
        <PostList posts={pagePosts} />
      </div>
      <Pagination page={page} pageCount={pageCount} onChange={goToPage} />
    </>
  );
}
