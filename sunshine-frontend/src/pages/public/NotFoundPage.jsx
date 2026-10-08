import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

export default function NotFoundPage() {
  return (
    <main className="d-flex flex-column align-items-center justify-content-center vh-100 text-center">
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <Link to={ROUTES.HOME} className="btn btn-primary">
        Back to home
      </Link>
    </main>
  );
}
