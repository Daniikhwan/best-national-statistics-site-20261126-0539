// NusaStat views — one renderer per page. Pages are hash routes; every
// control on a page works: the search box, the chart switchers, the table
// sort and filter, and the mobile menu.

import {
  META, YEARS, POPULATION, GDP_GROWTH, INFLATION, UNEMPLOYMENT, POVERTY,
  HDI, SECTORS_2023, TRADE_2024, PROVINCES, INDICATORS, RELEASES,
} from './data.js';
import { lineChart, barChart, donutChart, hbars } from './charts.js';

const DONUT_COLORS = ['#0e4f4a', '#e8a317', '#3a7d78', '#c97b1e', '#7fae9f', '#8a5a2b', '#b3402a', '#5b6b66'];

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function kpiCard(ind) {
  return `<a class="kpi" href="${ind.route}">
    <span class="kpi-name">${esc(ind.name)}</span>
    <span class="kpi-value">${esc(ind.value)}</span>
    <span class="kpi-year">${ind.year} · ${esc(ind.blurb)}</span>
  </a>`;
}

function sourceNote(src) {
  return `<p class="source">Source: ${esc(src)} · Figures as published; see <a href="#/sources">Sources &amp; methods</a>.</p>`;
}

function factList(facts) {
  return `<ul class="facts">${facts.map((f) => `<li><strong>${esc(f.k)}</strong><span>${esc(f.v)}</span></li>`).join('')}</ul>`;
}

function sliceRange(years, values, range) {
  if (range === 'early') return { years: years.slice(0, 5), values: values.slice(0, 5) };
  if (range === 'late') return { years: years.slice(5), values: values.slice(5) };
  return { years, values };
}

