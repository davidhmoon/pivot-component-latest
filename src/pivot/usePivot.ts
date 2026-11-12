import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { filtersFor, pathKey, ROOT } from './path';
import { closedVisibleRows, hierarchyId, initialState, pivotReducer, type PivotState } from './pivotState';
import type { DataSource, Path } from './types';

export interface PivotController {
  state: PivotState;
  /** Opens a closed row or closes an open one. */
  toggle(path: Path): void;
  /** Asks again for a branch whose request failed. */
  retry(path: Path): void;
  /** Opens every row that is on screen and closed, with one request. */
  expandLevel(): void;
  collapseAll(): void;
  sortBy(columnId: string): void;
  canExpand: boolean;
  canCollapse: boolean;
}

/**
 * Holds what the table has loaded and which rows are open, and fetches a
 * branch the first time its row is opened.
 *
 * @param source   where branches come from
 * @param levelIds the hierarchy, outermost level first; a new order starts a fresh table
 */
export function usePivot(source: DataSource, levelIds: readonly string[]): PivotController {
  const hierarchy = hierarchyId(levelIds);
  // The caller may pass a new array on every render; the id tells us when the order really changed.
  const ids = useMemo(() => JSON.parse(hierarchy) as string[], [hierarchy]);

  const [stored, dispatch] = useReducer(pivotReducer, hierarchy, initialState);

  // Between a pivot and the effect that restarts loading, `stored` still holds the previous
  // hierarchy's rows. Show an empty table for that one render rather than rows under the wrong headings.
  const state = useMemo(
    () => (stored.hierarchy === hierarchy ? stored : initialState(hierarchy, stored.sort)),
    [stored, hierarchy],
  );

  // One controller per hierarchy. Aborting it cancels everything still in flight for the old one.
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(
    async (paths: readonly Path[]): Promise<void> => {
      const wanted = paths.filter((path) => path.length < ids.length);
      if (wanted.length === 0) return;

      const keys = wanted.map(pathKey);
      const signal = inFlight.current?.signal;
      dispatch({ type: 'requested', hierarchy, keys });

      try {
        const requests = wanted.map((path) => ({
          groupBy: ids[path.length] as string,
          filters: filtersFor(path, ids),
        }));
        const results = await source.fetchBranches(requests, signal);
        if (signal?.aborted) return;
        if (results.length !== wanted.length) {
          throw new Error(`Asked for ${wanted.length} branches and received ${results.length}.`);
        }
        dispatch({
          type: 'loaded',
          hierarchy,
          branches: keys.map((key, index) => ({ key, result: results[index]! })),
        });
      } catch (error) {
        if (signal?.aborted) return;
        const message = error instanceof Error ? error.message : 'The request failed.';
        dispatch({ type: 'failed', hierarchy, keys, message });
      }
    },
    [hierarchy, ids, source],
  );

  useEffect(() => {
    const controller = new AbortController();
    inFlight.current = controller;
    dispatch({ type: 'hierarchyChanged', hierarchy });
    void load([ROOT]);
    return () => controller.abort();
  }, [hierarchy, load]);

  const toggle = (path: Path): void => {
    const key = pathKey(path);
    if (state.open.has(key)) {
      dispatch({ type: 'closed', key });
      return;
    }
    dispatch({ type: 'opened', keys: [key] });
    // A branch that is loading or loaded is reused; only a missing or failed one is fetched.
    const branch = state.branches[key];
    if (!branch || branch.status === 'error') void load([path]);
  };

  const retry = (path: Path): void => {
    void load([path]);
  };

  const closedRows = closedVisibleRows(state, ids.length);

  const expandLevel = (): void => {
    if (closedRows.length === 0) return;
    dispatch({ type: 'opened', keys: closedRows.map(pathKey) });
    const missing = closedRows.filter((path) => {
      const branch = state.branches[pathKey(path)];
      return !branch || branch.status === 'error';
    });
    void load(missing);
  };

  return {
    state,
    toggle,
    retry,
    expandLevel,
    collapseAll: () => dispatch({ type: 'allClosed' }),
    sortBy: (columnId) => dispatch({ type: 'sortRequested', columnId }),
    canExpand: closedRows.length > 0,
    canCollapse: state.open.size > 0,
  };
}
