import type { Column, Values } from './types';

/**
 * Relative change from `prior` to `current`: 0.25 means 25% up.
 * Null when there is nothing meaningful to compare against.
 */
export function growth(current: number | undefined, prior: number | undefined): number | null {
  if (current === undefined || prior === undefined) return null;
  if (!Number.isFinite(current) || !Number.isFinite(prior) || prior === 0) return null;
  return (current - prior) / prior;
}

/**
 * The number a column shows for one set of sums.
 *
 * Growth is always derived from the two sums it compares. A total's growth
 * therefore comes from the summed totals, not from averaging the percentages
 * of the rows above it, which would weight a small row the same as a large one.
 */
export function cellValue(column: Column, values: Values): number | null {
  if (column.kind === 'growth') {
    return growth(values[column.current], values[column.prior]);
  }
  const value = values[column.id];
  return value !== undefined && Number.isFinite(value) ? value : null;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

/** What to print when a cell has no value. */
export const EMPTY_CELL = '–';

export function formatCell(column: Column, value: number | null): string {
  if (value === null) return EMPTY_CELL;
  if (column.kind === 'growth') return percent.format(value);
  return column.format === 'currency' ? currency.format(value) : integer.format(value);
}
