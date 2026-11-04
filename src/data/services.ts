import { Crown, LayoutDashboard, Newspaper, Trophy } from '@lucide/astro';

/** 개발팀이 만들고 운영하는 서비스. 설명을 고치면 Product 페이지에 바로 반영된다 */
export const SERVICES = [
  {
    icon: LayoutDashboard,
    kind: '백오피스',
    name: '기사 생산 CMS',
    description: '기자가 기사를 쓰고 데스크가 고쳐 출고하는 곳입니다. 편집국의 하루가 이 화면에서 시작해 끝납니다.',
  },
  {
    icon: Newspaper,
    kind: '웹',
    name: '한국일보 홈페이지',
    description: '독자가 기사를 처음 만나는 첫 화면과 기사 페이지를 만듭니다.',
  },
  {
    icon: Crown,
    kind: '행사',
    name: '미스코리아',
    description: '한국일보가 주최하는 미스코리아 대회의 공식 사이트를 만들고 운영합니다.',
  },
  {
    icon: Trophy,
    kind: '스포츠',
    name: '봉황대기',
    description: '봉황대기 전국고교야구대회가 열릴 때마다 경기 일정과 결과를 전하는 대회 사이트를 엽니다.',
  },
];
