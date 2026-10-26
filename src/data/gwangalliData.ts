import { MarineCondition, SwimCourse, TriathlonTarget, SwimLog } from '../types/swim';

export const CURRENT_GWANGALLI_CONDITION: MarineCondition = {
  timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  waterTemp: 19.8,
  airTemp: 22.4,
  waveHeight: 0.4, // calm bay
  wavePeriod: 5.6,
  windSpeed: 3.2,
  windDirection: '남동 (SE) 135°',
  tidePhase: '밀물 (Flood Tide)',
  tideLevel: 112,
  tideName: '6물 (사리 전후 조류 활발)',
  nextTideTime: '14:20 만조 (+148cm)',
  nextTideType: '만조 (High Tide)',
  visibility: 3.2,
  jellyfishStatus: '안전 (Safe)',
  jellyfishDesc: '광안리 해역 수온 안정기로 해파리 출현 없음 (남해안 수과원 예보 정상)',
  safetyScore: 92,
  safetyLevel: '최적 (Optimal)',
  suitRecommendation: '3mm 오픈워터 웻슈트 추천 (수온 19~20℃, 체온 유지 및 부력 최적화)',
};

export const GWANGALLI_COURSES: SwimCourse[] = [
  {
    id: 'course-buoy-line',
    name: 'Gwangalli Coastline Safety Buoy Course',
    nameKo: '광안리 해안선 안전부표 횡단 (민락 ↔ 삼익)',
    distanceMeters: 1400,
    level: '초급',
    description: '광안리 백사장 약 50m~70m 외곽에 설치된 안전부표 라인을 따라 왕복하는 가장 안전하고 대표적인 바다수영 코스입니다.',
    keyPoints: ['민락회타운 앞 출발', '중앙 만남의 광장 통과', '남천동 삼익비치 방파제 앞 반환', '조류가 약하고 유사시 백사장 탈출 용이'],
    depthRange: '1.5m ~ 3.5m',
    currentWarning: '만조/간조 1시간 전후로 남천동 방면에서 민락동 방면으로 완만한 연안류 발생',
    startPoint: { lat: 35.1558, lng: 129.1245, label: '민락회타운 앞 백사장' },
    turnPoint: { lat: 35.1485, lng: 129.1132, label: '삼익비치 앞 안전부표' },
    coordinates: [
      [180, 420],
      [280, 440],
      [420, 455],
      [580, 460],
      [740, 450],
      [860, 430]
    ]
  },
  {
    id: 'course-triathlon-15k',
    name: 'Triathlon Olympic 1.5K Standard Loop',
    nameKo: '철인3종 올림픽 1.5km 삼각 루프 코스',
    distanceMeters: 1500,
    level: '중급',
    description: '전국 철인3종 대회(1.5km) 실전을 완벽하게 모의훈련할 수 있는 2회 부표 턴(삼각 루프) 코스입니다. 헤드업과 부표 회전 감각을 익히기에 최적입니다.',
    keyPoints: ['광안리 백사장 중앙 스탠드 출발', '외해 350m 1번 부표 직진', '우측 500m 2번 부표 횡단 (헤드업)', '스타트 지점으로 650m 대각 귀환'],
    depthRange: '2.0m ~ 5.5m',
    currentWarning: '외해 부표 구간에서 광안대교 방면 너울과 조류 주의 (스윔부이 및 버디 필수)',
    startPoint: { lat: 35.1532, lng: 129.1189, label: '광안리 해변 중앙 (드론쇼 광장)' },
    turnPoint: { lat: 35.1505, lng: 129.1235, label: '외해 1차 턴 부표 (350m)' },
    coordinates: [
      [500, 460],
      [500, 310],
      [780, 310],
      [500, 460]
    ]
  },
  {
    id: 'course-bridge-challenge',
    name: 'Gwangan Bridge View 2.5K Long Challenge',
    nameKo: '광안대교 뷰 2.5km 장거리 챌린지 코스',
    distanceMeters: 2500,
    level: '상급/철인',
    description: '광안대교 주교각을 정면으로 바라보며 외해 깊은 수심에서 수영하는 상급 철인/바다수영 동호인 전용 롱스윔 코스입니다.',
    keyPoints: ['남천동 삼익비치 출발', '광안대교 주탑 방향으로 800m 전진', '중앙 계류 앵커라인 통과', '민락 수변공원 앞 피니시'],
    depthRange: '4.0m ~ 8.0m',
    currentWarning: '수심이 깊고 광안대교 하부 유속이 빨라질 수 있으므로 기상청 파고 0.8m 이하일 때만 진입 권장',
    startPoint: { lat: 35.1485, lng: 129.1132, label: '삼익비치 워터프론트' },
    turnPoint: { lat: 35.1492, lng: 129.1285, label: '광안대교 외해 앵커 지점' },
    coordinates: [
      [180, 420],
      [360, 260],
      [580, 220],
      [780, 260],
      [860, 430]
    ]
  },
  {
    id: 'course-center-sprint',
    name: 'Paddle Zone Safe Sprint 800m',
    nameKo: '해양레저존 안전 스프린트 800m',
    distanceMeters: 800,
    level: '초급',
    description: '가볍게 컨디션을 점검하거나 새벽/일몰 시간대 가벼운 바다수영 적응 훈련에 최적화된 직선 스프린트 코스입니다.',
    keyPoints: ['모래사장 바로 앞 얕은 수심', '파도와 조류가 가장 완만한 구역', '스프린트 100m 인터벌 훈련 가능'],
    depthRange: '1.2m ~ 2.2m',
    currentWarning: 'SUP(패들보드) 및 윈드서핑 대여 구역 진입 금지 (전방 주시 철저)',
    startPoint: { lat: 35.1532, lng: 129.1189, label: '해변 중앙' },
    turnPoint: { lat: 35.1548, lng: 129.1221, label: '민락 방면 400m 부표' },
    coordinates: [
      [420, 455],
      [550, 460],
      [680, 455]
    ]
  }
];

