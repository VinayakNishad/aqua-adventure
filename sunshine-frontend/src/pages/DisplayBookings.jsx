import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebaseconfig';
import { toast } from 'react-toastify';

// *** NEW ICONS ***
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

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
    <p>{isFiltered ? "Please select different filter options or clear the filters." : "There are no bookings to display at the moment."}</p>
  </div>
);

const BookingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v15H6.5A2.5 2.5 0 0 1 4 14.5V4A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const AddIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const FilterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

// --- Feedback Functions ---
const sendReview = (phone, item) => {
  const isPackage = !!item.packageId;
  const itemType = isPackage ? 'package' : 'activity';
  const itemId = isPackage ? item.packageId._id : item.activityId._id;
  const itemTitle = isPackage ? item.packageId.name : item.activityId.title;
  const reviewLink = `${window.location.origin}/${itemType}/${itemId}/review`;
  const message = `Hi! Hope you enjoyed your recent ${itemTitle} ${itemType}. Please share your feedback here: ${reviewLink}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

const sendApprovalMessage = (enquiry) => {
  if (!enquiry) return;
  const customerName = enquiry.name;
  const phone = `${enquiry.countryCode}${enquiry.phone}`;
  const itemName = enquiry.packageId?.name || enquiry.activityId?.title || 'your booking';
  const message = `Hello ${customerName}, your booking for "${itemName}" has been confirmed! We look forward to serving you.`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
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

  // States for advanced filtering
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('single'); // 'single' or 'range'
  const [singleDate, setSingleDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [feedbackFilter, setFeedbackFilter] = useState('all'); // 'all', 'sent', or 'not_sent'
  
  // *** NEW FILTER STATES ***
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'approved', 'pending'
  const [filterSearch, setFilterSearch] = useState(''); // Search term

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/enquiries`);
        // Sort by creation date, newest first
        const sortedData = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
    if (filterType === 'single' && singleDate) {
      const selectedDate = new Date(singleDate);
      filtered = filtered.filter(e => {
        const enquiryDate = new Date(e.createdAt);
        return enquiryDate.getFullYear() === selectedDate.getFullYear() &&
          enquiryDate.getMonth() === selectedDate.getMonth() &&
          enquiryDate.getDate() === selectedDate.getDate();
      });
    } else if (filterType === 'range' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter(e => {
        const enquiryDate = new Date(e.createdAt);
        return enquiryDate >= start && enquiryDate <= end;
      });
    }

    // Feedback Filtering
    if (feedbackFilter === 'sent') {
      filtered = filtered.filter(e => sentFeedbackIds.has(e._id));
    } else if (feedbackFilter === 'not_sent') {
      filtered = filtered.filter(e => !sentFeedbackIds.has(e._id));
    }

    // *** NEW: Status Filtering ***
    if (filterStatus === 'approved') {
      filtered = filtered.filter(e => e.status === 1);
    } else if (filterStatus === 'pending') {
      filtered = filtered.filter(e => e.status !== 1);
    }

    // *** NEW: Search Filtering ***
    if (filterSearch) {
      const lowerSearch = filterSearch.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(lowerSearch) ||
        e.phone.toLowerCase().includes(lowerSearch) ||
        (e.packageId?.name || '').toLowerCase().includes(lowerSearch) ||
        (e.activityId?.title || '').toLowerCase().includes(lowerSearch)
      );
    }

    return filtered;
  }, [
    enquiries, 
    filterType, singleDate, startDate, endDate, 
    feedbackFilter, sentFeedbackIds,
    filterStatus, filterSearch // <-- New dependencies
  ]);

  // *** MODIFIED: useMemo for dashboard stats ***
  const dashboardStats = useMemo(() => {
    const totalBookings = filteredEnquiries.length;
    const approvedBookings = filteredEnquiries.filter(e => e.status === 1).length;
    const pendingBookings = totalBookings - approvedBookings;
    const latestBookingDate = totalBookings > 0
      ? new Date(filteredEnquiries[0].createdAt).toLocaleDateString()
      : "N/A";
    
    return { totalBookings, approvedBookings, pendingBookings, latestBookingDate };
  }, [filteredEnquiries]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate(`${process.env.REACT_APP_API_URL}/`, { replace: true });
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
      await axios.post(`${process.env.REACT_APP_API_URL}/ads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      await axios.put(`${process.env.REACT_APP_API_URL}/enquiries/${enquiryToApprove._id}/approve`);
      setEnquiries(prevEnquiries =>
        prevEnquiries.map(enquiry =>
          enquiry._id === enquiryToApprove._id ? { ...enquiry, status: 1 } : enquiry
        )
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
        await axios.delete(`${process.env.REACT_APP_API_URL}/enquiries/${id}`);
        setEnquiries(prevEnquiries => prevEnquiries.filter(enquiry => enquiry._id !== id));
        toast.success("Booking rejected and deleted successfully!");
      } catch (err) {
        console.error("Error rejecting booking:", err);
        toast.error("Failed to reject booking.");
      }
    }
  };

  const handleSendReview = (phone, item, id) => {
    sendReview(phone, item);
    setSentFeedbackIds(prev => new Set(prev).add(id));
  };

  // *** MODIFIED: Clear all filters ***
  const clearAllFilters = () => {
    setFilterType('single');
    setSingleDate('');
    setStartDate('');
    setEndDate('');
    setFeedbackFilter('all');
    setFilterStatus('all'); // <-- New
    setFilterSearch(''); // <-- New
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  // *** MODIFIED: Check for any active filter ***
  const isAnyFilterActive = singleDate || (startDate && endDate) || feedbackFilter !== 'all' || filterStatus !== 'all' || filterSearch !== '';

  return (
    <>
      <style>{`
        /* ... (imports and fonts) ... */
        :root {
          --primary-color: #4d82f5;
          --primary-hover: #3a70e2;
          --danger-color: #e63946;
          --danger-hover: #d62828;
          --success-color: #198754;
          --success-hover: #157347;
          --secondary-color: #6c757d;
          --secondary-hover: #5a6268;
          --bg-color: #f4f7fa;
          --card-bg: #ffffff;
          --text-dark: #1a2c5e;
          --text-light: #6c757d;
          --border-color: #e9ecef;
          --shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          --border-radius: 0.75rem;
        }
        
        .bookings-dashboard { 
          font-family: 'Poppins', sans-serif; 
          background-color: var(--bg-color); 
          min-height: 100vh; 
          padding: 1.5rem; 
        }
        .dashboard-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          flex-wrap: wrap; 
          gap: 1rem; 
          margin-bottom: 2rem; 
        }
        .dashboard-header h1 { 
          font-size: 1.75rem; 
          font-weight: 700; 
          color: var(--text-dark); 
        }
        .header-actions { 
          display: flex; 
          gap: 0.75rem; 
          flex-wrap: wrap; 
        }
        .btn-custom { 
          display: inline-flex; 
          align-items: center; 
          gap: 0.5rem;
          text-wrap: nowrap; 
          padding: 0.6rem 1.2rem; 
          border: none; 
          border-radius: 0.5rem; 
          font-weight: 500; 
          cursor: pointer; 
          transition: all 0.3s ease; 
          text-decoration: none;
        }
        .btn-primary { background-color: var(--primary-color); color: white; }
        .btn-danger { background-color: var(--danger-color); color: white; }
        .btn-secondary { background-color: var(--secondary-color); color: white; }
        .btn-success { background-color: var(--success-color); color: white; }
        .btn-primary:hover { background-color: var(--primary-hover); transform: translateY(-2px); }
        .btn-danger:hover { background-color: var(--danger-hover); transform: translateY(-2px); }
        .btn-secondary:hover { background-color: var(--secondary-hover); transform: translateY(-2px); }
        .btn-success:hover { background-color: var(--success-hover); transform: translateY(-2px); }

        .stats-grid { 
          display: grid; 
          /* *** MODIFIED: Now fits 4 cards better */
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 1.5rem; 
          margin-bottom: 1rem; 
        }
        .stat-card { 
          background-color: var(--card-bg); 
          padding: 1.5rem; 
          border-radius: var(--border-radius); 
          box-shadow: var(--shadow); 
          display: flex; 
          align-items: center; 
          gap: 1rem; 
        }
        .stat-card .icon { 
          width: 50px; 
          height: 50px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
        }
        /* *** NEW: Icon background colors *** */
        .stat-card .icon.total { background-color: #e8f0ff; color: #4d82f5; }
        .stat-card .icon.approved { background-color: #d1e7dd; color: #0f5132; }
        .stat-card .icon.pending { background-color: #fff3cd; color: #664d03; }
        .stat-card .icon.calendar { background-color: #fde2e4; color: #e63946; }

        .stat-card .value { font-size: 1.8rem; font-weight: 700; color: var(--text-dark); }
        .stat-card .label { font-size: 0.9rem; color: var(--text-light); }
        
        .bookings-table-container { 
          background-color: var(--card-bg); 
          border-radius: var(--border-radius); 
          box-shadow: var(--shadow); 
          overflow-x: auto; 
        }
        .bookings-table { width: 100%; border-collapse: collapse; }
        .bookings-table th, .bookings-table td { 
          padding: 1rem; 
          text-align: left; /* Changed from justify */
          border-bottom: 1px solid var(--border-color); 
          white-space: nowrap; /* Prevent ugly wrapping */
        }
        .bookings-table th { 
          font-weight: 600; 
          color: #343a40; 
          font-size: 0.9rem; 
          text-transform: uppercase; 
        }
        .bookings-table tbody tr:last-child td { border-bottom: none; }
        .bookings-table tbody tr:hover { background-color: #f8f9fa; }
        .action-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; } 
        
        .status-badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 500; text-transform: capitalize; } 
        .badge-approved { background-color: #d1e7dd; color: #0f5132; } 
        .badge-pending { background-color: #fff3cd; color: #664d03; } 
        
        .spinner-container, .error-alert, .empty-state { text-align: center; padding: 4rem; }
        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: var(--primary-color);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        .overlay { position: fixed; top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.6); display:flex; align-items:center; justify-content:center; z-index:9999; }
        .overlay-content { background:var(--card-bg); padding:2rem; border-radius:var(--border-radius); width:90%; max-width:400px; position:relative; }
        .overlay-content h2 { margin-bottom:1rem; color:var(--text-dark); }
        .overlay-content form { display:flex; flex-direction:column; gap:1rem; }
        .overlay-content input[type="file"] { padding:0.5rem; border:1px solid #ccc; border-radius:0.5rem; }
        .close-btn { position:absolute; top:1rem; right:1rem; background:none; border:none; cursor:pointer; }
        
        .toolbar { display: flex; justify-content: flex-end; margin-bottom: 1.5rem; margin-top: 1.5rem; }
        .filter-panel { 
          background-color: var(--card-bg); 
          border-radius: var(--border-radius); 
          padding: 1.5rem; 
          margin-bottom: 2.5rem; 
          box-shadow: var(--shadow); 
        }
        .filter-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 1.5rem; 
        }
        /* *** NEW: Full-width search bar *** */
        .filter-group.search-bar {
          grid-column: 1 / -1;
        }

        .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .filter-group label { font-weight: 500; color: #343a40; font-size: 0.9rem; }
        .filter-group input, .filter-group select { padding: 0.6rem; border: 1px solid #ced4da; border-radius: 0.5rem; font-family: 'Poppins', sans-serif; }
        .filter-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; }
        
        @keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} } 

        /* *** NEW: Responsive Media Queries *** */
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }
          .stats-grid {
             grid-template-columns: 1fr; /* Stack cards on mobile */
          }
        }

        @media (max-width: 600px) {
          .bookings-dashboard {
            padding: 1rem;
          }
          .bookings-table th, .bookings-table td { 
            padding: 0.75rem 0.5rem; 
            font-size: 0.8rem; 
          }
          .action-buttons { 
            flex-direction: column; 
            align-items: flex-start; 
            gap: 0.5rem;
          }
          .btn-custom {
            width: 100%;
            justify-content: center;
          }
          .header-actions {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <div className="bookings-dashboard">
        {/* ... Header ... */}
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <Link to="/packages/new" className="btn-custom btn-primary"><AddIcon /> Add Package</Link>
            <Link to="/videos" className="btn-custom btn-primary"><AddIcon /> Add Video</Link>
            <Link to="/add-activity" className="btn-custom btn-primary"><AddIcon /> Add Activity</Link>
            <Link to="/show-activity" className="btn-custom btn-primary"><AddIcon /> Edit Activity</Link>
            <button className="btn-custom btn-primary" onClick={() => setShowOverlay(true)}><AddIcon /> Add Ads</button>
            <button className="btn-custom btn-danger" onClick={handleLogout}><LogoutIcon /> Logout</button>
          </div>
        </div>

        {enquiries.length === 0 && !loading ? (
          <EmptyState isFiltered={false} />
        ) : (
          <>
            {/* *** MODIFIED: Stats Grid with new cards *** */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="icon total"><BookingsIcon /></div>
                <div>
                  <div className="value">{dashboardStats.totalBookings}</div>
                  <div className="label">Total Bookings (Filtered)</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="icon approved"><CheckIcon /></div>
                <div>
                  <div className="value">{dashboardStats.approvedBookings}</div>
                  <div className="label">Approved Bookings</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon pending"><ClockIcon /></div>
                <div>
                  <div className="value">{dashboardStats.pendingBookings}</div>
                  <div className="label">Pending Bookings</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon calendar"><CalendarIcon /></div>
                <div>
                  <div className="value">{dashboardStats.latestBookingDate}</div>
                  <div className="label">Latest Booking Date</div>
                </div>
              </div>
            </div>
            {/* ... (End Stats Grid) ... */}

            <div className="toolbar">
              <button className="btn-custom btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                <FilterIcon /> {showFilters ? 'Hide Filters' : 'Show Filters'}
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
                      onChange={e => setFilterSearch(e.target.value)} 
                    />
                  </div>
                  
                  {/* --- Date Filter Type --- */}
                  <div className="filter-group">
                    <label>Date Filter Type</label>
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                      <option value="single">Single Day</option>
                      <option value="range">Date Range</option>
                    </select>
                  </div>

                  {/* --- Single/Range Date Inputs --- */}
                  {filterType === 'single' ? (
                    <div className="filter-group">
                      <label htmlFor="single-date">Select Date</label>
                      <input type="date" id="single-date" value={singleDate} onChange={e => setSingleDate(e.target.value)} />
                    </div>
                  ) : (
                    <>
                      <div className="filter-group">
                        <label htmlFor="start-date">Start Date</label>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                      </div>
                      <div className="filter-group">
                        <label htmlFor="end-date">End Date</label>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                      </div>
                    </>
                  )}

                  {/* --- NEW: Status Filter --- */}
                  <div className="filter-group">
                    <label>Booking Status</label>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                      <option value="all">All Statuses</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  {/* --- Feedback Status Filter --- */}
                  <div className="filter-group">
                    <label>Feedback Status</label>
                    <select value={feedbackFilter} onChange={e => setFeedbackFilter(e.target.value)}>
                      <option value="all">All</option>
                      <option value="sent">Sent</option>
                      <option value="not_sent">Not Sent</option>
                    </select>
                  </div>

                </div>
                <div className="filter-actions">
                  <button className="btn-custom btn-danger" onClick={clearAllFilters}>Clear All Filters</button>
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
                        <td>{enquiry.countryCode} {enquiry.phone}</td>
                        <td>{enquiry.packageId?.name || enquiry.activityId?.title || 'N/A'}</td>
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
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  onClick={() => handleApprove(enquiry)}
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn-custom btn-danger"
                                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                                  onClick={() => handleReject(enquiry._id)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              className="btn-custom btn-primary"
                              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                              onClick={() =>
                                handleSendReview(`${enquiry.countryCode}${enquiry.phone}`, enquiry, enquiry._id)
                              }
                              disabled={!enquiry.activityId && !enquiry.packageId || sentFeedbackIds.has(enquiry._id)}
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
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                {uploading ? (
                  <>
                    <div className="spinner" style={{
                      border: "2px solid #f3f3f3",
                      borderTop: "2px solid white",
                      borderRadius: "50%",
                      width: "16px",
                      height: "16px",
                      animation: "spin 1s linear infinite"
                    }}></div>
                    Uploading...
                  </>
                ) : "Upload"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DisplayBookings;
