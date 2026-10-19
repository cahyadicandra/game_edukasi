import React from 'react';
import { X } from 'lucide-react';
import './GameModal.css';

interface GameModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footerActionLabel?: string;
  onFooterAction?: () => void;
}

export const GameModal: React.FC<GameModalProps> = ({
  isOpen,
  title,
  onClose,
  children,
  footerActionLabel,
  onFooterAction,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Tutup">
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="modal-body">{children}</div>

        {footerActionLabel && (
          <div className="modal-footer">
            <button
              className="modal-action-btn"
              onClick={onFooterAction || onClose}
            >
              {footerActionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
