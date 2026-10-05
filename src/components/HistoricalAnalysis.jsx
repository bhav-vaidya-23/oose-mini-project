import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CalendarRange, TrendingUp, ThermometerSun, CloudRain, Flame } from "lucide-react";
import "./HistoricalAnalysis.css";

const METRICS = [
  { key: "temperature", label: "Avg. Temperature", unit: "°C" },
  { key: "rainfall", label: "Rainfall", unit: "mm" },
  { key: "heatwaveDays", label: "Heatwave Days", unit: "days" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function HistoricTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="historic-tooltip">
      <strong>{label}</strong>
      <span>{payload[0].value}{unit}</span>
    </div>
  );
}

export default function HistoricalAnalysis({ historical, district }) {
  const [metric, setMetric] = useState("temperature");
  const [period, setPeriod] = useState("20y");
  const activeMetric = METRICS.find((item) => item.key === metric);

  const annual = useMemo(() => {
    const count = period === "10y" ? 10 : 20;
    return historical.annual.slice(-count);
  }, [historical, period]);

  const latest = historical.summary;

  return (
    <section className="historical-section" id="historical">
      <div className="historical-heading">
        <div>
          <p className="section-kicker">Historical climate intelligence</p>
          <h2>Historic Weather Analysis</h2>
          <p className="historical-subtitle">
            Long-term weather patterns and heatwave history for {district}, supporting trend analysis and AI risk assessment.
          </p>
        </div>
        <div className="historical-controls">
          <div className="history-period" role="group" aria-label="Historical period">
            <CalendarRange size={15} />
            <button className={period === "10y" ? "is-active" : ""} onClick={() => setPeriod("10y")} type="button">2016–2025</button>
            <button className={period === "20y" ? "is-active" : ""} onClick={() => setPeriod("20y")} type="button">2006–2025</button>
          </div>
        </div>
      </div>

      <div className="historical-summary">
        <div className="history-stat">
          <div className="history-stat__icon"><ThermometerSun size={18} /></div>
          <div><span>Long-term average</span><strong>{latest.avgTemperature}°C</strong><small>Annual mean temperature</small></div>
        </div>
        <div className="history-stat">
          <div className="history-stat__icon"><TrendingUp size={18} /></div>
          <div><span>Temperature trend</span><strong>+{latest.temperatureRise}°C</strong><small>Change across 2006–2025</small></div>
        </div>
        <div className="history-stat">
          <div className="history-stat__icon"><CloudRain size={18} /></div>
          <div><span>Average rainfall</span><strong>{latest.avgRainfall} mm</strong><small>Annual accumulated rainfall</small></div>
        </div>
        <div className="history-stat history-stat--heat">
          <div className="history-stat__icon"><Flame size={18} /></div>
          <div><span>Peak heatwave year</span><strong>{latest.peakYear}</strong><small>{latest.peakHeatwaveDays} heatwave days</small></div>
        </div>
      </div>

      <div className="historical-main-grid">
        <section className="historical-panel historical-panel--large">
          <div className="historical-panel__head">
            <div>
              <h3>Annual historical trend</h3>
              <p>{activeMetric.label} across the selected historical period</p>
            </div>
            <div className="history-tabs" role="tablist">
              {METRICS.map((item) => (
                <button key={item.key} type="button" role="tab" aria-selected={metric === item.key} className={metric === item.key ? "is-active" : ""} onClick={() => setMetric(item.key)}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="historical-chart">
            <ResponsiveContainer width="100%" height={300}>
              {metric === "heatwaveDays" ? (
                <BarChart data={annual} margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
                  <CartesianGrid stroke="#e6edf4" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#dce6ef" }} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<HistoricTooltip unit=" days" />} cursor={{ fill: "#f7fafc" }} />
                  <Bar dataKey="heatwaveDays" fill="var(--red)" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <LineChart data={annual} margin={{ top: 8, right: 12, left: -16, bottom: 4 }}>
                  <CartesianGrid stroke="#e6edf4" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} tickLine={false} axisLine={{ stroke: "#dce6ef" }} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<HistoricTooltip unit={activeMetric.unit} />} cursor={{ stroke: "#dce6ef" }} />
                  <Line type="monotone" dataKey={metric} stroke={metric === "rainfall" ? "var(--cyan)" : "var(--amber)"} strokeWidth={2.5} dot={{ r: 2.5, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
          <div className="historical-caption"><span>Historical record</span><strong>{annual[0]?.year}–{annual[annual.length - 1]?.year}</strong></div>
        </section>

        <section className="historical-panel">
          <div className="historical-panel__head">
            <div><h3>Monthly climate profile</h3><p>Typical temperature pattern</p></div>
          </div>
          <div className="monthly-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historical.monthly} margin={{ top: 8, right: 8, left: -18, bottom: 4 }}>
                <CartesianGrid stroke="#e6edf4" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#dce6ef" }} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<HistoricTooltip unit="°C" />} cursor={{ stroke: "#dce6ef" }} />
                <Line type="monotone" dataKey="temperature" stroke="var(--amber)" strokeWidth={2.4} dot={{ r: 2.5, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="monthly-extremes">
            <div><span>Warmest month</span><strong>{historical.monthly[historical.warmestMonthIndex].month}</strong><small>{historical.monthly[historical.warmestMonthIndex].temperature}°C avg.</small></div>
            <div><span>Coolest month</span><strong>{historical.monthly[historical.coolestMonthIndex].month}</strong><small>{historical.monthly[historical.coolestMonthIndex].temperature}°C avg.</small></div>
          </div>
        </section>
      </div>

      <div className="historical-bottom-grid">
        <section className="historical-panel historical-insight">
          <div className="historical-panel__head"><div><h3>Historical heatwave insight</h3><p>How past conditions support the AI warning layer</p></div></div>
          <div className="insight-flow">
            <div><span>01</span><strong>Historical baseline</strong><p>Compare current temperature against long-term district patterns.</p></div>
            <div><span>02</span><strong>Trend detection</strong><p>Identify persistent warming and repeated high-temperature periods.</p></div>
            <div><span>03</span><strong>AI risk context</strong><p>Use current and historical signals to interpret heatwave risk.</p></div>
          </div>
        </section>

        <section className="historical-panel historical-years">
          <div className="historical-panel__head"><div><h3>Recent historical extremes</h3><p>Highest heatwave activity in the record</p></div></div>
          <div className="extreme-list">
            {historical.topYears.map((row) => (
              <div className="extreme-row" key={row.year}><strong>{row.year}</strong><span>{row.avgTemperature}°C avg.</span><b>{row.heatwaveDays} heatwave days</b></div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
