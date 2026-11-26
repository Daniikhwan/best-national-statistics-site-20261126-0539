// NusaStat charts — small hand-rolled SVG charts. No library, no network:
// every chart is drawn from the numbers in data.js and nothing else.

const NS = 'http://www.w3.org/2000/svg';

function svgEl(tag, attrs, parent) {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (parent) parent.appendChild(el);
  return el;
}

function fmt(n, decimals = 1) {
  return Number(n).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function niceTicks(min, max, count = 4) {
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const stepRaw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(stepRaw)));
  const step = [1, 2, 5, 10].map((m) => m * mag).find((s) => s >= stepRaw) ?? 10 * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let t = lo; t <= hi + step * 0.001; t += step) ticks.push(Math.round(t * 100) / 100);
  return { lo, hi, ticks };
}

// Line chart with dots, value labels and a hover tooltip on each point.
export function lineChart(container, { years, values, label, color = '#0e4f4a', decimals = 1, height = 260 }) {
  const w = 720;
  const h = height;
  const padL = 52;
  const padR = 14;
  const padT = 18;
  const padB = 30;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const { lo, hi, ticks } = niceTicks(min, max);
  const x = (i) => padL + ((w - padL - padR) * i) / (years.length - 1);
  const y = (v) => padT + ((h - padT - padB) * (hi - v)) / (hi - lo);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${w} ${h}`,
    role: 'img',
    'aria-label': `${label}, ${years[0]} to ${years[years.length - 1]}`,
    class: 'chart',
  }, container);

  for (const t of ticks) {
    svgEl('line', { x1: padL, x2: w - padR, y1: y(t), y2: y(t), class: 'grid' }, svg);
    const lab = svgEl('text', { x: padL - 8, y: y(t) + 4, class: 'axis', 'text-anchor': 'end' }, svg);
    lab.textContent = fmt(t, decimals);
  }
  svgEl('line', { x1: padL, x2: w - padR, y1: h - padB, y2: h - padB, class: 'axisline' }, svg);

  const pts = values.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  svgEl('polyline', { points: pts, class: 'line', stroke: color, fill: 'none' }, svg);
  // Soft area under the line.
  svgEl('polygon', {
    points: `${padL},${h - padB} ${pts} ${x(years.length - 1)},${h - padB}`,
    class: 'area', fill: color,
  }, svg);

  values.forEach((v, i) => {
    const c = svgEl('circle', { cx: x(i), cy: y(v), r: 4.5, class: 'dot', fill: color }, svg);
    const tip = document.createElementNS(NS, 'title');
    tip.textContent = `${years[i]}: ${fmt(v, decimals)}`;
    c.appendChild(tip);
    if (i === values.length - 1) {
      const lab = svgEl('text', { x: x(i) - 4, y: y(v) - 12, class: 'lastval', 'text-anchor': 'end' }, svg);
      lab.textContent = fmt(v, decimals);
    }
  });
  years.forEach((yr, i) => {
    if (i % 2 === 0 || i === years.length - 1) {
      const lab = svgEl('text', { x: x(i), y: h - 10, class: 'axis', 'text-anchor': 'middle' }, svg);
      lab.textContent = yr;
    }
  });
  return svg;
}

// Vertical bar chart; negative values draw below the zero line.
export function barChart(container, { years, values, label, color = '#0e4f4a', negColor = '#b3402a', decimals = 2, height = 260 }) {
  const w = 720;
  const h = height;
  const padL = 52;
  const padR = 14;
  const padT = 22;
  const padB = 30;
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  const { lo, hi, ticks } = niceTicks(min, max);
  const slot = (w - padL - padR) / years.length;
  const bw = Math.min(44, slot * 0.62);
  const x = (i) => padL + slot * i + (slot - bw) / 2;
  const y = (v) => padT + ((h - padT - padB) * (hi - v)) / (hi - lo);
  const y0 = y(0);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${w} ${h}`,
    role: 'img',
    'aria-label': `${label}, ${years[0]} to ${years[years.length - 1]}`,
    class: 'chart',
  }, container);

  for (const t of ticks) {
    svgEl('line', { x1: padL, x2: w - padR, y1: y(t), y2: y(t), class: 'grid' }, svg);
    const lab = svgEl('text', { x: padL - 8, y: y(t) + 4, class: 'axis', 'text-anchor': 'end' }, svg);
    lab.textContent = fmt(t, decimals);
  }
  svgEl('line', { x1: padL, x2: w - padR, y1: y0, y2: y0, class: 'axisline' }, svg);

  values.forEach((v, i) => {
    const top = Math.min(y(v), y0);
    const heightPx = Math.abs(y(v) - y0);
    const rect = svgEl('rect', {
      x: x(i), y: top, width: bw, height: Math.max(heightPx, 1.5),
      rx: 3, fill: v < 0 ? negColor : color, class: 'bar',
    }, svg);
    const tip = document.createElementNS(NS, 'title');
    tip.textContent = `${years[i]}: ${fmt(v, decimals)}%`;
    rect.appendChild(tip);
    const lab = svgEl('text', {
      x: x(i) + bw / 2, y: v < 0 ? y(v) + 15 : top - 6,
      class: 'barval', 'text-anchor': 'middle',
    }, svg);
    lab.textContent = fmt(v, decimals);
  });
  years.forEach((yr, i) => {
    const lab = svgEl('text', { x: x(i) + bw / 2, y: h - 10, class: 'axis', 'text-anchor': 'middle' }, svg);
    lab.textContent = yr;
  });
  return svg;
}

