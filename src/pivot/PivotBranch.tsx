import { Fragment, type CSSProperties } from 'react';
import { cellValue, formatCell } from './measures';
import { pathKey } from './path';
import type { PivotState } from './pivotState';
import { sortRows } from './sortRows';
import type { Column, Level, Path, Values } from './types';

/** Everything a branch needs to draw itself and its descendants. */
export interface PivotView {
  state: PivotState;
  levels: readonly Level[];
  columns: readonly Column[];
  toggle(path: Path): void;
  retry(path: Path): void;
}

interface PivotBranchProps {
  /** The parent row's path. Empty for the top level. */
  path: Path;
  view: PivotView;
}

/**
 * The rows under one parent. An open row renders another PivotBranch for its
 * own path, so this one component draws every level, however deep the
 * hierarchy is configured to go.
 */
export function PivotBranch({ path, view }: PivotBranchProps) {
  const { state, levels, columns } = view;
  const depth = path.length;
  const branch = state.branches[pathKey(path)];
  if (!branch || depth >= levels.length) return null;

  const span = columns.length + 1;
  const indent = indentFor(depth);

  if (branch.status === 'loading') {
    return (
      <tr className="pivot__note">
        <td colSpan={span} style={indent}>
          <span className="pivot__spinner" aria-hidden="true" />
          Loading…
        </td>
      </tr>
    );
  }

  if (branch.status === 'error') {
    return (
      <tr className="pivot__note pivot__note--error">
        <td colSpan={span} style={indent}>
          <span role="alert">Couldn’t load these rows. {branch.message}</span>
          <button type="button" className="pivot__retry" onClick={() => view.retry(path)}>
            Try again
          </button>
        </td>
      </tr>
    );
  }

  if (branch.rows.length === 0) {
    return (
      <tr className="pivot__note">
        <td colSpan={span} style={indent}>
          No rows.
        </td>
      </tr>
    );
  }

  const canOpen = depth < levels.length - 1;

  return (
    <>
      {sortRows(branch.rows, state.sort, columns).map((row) => {
        const rowPath = [...path, row.member];
        const key = pathKey(rowPath);
        const isOpen = canOpen && state.open.has(key);
        return (
          <Fragment key={key}>
            <tr className="pivot__row" data-depth={depth}>
              <th scope="row" style={indent}>
                {canOpen ? (
                  <button
                    type="button"
                    className="pivot__toggle"
                    aria-expanded={isOpen}
                    onClick={() => view.toggle(rowPath)}
                  >
                    <Chevron />
                    <span>{row.member}</span>
                  </button>
                ) : (
                  <span className="pivot__leaf">{row.member}</span>
                )}
              </th>
              <ValueCells columns={columns} values={row.values} />
            </tr>
            {isOpen && <PivotBranch path={rowPath} view={view} />}
          </Fragment>
        );
      })}
    </>
  );
}

/** One cell per visible column. Shared by rows and the totals line. */
export function ValueCells({ columns, values }: { columns: readonly Column[]; values: Values | null }) {
  return (
    <>
      {columns.map((column) => {
        const value = values ? cellValue(column, values) : null;
        const text = formatCell(column, value);
        if (column.kind === 'growth' && value !== null && value !== 0) {
          const direction = value > 0 ? 'up' : 'down';
          return (
            <td key={column.id} className={`pivot__number pivot__growth pivot__growth--${direction}`}>
              <span aria-hidden="true">{value > 0 ? '▲' : '▼'}</span> {text}
            </td>
          );
        }
        return (
          <td key={column.id} className="pivot__number">
            {text}
          </td>
        );
      })}
    </>
  );
}

function indentFor(depth: number): CSSProperties {
  return { '--pivot-depth': depth } as CSSProperties;
}

function Chevron() {
  return (
    <svg className="pivot__chevron" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
