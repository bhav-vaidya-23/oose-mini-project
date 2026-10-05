import { Bell, UserCircle2, MapPin, CalendarDays, Moon, Sun } from "lucide-react";
import "./Header.css";

const NAV_ITEMS = [
  ["Dashboard", "#dashboard"],
  ["Forecast", "#forecast"],
  ["Historical", "#historical"],
  ["Heatwave Risk", "#heatwave-risk"],
  ["Weather Map", "#heatwave-risk"],
  ["Alerts", "#alerts"],
];

function formatSelectedDate(date) {
  if (!date) return "Today";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export default function Header({ district, date, locationState = "Rajasthan", theme = "light", onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <a href="#dashboard" className="app-header__brand" aria-label="AI Climate Intelligence System home">
          <div className="app-header__mark" aria-hidden="true">
            <span className="sun-core">☀</span>
          </div>
          <div>
            <h1 className="app-header__title">AI Climate Intelligence System</h1>
            <p className="app-header__subtitle">Heatwave Monitoring &amp; Early Warning</p>
          </div>
        </a>

        <nav className="app-header__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map(([label, href], index) => (
            <a key={label} href={href} className={`app-header__nav-item ${index === 0 ? "is-active" : ""}`}>{label}</a>
          ))}
        </nav>

        <div className="app-header__meta">
          <div className="app-header__detail-pill"><MapPin size={14} />{district}, {locationState}</div>
          <div className="app-header__detail-pill app-header__date"><CalendarDays size={14} />{formatSelectedDate(date)}</div>
          <div className="app-header__icons">
            <button
              className="app-header__icon-btn"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              aria-pressed={theme === "dark"}
              onClick={onToggleTheme}
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <button className="app-header__icon-btn" type="button" aria-label="Notifications"><Bell size={17} /></button>
            <button className="app-header__icon-btn" type="button" aria-label="Profile"><UserCircle2 size={18} /></button>
          </div>
        </div>
      </div>
    </header>
  );
}
