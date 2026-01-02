import "./Hero.css";

function Hero() {
  return (
    <div className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">✨ Sujita Beauty Parlour</h1>
        <p className="hero-tagline">Where Beauty Meets Elegance</p>
        <p className="hero-description">
          Experience luxury beauty services in a serene, welcoming environment. 
          Your journey to radiance begins here.
        </p>
        <a href="#services" className="hero-cta">
          Explore Our Services
        </a>
      </div>
    </div>
  );
}

export default Hero;

