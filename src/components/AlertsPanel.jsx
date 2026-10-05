import { AlertTriangle, ShieldCheck } from "lucide-react";
import "./AlertsPanel.css";

export default function AlertsPanel({ alerts }) {
  return (
    <section className="panel alerts" aria-labelledby="alerts-heading">
      <h2 id="alerts-heading" className="section-title">
        Active Heatwave Alerts
      </h2>

      {alerts.length === 0 ? (
        <div className="alerts__empty">
          <ShieldCheck size={16} strokeWidth={1.8} />
          No active alerts for the selected district and date.
        </div>
      ) : (
        <ul className="alerts__list">
          {alerts.map((a, i) => (
            <li key={i} className={`alerts__item alerts__item--${a.level.toLowerCase()}`}>
              <AlertTriangle size={16} strokeWidth={1.8} className="alerts__icon" />
              <div>
                <p className="alerts__level">{a.level} Alert</p>
                <p className="alerts__message">{a.message}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
