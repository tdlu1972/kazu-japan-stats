// The 47 prefectures: population on 1 October 2023 (thousand, Population Estimates, Statistics Bureau of Japan),
// land area (km², Geospatial Information Authority of Japan), region and prefectural capital.
// `c` and `r` place each prefecture on the tile map's grid (column, row), north-east at the top right.

export const REGIONS = ['Hokkaido', 'Tohoku', 'Kanto', 'Chubu', 'Kinki', 'Chugoku', 'Shikoku', 'Kyushu & Okinawa'];

const rows = [
  // id, name, region index, capital, population (thousand), area (km²), column, row
  ['hokkaido', 'Hokkaido', 0, 'Sapporo', 5092, 83424, 11, 0],
  ['aomori', 'Aomori', 1, 'Aomori', 1184, 9646, 11, 1],
  ['iwate', 'Iwate', 1, 'Morioka', 1163, 15275, 11, 2],
  ['miyagi', 'Miyagi', 1, 'Sendai', 2264, 7282, 11, 3],
  ['akita', 'Akita', 1, 'Akita', 914, 11638, 10, 2],
  ['yamagata', 'Yamagata', 1, 'Yamagata', 1026, 9323, 10, 3],
  ['fukushima', 'Fukushima', 1, 'Fukushima', 1767, 13784, 10, 4],
  ['ibaraki', 'Ibaraki', 2, 'Mito', 2825, 6097, 11, 6],
  ['tochigi', 'Tochigi', 2, 'Utsunomiya', 1897, 6408, 11, 5],
  ['gunma', 'Gunma', 2, 'Maebashi', 1902, 6362, 10, 5],
  ['saitama', 'Saitama', 2, 'Saitama', 7331, 3798, 10, 6],
  ['chiba', 'Chiba', 2, 'Chiba', 6257, 5157, 11, 7],
  ['tokyo', 'Tokyo', 2, 'Shinjuku', 14086, 2194, 10, 7],
  ['kanagawa', 'Kanagawa', 2, 'Yokohama', 9229, 2416, 9, 7],
  ['niigata', 'Niigata', 3, 'Niigata', 2126, 12584, 9, 4],
  ['toyama', 'Toyama', 3, 'Toyama', 1007, 4248, 8, 4],
  ['ishikawa', 'Ishikawa', 3, 'Kanazawa', 1109, 4186, 7, 4],
  ['fukui', 'Fukui', 3, 'Fukui', 744, 4191, 7, 5],
  ['yamanashi', 'Yamanashi', 3, 'Kofu', 796, 4465, 9, 6],
  ['nagano', 'Nagano', 3, 'Nagano', 2004, 13562, 9, 5],
  ['gifu', 'Gifu', 3, 'Gifu', 1931, 10621, 8, 5],
  ['shizuoka', 'Shizuoka', 3, 'Shizuoka', 3555, 7777, 8, 7],
  ['aichi', 'Aichi', 3, 'Nagoya', 7477, 5173, 8, 6],
  ['mie', 'Mie', 4, 'Tsu', 1727, 5774, 7, 7],
  ['shiga', 'Shiga', 4, 'Otsu', 1407, 4017, 7, 6],
  ['kyoto', 'Kyoto', 4, 'Kyoto', 2535, 4612, 6, 6],
  ['osaka', 'Osaka', 4, 'Osaka', 8763, 1905, 5, 7],
  ['hyogo', 'Hyogo', 4, 'Kobe', 5370, 8401, 5, 6],
  ['nara', 'Nara', 4, 'Nara', 1296, 3691, 6, 7],
  ['wakayama', 'Wakayama', 4, 'Wakayama', 892, 4725, 6, 8],
  ['tottori', 'Tottori', 5, 'Tottori', 537, 3507, 4, 6],
  ['shimane', 'Shimane', 5, 'Matsue', 650, 6708, 3, 6],
  ['okayama', 'Okayama', 5, 'Okayama', 1847, 7114, 4, 7],
  ['hiroshima', 'Hiroshima', 5, 'Hiroshima', 2738, 8479, 3, 7],
  ['yamaguchi', 'Yamaguchi', 5, 'Yamaguchi', 1298, 6113, 2, 7],
  ['tokushima', 'Tokushima', 6, 'Tokushima', 695, 4147, 5, 8],
  ['kagawa', 'Kagawa', 6, 'Takamatsu', 926, 1877, 4, 8],
  ['ehime', 'Ehime', 6, 'Matsuyama', 1291, 5676, 3, 8],
  ['kochi', 'Kochi', 6, 'Kochi', 666, 7104, 4, 9],
  ['fukuoka', 'Fukuoka', 7, 'Fukuoka', 5103, 4988, 1, 7],
  ['saga', 'Saga', 7, 'Saga', 795, 2441, 0, 8],
  ['nagasaki', 'Nagasaki', 7, 'Nagasaki', 1267, 4131, 0, 9],
  ['kumamoto', 'Kumamoto', 7, 'Kumamoto', 1718, 7409, 1, 8],
  ['oita', 'Oita', 7, 'Oita', 1107, 6341, 2, 8],
  ['miyazaki', 'Miyazaki', 7, 'Miyazaki', 1042, 7735, 2, 9],
  ['kagoshima', 'Kagoshima', 7, 'Kagoshima', 1549, 9187, 1, 9],
  ['okinawa', 'Okinawa', 7, 'Naha', 1468, 2282, 0, 10],
];

export const PREFECTURES = rows.map(([id, name, region, capital, pop, area, c, r], i) => ({
  code: i + 1,
  id,
  name,
  region: REGIONS[region],
  capital,
  pop,
  area,
  density: Math.round((pop * 1000) / area),
  c,
  r,
}));

export const prefById = (id) => PREFECTURES.find((p) => p.id === id);

// The measures the map, ranking and comparison pages can show.
export const MEASURES = {
  pop: { label: 'Population', unit: 'thousand', short: 'k people' },
  density: { label: 'Density', unit: 'people per km²', short: '/km²' },
  area: { label: 'Land area', unit: 'km²', short: 'km²' },
};
