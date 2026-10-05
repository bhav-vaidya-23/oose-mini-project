import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./WeatherTrend.css";

const TABS = [
  { key: "temperature", label: "Temperature", unit: "°C", color: "var(--amber)" },
  { key: "humidity", label: "Humidity", unit: "%", color: "var(--cyan)" },
  { key: "rainfall", label: "Rainfall", unit: "mm", color: "var(--green)" },
];

function TrendTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="trend-tooltip">
      <p className="trend-tooltip__label">{label}</p>
      <p className="trend-tooltip__value">
        {payload[0].value}
        {unit}
      </p>
    </div>
  );
}

export default function WeatherTrend({ trend }) {
  const [active, setActive] = useState("temperature");
  const tab = TABS.find((t) => t.key === active);
  const data = trend.labels.map((label, i) => ({ label, value: trend[active][i] }));
  const resolvedColor = getComputedColor(tab.color);

  return (
    <section className="panel weather-trend" aria-labelledby="weather-trend-heading">
      <div className="weather-trend__head">
        <h2 id="weather-trend-heading" className="section-title">
          Weather Trend Analysis
        </h2>
        <div className="weather-trend__tabs" role="tablist" aria-label="Select weather metric">
          {TABS.map((t) => (
            <button
              key={t.key}
              role="tab"
              type="button"
              aria-selected={active === t.key}
              className={`weather-trend__tab ${active === t.key ? "is-active" : ""}`}
              onClick={() => setActive(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="weather-trend__chart">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="#e6edf4" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#5d7086"
              tick={{ fontSize: 11, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={{ stroke: "#dce6ef" }}
            />
            <YAxis
              stroke="#5d7086"
              tick={{ fontSize: 11, fontFamily: "Inter" }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip content={<TrendTooltip unit={tab.unit} />} cursor={{ stroke: "#dce6ef" }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={resolvedColor}
              strokeWidth={2.2}
              dot={{ r: 3, fill: resolvedColor, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// Recharts needs a resolved color, not a CSS var string, for stroke fills
// in some contexts — read it from the document at render time.
function getComputedColor(cssVar) {
  if (typeof window === "undefined") return "#e8a33d";
  const match = cssVar.match(/var\((--[a-z-]+)\)/);
  if (!match) return cssVar;
  const themeRoot = document.querySelector(".app") || document.documentElement;
  return getComputedStyle(themeRoot).getPropertyValue(match[1]).trim() || "#e8a33d";
}
