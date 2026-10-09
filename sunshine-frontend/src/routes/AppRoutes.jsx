import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import GoogleReviews from "../components/home/GoogleReviews";
import PackageList from "../components/packages/PackageList";
import HomePage from "../pages/public/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "./paths";

const PackageDetailPage = lazy(() => import("../pages/public/PackageDetailPage"));
const ReviewPage = lazy(() => import("../pages/public/ReviewPage"));
const PhotoCreditsPage = lazy(() => import("../pages/public/PhotoCreditsPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));

const AdminLoginPage = lazy(() => import("../pages/admin/AdminLoginPage"));
const BookingsPage = lazy(() => import("../pages/admin/BookingsPage"));
const CreatePackagePage = lazy(() => import("../pages/admin/CreatePackagePage"));
const EditPackagePage = lazy(() => import("../pages/admin/EditPackagePage"));
const CreateActivityPage = lazy(() => import("../pages/admin/CreateActivityPage"));
const EditActivityPage = lazy(() => import("../pages/admin/EditActivityPage"));
const ActivitiesSection = lazy(() => import("../components/activities/ActivitiesSection"));
const AddVideoPage = lazy(() => import("../pages/admin/AddVideoPage"));
const AdminPackagesPage = lazy(() => import("../pages/admin/AdminPackagesPage"));
const AdminLayout = lazy(() => import("../components/admin/AdminLayout"));

const adminRoutes = [
  [ROUTES.BOOKINGS, BookingsPage],
  [ROUTES.ADMIN_PACKAGES, AdminPackagesPage],
  [ROUTES.NEW_PACKAGE, CreatePackagePage],
  [ROUTES.EDIT_PACKAGE, EditPackagePage],
  [ROUTES.NEW_ACTIVITY, CreateActivityPage],
  [ROUTES.ACTIVITIES, ActivitiesSection],
  [ROUTES.EDIT_ACTIVITY, EditActivityPage],
  [ROUTES.VIDEOS, AddVideoPage],
];

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: "1px" }} aria-hidden="true" />}>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.PACKAGES} element={<PackageList />} />
        <Route path={ROUTES.PACKAGE_DETAIL} element={<PackageDetailPage />} />
        <Route path={ROUTES.PACKAGE_REVIEW} element={<ReviewPage />} />
        <Route path={ROUTES.ACTIVITY_REVIEW} element={<ReviewPage />} />
        <Route path={ROUTES.REVIEWS} element={<GoogleReviews />} />
        <Route path={ROUTES.PHOTO_CREDITS} element={<PhotoCreditsPage />} />
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {adminRoutes.map(([path, Page]) => (
            <Route key={path} path={path} element={<Page />} />
          ))}
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