// ---------- Overview ----------
function overview(root) {
  root.innerHTML = `
  <section class="hero">
    <p class="eyebrow">Indonesia · National statistics · ${META.headlineYear}</p>
    <h1>Indonesia in numbers.</h1>
    <p class="lede">One place to look up the country's population, economy, prices, jobs and wellbeing — real figures from BPS, the national statistics office, with the source and year on every number.</p>
    <div class="search-row">
      <label class="visually-hidden" for="q">Search indicators</label>
      <input id="q" type="search" placeholder="Search an indicator — try “poverty”, “exports”, “jobs”…" autocomplete="off">
    </div>
    <p class="updated">Latest complete year: ${META.headlineYear} · Updated ${META.updated} · ${esc(META.note)}</p>
  </section>

  <section class="kpis" aria-label="Headline indicators">
    ${INDICATORS.slice(0, 6).map(kpiCard).join('')}
  </section>

  <section class="card chart-card">
    <div class="card-head">
      <h2 id="chart-title">Population, 2015–2024</h2>
      <div class="switchers">
        <div class="switch" role="group" aria-label="Choose indicator" id="metric-switch">
          <button data-metric="population" class="on" type="button">Population</button>
          <button data-metric="gdp" type="button">GDP growth</button>
          <button data-metric="inflation" type="button">Inflation</button>
          <button data-metric="poverty" type="button">Poverty</button>
        </div>
        <div class="switch" role="group" aria-label="Choose years" id="range-switch">
          <button data-range="all" class="on" type="button">2015–24</button>
          <button data-range="early" type="button">2015–19</button>
          <button data-range="late" type="button">2020–24</button>
        </div>
      </div>
    </div>
    <div id="main-chart"></div>
    <p class="source" id="chart-source">Source: ${esc(POPULATION.source)}</p>
  </section>

  <div class="two-col">
    <section class="card">
      <h2>Where people live</h2>
      <p class="muted">The five largest provinces hold more than half the country. Java alone is home to 156.9 million people — 55.7% of Indonesia.</p>
      <div id="top-provinces"></div>
      <p><a class="more" href="#/regions">All provinces →</a></p>
    </section>
    <section class="card">
      <h2>Latest releases</h2>
      <ul class="releases">
        ${RELEASES.map((r) => `<li><span class="rel-date">${esc(r.date)}</span><span class="rel-tag">${esc(r.tag)}</span><span class="rel-title">${esc(r.title)}</span></li>`).join('')}
      </ul>
    </section>
  </div>

  <section class="card">
    <h2>Indicator index</h2>
    <p class="muted">Every indicator on this site, in one list. Type in the search box above to filter it.</p>
    <div class="index-grid" id="index-grid">
      ${INDICATORS.map((ind) => `<a class="index-item" data-name="${esc(ind.name.toLowerCase())} ${esc(ind.blurb.toLowerCase())}" href="${ind.route}">
        <span class="index-name">${esc(ind.name)}</span>
        <span class="index-value">${esc(ind.value)}</span>
        <span class="index-blurb">${esc(ind.blurb)}</span>
      </a>`).join('')}
    </div>
    <p class="muted" id="index-empty" hidden>No indicator matches that search.</p>
  </section>`;

  const METRICS = {
    population: { data: POPULATION, kind: 'line', decimals: 1, title: 'Population, million people' },
    gdp: { data: GDP_GROWTH, kind: 'bar', decimals: 2, title: 'Real GDP growth, % per year' },
    inflation: { data: INFLATION, kind: 'line', decimals: 2, title: 'Consumer price inflation, % (December, year on year)' },
    poverty: { data: POVERTY, kind: 'line', decimals: 2, title: 'Poverty rate, % of population (September)' },
  };
  let metric = 'population';
  let range = 'all';
  const chartBox = root.querySelector('#main-chart');
  const chartTitle = root.querySelector('#chart-title');
  const chartSource = root.querySelector('#chart-source');

  function drawMain() {
    const m = METRICS[metric];
    const { years, values } = sliceRange(YEARS, m.data.values, range);
    chartBox.innerHTML = '';
    const label = `${m.data.label}, ${years[0]}–${years[years.length - 1]}`;
    // Shorter chart on the overview so the whole chart, axes included,
    // fits in one screen on a laptop.
    if (m.kind === 'bar') barChart(chartBox, { years, values, label, decimals: m.decimals, height: 200 });
    else lineChart(chartBox, { years, values, label, decimals: m.decimals, height: 200 });
    chartTitle.textContent = m.title;
    chartSource.textContent = `Source: ${m.data.source}`;
  }
  drawMain();

  root.querySelector('#metric-switch').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    metric = b.dataset.metric;
    root.querySelectorAll('#metric-switch button').forEach((x) => x.classList.toggle('on', x === b));
    drawMain();
  });
  root.querySelector('#range-switch').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    range = b.dataset.range;
    root.querySelectorAll('#range-switch button').forEach((x) => x.classList.toggle('on', x === b));
    drawMain();
  });

  hbars(root.querySelector('#top-provinces'), {
    items: PROVINCES.slice(0, 5).map((p) => ({ name: p.name, value: p.pop })),
    max: PROVINCES[0].pop,
    formatValue: (v) => `${(v / 1000).toFixed(1)}m`,
  });

  const q = root.querySelector('#q');
  const grid = root.querySelector('#index-grid');
  const empty = root.querySelector('#index-empty');
  q.addEventListener('input', () => {
    const needle = q.value.trim().toLowerCase();
    let shown = 0;
    grid.querySelectorAll('.index-item').forEach((item) => {
      const hit = !needle || item.dataset.name.includes(needle);
      item.hidden = !hit;
      if (hit) shown += 1;
    });
    empty.hidden = shown > 0;
  });
}

