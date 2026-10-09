import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { ADMIN_NAV } from "../../constants/admin";
import { LOGO_SRC } from "../../constants/media";
import { ROUTES } from "../../routes/paths";
import "./AdminLayout.css";

function AdminNav({ onNavigate }) {
  return (
    <nav className="admin-nav" aria-label="Admin">
      {ADMIN_NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `admin-nav__link ${isActive ? "is-active" : ""}`}
          onClick={onNavigate}
        >
          <i className={`bi ${item.icon}`} aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

/** Shell for every admin page: sidebar (desktop), drawer (mobile), top bar. */
export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.ADMIN_LOGIN, { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar d-none d-lg-flex">
        <Link to={ROUTES.BOOKINGS} className="admin-brand">
          <img src={LOGO_SRC} alt="Paradise Scuba Goa" />
          <span>Admin</span>
        </Link>
        <AdminNav />
        <div className="admin-sidebar__foot">
          <Link to={ROUTES.HOME} className="admin-nav__link" target="_blank">
            <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> View site
          </Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="btn admin-icon-btn d-lg-none"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <i className="bi bi-list" aria-hidden="true" />
          </button>
          <span className="admin-topbar__user">
            <i className="bi bi-person-circle" aria-hidden="true" />
            <span className="d-none d-sm-inline">{user?.email}</span>
          </span>
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-1" aria-hidden="true" /> Log out
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>

      <Offcanvas show={menuOpen} onHide={() => setMenuOpen(false)} className="admin-drawer">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <img src={LOGO_SRC} alt="Paradise Scuba Goa" className="admin-drawer__logo" />
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <AdminNav onNavigate={() => setMenuOpen(false)} />
          <Link to={ROUTES.HOME} className="admin-nav__link mt-3" target="_blank">
            <i className="bi bi-box-arrow-up-right" aria-hidden="true" /> View site
          </Link>
        </Offcanvas.Body>
      </Offcanvas>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
