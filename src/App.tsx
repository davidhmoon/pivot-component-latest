import { useMemo, useRef, useState } from 'react';
import { Popover } from './controls/Popover';
import { ReorderList } from './controls/ReorderList';
import { createMockSource } from './demo/mockSource';
import { columns as allColumns, facts, levels as allLevels } from './demo/salesData';
import { PivotTable, type BranchRequest } from './pivot';

const REPOSITORY_URL = 'https://github.com/davidhmoon/pivot-component-latest';
const LOG_LENGTH = 8;

interface LogEntry {
  id: number;
  /** One line per branch the request asked for. */
  branches: string[];
  failed: boolean;
}

export function App() {
  const [levelOrder, setLevelOrder] = useState(() => allLevels.map((level) => level.id));
  const [columnOrder, setColumnOrder] = useState(() => allColumns.map((column) => column.id));
  const [hiddenColumns, setHiddenColumns] = useState<ReadonlySet<string>>(() => new Set());
  const [failNext, setFailNext] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  // The source is created once, so it reads the latest "fail next" choice through a ref.
  const failNextRef = useRef(false);
  const nextLogId = useRef(1);

  const source = useMemo(
    () =>
      createMockSource(facts, {
        onRequest: (requests) => {
          const failed = failNextRef.current;
          const entry: LogEntry = { id: nextLogId.current++, branches: requests.map(describeRequest), failed };
          setRequestCount((count) => count + 1);
          setLog((entries) => [entry, ...entries].slice(0, LOG_LENGTH));
        },
        shouldFail: () => {
          if (!failNextRef.current) return false;
          failNextRef.current = false;
          setFailNext(false);
          return true;
        },
      }),
    [],
  );

  const levels = levelOrder.flatMap((id) => allLevels.filter((level) => level.id === id));
  const orderedColumns = columnOrder.flatMap((id) => allColumns.filter((column) => column.id === id));
  const visibleColumns = orderedColumns.filter((column) => !hiddenColumns.has(column.id));

  const toggleColumn = (id: string): void => {
    setHiddenColumns((hidden) => {
      const next = new Set(hidden);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page">
      <header className="page__header">
        <h1>Drill-down pivot table</h1>
        <p>
          One recursive component draws every level. A level is requested only when you open a row, and the browser
          keeps what it has already loaded. Reorder the hierarchy to pivot the same data another way.
        </p>
      </header>

      <main>
        <PivotTable
          source={source}
          levels={levels}
          columns={visibleColumns}
          caption="Sales by region, channel, category and product (made-up data)"
          toolbar={
            <>
              <Popover label="Hierarchy">
                <p className="popover__hint">Drag, or use the arrows, to change the order of the levels.</p>
                <ReorderList items={levels} onReorder={setLevelOrder} />
              </Popover>
              <Popover label="Columns">
                <p className="popover__hint">Tick to show a column. Drag, or use the arrows, to reorder.</p>
                <ReorderList
                  items={orderedColumns}
                  onReorder={setColumnOrder}
                  hidden={hiddenColumns}
                  onToggle={toggleColumn}
                />
              </Popover>
            </>
          }
        />

        <section className="requests" aria-labelledby="requests-title">
          <div className="requests__header">
            <h2 id="requests-title">What the table has asked for</h2>
            <span className="requests__count">
              {requestCount} {requestCount === 1 ? 'request' : 'requests'}
            </span>
            <label className="requests__fail">
              <input
                type="checkbox"
                checked={failNext}
                onChange={(event) => {
                  failNextRef.current = event.target.checked;
                  setFailNext(event.target.checked);
                }}
              />
              Make the next request fail
            </label>
          </div>
          {log.length === 0 ? (
            <p className="requests__empty">Nothing yet.</p>
          ) : (
            <ol className="requests__list">
              {log.map((entry) => (
                <li key={entry.id} className={entry.failed ? 'requests__entry requests__entry--failed' : 'requests__entry'}>
                  <span className="requests__id">#{entry.id}</span>
                  <span>
                    {entry.branches[0]}
                    {entry.branches.length > 1 && ` and ${entry.branches.length - 1} more, in one request`}
                    {entry.failed && ' (failed on purpose)'}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>

      <footer className="page__footer">
        <p>
          All names and numbers are made up. <a href={REPOSITORY_URL}>Source code on GitHub</a>
        </p>
      </footer>
    </div>
  );
}

function labelOf(levelId: string): string {
  return allLevels.find((level) => level.id === levelId)?.label ?? levelId;
}

/** "Category in Europe › Wholesale", or just "Region" for the top level. */
function describeRequest(request: BranchRequest): string {
  const where = request.filters.map((filter) => filter.member).join(' › ');
  return where ? `${labelOf(request.groupBy)} in ${where}` : labelOf(request.groupBy);
}
