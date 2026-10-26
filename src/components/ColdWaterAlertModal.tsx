import React, { useState } from 'react';
import { ColdWaterAlertSettings } from '../types/swim';
import {
  Snowflake,
  Bell,
  Volume2,
  VolumeX,
  ShieldAlert,
  ThermometerSnowflake,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Info
} from 'lucide-react';

interface ColdWaterAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ColdWaterAlertSettings;
  onSaveSettings: (settings: ColdWaterAlertSettings) => void;
  currentWaterTemp: number;
  onTestAlert: () => void;
}

export const ColdWaterAlertModal: React.FC<ColdWaterAlertModalProps> = ({
  isOpen,
  onClose,
  settings: initialSettings,
  onSaveSettings,
  currentWaterTemp,
  onTestAlert,
}) => {
  const [enabled, setEnabled] = useState(initialSettings.enabled);
  const [thresholdTemp, setThresholdTemp] = useState(initialSettings.thresholdTemp);
  const [browserNotification, setBrowserNotification] = useState(initialSettings.browserNotification);
  const [soundAlert, setSoundAlert] = useState(initialSettings.soundAlert);
  const [preventHypothermiaTips, setPreventHypothermiaTips] = useState(initialSettings.preventHypothermiaTips);
  const [permState, setPermState] = useState<string>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );

  if (!isOpen) return null;

  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setPermState(res);
        if (res === 'granted') {
          setBrowserNotification(true);
        } else {
          setBrowserNotification(false);
        }
      } catch (e) {
        console.error('Notification permission error', e);
      }
    }
  };

  const handleSave = () => {
    onSaveSettings({
      enabled,
      thresholdTemp,
      browserNotification,
      soundAlert,
      preventHypothermiaTips,
    });
    onClose();
  };

  const isTriggeredNow = enabled && currentWaterTemp <= thresholdTemp;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-cyan-800/60 rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 sm:pb-4 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
              <Snowflake className="w-5 sm:w-6 h-5 sm:h-6 animate-spin-slow" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white break-keep leading-tight">냉수 주의보 설정</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-cyan-400 text-slate-950 whitespace-nowrap shrink-0">
                  안전 특화
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 break-keep">
                수온 저하 시 저체온증 예방 및 자동 알림 경고 시스템
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Status Box */}
        <div
          className={`mt-4 p-3.5 sm:p-4 rounded-2xl border transition-all ${
            isTriggeredNow
              ? 'bg-cyan-950/90 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800/80 border-slate-700 text-slate-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <ThermometerSnowflake className={`w-5 h-5 shrink-0 ${isTriggeredNow ? 'text-cyan-400 animate-pulse' : 'text-slate-300'}`} />
              <span className="text-xs font-bold text-white whitespace-nowrap">현재 광안리 표층 수온:</span>
              <span className="text-sm font-black text-cyan-300 font-mono">{currentWaterTemp}℃</span>
            </div>
            <span
              className={`text-xs font-black px-2.5 py-0.5 rounded-md shadow-sm whitespace-nowrap self-start sm:self-auto ${
                isTriggeredNow
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-emerald-400 text-slate-950'
              }`}
            >
              {isTriggeredNow ? '❄️ 냉수 경고 조건 도달!' : '✓ 정상 수온 유지 중'}
            </span>
          </div>
          {isTriggeredNow && (
            <p className="text-xs text-cyan-200 mt-2 font-medium break-keep">
              현재 수온({currentWaterTemp}℃)이 설정 기준치({thresholdTemp}℃ 이하)에 해당하여 경고가 활성화되었습니다. 웻슈트 착용 및 저체온증 주의가 필요합니다.
            </p>
          )}
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          {/* Main Enable/Disable Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/90 border border-slate-700">
            <div>
              <span className="text-sm font-bold text-white block">냉수 주의보 모니터링 활성화</span>
              <span className="text-xs text-slate-200 mt-0.5 block">
                수온이 기준치 이하로 떨어지면 브라우저 알림과 화면 경고를 띄웁니다.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          {/* Threshold Slider */}
          <div className={`p-4 rounded-2xl bg-slate-800/80 border border-slate-700 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                경고 기준 수온 (Threshold)
              </label>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-cyan-300 font-mono">{thresholdTemp.toFixed(1)}</span>
                <span className="text-xs text-slate-300 font-bold">℃ 이하</span>
              </div>
            </div>

            <input
              type="range"
              min="14.0"
              max="20.0"
              step="0.5"
              value={thresholdTemp}
              onChange={(e) => setThresholdTemp(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-2.5 bg-slate-700 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-slate-300 mt-1.5 font-medium">
              <span>14.0℃ (수영 취소 기준)</span>
              <span>16.0℃ (슈트 의무)</span>
              <span className="text-cyan-300 font-black">18.0℃ (기본 권장)</span>
              <span>20.0℃</span>
            </div>

            {/* Quick Presets */}
            <div className="mt-3 pt-3 border-t border-slate-700 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-300 font-medium whitespace-nowrap">빠른 기준 설정:</span>
              <button
                type="button"
                onClick={() => setThresholdTemp(18.0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  thresholdTemp === 18.0 ? 'bg-cyan-400 text-slate-950 font-black shadow' : 'bg-slate-700 text-slate-100 hover:text-white hover:bg-slate-600'
                }`}
              >
                18.0℃ (요청 기본값)
              </button>
              <button
                type="button"
                onClick={() => setThresholdTemp(16.0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  thresholdTemp === 16.0 ? 'bg-cyan-400 text-slate-950 font-black shadow' : 'bg-slate-700 text-slate-100 hover:text-white hover:bg-slate-600'
                }`}
              >
                16.0℃ (철인 슈트의무)
              </button>
              <button
                type="button"
                onClick={() => setThresholdTemp(19.0)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  thresholdTemp === 19.0 ? 'bg-cyan-400 text-slate-950 font-black shadow' : 'bg-slate-700 text-slate-100 hover:text-white hover:bg-slate-600'
                }`}
              >
                19.0℃ (안전 마진)
              </button>
            </div>
          </div>

          {/* Alert Delivery Channels */}
          <div className={`space-y-3 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Browser Push Notification */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Bell className="w-4 h-4 text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block break-keep">브라우저 푸시 알림 발송</span>
                  <span className="text-[11px] text-slate-400 block break-keep">
                    다른 탭에 있거나 화면을 보고 있지 않아도 데스크탑/모바일 알림창 표시
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {permState !== 'granted' && (
                  <button
                    type="button"
                    onClick={handleRequestNotification}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white whitespace-nowrap"
                  >
                    권한 허용
                  </button>
                )}
                <input
                  type="checkbox"
                  checked={browserNotification}
                  onChange={(e) => {
                    if (e.target.checked && permState !== 'granted') {
                      handleRequestNotification();
                    } else {
                      setBrowserNotification(e.target.checked);
                    }
                  }}
                  className="rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-500 w-4 h-4"
                />
              </div>
            </div>

            {/* Sound Alert */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <Volume2 className="w-4 h-4 text-teal-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block break-keep">경고 비프 사운드 재생</span>
                  <span className="text-[11px] text-slate-400 block break-keep">
                    냉수 기준 도달 시 청각적 신호음 재생
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={soundAlert}
                onChange={(e) => setSoundAlert(e.target.checked)}
                className="rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-500 w-4 h-4 shrink-0"
              />
            </div>

            {/* Hypothermia Prevention Checklist Tips */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block break-keep">저체온증 예방 체크리스트 가이드 자동 표시</span>
                  <span className="text-[11px] text-slate-400 block break-keep">
                    냉수 주의보 발생 시 입수 전 필수 보온/안전 가이드를 전면에 노출
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={preventHypothermiaTips}
                onChange={(e) => setPreventHypothermiaTips(e.target.checked)}
                className="rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-500 w-4 h-4 shrink-0"
              />
            </div>
          </div>
        </div>

        {/* Footer & Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={onTestAlert}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            경고 알림 테스트 발송
          </button>

          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 whitespace-nowrap"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all whitespace-nowrap"
            >
              설정 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
