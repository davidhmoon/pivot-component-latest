import { describe, expect, it } from 'vitest';
import { sortRows } from './sortRows';
import { MEMBER_COLUMN, type Column, type PivotRow } from './types';

const columns: Column[] = [
  { kind: 'value', id: 'now', label: 'Revenue', format: 'currency' },
  { kind: 'value', id: 'before', label: 'Last year', format: 'currency' },
  { kind: 'growth', id: 'change', label: 'Growth', current: 'now', prior: 'before' },
];

const rows: PivotRow[] = [
  { member: 'Item 10', values: { now: 10, before: 5 } }, // +100%
  { member: 'Item 2', values: { now: 30, before: 40 } }, // -25%
  { member: 'Item 1', values: { now: 20, before: 0 } }, // no growth: nothing to compare against
  { member: 'Item 3', values: {} }, // no numbers at all
];

const members = (sorted: readonly PivotRow[]): string[] => sorted.map((row) => row.member);

describe('sortRows', () => {
  it('leaves the source order alone when no sort is set', () => {
    expect(sortRows(rows, null, columns)).toBe(rows);
  });

  it('sorts by a value, largest first', () => {
    const sorted = sortRows(rows, { columnId: 'now', direction: 'desc' }, columns);
    expect(members(sorted)).toEqual(['Item 2', 'Item 1', 'Item 10', 'Item 3']);
  });

  it('keeps rows without a value last in both directions', () => {
    const sorted = sortRows(rows, { columnId: 'now', direction: 'asc' }, columns);
    expect(members(sorted)).toEqual(['Item 10', 'Item 1', 'Item 2', 'Item 3']);
  });

  it('sorts by a column worked out in the browser', () => {
    const sorted = sortRows(rows, { columnId: 'change', direction: 'desc' }, columns);
    // The two rows without a growth figure keep the order the source sent.
    expect(members(sorted)).toEqual(['Item 10', 'Item 2', 'Item 1', 'Item 3']);
  });

  it('sorts labels the way a person reads them, so 2 comes before 10', () => {
    const ascending = sortRows(rows, { columnId: MEMBER_COLUMN, direction: 'asc' }, columns);
    expect(members(ascending)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 10']);

    const descending = sortRows(rows, { columnId: MEMBER_COLUMN, direction: 'desc' }, columns);
    expect(members(descending)).toEqual(['Item 10', 'Item 3', 'Item 2', 'Item 1']);
  });

  it('ignores a sort on a column that is not shown', () => {
    expect(sortRows(rows, { columnId: 'hidden', direction: 'desc' }, columns)).toBe(rows);
  });

  it('does not change the rows it was given', () => {
    const before = members(rows);
    sortRows(rows, { columnId: 'now', direction: 'desc' }, columns);
    expect(members(rows)).toEqual(before);
  });
});
