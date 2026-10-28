import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ColdWaterAlertSettings } from '../types/swim';
import {
  Waves,
  MapPin,
  Compass,
  Trophy,
  Calendar,
  Cloud,
  LifeBuoy,
  LogOut,
  User as UserIcon,
  Sparkles,
  Snowflake,
  Users
} from 'lucide-react';

export type ActiveTab = 'marine' | 'courses' | 'triathlon' | 'gsr' | 'logs' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenDriveModal: () => void;
  waterTemp: number;
  tideName: string;
  coldWaterSettings: ColdWaterAlertSettings;
  onOpenColdWaterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  user,
  onLogin,
  onLogout,
  onOpenDriveModal,
  waterTemp,
  tideName,
  coldWaterSettings,
  onOpenColdWaterModal,
}) => {
  const isColdAlertTriggered = coldWaterSettings.enabled && waterTemp <= coldWaterSettings.thresholdTemp;

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        {/* Top Ticker Mini-Bar */}
        <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-blue-950/90 border-b border-blue-900/50 px-3 sm:px-4 py-1.5 text-xs text-slate-200">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            {/* Live Sea Conditions at Glance */}
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="flex items-center gap-1.5 font-black text-cyan-400 shrink-0">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                실시간 광안리
              </span>
              <span className="font-extrabold text-white bg-blue-900/40 px-1.5 py-0.5 rounded border border-blue-700/50">
                수온 {waterTemp}℃
              </span>
              <span className="text-slate-300 font-medium hidden xs:inline">{tideName.split(' ')[0]}</span>
              <span className="hidden sm:inline text-emerald-300 font-medium">· 안전부이 필수</span>
            </div>

            {/* Quick Actions (Cold Water Alert & Google Drive) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={onOpenColdWaterModal}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${
                  isColdAlertTriggered
                    ? 'bg-rose-500/25 text-rose-200 border-rose-500/60 animate-pulse'
                    : coldWaterSettings.enabled
                    ? 'bg-cyan-950/60 text-cyan-200 border-cyan-500/40 hover:bg-cyan-900/60'
                    : 'text-slate-400 border-slate-700/60 hover:text-slate-200'
                }`}
                title="냉수 주의보 설정 열기"
              >
                <Snowflake className={`w-3.5 h-3.5 ${isColdAlertTriggered ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">냉수주의보</span>
                <span className="font-mono">{coldWaterSettings.enabled ? `${coldWaterSettings.thresholdTemp}℃` : 'OFF'}</span>
              </button>

              <button
                onClick={onOpenDriveModal}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/70 text-xs font-semibold text-slate-200 transition-colors"
                title="Google Drive 클라우드 백업 열기"
              >
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Drive</span>
                <span className={`w-2 h-2 rounded-full ${user ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Brand & Desktop Nav Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo & Titles */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => onTabChange('gsr')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20 font-black text-xs sm:text-sm tracking-tighter hover:scale-105 transition-transform"
                title="TEAM_GSR 크루 라운지로 이동"
              >
                GSR
              </button>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-white text-base sm:text-lg tracking-tight">
                    TEAM_GSR
                  </span>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950">
                    스위밍·러닝
                  </span>
                  <span className="hidden xs:inline text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                    철인3종
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium hidden sm:flex items-center gap-1">
                  <span>새벽, 바다와 함께 시작하는 하루</span>
                  <span>·</span>
                  <a
                    href="https://www.instagram.com/team__gsr"
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-400 hover:underline font-bold"
                  >
                    @team__gsr
                  </a>
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Desktop Only) */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => onTabChange('marine')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'marine'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Waves className="w-4 h-4" />
                해황 & 7일 예보
              </button>
              <button
                onClick={() => onTabChange('courses')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'courses'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Compass className="w-4 h-4" />
                광안리 코스맵
              </button>
              <button
                onClick={() => onTabChange('triathlon')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'triathlon'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Trophy className="w-4 h-4" />
                철인3종 훈련랩
              </button>
              <button
                onClick={() => onTabChange('gsr')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  activeTab === 'gsr'
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-400/25'
                    : 'text-cyan-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                GSR 크루 라운지
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-pink-500 text-white font-extrabold">
                  크루
                </span>
              </button>
              <button
                onClick={() => onTabChange('logs')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'logs'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                훈련 일지
              </button>
              <button
                onClick={() => onTabChange('guide')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'guide'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LifeBuoy className="w-4 h-4" />
                안전 가이드
              </button>
            </nav>

            {/* User Profile / Login */}
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 p-1 pl-2 rounded-2xl">
                  <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-200 hidden md:inline max-w-[100px] truncate">
                    {user.displayName || user.email}
                  </span>
                  <button
                    onClick={onLogout}
                    className="p-1 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="로그아웃"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all shadow-sm"
                >
                  로그인
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modern High-Visibility Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 pb-safe shadow-[0_-8px_25px_rgba(0,0,0,0.7)]">
        <div className="grid grid-cols-6 h-16 items-center px-1 max-w-lg mx-auto">
          {/* Tab 1: Marine */}
          <button
            onClick={() => onTabChange('marine')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'marine'
                ? 'text-cyan-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'marine' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
              <Waves className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight font-bold">해황·예보</span>
          </button>

          {/* Tab 2: Courses */}
          <button
            onClick={() => onTabChange('courses')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'courses'
                ? 'text-cyan-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'courses' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">코스맵</span>
          </button>

          {/* Tab 3: GSR Crew (Prominent Center Tab) */}
          <button
            onClick={() => onTabChange('gsr')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'gsr'
                ? 'text-cyan-300 font-black'
                : 'text-cyan-400/80 hover:text-cyan-300 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-2xl transition-all shadow-md ${
                activeTab === 'gsr'
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 scale-110 shadow-cyan-400/40'
                  : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80'
              }`}
            >
              <Users className="w-5 h-5 stroke-[2.4]" />
            </div>
            <span className="text-[11px] mt-0.5 font-bold tracking-tight">GSR크루</span>
          </button>

          {/* Tab 4: Triathlon */}
          <button
            onClick={() => onTabChange('triathlon')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'triathlon'
                ? 'text-amber-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'triathlon' ? 'bg-amber-500/20 text-amber-300' : ''}`}>
              <Trophy className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">철인3종</span>
          </button>

          {/* Tab 5: Logs */}
          <button
            onClick={() => onTabChange('logs')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'logs'
                ? 'text-cyan-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'logs' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">일지</span>
          </button>

          {/* Tab 6: Guide */}
          <button
            onClick={() => onTabChange('guide')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all ${
              activeTab === 'guide'
                ? 'text-cyan-400 font-black'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className={`p-1 rounded-xl ${activeTab === 'guide' ? 'bg-cyan-500/20 text-cyan-300' : ''}`}>
              <LifeBuoy className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">가이드</span>
          </button>
        </div>
      </nav>
    </>
  );
};
