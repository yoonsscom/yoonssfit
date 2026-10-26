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
