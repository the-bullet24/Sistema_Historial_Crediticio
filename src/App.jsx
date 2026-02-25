import { useState } from "react";
import EmpresaPanel from "./EmpresaPanel";
import TransaccionPanel from "./TransaccionPanel";
import PagoPanel from "./PagoPanel";
import HistorialScorePanel from "./HistorialScorePanel";

// ─── Estilos globales de navegación ─────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #f4f1eb;
    --surface:   #fffefb;
    --border:    #e2ddd4;
    --text:      #1a1714;
    --muted:     #8a8278;
    --accent:    #1a3a2a;
    --accent2:   #2d6a4f;
    --accent-lt: #e8f0eb;
    --shadow:    0 2px 8px rgba(26,23,20,0.08);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12);
  }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  /* ── Topbar ── */
  .topbar {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,254,251,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex; align-items: center;
    height: 56px; gap: 0;
  }

  .topbar-brand {
    display: flex; align-items: center; gap: 10px;
    margin-right: 32px; flex-shrink: 0;
  }
  .topbar-brand-icon {
    width: 30px; height: 30px; border-radius: 7px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem;
  }
  .topbar-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem; font-weight: 400; color: var(--text);
  }
  .topbar-brand-tag {
    font-family: 'DM Mono', monospace; font-size: 0.55rem;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--muted);
  }

  /* ── Stepper nav ── */
  .nav-steps {
    display: flex; align-items: center; gap: 0; flex: 1;
  }

  .nav-step {
    display: flex; align-items: center; gap: 8px;
    padding: 0 16px; height: 56px;
    cursor: pointer; position: relative;
    transition: background 0.2s;
    border-bottom: 2px solid transparent;
    user-select: none;
  }
  .nav-step:hover:not(.disabled) { background: rgba(26,58,42,0.03); }
  .nav-step.active  { border-bottom-color: var(--accent); }
  .nav-step.done    { border-bottom-color: var(--accent2); cursor: pointer; }
  .nav-step.disabled{ cursor: not-allowed; opacity: 0.4; }

  .nav-step-num {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; font-weight: 700;
    font-family: 'DM Mono', monospace;
    background: var(--border); color: var(--muted);
    transition: background 0.2s, color 0.2s; flex-shrink: 0;
  }
  .nav-step.active  .nav-step-num { background: var(--accent);  color: #fff; }
  .nav-step.done    .nav-step-num { background: var(--accent2); color: #fff; }

  .nav-step-info { display: flex; flex-direction: column; }
  .nav-step-label {
    font-size: 0.78rem; font-weight: 600; color: var(--muted);
    transition: color 0.2s; white-space: nowrap;
  }
  .nav-step.active .nav-step-label { color: var(--accent); }
  .nav-step.done   .nav-step-label { color: var(--accent2); }

  .nav-step-sub {
    font-size: 0.62rem; color: var(--muted);
    font-family: 'DM Mono', monospace;
    white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; max-width: 140px;
  }

  .nav-sep {
    color: var(--border); font-size: 1rem; flex-shrink: 0; padding: 0 2px;
  }

  /* Empresa pill en topbar */
  .topbar-empresa {
    margin-left: auto; flex-shrink: 0;
    display: flex; align-items: center; gap: 8px;
    padding: 5px 12px; border-radius: 8px;
    background: var(--accent-lt); border: 1px solid rgba(45,106,79,0.2);
  }
  .topbar-empresa-name {
    font-size: 0.72rem; font-weight: 600; color: var(--accent);
    max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .topbar-empresa-ruc {
    font-family: 'DM Mono', monospace; font-size: 0.6rem; color: var(--accent2);
  }

  /* Botón reset */
  .btn-reset {
    margin-left: 12px; padding: 5px 12px; border-radius: 8px;
    border: 1.5px solid var(--border); background: transparent;
    font-family: 'DM Sans', sans-serif; font-size: 0.72rem; font-weight: 600;
    color: var(--muted); cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 5px;
  }
  .btn-reset:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-lt); }

  /* Page transition */
  .page-enter {
    animation: pageIn 0.3s ease;
  }
  @keyframes pageIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 680px) {
    .topbar { padding: 0 16px; }
    .nav-step-sub { display: none; }
    .nav-step { padding: 0 10px; }
    .topbar-brand-tag { display: none; }
    .nav-step-label { font-size: 0.7rem; }
  }
  @media (max-width: 480px) {
    .topbar-empresa { display: none; }
    .nav-sep { display: none; }
  }
