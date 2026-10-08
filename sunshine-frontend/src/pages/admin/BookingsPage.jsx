import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { createAd } from "../../services/adService";
import { approveEnquiry, deleteEnquiry, getEnquiries } from "../../services/enquiryService";
import "./BookingsPage.css";
import {
  AddIcon,
  BookingsIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  FilterIcon,
  LogoutIcon,
} from "../../components/icons";

// *** NEW ICONS ***

// --- Existing Icons ---
const LoadingSpinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
    <p>Loading bookings...</p>
  </div>
);

const ErrorAlert = ({ message }) => (
  <div className="error-alert">
    <strong>Error:</strong> {message}
  </div>
);

const EmptyState = ({ isFiltered }) => (
  <div className="empty-state">
    <h3>{isFiltered ? "No Bookings Found for these Filters" : "No Bookings Found"}</h3>
    <p>
      {isFiltered
        ? "Please select different filter options or clear the filters."
        : "There are no bookings to display at the moment."}
    </p>
  </div>
);

// --- Feedback Functions ---
const sendReview = (phone, item) => {
  const isPackage = !!item.packageId;
  const itemType = isPackage ? "package" : "activity";
  const itemId = isPackage ? item.packageId._id : item.activityId._id;
  const itemTitle = isPackage ? item.packageId.name : item.activityId.title;
  const reviewLink = `${window.location.origin}/${itemType}/${itemId}/review`;
  const message = `Hi! Hope you enjoyed your recent ${itemTitle} ${itemType}. Please share your feedback here: ${reviewLink}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

const sendApprovalMessage = (enquiry) => {
  if (!enquiry) return;
  const customerName = enquiry.name;
  const phone = `${enquiry.countryCode}${enquiry.phone}`;
  const itemName = enquiry.packageId?.name || enquiry.activityId?.title || "your booking";
  const message = `Hello ${customerName}, your booking for "${itemName}" has been confirmed! We look forward to serving you.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, "_blank");
};

