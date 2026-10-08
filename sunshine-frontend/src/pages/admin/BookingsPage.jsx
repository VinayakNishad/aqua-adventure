import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import useStoredSet from "../../hooks/useStoredSet";
import { ENQUIRY_STATUS, REVIEW_REQUESTS_STORAGE_KEY } from "../../constants/admin";
import { getErrorMessage } from "../../services/apiClient";
import { approveEnquiry, deleteEnquiry, getEnquiries } from "../../services/enquiryService";
import {
  approvalWhatsAppUrl,
  bookingItemName,
  chatWhatsAppUrl,
  reviewRequestWhatsAppUrl,
  telUrl,
} from "../../utils/bookingMessages";
import "./BookingsPage.css";

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
];

const REVIEW_FILTERS = [
  { value: "all", label: "Any review status" },
  { value: "sent", label: "Review requested" },
  { value: "not_sent", label: "Review not requested" },
];

const EMPTY_FILTERS = { search: "", status: "all", review: "all", from: "", to: "" };

const isApproved = (e) => e.status === ENQUIRY_STATUS.APPROVED;
const startOfDay = (value) => new Date(`${value}T00:00:00`);
const endOfDay = (value) => new Date(`${value}T23:59:59.999`);
const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();

const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });

const openInNewTab = (url) => window.open(url, "_blank", "noopener,noreferrer");

function StatusBadge({ enquiry }) {
  return isApproved(enquiry) ? (
    <span className="admin-badge admin-badge--approved">
      <i className="bi bi-check-circle-fill" aria-hidden="true" /> Approved
    </span>
  ) : (
    <span className="admin-badge admin-badge--pending">
      <i className="bi bi-clock-fill" aria-hidden="true" /> Pending
    </span>
  );
}

