// The router and the page shell: hash routes to views, the header search and the phone menu.
//
//   #/                         home              #/prefectures?measure=&region=&sort=   prefecture map and table
//   #/topic/<id>               topic page        #/prefecture/<id>                      one prefecture
//   #/indicator/<id>?range=&view=  one series    #/compare/<a>/<b>                      two prefectures side by side
//   #/catalogue  #/search?q=  #/about
//
// window.__shotReady is false while a page renders and true once it is on screen, for the screenshot script.

import { home } from './views/home.js';
import { topic } from './views/topic.js';
import { indicator } from './views/indicator.js';
import { compare, prefecture, prefectures } from './views/prefectures.js';
import { about, catalogue, notFound, search } from './views/pages.js';
import { bindCsv } from './csv.js';

const ROUTES = [
  [/^$/, home, '#/'],
  [/^topic\/([\w-]+)$/, (m, q) => topic({ id: m[1] }, q), ''],
  [/^indicator\/([\w-]+)$/, (m, q) => indicator({ id: m[1] }, q), ''],
  [/^prefectures$/, (m, q) => prefectures({}, q), '#/prefectures'],
  [/^prefecture\/([\w-]+)$/, (m) => prefecture({ id: m[1] }), '#/prefectures'],
  [/^compare\/([\w-]+)\/([\w-]+)$/, (m) => compare({ a: m[1], b: m[2] }), '#/prefectures'],
  [/^catalogue$/, catalogue, '#/catalogue'],
  [/^search$/, (m, q) => search({}, q), ''],
  [/^about$/, about, '#/about'],
];

const app = document.getElementById('app');
const nav = document.getElementById('nav');

function resolve() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const query = new URLSearchParams(qs);
  for (const [re, view, section] of ROUTES) {
    const m = path.match(re);
    if (m) {
      const page = view(m, query) ?? notFound();
      return { page, section: page.section ?? section, query };
    }
  }
  return { page: notFound(), section: '', query };
}

function render() {
  window.__shotReady = false;
  const { page, section, query } = resolve();
  document.title = `${page.title} · Kazu, Japan in figures`;
  app.innerHTML = page.html;
  // The nav link of the page's section is marked current: a topic's for its topic and indicator pages.
  for (const a of nav.querySelectorAll('a')) a.toggleAttribute('aria-current', a.getAttribute('href') === section);
  document.getElementById('q').value = query.get('q') ?? '';
  document.body.classList.remove('menu-open');
  document.getElementById('menu').setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
  window.__shotReady = true;
}

document.getElementById('search').addEventListener('submit', (event) => {
  event.preventDefault();
  const q = document.getElementById('q').value.trim();
  location.hash = `#/search?q=${encodeURIComponent(q)}`;
});

document.getElementById('menu').addEventListener('click', (event) => {
  const open = document.body.classList.toggle('menu-open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
});

// The prefecture page's "compare with" form.
app.addEventListener('submit', (event) => {
  const form = event.target.closest('form[data-compare]');
  if (!form) return;
  event.preventDefault();
  location.hash = `#/compare/${form.dataset.compare}/${form.elements.with.value}`;
});

bindCsv(app);
window.addEventListener('hashchange', render);
render();
