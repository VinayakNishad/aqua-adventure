import { Modal } from "react-bootstrap";
import BookingForm from "./BookingForm";

/** Enquiry form for a package, in an accessible modal. */
export default function BookingModal({ pkg, show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <BookingForm packageId={pkg._id} title={pkg.name} onClose={onClose} />
    </Modal>
  );
}
