import { MapPin, Calendar, ChevronDown } from "lucide-react";
import { LOCATIONS } from "../data/mockData";
import "./ControlBar.css";

export default function ControlBar({ district, onDistrictChange, date, onDateChange }) {
  return (
    <section className="control-bar" aria-label="Weather location controls">
      <div className="control-bar__inner">
        <div className="control-bar__field control-bar__field--wide">
          <label htmlFor="district-select"><MapPin size={14} />Location</label>
          <div className="control-bar__select-wrap">
            <select id="district-select" value={district} onChange={(e) => onDistrictChange(e.target.value)}>
              {LOCATIONS.map((location) => (
                <option key={location.name} value={location.name}>{location.name}, {location.state}</option>
              ))}
            </select>
            <ChevronDown size={15} className="control-bar__chevron" />
          </div>
        </div>
        <div className="control-bar__field">
          <label htmlFor="date-select"><Calendar size={14} />Forecast date</label>
          <input id="date-select" type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
      </div>
    </section>
  );
}
