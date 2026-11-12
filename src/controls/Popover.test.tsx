import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Popover } from './Popover';

function renderPopover() {
  const user = userEvent.setup();
  render(
    <>
      <Popover label="Columns">
        <button type="button">Inside</button>
      </Popover>
      <button type="button">Outside</button>
    </>,
  );
  return { user, trigger: screen.getByRole('button', { name: /Columns/ }) };
}

describe('Popover', () => {
  it('opens and closes from its button', async () => {
    const { user, trigger } = renderPopover();
    expect(screen.queryByRole('group', { name: 'Columns' })).not.toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByRole('group', { name: 'Columns' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(screen.queryByRole('group', { name: 'Columns' })).not.toBeInTheDocument();
  });

  it('stays open while you work inside it', async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Inside' }));
    expect(screen.getByRole('group', { name: 'Columns' })).toBeInTheDocument();
  });

  it('closes on a press outside', async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('group', { name: 'Columns' })).not.toBeInTheDocument();
  });

  it('closes on Escape and hands focus back to its button', async () => {
    const { user, trigger } = renderPopover();
    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Inside' }));

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('group', { name: 'Columns' })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
