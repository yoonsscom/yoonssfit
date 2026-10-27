import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  Polyline,
  useMap,
  ControlPosition,
  MapControl
} from '@vis.gl/react-google-maps';
import { SwimCourse } from '../types/swim';
import { MaritimeLandmark, GWANGALLI_LANDMARKS } from '../data/gwangalliData';
import {
  Navigation,
  Crosshair,
  Layers,
  MapPin,
  ShieldAlert,
  Info,
  Maximize2,
  ExternalLink,
  PhoneCall,
  Compass,
  Waves
} from 'lucide-react';

interface GwangalliGoogleMapProps {
  selectedCourse: SwimCourse;
  isSimulating: boolean;
  simProgress: number; // 0 to 1
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

// Controller component to smoothly pan/fit bounds when course changes or user requests
const MapBoundsController: React.FC<{
  course: SwimCourse;
  userLocation: { lat: number; lng: number } | null;
}> = ({ course, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !course.geoPath || course.geoPath.length === 0) return;

    try {
      const bounds = new google.maps.LatLngBounds();
      course.geoPath.forEach((pt) => bounds.extend(pt));
      if (userLocation) {
        bounds.extend(userLocation);
      }
      map.fitBounds(bounds, { top: 60, right: 60, bottom: 60, left: 60 });
    } catch (e) {
      console.warn('fitBounds error:', e);
    }
  }, [map, course, userLocation]);

  return null;
};

