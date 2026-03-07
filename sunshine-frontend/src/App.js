import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AOS from "aos";
import { auth } from "./pages/firebaseconfig";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Eager load only critical components
import Home from "./pages/Home";
import ScrollToTopArrow from "./components/ScrollToTopArrow";

// Lazy load all other routes for code splitting
const AdminLogin = React.lazy(() => import("./pages/AdminLogin"));
const DisplayBookings = React.lazy(() => import("./pages/DisplayBookings"));
const GoogleReviews = React.lazy(() => import("./pages/googleReview"));
const ReviewPage = React.lazy(() => import("./pages/ReviewPage"));
const AddVideoForm = React.lazy(() => import("./pages/AddVideoForm"));
const Packages = React.lazy(() => import("./pages/packages"));
const PackageForm = React.lazy(() => import("./pages/PackageForm"));
const PackageDetail = React.lazy(() => import("./pages/PackageDetail"));
const EditPackage = React.lazy(() => import("./pages/EditPackage"));
const EditPage = React.lazy(() => import("./pages/EditPage"));
const AddActivity = React.lazy(() => import("./pages/AddActivity"));
const ActivitiesSection = React.lazy(() => import("./components/ActivitiesSection"));
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 500,
      once: true,
    });
  }, []);

  const ProtectedRoute = ({ children }) => {
    return auth.currentUser ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <React.Suspense fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
         <Route
          path="/packages/new"
          element={
            <ProtectedRoute>
              <PackageForm />
            </ProtectedRoute>
          }
        />
        <Route path="/add-activity"  element={
            <ProtectedRoute>
              <AddActivity />
            </ProtectedRoute>
          }
          />
          <Route path="/show-activity"  element={
              <ProtectedRoute>
                <ActivitiesSection/>
              </ProtectedRoute>
          }
          />

        <Route path="/reviews" element={<GoogleReviews />} />
        <Route
          path="/admin/edit-package/:id"
          element={
            <ProtectedRoute>
              <EditPackage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-activity/:id"
          element={
            <ProtectedRoute>
              <EditPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <ProtectedRoute>
              <DisplayBookings />
            </ProtectedRoute>
          }
        />
        
        <Route path="/activity/:id/review" element={<ReviewPage />} />
        <Route path="/package/:id/review" element={<ReviewPage />} />
        
        <Route
          path="/videos"
          element={
            <ProtectedRoute>
              <AddVideoForm />
            </ProtectedRoute>
          }
        />
        <Route path="/packages" element={<Packages />} /> 
        <Route path="/packages/new" element={<PackageForm />} />
        <Route path="/package/:id" element={<PackageDetail />} /> 

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
      </React.Suspense>
      <ScrollToTopArrow />
    </Router>
  );
};

export default App;
