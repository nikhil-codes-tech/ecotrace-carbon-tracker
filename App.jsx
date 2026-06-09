import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "transport", label: "Transport", icon: "🚗", color: "#FF6B35", unit: "km/week", factor: 0.21, tips: ["Switch to public transit", "Carpool with coworkers", "Cycle for short trips", "Work from home 1 day/week"] },
  { id: "food", label: "Food", icon: "🍽️", color: "#F7C59F", unit: "meals/week", factor: 3.3, tips: ["Eat one meatless day/week", "Buy local produce", "Reduce food waste", "Choose plant-based proteins"] },
  { id: "energy", label: "Home Energy", icon: "⚡", color: "#EFEFD0", unit: "kWh/month", factor: 0.82, tips: ["Switch to LED bulbs", "Unplug idle electronics", "Use a programmable thermostat", "Insulate windows/doors"] },
  { id: "shopping", label: "Shopping", icon: "🛍️", color: "#04A777", unit: "items/month", factor: 8.5, tips: ["Buy secondhand clothing", "Repair before replacing", "Choose durable goods", "Avoid fast fashion"] },
  { id: "flights", label: "Flights", icon: "✈️", color: "#1B998B", unit: "flights/year", factor: 255, tips: ["Take trains for short trips", "Offset flight emissions", "Bundle trips together", "Prefer direct routes"] },
];

const GLOBAL_AVG = 4000; // kg CO2e/year average individual
const TARGET = 2300; // Paris Agreement target

