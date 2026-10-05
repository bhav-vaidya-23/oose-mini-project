import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import ControlBar from "./components/ControlBar";
import CurrentWeather from "./components/CurrentWeather";
import HeatwavePrediction from "./components/HeatwavePrediction";
import HourlyForecast from "./components/HourlyForecast";
import AIModelInfo from "./components/AIModelInfo";
import WeatherTrend from "./components/WeatherTrend";
import RiskTrend from "./components/RiskTrend";
import HotspotTable from "./components/HotspotTable";
import RiskMap from "./components/RiskMap";
import AlertsPanel from "./components/AlertsPanel";
import SafetyAdvisories from "./components/SafetyAdvisories";
import HistoricalAnalysis from "./components/HistoricalAnalysis";
import WeatherBackground from "./components/WeatherBackground";
import { DISTRICTS, LOCATIONS, fetchDistrictSnapshot, fetchHistoricalAnalysis } from "./data/mockData";
import "./App.css";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function initialTheme() {
  return localStorage.getItem("climate-dashboard-theme") === "dark" ? "dark" : "light";
}

export default function App() {
  const [district, setDistrict] = useState(DISTRICTS[0].name);
  const [date, setDate] = useState(todayISO());
  const [theme, setTheme] = useState(initialTheme);
  const location = LOCATIONS.find((item) => item.name === district) ?? LOCATIONS[0];
  const snapshot = useMemo(() => fetchDistrictSnapshot(district, date), [district, date]);
  const historical = useMemo(() => fetchHistoricalAnalysis(district), [district]);

  useEffect(() => {
    localStorage.setItem("climate-dashboard-theme", theme);
  }, [theme]);

  const forecastItems = useMemo(() => {
    const labels = snapshot.trend.labels;
    const startIndex = Math.max(0, labels.length - 6);
    return labels.slice(startIndex).map((label, idx) => ({
      label,
      temp: snapshot.trend.temperature[startIndex + idx],
      rain: snapshot.trend.rainfall[startIndex + idx],
    }));
  }, [snapshot]);

  return (
    <div className="app" data-theme={theme}>
      <WeatherBackground current={snapshot.current} prediction={snapshot.prediction} />
      <Header
        district={district}
        date={date}
        locationState={location.state}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "dark" ? "light" : "dark")}
      />
      <ControlBar district={district} onDistrictChange={setDistrict} date={date} onDateChange={setDate} />

      <main className="dashboard-shell">
        <section className="hero-grid" id="dashboard">
          <CurrentWeather current={{ ...snapshot.current, locationLabel: `${location.name}, ${location.state}` }} district={district} date={date} />
          <HeatwavePrediction prediction={snapshot.prediction} />
        </section>

        <section className="daily-strip" id="forecast" aria-label="Seven day forecast">
          <div className="daily-strip__title">
            <span>7-day</span>
            <strong>Forecast</strong>
          </div>
          {forecastItems.map(({ label, temp, rain }, idx) => (
            <div className={`daily-item ${idx === forecastItems.length - 1 ? "is-selected" : ""}`} key={`${label}-${temp}`}>
              <span>{label}</span>
              <span className="daily-item__icon">☀</span>
              <strong>{temp}°</strong>
              <small>{rain} mm</small>
            </div>
          ))}
        </section>

        <section className="data-ribbon" aria-label="AI model data inputs">
          <div>
            <span className="live-dot" />
            <strong>Meteorological intelligence</strong>
            <span>Historical + current weather data powering the heatwave forecast</span>
          </div>
          <div className="data-ribbon__params">
            {snapshot.prediction.riskScore >= 70 && <span className="risk-chip">AI risk elevated</span>}
            {['TEMP2M','TMAX','TMIN','DEW2M','RAIN','EVAP','CLOUD','WIND','MSLP'].map((p) => <code key={p}>{p}</code>)}
          </div>
        </section>

        <section className="highlights" aria-labelledby="highlights-title">
          <div className="section-heading">
            <div>
              <p className="section-kicker">At a glance</p>
              <h2 id="highlights-title">Today's highlights</h2>
            </div>
            <span className="section-note">Live conditions for {district}</span>
          </div>
          <div className="highlight-grid">
            <div><span>Feels like</span><strong>{Math.round(snapshot.current.temperature + 2)}°C</strong><small>Heat index</small></div>
            <div><span>Humidity</span><strong>{snapshot.current.humidity}%</strong><small>Relative humidity</small></div>
            <div><span>Wind</span><strong>{snapshot.current.windSpeed} <em>km/h</em></strong><small>Surface wind</small></div>
            <div><span>Pressure</span><strong>{snapshot.current.pressure} <em>hPa</em></strong><small>Mean sea level</small></div>
            <div><span>Rainfall</span><strong>{snapshot.current.rainfall} <em>mm</em></strong><small>Observed</small></div>
            <div className="highlight-grid__risk"><span>AI heatwave risk</span><strong>{snapshot.prediction.riskScore}<em>/100</em></strong><small>{snapshot.prediction.severity} severity</small></div>
          </div>
        </section>

        <HourlyForecast temperature={snapshot.current.temperature} humidity={snapshot.current.humidity} />

        <section className="dashboard-grid-2 trend-section" aria-label="Weather and AI risk trends">
          <WeatherTrend trend={snapshot.trend} />
          <RiskTrend riskTrend={snapshot.riskTrend} />
        </section>

        <HistoricalAnalysis historical={historical} district={district} />

        <section className="intelligence-section" id="heatwave-risk">
          <div className="section-heading intelligence-heading">
            <div>
              <p className="section-kicker">AI intelligence</p>
              <h2>Heatwave risk across Rajasthan</h2>
            </div>
            <span className="section-note">District-level prediction and hotspot detection</span>
          </div>
          <div className="dashboard-grid-2 dashboard-grid-2--wide-left">
            <HotspotTable hotspots={snapshot.hotspots} selectedDistrict={district} />
            <RiskMap hotspots={snapshot.hotspots} selectedDistrict={district} onSelectDistrict={setDistrict} />
          </div>
        </section>

        <section className="dashboard-grid-2 alerts-section" id="alerts">
          <AlertsPanel alerts={snapshot.alerts} />
          <SafetyAdvisories advisories={snapshot.advisories} />
        </section>

        <section className="model-section">
          <AIModelInfo current={snapshot.current} prediction={snapshot.prediction} />
        </section>
      </main>

      <footer className="app-footer">
        <strong>AI Climate Intelligence System</strong> · Heatwave Monitoring, Prediction &amp; Early Warning · Demonstration data
      </footer>
    </div>
  );
}
