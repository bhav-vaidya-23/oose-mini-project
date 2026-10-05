import { MODEL_PARAMETERS } from "../data/mockData";
import "./AIModelInfo.css";

const PARAMETER_META = {
  TEMP2M: ["Current air temperature", "°C"],
  TMAX: ["Predicted maximum temperature", "°C"],
  TMIN: ["Minimum temperature", "°C"],
  DEW2M: ["Dew point", "°C"],
  RAIN: ["Rainfall", "mm"],
  EVAP: ["Evaporation", "mm"],
  CLOUD: ["Cloud cover", "%"],
  WIND: ["Wind speed", "km/h"],
  MSLP: ["Mean sea-level pressure", "hPa"],
};

export default function AIModelInfo({ current, prediction }) {
  const values = {
    TEMP2M: current.temperature,
    TMAX: prediction.predictedMax,
    TMIN: +(current.temperature - 8.5).toFixed(1),
    DEW2M: +(current.temperature - 10.5).toFixed(1),
    RAIN: current.rainfall,
    EVAP: +(Math.max(1.2, current.temperature * 0.12)).toFixed(1),
    CLOUD: current.cloudCover,
    WIND: current.windSpeed,
    MSLP: current.pressure,
  };

  return (
    <section className="model-info" aria-labelledby="model-info-heading">
      <div className="model-info__header">
        <div>
          <p className="model-info__eyebrow">AI prediction details</p>
          <h2 id="model-info-heading" className="model-info__title">How the heatwave prediction is generated</h2>
          <p className="model-info__intro">
            The warning combines current and historical meteorological conditions to estimate the next-period maximum temperature and heatwave risk.
          </p>
        </div>
        <div className="model-info__status">
          <span className="model-info__live-dot" /> AI model active
        </div>
      </div>

      <div className="model-info__summary">
        <div className="model-info__result">
          <span className="model-info__label">Current AI output</span>
          <div className="model-info__result-row">
            <strong>{prediction.riskScore}<small>/100</small></strong>
            <span className={`model-info__severity model-info__severity--${prediction.tone}`}>
              {prediction.severity} Risk
            </span>
          </div>
          <p>Predicted maximum <b>{prediction.predictedMax}°C</b> · {prediction.horizon}</p>
        </div>
        <div className="model-info__reason">
          <span className="model-info__label">Why the risk is elevated</span>
          <div className="model-info__reason-list">
            <span>High current temperature</span>
            <span>High predicted maximum</span>
            <span>Low cloud cover</span>
            <span>Recent warming trend</span>
          </div>
        </div>
      </div>

      <div className="model-info__inputs-block">
        <div className="model-info__section-title">
          <div>
            <span className="model-info__eyebrow">Model inputs</span>
            <h3>9 meteorological parameters</h3>
          </div>
          <span className="model-info__hint">Values used for {prediction.horizon.toLowerCase()} risk assessment</span>
        </div>
        <div className="model-info__param-grid">
          {MODEL_PARAMETERS.map((parameter) => {
            const [description, unit] = PARAMETER_META[parameter.code];
            return (
              <div className="model-info__param-card" key={parameter.code}>
                <span className="model-info__code">{parameter.code}</span>
                <strong>{values[parameter.code]} <small>{unit}</small></strong>
                <span>{description}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="model-info__pipeline-block">
        <div className="model-info__section-title">
          <div>
            <span className="model-info__eyebrow">Prediction pipeline</span>
            <h3>From weather observations to early warning</h3>
          </div>
        </div>
        <div className="model-info__pipeline">
          <div className="model-info__step"><b>01</b><span>Weather data</span><small>Historical + current observations</small></div>
          <i>→</i>
          <div className="model-info__step"><b>02</b><span>AI prediction</span><small>Evaluate 9 meteorological inputs</small></div>
          <i>→</i>
          <div className="model-info__step"><b>03</b><span>Risk classification</span><small>Low → Moderate → High → Extreme</small></div>
          <i>→</i>
          <div className="model-info__step model-info__step--final"><b>04</b><span>Early warning</span><small>Alert + safety advisory</small></div>
        </div>
      </div>

      <div className="model-info__meta">
        <span>AI Climate Intelligence System · Meteorological input feed</span>
        <div>{MODEL_PARAMETERS.map((p) => <code key={p.code}>{p.code}</code>)}</div>
      </div>
    </section>
  );
}
