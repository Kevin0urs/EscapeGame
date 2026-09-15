interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export function ConfirmDialog({
  open, title, message, confirmLabel = 'Confirmer', cancelLabel = 'Annuler',
  onConfirm, onCancel, danger = false,
}: Props) {
  if (!open) return null;
  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-dialog__actions">
          <button className={`btn ${danger ? 'btn-crimson' : 'btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}