function BookingActions({ enquiry, reviewSent, onApprove, onReject, onRequestReview }) {
  return (
    <div className="booking-actions">
      {!isApproved(enquiry) && (
        <button type="button" className="btn btn-cta btn-sm" onClick={() => onApprove(enquiry)}>
          <i className="bi bi-check2 me-1" aria-hidden="true" /> Approve
        </button>
      )}
      {isApproved(enquiry) && (
        <button
          type="button"
          className={`btn btn-sm ${reviewSent ? "btn-light" : "btn-outline-primary"}`}
          onClick={() => onRequestReview(enquiry)}
          title={reviewSent ? "Review already requested — send again" : "Ask for a review"}
        >
          <i className={`bi ${reviewSent ? "bi-star-fill" : "bi-star"} me-1`} aria-hidden="true" />
          {reviewSent ? "Review asked" : "Ask review"}
        </button>
      )}
      <a
        href={chatWhatsAppUrl(enquiry)}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-outline-whatsapp btn-sm booking-actions__icon"
        aria-label={`WhatsApp ${enquiry.name}`}
      >
        <i className="bi bi-whatsapp" aria-hidden="true" />
      </a>
      <a
        href={telUrl(enquiry)}
        className="btn btn-outline-secondary btn-sm booking-actions__icon"
        aria-label={`Call ${enquiry.name}`}
      >
        <i className="bi bi-telephone" aria-hidden="true" />
      </a>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm booking-actions__icon"
        onClick={() => onReject(enquiry)}
        aria-label={`Reject booking from ${enquiry.name}`}
      >
        <i className="bi bi-trash" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function BookingsPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [toReject, setToReject] = useState(null);
  const [rejecting, setRejecting] = useState(false);
  const [reviewSentIds, markReviewSent] = useStoredSet(REVIEW_REQUESTS_STORAGE_KEY);

  useEffect(() => {
    getEnquiries()
      .then((data) =>
        setEnquiries(data.toSorted((a, b) => new Date(b.createdAt) - new Date(a.createdAt))),
      )
      .catch((err) => setError(getErrorMessage(err, "Failed to load bookings.")))
      .finally(() => setLoading(false));
  }, []);

  const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const hasFilters = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);

  const filtered = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return enquiries.filter((e) => {
      const created = new Date(e.createdAt);
      if (filters.from && created < startOfDay(filters.from)) return false;
      if (filters.to && created > endOfDay(filters.to)) return false;
      if (filters.status === "approved" && !isApproved(e)) return false;
      if (filters.status === "pending" && isApproved(e)) return false;
      if (filters.review === "sent" && !reviewSentIds.has(e._id)) return false;
      if (filters.review === "not_sent" && reviewSentIds.has(e._id)) return false;
      if (search) {
        const haystack = `${e.name} ${e.phone} ${bookingItemName(e)}`.toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      return true;
    });
  }, [enquiries, filters, reviewSentIds]);

  const stats = useMemo(
    () => [
      { label: "Total bookings", value: enquiries.length, icon: "bi-calendar3" },
      {
        label: "Pending",
        value: enquiries.filter((e) => !isApproved(e)).length,
        icon: "bi-hourglass-split",
      },
      { label: "Approved", value: enquiries.filter(isApproved).length, icon: "bi-check2-circle" },
      {
        label: "Today",
        value: enquiries.filter((e) => isToday(e.createdAt)).length,
        icon: "bi-lightning-charge",
      },
    ],
    [enquiries],
  );

  const handleApprove = async (enquiry) => {
    try {
      await approveEnquiry(enquiry._id);
      setEnquiries((list) =>
        list.map((e) => (e._id === enquiry._id ? { ...e, status: ENQUIRY_STATUS.APPROVED } : e)),
      );
      toast.success(`Booking for ${enquiry.name} approved. Opening WhatsApp to confirm…`);
      openInNewTab(approvalWhatsAppUrl(enquiry));
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to approve booking."));
    }
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await deleteEnquiry(toReject._id);
      setEnquiries((list) => list.filter((e) => e._id !== toReject._id));
      toast.success("Booking rejected and deleted.");
      setToReject(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to reject booking."));
    } finally {
      setRejecting(false);
    }
  };

  const handleRequestReview = (enquiry) => {
    openInNewTab(reviewRequestWhatsAppUrl(enquiry));
    markReviewSent(enquiry._id);
  };

  const actionProps = {
    onApprove: handleApprove,
    onReject: setToReject,
    onRequestReview: handleRequestReview,
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Bookings</h1>
          <p>Approve requests, contact guests and ask for reviews.</p>
        </div>
      </header>

      <section className="admin-stats" aria-label="Summary">
        {stats.map((s) => (
          <div key={s.label} className="admin-stat">
            <span className="admin-stat__icon">
              <i className={`bi ${s.icon}`} aria-hidden="true" />
            </span>
            <div>
              <span className="admin-stat__value">{loading ? "–" : s.value}</span>
              <span className="admin-stat__label">{s.label}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="admin-card bookings-toolbar" aria-label="Filters">
        <div className="bookings-toolbar__search">
          <i className="bi bi-search" aria-hidden="true" />
          <input
            type="search"
            className="form-control"
            placeholder="Search name, phone or package"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            aria-label="Search bookings"
          />
        </div>

        <div className="btn-group bookings-toolbar__status" role="group" aria-label="Status">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className={`btn btn-sm ${filters.status === f.value ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("status", f.value)}
              aria-pressed={filters.status === f.value}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bookings-toolbar__dates">
          <label>
            <span>From</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.from}
              max={filters.to || undefined}
              onChange={(e) => setFilter("from", e.target.value)}
            />
          </label>
          <label>
            <span>To</span>
            <input
              type="date"
              className="form-control form-control-sm"
              value={filters.to}
              min={filters.from || undefined}
              onChange={(e) => setFilter("to", e.target.value)}
            />
          </label>
        </div>

        <select
          className="form-select form-select-sm bookings-toolbar__review"
          value={filters.review}
          onChange={(e) => setFilter("review", e.target.value)}
          aria-label="Review request status"
        >
          {REVIEW_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            className="btn btn-link btn-sm"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Clear filters
          </button>
        )}
      </section>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="admin-empty">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading bookings…</span>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-card admin-empty">
          <i className="bi bi-inbox" aria-hidden="true" />
          {hasFilters ? "No bookings match these filters." : "No bookings yet."}
        </div>
      ) : (
        <>
          <p className="bookings-count">
            Showing {filtered.length} of {enquiries.length}
          </p>

          {/* Desktop table */}
          <div className="admin-table-wrap d-none d-lg-block">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Package</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id}>
                    <td>
                      <strong className="d-block">{e.name}</strong>
                      <span className="text-muted small">
                        {e.countryCode} {e.phone}
                      </span>
                    </td>
                    <td>{bookingItemName(e)}</td>
                    <td className="text-nowrap">{formatDate(e.createdAt)}</td>
                    <td>
                      <StatusBadge enquiry={e} />
                    </td>
                    <td>
                      <BookingActions
                        enquiry={e}
                        reviewSent={reviewSentIds.has(e._id)}
                        {...actionProps}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="booking-cards d-lg-none">
            {filtered.map((e) => (
              <li key={e._id} className="booking-card-item">
                <div className="booking-card-item__head">
                  <div>
                    <strong>{e.name}</strong>
                    <span className="text-muted small d-block">
                      {e.countryCode} {e.phone}
                    </span>
                  </div>
                  <StatusBadge enquiry={e} />
                </div>
                <p className="booking-card-item__meta">
                  <i className="bi bi-box-seam" aria-hidden="true" /> {bookingItemName(e)}
                  <br />
                  <i className="bi bi-clock" aria-hidden="true" /> {formatDate(e.createdAt)}
                </p>
                <BookingActions
                  enquiry={e}
                  reviewSent={reviewSentIds.has(e._id)}
                  {...actionProps}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      <ConfirmationModal
        show={Boolean(toReject)}
        title="Reject booking?"
        message={toReject && `This deletes the booking from ${toReject.name}. It cannot be undone.`}
        confirmLabel="Reject & delete"
        isDeleting={rejecting}
        onConfirm={handleReject}
        onCancel={() => setToReject(null)}
      />
    </>
  );
}
