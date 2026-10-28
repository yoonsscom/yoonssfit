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
  apparentTemp: 22.8,
  windGusts: 4.8,
  windDirDeg: 135,
  swellWaveHeight: 0.3,
  swellWavePeriod: 6.2,
  swellWaveDirection: 135,
  windWaveHeight: 0.2,
  windWavePeriod: 3.8,
  waveDirection: 135,
  waveDirectionText: '남동 (SE) 135°',
  surfacePressure: 1016,
  relativeHumidity: 62,
  precipitation: 0.0,
  sunrise: '06:45',
  sunset: '17:35',
  uvIndex: 3.8,
  pm25: 14,
  pm10: 28,
  aqiScore: 24,
  aqiStatus: '좋음',
  source: 'Open-Meteo 실시간 관측',
  isLive: true,
};

export const GWANGAN_BRIDGE_PIER_LAYER = {
  id: 'layer-bridge-pier-round',
  nameKo: '광안대교 기둥(주교각) 왕복 훈련 레이어 (8Q7F44VG+PRP)',
  distanceMeters: 2240,
  pierLocation: { lat: 35.14425, lng: 129.12700, label: '광안대교 남단 주교각 기둥 (8Q7F44VG+PRP)' },
  waterAssemblyPoint: { lat: 35.14725, lng: 129.11725, label: '해상 1차 집결 & 본격 출발 부표 (44W8+WW2)' },
  geoPath: [
    { lat: 35.14711, lng: 129.11514 }, // 남천 백사장 공식 입수지 (44W8+R3R)
    { lat: 35.14725, lng: 129.11725 }, // 해상 1차 집결 & 출발 부표 (44W8+WW2, 190m)
    { lat: 35.14540, lng: 129.12250 }, // 외해 항로 수역 (750m)
    { lat: 35.14425, lng: 129.12700 }, // 광안대교 남단 주교각 기둥 턴 (8Q7F44VG+PRP, 1,120m)
    { lat: 35.14530, lng: 129.12260 }, // 복귀 직선 항로
    { lat: 35.14725, lng: 129.11725 }, // 해상 집결 부표 복귀 (44W8+WW2)
    { lat: 35.14711, lng: 129.11514 }  // 남천 백사장 피니시 (2,240m)
  ]
};

