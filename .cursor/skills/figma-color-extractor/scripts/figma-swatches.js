/**
 * figma-swatches.js
 * Skill: figma-color-extractor — Paso 6
 *
 * Pegar COMPLETO dentro de figma_execute().
 * Sustituir RAMPS_DATA con el array generado en el Paso 3.
 *
 * RAMPS_DATA formato:
 * [
 *   { name: 'blue',  steps: [ { step:50, hex:'#...', figmaColor:{r,g,b} }, ... ] },
 *   { name: 'coral', steps: [ ... ] },
 *   { name: 'slate', steps: [ ... ] },
 * ]
 */

// ── SUSTITUIR ESTO con los datos reales del Paso 3 ───────────────────────────
const RAMPS_DATA = [/* INJECT_RAMPS */];
// ─────────────────────────────────────────────────────────────────────────────

await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

const allVars = await figma.variables.getLocalVariablesAsync();
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const brandCol = collections.find(c => c.name === 'brand-colors');

const SWATCH_W = 140, SWATCH_H = 140, GAP = 4;
const RAMP_GAP = 48, START_X = 100, START_Y = 100;
const LABEL_H = 40; // espacio para etiquetas debajo del swatch

for (let ri = 0; ri < RAMPS_DATA.length; ri++) {
  const ramp = RAMPS_DATA[ri];
  const rampY = START_Y + ri * (SWATCH_H + LABEL_H + RAMP_GAP + 28);

  // Título de la rampa
  const title = figma.createText();
  title.fontName = { family: 'Inter', style: 'Bold' };
  title.fontSize = 14;
  title.characters = ramp.name.charAt(0).toUpperCase() + ramp.name.slice(1);
  title.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }];
  title.x = START_X;
  title.y = rampY - 22;
  figma.currentPage.appendChild(title);

  const swatchNodes = [];

  for (let i = 0; i < ramp.steps.length; i++) {
    const s = ramp.steps[i];
    const x = START_X + i * (SWATCH_W + GAP);

    // Buscar variable correspondiente
    const varName = `${ramp.name}/${s.step}`;
    const variable = allVars.find(v => v.name === varName && v.variableCollectionId === brandCol?.id);

    // Rectángulo de color
    const rect = figma.createRectangle();
    rect.resize(SWATCH_W, SWATCH_H);
    rect.x = x;
    rect.y = rampY;
    rect.cornerRadius = 0;

    if (variable) {
      rect.fills = [figma.variables.setBoundVariableForPaint(
        { type: 'SOLID', color: s.figmaColor },
        'color', variable
      )];
    } else {
      rect.fills = [{ type: 'SOLID', color: s.figmaColor }];
    }
    figma.currentPage.appendChild(rect);
    swatchNodes.push(rect);

    // Etiqueta: número de paso
    const stepLabel = figma.createText();
    stepLabel.fontName = { family: 'Inter', style: 'Medium' };
    stepLabel.fontSize = 11;
    stepLabel.characters = String(s.step);
    stepLabel.fills = [{ type: 'SOLID', color: { r: 0.3, g: 0.3, b: 0.3 } }];
    stepLabel.textAlignHorizontal = 'CENTER';
    stepLabel.resize(SWATCH_W, 14);
    stepLabel.x = x;
    stepLabel.y = rampY + SWATCH_H + 6;
    figma.currentPage.appendChild(stepLabel);
    swatchNodes.push(stepLabel);

    // Etiqueta: hex
    const hexLabel = figma.createText();
    hexLabel.fontName = { family: 'Inter', style: 'Regular' };
    hexLabel.fontSize = 9;
    hexLabel.characters = s.hex;
    hexLabel.fills = [{ type: 'SOLID', color: { r: 0.55, g: 0.55, b: 0.55 } }];
    hexLabel.textAlignHorizontal = 'CENTER';
    hexLabel.resize(SWATCH_W, 12);
    hexLabel.x = x;
    hexLabel.y = rampY + SWATCH_H + 22;
    figma.currentPage.appendChild(hexLabel);
    swatchNodes.push(hexLabel);
  }

  // Agrupar en frame
  const frame = figma.createFrame();
  frame.name = `Color Ramp / ${ramp.name}`;
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 12;
  frame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  frame.strokeWeight = 1;

  const allNodes = [title, ...swatchNodes];
  const minX = Math.min(...allNodes.map(n => n.x));
  const minY = Math.min(...allNodes.map(n => n.y));
  const maxX = Math.max(...allNodes.map(n => n.x + n.width));
  const maxY = Math.max(...allNodes.map(n => n.y + n.height));

  frame.resize(maxX - minX + 32, maxY - minY + 32);
  frame.x = minX - 16;
  frame.y = minY - 16;
  figma.currentPage.appendChild(frame);

  for (const n of allNodes) {
    const nx = n.x - (minX - 16);
    const ny = n.y - (minY - 16);
    frame.appendChild(n);
    n.x = nx;
    n.y = ny;
  }
}

figma.viewport.scrollAndZoomIntoView(
  figma.currentPage.children.filter(n => n.name?.startsWith('Color Ramp'))
);

return { created: RAMPS_DATA.length + ' ramps' };
