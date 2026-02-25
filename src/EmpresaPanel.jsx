import { useState } from "react";

// ─── Paleta & estilos base ───────────────────────────────────────────────────
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
    --shadow:    0 2px 8px rgba(26,23,20,0.08), 0 1px 2px rgba(26,23,20,0.04);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12), 0 2px 8px rgba(26,23,20,0.06);
  }

  body {
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    min-height: 100vh;
  }

  .panel-root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 20% 0%, rgba(45,106,79,0.06) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 100%, rgba(184,149,42,0.05) 0%, transparent 60%);
    padding: 48px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Header */
  .panel-header {
    width: 100%;
    max-width: 680px;
    margin-bottom: 40px;
  }
  .panel-header .eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent2);
    margin-bottom: 8px;
  }
  .panel-header h1 {
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    font-weight: 400;
    color: var(--text);
    line-height: 1.15;
  }
  .panel-header p {
    margin-top: 10px;
    color: var(--muted);
    font-size: 0.9rem;
    font-weight: 300;
    line-height: 1.6;
  }

  /* Steps indicator */
  .steps {
    width: 100%;
    max-width: 680px;
    display: flex;
    gap: 0;
    margin-bottom: 32px;
  }
  .step {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
    border-bottom: 2px solid var(--border);
    transition: border-color 0.3s;
  }
  .step.active { border-color: var(--accent); }
  .step.done   { border-color: var(--accent2); }
  .step-num {
    width: 26px; height: 26px;
    border-radius: 50%;
    background: var(--border);
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    font-family: 'DM Mono', monospace;
    transition: background 0.3s, color 0.3s;
    flex-shrink: 0;
  }
  .step.active .step-num { background: var(--accent); color: #fff; }
  .step.done   .step-num { background: var(--accent2); color: #fff; }
  .step-label {
    font-size: 0.72rem;
    font-weight: 500;
    color: var(--muted);
    transition: color 0.3s;
  }
  .step.active .step-label { color: var(--accent); }
  .step.done   .step-label { color: var(--accent2); }

  /* Card */
  .card {
    width: 100%;
    max-width: 680px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    animation: slideUp 0.35s ease;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-head {
    padding: 24px 32px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .card-head-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
    flex-shrink: 0;
  }
  .card-head-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.15rem;
    font-weight: 400;
    color: var(--text);
  }
  .card-head-sub {
    font-size: 0.75rem;
    color: var(--muted);
    margin-top: 2px;
  }
  .card-body { padding: 28px 32px; }

  /* RUC search */
  .ruc-search-wrap {
    display: flex;
    gap: 10px;
    margin-bottom: 0;
  }
  .ruc-input-group {
    flex: 1;
    position: relative;
  }
  .ruc-input-group label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
    font-family: 'DM Mono', monospace;
  }
  .ruc-input-group input {
    width: 100%;
    padding: 12px 16px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-family: 'DM Mono', monospace;
    font-size: 1rem;
    color: var(--text);
    letter-spacing: 0.05em;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ruc-input-group input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,58,42,0.08);
  }
  .ruc-input-group input::placeholder { color: var(--border2); }

  /* Buttons */
  .btn {
    padding: 12px 22px;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    transition: all 0.18s;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    white-space: nowrap;
  }
  .btn-primary {
    background: var(--accent);
    color: #fff;
    box-shadow: 0 2px 8px rgba(26,58,42,0.25);
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--accent2);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,58,42,0.3);
  }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-outline {
    background: transparent;
    color: var(--accent);
    border: 1.5px solid var(--accent);
  }
  .btn-outline:hover { background: var(--accent-lt); }

  .btn-ghost {
    background: transparent;
    color: var(--muted);
    border: 1.5px solid var(--border);
  }
  .btn-ghost:hover { background: var(--bg); color: var(--text); }

  .btn-danger {
    background: transparent;
    color: var(--warn);
    border: 1.5px solid var(--warn);
  }
  .btn-danger:hover { background: var(--warn-lt); }

  .btn-sm { padding: 8px 14px; font-size: 0.78rem; }

  /* Alerts */
  .alert {
    padding: 14px 16px;
    border-radius: 10px;
    font-size: 0.82rem;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-top: 16px;
    line-height: 1.5;
  }
  .alert-found   { background: var(--accent-lt); border: 1px solid rgba(45,106,79,0.2); color: var(--accent); }
  .alert-notfound{ background: var(--gold-lt);   border: 1px solid rgba(184,149,42,0.2); color: #7a6010; }
  .alert-error   { background: var(--warn-lt);   border: 1px solid rgba(139,58,26,0.2); color: var(--warn); }

  /* Empresa found card */
  .empresa-found {
    margin-top: 20px;
    padding: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    animation: slideUp 0.25s ease;
  }
  .empresa-found-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
  }
  .empresa-found-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    color: var(--text);
  }
  .empresa-found-ruc {
    font-family: 'DM Mono', monospace;
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 3px;
  }
  .estado-badge {
    font-size: 0.65rem;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .estado-activo   { background: var(--accent-lt); color: var(--accent2); }
  .estado-inactivo { background: var(--warn-lt);   color: var(--warn); }

  .empresa-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .empresa-field {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .empresa-field-label {
    font-size: 0.62rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }
  .empresa-field-value {
    font-size: 0.83rem;
    color: var(--text);
    font-weight: 500;
  }

  /* Form */
  .form-section-title {
    font-family: 'DM Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 20px;
    margin-bottom: 24px;
  }
  .form-grid.full { grid-template-columns: 1fr; }
  .form-col-span { grid-column: 1 / -1; }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
  }
  .field input, .field select {
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    appearance: none;
  }
  .field input:focus, .field select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,58,42,0.08);
  }
  .field input.error { border-color: var(--red); }
  .field-error {
    font-size: 0.68rem;
    color: var(--red);
    font-family: 'DM Mono', monospace;
  }
  .field input::placeholder { color: var(--border2); }
  .field-required::after { content: ' *'; color: var(--red); }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 20px;
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }

  /* Divider */
  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: var(--muted);
    font-size: 0.72rem;
    font-family: 'DM Mono', monospace;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* Spinner */
  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  .spinner-dark {
    border-color: rgba(26,58,42,0.2);
    border-top-color: var(--accent);
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Score preview */
  .score-preview {
    margin-top: 20px;
    padding: 16px 20px;
    background: var(--gold-lt);
    border: 1px solid rgba(184,149,42,0.25);
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .score-circle {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .score-circle-val {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    color: #fff;
    line-height: 1;
  }
  .score-circle-label {
    font-size: 0.42rem;
    color: rgba(255,255,255,0.7);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'DM Mono', monospace;
  }
  .score-info-label {
    font-size: 0.68rem;
    color: #7a6010;
    font-family: 'DM Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 2px;
  }
  .score-info-val {
    font-family: 'DM Serif Display', serif;
    font-size: 0.95rem;
    color: var(--text);
  }
  .score-info-sub {
    font-size: 0.72rem;
    color: var(--muted);
    margin-top: 2px;
  }

  /* Success */
  .success-wrap {
    text-align: center;
    padding: 40px 32px;
    animation: slideUp 0.35s ease;
  }
  .success-icon {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem;
    margin: 0 auto 20px;
  }
  .success-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.4rem;
    color: var(--text);
    margin-bottom: 8px;
  }
  .success-sub {
    color: var(--muted);
    font-size: 0.85rem;
    line-height: 1.6;
    max-width: 360px;
    margin: 0 auto 24px;
  }

  @media (max-width: 600px) {
    .form-grid { grid-template-columns: 1fr; }
    .empresa-grid { grid-template-columns: 1fr; }
    .panel-root { padding: 24px 16px; }
    .card-body { padding: 20px 20px; }
    .card-head { padding: 18px 20px 16px; }
    .panel-header h1 { font-size: 1.6rem; }
    .steps { gap: 0; }
    .step-label { display: none; }
  }
`;

// ─── Configuración del backend ───────────────────────────────────────────────
const BASE_URL = "http://localhost:8080/api";

// Convierte camelCase del backend → snake_case que usa el frontend
const mapEmpresa = (e) => ({
  id:              e.id,
  ruc:             e.ruc,
  razon_social:    e.razonSocial    ?? e.razon_social    ?? "",
  direccion:       e.direccion      ?? "",
  rubro:           e.rubro          ?? "",
  correo_contacto: e.correoContacto ?? e.correo_contacto ?? "",
  telefono:        e.telefono       ?? "",
  fecha_registro:  e.fechaRegistro  ?? e.fecha_registro  ?? null,
  estado:          e.estado         ?? "activo",
  score:           e.score          ?? null,
  clasificacion:   e.clasificacion  ?? null,
});

// ─── API real conectada al backend Spring Boot ───────────────────────────────
const mockAPI = {
  buscarPorRUC: async (ruc) => {
    const res = await fetch(`${BASE_URL}/empresas`);
    if (!res.ok) throw new Error("Error al conectar con el servidor");
    const lista = await res.json();
    const encontrada = lista.find(e => e.ruc === ruc);
    if (encontrada) return { found: true, data: mapEmpresa(encontrada) };
    return { found: false };
  },

  registrarEmpresa: async (data) => {
    const payload = {
      ruc:            data.ruc,
      razonSocial:    data.razon_social,
      direccion:      data.direccion,
      rubro:          data.rubro,
      correoContacto: data.correo_contacto,
      telefono:       data.telefono,
      estado:         data.estado,
    };
    const res = await fetch(`${BASE_URL}/empresas`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al registrar la empresa");
    const created = await res.json();
    return { success: true, id: created.id };
  },
};

const RUBROS = [
  "Distribución y Logística",
  "Manufactura",
  "Comercio Minorista",
  "Comercio Mayorista",
  "Construcción",
  "Servicios Financieros",
  "Tecnología",
  "Salud",
  "Educación",
  "Agropecuario",
  "Minería",
  "Transporte",
  "Otro",
];

// ─── Componente principal ────────────────────────────────────────────────────
export default function EmpresaPanel({ onEmpresaSeleccionada }) {
  const [step, setStep] = useState(1); // 1: buscar, 2: resultado, 3: éxito
  const [ruc, setRuc] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null); // null | {found, data}
  const [searchError, setSearchError] = useState("");
  const [mode, setMode] = useState(null); // "found" | "new"
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const [form, setForm] = useState({
    ruc: "",
    razon_social: "",
    direccion: "",
    rubro: "",
    correo_contacto: "",
    telefono: "",
    estado: "activo",
  });
  const [errors, setErrors] = useState({});

  // ── Buscar por RUC
  const handleBuscar = async () => {
    if (!/^\d{11}$/.test(ruc)) {
      setSearchError("El RUC debe tener exactamente 11 dígitos.");
      return;
    }
    setSearchError("");
    setSearching(true);
    setSearchResult(null);
    setMode(null);

    try {
      const res = await mockAPI.buscarPorRUC(ruc);
      setSearchResult(res);
      if (res.found) {
        setMode("found");
        setEmpresaSeleccionada(res.data);
      } else {
        setMode("new");
        setForm(f => ({ ...f, ruc }));
      }
      setStep(2);
    } catch {
      setSearchResult({ error: true });
    } finally {
      setSearching(false);
    }
  };

  // ── Seleccionar empresa encontrada
  const handleUsarEmpresa = () => {
    setStep(3);
    onEmpresaSeleccionada?.(empresaSeleccionada);
  };

  // ── Validar formulario
  const validate = () => {
    const e = {};
    if (!form.razon_social.trim()) e.razon_social = "Campo requerido";
    if (!form.direccion.trim())   e.direccion    = "Campo requerido";
    if (!form.rubro)               e.rubro        = "Selecciona un rubro";
    if (form.correo_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo_contacto))
      e.correo_contacto = "Correo inválido";
    return e;
  };

  // ── Guardar nueva empresa
  const handleGuardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSaving(true);
    try {
      const res = await mockAPI.registrarEmpresa(form);
      setSavedId(res.id);
      const nuevaEmpresa = { ...form, id: res.id };
      setEmpresaSeleccionada(nuevaEmpresa);
      setStep(3);
      onEmpresaSeleccionada?.(nuevaEmpresa);
    } catch {
      setErrors({ _global: "Error al guardar. Intenta nuevamente." });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setStep(1); setRuc(""); setSearchResult(null);
    setMode(null); setEmpresaSeleccionada(null);
    setSavedId(null);
    setForm({ ruc:"",razon_social:"",direccion:"",rubro:"",correo_contacto:"",telefono:"",estado:"activo" });
    setErrors({});
  };

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n={...e}; delete n[k]; return n; });
  };

  return (
    <>
      <style>{css}</style>
      <div className="panel-root">

        {/* Header */}
        <div className="panel-header">
          <div className="eyebrow">Sistema de Score Crediticio</div>
          <h1>Registro de Empresa</h1>
          <p>Busca la empresa por RUC para verificar si ya existe en el sistema, o regístrala si es nueva para continuar con la transacción.</p>
        </div>

        {/* Steps */}
        <div className="steps">
          {[
            { n:1, label:"Buscar empresa" },
            { n:2, label:"Datos empresa" },
            { n:3, label:"Continuar" },
          ].map(s => (
            <div key={s.n} className={`step ${step === s.n ? "active" : step > s.n ? "done" : ""}`}>
              <div className="step-num">{step > s.n ? "✓" : s.n}</div>
              <div className="step-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── STEP 1: Buscar por RUC ── */}
        {step === 1 && (
          <div className="card">
            <div className="card-head">
              <div className="card-head-icon" style={{background:"#e8f0eb"}}>🔍</div>
              <div>
                <div className="card-head-title">Búsqueda por RUC</div>
                <div className="card-head-sub">Ingresa el RUC de 11 dígitos de la empresa</div>
              </div>
            </div>
            <div className="card-body">
              <div className="ruc-search-wrap">
                <div className="ruc-input-group">
                  <label>Número de RUC</label>
                  <input
                    type="text"
                    maxLength={11}
                    placeholder="Ej: 20123456789"
                    value={ruc}
                    onChange={e => { setRuc(e.target.value.replace(/\D/g,"")); setSearchError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleBuscar()}
                    className={searchError ? "error" : ""}
                  />
                </div>
                <div style={{display:"flex",alignItems:"flex-end"}}>
                  <button className="btn btn-primary" onClick={handleBuscar} disabled={searching || ruc.length < 11}>
                    {searching ? <><span className="spinner"/>&nbsp;Buscando…</> : <>Buscar</>}
                  </button>
                </div>
              </div>
              {searchError && <div className="alert alert-error" style={{marginTop:12}}>⚠ {searchError}</div>}
              {searchResult?.error && <div className="alert alert-error">⚠ Error de conexión. Verifica tu backend.</div>}

              <div className="divider">o</div>
              <div style={{display:"flex",justifyContent:"center"}}>
                <button className="btn btn-ghost btn-sm" onClick={() => { setMode("new"); setStep(2); }}>
                  + Registrar empresa nueva sin buscar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2A: Empresa encontrada ── */}
        {step === 2 && mode === "found" && empresaSeleccionada && (
          <div className="card">
            <div className="card-head">
              <div className="card-head-icon" style={{background:"#e8f0eb"}}>🏢</div>
              <div>
                <div className="card-head-title">Empresa encontrada</div>
                <div className="card-head-sub">Verifica los datos antes de continuar</div>
              </div>
            </div>
            <div className="card-body">
              <div className="alert alert-found">
                ✓ El RUC <strong style={{fontFamily:"DM Mono,monospace"}}>{empresaSeleccionada.ruc}</strong> ya está registrado en el sistema.
              </div>

              <div className="empresa-found">
                <div className="empresa-found-header">
                  <div>
                    <div className="empresa-found-name">{empresaSeleccionada.razon_social}</div>
                    <div className="empresa-found-ruc">RUC: {empresaSeleccionada.ruc}</div>
                  </div>
                  <span className={`estado-badge ${empresaSeleccionada.estado === "activo" ? "estado-activo" : "estado-inactivo"}`}>
                    {empresaSeleccionada.estado}
                  </span>
                </div>

                <div className="empresa-grid">
                  {[
                    { label:"Rubro",    val: empresaSeleccionada.rubro },
                    { label:"Teléfono", val: empresaSeleccionada.telefono || "—" },
                    { label:"Correo",   val: empresaSeleccionada.correo_contacto || "—" },
                    { label:"Dirección",val: empresaSeleccionada.direccion },
                    { label:"Registro", val: new Date(empresaSeleccionada.fecha_registro).toLocaleDateString("es-PE",{day:"2-digit",month:"short",year:"numeric"}) },
                    { label:"ID interno",val: `#${empresaSeleccionada.id}` },
                  ].map(f => (
                    <div className="empresa-field" key={f.label}>
                      <span className="empresa-field-label">{f.label}</span>
                      <span className="empresa-field-value">{f.val}</span>
                    </div>
                  ))}
                </div>

                {/* Score preview */}
                {empresaSeleccionada.score && (
                  <div className="score-preview">
                    <div className="score-circle">
                      <span className="score-circle-val">{empresaSeleccionada.score}</span>
                      <span className="score-circle-label">score</span>
                    </div>
                    <div>
                      <div className="score-info-label">Score crediticio actual</div>
                      <div className="score-info-val">{empresaSeleccionada.clasificacion}</div>
                      <div className="score-info-sub">Basado en historial de transacciones</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={handleReset}>← Volver</button>
                <button className="btn btn-primary" onClick={handleUsarEmpresa}>
                  Usar esta empresa →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2B: Empresa nueva — formulario ── */}
        {step === 2 && mode === "new" && (
          <div className="card">
            <div className="card-head">
              <div className="card-head-icon" style={{background:"#faf4e1"}}>📋</div>
              <div>
                <div className="card-head-title">Registrar nueva empresa</div>
                <div className="card-head-sub">
                  {searchResult?.found === false
                    ? `RUC ${ruc} no encontrado — completa los datos`
                    : "Completa los datos de la empresa"}
                </div>
              </div>
            </div>
            <div className="card-body">
              {searchResult?.found === false && (
                <div className="alert alert-notfound">
                  ℹ El RUC <strong style={{fontFamily:"DM Mono,monospace"}}>{ruc}</strong> no existe en el sistema. Completa el formulario para registrarlo.
                </div>
              )}

              <div style={{marginTop:20}}>
                <div className="form-section-title">Información principal</div>
                <div className="form-grid">
                  <div className="field">
                    <label className="field-required">RUC</label>
                    <input
                      type="text"
                      maxLength={11}
                      placeholder="20123456789"
                      value={form.ruc}
                      onChange={e => setField("ruc", e.target.value.replace(/\D/g,""))}
                      className={errors.ruc ? "error" : ""}
                      style={{fontFamily:"DM Mono,monospace"}}
                    />
                    {errors.ruc && <span className="field-error">{errors.ruc}</span>}
                  </div>

                  <div className="field">
                    <label className="field-required">Estado</label>
                    <select value={form.estado} onChange={e => setField("estado", e.target.value)}>
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div className="field form-col-span">
                    <label className="field-required">Razón Social</label>
                    <input
                      type="text"
                      placeholder="Ej: DISTRIBUIDORA NORTE S.A.C."
                      value={form.razon_social}
                      onChange={e => setField("razon_social", e.target.value.toUpperCase())}
                      className={errors.razon_social ? "error" : ""}
                    />
                    {errors.razon_social && <span className="field-error">{errors.razon_social}</span>}
                  </div>

                  <div className="field form-col-span">
                    <label className="field-required">Dirección</label>
                    <input
                      type="text"
                      placeholder="Av. Industrial 420, Lima"
                      value={form.direccion}
                      onChange={e => setField("direccion", e.target.value)}
                      className={errors.direccion ? "error" : ""}
                    />
                    {errors.direccion && <span className="field-error">{errors.direccion}</span>}
                  </div>

                  <div className="field form-col-span">
                    <label className="field-required">Rubro</label>
                    <select
                      value={form.rubro}
                      onChange={e => setField("rubro", e.target.value)}
                      className={errors.rubro ? "error" : ""}
                    >
                      <option value="">Selecciona el rubro…</option>
                      {RUBROS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.rubro && <span className="field-error">{errors.rubro}</span>}
                  </div>
                </div>

                <div className="form-section-title">Contacto</div>
                <div className="form-grid">
                  <div className="field">
                    <label>Correo de contacto</label>
                    <input
                      type="email"
                      placeholder="ventas@empresa.com.pe"
                      value={form.correo_contacto}
                      onChange={e => setField("correo_contacto", e.target.value)}
                      className={errors.correo_contacto ? "error" : ""}
                    />
                    {errors.correo_contacto && <span className="field-error">{errors.correo_contacto}</span>}
                  </div>

                  <div className="field">
                    <label>Teléfono</label>
                    <input
                      type="text"
                      placeholder="01-4521890 / 987654321"
                      value={form.telefono}
                      onChange={e => setField("telefono", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {errors._global && <div className="alert alert-error">⚠ {errors._global}</div>}

              <div className="form-actions">
                <button className="btn btn-ghost" onClick={handleReset}>← Volver</button>
                <button className="btn btn-primary" onClick={handleGuardar} disabled={saving}>
                  {saving ? <><span className="spinner"/>Guardando…</> : <>Registrar empresa →</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Éxito ── */}
        {step === 3 && empresaSeleccionada && (
          <div className="card">
            <div className="success-wrap">
              <div className="success-icon">✓</div>
              <div className="success-title">
                {savedId ? "Empresa registrada" : "Empresa seleccionada"}
              </div>
              <div className="success-sub">
                <strong>{empresaSeleccionada.razon_social}</strong><br/>
                {savedId
                  ? `Registrada con ID #${savedId}. Ya puedes continuar con la transacción.`
                  : "La empresa fue cargada correctamente. Continúa con la transacción."}
              </div>

              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-ghost" onClick={handleReset}>
                  Buscar otra empresa
                </button>
                <button className="btn btn-primary">
                  Crear transacción →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}