// ---------- Population ----------
function population(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · People</p>
    <h1>Population</h1>
    <p class="lede">281.6 million people lived in Indonesia in 2024 — the world's fourth-largest population, spread across 38 provinces and more than 17,000 islands.</p>
  </section>
  <section class="kpis"><a class="kpi" href="#/population"><span class="kpi-name">Population, 2024</span><span class="kpi-value">281.6 million</span><span class="kpi-year">BPS mid-year projection</span></a>
  <a class="kpi" href="#/regions"><span class="kpi-name">Largest province</span><span class="kpi-value">West Java</span><span class="kpi-year">50.3 million people</span></a>
  <a class="kpi" href="#/regions"><span class="kpi-name">Smallest province</span><span class="kpi-value">North Kalimantan</span><span class="kpi-year">739,800 people</span></a></section>
  <section class="card">
    <h2>Population, 2015–2024</h2>
    <div id="pop-chart"></div>
    ${sourceNote(POPULATION.source)}
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Ten largest provinces, 2024</h2>
      <div id="prov-bars"></div>
      <p><a class="more" href="#/regions">Open the full province table →</a></p>
    </section>
    <section class="card">
      <h2>Key facts</h2>
      ${factList(POPULATION.facts)}
      <p class="muted">The 2020 Population Census counted 270.20 million people. Growth has slowed to about 1% a year as fertility falls.</p>
    </section>
  </div>`;
  lineChart(root.querySelector('#pop-chart'), { years: YEARS, values: POPULATION.values, label: 'Population 2015–2024', decimals: 1 });
  hbars(root.querySelector('#prov-bars'), {
    items: PROVINCES.map((p) => ({ name: p.name, value: p.pop })),
    max: PROVINCES[0].pop,
    formatValue: (v) => `${(v / 1000).toFixed(1)}m`,
  });
}

// ---------- Economy ----------
function economy(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · Economy</p>
    <h1>Economy</h1>
    <p class="lede">Southeast Asia's largest economy grew 5.03% in 2024, reaching Rp 22,139 trillion — about US$ 1.40 trillion — with GDP per capita of US$ 4,960.</p>
  </section>
  <section class="kpis">
    <a class="kpi" href="#/economy"><span class="kpi-name">GDP growth, 2024</span><span class="kpi-value">5.03%</span><span class="kpi-year">vs 5.05% in 2023</span></a>
    <a class="kpi" href="#/economy"><span class="kpi-name">GDP, current prices</span><span class="kpi-value">Rp 22,139 tn</span><span class="kpi-year">≈ US$ 1.40 trillion</span></a>
    <a class="kpi" href="#/economy"><span class="kpi-name">GDP per capita</span><span class="kpi-value">US$ 4,960</span><span class="kpi-year">Rp 78.62 million</span></a>
  </section>
  <section class="card">
    <h2>Real GDP growth, 2015–2024</h2>
    <div id="gdp-chart"></div>
    ${sourceNote(GDP_GROWTH.source)}
    <p class="muted">The −2.07% bar in 2020 is the pandemic contraction. Growth has held at about 5% every year since 2022.</p>
  </section>
  <div class="two-col">
    <section class="card">
      <h2>What the economy makes — share of GDP, 2023</h2>
      <div id="sector-donut"></div>
      ${sourceNote('BPS — Statistics Indonesia, national accounts')}
    </section>
    <section class="card">
      <h2>Trade in goods, 2024</h2>
      <ul class="facts">
        <li><strong>Exports</strong><span>US$ ${TRADE_2024.exports.toFixed(2)} billion (${TRADE_2024.exportsChange})</span></li>
        <li><strong>Imports</strong><span>US$ ${TRADE_2024.imports.toFixed(2)} billion (${TRADE_2024.importsChange})</span></li>
        <li><strong>Trade surplus</strong><span>US$ ${TRADE_2024.surplus.toFixed(2)} billion</span></li>
        <li><strong>Biggest export earner</strong><span>Coal, palm oil and nickel products</span></li>
      </ul>
      ${sourceNote(TRADE_2024.source)}
    </section>
  </div>`;
  barChart(root.querySelector('#gdp-chart'), { years: YEARS, values: GDP_GROWTH.values, label: 'Real GDP growth 2015–2024', decimals: 2 });
  donutChart(root.querySelector('#sector-donut'), { items: SECTORS_2023, label: 'GDP by sector, 2023', colors: DONUT_COLORS });
}

