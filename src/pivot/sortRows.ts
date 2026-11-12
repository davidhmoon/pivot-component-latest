import { cellValue } from './measures';
import { MEMBER_COLUMN, type Column, type PivotRow, type Sort } from './types';

const byLabel = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/**
 * Sorts one group of siblings. Every branch is sorted on its own, so a row
 * never leaves its parent. Rows without a value go last in both directions,
 * and ties keep the order the source sent.
 */
export function sortRows(
  rows: readonly PivotRow[],
  sort: Sort | null,
  columns: readonly Column[],
): readonly PivotRow[] {
  if (!sort) return rows;
  const sign = sort.direction === 'asc' ? 1 : -1;

  if (sort.columnId === MEMBER_COLUMN) {
    return [...rows].sort((a, b) => sign * byLabel.compare(a.member, b.member));
  }

  const column = columns.find((candidate) => candidate.id === sort.columnId);
  if (!column) return rows;

  return [...rows].sort((a, b) => {
    const x = cellValue(column, a.values);
    const y = cellValue(column, b.values);
    if (x === null || y === null) {
      if (x === y) return 0;
      return x === null ? 1 : -1;
    }
    return sign * (x - y);
  });
}
