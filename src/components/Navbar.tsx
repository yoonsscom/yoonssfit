import React from 'react';
import { User } from 'firebase/auth';
import { GoogleSignInButton } from './GoogleSignInButton';
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
  Sparkles
} from 'lucide-react';

export type ActiveTab = 'marine' | 'courses' | 'triathlon' | 'logs' | 'guide';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenDriveModal: () => void;
  waterTemp: number;
  tideName: string;
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
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Top mini-bar for quick conditions */}
      <div className="bg-blue-950/60 border-b border-blue-900/40 px-4 py-1 text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-bold text-cyan-400">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            광안리해수욕장 실시간:
          </span>
          <span>수온 <strong className="text-white">{waterTemp}℃</strong></span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline">{tideName}</span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-emerald-400 font-semibold">입수 최적 상태 (안전부이 필수)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDriveModal}
            className="flex items-center gap-1 text-slate-300 hover:text-cyan-300 transition-colors"
          >
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Google Drive</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.2 rounded border border-blue-500/30">
              {user ? '연동됨' : '미연동'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
              <Waves className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base md:text-lg tracking-tight">
                  광안리 바다수영
                </span>
                <span className="text-xs font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  철인3종
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Gwangalli Open Water Swim & Triathlon Mate
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onTabChange('marine')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'marine'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Waves className="w-4 h-4" />
              해황 & 안전 레이더
            </button>
            <button
              onClick={() => onTabChange('courses')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              광안리 코스맵 & GPX
            </button>
            <button
              onClick={() => onTabChange('triathlon')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'triathlon'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-4 h-4" />
              철인3종 훈련랩
            </button>
            <button
              onClick={() => onTabChange('logs')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              수영 훈련 일지
            </button>
            <button
              onClick={() => onTabChange('guide')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'guide'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <LifeBuoy className="w-4 h-4" />
              안전 & 로컬 가이드
            </button>
          </nav>

          {/* User Auth Profile / Google Button */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 pl-2.5 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {user.displayName ? user.displayName.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                </div>
                <button
                  onClick={onOpenDriveModal}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                  title="Google Drive 동기화 열기"
                >
                  <Cloud className="w-4 h-4" />
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="로그아웃"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <GoogleSignInButton onClick={onLogin} label="Google 로그인" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Scroll Bar */}
      <div className="lg:hidden border-t border-slate-800/80 px-4 py-2 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <button
          onClick={() => onTabChange('marine')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'marine' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'
          }`}
        >
          <Waves className="w-3.5 h-3.5" />
          해황
        </button>
        <button
          onClick={() => onTabChange('courses')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'courses' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          광안리 코스맵
        </button>
        <button
          onClick={() => onTabChange('triathlon')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'triathlon' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          철인3종 훈련
        </button>
        <button
          onClick={() => onTabChange('logs')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'logs' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          훈련 일지
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${
            activeTab === 'guide' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-300'
          }`}
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          안전 가이드
        </button>
      </div>
    </header>
  );
};