// ---------- Prices ----------
function prices(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · Prices</p>
    <h1>Prices</h1>
    <p class="lede">Consumer prices rose 1.57% in the year to December 2024 — the slowest December reading in a decade, and inside Bank Indonesia's target band.</p>
  </section>
  <section class="kpis">
    <a class="kpi" href="#/prices"><span class="kpi-name">Inflation, Dec 2024</span><span class="kpi-value">1.57%</span><span class="kpi-year">year on year</span></a>
    <a class="kpi" href="#/prices"><span class="kpi-name">Inflation, Dec 2023</span><span class="kpi-value">2.61%</span><span class="kpi-year">year on year</span></a>
    <a class="kpi" href="#/prices"><span class="kpi-name">Target band</span><span class="kpi-value">2.5% ± 1</span><span class="kpi-year">Bank Indonesia, 2024</span></a>
  </section>
  <section class="card">
    <h2>Consumer price inflation, 2015–2024</h2>
    <div id="cpi-chart"></div>
    ${sourceNote(INFLATION.source)}
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Why 2022 spiked</h2>
      <p>Inflation jumped to 5.51% in December 2022 after the government raised subsidised fuel prices in September that year. It fell back through 2023 as fuel prices stabilised and food supply improved.</p>
    </section>
    <section class="card">
      <h2>How to read this</h2>
      <p>Each point is the change in the Consumer Price Index in December compared with the same month a year earlier. It is the headline inflation number BPS publishes each month — the one that decides whether prices are inside the central bank's target.</p>
    </section>
  </div>`;
  lineChart(root.querySelector('#cpi-chart'), { years: YEARS, values: INFLATION.values, label: 'Consumer price inflation 2015–2024', decimals: 2 });
}

// ---------- Jobs & wellbeing ----------
function jobs(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · Jobs &amp; wellbeing</p>
    <h1>Jobs &amp; wellbeing</h1>
    <p class="lede">Unemployment fell to 4.91% in August 2024, poverty to a record low of 8.57% in September 2024, and the Human Development Index reached 75.02.</p>
  </section>
  <section class="kpis">
    <a class="kpi" href="#/jobs"><span class="kpi-name">Unemployment, Aug 2024</span><span class="kpi-value">4.91%</span><span class="kpi-year">7.47 million people</span></a>
    <a class="kpi" href="#/jobs"><span class="kpi-name">Poverty, Sep 2024</span><span class="kpi-value">8.57%</span><span class="kpi-year">24.06 million people</span></a>
    <a class="kpi" href="#/jobs"><span class="kpi-name">Human Development Index</span><span class="kpi-value">75.02</span><span class="kpi-year">2024, +0.63 on 2023</span></a>
  </section>
  <section class="card">
    <h2>Open unemployment rate, 2015–2024</h2>
    <div id="u-chart"></div>
    ${sourceNote(UNEMPLOYMENT.source)}
  </section>
  <section class="card">
    <h2>Poverty rate, 2015–2024</h2>
    <div id="p-chart"></div>
    ${sourceNote(POVERTY.source)}
    <p class="muted">September 2024's 8.57% is the lowest poverty rate BPS has recorded since it began publishing the series in 1960.</p>
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Human Development Index, 2015–2024</h2>
      <div id="hdi-chart"></div>
      ${sourceNote(HDI.source)}
    </section>
    <section class="card">
      <h2>What makes up the HDI, 2024</h2>
      ${factList(HDI.facts)}
    </section>
  </div>`;
  lineChart(root.querySelector('#u-chart'), { years: YEARS, values: UNEMPLOYMENT.values, label: 'Open unemployment rate 2015–2024', decimals: 2 });
  lineChart(root.querySelector('#p-chart'), { years: YEARS, values: POVERTY.values, label: 'Poverty rate 2015–2024', decimals: 2 });
  lineChart(root.querySelector('#hdi-chart'), { years: YEARS, values: HDI.values, label: 'Human Development Index 2015–2024', decimals: 2 });
}

