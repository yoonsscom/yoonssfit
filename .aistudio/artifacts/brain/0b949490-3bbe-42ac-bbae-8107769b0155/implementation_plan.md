# 광안리 실시간 해양·환경 종합 데이터 연동 및 대시보드 확장 구현 계획

## 1. 개요 및 목표
사용자 피드백에 따라 부산 광안리 해수욕장(좌표 `35.1532, 129.1189`)의 오픈워터 수영 안전에 직결되는 **실시간 해양 상세 지표**와 **환경/대기질 지표**를 Open-Meteo Weather, Marine, Air Quality 무료 실시간 API를 통해 종합 연동합니다.
연동된 데이터는 기존 **해황 요약 카드 아래에 인터랙티브한 '실시간 해양·환경 대시보드'** 영역으로 확장 배치하여 수영자들이 입수 전 바다 상태와 기상 조건을 한눈에 직관적으로 파악할 수 있도록 합니다.

---

## 2. 수집 및 표시할 실시간 데이터 목록

### A. 해양 상세 지표 (Open-Meteo Marine API)
- **너울 파고 (Swell Wave Height)**: 바다 깊은 곳에서 밀려오는 너울의 높이 (m) & 수영 안전 등급 (주의/안전)
- **너울 주기 (Swell Period)**: 너울의 간격 (초, s)
- **풍파고 (Wind Wave Height)**: 바람에 의해 해수면에서 직접 일어나는 찹(Chop) 파고 (m)
- **파향 (Wave Direction)**: 파도가 밀려오는 방위 (도 및 16방위 표기, 화살표 회전 시각화)
- **조석/수온**: 부산 연안 실시간 표층 수온(SST) 및 실시간 수온 적합 슈트 가이드

### B. 기상 및 안전 지표 (Open-Meteo Weather API)
- **기온 및 체감 온도 (Apparent Temperature)**: 바람과 습도가 반영된 수영 직후 체감 기온 (°C)
- **순간 최대 돌풍 (Wind Gusts)**: 안전을 위협하는 순간 최대 돌풍 속도 (m/s) & 돌풍 경고 플래그
- **풍향 및 풍속 (Wind Speed & Direction)**: 10m 고도 실시간 바람 세기 및 나침반 방향
- **강수량 및 강수 확률 (Precipitation)**: 실시간 강수 여부 (mm/h)
- **해면 기압 (Surface Pressure)**: 기압 변화를 통한 날씨 급변 예측 (hPa)
- **일출 및 일몰 시각 (Sunrise & Sunset)**: 여명(새벽 수영, 일출런) 및 일몰 수영 안전 골든타임 가이드

### C. 환경 및 대기질 지표 (Open-Meteo Air Quality API)
- **초미세먼지 (PM2.5)**: 야외 호흡기 안전 지표 (㎍/㎥) 및 좋음/보통/나쁨 등급 배지
- **미세먼지 (PM10)**: 대기 먼지 농도 (㎍/㎥)
- **통합 대기질 지수 (AQI)**: 직관적인 대기 청정도 상태 표시
- **자외선 지수 (UV Index)**: 선크림 및 래시가드/슈트 착용 권장 지표

---

## 3. 구현 세부 계획

### Step 1: 타입 정의 확장 (`src/types/swim.ts`)
- `MarineCondition` 인터페이스에 실시간 해양·환경 필드 추가:
  - `apparentTemp?: number`
  - `windGusts?: number`
  - `swellWaveHeight?: number`
  - `swellWavePeriod?: number`
  - `windWaveHeight?: number`
  - `waveDirection?: number`
  - `waveDirectionText?: string`
  - `surfacePressure?: number`
  - `precipitation?: number`
  - `sunrise?: string`
  - `sunset?: string`
  - `uvIndex?: number`
  - `pm25?: number`
  - `pm10?: number`
  - `aqiLevel?: 'good' | 'moderate' | 'unhealthy' | 'bad'`

### Step 2: 실시간 날씨/해양/대기질 서비스 고도화 (`src/services/weatherService.ts`)
- Open-Meteo 3대 엔드포인트 병렬 비동기 조회 (`Promise.allSettled`로 일부 오류 시에도 resilient하게 동작):
  1. `https://api.open-meteo.com/v1/forecast`: 기온, 체감기온, 풍속, 풍향, 돌풍, 기압, 강수량, UV, 일출/일몰
  2. `https://marine-api.open-meteo.com/v1/marine`: 유의파고, 파주기, 파향, 너울파고, 너울주기, 풍파고
  3. `https://air-quality-api.open-meteo.com/v1/air-quality`: PM2.5, PM10, 유럽 AQI
- 각 수치를 실시간 한국어 라벨 및 오픈워터 수영 적합도 판정 로직과 매핑.

### Step 3: 실시간 대시보드 컴포넌트 UI 구현 (`src/components/MarineConditions.tsx`)
- 기존 4대 기본 지표(수온, 파고, 풍속, 조류) 카드 아래에 **"광안리 실시간 해양·대기 상세 모니터링"** 섹션 추가:
  - **너울 & 풍파 분석 카드**: 너울 파고 vs 찹(바람파) 분리 표시 및 파향 나침반 아이콘.
  - **돌풍 & 체감기온 카드**: 평균 풍속 대비 돌풍(Gusts) 위험도 게이지 및 입수/출수 체감온도.
  - **일출·일몰 & 일조 카드**: 일출/일몰 시간 표시, 아침 일출 수영 & 일몰 타임 알림.
  - **대기질 & 자외선 카드**: PM2.5, PM10 수치 및 자외선(UV) 등급 배지.
  - 실시간 데이터 출처(`Open-Meteo Live API`, 갱신 주기 15분) 및 수동 새로고침 버튼 유지.

### Step 4: 빌드 및 무결성 검증
- `compile_applet`을 실행하여 TypeScript 타입 오류 및 빌드 성공 여부를 최종 확인.

---

## 4. 사용자 피드백 요청
위 계획대로 Open-Meteo Weather, Marine, Air Quality를 통합 연동하여 해황 카드 하단에 종합 실시간 대시보드를 구축하겠습니다. 진행할 수 있도록 [Proceed] 버튼을 눌러주세요.
