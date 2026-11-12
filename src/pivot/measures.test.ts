import { describe, expect, it } from 'vitest';
import { cellValue, EMPTY_CELL, formatCell, growth } from './measures';
import type { GrowthColumn, ValueColumn } from './types';

const revenue: ValueColumn = { kind: 'value', id: 'now', label: 'Revenue', format: 'currency' };
const units: ValueColumn = { kind: 'value', id: 'units', label: 'Units', format: 'integer' };
const change: GrowthColumn = { kind: 'growth', id: 'change', label: 'Growth', current: 'now', prior: 'before' };

describe('growth', () => {
  it('is the change relative to the earlier figure', () => {
    expect(growth(125, 100)).toBeCloseTo(0.25);
    expect(growth(80, 100)).toBeCloseTo(-0.2);
    expect(growth(100, 100)).toBe(0);
  });

  it('is null when there is nothing to compare against', () => {
    expect(growth(50, 0)).toBeNull();
    expect(growth(undefined, 10)).toBeNull();
    expect(growth(10, undefined)).toBeNull();
    expect(growth(Number.NaN, 10)).toBeNull();
  });
});

describe('cellValue', () => {
  it('reads a value column straight from the sums', () => {
    expect(cellValue(revenue, { now: 42 })).toBe(42);
  });

  it('is null when the sums have no such value', () => {
    expect(cellValue(revenue, {})).toBeNull();
  });

  it("works out a total's growth from the summed totals, not from its rows' percentages", () => {
    const small = { now: 20, before: 10 }; // doubled
    const large = { now: 900, before: 1000 }; // down a tenth
    const totals = { now: small.now + large.now, before: small.before + large.before };

    const averageOfRows = ((cellValue(change, small) ?? 0) + (cellValue(change, large) ?? 0)) / 2;
    expect(averageOfRows).toBeCloseTo(0.45); // would claim the business grew 45%

    expect(cellValue(change, totals)).toBeCloseTo(-90 / 1010); // it shrank by about 9%
  });
});

describe('formatCell', () => {
  it('prints money without cents', () => {
    expect(formatCell(revenue, 1234.56)).toBe('$1,235');
  });

  it('prints counts with thousands separators', () => {
    expect(formatCell(units, 12345)).toBe('12,345');
  });

  it('prints growth as a signed percentage', () => {
    expect(formatCell(change, 0.1234)).toBe('+12.3%');
    expect(formatCell(change, -0.04)).toBe('-4.0%');
    expect(formatCell(change, 0)).toBe('0.0%');
  });

  it('prints a dash for a missing value', () => {
    expect(formatCell(revenue, null)).toBe(EMPTY_CELL);
    expect(formatCell(change, null)).toBe(EMPTY_CELL);
  });
});
