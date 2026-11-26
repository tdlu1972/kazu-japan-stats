// One indicator: its chart (or table), a range switch, the figures behind it and a CSV download.
// The controls write their state into the address (#/indicator/<id>?range=10&view=table), so every view links.

import { byId, INDICATORS, latest, previous, SOURCES, TOPICS } from '../data/indicators.js';
import { barChart, lineChart } from '../charts.js';
import { change, esc, num, value } from '../format.js';
import { csvLink } from '../csv.js';

const RANGES = { all: 'All years', 10: 'Last 10 years', 5: 'Last 5 years' };

export function indicator({ id }, query) {
  const ind = byId(id);
  if (!ind) return null;
  const range = RANGES[query.get('range')] ? query.get('range') : 'all';
  const view = query.get('view') === 'table' ? 'table' : 'chart';
  const lastYear = latest(ind)[0];
  const pts = range === 'all' ? ind.series : ind.series.filter(([y]) => y > lastYear - Number(range));
  const now = latest(ind);
  const ch = change(ind, now, previous(ind));
  const first = pts[0];
  const peak = pts.reduce((a, b) => (b[1] > a[1] ? b : a));
  const low = pts.reduce((a, b) => (b[1] < a[1] ? b : a));
  const src = SOURCES[ind.source];
  const topic = TOPICS.find((t) => t.id === ind.topic);
  const label = `${ind.name}, ${ind.unit}, ${first[0]} to ${now[0]}`;
  const size = { label, width: 1100, height: 380 };
  const chart = ind.unit.includes('change') ? barChart(pts, size) : lineChart([{ points: pts }], size);
  const table = `<table class="data"><thead><tr><th>Year</th><th class="r">${esc(ind.unit)}</th><th class="r">Change</th></tr></thead><tbody>
${pts.map((p, i) => `<tr><td>${p[0]}</td><td class="r">${value(ind, p[1])}</td><td class="r">${i ? change(ind, p, pts[i - 1]).text : '–'}</td></tr>`).reverse().join('')}
</tbody></table>`;
  const link = (k, v, text) => {
    const q = new URLSearchParams(query);
    q.set(k, v);
    const on = (k === 'range' ? range : view) === v;
    return `<a class="seg${on ? ' on' : ''}" href="#/indicator/${ind.id}?${q}" aria-pressed="${on}">${text}</a>`;
  };
  const related = INDICATORS.filter((i) => i.topic === ind.topic && i.id !== ind.id)
    .map((i) => `<li><a href="#/indicator/${i.id}">${esc(i.name)}</a> <span>${value(i, latest(i)[1])} ${esc(i.unit)}</span></li>`).join('');
  return {
    title: ind.name,
    section: `#/topic/${topic.id}`,
    html: `<nav class="crumbs"><a href="#/">Home</a> › <a href="#/topic/${topic.id}">${esc(topic.name)}</a> › ${esc(ind.name)}</nav>
<div class="ind-head"><div><h1>${esc(ind.name)}</h1><p class="lede">${esc(ind.note)}</p></div>
<div class="ind-now"><span class="stat-value">${value(ind, now[1])}<small>${esc(ind.unit)}</small></span>
<span class="stat-meta">${now[0]} · <b class="chg ${ch.dir}">${ch.text}</b> on ${ch.since}</span></div></div>
<div class="panel">
<div class="toolbar"><div class="segs" role="group" aria-label="Years shown">${Object.entries(RANGES).map(([k, t]) => link('range', k, t)).join('')}</div>
<div class="segs" role="group" aria-label="Display">${link('view', 'chart', 'Chart')}${link('view', 'table', 'Table')}</div>
${csvLink(`${ind.id}.csv`, ['year', ind.unit], pts)}</div>
${view === 'table' ? table : chart}
<dl class="facts"><div><dt>First shown</dt><dd>${value(ind, first[1])} <small>(${first[0]})</small></dd></div>
<div><dt>Highest</dt><dd>${value(ind, peak[1])} <small>(${peak[0]})</small></dd></div>
<div><dt>Lowest</dt><dd>${value(ind, low[1])} <small>(${low[0]})</small></dd></div>
<div><dt>Observations</dt><dd>${num(pts.length)}</dd></div></dl>
</div>
<div class="split"><div class="panel"><h2 class="sec">About this figure</h2>
<p><b>Source:</b> ${esc(src.org)}, <i>${esc(src.name)}</i>. <b>Released:</b> ${esc(src.freq)}. <b>Unit:</b> ${esc(ind.unit)}.</p>
<p class="note">Figures are rounded for display. Cite the official release for exact values.</p></div>
<div class="panel"><h2 class="sec">Related in ${esc(topic.name)}</h2><ul class="related">${related || '<li>No other indicators in this topic.</li>'}</ul></div></div>`,
  };
}
