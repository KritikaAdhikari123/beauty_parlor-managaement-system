import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      <div className="about-hero">
        <h1>✨ About Sujita Beauty Parlour</h1>
        <p className="tagline">Your Trusted Destination for Beauty & Wellness</p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Welcome to Sujita Beauty Parlour</h2>
          <p>
            At Sujita Beauty Parlour, we believe that beauty is an art form and every individual 
            deserves to look and feel their absolute best. With years of experience in the beauty 
            industry, we have been serving our valued clients with exceptional beauty and wellness 
            services in a warm, welcoming environment.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide premium beauty and wellness services that enhance your natural 
            beauty while ensuring your comfort and satisfaction. We are committed to using high-quality 
            products and staying updated with the latest beauty trends and techniques.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💆</div>
              <h3>Expert Stylists</h3>
              <p>Our team consists of certified and experienced beauty professionals</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Premium Products</h3>
              <p>We use only the finest quality products for all our services</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Latest Trends</h3>
              <p>Stay updated with the latest beauty and fashion trends</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Personalized Care</h3>
              <p>Each service is tailored to meet your unique needs and preferences</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h2>Our Services</h2>
          <p>
            We offer a comprehensive range of beauty and wellness services including:
          </p>
          <ul className="services-list">
            <li>Hair Services - Haircuts, coloring, styling, and spa treatments</li>
            <li>Facial & Skincare - Deep cleansing facials and skincare treatments</li>
            <li>Nail Services - Manicures, pedicures, and nail art</li>
            <li>Makeup Services - Bridal makeup, party makeup, and special occasion makeup</li>
            <li>Threading & Hair Removal - Professional threading services</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Visit Us</h2>
          <p>
            Experience the luxury of professional beauty services at Sujita Beauty Parlour. 
            Book your appointment today and let us help you look and feel beautiful!
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;

