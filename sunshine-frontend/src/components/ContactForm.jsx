import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { BsWhatsapp } from "react-icons/bs"; // fixed
import { MdEmail } from "react-icons/md";
import { GiWaveCrest } from "react-icons/gi";
import { FaCheckCircle } from "react-icons/fa";

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        message: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, phone, message } = formData;
        const phoneNumber = "9763703724"; // Your WhatsApp number

        const whatsappMessage = `Hello, my name is ${name}. My phone number is ${phone}. Message: ${message}`;
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
            whatsappMessage
        )}`;

        window.open(url, "_blank");
    };

    return (
        <section id="contact">
            <Container>
                <Row className="align-items-center" >
                    {/* Left Column - Form */}

                    {/* Right Column - About Watersports */}
                    <Col md={6} data-aos="fade-left" className="p-4">
                        <h2 className="text-primary mb-3 " >
                            <GiWaveCrest style={{ marginRight: "8px" }} />
                            Experience the Thrill
                        </h2>

                        <p className="lead">
                            Dive into the ultimate adventure with <strong>Paradise Scuba Goa</strong>.
                            Whether it's deep sea scuba diving, or the joy of
                            dolphin sight viewing, we have something for everyone!
                        </p>
                        <p className="text-start">
                            Our expert team ensures your safety while you enjoy every thrilling
                            moment on the waters of Goa. Book your experience today and create
                            memories that will last a lifetime.
                        </p>
                        <ul className="list-unstyled mt-3 mb-4">
                            <li className="d-flex align-items-center mb-2">
                                <FaCheckCircle className="text-success me-2" />
                                Professional Instructors
                            </li>
                            <li className="d-flex align-items-center mb-2">
                                <FaCheckCircle className="text-success me-2" />
                                Safe & Well-Maintained Equipment
                            </li>
                            <li className="d-flex align-items-center mb-2">
                                <FaCheckCircle className="text-success me-2" />
                                Fun for Families & Groups
                            </li>
                        </ul>
                    </Col>
                    <Col md={6} className="mb-4 mb-md-0" data-aos="fade-right">
                        <Card className="shadow border-0 rounded-4">
                            <Card.Body className="p-4">
                                <h2 className="d-block text-center mb-4 text-primary">
                                    <MdEmail style={{ marginRight: "8px" }} />
                                    Contact Us
                                </h2>

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formName">
                                        <Form.Label>Full Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Enter your name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPhone">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formMessage">
                                        <Form.Label>Your Message</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="message"
                                            placeholder="Write your message here..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button variant="primary" size="md" type="submit" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <BsWhatsapp style={{ marginRight: "8px" }} />
                                            Send via WhatsApp
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default ContactForm;
