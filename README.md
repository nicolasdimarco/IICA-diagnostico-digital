# IICA - Diagnóstico Digital

Herramienta web de autoevaluación para medir el nivel de madurez digital en organizaciones vinculadas a la **Agricultura Familiar**, en el marco del trabajo del IICA (Instituto Interamericano de Cooperación para la Agricultura).

🔗 **Demo en vivo:** https://nicolasdimarco.github.io/IICA-diagnostico-digital/

## Módulo 1: Línea Base de Madurez

El instrumento permite recorrer, en una única página, cuatro pasos secuenciales:

1. **Cuestionario y gráfico** — autoevaluación cuantitativa (escala 0–5) sobre cuatro dimensiones:
   - Tecnología y Conectividad
   - Procesos y Operaciones
   - Personas y Competencias
   - Cultura y Gobernanza
2. **Análisis** — guía cualitativa con un "muro de hallazgos" para profundizar en el *porqué* de los resultados.
3. **FODA** — matriz FODA digital con cruces estratégicos para identificar familias de problemas.
4. **Puntos críticos** — embudo de priorización para definir focos de intervención.

Los resultados se visualizan en un **gráfico radar** (Chart.js) y pueden **descargarse como reporte**.

## Características

- 100% estático: un único archivo HTML, sin backend ni build.
- Visualización con [Chart.js](https://www.chartjs.org/) vía CDN.
- Estilos con [Tailwind CSS](https://tailwindcss.com/) vía CDN y tipografía Fira Sans.
- Paleta institucional IICA (teal `#009C8F`, azul `#083E70`, gris claro `#EEEEEE`).
- Funciona offline una vez cargada (salvo CDNs).

## Uso local

Basta con abrir el archivo en cualquier navegador moderno:

```bash
xdg-open "instrumentos diagnostico digital - M1.html"
```

O servirlo localmente:

```bash
python3 -m http.server 8000
# luego abrir http://localhost:8000/
```

## Despliegue (GitHub Pages)

El sitio se publica automáticamente desde la rama `main` (raíz del repositorio). El archivo `index.html` redirige al instrumento principal.

Para activarlo en un fork:

1. Ir a **Settings → Pages**.
2. En **Source**, seleccionar **Deploy from a branch**.
3. Elegir rama `main` y carpeta `/ (root)`. Guardar.

## Estructura

```
.
├── index.html                                  # Redirección a la app
├── instrumentos diagnostico digital - M1.html  # Aplicación (Módulo 1)
├── LICENSE
└── README.md
```

## Licencia

Ver [LICENSE](LICENSE).