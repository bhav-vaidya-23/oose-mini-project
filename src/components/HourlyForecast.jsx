import { CloudSun, Sun, SunMedium } from "lucide-react";
import "./HourlyForecast.css";

const ICONS = [Sun, SunMedium, SunMedium, SunMedium, CloudSun, CloudSun, CloudSun, CloudSun];

export default function HourlyForecast({ temperature, humidity }) {
  const base = Number(temperature || 0);
  const hours = [
    { time: "Now", temp: base, rain: 4 },
    { time: "3 PM", temp: base + 0.7, rain: 3 },
    { time: "4 PM", temp: base + 1.1, rain: 2 },
    { time: "5 PM", temp: base + 0.6, rain: 2 },
    { time: "6 PM", temp: base - 0.4, rain: 4 },
    { time: "7 PM", temp: base - 1.7, rain: 5 },
    { time: "8 PM", temp: base - 3.0, rain: 6 },
    { time: "9 PM", temp: base - 4.1, rain: 7 },
  ];

  return (
    <section className="hourly" id="forecast" aria-labelledby="hourly-heading">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Forecast</p>
          <h2 id="hourly-heading">Hourly forecast</h2>
        </div>
        <span className="section-note">Updated for selected location</span>
      </div>
      <div className="hourly__rail">
        {hours.map(({ time, temp, rain }, index) => {
          const Icon = ICONS[index];
          return (
            <div className={`hourly__item ${index === 0 ? "is-current" : ""}`} key={time}>
              <span className="hourly__time">{time}</span>
              <Icon className="hourly__icon" size={24} strokeWidth={1.8} />
              <strong>{Math.round(temp)}°</strong>
              <span className="hourly__rain">{rain}% rain</span>
              <span className="hourly__humidity">{Math.max(30, humidity - index * 2)}% RH</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
