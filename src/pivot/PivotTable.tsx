import type { ReactNode } from 'react';
import { ROOT, pathKey } from './path';
import { PivotBranch, ValueCells, type PivotView } from './PivotBranch';
import { MEMBER_COLUMN, type Column, type DataSource, type Level, type Sort } from './types';
import { usePivot } from './usePivot';
import './pivot.css';

export interface PivotTableProps {
  /** Where rows come from. */
  source: DataSource;
  /** The hierarchy, outermost level first. Pass a different order to pivot. */
  levels: readonly Level[];
  /** The columns to show, in display order. */
  columns: readonly Column[];
  /** The table's name, read out by screen readers. */
  caption: string;
  /** Extra toolbar controls, such as menus that change `levels` and `columns`. */
  toolbar?: ReactNode;
}

/**
 * A drill-down pivot table. It knows nothing about the data beyond the levels
 * and columns it is given: each row asks the source for its children the first
 * time it is opened, filtered by the row's ancestors.
 */
export function PivotTable({ source, levels, columns, caption, toolbar }: PivotTableProps) {
  const pivot = usePivot(
    source,
    levels.map((level) => level.id),
  );
  const { state } = pivot;

  const view: PivotView = { state, levels, columns, toggle: pivot.toggle, retry: pivot.retry };
  const root = state.branches[pathKey(ROOT)];
  const isBusy = Object.values(state.branches).some((branch) => branch.status === 'loading');

  return (
    <div className="pivot">
      <div className="pivot__toolbar">
        {toolbar}
        <button type="button" className="pivot__button" onClick={pivot.expandLevel} disabled={!pivot.canExpand}>
          Expand a level
        </button>
        <button type="button" className="pivot__button" onClick={pivot.collapseAll} disabled={!pivot.canCollapse}>
          Collapse all
        </button>
      </div>

      <div className="pivot__scroll">
        <table className="pivot__table" aria-busy={isBusy}>
          <caption className="pivot__caption">{caption}</caption>
          <thead>
            <tr>
              <SortableHeader
                columnId={MEMBER_COLUMN}
                label={levels.map((level) => level.label).join(' › ')}
                sort={state.sort}
                onSort={pivot.sortBy}
              />
              {columns.map((column) => (
                <SortableHeader
                  key={column.id}
                  columnId={column.id}
                  label={column.label}
                  sort={state.sort}
                  onSort={pivot.sortBy}
                  numeric
                />
              ))}
            </tr>
          </thead>
          <tbody>
            <PivotBranch path={ROOT} view={view} />
          </tbody>
          <tfoot>
            <tr className="pivot__total">
              <th scope="row">Total</th>
              <ValueCells columns={columns} values={root?.status === 'ready' ? root.totals : null} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

interface SortableHeaderProps {
  columnId: string;
  label: string;
  sort: Sort | null;
  onSort(columnId: string): void;
  numeric?: boolean;
}

function SortableHeader({ columnId, label, sort, onSort, numeric = false }: SortableHeaderProps) {
  const direction = sort?.columnId === columnId ? sort.direction : null;
  return (
    <th
      scope="col"
      className={numeric ? 'pivot__number' : undefined}
      aria-sort={direction === null ? 'none' : direction === 'asc' ? 'ascending' : 'descending'}
    >
      <button type="button" className="pivot__sort" onClick={() => onSort(columnId)}>
        <span>{label}</span>
        <span className="pivot__sort-mark" aria-hidden="true">
          {direction === null ? '↕' : direction === 'asc' ? '↑' : '↓'}
        </span>
      </button>
    </th>
  );
}
