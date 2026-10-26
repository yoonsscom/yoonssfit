import React, { useState } from 'react';
import { SwimLog } from '../types/swim';
import { GWANGALLI_COURSES } from '../data/gwangalliData';
import {
  Calendar,
  Clock,
  Activity,
  Plus,
  Trash2,
  CloudUpload,
  Trophy,
  Filter,
  Check,
  Search,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

interface SwimLoggerProps {
  logs: SwimLog[];
  onAddLog: (log: Omit<SwimLog, 'id' | 'createdAt'>) => void;
  onDeleteLog: (id: string) => void;
  onBackupToDrive: () => void;
  isGoogleAuthenticated?: boolean;
  onRequestLogin?: () => void;
}

export const SwimLogger: React.FC<SwimLoggerProps> = ({
  logs,
  onAddLog,
  onDeleteLog,
  onBackupToDrive,
  isGoogleAuthenticated = false,
  onRequestLogin,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('06:30');
  const [distanceMeters, setDistanceMeters] = useState(1500);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [selectedCourseId, setSelectedCourseId] = useState(GWANGALLI_COURSES[1].id);
  const [strokeType, setStrokeType] = useState<SwimLog['strokeType']>('자유형 (Freestyle)');
  const [gearType, setGearType] = useState<SwimLog['gearType']>('웻슈트 (Full Wetsuit)');
  const [buoyUsed, setBuoyUsed] = useState(true);
  const [waterTemp, setWaterTemp] = useState(19.8);
  const [perceivedEffort, setPerceivedEffort] = useState(7);
  const [targetCategory, setTargetCategory] = useState<SwimLog['targetCategory']>('철인3종 훈련 (Triathlon)');
  const [notes, setNotes] = useState('');
  const [buddies, setBuddies] = useState('');

  // Stats calculation
  const totalDistanceKm = (logs.reduce((sum, l) => sum + l.distanceMeters, 0) / 1000).toFixed(1);
  const totalDurationHours = (logs.reduce((sum, l) => sum + l.durationMinutes, 0) / 60).toFixed(1);

  const avgPaceSec =
    logs.length > 0
      ? Math.round(logs.reduce((sum, l) => sum + l.avgPaceSecondsPer100m, 0) / logs.length)
      : 120;
  const avgPaceFormatted = `${Math.floor(avgPaceSec / 60)}'${(avgPaceSec % 60).toString().padStart(2, '0')}"`;

  const bestPaceSec = logs.length > 0 ? Math.min(...logs.map((l) => l.avgPaceSecondsPer100m)) : 0;
  const bestPaceFormatted =
    bestPaceSec > 0 ? `${Math.floor(bestPaceSec / 60)}'${(bestPaceSec % 60).toString().padStart(2, '0')}"` : '-';

  // Format pace helper
  const formatPace = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}'${s.toString().padStart(2, '0')}"/100m`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const courseObj = GWANGALLI_COURSES.find((c) => c.id === selectedCourseId);
    const calculatedPaceSec = Math.round((durationMinutes * 60) / (distanceMeters / 100));

    onAddLog({
      date,
      startTime,
      durationMinutes,
      distanceMeters,
      avgPaceSecondsPer100m: calculatedPaceSec,
      courseId: selectedCourseId,
      courseName: courseObj ? courseObj.nameKo : '광안리 자유 코스',
      strokeType,
      gearType,
      buoyUsed,
      waterTemp,
      perceivedEffort,
      targetCategory,
      notes,
      buddies,
    });

    setShowAddModal(false);
    setNotes('');
  };

  const filteredLogs = logs.filter((log) => {
    if (filterCategory !== 'all' && !log.targetCategory.includes(filterCategory)) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        log.notes.toLowerCase().includes(q) ||
        log.courseName.toLowerCase().includes(q) ||
        (log.buddies && log.buddies.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">총 바다수영 거리</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{totalDistanceKm}</span>
            <span className="text-xs text-slate-400">km</span>
          </div>
          <span className="text-[11px] text-cyan-400 mt-1 block font-medium">총 {logs.length}회 훈련 세션</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">총 누적 수영 시간</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{totalDurationHours}</span>
            <span className="text-xs text-slate-400">시간</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">광안리 오픈워터 적응</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">평균 100m 페이스</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-cyan-300">{avgPaceFormatted}</span>
            <span className="text-[10px] text-slate-400">/100m</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">안정적 순항 페이스</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium">최고 100m 페이스</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-300">{bestPaceFormatted}</span>
            <span className="text-[10px] text-slate-400">/100m</span>
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block font-medium">철인 대회 PB 목표</span>
        </div>
      </div>

      {/* Control Actions Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="코스명, 메모, 버디 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            {['all', '철인3종', '체력단련'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {cat === 'all' ? '전체' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBackupToDrive}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all"
            title="훈련 일지를 Google Drive에 백업"
          >
            <CloudUpload className="w-4 h-4" />
            Google Drive 동기화
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/30 transition-all"
          >
            <Plus className="w-4 h-4" />
            새 수영 일지 작성
          </button>
        </div>
      </div>

      {/* Logs List Table / Cards */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <Activity className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium">기록된 바다수영 일지가 없습니다.</p>
            <p className="text-xs text-slate-500 mt-1">상단의 '새 수영 일지 작성' 버튼을 눌러 오늘 광안리 훈련을 기록해보세요.</p>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const pacePer100 = formatPace(log.avgPaceSecondsPer100m);
            return (
              <div
                key={log.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 md:p-5 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {log.date} ({log.startTime})
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        log.targetCategory.includes('철인')
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {log.targetCategory}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">{log.courseName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">수온 {log.waterTemp}℃</span>
                    <button
                      onClick={() => onDeleteLog(log.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="일지 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">수영 거리</span>
                    <span className="text-base font-black text-white">{log.distanceMeters} m</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">소요 시간</span>
                    <span className="text-base font-black text-white">{log.durationMinutes} 분</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">평균 100m 페이스</span>
                    <span className="text-base font-black text-cyan-300">{pacePer100}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">장비 / 슈트</span>
                    <span className="text-xs font-semibold text-slate-200">{log.gearType}</span>
                    {log.buoyUsed && (
                      <span className="ml-1 text-[10px] text-amber-400 font-bold bg-amber-950/80 px-1 rounded">
                        부이착용
                      </span>
                    )}
                  </div>
                </div>

                {log.notes && (
                  <div className="mt-3 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800/60">
                    <p className="leading-relaxed">💬 {log.notes}</p>
                    {log.buddies && (
                      <p className="text-[11px] text-slate-400 mt-1">👥 동반 수영 버디: {log.buddies}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add New Swim Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-cyan-400" />
                광안리 바다수영 / 철인 훈련 일지 작성
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">훈련 일자</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">입수 시작 시간</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">수영 코스 선택</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  {GWANGALLI_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nameKo} ({c.distanceMeters}m)
                    </option>
                  ))}
                  <option value="custom">광안리 자유 코스</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">수영 거리 (미터)</label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={distanceMeters}
                    onChange={(e) => setDistanceMeters(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">소요 시간 (분)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">착용 장비/슈트</label>
                  <select
                    value={gearType}
                    onChange={(e) => setGearType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="웻슈트 (Full Wetsuit)">웻슈트 (Full Wetsuit)</option>
                    <option value="롱존 (Sleeveless)">롱존 민소매 (Sleeveless)</option>
                    <option value="스킨슈트/수영복 (No Suit)">스킨슈트 / 수영복 (No Suit)</option>
                    <option value="네오프렌 삭스/캡 추가">동계 네오프렌 삭스/캡 추가</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">훈련 목표 분류</label>
                  <select
                    value={targetCategory}
                    onChange={(e) => setTargetCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                  >
                    <option value="철인3종 훈련 (Triathlon)">철인3종 훈련 (Triathlon)</option>
                    <option value="체력단련/피트니스 (Fitness)">체력단련/피트니스 (Fitness)</option>
                    <option value="바다적응/투어 (Tour)">바다적응/투어 (Tour)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">광안리 수온 (℃)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waterTemp}
                    onChange={(e) => setWaterTemp(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    체감 운동강도 (RPE 1~10): {perceivedEffort}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={perceivedEffort}
                    onChange={(e) => setPerceivedEffort(parseInt(e.target.value))}
                    className="w-full accent-cyan-400 mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="buoyCheck"
                  checked={buoyUsed}
                  onChange={(e) => setBuoyUsed(e.target.checked)}
                  className="rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-500 w-4 h-4"
                />
                <label htmlFor="buoyCheck" className="text-xs text-slate-200 font-medium">
                  스윔부이 (안전부표) 착용 완료 (광안리 권장 안전수칙)
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">함께 수영한 버디 / 파트너</label>
                <input
                  type="text"
                  placeholder="예: 김철인, 박스윔 (단독 수영 시 비워두기)"
                  value={buddies}
                  onChange={(e) => setBuddies(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">훈련 메모 & 피드백</label>
                <textarea
                  rows={3}
                  placeholder="파도 높이, 조류 체감, 헤드업 호흡 타이밍, T1 탈의 연습 등..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20"
                >
                  일지 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
