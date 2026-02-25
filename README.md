# 📊 ScoreCredit — Sistema Crediticio

Sistema web para gestión de créditos empresariales: registro de empresas, transacciones a crédito, abonos y seguimiento de score crediticio.

---

## 🚀 Requisitos previos

Antes de empezar, asegúrate de tener instalado lo siguiente en tu máquina:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|----------|
| **Node.js** | v18 o superior | [nodejs.org](https://nodejs.org/) |
| **npm**     | v9 o superior  | Viene incluido con Node.js |
| **Git**     | cualquier versión reciente | [git-scm.com](https://git-scm.com/) |

> **¿Cómo verificar que ya los tienes?**
> Abre una terminal y ejecuta:
> ```bash
> node -v
> npm -v
> git --version
> ```

---

## 📦 Instalación

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/score-crediticio.git
cd score-crediticio
```

### 2. Instala las dependencias

```bash
npm install
```

Esto instalará automáticamente todas las librerías del proyecto definidas en `package.json`.

### 3. Levanta el servidor de desarrollo

```bash
npm run dev
```

Abre tu navegador en **http://localhost:5173** (o el puerto que indique la terminal).

---

## 🏗️ Estructura del proyecto

```
score-crediticio/
├── public/               # Archivos estáticos (favicon, etc.)
├── src/
│   ├── assets/           # Imágenes y recursos
│   ├── App.jsx           # Componente raíz + navegación por pasos
│   ├── EmpresaPanel.jsx  # Paso 1: Buscar o registrar empresa
│   ├── TransaccionPanel.jsx  # Paso 2: Crear venta a crédito
│   ├── PagoPanel.jsx     # Paso 3: Registrar abono/pago
│   ├── HistorialScorePanel.jsx  # Paso 4: Ver score crediticio
│   └── main.jsx          # Punto de entrada de React
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔄 Flujo de la aplicación

El sistema guía al usuario a través de 4 pasos secuenciales:

```
[1. Empresa] → [2. Transacción] → [3. Pago] → [4. Score]
```

1. **Empresa** — Busca por RUC o registra una empresa nueva.
2. **Transacción** — Crea una venta a crédito para esa empresa.
3. **Pago** — Registra un abono a la deuda.
4. **Score** — Visualiza el historial crediticio y el score calculado.

---

## 🌐 Dependencias principales

Las dependencias se instalan solas con `npm install`. Aquí un resumen de qué hace cada una:

| Paquete | Para qué se usa |
|---------|----------------|
| `react` | Biblioteca principal de UI |
| `react-dom` | Renderizado de React en el navegador |
| `vite` | Servidor de desarrollo y bundler ultra-rápido |
| `@vitejs/plugin-react` | Plugin para que Vite soporte JSX de React |

> Las fuentes (`DM Sans`, `DM Serif Display`, `DM Mono`) se cargan desde **Google Fonts** automáticamente — no requieren instalación.

---

## 🛠️ Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo (hot reload)
npm run build    # Genera la versión optimizada para producción en /dist
npm run preview  # Previsualiza el build de producción localmente
```

---

## 🌍 Despliegue (producción)

```bash
npm run build
```

La carpeta `dist/` generada puede subirse a cualquier servicio de hosting estático:

- [Vercel](https://vercel.com) — `vercel deploy`
- [Netlify](https://netlify.com) — arrastra la carpeta `dist/`
- [GitHub Pages](https://pages.github.com)

---

## 🔧 Variables de entorno (si aplica)

Si el proyecto consume una API backend, crea un archivo `.env` en la raíz:

```env
VITE_API_URL=https://tu-backend.com/api
```

> Todos los valores de entorno en Vite deben empezar con `VITE_` para ser accesibles desde el código.

---

## ❓ Problemas comunes

**`npm install` falla con errores de permisos**
```bash
# En Mac/Linux, intenta con sudo o corrige los permisos de npm:
sudo npm install
```

**El puerto 5173 ya está en uso**
```bash
# Puedes cambiar el puerto en vite.config.js o usar:
npm run dev -- --port 3000
```

**La página carga en blanco**
- Verifica que Node.js sea v18 o superior con `node -v`.
- Borra la carpeta `node_modules` y vuelve a instalar:
  ```bash
  rm -rf node_modules
  npm install
  ```

---

## 📄 Licencia

MIT — libre para uso personal y comercial.