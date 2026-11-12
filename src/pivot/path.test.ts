import { describe, expect, it } from 'vitest';
import { filtersFor, pathKey, ROOT } from './path';

describe('pathKey', () => {
  it('is empty for the top level', () => {
    expect(pathKey(ROOT)).toBe('');
  });

  it('joins the members from the top level down', () => {
    expect(pathKey(['Europe', 'Wholesale'])).toBe('Europe/Wholesale');
  });

  it('keeps members that contain the separator apart', () => {
    expect(pathKey(['A/B', 'C'])).not.toBe(pathKey(['A', 'B/C']));
    expect(pathKey(['A/B'])).not.toBe(pathKey(['A', 'B']));
  });
});

describe('filtersFor', () => {
  const levels = ['region', 'channel', 'product'];

  it('needs no filters for the top level', () => {
    expect(filtersFor(ROOT, levels)).toEqual([]);
  });

  it('pairs each ancestor with its level, outermost first', () => {
    expect(filtersFor(['Europe', 'Wholesale'], levels)).toEqual([
      { level: 'region', member: 'Europe' },
      { level: 'channel', member: 'Wholesale' },
    ]);
  });

  it('rejects a path that is deeper than the hierarchy', () => {
    expect(() => filtersFor(['a', 'b', 'c', 'd'], levels)).toThrow(/deeper than the hierarchy/);
  });
});