export const GWANGALLI_COURSES: SwimCourse[] = [
  {
    id: 'course-buoy-line',
    name: 'Gwangalli Coastline Safety Buoy Round-Trip Course',
    nameKo: '광안리 해안선 바다 안전 횡단 왕복 (남천 ↔ 8Q7F543F+495)',
    distanceMeters: 2600,
    level: '중급',
    description: '남천 백사장(44W8+R3R) 입수 후 해상 집결 부표(44W8+WW2)에서 모여, 해안선 곡면을 따라 민락 백사장 앞바다 반환점(8Q7F543F+495)을 찍고 남천으로 복귀하는 왕복 2.6km 횡단 코스입니다. (도심/건물 관통 없이 전 구간 바다 위 안전 항로)',
    keyPoints: [
      '남천 협진태양 앞 백사장(44W8+R3R) 입수',
      '190m 헤엄쳐 나와 해상 집결 부표(44W8+WW2)에서 크루 팩 합류 및 출발',
      '광안리 남부 앞바다 70~90m 안전선 해안 곡면 항주',
      '민락 백사장 앞바다 반환점(8Q7F543F+495) 시계방향 턴',
      '동일한 해상 안전선을 따라 해상 집결 부표(44W8+WW2) 복귀 후 남천 백사장 피니시 (왕복 2.6km)'
    ],
    depthRange: '1.8m ~ 4.2m',
    currentWarning: '만조/간조 시 조류가 남천↔민락 방향으로 형성되므로 조류 방향을 파악하고 스윔부이 착용 필수',
    startPoint: { lat: 35.14711, lng: 129.11514, label: '남천 협진태양 앞 입수/피니시 (44W8+R3R)' },
    turnPoint: { lat: 35.15276, lng: 129.12348, label: '민락 백사장 앞바다 반환점 (8Q7F543F+495)' },
    coordinates: [
      [850, 480], // 남천 백사장 입수 (44W8+R3R)
      [815, 410], // 해상 1차 집결 부표 (44W8+WW2)
      [680, 435], // 남천 앞바다 곡선
      [530, 445], // 중앙 앞바다
      [360, 435], // 민락 진입곡선
      [180, 410], // 민락 반환부표 (8Q7F543F+495)
      [360, 435], // 복귀
      [530, 445],
      [680, 435],
      [815, 410], // 해상 집결 부표 복귀
      [850, 480]  // 남천 백사장 출수 피니시
    ],
    geoPath: [
      // 남천 백사장(44W8+R3R) -> 해상 집결 부표(44W8+WW2) -> 민락 반환점(8Q7F543F+495)
      { lat: 35.14711, lng: 129.11514 }, // 남천 협진태양 앞 입수 (44W8+R3R)
      { lat: 35.14725, lng: 129.11725 }, // 해상 1차 집결 & 출발 부표 (44W8+WW2)
      { lat: 35.14920, lng: 129.11760 }, // 해변 남부 앞바다
      { lat: 35.15070, lng: 129.11920 }, // 중앙 만남의광장 앞바다
      { lat: 35.15190, lng: 129.12110 }, // 민락 방향 해상 곡면
      { lat: 35.15276, lng: 129.12348 }, // 민락 백사장 앞바다 턴 부표 (8Q7F543F+495)
      // 민락 반환점 -> 남천 백사장(44W8+R3R) 돌아오는 길
      { lat: 35.15190, lng: 129.12110 },
      { lat: 35.15070, lng: 129.11920 },
      { lat: 35.14920, lng: 129.11760 },
      { lat: 35.14725, lng: 129.11725 }, // 해상 집결 부표 복귀 (44W8+WW2)
      { lat: 35.14711, lng: 129.11514 }  // 남천 백사장 복귀 피니시 (44W8+R3R)
    ]
  },
  {
    id: 'course-bridge-pier-round',
    name: 'Gwangan Bridge Pier Round-Trip Long Swim',
    nameKo: '광안대교 기둥(주교각) 찍고 왕복 롱스윔 (8Q7F44VG+PRP)',
    distanceMeters: 2240,
    level: '상급/철인',
    description: '남천 백사장(44W8+R3R) 입수 후 해상 집결 부표(44W8+WW2)에 모여, 외해 광안대교 남단 오른쪽 주교각 기둥(8Q7F44VG+PRP)을 찍고 돌아오는 왕복 2.24km 대표 롱스윔 코스입니다.',
    keyPoints: [
      '남천 협진태양 앞 백사장(44W8+R3R) 입수',
      '190m 헤엄쳐 나와 해상 집결 부표(44W8+WW2)에서 모여 본격 출발',
      '광안대교 남단 오른쪽 주교각 기둥(8Q7F44VG+PRP)을 향해 1,120m 직진',
      '오른쪽 주교각 기둥 바로 옆 반환점을 시계방향으로 턴',
      '직선 수로를 타고 해상 집결 부표(44W8+WW2) 복귀 후 남천 백사장 출수 피니시 (왕복 2,240m)'
    ],
    depthRange: '3.0m ~ 9.0m',
    currentWarning: '광안대교 교각 부근은 외해 조류와 조석 변화에 따른 유속이 빨라질 수 있으므로 기상청 파고 0.8m 이하 권장 및 버디 필수',
    startPoint: { lat: 35.14711, lng: 129.11514, label: '남천 협진태양 앞 입수/피니시 (44W8+R3R)' },
    turnPoint: { lat: 35.14425, lng: 129.12700, label: '광안대교 오른쪽 주교각(기둥) 반환점 (8Q7F44VG+PRP)' },
    coordinates: [
      [850, 480], // 남천 백사장 입수 (44W8+R3R)
      [815, 410], // 해상 1차 집결 부표 (44W8+WW2)
      [740, 260], // 외해 항로
      [645, 125], // 광안대교 오른쪽 기둥 바로 옆 반환점 (8Q7F44VG+PRP)
      [740, 260], // 복귀 직선 수로
      [815, 410], // 해상 집결 부표 복귀
      [850, 480]  // 남천 백사장 피니시
    ],
    geoPath: [
      { lat: 35.14711, lng: 129.11514 }, // 남천 백사장 출발 (44W8+R3R)
      { lat: 35.14725, lng: 129.11725 }, // 해상 1차 집결 & 본격 출발 부표 (44W8+WW2)
      { lat: 35.14540, lng: 129.12250 }, // 외해 항로 수역 (750m)
      { lat: 35.14425, lng: 129.12700 }, // 광안대교 남단 주교각 기둥 턴 (8Q7F44VG+PRP, 1,120m)
      { lat: 35.14530, lng: 129.12260 }, // 복귀 직선 수로
      { lat: 35.14725, lng: 129.11725 }, // 해상 집결 부표 복귀 (44W8+WW2)
      { lat: 35.14711, lng: 129.11514 }  // 남천 백사장 피니시 (2,240m)
    ]
  },
  {
    id: 'course-triathlon-15k',
    name: 'Triathlon Olympic 1.5K Safe Triangle Loop',
    nameKo: '철인3종 올림픽 1.5km 삼각 루프 코스',
    distanceMeters: 1500,
    level: '중급',
    description: '남천 백사장(44W8+R3R) 입수 후 해상 집결 부표(44W8+WW2)에서 출발하여, 외해 1차 턴 부표와 횡단 2차 턴 부표를 도는 정통 트라이애슬론 1.5km 코스입니다.',
    keyPoints: [
      '남천 협진태양 앞 백사장(44W8+R3R) 입수',
      '해상 집결 부표(44W8+WW2)에서 크루 팩 합류 후 출발',
      '외해 450m 1차 부표 직진 턴',
      '광안리 해변 평행 550m 2차 부표 횡단 (헤드업)',
      '해상 집결 부표 경유 후 스타트 지점 복귀 피니시'
    ],
    depthRange: '2.5m ~ 6.0m',
    currentWarning: '외해 턴 부표에서 헤드업(Sighting)을 통한 방향 유지 및 스윔부이 필수',
    startPoint: { lat: 35.14711, lng: 129.11514, label: '남천 협진태양 앞 입수지점' },
    turnPoint: { lat: 35.14650, lng: 129.12000, label: '외해 1차 턴 부표 (450m)' },
    coordinates: [
      [850, 480],
      [815, 410],
      [670, 240],
      [480, 310],
      [815, 410],
      [850, 480]
    ],
    geoPath: [
      { lat: 35.14711, lng: 129.11514 }, // 남천 입수 (44W8+R3R)
      { lat: 35.14725, lng: 129.11725 }, // 해상 집결 (44W8+WW2)
      { lat: 35.14650, lng: 129.12000 }, // 1차 턴 부표 (외해 450m)
      { lat: 35.15080, lng: 129.12150 }, // 2차 턴 부표 (횡단 550m)
      { lat: 35.14725, lng: 129.11725 }, // 해상 집결 복귀
      { lat: 35.14711, lng: 129.11514 }  // 남천 입수지점 복귀 (500m)
    ]
  },
  {
    id: 'course-center-sprint',
    name: 'Namcheon Coastal Safe Sprint 800m',
    nameKo: '남천 앞바다 안전 스프린트 (800m)',
    distanceMeters: 800,
    level: '초급',
    description: '남천 백사장(44W8+R3R) 입수 후 해상 집결 부표(44W8+WW2)를 거쳐 연안 얕은 수심에서 가볍게 워밍업하는 왕복 스프린트 코스입니다.',
    keyPoints: [
      '남천 협진태양 앞 백사장 입수',
      '해상 집결 부표(44W8+WW2) 집결',
      '모래사장 70m 앞바다 안전부표 왕복',
      '초보자 및 워밍업에 최적'
    ],
    depthRange: '1.2m ~ 2.5m',
    currentWarning: '해변 가까이 유영하며 패들보드나 수상레저 장비와 안전거리 유지',
    startPoint: { lat: 35.14711, lng: 129.11514, label: '남천 백사장 입수' },
    turnPoint: { lat: 35.14920, lng: 129.11760, label: '남천 400m 안전 반환 부표' },
    coordinates: [
      [850, 480],
      [815, 410],
      [630, 430],
      [815, 410],
      [850, 480]
    ],
    geoPath: [
      { lat: 35.14711, lng: 129.11514 },
      { lat: 35.14725, lng: 129.11725 },
      { lat: 35.14920, lng: 129.11760 },
      { lat: 35.14725, lng: 129.11725 },
      { lat: 35.14711, lng: 129.11514 }
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

export const GSR_CREW = {
  name: 'Gwangalli Swimming Running',
  code: 'GSR',
  tagline: '새벽, 바다와 함께 시작하는 하루',
  subTagline: '광안리에서 바다수영과 러닝을 즐기는 크루',
  instagram: '@team__gsr',
  instagramUrl: 'https://www.instagram.com/team__gsr',
  purpose: '운동으로 삶의 질을 높이고, 몸과 마음의 균형을 찾는 모임입니다. 초보도, 느려도 괜찮아요. 중요한 건 꾸준함과 새벽을 이겨내는 의지!',
  helpMessage: '못해도 부족해도 다 도와드리겠습니다.',
  joinConditions: [
    '20세 ~ 80년생 누구나 환영',
    '수영 / 러닝 실력 무관 (초보자 적극 환영)',
    '의지와 성실함만 있으면 OK'
  ],
  schedule: {
    summer: '하계: 새벽 06:00 집결',
    winter: '동계: 새벽 06:30 집결',
    location: '광안리 백사장 중앙 (드론쇼 광장 & 만남의 광장 시계탑 앞)',
    monthlyFee: '월 5,000원 (운영비 / 비상구급함 / 보급품 지원)'
  },
  mentors: [
    { title: '수영 전문 강사진', badge: '다수 보유', desc: '자유형 자세 교정, 오픈워터 바다 호흡, 부표 턴 노하우 전수' },
    { title: '철인 풀코스 완주자', badge: '다수 보유', desc: '수영 3.8km + 사이클 180km + 마라톤 42.195km 아이언맨 완주 경험' },
    { title: '풀코스 마라톤 섭3(Sub-3)', badge: '다수 보유', desc: '2시간대 마라토너의 페이스 세팅, 케이던스, LSD 지속주 가이드' },
    { title: '자전거 매장 및 공방 운영자', badge: '전문가 보유', desc: '로드/TT 바이크 피팅, 기재 점검, T1/T2 전환 훈련 지원' },
    { title: '사진 & 영상 작가진', badge: '다수 보유', desc: '광안대교 일출을 배경으로 한 감성 바다수영 인생샷 및 훈련 릴스 제작' }
  ],
  officialEvents2026: [
    {
      id: 'gsr-event-1',
      title: '2026 TEAM_GSR 광안리 아쿠아슬론',
      category: '아쿠아슬론',
      date: '2026년 6월 예정',
      time: '06:00',
      location: '광안리 해변 & 해안도로',
      description: '바다수영 1.5km + 해안선 로드 러닝 10km 논스톱 아쿠아슬론 대회',
      tag: '수영+러닝 콤보',
      participantsCount: 38
    },
    {
      id: 'gsr-event-2',
      title: '2026 GSR 마라톤 챌린지',
      category: '마라톤',
      date: '2026년 가을 시즌',
      time: '07:30',
      location: '전국 마라톤 대회 동반 출전 (풀·하프·10K)',
      description: '섭3 멘토진 페이서와 함께하는 PB(개인 최고기록) 달성 프로젝트',
      tag: '풀·하프·10km',
      participantsCount: 45
    },
    {
      id: 'gsr-event-3',
      title: '2026 GSR 철인3종 그랑프리 도전',
      category: '철인3종',
      date: '2026년 5월 ~ 10월',
      time: '새벽/주말',
      location: '통영/고성/제주 등 전국대회',
      description: '올림픽 코스부터 킹코스 완주까지 GSR 철인 전용 훈련팀 합동 출전',
      tag: '수영+자전거+러닝',
      participantsCount: 24
    },
    {
      id: 'gsr-event-4',
      title: '2026 TEAM_GSR 가을 친선 대운동회',
      category: '특별활동',
      date: '2026년 10월 예정',
      time: '09:00',
      location: '광안리 삼익비치 잔디광장 & 해변',
      description: '비치 릴레이, 줄다리기, 패들보드 레이스 및 뒷풀이 네트워킹',
      tag: '크루 친목 페스티벌',
      participantsCount: 60
    }
  ],
  specialActivities: [
    {
      title: '광안대교 별그리기 5km',
      icon: '⭐',
      desc: '광안리 해변과 골목, 수변공원을 뛰거나 수영하며 스트라바 GPS 아트로 광안대교 별모양 완성하기'
    },
    {
      title: '해운대 ➔ 광안리 해안 러닝 (7.5km)',
      icon: '🌅',
      desc: '동백섬과 마린시티, 민락교를 건너 광안리 백사장으로 이어지는 부산 최고의 오션뷰 선셋/모닝 런'
    },
    {
      title: '송정 ➔ 광안리 수영/러닝 크로스 원정',
      icon: '🌊',
      desc: '송정 해변 서핑존 바다수영 후 광안리로 이어지는 장거리 엔듀런스 크로스 훈련'
    },
    {
      title: '기장 해동용궁사 러닝 챌린지',
      icon: '⛩️',
      desc: '기장 오시리아 해안 절벽을 따라 용궁사로 달리는 주말 힐링 롱런'
    },
    {
      title: '오륙도 & 울릉도 섬 원정 탐험',
      icon: '🏝️',
      desc: '오륙도 연안 바다수영 투어 및 울릉도 해양 원정 스윔 & 트레일러닝'
    },
    {
      title: '8.15 광복절 기념 평화 러닝',
      icon: '🇰🇷',
      desc: '광복절 새벽 8.15km 광안리 해변을 함께 달리는 매년 정기 전통 행사'
    },
    {
      title: '타 러닝·수영 모임과의 연합 운동회',
      icon: '🤝',
      desc: '부산 경남권 러닝 크루 및 바다수영 클럽과의 오픈 친선 교류전'
    }
  ],
  ironmanSquad: {
    name: 'GSR 철인 전용 훈련팀 (Ironman Squad)',
    desc: '기본 체력 보유자 및 2026 공식 철인3종(트라이애슬론) 대회 출전을 준비하는 집중 훈련 그룹',
    features: [
      '오픈워터 바다수영 1.5km ~ 3.8km 인터벌 팩스위밍',
      '사이클 + 러닝 브릭(Brick) 훈련 (광안리 ↔ 기장/간절곶 코스)',
      'T1 / T2 전환 구역 장비 세팅 및 실전 트랜지션 시뮬레이션',
      '대회 보급 플랜(파워젤, BCAA, 전해질) 및 심박수 존 관리 코칭'
    ]
  }
};

export interface MaritimeLandmark {
  id: string;
  name: string;
  category: 'safety' | 'meeting' | 'buoy' | 'landmark' | 'facility';
  lat: number;
  lng: number;
  desc: string;
  icon: string;
  contact?: string;
}

export const GWANGALLI_LANDMARKS: MaritimeLandmark[] = [
  {
    id: 'lm-gsr-gathering',
    name: 'GSR 공식 집결지 (남천협진태양 앞 화장실 파라솔)',
    category: 'meeting',
    lat: 35.14719,
    lng: 129.11456,
    desc: '모여서 짐 놔두고 준비운동 및 스트레칭을 진행하는 TEAM_GSR 공식 집결지입니다. (Plus Code: 44W7+VR 부산광역시)',
    icon: '🏖️'
  },
  {
    id: 'lm-gsr-entry',
    name: '남천동 협진태양 앞 백사장 입수지점',
    category: 'meeting',
    lat: 35.14711,
    lng: 129.11514,
    desc: 'GSR 바다수영 공식 출발 및 피니시 입수 구역입니다. (Plus Code: 44W8+R3R)',
    icon: '🚩'
  },
  {
    id: 'lm-gsr-water-assembly',
    name: 'GSR 해상 1차 집결 & 본격 출발 부표 (44W8+WW2)',
    category: 'buoy',
    lat: 35.14725,
    lng: 129.11725,
    desc: '백사장 입수(44W8+R3R) 후 190m 전방으로 헤엄쳐 나와 모인 뒤 횡단과 광안대교 왕복을 본격 시작하는 해상 집결 부표입니다. (Plus Code: 44W8+WW2)',
    icon: '🏊'
  },
  {
    id: 'lm-rescue-119',
    name: '광안리 119 시민수상구조대',
    category: 'safety',
    lat: 35.1522,
    lng: 129.1172,
    desc: '해수욕장 개장 및 상시 긴급 인명구조, 자동심장충격기(AED) 및 응급처치소 운영',
    icon: '🚨',
    contact: '051-760-5119'
  },
  {
    id: 'lm-police',
    name: '부산해양경찰서 광안리출장소',
    category: 'safety',
    lat: 35.1552,
    lng: 129.1238,
    desc: '연안 해역 순찰 경비정 운영, 안전사고 예방 및 해상 조난 신고 접수',
    icon: '👮‍♂️',
    contact: '051-663-2212'
  },
  {
    id: 'lm-ocean-buoy',
    name: '국립해양조사원 광안리 해양관측부표',
    category: 'buoy',
    lat: 35.1500,
    lng: 129.1250,
    desc: '실시간 수온, 파고, 유속, 조위 실측 센서가 탑재된 외해 해양기상 관측부표',
    icon: '🌊'
  },
  {
    id: 'lm-millak-turn',
    name: '민락 횡단 반환 부표 (8Q7F543F+495)',
    category: 'buoy',
    lat: 35.15276,
    lng: 129.12348,
    desc: '광안리 해안선 바다 안전 횡단 왕복 코스의 북단 반환 턴 부표 지점입니다. (Plus Code: 8Q7F543F+495)',
    icon: '🟡'
  },
  {
    id: 'lm-gwangan-bridge-pier',
    name: '광안대교 남단 주교각 기둥 (8Q7F44VG+PRP)',
    category: 'landmark',
    lat: 35.14425,
    lng: 129.12700,
    desc: '광안대교 기둥 찍고 왕복 2,240m 롱스윔의 외해 반환 교각 지점입니다. (Plus Code: 8Q7F44VG+PRP)',
    icon: '🌉'
  },
  {
    id: 'lm-shower',
    name: '광안리 남천/중앙 샤워·탈의실 & 공중화장실',
    category: 'facility',
    lat: 35.14719,
    lng: 129.11456,
    desc: '남천협진태양 앞 공중화장실 및 야외 세족장 (짐 보관 파라솔 인접)',
    icon: '🚿'
  }
];