const formatKg = (kg) => kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${Math.round(kg)}kg`;

const AnimatedNumber = ({ value, suffix = "" }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const step = end / (duration / 16);
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(ref.current); }
      else setDisplay(Math.round(start));
    }, 16);
    return () => clearInterval(ref.current);
  }, [value]);
  return <span>{display}{suffix}</span>;
};

const RadialGauge = ({ value, max, color }) => {
  const pct = Math.min(value / max, 1);
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <svg viewBox="0 0 120 120" style={{ width: 120, height: 120 }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 60 60)" style={{ transition: "stroke-dasharray 1s ease" }} />
      <circle cx="60" cy="60" r="40" fill="rgba(255,255,255,0.04)" />
    </svg>
  );
};

export default function CarbonTracker() {
  const [inputs, setInputs] = useState({ transport: 80, food: 14, energy: 350, shopping: 4, flights: 2 });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [completedActions, setCompletedActions] = useState([]);
  const [streak, setStreak] = useState(7);
  const [history, setHistory] = useState([
    { month: "Jan", val: 520 }, { month: "Feb", val: 490 }, { month: "Mar", val: 475 },
    { month: "Apr", val: 460 }, { month: "May", val: 445 }, { month: "Jun", val: null },
  ]);

  const totals = CATEGORIES.reduce((acc, c) => {
    acc[c.id] = inputs[c.id] * c.factor;
    return acc;
  }, {});
  const annualKg = Object.values(totals).reduce((a, b) => a + b, 0);
  const monthlyKg = annualKg / 12;
  const vsGlobal = ((annualKg - GLOBAL_AVG) / GLOBAL_AVG * 100).toFixed(1);
  const vsTarget = ((annualKg - TARGET) / TARGET * 100).toFixed(1);

  const getLevel = () => {
    if (annualKg < 2300) return { label: "Climate Champion", color: "#04A777", emoji: "🌿" };
    if (annualKg < 3500) return { label: "On Track", color: "#1B998B", emoji: "🌱" };
    if (annualKg < 5500) return { label: "Needs Work", color: "#F7C59F", emoji: "⚠️" };
    return { label: "High Impact", color: "#FF6B35", emoji: "🔥" };
  };
  const level = getLevel();

  const topCategory = CATEGORIES.reduce((a, b) => totals[a.id] > totals[b.id] ? a : b);

  const toggleAction = (catId, tipIdx) => {
    const key = `${catId}-${tipIdx}`;
    setCompletedActions(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const maxBar = Math.max(...history.filter(h => h.val).map(h => h.val));

  const styles = {
    app: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0f0d 0%, #0d1a14 40%, #091210 100%)",
      fontFamily: "'DM Mono', 'Courier New', monospace",
      color: "#e8f5e9",
      padding: "0",
    },
    header: {
      background: "rgba(4, 167, 119, 0.06)",
      borderBottom: "1px solid rgba(4,167,119,0.15)",
      padding: "20px 24px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    },
    logo: { display: "flex", alignItems: "center", gap: 10 },
    logoLeaf: { fontSize: 26 },
    logoText: { fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", color: "#04A777", textTransform: "uppercase" },
    logoSub: { fontSize: 10, color: "rgba(200,240,210,0.45)", letterSpacing: "0.2em" },
    streakBadge: {
      background: "rgba(4,167,119,0.12)", border: "1px solid rgba(4,167,119,0.3)",
      borderRadius: 20, padding: "6px 14px", fontSize: 11, color: "#04A777",
      display: "flex", alignItems: "center", gap: 6, letterSpacing: "0.08em"
    },
    nav: {
      display: "flex", gap: 0, padding: "0 24px",
      borderBottom: "1px solid rgba(4,167,119,0.1)",
      background: "rgba(0,0,0,0.2)"
    },
    navBtn: (active) => ({
      background: "none", border: "none", cursor: "pointer",
      padding: "14px 20px", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
      color: active ? "#04A777" : "rgba(200,240,210,0.4)",
      borderBottom: active ? "2px solid #04A777" : "2px solid transparent",
      transition: "all 0.2s",
    }),
    body: { padding: "24px", maxWidth: 900, margin: "0 auto" },
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
    grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 },
    card: {
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(4,167,119,0.12)",
      borderRadius: 16, padding: 20,
    },
    heroCard: {
      background: "linear-gradient(135deg, rgba(4,167,119,0.1), rgba(27,153,139,0.05))",
      border: "1px solid rgba(4,167,119,0.25)",
      borderRadius: 20, padding: 28,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 16,
    },
    bigNumber: { fontSize: 48, fontWeight: 700, color: level.color, lineHeight: 1, letterSpacing: "-0.02em" },
    bigLabel: { fontSize: 10, color: "rgba(200,240,210,0.5)", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 4 },
    levelBadge: {
      background: `${level.color}22`,
      border: `1px solid ${level.color}55`,
      borderRadius: 12, padding: "8px 18px",
      fontSize: 11, color: level.color, letterSpacing: "0.1em",
    },
    sectionTitle: { fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,240,210,0.4)", marginBottom: 14 },
    catRow: {
      display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
      background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 14px",
      border: "1px solid rgba(255,255,255,0.04)",
    },
    barTrack: { flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" },
    statBox: {
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(4,167,119,0.12)",
      borderRadius: 14, padding: "18px 20px",
    },
    statNum: (color) => ({ fontSize: 28, fontWeight: 700, color: color || "#e8f5e9", letterSpacing: "-0.02em" }),
    statLabel: { fontSize: 10, color: "rgba(200,240,210,0.4)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 4 },
    inputWrap: {
      marginBottom: 20, background: "rgba(255,255,255,0.02)",
      border: "1px solid rgba(4,167,119,0.1)", borderRadius: 14, padding: "18px 20px",
    },
    inputRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    slider: {
      width: "100%", appearance: "none", height: 4,
      background: "rgba(255,255,255,0.1)", borderRadius: 4, outline: "none", cursor: "pointer",
    },
    inputVal: {
      background: "rgba(4,167,119,0.1)", border: "1px solid rgba(4,167,119,0.3)",
      borderRadius: 8, padding: "4px 10px", width: 70, textAlign: "center",
      color: "#04A777", fontSize: 13, fontFamily: "inherit",
    },
    actionCard: (done) => ({
      background: done ? "rgba(4,167,119,0.08)" : "rgba(255,255,255,0.02)",
      border: `1px solid ${done ? "rgba(4,167,119,0.35)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 10, padding: "12px 16px", cursor: "pointer",
      display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
      transition: "all 0.2s",
    }),
    check: (done) => ({
      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
      background: done ? "#04A777" : "transparent",
      border: `2px solid ${done ? "#04A777" : "rgba(255,255,255,0.2)"}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, transition: "all 0.2s",
    }),
  };

  return (
    <div style={styles.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px;
          background: #04A777; border-radius: 50%; cursor: pointer;
          box-shadow: 0 0 8px rgba(4,167,119,0.5);
        }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(4,167,119,0.3); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoLeaf}>🌍</span>
          <div>
            <div style={styles.logoText}>EcoTrace</div>
            <div style={styles.logoSub}>Carbon Footprint Tracker</div>
          </div>
        </div>
        <div style={styles.streakBadge}>🔥 {streak}-day streak</div>
      </div>

      {/* Nav */}
      <div style={styles.nav}>
        {["dashboard", "track", "actions", "insights"].map(tab => (
          <button key={tab} style={styles.navBtn(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>

      <div style={styles.body}>

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            {/* Hero */}
            <div style={styles.heroCard}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(200,240,210,0.4)", marginBottom: 6, textTransform: "uppercase" }}>Annual Footprint</div>
                <div style={styles.bigNumber}>
                  <AnimatedNumber value={Math.round(annualKg)} /><span style={{ fontSize: 20 }}>kg</span>
                </div>
                <div style={styles.bigLabel}>CO₂ equivalent / year</div>
                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <div style={styles.levelBadge}>{level.emoji} {level.label}</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block" }}>
                  <RadialGauge value={annualKg} max={8000} color={level.color} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontSize: 10, color: "rgba(200,240,210,0.4)", letterSpacing: "0.1em" }}>of 8t</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div style={styles.grid3}>
              <div style={styles.statBox}>
                <div style={styles.statNum(vsGlobal < 0 ? "#04A777" : "#FF6B35")}>
                  {vsGlobal > 0 ? "+" : ""}{vsGlobal}%
                </div>
                <div style={styles.statLabel}>vs global avg (4t)</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum()}>{formatKg(monthlyKg)}</div>
                <div style={styles.statLabel}>per month</div>
              </div>
              <div style={styles.statBox}>
                <div style={styles.statNum(vsTarget < 0 ? "#04A777" : "#F7C59F")}>
                  {vsTarget > 0 ? "+" : ""}{vsTarget}%
                </div>
                <div style={styles.statLabel}>vs Paris target (2.3t)</div>
              </div>
            </div>

            {/* Category breakdown */}
            <div style={styles.card}>
              <div style={styles.sectionTitle}>Breakdown by Category</div>
              {CATEGORIES.map(cat => {
                const pct = (totals[cat.id] / annualKg * 100).toFixed(1);
                return (
                  <div key={cat.id} style={styles.catRow}>
                    <span style={{ fontSize: 18 }}>{cat.icon}</span>
                    <span style={{ fontSize: 11, width: 90, color: "rgba(200,240,210,0.7)", letterSpacing: "0.05em" }}>{cat.label}</span>
                    <div style={styles.barTrack}>
                      <div style={{ height: "100%", width: `${pct}%`, background: cat.color, borderRadius: 4, transition: "width 0.8s ease" }} />
                    </div>
                    <span style={{ fontSize: 11, color: cat.color, width: 48, textAlign: "right" }}>{pct}%</span>
                    <span style={{ fontSize: 10, color: "rgba(200,240,210,0.35)", width: 52, textAlign: "right" }}>{formatKg(totals[cat.id])}</span>
                  </div>
                );
              })}
            </div>

            {/* Trend */}
            <div style={{ ...styles.card, marginTop: 16 }}>
              <div style={styles.sectionTitle}>Monthly Trend (kg CO₂)</div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80, marginTop: 12 }}>
                {history.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: "100%", background: h.val ? `rgba(4,167,119,${0.3 + (h.val / maxBar) * 0.6})` : "rgba(255,255,255,0.05)",
                      borderRadius: "4px 4px 0 0", border: h.val ? "1px solid rgba(4,167,119,0.3)" : "1px dashed rgba(255,255,255,0.1)",
                      height: h.val ? `${(h.val / maxBar) * 70}px` : "8px",
                      transition: "height 0.8s ease",
                    }} />
                    <div style={{ fontSize: 9, color: "rgba(200,240,210,0.35)", letterSpacing: "0.1em" }}>{h.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TRACK */}
        {activeTab === "track" && (
          <>
            <div style={{ fontSize: 11, color: "rgba(200,240,210,0.4)", letterSpacing: "0.15em", marginBottom: 20, textTransform: "uppercase" }}>
              Adjust your habits to see real-time impact
            </div>
            {CATEGORIES.map(cat => (
              <div key={cat.id} style={styles.inputWrap}>
                <div style={styles.inputRow}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 20 }}>{cat.icon}</span>
                    <div>
                      <div style={{ fontSize: 13, color: "rgba(200,240,210,0.9)", letterSpacing: "0.05em" }}>{cat.label}</div>
                      <div style={{ fontSize: 10, color: "rgba(200,240,210,0.35)", letterSpacing: "0.1em" }}>{cat.unit}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="number"
                      style={styles.inputVal}
                      value={inputs[cat.id]}
                      onChange={e => setInputs(p => ({ ...p, [cat.id]: Math.max(0, Number(e.target.value)) }))}
                    />
                    <div style={{ fontSize: 10, color: cat.color, minWidth: 50, textAlign: "right" }}>
                      {formatKg(totals[cat.id])}/yr
                    </div>
                  </div>
                </div>
                <input type="range" style={styles.slider}
                  min={0} max={cat.id === "flights" ? 20 : cat.id === "energy" ? 1000 : cat.id === "transport" ? 500 : cat.id === "food" ? 28 : 20}
                  value={inputs[cat.id]}
                  onChange={e => setInputs(p => ({ ...p, [cat.id]: Number(e.target.value) }))}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 9, color: "rgba(200,240,210,0.2)" }}>0</span>
                  <div style={{ height: 4, flex: 1, margin: "0 8px", background: `linear-gradient(to right, #04A777, #F7C59F, #FF6B35)`, borderRadius: 2, opacity: 0.2 }} />
                  <span style={{ fontSize: 9, color: "rgba(200,240,210,0.2)" }}>High</span>
                </div>
              </div>
            ))}

            {/* Live total */}
            <div style={{ ...styles.heroCard, marginTop: 8 }}>
              <div>
                <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "rgba(200,240,210,0.4)", marginBottom: 6, textTransform: "uppercase" }}>Updated Total</div>
                <div style={{ fontSize: 36, fontWeight: 700, color: level.color, letterSpacing: "-0.02em" }}>
                  <AnimatedNumber value={Math.round(annualKg)} /> kg CO₂/yr
                </div>
              </div>
              <div style={styles.levelBadge}>{level.emoji} {level.label}</div>
            </div>
          </>
        )}

        {/* ACTIONS */}
        {activeTab === "actions" && (
          <>
            <div style={{ fontSize: 11, color: "rgba(200,240,210,0.4)", letterSpacing: "0.15em", marginBottom: 6, textTransform: "uppercase" }}>
              Personalized Actions
            </div>
            <div style={{ fontSize: 11, color: "rgba(200,240,210,0.35)", marginBottom: 20 }}>
              {completedActions.length} of {CATEGORIES.reduce((a, c) => a + c.tips.length, 0)} actions completed
            </div>

            {/* Progress bar */}
            <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, marginBottom: 24, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4, background: "linear-gradient(90deg, #04A777, #1B998B)",
                width: `${completedActions.length / CATEGORIES.reduce((a, c) => a + c.tips.length, 0) * 100}%`,
                transition: "width 0.4s ease"
              }} />
            </div>

            {/* Highlight top category */}w
            <div style={{ ...styles.card, borderColor: `${topCategory.color}44`, marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontSize: 28 }}>{topCategory.icon}</span>
              <div>
                <div style={{ fontSize: 10, color: "rgba(200,240,210,0.4)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Biggest Impact Area</div>
                <div style={{ fontSize: 15, color: topCategory.color, marginTop: 2 }}>{topCategory.label} — {formatKg(totals[topCategory.id])}/yr</div>
                <div style={{ fontSize: 11, color: "rgba(200,240,210,0.4)", marginTop: 2 }}>Focus here for maximum re
