// NusaStat data — Indonesia in numbers.
// Every figure below is a published figure from BPS — Statistics Indonesia
// (Badan Pusat Statistik), unless a different source is named next to it.
// Headline year is 2024, the latest complete year published by BPS at the
// time this site was built (November 2026). Series run 2015–2024.
// Figures were checked against BPS press releases and publications before
// being written into this file. See the Sources page for the full list.

export const META = {
  country: 'Indonesia',
  headlineYear: 2024,
  updated: 'November 2026',
  publisher: 'BPS — Statistics Indonesia',
  note: 'Unofficial reader built from published BPS figures. Not affiliated with BPS.',
};

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Population, mid-year, millions. 2020 is the census count; other years are
// BPS mid-year projections. Source: BPS / UNdata.
export const POPULATION = {
  label: 'Population',
  unit: 'million people',
  source: 'BPS — Statistics Indonesia, mid-year projection (2020: Population Census)',
  values: [255.5, 258.7, 261.9, 265.0, 268.1, 270.2, 273.7, 275.8, 278.7, 281.6],
  headline: { value: 281.6, suffix: ' million', year: 2024, change: '+1.0% vs 2023' },
  facts: [
    { k: 'World rank', v: '4th most populous country' },
    { k: 'Java island', v: '156.9 million — 55.7% of all Indonesians' },
    { k: 'Largest province', v: 'West Java — 50.3 million' },
    { k: 'Smallest province', v: 'North Kalimantan — 739,800' },
  ],
};

// Real GDP growth, percent year on year. Source: BPS national accounts.
export const GDP_GROWTH = {
  label: 'Real GDP growth',
  unit: '% per year',
  source: 'BPS — Statistics Indonesia, national accounts',
  values: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.7, 5.31, 5.05, 5.03],
  headline: { value: 5.03, suffix: '%', year: 2024, change: 'vs 5.05% in 2023' },
  facts: [
    { k: 'GDP, current prices', v: 'Rp 22,139 trillion (2024)' },
    { k: 'GDP per capita', v: 'Rp 78.62 million — US$ 4,960 (2024)' },
    { k: 'GDP, current US$', v: '≈ US$ 1.40 trillion (2024)' },
    { k: 'Deepest fall', v: '−2.07% in 2020, the pandemic year' },
  ],
};

// Consumer price inflation, December year on year, percent. Source: BPS.
export const INFLATION = {
  label: 'Consumer price inflation',
  unit: '% (December, year on year)',
  source: 'BPS — Statistics Indonesia, Consumer Price Index',
  values: [3.35, 3.02, 3.61, 3.13, 2.72, 1.68, 1.87, 5.51, 2.61, 1.57],
  headline: { value: 1.57, suffix: '%', year: 2024, change: 'lowest December reading in the decade' },
  facts: [
    { k: '2022 spike', v: '5.51% after the fuel-subsidy adjustment' },
    { k: '2023', v: '2.61% — back inside the 2–4% target band' },
    { k: 'Target band', v: 'Bank Indonesia: 2.5% ± 1 point (2024)' },
  ],
};

// Open unemployment rate, August, percent of labour force. Source: BPS Sakernas.
export const UNEMPLOYMENT = {
  label: 'Open unemployment rate',
  unit: '% of labour force (August)',
  source: 'BPS — Statistics Indonesia, National Labour Force Survey (Sakernas)',
  values: [6.18, 5.61, 5.5, 5.34, 5.28, 7.07, 6.49, 5.86, 5.32, 4.91],
  headline: { value: 4.91, suffix: '%', year: 2024, change: 'down from 5.32% in August 2023' },
  facts: [
    { k: 'People unemployed', v: '7.47 million (August 2024)' },
    { k: 'Labour-force participation', v: '70.63% (August 2024)' },
    { k: 'Pandemic peak', v: '7.07% in August 2020' },
  ],
};

// Poverty rate, September, percent of population. Source: BPS.
export const POVERTY = {
  label: 'Poverty rate',
  unit: '% of population (September)',
  source: 'BPS — Statistics Indonesia, poverty statistics',
  values: [11.22, 10.7, 10.12, 9.66, 9.22, 10.19, 9.71, 9.57, 9.36, 8.57],
  headline: { value: 8.57, suffix: '%', year: 2024, change: 'lowest ever recorded by BPS' },
  facts: [
    { k: 'People in poverty', v: '24.06 million (September 2024)' },
    { k: 'One year earlier', v: '9.36% in September 2023' },
    { k: 'Pandemic reversal', v: 'rose to 10.19% in September 2020' },
  ],
};

