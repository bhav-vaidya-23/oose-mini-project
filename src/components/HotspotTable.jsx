import "./HotspotTable.css";

function severityTone(severity) {
  if (severity === "Extreme Risk") return "extreme";
  if (severity === "High Risk") return "high";
  if (severity === "Moderate Risk") return "moderate";
  if (severity === "Low Risk") return "low";
  return "safe";
}

export default function HotspotTable({ hotspots, selectedDistrict }) {
  return (
    <section className="panel hotspot" aria-labelledby="hotspot-heading">
      <h2 id="hotspot-heading" className="section-title">
        AI Heatwave Hotspots
      </h2>
      <div className="hotspot__table-wrap">
        <table className="hotspot__table">
          <thead>
            <tr>
              <th scope="col">District</th>
              <th scope="col">Risk</th>
              <th scope="col">Severity</th>
            </tr>
          </thead>
          <tbody>
            {hotspots.map((h) => {
              const tone = severityTone(h.severity);
              const isSelected = h.district === selectedDistrict;
              return (
                <tr key={h.district} className={isSelected ? "is-selected" : ""}>
                  <td>
                    {h.district}
                    {isSelected && <span className="hotspot__pin">current</span>}
                  </td>
                  <td>
                    <div className="hotspot__bar-wrap">
                      <div className={`hotspot__bar hotspot__bar--${tone}`} style={{ width: `${h.risk}%` }} />
                      <span className="hotspot__bar-value">{h.risk}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`hotspot__badge hotspot__badge--${tone}`}>{h.severity}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
