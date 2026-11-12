import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';

// The demo's pretend server waits a random moment before answering. Pin it to its shortest wait.
beforeEach(() => {
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const headers = (): (string | null)[] => screen.getAllByRole('columnheader').map((header) => header.textContent);

describe('the demo page', () => {
  it('shows the four regions and logs the one request that fetched them', async () => {
    render(<App />);

    expect(await screen.findByRole('button', { name: 'Americas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Middle East & Africa' })).toBeInTheDocument();

    const log = screen.getByRole('region', { name: 'What the table has asked for' });
    expect(within(log).getByText('1 request')).toBeInTheDocument();
    expect(within(log).getByText('Region')).toBeInTheDocument();
  });

  it('hides a column from the Columns menu', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'Americas' });
    expect(headers()).toHaveLength(5);

    await user.click(screen.getByRole('button', { name: /Columns/ }));
    await user.click(screen.getByRole('checkbox', { name: 'Units' }));

    expect(headers()).toHaveLength(4);
    expect(screen.queryByRole('columnheader', { name: /Units/ })).not.toBeInTheDocument();
  });

  it('pivots when the hierarchy is reordered', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'Americas' });

    await user.click(screen.getByRole('button', { name: /Hierarchy/ }));
    await user.click(screen.getByRole('button', { name: 'Move Channel up' }));

    expect(await screen.findByRole('button', { name: 'Online store' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Americas' })).not.toBeInTheDocument();
    expect(headers()[0]).toContain('Channel › Region › Category › Product');
  });

  it('can make a request fail, and the table recovers', async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole('button', { name: 'Europe' });

    await user.click(screen.getByRole('checkbox', { name: 'Make the next request fail' }));
    await user.click(screen.getByRole('button', { name: 'Europe' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Couldn’t load these rows.');
    expect(screen.getByRole('checkbox', { name: 'Make the next request fail' })).not.toBeChecked();

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('button', { name: 'Wholesale' })).toBeInTheDocument();
  });
});