// Donut chart with a centre label and a legend list beside it.
export function donutChart(container, { items, label, colors, height = 240 }) {
  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 14;
  const inner = r * 0.62;
  const total = items.reduce((s, it) => s + it.share, 0);

  const wrap = document.createElement('div');
  wrap.className = 'donut-wrap';
  container.appendChild(wrap);

  const svg = svgEl('svg', {
    viewBox: `0 0 ${size} ${size}`,
    role: 'img',
    'aria-label': label,
    class: 'donut',
  }, wrap);

  let acc = 0;
  items.forEach((it, i) => {
    const a0 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += it.share;
    const a1 = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1);
    const yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0);
    const yi0 = cy + inner * Math.sin(a0);
    const path = svgEl('path', {
      d: `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${inner} ${inner} 0 ${large} 0 ${xi0} ${yi0} Z`,
      fill: colors[i % colors.length],
      class: 'slice',
    }, svg);
    const tip = document.createElementNS(NS, 'title');
    tip.textContent = `${it.name}: ${fmt(it.share, 1)}%`;
    path.appendChild(tip);
  });
  const c1 = svgEl('text', { x: cx, y: cy - 4, class: 'donut-centre-big', 'text-anchor': 'middle' }, svg);
  c1.textContent = items[0].share ? `${fmt(items[0].share, 1)}%` : '';
  const c2 = svgEl('text', { x: cx, y: cy + 18, class: 'donut-centre-small', 'text-anchor': 'middle' }, svg);
  c2.textContent = items[0].name;

  const legend = document.createElement('ul');
  legend.className = 'legend';
  items.forEach((it, i) => {
    const li = document.createElement('li');
    const sw = document.createElement('span');
    sw.className = 'swatch';
    sw.style.background = colors[i % colors.length];
    li.appendChild(sw);
    li.appendChild(document.createTextNode(`${it.name} — ${fmt(it.share, 1)}%`));
    legend.appendChild(li);
  });
  wrap.appendChild(legend);
  return wrap;
}

// Horizontal bar list, used for province populations.
export function hbars(container, { items, max, formatValue }) {
  const list = document.createElement('div');
  list.className = 'hbars';
  items.forEach((it) => {
    const row = document.createElement('div');
    row.className = 'hbar-row';
    const name = document.createElement('span');
    name.className = 'hbar-name';
    name.textContent = it.name;
    const track = document.createElement('span');
    track.className = 'hbar-track';
    const fill = document.createElement('span');
    fill.className = 'hbar-fill';
    fill.style.width = `${Math.max(2, (it.value / max) * 100)}%`;
    track.appendChild(fill);
    const val = document.createElement('span');
    val.className = 'hbar-val';
    val.textContent = formatValue(it.value);
    row.append(name, track, val);
    list.appendChild(row);
  });
  container.appendChild(list);
  return list;
}
