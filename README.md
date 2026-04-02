# Figma Color Extractor

Ejercicio didáctico que demuestra la colaboración entre **Agents**, **MCPs** y **Skills** en Cursor.

### 🔗 [Ver diagrama del flujo en vivo →](https://figma-color-extractor-flow.vercel.app)

---

## Cómo usar

1. Abre este proyecto en Cursor
2. Pega una URL de una página vacía de Figma
3. Adjunta un screenshot de cualquier componente o UI
4. El agente hace el resto automáticamente

**Output:**
- Variables de color en Figma (colección `brand-colors`, 36 tokens)
- Swatches visuales en el canvas de Figma
- `examples/color-palette.html` — página web interactiva con las CSS vars

---

## Estructura del proyecto

```
.
├── AGENTS.md                          ← Comportamiento del agente orquestador
├── README.md                          ← Este archivo
│
├── examples/                          ← Outputs generados por el agente
│   ├── color-palette.html             ← Paleta web con CSS custom properties
│   ├── color-palette-2.html           ← Segunda ejecución de ejemplo
│   ├── oklch-colors.html              ← Visualizador OKLCH de referencia
│   └── web-design-audit.md           ← Auditoría de diseño generada
│
└── .cursor/
    ├── mcp.json                       ← MCP aislado (excluido del repo, ver .gitignore)
    ├── mcp.json.example               ← Plantilla sin token (sí versionada); copiar a mcp.json
    │
    ├── rules/
    │   ├── project.mdc                ← Reglas globales del proyecto
    │   ├── figma.mdc                  ← Reglas para operaciones Figma
    │   └── oklch.mdc                  ← Reglas de conversión de color
    │
    └── skills/
        └── figma-color-extractor/
            ├── SKILL.md               ← Flujo de 7 pasos (skill principal)
            ├── architecture.md        ← Explicación didáctica Agents/MCPs/Skills
            └── scripts/
                ├── oklch.js           ← Conversión OKLCH ↔ hex
                ├── figma-swatches.js  ← Código para figma_execute (Paso 6)
                └── web-template.md   ← Especificación de color-palette.html
```

---

## Arquitectura de capas

```
┌─────────────────────────────────────────────────────┐
│                     AGENT                           │
│  Lee AGENTS.md + Rules + Skill                      │
│  Analiza el screenshot (capacidad del LLM)          │
│  Orquesta las llamadas a MCPs                       │
└──────────────────┬──────────────────────────────────┘
                   │
       ┌───────────┴───────────┐
       │                       │
┌──────▼──────────┐   ┌────────▼────────────┐
│ project-figma-  │   │  user-figma-remote  │
│    console      │   │  (lectura REST API) │
│ (escritura      │   └─────────────────────┘
│  WebSocket)     │
└──────┬──────────┘
       │
┌──────▼──────────┐
│  Figma Desktop  │
│  (canvas +      │
│   variables)    │
└─────────────────┘
```

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| **Agent** | `AGENTS.md` | Orquesta, analiza imágenes, toma decisiones |
| **Rules** | `.cursor/rules/*.mdc` | Restricciones y convenciones del proyecto |
| **Skill** | `.cursor/skills/figma-color-extractor/SKILL.md` | Protocolo de 7 pasos + fórmulas |
| **MCP** | `.cursor/mcp.json` → `project-figma-console` | Escritura en Figma Desktop |
| **MCP** | Global → `user-figma-remote` | Lectura de Figma via REST |

---

## Por qué `.cursor/mcp.json` local

El MCP `project-figma-console` está definido **solo en este proyecto** para:
- Evitar conflictos con otras sesiones de Figma abiertas
- Tener un nombre específico (`project-figma-console`) que las rules y el agente referencian explícitamente
- Aislar el token y la configuración del proyecto

> `mcp.json` está en `.gitignore` y no se sube al repo. Al clonar, copia `.cursor/mcp.json.example` a `.cursor/mcp.json` y sustituye `TU_TOKEN_AQUI`, o créalo con esta estructura:
> ```json
> {
>   "mcpServers": {
>     "project-figma-console": {
>       "command": "npx",
>       "args": ["-y", "figma-console-mcp@latest"],
>       "env": {
>         "FIGMA_ACCESS_TOKEN": "TU_TOKEN_AQUI",
>         "ENABLE_MCP_APPS": "true"
>       }
>     }
>   }
> }
> ```

---

## Mantenimiento

**Puertos WebSocket ocupados:**
```bash
lsof -ti :9223-9232 | xargs kill -9 2>/dev/null && echo "Puertos liberados"
```

**Token de Figma expirado:**
1. Ir a figma.com/settings → Personal access tokens
2. Generar nuevo token con scope `file_variables:write`
3. Actualizar en `.cursor/mcp.json`

---

## Para los alumnos

Lee `.cursor/skills/figma-color-extractor/architecture.md` para entender:
- Qué hace cada capa y por qué
- El diagrama del flujo completo
- Las preguntas de debate
