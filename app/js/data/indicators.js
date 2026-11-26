// National indicators for Japan, compiled from the official releases named in each `source`, rounded for display.
// Every series is a list of [year, value] pairs, oldest first. Topics group indicators for the topic pages.

export const SOURCES = {
  popest: { name: 'Population Estimates', org: 'Statistics Bureau of Japan (MIC)', freq: 'Annual, 1 October' },
  census: { name: 'Population Census', org: 'Statistics Bureau of Japan (MIC)', freq: 'Every 5 years' },
  vital: { name: 'Vital Statistics', org: 'Ministry of Health, Labour and Welfare', freq: 'Annual' },
  life: { name: 'Abridged Life Tables', org: 'Ministry of Health, Labour and Welfare', freq: 'Annual' },
  sna: { name: 'National Accounts (GDP)', org: 'Cabinet Office, ESRI', freq: 'Quarterly, annual' },
  lfs: { name: 'Labour Force Survey', org: 'Statistics Bureau of Japan (MIC)', freq: 'Monthly, annual' },
  cpi: { name: 'Consumer Price Index', org: 'Statistics Bureau of Japan (MIC)', freq: 'Monthly, annual' },
  trade: { name: 'Trade Statistics', org: 'Ministry of Finance', freq: 'Monthly, annual' },
  jnto: { name: 'Visitor Arrivals', org: 'Japan National Tourism Organization', freq: 'Monthly, annual' },
};

export const TOPICS = [
  { id: 'population', name: 'Population', blurb: 'How many people live in Japan, how old they are, and how fast the total is shrinking.' },
  { id: 'births-deaths', name: 'Births & deaths', blurb: 'Births, deaths, fertility and life expectancy: the vital statistics behind the population curve.' },
  { id: 'economy', name: 'Economy', blurb: 'The size and growth of the economy, prices and the trade balance.' },
  { id: 'labour', name: 'Work & jobs', blurb: 'Who is in work, who is looking, and how the labour force is changing.' },
  { id: 'tourism', name: 'Tourism', blurb: 'Foreign visitor arrivals before, during and after the pandemic.' },
];

