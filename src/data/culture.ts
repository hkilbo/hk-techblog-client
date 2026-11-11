import { Award, Clock, GraduationCap, HeartPulse, IceCreamCone, Sparkles } from '@lucide/astro';

/** 일하는 방식과 복지. 실제 제도만 적는다. 교육·건강검진·장기근속은 한국일보 그룹 채용 홈페이지 복리후생 문구에서 옮겼다 */
export const WAYS_OF_WORKING = [
  {
    icon: Clock,
    title: '유연근무제',
    description: '출퇴근 시간을 세 가지 가운데 고릅니다.',
    options: ['8 to 5', '9 to 6', '10 to 7'],
  },
  {
    icon: Sparkles,
    title: 'Claude Pro 지원',
    description: '일할 때 쓰는 Claude Pro 구독을 회사가 지원합니다.',
  },
  {
    icon: GraduationCap,
    title: '배움 지원',
    description: '인프런 강의를 무료로 듣고, 어학·직무역량 교육도 지원받습니다.',
  },
  {
    icon: HeartPulse,
    title: '건강검진',
    description: '본인과 가족의 건강검진을 지원합니다.',
  },
  {
    icon: Award,
    title: '장기근속 지원',
    description: '오래 함께한 동료에게 장기근속 지원금을 드립니다.',
  },
  {
    icon: IceCreamCone,
    title: '여름엔 아이스크림',
    description: '여름마다 아이스크림을 돌립니다.',
  },
];

/** 함께하고 싶은 동료(Culture '이런 동료', 홈 채용 패널) */
export const TALENTS = [
  '문제를 발견하면 해결할 방법부터 찾는 사람',
  '기술의 유행보다 문제에 맞는 선택을 하는 사람',
  '혼자 잘하는 것보다 함께 잘하는 것을 고민하는 사람',
  '코드를 작성하는 데서 멈추지 않고 실제 사용자에게 닿을 때까지 고민하는 사람',
];
