import { MarineCondition } from '../types/swim';
import { CURRENT_GWANGALLI_CONDITION } from '../data/gwangalliData';

// Gwangalli Beach exact coordinates
const GWANGALLI_LAT = 35.1532;
const GWANGALLI_LNG = 129.1189;

// Convert degree to Korean wind direction
function getWindDirectionText(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return `북 (N) ${Math.round(normalized)}°`;
  if (normalized >= 22.5 && normalized < 67.5) return `북동 (NE) ${Math.round(normalized)}°`;
  if (normalized >= 67.5 && normalized < 112.5) return `동 (E) ${Math.round(normalized)}°`;
  if (normalized >= 112.5 && normalized < 157.5) return `남동 (SE) ${Math.round(normalized)}°`;
  if (normalized >= 157.5 && normalized < 202.5) return `남 (S) ${Math.round(normalized)}°`;
  if (normalized >= 202.5 && normalized < 247.5) return `남서 (SW) ${Math.round(normalized)}°`;
  if (normalized >= 247.5 && normalized < 292.5) return `서 (W) ${Math.round(normalized)}°`;
  return `북서 (NW) ${Math.round(normalized)}°`;
}

// Estimate Busan coastal water temperature based on month and air temperature
function estimateBusanWaterTemp(month: number, airTemp: number): number {
  // Monthly baseline coastal sea surface temperature (°C) for Busan/Suyeong Bay (NIFS statistics)
  const monthlyBaseline = [
    12.2, // Jan
    11.8, // Feb
    12.9, // Mar
    14.8, // Apr
    17.2, // May
    20.1, // Jun
    23.4, // Jul
    25.8, // Aug
    24.2, // Sep
    20.4, // Oct
    17.6, // Nov
    14.1  // Dec
  ];

  const base = monthlyBaseline[month] ?? 19.0;
  // Water temp has thermal inertia; air temp deviations influence it modestly (~15%)
  const estimated = base + (airTemp - 20) * 0.12;
  return Math.round(estimated * 10) / 10;
}

// Compute suit recommendation based on water temperature
function getSuitRecommendation(waterTemp: number): string {
  if (waterTemp < 14) {
    return '5mm 동계용 풀 웻슈트 + 네오프렌 후드/글러브 필수 (저체온증 고위험 수온)';
  }
  if (waterTemp < 17) {
    return '3~4mm 풀 웻슈트 + 네오프렌 캡 착용 권장 (18℃ 미만 저수온 경보 구간)';
  }
  if (waterTemp < 20) {
    return '3mm 오픈워터 웻슈트 추천 (체온 유지 및 부력 최적화)';
  }
  if (waterTemp < 24) {
    return '롱존 또는 2~3mm 스프링 슈트 (쾌적한 오픈워터 트레이닝)';
  }
  return '스킨슈트 또는 실내외 겸용 수영복 (자유로운 영법 가능)';
}

// Compute open water safety score & level
function computeSafetyAssessment(
  waterTemp: number,
  waveHeight: number,
  windSpeed: number
): { score: number; level: MarineCondition['safetyLevel'] } {
  let score = 100;

  // Wave penalty
  if (waveHeight > 1.2) score -= 35;
  else if (waveHeight > 0.8) score -= 20;
  else if (waveHeight > 0.5) score -= 10;

  // Wind penalty
  if (windSpeed > 8.0) score -= 30;
  else if (windSpeed > 5.5) score -= 15;
  else if (windSpeed > 3.5) score -= 5;

  // Cold water penalty
  if (waterTemp < 14) score -= 25;
  else if (waterTemp < 17) score -= 15;
  else if (waterTemp < 18) score -= 5;

  score = Math.max(30, Math.min(98, score));

  let level: MarineCondition['safetyLevel'] = '최적 (Optimal)';
  if (score < 55) level = '입수 자제 (Restricted)';
  else if (score < 75) level = '주의 (Caution)';
  else if (score < 88) level = '양호 (Good)';

  return { score, level };
}

