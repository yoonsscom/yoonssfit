import { getAccessToken } from './auth';
import { SwimLog, SwimCourse } from '../types/swim';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size?: string;
}

/**
 * Searches for files created by this app in Google Drive
 */
export async function listAppFiles(): Promise<DriveFileItem[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google 로그인이 필요합니다. (토큰 없음)');

  const query = encodeURIComponent("name contains 'gwangalli' and trashed = false");
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,modifiedTime,size)&orderBy=modifiedTime desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Drive 목록 조회 실패 (${res.status})`);
  }

  const data = await res.json();
  return data.files || [];
}

/**
 * Backs up swim logs to Google Drive as a JSON file
 */
export async function backupSwimLogsToDrive(logs: SwimLog[], fileName = 'gwangalli_swim_training_logs.json'): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google 로그인이 필요합니다.');

  const metadata = {
    name: fileName,
    mimeType: 'application/json',
    description: '광안리 바다수영 & 철인3종 훈련 일지 백업 데이터',
  };

  const fileContent = JSON.stringify({
    version: '1.0',
    appName: '광안리 바다수영 & 트라이애슬론 메이트',
    exportDate: new Date().toISOString(),
    totalSessions: logs.length,
    totalDistanceMeters: logs.reduce((acc, cur) => acc + cur.distanceMeters, 0),
    logs,
  }, null, 2);

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    fileContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Google Drive 백업 업로드 실패 (${res.status})`);
  }

  return await res.json();
}

/**
 * Exports a SwimCourse or session as GPX 1.1 format to Google Drive
 */
export async function exportCourseGpxToDrive(course: SwimCourse): Promise<DriveFileItem> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google 로그인이 필요합니다.');

  const fileName = `gwangalli_course_${course.id}.gpx`;
  const gpxContent = generateCourseGpx(course);

  const metadata = {
    name: fileName,
    mimeType: 'application/gpx+xml',
    description: `광안리 바다수영 코스 GPX: ${course.nameKo} (${course.distanceMeters}m)`,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/gpx+xml\r\n\r\n' +
    gpxContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `GPX Google Drive 저장 실패 (${res.status})`);
  }

  return await res.json();
}

/**
 * Downloads and parses backup logs from Google Drive
 */
export async function downloadBackupFromDrive(fileId: string): Promise<SwimLog[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google 로그인이 필요합니다.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Google Drive 파일 다운로드 실패 (${res.status})`);
  }

  const data = await res.json();
  if (data && Array.isArray(data.logs)) {
    return data.logs;
  } else if (Array.isArray(data)) {
    return data;
  }
  throw new Error('올바른 광안리 바다수영 훈련 일지 형식의 JSON 파일이 아닙니다.');
}

/**
 * Deletes a file from Google Drive (Caller must present confirmation dialog first!)
 */
export async function deleteDriveFile(fileId: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) throw new Error('Google 로그인이 필요합니다.');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `파일 삭제 실패 (${res.status})`);
  }

  return true;
}

/**
 * Helper to build GPX 1.1 XML string
 */
export function generateCourseGpx(course: SwimCourse): string {
  // Approximate geo points for Gwangalli beach coordinates
  const lat1 = course.startPoint.lat;
  const lon1 = course.startPoint.lng;
  const lat2 = course.turnPoint.lat;
  const lon2 = course.turnPoint.lng;

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Gwangalli Sea Swim & Triathlon Mate" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(course.nameKo)}</name>
    <desc>${escapeXml(course.description)}</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(course.nameKo)} (${course.distanceMeters}m)</name>
    <type>Open Water Swimming</type>
    <trkseg>
      <trkpt lat="${lat1.toFixed(6)}" lon="${lon1.toFixed(6)}">
        <ele>0.0</ele>
        <time>${new Date().toISOString()}</time>
        <name>${escapeXml(course.startPoint.label)}</name>
      </trkpt>
      <trkpt lat="${((lat1 + lat2) / 2 + 0.001).toFixed(6)}" lon="${((lon1 + lon2) / 2).toFixed(6)}">
        <ele>0.0</ele>
      </trkpt>
      <trkpt lat="${lat2.toFixed(6)}" lon="${lon2.toFixed(6)}">
        <ele>0.0</ele>
        <name>${escapeXml(course.turnPoint.label)}</name>
      </trkpt>
      <trkpt lat="${lat1.toFixed(6)}" lon="${lon1.toFixed(6)}">
        <ele>0.0</ele>
        <name>피니시</name>
      </trkpt>
    </trkseg>
  </trk>
</gpx>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
