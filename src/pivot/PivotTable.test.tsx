import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { summarize, type Fact } from '../demo/mockSource';
import { PivotTable } from './PivotTable';
import type { BranchRequest, BranchResult, Column, DataSource, Level } from './types';

const levels: Level[] = [
  { id: 'region', label: 'Region' },
  { id: 'channel', label: 'Channel' },
  { id: 'product', label: 'Product' },
];

const columns: Column[] = [
  { kind: 'value', id: 'revenue', label: 'Revenue', format: 'currency' },
  { kind: 'value', id: 'before', label: 'Last year', format: 'currency' },
  { kind: 'growth', id: 'growth', label: 'Growth', current: 'revenue', prior: 'before' },
];

const fact = (region: string, channel: string, product: string, revenue: number, before: number): Fact => ({
  dims: { region, channel, product },
  values: { revenue, before },
});

// North: 450 now (Online 400, Retail 50). South: 520 now (Online 500, Retail 20). Total: 970 now, 810 before.
const facts: Fact[] = [
  fact('North', 'Online', 'Tent', 300, 200),
  fact('North', 'Online', 'Stove', 100, 100),
  fact('North', 'Retail', 'Tent', 50, 100),
  fact('South', 'Online', 'Tent', 500, 400),
  fact('South', 'Retail', 'Stove', 20, 10),
];

const answer = (requests: readonly BranchRequest[]): BranchResult[] =>
  requests.map((request) => summarize(facts, request));

/** A source that answers at once and records what it was asked. */
function instantSource() {
  const fetchBranches = vi.fn<DataSource['fetchBranches']>(async (requests) => answer(requests));
  return { fetchBranches };
}

function renderTable(source: DataSource, overrides: { levels?: Level[]; columns?: Column[] } = {}) {
  const user = userEvent.setup();
  const view = render(
    <PivotTable
      source={source}
      levels={overrides.levels ?? levels}
      columns={overrides.columns ?? columns}
      caption="Test sales"
    />,
  );
  return { user, ...view };
}

/** The row labels in the order they appear on screen, without the totals line. */
function rowLabels(): string[] {
  const body = screen.getByRole('table').querySelector('tbody');
  if (!body) throw new Error('The table has no body.');
  return within(body)
    .getAllByRole('rowheader')
    .map((cell) => cell.textContent ?? '');
}

const open = (name: string) => screen.findByRole('button', { name, expanded: false });

