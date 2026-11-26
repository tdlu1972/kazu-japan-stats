// The reference pages: the data catalogue, search results, the methods page and the not-found page.

import { INDICATORS, latest, SOURCES, TOPICS } from '../data/indicators.js';
import { PREFECTURES } from '../data/prefectures.js';
import { esc, value } from '../format.js';

export function catalogue() {
  const rows = INDICATORS.map((i) => {
    const t = TOPICS.find((x) => x.id === i.topic);
    const s = SOURCES[i.source];
    return `<tr><td><a href="#/indicator/${i.id}">${esc(i.name)}</a><span class="sub">${esc(i.unit)}</span></td>
<td>${esc(t.name)}</td><td class="r">${value(i, latest(i)[1])}</td><td class="r">${i.series[0][0]}–${latest(i)[0]}</td><td>${esc(s.org)}<span class="sub">${esc(s.name)} · ${esc(s.freq)}</span></td></tr>`;
  }).join('');
  return {
    title: 'Data catalogue',
    html: `<nav class="crumbs"><a href="#/">Home</a> › Data catalogue</nav>
<h1>Data catalogue</h1><p class="lede">Every series on this site, its latest value, the years covered and who publishes it. Each opens with a chart, a table and a CSV download.</p>
<div class="panel"><div class="scroll"><table class="data"><thead><tr><th>Indicator</th><th>Topic</th><th class="r">Latest</th><th class="r">Years</th><th>Source</th></tr></thead><tbody>${rows}
<tr><td><a href="#/prefectures">Prefectures: population, area, density</a><span class="sub">47 prefectures</span></td><td>Regions</td><td class="r">47</td><td class="r">2023</td><td>Statistics Bureau of Japan<span class="sub">Population Estimates · Annual</span></td></tr>
</tbody></table></div></div>`,
  };
}

export function search(_params, query) {
  const q = (query.get('q') ?? '').trim();
  const needle = q.toLowerCase();
  const inds = needle ? INDICATORS.filter((i) => `${i.name} ${i.unit} ${i.note} ${i.topic}`.toLowerCase().includes(needle)) : [];
  const prefs = needle ? PREFECTURES.filter((p) => `${p.name} ${p.capital} ${p.region}`.toLowerCase().includes(needle)) : [];
  const list = [
    ...inds.map((i) => `<li><a href="#/indicator/${i.id}">${esc(i.name)}</a> <span>${value(i, latest(i)[1])} ${esc(i.unit)}, ${latest(i)[0]}</span></li>`),
    ...prefs.map((p) => `<li><a href="#/prefecture/${p.id}">${esc(p.name)}</a> <span>Prefecture · ${esc(p.region)} · capital ${esc(p.capital)}</span></li>`),
  ].join('');
  return {
    title: q ? `Search: ${q}` : 'Search',
    html: `<nav class="crumbs"><a href="#/">Home</a> › Search</nav>
<h1>${q ? `Results for “${esc(q)}”` : 'Search the figures'}</h1>
<p class="lede">${q ? `${inds.length + prefs.length} match${inds.length + prefs.length === 1 ? '' : 'es'}.` : 'Type an indicator, a topic, a prefecture or a city in the search box above.'}</p>
<div class="panel"><ul class="related">${list || '<li>No indicator or prefecture matches. Try “population”, “prices” or “Osaka”.</li>'}</ul></div>`,
  };
}

export function about() {
  const sources = Object.values(SOURCES).map((s) => `<li><b>${esc(s.org)}</b>: <i>${esc(s.name)}</i> <span>${esc(s.freq)}</span></li>`).join('');
  return {
    title: 'Methods & sources',
    html: `<nav class="crumbs"><a href="#/">Home</a> › Methods & sources</nav>
<h1>Methods & sources</h1>
<div class="split"><div class="panel prose"><h2 class="sec">How the figures are made</h2>
<p>Every figure here is taken from an official Japanese statistical release and rounded for display. Each chart names its publisher and series, and each indicator page gives the unit and release frequency.</p>
<p><b>Population</b> is counted on 1 October: by the Population Census in census years (every five years) and by the Population Estimates in between, which roll the last census forward with births, deaths and migration.</p>
<p><b>Rates of change</b> (GDP growth, consumer prices) compare one calendar year's average with the year before. A change in a percentage share is shown in percentage points (pts).</p>
<p><b>Prefecture density</b> is computed on this site: population divided by land area.</p>
<p>This site runs entirely in your browser from its own files: no figure is fetched from elsewhere and nothing about your visit is recorded. CSV downloads are built on the page from the numbers you see.</p></div>
<div class="panel"><h2 class="sec">Publishers</h2><ul class="related">${sources}</ul>
<h2 class="sec">Glossary</h2><dl class="gloss"><dt>Total fertility rate</dt><dd>Children a woman would have over her life at this year's birth rates.</dd>
<dt>Real GDP</dt><dd>Output adjusted for price changes, so growth shows volume, not inflation.</dd>
<dt>Unemployment rate</dt><dd>People without work and looking for it, as a share of the labour force.</dd></dl></div></div>`,
  };
}

export function notFound() {
  return {
    title: 'Page not found',
    html: `<h1>Page not found</h1><p class="lede">That address does not match a page. <a href="#/">Go to the home page</a> or <a href="#/catalogue">browse the data catalogue</a>.</p>`,
  };
}
