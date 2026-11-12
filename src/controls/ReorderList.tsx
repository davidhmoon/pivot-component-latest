import { useState } from 'react';
import { moveBy, moveOnto } from './reorder';

export interface ReorderItem {
  id: string;
  label: string;
}

interface ReorderListProps {
  /** The items in their current order. */
  items: readonly ReorderItem[];
  onReorder(ids: string[]): void;
  /** Ids that are switched off. Pass it, with `onToggle`, to give every item a checkbox. */
  hidden?: ReadonlySet<string>;
  onToggle?(id: string): void;
}

/**
 * A list you can reorder by dragging, or with the arrow buttons from the
 * keyboard. With `hidden` and `onToggle` it also switches items on and off.
 */
export function ReorderList({ items, onReorder, hidden, onToggle }: ReorderListProps) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const ids = items.map((item) => item.id);
  const visibleCount = hidden ? ids.filter((id) => !hidden.has(id)).length : ids.length;

  const drop = (targetId: string): void => {
    if (dragging && dragging !== targetId) onReorder(moveOnto(ids, dragging, targetId));
    setDragging(null);
    setOver(null);
  };

  return (
    <ol className="reorder">
      {items.map((item, index) => {
        const isHidden = hidden?.has(item.id) ?? false;
        const classes = ['reorder__item'];
        if (dragging === item.id) classes.push('reorder__item--dragging');
        if (over === item.id && dragging !== item.id) classes.push('reorder__item--over');
        return (
          <li
            key={item.id}
            className={classes.join(' ')}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = 'move';
              event.dataTransfer.setData('text/plain', item.id);
              setDragging(item.id);
            }}
            onDragOver={(event) => {
              if (!dragging) return;
              event.preventDefault();
              event.dataTransfer.dropEffect = 'move';
              setOver(item.id);
            }}
            onDrop={(event) => {
              event.preventDefault();
              drop(item.id);
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(null);
            }}
          >
            <span className="reorder__grip" aria-hidden="true">
              ⠿
            </span>
            {hidden && onToggle ? (
              <label className="reorder__label">
                <input
                  type="checkbox"
                  checked={!isHidden}
                  // The table always keeps one column.
                  disabled={!isHidden && visibleCount === 1}
                  onChange={() => onToggle(item.id)}
                />
                {item.label}
              </label>
            ) : (
              <span className="reorder__label">{item.label}</span>
            )}
            <button
              type="button"
              className="reorder__move"
              aria-label={`Move ${item.label} up`}
              disabled={index === 0}
              onClick={() => onReorder(moveBy(ids, item.id, -1))}
            >
              ↑
            </button>
            <button
              type="button"
              className="reorder__move"
              aria-label={`Move ${item.label} down`}
              disabled={index === items.length - 1}
              onClick={() => onReorder(moveBy(ids, item.id, 1))}
            >
              ↓
            </button>
          </li>
        );
      })}
    </ol>
  );
}
