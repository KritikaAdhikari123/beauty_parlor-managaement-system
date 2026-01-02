import { useState } from "react";
import "./ContactUs.css";

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "", message: "" });
    }, 3000);
  };

  return (
    <div className="contact-us-page">
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Sujita Beauty Parlour</h1>
          <p className="tagline">We'd love to hear from you!</p>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <div className="info-card">
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <h3>Address</h3>
                <p>123 Beauty Street<br />Kathmandu, Nepal</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <h3>Phone</h3>
                <p>+977-1-1234567<br />+977-9841234567</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <h3>Email</h3>
                <p>info@sujitabeautyparlour.com<br />bookings@sujitabeautyparlour.com</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🕐</div>
              <div>
                <h3>Working Hours</h3>
                <p>Monday - Saturday: 9:00 AM - 6:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="success-message">
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+977-9841234567"
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              <button type="submit" className="btn-primary">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactUs;

