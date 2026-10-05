// Mock data layer for the AI Climate Intelligence System.
//
// Every value here is synthetic, generated deterministically from the
// selected district + date so the UI feels stable while still reacting to
// user input. Replace `fetchDistrictSnapshot` with a real API/ML backend
// call later — it is the single integration point the rest of the app
// depends on, and its return shape is documented just above the function.

export const DISTRICTS = [
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, baseTemp: 41.5 },
  { name: "Jodhpur", lat: 26.2389, lng: 73.0243, baseTemp: 43.0 },
  { name: "Kota", lat: 25.2138, lng: 75.8648, baseTemp: 42.0 },
  { name: "Udaipur", lat: 24.5854, lng: 73.7125, baseTemp: 38.5 },
  { name: "Ajmer", lat: 26.4499, lng: 74.6399, baseTemp: 40.0 },
  { name: "Bikaner", lat: 28.0229, lng: 73.3119, baseTemp: 44.0 },
  { name: "Barmer", lat: 25.7521, lng: 71.3967, baseTemp: 45.0 },
  { name: "Jaisalmer", lat: 26.9157, lng: 70.9083, baseTemp: 45.5 },
  { name: "Alwar", lat: 27.5530, lng: 76.6346, baseTemp: 40.5 },
  { name: "Bharatpur", lat: 27.2152, lng: 77.4895, baseTemp: 39.5 },
];

export const LOCATIONS = [
  ...DISTRICTS.map((district) => ({ ...district, state: "Rajasthan" })),
  { name: "Mumbai", lat: 19.076, lng: 72.8777, baseTemp: 27, state: "Maharashtra" },
  { name: "Delhi", lat: 28.6139, lng: 77.209, baseTemp: 38, state: "Delhi" },
];

// Fixed demo observations for demonstrating each weather video. Replace this
// map with API observations and model predictions when those integrations exist.
export const DEMO_WEATHER = {
  Jaipur: {
    condition: "Sunny",
    temperature: 44.3,
    humidity: 53,
    windSpeed: 22,
    rainfall: 0,
    pressure: 1003,
    cloudCover: 4,
    riskScore: 75,
    predictedMax: 47.5,
  },
  Mumbai: {
    condition: "Rain",
    temperature: 27,
    humidity: 84,
    windSpeed: 18,
    rainfall: 7.2,
    pressure: 1008,
    cloudCover: 88,
    riskScore: 18,
  },
  Delhi: {
    condition: "Sunny",
    temperature: 38,
    humidity: 35,
    windSpeed: 12,
    rainfall: 0,
    pressure: 1006,
    cloudCover: 12,
    riskScore: 52,
  },
  Udaipur: {
    condition: "Cloudy",
    temperature: 30,
    humidity: 62,
    windSpeed: 9,
    rainfall: 0,
    pressure: 1009,
    cloudCover: 82,
    riskScore: 32,
  },
};

