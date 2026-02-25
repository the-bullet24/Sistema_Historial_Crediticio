import { useState, useEffect } from "react";

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
    --shadow:    0 2px 8px rgba(26,23,20,0.08);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12), 0 2px 8px rgba(26,23,20,0.06);
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }

  .root {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 80% 0%, rgba(45,106,79,0.06) 0%, transparent 55%),
      radial-gradient(ellipse at 10% 100%, rgba(184,149,42,0.05) 0%, transparent 55%);
    padding: 48px 24px 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Header */
  .page-header {
    width: 100%; max-width: 780px; margin-bottom: 32px;
    display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;
  }
  .eyebrow {
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--accent2); margin-bottom: 6px;
  }
  .page-header h1 {
    font-family: 'DM Serif Display', serif; font-size: 2rem;
    font-weight: 400; color: var(--text); line-height: 1.15;
  }
  .page-header p { margin-top: 8px; color: var(--muted); font-size: 0.85rem; line-height: 1.6; }

  /* Empresa chip */
  .empresa-chip {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px; border-radius: 12px;
    background: var(--surface); border: 1px solid var(--border);
    box-shadow: var(--shadow); flex-shrink: 0; max-width: 280px;
  }
  .empresa-chip-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: var(--accent-lt); display: flex;
    align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;
  }
  .empresa-chip-name { font-size: 0.8rem; font-weight: 600; color: var(--text); line-height: 1.3; }
  .empresa-chip-ruc  { font-family: 'DM Mono', monospace; font-size: 0.65rem; color: var(--muted); }

  /* Layout 2 cols */
  .layout {
    width: 100%; max-width: 780px;
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 20px;
    align-items: start;
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
    padding: 20px 24px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px;
  }
  .card-head-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
  }
  .card-head-title { font-family: 'DM Serif Display', serif; font-size: 1.05rem; font-weight: 400; }
  .card-head-sub   { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .card-body { padding: 22px 24px; }

  /* Form fields */
  .section-label {
    font-family: 'DM Mono', monospace; font-size: 0.6rem;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
  }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 16px; margin-bottom: 22px; }
  .form-grid.cols1 { grid-template-columns: 1fr; }
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
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(26,58,42,0.08);
  }
  .field input.err { border-color: var(--red); }
  .field input::placeholder { color: var(--border2); font-size: 0.82rem; }
  .ferr { font-size: 0.66rem; color: var(--red); font-family: 'DM Mono', monospace; }

  /* Código transacción auto */
  .codigo-wrap { position: relative; }
  .codigo-wrap input { padding-right: 90px; font-family: 'DM Mono', monospace; font-size: 0.8rem; }
  .codigo-badge {
    position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
    font-size: 0.58rem; font-family: 'DM Mono', monospace;
    background: var(--accent-lt); color: var(--accent2);
    padding: 2px 7px; border-radius: 999px; pointer-events: none;
  }

  /* ── Tabla de productos ── */
  .productos-wrap { margin-bottom: 0; }
  .productos-table {
    width: 100%; border-collapse: collapse;
    margin-bottom: 10px;
  }
  .productos-table th {
    font-family: 'DM Mono', monospace; font-size: 0.58rem;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--muted); padding: 0 8px 8px; text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .productos-table th:last-child { text-align: right; width: 40px; }
  .productos-table td { padding: 6px 6px; vertical-align: middle; }
  .productos-table tr:not(:last-child) td {
    border-bottom: 1px solid rgba(226,221,212,0.5);
  }
  .productos-table input,
  .productos-table select {
    padding: 7px 10px;
    border: 1.5px solid var(--border); border-radius: 7px;
    background: var(--bg); font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; color: var(--text); outline: none;
    transition: border-color 0.2s;
    width: 100%; display: block;
    caret-color: var(--text);
  }
  .productos-table select {
    appearance: none; -webkit-appearance: none;
    cursor: pointer;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .productos-table input:focus,
  .productos-table select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,58,42,0.08); }
  .productos-table input.num { text-align: right; font-family: 'DM Mono', monospace; }
  .productos-table input::placeholder { color: var(--border2); }

  .col-desc  { width: 46%; }
  .col-cant  { width: 9%; min-width: 60px; }
  .col-price { width: 20%; }
  .col-sub   { width: 19%; }
  .col-del   { width: 6%; }

  .subtotal-cell {
    font-family: 'DM Mono', monospace; font-size: 0.8rem;
    color: var(--accent); text-align: right; padding-right: 10px;
  }

  .btn-add-item {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    border: 1.5px dashed var(--border2); background: transparent;
    color: var(--muted); font-size: 0.78rem; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: all 0.18s; width: 100%; justify-content: center;
    margin-top: 4px;
  }
  .btn-add-item:hover { border-color: var(--accent2); color: var(--accent2); background: var(--accent-lt); }

  .btn-del {
    background: none; border: none; cursor: pointer;
    color: var(--border2); font-size: 1rem; padding: 4px;
    border-radius: 5px; transition: color 0.15s, background 0.15s;
    display: flex; align-items: center;
  }
  .btn-del:hover { color: var(--red); background: var(--red-lt); }

  /* ── Panel resumen (sidebar) ── */
  .resumen-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; box-shadow: var(--shadow);
    position: sticky; top: 24px; overflow: hidden;
  }
  .resumen-head {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400;
    display: flex; align-items: center; gap: 8px;
  }
  .resumen-body { padding: 18px 20px; }

  .resumen-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid rgba(226,221,212,0.5);
    font-size: 0.8rem;
  }
  .resumen-row:last-child { border-bottom: none; }
  .resumen-row .label { color: var(--muted); }
  .resumen-row .val   { font-family: 'DM Mono', monospace; font-weight: 500; font-size: 0.78rem; }

  .resumen-total {
    margin-top: 14px; padding: 14px 16px;
    background: var(--accent); border-radius: 10px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .resumen-total .label { color: rgba(255,255,255,0.7); font-size: 0.72rem; text-transform: uppercase; font-family: 'DM Mono', monospace; letter-spacing: 0.08em; }
  .resumen-total .val   { font-family: 'DM Serif Display', serif; font-size: 1.3rem; color: #fff; }

  .resumen-items {
    margin-top: 12px; max-height: 160px; overflow-y: auto;
  }
  .resumen-item {
    display: flex; justify-content: space-between;
    padding: 5px 0; font-size: 0.75rem; border-bottom: 1px solid rgba(226,221,212,0.4);
  }
  .resumen-item:last-child { border-bottom: none; }
  .resumen-item-name { color: var(--text); flex: 1; padding-right: 8px; }
  .resumen-item-price { font-family: 'DM Mono', monospace; color: var(--muted); white-space: nowrap; }

  /* Estado badge */
  .estado-pending {
    display: inline-flex; align-items: center; gap: 5px;
    font-family: 'DM Mono', monospace; font-size: 0.62rem;
    padding: 3px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.06em;
    background: var(--gold-lt); color: var(--gold); border: 1px solid rgba(184,149,42,0.25);
  }
  .dot-pulse {
    width: 6px; height: 6px; border-radius: 50%; background: var(--gold);
    animation: pulse 1.5s ease infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  /* Vencimiento helper */
  .venc-helper {
    display: flex; gap: 6px; margin-top: 6px;
  }
  .venc-btn {
    font-size: 0.68rem; padding: 4px 10px; border-radius: 6px;
    border: 1px solid var(--border); background: var(--bg);
    color: var(--muted); cursor: pointer; font-family: 'DM Mono', monospace;
    transition: all 0.15s;
  }
  .venc-btn:hover { border-color: var(--accent2); color: var(--accent2); background: var(--accent-lt); }

  /* Buttons */
  .btn {
    padding: 11px 20px; border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.18s;
    display: inline-flex; align-items: center; gap: 7px; white-space: nowrap;
  }
  .btn-primary {
    background: var(--accent); color: #fff;
    box-shadow: 0 2px 8px rgba(26,58,42,0.25);
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--accent2); transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(26,58,42,0.3);
  }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
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

  /* Alert */
  .alert-error {
    padding: 12px 14px; border-radius: 9px; font-size: 0.8rem;
    background: var(--warn-lt); border: 1px solid rgba(139,58,26,0.2);
    color: var(--warn); margin-bottom: 14px;
  }

  /* Success */
  .success-wrap {
    text-align: center; padding: 44px 32px; animation: fadeUp 0.35s ease;
  }
  .success-icon {
    width: 64px; height: 64px; border-radius: 50%;
    background: var(--accent-lt);
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; margin: 0 auto 20px;
  }
  .success-title {
    font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin-bottom: 8px;
  }
  .success-sub { color: var(--muted); font-size: 0.85rem; line-height: 1.6; max-width: 360px; margin: 0 auto 6px; }
  .success-code {
    font-family: 'DM Mono', monospace; font-size: 0.8rem;
    color: var(--accent2); margin-bottom: 24px;
  }

  /* Scrollbar */
  .resumen-items::-webkit-scrollbar { width: 4px; }
  .resumen-items::-webkit-scrollbar-track { background: transparent; }
  .resumen-items::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  @media (max-width: 680px) {
    .layout { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
    .resumen-card { position: static; }
    .page-header { flex-direction: column; }
    .empresa-chip { max-width: 100%; }
    .root { padding: 24px 14px 60px; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });

const addDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const genCodigo = (empresaId) => {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 9000) + 1000);
  return `TRX-${yy}${mm}${dd}-${String(empresaId || 0).padStart(4,"0")}-${rand}`;
};

// ─── API real ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:8080/api";

const mockAPI = {
  cargarProductos: async (empresaId) => {
    const res = await fetch(`${BASE_URL}/productos/empresa/${empresaId}`);
    if (!res.ok) throw new Error("Error al cargar productos");
    return await res.json();
  },
  registrarTransaccion: async (data) => {
    const payload = {
      empresaId:          data.empresa_id,
      codigoTransaccion:  data.codigo_transaccion,
      fechaVenta:         data.fecha_venta,
      fechaVencimiento:   data.fecha_vencimiento,
      montoTotal:         data.monto_total,
      estadoPago:         "pendiente",
      detalles: data.items.map(i => ({
        productoId:     i.producto_id,
        cantidad:       parseInt(i.cantidad),
        precioUnitario: parseFloat(i.precio_unitario),
      })),
    };
    const res = await fetch(`${BASE_URL}/transacciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Error al registrar transacción");
    return await res.json();
  },
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function TransaccionPanel({ empresa: empresaProp, onTransaccionCreada }) {

  // Empresa mock si no viene por prop (para pruebas en standalone)
  const empresa = empresaProp ?? {
    id: 1,
    ruc: "20123456781",
    razon_social: "DISTRIBUIDORA NORTE S.A.C.",
    estado: "activo",
    score: 720,
    clasificacion: "BUENO",
  };

  const [codigo]   = useState(() => genCodigo(empresa.id));
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedData, setSavedData] = useState(null);
  const [globalErr, setGlobalErr] = useState("");

  // ── Productos del backend
  const [catalogoProductos, setCatalogoProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Cargar productos de la empresa al montar
  useEffect(() => {
    mockAPI.cargarProductos(empresa.id)
      .then(data => setCatalogoProductos(data))
      .catch(() => setCatalogoProductos([]))
      .finally(() => setLoadingProductos(false));
  }, [empresa.id]);

  const [form, setForm] = useState({
    fecha_venta:      new Date().toISOString().split("T")[0],
    fecha_vencimiento: "",
  });
  const [errors, setErrors] = useState({});

  const [items, setItems] = useState([
    { id: 1, producto_id: "", descripcion: "", cantidad: "", precio_unitario: "" }
  ]);

  // ── Al seleccionar producto del catálogo, autocompleta precio
  const seleccionarProducto = (itemId, productoId) => {
    const prod = catalogoProductos.find(p => p.id === parseInt(productoId));
    if (prod) {
      setItems(prev => prev.map(i => i.id === itemId ? {
        ...i,
        producto_id:    prod.id,
        descripcion:    prod.nombre,
        precio_unitario: prod.precioUnitario,
        unidad_medida:  prod.unidadMedida,
      } : i));
    }
  };

  // ── Productos
  const addItem = () =>
    setItems(prev => [...prev, { id: Date.now(), producto_id: "", descripcion: "", cantidad: "", precio_unitario: "" }]);

  const removeItem = (id) =>
    setItems(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);

  const updateItem = (id, key, val) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: val } : i));

  const subtotal = (item) =>
    (parseFloat(item.cantidad) || 0) * (parseFloat(item.precio_unitario) || 0);

  const monto_total = items.reduce((s, i) => s + subtotal(i), 0);

  // ── Vencimiento rápido
  const setVenc = (days) =>
    setForm(f => ({ ...f, fecha_vencimiento: addDays(days) }));

  // ── Validar
  const validate = () => {
    const e = {};
    if (!form.fecha_venta)       e.fecha_venta       = "Requerido";
    if (!form.fecha_vencimiento) e.fecha_vencimiento = "Requerido";
    if (form.fecha_vencimiento && form.fecha_vencimiento <= form.fecha_venta)
      e.fecha_vencimiento = "Debe ser posterior a la fecha de venta";
    if (monto_total <= 0) e.items = "Agrega al menos un ítem con monto válido";
    const itemsErr = items.some(i =>
      (!i.producto_id && !i.descripcion.trim()) || !i.cantidad || !i.precio_unitario
    );
    if (itemsErr) e.items = "Selecciona un producto y completa cantidad en cada fila";
    return e;
  };

  // ── Guardar
  const handleGuardar = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setErrors({}); 
    setGlobalErr(""); 
    setSaving(true);

    // ESTRUCTURA PARA RegistroRequest (Java)
    const payload = {
      transaccion: {
        empresa: { id: empresa.id }, // Objeto Empresa con su ID
        montoTotal: monto_total,
        fechaVencimiento: form.fecha_vencimiento,
        // El backend genera el código y la fecha de venta usualmente, 
        // pero si tu entidad los requiere, inclúyelos aquí.
      },
      detalles: items.map(i => ({
        producto: { id: i.producto_id }, // Objeto Producto con su ID
        cantidad: parseInt(i.cantidad),
        precioUnitario: parseFloat(i.precio_unitario)
      }))
    };

    try {
      // Llamada al endpoint de REGISTRAR
      const res = await fetch(`${BASE_URL}/transacciones/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Capturamos el error (ej: "Stock insuficiente")
        const errorText = await res.text();
        throw new Error(errorText || "Error al registrar");
      }

      const data = await res.json(); // La Transaccion guardada que retorna Java
      
      setSavedData({ ...payload.transaccion, items: items, id: data.id });
      setStep(2);
      
      if (onTransaccionCreada) onTransaccionCreada(data);

    } catch (error) {
      setGlobalErr(error.message);
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

        {/* Page header */}
        <div className="page-header" style={{maxWidth:780}}>
          <div>
            <div className="eyebrow">Score Crediticio — Paso 2</div>
            <h1>Nueva Transacción</h1>
            <p>Registra la venta a crédito indicando los productos, montos y fecha de vencimiento.</p>
          </div>
          {/* Empresa chip */}
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

            {/* Columna principal */}
            <div style={{display:"flex",flexDirection:"column",gap:18}}>

              {/* Card info general */}
              <div className="card">
                <div className="card-head">
                  <div className="card-head-icon" style={{background:"#e8f0eb"}}>📄</div>
                  <div>
                    <div className="card-head-title">Información general</div>
                    <div className="card-head-sub">Fechas y código de la transacción</div>
                  </div>
                </div>
                <div className="card-body">
                  {globalErr && <div className="alert-error">⚠ {globalErr}</div>}

                  <div className="form-grid">
                    {/* Código — solo lectura */}
                    <div className="field span2">
                      <label>Código de transacción</label>
                      <div className="codigo-wrap">
                        <input type="text" value={codigo} readOnly
                          style={{background:"var(--bg)",cursor:"default"}} />
                        <span className="codigo-badge">Auto</span>
                      </div>
                    </div>

                    {/* Fecha venta */}
                    <div className="field">
                      <label className="req">Fecha de venta</label>
                      <input type="date" value={form.fecha_venta}
                        onChange={e => setField("fecha_venta", e.target.value)}
                        className={errors.fecha_venta ? "err" : ""} />
                      {errors.fecha_venta && <span className="ferr">{errors.fecha_venta}</span>}
                    </div>

                    {/* Fecha vencimiento */}
                    <div className="field">
                      <label className="req">Fecha de vencimiento</label>
                      <input type="date" value={form.fecha_vencimiento}
                        onChange={e => setField("fecha_vencimiento", e.target.value)}
                        className={errors.fecha_vencimiento ? "err" : ""}
                        min={form.fecha_venta || undefined} />
                      {errors.fecha_vencimiento
                        ? <span className="ferr">{errors.fecha_vencimiento}</span>
                        : <div className="venc-helper">
                            {[30,60,90].map(d => (
                              <button key={d} className="venc-btn" onClick={() => setVenc(d)}>+{d}d</button>
                            ))}
                          </div>
                      }
                    </div>

                    {/* Estado — siempre pendiente */}
                    <div className="field span2">
                      <label>Estado inicial</label>
                      <div style={{marginTop:2}}>
                        <span className="estado-pending">
                          <span className="dot-pulse"/>pendiente
                        </span>
                        <span style={{fontSize:"0.72rem",color:"var(--muted)",marginLeft:10}}>
                          Se actualiza automáticamente con los pagos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card productos */}
              <div className="card">
                <div className="card-head">
                  <div className="card-head-icon" style={{background:"#faf4e1"}}>📦</div>
                  <div>
                    <div className="card-head-title">Productos / Ítems</div>
                    <div className="card-head-sub">Detalla los productos de esta venta a crédito</div>
                  </div>
                </div>
                <div className="card-body">
                  {errors.items && <div className="alert-error" style={{marginBottom:14}}>⚠ {errors.items}</div>}

                  <table className="productos-table">
                    <thead>
                      <tr>
                        <th className="col-desc">Descripción</th>
                        <th className="col-cant">Cant.</th>
                        <th className="col-price">P. Unitario</th>
                        <th className="col-sub">Subtotal</th>
                        <th className="col-del"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingProductos ? (
                        <tr><td colSpan={5} style={{textAlign:"center",padding:"20px",color:"var(--muted)",fontFamily:"DM Mono,monospace",fontSize:"0.75rem"}}>Cargando productos…</td></tr>
                      ) : items.map((item) => (
                        <tr key={item.id}>
                          <td className="col-desc">
                            {catalogoProductos.length > 0 ? (
                              <select
                                value={item.producto_id}
                                onChange={e => seleccionarProducto(item.id, e.target.value)}
                                style={{width:"100%",padding:"6px 8px",border:"1.5px solid var(--border)",borderRadius:"6px",background:"var(--bg)",fontFamily:"DM Sans,sans-serif",fontSize:"0.82rem",color:"var(--text)",outline:"none"}}
                              >
                                <option value="">Selecciona producto…</option>
                                {catalogoProductos.map(p => (
                                  <option key={p.id} value={p.id}>
                                    {p.nombre} ({p.unidadMedida}) — S/ {p.precioUnitario}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                placeholder="Nombre del producto"
                                value={item.descripcion}
                                onChange={e => updateItem(item.id, "descripcion", e.target.value)}
                              />
                            )}
                          </td>
                          <td className="col-cant">
                            <input
                              type="number" min="1"
                              placeholder="0"
                              className="num"
                              value={item.cantidad}
                              onChange={e => updateItem(item.id, "cantidad", e.target.value)}
                            />
                          </td>
                          <td className="col-price">
                            <input
                              type="number" min="0" step="0.01"
                              placeholder="0.00"
                              className="num"
                              value={item.precio_unitario}
                              onChange={e => updateItem(item.id, "precio_unitario", e.target.value)}
                            />
                          </td>
                          <td className="col-sub">
                            <div className="subtotal-cell">
                              {subtotal(item) > 0 ? fmt(subtotal(item)) : "—"}
                            </div>
                          </td>
                          <td className="col-del">
                            <button className="btn-del" onClick={() => removeItem(item.id)} title="Eliminar">✕</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <button className="btn-add-item" onClick={addItem}>
                    + Agregar ítem
                  </button>

                  <div className="form-actions">
                    <button className="btn btn-ghost">← Volver</button>
                    <button className="btn btn-primary" onClick={handleGuardar} disabled={saving || monto_total <= 0}>
                      {saving
                        ? <><span className="spinner"/>Guardando…</>
                        : <>Registrar transacción →</>}
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar resumen */}
            <div className="resumen-card">
              <div className="resumen-head">🧾 Resumen</div>
              <div className="resumen-body">

                <div className="resumen-row">
                  <span className="label">Empresa</span>
                  <span className="val" style={{maxWidth:130,textAlign:"right",fontSize:"0.72rem",fontFamily:"DM Sans,sans-serif"}}>
                    {empresa.razon_social}
                  </span>
                </div>
                <div className="resumen-row">
                  <span className="label">Código</span>
                  <span className="val" style={{fontSize:"0.62rem"}}>{codigo.slice(-8)}</span>
                </div>
                <div className="resumen-row">
                  <span className="label">Fecha venta</span>
                  <span className="val">{form.fecha_venta || "—"}</span>
                </div>
                <div className="resumen-row">
                  <span className="label">Vence</span>
                  <span className="val" style={{color: form.fecha_vencimiento ? "var(--warn)" : "var(--muted)"}}>
                    {form.fecha_vencimiento || "—"}
                  </span>
                </div>
                <div className="resumen-row">
                  <span className="label">Ítems</span>
                  <span className="val">{items.length}</span>
                </div>

                <div className="resumen-total">
                  <span className="label">Total</span>
                  <span className="val">{fmt(monto_total)}</span>
                </div>

                {items.some(i => subtotal(i) > 0) && (
                  <div className="resumen-items">
                    {items.filter(i => subtotal(i) > 0).map(i => (
                      <div className="resumen-item" key={i.id}>
                        <span className="resumen-item-name">
                          {i.descripcion || "Sin nombre"} ×{i.cantidad}
                        </span>
                        <span className="resumen-item-price">{fmt(subtotal(i))}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Score empresa */}
                {empresa.score && (
                  <div style={{marginTop:16,padding:"12px 14px",background:"var(--bg)",borderRadius:10,border:"1px solid var(--border)"}}>
                    <div style={{fontSize:"0.6rem",fontFamily:"DM Mono,monospace",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>
                      Score crediticio
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{
                        width:42,height:42,borderRadius:"50%",
                        background:"linear-gradient(135deg,var(--accent),var(--accent2))",
                        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0
                      }}>
                        <span style={{fontFamily:"DM Serif Display,serif",fontSize:"0.95rem",color:"#fff",lineHeight:1}}>{empresa.score}</span>
                      </div>
                      <div>
                        <div style={{fontSize:"0.78rem",fontWeight:600}}>{empresa.clasificacion}</div>
                        <div style={{fontSize:"0.68rem",color:"var(--muted)"}}>Historial crediticio</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ── STEP 2: Éxito ── */}
        {step === 2 && savedData && (
          <div className="card" style={{maxWidth:520,width:"100%"}}>
            <div className="success-wrap">
              <div className="success-icon">✓</div>
              <div className="success-title">Transacción registrada</div>
              <div className="success-sub">
                La venta a crédito fue registrada exitosamente para<br/>
                <strong>{empresa.razon_social}</strong>
              </div>
              <div className="success-code">
                {savedData.codigo_transaccion} · ID #{savedData.id}
              </div>
              <div style={{
                background:"var(--bg)",borderRadius:12,padding:"16px 20px",
                marginBottom:24, textAlign:"left",
                border:"1px solid var(--border)"
              }}>
                {[
                  {label:"Monto total",    val: fmt(savedData.monto_total)},
                  {label:"Fecha venta",    val: savedData.fecha_venta},
                  {label:"Vencimiento",    val: savedData.fecha_vencimiento},
                  {label:"Estado",         val: "Pendiente"},
                  {label:"Ítems",          val: `${savedData.items.length} producto${savedData.items.length>1?"s":""}`},
                ].map(r => (
                  <div key={r.label} style={{
                    display:"flex",justifyContent:"space-between",
                    padding:"6px 0",borderBottom:"1px solid rgba(226,221,212,0.5)",
                    fontSize:"0.8rem"
                  }}>
                    <span style={{color:"var(--muted)"}}>{r.label}</span>
                    <span style={{fontFamily:"DM Mono,monospace",fontSize:"0.76rem"}}>{r.val}</span>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  Nueva transacción
                </button>
                <button className="btn btn-primary">
                  Registrar pago →
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}