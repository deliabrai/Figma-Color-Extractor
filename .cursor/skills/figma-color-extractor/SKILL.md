---
name: figma-color-extractor
description: Extrae los 3 colores dominantes de un screenshot, genera rampas OKLCH de 12 pasos en Figma (variables en colección brand-colors + swatches visuales en el canvas) y produce color-palette.html con las CSS custom properties. Activar cuando el usuario proporcione una URL de Figma y un screenshot y pida extraer colores, generar rampas o crear variables de color.
---

# Figma Color Extractor — Skill

> **Ejercicio didáctico**: este flujo demuestra cómo colaboran las tres capas.
> Consulta [architecture.md](architecture.md) para la explicación completa.

## Quién hace qué en este flujo

```
SKILL  →  define los pasos y las fórmulas (este archivo)
MCP    →  ejecuta acciones en Figma y en el sistema de archivos
AGENT  →  analiza la imagen, toma decisiones, llama a MCPs en orden
```

---

## Flujo de 7 pasos (seguir en orden)

### Paso 1 — Parsear la URL de Figma
Extraer de la URL:
- `fileKey`: segmento tras `/design/`
- `nodeId`: valor de `node-id=`, convirtiendo `-` en `:`

### Paso 2 — Analizar el screenshot
Identificar los **3 colores más representativos**:
1. Color primario (más dominante / de marca)
2. Color de acento o fondo
3. Color de texto o neutro

Para cada uno: obtener hex aproximado del tono medio (no el más claro ni más oscuro).

### Paso 3 — Calcular rampas OKLCH
Para cada color, usando `scripts/oklch.js`:

```js
const { C, H } = hexToOklchApprox('#HEX_DEL_COLOR');
const ramp = generateRamp(C, H); // 12 pasos, L de 0.97 a 0.20
```

Resultado: 3 arrays de 12 objetos `{ step, hex, oklch, figmaColor }`.

### Paso 4 — Navegar a la página de Figma
```js
// MCP: project-figma-console › figma_execute
const page = await figma.getNodeByIdAsync('NODE_ID');
await figma.setCurrentPageAsync(page);
```

### Paso 5 — Crear variables en Figma
```
MCP: project-figma-console › figma_setup_design_tokens
  collectionName: "brand-colors"
  modes: ["Value"]
  tokens: [ ...36 tokens con nombre "<color>/<step>" ]
```

### Paso 6 — Generar swatches en el canvas
```js
// MCP: project-figma-console › figma_execute
// Para cada rampa:
//   - 12 RECTANGLE de 140×140px, cornerRadius 0, gap 4px
//   - fill vinculado a variable con setBoundVariableForPaint
//   - etiquetas: número de paso + hex
//   - agrupar en FRAME "Color Ramp / <nombre>"
//   - título con createText()
// Layout: rampas apiladas, y += (80 + 64 + 48) por rampa
```

Ver implementación completa en `scripts/figma-swatches.js`.

### Paso 7 — Validar y generar web
1. Capturar screenshot: `project-figma-console › figma_capture_screenshot`
2. Si es correcto: crear `color-palette.html` en la raíz del proyecto
3. Seguir la estructura de `scripts/web-template.md`
4. Abrir en el navegador: `open color-palette.html`

---

## Referencias
- [architecture.md](architecture.md) — explicación didáctica para alumnos
- [scripts/oklch.js](scripts/oklch.js) — conversión OKLCH ↔ hex
- [scripts/figma-swatches.js](scripts/figma-swatches.js) — código para figma_execute
- [scripts/web-template.md](scripts/web-template.md) — especificación de la página web
