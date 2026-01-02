import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./ServiceCard.css";

function ServiceCard({ service, onBook }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBookClick = () => {
    if (!user) {
      navigate(`/login?redirect=/user/book/${service.id}`);
    } else {
      onBook();
    }
  };

  // Default beauty images - high quality beauty parlour images
  const defaultImages = {
    'Haircut': 'https://images.unsplash.com/photo-1560869713-7d0a0a3e4e5f?w=600&h=400&fit=crop&q=80',
    'Hair Color': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop&q=80',
    'Facial': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop&q=80',
    'Manicure': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop&q=80',
    'Pedicure': 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&h=400&fit=crop&q=80',
    'Hair Spa': 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop&q=80',
    'Bridal Makeup': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=400&fit=crop&q=80',
    'Threading': 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=400&fit=crop&q=80'
  };

  const serviceImage = service.image_url || defaultImages[service.name] || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop&q=80';

  return (
    <div className="service-card">
      <div className="service-image-container">
        <img src={serviceImage} alt={service.name} className="service-image" />
        <div className="service-image-overlay"></div>
        {service.category && (
          <span className="category-badge-overlay">{service.category}</span>
        )}
      </div>
      <div className="service-content">
        <div className="service-header">
          <h3>{service.name}</h3>
          <div className="service-price">Rs. {service.price_npr}</div>
        </div>
        <p className="service-description">{service.description || "Premium beauty service"}</p>
        <div className="service-details">
          <span className="duration">⏱️ {service.duration} minutes</span>
        </div>
        <button className="btn-book" onClick={handleBookClick}>
          {user ? "Book Now" : "Login / Book Now"}
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