export const TRIATHLON_STANDARDS: TriathlonTarget[] = [
  {
    category: '올림픽 코스 (1.5km)',
    distanceMeters: 1500,
    cutOffMinutes: 50,
    targetPaceMinutes: '1:50',
    goalTimeMinutes: 27.5,
    sightingIntervalStrokes: 6,
    estimatedCalories: 450,
  },
  {
    category: '스프린트 (750m)',
    distanceMeters: 750,
    cutOffMinutes: 25,
    targetPaceMinutes: '1:45',
    goalTimeMinutes: 13.1,
    sightingIntervalStrokes: 4,
    estimatedCalories: 230,
  },
  {
    category: '하프 70.3 (1.9km)',
    distanceMeters: 1900,
    cutOffMinutes: 70,
    targetPaceMinutes: '1:55',
    goalTimeMinutes: 36.4,
    sightingIntervalStrokes: 8,
    estimatedCalories: 620,
  },
  {
    category: '킹코스/풀 (3.8km)',
    distanceMeters: 3800,
    cutOffMinutes: 140,
    targetPaceMinutes: '2:00',
    goalTimeMinutes: 76.0,
    sightingIntervalStrokes: 10,
    estimatedCalories: 1300,
  }
];

export const INITIAL_SWIM_LOGS: SwimLog[] = [
  {
    id: 'log-1',
    date: '2026-10-24',
    startTime: '06:30',
    durationMinutes: 32,
    distanceMeters: 1500,
    avgPaceSecondsPer100m: 128, // 2:08 / 100m
    courseId: 'course-triathlon-15k',
    courseName: '철인3종 올림픽 1.5km 삼각 루프 코스',
    strokeType: '자유형 (Freestyle)',
    gearType: '웻슈트 (Full Wetsuit)',
    buoyUsed: true,
    waterTemp: 19.5,
    perceivedEffort: 7,
    targetCategory: '철인3종 훈련 (Triathlon)',
    notes: '광안대교 방향 1번 턴 부표에서 살짝 역조류 있었음. 6스트로크당 1회 헤드업 훈련 집중. 웻슈트 착용으로 부력 양호.',
    buddies: '김철인, 박스윔',
    createdAt: new Date('2026-10-24T07:15:00').toISOString(),
  },
  {
    id: 'log-2',
    date: '2026-10-20',
    startTime: '07:00',
    durationMinutes: 45,
    distanceMeters: 2000,
    avgPaceSecondsPer100m: 135, // 2:15 / 100m
    courseId: 'course-buoy-line',
    courseName: '광안리 해안선 안전부표 횡단 (민락 ↔ 삼익)',
    strokeType: '자유형 (Freestyle)',
    gearType: '웻슈트 (Full Wetsuit)',
    buoyUsed: true,
    waterTemp: 20.1,
    perceivedEffort: 6,
    targetCategory: '체력단련/피트니스 (Fitness)',
    notes: '민락에서 삼익 방향으로 밀물 조류 타고 순항. 아침 일출 바다 수영 경치 최고였음.',
    buddies: '단독 수영 (안전부이 착용)',
    createdAt: new Date('2026-10-20T08:00:00').toISOString(),
  },
  {
    id: 'log-3',
    date: '2026-10-15',
    startTime: '06:15',
    durationMinutes: 28,
    distanceMeters: 1400,
    avgPaceSecondsPer100m: 120, // 2:00 / 100m
    courseId: 'course-buoy-line',
    courseName: '광안리 해안선 안전부표 횡단 (민락 ↔ 삼익)',
    strokeType: '자유형 (Freestyle)',
    gearType: '롱존 (Sleeveless)',
    buoyUsed: true,
    waterTemp: 20.8,
    perceivedEffort: 8,
    targetCategory: '철인3종 훈련 (Triathlon)',
    notes: '철인 모의 드래프팅 훈련. 앞 사람 발끝 30cm 유지하며 페이스 유지 연습.',
    buddies: '철인 동호회 4인 팩 스위밍',
    createdAt: new Date('2026-10-15T07:00:00').toISOString(),
  }
];

