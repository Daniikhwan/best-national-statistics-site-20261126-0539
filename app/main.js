// NusaStat boot — hash router, navigation and page title.
// Routes: #/ (Overview), #/population, #/economy, #/prices, #/jobs,
// #/regions, #/sources. No network requests: everything is local.

import { render } from './views.js';

const TITLES = {
  '/': 'NusaStat — Indonesia in numbers',
  '/population': 'Population — NusaStat',
  '/economy': 'Economy — NusaStat',
  '/prices': 'Prices — NusaStat',
  '/jobs': 'Jobs & wellbeing — NusaStat',
  '/regions': 'Provinces — NusaStat',
  '/sources': 'Sources & methods — NusaStat',
};

const NAV = [
  { route: '/', label: 'Overview' },
  { route: '/population', label: 'Population' },
  { route: '/economy', label: 'Economy' },
  { route: '/prices', label: 'Prices' },
  { route: '/jobs', label: 'Jobs' },
  { route: '/regions', label: 'Provinces' },
  { route: '/sources', label: 'Sources' },
];

const app = document.getElementById('app');
const nav = document.querySelector('.nav');
const menuBtn = document.getElementById('menu-btn');

function routeFromHash() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1).split('?')[0] || '/';
  return TITLES[path] ? path : '/';
}

function go() {
  const route = routeFromHash();
  document.title = TITLES[route];
  nav.querySelectorAll('a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === `#${route}`);
    if (route === '/' && a.getAttribute('href') === '#/') a.classList.add('active');
  });
  nav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  render(route, app);
  window.scrollTo(0, 0);
}

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

window.addEventListener('hashchange', go);
go();
