import React, { useState, useEffect } from 'react';
import { SwimCourse } from '../types/swim';
import { GWANGALLI_COURSES } from '../data/gwangalliData';
import { exportCourseGpxToDrive, generateCourseGpx } from '../services/googleDrive';
import { GwangalliGoogleMap } from './GwangalliGoogleMap';
import {
  MapPin,
  Navigation,
  CloudUpload,
  Download,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Compass,
  Waves,
  Eye,
  Info,
  Layers,
  Map as MapIcon
} from 'lucide-react';

interface GwangalliCourseMapProps {
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
  isGoogleAuthenticated?: boolean;
  onRequestLogin?: () => void;
}

export const GwangalliCourseMap: React.FC<GwangalliCourseMapProps> = ({
  onNotify,
  isGoogleAuthenticated = false,
  onRequestLogin,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<SwimCourse>(GWANGALLI_COURSES[1]); // Default Olympic 1.5k
  const [isSimulating, setIsSimulating] = useState(false);
  const [simProgress, setSimProgress] = useState(0); // 0 to 1
  const [isExportingDrive, setIsExportingDrive] = useState(false);
  const [mapViewMode, setMapViewMode] = useState<'google' | 'illustration'>('google');

  // Animation loop for swimmer along the course coordinates
  useEffect(() => {
    let animFrame: number;
    if (isSimulating) {
      const step = () => {
        setSimProgress((prev) => {
          if (prev >= 1) return 0;
          return prev + 0.003;
        });
        animFrame = requestAnimationFrame(step);
      };
      animFrame = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isSimulating]);

  // Calculate coordinates of swimmer based on progress
  const getSwimmerPosition = () => {
    const coords = selectedCourse.coordinates;
    if (!coords || coords.length < 2) return { x: 500, y: 450 };

    const totalSegments = coords.length - 1;
    const scaledProgress = simProgress * totalSegments;
    const currentIndex = Math.min(Math.floor(scaledProgress), totalSegments - 1);
    const nextIndex = currentIndex + 1;
    const segmentProgress = scaledProgress - currentIndex;

    const p1 = coords[currentIndex];
    const p2 = coords[nextIndex];

    const x = p1[0] + (p2[0] - p1[0]) * segmentProgress;
    const y = p1[1] + (p2[1] - p1[1]) * segmentProgress;

    return { x, y };
  };

  const swimmerPos = getSwimmerPosition();

  // Export GPX to Google Drive
  const handleExportToGoogleDrive = async () => {
    if (!isGoogleAuthenticated) {
      if (onRequestLogin) onRequestLogin();
      return;
    }

    try {
      setIsExportingDrive(true);
      const res = await exportCourseGpxToDrive(selectedCourse);
      if (onNotify) {
        onNotify(`Google Drive에 '${res.name}' 코스 GPX 파일이 성공적으로 저장되었습니다!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      if (onNotify) {
        onNotify(`Google Drive 저장 실패: ${err.message}`, 'error');
      }
    } finally {
      setIsExportingDrive(false);
    }
  };

  // Download GPX locally for Garmin/Apple Watch
  const handleDownloadGpx = () => {
    try {
      const gpxData = generateCourseGpx(selectedCourse);
      const blob = new Blob([gpxData], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `광안리_${selectedCourse.nameKo.replace(/\s+/g, '_')}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      if (onNotify) {
        onNotify(`'${selectedCourse.nameKo}' GPX 파일이 다운로드되었습니다. (가민/순토/애플워치 호환)`, 'success');
      }
    } catch (err: any) {
      if (onNotify) onNotify(`다운로드 실패: ${err.message}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Selection Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-cyan-400" />
              광안리 바다수영 & 철인3종 추천 코스
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              실시간 조류 방향과 광안대교 교각 위치를 반영한 공식 수영 훈련 코스맵
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  시뮬레이션 일시정지
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  코스 가상 영법 시뮬레이션
                </>
              )}
            </button>
            <button
              onClick={() => {
                setSimProgress(0);
                setIsSimulating(false);
              }}
              title="시뮬레이션 리셋"
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Course Cards Grid - 2 cols on mobile for compact readability */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {GWANGALLI_COURSES.map((course) => {
            const isSelected = selectedCourse.id === course.id;
            return (
              <button
                key={course.id}
                onClick={() => {
                  setSelectedCourse(course);
                  setSimProgress(0);
                }}
                className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all relative ${
                  isSelected
                    ? 'bg-blue-950/90 border-cyan-400 ring-1 ring-cyan-400/50 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-850 bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-black px-2 py-0.5 rounded ${
                      course.level === '초급'
                        ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/40'
                        : course.level === '중급'
                        ? 'bg-blue-500/25 text-blue-200 border border-blue-400/40'
                        : 'bg-rose-500/25 text-rose-200 border border-rose-400/40'
                    }`}
                  >
                    {course.level}
                  </span>
                  <span className="text-xs sm:text-sm font-black text-cyan-300">{course.distanceMeters}m</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5 line-clamp-1">{course.nameKo}</h4>
                <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{course.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Mode Switcher & Global Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 sm:p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setMapViewMode('google')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              mapViewMode === 'google'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Google Maps 위성/실시간 맵
          </button>
          <button
            onClick={() => setMapViewMode('illustration')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all ${
              mapViewMode === 'illustration'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            코스 그래픽 일러스트
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportToGoogleDrive}
            disabled={isExportingDrive}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
          >
            <CloudUpload className={`w-3.5 h-3.5 ${isExportingDrive ? 'animate-bounce' : ''}`} />
            {isExportingDrive ? 'Drive 저장 중...' : 'Google Drive GPX 백업'}
          </button>
          <button
            onClick={handleDownloadGpx}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            GPX 다운로드 (워치)
          </button>
        </div>
      </div>

      {mapViewMode === 'google' ? (
        <GwangalliGoogleMap
          selectedCourse={selectedCourse}
          isSimulating={isSimulating}
          simProgress={simProgress}
          onNotify={onNotify}
        />
      ) : (
        /* Interactive Map Visualizer (SVG Illustration) */
        <div className="relative bg-slate-950 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl">
          {/* Mobile Header & Action Bar (Outside SVG to avoid blocking sea view on small screens) */}
          <div className="md:hidden p-3.5 bg-slate-900 border-b border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
              <h4 className="text-sm font-bold text-white">{selectedCourse.nameKo}</h4>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-black text-cyan-300">{selectedCourse.distanceMeters}m</span>
              <span className="text-slate-400 font-medium">({selectedCourse.depthRange})</span>
            </div>
          </div>

          {isSimulating && (
            <div className="text-xs text-amber-200 font-bold bg-amber-950/60 px-3 py-1.5 rounded-xl border border-amber-600/40 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                영법 시뮬레이션 진행중
              </span>
              <span className="font-mono text-amber-300">
                {Math.round(simProgress * selectedCourse.distanceMeters)}m ({Math.round(simProgress * 100)}%)
              </span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <button
              onClick={handleExportToGoogleDrive}
              disabled={isExportingDrive}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isExportingDrive ? 'animate-bounce' : ''}`} />
              {isExportingDrive ? '저장중...' : 'Drive GPX 저장'}
            </button>
            <button
              onClick={handleDownloadGpx}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-md active:scale-95 transition-all"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              GPX 파일 받기
            </button>
          </div>
        </div>

        {/* Desktop Map Header Overlay (hidden on mobile) */}
        <div className="hidden md:block absolute top-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-700 shadow-lg max-w-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h4 className="text-sm font-bold text-white">{selectedCourse.nameKo}</h4>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-200">
            <span>거리: <strong className="text-cyan-300">{selectedCourse.distanceMeters}m</strong></span>
            <span>수심: <strong className="text-white">{selectedCourse.depthRange}</strong></span>
            {isSimulating && (
              <span className="text-amber-300 font-bold animate-pulse">
                진행: {Math.round(simProgress * selectedCourse.distanceMeters)}m ({Math.round(simProgress * 100)}%)
              </span>
            )}
          </div>
        </div>

        {/* Map Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-20 hidden md:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700/80 text-[11px] text-slate-200 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white"></span>
            안전부표/턴부표
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-cyan-400 inline-block"></span>
            수영 코스 라인
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 ring-2 ring-cyan-500 animate-pulse"></span>
            영자(영법 시뮬레이터)
          </span>
          <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
            <Waves className="w-3.5 h-3.5" />
            밀물 조류 방향 (삼익 ➔ 민락)
          </span>
        </div>

        {/* Action Controls in Map (Desktop only) */}
        <div className="hidden md:flex absolute top-4 right-4 z-20 items-center gap-2">
          <button
            onClick={handleExportToGoogleDrive}
            disabled={isExportingDrive}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
            title="Google Drive에 이 코스의 GPX 경로 저장"
          >
            <CloudUpload className={`w-3.5 h-3.5 ${isExportingDrive ? 'animate-bounce' : ''}`} />
            {isExportingDrive ? 'Drive 동기화 중...' : 'Google Drive로 GPX 저장'}
          </button>
          <button
            onClick={handleDownloadGpx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shadow-md transition-all"
            title="가민/애플워치/순토 연동용 GPX 다운로드"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            GPX 다운로드
          </button>
        </div>

        {/* SVG Graphic Map Canvas */}
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] min-h-[300px] max-h-[580px] bg-gradient-to-b from-[#061426] via-[#0b2545] to-[#13315c] relative select-none">
          <svg viewBox="0 0 1000 600" className="w-full h-full">
            <defs>
              {/* Sea Water Gradient */}
              <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#081b33" />
                <stop offset="50%" stopColor="#0d2b4f" />
                <stop offset="100%" stopColor="#1a426f" />
              </linearGradient>

              {/* Sand Beach Gradient */}
              <linearGradient id="sandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4a373" />
                <stop offset="100%" stopColor="#b08968" />
              </linearGradient>

              {/* Course Glow */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Sea */}
            <rect width="1000" height="600" fill="url(#seaGrad)" />

            {/* Gentle Water Ripple Lines */}
            <g opacity="0.15" stroke="#38bdf8" strokeWidth="1.2" fill="none">
              <path d="M 0,280 Q 250,270 500,280 T 1000,280" />
              <path d="M 0,330 Q 250,340 500,330 T 1000,330" />
              <path d="M 0,380 Q 250,370 500,380 T 1000,380" />
              <path d="M 0,230 Q 250,240 500,230 T 1000,230" />
            </g>

            {/* GWANGAN BRIDGE (광안대교 / Diamond Bridge) */}
            <g id="gwangan-bridge" opacity="0.85">
              {/* Sea distance reference text */}
              <text x="500" y="85" fill="#64748b" fontSize="11" textAnchor="middle" letterSpacing="2">
                광안대교 (GWANGAN DIAMOND BRIDGE) — 해안선 1.0KM 외해
              </text>

              {/* Main Deck Span */}
              <path
                d="M 50,110 C 300,105 700,105 950,110"
                stroke="#94a3b8"
                strokeWidth="5"
                fill="none"
              />
              <path
                d="M 50,115 C 300,110 700,110 950,115"
                stroke="#64748b"
                strokeWidth="2"
                fill="none"
              />

              {/* Main Pylons (주탑 2기) */}
              {/* Left Pylon */}
              <g transform="translate(380, 50)">
                <rect x="-8" y="0" width="16" height="85" fill="#cbd5e1" rx="2" />
                <line x1="-8" y1="20" x2="8" y2="20" stroke="#475569" strokeWidth="2" />
                <line x1="-8" y1="45" x2="8" y2="45" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="-2" r="3" fill="#f43f5e" /> {/* Red Aviation Beacon */}
              </g>

              {/* Right Pylon */}
              <g transform="translate(620, 50)">
                <rect x="-8" y="0" width="16" height="85" fill="#cbd5e1" rx="2" />
                <line x1="-8" y1="20" x2="8" y2="20" stroke="#475569" strokeWidth="2" />
                <line x1="-8" y1="45" x2="8" y2="45" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="-2" r="3" fill="#f43f5e" />
              </g>

              {/* Suspension Cables */}
              <path
                d="M 120,110 Q 380,50 380,50 Q 500,95 620,50 Q 880,110 880,110"
                stroke="#38bdf8"
                strokeWidth="1.8"
                fill="none"
                opacity="0.8"
              />

              {/* Vertical Stay Cables */}
              {[180, 240, 300, 350, 420, 460, 500, 540, 580, 650, 710, 770, 830].map((x) => (
                <line
                  key={x}
                  x1={x}
                  y1={x > 380 && x < 620 ? 82 : 92}
                  x2={x}
                  y2="110"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
              ))}

              {/* Bridge Piers in water */}
              {[200, 380, 620, 800].map((x) => (
                <ellipse key={x} cx={x} cy="115" rx="14" ry="4" fill="#334155" opacity="0.7" />
              ))}
            </g>

            {/* GWANGALLI BEACH & COASTLINE (Crescent Bay) */}
            <g id="gwangalli-shoreline">
              {/* Sandy Beach Body */}
              <path
                d="M 0,550 Q 200,480 500,490 Q 800,480 1000,530 L 1000,600 L 0,600 Z"
                fill="url(#sandGrad)"
              />

              {/* White Shore Water Foam */}
              <path
                d="M 0,545 Q 200,475 500,485 Q 800,475 1000,525"
                stroke="#ffffff"
                strokeWidth="3"
                opacity="0.5"
                fill="none"
              />
              <path
                d="M 0,542 Q 200,472 500,482 Q 800,472 1000,522"
                stroke="#93c5fd"
                strokeWidth="1.5"
                opacity="0.6"
                fill="none"
              />

              {/* Beach Landmarks */}
              {/* Millak Fishery Port / Waterside Park (민락수변공원 방면 - 우측) */}
              <g transform="translate(870, 520)">
                <rect x="-40" y="-15" width="80" height="24" rx="4" fill="#1e293b" opacity="0.9" />
                <text x="0" y="1" fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle">
                  민락회타운 / 수변공원
                </text>
              </g>

              {/* Center Plaza (TEAM_GSR 새벽 집결지 & 드론쇼 광장) */}
              <g transform="translate(500, 526)">
                <rect x="-65" y="-18" width="130" height="32" rx="6" fill="#091b30" stroke="#06b6d4" strokeWidth="1.5" opacity="0.95" />
                <text x="0" y="-3" fill="#38bdf8" fontSize="9" fontWeight="900" textAnchor="middle">
                  🌊 TEAM_GSR 새벽 집결지
                </text>
                <text x="0" y="9" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                  하계 06:00 / 동계 06:30
                </text>
              </g>

              {/* Samick Beach / Namcheon-dong (남천동 삼익비치 방면 - 좌측) */}
              <g transform="translate(140, 530)">
                <rect x="-40" y="-15" width="80" height="24" rx="4" fill="#1e293b" opacity="0.9" />
                <text x="0" y="1" fill="#f1f5f9" fontSize="10" fontWeight="bold" textAnchor="middle">
                  남천동 삼익비치
                </text>
              </g>
            </g>

            {/* Coastline 50m Yellow Safety Buoy Line */}
            <g id="safety-buoy-line" stroke="#eab308" strokeDasharray="6 8" strokeWidth="1.5" fill="none" opacity="0.7">
              <path d="M 120,440 Q 500,465 880,430" />
            </g>
            {[160, 260, 360, 460, 560, 660, 760, 840].map((bx, i) => (
              <circle key={i} cx={bx} cy={445 - Math.sin((bx / 1000) * Math.PI) * 12} r="4.5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
            ))}

            {/* TIDAL DRIFT DIRECTION VECTOR (밀물 시 남서 -> 북동) */}
            <g transform="translate(320, 380)" opacity="0.6">
              <line x1="0" y1="0" x2="80" y2="-15" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 3" />
              <polygon points="80,-15 68,-22 72,-13 65,-9" fill="#38bdf8" />
              <text x="40" y="18" fill="#7dd3fc" fontSize="9" textAnchor="middle">
                밀물 조류 방향 (0.4 kt)
              </text>
            </g>

            {/* SELECTED SWIM COURSE PATH */}
            <g id="active-course" filter="url(#glow)">
              {/* Background Path Line */}
              <path
                d={selectedCourse.coordinates.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ')}
                stroke="#06b6d4"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Moving Pulse Animation */}
              <path
                d={selectedCourse.coordinates.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt[0]} ${pt[1]}`).join(' ')}
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="12 18"
                fill="none"
                strokeLinecap="round"
              />
            </g>

            {/* WAYPOINT MARKERS */}
            {selectedCourse.coordinates.map((pt, idx) => {
              const isStart = idx === 0;
              const isEnd = idx === selectedCourse.coordinates.length - 1;
              const isTurn = !isStart && !isEnd;

              return (
                <g key={idx} transform={`translate(${pt[0]}, ${pt[1]})`}>
                  {isStart && (
                    <>
                      <circle r="12" fill="#10b981" opacity="0.3" className="animate-ping" />
                      <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="-14" fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
                        START / 입수지점
                      </text>
                    </>
                  )}
                  {isTurn && (
                    <>
                      <polygon points="0,-9 8,6 -8,6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                      <text x="0" y="-12" fill="#fde68a" fontSize="9" fontWeight="bold" textAnchor="middle">
                        턴 부표 {idx}
                      </text>
                    </>
                  )}
                  {isEnd && (
                    <>
                      <circle r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                      <text x="0" y="20" fill="#bae6fd" fontSize="10" fontWeight="bold" textAnchor="middle">
                        FINISH
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {/* ANIMATED SWIMMER POSITION */}
            <g transform={`translate(${swimmerPos.x}, ${swimmerPos.y})`}>
              {/* Water Splash rings */}
              <circle r="16" fill="none" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" className="animate-ping" />
              {/* Swimmer Body Icon */}
              <circle r="9" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              {/* Orange Safety Swim Buoy attached behind */}
              <ellipse cx="-12" cy="6" rx="5" ry="3.5" fill="#f97316" stroke="#ffffff" strokeWidth="1" />
              <line x1="-1" y1="2" x2="-8" y2="5" stroke="#cbd5e1" strokeWidth="1" />
              <text x="0" y="-14" fill="#38bdf8" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                🏊‍♂️
              </text>
            </g>
          </svg>
        </div>
      </div>
      )}

      {/* Selected Course Detail Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Navigation className="w-4 h-4 text-cyan-400" />
            핵심 포인트 & 경로
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {selectedCourse.keyPoints.map((pt, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {i + 1}
                </span>
                <span>{pt}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
            <Waves className="w-4 h-4 text-blue-400" />
            수심 & 조류(연안류) 특성
          </h4>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-2.5 rounded-xl bg-slate-800/70">
              <span className="text-slate-400 block mb-0.5">평균 수심대:</span>
              <span className="font-bold text-white">{selectedCourse.depthRange}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-800/70">
              <span className="text-slate-400 block mb-0.5">조류 유의사항:</span>
              <span className="text-amber-200">{selectedCourse.currentWarning}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-emerald-400" />
              철인 오픈워터 팁
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              광안리 수영 시 광안대교 메인 주탑의 높이를 시각 기준선(Sighting Landmark)으로 삼으면 나침반 없이도 정확한 직진 유지가 가능합니다.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Google Drive 동기화:</span>
            <span className="text-xs font-semibold text-cyan-400">
              {isGoogleAuthenticated ? '연동 완료 (준비됨)' : '로그인 시 원클릭 백업'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
