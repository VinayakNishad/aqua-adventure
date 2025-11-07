import { Container, Row, Col, Image, Carousel } from "react-bootstrap"; // Import Carousel
import aboutImg1 from "../assets/ab1.jpg";
import aboutImg2 from "../assets/ab2.jpg";
import aboutImg3 from "../assets/ab3.jpg";
import aboutImg4 from "../assets/ab5.jpg";
const About = () => {
  const carouselImages = [
    aboutImg1,
    aboutImg2,
    aboutImg3,
    aboutImg4
  ];

  return (
    <section id="about" className="py-5 ">
      <Container>
        <Row className="align-items-center">
          {/* Left Side - Image Carousel */}
          <Col md={6} className="mb-4 mb-md-0">
            <Carousel fade indicators={false} controls interval={3000} className="shadow" data-aos="fade-left">
              {carouselImages.map((image, index) => (
                <Carousel.Item key={index}>
                  <Image
                    src={image}
                    alt={`About Nerul Paradise slide ${index + 1}`}
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
            <h2 className="mb-3 text-center" data-aos="fade-up">About Paradise Watersports</h2>
            <p className="text-muted text-center" data-aos="fade-up">
              Welcome to <strong className="text-dark">Paradise Watersports</strong>, your go-to destination
              for thrilling water sports in Goa. Whether you are seeking an
              adrenaline rush or a relaxing time on the waves, we’ve got
              activities tailored for everyone.
            </p>
            <p className="text-muted text-center" data-aos="fade-up">
              From <em>Scuba diving</em> to <em>Dolphin rides</em>{" "},
               we ensure you have the safest and
              most unforgettable experiences. Our expert team guarantees fun,
              excitement, and memories that will last a lifetime.
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