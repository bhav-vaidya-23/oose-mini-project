import { Thermometer, Droplets, Wind, CloudRain, Gauge, Cloud, SunMedium } from "lucide-react";
import "./CurrentWeather.css";

function conditionForTemp(value) {
  if (value >= 44) return "Hot and mostly clear";
  if (value >= 40) return "Warm and sunny";
  if (value >= 35) return "Mild and bright";
  return "Pleasant conditions";
}

const METRICS = [
  ["humidity", "Humidity", "%", Droplets],
  ["windSpeed", "Wind", "km/h", Wind],
  ["rainfall", "Rainfall", "mm", CloudRain],
  ["pressure", "Pressure", "hPa", Gauge],
  ["cloudCover", "Cloud cover", "%", Cloud],
];

export default function CurrentWeather({ current, district, date }) {
  const formattedDate = new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
  const temperature = Number(current.temperature || 0);
  const condition = current.weatherCondition || conditionForTemp(temperature);
  const locationLabel = current.locationLabel || `${district}, Rajasthan`;

  return (
    <section className="current-weather panel" aria-labelledby="current-weather-heading">
      <div className="current-weather__topline">
        <div>
          <p className="current-weather__eyebrow">{locationLabel}</p>
          <h2 id="current-weather-heading">{formattedDate}</h2>
        </div>
        <span className="current-weather__status"><span />{condition}</span>
      </div>
      <div className="current-weather__main">
        <div className="current-weather__icon-wrap"><SunMedium size={64} strokeWidth={1.25} /></div>
        <div>
          <div className="current-weather__temperature">{current.temperature}<span>°C</span></div>
          <p className="current-weather__feels">Feels like {Math.round(temperature + 2)}°C</p>
          <p className="current-weather__condition">{condition}</p>
        </div>
      </div>
      <div className="current-weather__metrics">
        <div className="metric metric--temperature"><Thermometer size={17} /><span>Temperature</span><strong>{current.temperature}°C</strong></div>
        {METRICS.map(([key, label, unit, Icon]) => (
          <div className="metric" key={key}><Icon size={17} /><span>{label}</span><strong>{current[key]}<em>{unit}</em></strong></div>
        ))}
      </div>
    </section>
  );
}
