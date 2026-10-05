import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "./RiskTrend.css";

export default function RiskTrend({ riskTrend }) {
  const data = riskTrend.labels.map((label, i) => ({ label, risk: riskTrend.risk[i] }));
  const latest = riskTrend.risk[riskTrend.risk.length - 1];
  const first = riskTrend.risk[0];
  const rising = latest > first;

  return (
    <section className="panel risk-trend" aria-labelledby="risk-trend-heading">
      <div className="risk-trend__head">
        <h2 id="risk-trend-heading" className="section-title">
          AI Heatwave Risk Trend
        </h2>
        <span className={`risk-trend__delta ${rising ? "is-rising" : "is-falling"}`}>
          {rising ? "↑" : "↓"} {Math.abs(latest - first)} pts over 7 days
        </span>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d6534a" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#d6534a" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e6edf4" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#5d7086"
            tick={{ fontSize: 11, fontFamily: "Inter" }}
            tickLine={false}
            axisLine={{ stroke: "#dce6ef" }}
          />
          <YAxis
            stroke="#5d7086"
            tick={{ fontSize: 11, fontFamily: "Inter" }}
            tickLine={false}
            axisLine={false}
            width={34}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Risk"]}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #dce6ef",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#61748c" }}
          />
          <Area type="monotone" dataKey="risk" stroke="#d6534a" strokeWidth={2.2} fill="url(#riskFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
}