describe('PivotTable', () => {
  it('loads only the top level at first', async () => {
    const source = instantSource();
    renderTable(source);

    expect(await open('North')).toBeInTheDocument();
    expect(rowLabels()).toEqual(['North', 'South']);
    expect(source.fetchBranches).toHaveBeenCalledTimes(1);
    expect(source.fetchBranches.mock.calls[0]?.[0]).toEqual([{ groupBy: 'region', filters: [] }]);
  });

  it("asks for a row's children, filtered by its ancestors, when the row is opened", async () => {
    const source = instantSource();
    const { user } = renderTable(source);

    await user.click(await open('North'));
    await user.click(await open('Online'));
    expect(await screen.findByText('Stove')).toBeInTheDocument();

    expect(rowLabels()).toEqual(['North', 'Online', 'Tent', 'Stove', 'Retail', 'South']);
    expect(source.fetchBranches.mock.calls.map(([requests]) => requests)).toEqual([
      [{ groupBy: 'region', filters: [] }],
      [{ groupBy: 'channel', filters: [{ level: 'region', member: 'North' }] }],
      [
        {
          groupBy: 'product',
          filters: [
            { level: 'region', member: 'North' },
            { level: 'channel', member: 'Online' },
          ],
        },
      ],
    ]);
  });

  it('does not offer to open rows of the last level', async () => {
    const { user } = renderTable(instantSource());

    await user.click(await open('North'));
    await user.click(await open('Online'));
    await screen.findByText('Tent');

    expect(screen.queryByRole('button', { name: 'Tent' })).not.toBeInTheDocument();
  });

  it('keeps what it has loaded: closing and reopening a row sends no new request', async () => {
    const source = instantSource();
    const { user } = renderTable(source);

    await user.click(await open('North'));
    await user.click(await open('Online'));
    await screen.findByText('Stove');

    await user.click(screen.getByRole('button', { name: 'North', expanded: true }));
    expect(rowLabels()).toEqual(['North', 'South']);

    await user.click(screen.getByRole('button', { name: 'North', expanded: false }));
    // The branch beneath North comes back as it was, with Online still open.
    expect(rowLabels()).toEqual(['North', 'Online', 'Tent', 'Stove', 'Retail', 'South']);
    expect(source.fetchBranches).toHaveBeenCalledTimes(3);
  });

  it('sorts each group of siblings on its own', async () => {
    const { user } = renderTable(instantSource());

    await user.click(await open('North'));
    await user.click(await open('South'));
    await screen.findAllByText('Retail');

    await user.click(screen.getByRole('button', { name: /Revenue/ }));
    expect(rowLabels()).toEqual(['South', 'Online', 'Retail', 'North', 'Online', 'Retail']);
    expect(screen.getByRole('columnheader', { name: /Revenue/ })).toHaveAttribute('aria-sort', 'descending');

    await user.click(screen.getByRole('button', { name: /Revenue/ }));
    expect(rowLabels()).toEqual(['North', 'Retail', 'Online', 'South', 'Retail', 'Online']);

    await user.click(screen.getByRole('button', { name: /Revenue/ }));
    expect(rowLabels()).toEqual(['North', 'Online', 'Retail', 'South', 'Online', 'Retail']);
    expect(screen.getByRole('columnheader', { name: /Revenue/ })).toHaveAttribute('aria-sort', 'none');
  });

  it('shows the totals the source sent, with growth worked out from the sums', async () => {
    renderTable(instantSource());
    await open('North');

    const total = screen.getByRole('rowheader', { name: 'Total' }).closest('tr');
    if (!total) throw new Error('The totals line is missing.');
    const cells = within(total)
      .getAllByRole('cell')
      .map((cell) => cell.textContent);
    // (970 - 810) / 810 = 19.8%. Averaging the two regions' own percentages would give 15.0%.
    expect(cells).toEqual(['$970', '$810', '▲ +19.8%']);
  });

  it('shows only the columns it is given, in the order given', async () => {
    const [revenue, , growth] = columns;
    renderTable(instantSource(), { columns: [growth!, revenue!] });
    await open('North');

    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);
    expect(headers).toEqual(['Region › Channel › Product↕', 'Growth↕', 'Revenue↕']);
  });

  it('opens every closed row with one request, and can be repeated safely', async () => {
    const source = instantSource();
    const { user } = renderTable(source);
    await open('North');
    const expand = screen.getByRole('button', { name: 'Expand a level' });

    await user.click(expand);
    await screen.findAllByText('Retail');
    expect(source.fetchBranches).toHaveBeenCalledTimes(2);
    expect(source.fetchBranches.mock.calls[1]?.[0]).toHaveLength(2); // one request for both regions

    await user.click(expand);
    await screen.findAllByText('Stove');
    expect(source.fetchBranches).toHaveBeenCalledTimes(3);
    expect(source.fetchBranches.mock.calls[2]?.[0]).toHaveLength(4); // one request for all four channels
    expect(rowLabels()).toHaveLength(11);

    // Everything is open now, so there is nothing left to expand.
    expect(expand).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Collapse all' }));
    expect(rowLabels()).toEqual(['North', 'South']);

    // Opening again reuses what was loaded.
    await user.click(expand);
    await user.click(expand);
    expect(rowLabels()).toHaveLength(11);
    expect(source.fetchBranches).toHaveBeenCalledTimes(3);
  });

  it('shows the failure in place and recovers when asked to try again', async () => {
    const source = instantSource();
    const { user } = renderTable(source);
    await open('North');

    source.fetchBranches.mockRejectedValueOnce(new Error('The server is down.'));
    await user.click(screen.getByRole('button', { name: 'North' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t load these rows. The server is down.');
    expect(rowLabels()).toEqual(['North', 'South']); // the rest of the table is untouched

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await open('Online')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('starts again from the top when the hierarchy is reordered', async () => {
    const source = instantSource();
    const { user, rerender } = renderTable(source);
    await user.click(await open('North'));
    await open('Online');

    const pivoted = [...levels].reverse();
    rerender(<PivotTable source={source} levels={pivoted} columns={columns} caption="Test sales" />);

    expect(await open('Tent')).toBeInTheDocument();
    expect(rowLabels()).toEqual(['Tent', 'Stove']);
    expect(source.fetchBranches.mock.lastCall?.[0]).toEqual([{ groupBy: 'product', filters: [] }]);
  });

  it('ignores an answer that arrives after the hierarchy has changed', async () => {
    let releaseFirst: (results: BranchResult[]) => void = () => {};
    const source = instantSource();
    source.fetchBranches.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          releaseFirst = resolve;
        }),
    );

    const { rerender } = renderTable(source);
    rerender(<PivotTable source={source} levels={[...levels].reverse()} columns={columns} caption="Test sales" />);
    expect(await open('Tent')).toBeInTheDocument();

    // The slow answer for the old hierarchy finally arrives.
    releaseFirst(answer([{ groupBy: 'region', filters: [] }]));
    await Promise.resolve();

    expect(rowLabels()).toEqual(['Tent', 'Stove']);
    expect(screen.queryByRole('button', { name: 'North' })).not.toBeInTheDocument();
  });
});
