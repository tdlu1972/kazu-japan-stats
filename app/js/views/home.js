// The home page: headline figures, the population curve, topic entry points and the prefecture map.

import { byId, HEADLINES, INDICATORS, latest, previous, SOURCES, TOPICS } from '../data/indicators.js';
import { PREFECTURES } from '../data/prefectures.js';
import { lineChart, sparkline } from '../charts.js';
import { tileMap } from '../tilemap.js';
import { change, esc, value } from '../format.js';

export function headlineCard(ind) {
  const now = latest(ind);
  const ch = change(ind, now, previous(ind));
  return `<a class="card stat" href="#/indicator/${ind.id}">
<span class="stat-name">${esc(ind.name)}</span>
<span class="stat-value">${value(ind, now[1])}</span><span class="stat-unit">${esc(ind.unit)}</span>
${sparkline(ind.series.slice(-10))}
<span class="stat-meta"><b class="chg ${ch.dir}">${ch.text}</b> since ${ch.since} · ${now[0]}</span>
<span class="stat-src">${esc(SOURCES[ind.source].org)}</span>
</a>`;
}

export function home() {
  const pop = byId('population');
  const cards = HEADLINES.map((id) => headlineCard(byId(id))).join('');
  const topics = TOPICS.map((t) => {
    const n = INDICATORS.filter((i) => i.topic === t.id).length;
    return `<a class="card topic" href="#/topic/${t.id}"><h3>${esc(t.name)}</h3><p>${esc(t.blurb)}</p><span class="more">${n} indicators →</span></a>`;
  }).join('');
  return {
    title: 'Japan in figures',
    html: `<section class="hero">
<p class="kicker">Official figures, plainly shown</p>
<h1>Japan is <span class="accent">123.8 million</span> people, and 29.3% of them are 65 or older.</h1>
<p class="lede">Population, births, the economy, jobs and the 47 prefectures, each figure with its source and year. Start with the headlines, or pick a topic.</p>
</section>
<section aria-labelledby="h-head"><h2 id="h-head" class="sec">Headline figures <span class="sec-note">latest year · change on the previous release</span></h2>
<div class="grid cards">${cards}</div></section>
<section class="split">
<div class="panel"><h2 class="sec">Population, 1950–2024</h2>
${lineChart([{ points: pop.series }], { label: 'Total population of Japan in millions, 1950 to 2024' })}
<p class="note">Million people on 1 October. Peak: <b>128.1 million in 2010</b>; down 4.3 million since. Source: ${esc(SOURCES.popest.org)}, ${esc(SOURCES.popest.name)}.</p>
<a class="btn" href="#/indicator/population">Explore the series →</a></div>
<div class="panel home-map"><h2 class="sec">Where people live</h2>
${tileMap(PREFECTURES, 'density', { label: 'Population density by prefecture, people per km², 2023' })}
<p class="note">People per km², 2023. Each square is a prefecture; open one for its profile.</p>
<a class="btn" href="#/prefectures">All 47 prefectures →</a></div>
</section>
<section aria-labelledby="h-topics"><h2 id="h-topics" class="sec">Browse by topic</h2><div class="grid topics">${topics}</div></section>`,
  };
}
