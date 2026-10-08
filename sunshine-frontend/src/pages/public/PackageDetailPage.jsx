import { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import ExpandableText from "../../components/common/ExpandableText";
import VideoGallery from "../../components/home/VideoGallery";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import BookingCard from "../../components/packageDetail/BookingCard";
import BookingModal from "../../components/packages/BookingModal";
import ImagePreview from "../../components/packageDetail/ImagePreview";
import IncludedActivities from "../../components/packageDetail/IncludedActivities";
import LocationMap from "../../components/packageDetail/LocationMap";
import PackageHero from "../../components/packageDetail/PackageHero";
import PackageHighlights from "../../components/packageDetail/PackageHighlights";
import PackageInfoAccordion from "../../components/packageDetail/PackageInfoAccordion";
import PackageReviews from "../../components/packageDetail/PackageReviews";
import WhyChooseUs from "../../components/packageDetail/WhyChooseUs";
import useTilt3D from "../../hooks/useTilt3D";
import { ROUTES } from "../../routes/paths";
import { getPackage } from "../../services/packageService";
import "./PackageDetailPage.css";

export default function PackageDetailPage() {
  const { id } = useParams();
  const [pkg, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  useTilt3D();

  useEffect(() => {
    let active = true;
    getPackage(id)
      .then((data) => active && setPackage(data))
      .catch((err) => console.error("Failed to load package:", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!pkg) {
    return (
      <Container className="text-center py-5">
        <h1 className="h2">Package not found</h1>
        <Link to={ROUTES.HOME} className="btn btn-primary mt-3">
          Back to home
        </Link>
      </Container>
    );
  }

  return (
    <div className="package-detail">
      <Navbar />

      <main>
        <Container className="py-3 py-lg-4">
          <PackageHero pkg={pkg} onImageClick={setPreviewImage} />

          <Row className="gx-lg-5 gy-4 mt-3 mt-lg-4">
            <Col lg={7} xl={8}>
              <section className="detail-section" aria-label="Overview">
                <ExpandableText text={pkg.description} lines={3} />
              </section>
              <IncludedActivities activities={pkg.activities} onImageClick={setPreviewImage} />
              <PackageHighlights points={pkg.points} />
              <section className="detail-section">
                <WhyChooseUs />
              </section>
              <PackageReviews pkg={pkg} onImageClick={setPreviewImage} />
              <PackageInfoAccordion />
            </Col>

            <Col lg={5} xl={4}>
              <div className="package-detail__aside">
                <BookingCard pkg={pkg} onBook={() => setShowBooking(true)} />
                <LocationMap className="d-none d-lg-block" />
              </div>
            </Col>
          </Row>
        </Container>

        <VideoGallery />
      </main>

      <Footer />

      <BookingModal pkg={pkg} show={showBooking} onClose={() => setShowBooking(false)} />
      <ImagePreview image={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}