export const INDICATORS = [
  {
    id: 'population', topic: 'population', name: 'Total population', unit: 'million people', digits: 1,
    source: 'popest', note: 'Population on 1 October; census years are census counts.',
    series: [[1950, 84.1], [1955, 90.1], [1960, 94.3], [1965, 99.2], [1970, 104.7], [1975, 111.9], [1980, 117.1],
      [1985, 121.0], [1990, 123.6], [1995, 125.6], [2000, 126.9], [2005, 127.8], [2010, 128.1], [2015, 127.1],
      [2020, 126.1], [2021, 125.5], [2022, 124.9], [2023, 124.4], [2024, 123.8]],
  },
  {
    id: 'aged-65', topic: 'population', name: 'Aged 65 and over', unit: '% of population', digits: 1,
    source: 'popest', note: 'Share of the total population aged 65 or older on 1 October.',
    series: [[1950, 4.9], [1960, 5.7], [1970, 7.1], [1980, 9.1], [1990, 12.1], [2000, 17.4], [2010, 23.0],
      [2015, 26.6], [2020, 28.6], [2023, 29.1], [2024, 29.3]],
  },
  {
    id: 'aged-0-14', topic: 'population', name: 'Aged under 15', unit: '% of population', digits: 1,
    source: 'popest', note: 'Share of the total population aged 0 to 14 on 1 October.',
    series: [[1950, 35.4], [1960, 30.2], [1970, 24.0], [1980, 23.5], [1990, 18.2], [2000, 14.6], [2010, 13.1],
      [2015, 12.6], [2020, 11.9], [2023, 11.4], [2024, 11.2]],
  },
  {
    id: 'births', topic: 'births-deaths', name: 'Live births', unit: 'thousand', digits: 0,
    source: 'vital', note: 'Births to Japanese nationals in Japan, calendar year.',
    series: [[2000, 1191], [2005, 1063], [2010, 1071], [2015, 1006], [2016, 977], [2017, 946], [2018, 918],
      [2019, 865], [2020, 841], [2021, 812], [2022, 771], [2023, 727], [2024, 686]],
  },
  {
    id: 'deaths', topic: 'births-deaths', name: 'Deaths', unit: 'thousand', digits: 0,
    source: 'vital', note: 'Deaths of Japanese nationals in Japan, calendar year.',
    series: [[2000, 962], [2005, 1084], [2010, 1197], [2015, 1291], [2016, 1308], [2017, 1341], [2018, 1362],
      [2019, 1381], [2020, 1373], [2021, 1440], [2022, 1569], [2023, 1576], [2024, 1605]],
  },
  {
    id: 'tfr', topic: 'births-deaths', name: 'Total fertility rate', unit: 'births per woman', digits: 2,
    source: 'vital', note: 'Average number of children a woman would have at current age-specific rates.',
    series: [[2005, 1.26], [2010, 1.39], [2015, 1.45], [2016, 1.44], [2017, 1.43], [2018, 1.42], [2019, 1.36],
      [2020, 1.33], [2021, 1.30], [2022, 1.26], [2023, 1.20], [2024, 1.15]],
  },
  {
    id: 'life-f', topic: 'births-deaths', name: 'Life expectancy, women', unit: 'years at birth', digits: 2,
    source: 'life', note: 'Expectation of life at birth, female.',
    series: [[2000, 84.60], [2005, 85.52], [2010, 86.30], [2015, 87.05], [2019, 87.45], [2020, 87.71],
      [2021, 87.57], [2022, 87.09], [2023, 87.14]],
  },
  {
    id: 'life-m', topic: 'births-deaths', name: 'Life expectancy, men', unit: 'years at birth', digits: 2,
    source: 'life', note: 'Expectation of life at birth, male.',
    series: [[2000, 77.72], [2005, 78.56], [2010, 79.55], [2015, 80.75], [2019, 81.41], [2020, 81.56],
      [2021, 81.47], [2022, 81.05], [2023, 81.09]],
  },
  {
    id: 'gdp-growth', topic: 'economy', name: 'Real GDP growth', unit: '% change on year', digits: 1, signed: true,
    source: 'sna', note: 'Calendar-year change in real GDP (chain-linked).',
    series: [[2014, 0.3], [2015, 1.6], [2016, 0.8], [2017, 1.7], [2018, 0.6], [2019, -0.4], [2020, -4.2],
      [2021, 2.7], [2022, 1.0], [2023, 1.5], [2024, 0.1]],
  },
  {
    id: 'gdp-nominal', topic: 'economy', name: 'Nominal GDP', unit: 'trillion yen', digits: 1,
    source: 'sna', note: 'Gross domestic product at current prices, calendar year.',
    series: [[2014, 523.4], [2015, 540.7], [2016, 544.8], [2017, 555.7], [2018, 556.6], [2019, 557.9],
      [2020, 539.8], [2021, 552.6], [2022, 561.9], [2023, 591.5], [2024, 609.3]],
  },
  {
    id: 'cpi', topic: 'economy', name: 'Consumer prices', unit: '% change on year', digits: 1, signed: true,
    source: 'cpi', note: 'All items, calendar-year average change.',
    series: [[2014, 2.7], [2015, 0.8], [2016, -0.1], [2017, 0.5], [2018, 1.0], [2019, 0.5], [2020, 0.0],
      [2021, -0.2], [2022, 2.5], [2023, 3.2], [2024, 2.7]],
  },
  {
    id: 'exports', topic: 'economy', name: 'Exports of goods', unit: 'trillion yen', digits: 1,
    source: 'trade', note: 'Customs-cleared exports, calendar year.',
    series: [[2019, 76.9], [2020, 68.4], [2021, 83.1], [2022, 98.2], [2023, 100.9], [2024, 107.9]],
  },
  {
    id: 'imports', topic: 'economy', name: 'Imports of goods', unit: 'trillion yen', digits: 1,
    source: 'trade', note: 'Customs-cleared imports, calendar year.',
    series: [[2019, 78.6], [2020, 68.0], [2021, 84.9], [2022, 118.2], [2023, 110.2], [2024, 113.2]],
  },
  {
    id: 'unemployment', topic: 'labour', name: 'Unemployment rate', unit: '% of labour force', digits: 1,
    source: 'lfs', note: 'Annual average, seasonally unadjusted.',
    series: [[2014, 3.6], [2015, 3.4], [2016, 3.1], [2017, 2.8], [2018, 2.4], [2019, 2.4], [2020, 2.8],
      [2021, 2.8], [2022, 2.6], [2023, 2.6], [2024, 2.5]],
  },
  {
    id: 'employed', topic: 'labour', name: 'Employed persons', unit: 'million', digits: 2,
    source: 'lfs', note: 'Annual average number of people in work.',
    series: [[2014, 63.71], [2015, 64.01], [2016, 64.65], [2017, 65.30], [2018, 66.82], [2019, 67.50],
      [2020, 67.10], [2021, 67.13], [2022, 67.23], [2023, 67.47], [2024, 67.81]],
  },
  {
    id: 'visitors', topic: 'tourism', name: 'Foreign visitor arrivals', unit: 'million', digits: 2,
    source: 'jnto', note: 'Arrivals of foreign nationals, calendar year.',
    series: [[2015, 19.74], [2016, 24.04], [2017, 28.69], [2018, 31.19], [2019, 31.88], [2020, 4.12],
      [2021, 0.25], [2022, 3.83], [2023, 25.07], [2024, 36.87]],
  },
];

export const byId = (id) => INDICATORS.find((i) => i.id === id);
export const latest = (ind) => ind.series[ind.series.length - 1];
export const previous = (ind) => ind.series[ind.series.length - 2];

// The headline figures on the home page, in the order shown.
export const HEADLINES = ['population', 'aged-65', 'gdp-growth', 'cpi', 'unemployment', 'tfr'];

// Population by broad age group on 1 October 2023 (million), for the age-structure chart.
export const AGE_GROUPS_2023 = [
  { label: '0–14', value: 14.17 },
  { label: '15–64', value: 73.95 },
  { label: '65–74', value: 16.15 },
  { label: '75+', value: 20.08 },
];
