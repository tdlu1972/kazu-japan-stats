// A tile-grid map of the 47 prefectures: one equal square each, placed roughly where it lies, shaded by a measure.
// Each tile links to its prefecture's page.

import { esc, num } from './format.js';

const SHADES = 6;

export function tileMap(prefs, measure, { selected = null, label = 'Map of prefectures' } = {}) {
  const size = 44;
  const gap = 4;
  const cols = Math.max(...prefs.map((p) => p.c)) + 1;
  const rowsN = Math.max(...prefs.map((p) => p.r)) + 1;
  const values = prefs.map((p) => p[measure]);
  // Quantile classes keep Tokyo from washing every other tile out.
  const sorted = [...values].sort((a, b) => a - b);
  const breaks = Array.from({ length: SHADES - 1 }, (_, i) => sorted[Math.floor(((i + 1) * sorted.length) / SHADES)]);
  const shade = (v) => breaks.filter((b) => v >= b).length;
  const tiles = prefs.map((p) => {
    const x = p.c * (size + gap);
    const y = p.r * (size + gap);
    const cls = `tile q${shade(p[measure])}${p.id === selected ? ' sel' : ''}`;
    return `<a href="#/prefecture/${p.id}" aria-label="${esc(p.name)}: ${num(p[measure])}">
<rect class="${cls}" x="${x}" y="${y}" width="${size}" height="${size}" rx="5"/>
<text class="tile-code" x="${x + size / 2}" y="${y + 19}" text-anchor="middle">${esc(p.name.length > 6 ? `${p.name.slice(0, 5)}.` : p.name)}</text>
<text class="tile-val" x="${x + size / 2}" y="${y + 34}" text-anchor="middle">${short(p[measure])}</text>
<title>${esc(p.name)}: ${num(p[measure])}</title></a>`;
  }).join('');
  const w = cols * (size + gap);
  const h = rowsN * (size + gap);
  const legend = [0, ...breaks].map((b, i) => `<span class="key q${i}"></span><span>${i ? `≥ ${short(b)}` : `< ${short(breaks[0])}`}</span>`).join('');
  return `<figure class="tilemap"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${tiles}</svg>
<figcaption class="legend">${legend}</figcaption></figure>`;
}

function short(v) {
  if (v >= 10000) return `${num(v / 1000, 0)}k`;
  if (v >= 1000) return `${num(v / 1000, 1)}k`;
  return num(v);
}
