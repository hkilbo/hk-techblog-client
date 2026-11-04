import { ChevronLeft, ChevronRight } from 'lucide-react';

const ARROW =
  'flex size-40 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground disabled:opacity-30 disabled:hover:text-muted';

/** 7쪽 이하면 전부, 그보다 많으면 처음·끝·현재 앞뒤 한 쪽씩만 보이고 사이는 …로 줄인다 */
function pageItems(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const around = [page - 1, page, page + 1].filter((p) => p > 1 && p < pageCount);
  return [
    1,
    ...(around[0] > 2 ? (['gap'] as const) : []),
    ...around,
    ...(around[around.length - 1] < pageCount - 1 ? (['gap'] as const) : []),
    pageCount,
  ];
}

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="페이지" className="mt-40 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
        className={ARROW}
      >
        <ChevronLeft className="size-20" strokeWidth={1.75} aria-hidden="true" />
      </button>
      {pageItems(page, pageCount).map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden="true" className="w-40 text-center text-14 text-muted">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`size-40 rounded-full text-14 font-semibold transition-colors ${
              item === page ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'
            }`}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="다음 페이지"
        className={ARROW}
      >
        <ChevronRight className="size-20" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </nav>
  );
}
