import React, { useState } from 'react';
import { DailyMarineForecast, MarineDataSource } from '../types/swim';
import { getWeeklyMarineForecast, MARINE_DATA_SOURCES } from '../data/marineForecastData';
import { MarineTrendChart } from './MarineTrendChart';
import {
  Calendar,
  Waves,
  Thermometer,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Compass,
  Sunrise,
  Sunset,
  ExternalLink,
  Info,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  HelpCircle,
  X,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface MarineForecast7DaysProps {
  coldWaterThreshold?: number;
  onSelectDateForSimulation?: (forecast: DailyMarineForecast) => void;
}

export const MarineForecast7Days: React.FC<MarineForecast7DaysProps> = ({
  coldWaterThreshold = 18.0,
}) => {
  const [forecastList] = useState<DailyMarineForecast[]>(() => getWeeklyMarineForecast());
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState<boolean>(false);

  const selectedDay = forecastList[selectedDayIndex] || forecastList[0];

  const getSafetyBadgeStyle = (level: string) => {
    switch (level) {
      case '최적':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case '양호':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case '주의':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getTideBadgeColor = (cycle: string) => {
    switch (cycle) {
      case '사리':
        return 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40';
      case '조금':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case '중조':
        return 'bg-teal-500/20 text-teal-200 border-teal-400/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="space-y-5">
      {/* Forecast Header & Source Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              7-Day Marine Forecast
            </span>
            <span className="text-xs text-slate-400 font-medium">
              국립해양조사원·기상청 공공데이터 연계
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1.5 flex items-center gap-2">
            광안리 주간 7일 해황 종합 예보
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            표층 수온, 조석 물때(만·간조), 파고·풍향 및 바다수영 안전지수 주간 전망
          </p>
        </div>

        {/* Source info button */}
        <button
          onClick={() => setIsSourceModalOpen(true)}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 shadow-sm group shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
          <span>데이터 출처 안내</span>
        </button>
      </div>

      {/* 7-Day Horizontal Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            예보 날짜 선택 (오늘부터 7일간):
          </span>
          <span className="text-[11px] text-slate-400">
            가로로 스크롤하여 일별 예보 확인 가능
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {forecastList.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(idx)}
                className={`relative flex flex-col p-3 rounded-2xl border text-left transition-all group ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-900/60 to-slate-900 border-cyan-400 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                    : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header: Date & Tag */}
                <div className="flex items-center justify-between w-full">
                  <span className={`text-xs font-black ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                    {day.dayOfWeek}요일
                  </span>
                  {day.isToday ? (
                    <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-cyan-500 text-slate-950">
                      오늘
                    </span>
                  ) : day.isTomorrow ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                      내일
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {day.formattedDate.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Tide tag */}
                <div className="mt-2 flex items-center gap-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getTideBadgeColor(day.tideCycle)}`}>
                    {day.tideName.split(' ')[0]}
                  </span>
                </div>

                {/* Temp & Wave */}
                <div className="mt-2 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-[11px] text-slate-400">수온</span>
                    <span className="font-bold text-white">{day.waterTempAvg}℃</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-200">
                    <span className="text-[11px] text-slate-400">파고</span>
                    <span className="font-bold text-cyan-300">{day.waveHeightMin}~{day.waveHeightMax}m</span>
                  </div>
                </div>

                {/* Safety Badge */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getSafetyBadgeStyle(day.safetyLevel)}`}>
                    {day.safetyLevel}
                  </span>
                  <span className="text-[10px] font-black text-slate-300">{day.safetyScore}점</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recharts Marine Trend Chart: 수온 & 파고 듀얼 Y축 시각화 */}
      <MarineTrendChart
        forecastList={forecastList}
        selectedIndex={selectedDayIndex}
        onSelectIndex={setSelectedDayIndex}
        coldWaterThreshold={coldWaterThreshold}
      />

      {/* Selected Day Detailed Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 md:p-7 shadow-xl space-y-6">
        {/* Detail Header & GSR Highlight */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-base sm:text-lg font-black text-white">
                {selectedDay.date} ({selectedDay.dayOfWeek}) 해황 상세 분석
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getTideBadgeColor(selectedDay.tideCycle)}`}>
                {selectedDay.tideName}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getSafetyBadgeStyle(selectedDay.safetyLevel)}`}>
                안전 지수: {selectedDay.safetyLevel} ({selectedDay.safetyScore}점/100)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
              💡 {selectedDay.summary}
            </p>
          </div>

          {/* Sunrise / Sunset & Dawn Training Time */}
          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-2xl shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-amber-300">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <span>일출 <strong>{selectedDay.sunrise}</strong></span>
            </div>
            <div className="h-3 w-px bg-slate-700"></div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-300">
              <Sunset className="w-4 h-4 text-indigo-400" />
              <span>일몰 <strong>{selectedDay.sunset}</strong></span>
            </div>
          </div>
        </div>

        {/* 4 Pillars of Forecast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pillar 1: Water Temp (표층 수온) */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-cyan-400" />
                표층 수온 예보
              </span>
              <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                수과원 NIFS
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{selectedDay.waterTempAvg}</span>
              <span className="text-lg font-bold text-cyan-400">°C</span>
              <span className="text-xs text-slate-400 ml-auto font-medium">
                ({selectedDay.waterTempMin} ~ {selectedDay.waterTempMax}℃)
              </span>
            </div>

            <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">냉수 주의보({coldWaterThreshold}℃):</span>
                <span className={selectedDay.waterTempMin <= coldWaterThreshold ? 'font-bold text-rose-400' : 'text-emerald-400 font-bold'}>
                  {selectedDay.waterTempMin <= coldWaterThreshold ? '주의보 해당' : '안정권'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug pt-1">
                새벽 06:00 최저 {selectedDay.waterTempMin}℃, 오후 15:00 최고 {selectedDay.waterTempMax}℃
              </div>
            </div>
          </div>

          {/* Pillar 2: Tides & Tide Phase (조석 물때) */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-blue-400" />
                조석 물때 (간·만조)
              </span>
              <span className="text-[10px] text-blue-300 font-bold bg-blue-950 px-2 py-0.5 rounded border border-blue-800/60">
                해양조사원 KHOA
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white">{selectedDay.tideName}</span>
            </div>

            {/* Tide events list */}
            <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800">
              {selectedDay.tides.map((t, tidx) => (
                <div
                  key={tidx}
                  className={`p-1.5 rounded-lg text-[11px] flex flex-col justify-between ${
                    t.type.includes('만조')
                      ? 'bg-blue-950/40 text-blue-200 border border-blue-900/40'
                      : 'bg-slate-850 text-slate-300 border border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span>{t.time}</span>
                    <span className={t.type.includes('만조') ? 'text-blue-300' : 'text-slate-400'}>
                      {t.type.includes('만조') ? '고조' : '저조'}
                    </span>
                  </div>
                  <div className="text-[10px] text-right text-slate-400 font-mono mt-0.5">
                    {t.levelCm} cm
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pillar 3: Wave & Wind (파고 풍향) */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-teal-400" />
                유의파고 & 풍향
              </span>
              <span className="text-[10px] text-teal-300 font-bold bg-teal-950 px-2 py-0.5 rounded border border-teal-800/60">
                기상청 CWW3
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">
                {selectedDay.waveHeightMin} ~ {selectedDay.waveHeightMax}
              </span>
              <span className="text-base font-bold text-teal-400">m</span>
              <span className="text-xs text-slate-400 ml-auto">
                {selectedDay.waveHeightMax <= 0.6 ? '잔잔함' : selectedDay.waveHeightMax <= 1.0 ? '보통 너울' : '주의 너울'}
              </span>
            </div>

            <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">예상 풍속:</span>
                <span className="font-bold text-white">{selectedDay.windSpeedMin} ~ {selectedDay.windSpeedMax} m/s</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-400">풍향:</span>
                <span className="font-bold text-teal-300">{selectedDay.windDirection}</span>
              </div>
            </div>
          </div>

          {/* Pillar 4: Safety & Gear (안전지수 & 장비) */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                안전지수 & 권장 장비
              </span>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/60">
                KTF / ITU 규정
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-300">
                {selectedDay.safetyScore}점
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getSafetyBadgeStyle(selectedDay.safetyLevel)}`}>
                {selectedDay.safetyLevel}
              </span>
            </div>

            <div className="space-y-1 text-xs pt-1 border-t border-slate-800">
              <div className="text-[11px] font-bold text-white">
                추천 슈트:
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {selectedDay.suitRecommendation}
              </p>
            </div>
          </div>
        </div>

        {/* GSR Dawn Crew Training Recommendation Banner */}
        <div className="bg-gradient-to-r from-blue-950/70 via-cyan-950/40 to-slate-900 border border-cyan-800/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 text-cyan-300 text-lg">
              🏊‍♂️
            </div>
            <div>
              <div className="text-xs font-black text-cyan-300 uppercase tracking-wider">
                GSR 새벽 훈련팀 가이드 ({selectedDay.formattedDate})
              </div>
              <p className="text-sm font-bold text-white mt-0.5">
                {selectedDay.gsrTrainingRecommendation}
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-slate-400 shrink-0 self-end sm:self-center">
            하계 06:00 / 동계 06:30 출수 전 집결
          </div>
        </div>

        {/* Hourly Breakdown Table for Selected Day */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-black text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              {selectedDay.formattedDate} 시간대별 상세 해황 (새벽~일몰)
            </h4>
            <span className="text-xs text-slate-400">
              광안리 해수욕장 기준
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar border border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3 font-bold">시간대 (세션)</th>
                  <th className="py-2.5 px-3 font-bold">표층 수온</th>
                  <th className="py-2.5 px-3 font-bold">기온</th>
                  <th className="py-2.5 px-3 font-bold">파고 (m)</th>
                  <th className="py-2.5 px-3 font-bold">바람 (풍향·풍속)</th>
                  <th className="py-2.5 px-3 font-bold">예상 조위</th>
                  <th className="py-2.5 px-3 font-bold text-center">안전도</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/50">
                {selectedDay.hourly.map((hourItem, hIdx) => (
                  <tr
                    key={hIdx}
                    className={`hover:bg-slate-800/60 transition-colors ${
                      hourItem.hour === '06:00' ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3">
                      <div className="font-black text-white flex items-center gap-1.5">
                        {hourItem.hour}
                        {hourItem.hour === '06:00' && (
                          <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-1.5 py-0.2 rounded font-bold">
                            GSR 새벽
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">{hourItem.label}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-cyan-300">
                      {hourItem.waterTemp} ℃
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      {hourItem.airTemp} ℃
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {hourItem.waveHeight} m
                    </td>
                    <td className="py-3 px-3 text-slate-200">
                      {hourItem.windDirection} {hourItem.windSpeed}m/s
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {hourItem.tideLevel} cm
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${getSafetyBadgeStyle(hourItem.safetyLevel)}`}>
                        {hourItem.safetyLevel} ({hourItem.safetyScore})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Official Data Source Explanation Modal */}
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
                    대한민국 공공 해양 관측 기관 및 기상 수치예보 모델 신뢰도 안내
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
                📢 <strong>데이터 신뢰성 보증:</strong> 본 서비스의 해황 예보는 민간 임의 추정이 아닌, <strong>국립해양조사원(KHOA)</strong>, <strong>기상청(KMA)</strong>, <strong>국립수산과학원(NIFS)</strong>의 공공 관측망 및 정밀 수치모델 데이터를 토대로 광안리 해역 특성에 맞게 가공하여 제공됩니다.
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
                  오픈워터 수영 안전 유의사항
                </div>
                <p>
                  해황 예보는 수치모델 및 천문 통계에 기반하므로, 국지적인 너울성 파도나 해저 지형에 따른 조류 급변이 발생할 수 있습니다. 바다수영 전에는 항상 백사장에서 직접 해수면을 육안 확인하고, 안전부이 지참 및 버디와 동반 입수하시기 바랍니다.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all active:scale-95"
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
