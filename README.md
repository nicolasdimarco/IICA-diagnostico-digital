# IICA - Diagnóstico Digital

Herramienta web de autoevaluación para medir el nivel de madurez digital en organizaciones vinculadas a la **Agricultura Familiar**, en el marco del trabajo del IICA (Instituto Interamericano de Cooperación para la Agricultura).

🔗 **Demo en vivo:** https://nicolasdimarco.github.io/IICA-diagnostico-digital/

## Módulo 1: Línea Base de Madurez

El instrumento permite recorrer, en una única página, cuatro pasos secuenciales:

1. **Niveles Clave** — autoevaluación cuantitativa (escala 0–5) sobre cuatro dimensiones:
   - Tecnología y Conectividad
   - Procesos y Operaciones
   - Personas y Competencias
   - Cultura y Gobernanza
2. **Análisis** — guía cualitativa con un "muro de hallazgos" para profundizar en el *porqué* de los resultados.
3. **FODA** — matriz FODA digital con cruces estratégicos para identificar familias de problemas.
4. **Puntos críticos** — embudo de priorización para definir focos de intervención.

Los resultados se visualizan en un **gráfico radar** (Chart.js) y pueden **descargarse como reporte**.

## Stack

- [Vite 5](https://vitejs.dev/) + [React 18](https://react.dev/) (JavaScript).
- [Tailwind CSS 3](https://tailwindcss.com/) con la paleta institucional IICA (teal `#009C8F`, azul `#083E70`, gris claro `#EEEEEE`).
- [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) para el radar de madurez y el scatter del embudo de priorización.
- Tipografía Fira Sans.

## Uso local

Requiere Node.js 18+ y npm.

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # build de producción a dist/
npm run preview    # previsualiza el build
```

## Despliegue (GitHub Pages)

El sitio se publica automáticamente en cada push a `main` mediante el workflow
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml), que buildea con
Vite y publica `dist/` vía `actions/deploy-pages`.

Para activarlo en un fork:

1. Ir a **Settings → Pages**.
2. En **Source**, seleccionar **GitHub Actions**.

El valor de `base` en `vite.config.js` debe coincidir con el nombre del repositorio.

## Estructura

```
.
├── index.html                # Entry point de Vite
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── src/
│   ├── main.jsx              # Bootstrap de React
│   ├── App.jsx               # Layout + estado de pestañas
│   ├── index.css             # Tailwind + estilos globales
│   ├── components/           # Header, TabsNav, RadarMadurez, TablaPromedios
│   ├── tabs/                 # TabNiveles, TabAnalisis, TabFoda, TabEmbudo
│   ├── state/                # DiagnosticoContext (estado central)
│   ├── data/                 # Definición de dimensiones y preguntas
│   └── utils/                # Generador de reporte .txt
├── legacy/                   # Versión HTML original (referencia)
├── .github/workflows/        # CI/CD para GitHub Pages
├── LICENSE
└── README.md
```

## Licencia

Ver [LICENSE](LICENSE).