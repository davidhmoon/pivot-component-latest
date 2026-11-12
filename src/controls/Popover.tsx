import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

interface PopoverProps {
  /** Text on the button that opens the panel. */
  label: string;
  children: ReactNode;
}

/**
 * A button with a small panel under it. The panel stays open while you work
 * inside it and closes on Escape or a press anywhere outside.
 */
export function Popover({ label, children }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && container.current?.contains(event.target)) return;
      setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      trigger.current?.focus();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="popover" ref={container}>
      <button
        type="button"
        ref={trigger}
        className="pivot__button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {label}
        <span className="popover__caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {isOpen && (
        <div id={panelId} className="popover__panel" role="group" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}
