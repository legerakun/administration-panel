import { useEffect, type ReactNode } from 'react';

import s from '@/components/popup/Popup.module.scss';

export const Popup = ({
  title,
  open,
  onClose,
  children
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={s.popupOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.popup}>
        <div className={s.popup__header}>
          <div className={s.popup__title}>{title}</div>
          <button className={s.popup__close} type="button" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className={s.popup__content}>{children}</div>
      </div>
    </div>
  );
};
