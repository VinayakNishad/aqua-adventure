import React from "react";
import { Container, Accordion } from "react-bootstrap";
import faqData from "../data/FAQDetails.json";

const FAQ = () => {
  return (
    <section id="faq" className="py-5" data-aos="fade-up">
      <Container>
        <h2 className="text-center mb-4" data-aos="fade-up">Frequently Asked Questions</h2>
        <Accordion defaultActiveKey="0" flush>
          {faqData.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body className="text-muted" style={{ letterSpacing: "0.5px", lineHeight: "1.8" }}>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

export default FAQ;
