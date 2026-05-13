# IICA - Diagnóstico Digital

Herramienta web de autoevaluación para medir el nivel de madurez digital en organizaciones vinculadas a la **Agricultura Familiar**, en el marco del trabajo del IICA (Instituto Interamericano de Cooperación para la Agricultura).

🔗 **Demo en vivo:** https://nicolasdimarco.github.io/IICA-diagnostico-digital/

## Módulo 1: Línea Base de Madurez

El instrumento se recorre en cuatro pestañas secuenciales (navegación pegajosa en la parte superior):

1. **Niveles Clave** — autoevaluación cuantitativa (escala 0–5) sobre cuatro dimensiones. Implementada como **wizard de dos pasos** con indicador tipo *breadcrumb* (flechas):
   - Paso 1 *Completar cuestionario* → formulario en 4 paneles (Tecnología y Conectividad, Procesos y Operaciones, Personas y Competencias, Cultura y Gobernanza). La pregunta 1.4 *Integración de Sistemas* sólo aparece si 1.3 *Sistemas de Gestión* ≥ 1.
   - Paso 2 *Ver resultados* → gráfico **radar** (Chart.js) + tabla de promedios + guía de interpretación.
2. **Análisis** — guía cualitativa con un *muro de hallazgos* para profundizar en el *porqué* de los resultados.
3. **FODA** — matriz FODA digital con cruces estratégicos (FO, DO, FA, DA) para identificar familias de problemas.
4. **Puntos críticos** — embudo de priorización (scatter Esfuerzo × Impacto) para definir focos de intervención.

Los resultados pueden **descargarse como reporte `.txt`** desde el header (botón "Descargar resultados").

## Stack

- [Vite 5](https://vitejs.dev/) + [React 18](https://react.dev/) (JavaScript).
- [Tailwind CSS 3](https://tailwindcss.com/) con la paleta institucional IICA (teal `#009C8F`, azul `#083E70`, gris claro `#EEEEEE`); bordes rectos globales (sin redondeos), pills del wizard recortadas con `clip-path` en `≥ sm`.
- [Chart.js 4](https://www.chartjs.org/) + [react-chartjs-2](https://react-chartjs-2.js.org/) para el radar de madurez y el scatter del embudo.
- Estado global con **Context API** (`DiagnosticoContext`) — sin persistencia ni backend.
- Tests con **Vitest 2** + **@testing-library/react** + **jsdom**.
- Tipografía Fira Sans.

## Uso local

Requiere **Node.js 18+** y **npm**.

```bash
git clone https://github.com/nicolasdimarco/IICA-diagnostico-digital.git
cd IICA-diagnostico-digital
npm install
npm run dev        # http://localhost:5173/IICA-diagnostico-digital/
```

### Scripts disponibles

| Script              | Descripción                                                    |
| ------------------- | -------------------------------------------------------------- |
| `npm run dev`       | Servidor de desarrollo con HMR.                                |
| `npm run build`     | Build de producción a `dist/`.                                 |
| `npm run preview`   | Sirve el contenido de `dist/` para verificar el build.         |
| `npm test`          | Corre los tests en modo *watch* (Vitest).                      |
| `npm run test:run`  | Corre los tests una sola vez (modo CI).                        |

> El path base de la app en dev y prod es `/IICA-diagnostico-digital/` (configurado en `vite.config.js`). Si forkeás el repo, ajustá `base` al nombre de tu repositorio.

## Tests

La suite cubre las piezas con lógica no trivial:

- **`src/data/preguntas.test.js`** — `calcularPromedio` y `promediosDimensiones`, incluyendo la regla de dependencia `d1_q4` ↔ `d1_q3 ≥ 1`.
- **`src/utils/descargarReporte.test.js`** — generación del reporte `.txt` (formato de promedios con 2 decimales, FODA, cruces, puntos críticos) y disparo del download.
- **`src/state/DiagnosticoContext.test.jsx`** — todos los setters del estado central (respuestas, hallazgos, FODA, cruces, puntos del embudo) y la limpieza automática de `d1_q4`.
- **`src/tabs/TabNiveles.test.jsx`** — flujo del wizard de 2 pasos: estado inicial, render condicional de 1.4, transición ida-y-vuelta, y propagación de respuestas al paso de resultados.

```bash
npm run test:run
```

Salida esperada: `Tests  29 passed (29)`.

## CI / CD

Dos workflows en `.github/workflows/`:

- [`ci.yml`](./.github/workflows/ci.yml) — corre en **Pull Requests a `main`** (y manualmente). Ejecuta `npm ci`, `npm run test:run` y `npm run build`. Sirve como gate antes de mergear.
- [`deploy.yml`](./.github/workflows/deploy.yml) — corre en **push a `main`** (y manualmente). Job `test` → `build` → `deploy`. Si los tests fallan, no se buildea ni se publica.

Para activarlo en un fork:

1. Ir a **Settings → Pages**.
2. En **Source**, seleccionar **GitHub Actions** (no *Deploy from a branch*).
3. (Opcional) En **Actions → Deploy to GitHub Pages**, usar **Run workflow** para forzar el primer deploy.

## Estructura

```
.
├── index.html                # Entry point de Vite
├── vite.config.js            # Config Vite + Vitest
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── src/
│   ├── main.jsx              # Bootstrap de React
│   ├── App.jsx               # Layout + estado de pestañas
│   ├── index.css             # Tailwind + estilos globales (incluye .wizard-pill)
│   ├── components/           # Header, TabsNav, RadarMadurez, TablaPromedios
│   ├── tabs/                 # TabNiveles, TabAnalisis, TabFoda, TabEmbudo
│   ├── state/                # DiagnosticoContext (estado central)
│   ├── data/                 # Definición de dimensiones y preguntas
│   ├── utils/                # Generador de reporte .txt
│   └── test/                 # Setup de Vitest (jest-dom matchers)
├── legacy/                   # Versión HTML original (referencia)
├── .github/workflows/        # CI/CD para GitHub Pages
├── LICENSE
└── README.md
```

## Licencia

Ver [LICENSE](LICENSE).