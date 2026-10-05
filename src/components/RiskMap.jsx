import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { DISTRICTS } from "../data/mockData";
import "./RiskMap.css";

function toneColor(severity) {
  if (severity === "Extreme Risk") return "#a62639";
  if (severity === "High Risk") return "#d6534a";
  if (severity === "Moderate Risk") return "#e8a33d";
  if (severity === "Low Risk") return "#4fb3bf";
  return "#5fb88a";
}

export default function RiskMap({ hotspots, selectedDistrict, onSelectDistrict }) {
  const byName = Object.fromEntries(hotspots.map((h) => [h.district, h]));

  return (
    <section className="panel risk-map" aria-labelledby="risk-map-heading">
      <div className="risk-map__header">
        <div>
          <h2 id="risk-map-heading" className="section-title">
            AI Heatwave Risk Map
          </h2>
          <p className="risk-map__subtitle">District-level heatwave risk predicted by the AI model</p>
        </div>
      </div>
      <div className="risk-map__canvas">
        <MapContainer
          center={[26.5, 74.0]}
          zoom={6}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {DISTRICTS.map((d) => {
            const h = byName[d.name];
            const isSelected = d.name === selectedDistrict;
            return (
              <CircleMarker
                key={d.name}
                center={[d.lat, d.lng]}
                radius={isSelected ? 11 : 8}
                pathOptions={{
                  color: isSelected ? "#eef1f0" : toneColor(h?.severity),
                  weight: isSelected ? 2 : 1,
                  fillColor: toneColor(h?.severity),
                  fillOpacity: 0.85,
                }}
                eventHandlers={{ click: () => onSelectDistrict?.(d.name) }}
              >
                <Popup>
                  <strong>{d.name}</strong>
                  <br />
                  Current Temperature: {Math.round((d.baseTemp + 2) * 10) / 10}°C
                  <br />
                  Predicted Maximum: {Math.round((d.baseTemp + 4) * 10) / 10}°C
                  <br />
                  AI Risk Score: {h?.risk}%
                  <br />
                  Severity: {h?.severity}
                  <br />
                  Prediction: {h?.risk >= 75 ? "Heatwave Expected" : "Monitor Conditions"}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
      <div className="risk-map__legend">
        <span><i style={{ background: "#5fb88a" }} />No Heatwave</span>
        <span><i style={{ background: "#4fb3bf" }} />Low</span>
        <span><i style={{ background: "#e8a33d" }} />Moderate</span>
        <span><i style={{ background: "#d6534a" }} />High</span>
        <span><i style={{ background: "#a62639" }} />Extreme</span>
      </div>
    </section>
  );
}
