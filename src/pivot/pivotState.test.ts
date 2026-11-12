import { describe, expect, it } from 'vitest';
import { closedVisibleRows, hierarchyId, initialState, nextSort, pivotReducer, type PivotState } from './pivotState';
import { MEMBER_COLUMN, type BranchResult } from './types';

const hierarchy = hierarchyId(['region', 'channel', 'product']);

const result = (...members: string[]): BranchResult => ({
  rows: members.map((member) => ({ member, values: { revenue: 1 } })),
  totals: { revenue: members.length },
});

/** A table with the top level loaded, and optionally more branches. */
function loaded(branches: Record<string, BranchResult> = {}): PivotState {
  const all = { '': result('North', 'South'), ...branches };
  return pivotReducer(initialState(hierarchy), {
    type: 'loaded',
    hierarchy,
    branches: Object.entries(all).map(([key, value]) => ({ key, result: value })),
  });
}

describe('nextSort', () => {
  it('starts numbers with the largest first, then reverses, then clears', () => {
    const first = nextSort(null, 'revenue');
    expect(first).toEqual({ columnId: 'revenue', direction: 'desc' });
    const second = nextSort(first, 'revenue');
    expect(second).toEqual({ columnId: 'revenue', direction: 'asc' });
    expect(nextSort(second, 'revenue')).toBeNull();
  });

  it('starts labels from A to Z', () => {
    expect(nextSort(null, MEMBER_COLUMN)).toEqual({ columnId: MEMBER_COLUMN, direction: 'asc' });
  });

  it('starts over when a different column is chosen', () => {
    expect(nextSort({ columnId: 'revenue', direction: 'asc' }, 'units')).toEqual({ columnId: 'units', direction: 'desc' });
  });
});

describe('pivotReducer', () => {
  it('follows a branch from requested to loaded', () => {
    let state = pivotReducer(initialState(hierarchy), { type: 'requested', hierarchy, keys: [''] });
    expect(state.branches['']).toEqual({ status: 'loading' });

    state = pivotReducer(state, { type: 'loaded', hierarchy, branches: [{ key: '', result: result('North') }] });
    expect(state.branches['']).toMatchObject({ status: 'ready', totals: { revenue: 1 } });
  });

  it('records a failed request against every branch it asked for', () => {
    const state = pivotReducer(loaded(), { type: 'failed', hierarchy, keys: ['North', 'South'], message: 'offline' });
    expect(state.branches['North']).toEqual({ status: 'error', message: 'offline' });
    expect(state.branches['South']).toEqual({ status: 'error', message: 'offline' });
  });

  it('drops an answer that belongs to a hierarchy the user has pivoted away from', () => {
    const state = loaded();
    const stale = pivotReducer(state, {
      type: 'loaded',
      hierarchy: hierarchyId(['product', 'channel', 'region']),
      branches: [{ key: '', result: result('Tent') }],
    });
    expect(stale).toBe(state);
  });

  it('keeps a branch when its row is closed, so reopening needs no request', () => {
    let state = loaded({ North: result('Online') });
    state = pivotReducer(state, { type: 'opened', keys: ['North'] });
    state = pivotReducer(state, { type: 'closed', key: 'North' });
    expect(state.open.has('North')).toBe(false);
    expect(state.branches['North']).toMatchObject({ status: 'ready' });
  });

  it('remembers what was open beneath a row that is closed', () => {
    let state = loaded({ North: result('Online'), 'North/Online': result('Tent') });
    state = pivotReducer(state, { type: 'opened', keys: ['North', 'North/Online'] });
    state = pivotReducer(state, { type: 'closed', key: 'North' });
    expect([...state.open]).toEqual(['North/Online']);
  });

  it('closes everything at once', () => {
    let state = pivotReducer(loaded(), { type: 'opened', keys: ['North', 'South'] });
    state = pivotReducer(state, { type: 'allClosed' });
    expect(state.open.size).toBe(0);
  });

  it('starts an empty table for a new hierarchy but keeps the sort', () => {
    let state = pivotReducer(loaded(), { type: 'opened', keys: ['North'] });
    state = pivotReducer(state, { type: 'sortRequested', columnId: 'revenue' });
    const pivoted = hierarchyId(['product', 'channel', 'region']);
    state = pivotReducer(state, { type: 'hierarchyChanged', hierarchy: pivoted });
    expect(state).toEqual({
      hierarchy: pivoted,
      branches: {},
      open: new Set(),
      sort: { columnId: 'revenue', direction: 'desc' },
    });
  });
});

describe('closedVisibleRows', () => {
  it('finds nothing before the top level has loaded', () => {
    expect(closedVisibleRows(initialState(hierarchy), 3)).toEqual([]);
  });

  it('lists the top-level rows when none is open', () => {
    expect(closedVisibleRows(loaded(), 3)).toEqual([['North'], ['South']]);
  });

  it('steps past open rows to the closed rows beneath them', () => {
    let state = loaded({ North: result('Online', 'Retail') });
    state = pivotReducer(state, { type: 'opened', keys: ['North'] });
    expect(closedVisibleRows(state, 3)).toEqual([['North', 'Online'], ['North', 'Retail'], ['South']]);
  });

  it('never lists rows of the last level, which have nothing beneath them', () => {
    let state = loaded({ North: result('Online'), 'North/Online': result('Tent') });
    state = pivotReducer(state, { type: 'opened', keys: ['North', 'South', 'North/Online'] });
    // South is open but still loading, so there is nothing of it on screen to open.
    expect(closedVisibleRows(state, 3)).toEqual([]);
  });

  it('skips rows hidden inside a closed parent', () => {
    let state = loaded({ North: result('Online') });
    state = pivotReducer(state, { type: 'opened', keys: ['North'] });
    state = pivotReducer(state, { type: 'closed', key: 'North' });
    expect(closedVisibleRows(state, 3)).toEqual([['North'], ['South']]);
  });
});
