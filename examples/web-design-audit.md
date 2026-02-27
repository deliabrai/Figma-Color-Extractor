# Web Design Guidelines — Audit Report

**Skill:** `web-design-guidelines` (vercel-labs/agent-skills)  
**Date:** 2026-02-27  
**Files audited:** `color-palette.html`, `oklch-colors.html`

---

## color-palette.html

| Location | Rule | Status |
|----------|------|--------|
| `:311` | `onclick` inline en `<button>` → usar `addEventListener` | ✅ Fixed |
| `:155` | `.swatch` con `cursor:pointer` sin `role="button"`, `aria-label` ni teclado | ✅ Fixed |
| `:398` | `swatch.onclick` sin keyboard handler — no accesible con Tab | ✅ Fixed |
| `:399` | `navigator.clipboard` sin `.catch()` fallback | ✅ Fixed |
| `:270` | `transition` en toast sin `prefers-reduced-motion` | ✅ Fixed |
| `:292` | `<svg>` decorativo sin `aria-hidden="true"` | ✅ Fixed |
| `:474` | Toast sin `aria-live="polite"` — actualizaciones async no anunciadas | ✅ Fixed |
| — | Botones y swatches sin `:focus-visible` ring | ✅ Fixed |

---

## oklch-colors.html

| Location | Rule | Status |
|----------|------|--------|
| `:280` | `onclick` inline en `<button>` → usar `addEventListener` | ✅ Fixed |
| `:249` | `<svg>` decorativo sin `aria-hidden="true"` | ✅ Fixed |
| `:334` | Swatch `div` con click sin `role="button"`, `aria-label` ni teclado | ✅ Fixed |
| `:342` | `addEventListener click` sin `keydown` — no accesible con Tab | ✅ Fixed |
| `:133` | `transition` sin `prefers-reduced-motion` | ✅ Fixed |
| `:285` | Toast sin `aria-live="polite"` | ✅ Fixed |
| `:369` | `innerHTML` con datos — reemplazado por DOM API (sin XSS) | ✅ Fixed |
| `:324` | Luminancia sin gamma correction sRGB correcta | ✅ Fixed |

---

## Resumen de cambios aplicados

### Accesibilidad
- Todos los swatches interactivos tienen `role="button"`, `tabindex="0"` y `aria-label` descriptivo
- Keyboard handlers (`keydown` con `Enter`/`Space`) en todos los elementos clickables
- SVGs decorativos marcados con `aria-hidden="true" focusable="false"`
- Toast con `role="status"` y `aria-live="polite"` para lectores de pantalla

### Focus States
- Swatches: `:focus-visible` con `outline: 2px solid`
- Botones Copy: `:focus-visible` con `outline: 2px solid #fff`

### Animación
- `@media (prefers-reduced-motion: reduce)` añadido en ambos archivos
- Desactiva transitions en swatches y toast

### Robustez
- `navigator.clipboard` con `.catch()` en todos los usos
- `onclick` inline eliminados — todos usan `addEventListener`
- DOM API en lugar de `innerHTML` para evitar XSS (oklch-colors.html)
- Gamma correction correcta (sRGB) en cálculo de luminancia relativa

---

## Reglas que no aplican a estos archivos

- **Forms**: No hay formularios
- **Images**: No hay `<img>` tags
- **Navigation**: No hay links de navegación
- **i18n**: Contenido estático, sin fechas ni números formateados
- **Performance / virtualización**: Listas de 12 items (muy por debajo del umbral de 50)
