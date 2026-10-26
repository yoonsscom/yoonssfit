import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout } from './services/auth';
import { Navbar, ActiveTab } from './components/Navbar';
import { MarineConditions } from './components/MarineConditions';
import { GwangalliCourseMap } from './components/GwangalliCourseMap';
import { TriathlonTraining } from './components/TriathlonTraining';
import { SwimLogger } from './components/SwimLogger';
import { SafetyAndLocalGuide } from './components/SafetyAndLocalGuide';
import { GSRCommunity } from './components/GSRCommunity';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { ColdWaterAlertModal } from './components/ColdWaterAlertModal';
import { ColdWaterWarningBanner } from './components/ColdWaterWarningBanner';
import { playColdWaterWarningSound, sendBrowserNotification } from './utils/alertSound';
import { CURRENT_GWANGALLI_CONDITION, INITIAL_SWIM_LOGS } from './data/gwangalliData';
import { SwimLog, ColdWaterAlertSettings, MarineCondition } from './types/swim';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('marine');
  const [user, setUser] = useState<User | null>(null);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isColdWaterModalOpen, setIsColdWaterModalOpen] = useState(false);
  const [marineCondition, setMarineCondition] = useState<MarineCondition>(CURRENT_GWANGALLI_CONDITION);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Cold Water Alert Settings (Default 18.0°C threshold as requested)
  const [coldWaterSettings, setColdWaterSettings] = useState<ColdWaterAlertSettings>(() => {
    try {
      const saved = localStorage.getItem('gwangalli_cold_water_alert_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      enabled: true,
      thresholdTemp: 18.0,
      browserNotification: true,
      soundAlert: true,
      preventHypothermiaTips: true,
    };
  });

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

  // Sync cold water settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gwangalli_cold_water_alert_settings', JSON.stringify(coldWaterSettings));
    } catch (e) {
      console.warn('Failed to save cold water settings to localStorage', e);
    }
  }, [coldWaterSettings]);

  // Monitor Cold Water Conditions
  const prevTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    const isTriggered =
      coldWaterSettings.enabled && marineCondition.waterTemp <= coldWaterSettings.thresholdTemp;

    // Trigger alert only when transition occurs into cold water state
    if (isTriggered && !prevTriggeredRef.current) {
      setBannerDismissed(false);

      // 1. Play audio chime if enabled
      if (coldWaterSettings.soundAlert) {
        playColdWaterWarningSound();
      }

      // 2. Send native browser notification if enabled
      if (coldWaterSettings.browserNotification) {
        sendBrowserNotification('❄️ [광안리 냉수 주의보 발령]', {
          body: `현재 수온이 ${marineCondition.waterTemp}℃로 기준치(${coldWaterSettings.thresholdTemp}℃ 이하)에 도달했습니다. 웻슈트 착용 및 저체온증에 각별히 유의하세요!`,
        });
      }

      // 3. Show in-app toast
      showToast(
        `❄️ [냉수 주의보] 광안리 수온이 ${marineCondition.waterTemp}℃로 설정 기준치(${coldWaterSettings.thresholdTemp}℃) 이하입니다! 보온 슈트 착용 필수`,
        'error'
      );
    }

    prevTriggeredRef.current = isTriggered;
  }, [marineCondition.waterTemp, coldWaterSettings]);

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

  // Test Alert Handler
  const handleTestAlert = () => {
    playColdWaterWarningSound();
    sendBrowserNotification('❄️ [테스트] 광안리 냉수 주의보 알림', {
      body: `현재 설정된 기준치(${coldWaterSettings.thresholdTemp}℃) 알림 테스트입니다. 소리와 알림이 정상 작동합니다.`,
    });
    showToast(`❄️ [냉수 주의보 테스트] 기준 ${coldWaterSettings.thresholdTemp}℃ 경고 알림 테스트가 발송되었습니다.`, 'info');
  };

  // When user changes season preset or condition in MarineConditions
  const handleConditionChange = (newCondition: MarineCondition) => {
    setMarineCondition(newCondition);
    setBannerDismissed(false);
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
        coldWaterSettings={coldWaterSettings}
        onOpenColdWaterModal={() => setIsColdWaterModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-28 lg:pb-8">
        {/* Prominent Cold Water Warning Banner */}
        {!bannerDismissed && (
          <ColdWaterWarningBanner
            waterTemp={marineCondition.waterTemp}
            settings={coldWaterSettings}
            onOpenSettings={() => setIsColdWaterModalOpen(true)}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {activeTab === 'marine' && (
          <MarineConditions
            condition={marineCondition}
            onRefresh={() => showToast('광안리 연안 최신 해황 정보를 갱신했습니다.', 'success')}
            coldWaterSettings={coldWaterSettings}
            onOpenColdWaterModal={() => setIsColdWaterModalOpen(true)}
            onConditionChange={handleConditionChange}
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

        {activeTab === 'gsr' && <GSRCommunity onNotify={showToast} />}

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

      {/* Cold Water Alert Settings Modal */}
      <ColdWaterAlertModal
        isOpen={isColdWaterModalOpen}
        onClose={() => setIsColdWaterModalOpen(false)}
        settings={coldWaterSettings}
        onSaveSettings={(newSettings) => {
          setColdWaterSettings(newSettings);
          showToast(`냉수 주의보 설정이 저장되었습니다. (기준 수온: ${newSettings.thresholdTemp}℃ 이하)`, 'success');
        }}
        currentWaterTemp={marineCondition.waterTemp}
        onTestAlert={handleTestAlert}
      />

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
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-extrabold text-white">TEAM_GSR</span>
            <span className="text-cyan-400 font-bold">Gwangalli Swimming Running</span>
            <span>· 새벽, 바다와 함께 시작하는 하루</span>
            <a
              href="https://www.instagram.com/team__gsr"
              target="_blank"
              rel="noreferrer"
              className="text-pink-400 hover:underline font-bold"
            >
              @team__gsr
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>광안리해수욕장</span>
            <span>·</span>
            <span>하계 06:00 / 동계 06:30</span>
            <span>·</span>
            <span>Google Drive 백업</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
