import { useState } from "react";

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
      radial-gradient(ellipse at 10% 0%, rgba(45,106,79,0.06) 0%, transparent 55%),
      radial-gradient(ellipse at 90% 100%, rgba(184,149,42,0.05) 0%, transparent 55%);
    padding: 48px 24px 80px;
    display: flex; flex-direction: column; align-items: center;
  }

  /* Header */
  .page-header {
    width: 100%; max-width: 780px; margin-bottom: 28px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .eyebrow {
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px;
  }
  .page-header h1 {
    font-family: 'DM Serif Display', serif; font-size: 2rem;
    font-weight: 400; color: var(--text); line-height: 1.15;
  }
  .page-header p { margin-top: 8px; color: var(--muted); font-size: 0.85rem; line-height: 1.6; }

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

  /* Layout */
  .layout {
    width: 100%; max-width: 780px;
    display: grid; grid-template-columns: 1fr 290px;
    gap: 20px; align-items: start;
  }

  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden;
    animation: fadeUp 0.3s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-head {
    padding: 18px 24px 16px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .card-head-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  }
  .card-head-title { font-family: 'DM Serif Display', serif; font-size: 1.05rem; font-weight: 400; }
  .card-head-sub   { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .card-body { padding: 22px 24px; }

  /* Transacción info banner */
  .trx-banner {
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px; margin-bottom: 22px;
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  }
  .trx-field-label {
    font-family: 'DM Mono', monospace; font-size: 0.58rem;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 3px;
  }
  .trx-field-val { font-size: 0.82rem; font-weight: 600; color: var(--text); }
  .trx-field-val.mono { font-family: 'DM Mono', monospace; font-size: 0.75rem; }

  /* Barra de progreso */
  .progress-wrap { margin-bottom: 22px; }
  .progress-label {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 8px; font-size: 0.75rem;
  }
  .progress-label .left { color: var(--muted); }
  .progress-label .right { font-family: 'DM Mono', monospace; font-weight: 600; }
  .progress-bar-bg {
    height: 8px; background: var(--border); border-radius: 999px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 999px;
    background: linear-gradient(90deg, var(--accent2), var(--accent));
    transition: width 0.4s ease;
  }
  .progress-bar-fill.complete { background: linear-gradient(90deg, #16a34a, #15803d); }
  .progress-bar-fill.danger   { background: linear-gradient(90deg, var(--red), #991b1b); }

  /* Historial pagos previos */
  .pagos-list { margin-bottom: 20px; }
  .pago-row {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 9px;
    background: var(--bg); border: 1px solid var(--border);
    margin-bottom: 8px; font-size: 0.78rem;
  }
  .pago-row-icon { font-size: 1rem; flex-shrink: 0; }
  .pago-row-info { flex: 1; }
  .pago-row-fecha { color: var(--muted); font-size: 0.68rem; font-family: 'DM Mono', monospace; }
  .pago-row-monto { font-family: 'DM Mono', monospace; font-weight: 600; }
  .pago-row-badge {
    font-size: 0.6rem; padding: 3px 8px; border-radius: 999px;
    font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.05em;
  }
  .badge-anticipado { background: var(--accent-lt); color: var(--accent2); border: 1px solid rgba(45,106,79,0.2); }
  .badge-puntual    { background: var(--blue-lt);   color: var(--blue);    border: 1px solid rgba(30,64,175,0.2); }
  .badge-moroso     { background: var(--red-lt);    color: var(--red);     border: 1px solid rgba(192,57,43,0.2); }
  .badge-pendiente  { background: var(--gold-lt);   color: var(--gold);    border: 1px solid rgba(184,149,42,0.2); }

  /* Tipo pago toggle */
  .tipo-toggle {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 8px; margin-bottom: 20px;
  }
  .tipo-btn {
    padding: 12px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--bg);
    cursor: pointer; text-align: center; transition: all 0.18s;
  }
  .tipo-btn:hover { border-color: var(--accent2); }
  .tipo-btn.active {
    border-color: var(--accent); background: var(--accent-lt);
    box-shadow: 0 0 0 3px rgba(26,58,42,0.08);
  }
  .tipo-btn-icon { font-size: 1.3rem; margin-bottom: 4px; }
  .tipo-btn-label { font-size: 0.78rem; font-weight: 600; color: var(--text); }
  .tipo-btn-sub   { font-size: 0.68rem; color: var(--muted); margin-top: 2px; }
  .tipo-btn.active .tipo-btn-label { color: var(--accent); }

  /* Form fields */
  .section-label {
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; margin-bottom: 20px; }
  .span2 { grid-column: 1 / -1; }

  .field { display: flex; flex-direction: column; gap: 5px; }
  .field label {
    font-size: 0.67rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--muted); font-family: 'DM Mono', monospace;
  }
  .req::after { content: ' *'; color: var(--red); }
  .field input, .field select {
    padding: 9px 12px; border: 1.5px solid var(--border);
    border-radius: 8px; background: var(--bg);
    font-family: 'DM Sans', sans-serif; font-size: 0.87rem;
    color: var(--text); outline: none; appearance: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .field input:focus, .field select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,58,42,0.08);
  }
  .field input.err { border-color: var(--red); }
  .field input::placeholder { color: var(--border2); font-size: 0.82rem; }
  .ferr { font-size: 0.66rem; color: var(--red); font-family: 'DM Mono', monospace; }
  .field-hint { font-size: 0.68rem; color: var(--muted); }

  /* Monto input especial */
  .monto-wrap { position: relative; }
  .monto-wrap input { padding-left: 36px; font-family: 'DM Mono', monospace; font-size: 0.95rem; font-weight: 600; }
  .monto-prefix {
    position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
    font-family: 'DM Mono', monospace; font-size: 0.85rem; color: var(--muted);
    pointer-events: none;
  }

  /* Impacto score preview */
  .impacto-preview {
    padding: 14px 16px; border-radius: 10px; margin-top: 16px;
    display: flex; align-items: center; gap: 14px;
    transition: all 0.3s;
  }
  .impacto-anticipado { background: var(--accent-lt); border: 1px solid rgba(45,106,79,0.2); }
  .impacto-puntual    { background: var(--blue-lt);   border: 1px solid rgba(30,64,175,0.15); }
  .impacto-moroso     { background: var(--red-lt);    border: 1px solid rgba(192,57,43,0.2); }
  .impacto-neutro     { background: var(--bg);        border: 1px solid var(--border); }

  .impacto-icon {
    width: 40px; height: 40px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; flex-shrink: 0;
  }
  .impacto-anticipado .impacto-icon { background: rgba(45,106,79,0.15); }
  .impacto-puntual    .impacto-icon { background: rgba(30,64,175,0.1); }
  .impacto-moroso     .impacto-icon { background: rgba(192,57,43,0.1); }

  .impacto-label { font-size: 0.68rem; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px; }
  .impacto-anticipado .impacto-label { color: var(--accent2); }
  .impacto-puntual    .impacto-label { color: var(--blue); }
  .impacto-moroso     .impacto-label { color: var(--red); }
  .impacto-neutro     .impacto-label { color: var(--muted); }
  .impacto-desc { font-size: 0.8rem; color: var(--text); font-weight: 500; }
  .impacto-sub  { font-size: 0.7rem; color: var(--muted); margin-top: 1px; }

  /* Pendiente highlight */
  .monto-pendiente-tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 0.68rem; font-family: 'DM Mono', monospace;
    background: var(--warn-lt); color: var(--warn);
    padding: 3px 9px; border-radius: 6px;
    border: 1px solid rgba(139,58,26,0.2); margin-top: 4px;
  }

  /* Sidebar */
  .sidebar { display: flex; flex-direction: column; gap: 16px; position: sticky; top: 24px; }

  .info-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; overflow: hidden; box-shadow: var(--shadow);
  }
  .info-card-head {
    padding: 14px 18px 12px; border-bottom: 1px solid var(--border);
    font-size: 0.78rem; font-weight: 600; color: var(--muted);
    display: flex; align-items: center; gap: 7px;
  }
  .info-card-body { padding: 14px 18px; }

  .info-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 7px 0; border-bottom: 1px solid rgba(226,221,212,0.5);
    font-size: 0.78rem; gap: 8px;
  }
  .info-row:last-child { border-bottom: none; }
  .info-row .lbl { color: var(--muted); flex-shrink: 0; }
  .info-row .val { font-family: 'DM Mono', monospace; font-size: 0.73rem; text-align: right; }

  /* Score card */
  .score-card {
    padding: 16px 18px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border-radius: 14px; box-shadow: var(--shadow);
  }
  .score-card-label {
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    text-transform: uppercase; letter-spacing: 0.12em;
    color: rgba(255,255,255,0.6); margin-bottom: 10px;
  }
  .score-card-row { display: flex; align-items: center; gap: 14px; }
  .score-circle {
    width: 54px; height: 54px; border-radius: 50%;
    background: rgba(255,255,255,0.15);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .score-val   { font-family: 'DM Serif Display', serif; font-size: 1.15rem; color: #fff; line-height: 1; }
  .score-lbl   { font-size: 0.42rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; font-family: 'DM Mono', monospace; }
  .score-clasi { font-family: 'DM Serif Display', serif; font-size: 1rem; color: #fff; }
  .score-sub   { font-size: 0.7rem; color: rgba(255,255,255,0.6); margin-top: 2px; }

  /* Buttons */
  .btn {
    padding: 11px 20px; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.18s;
    display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
  }
  .btn-primary {
    background: var(--accent); color: #fff;
    box-shadow: 0 2px 8px rgba(26,58,42,0.25); width: 100%; justify-content: center;
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--accent2); transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,58,42,0.3);
  }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: transparent; color: var(--muted); border: 1.5px solid var(--border);
  }
  .btn-ghost:hover { background: var(--bg); color: var(--text); }

  .form-actions {
    display: flex; justify-content: flex-end; gap: 10px;
    padding-top: 18px; border-top: 1px solid var(--border); margin-top: 4px;
  }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert-error {
    padding: 12px 14px; border-radius: 9px; font-size: 0.8rem;
    background: var(--warn-lt); border: 1px solid rgba(139,58,26,0.2);
    color: var(--warn); margin-bottom: 16px;
  }

  /* Success */
  .success-wrap { text-align: center; padding: 44px 32px; animation: fadeUp 0.35s ease; }
  .success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 20px;
  }
  .success-title { font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin-bottom: 8px; }
  .success-sub   { color: var(--muted); font-size: 0.85rem; line-height: 1.6; max-width: 360px; margin: 0 auto 20px; }

  .summary-box {
    background: var(--bg); border-radius: 12px; padding: 16px 20px;
    margin-bottom: 24px; text-align: left; border: 1px solid var(--border);
  }
  .summary-row {
    display: flex; justify-content: space-between; padding: 6px 0;
    border-bottom: 1px solid rgba(226,221,212,0.5); font-size: 0.8rem;
  }
  .summary-row:last-child { border-bottom: none; }
  .summary-row .lbl { color: var(--muted); }
  .summary-row .val { font-family: 'DM Mono', monospace; font-size: 0.76rem; }

  /* Vencimiento warning */
  .venc-warning {
    padding: 10px 14px; border-radius: 9px; margin-bottom: 18px;
    display: flex; align-items: center; gap: 9px; font-size: 0.78rem;
  }
  .venc-moroso   { background: var(--red-lt);  border: 1px solid rgba(192,57,43,0.2); color: var(--red); }
  .venc-hoy      { background: var(--gold-lt); border: 1px solid rgba(184,149,42,0.2); color: #7a6010; }
  .venc-pronto   { background: var(--warn-lt); border: 1px solid rgba(139,58,26,0.2); color: var(--warn); }
  .venc-ok       { background: var(--accent-lt); border: 1px solid rgba(45,106,79,0.2); color: var(--accent2); }

  @media (max-width: 680px) {
    .layout { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .trx-banner { grid-template-columns: 1fr 1fr; }
    .sidebar { position: static; }
    .page-header { flex-direction: column; }
    .root { padding: 24px 14px 60px; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });

const diasHastaVenc = (fechaVenc) => {
  const hoy  = new Date(); hoy.setHours(0,0,0,0);
  const venc = new Date(fechaVenc + "T00:00:00");
  return Math.round((venc - hoy) / (1000 * 60 * 60 * 24));
};

const METODOS = ["Efectivo","Transferencia bancaria","Depósito","Cheque","Yape","Plin","Otro"];
const BANCOS  = ["BCP","BBVA","Interbank","Scotiabank","BanBif","Banco de la Nación","Otro"];

// ─── Mock API ────────────────────────────────────────────────────────────────
const mockAPI = {
  registrarPago: async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    return { success: true, id: Math.floor(Math.random() * 9000) + 1000 };
  }
};

// ─── Datos mock de transacción (reemplaza con prop real) ──────────────────────
const MOCK_TRANSACCION = {
  id: 1042,
  codigo_transaccion: "TRX-260218-0001-7823",
  empresa_id: 1,
  fecha_venta: "2026-02-01",
  fecha_vencimiento: "2026-03-04",
  monto_total: 15800.00,
  monto_pagado: 5000.00,
  estado_pago: "pendiente",
  pagos_previos: [
    { id:1, fecha_pago:"2026-02-10", monto:3000, metodo_pago:"Transferencia bancaria", tipo:"parcial", dias_respecto_vencimiento:-22 },
    { id:2, fecha_pago:"2026-02-20", monto:2000, metodo_pago:"BCP",                   tipo:"parcial", dias_respecto_vencimiento:-12 },
  ]
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function PagoPanel({ transaccion: trxProp, empresa: empresaProp, onPagoRegistrado }) {

  const trx     = trxProp     ?? MOCK_TRANSACCION;
  const empresa = empresaProp ?? {
    id: 1, ruc: "20123456781",
    razon_social: "DISTRIBUIDORA NORTE S.A.C.",
    score: 720, clasificacion: "BUENO",
  };

  const pendiente = trx.monto_total - (trx.monto_pagado || 0);
  const pct       = Math.min(100, ((trx.monto_pagado || 0) / trx.monto_total) * 100);
  const diasVenc  = diasHastaVenc(trx.fecha_vencimiento);

  const [step, setStep]     = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [globalErr, setGlobalErr] = useState("");
  const [errors, setErrors] = useState({});

  const [tipoPago, setTipoPago] = useState("parcial"); // "total" | "parcial"

  const [form, setForm] = useState({
    fecha_pago:       new Date().toISOString().split("T")[0],
    monto:            "",
    metodo_pago:      "",
    banco:            "",
    numero_operacion: "",
    comprobante_url:  "",
  });

  // ── Autocompletar monto si es total
  const handleTipo = (tipo) => {
    setTipoPago(tipo);
    if (tipo === "total") setField("monto", pendiente.toFixed(2));
    else setField("monto", "");
    setErrors({});
  };

  // ── Impacto score según fecha
  const getImpacto = () => {
    if (!form.fecha_pago || !trx.fecha_vencimiento) return null;
    const dias = diasHastaVenc(trx.fecha_vencimiento) -
      diasHastaVenc(form.fecha_pago) + diasVenc;
    const diff = new Date(trx.fecha_vencimiento + "T00:00:00") -
                 new Date(form.fecha_pago + "T00:00:00");
    const diasDiff = Math.round(diff / (1000 * 60 * 60 * 24));

    if (diasDiff >= 3)  return { tipo: "anticipado", icon: "🟢", label: "Pago anticipado",  desc: `${diasDiff} días antes del vencimiento`,  cls: "impacto-anticipado" };
    if (diasDiff >= 1)  return { tipo: "anticipado", icon: "🟢", label: "Pago anticipado",  desc: `${diasDiff} día${diasDiff>1?"s":""} antes del vencimiento`, cls: "impacto-anticipado" };
    if (diasDiff === 0) return { tipo: "puntual",    icon: "🔵", label: "Pago puntual",     desc: "El mismo día del vencimiento",            cls: "impacto-puntual" };
    return               { tipo: "moroso",    icon: "🔴", label: "Pago tardío / moroso", desc: `${Math.abs(diasDiff)} día${Math.abs(diasDiff)>1?"s":""} después del vencimiento`, cls: "impacto-moroso" };
  };
  const impacto = getImpacto();

  // ── Vencimiento alert
  const getVencAlert = () => {
    if (diasVenc < 0)  return { cls:"venc-moroso", msg:`⚠ Vencida hace ${Math.abs(diasVenc)} días` };
    if (diasVenc === 0)return { cls:"venc-hoy",    msg:"⚡ Vence hoy" };
    if (diasVenc <= 5) return { cls:"venc-pronto", msg:`⏳ Vence en ${diasVenc} días` };
    return               { cls:"venc-ok",    msg:`✓ Vence en ${diasVenc} días` };
  };
  const vencAlert = getVencAlert();

  // ── Validar
  const validate = () => {
    const e = {};
    if (!form.fecha_pago)   e.fecha_pago   = "Requerido";
    if (!form.monto || parseFloat(form.monto) <= 0) e.monto = "Ingresa un monto válido";
    if (parseFloat(form.monto) > pendiente + 0.01)  e.monto = `Máximo S/ ${pendiente.toFixed(2)} pendiente`;
    if (!form.metodo_pago)  e.metodo_pago  = "Selecciona un método";
    return e;
  };

  // ── Guardar
  const handleGuardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setGlobalErr(""); setSaving(true);

    const payload = {
      transaccion_id:            trx.id,
      fecha_pago:                form.fecha_pago,
      monto:                     parseFloat(form.monto),
      metodo_pago:               form.metodo_pago,
      banco:                     form.banco || null,
      numero_operacion:          form.numero_operacion || null,
      comprobante_url:           form.comprobante_url || null,
      tipo_pago:                 tipoPago,
      dias_respecto_vencimiento: (() => {
        const diff = new Date(trx.fecha_vencimiento + "T00:00:00") - new Date(form.fecha_pago + "T00:00:00");
        return -Math.round(diff / (1000 * 60 * 60 * 24)); // negativo=anticipado
      })(),
      // impacto_score lo calcula el backend
    };

    try {
      const res = await mockAPI.registrarPago(payload);
      setSavedData({ ...payload, id: res.id });
      setStep(2);
      onPagoRegistrado?.({ ...payload, id: res.id });
    } catch {
      setGlobalErr("Error al registrar el pago. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => { const n = {...e}; delete n[k]; return n; });
  };

  return (
    <>
      <style>{css}</style>
      <div className="root">

        {/* Header */}
        <div className="page-header" style={{maxWidth:780}}>
          <div>
            <div className="eyebrow">Score Crediticio — Paso 3</div>
            <h1>Registrar Pago</h1>
            <p>Aplica un pago total o parcial a la transacción seleccionada.</p>
          </div>
          <div className="empresa-chip">
            <div className="empresa-chip-icon">🏢</div>
            <div>
              <div className="empresa-chip-name">{empresa.razon_social}</div>
              <div className="empresa-chip-ruc">RUC {empresa.ruc}</div>
            </div>
          </div>
        </div>

        {/* ── STEP 1: Formulario ── */}
        {step === 1 && (
          <div className="layout">

            {/* Col principal */}
            <div style={{display:"flex",flexDirection:"column",gap:18}}>

              {/* Card info transacción */}
              <div className="card">
                <div className="card-head">
                  <div className="card-head-icon" style={{background:"#e8f0eb"}}>💳</div>
                  <div>
                    <div className="card-head-title">Transacción</div>
                    <div className="card-head-sub" style={{fontFamily:"DM Mono,monospace"}}>{trx.codigo_transaccion}</div>
                  </div>
                </div>
                <div className="card-body">

                  {/* Banner datos */}
                  <div className="trx-banner">
                    {[
                      {label:"Monto total",  val: fmt(trx.monto_total) },
                      {label:"Pagado",       val: fmt(trx.monto_pagado || 0) },
                      {label:"Pendiente",    val: fmt(pendiente) },
                      {label:"Vencimiento",  val: trx.fecha_vencimiento },
                    ].map(f => (
                      <div key={f.label}>
                        <div className="trx-field-label">{f.label}</div>
                        <div className={`trx-field-val ${f.label==="Vencimiento"?"mono":""}`}>{f.val}</div>
                      </div>
                    ))}
                  </div>

                  {/* Barra progreso */}
                  <div className="progress-wrap">
                    <div className="progress-label">
                      <span className="left">Progreso de pago</span>
                      <span className="right" style={{color: pct===100?"#16a34a":"var(--text)"}}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill"
                        style={{width:`${pct}%`}}
                      />
                    </div>
                  </div>

                  {/* Alert vencimiento */}
                  <div className={`venc-warning ${vencAlert.cls}`}>{vencAlert.msg}</div>

                  {/* Pagos previos */}
                  {trx.pagos_previos?.length > 0 && (
                    <>
                      <div className="section-label">Pagos anteriores</div>
                      <div className="pagos-list">
                        {trx.pagos_previos.map(p => {
                          const d = p.dias_respecto_vencimiento;
                          const badgeCls = d < 0 ? "badge-anticipado" : d === 0 ? "badge-puntual" : "badge-moroso";
                          const badgeTxt = d < 0 ? "Anticipado" : d === 0 ? "Puntual" : "Moroso";
                          return (
                            <div className="pago-row" key={p.id}>
                              <div className="pago-row-icon">💵</div>
                              <div className="pago-row-info">
                                <div style={{fontWeight:500}}>{p.metodo_pago}</div>
                                <div className="pago-row-fecha">{p.fecha_pago}</div>
                              </div>
                              <div style={{textAlign:"right"}}>
                                <div className="pago-row-monto">{fmt(p.monto)}</div>
                                <span className={`pago-row-badge ${badgeCls}`}>{badgeTxt}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Card nuevo pago */}
              <div className="card">
                <div className="card-head">
                  <div className="card-head-icon" style={{background:"#faf4e1"}}>💰</div>
                  <div>
                    <div className="card-head-title">Nuevo pago</div>
                    <div className="card-head-sub">Pendiente: {fmt(pendiente)}</div>
                  </div>
                </div>
                <div className="card-body">
                  {globalErr && <div className="alert-error">⚠ {globalErr}</div>}

                  {/* Toggle tipo */}
                  <div className="section-label">Tipo de pago</div>
                  <div className="tipo-toggle">
                    {[
                      { key:"total",   icon:"✅", label:"Pago total",   sub:`Cubre todo: ${fmt(pendiente)}` },
                      { key:"parcial", icon:"⚡", label:"Pago parcial", sub:"Abono a cuenta" },
                    ].map(t => (
                      <div key={t.key}
                        className={`tipo-btn ${tipoPago===t.key?"active":""}`}
                        onClick={() => handleTipo(t.key)}
                      >
                        <div className="tipo-btn-icon">{t.icon}</div>
                        <div className="tipo-btn-label">{t.label}</div>
                        <div className="tipo-btn-sub">{t.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Campos */}
                  <div className="section-label" style={{marginTop:4}}>Detalle del pago</div>
                  <div className="form-grid">

                    {/* Monto */}
                    <div className="field">
                      <label className="req">Monto (S/)</label>
                      <div className="monto-wrap">
                        <span className="monto-prefix">S/</span>
                        <input
                          type="number" min="0.01" step="0.01"
                          placeholder="0.00"
                          value={form.monto}
                          onChange={e => setField("monto", e.target.value)}
                          className={errors.monto ? "err" : ""}
                          readOnly={tipoPago === "total"}
                          style={tipoPago==="total" ? {background:"var(--accent-lt)",cursor:"default"} : {}}
                        />
                      </div>
                      {errors.monto
                        ? <span className="ferr">{errors.monto}</span>
                        : tipoPago === "parcial" && pendiente > 0 &&
                          <div className="monto-pendiente-tag">Máx. {fmt(pendiente)}</div>
                      }
                    </div>

                    {/* Fecha pago */}
                    <div className="field">
                      <label className="req">Fecha de pago</label>
                      <input
                        type="date"
                        value={form.fecha_pago}
                        onChange={e => setField("fecha_pago", e.target.value)}
                        className={errors.fecha_pago ? "err" : ""}
                      />
                      {errors.fecha_pago && <span className="ferr">{errors.fecha_pago}</span>}
                    </div>

                    {/* Método */}
                    <div className="field">
                      <label className="req">Método de pago</label>
                      <select
                        value={form.metodo_pago}
                        onChange={e => setField("metodo_pago", e.target.value)}
                        className={errors.metodo_pago ? "err" : ""}
                      >
                        <option value="">Selecciona…</option>
                        {METODOS.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {errors.metodo_pago && <span className="ferr">{errors.metodo_pago}</span>}
                    </div>

                    {/* Banco */}
                    <div className="field">
                      <label>Banco</label>
                      <select value={form.banco} onChange={e => setField("banco", e.target.value)}>
                        <option value="">Selecciona…</option>
                        {BANCOS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    {/* N° operación */}
                    <div className="field">
                      <label>N° de operación</label>
                      <input
                        type="text"
                        placeholder="123456789"
                        value={form.numero_operacion}
                        onChange={e => setField("numero_operacion", e.target.value)}
                        style={{fontFamily:"DM Mono,monospace",fontSize:"0.82rem"}}
                      />
                    </div>

                    {/* Comprobante */}
                    <div className="field">
                      <label>URL comprobante</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={form.comprobante_url}
                        onChange={e => setField("comprobante_url", e.target.value)}
                      />
                      <span className="field-hint">Voucher, recibo, etc.</span>
                    </div>

                  </div>

                  {/* Impacto score preview */}
                  {impacto && (
                    <div className={`impacto-preview ${impacto.cls}`}>
                      <div className="impacto-icon">{impacto.icon}</div>
                      <div>
                        <div className="impacto-label">{impacto.label}</div>
                        <div className="impacto-desc">{impacto.desc}</div>
                        <div className="impacto-sub">
                          El backend calculará el impacto en el score crediticio
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button className="btn btn-ghost">← Volver</button>
                    <button
                      className="btn btn-primary"
                      style={{width:"auto"}}
                      onClick={handleGuardar}
                      disabled={saving || !form.monto || parseFloat(form.monto) <= 0}
                    >
                      {saving
                        ? <><span className="spinner"/>Registrando…</>
                        : <>Registrar pago →</>}
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="sidebar">

              {/* Score */}
              <div className="score-card">
                <div className="score-card-label">Score crediticio actual</div>
                <div className="score-card-row">
                  <div className="score-circle">
                    <span className="score-val">{empresa.score}</span>
                    <span className="score-lbl">pts</span>
                  </div>
                  <div>
                    <div className="score-clasi">{empresa.clasificacion}</div>
                    <div className="score-sub">Se recalcula al guardar</div>
                  </div>
                </div>
              </div>

              {/* Info transacción */}
              <div className="info-card">
                <div className="info-card-head">📋 Transacción</div>
                <div className="info-card-body">
                  {[
                    {lbl:"ID",        val:`#${trx.id}`},
                    {lbl:"Total",     val: fmt(trx.monto_total)},
                    {lbl:"Pagado",    val: fmt(trx.monto_pagado||0)},
                    {lbl:"Pendiente", val: fmt(pendiente)},
                    {lbl:"Vence",     val: trx.fecha_vencimiento},
                    {lbl:"Estado",    val: trx.estado_pago},
                  ].map(r => (
                    <div className="info-row" key={r.lbl}>
                      <span className="lbl">{r.lbl}</span>
                      <span className="val" style={r.lbl==="Pendiente"?{color:"var(--warn)"}:{}}>{r.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pago preview */}
              {form.monto && parseFloat(form.monto) > 0 && (
                <div className="info-card" style={{animation:"fadeUp 0.2s ease"}}>
                  <div className="info-card-head">⚡ Este pago</div>
                  <div className="info-card-body">
                    {[
                      {lbl:"Monto",   val: fmt(parseFloat(form.monto)||0)},
                      {lbl:"Tipo",    val: tipoPago},
                      {lbl:"Nuevo pagado", val: fmt((trx.monto_pagado||0) + (parseFloat(form.monto)||0))},
                      {lbl:"Quedaría pendiente", val: fmt(Math.max(0, pendiente - (parseFloat(form.monto)||0)))},
                    ].map(r => (
                      <div className="info-row" key={r.lbl}>
                        <span className="lbl">{r.lbl}</span>
                        <span className="val">{r.val}</span>
                      </div>
                    ))}
                    <div style={{marginTop:12}}>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill"
                          style={{
                            width:`${Math.min(100,((trx.monto_pagado||0)+(parseFloat(form.monto)||0))/trx.monto_total*100)}%`
                          }}
                        />
                      </div>
                      <div style={{textAlign:"right",fontSize:"0.68rem",fontFamily:"DM Mono,monospace",color:"var(--muted)",marginTop:4}}>
                        {Math.min(100,(((trx.monto_pagado||0)+(parseFloat(form.monto)||0))/trx.monto_total*100)).toFixed(0)}% cubierto
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── STEP 2: Éxito ── */}
        {step === 2 && savedData && (
          <div className="card" style={{maxWidth:520,width:"100%"}}>
            <div className="success-wrap">
              <div className="success-icon">✓</div>
              <div className="success-title">Pago registrado</div>
              <div className="success-sub">
                El pago fue registrado correctamente.<br/>
                El score crediticio será actualizado por el backend.
              </div>
              <div className="summary-box">
                {[
                  {lbl:"ID pago",   val:`#${savedData.id}`},
                  {lbl:"Monto",     val: fmt(savedData.monto)},
                  {lbl:"Tipo",      val: savedData.tipo_pago},
                  {lbl:"Fecha",     val: savedData.fecha_pago},
                  {lbl:"Método",    val: savedData.metodo_pago},
                  savedData.banco && {lbl:"Banco", val: savedData.banco},
                  savedData.numero_operacion && {lbl:"N° Op.", val: savedData.numero_operacion},
                  {lbl:"Impacto",   val: impacto?.label ?? "—"},
                ].filter(Boolean).map(r => (
                  <div className="summary-row" key={r.lbl}>
                    <span className="lbl">{r.lbl}</span>
                    <span className="val">{r.val}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  Registrar otro pago
                </button>
                <button className="btn btn-primary" style={{width:"auto"}}>
                  Ver historial score →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
