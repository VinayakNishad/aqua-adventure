import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../pages/firebaseconfig";
import { toast, ToastContainer } from "react-toastify";
import logo from "../assets/nerualparadise.png"
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);


const logoUrl = `${logo}`;


const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Redirect already logged-in admin to /bookings
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Check for user and if they are the admin
      if (user && user.email === "vn07244@gmail.com") {
        navigate("/bookings", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email === "vn07244@gmail.com") {
        toast.success("Login Successful..");
        setTimeout(() => navigate(`${process.env.REACT_APP_API_URL}/bookings`, { replace: true }), 1500);
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        .admin-login-page {
          font-family: 'Poppins', sans-serif;
          background-color: #f0f2f5;
        }

        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 1rem;
        }

        .login-card {
          width: 100%;
          max-width: 450px;
          background-color: #ffffff;
          border: none;
          border-radius: 1rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          margin: 1rem;
          animation: fadeInUp 0.7s ease-in-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-card .logo-container {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .login-card .logo-container img {
          height: 70px;
          width: auto;
        }

        .login-card .form-title {
          font-weight: 700;
          color: #1a2c5e;
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-control-custom {
          border-radius: 0.5rem;
          padding: 0.9rem 1rem;
          border: 1px solid #ced4da;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-control-custom:focus {
          border-color: #4d82f5;
          box-shadow: 0 0 0 3px rgba(77, 130, 245, 0.2);
          outline: none;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-toggle-icon {
          position: absolute;
          top: 70%;
          right: 15px;
          transform: translateY(-50%);
          cursor: pointer;
          color: #6c757d;
          font-size: 1rem; /* Adjusted size */
          line-height: 1; /* Ensure proper alignment */
          transition: color 0.3s ease;
        }
        
        .password-toggle-icon:hover {
            color: #1a2c5e;
        }
        
        .btn-submit {
          background: linear-gradient(90deg, #4d82f5, #3a70e2);
          border: none;
          border-radius: 0.5rem;
          padding: 0.9rem;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(77, 130, 245, 0.3);
        }

        .btn-submit:hover {
          transform: translateY(-3px);
          box-shadow: 0 7px 20px rgba(77, 130, 245, 0.4);
        }

        .btn-link-custom {
            font-weight: 500;
            color: #4d82f5;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .btn-link-custom:hover {
            color: #1a2c5e;
            text-decoration: underline;
        }

        
        
    
      `}</style>
     
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
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle-icon"
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </span>
                            </div>

                            <button type="submit" className="btn btn-submit w-100 fw-bold">
                            Dive In
                            </button>
                        </form>

                        <div className="text-center mt-4">
                            <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="btn btn-link-custom"
                            >
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
