import { describe, expect, it, vi } from 'vitest';
import { createMockSource, summarize, type Fact } from './mockSource';
import { facts as salesFacts, levels } from './salesData';

const fact = (region: string, channel: string, revenue: number, units: number): Fact => ({
  dims: { region, channel },
  values: { revenue, units },
});

const facts: Fact[] = [
  fact('North', 'Online', 100, 4),
  fact('North', 'Retail', 50, 2),
  fact('South', 'Online', 30, 1),
  fact('North', 'Online', 20, 1),
];

const instantly = { delay: () => 0 };

describe('summarize', () => {
  it('groups by the requested level and adds up each group', () => {
    expect(summarize(facts, { groupBy: 'region', filters: [] })).toEqual({
      rows: [
        { member: 'North', values: { revenue: 170, units: 7 } },
        { member: 'South', values: { revenue: 30, units: 1 } },
      ],
      totals: { revenue: 200, units: 8 },
    });
  });

  it('keeps only the facts that match every filter', () => {
    const result = summarize(facts, { groupBy: 'channel', filters: [{ level: 'region', member: 'North' }] });
    expect(result.rows).toEqual([
      { member: 'Online', values: { revenue: 120, units: 5 } },
      { member: 'Retail', values: { revenue: 50, units: 2 } },
    ]);
    expect(result.totals).toEqual({ revenue: 170, units: 7 });
  });

  it('returns no rows when nothing matches', () => {
    const result = summarize(facts, { groupBy: 'channel', filters: [{ level: 'region', member: 'East' }] });
    expect(result).toEqual({ rows: [], totals: {} });
  });

  it('refuses a level the data does not have', () => {
    expect(() => summarize(facts, { groupBy: 'colour', filters: [] })).toThrow(/Unknown level/);
  });
});

describe('createMockSource', () => {
  it('answers every branch of a request, in the order asked', async () => {
    const source = createMockSource(facts, instantly);
    const results = await source.fetchBranches([
      { groupBy: 'channel', filters: [{ level: 'region', member: 'South' }] },
      { groupBy: 'region', filters: [] },
    ]);
    expect(results.map((result) => result.rows.map((row) => row.member))).toEqual([['Online'], ['North', 'South']]);
  });

  it('reports each request it receives', async () => {
    const onRequest = vi.fn();
    const source = createMockSource(facts, { ...instantly, onRequest });
    const request = { groupBy: 'region', filters: [] };
    await source.fetchBranches([request]);
    expect(onRequest).toHaveBeenCalledExactlyOnceWith([request]);
  });

  it('fails when told to', async () => {
    const source = createMockSource(facts, { ...instantly, shouldFail: () => true });
    await expect(source.fetchBranches([{ groupBy: 'region', filters: [] }])).rejects.toThrow(/refuse/);
  });

  it('stops when the request is aborted', async () => {
    const controller = new AbortController();
    const source = createMockSource(facts, { delay: () => 10_000 });
    const pending = source.fetchBranches([{ groupBy: 'region', filters: [] }], controller.signal);
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' });
  });
});

describe('the demo data', () => {
  it('has one fact for every combination of its levels', () => {
    expect(salesFacts).toHaveLength(4 * 3 * 5 * 4);
    for (const level of levels) {
      expect(salesFacts.every((entry) => typeof entry.dims[level.id] === 'string')).toBe(true);
    }
  });

  it('is the same on every run', () => {
    const top = summarize(salesFacts, { groupBy: 'region', filters: [] });
    expect(top.rows.map((row) => row.member)).toEqual(['Americas', 'Europe', 'Asia Pacific', 'Middle East & Africa']);
    expect(top.totals).toMatchInlineSnapshot(`
      {
        "revenue": 15370624,
        "revenueLastYear": 14626823,
        "units": 126027,
      }
    `);
  });

  it('adds up: the rows of a level sum to its totals', () => {
    const top = summarize(salesFacts, { groupBy: 'region', filters: [] });
    const revenue = top.rows.reduce((sum, row) => sum + (row.values['revenue'] ?? 0), 0);
    expect(revenue).toBe(top.totals['revenue']);
  });
});
