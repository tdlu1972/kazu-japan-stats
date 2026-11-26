// The prefectures: a tile map and ranking by a chosen measure, a sortable table filtered by region, and a page
// for each prefecture. Every control's state lives in the address, so a filtered, sorted view can be linked.

import { MEASURES, PREFECTURES, prefById, REGIONS } from '../data/prefectures.js';
import { rankBars } from '../charts.js';
import { tileMap } from '../tilemap.js';
import { esc, num } from '../format.js';
import { csvLink } from '../csv.js';

const NATIONAL = {
  pop: PREFECTURES.reduce((s, p) => s + p.pop, 0),
  area: PREFECTURES.reduce((s, p) => s + p.area, 0),
};
NATIONAL.density = Math.round((NATIONAL.pop * 1000) / NATIONAL.area);

const SORTS = { name: 'Name', pop: 'Population', density: 'Density', area: 'Area' };

function href(query, changes) {
  const q = new URLSearchParams(query);
  for (const [k, v] of Object.entries(changes)) (v === null ? q.delete(k) : q.set(k, v));
  const s = q.toString();
  return `#/prefectures${s ? `?${s}` : ''}`;
}

// The eight regions' populations as share bars; the chosen region is marked.
function regionTable(selected) {
  const sums = REGIONS.map((r) => {
    const ps = PREFECTURES.filter((p) => p.region === r);
    return { r, pop: ps.reduce((s, p) => s + p.pop, 0), n: ps.length };
  }).sort((a, b) => b.pop - a.pop);
  const max = sums[0].pop;
  return `<ul class="regions">${sums.map((s) => `<li${s.r === selected ? ' class="on"' : ''}>
<a href="#/prefectures?region=${encodeURIComponent(s.r)}">${esc(s.r)}</a><i style="width:${((s.pop / max) * 100).toFixed(1)}%"></i>
<b>${num(s.pop / 1000, 1)}</b><span>${num((s.pop / NATIONAL.pop) * 100, 1)}%</span></li>`).join('')}</ul>`;
}

export function prefectures(_params, query) {
  const measure = MEASURES[query.get('measure')] ? query.get('measure') : 'pop';
  const region = REGIONS.includes(query.get('region')) ? query.get('region') : null;
  const sort = SORTS[query.get('sort')] ? query.get('sort') : 'pop';
  const shown = PREFECTURES.filter((p) => !region || p.region === region)
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : b[sort] - a[sort]));
  const m = MEASURES[measure];
  const top = [...shown].sort((a, b) => b[measure] - a[measure]).slice(0, 10)
    .map((p) => ({ name: p.name, value: p[measure], href: `#/prefecture/${p.id}` }));
  const measureSegs = Object.entries(MEASURES).map(([k, v]) => `<a class="seg${k === measure ? ' on' : ''}" href="${href(query, { measure: k })}" aria-pressed="${k === measure}">${v.label}</a>`).join('');
  const regionChips = [`<a class="chip${region ? '' : ' on'}" href="${href(query, { region: null })}">All regions</a>`,
    ...REGIONS.map((r) => `<a class="chip${r === region ? ' on' : ''}" href="${href(query, { region: r })}">${esc(r)}</a>`)].join('');
  const th = (k) => `<th class="${k === 'name' ? '' : 'r'}"><a href="${href(query, { sort: k })}"${k === sort ? ' aria-sort="descending" class="sorted"' : ''}>${SORTS[k]}${k === sort ? ' ▾' : ''}</a></th>`;
  const rows = shown.map((p) => `<tr><td><a href="#/prefecture/${p.id}">${esc(p.name)}</a><span class="sub">${esc(p.region)}</span></td>
<td class="r">${num(p.pop)}</td><td class="r">${num(p.density)}</td><td class="r">${num(p.area)}</td></tr>`).join('');
  const total = shown.reduce((s, p) => s + p.pop, 0);
  return {
    title: 'Prefectures',
    html: `<nav class="crumbs"><a href="#/">Home</a> › Prefectures</nav>
<h1>The 47 prefectures</h1>
<p class="lede">Population, land area and density on 1 October 2023. ${region ? `${esc(region)}: <b>${num(shown.length)}</b> prefectures, <b>${num(total / 1000, 2)} million</b> people (${num((total / NATIONAL.pop) * 100, 1)}% of Japan).` : `Japan: <b>${num(NATIONAL.pop / 1000, 2)} million</b> people on <b>${num(NATIONAL.area)} km²</b>, ${num(NATIONAL.density)} per km².`}</p>
<div class="chips" role="group" aria-label="Region">${regionChips}</div>
<div class="split">
<div class="panel"><div class="toolbar"><div class="segs" role="group" aria-label="Map measure">${measureSegs}</div></div>
${tileMap(PREFECTURES, measure, { label: `${m.label} by prefecture, ${m.unit}` })}</div>
<div class="panel"><h2 class="sec">Top 10 by ${m.label.toLowerCase()}${region ? `, ${esc(region)}` : ''} <span class="sec-note">${esc(m.unit)}</span></h2>
${rankBars(top, { label: `Top prefectures by ${m.label}` })}
<h2 class="sec gap">Population by region <span class="sec-note">million · share of Japan</span></h2>
${regionTable(region)}</div>
</div>
<div class="panel"><div class="toolbar"><h2 class="sec">All figures${region ? `: ${esc(region)}` : ''}</h2>
${csvLink('prefectures-2023.csv', ['prefecture', 'region', 'population_thousand', 'density_per_km2', 'area_km2'], shown.map((p) => [p.name, p.region, p.pop, p.density, p.area]))}</div>
<div class="scroll"><table class="data"><thead><tr>${['name', 'pop', 'density', 'area'].map(th).join('')}</tr></thead>
<tbody>${rows}</tbody></table></div>
<p class="note">Population in thousands (Population Estimates, Statistics Bureau of Japan). Area in km² (Geospatial Information Authority of Japan). Density is population ÷ area.</p></div>`,
  };
}

