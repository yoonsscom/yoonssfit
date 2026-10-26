import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from './services/auth';
import { Navbar, ActiveTab } from './components/Navbar';
import { MarineConditions } from './components/MarineConditions';
import { GwangalliCourseMap } from './components/GwangalliCourseMap';
import { TriathlonTraining } from './components/TriathlonTraining';
import { SwimLogger } from './components/SwimLogger';
import { SafetyAndLocalGuide } from './components/SafetyAndLocalGuide';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { CURRENT_GWANGALLI_CONDITION, INITIAL_SWIM_LOGS } from './data/gwangalliData';
import { SwimLog } from './types/swim';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('marine');
  const [user, setUser] = useState<User | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [marineCondition, setMarineCondition] = useState(CURRENT_GWANGALLI_CONDITION);

  // Swim logs state (persisted locally with Google Drive sync capabilities)
  const [logs, setLogs] = useState<SwimLog[]>(() => {
    try {
      const saved = localStorage.getItem('gwangalli_swim_logs');
      return saved ? JSON.parse(saved) : INITIAL_SWIM_LOGS;
    } catch {
      return INITIAL_SWIM_LOGS;
    }
  });

  // Toast Notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Show Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Sync logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gwangalli_swim_logs', JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [logs]);

  // Initialize Firebase Auth listener as requested by Google Workspace Skill
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser) => {
        setUser(authenticatedUser);
      },
      () => {
        setUser(null);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        showToast(`${result.user.displayName || result.user.email}님 환영합니다! Google Drive가 준비되었습니다.`, 'success');
      }
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        showToast(`Google 로그인 오류: ${err.message || '인증에 실패했습니다.'}`, 'error');
      }
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      showToast('로그아웃되었습니다.', 'info');
    } catch (err: any) {
      showToast(`로그아웃 오류: ${err.message}`, 'error');
    }
  };

  // Add Log Handler
  const handleAddLog = (newLogData: Omit<SwimLog, 'id' | 'createdAt'>) => {
    const newLog: SwimLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setLogs((prev) => [newLog, ...prev]);
    showToast('새 바다수영 훈련 일지가 기록되었습니다!', 'success');
  };

  // Delete Log Handler
  const handleDeleteLog = (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('훈련 일지가 삭제되었습니다.', 'info');
  };

  // Restore Logs from Drive
  const handleRestoreLogs = (restoredLogs: SwimLog[]) => {
    setLogs(restoredLogs);
  };

  return (
    <div className="min-h-screen bg-[#070e17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onOpenDriveModal={() => setIsDriveModalOpen(true)}
        waterTemp={marineCondition.waterTemp}
        tideName={marineCondition.tideName}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'marine' && (
          <MarineConditions
            condition={marineCondition}
            onRefresh={() => showToast('광안리 연안 최신 해황 정보를 갱신했습니다.', 'success')}
          />
        )}

        {activeTab === 'courses' && (
          <GwangalliCourseMap
            onNotify={showToast}
            isGoogleAuthenticated={!!user}
            onRequestLogin={handleGoogleLogin}
          />
        )}

        {activeTab === 'triathlon' && <TriathlonTraining />}

        {activeTab === 'logs' && (
          <SwimLogger
            logs={logs}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onBackupToDrive={() => setIsDriveModalOpen(true)}
            isGoogleAuthenticated={!!user}
            onRequestLogin={handleGoogleLogin}
          />
        )}

        {activeTab === 'guide' && <SafetyAndLocalGuide />}
      </main>

      {/* Google Drive Sync & Backup Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        logs={logs}
        onRestoreLogs={handleRestoreLogs}
        isAuthenticated={!!user}
        userEmail={user?.email}
        userName={user?.displayName}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
        onNotify={showToast}
      />

      {/* Toast Notification Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-md max-w-md animate-fadeIn">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
          <p className="text-xs font-medium text-slate-200 leading-snug flex-1">{toast.message}</p>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400">
            광안리 바다수영 & 철인3종 메이트 · 안전한 오픈워터 수영을 응원합니다.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>수영구 광안리해수욕장</span>
            <span>·</span>
            <span>해양경찰 / 119 수상구조대</span>
            <span>·</span>
            <span>Google Drive 연동</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