`;

// ─── Pasos del flujo ──────────────────────────────────────────────────────────
const STEPS = [
  { key: "empresa",     label: "Empresa",     icon: "🏢", sub: "Buscar o registrar" },
  { key: "transaccion", label: "Transacción",  icon: "💳", sub: "Crear venta a crédito" },
  { key: "pago",        label: "Pago",         icon: "💰", sub: "Registrar abono" },
  { key: "historial",   label: "Score",        icon: "📈", sub: "Ver historial" },
];

// ─── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]             = useState("empresa");
  const [empresa, setEmpresa]       = useState(null);
  const [transaccion, setTrans]     = useState(null);
  const [pageKey, setPageKey]       = useState(0); // para re-animar

  // Pasos alcanzados
  const stepsReached = {
    empresa:     true,
    transaccion: !!empresa,
    pago:        !!empresa && !!transaccion,
    historial:   !!empresa,
  };

  const goTo = (key) => {
    if (!stepsReached[key]) return;
    setStep(key);
    setPageKey(k => k + 1);
  };

  const handleReset = () => {
    setEmpresa(null);
    setTrans(null);
    setStep("empresa");
    setPageKey(k => k + 1);
  };

  const stepIndex = (key) => STEPS.findIndex(s => s.key === key);

  // ── Callbacks de cada panel ──────────────────────────────────────────────
  const onEmpresaSeleccionada = (emp) => {
    setEmpresa(emp);
    setStep("transaccion");
    setPageKey(k => k + 1);
  };

  const onTransaccionCreada = (trx) => {
    setTrans(trx);
    setStep("pago");
    setPageKey(k => k + 1);
  };

  const onPagoRegistrado = () => {
    setStep("historial");
    setPageKey(k => k + 1);
  };

  return (
    <>
      <style>{css}</style>

      {/* ── Topbar ── */}
      <nav className="topbar">
        {/* Brand */}
        <div className="topbar-brand">
          <div className="topbar-brand-icon">📊</div>
          <div>
            <div className="topbar-brand-name">ScoreCredit</div>
            <div className="topbar-brand-tag">Sistema crediticio</div>
          </div>
        </div>

        {/* Steps */}
        <div className="nav-steps">
          {STEPS.map((s, i) => {
            const current = step === s.key;
            const done    = stepsReached[s.key] && stepIndex(step) > i;
            const disabled = !stepsReached[s.key];

            return (
              <div key={s.key} style={{display:"flex",alignItems:"center"}}>
                <div
                  className={`nav-step ${current?"active":""} ${done?"done":""} ${disabled?"disabled":""}`}
                  onClick={() => goTo(s.key)}
                  title={disabled ? "Completa el paso anterior primero" : s.label}
                >
                  <div className="nav-step-num">
                    {done ? "✓" : i + 1}
                  </div>
                  <div className="nav-step-info">
                    <span className="nav-step-label">{s.label}</span>
                    <span className="nav-step-sub">
                      {s.key === "empresa"     && empresa     ? empresa.razon_social.slice(0,20) + "…"
                      : s.key === "transaccion" && transaccion ? transaccion.codigo_transaccion?.slice(-8)
                      : s.sub}
                    </span>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="nav-sep">›</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Empresa activa + reset */}
        {empresa && (
          <>
            <div className="topbar-empresa">
              <span style={{fontSize:"0.8rem"}}>🏢</span>
              <div>
                <div className="topbar-empresa-name">{empresa.razon_social}</div>
                <div className="topbar-empresa-ruc">RUC {empresa.ruc}</div>
              </div>
            </div>
            <button className="btn-reset" onClick={handleReset} title="Iniciar nuevo flujo">
              ↺ Nuevo
            </button>
          </>
        )}
      </nav>

      {/* ── Contenido ── */}
      <div key={pageKey} className="page-enter">
        {step === "empresa" && (
          <EmpresaPanel
            onEmpresaSeleccionada={onEmpresaSeleccionada}
          />
        )}

        {step === "transaccion" && empresa && (
          <TransaccionPanel
            empresa={empresa}
            onTransaccionCreada={onTransaccionCreada}
          />
        )}

        {step === "pago" && empresa && transaccion && (
          <PagoPanel
            empresa={empresa}
            transaccion={transaccion}
            onPagoRegistrado={onPagoRegistrado}
          />
        )}

        {step === "historial" && empresa && (
          <HistorialScorePanel
            empresa={empresa}
          />
        )}
      </div>
    </>
  );
}
