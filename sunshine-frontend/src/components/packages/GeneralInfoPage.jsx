import React from "react";
import "./GeneralInfoPage.css";
import {
  AlertTriangleIcon,
  CheckCircleIcon,
  GeneralInfoStarIcon,
  HeartIcon,
  SupportIcon,
  UsersIcon,
} from "../icons";

// --- Helper Icons (Self-contained SVGs, styled with a blue theme) ---

const GeneralInfoPage = () => {
  return (
    <>
      <div className="info-page">
        <div className="info-container">
          {/* --- Why Choose Us Section --- */}
          <section className="section">
            <h2 className="section-title">Why Choose Paradise WaterSports?</h2>
            <div className="why-choose-us-grid">
              <div className="info-card">
                <div className="info-card-icon">
                  <UsersIcon />
                </div>
                <h4>10+ Years</h4>
                <p>Of experience in watersports, scuba diving, and other adventure activities.</p>
              </div>
              <div className="info-card">
                <div className="info-card-icon">
                  <GeneralInfoStarIcon />
                </div>
                <h4>4.8 / 5.0</h4>
                <p>Cumulative ratings of our trips across all platforms.</p>
              </div>
              <div className="info-card">
                <div className="info-card-icon">
                  <HeartIcon />
                </div>
                <h4>Instructor-Led</h4>
                <p>Expert-guided trips with meticulous planning for your safety and enjoyment.</p>
              </div>
              <div className="info-card">
                <div className="info-card-icon">
                  <SupportIcon />
                </div>
                <h4>24/7 Support</h4>
                <p>We are always here to help you before, during, and after your trip.</p>
              </div>
            </div>
          </section>

          {/* --- Know Before You Go Section --- */}
          <section className="section">
            <h2 className="section-title">Know Before You Go</h2>
            <div className="know-before-grid">
              <div>
                <h3 className="list-title text-success">
                  <CheckCircleIcon /> What to Carry
                </h3>
                <ul className="info-list">
                  <li>Valid government-issued ID proof.</li>
                  <li>Comfortable swimwear and an extra pair of clothes.</li>
                  <li>Sunscreen, sunglasses, and a hat to protect from the sun.</li>
                  <li>A waterproof bag for your phone and valuables.</li>
                  <li>Towel for after your activities.</li>
                </ul>
              </div>
              <div>
                <h3 className="list-title text-danger">
                  <AlertTriangleIcon /> Important Precautions
                </h3>
                <ul className="info-list">
                  <li>Always listen carefully to the instructor's safety briefing.</li>
                  <li>Avoid consuming heavy meals or alcoholic beverages before activities.</li>
                  <li>
                    Inform our staff of any medical conditions like asthma, heart problems, etc.
                  </li>
                  <li>Do not wear loose jewelry or accessories during the activities.</li>
                  <li>
                    Cleanliness of the beach and sea is a shared responsibility. Please do not
                    litter.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* --- Cancellation Policy Section --- */}
          <section className="section">
            <h2 className="section-title">About booking & Liability Policy</h2>

            {/* Cancellation Policy */}
            <div className="policy-item">
              <h5>Booking Confirmation</h5>
              <p>
                Once a booking is confirmed, a handwritten booking bill will be sent via WhatsApp as
                proof.
              </p>
            </div>

            {/* Liability Disclaimer */}
            <div className="policy-item">
              <h5>Disclaimer for Personal Belongings</h5>
              <p>
                Please be advised that we are not responsible for the loss or damage of any personal
                belongings, such as jewelry, ornaments, or other precious items during any activity.
                We strongly recommend that you do not carry expensive items with you.{" "}
                <strong>
                  Participants are solely responsible for the safety of their valuables.
                </strong>
              </p>
            </div>

            {/* Optional Note */}
            <p className="text-muted mt-4">
              <strong>Important:</strong> Safety guidelines and instructions must be followed at all
              times. In case of unforeseen circumstances (e.g., weather conditions), activities may
              be altered or rescheduled for safety reasons.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default GeneralInfoPage;
