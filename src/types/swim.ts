export interface MarineCondition {
  timestamp: string;
  waterTemp: number; // in Celsius e.g. 19.4
  airTemp: number; // in Celsius e.g. 21.0
  waveHeight: number; // in meters e.g. 0.4
  wavePeriod: number; // in seconds e.g. 5.2
  windSpeed: number; // in m/s e.g. 3.5
  windDirection: string; // e.g. '남남동 (SSE)'
  tidePhase: '밀물 (Flood Tide)' | '썰물 (Ebb Tide)' | '만조 (High Tide)' | '간조 (Low Tide)';
  tideLevel: number; // cm
  tideName: string; // e.g. '6물 (사리)'
  nextTideTime: string;
  nextTideType: string;
  visibility: number; // in meters e.g. 3.0
  jellyfishStatus: '안전 (Safe)' | '관심 (Watch)' | '주의 (Alert)' | '경계 (Warning)';
  jellyfishDesc: string;
  safetyScore: number; // 0 - 100
  safetyLevel: '최적 (Optimal)' | '양호 (Good)' | '주의 (Caution)' | '입수 자제 (Restricted)';
  suitRecommendation: string;
  source?: string;
  isLive?: boolean;
  lastUpdated?: string;
  // Detailed real-time ocean & weather metrics
  apparentTemp?: number; // 체감온도 (°C)
  windGusts?: number; // 순간 최대 돌풍 (m/s)
  windDirDeg?: number; // 풍향 각도 (0-360)
  swellWaveHeight?: number; // 너울 파고 (m)
  swellWavePeriod?: number; // 너울 주기 (s)
  swellWaveDirection?: number; // 너울 방향 (deg)
  windWaveHeight?: number; // 풍파/찹 파고 (m)
  windWavePeriod?: number; // 풍파 주기 (s)
  waveDirection?: number; // 통합 파향 각도 (deg)
  waveDirectionText?: string; // e.g. '동남동 (ESE) 115°'
  surfacePressure?: number; // 해면 기압 (hPa)
  relativeHumidity?: number; // 습도 (%)
  precipitation?: number; // 실시간 강수량 (mm)
  sunrise?: string; // 일출 시각 (HH:mm)
  sunset?: string; // 일몰 시각 (HH:mm)
  uvIndex?: number; // 자외선 지수 (0 - 12+)
  pm25?: number; // 초미세먼지 (㎍/㎥)
  pm10?: number; // 미세먼지 (㎍/㎥)
  aqiScore?: number; // AQI 수치
  aqiStatus?: '좋음' | '보통' | '나쁨' | '매우나쁨';
}

export interface SwimCourse {
  id: string;
  name: string;
  nameKo: string;
  distanceMeters: number;
  level: '초급' | '중급' | '상급/철인';
  description: string;
  keyPoints: string[];
  depthRange: string;
  currentWarning: string;
  startPoint: { lat: number; lng: number; label: string };
  turnPoint: { lat: number; lng: number; label: string };
  coordinates: [number, number][]; // [x, y] in SVG canvas coordinates (0-1000, 0-600)
  geoPath?: { lat: number; lng: number }[]; // Real GPS coordinates for Google Maps Polyline
}

export interface SwimLog {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  durationMinutes: number; // minutes
  distanceMeters: number; // meters
  avgPaceSecondsPer100m: number; // seconds e.g. 115 (1:55/100m)
  courseId: string;
  courseName: string;
  strokeType: '자유형 (Freestyle)' | '혼영/드릴 (Mixed/Drill)' | '평영 (Breaststroke)';
  gearType: '웻슈트 (Full Wetsuit)' | '롱존 (Sleeveless)' | '스킨슈트/수영복 (No Suit)' | '네오프렌 삭스/캡 추가';
  buoyUsed: boolean;
  waterTemp: number;
  perceivedEffort: number; // 1-10 RPE
  targetCategory: 'GSR 새벽 정기훈련' | 'GSR 철인 훈련팀' | '철인3종 훈련 (Triathlon)' | '체력단련/피트니스 (Fitness)' | '바다적응/투어 (Tour)';
  notes: string;
  buddies?: string;
  createdAt: string;
}

export interface TriathlonTarget {
  category: '스프린트 (750m)' | '올림픽 코스 (1.5km)' | '하프 70.3 (1.9km)' | '킹코스/풀 (3.8km)';
  distanceMeters: number;
  cutOffMinutes: number;
  targetPaceMinutes: string; // e.g. "1:45"
  goalTimeMinutes: number;
  sightingIntervalStrokes: number;
  estimatedCalories: number;
}

export interface ColdWaterAlertSettings {
  enabled: boolean;
  thresholdTemp: number; // default 18.0 °C
  browserNotification: boolean;
  soundAlert: boolean;
  preventHypothermiaTips: boolean;
}

export interface GSREvent {
  id: string;
  title: string;
  category: '아쿠아슬론' | '마라톤' | '철인3종' | '특별활동' | '정기새벽훈련';
  date: string;
  time: string;
  location: string;
  description: string;
  tag: string;
  participantsCount: number;
}

export interface TideEvent {
  time: string;
  type: '고조(만조)' | '저조(간조)';
  levelCm: number;
}

export interface HourlyForecast {
  hour: string;
  label: string;
  waterTemp: number;
  airTemp: number;
  waveHeight: number;
  windSpeed: number;
  windDirection: string;
  tideLevel: number;
  safetyScore: number;
  safetyLevel: '최적' | '양호' | '주의' | '입수 자제';
}

export interface DailyMarineForecast {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // "화", "수", etc.
  formattedDate: string; // "10.27 (화)"
  isToday: boolean;
  isTomorrow: boolean;
  tideName: string; // e.g. "6물 (사리)"
  tideCycle: '사리' | '조금' | '중조' | '무시';
  tides: TideEvent[];
  waterTempMin: number;
  waterTempMax: number;
  waterTempAvg: number;
  waveHeightMin: number;
  waveHeightMax: number;
  windSpeedMin: number;
  windSpeedMax: number;
  windDirection: string;
  safetyScore: number;
  safetyLevel: '최적' | '양호' | '주의' | '입수 자제';
  suitRecommendation: string;
  summary: string;
  gsrTrainingRecommendation: string;
  sunrise: string;
  sunset: string;
  hourly: HourlyForecast[];
}

export interface MarineDataSource {
  id: string;
  organization: string;
  agencyKo: string;
  systemName: string;
  itemsProvided: string[];
  updateCycle: string;
  description: string;
  officialUrl: string;
  badge: string;
  icon: string;
}

