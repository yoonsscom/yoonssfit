import React, { useState, useEffect, useRef } from 'react';
import { TRIATHLON_STANDARDS, TRIATHLON_DRILLS } from '../data/gwangalliData';
import { TriathlonTarget } from '../types/swim';
import {
  Trophy,
  Timer,
  Activity,
  Flame,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronRight,
  ShieldCheck,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';

export const TriathlonTraining: React.FC = () => {
  // Pacing Calculator State
  const [selectedStandard, setSelectedStandard] = useState<TriathlonTarget>(TRIATHLON_STANDARDS[0]);
  const [paceMinutes, setPaceMinutes] = useState<number>(1);
  const [paceSeconds, setPaceSeconds] = useState<number>(50); // 1:50 / 100m

  // Metronome State (Web Audio API)
  const [cadenceSpm, setCadenceSpm] = useState<number>(64); // Strokes per minute (60-75 is standard OW cadence)
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(false);
  const [metronomeSide, setMetronomeSide] = useState<'left' | 'right'>('left');
  const [strokeCount, setStrokeCount] = useState<number>(0);
  const strokeCountRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play audio beep for metronome
  const playBeep = (freq = 880, duration = 0.05) => {
    if (isSoundMuted) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not allowed or supported', e);
    }
  };

  // Metronome Interval Timer
  useEffect(() => {
    let timerId: any = null;
    if (isMetronomePlaying) {
      const intervalMs = (60 / cadenceSpm) * 1000;
      timerId = setInterval(() => {
        strokeCountRef.current += 1;
        const currentCount = strokeCountRef.current;
        const isSighting = currentCount % selectedStandard.sightingIntervalStrokes === 0;
        playBeep(isSighting ? 1200 : 800, 0.06);
        setStrokeCount(currentCount);
        setMetronomeSide((prev) => (prev === 'left' ? 'right' : 'left'));
      }, intervalMs);
    } else {
      strokeCountRef.current = 0;
      setStrokeCount(0);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isMetronomePlaying, cadenceSpm, selectedStandard.sightingIntervalStrokes, isSoundMuted]);

  // Derived Calculations
  const totalSecondsPer100m = paceMinutes * 60 + paceSeconds;
  const totalEstimatedSeconds = (selectedStandard.distanceMeters / 100) * totalSecondsPer100m;
  const calculatedMinutes = Math.floor(totalEstimatedSeconds / 60);
  const calculatedSecondsRemainder = Math.floor(totalEstimatedSeconds % 60);

  const cutoffMarginMinutes = selectedStandard.cutOffMinutes - totalEstimatedSeconds / 60;
  const estimatedStrokes = Math.round((selectedStandard.distanceMeters / 100) * 36); // avg 36 strokes per 100m in open water with suit
  const estimatedCalories = Math.round((totalEstimatedSeconds / 60) * 13.5); // ~13.5 kcal/min in open water swimming

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-900/40 rounded-2xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Trophy className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                철인3종 (트라이애슬론) 경기력 향상 랩
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1.5">
              오픈워터 수영 페이스 계산기 & 스트로크 메트로놈
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              올림픽 코스 1.5km부터 킹코스 3.8km까지, 컷오프 통과 및 최적 에너지 배분을 위한 실전 훈련 허브
            </p>
          </div>

          <div className="grid grid-cols-3 sm:flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-xl border border-slate-700 w-full sm:w-auto">
            {TRIATHLON_STANDARDS.map((std) => (
              <button
                key={std.category}
                onClick={() => setSelectedStandard(std)}
                className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-bold text-center transition-all ${
                  selectedStandard.category === std.category
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-black'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {std.category.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Left - Pacing Calculator, Right - Metronome Cadence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pacing Simulator */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                목표 페이스 시뮬레이터 ({selectedStandard.category})
              </h3>
              <span className="text-xs text-slate-400">거리: {selectedStandard.distanceMeters}m</span>
            </div>

            {/* Target Pace Input Controls */}
            <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                100m당 목표 페이스 설정 (현재: {paceMinutes}분 {paceSeconds.toString().padStart(2, '0')}초 / 100m)
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>1:20 (엘리트)</span>
                    <span>1:50 (중급)</span>
                    <span>2:30 (완주형)</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="160"
                    step="1"
                    value={totalSecondsPer100m}
                    onChange={(e) => {
                      const totalSec = parseInt(e.target.value);
                      setPaceMinutes(Math.floor(totalSec / 60));
                      setPaceSeconds(totalSec % 60);
                    }}
                    className="w-full accent-cyan-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950 border border-cyan-800/60 text-cyan-300 font-mono font-bold text-lg min-w-[85px] text-center">
                  {paceMinutes}:{paceSeconds.toString().padStart(2, '0')}
                </div>
              </div>
            </div>

            {/* Calculated Results */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  예상 수영 기록
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">{calculatedMinutes}</span>
                  <span className="text-xs text-slate-400">분</span>
                  <span className="text-xl font-black text-cyan-300">{calculatedSecondsRemainder.toString().padStart(2, '0')}</span>
                  <span className="text-xs text-slate-400">초</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  대회 컷오프: {selectedStandard.cutOffMinutes}분
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  컷오프 안전 마진
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span
                    className={`text-2xl font-black ${
                      cutoffMarginMinutes > 5 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {cutoffMarginMinutes > 0 ? `+${cutoffMarginMinutes.toFixed(1)}` : cutoffMarginMinutes.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">분</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {cutoffMarginMinutes > 10 ? '안정적인 통과 예상' : '페이스 상향 필요'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  예상 총 스트로크 수
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">~{estimatedStrokes}</span>
                  <span className="text-xs text-slate-400">회</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  100m당 약 36 스트로크 기준
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  예상 소모 열량
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-black text-amber-300">~{estimatedCalories}</span>
                  <span className="text-xs text-slate-400">kcal</span>
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  T1 이후 사이클용 보급 계획 필수
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>광안리 실전 팁:</strong> 초반 200m는 흥분으로 오버페이스하기 쉽습니다. 시작 시 목표 페이스보다 5초 늦추고 첫 번째 부표를 통과한 뒤 정속 페이스로 전환하세요.
            </span>
          </div>
        </div>

        {/* Metronome & Stroke Cadence Hub */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-400" />
                  오픈워터 스트로크 메트로놈 (Cadence)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">지상 훈련 및 뇌내 페이싱 감각 동기화</p>
              </div>
              <button
                onClick={() => setIsSoundMuted(!isSoundMuted)}
                className={`p-2 rounded-lg border transition-colors ${
                  isSoundMuted
                    ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                    : 'bg-slate-800 text-slate-200 border-slate-700'
                }`}
                title={isSoundMuted ? '음소거 해제' : '음소거'}
              >
                {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* SPM Slider & Controls */}
            <div className="mt-5 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  스트로크 케이던스 (분당 스트로크 회수 - SPM)
                </span>
                <span className="text-xs font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                  {cadenceSpm} SPM
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="85"
                step="1"
                value={cadenceSpm}
                onChange={(e) => setCadenceSpm(parseInt(e.target.value))}
                className="w-full accent-teal-400 h-2 bg-slate-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>50 (글라이딩 위주)</span>
                <span>64 (오픈워터 표준)</span>
                <span>75+ (스프린트/너울 극복)</span>
              </div>
            </div>

            {/* Visual Cadence Beating Display */}
            <div className="mt-5 p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center relative overflow-hidden">
              <div className="flex items-center justify-center gap-8">
                {/* Left Arm Indicator */}
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-all duration-150 ${
                    isMetronomePlaying && metronomeSide === 'left'
                      ? 'bg-cyan-500 text-slate-950 scale-110 shadow-lg shadow-cyan-500/50'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <span>L</span>
                  <span className="text-[10px]">왼팔 캐치</span>
                </div>

                {/* Center Pulse & Stroke Counter */}
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-black text-white font-mono">{strokeCount}</div>
                  <span className="text-[11px] text-slate-400 mt-0.5">누적 스트로크</span>
                  {isMetronomePlaying && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 transition-all ${
                        strokeCount % selectedStandard.sightingIntervalStrokes === 0
                          ? 'bg-amber-500 text-slate-950 animate-bounce'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {strokeCount % selectedStandard.sightingIntervalStrokes === 0
                        ? '👀 헤드업 (Sighting!)'
                        : `${selectedStandard.sightingIntervalStrokes - (strokeCount % selectedStandard.sightingIntervalStrokes)}스트로크 후 전방주시`}
                    </span>
                  )}
                </div>

                {/* Right Arm Indicator */}
                <div
                  className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-all duration-150 ${
                    isMetronomePlaying && metronomeSide === 'right'
                      ? 'bg-teal-500 text-slate-950 scale-110 shadow-lg shadow-teal-500/50'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <span>R</span>
                  <span className="text-[10px]">오른팔 캐치</span>
                </div>
              </div>

              {/* Start/Stop Button */}
              <div className="mt-5 flex justify-center">
                <button
                  onClick={() => setIsMetronomePlaying(!isMetronomePlaying)}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-2.5 rounded-xl font-black text-sm active:scale-95 transition-all ${
                    isMetronomePlaying
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/40'
                      : 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-lg shadow-teal-500/30'
                  }`}
                >
                  {isMetronomePlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      메트로놈 정지
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      메트로놈 비프음 시작 ({cadenceSpm} SPM)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            * 바다수영은 실내수영장보다 스트로크 케이던스를 4~6회 높게 유지해야 너울에 추진력이 끊기지 않습니다.
          </div>
        </div>
      </div>

      {/* Essential Triathlon Drills Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          철인3종 오픈워터 필수 전술 드릴 (Tactical Drills)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRIATHLON_DRILLS.map((drill) => (
            <div key={drill.id} className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  {drill.focus}
                </span>
                <h4 className="text-base font-bold text-white mt-2">{drill.title}</h4>
                <ul className="mt-3 space-y-2 text-xs text-slate-300">
                  {drill.steps.map((st, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
