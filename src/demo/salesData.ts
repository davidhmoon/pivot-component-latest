import type { Column, Level } from '../pivot';
import type { Fact } from './mockSource';

/*
 * Made-up sales for an imaginary outdoor-gear shop. Every name and number in
 * this file is invented, and the figures are generated from a fixed seed so
 * the demo and the tests always see the same data.
 */

export const levels: readonly Level[] = [
  { id: 'region', label: 'Region' },
  { id: 'channel', label: 'Channel' },
  { id: 'category', label: 'Category' },
  { id: 'product', label: 'Product' },
];

export const columns: readonly Column[] = [
  { kind: 'value', id: 'revenue', label: 'Revenue', format: 'currency' },
  { kind: 'value', id: 'revenueLastYear', label: 'Last year', format: 'currency' },
  { kind: 'growth', id: 'growth', label: 'Growth', current: 'revenue', prior: 'revenueLastYear' },
  { kind: 'value', id: 'units', label: 'Units', format: 'integer' },
];

const regions = [
  { name: 'Americas', weight: 1 },
  { name: 'Europe', weight: 0.85 },
  { name: 'Asia Pacific', weight: 0.7 },
  { name: 'Middle East & Africa', weight: 0.3 },
];

/** `priceFactor` is the share of the list price the shop keeps in that channel. */
const channels = [
  { name: 'Online store', weight: 1, priceFactor: 1 },
  { name: 'Retail partners', weight: 0.75, priceFactor: 0.8 },
  { name: 'Wholesale', weight: 0.5, priceFactor: 0.62 },
];

const catalog: ReadonlyArray<{
  category: string;
  products: ReadonlyArray<{ name: string; price: number; popularity: number }>;
}> = [
  {
    category: 'Tents',
    products: [
      { name: 'Ridgeline 2-person', price: 329, popularity: 1 },
      { name: 'Basecamp 4-person', price: 489, popularity: 0.7 },
      { name: 'Featherlite solo', price: 279, popularity: 0.55 },
      { name: 'Stormhold 3-person', price: 419, popularity: 0.6 },
    ],
  },
  {
    category: 'Backpacks',
    products: [
      { name: 'Daytrip 18 L', price: 79, popularity: 1.6 },
      { name: 'Switchback 28 L', price: 139, popularity: 1.2 },
      { name: 'Longhaul 55 L', price: 249, popularity: 0.9 },
      { name: 'Summit 70 L', price: 319, popularity: 0.45 },
    ],
  },
  {
    category: 'Footwear',
    products: [
      { name: 'Scree trail runner', price: 129, popularity: 1.5 },
      { name: 'Granite hiking boot', price: 189, popularity: 1.1 },
      { name: 'Creekside sandal', price: 69, popularity: 1.3 },
      { name: 'Icefall mountaineering boot', price: 349, popularity: 0.3 },
    ],
  },
  {
    category: 'Apparel',
    products: [
      { name: 'Windshell jacket', price: 149, popularity: 1.2 },
      { name: 'Merino base layer', price: 89, popularity: 1.7 },
      { name: 'Trail shorts', price: 59, popularity: 1.4 },
      { name: 'Down parka', price: 279, popularity: 0.6 },
    ],
  },
  {
    category: 'Camp kitchen',
    products: [
      { name: 'Pocket stove', price: 54, popularity: 1.3 },
      { name: 'Nesting cook set', price: 74, popularity: 1 },
      { name: 'Insulated mug', price: 24, popularity: 2.2 },
      { name: 'Water filter', price: 44, popularity: 1.5 },
    ],
  },
];

/** A small seeded random-number generator (mulberry32), so the data never changes between runs. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFacts(): Fact[] {
  const random = seededRandom(20261112);
  const facts: Fact[] = [];

  for (const region of regions) {
    for (const { category, products } of catalog) {
      // Each region and category has its own trend, between 15% down and 30% up on last year.
      const trend = -0.15 + random() * 0.45;
      for (const product of products) {
        for (const channel of channels) {
          const units = Math.round(900 * product.popularity * region.weight * channel.weight * (0.75 + random() * 0.5));
          const revenue = Math.round(units * product.price * channel.priceFactor);
          const change = trend + (random() - 0.5) * 0.16;
          facts.push({
            dims: { region: region.name, channel: channel.name, category, product: product.name },
            values: { revenue, revenueLastYear: Math.round(revenue / (1 + change)), units },
          });
        }
      }
    }
  }

  return facts;
}

export const facts: readonly Fact[] = buildFacts();