const DisplayBookings = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [sentFeedbackIds, setSentFeedbackIds] = useState(new Set());
  const navigate = useNavigate();
  const { logout } = useAuth();

  // States for advanced filtering
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState("single"); // 'single' or 'range'
  const [singleDate, setSingleDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [feedbackFilter, setFeedbackFilter] = useState("all"); // 'all', 'sent', or 'not_sent'

  // *** NEW FILTER STATES ***
  const [filterStatus, setFilterStatus] = useState("all"); // 'all', 'approved', 'pending'
  const [filterSearch, setFilterSearch] = useState(""); // Search term

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const data = await getEnquiries();
        // Sort by creation date, newest first
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setEnquiries(sortedData);
      } catch (err) {
        console.error("Error fetching enquiries:", err);
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  // *** MODIFIED: useMemo for filtering ***
  const filteredEnquiries = useMemo(() => {
    let filtered = [...enquiries];

    // Date Filtering
    if (filterType === "single" && singleDate) {
      const selectedDate = new Date(singleDate);
      filtered = filtered.filter((e) => {
        const enquiryDate = new Date(e.createdAt);
        return (
          enquiryDate.getFullYear() === selectedDate.getFullYear() &&
          enquiryDate.getMonth() === selectedDate.getMonth() &&
          enquiryDate.getDate() === selectedDate.getDate()
        );
      });
    } else if (filterType === "range" && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((e) => {
        const enquiryDate = new Date(e.createdAt);
        return enquiryDate >= start && enquiryDate <= end;
      });
    }

    // Feedback Filtering
    if (feedbackFilter === "sent") {
      filtered = filtered.filter((e) => sentFeedbackIds.has(e._id));
    } else if (feedbackFilter === "not_sent") {
      filtered = filtered.filter((e) => !sentFeedbackIds.has(e._id));
    }

    // *** NEW: Status Filtering ***
    if (filterStatus === "approved") {
      filtered = filtered.filter((e) => e.status === 1);
    } else if (filterStatus === "pending") {
      filtered = filtered.filter((e) => e.status !== 1);
    }

    // *** NEW: Search Filtering ***
    if (filterSearch) {
      const lowerSearch = filterSearch.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(lowerSearch) ||
          e.phone.toLowerCase().includes(lowerSearch) ||
          (e.packageId?.name || "").toLowerCase().includes(lowerSearch) ||
          (e.activityId?.title || "").toLowerCase().includes(lowerSearch),
      );
    }

    return filtered;
  }, [
    enquiries,
    filterType,
    singleDate,
    startDate,
    endDate,
    feedbackFilter,
    sentFeedbackIds,
    filterStatus,
    filterSearch, // <-- New dependencies
  ]);

  // *** MODIFIED: useMemo for dashboard stats ***
  const dashboardStats = useMemo(() => {
    const totalBookings = filteredEnquiries.length;
    const approvedBookings = filteredEnquiries.filter((e) => e.status === 1).length;
    const pendingBookings = totalBookings - approvedBookings;
    const latestBookingDate =
      totalBookings > 0 ? new Date(filteredEnquiries[0].createdAt).toLocaleDateString() : "N/A";

    return { totalBookings, approvedBookings, pendingBookings, latestBookingDate };
  }, [filteredEnquiries]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/", { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUploadAd = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select an image");
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      await createAd(formData);
      toast.success("Ad uploaded successfully");
      setShowOverlay(false);
      setSelectedFile(null);
    } catch (err) {
      console.error("Error uploading ad:", err);
      toast.error("Failed to upload ad");
    } finally {
      setUploading(false);
    }
  };

  const handleApprove = async (enquiryToApprove) => {
    try {
      await approveEnquiry(enquiryToApprove._id);
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry._id === enquiryToApprove._id ? { ...enquiry, status: 1 } : enquiry,
        ),
      );
      toast.success("Booking approved successfully!");
      sendApprovalMessage(enquiryToApprove);
    } catch (err) {
      console.error("Error approving booking:", err);
      toast.error("Failed to approve booking.");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject and delete this booking?")) {
      try {
        await deleteEnquiry(id);
        setEnquiries((prevEnquiries) => prevEnquiries.filter((enquiry) => enquiry._id !== id));
        toast.success("Booking rejected and deleted successfully!");
      } catch (err) {
        console.error("Error rejecting booking:", err);
        toast.error("Failed to reject booking.");
      }
    }
  };

  const handleSendReview = (phone, item, id) => {
    sendReview(phone, item);
    setSentFeedbackIds((prev) => new Set(prev).add(id));
  };

  // *** MODIFIED: Clear all filters ***
  const clearAllFilters = () => {
    setFilterType("single");
    setSingleDate("");
    setStartDate("");
    setEndDate("");
    setFeedbackFilter("all");
    setFilterStatus("all"); // <-- New
    setFilterSearch(""); // <-- New
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  // *** MODIFIED: Check for any active filter ***
  const isAnyFilterActive =
    singleDate ||
    (startDate && endDate) ||
    feedbackFilter !== "all" ||
    filterStatus !== "all" ||
    filterSearch !== "";

  return (
    <>
      <div className="bookings-dashboard">
        {/* ... Header ... */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <Link to="/packages/new" className="btn-custom btn-primary">
              <AddIcon /> Add Package
            </Link>
            <Link to="/videos" className="btn-custom btn-primary">
              <AddIcon /> Add Video
            </Link>
            <Link to="/add-activity" className="btn-custom btn-primary">
              <AddIcon /> Add Activity
            </Link>
            <Link to="/show-activity" className="btn-custom btn-primary">
              <AddIcon /> Edit Activity
            </Link>
            <button className="btn-custom btn-primary" onClick={() => setShowOverlay(true)}>
              <AddIcon /> Add Ads
            </button>
            <button className="btn-custom btn-danger" onClick={handleLogout}>
              <LogoutIcon /> Logout
            </button>
          </div>
        </div>

        {enquiries.length === 0 && !loading ? (
          <EmptyState isFiltered={false} />
        ) : (
          <>
            {/* *** MODIFIED: Stats Grid with new cards *** */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="icon total">
                  <BookingsIcon />
                </div>
                <div>
                  <div className="value">{dashboardStats.totalBookings}</div>
                  <div className="label">Total Bookings (Filtered)</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon approved">
                  <CheckIcon />
                </div>
                <div>
                  <div className="value">{dashboardStats.approvedBookings}</div>
                  <div className="label">Approved Bookings</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon pending">
                  <ClockIcon />
                </div>
                <div>
                  <div className="value">{dashboardStats.pendingBookings}</div>
                  <div className="label">Pending Bookings</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon calendar">
                  <CalendarIcon />
                </div>
                <div>
                  <div className="value">{dashboardStats.latestBookingDate}</div>
                  <div className="label">Latest Booking Date</div>
                </div>
              </div>
            </div>
            {/* ... (End Stats Grid) ... */}

            <div className="toolbar">
              <button
                className="btn-custom btn-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FilterIcon /> {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* *** MODIFIED: Filter Panel with new filters *** */}
            {showFilters && (
              <div className="filter-panel">
                <div className="filter-grid">
                  {/* --- NEW: Search Bar --- */}
                  <div className="filter-group search-bar">
                    <label htmlFor="search-filter">Search by Name, Phone, or Item</label>
                    <input
                      type="text"
                      id="search-filter"
                      placeholder="e.g. John Doe, +91..., or 'Scuba Diving'"
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                  </div>

                  {/* --- Date Filter Type --- */}
                  <div className="filter-group">
                    <label>Date Filter Type</label>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                      <option value="single">Single Day</option>
                      <option value="range">Date Range</option>
                    </select>
                  </div>

                  {/* --- Single/Range Date Inputs --- */}
                  {filterType === "single" ? (
                    <div className="filter-group">
                      <label htmlFor="single-date">Select Date</label>
                      <input
                        type="date"
                        id="single-date"
                        value={singleDate}
                        onChange={(e) => setSingleDate(e.target.value)}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="filter-group">
                        <label htmlFor="start-date">Start Date</label>
                        <input
                          type="date"
                          id="start-date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="filter-group">
                        <label htmlFor="end-date">End Date</label>
                        <input
                          type="date"
                          id="end-date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* --- NEW: Status Filter --- */}
                  <div className="filter-group">
                    <label>Booking Status</label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* --- Feedback Status Filter --- */}
                  <div className="filter-group">
                    <label>Feedback Status</label>
                    <select
                      value={feedbackFilter}
                      onChange={(e) => setFeedbackFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="sent">Sent</option>
                      <option value="not_sent">Not Sent</option>
                    </select>
                  </div>
                </div>
                <div className="filter-actions">
                  <button className="btn-custom btn-danger" onClick={clearAllFilters}>
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
            {/* ... (End Filter Panel) ... */}

            {/* ... Table / Empty State ... */}
            {filteredEnquiries.length === 0 ? (
              <EmptyState isFiltered={isAnyFilterActive} />
            ) : (
              <div className="bookings-table-container">
                <table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Phone</th>
                      <th>Item Booked</th>
                      <th>Booking Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enquiry) => (
                      <tr key={enquiry._id}>
                        <td>{enquiry.name}</td>
                        <td>
                          {enquiry.countryCode} {enquiry.phone}
                        </td>
                        <td>{enquiry.packageId?.name || enquiry.activityId?.title || "N/A"}</td>
                        <td>{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                        <td>
                          {enquiry.status === 1 ? (
                            <span className="status-badge badge-approved">Approved</span>
                          ) : (
                            <span className="status-badge badge-pending">Pending</span>
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            {enquiry.status !== 1 && (
                              <>
                                <button
                                  className="btn-custom btn-success"
                                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                                  onClick={() => handleApprove(enquiry)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-custom btn-danger"
                                  style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                                  onClick={() => handleReject(enquiry._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              className="btn-custom btn-primary"
                              style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                              onClick={() =>
                                handleSendReview(
                                  `${enquiry.countryCode}${enquiry.phone}`,
                                  enquiry,
                                  enquiry._id,
                                )
                              }
                              disabled={
                                (!enquiry.activityId && !enquiry.packageId) ||
                                sentFeedbackIds.has(enquiry._id)
                              }
                            >
                              {sentFeedbackIds.has(enquiry._id) ? "Feedback Sent" : "Send Feedback"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ... Overlay/Modal for adding Ads ... */}
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <button className="close-btn" onClick={() => setShowOverlay(false)}>
              <CloseIcon />
            </button>
            <h2>Add New Ad</h2>
            <form onSubmit={handleUploadAd}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <button
                type="submit"
                className="btn-custom btn-primary"
                disabled={uploading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {uploading ? (
                  <>
                    <div
                      className="spinner"
                      style={{
                        border: "2px solid #f3f3f3",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        animation: "spin 1s linear infinite",
                      }}
                    ></div>
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayBookings;
