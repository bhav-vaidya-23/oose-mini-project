import { CheckCircle2 } from "lucide-react";
import "./SafetyAdvisories.css";

export default function SafetyAdvisories({ advisories }) {
  return (
    <section className="panel advisories" aria-labelledby="advisories-heading">
      <h2 id="advisories-heading" className="section-title">
        Heatwave Safety Advisory
      </h2>
      <p className="advisories__subtitle">Recommended response based on predicted heatwave severity</p>
      <ul className="advisories__list">
        {advisories.map((a, i) => (
          <li key={i} className="advisories__item">
            <CheckCircle2 size={15} strokeWidth={1.8} className="advisories__icon" />
            {a}
          </li>
        ))}
      </ul>
    </section>
  );
}
