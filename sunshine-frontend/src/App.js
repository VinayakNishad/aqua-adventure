import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DisplayBookings from "./pages/DisplayBookings";
import AOS from "aos";
import GoogleReviews from "./pages/googleReview";
import ScrollToTopArrow from "./components/ScrollToTopArrow";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth } from "./pages/firebaseconfig";
import AdminLogin from "./pages/AdminLogin";
import { useState } from "react";
import ReviewPage from "./pages/ReviewPage";
import AddVideoForm from "./pages/AddVideoForm";
import Packages from "./pages/packages";
import PackageForm from "./pages/PackageForm";
import PackageDetail from "./pages/PackageDetail";
import EditPackage from "./pages/EditPackage";
import EditPage from "./pages/EditPage";
import AddActivity from "./pages/AddActivity";
import Loader from "./components/Loader";
import ActivitiesSection from "./components/ActivitiesSection";
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
   const [loading, setLoading] = useState(true);
    useEffect(() => {
    // Simulate a small delay (you can adjust it)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  const ProtectedRoute = ({ children }) => {
    return auth.currentUser ? children : <Navigate to="/" />;
  };

  return (
    <Router>
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
      <ScrollToTopArrow />
    </Router>
  );
};

export default App;
