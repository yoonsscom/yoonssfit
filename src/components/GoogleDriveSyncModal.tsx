import React, { useState, useEffect } from 'react';
import { SwimLog } from '../types/swim';
import {
  listAppFiles,
  backupSwimLogsToDrive,
  downloadBackupFromDrive,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDrive';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  Cloud,
  CloudUpload,
  CloudDownload,
  Trash2,
  X,
  FileText,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  FolderArchive,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SwimLog[];
  onRestoreLogs: (restoredLogs: SwimLog[]) => void;
  isAuthenticated: boolean;
  userEmail?: string | null;
  userName?: string | null;
  onLogin: () => void;
  onLogout: () => void;
  onNotify: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  logs,
  onRestoreLogs,
  isAuthenticated,
  userEmail,
  userName,
  onLogin,
  onLogout,
  onNotify,
}) => {
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoringId, setIsRestoringId] = useState<string | null>(null);

  // Destructive Action Confirmation Modal state (Mandatory Workspace Integration Rule)
  const [pendingDeleteFile, setPendingDeleteFile] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load files when modal opens and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadDriveFiles();
    }
  }, [isOpen, isAuthenticated]);

  const loadDriveFiles = async () => {
    try {
      setIsLoading(true);
      const files = await listAppFiles();
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Error fetching drive files:', err);
      onNotify(`Google Drive 파일 목록 조회 실패: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackupNow = async () => {
    if (logs.length === 0) {
      onNotify('백업할 수영 훈련 일지가 없습니다.', 'info');
      return;
    }

    try {
      setIsBackingUp(true);
      const fileName = `gwangalli_swim_backup_${new Date().toISOString().slice(0, 10)}.json`;
      const uploadedFile = await backupSwimLogsToDrive(logs, fileName);
      onNotify(`Google Drive에 '${uploadedFile.name}' 백업이 완료되었습니다!`, 'success');
      await loadDriveFiles();
    } catch (err: any) {
      console.error('Backup error:', err);
      onNotify(`백업 실패: ${err.message}`, 'error');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (file: DriveFileItem) => {
    try {
      setIsRestoringId(file.id);
      const restored = await downloadBackupFromDrive(file.id);
      onRestoreLogs(restored);
      onNotify(`Google Drive 백업 파일에서 ${restored.length}개의 훈련 일지를 성공적으로 복원했습니다!`, 'success');
      onClose();
    } catch (err: any) {
      console.error('Restore error:', err);
      onNotify(`복원 실패: ${err.message}`, 'error');
    } finally {
      setIsRestoringId(null);
    }
  };

  // Trigger confirmation dialog for deletion
  const requestDeleteFile = (file: DriveFileItem) => {
    setPendingDeleteFile(file);
  };

  // Perform confirmed deletion
  const confirmDeleteFile = async () => {
    if (!pendingDeleteFile) return;

    try {
      setIsDeleting(true);
      await deleteDriveFile(pendingDeleteFile.id);
      onNotify(`Google Drive에서 '${pendingDeleteFile.name}' 파일이 삭제되었습니다.`, 'success');
      setPendingDeleteFile(null);
      await loadDriveFiles();
    } catch (err: any) {
      console.error('Delete error:', err);
      onNotify(`파일 삭제 실패: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Google Drive 클라우드 백업 & 동기화</h3>
              <p className="text-xs text-slate-400">광안리 바다수영 훈련 일지 및 GPX 코스 영구 보관</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="py-4 space-y-5 flex-1 overflow-y-auto">
          {/* User Auth Status Banner */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold flex items-center justify-center text-sm">
                  {userName ? userName.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{userName || 'Google 계정'}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                      연동 활성화
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{userEmail}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Google 계정 로그인이 필요합니다
                </span>
                <p className="text-xs text-slate-400">
                  Google Drive에 훈련 일지를 백업하고 언제 어디서나 복원할 수 있습니다.
                </p>
              </div>
            )}

            <div>
              {isAuthenticated ? (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-slate-700 transition-colors"
                >
                  연동 로그아웃
                </button>
              ) : (
                <GoogleSignInButton onClick={onLogin} label="Google 계정으로 로그인" />
              )}
            </div>
          </div>

          {/* Quick Actions (if authenticated) */}
          {isAuthenticated && (
            <div className="flex flex-wrap items-center justify-between gap-3 bg-blue-950/30 border border-blue-900/50 p-4 rounded-2xl">
              <div>
                <span className="text-xs font-bold text-white block">현재 로컬 일지 데이터: {logs.length}건</span>
                <span className="text-[11px] text-slate-400">
                  원클릭으로 최신 수영 훈련 데이터를 Google Drive에 안전하게 저장합니다.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadDriveFiles}
                  disabled={isLoading}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                  title="목록 새로고침"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                </button>
                <button
                  onClick={handleBackupNow}
                  disabled={isBackingUp || logs.length === 0}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  <CloudUpload className={`w-4 h-4 ${isBackingUp ? 'animate-bounce' : ''}`} />
                  {isBackingUp ? '백업 생성 중...' : '지금 전체 일지 백업'}
                </button>
              </div>
            </div>
          )}

          {/* Stored Google Drive Files List */}
          {isAuthenticated && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderArchive className="w-4 h-4 text-cyan-400" />
                  Google Drive에 보관된 백업 & GPX 파일 ({driveFiles.length})
                </h4>
              </div>

              {isLoading ? (
                <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  Google Drive 파일 목록을 불러오는 중...
                </div>
              ) : driveFiles.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-800/30 rounded-2xl border border-slate-800">
                  <p className="text-xs">Google Drive에 저장된 광안리 바다수영 백업 파일이 없습니다.</p>
                  <p className="text-[11px] text-slate-500 mt-1">상단의 '지금 전체 일지 백업' 버튼을 클릭해 첫 백업을 만드세요.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {driveFiles.map((file) => {
                    const isJson = file.name.endsWith('.json');
                    const isGpx = file.name.endsWith('.gpx');

                    return (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                              isJson ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-white block truncate">{file.name}</span>
                            <span className="text-[10px] text-slate-400">
                              수정일: {new Date(file.modifiedTime).toLocaleString('ko-KR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isJson && (
                            <button
                              onClick={() => handleRestore(file)}
                              disabled={isRestoringId === file.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
                              title="이 백업으로 앱의 훈련 일지 복원"
                            >
                              <CloudDownload className="w-3.5 h-3.5" />
                              {isRestoringId === file.id ? '복원 중...' : '복원하기'}
                            </button>
                          )}
                          <button
                            onClick={() => requestDeleteFile(file)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                            title="Drive에서 파일 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>* Google Workspace Drive API 규정에 따라 본 앱이 생성한 전용 파일만 접근합니다.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Workspace Skill Mandatory Confirmation Dialog for Deleting User Files */}
      {pendingDeleteFile && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-rose-900/60 rounded-3xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white">Google Drive 파일 삭제 확인</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              정말로 Google Drive에서 <strong className="text-rose-300">'{pendingDeleteFile.name}'</strong> 파일을 영구 삭제하시겠습니까?
            </p>
            <p className="text-[11px] text-rose-400/80 mt-1">
              이 작업은 되돌릴 수 없으며 드라이브 휴지통 또는 영구 제거됩니다.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setPendingDeleteFile(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                취소 (유지하기)
              </button>
              <button
                onClick={confirmDeleteFile}
                disabled={isDeleting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 disabled:opacity-50"
              >
                {isDeleting ? '삭제 중...' : '확인, 영구 삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
