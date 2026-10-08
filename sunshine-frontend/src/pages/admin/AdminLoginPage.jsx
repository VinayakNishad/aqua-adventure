import { useEffect, useState } from "react";
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import useAuth from "../../hooks/useAuth";
import { LOGO_SRC, MEDIA } from "../../constants/media";
import { ROUTES } from "../../routes/paths";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { isAdminUser } from "../../utils/auth";
import "./AdminLoginPage.css";

const FIREBASE_ERRORS = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection.",
};

const friendlyError = (error) =>
  FIREBASE_ERRORS[error?.code] ?? "Something went wrong. Please try again.";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error" | "success", text }
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const redirectTo = useLocation().state?.from?.pathname ?? ROUTES.BOOKINGS;

  useEffect(() => {
    if (isAdmin) navigate(redirectTo, { replace: true });
  }, [isAdmin, navigate, redirectTo]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      if (!(await isAdminUser(user))) {
        await signOut(auth);
        setMessage({ type: "error", text: "This account does not have admin access." });
      }
    } catch (error) {
      setMessage({ type: "error", text: friendlyError(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage({ type: "error", text: "Enter your admin email above first." });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage({ type: "success", text: "Password reset email sent. Check your inbox." });
    } catch (error) {
      setMessage({ type: "error", text: friendlyError(error) });
    }
  };

  return (
    <div className="admin-login">
      <aside className="admin-login__visual" aria-hidden="true">
        <img src={getOptimizedCloudinaryUrl(MEDIA.hero, { width: 1400, crop: "limit" })} alt="" />
        <div className="admin-login__visual-text">
          <span>Paradise Scuba Goa</span>
          <p>Manage bookings, packages and activities in one place.</p>
        </div>
      </aside>

      <main className="admin-login__panel">
        <form className="admin-login__form" onSubmit={handleLogin} noValidate>
          <Link to={ROUTES.HOME} className="admin-login__logo">
            <img src={LOGO_SRC} alt="Paradise Scuba Goa" />
          </Link>
          <h1>Admin sign in</h1>
          <p className="admin-login__sub">Welcome back. Please sign in to continue.</p>

          {message && (
            <div
              className={`alert ${message.type === "error" ? "alert-danger" : "alert-success"} py-2`}
              role={message.type === "error" ? "alert" : "status"}
            >
              {message.text}
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              type="email"
              className="form-control"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field">
            <div className="d-flex justify-content-between align-items-baseline">
              <label htmlFor="admin-password">Password</label>
              <button
                type="button"
                className="btn btn-link btn-sm p-0"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </button>
            </div>
            <div className="admin-login__password">
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                className="form-control"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-cta btn-lg w-100"
            disabled={submitting || !email || !password}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </button>

          <Link to={ROUTES.HOME} className="admin-login__back">
            <i className="bi bi-arrow-left" aria-hidden="true" /> Back to website
          </Link>
        </form>
      </main>
    </div>
  );
}
