// Hand-drawn SVG charts: each function returns an SVG string sized by its viewBox, so it scales to any width.
// Every chart carries a <title> and an aria-label for screen readers.

import { esc, num } from './format.js';

function niceTicks(min, max, count = 4) {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + step / 2; t += step) ticks.push(Math.round(t / step) * step);
  return ticks;
}

function stepDigits(ticks) {
  const step = Math.abs(ticks[1] - ticks[0]);
  return step >= 1 ? 0 : step >= 0.1 ? 1 : 2;
}

// A line chart of one or more series sharing a year axis.
export function lineChart(seriesList, { label, height = 260, width = 640, zeroBased = false } = {}) {
  const pad = { l: 54, r: 16, t: 14, b: 30 };
  const all = seriesList.flatMap((s) => s.points);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const x0 = Math.min(...xs);
  const x1 = Math.max(...xs);
  const ticks = niceTicks(zeroBased ? Math.min(0, ...ys) : Math.min(...ys), Math.max(...ys));
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const X = (x) => pad.l + ((x - x0) / (x1 - x0 || 1)) * (width - pad.l - pad.r);
  const Y = (y) => height - pad.b - ((y - y0) / (y1 - y0 || 1)) * (height - pad.t - pad.b);
  const digits = stepDigits(ticks);
  const grid = ticks.map((t) => `<line class="grid" x1="${pad.l}" x2="${width - pad.r}" y1="${Y(t)}" y2="${Y(t)}"/>
<text class="tick" x="${pad.l - 6}" y="${Y(t) + 4}" text-anchor="end">${num(t, digits)}</text>`).join('');
  const years = yearTicks(x0, x1).map((x) => `<text class="tick" x="${X(x)}" y="${height - 8}" text-anchor="middle">${x}</text>`).join('');
  const lines = seriesList.map((s, i) => {
    const d = s.points.map((p, j) => `${j ? 'L' : 'M'}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
    const last = s.points[s.points.length - 1];
    return `<path class="line s${i}" d="${d}"/><circle class="dot s${i}" cx="${X(last[0])}" cy="${Y(last[1])}" r="4"/>`;
  }).join('');
  const zero = y0 < 0 && y1 > 0 ? `<line class="zero" x1="${pad.l}" x2="${width - pad.r}" y1="${Y(0)}" y2="${Y(0)}"/>` : '';
  return svg(width, height, label, grid + zero + years + lines);
}

// A column chart of one series; negative values hang below the zero line.
export function barChart(points, { label, height = 240, width = 640, highlightLast = true } = {}) {
  const pad = { l: 54, r: 12, t: 14, b: 30 };
  const ys = points.map((p) => p[1]);
  const ticks = niceTicks(Math.min(0, ...ys), Math.max(0, ...ys));
  const y0 = ticks[0];
  const y1 = ticks[ticks.length - 1];
  const Y = (y) => height - pad.b - ((y - y0) / (y1 - y0 || 1)) * (height - pad.t - pad.b);
  const slot = (width - pad.l - pad.r) / points.length;
  const digits = stepDigits(ticks);
  const grid = ticks.map((t) => `<line class="grid" x1="${pad.l}" x2="${width - pad.r}" y1="${Y(t)}" y2="${Y(t)}"/>
<text class="tick" x="${pad.l - 6}" y="${Y(t) + 4}" text-anchor="end">${num(t, digits)}</text>`).join('');
  const every = Math.ceil(points.length / 12);
  const bars = points.map(([x, y], i) => {
    const top = Math.min(Y(y), Y(0));
    const h = Math.max(1, Math.abs(Y(y) - Y(0)));
    const cls = `bar${y < 0 ? ' neg' : ''}${highlightLast && i === points.length - 1 ? ' last' : ''}`;
    const lab = i % every === 0 || i === points.length - 1
      ? `<text class="tick" x="${pad.l + slot * (i + 0.5)}" y="${height - 8}" text-anchor="middle">${x}</text>` : '';
    return `<rect class="${cls}" x="${(pad.l + slot * i + slot * 0.15).toFixed(1)}" y="${top.toFixed(1)}" width="${(slot * 0.7).toFixed(1)}" height="${h.toFixed(1)}"><title>${x}: ${num(y, 1)}</title></rect>${lab}`;
  }).join('');
  return svg(width, height, label, grid + `<line class="zero" x1="${pad.l}" x2="${width - pad.r}" y1="${Y(0)}" y2="${Y(0)}"/>` + bars);
}

// Horizontal bars for a ranking: items are { name, value, href }.
export function rankBars(items, { label, unitDigits = 0, width = 640 } = {}) {
  const row = 24;
  const pad = { l: 104, r: 64 };
  const height = items.length * row + 6;
  const max = Math.max(...items.map((d) => d.value));
  const body = items.map((d, i) => {
    const w = ((width - pad.l - pad.r) * d.value) / max;
    const y = i * row + 4;
    return `<a href="${d.href}"><text class="rank-name" x="${pad.l - 8}" y="${y + 15}" text-anchor="end">${esc(d.name)}</text>
<rect class="bar${i === 0 ? ' last' : ''}" x="${pad.l}" y="${y + 3}" width="${w.toFixed(1)}" height="${row - 8}" rx="2"/>
<text class="rank-val" x="${pad.l + w + 6}" y="${y + 15}">${num(d.value, unitDigits)}</text></a>`;
  }).join('');
  return svg(width, height, label, body);
}

// A small trend line for a headline card, no axes.
export function sparkline(points, { width = 120, height = 34 } = {}) {
  const ys = points.map((p) => p[1]);
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const X = (i) => 2 + (i / (points.length - 1)) * (width - 4);
  const Y = (y) => height - 3 - ((y - lo) / (hi - lo || 1)) * (height - 6);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p[1]).toFixed(1)}`).join('');
  return `<svg class="spark" viewBox="0 0 ${width} ${height}" aria-hidden="true"><path d="${d}"/><circle cx="${X(points.length - 1)}" cy="${Y(ys[ys.length - 1])}" r="2.6"/></svg>`;
}

// A single stacked bar splitting a total into parts: parts are { label, value }.
export function shareBar(parts, { label, width = 640, height = 70 } = {}) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  let x = 0;
  const body = parts.map((p, i) => {
    const w = (p.value / total) * width;
    const seg = `<rect class="part p${i}" x="${x.toFixed(1)}" y="0" width="${w.toFixed(1)}" height="34"/>
<text class="part-label" x="${(x + 6).toFixed(1)}" y="54">${esc(p.label)} · ${num((p.value / total) * 100, 1)}%</text>`;
    x += w;
    return seg;
  }).join('');
  return svg(width, height, label, body);
}

function yearTicks(x0, x1) {
  const span = x1 - x0;
  const step = span > 50 ? 10 : span > 20 ? 5 : span > 8 ? 2 : 1;
  const ticks = [];
  for (let x = Math.ceil(x0 / step) * step; x <= x1; x += step) ticks.push(x);
  if (ticks[ticks.length - 1] !== x1 && x1 - ticks[ticks.length - 1] >= step / 2) ticks.push(x1);
  return ticks;
}

function svg(width, height, label, body) {
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}"><title>${esc(label)}</title>${body}</svg>`;
}