function getCompassDirection(deg: number): string {
  const normalized = (deg % 360 + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return `북 (N) ${Math.round(normalized)}°`;
  if (normalized >= 22.5 && normalized < 67.5) return `북동 (NE) ${Math.round(normalized)}°`;
  if (normalized >= 67.5 && normalized < 112.5) return `동 (E) ${Math.round(normalized)}°`;
  if (normalized >= 112.5 && normalized < 157.5) return `남동 (SE) ${Math.round(normalized)}°`;
  if (normalized >= 157.5 && normalized < 202.5) return `남 (S) ${Math.round(normalized)}°`;
  if (normalized >= 202.5 && normalized < 247.5) return `남서 (SW) ${Math.round(normalized)}°`;
  if (normalized >= 247.5 && normalized < 292.5) return `서 (W) ${Math.round(normalized)}°`;
  return `북서 (NW) ${Math.round(normalized)}°`;
}

function getAqiStatus(pm25?: number, pm10?: number): '좋음' | '보통' | '나쁨' | '매우나쁨' {
  if (pm25 !== undefined) {
    if (pm25 <= 15) return '좋음';
    if (pm25 <= 35) return '보통';
    if (pm25 <= 75) return '나쁨';
    return '매우나쁨';
  }
  if (pm10 !== undefined) {
    if (pm10 <= 30) return '좋음';
    if (pm10 <= 80) return '보통';
    if (pm10 <= 150) return '나쁨';
    return '매우나쁨';
  }
  return '좋음';
}

/**
 * Fetch real-time weather, marine, and air quality conditions for Gwangalli Beach from Open-Meteo APIs
 */
export async function fetchLiveGwangalliMarineCondition(): Promise<MarineCondition> {
  const now = new Date();
  const currentMonth = now.getMonth(); // 0 to 11
  const timestampStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

  try {
    // 1. Fetch current weather & daily sunrise/sunset from Open-Meteo Weather API
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${GWANGALLI_LAT}&longitude=${GWANGALLI_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,uv_index&daily=sunrise,sunset&wind_speed_unit=ms&timezone=Asia%2FSeoul`;

    // 2. Fetch marine conditions (wave height, wave period, swell, wind wave)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${GWANGALLI_LAT}&longitude=${GWANGALLI_LNG}&current=wave_height,wave_direction,wave_period,wind_wave_height,wind_wave_direction,wind_wave_period,swell_wave_height,swell_wave_direction,swell_wave_period&timezone=Asia%2FSeoul`;

    // 3. Fetch air quality (PM2.5, PM10, European AQI)
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${GWANGALLI_LAT}&longitude=${GWANGALLI_LNG}&current=pm10,pm2_5,european_aqi&timezone=Asia%2FSeoul`;

    const [weatherRes, marineRes, airRes] = await Promise.allSettled([
      fetch(weatherUrl),
      fetch(marineUrl),
      fetch(airQualityUrl)
    ]);

    let airTemp = CURRENT_GWANGALLI_CONDITION.airTemp;
    let apparentTemp = airTemp;
    let relativeHumidity = 65;
    let windSpeed = CURRENT_GWANGALLI_CONDITION.windSpeed;
    let windGusts = windSpeed * 1.35;
    let windDirDeg = 135;
    let surfacePressure = 1013;
    let precipitation = 0;
    let uvIndex = 3.5;
    let sunrise = '06:45';
    let sunset = '17:35';

    let waveHeight = CURRENT_GWANGALLI_CONDITION.waveHeight;
    let wavePeriod = CURRENT_GWANGALLI_CONDITION.wavePeriod;
    let waveDirection = 130;
    let swellWaveHeight = 0.3;
    let swellWavePeriod = 6.5;
    let swellWaveDirection = 130;
    let windWaveHeight = 0.2;
    let windWavePeriod = 4.0;

    let pm25 = 12;
    let pm10 = 24;
    let aqiScore = 25;

    // Process Weather API Response
    if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
      const weatherData = await weatherRes.value.json();
      if (weatherData?.current) {
        const c = weatherData.current;
        if (typeof c.temperature_2m === 'number') airTemp = Math.round(c.temperature_2m * 10) / 10;
        if (typeof c.apparent_temperature === 'number') apparentTemp = Math.round(c.apparent_temperature * 10) / 10;
        if (typeof c.relative_humidity_2m === 'number') relativeHumidity = Math.round(c.relative_humidity_2m);
        if (typeof c.wind_speed_10m === 'number') windSpeed = Math.round(c.wind_speed_10m * 10) / 10;
        if (typeof c.wind_gusts_10m === 'number') windGusts = Math.round(c.wind_gusts_10m * 10) / 10;
        if (typeof c.wind_direction_10m === 'number') windDirDeg = c.wind_direction_10m;
        if (typeof c.surface_pressure === 'number') surfacePressure = Math.round(c.surface_pressure);
        if (typeof c.precipitation === 'number') precipitation = Math.round(c.precipitation * 10) / 10;
        if (typeof c.uv_index === 'number') uvIndex = Math.round(c.uv_index * 10) / 10;
      }
      if (weatherData?.daily) {
        if (Array.isArray(weatherData.daily.sunrise) && weatherData.daily.sunrise[0]) {
          const raw = weatherData.daily.sunrise[0];
          sunrise = raw.includes('T') ? raw.split('T')[1].substring(0, 5) : raw;
        }
        if (Array.isArray(weatherData.daily.sunset) && weatherData.daily.sunset[0]) {
          const raw = weatherData.daily.sunset[0];
          sunset = raw.includes('T') ? raw.split('T')[1].substring(0, 5) : raw;
        }
      }
    }

    // Process Marine API Response
    if (marineRes.status === 'fulfilled' && marineRes.value.ok) {
      const marineData = await marineRes.value.json();
      if (marineData?.current) {
        const m = marineData.current;
        if (typeof m.wave_height === 'number') waveHeight = Math.round(m.wave_height * 10) / 10;
        if (typeof m.wave_period === 'number') wavePeriod = Math.round(m.wave_period * 10) / 10;
        if (typeof m.wave_direction === 'number') waveDirection = Math.round(m.wave_direction);
        if (typeof m.swell_wave_height === 'number') swellWaveHeight = Math.round(m.swell_wave_height * 10) / 10;
        if (typeof m.swell_wave_period === 'number') swellWavePeriod = Math.round(m.swell_wave_period * 10) / 10;
        if (typeof m.swell_wave_direction === 'number') swellWaveDirection = Math.round(m.swell_wave_direction);
        if (typeof m.wind_wave_height === 'number') windWaveHeight = Math.round(m.wind_wave_height * 10) / 10;
        if (typeof m.wind_wave_period === 'number') windWavePeriod = Math.round(m.wind_wave_period * 10) / 10;
      }
    }

    // Process Air Quality Response
    if (airRes.status === 'fulfilled' && airRes.value.ok) {
      const airData = await airRes.value.json();
      if (airData?.current) {
        const a = airData.current;
        if (typeof a.pm2_5 === 'number') pm25 = Math.round(a.pm2_5);
        if (typeof a.pm10 === 'number') pm10 = Math.round(a.pm10);
        if (typeof a.european_aqi === 'number') aqiScore = Math.round(a.european_aqi);
      }
    }

    // Determine water temperature and assessments
    const waterTemp = estimateBusanWaterTemp(currentMonth, airTemp);
    const windDirection = getWindDirectionText(windDirDeg);
    const waveDirectionText = getCompassDirection(waveDirection);
    const { score: safetyScore, level: safetyLevel } = computeSafetyAssessment(waterTemp, waveHeight, windSpeed);
    const suitRecommendation = getSuitRecommendation(waterTemp);
    const aqiStatus = getAqiStatus(pm25, pm10);

    return {
      ...CURRENT_GWANGALLI_CONDITION,
      timestamp: timestampStr,
      airTemp,
      apparentTemp,
      waterTemp,
      waveHeight,
      wavePeriod,
      waveDirection,
      waveDirectionText,
      swellWaveHeight,
      swellWavePeriod,
      swellWaveDirection,
      windWaveHeight,
      windWavePeriod,
      windSpeed,
      windGusts,
      windDirDeg,
      windDirection,
      surfacePressure,
      relativeHumidity,
      precipitation,
      sunrise,
      sunset,
      uvIndex,
      pm25,
      pm10,
      aqiScore,
      aqiStatus,
      safetyScore,
      safetyLevel,
      suitRecommendation,
      source: 'Open-Meteo 종합 실시간 관측 (기상·해양·대기질)',
      isLive: true,
      lastUpdated: timestampStr
    };
  } catch (error) {
    console.warn('Failed to fetch live Gwangalli marine data, using baseline fallback:', error);
    return {
      ...CURRENT_GWANGALLI_CONDITION,
      timestamp: timestampStr,
      source: '기본 관측 통계 (네트워크 연결 확인)',
      isLive: false,
      lastUpdated: timestampStr
    };
  }
}
