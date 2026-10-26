import React from 'react';
import { Snowflake, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { ColdWaterAlertSettings } from '../types/swim';

interface ColdWaterWarningBannerProps {
  waterTemp: number;
  settings: ColdWaterAlertSettings;
  onOpenSettings: () => void;
  onDismiss?: () => void;
}

export const ColdWaterWarningBanner: React.FC<ColdWaterWarningBannerProps> = ({
  waterTemp,
  settings,
  onOpenSettings,
  onDismiss,
}) => {
  if (!settings.enabled || waterTemp > settings.thresholdTemp) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950 via-cyan-950 to-slate-900 border-2 border-cyan-500/80 p-4 md:p-5 shadow-2xl shadow-cyan-950/50 mb-6 animate-pulse-border">
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
            <Snowflake className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-black bg-rose-500 text-white animate-pulse">
                주의보 발령
              </span>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                광안리 해역 저수온 '냉수 주의보'
                <span className="text-cyan-300 font-mono text-sm">
                  ({waterTemp}℃ ≤ 기준 {settings.thresholdTemp}℃)
                </span>
              </h3>
            </div>
            <p className="text-xs text-cyan-100 mt-1 max-w-2xl leading-relaxed">
              현재 광안리 수온이 설정하신 안전 기준치(<strong className="text-white">{settings.thresholdTemp}℃</strong>) 이하입니다.
              초기 입수 시 찬물 반응(Cold Shock) 및 체온 급락 위험이 높으므로 보온 장비를 반드시 착용하세요.
            </p>

            {settings.preventHypothermiaTips && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-cyan-200">
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>3~5mm 전신 웻슈트 & 수모 필수</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>입수 전 충분한 체온 상승 체조</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>수영 시간 30분 이내 권장</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenSettings}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md active:scale-95 transition-all"
          >
            기준 수온 변경 / 알림 설정
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 transition-colors"
              title="알림 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
