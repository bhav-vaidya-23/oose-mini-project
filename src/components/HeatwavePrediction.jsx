import { AlertTriangle, ArrowUpRight, BrainCircuit } from "lucide-react";
import "./HeatwavePrediction.css";

const TONE_COPY = {
  safe: "No heatwave is expected in the selected window.",
  low: "Conditions are mild. Continue routine monitoring.",
  moderate: "Elevated heat is likely. Monitor vulnerable groups.",
  high: "A heatwave is expected. Early-warning action is advised.",
  extreme: "Extreme heat conditions are expected. Immediate action is advised.",
};

function RiskGauge({ score, tone }) {
  const color = tone === "extreme" ? "var(--deep-red)" : tone === "high" ? "var(--red)" : tone === "moderate" ? "var(--amber)" : "var(--cyan)";
  const radius = 49;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className="risk-gauge-wrap">
      <svg width="128" height="128" viewBox="0 0 128 128" role="img" aria-label={`AI heatwave risk score ${score} out of 100`}>
        <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5edf4" strokeWidth="9" />
        <circle cx="64" cy="64" r={radius} fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)} transform="rotate(-90 64 64)" />
        <text x="64" y="62" textAnchor="middle" className="risk-gauge__value">{score}</text>
        <text x="64" y="80" textAnchor="middle" className="risk-gauge__label">RISK / 100</text>
      </svg>
    </div>
  );
}

export default function HeatwavePrediction({ prediction }) {
  const { status, riskScore, severity, predictedMax, horizon, tone } = prediction;
  return (
    <section className={`prediction panel prediction--${tone}`} aria-labelledby="prediction-heading">
      <div className="prediction__head">
        <div className="prediction__title-wrap">
          <div className="prediction__icon"><AlertTriangle size={18} /></div>
          <div>
            <p className="prediction__eyebrow">AI early warning</p>
            <h2 id="prediction-heading">Heatwave forecast</h2>
          </div>
        </div>
        <span className={`prediction__badge prediction__badge--${tone}`}>{status}</span>
      </div>

      <div className="prediction__headline">
        <div><strong>{severity} heatwave risk</strong><p>{TONE_COPY[tone]}</p></div>
        <ArrowUpRight className="prediction__trend-icon" size={19} />
      </div>

      <div className="prediction__core">
        <RiskGauge score={riskScore} tone={tone} />
        <div className="prediction__stats">
          <div className="prediction__stat prediction__stat--primary"><span>Predicted maximum</span><strong>{predictedMax}°C</strong><small>within {horizon.toLowerCase()}</small></div>
          <div className="prediction__stat"><span>Severity</span><strong>{severity}</strong><small>AI classification</small></div>
          <div className="prediction__stat"><span>Forecast window</span><strong>24 hrs</strong><small>next-day outlook</small></div>
        </div>
      </div>

      <div className="prediction__explain">
        <div className="prediction__explain-head"><BrainCircuit size={16} /><strong>Why the model is flagging this</strong></div>
        <p>High temperature, predicted maximum temperature, recent warming trend and atmospheric conditions are contributing to the elevated risk score.</p>
        <span>AI model uses 9 meteorological parameters</span>
      </div>
    </section>
  );
}
