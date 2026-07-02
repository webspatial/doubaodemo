export function ModalHeader({
  title,
  onClose,
  hideCloseButton = false,
}: {
  title: string;
  onClose: () => void;
  hideCloseButton?: boolean;
}) {
  return (
    <div className="about-modal-header">
      <strong>{title}</strong>
      {!hideCloseButton && (
        <button className="about-modal-close" type="button" onClick={onClose}>
          关闭
        </button>
      )}
    </div>
  );
}
