import { useEffect, useRef, useState } from 'react';
import ReactSlick, { type Settings } from 'react-slick';
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

// 인터뷰 카드를 한 화면에 lg 4장, md 2장, 모바일 1장 보여 준다. 화살표 없이 밀어서(마우스는 끌어서) 넘기고, 아래 점으로 위치를 보여 준다.
// 점은 버튼이라 키보드로도 넘길 수 있다. 카드가 한 화면에 다 들어가면 react-slick이 점을 그리지 않는다
export function InterviewCarousel({ posts }: { posts: Post[] }) {
  // 하이드레이션 뒤에 정해진다. 그 전에는 interviewCarousel.css가 SSR 배치(4장)를 화면 폭에 맞춘다
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
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    swipeToSlide: true,
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
      { breakpoint: MOBILE_MAX_PX, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div ref={rootRef} className="interview-carousel mt-16" data-ready={speed !== undefined || undefined}>
      <Slider {...settings}>
        {posts.map((post) => (
          <InterviewCard key={post.id} post={post} />
        ))}
      </Slider>
    </div>
  );
}
