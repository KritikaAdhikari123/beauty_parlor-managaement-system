import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-us-page">
      {/* HERO SECTION */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Sujita Beauty Parlour</h1>
          <p className="tagline">Your Trusted Destination for Beauty & Wellness</p>
        </div>
      </div>

      <div className="about-content">
        {/* WELCOME SECTION */}
        <section className="about-section">
          <h2>Welcome to Sujita Beauty Parlour</h2>
          <p>
            At Sujita Beauty Parlour, we believe that beauty is an art form and every individual 
            deserves to look and feel their absolute best. With years of experience in the beauty 
            industry, we have been serving our valued clients with exceptional beauty and wellness 
            services in a warm, welcoming environment.
          </p>
        </section>

        {/* MISSION SECTION */}
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide premium beauty and wellness services that enhance your natural 
            beauty while ensuring your comfort and satisfaction. We are committed to using high-quality 
            products and staying updated with the latest beauty trends and techniques.
          </p>
        </section>

        {/* WHY CHOOSE US SECTION */}
        <section className="about-section">
          <h2>Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card stylists">
              <div className="feature-image"></div>
              <h3>Expert Stylists</h3>
              <p>Our team consists of certified and experienced beauty professionals</p>
            </div>

            <div className="feature-card premium">
              <div className="feature-image"></div>
              <h3>Premium Products</h3>
              <p>We use only the finest quality products for all our services</p>
            </div>

            <div className="feature-card trends">
              <div className="feature-image"></div>
              <h3>Latest Trends</h3>
              <p>Stay updated with the latest beauty and fashion trends</p>
            </div>

            <div className="feature-card care">
              <div className="feature-image"></div>
              <h3>Personalized Care</h3>
              <p>Each service is tailored to meet your unique needs and preferences</p>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION */}
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

        {/* VISIT US SECTION */}
        <section className="about-section visit-us-section">
          <div className="visit-text">
            <h2>Visit Us</h2>
            <p>
              Experience the luxury of professional beauty services at Sujita Beauty Parlour. 
              Book your appointment today and let us help you look and feel beautiful!
            </p>
            <p>
              <strong>Address:</strong> Sujata Beauty Parlour (Unisex), Battisputali, Kathmandu, Nepal
            </p>
          </div>

          <div className="visit-map">
            <iframe
              title="Sujita Beauty Parlour Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7237483.547866088!2d75.70059035970844!3d27.657714288052457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb19001ad2d843%3A0xa6ea3af609388276!2sSujata%20Beauty%20Parlour%20(Unisex)%2C%20Battisputali!5e0!3m2!1sen!2snp!4v1767416411965!5m2!1sen!2snp"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
