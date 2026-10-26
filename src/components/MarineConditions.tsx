import React, { useState } from 'react';
import { MarineCondition, ColdWaterAlertSettings } from '../types/swim';
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
  Snowflake
} from 'lucide-react';

interface MarineConditionsProps {
  condition: MarineCondition;
  onRefresh?: () => void;
  coldWaterSettings: ColdWaterAlertSettings;
  onOpenColdWaterModal: () => void;
  onConditionChange?: (condition: MarineCondition) => void;
}

type SeasonPresetKey = 'current' | 'early_summer' | 'hot_summer' | 'cool_autumn' | 'winter';

export const MarineConditions: React.FC<MarineConditionsProps> = ({
  condition: initialCondition,
  onRefresh,
  coldWaterSettings,
  onOpenColdWaterModal,
  onConditionChange,
}) => {
  const [condition, setCondition] = useState<MarineCondition>(initialCondition);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedSeasonPreset, setSelectedSeasonPreset] = useState<SeasonPresetKey>('current');

  const presets: Record<SeasonPresetKey, { label: string; desc: string; data: Partial<MarineCondition> }> = {
    current: {
      label: '현재 실시간 관측 (봄/가을)',
      desc: '현재 광안리 연안 부이 실시간 해황 (수온 19.8℃, 6물 사리)',
      data: {
        waterTemp: 19.8,
        airTemp: 22.4,
        waveHeight: 0.4,
        wavePeriod: 5.6,
        windSpeed: 3.2,
        windDirection: '남동 (SE) 135°',
        tidePhase: '밀물 (Flood Tide)',
        tideName: '6물 (사리 전후 조류 활발)',
        nextTideTime: '14:20 만조 (+148cm)',
        visibility: 3.2,
        safetyScore: 92,
        safetyLevel: '최적 (Optimal)',
        jellyfishStatus: '안전 (Safe)',
        suitRecommendation: '3mm 오픈워터 웻슈트 추천 (체온 유지 및 부력 극대화, 철인 공식 착용 가능 수온)',
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

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setCondition((prev: MarineCondition) => ({
        ...prev,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      }));
      if (onRefresh) onRefresh();
    }, 600);
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
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-200 border border-cyan-400/40">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1.5 inline-block"></span>
                실시간 광안리 연안 부이
              </span>
              <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {condition.timestamp}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-2 flex flex-wrap items-center gap-2">
              부산 광안리해수욕장 해황 레이더
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                광안대교 앞바다
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
              광안리 바다수영과 철인3종 오픈워터 트레이닝을 위한 수온, 조석(물때), 파고, 유속 및 슈트 착용 기준
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 transition-colors active:scale-95 disabled:opacity-50 shadow-sm"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              새로고침
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
    </div>
  );
};
