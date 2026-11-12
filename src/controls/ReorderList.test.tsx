import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ReorderList } from './ReorderList';

const items = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
];

/** jsdom has no DataTransfer, so drag events get a stand-in. */
const dataTransfer = { setData: vi.fn(), effectAllowed: '', dropEffect: '' };

describe('ReorderList', () => {
  it('moves an item with the arrow buttons', async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();
    render(<ReorderList items={items} onReorder={onReorder} />);

    await user.click(screen.getByRole('button', { name: 'Move Gamma up' }));
    expect(onReorder).toHaveBeenLastCalledWith(['a', 'c', 'b']);

    await user.click(screen.getByRole('button', { name: 'Move Alpha down' }));
    expect(onReorder).toHaveBeenLastCalledWith(['b', 'a', 'c']);
  });

  it('does not offer to move the first item up or the last item down', () => {
    render(<ReorderList items={items} onReorder={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Move Alpha up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move Gamma down' })).toBeDisabled();
  });

  it('moves an item to where it is dropped', () => {
    const onReorder = vi.fn();
    render(<ReorderList items={items} onReorder={onReorder} />);
    const [alpha, , gamma] = screen.getAllByRole('listitem');
    if (!alpha || !gamma) throw new Error('The list is missing items.');

    fireEvent.dragStart(alpha, { dataTransfer });
    fireEvent.dragOver(gamma, { dataTransfer });
    fireEvent.drop(gamma, { dataTransfer });

    expect(onReorder).toHaveBeenCalledExactlyOnceWith(['b', 'c', 'a']);
  });

  it('has no checkboxes unless it is told what is hidden', () => {
    render(<ReorderList items={items} onReorder={vi.fn()} />);
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('switches an item on or off', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ReorderList items={items} onReorder={vi.fn()} hidden={new Set(['b'])} onToggle={onToggle} />);

    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Beta' })).not.toBeChecked();

    await user.click(screen.getByRole('checkbox', { name: 'Beta' }));
    expect(onToggle).toHaveBeenCalledExactlyOnceWith('b');
  });

  it('will not switch off the last item that is still on', () => {
    render(<ReorderList items={items} onReorder={vi.fn()} hidden={new Set(['a', 'b'])} onToggle={vi.fn()} />);
    expect(screen.getByRole('checkbox', { name: 'Gamma' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Alpha' })).toBeEnabled();
  });
});
