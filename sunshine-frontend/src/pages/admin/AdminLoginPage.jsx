import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../config/firebase";
import useAuth from "../../hooks/useAuth";
import { isAdminUser } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import { LOGO_SRC as logo } from "../../constants/media";
import "./AdminLoginPage.css";
import { EyeIcon, EyeOffIcon } from "../../components/icons";

const logoUrl = `${logo}`;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect already logged-in admin to /bookings
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) navigate("/bookings", { replace: true });
  }, [isAdmin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (await isAdminUser(userCredential.user)) {
        toast.success("Login Successful..");
        setTimeout(() => navigate("/bookings", { replace: true }), 1500);
      } else {
        await auth.signOut(); // Sign out non-admin users immediately
        toast.error("Access Denied: You are not an authorized admin.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warn("Please enter your admin email first ⚠️");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("Password reset email sent Check your inbox.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      {/* Left: Login Form */}
      <div className="d-flex align-items-center justify-content-center">
        <div className="login-card">
          <div className="logo-container">
            <img src={logoUrl} alt="Water Sports Logo" />
          </div>
          <h3 className="form-title">Admin Login</h3>

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control form-control-custom"
                placeholder="Enter admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 password-input-wrapper">
              <label className="form-label fw-semibold">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control form-control-custom"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)} className="password-toggle-icon">
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </span>
            </div>

            <button type="submit" className="btn btn-submit w-100 fw-bold">
              Dive In
            </button>
          </form>

          <div className="text-center mt-4">
            <button type="button" onClick={handleForgotPassword} className="btn btn-link-custom">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </>
  );
};

export default AdminLogin;