export const GWANGALLI_FACILITIES = [
  {
    name: '광안리 공설 야외 세족장 & 샤워장',
    type: '샤워/세족',
    location: '광안리 백사장 중앙 화장실 앞 (광안리 켄트호텔 맞은편)',
    details: '모래 털이용 에어건 및 발 세족장 상시 무료 운영 (하절기 코인 야외 샤워부스)',
    contact: '수영구청 관광과: 051-610-4062'
  },
  {
    name: '광안리 119 수상구조대 (부산소방)',
    type: '안전/응급',
    location: '백사장 중앙 만남의 광장 옆 해변',
    details: '수상구조 보트 대기, 응급처치 AED 구비, 해양 구조대 상주',
    contact: '응급 긴급신고: 119 / 수상구조대: 051-760-4419'
  },
  {
    name: '부산해양경찰서 광안리파출소',
    type: '해경/치안',
    location: '민락항 입구 방면 (민락수변로 17)',
    details: '연안 해상 순찰 및 선박/레저기구 안전 통제',
    contact: '051-664-2134 (해양긴급신고: 112 / 119)'
  },
  {
    name: '바다수영인 추천 샤워 & 환복 스팟',
    type: '편의시설',
    location: '민락회타운 인근 서핑샵/사우나 및 남천동 삼익비치 상가 사우나',
    details: '온수 샤워 및 장비 세척 가능 (사우나 1회 입욕권 또는 제휴샵 이용)',
    contact: '광안해수월드 / 로컬 서프하우스'
  }
];

export const TRIATHLON_DRILLS = [
  {
    id: 'drill-sighting',
    title: '헤드업 (Sighting / 전방주시) 마스터',
    focus: '직진성 확보 & 에너지 손실 최소화',
    steps: [
      '악어 눈(Crocodile Eyes) 기법: 머리를 통째로 들지 말고, 고글만 수면 위로 살짝 올려 목표 부표 확인',
      '호흡과 분리: 머리를 들 때 호흡하지 말고, 시선으로 부표 확인 후 고개를 돌려 수면에서 정상 호흡',
      '주기: 바다가 잔잔할 때는 6~8스트로크당 1회, 파도가 있거나 방향 전환 시 4스트로크당 1회',
      '광안리 팁: 광안대교 주탑 케이블과 해변 호텔 간판을 대형 시각 랜드마크로 활용'
    ]
  },
  {
    id: 'drill-drafting',
    title: '팩 스위밍 드래프팅 (Drafting) 기술',
    focus: '체력 15~25% 절약 및 유체역학 이점',
    steps: [
      '직접 후방 드래프팅: 선두 영자의 발끝 뒤 30~50cm 거리 유지 (거품으로 시야 방해 시 주의)',
      '측면(어깨/골반) 드래프팅: 선두 영자의 엉덩이 또는 무릎 옆에 바짝 붙어 V자 파도(Bow wave) 편승',
      '신체 접촉 대비: 대회 집단 출발(매스 스타트) 시 팔다리 부딪힘에 당황하지 않고 마인드 컨트롤',
      '방향 검증: 앞선 영자가 방향을 잘못 잡을 수도 있으므로 15~20스트로크마다 직접 헤드업 확인'
    ]
  },
  {
    id: 'drill-t1-transition',
    title: 'T1 (수영 ➔ 사이클) 빠른 탈의 요령',
    focus: '시간 단축 및 저체온증 방지',
    steps: [
      '출수 직전: 마지막 50m 지점에서 킥을 빠르게 차서 하체 혈류 순환 촉진',
      '달리면서 슈트 상체 탈의: 백사장으로 뛰어나오며 수경/수모를 벗어 손에 쥐고, 등 뒤 지퍼 끈을 당겨 어깨와 팔을 먼저 탈의',
      '바세린/바디글라이드: 목, 손목, 발목 안쪽에 사전 도포하여 슈트 발목 통과 시 순식간에 벗겨지도록 세팅',
      'T1 바이크 존 도착 시: 슈트를 골반 아래로 내린 뒤 한 발로 밟아 밟으며 쏙 벗어내기'
    ]
  }
];
