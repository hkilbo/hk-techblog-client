import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ReactSlick, { type CustomArrowProps, type Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import type { Post } from '@/lib/posts';
import { InterviewCard } from './InterviewCard';
import './interviewCarousel.css';

// react-slick은 CommonJS라 "type": "module"인 이 프로젝트에서는 default가 { default: Slider }로 한 겹 싸여 온다
const Slider = (ReactSlick as unknown as { default?: typeof ReactSlick }).default ?? ReactSlick;

const SLIDE_SPEED_MS = 500;
// react-slick의 breakpoint는 '이 너비 이하'라서 Tailwind md(768px)·lg(1024px)보다 1px 작게 둔다
const MOBILE_MAX_PX = 767;
const TABLET_MAX_PX = 1023;

function ArrowButton({ direction, onClick }: CustomArrowProps & { direction: 'prev' | 'next' }) {
  const isPrev = direction === 'prev';
  const Icon = isPrev ? ArrowLeft : ArrowRight;
  return (
    <button
      type="button"
      aria-label={isPrev ? '이전 인터뷰' : '다음 인터뷰'}
      onClick={onClick}
      // 끝에 닿으면 react-slick이 onClick을 비운다
      disabled={!onClick}
      className={`absolute top-0 ${isPrev ? 'left-0' : 'right-0'} hidden size-56 items-center justify-center rounded-8 bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20 active:scale-98 disabled:opacity-30 disabled:hover:bg-foreground/10 md:flex`}
    >
      <Icon className="size-24" strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}

// 인터뷰 카드를 한 화면에 lg 3장, md 2장, 모바일 1장 보여 주고 한 장씩 넘긴다. 카드는 page-container 밖으로 나가지 않는다
export function InterviewCarousel({ posts }: { posts: Post[] }) {
  // 하이드레이션 뒤에 정해진다. 그 전에는 interviewCarousel.css가 SSR 배치(3장)를 화면 폭에 맞춘다
  const [speed, setSpeed] = useState<number>();
  useEffect(() => setSpeed(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : SLIDE_SPEED_MS), []);

  // react-slick은 안 보이는 카드에 aria-hidden만 붙여서 Tab으로 그 링크에 들어갈 수 있다. inert로 같이 막는다
  const rootRef = useRef<HTMLDivElement>(null);
  const syncInert = () =>
    rootRef.current?.querySelectorAll('.slick-slide').forEach((slide) => {
      slide.toggleAttribute('inert', slide.getAttribute('aria-hidden') === 'true');
    });

  const settings: Settings = {
    onInit: syncInert,
    onReInit: syncInert,
    infinite: false,
    speed: speed ?? SLIDE_SPEED_MS,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <ArrowButton direction="prev" />,
    nextArrow: <ArrowButton direction="next" />,
    // 모바일은 화살표 대신 점으로 위치를 보여 준다
    dotsClass: 'mt-24 flex justify-center',
    appendDots: (dots) => <ul>{dots}</ul>,
    customPaging: (index) => (
      <button
        type="button"
        aria-label={`${index + 1}번째 인터뷰`}
        className="flex size-24 items-center justify-center before:size-8 before:rounded-full before:bg-foreground/20 in-[.slick-active]:before:bg-foreground"
      />
    ),
    responsive: [
      { breakpoint: TABLET_MAX_PX, settings: { slidesToShow: 2 } },
      { breakpoint: MOBILE_MAX_PX, settings: { slidesToShow: 1, arrows: false, dots: true } },
    ],
  };

  return (
    <div ref={rootRef} className="interview-carousel mt-32 md:mt-40" data-ready={speed !== undefined || undefined}>
      {/* 화살표는 .slick-slider 기준 absolute라서, 화살표 줄(56px + 24px) 자리를 여기에 둔다 */}
      <Slider {...settings} className="md:pt-80">
        {posts.map((post) => (
          <InterviewCard key={post.id} post={post} />
        ))}
      </Slider>
    </div>
  );
}