export const GwangalliGoogleMap: React.FC<GwangalliGoogleMapProps> = ({
  selectedCourse,
  isSimulating,
  simProgress,
  onNotify
}) => {
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyAvHiXFN5YXxhaWI7yc4QX5NZuw41muFtw';

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('hybrid');
  const [selectedLandmark, setSelectedLandmark] = useState<MaritimeLandmark | null>(null);
  const [selectedCoursePoint, setSelectedCoursePoint] = useState<{
    type: 'start' | 'turn';
    title: string;
    lat: number;
    lng: number;
    desc: string;
  } | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);

  // Calculate live GPS coordinate of swimmer during simulation
  const swimmerGps = useMemo(() => {
    const geo = selectedCourse.geoPath;
    if (!geo || geo.length < 2) {
      return selectedCourse.startPoint;
    }

    const totalSegments = geo.length - 1;
    const scaled = simProgress * totalSegments;
    const currIdx = Math.min(Math.floor(scaled), totalSegments - 1);
    const nextIdx = currIdx + 1;
    const progress = scaled - currIdx;

    const p1 = geo[currIdx];
    const p2 = geo[nextIdx];

    const lat = p1.lat + (p2.lat - p1.lat) * progress;
    const lng = p1.lng + (p2.lng - p1.lng) * progress;

    return { lat, lng };
  }, [selectedCourse, simProgress]);

  // Request user's live GPS location
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      if (onNotify) onNotify('이 브라우저에서는 위치 서비스를 지원하지 않습니다.', 'error');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        setUserLocation(loc);
        if (onNotify) {
          onNotify(`현재 GPS 위치를 감지했습니다: (${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)})`, 'success');
        }
      },
      (err) => {
        setIsLocating(false);
        if (onNotify) {
          onNotify(`위치 확인 실패: ${err.message}`, 'error');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Course Info Badge */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-cyan-500/40 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-xs font-black text-white">{selectedCourse.nameKo}</span>
          <span className="text-[11px] font-bold text-cyan-300 font-mono">
            {selectedCourse.distanceMeters}m
          </span>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-lg">
          {/* Map Type switcher */}
          <button
            onClick={() => setMapType((prev) => (prev === 'hybrid' ? 'roadmap' : 'hybrid'))}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              mapType === 'hybrid'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-200 hover:text-white hover:bg-slate-800'
            }`}
            title="위성/일반 지도 전환"
          >
            <Layers className="w-3.5 h-3.5" />
            {mapType === 'hybrid' ? '위성 영상' : '일반 지도'}
          </button>

          {/* Toggle Landmarks */}
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              showLandmarks
                ? 'bg-slate-700 text-cyan-300 border border-slate-600'
                : 'text-slate-400 hover:text-white'
            }`}
            title="안전시설 및 랜드마크 마커 표시"
          >
            <MapPin className="w-3.5 h-3.5" />
            주요 시설
          </button>

          {/* GPS My Location */}
          <button
            onClick={handleLocateMe}
            disabled={isLocating}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              userLocation
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700'
            }`}
            title="내 현재 GPS 위치 확인"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-cyan-400' : ''}`} />
            내 위치
          </button>
        </div>
      </div>

      {/* Main Google Maps Component */}
      <div className="h-[460px] sm:h-[540px] w-full">
        <APIProvider apiKey={apiKey} libraries={['marker', 'geometry']}>
          <Map
            // MANDATORY Google Maps Platform Agent Skill Attribution ID
            internalUsageAttributionIds={['gmp_git_agentskills_v1']}
            // Mandatory Map ID for AdvancedMarker support
            mapId="DEMO_MAP_ID"
            defaultCenter={{ lat: 35.1532, lng: 129.1195 }}
            defaultZoom={15}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            tilt={mapType === 'hybrid' ? 45 : 0}
            className="w-full h-full"
          >
            {/* Auto fit bounds to course path */}
            <MapBoundsController course={selectedCourse} userLocation={userLocation} />

            {/* Swim Course Polyline Route */}
            {selectedCourse.geoPath && selectedCourse.geoPath.length > 0 && (
              <Polyline
                path={selectedCourse.geoPath}
                strokeColor="#06b6d4"
                strokeWeight={5}
                strokeOpacity={0.9}
              />
            )}

            {/* Course Start Point Marker */}
            <AdvancedMarker
              position={selectedCourse.startPoint}
              title={`출발지: ${selectedCourse.startPoint.label}`}
              onClick={() => {
                setSelectedLandmark(null);
                setSelectedCoursePoint({
                  type: 'start',
                  title: `🚩 출발/피니시: ${selectedCourse.startPoint.label}`,
                  lat: selectedCourse.startPoint.lat,
                  lng: selectedCourse.startPoint.lng,
                  desc: '광안리 백사장 공식 입수 및 탈의/정리 포인트입니다. 입수 전 스트레칭과 안전부이 착용을 확인하세요.'
                });
              }}
            >
              <Pin
                background="#10b981"
                borderColor="#047857"
                glyphColor="#ffffff"
                scale={1.2}
              />
            </AdvancedMarker>

            {/* Course Turn Point Marker */}
            <AdvancedMarker
              position={selectedCourse.turnPoint}
              title={`반환점: ${selectedCourse.turnPoint.label}`}
              onClick={() => {
                setSelectedLandmark(null);
                setSelectedCoursePoint({
                  type: 'turn',
                  title: `🟡 턴 부표: ${selectedCourse.turnPoint.label}`,
                  lat: selectedCourse.turnPoint.lat,
                  lng: selectedCourse.turnPoint.lng,
                  desc: '코스 주요 회전 및 시야 확보(헤드업) 기준 부표입니다. 외해 조류 변화에 유의하세요.'
                });
              }}
            >
              <Pin
                background="#f59e0b"
                borderColor="#b45309"
                glyphColor="#ffffff"
                scale={1.2}
              />
            </AdvancedMarker>

            {/* Real-time Swimmer Position Marker during Simulation */}
            {isSimulating && (
              <AdvancedMarker
                position={swimmerGps}
                title="시뮬레이션 수영 선수 위치"
                zIndex={100}
              >
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-10 h-10 rounded-full bg-cyan-400/40 animate-ping"></div>
                  <div className="w-8 h-8 rounded-full bg-cyan-400 border-2 border-white shadow-xl flex items-center justify-center text-sm font-bold text-slate-950">
                    🏊
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* User Live GPS Marker */}
            {userLocation && (
              <AdvancedMarker position={userLocation} title="현재 내 위치">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-8 h-8 rounded-full bg-emerald-400/50 animate-ping"></div>
                  <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-black">
                    ME
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Maritime Safety & Crew Landmarks */}
            {showLandmarks &&
              GWANGALLI_LANDMARKS.map((lm) => {
                const getPinColor = () => {
                  switch (lm.category) {
                    case 'safety':
                      return { bg: '#ef4444', border: '#b91c1c' };
                    case 'meeting':
                      return { bg: '#06b6d4', border: '#0891b2' };
                    case 'buoy':
                      return { bg: '#3b82f6', border: '#1d4ed8' };
                    case 'facility':
                      return { bg: '#8b5cf6', border: '#6d28d9' };
                    default:
                      return { bg: '#64748b', border: '#334155' };
                  }
                };
                const color = getPinColor();

                return (
                  <AdvancedMarker
                    key={lm.id}
                    position={{ lat: lm.lat, lng: lm.lng }}
                    title={lm.name}
                    onClick={() => {
                      setSelectedCoursePoint(null);
                      setSelectedLandmark(lm);
                    }}
                  >
                    <Pin
                      background={color.bg}
                      borderColor={color.border}
                      glyphColor="#ffffff"
                      scale={1.0}
                    />
                  </AdvancedMarker>
                );
              })}

            {/* Course Point InfoWindow */}
            {selectedCoursePoint && (
              <InfoWindow
                position={{ lat: selectedCoursePoint.lat, lng: selectedCoursePoint.lng }}
                onCloseClick={() => setSelectedCoursePoint(null)}
              >
                <div className="p-1 max-w-[240px] text-slate-900">
                  <span className="text-xs font-black text-slate-900 block">
                    {selectedCoursePoint.title}
                  </span>
                  <p className="text-[11px] text-slate-700 mt-1 leading-snug">
                    {selectedCoursePoint.desc}
                  </p>
                  <div className="mt-2 text-[10px] text-cyan-800 font-mono font-bold">
                    GPS: {selectedCoursePoint.lat.toFixed(4)}, {selectedCoursePoint.lng.toFixed(4)}
                  </div>
                </div>
              </InfoWindow>
            )}

            {/* Landmark InfoWindow */}
            {selectedLandmark && (
              <InfoWindow
                position={{ lat: selectedLandmark.lat, lng: selectedLandmark.lng }}
                onCloseClick={() => setSelectedLandmark(null)}
              >
                <div className="p-1 max-w-[260px] text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{selectedLandmark.icon}</span>
                    <span className="text-xs font-black text-slate-900">
                      {selectedLandmark.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 mt-1.5 leading-snug">
                    {selectedLandmark.desc}
                  </p>
                  {selectedLandmark.contact && (
                    <div className="mt-2 pt-1.5 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-700 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3" />
                        긴급 연락처
                      </span>
                      <a
                        href={`tel:${selectedLandmark.contact}`}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        {selectedLandmark.contact}
                      </a>
                    </div>
                  )}
                  <div className="mt-1 text-[10px] text-slate-500 font-mono">
                    좌표: {selectedLandmark.lat.toFixed(4)}, {selectedLandmark.lng.toFixed(4)}
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Bottom Status / Legend Bar */}
      <div className="bg-slate-900/95 border-t border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px]">출발지 (Start)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-[11px]">반환 부표 (Turn)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-cyan-400 rounded"></span>
            <span className="text-[11px]">실제 GPS 수영 항로 (Route)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-[11px]">119 수상구조대</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          * Google Maps Platform 고해상도 위성 영상 &amp; 실시간 항로
        </div>
      </div>
    </div>
  );
};
