/**
 * OKLCH ↔ sRGB conversion utilities
 * Skill: figma-color-extractor
 *
 * Pegar en figma_execute() o usar como referencia para el Agent.
 */

// ── OKLCH → sRGB ──────────────────────────────────────────────────────────────
function oklchToRgb(L, C, H) {
  const h = H * Math.PI / 180;
  const a_ = C * Math.cos(h);
  const b_ = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a_ - 1.2914855480 * b_;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  let r =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

  const gamma = c => {
    if (c <= 0) return 0;
    if (c >= 1) return 1;
    return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  return { r: gamma(r), g: gamma(g), b: gamma(b) };
}

// ── hex → parámetros OKLCH ────────────────────────────────────────────────────
function hexToOklchApprox(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const toLinear = c => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const rl = toLinear(r), gl = toLinear(g), bl = toLinear(b);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);

  const L  =  0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a  =  1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bv =  0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bv * bv);
  const H = ((Math.atan2(bv, a) * 180 / Math.PI) + 360) % 360;

  return { L: +L.toFixed(3), C: +C.toFixed(3), H: +H.toFixed(1) };
}

// ── Generar rampa de 12 pasos ─────────────────────────────────────────────────
function generateRamp(C, H, steps = 12) {
  return Array.from({ length: steps }, (_, i) => {
    const L = 0.97 - (i / (steps - 1)) * 0.77;
    const { r, g, b } = oklchToRgb(L, C, H);
    const clamp = v => Math.max(0, Math.min(1, v));
    const toHex = v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0');
    return {
      step:       (i + 1) * 50,
      L:          +L.toFixed(3),
      oklch:      `oklch(${L.toFixed(3)} ${C} ${H})`,
      hex:        `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase(),
      figmaColor: { r: clamp(r), g: clamp(g), b: clamp(b) }
    };
  });
}
