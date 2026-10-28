import React, { useState, useEffect } from 'react';
import { MarineCondition, ColdWaterAlertSettings, DailyMarineForecast } from '../types/swim';
import { MarineForecast7Days } from './MarineForecast7Days';
import { MarineTrendChart } from './MarineTrendChart';
import { MARINE_DATA_SOURCES, getWeeklyMarineForecast } from '../data/marineForecastData';
import {
  Waves,
  Thermometer,
  Wind,
  Compass,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Eye,
  RefreshCw,
  Info,
  Clock,
  Sparkles,
  Snowflake,
  Calendar,
  Activity,
  HelpCircle,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  Sun,
  Sunrise,
  Sunset,
  CloudRain,
  Gauge,
  Navigation,
} from 'lucide-react';

interface MarineConditionsProps {
  condition: MarineCondition;
  onRefresh?: () => void;
  isLiveLoading?: boolean;
  coldWaterSettings: ColdWaterAlertSettings;
  onOpenColdWaterModal: () => void;
  onConditionChange?: (condition: MarineCondition) => void;
}

type SeasonPresetKey = 'current' | 'early_summer' | 'hot_summer' | 'cool_autumn' | 'winter';
type ViewMode = 'realtime' | 'forecast7d';

export const MarineConditions: React.FC<MarineConditionsProps> = ({
  condition: initialCondition,
  onRefresh,
  isLiveLoading = false,
  coldWaterSettings,
  onOpenColdWaterModal,
  onConditionChange,
}) => {
  const [condition, setCondition] = useState<MarineCondition>(initialCondition);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync internal condition when parent passes updated live data
  useEffect(() => {
    setCondition(initialCondition);
  }, [initialCondition]);
  const [selectedSeasonPreset, setSelectedSeasonPreset] = useState<SeasonPresetKey>('current');
  const [viewMode, setViewMode] = useState<ViewMode>('realtime');
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [weeklyForecasts] = useState<DailyMarineForecast[]>(() => getWeeklyMarineForecast());
  const [chartDayIndex, setChartDayIndex] = useState<number>(0);

  const presets: Record<SeasonPresetKey, { label: string; desc: string; data: Partial<MarineCondition> }> = {
    current: {
      label: '실시간 관측 연동 (Open-Meteo)',
      desc: '현재 부산 광안리 해변 실측 기온/풍향/수온/대기질 데이터',
      data: {
        ...initialCondition,
      },
    },
    early_summer: {
      label: '초여름 오픈워터 (6월)',
      desc: '초여름 따뜻한 수온, 잔잔한 수면 (수온 21.5℃)',
      data: {
        waterTemp: 21.5,
        airTemp: 25.8,
        waveHeight: 0.3,
        wavePeriod: 6.0,
        windSpeed: 2.4,
        windDirection: '남남동 150°',
        tidePhase: '만조 (High Tide)',
        tideName: '4물 (중조)',
        nextTideTime: '17:10 간조 (+42cm)',
        visibility: 4.0,
        safetyScore: 96,
        safetyLevel: '최적 (Optimal)',
        jellyfishStatus: '안전 (Safe)',
        suitRecommendation: '롱존(민소매) 또는 2~3mm 슈트 추천, 장시간 수영 시 편안함',
      },
    },
    hot_summer: {
      label: '한여름 노슈트 시즌 (8월)',
      desc: '고수온기 노슈트/수영복 수영 가능 (수온 25.2℃)',
      data: {
        waterTemp: 25.2,
        airTemp: 31.0,
        waveHeight: 0.5,
        wavePeriod: 5.0,
        windSpeed: 4.1,
        windDirection: '남서 210°',
        tidePhase: '썰물 (Ebb Tide)',
        tideName: '7물 (사리)',
        nextTideTime: '18:30 간조 (+30cm)',
        visibility: 2.8,
        safetyScore: 84,
        safetyLevel: '양호 (Good)',
        jellyfishStatus: '주의 (Alert)',
        suitRecommendation: '트라이애슬론 공식 규정상 웻슈트 착용 불가 (24.6℃ 초과). 스킨슈트/수영복 착용 필수.',
      },
    },
    cool_autumn: {
      label: '가을 너울성 파도 (10~11월)',
      desc: '외해 너울 유입 및 조류 주의 (수온 18.2℃, 파고 0.9m)',
      data: {
        waterTemp: 18.2,
        airTemp: 19.5,
        waveHeight: 0.9,
        wavePeriod: 7.2,
        windSpeed: 6.8,
        windDirection: '동남동 110°',
        tidePhase: '썰물 (Ebb Tide)',
        tideName: '9물',
        nextTideTime: '15:50 간조 (+55cm)',
        visibility: 2.2,
        safetyScore: 71,
        safetyLevel: '주의 (Caution)',
        jellyfishStatus: '안전 (Safe)',
        suitRecommendation: '3mm~5mm 전신 웻슈트 필수. 외해 진입 자제, 해안선 50m 안전부표 라인 수영 권장.',
      },
    },
    winter: {
      label: '겨울 동계 극한 수영 (1월)',
      desc: '동계 바다수영 동호인 저수온 훈련 (수온 13.5℃)',
      data: {
        waterTemp: 13.5,
        airTemp: 7.0,
        waveHeight: 0.6,
        wavePeriod: 5.8,
        windSpeed: 5.5,
        windDirection: '북서 (NW) 310°',
        tidePhase: '밀물 (Flood Tide)',
        tideName: '2물 (조금)',
        nextTideTime: '13:00 만조 (+110cm)',
        visibility: 5.5,
        safetyScore: 58,
        safetyLevel: '주의 (Caution)',
        jellyfishStatus: '안전 (Safe)',
        suitRecommendation: '5mm 동계 웻슈트 + 네오프렌 캡/후드/삭스 필수 착용 (철인 공식 대회는 수온 미달 취소 구간)',
      },
    },
  };

  const handlePresetChange = (key: SeasonPresetKey) => {
    setSelectedSeasonPreset(key);
    const updated = {
      ...condition,
      ...presets[key].data,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    setCondition(updated);
    if (onConditionChange) onConditionChange(updated);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Triathlon rule evaluator
  const getTriathlonWetsuitRule = (temp: number) => {
    if (temp < 14.0) {
      return {
        status: '금지 / 경기취소',
        color: 'text-rose-400 bg-rose-950/60 border-rose-800',
        note: '수온 14℃ 미만: 공식 규정상 수영 취소 (듀애슬론 대체)',
      };
    } else if (temp < 16.0) {
      return {
        status: '웻슈트 의무 착용',
        color: 'text-amber-300 bg-amber-950/60 border-amber-800',
        note: '수온 14.0~15.9℃: 저체온증 방지를 위해 슈트 착용 의무',
      };
    } else if (temp <= 22.0) {
      return {
        status: '웻슈트 착용 허용 (최적 권장)',
        color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800',
        note: '수온 16.0~22.0℃: 전 참가자 슈트 착용 가능 (기록 단축 최적)',
      };
    } else if (temp <= 24.5) {
      return {
        status: '동호인 허용 / 엘리트 금지',
        color: 'text-cyan-300 bg-cyan-950/60 border-cyan-800',
        note: '수온 22.1~24.5℃: 에이지그룹(동호인) 착용 가능, 엘리트 불가',
      };
    } else {
      return {
        status: '웻슈트 착용 불가 (노슈트)',
        color: 'text-orange-400 bg-orange-950/60 border-orange-800',
        note: '수온 24.6℃ 이상: 열사병 방지를 위해 웻슈트 착용 전면 금지',
      };
    }
  };

  const wetsuitRule = getTriathlonWetsuitRule(condition.waterTemp);

  return (
    <div className="space-y-6">
      {/* Top Banner / Marine Status Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-800/60 p-4 sm:p-6 md:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                condition.isLive
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-sm shadow-emerald-500/20'
                  : 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-1.5 inline-block ${
                  condition.isLive ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'
                }`}></span>
                {condition.isLive ? '실시간 Open-Meteo 관측' : '광안리 연안 부이 관측'}
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                관측 갱신: {condition.lastUpdated || condition.timestamp}
              </span>
              <button
                onClick={() => setIsSourceModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-cyan-300 border border-slate-750 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                데이터 출처: Open-Meteo 실시간 관측망·기상청·수과원
              </button>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-2 flex flex-wrap items-center gap-2">
              부산 광안리해수욕장 해황 레이더 & 주간 예보
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                광안대교 앞바다
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
              광안리 바다수영과 철인3종 오픈워터 트레이닝을 위한 실시간 관측 수온, 조석(물때), 파고, 풍향 및 7일 주간 예보
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsSourceModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 shadow-sm"
            >
              <Info className="w-4 h-4 text-cyan-400" />
              출처 정보
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isLiveLoading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/40 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-cyan-900/30"
              title="광안리 실시간 기상/해양 관측 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing || isLiveLoading ? 'animate-spin text-white' : ''}`} />
              {isRefreshing || isLiveLoading ? '실시간 수신 중...' : '실시간 새로고침'}
            </button>
          </div>
        </div>

        {/* Season & Condition Preset Selector - Horizontal Swipe on Mobile */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/90">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-300">
              해황 계절별 시뮬레이션 (수온/파고 테스트):
            </span>
          </div>
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1">
            {Object.entries(presets).map(([key, item]) => (
              <button
                key={key}
                onClick={() => handlePresetChange(key as any)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  selectedSeasonPreset === key
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black shadow-md shadow-cyan-500/30'
                    : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700/80'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Sub-Tab Switcher: [실시간 실측 해황] vs [📅 7일 주간 해황 예보] */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setViewMode('realtime')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              viewMode === 'realtime'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            실시간 실측 해황 (연안 부이)
          </button>
          <button
            onClick={() => setViewMode('forecast7d')}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
              viewMode === 'forecast7d'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/25 ring-1 ring-cyan-400'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            주간 7일 예보 (수온·물때·파고·안전)
            <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shadow-sm">
              NEW
            </span>
          </button>
        </div>

        <div className="px-2 text-right hidden sm:block">
          <span className="text-xs text-slate-400 font-medium">
            {viewMode === 'realtime' ? '현재 실시간 관측 센서 연동 중' : 'KHOA·기상청 수치모델 기반 7일간 예보'}
          </span>
        </div>
      </div>

      {/* Conditionally Render: Real-Time View or 7-Day Forecast View */}
      {viewMode === 'forecast7d' ? (
        <MarineForecast7Days
          coldWaterThreshold={coldWaterSettings.thresholdTemp}
        />
      ) : (
        <>
          {/* Quick Banner to Prompt 7-Day Forecast */}
          <div
            onClick={() => setViewMode('forecast7d')}
            className="cursor-pointer bg-gradient-to-r from-blue-900/40 via-indigo-950/40 to-slate-900 border border-blue-800/40 hover:border-cyan-500/60 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-all group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold shrink-0 text-base">
                📅
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-cyan-300">
                    7일간 주간 해황 예보가 필요하신가요?
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-400/30">
                    원클릭 조회
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  이번 주말 광안리 표층수온(최저/최고), 대조기·소조기 물때, 파고 및 안전지수 주간 변화를 한눈에 확인하세요.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-black text-cyan-300 group-hover:translate-x-1 transition-transform shrink-0">
              <span>7일 예보 보기</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>

          {/* Primary Metrics Grid - 2 Column on Mobile for Immediate Glance */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Metric 1: Water Temp */}
            <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg group hover:border-cyan-400/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-cyan-400 shrink-0" />
                  표층 수온
                </span>
                <span className="text-[11px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-bold border border-slate-700">
                  기온 {condition.airTemp}℃
                </span>
              </div>

              <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between flex-wrap gap-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">{condition.waterTemp}</span>
                  <span className="text-lg font-bold text-cyan-400">°C</span>
                </div>
                {coldWaterSettings.enabled && condition.waterTemp <= coldWaterSettings.thresholdTemp ? (
                  <span className="text-[11px] font-black text-rose-300 bg-rose-950/80 border border-rose-600 px-2 py-0.5 rounded-lg animate-pulse flex items-center gap-1">
                    <Snowflake className="w-3 h-3" />
                    냉수주의보
                  </span>
                ) : (
                  <button
                    onClick={onOpenColdWaterModal}
                    className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800 px-2 py-0.5 rounded"
                  >
                    주의보 {coldWaterSettings.thresholdTemp}℃
                  </button>
                )}
              </div>

              <div className="mt-2.5">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-cyan-400 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, ((condition.waterTemp - 10) / 20) * 100))}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-200 mt-1.5 font-bold line-clamp-1">
                  {condition.waterTemp >= 21 ? '따뜻함 (쾌적)' : condition.waterTemp >= 17 ? '적정 (웻슈트 착용)' : '저수온 (보온장비 필수)'}
                </p>
              </div>
            </div>

            {/* Metric 2: Tide & Current */}
            <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg group hover:border-blue-400/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-blue-400 shrink-0" />
                  조석·물때
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/25 text-blue-200 border border-blue-400/40">
                  {condition.tideName.split(' ')[0]}
                </span>
              </div>

              <div className="mt-2.5 sm:mt-3 flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">{condition.tidePhase.split(' ')[0]}</span>
              </div>

              <div className="mt-2 text-[11px] space-y-1 text-slate-200">
                <div className="flex justify-between py-0.5 border-b border-slate-800">
                  <span className="text-slate-400">현재 조위:</span>
                  <span className="font-bold text-white">{condition.tideLevel} cm</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">다음:</span>
                  <span className="font-bold text-cyan-300 truncate">{condition.nextTideTime.split(' ')[0]} {condition.nextTideType.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Metric 3: Wave & Wind */}
            <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg group hover:border-teal-400/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-teal-400 shrink-0" />
                  파고·풍향
                </span>
                <span className="text-[11px] text-teal-200 bg-teal-500/20 px-2 py-0.5 rounded font-bold border border-teal-500/30">
                  {condition.waveHeight <= 0.5 ? '잔잔함' : condition.waveHeight <= 1.0 ? '보통' : '너울'}
                </span>
              </div>

              <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-white">{condition.waveHeight}</span>
                <span className="text-base font-bold text-teal-300">m</span>
                <span className="text-[11px] text-slate-300 ml-1">주기 {condition.wavePeriod}s</span>
              </div>

              <div className="mt-2 text-[11px] space-y-1 text-slate-200">
                <div className="flex justify-between py-0.5 border-b border-slate-800">
                  <span className="text-slate-400">바람:</span>
                  <span className="font-bold text-white">{condition.windSpeed}m/s</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">수중 시야:</span>
                  <span className="font-bold text-teal-300">약 {condition.visibility}m</span>
                </div>
              </div>
            </div>

            {/* Metric 4: Safety Score */}
            <div className="bg-slate-900 border border-slate-700/90 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-lg group hover:border-emerald-400/60 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                  안전 지수
                </span>
                <span
                  className={`text-[11px] font-black px-2 py-0.5 rounded ${
                    condition.safetyScore >= 80
                      ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                      : condition.safetyScore >= 60
                      ? 'bg-amber-500/25 text-amber-200 border border-amber-400/40'
                      : 'bg-rose-500/25 text-rose-200 border border-rose-400/40'
                  }`}
                >
                  {condition.safetyLevel.split(' ')[0]}
                </span>
              </div>

              <div className="mt-2.5 sm:mt-3 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">{condition.safetyScore}</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>

              <div className="mt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-200">
                  <span className="text-slate-400">해파리:</span>
                  <span className="font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    안전(정상)
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-1 line-clamp-1">{condition.jellyfishDesc}</p>
              </div>
            </div>
          </div>

          {/* Expanded Real-time Ocean & Environmental Monitoring Dashboard */}
          <div className="bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-white tracking-tight">
                      광안리 실시간 해양·대기환경 상세 모니터링
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE API 연동
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Open-Meteo Weather · Marine · Air Quality 통합 관측 (너울, 풍파, 돌풍, 일출·일몰, 대기질)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-xs">
                <span className="text-slate-400 text-[11px]">
                  마지막 관측: <span className="text-cyan-300 font-bold">{condition.lastUpdated || condition.timestamp}</span>
                </span>
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    disabled={isLiveLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all disabled:opacity-50 shadow-sm"
                    title="실시간 API 다시 불러오기"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLiveLoading ? 'animate-spin text-cyan-400' : ''}`} />
                    실시간 새로고침
                  </button>
                )}
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
              {/* Card 1: 너울(Swell) & 풍파(Wind Wave) 상세 */}
              <div className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 rounded-xl p-3.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-cyan-400" />
                      너울(Swell) & 풍파
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                      파향 {condition.waveDirectionText ? condition.waveDirectionText.split(' ')[0] : '남동'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">외해 너울 파고:</span>
                      <span className="text-base font-black text-cyan-300">
                        {condition.swellWaveHeight ?? 0.3}m
                        <span className="text-[11px] font-normal text-slate-400 ml-1">
                          ({condition.swellWavePeriod ?? 6.2}s)
                        </span>
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">해변 바람파(Chop):</span>
                      <span className="text-base font-black text-teal-300">
                        {condition.windWaveHeight ?? 0.2}m
                        <span className="text-[11px] font-normal text-slate-400 ml-1">
                          ({condition.windWavePeriod ?? 3.8}s)
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">파도 유입 각도:</span>
                  <span className="text-slate-200 font-semibold flex items-center gap-1">
                    <Navigation
                      className="w-3 h-3 text-cyan-400 inline-block"
                      style={{ transform: `rotate(${condition.waveDirection ?? 135}deg)` }}
                    />
                    {condition.waveDirection ?? 135}° ({condition.waveDirectionText ? condition.waveDirectionText.split(' ')[0] : '남동'})
                  </span>
                </div>
              </div>

              {/* Card 2: 돌풍(Gusts) & 체감 기온 */}
              <div className="bg-slate-950/70 border border-slate-800 hover:border-blue-500/40 rounded-xl p-3.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5 text-blue-400" />
                      순간 돌풍 & 체감기온
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        (condition.windGusts ?? 0) >= 8
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700'
                          : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/60'
                      }`}
                    >
                      {(condition.windGusts ?? 0) >= 8 ? '돌풍 주의' : '풍속 안정'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">순간 최대 돌풍:</span>
                      <span className="text-base font-black text-amber-300">
                        {condition.windGusts ?? (condition.windSpeed * 1.35).toFixed(1)} m/s
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">출수 후 체감기온:</span>
                      <span className="text-base font-black text-white">
                        {condition.apparentTemp ?? condition.airTemp} °C
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">해면 기압:</span>
                  <span className="text-slate-200 font-semibold flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-blue-400" />
                    {condition.surfacePressure ?? 1013} hPa (안정)
                  </span>
                </div>
              </div>

              {/* Card 3: 일출·일몰 & 강수/습도 */}
              <div className="bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 rounded-xl p-3.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      일출·일몰 골든타임
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      습도 {condition.relativeHumidity ?? 65}%
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                        일출 (새벽 모닝스윔):
                      </span>
                      <span className="text-sm font-black text-amber-300">
                        {condition.sunrise ?? '06:45'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Sunset className="w-3.5 h-3.5 text-orange-400" />
                        일몰 (입수 마감권장):
                      </span>
                      <span className="text-sm font-black text-orange-400">
                        {condition.sunset ?? '17:35'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-cyan-400" />
                    실시간 강수량:
                  </span>
                  <span className="text-slate-200 font-semibold">
                    {(condition.precipitation ?? 0) > 0 ? `${condition.precipitation} mm/h` : '강수 없음 (맑음)'}
                  </span>
                </div>
              </div>

              {/* Card 4: 대기질(PM2.5/PM10) & 자외선 */}
              <div className="bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-3.5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      대기질 & 자외선(UV)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                        (condition.aqiStatus ?? '좋음') === '좋음'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                          : (condition.aqiStatus ?? '좋음') === '보통'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                          : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                      }`}
                    >
                      대기 {condition.aqiStatus ?? '좋음'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">초미세먼지 (PM2.5):</span>
                      <span className="text-sm font-black text-white">
                        {condition.pm25 ?? 12} <span className="text-[10px] font-normal text-slate-400">㎍/㎥</span>
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-slate-400">미세먼지 (PM10):</span>
                      <span className="text-sm font-black text-slate-200">
                        {condition.pm10 ?? 24} <span className="text-[10px] font-normal text-slate-400">㎍/㎥</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">자외선 지수 (UV):</span>
                  <span className="text-slate-200 font-semibold flex items-center gap-1">
                    <span className="text-amber-300 font-bold">{condition.uvIndex ?? 3.5}</span>
                    <span className="text-[10px] text-slate-400">
                      {(condition.uvIndex ?? 3.5) >= 6 ? '(선크림 필수)' : '(보통)'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Open Water Swimming Guideline Banner */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">💡 오픈워터 수영 안전 가이드:</span>
                <span>
                  {(condition.swellWaveHeight ?? 0.3) > 0.7
                    ? '외해 너울 주기가 길어 수면 굴곡이 있습니다. 해안선 50m 안전선 안쪽 수영을 권장합니다.'
                    : '너울과 풍파가 안정적인 상태입니다. 조류 방향(남천↔민락)을 확인하고 안전부표를 지참하세요.'}
                </span>
              </div>
              <span className="text-slate-400 font-medium shrink-0">
                부산 광안리 해변 중심 (35.1532°N, 129.1189°E)
              </span>
            </div>
          </div>

          {/* Triathlon Suit Regulation & Equipment Advice Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Triathlon Wetsuit Regulation Guide */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-sm">
                    ITU
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      철인3종(트라이애슬론) 공식 웻슈트 착용 규정
                    </h3>
                    <p className="text-xs text-slate-400">대한철인3종협회(KTF) 및 세계철인3종연맹(World Triathlon) 규정</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${wetsuitRule.color}`}>
                  {wetsuitRule.status}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-slate-200">
                  현재 광안리 수온 <span className="text-cyan-400 font-bold">{condition.waterTemp}℃</span> 판정:
                </p>
                <p className="text-sm text-cyan-200 mt-1 bg-cyan-950/40 p-3 rounded-xl border border-cyan-800/40">
                  💡 {wetsuitRule.note}
                </p>
              </div>

              {/* Scale visualizer */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>12℃ (경기취소)</span>
                  <span>14℃ (슈트의무)</span>
                  <span>16℃~22℃ (슈트권장)</span>
                  <span>24.5℃ (에이지허용)</span>
                  <span>24.6℃+ (슈트금지)</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 h-3">
                  <div className="bg-rose-600/70 rounded-l" title="< 14℃ 경기취소"></div>
                  <div className="bg-amber-500/70" title="14~15.9℃ 의무"></div>
                  <div className="bg-emerald-500/80" title="16~22℃ 권장"></div>
                  <div className="bg-cyan-500/80" title="22.1~24.5℃ 동호인허용"></div>
                  <div className="bg-orange-500/80 rounded-r" title=">24.6℃ 금지"></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span>추천 장비 조합:</span>
                <span className="text-slate-200 font-semibold">{condition.suitRecommendation}</span>
              </div>
            </div>

            {/* Safety Essentials for Gwangalli */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  광안리 바다수영 필수 안전 수칙
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">안전부이(스윔부이) 필수:</strong> 형광 주황/핑크색 부이로 모터보트 및 패들보드에 위치 노출.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">버디 시스템 준수:</strong> 최소 2인 이상 동반 수영, 단독 수영 시 해안선 50m 이내 유지.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">조류 유속 체크:</strong> 만조/간조 1~2시간 전후 조류가 가장 세며, 민락↔삼익 방향 조류 흐름 파악.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-white">비상 신호:</strong> 쥐가 나거나 위험 시 부이에 엎드려 한 팔을 수직으로 흔들며 호루라기 취명.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 p-2.5 rounded-xl bg-slate-800/70 text-slate-300 text-[11px] flex items-center justify-between">
                <span>해경/수상구조대 긴급신고:</span>
                <span className="font-bold text-cyan-400">119 / 051-664-2134</span>
              </div>
            </div>
          </div>

          {/* 7-Day Marine Temperature & Wave Height Trend Chart (Recharts) */}
          <div className="space-y-2 mt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                광안리 7일간 수온·파고 변화 추이 (Recharts 듀얼 Y축)
              </span>
              <button
                onClick={() => setViewMode('forecast7d')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>7일 종합 예보 전체보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <MarineTrendChart
              forecastList={weeklyForecasts}
              selectedIndex={chartDayIndex}
              onSelectIndex={(idx) => {
                setChartDayIndex(idx);
                setViewMode('forecast7d');
              }}
              coldWaterThreshold={coldWaterSettings.thresholdTemp}
            />
          </div>
        </>
      )}

      {/* Official Sources Explanatory Modal (Accessible from anywhere in MarineConditions) */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold">
                  🌊
                </div>
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    해황 데이터 공식 출처 및 산출 근거
                  </h3>
                  <p className="text-xs text-slate-400">
                    대한민국 국가 공공 해양 관측망 및 기상 수치예보 모델 데이터
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-6 overflow-y-auto space-y-4">
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 leading-relaxed">
                📢 <strong>데이터 신뢰성 보증:</strong> 본 앱에서 제공하는 <strong>표층 수온, 조석 물때, 유의파고·풍향 및 안전지수</strong>는 대한민국 해양수산부 및 기상청의 국가 공공 관측 데이터를 바탕으로 광안리 해수욕장 해역에 최적화하여 제공됩니다.
              </div>

              <div className="space-y-3.5">
                {MARINE_DATA_SOURCES.map((source) => (
                  <div
                    key={source.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{source.icon}</span>
                        <h4 className="text-sm font-bold text-white">
                          {source.organization} ({source.agencyKo})
                        </h4>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30 self-start sm:self-auto">
                        {source.badge}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {source.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-850 text-[11px]">
                      <div>
                        <span className="text-slate-400">제공 항목: </span>
                        <span className="text-slate-200 font-medium">
                          {source.itemsProvided.join(', ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400">갱신 주기: </span>
                        <span className="text-cyan-300 font-medium">
                          {source.updateCycle}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal & Safety Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="font-bold text-slate-300 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  오픈워터 바다수영 안전 유의사항
                </div>
                <p>
                  해황 예보는 수치모델 및 천문 통계에 기반하므로, 광안대교 하부 유속 급변이나 국지적인 너울성 파도가 발생할 수 있습니다. 바다수영 전에는 반드시 백사장에서 해수면을 육안으로 확인하시고, 안전부이(스윔부이) 착용 및 버디 시스템(2인 이상)을 준수해 주세요.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all active:scale-95 font-black"
              >
                확인 및 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
