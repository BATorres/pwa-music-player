import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './SettingsDropdown.css';

export default function SettingsDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [menuRect, setMenuRect] = useState(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const updateRect = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (rect) setMenuRect({ top: rect.bottom, left: rect.left, width: rect.width });
    };
    updateRect();

    const onMouseDown = (event) => {
      if (!triggerRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };
    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', updateRect);
    // Close on scroll anywhere — positions become stale fast
    window.addEventListener('scroll', () => setOpen(false), true);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', updateRect);
    };
  }, [open]);

  const current = options.find((option) => option.value === value);

  return (
    <div className={`settings-dropdown ${open ? 'open' : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        className="settings-dropdown-trigger"
        onClick={() => setOpen((value) => !value)}
      >
        <span>{current?.label ?? value}</span>
        <span className="settings-dropdown-chevron" aria-hidden="true">▾</span>
      </button>
      {open && menuRect && createPortal(
        <div
          ref={menuRef}
          className="settings-dropdown-menu"
          role="listbox"
          style={{
            position: 'fixed',
            top: `${menuRect.top + 15}px`,
            left: `${menuRect.left}px`,
            width: `${menuRect.width}px`,
          }}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              role="option"
              aria-selected={o.value === value}
              className={`settings-dropdown-item ${o.value === value ? 'active' : ''}`}
              onClick={() => { onChange(o.value); setOpen(false); }}
            >
              {o.label}
            </button>
          ))}
        </div>,
        // Portal to .player so CSS custom properties (--color-primary, etc.)
        // and the theme class still cascade. document.body would orphan them.
        document.querySelector('.player') ?? document.body,
      )}
    </div>
  );
}
