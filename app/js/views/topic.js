// A topic page: every indicator in the topic as a chart card, plus the topic's own extra panels.

import { AGE_GROUPS_2023, byId, INDICATORS, latest, SOURCES, TOPICS } from '../data/indicators.js';
import { barChart, lineChart, shareBar } from '../charts.js';
import { esc, num, value } from '../format.js';
import { headlineCard } from './home.js';

function chartFor(ind) {
  const label = `${ind.name}, ${ind.unit}, ${ind.series[0][0]} to ${latest(ind)[0]}`;
  return ind.unit.includes('change') ? barChart(ind.series, { label }) : lineChart([{ points: ind.series }], { label });
}

function extras(topicId) {
  if (topicId === 'population') {
    return `<div class="panel wide"><h2 class="sec">Age structure, 1 October 2023</h2>
${shareBar(AGE_GROUPS_2023, { label: 'Population by age group, 2023' })}
<p class="note">${AGE_GROUPS_2023.map((g) => `${g.label}: <b>${num(g.value, 2)} million</b>`).join(' · ')}. More people are 75 or older than under 15. Source: ${esc(SOURCES.popest.org)}.</p></div>`;
  }
  if (topicId === 'births-deaths') {
    const b = byId('births');
    const d = byId('deaths');
    const gap = latest(d)[1] - latest(b)[1];
    return `<div class="panel wide"><h2 class="sec">Births and deaths, 2000–2024</h2>
${lineChart([{ points: b.series }, { points: d.series }], { label: 'Births and deaths in thousands, 2000 to 2024' })}
<p class="note"><span class="key-line s0"></span> Births <span class="key-line s1"></span> Deaths (thousand). Deaths have outnumbered births every year since 2005; in 2024 the natural decrease was <b>${num(gap)} thousand</b>.</p></div>`;
  }
  if (topicId === 'economy') {
    const x = byId('exports');
    const m = byId('imports');
    const bal = latest(x)[1] - latest(m)[1];
    return `<div class="panel wide"><h2 class="sec">Trade in goods, 2019–2024</h2>
${lineChart([{ points: x.series }, { points: m.series }], { label: 'Exports and imports of goods, trillion yen' })}
<p class="note"><span class="key-line s0"></span> Exports <span class="key-line s1"></span> Imports (trillion yen). Balance in 2024: <b>${num(bal, 1)} trillion yen</b>.</p></div>`;
  }
  return '';
}

export function topic({ id }) {
  const t = TOPICS.find((x) => x.id === id);
  if (!t) return null;
  const inds = INDICATORS.filter((i) => i.topic === id);
  const cards = inds.map((i) => headlineCard(i)).join('');
  const charts = inds.map((ind) => `<article class="panel">
<h2 class="sec"><a href="#/indicator/${ind.id}">${esc(ind.name)}</a></h2>
<p class="big">${value(ind, latest(ind)[1])} <small>${esc(ind.unit)}, ${latest(ind)[0]}</small></p>
${chartFor(ind)}
<p class="note">${esc(ind.note)} Source: ${esc(SOURCES[ind.source].org)}, ${esc(SOURCES[ind.source].name)}.</p>
</article>`).join('');
  return {
    title: t.name,
    section: `#/topic/${id}`,
    html: `<nav class="crumbs"><a href="#/">Home</a> › Topics › ${esc(t.name)}</nav>
<h1>${esc(t.name)}</h1><p class="lede">${esc(t.blurb)}</p>
${extras(id)}
<div class="grid cards">${cards}</div>
<div class="grid charts">${charts}</div>`,
  };
}
