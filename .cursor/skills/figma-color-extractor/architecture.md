# Arquitectura: Agents, MCPs y Skills

> Documento didáctico para el ejercicio **Figma Color Extractor**.

---

## La analogía del restaurante

| Rol | Equivalente en IA |
|-----|-------------------|
| **Jefe de cocina** — decide qué platos hacer y en qué orden | **Agent** |
| **Recetas escritas** — el jefe las consulta para no improvisar | **Skills** |
| **Herramientas** — horno, batidora, cuchillo | **MCPs** |

El jefe no inventa cómo batir huevos cada vez (consulta la receta = Skill).
Y no bate con las manos (usa la batidora = MCP).

---

## Las tres capas en este proyecto

### 🤖 Agent — el que piensa y decide

- Lee el mensaje del usuario y el screenshot
- Decide qué colores son "dominantes" (capacidad del LLM, no de ningún MCP)
- Orquesta las llamadas a MCPs en el orden correcto
- Detecta errores y se adapta

**Lo que NO puede hacer solo:**
- No puede abrir Figma
- No puede crear variables ni swatches
- No puede escribir archivos en el disco

---

### 🔌 MCPs — los que actúan en el mundo real

Dos MCPs en este proyecto, con roles distintos:

#### `project-figma-console` (escritura)
- Transporte: **WebSocket local** → Figma Desktop
- Requiere: Figma Desktop abierto + plugin Desktop Bridge
- Capacidades: crear variables, frames, rectángulos, ejecutar JS en Figma
- Herramientas clave: `figma_execute`, `figma_setup_design_tokens`, `figma_capture_screenshot`

#### `user-figma-remote` (lectura)
- Transporte: **HTTPS REST** → API de Figma
- Requiere: solo token API válido
- Capacidades: leer nodos, obtener screenshots renderizados, leer variables
- Herramientas clave: `get_design_context`, `get_screenshot`, `get_variable_defs`

```
                    ┌─────────────────────────────┐
                    │           AGENT              │
                    │  (analiza, decide, orquesta) │
                    └──────┬──────────────┬────────┘
                           │              │
              ┌────────────▼───┐    ┌─────▼──────────────┐
              │project-figma-  │    │  user-figma-remote  │
              │   console      │    │  (solo lectura)     │
              │  (escritura)   │    └─────────────────────┘
              └────────┬───────┘           │
                       │ WebSocket         │ HTTPS REST
              ┌────────▼───────┐    ┌──────▼──────┐
              │ Figma Desktop  │    │  Figma API  │
              └────────────────┘    └─────────────┘
```

---

### 📋 Skills — el conocimiento especializado

- Archivos Markdown que el Agent lee para saber cómo hacer algo
- Definen el flujo de 7 pasos de este ejercicio
- Contienen las fórmulas OKLCH y los scripts reutilizables
- No ejecutan nada por sí solas — necesitan al Agent

**Sin la Skill:** el Agent inventaría el flujo cada vez → inconsistente.
**Sin el Agent:** la Skill es solo texto, no hace nada.

---

## El flujo completo

```
USUARIO
  ├─ URL de Figma (página vacía)
  └─ Screenshot del componente
         │
         ▼
    AGENT lee SKILL.md
         │
         ├─ Paso 2: Analiza screenshot → 3 colores (solo el LLM puede hacer esto)
         │
         ├─ Paso 3: Aplica fórmulas OKLCH (de scripts/oklch.js)
         │          → 36 valores hex (12 pasos × 3 colores)
         │
         ├─ Paso 4: MCP project-figma-console › figma_execute
         │          → navega a la página en Figma Desktop
         │
         ├─ Paso 5: MCP project-figma-console › figma_setup_design_tokens
         │          → crea colección "brand-colors" + 36 variables
         │
         ├─ Paso 6: MCP project-figma-console › figma_execute
         │          → crea swatches visuales, vincula variables
         │
         ├─ Paso 7a: MCP project-figma-console › figma_capture_screenshot
         │           → valida visualmente
         │
         └─ Paso 7b: Escribe color-palette.html
                     → abre en el navegador
         │
         ▼
RESULTADO
  ✓ Variables en Figma (colección brand-colors)
  ✓ Swatches visuales en el canvas
  ✓ color-palette.html con CSS vars interactivo
```

---

## Por qué la separación importa

| Sin esta capa | Consecuencia |
|---|---|
| Sin Skills | El Agent improvisa el flujo → tokens inconsistentes, pasos olvidados |
| Sin MCPs | El Agent sabe qué hacer pero no puede ejecutarlo en Figma |
| Sin Agent | Los MCPs pueden ejecutar pero no saben cuándo ni qué decidir |

---

## Preguntas para los alumnos

1. ¿Qué pasaría si el token de Figma expira a mitad del flujo? ¿Qué capa lo detecta y cuál lo resuelve?
2. Si quisieras reutilizar este flujo para extraer colores de Pinterest, ¿qué cambiarías: la Skill, el MCP o el Agent?
3. ¿Por qué la conversión OKLCH está en un script de la Skill y no hardcodeada en el Agent?
4. Si Figma cambia su API y `figma_execute` deja de funcionar, ¿qué capa hay que actualizar?
5. ¿Podría un MCP reemplazar al Agent? ¿Por qué no?
6. ¿Por qué este proyecto tiene su propio `mcp.json` en lugar de usar el global?
