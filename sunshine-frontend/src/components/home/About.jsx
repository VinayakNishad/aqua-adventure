import { Container, Row, Col, Image, Carousel } from "react-bootstrap"; // Import Carousel
import { ABOUT_SLIDES } from "../../constants/media";
import { buildCloudinarySrcSet, getOptimizedCloudinaryUrl } from "../../utils/cloudinary";

const SLIDE_WIDTHS = [480, 800, 1200];
const About = () => {
  return (
    <section id="about" className="py-5 ">
      <Container>
        <Row className="align-items-center">
          {/* Left Side - Image Carousel */}
          <Col md={6} className="mb-4 mb-md-0">
            <Carousel fade indicators={false} controls interval={2000} className="shadow">
              {ABOUT_SLIDES.map((slide, index) => (
                <Carousel.Item key={slide.src}>
                  <Image
                    src={getOptimizedCloudinaryUrl(slide.src, { width: 800, height: 600 })}
                    srcSet={buildCloudinarySrcSet(slide.src, SLIDE_WIDTHS)}
                    sizes="(max-width: 767px) 100vw, 50vw"
                    alt={slide.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    fluid
                    rounded
                    style={{ height: "400px", objectFit: "cover", width: "100%" }} // Added styling for consistent height
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          {/* Right Side - Text */}
          <Col md={6}>
            <h2 className="mb-3 text-center">About Paradise Watersports</h2>
            <p className="text-muted text-center">
              Welcome to <strong className="text-dark">Paradise Watersports</strong>, your go-to
              destination for thrilling water sports in Goa. Whether you are seeking an adrenaline
              rush or a relaxing time on the waves, we’ve got activities tailored for everyone.
            </p>
            <p className="text-muted text-center">
              From <em>Scuba diving</em> to <em>Dolphin rides</em> , we ensure you have the safest
              and most unforgettable experiences. Our expert team guarantees fun, excitement, and
              memories that will last a lifetime.
            </p>
            <p className="text-primary fw-bold text-center">
              ~Dive into adventure with Paradise Scuba Goa!
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