// ---------- Regions ----------
function regions(root) {
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · Regions</p>
    <h1>Provinces</h1>
    <p class="lede">Indonesia has 38 provinces. The ten largest are listed below — sort the table, or type a name to find one.</p>
  </section>
  <section class="card">
    <div class="card-head">
      <h2>Ten largest provinces, 2024</h2>
      <div class="table-tools">
        <label class="visually-hidden" for="pf">Filter provinces</label>
        <input id="pf" type="search" placeholder="Filter by name or island…" autocomplete="off">
      </div>
    </div>
    <table class="ptable">
      <thead><tr>
        <th><button type="button" data-sort="rank" class="sort on">#</button></th>
        <th><button type="button" data-sort="name" class="sort">Province</button></th>
        <th><button type="button" data-sort="capital" class="sort">Capital</button></th>
        <th><button type="button" data-sort="island" class="sort">Island</button></th>
        <th class="num"><button type="button" data-sort="pop" class="sort">Population</button></th>
        <th class="num">Share</th>
      </tr></thead>
      <tbody id="prov-body"></tbody>
    </table>
    <p class="source">Source: BPS — Statistics Indonesia, mid-year population projection 2024 (thousands). Java's six provinces hold 156.9 million people, 55.7% of the country.</p>
    <p class="muted" id="prov-empty" hidden>No province matches that filter.</p>
  </section>`;
  const body = root.querySelector('#prov-body');
  const empty = root.querySelector('#prov-empty');
  let sortKey = 'rank';
  let sortDir = 1;
  let filter = '';

  function renderRows() {
    const rows = PROVINCES.map((p, i) => ({ ...p, rank: i + 1, share: (p.pop / 281604) * 100 }));
    const needle = filter.trim().toLowerCase();
    const filtered = rows.filter((r) => !needle || r.name.toLowerCase().includes(needle) || r.island.toLowerCase().includes(needle));
    filtered.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number') return (av - bv) * sortDir;
      return String(av).localeCompare(String(bv)) * sortDir;
    });
    body.innerHTML = filtered.map((r) => `<tr>
      <td>${r.rank}</td><td><strong>${esc(r.name)}</strong></td><td>${esc(r.capital)}</td>
      <td>${esc(r.island)}</td><td class="num">${(r.pop * 1000).toLocaleString('en-US')}</td>
      <td class="num">${r.share.toFixed(1)}%</td></tr>`).join('');
    empty.hidden = filtered.length > 0;
  }
  renderRows();

  root.querySelectorAll('.sort').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.sort;
      if (sortKey === key) sortDir *= -1;
      else { sortKey = key; sortDir = 1; }
      root.querySelectorAll('.sort').forEach((x) => x.classList.toggle('on', x === btn));
      renderRows();
    });
  });
  root.querySelector('#pf').addEventListener('input', (e) => {
    filter = e.target.value;
    renderRows();
  });
}

// ---------- Sources ----------
function sources(root) {
  const rows = [
    ['Population 2015–2024', 'BPS — Statistics Indonesia', 'Mid-year projection; 2020 Population Census', '2024'],
    ['GDP growth & GDP level', 'BPS — Statistics Indonesia', 'National accounts, press release 5 Feb 2025', '2024'],
    ['GDP per capita', 'BPS — Statistics Indonesia', 'National accounts, press release 5 Feb 2025', '2024'],
    ['Consumer price inflation', 'BPS — Statistics Indonesia', 'Consumer Price Index, December year on year', '2015–2024'],
    ['Unemployment', 'BPS — Statistics Indonesia', 'National Labour Force Survey (Sakernas), August', '2015–2024'],
    ['Poverty', 'BPS — Statistics Indonesia', 'Poverty statistics, September', '2015–2024'],
    ['Human Development Index', 'BPS — Statistics Indonesia', 'HDI release, 15 Nov 2024', '2015–2024'],
    ['Foreign trade', 'BPS — Statistics Indonesia', 'Foreign trade statistics release, 15 Jan 2025', '2024'],
    ['GDP by sector', 'BPS — Statistics Indonesia', 'National accounts', '2023'],
    ['Province populations', 'BPS — Statistics Indonesia', 'Mid-year population projection', '2024'],
  ];
  root.innerHTML = `
  <section class="page-head">
    <p class="eyebrow"><a href="#/">Indonesia</a> · About</p>
    <h1>Sources &amp; methods</h1>
    <p class="lede">Every number on this site comes from a published BPS release. Nothing here is estimated by us, and nothing is fetched from the internet at run time — all figures are written into this site's own files.</p>
  </section>
  <section class="card">
    <h2>Where each figure comes from</h2>
    <table class="ptable">
      <thead><tr><th>Figure</th><th>Publisher</th><th>Publication</th><th>Year</th></tr></thead>
      <tbody>${rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<td><strong>${esc(c)}</strong></td>` : `<td>${esc(c)}</td>`)).join('')}</tr>`).join('')}</tbody>
    </table>
  </section>
  <section class="card">
    <h2>Methods &amp; notes</h2>
    <ul class="notes">
      <li><strong>Headline year is 2024</strong> — the latest complete year BPS had published when this site was built in November 2026.</li>
      <li><strong>Population</strong> is the BPS mid-year projection; 2020 is the census count (270.20 million).</li>
      <li><strong>Poverty and unemployment</strong> use BPS's regular reference points: September for poverty, August for the labour-force survey.</li>
      <li><strong>HDI before 2020</strong> follows the series BPS published for those years; the 2020–2024 values are the revised series from the 2024 release.</li>
      <li><strong>Trade</strong> covers goods only, as BPS reports it; services are not included.</li>
      <li><strong>This site is an unofficial reader.</strong> It is not published by BPS and is not affiliated with Statistics Indonesia. Figures are reproduced as published; for the authoritative record, see bps.go.id.</li>
    </ul>
  </section>`;
}

export const ROUTES = {
  '/': overview,
  '/population': population,
  '/economy': economy,
  '/prices': prices,
  '/jobs': jobs,
  '/regions': regions,
  '/sources': sources,
};

export function render(route, root) {
  const view = ROUTES[route] ?? overview;
  view(root);
  root.querySelectorAll('a[href^="#/"]').forEach((a) => {
    a.addEventListener('click', () => {
      document.querySelector('.nav')?.classList.remove('open');
    });
  });
}
