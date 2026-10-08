import { Modal } from "react-bootstrap";
import BookingForm from "./BookingForm";

/** Booking enquiry form for a package, in an accessible modal. */
export default function BookingModal({ pkg, show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered contentClassName="booking-modal">
      <BookingForm pkg={pkg} onClose={onClose} />
    </Modal>
  );
}
