import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend
} from 'recharts';
import { DailyMarineForecast } from '../types/swim';
import {
  Thermometer,
  Waves,
  Snowflake,
  ShieldAlert,
  Clock,
  Calendar,
  AlertTriangle,
  Info
} from 'lucide-react';

interface MarineTrendChartProps {
  forecastList: DailyMarineForecast[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  coldWaterThreshold?: number;
}

type ChartViewType = 'weekly' | 'hourly';

export const MarineTrendChart: React.FC<MarineTrendChartProps> = ({
  forecastList,
  selectedIndex,
  onSelectIndex,
  coldWaterThreshold = 18.0,
}) => {
  const [viewType, setViewType] = useState<ChartViewType>('weekly');

  const selectedDay = forecastList[selectedIndex] || forecastList[0];

  // Prepare weekly chart data
  const weeklyData = forecastList.map((day, idx) => ({
    index: idx,
    label: `${day.dayOfWeek} (${day.date.slice(5)})`,
    fullDate: day.formattedDate,
    dayOfWeek: day.dayOfWeek,
    isToday: day.isToday,
    isTomorrow: day.isTomorrow,
    waterTempAvg: day.waterTempAvg,
    waterTempMin: day.waterTempMin,
    waterTempMax: day.waterTempMax,
    waveHeightMax: day.waveHeightMax,
    waveHeightMin: day.waveHeightMin,
    windSpeedMax: day.windSpeedMax,
    safetyScore: day.safetyScore,
    safetyLevel: day.safetyLevel,
    isColdWater: day.waterTempMin < coldWaterThreshold || day.waterTempAvg < coldWaterThreshold,
  }));

  // Prepare hourly chart data for selected day
  const hourlyData = (selectedDay.hourly || []).map((h) => ({
    label: h.hour,
    hourLabel: `${h.label} (${h.hour})`,
    waterTemp: h.waterTemp,
    airTemp: h.airTemp,
    waveHeight: h.waveHeight,
    windSpeed: h.windSpeed,
    safetyScore: h.safetyScore,
    safetyLevel: h.safetyLevel,
    isColdWater: h.waterTemp < coldWaterThreshold,
  }));

  // Custom Tooltip for Weekly View
  const renderWeeklyTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const isCold = data.waterTempAvg < coldWaterThreshold;

    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs max-w-[260px] pointer-events-none">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 font-bold text-white text-sm">
            <span>{data.fullDate}</span>
            {data.isToday && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                오늘
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-slate-300">
            안전 {data.safetyScore}점
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              표층 수온
            </span>
            <span className="font-mono tabular-nums font-bold text-white">
              {data.waterTempAvg.toFixed(1)}℃{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                ({data.waterTempMin.toFixed(1)}~{data.waterTempMax.toFixed(1)}℃)
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1 text-teal-300 font-medium">
              <Waves className="w-3.5 h-3.5 text-teal-400" />
              유의 파고
            </span>
            <span className="font-mono tabular-nums font-bold text-white">
              {data.waveHeightMax.toFixed(1)}m{' '}
              <span className="text-[10px] text-slate-400 font-normal">
                (최저 {data.waveHeightMin.toFixed(1)}m)
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
            <span>최대 풍속</span>
            <span className="font-mono tabular-nums">{data.windSpeedMax.toFixed(1)} m/s</span>
          </div>

          {isCold && (
            <div className="mt-1 flex items-center gap-1 px-2 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
              <Snowflake className="w-3 h-3 text-rose-400 shrink-0" />
              <span>냉수 주의보 ({coldWaterThreshold}℃ 미만)</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Custom Tooltip for Hourly View
  const renderHourlyTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;
    const isCold = data.waterTemp < coldWaterThreshold;

    return (
      <div className="bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl text-xs max-w-[240px] pointer-events-none">
        <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
          <span className="font-bold text-white text-sm">{data.hourLabel}</span>
          <span className="text-[11px] font-semibold text-slate-300">
            안전 {data.safetyScore}점 ({data.safetyLevel})
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1 text-cyan-300 font-medium">
              <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
              시간대 수온
            </span>
            <span className="font-mono tabular-nums font-bold text-white">
              {data.waterTemp.toFixed(1)}℃
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1 text-teal-300 font-medium">
              <Waves className="w-3.5 h-3.5 text-teal-400" />
              시간대 파고
            </span>
            <span className="font-mono tabular-nums font-bold text-white">
              {data.waveHeight.toFixed(1)}m
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-slate-800/80">
            <span>기온 / 풍속</span>
            <span className="font-mono tabular-nums">
              {data.airTemp}℃ · {data.windSpeed}m/s
            </span>
          </div>

          {isCold && (
            <div className="mt-1 flex items-center gap-1 px-2 py-1 rounded bg-rose-500/20 border border-rose-500/30 text-rose-300 text-[10px] font-bold">
              <Snowflake className="w-3 h-3 text-rose-400 shrink-0" />
              <span>냉수 주의 ({coldWaterThreshold}℃ 미만)</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 tracking-wide">
              <Waves className="w-3.5 h-3.5 text-cyan-400" />
              수온 & 파고 듀얼 시각화 차트
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Recharts</span>
          </div>
          <h4 className="text-base sm:text-lg font-black text-white mt-0.5">
            {viewType === 'weekly'
              ? '광안리 주간 7일간 표층 수온(℃) 및 파고(m) 변화 추이'
              : `${selectedDay.formattedDate} 시간대별 정밀 해황 곡선`}
          </h4>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setViewType('weekly')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewType === 'weekly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>7일 주간 추이</span>
          </button>
          <button
            onClick={() => setViewType('hourly')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              viewType === 'hourly'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>선택일 시간대 상세</span>
          </button>
        </div>
      </div>

      {/* Legend & Threshold Guide Strip */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2.5 text-xs border-b border-slate-800/60 relative z-10">
        {/* Metric indicators */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
              표층 수온(℃) <span className="text-cyan-400/80 font-mono">[좌측 축]</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)]" />
            <span className="text-slate-300 font-medium text-[11px] sm:text-xs">
              유의 파고(m) <span className="text-teal-400/80 font-mono">[우측 축]</span>
            </span>
          </div>
        </div>

        {/* Safety reference guidelines */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-rose-300">
            <span className="w-2.5 h-0.5 bg-rose-400 border-b border-dashed border-rose-300" />
            <span>냉수 주의 기준 ({coldWaterThreshold}℃)</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/25 text-teal-300">
            <span className="w-2.5 h-0.5 bg-teal-400 border-b border-dashed border-teal-300" />
            <span>적합 파고 기준 (0.5m)</span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-64 sm:h-72 mt-3 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          {viewType === 'weekly' ? (
            <ComposedChart
              data={weeklyData}
              onClick={(e: any) => {
                if (e && typeof e.activeTooltipIndex === 'number') {
                  onSelectIndex(e.activeTooltipIndex);
                } else if (e && e.activeTooltipIndex !== undefined && e.activeTooltipIndex !== null) {
                  const num = Number(e.activeTooltipIndex);
                  if (!Number.isNaN(num)) onSelectIndex(num);
                }
              }}
              margin={{ top: 18, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                {/* Water Temp Gradient */}
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
                {/* Wave Height Gradient */}
                <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />

              {/* Left Y Axis: Water Temperature (℃) */}
              <YAxis
                yAxisId="temp"
                domain={[14, 26]}
                stroke="#06b6d4"
                tick={{ fill: '#22d3ee', fontSize: 10, fontWeight: 600 }}
                axisLine={{ stroke: '#0891b2' }}
                tickLine={{ stroke: '#0891b2' }}
                unit="℃"
                width={36}
              />

              {/* Right Y Axis: Wave Height (m) */}
              <YAxis
                yAxisId="wave"
                orientation="right"
                domain={[0, 2.0]}
                stroke="#10b981"
                tick={{ fill: '#34d399', fontSize: 10, fontWeight: 600 }}
                axisLine={{ stroke: '#059669' }}
                tickLine={{ stroke: '#059669' }}
                unit="m"
                width={30}
              />

              <Tooltip content={renderWeeklyTooltip} />

              {/* Cold Water Alert Threshold Reference Line */}
              <ReferenceLine
                yAxisId="temp"
                y={coldWaterThreshold}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `냉수주의 ${coldWaterThreshold}℃`,
                  position: 'insideTopLeft',
                  fill: '#f43f5e',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              {/* Safe Wave Height Reference Line */}
              <ReferenceLine
                yAxisId="wave"
                y={0.5}
                stroke="#14b8a6"
                strokeDasharray="3 3"
                strokeWidth={1.2}
                label={{
                  value: '적합파고 0.5m',
                  position: 'insideBottomRight',
                  fill: '#2dd4bf',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              {/* Water Temperature Area & Line */}
              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="waterTempAvg"
                name="표층 수온(℃)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
                activeDot={{
                  r: 6,
                  stroke: '#22d3ee',
                  strokeWidth: 2,
                  fill: '#083344',
                }}
              />

              {/* Wave Height Line */}
              <Line
                yAxisId="wave"
                type="monotone"
                dataKey="waveHeightMax"
                name="최대 파고(m)"
                stroke="#10b981"
                strokeWidth={2}
                strokeDasharray="2 1"
                dot={{ r: 3.5, fill: '#10b981', stroke: '#064e3b', strokeWidth: 1.5 }}
                activeDot={{
                  r: 6,
                  stroke: '#34d399',
                  strokeWidth: 2,
                  fill: '#022c22',
                }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart
              data={hourlyData}
              margin={{ top: 18, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
                vertical={false}
              />

              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#334155' }}
                tickLine={{ stroke: '#334155' }}
              />

              <YAxis
                yAxisId="temp"
                domain={[14, 25]}
                stroke="#06b6d4"
                tick={{ fill: '#22d3ee', fontSize: 10, fontWeight: 600 }}
                axisLine={{ stroke: '#0891b2' }}
                unit="℃"
                width={36}
              />

              <YAxis
                yAxisId="wave"
                orientation="right"
                domain={[0, 1.5]}
                stroke="#10b981"
                tick={{ fill: '#34d399', fontSize: 10, fontWeight: 600 }}
                axisLine={{ stroke: '#059669' }}
                unit="m"
                width={30}
              />

              <Tooltip content={renderHourlyTooltip} />

              <ReferenceLine
                yAxisId="temp"
                y={coldWaterThreshold}
                stroke="#f43f5e"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                label={{
                  value: `냉수주의 ${coldWaterThreshold}℃`,
                  position: 'insideTopLeft',
                  fill: '#f43f5e',
                  fontSize: 10,
                  fontWeight: 700,
                }}
              />

              <ReferenceLine
                yAxisId="wave"
                y={0.5}
                stroke="#14b8a6"
                strokeDasharray="3 3"
                strokeWidth={1.2}
                label={{
                  value: '0.5m',
                  position: 'insideBottomRight',
                  fill: '#2dd4bf',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              <Area
                yAxisId="temp"
                type="monotone"
                dataKey="waterTemp"
                name="수온(℃)"
                stroke="#06b6d4"
                strokeWidth={2.5}
                fill="url(#hourlyTempGrad)"
                activeDot={{ r: 5, fill: '#083344', stroke: '#22d3ee', strokeWidth: 2 }}
              />

              <Line
                yAxisId="wave"
                type="monotone"
                dataKey="waveHeight"
                name="파고(m)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3.5, fill: '#10b981' }}
                activeDot={{ r: 5, fill: '#022c22', stroke: '#34d399', strokeWidth: 2 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Interactive Helper Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {viewType === 'weekly'
              ? '차트의 특정 일자 포인트를 클릭하면 해당 일자의 상세 예보 카드가 바로 열립니다.'
              : `현재 ${selectedDay.formattedDate}의 새벽(06시 집결)부터 일몰(18시)까지 시간대별 변화입니다.`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">선택일:</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-bold border border-slate-700">
            {selectedDay.formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};
