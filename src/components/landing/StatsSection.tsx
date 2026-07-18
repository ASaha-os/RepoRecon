const stats = [
  { number: "40+", label: "Active users" },
  { number: "200+", label: "Total visits" },
  { number: "FREE", label: "Always — no API key" },
];

export const StatsSection = () => (
  <section className="mono-stats" aria-label="Product statistics">
    <div className="mono-stats-inner">
      {stats.map((s) => (
        <div key={s.label} className="mono-stat">
          <span className="mono-stat-number">{s.number}</span>
          <span className="mono-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);
