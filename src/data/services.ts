import { LayoutDashboard, Newspaper, Plug, Puzzle, Trophy } from '@lucide/astro';

/**
 * Product 페이지의 프로덕트 칸. 개발팀이 만드는 것을 모두 적지 않는다(너무 많고, 공개하기 어려운 것도 있다).
 * 대표 프로덕트 H.AI는 components/product/HaiSearchCard.astro가 크게 그리고, 나머지는 '이 밖의 프로덕트' 칸으로 묶는다.
 * 설명은 공개된 내용만 쓴다. 내부 주소·구조·이름은 적지 않는다.
 */
export const SERVICES = [
  {
    icon: Plug,
    kind: 'AI 연결',
    name: '한국일보 MCP',
    description: 'AI 에이전트가 한국일보 기사를 찾아 근거로 인용할 수 있도록 MCP(Model Context Protocol)로 연결합니다.',
  },
  {
    icon: Puzzle,
    kind: '게임',
    name: '뉴스 게임',
    description: '가로세로 낱말퍼즐과 초성 퀴즈처럼 뉴스를 소재로 한 게임으로, 기사를 한 번 더 읽게 만듭니다.',
  },
  {
    icon: Newspaper,
    kind: '웹',
    name: '한국일보 홈페이지',
    description: '독자가 기사를 처음 만나는 첫 화면과 기사 페이지를 만듭니다.',
  },
  {
    icon: LayoutDashboard,
    kind: '뉴스룸 도구',
    name: '기사 생산 CMS',
    description: '기자가 기사를 쓰고 데스크가 고쳐 출고하는 곳입니다. 편집국의 하루가 이 화면에서 시작해 끝납니다.',
  },
  {
    icon: Trophy,
    kind: '행사',
    name: '대회 사이트',
    description: '미스코리아, 봉황대기 전국고교야구대회처럼 한국일보가 여는 대회의 공식 사이트를 만들고 운영합니다.',
  },
];
