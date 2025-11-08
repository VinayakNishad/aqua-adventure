import React from 'react';

// --- Helper Icons (Self-contained SVGs, styled with a blue theme) ---
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

const GeneralInfoPage = () => {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
                
                .info-page {
                    font-family: 'Poppins', sans-serif;
                    background-color: #ffffffff;
                    color: #333;
                }

                .info-container {
                    max-width: 960px;
                    margin: auto;
                    padding: 3rem 1rem;
                }

                .section {
                    background: #fff;
                    border-radius: 12px;
                    padding: 2.5rem;
                    margin-bottom: 2.5rem;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
                }

                .section-title {
                    text-align: center;
                    font-size: 2rem;
                    font-weight: 700;
                    color: #0056b3;
                    margin-bottom: 2rem;
                }

                /* Why Choose Us Section */
                .why-choose-us-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem; 
                    text-align: center;
                }
                @media (min-width: 576px) { .why-choose-us-grid { grid-template-columns: 1fr 1fr; } }
                @media (min-width: 992px) { .why-choose-us-grid { grid-template-columns: 1fr 1fr 1fr 1fr; } }

                .info-card {
                    padding: 1rem; /* ✅ FIX: Reduced padding to give content more space */
                }
                .info-card-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background-color: #e6f0ff;
                    color: #0056b3;
                    border-radius: 50%;
                    margin-bottom: 1rem;
                }
                .info-card h4 { font-size: 1.25rem; font-weight: 600; }
                .info-card p { 
                    color: #6c757d; 
                    word-wrap: break-word; /* ✅ FIX: Ensure long words don't cause overflow */
                }

                /* Know Before You Go Section */
                .know-before-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2.5rem;
                }
                @media (min-width: 768px) { .know-before-grid { grid-template-columns: 1fr 1fr; } }

                .list-title {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                .list-title .text-success { color: #198754; }
                .list-title .text-danger { color: #dc3545; }

                .info-list {
                    list-style: none;
                    padding-left: 0;
                }
                .info-list li {
                    padding-left: 2rem;
                    position: relative;
                    margin-bottom: 0.75rem;
                    color: #555;
                }
                .info-list li::before {
                    content: '✔';
                    position: absolute;
                    left: 0;
                    color: #0056b3;
                    font-weight: bold;
                }

                /* Cancellation Policy Section */
                .policy-item {
                    border-left: 4px solid #0056b3;
                    padding-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                .policy-item h5 { font-weight: 600; }
                .policy-item p { color: #6c757d; margin: 0; }
            `}</style>
            <div className="info-page">
                <div className="info-container">

                    {/* --- Why Choose Us Section --- */}
                    <section className="section" data-aos="fade-up">
                        <h2 className="section-title" data-aos="fade-up">Why Choose Paradise WaterSports?</h2>
                        <div className="why-choose-us-grid">
                            <div className="info-card" data-aos="fade-up">
                                <div className="info-card-icon"><UsersIcon /></div>
                                <h4>10+ Years</h4>
                                <p>Of experience in watersports, scuba diving, and other adventure activities.</p>
                            </div>
                            <div className="info-card" data-aos="fade-up">
                                <div className="info-card-icon"><StarIcon /></div>
                                <h4>4.8 / 5.0</h4>
                                <p>Cumulative ratings of our trips across all platforms.</p>
                            </div>
                            <div className="info-card" data-aos="fade-up">
                                <div className="info-card-icon"><HeartIcon /></div>
                                <h4>Instructor-Led</h4>
                                <p>Expert-guided trips with meticulous planning for your safety and enjoyment.</p>
                            </div>
                            <div className="info-card" data-aos="fade-up">
                                <div className="info-card-icon"><SupportIcon /></div>
                                <h4>24/7 Support</h4>
                                <p>We are always here to help you before, during, and after your trip.</p>
                            </div>
                        </div>
                    </section>

                    {/* --- Know Before You Go Section --- */}
                    <section className="section" data-aos="fade-up">
                        <h2 className="section-title" data-aos="fade-up">Know Before You Go</h2>
                        <div className="know-before-grid">
                            <div>
                                <h3 className="list-title text-success"><CheckCircleIcon /> What to Carry</h3>
                                <ul className="info-list" data-aos="fade-up">
                                    <li>Valid government-issued ID proof.</li>
                                    <li>Comfortable swimwear and an extra pair of clothes.</li>
                                    <li>Sunscreen, sunglasses, and a hat to protect from the sun.</li>
                                    <li>A waterproof bag for your phone and valuables.</li>
                                    <li>Towel for after your activities.</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="list-title text-danger" data-aos="fade-up"><AlertTriangleIcon /> Important Precautions</h3>
                                <ul className="info-list" data-aos="fade-up">
                                    <li>Always listen carefully to the instructor's safety briefing.</li>
                                    <li>Avoid consuming heavy meals or alcoholic beverages before activities.</li>
                                    <li>Inform our staff of any medical conditions like asthma, heart problems, etc.</li>
                                    <li>Do not wear loose jewelry or accessories during the activities.</li>
                                    <li>Cleanliness of the beach and sea is a shared responsibility. Please do not litter.</li>
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
                                Once a booking is confirmed, a handwritten booking bill will be sent via WhatsApp as proof.
                           
                            </p>
                        </div>

                        {/* Liability Disclaimer */}
                        <div className="policy-item">
                            <h5>Disclaimer for Personal Belongings</h5>
                            <p>
                                Please be advised that we are not responsible for the loss or damage of any personal belongings, such as jewelry, ornaments, or other precious items during any activity. We strongly recommend that you do not carry expensive items with you. <strong>Participants are solely responsible for the safety of their valuables.</strong>
                            </p>
                        </div>

                        {/* Optional Note */}
                        <p className="text-muted mt-4">
                            <strong>Important:</strong> Safety guidelines and instructions must be followed at all times.
                            In case of unforeseen circumstances (e.g., weather conditions), activities may be altered or rescheduled for safety reasons.
                        </p>
                    </section>


                </div>
            </div>
        </>
    );
};

export default GeneralInfoPage;

