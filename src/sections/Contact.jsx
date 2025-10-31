import React, { useState } from "react";
import "../styles/contact.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Your actual contact information - UPDATE THESE WITH YOUR REAL INFO
  const contactInfo = {
    email: "kp@avanienterprises.in", // Replace with your real email
    phone: "+919253625099", // Replace with your real phone number (with country code)
    whatsapp: "+919253625099", // Replace with your real WhatsApp number
    address: "Block C - sector 49 gurugram",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to send email using EmailJS or form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Method 1: Using mailto link (simple but less reliable)
    const subject = encodeURIComponent(
      formData.subject || `Contact from ${formData.name}`
    );
    const body = encodeURIComponent(`
Name: ${formData.name}
Email: ${formData.email}
Company: ${formData.company}
Message: ${formData.message}
    `);

    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;

    setIsLoading(false);
    setIsSubmitted(true);

    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });

    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  // Function to open WhatsApp with pre-filled message
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hello Kapil! I'm interested in your services. Please contact me back.`
    );
    window.open(
      `https://wa.me/${contactInfo.whatsapp}?text=${message}`,
      "_blank"
    );
  };

  // Function to make phone call
  const handlePhoneClick = () => {
    window.open(`tel:${contactInfo.phone}`, "_self");
  };

  // Function to open email client
  const handleEmailClick = () => {
    window.location.href = `mailto:${contactInfo.email}`;
  };

  return (
    <section id="contact" className="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h3 className="section-label">KAPIL KHANDELWAL / CONNECT</h3>
          <h1 className="section-title">
            CONTACT ME
          </h1>
          <p className="contact-description">
            Ready to transform your business? Let's discuss how we can work
            together to achieve your goals and drive meaningful growth.
          </p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <p>
              I'm always interested in new opportunities and partnerships.
              Whether you need business consulting, strategic advice, or want to
              discuss potential collaborations, feel free to reach out.
            </p>

            <div className="contact-methods">
              <div
                className="contact-method"
                onClick={handleEmailClick}
                style={{ cursor: "pointer" }}
              >
                <div className="method-icon">📧</div>
                <div className="method-content">
                  <h4>Email</h4>
                  <p>{contactInfo.email}</p>
                </div>
              </div>

              <div
                className="contact-method"
                onClick={handlePhoneClick}
                style={{ cursor: "pointer" }}
              >
                <div className="method-icon">📱</div>
                <div className="method-content">
                  <h4>Phone</h4>
                  <p>{contactInfo.phone}</p>
                </div>
              </div>

              <div
                className="contact-method"
                onClick={handleWhatsAppClick}
                style={{ cursor: "pointer" }}
              >
                <div className="method-icon">💬</div>
                <div className="method-content">
                  <h4>WhatsApp</h4>
                  <p>Message me directly</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">🏢</div>
                <div className="method-content">
                  <h4>Office</h4>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <button
                className="social-link"
                onClick={handleEmailClick}
                aria-label="Email"
              >
                ✉️
              </button>
              <button
                className="social-link"
                onClick={handleWhatsAppClick}
                aria-label="WhatsApp"
              >
                💬
              </button>
              <button
                className="social-link"
                onClick={handlePhoneClick}
                aria-label="Phone"
              >
                📞
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h3>Send a Message</h3>
            <form onSubmit={handleEmailSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company">Company</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Your company name"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="consulting">Business Consulting</option>
                    <option value="podcast">Podcast Promotion</option>
                    <option value="partnership">Partnership</option>
                    <option value="investment">Investment Opportunity</option>
                    <option value="speaking">Speaking Engagement</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project or how I can help..."
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? "SENDING..." : "SEND MESSAGE VIA EMAIL"}
              </button>

              <button
                type="button"
                className="submit-btn professional-btn-secondary"
                onClick={handleWhatsAppClick}
                style={{ marginTop: "10px" }}
              >
                💬 MESSAGE ON WHATSAPP
              </button>

              {isSubmitted && (
                <div className="success-message">
                  ✅ Success! Your email client should open with the message
                  pre-filled. Please click send to deliver your message.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
