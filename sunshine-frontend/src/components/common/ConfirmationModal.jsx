import { Button, Modal } from "react-bootstrap";

/** Accessible yes/no confirmation dialog for destructive actions. */
export default function ConfirmationModal({
  show = true,
  title = "Confirm delete",
  message = "Are you sure you want to delete this item?",
  confirmLabel = "Delete",
  isDeleting = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h5">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancel} disabled={isDeleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Deleting…" : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