const RISK_LEVELS = [
  { label: "No Heatwave", max: 20, tone: "safe" },
  { label: "Low Risk", max: 40, tone: "low" },
  { label: "Moderate Risk", max: 60, tone: "moderate" },
  { label: "High Risk", max: 85, tone: "high" },
  { label: "Extreme Risk", max: 101, tone: "extreme" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function riskLevelFor(score) {
  return RISK_LEVELS.find((l) => score < l.max) ?? RISK_LEVELS[RISK_LEVELS.length - 1];
}

// Small deterministic hash -> [0,1), so the same district+date always
// produces the same numbers (stand-in for a real model's reproducibility).
function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function dayLabel(offsetFromToday) {
  const d = new Date();
  d.setDate(d.getDate() + offsetFromToday);
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" });
}

/**
 * Builds a full snapshot for one district on one date.
 *
 * Shape (this is the contract a real backend should fulfil):
 * {
 *   current: { temperature, humidity, windSpeed, rainfall, pressure, cloudCover },
 *   prediction: { status, riskScore, severity, predictedMax, horizon, tone },
 *   trend: { labels[7], temperature[7], humidity[7], rainfall[7] },
 *   riskTrend: { labels[7], risk[7] },
 *   hotspots: [{ district, risk, severity }],
 *   alerts: [{ level, message, issuedFor }],
 *   advisories: [string],
 * }
 */
export function fetchDistrictSnapshot(districtName, dateStr) {
  const district = LOCATIONS.find((d) => d.name === districtName) ?? LOCATIONS[0];
  const demo = DEMO_WEATHER[districtName];
  const rand = seededRandom(`${district.name}-${dateStr}`);

  const temperature = demo?.temperature ?? +(district.baseTemp + (rand() - 0.3) * 4).toFixed(1);
  const humidity = demo?.humidity ?? Math.round(20 + rand() * 35);
  const windSpeed = demo?.windSpeed ?? Math.round(6 + rand() * 20);
  const rainfall = demo?.rainfall ?? +(rand() < 0.75 ? rand() * 3 : rand() * 12).toFixed(1);
  const pressure = demo?.pressure ?? Math.round(998 + rand() * 14);
  const cloudCover = demo?.cloudCover ?? Math.round(rand() * 55);

  // Risk score leans on how far temperature sits above a 38°C comfort line.
  const heatPressure = Math.max(0, temperature - 36) * 9;
  const riskScore = demo?.riskScore ?? Math.min(97, Math.round(heatPressure + rand() * 18));
  const level = riskLevelFor(riskScore);
  const predictedMax = demo?.predictedMax ?? +(temperature + 1 + rand() * 2.5).toFixed(1);

  const trendLabels = Array.from({ length: 7 }, (_, i) => dayLabel(i - 6));
  const temperatureTrend = trendLabels.map((_, i) =>
    +(temperature - (6 - i) * (0.6 + rand() * 0.5)).toFixed(1)
  );
  const humidityTrend = trendLabels.map(() => Math.round(15 + rand() * 45));
  const rainfallTrend = trendLabels.map(() => +(rand() < 0.7 ? rand() * 2.5 : rand() * 9).toFixed(1));

  const riskTrend = trendLabels.map((_, i) =>
    Math.max(5, Math.min(97, Math.round(riskScore - (6 - i) * (6 + rand() * 4))))
  );

  const hotspots = [...DISTRICTS]
    .map((d) => {
      const r = seededRandom(`${d.name}-${dateStr}-hotspot`);
      const t = +(d.baseTemp + (r() - 0.3) * 3).toFixed(1);
      const score = Math.min(97, Math.round(Math.max(0, t - 36) * 9 + r() * 15));
      return { district: d.name, risk: score, severity: riskLevelFor(score).label };
    })
    .sort((a, b) => b.risk - a.risk);

  const alerts = [];
  if (level.tone === "high" || level.tone === "extreme") {
    alerts.push({
      level: level.tone === "extreme" ? "Extreme" : "High",
      message: `${level.label} issued for ${district.name}: maximum temperature likely to reach ${predictedMax}°C within ${24}–48 hours.`,
      issuedFor: district.name,
    });
  }
  hotspots.slice(0, 3).forEach((h) => {
    if (h.district !== district.name && (h.severity === "High Risk" || h.severity === "Extreme Risk")) {
      alerts.push({
        level: h.severity === "Extreme Risk" ? "Extreme" : "High",
        message: `${h.severity} active in ${h.district} — risk score ${h.risk}%.`,
        issuedFor: h.district,
      });
    }
  });

  const advisories = [
    "Avoid outdoor work between 12:00 PM and 4:00 PM.",
    "Drink water regularly even without feeling thirsty.",
    "Keep ORS and essential medicines accessible in high-risk areas.",
    "Check on elderly residents, children, and outdoor workers twice daily.",
    "Wear light-coloured, loose cotton clothing when outdoors.",
  ];

  return {
    district: district.name,
    coords: { lat: district.lat, lng: district.lng },
    current: {
      temperature,
      humidity,
      windSpeed,
      rainfall,
      pressure,
      cloudCover,
      ...(demo && { weatherCondition: demo.condition }),
    },
    prediction: {
      status: level.label,
      tone: level.tone,
      riskScore,
      severity: level.tone === "extreme" ? "Extreme" : level.tone === "high" ? "High" : level.tone === "moderate" ? "Moderate" : "Low",
      predictedMax,
      horizon: "Next 24 Hours",
    },
    trend: {
      labels: trendLabels,
      temperature: temperatureTrend,
      humidity: humidityTrend,
      rainfall: rainfallTrend,
    },
    riskTrend: { labels: trendLabels, risk: riskTrend },
    hotspots,
    alerts,
    advisories,
  };
}

export const MODEL_PARAMETERS = [
  { code: "TEMP2M", label: "Temperature at 2m" },
  { code: "TMAX", label: "Maximum temperature" },
  { code: "TMIN", label: "Minimum temperature" },
  { code: "DEW2M", label: "Dew point at 2m" },
  { code: "RAIN", label: "Precipitation" },
  { code: "EVAP", label: "Evaporation" },
  { code: "CLOUD", label: "Cloud cover" },
  { code: "WIND", label: "Wind speed" },
  { code: "MSLP", label: "Mean sea-level pressure" },
];

// Historical analysis dataset for the dashboard. The current UI uses a
// deterministic demonstration series so it can be replaced later by the
// Rajasthan_Heatwave_2006_2025.csv / historical API without changing the UI.
export function fetchHistoricalAnalysis(districtName) {
  const district = LOCATIONS.find((d) => d.name === districtName) ?? LOCATIONS[0];
  const rand = seededRandom(`historical-${district.name}`);
  const years = Array.from({ length: 20 }, (_, i) => 2006 + i);
  const base = district.baseTemp - 2.4;
  const annual = years.map((year, i) => {
    const warming = i * 0.075;
    const variability = (rand() - 0.5) * 1.6;
    const avgTemperature = +(base + warming + variability).toFixed(1);
    const avgRainfall = Math.round(280 + rand() * 220 + (district.name === "Jaisalmer" ? -90 : 0));
    const heatwaveDays = Math.max(2, Math.round((avgTemperature - 37) * 3.5 + rand() * 8));
    return { year, temperature: avgTemperature, rainfall: avgRainfall, heatwaveDays };
  });

  const monthBase = [18, 21, 26, 31, 35, 36, 33, 32, 31, 28, 23, 19];
  const monthly = monthBase.map((value, i) => ({
    month: MONTHS[i],
    temperature: +(value + (district.baseTemp - 41.5) * 0.55 + (rand() - 0.5) * 1.4).toFixed(1),
  }));

  const avgTemperature = +(annual.reduce((sum, row) => sum + row.temperature, 0) / annual.length).toFixed(1);
  const avgRainfall = Math.round(annual.reduce((sum, row) => sum + row.rainfall, 0) / annual.length);
  const temperatureRise = +(annual[annual.length - 1].temperature - annual[0].temperature).toFixed(1);
  const peak = [...annual].sort((a, b) => b.heatwaveDays - a.heatwaveDays)[0];
  const topYears = [...annual].sort((a, b) => b.heatwaveDays - a.heatwaveDays).slice(0, 5);

  return {
    annual,
    monthly,
    warmestMonthIndex: monthly.reduce((best, row, i, arr) => row.temperature > arr[best].temperature ? i : best, 0),
    coolestMonthIndex: monthly.reduce((best, row, i, arr) => row.temperature < arr[best].temperature ? i : best, 0),
    topYears,
    summary: {
      avgTemperature,
      avgRainfall,
      temperatureRise,
      peakYear: peak.year,
      peakHeatwaveDays: peak.heatwaveDays,
    },
  };
}
