import { BrowserRouter } from "react-router-dom";
import ScrollToTopArrow from "./components/layout/ScrollToTopArrow";
import { AuthProvider } from "./context/AuthProvider";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  useGoogleAnalytics();

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <ScrollToTopArrow />
      </BrowserRouter>
    </AuthProvider>
  );
}