// Human Development Index, 0–100. Source: BPS.
export const HDI = {
  label: 'Human Development Index',
  unit: 'index, 0–100',
  source: 'BPS — Statistics Indonesia, Human Development Index release',
  values: [69.55, 70.18, 70.81, 71.39, 71.92, 72.81, 73.16, 73.77, 74.39, 75.02],
  headline: { value: 75.02, suffix: '', year: 2024, change: '+0.63 points on 2023' },
  facts: [
    { k: 'Life expectancy at birth', v: '74.15 years (2024)' },
    { k: 'Expected years of schooling', v: '13.21 years (2024)' },
    { k: 'Mean years of schooling', v: '8.85 years (2024)' },
    { k: 'Adjusted real spending per capita', v: 'Rp 12.34 million / year (2024)' },
  ],
};

// GDP by sector, share of GDP, 2023. Source: BPS national accounts.
export const SECTORS_2023 = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Wholesale & retail trade', share: 12.9 },
  { name: 'Agriculture, forestry & fishing', share: 12.5 },
  { name: 'Mining & quarrying', share: 10.6 },
  { name: 'Construction', share: 9.9 },
  { name: 'Information & communication', share: 4.2 },
  { name: 'Financial & insurance', share: 4.1 },
  { name: 'All other sectors', share: 27.1 },
];

// Foreign trade in goods, US$ billion, 2024. Source: BPS.
export const TRADE_2024 = {
  exports: 264.7,
  imports: 233.66,
  surplus: 31.04,
  exportsChange: '+2.29% vs 2023',
  importsChange: '+5.31% vs 2023',
  source: 'BPS — Statistics Indonesia, foreign trade statistics',
};

// Ten largest provinces, mid-year population 2024, thousands. Source: BPS.
export const PROVINCES = [
  { name: 'West Java', capital: 'Bandung', pop: 50345, island: 'Java' },
  { name: 'East Java', capital: 'Surabaya', pop: 41815, island: 'Java' },
  { name: 'Central Java', capital: 'Semarang', pop: 37892, island: 'Java' },
  { name: 'North Sumatra', capital: 'Medan', pop: 15588, island: 'Sumatra' },
  { name: 'Banten', capital: 'Serang', pop: 12431, island: 'Java' },
  { name: 'Jakarta', capital: 'Jakarta', pop: 10685, island: 'Java' },
  { name: 'South Sulawesi', capital: 'Makassar', pop: 9463, island: 'Sulawesi' },
  { name: 'Lampung', capital: 'Bandar Lampung', pop: 9310, island: 'Sumatra' },
  { name: 'South Sumatra', capital: 'Palembang', pop: 8941, island: 'Sumatra' },
  { name: 'Riau', capital: 'Pekanbaru', pop: 7012, island: 'Sumatra' },
];

// Indicator catalogue used by the overview search and the indicator index.
export const INDICATORS = [
  { id: 'population', name: 'Population', value: '281.6 million', year: 2024, route: '#/population', blurb: 'How many people live in Indonesia, and where.' },
  { id: 'gdp', name: 'GDP growth', value: '5.03%', year: 2024, route: '#/economy', blurb: 'How fast the economy grew, year by year.' },
  { id: 'gdp-pc', name: 'GDP per capita', value: 'US$ 4,960', year: 2024, route: '#/economy', blurb: 'Average income per person, in rupiah and dollars.' },
  { id: 'inflation', name: 'Inflation', value: '1.57%', year: 2024, route: '#/prices', blurb: 'How fast consumer prices rose.' },
  { id: 'unemployment', name: 'Unemployment', value: '4.91%', year: 2024, route: '#/jobs', blurb: 'Share of the labour force without work.' },
  { id: 'poverty', name: 'Poverty rate', value: '8.57%', year: 2024, route: '#/jobs', blurb: 'Share of people below the poverty line.' },
  { id: 'hdi', name: 'Human Development Index', value: '75.02', year: 2024, route: '#/jobs', blurb: 'Health, schooling and living standards in one number.' },
  { id: 'exports', name: 'Exports of goods', value: 'US$ 264.70 bn', year: 2024, route: '#/economy', blurb: 'What Indonesia sold to the world.' },
  { id: 'trade', name: 'Trade balance', value: 'US$ 31.04 bn surplus', year: 2024, route: '#/economy', blurb: 'Exports minus imports of goods.' },
  { id: 'life', name: 'Life expectancy', value: '74.15 years', year: 2024, route: '#/jobs', blurb: 'How long a newborn is expected to live.' },
];

// Latest releases — what BPS published most recently in the dataset's window.
export const RELEASES = [
  { date: '5 Feb 2025', title: 'Economy grew 5.03% in 2024; GDP Rp 22,139 trillion', tag: 'Economy' },
  { date: '15 Jan 2025', title: 'Poverty fell to 8.57% in September 2024 — the lowest ever recorded', tag: 'Poverty' },
  { date: '15 Nov 2024', title: 'Human Development Index reached 75.02 in 2024', tag: 'People' },
  { date: '5 Nov 2024', title: 'Open unemployment fell to 4.91% in August 2024', tag: 'Jobs' },
  { date: '15 Jan 2025', title: 'Exports reached US$ 264.70 billion in 2024', tag: 'Trade' },
  { date: '2 Dec 2024', title: 'December inflation 1.57% year on year', tag: 'Prices' },
];
