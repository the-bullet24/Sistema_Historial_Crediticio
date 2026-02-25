import { useState, useMemo } from "react";

// ─── Estilos ─────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f4f1eb;
    --surface:   #fffefb;
    --border:    #e2ddd4;
    --border2:   #c8c0b0;
    --text:      #1a1714;
    --muted:     #8a8278;
    --accent:    #1a3a2a;
    --accent2:   #2d6a4f;
    --accent-lt: #e8f0eb;
    --warn:      #8b3a1a;
    --warn-lt:   #f5ece8;
    --gold:      #b8952a;
    --gold-lt:   #faf4e1;
    --red:       #c0392b;
    --red-lt:    #fdf0ef;
    --blue:      #1e40af;
    --blue-lt:   #eff6ff;
    --shadow:    0 2px 8px rgba(26,23,20,0.08);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12), 0 2px 8px rgba(26,23,20,0.06);
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

  .root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 70% 0%, rgba(45,106,79,0.07) 0%, transparent 55%),
      radial-gradient(ellipse at 20% 100%, rgba(184,149,42,0.05) 0%, transparent 55%);
    padding: 48px 24px 80px;
    display: flex; flex-direction: column; align-items: center;
  }

  /* Header */
  .page-header {
    width: 100%; max-width: 900px; margin-bottom: 28px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  }
  .eyebrow {
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px;
  }
  .page-header h1 {
    font-family: 'DM Serif Display', serif; font-size: 2rem;
    font-weight: 400; color: var(--text); line-height: 1.15;
  }
  .page-header p { margin-top: 6px; color: var(--muted); font-size: 0.85rem; line-height: 1.6; }

  /* Empresa chip */
  .empresa-chip {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 12px;
    background: var(--surface); border: 1px solid var(--border);
    box-shadow: var(--shadow); flex-shrink: 0;
  }
  .empresa-chip-icon {
    width: 32px; height: 32px; border-radius: 7px;
    background: var(--accent-lt); display: flex;
    align-items: center; justify-content: center; font-size: 0.9rem;
  }
  .empresa-chip-name { font-size: 0.78rem; font-weight: 600; }
  .empresa-chip-ruc  { font-family: 'DM Mono', monospace; font-size: 0.62rem; color: var(--muted); }

  /* Año selector */
  .anio-selector {
    width: 100%; max-width: 900px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  }
  .anio-label { font-family: 'DM Mono', monospace; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-right: 4px; }
  .anio-btn {
    padding: 6px 16px; border-radius: 8px;
    border: 1.5px solid var(--border); background: var(--bg);
    font-family: 'DM Mono', monospace; font-size: 0.78rem; color: var(--muted);
    cursor: pointer; transition: all 0.15s;
  }
  .anio-btn:hover { border-color: var(--accent2); color: var(--accent2); }
  .anio-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* KPI row */
  .kpi-row {
    width: 100%; max-width: 900px;
    display: grid; grid-template-columns: repeat(5, 1fr);
    gap: 14px; margin-bottom: 20px;
  }
  .kpi-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 16px 18px;
    box-shadow: var(--shadow); position: relative; overflow: hidden;
    transition: box-shadow 0.2s;
  }
  .kpi-card:hover { box-shadow: var(--shadow-lg); }
  .kpi-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 3px;
    border-radius: 14px 14px 0 0;
  }
  .kpi-card.k-score::before    { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .kpi-card.k-clasi::before    { background: linear-gradient(90deg, var(--gold), #d4a832); }
  .kpi-card.k-antic::before    { background: linear-gradient(90deg, var(--accent2), #059669); }
  .kpi-card.k-moroso::before   { background: linear-gradient(90deg, var(--red), #b91c1c); }
  .kpi-card.k-variacion::before{ background: linear-gradient(90deg, var(--blue), #1d4ed8); }

  .kpi-label {
    font-family: 'DM Mono', monospace; font-size: 0.58rem;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 8px;
  }
  .kpi-val {
    font-family: 'DM Serif Display', serif; font-size: 1.7rem;
    line-height: 1; color: var(--text); margin-bottom: 4px;
  }
  .kpi-sub { font-size: 0.7rem; color: var(--muted); }
  .kpi-trend {
    display: inline-flex; align-items: center; gap: 3px;
    font-size: 0.68rem; font-family: 'DM Mono', monospace;
    padding: 2px 7px; border-radius: 999px; margin-top: 4px;
  }
  .trend-up   { background: var(--accent-lt); color: var(--accent2); }
  .trend-down { background: var(--red-lt);    color: var(--red); }
  .trend-flat { background: var(--gold-lt);   color: var(--gold); }

  /* Layout */
  .layout {
    width: 100%; max-width: 900px;
    display: grid; grid-template-columns: 1fr 280px;
    gap: 20px; align-items: start;
  }

  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden;
    animation: fadeUp 0.3s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-head {
    padding: 18px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .card-head-icon {
    width: 34px; height: 34px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .card-head-title { font-family: 'DM Serif Display', serif; font-size: 1.05rem; font-weight: 400; }
  .card-head-sub   { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .card-body { padding: 22px 24px; }

  /* ── Gráfico SVG de línea ── */
  .chart-wrap { width: 100%; overflow: hidden; }
  .chart-svg  { width: 100%; display: block; }

  .chart-tooltip {
    position: absolute; pointer-events: none;
    background: var(--text); color: #fff;
    padding: 8px 12px; border-radius: 8px;
    font-size: 0.72rem; font-family: 'DM Mono', monospace;
    box-shadow: 0 4px 14px rgba(0,0,0,0.25);
    transform: translate(-50%, -110%);
    white-space: nowrap; z-index: 10;
    transition: opacity 0.15s;
  }
  .chart-tooltip::after {
    content: ''; position: absolute;
    top: 100%; left: 50%; transform: translateX(-50%);
    border: 5px solid transparent; border-top-color: var(--text);
  }
  .chart-container { position: relative; }

  /* ── Tabla mensual ── */
  .mes-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
  .mes-table th {
    font-family: 'DM Mono', monospace; font-size: 0.58rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); padding: 0 12px 10px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .mes-table td { padding: 10px 12px; border-bottom: 1px solid rgba(226,221,212,0.5); vertical-align: middle; }
  .mes-table tr:last-child td { border-bottom: none; }
  .mes-table tr:hover td { background: rgba(26,58,42,0.02); }
  .mes-table tr.mes-actual td { background: var(--accent-lt); }

  .mes-name { font-weight: 600; }
  .mes-score-val { font-family: 'DM Serif Display', serif; font-size: 1.1rem; }

  /* Score mini bar */
  .score-mini-bar {
    height: 5px; border-radius: 999px; background: var(--border); width: 80px; overflow: hidden;
  }
  .score-mini-fill { height: 100%; border-radius: 999px; }

  /* Clasificación badge */
  .clasi-badge {
    font-size: 0.6rem; padding: 3px 8px; border-radius: 999px;
    font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.05em;
    white-space: nowrap;
  }
  .clasi-EXCELENTE { background: var(--accent-lt);  color: var(--accent2); border: 1px solid rgba(45,106,79,0.2); }
  .clasi-BUENO     { background: var(--blue-lt);    color: var(--blue);    border: 1px solid rgba(30,64,175,0.2); }
  .clasi-REGULAR   { background: var(--gold-lt);    color: var(--gold);    border: 1px solid rgba(184,149,42,0.2); }
  .clasi-MALO      { background: var(--warn-lt);    color: var(--warn);    border: 1px solid rgba(139,58,26,0.2); }
  .clasi-MUY_MALO  { background: var(--red-lt);     color: var(--red);     border: 1px solid rgba(192,57,43,0.2); }

  /* Variación */
  .var-tag {
    font-family: 'DM Mono', monospace; font-size: 0.68rem; font-weight: 600;
  }
  .var-pos { color: var(--accent2); }
  .var-neg { color: var(--red); }
  .var-neu { color: var(--muted); }

  /* Pagos pills */
  .pagos-pills { display: flex; gap: 6px; flex-wrap: wrap; }
  .pill {
    font-size: 0.6rem; padding: 2px 8px; border-radius: 999px;
    font-family: 'DM Mono', monospace;
  }
  .pill-g { background: var(--accent-lt); color: var(--accent2); }
  .pill-b { background: var(--blue-lt);   color: var(--blue); }
  .pill-r { background: var(--red-lt);    color: var(--red); }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

  .info-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; box-shadow: var(--shadow);
  }
  .info-card-head {
    padding: 13px 18px 11px; border-bottom: 1px solid var(--border);
    font-size: 0.75rem; font-weight: 600; color: var(--muted);
    display: flex; align-items: center; gap: 7px;
  }
  .info-card-body { padding: 14px 18px; }
  .info-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 7px 0; border-bottom: 1px solid rgba(226,221,212,0.4); font-size: 0.78rem; gap: 8px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-row .lbl { color: var(--muted); }
  .info-row .val { font-family: 'DM Mono', monospace; font-size: 0.73rem; text-align: right; }

  /* Score gauge (grande) */
  .gauge-wrap {
    text-align: center; padding: 20px 18px 16px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border-radius: 14px; box-shadow: var(--shadow);
  }
  .gauge-label {
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: rgba(255,255,255,0.6); margin-bottom: 14px;
  }
  .gauge-score {
    font-family: 'DM Serif Display', serif; font-size: 3.2rem;
    color: #fff; line-height: 1; margin-bottom: 4px;
  }
  .gauge-clasi {
    font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 14px;
  }
  .gauge-bar-bg {
    height: 6px; background: rgba(255,255,255,0.2); border-radius: 999px; overflow: hidden; margin-bottom: 8px;
  }
  .gauge-bar-fill {
    height: 100%; border-radius: 999px; background: rgba(255,255,255,0.8);
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }
  .gauge-range {
    display: flex; justify-content: space-between;
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    color: rgba(255,255,255,0.5);
  }

  /* Leyenda clasificaciones */
  .clasi-legend { display: flex; flex-direction: column; gap: 7px; }
  .clasi-legend-row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 0.72rem;
  }
  .clasi-legend-range { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--muted); }

  /* Empty state */
  .empty-state {
    text-align: center; padding: 48px 32px; color: var(--muted);
  }
  .empty-state-icon { font-size: 2.5rem; margin-bottom: 14px; }
  .empty-state-title { font-family: 'DM Serif Display', serif; font-size: 1.1rem; color: var(--text); margin-bottom: 6px; }
  .empty-state-sub   { font-size: 0.82rem; line-height: 1.6; }

  @media (max-width: 700px) {
    .layout { grid-template-columns: 1fr; }
    .kpi-row { grid-template-columns: repeat(2, 1fr); }
    .kpi-row .kpi-card:first-child { grid-column: 1/-1; }
    .sidebar { position: static; }
    .page-header { flex-direction: column; }
    .root { padding: 24px 14px 60px; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

const scoreColor = (s) => {
  if (s >= 800) return "#2d6a4f";
  if (s >= 650) return "#1e40af";
  if (s >= 500) return "#b8952a";
  if (s >= 350) return "#8b3a1a";
  return "#c0392b";
};

const clasi = (s) => {
  if (s >= 800) return "EXCELENTE";
  if (s >= 650) return "BUENO";
  if (s >= 500) return "REGULAR";
  if (s >= 350) return "MALO";
  return "MUY_MALO";
};

const clasiLabel = (c) => c === "MUY_MALO" ? "MUY MALO" : c;

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_EMPRESA = {
  id: 1, ruc: "20123456781",
  razon_social: "DISTRIBUIDORA NORTE S.A.C.",
  score: 720, clasificacion: "BUENO",
};

const genHistorial = () => {
  const data = {};
  [2024, 2025, 2026].forEach(anio => {
    const meses = anio === 2026 ? 2 : 12;
    let score = anio === 2024 ? 580 : anio === 2025 ? 650 : 700;
    data[anio] = [];
    for (let m = 1; m <= meses; m++) {
      const prev = score;
      const antic = Math.floor(Math.random() * 6) + 1;
      const punt  = Math.floor(Math.random() * 4);
      const tard  = Math.floor(Math.random() * 3);
      const var_  = (antic * 2) - (tard * 4) + (Math.random() > 0.5 ? 5 : -3);
      score = Math.max(300, Math.min(1000, score + var_));
      data[anio].push({
        mes: m, anio,
        score: Math.round(score),
        score_anterior: Math.round(prev),
        variacion_score: Math.round(score - prev),
        clasificacion: clasi(score),
        total_transacciones: Math.floor(Math.random() * 12) + 2,
        transacciones_morosas: tard,
        promedio_dias_retraso: +(Math.random() * (tard > 0 ? 8 : 1)).toFixed(1),
        pagos_anticipados: antic,
        pagos_puntuales:   punt,
        pagos_tardios:     tard,
      });
    }
  });
  return data;
};

const HISTORIAL = genHistorial();
const ANIOS = Object.keys(HISTORIAL).map(Number).sort((a,b) => b-a);

// ─── Mini gráfico SVG ────────────────────────────────────────────────────────
function LineChart({ data, width = 520, height = 160 }) {
  const [tooltip, setTooltip] = useState(null);
  const pad = { t:16, r:20, b:36, l:44 };
  const W = width - pad.l - pad.r;
  const H = height - pad.t - pad.b;

  const scores = data.map(d => d.score);
  const minS = Math.max(0,   Math.min(...scores) - 50);
  const maxS = Math.min(1000,Math.max(...scores) + 50);

  const xOf = (i) => pad.l + (i / (data.length - 1)) * W;
  const yOf = (s) => pad.t + H - ((s - minS) / (maxS - minS)) * H;

  const points = data.map((d,i) => ({ x: xOf(i), y: yOf(d.score), d }));

  const linePath = points.map((p,i) => `${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = [
    ...points.map((p,i) => `${i===0?"M":"L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `L${points[points.length-1].x.toFixed(1)},${(pad.t+H).toFixed(1)}`,
    `L${points[0].x.toFixed(1)},${(pad.t+H).toFixed(1)}`, "Z"
  ].join(" ");

  // Y grid lines
  const yTicks = [300,400,500,600,700,800,900,1000].filter(v => v >= minS && v <= maxS);

  return (
    <div className="chart-container" style={{position:"relative"}}>
      {tooltip && (
        <div className="chart-tooltip" style={{left: tooltip.x, top: tooltip.y - 8, opacity:1}}>
          <div style={{marginBottom:2}}>{MESES[tooltip.d.mes-1]} {tooltip.d.anio}</div>
          <div style={{fontSize:"1rem",fontFamily:"DM Serif Display,serif"}}>{tooltip.d.score} pts</div>
          <div style={{color:"rgba(255,255,255,0.6)",fontSize:"0.65rem"}}>{clasiLabel(tooltip.d.clasificacion)}</div>
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#2d6a4f" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#1a3a2a"/>
            <stop offset="100%" stopColor="#2d6a4f"/>
          </linearGradient>
        </defs>

        {/* Y grid */}
        {yTicks.map(v => (
          <g key={v}>
            <line
              x1={pad.l} x2={pad.l+W}
              y1={yOf(v)} y2={yOf(v)}
              stroke="#e2ddd4" strokeWidth="1" strokeDasharray="3 3"
            />
            <text x={pad.l-6} y={yOf(v)+4} textAnchor="end"
              style={{fontSize:"0.58rem",fontFamily:"DM Mono,monospace",fill:"#8a8278"}}>
              {v}
            </text>
          </g>
        ))}

        {/* X labels */}
        {points.map((p,i) => (
          <text key={i} x={p.x} y={pad.t+H+18} textAnchor="middle"
            style={{fontSize:"0.58rem",fontFamily:"DM Mono,monospace",fill:"#8a8278"}}>
            {MESES[p.d.mes-1]}
          </text>
        ))}

        {/* Area */}
        <path d={areaPath} fill="url(#area-grad)"/>

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#line-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>

        {/* Puntos */}
        {points.map((p,i) => (
          <g key={i}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.closest("svg").getBoundingClientRect();
              const svgRect = e.currentTarget.closest(".chart-container").getBoundingClientRect();
              setTooltip({ x: p.x / width * (svgRect.width), y: p.y / height * (svgRect.height), d: p.d });
            }}
            onMouseLeave={() => setTooltip(null)}
            style={{cursor:"pointer"}}
          >
            <circle cx={p.x} cy={p.y} r="8" fill="transparent"/>
            <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={scoreColor(p.d.score)} strokeWidth="2.5"/>
          </g>
        ))}
      </svg>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function HistorialScorePanel({ empresa: empresaProp }) {

  const empresa  = empresaProp ?? MOCK_EMPRESA;
  const [anio, setAnio] = useState(ANIOS[0]);

  const historial = HISTORIAL[anio] ?? [];
  const mesActual = new Date().getMonth() + 1;
  const anioActual = new Date().getFullYear();

  // KPIs del año seleccionado
  const kpis = useMemo(() => {
    if (!historial.length) return null;
    const ultimo = historial[historial.length - 1];
    const totalAntic  = historial.reduce((s,m) => s + m.pagos_anticipados, 0);
    const totalMorosos = historial.reduce((s,m) => s + m.pagos_tardios, 0);
    const varTotal = historial.reduce((s,m) => s + (m.variacion_score||0), 0);
    return { ultimo, totalAntic, totalMorosos, varTotal };
  }, [historial]);

  return (
    <>
      <style>{css}</style>
      <div className="root">

        {/* Header */}
        <div className="page-header" style={{maxWidth:900}}>
          <div>
            <div className="eyebrow">Score Crediticio — Historial</div>
            <h1>Historial de Score</h1>
            <p>Evolución del score crediticio por mes y año.</p>
          </div>
          <div className="empresa-chip">
            <div className="empresa-chip-icon">🏢</div>
            <div>
              <div className="empresa-chip-name">{empresa.razon_social}</div>
              <div className="empresa-chip-ruc">RUC {empresa.ruc}</div>
            </div>
          </div>
        </div>

        {/* Selector de año */}
        <div className="anio-selector">
          <span className="anio-label">Año</span>
          {ANIOS.map(a => (
            <button key={a} className={`anio-btn ${anio===a?"active":""}`} onClick={() => setAnio(a)}>
              {a}
            </button>
          ))}
        </div>

        {/* KPIs */}
        {kpis && (
          <div className="kpi-row" style={{maxWidth:900}}>
            <div className="kpi-card k-score">
              <div className="kpi-label">Score actual</div>
              <div className="kpi-val" style={{color: scoreColor(kpis.ultimo.score)}}>{kpis.ultimo.score}</div>
              <div className="kpi-sub">de 1000 pts</div>
            </div>
            <div className="kpi-card k-clasi">
              <div className="kpi-label">Clasificación</div>
              <div className="kpi-val" style={{fontSize:"1.1rem",marginTop:6}}>
                <span className={`clasi-badge clasi-${kpis.ultimo.clasificacion}`}>
                  {clasiLabel(kpis.ultimo.clasificacion)}
                </span>
              </div>
              <div className="kpi-sub">Último mes registrado</div>
            </div>
            <div className="kpi-card k-antic">
              <div className="kpi-label">Pagos anticipados</div>
              <div className="kpi-val">{kpis.totalAntic}</div>
              <div className="kpi-sub">En el año {anio}</div>
            </div>
            <div className="kpi-card k-moroso">
              <div className="kpi-label">Pagos tardíos</div>
              <div className="kpi-val" style={{color: kpis.totalMorosos > 5 ? "var(--red)" : "var(--text)"}}>
                {kpis.totalMorosos}
              </div>
              <div className="kpi-sub">En el año {anio}</div>
            </div>
            <div className="kpi-card k-variacion">
              <div className="kpi-label">Variación año</div>
              <div className={`kpi-val ${kpis.varTotal>=0?"":"" }`}
                style={{color: kpis.varTotal > 0 ? "var(--accent2)" : kpis.varTotal < 0 ? "var(--red)" : "var(--muted)"}}>
                {kpis.varTotal > 0 ? "+" : ""}{kpis.varTotal}
              </div>
              <div className={`kpi-trend ${kpis.varTotal>0?"trend-up":kpis.varTotal<0?"trend-down":"trend-flat"}`}>
                {kpis.varTotal > 0 ? "▲ Mejora" : kpis.varTotal < 0 ? "▼ Baja" : "— Estable"}
              </div>
            </div>
          </div>
        )}

        {/* Layout */}
        <div className="layout">

          {/* Col principal */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>

            {/* Gráfico */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-icon" style={{background:"#e8f0eb"}}>📈</div>
                <div>
                  <div className="card-head-title">Evolución del score — {anio}</div>
                  <div className="card-head-sub">Puntuación mensual · pasa el cursor por los puntos</div>
                </div>
              </div>
              <div className="card-body">
                {historial.length >= 2
                  ? <div className="chart-wrap"><LineChart data={historial}/></div>
                  : <div className="empty-state">
                      <div className="empty-state-icon">📊</div>
                      <div className="empty-state-title">Pocos datos</div>
                      <div className="empty-state-sub">Se necesitan al menos 2 meses para mostrar la gráfica.</div>
                    </div>
                }
              </div>
            </div>

            {/* Tabla mensual */}
            <div className="card">
              <div className="card-head">
                <div className="card-head-icon" style={{background:"#faf4e1"}}>🗓</div>
                <div>
                  <div className="card-head-title">Detalle mensual — {anio}</div>
                  <div className="card-head-sub">Todos los registros del año seleccionado</div>
                </div>
              </div>
              <div className="card-body" style={{padding:0}}>
                {historial.length > 0 ? (
                  <table className="mes-table">
                    <thead>
                      <tr>
                        <th>Mes</th>
                        <th>Score</th>
                        <th>Clasificación</th>
                        <th>Variación</th>
                        <th>Pagos</th>
                        <th>Prom. retraso</th>
                        <th>Trans.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historial.map((m) => {
                        const esActual = m.mes === mesActual && m.anio === anioActual;
                        return (
                          <tr key={m.mes} className={esActual ? "mes-actual" : ""}>
                            <td>
                              <div className="mes-name">{MESES[m.mes-1]}</div>
                              {esActual && (
                                <div style={{fontSize:"0.6rem",color:"var(--accent2)",fontFamily:"DM Mono,monospace"}}>actual</div>
                              )}
                            </td>
                            <td>
                              <div className="mes-score-val" style={{color: scoreColor(m.score)}}>{m.score}</div>
                              <div className="score-mini-bar" style={{marginTop:4}}>
                                <div className="score-mini-fill"
                                  style={{width:`${(m.score/1000)*100}%`, background: scoreColor(m.score)}}/>
                              </div>
                            </td>
                            <td>
                              <span className={`clasi-badge clasi-${m.clasificacion}`}>
                                {clasiLabel(m.clasificacion)}
                              </span>
                            </td>
                            <td>
                              <span className={`var-tag ${m.variacion_score>0?"var-pos":m.variacion_score<0?"var-neg":"var-neu"}`}>
                                {m.variacion_score > 0 ? "+" : ""}{m.variacion_score ?? "—"}
                              </span>
                            </td>
                            <td>
                              <div className="pagos-pills">
                                {m.pagos_anticipados > 0 && <span className="pill pill-g">▲{m.pagos_anticipados}</span>}
                                {m.pagos_puntuales   > 0 && <span className="pill pill-b">={m.pagos_puntuales}</span>}
                                {m.pagos_tardios     > 0 && <span className="pill pill-r">▼{m.pagos_tardios}</span>}
                              </div>
                            </td>
                            <td>
                              <span style={{
                                fontFamily:"DM Mono,monospace",fontSize:"0.75rem",
                                color: m.promedio_dias_retraso > 3 ? "var(--red)" : "var(--muted)"
                              }}>
                                {m.promedio_dias_retraso > 0 ? `${m.promedio_dias_retraso}d` : "—"}
                              </span>
                            </td>
                            <td>
                              <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.75rem"}}>
                                {m.total_transacciones}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <div className="empty-state-title">Sin registros</div>
                    <div className="empty-state-sub">No hay historial para el año {anio}.</div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="sidebar">

            {/* Score gauge */}
            {kpis && (
              <div className="gauge-wrap">
                <div className="gauge-label">Score crediticio · {anio}</div>
                <div className="gauge-score">{kpis.ultimo.score}</div>
                <div className="gauge-clasi">{clasiLabel(kpis.ultimo.clasificacion)}</div>
                <div className="gauge-bar-bg">
                  <div className="gauge-bar-fill" style={{width:`${(kpis.ultimo.score/1000)*100}%`}}/>
                </div>
                <div className="gauge-range"><span>0</span><span>1000</span></div>
              </div>
            )}

            {/* Leyenda clasificaciones */}
            <div className="info-card">
              <div className="info-card-head">🏷 Clasificaciones</div>
              <div className="info-card-body">
                <div className="clasi-legend">
                  {[
                    {label:"EXCELENTE", range:"800–1000", cls:"clasi-EXCELENTE"},
                    {label:"BUENO",     range:"650–799",  cls:"clasi-BUENO"},
                    {label:"REGULAR",   range:"500–649",  cls:"clasi-REGULAR"},
                    {label:"MALO",      range:"350–499",  cls:"clasi-MALO"},
                    {label:"MUY MALO",  range:"0–349",    cls:"clasi-MUY_MALO"},
                  ].map(c => (
                    <div className="clasi-legend-row" key={c.label}>
                      <span className={`clasi-badge ${c.cls}`}>{c.label}</span>
                      <span className="clasi-legend-range">{c.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Leyenda pagos */}
            <div className="info-card">
              <div className="info-card-head">💡 Leyenda pagos</div>
              <div className="info-card-body">
                {[
                  {pill:"pill-g", sym:"▲", label:"Anticipado", desc:"Antes del vencimiento"},
                  {pill:"pill-b", sym:"=", label:"Puntual",    desc:"El día del vencimiento"},
                  {pill:"pill-r", sym:"▼", label:"Tardío",     desc:"Después del vencimiento"},
                ].map(l => (
                  <div className="info-row" key={l.label}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span className={`pill ${l.pill}`}>{l.sym}</span>
                      <span style={{fontWeight:500,fontSize:"0.78rem"}}>{l.label}</span>
                    </div>
                    <span className="lbl" style={{fontSize:"0.68rem"}}>{l.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen comparativo años */}
            <div className="info-card">
              <div className="info-card-head">📅 Por año</div>
              <div className="info-card-body">
                {ANIOS.map(a => {
                  const h = HISTORIAL[a];
                  if (!h?.length) return null;
                  const ult = h[h.length-1];
                  return (
                    <div className="info-row" key={a}>
                      <span className="lbl">{a}</span>
                      <div style={{display:"flex",alignItems:"center",gap:7}}>
                        <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.75rem",color:scoreColor(ult.score),fontWeight:600}}>
                          {ult.score}
                        </span>
                        <span className={`clasi-badge clasi-${ult.clasificacion}`} style={{fontSize:"0.52rem"}}>
                          {clasiLabel(ult.clasificacion)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
