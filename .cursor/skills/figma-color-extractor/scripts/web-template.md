# Web Template — color-palette.html

El Agent genera este archivo en la raíz del proyecto (Paso 7).

## Estructura requerida

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- CSS vars de los 36 tokens en :root -->
  <!-- Estilos inline (sin CDN) -->
</head>
<body>
  <!-- Header: título + descripción + badge "Exported from Figma" -->
  <!-- 3 secciones de rampas (una por color) -->
  <!-- Panel de CSS con syntax highlighting + botón Copy -->
  <!-- Toast de confirmación -->
  <!-- Script inline: renderSwatches(), copyCSS(), showToast() -->
</body>
</html>
```

## CSS vars format

```css
:root {
  /* Blue — oklch(L 0.18 264) */
  --blue-50:  #EFF6FF; /* oklch(0.970 0.18 264) */
  --blue-100: #DBEAFE; /* oklch(0.907 0.18 264) */
  /* ... 12 steps ... */
  --blue-600: #1E3A5F; /* oklch(0.270 0.18 264) */
}
```

## Tokens JS (para el script de swatches)

```js
const tokens = {
  blue: [
    { step: 50,  hex: '#EFF6FF', oklch: 'oklch(0.970 0.18 264)' },
    // ... 12 items
  ],
  // ...
};
```

## Funcionalidades obligatorias

- Click en swatch → copia hex al portapapeles
- Hover → `transform: scale(1.06) translateY(-2px)` + sombra
- Etiquetas: número de paso + hex + OKLCH abreviado
- Panel CSS con clases `.token-selector` `.token-prop` `.token-value` `.token-comment`
- Botón Copy en el panel → copia todo el bloque `:root { ... }`
- Toast 2.2s de confirmación
- Responsive: 12 col desktop / 6 col mobile (`@media (max-width: 700px)`)
- `textColor(hex)` → texto claro u oscuro según luminancia (umbral 0.35)

## Paleta de la UI

```
--bg:      #f9f9f8
--surface: #ffffff
--text:    #1a1a1a
--muted:   #6b6b6b
--border:  #e5e5e3
--code-bg: #1a1a1a
```

## Sin dependencias externas
Fuente: `-apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
