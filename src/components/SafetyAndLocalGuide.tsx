import React from 'react';
import { GWANGALLI_FACILITIES } from '../data/gwangalliData';
import {
  LifeBuoy,
  MapPin,
  PhoneCall,
  ShowerHead,
  AlertOctagon,
  HelpCircle,
  Thermometer,
  Shield,
  Compass
} from 'lucide-react';

export const SafetyAndLocalGuide: React.FC = () => {
  const seasonalTemps = [
    { season: '봄 (4~5월)', temp: '14℃ ~ 17℃', suit: '3~5mm 웻슈트 필수', note: '수온 상승기, 입수 초기 흉부 압박 대비 호흡 적응 필수' },
    { season: '초여름 (6~7월)', temp: '19℃ ~ 22℃', suit: '3mm 또는 롱존(민소매)', note: '바다수영 최적기, 대회 실전 모의훈련 성수기' },
    { season: '한여름 (8월)', temp: '24℃ ~ 27℃', suit: '노슈트 / 스킨슈트', note: '고수온기, 철인 대회 규정상 웻슈트 금지 구간 및 해파리 주의' },
    { season: '가을 (9~10월)', temp: '20℃ ~ 23℃', suit: '3mm 오픈워터 슈트', note: '가장 맑은 시야와 안정적 수온, 너울성 파도 체크' },
    { season: '겨울 (11~2월)', temp: '11℃ ~ 15℃', suit: '5mm 동계슈트+후드/삭스', note: '동계 바다수영 동호인 훈련, 저체온증 방지 20분 이내 제한' },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <LifeBuoy className="w-5 h-5 text-cyan-400" />
          광안리 로컬 가이드 & 안전 응급 프로토콜
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          광안리 바다수영인을 위한 공설 샤워장, 사우나, 해양경찰 파출소, 연간 수온 추이 및 이안류 탈출 수칙
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GWANGALLI_FACILITIES.map((fac, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {fac.type}
                </span>
                <span className="text-xs text-slate-400">{fac.contact}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                {fac.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1">위치: {fac.location}</p>
              <p className="text-xs text-slate-400 mt-2 bg-slate-800/40 p-2 rounded-xl">
                {fac.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Seasonal Water Temperature Table & Mobile Cards */}
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl">
        <h4 className="text-base font-black text-white flex items-center gap-2 mb-3.5">
          <Thermometer className="w-5 h-5 text-teal-400" />
          부산 광안리 계절별 평균 수온 & 장비 가이드
        </h4>

        {/* Mobile Card List (< sm) */}
        <div className="sm:hidden space-y-2.5">
          {seasonalTemps.map((s, i) => (
            <div key={i} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-xs">{s.season}</span>
                <span className="font-black text-cyan-300 text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                  {s.temp}
                </span>
              </div>
              <div className="mt-1.5 text-xs text-amber-200 font-semibold">
                장비: <span className="text-slate-100">{s.suit}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">💡 {s.note}</p>
            </div>
          ))}
        </div>

        {/* Tablet & Desktop Table (>= sm) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-800 text-slate-300 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3 rounded-l-lg">계절 / 시기</th>
                <th className="p-3">평균 표층 수온</th>
                <th className="p-3">권장 슈트 / 장비</th>
                <th className="p-3 rounded-r-lg">수영 유의사항</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {seasonalTemps.map((s, i) => (
                <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-bold text-white">{s.season}</td>
                  <td className="p-3 text-cyan-300 font-black">{s.temp}</td>
                  <td className="p-3 text-white font-medium">{s.suit}</td>
                  <td className="p-3 text-slate-300">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rip Current (이안류) & Emergency Tactics */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-900/40 rounded-2xl p-5 md:p-6">
        <h4 className="text-base font-bold text-rose-300 flex items-center gap-2 mb-2">
          <AlertOctagon className="w-5 h-5 text-rose-400" />
          해양 조류 / 이안류(Rip Current) 발생 시 비상 탈출 행동요령
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="font-bold text-white block mb-1">1. 당황 금지 & 백사장 정면 거스르지 않기</span>
            <p className="text-slate-400">
              이안류 유속은 올림픽 수영 선수보다 빠를 수 있습니다. 모래사장 쪽으로 무리하게 맞서 헤엄치면 체력이 소진됩니다.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="font-bold text-white block mb-1">2. 해안선과 45도 평행 대각선 탈출</span>
            <p className="text-slate-400">
              조류 물살의 폭은 보통 15~30m 내외입니다. 해변과 나란한 방향(좌우 측면)으로 45도 각도로 벗어나면 조류권에서 탈출할 수 있습니다.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <span className="font-bold text-white block mb-1">3. 스윔부이 의지 & 신호</span>
            <p className="text-slate-400">
              탈출이 어려우면 즉시 스윔부이를 끌어안고 수면에 누워 호흡을 확보한 후, 한 팔을 높이 들고 호루라기를 불어 119/구조대에 위치를 알립니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
