import { pathKey, ROOT } from './path';
import { MEMBER_COLUMN, type BranchResult, type Path, type PivotRow, type Sort, type Values } from './types';

/** The rows under one parent, or the state of the request for them. */
export type Branch =
  | { status: 'loading' }
  | { status: 'ready'; rows: readonly PivotRow[]; totals: Values }
  | { status: 'error'; message: string };

export interface PivotState {
  /** Identifies the hierarchy this cache belongs to. See `hierarchyId`. */
  hierarchy: string;
  /** Every branch fetched so far, by path key. Closing a row keeps its branch. */
  branches: Readonly<Record<string, Branch>>;
  /** Path keys of the rows that are open. */
  open: ReadonlySet<string>;
  sort: Sort | null;
}

export type PivotAction =
  | { type: 'hierarchyChanged'; hierarchy: string }
  | { type: 'requested'; hierarchy: string; keys: readonly string[] }
  | { type: 'loaded'; hierarchy: string; branches: ReadonlyArray<{ key: string; result: BranchResult }> }
  | { type: 'failed'; hierarchy: string; keys: readonly string[]; message: string }
  | { type: 'opened'; keys: readonly string[] }
  | { type: 'closed'; key: string }
  | { type: 'allClosed' }
  | { type: 'sortRequested'; columnId: string };

/** One string per ordering of the levels. A different order is a different table. */
export function hierarchyId(levelIds: readonly string[]): string {
  return JSON.stringify(levelIds);
}

export function initialState(hierarchy: string, sort: Sort | null = null): PivotState {
  return { hierarchy, branches: {}, open: new Set(), sort };
}

/**
 * What a click on a column header does: numbers start with the largest first,
 * labels start A to Z, a second click reverses, a third returns to source order.
 */
export function nextSort(current: Sort | null, columnId: string): Sort | null {
  const first = columnId === MEMBER_COLUMN ? 'asc' : 'desc';
  if (!current || current.columnId !== columnId) return { columnId, direction: first };
  if (current.direction === first) return { columnId, direction: first === 'asc' ? 'desc' : 'asc' };
  return null;
}

export function pivotReducer(state: PivotState, action: PivotAction): PivotState {
  switch (action.type) {
    case 'hierarchyChanged':
      return initialState(action.hierarchy, state.sort);

    case 'requested': {
      if (action.hierarchy !== state.hierarchy) return state;
      const branches = { ...state.branches };
      for (const key of action.keys) branches[key] = { status: 'loading' };
      return { ...state, branches };
    }

    case 'loaded': {
      // An answer for a hierarchy the user has already pivoted away from is dropped.
      if (action.hierarchy !== state.hierarchy) return state;
      const branches = { ...state.branches };
      for (const { key, result } of action.branches) {
        branches[key] = { status: 'ready', rows: result.rows, totals: result.totals };
      }
      return { ...state, branches };
    }

    case 'failed': {
      if (action.hierarchy !== state.hierarchy) return state;
      const branches = { ...state.branches };
      for (const key of action.keys) branches[key] = { status: 'error', message: action.message };
      return { ...state, branches };
    }

    case 'opened': {
      const open = new Set(state.open);
      for (const key of action.keys) open.add(key);
      return { ...state, open };
    }

    case 'closed': {
      if (!state.open.has(action.key)) return state;
      // Only this row closes. Rows open beneath it stay marked, so reopening
      // the row brings its subtree back exactly as it was.
      const open = new Set(state.open);
      open.delete(action.key);
      return { ...state, open };
    }

    case 'allClosed':
      return state.open.size === 0 ? state : { ...state, open: new Set() };

    case 'sortRequested':
      return { ...state, sort: nextSort(state.sort, action.columnId) };
  }
}

/**
 * The rows that are on screen, closed, and able to open. Opening exactly these
 * is what "expand a level" means, which makes it safe to repeat: rows that are
 * already open are left alone.
 */
export function closedVisibleRows(state: PivotState, levelCount: number): Path[] {
  const found: Path[] = [];

  const walk = (path: Path): void => {
    // Rows of this branch sit at depth `path.length`; the last level cannot open.
    if (path.length >= levelCount - 1) return;
    const branch = state.branches[pathKey(path)];
    if (!branch || branch.status !== 'ready') return;
    for (const row of branch.rows) {
      const rowPath = [...path, row.member];
      if (state.open.has(pathKey(rowPath))) walk(rowPath);
      else found.push(rowPath);
    }
  };

  walk(ROOT);
  return found;
}