export function prefecture({ id }) {
  const p = prefById(id);
  if (!p) return null;
  const rank = (k) => [...PREFECTURES].sort((a, b) => b[k] - a[k]).findIndex((x) => x.id === p.id) + 1;
  const peers = PREFECTURES.filter((x) => x.region === p.region).sort((a, b) => b.pop - a.pop)
    .map((x) => ({ name: x.name, value: x.pop, href: `#/prefecture/${x.id}` }));
  const vsDensity = p.density / NATIONAL.density;
  const others = PREFECTURES.filter((x) => x.id !== p.id);
  const options = others.map((x) => `<option value="${x.id}">${esc(x.name)}</option>`).join('');
  return {
    title: p.name,
    html: `<nav class="crumbs"><a href="#/">Home</a> › <a href="#/prefectures">Prefectures</a> › ${esc(p.name)}</nav>
<h1>${esc(p.name)} <span class="tag">${esc(p.region)}</span></h1>
<p class="lede">Capital: ${esc(p.capital)}. Prefecture code ${String(p.code).padStart(2, '0')}. Figures for 1 October 2023.</p>
<div class="grid cards">
<div class="card stat"><span class="stat-name">Population</span><span class="stat-value">${num(p.pop / 1000, 2)}<small>million</small></span><span class="stat-meta">Rank <b>${rank('pop')}</b> of 47 · ${num((p.pop / NATIONAL.pop) * 100, 1)}% of Japan</span></div>
<div class="card stat"><span class="stat-name">Density</span><span class="stat-value">${num(p.density)}<small>per km²</small></span><span class="stat-meta">Rank <b>${rank('density')}</b> of 47 · ${num(vsDensity, 1)}× the national ${num(NATIONAL.density)}</span></div>
<div class="card stat"><span class="stat-name">Land area</span><span class="stat-value">${num(p.area)}<small>km²</small></span><span class="stat-meta">Rank <b>${rank('area')}</b> of 47 · ${num((p.area / NATIONAL.area) * 100, 1)}% of Japan</span></div>
</div>
<div class="split">
<div class="panel"><h2 class="sec">${esc(p.region)} by population <span class="sec-note">thousand</span></h2>${rankBars(peers, { label: `Prefectures of ${p.region} by population` })}</div>
<div class="panel"><h2 class="sec">On the map</h2>${tileMap(PREFECTURES, 'pop', { selected: p.id, label: `${p.name} on the prefecture map` })}</div>
</div>
<form class="panel compare-form" data-compare="${p.id}"><label for="cmp">Compare ${esc(p.name)} with</label>
<select id="cmp" name="with">${options}</select><button class="btn" type="submit">Compare</button></form>`,
  };
}

export function compare({ a, b }) {
  const pa = prefById(a);
  const pb = prefById(b);
  if (!pa || !pb) return null;
  const row = (label, k, unit, digits = 0) => {
    const va = pa[k];
    const vb = pb[k];
    const w = Math.max(va, vb);
    return `<div class="cmp-row"><h3>${label} <span class="sec-note">${unit}</span></h3>
<div class="cmp-bar"><span>${esc(pa.name)}</span><i style="width:${((va / w) * 100).toFixed(1)}%" class="s0"></i><b>${num(va, digits)}</b></div>
<div class="cmp-bar"><span>${esc(pb.name)}</span><i style="width:${((vb / w) * 100).toFixed(1)}%" class="s1"></i><b>${num(vb, digits)}</b></div>
<p class="note">${esc(va >= vb ? pa.name : pb.name)} is ${num(Math.max(va, vb) / Math.min(va, vb), 1)}× ${esc(va >= vb ? pb.name : pa.name)}.</p></div>`;
  };
  return {
    title: `${pa.name} and ${pb.name}`,
    html: `<nav class="crumbs"><a href="#/">Home</a> › <a href="#/prefectures">Prefectures</a> › Compare</nav>
<h1>${esc(pa.name)} <span class="vs">and</span> ${esc(pb.name)}</h1>
<p class="lede">${esc(pa.name)} (${esc(pa.region)}) beside ${esc(pb.name)} (${esc(pb.region)}), 1 October 2023. <a href="#/compare/${pb.id}/${pa.id}">Swap sides</a></p>
<div class="panel">${row('Population', 'pop', 'thousand')}${row('Density', 'density', 'people per km²')}${row('Land area', 'area', 'km²')}</div>`,
  };
}
