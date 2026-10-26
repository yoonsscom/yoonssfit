import React, { useState } from 'react';
import { GSR_CREW } from '../data/gwangalliData';
import {
  Waves,
  Users,
  Calendar,
  Flame,
  Award,
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Heart,
  Camera,
  Wrench,
  Trophy,
  ChevronRight,
  Send,
  X
} from 'lucide-react';

interface GSRCommunityProps {
  onNotify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const GSRCommunity: React.FC<GSRCommunityProps> = ({ onNotify }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('1992');
  const [primaryInterest, setPrimaryInterest] = useState('바다수영 & 철인3종');
  const [instagramId, setInstagramId] = useState('');
  const [motto, setMotto] = useState('');
  const [rsvpEvents, setRsvpEvents] = useState<Record<string, boolean>>({
    'gsr-event-1': true,
    'gsr-event-3': true,
  });

  const handleToggleRsvp = (eventId: string, title: string) => {
    const isAttending = !rsvpEvents[eventId];
    setRsvpEvents((prev) => ({ ...prev, [eventId]: isAttending }));
    if (onNotify) {
      onNotify(
        isAttending
          ? `[GSR] '${title}' 참가 예정으로 등록되었습니다!`
          : `[GSR] '${title}' 참가 신청이 취소되었습니다.`,
        isAttending ? 'success' : 'info'
      );
    }
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowJoinModal(false);
    if (onNotify) {
      onNotify(
        `🎉 ${name}님, TEAM_GSR 가입 신청이 접수되었습니다! 인스타그램(@team__gsr) DM으로 크루 안내가 전송됩니다.`,
        'success'
      );
    }
    setName('');
    setInstagramId('');
    setMotto('');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* GSR Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#07172c] via-[#0d2847] to-[#040e1a] border-2 border-cyan-500/40 p-6 sm:p-8 md:p-10 shadow-2xl shadow-cyan-950/60">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20">
                🌊 TEAM_GSR
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-cyan-200 border border-cyan-500/30">
                광안리 스위밍 러닝 크루
              </span>
              <a
                href={GSR_CREW.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/20 text-pink-300 border border-pink-500/40 hover:bg-pink-500/30 transition-colors"
              >
                <span>인스타그램 {GSR_CREW.instagram}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              새벽, 바다와 함께 <br />
              <span className="bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300 bg-clip-text text-transparent">
                시작하는 하루
              </span>
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-200 font-medium leading-relaxed">
              {GSR_CREW.purpose}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 font-bold flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                "초보도, 느려도 괜찮아요. 중요한 건 꾸준함과 새벽을 이겨내는 의지!{' '}
                <strong className="text-white underline decoration-cyan-400 underline-offset-4">
                  {GSR_CREW.helpMessage}
                </strong>
                "
              </span>
            </div>
          </div>

          {/* Quick Action Box */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 sm:p-6 lg:w-80 shrink-0 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                정기 모임 & 가입 안내
              </span>
              <div className="mt-2 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>하계: <strong>새벽 06:00</strong> / 동계: <strong>새벽 06:30</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>광안리 백사장 중앙 (드론쇼 시계탑 앞)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>회비: <strong>월 5,000원</strong> (운영비/비상약)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2">
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-400/25 transition-all text-center"
              >
                TEAM_GSR 크루 가입 신청하기
              </button>
              <a
                href={GSR_CREW.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-4 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>인스타그램 둘러보기</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* GSR Powerful Mentors & Coaches Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Users className="w-6 h-6 text-cyan-400" />
              GSR 최강 멘토 군단 (All-Star Coaches)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              못해도 부족해도 다 도와드립니다 — 수영, 마라톤, 철인, 자전거, 사진까지 전방위 서포트
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {GSR_CREW.mentors.map((m, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-700/80 hover:border-cyan-400/60 rounded-2xl p-3.5 sm:p-4 transition-all shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-500/25 text-cyan-200 border border-cyan-400/40">
                    {m.badge}
                  </span>
                  {idx === 0 && <Waves className="w-4 h-4 text-cyan-400" />}
                  {idx === 1 && <Trophy className="w-4 h-4 text-amber-400" />}
                  {idx === 2 && <Flame className="w-4 h-4 text-rose-400" />}
                  {idx === 3 && <Wrench className="w-4 h-4 text-emerald-400" />}
                  {idx === 4 && <Camera className="w-4 h-4 text-purple-400" />}
                </div>
                <h3 className="text-xs sm:text-sm font-black text-white mt-2.5 line-clamp-1">{m.title}</h3>
                <p className="text-[11px] sm:text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">{m.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] sm:text-[11px] text-cyan-300 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>현장 서포트</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2026 Official Events & Races */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <Calendar className="w-6 h-6 text-amber-400" />
              🏁 2026 TEAM_GSR 공식 대회 & 행사 캘린더
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              크루원들과 함께 도전하는 2026 시즌 목표 레이스
            </p>
          </div>
          <span className="text-xs text-cyan-300 font-semibold bg-cyan-950/60 px-3 py-1 rounded-xl border border-cyan-800/60 self-start sm:self-auto">
            참가 신청 및 크루 동반 출전 관리
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GSR_CREW.officialEvents2026.map((event) => {
            const isAttending = !!rsvpEvents[event.id];
            return (
              <div
                key={event.id}
                className={`rounded-2xl border p-5 transition-all relative overflow-hidden shadow-xl ${
                  isAttending
                    ? 'bg-gradient-to-r from-blue-950/90 to-slate-900 border-cyan-400/70 shadow-cyan-950/50'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {event.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    예상 참가자: <strong className="text-white">{event.participantsCount}명+</strong>
                  </span>
                </div>

                <h3 className="text-lg font-black text-white mt-2.5">{event.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{event.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>🗓️ {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>

                  <button
                    onClick={() => handleToggleRsvp(event.id, event.title)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all ${
                      isAttending
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isAttending ? '✓ 출전 등록 완료' : '+ 크루와 함께 참가'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Activities & Challenges */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-teal-400" />
            🏝️ GSR 특별 활동 & 시그니처 챌린지 코스
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            광안리를 넘어 부산 전역과 섬으로 확장하는 GSR만의 특별한 모험
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GSR_CREW.specialActivities.map((act, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 hover:border-teal-500/40 transition-all flex items-start gap-3.5"
            >
              <div className="text-2xl p-2.5 rounded-2xl bg-slate-800/70 border border-slate-700 shrink-0">
                {act.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{act.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 GSR Ironman Squad Focus Box */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/60 border-2 border-amber-500/50 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 mb-3">
              <Flame className="w-3.5 h-3.5 fill-current" />
              HOT SPECIAL
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {GSR_CREW.ironmanSquad.name}
            </h2>
            <p className="text-sm text-amber-200 mt-2 font-medium">
              {GSR_CREW.ironmanSquad.desc}
            </p>

            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
              {GSR_CREW.ironmanSquad.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 bg-slate-900/60 p-2 rounded-xl border border-amber-900/40">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => {
                setPrimaryInterest('철인 전용 훈련팀 (Ironman Squad)');
                setShowJoinModal(true);
              }}
              className="py-3 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 shadow-lg shadow-amber-500/30 transition-all"
            >
              철인 전용 훈련팀 지원하기 🔥
            </button>
          </div>
        </div>
      </div>

      {/* Join Application Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-800/60 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-400">🌊</span>
                <h3 className="text-lg font-bold text-white">TEAM_GSR 크루 가입 신청</h3>
              </div>
              <button
                onClick={() => setShowJoinModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="mt-4 space-y-4">
              <div className="p-3 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-xs text-cyan-200">
                ✨ <strong>가입 조건:</strong> 20세~80년생 / 실력 무관! 의지와 새벽을 함께할 열정만 있으면 누구나 환영합니다.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">이름 / 닉네임</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동 (광안리철인)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">출생년도</label>
                  <input
                    type="number"
                    min="1944"
                    max="2007"
                    required
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">인스타그램 ID (선택)</label>
                  <input
                    type="text"
                    placeholder="@your_id"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">주요 희망 활동 분야</label>
                <select
                  value={primaryInterest}
                  onChange={(e) => setPrimaryInterest(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="바다수영 & 철인3종">바다수영 & 철인3종 도전</option>
                  <option value="새벽 러닝 & 아쿠아슬론">새벽 러닝 & 아쿠아슬론</option>
                  <option value="철인 전용 훈련팀 (Ironman Squad)">철인 전용 훈련팀 (Ironman Squad)</option>
                  <option value="초보 입문 (자유형/체력 증진)">초보 입문 (자유형/체력 증진)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">다짐 한마디 / 각오</label>
                <textarea
                  rows={2}
                  placeholder="예: 올해 올림픽 코스 완주를 목표로 새벽 수영 열심히 하겠습니다!"
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-400/20"
                >
                  가입 신청 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
