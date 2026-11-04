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

/** 함께하고 싶은 동료. 초안이라 팀에서 다듬는다 */
export const TALENTS = [
  {
    title: '뉴스의 속도에 맞춰 움직이는 사람',
    description: '속보가 나오면 화면도 서버도 몇 분 안에 대응해야 합니다. 급할수록 확인을 건너뛰지 않습니다.',
  },
  {
    title: '기자·디자이너와 직접 이야기하는 사람',
    description: '요구사항이 내려오길 기다리지 않고, 뉴스룸에 가서 무엇이 불편한지 먼저 묻습니다.',
  },
  {
    title: '숫자로 확인하는 사람',
    description: '빨라졌다고 말하기 전에 재 봅니다. 성능과 접근성, 독자 반응을 숫자로 남깁니다.',
  },
  {
    title: '배운 것을 남기는 사람',
    description: '문서와 블로그로 기록해서, 다음 사람이 같은 길을 덜 헤매게 합니다.',
  },
];
