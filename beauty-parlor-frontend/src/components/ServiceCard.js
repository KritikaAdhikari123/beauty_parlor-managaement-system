import "./ServiceCard.css";

function ServiceCard({ service, onBook }) {
  return (
    <div className="service-card">
      <div className="service-header">
        <h3>{service.name}</h3>
        <div className="service-price">Rs. {service.price_npr}</div>
      </div>
      <p className="service-description">{service.description || "No description available"}</p>
      <div className="service-details">
        <span className="duration">⏱️ {service.duration} minutes</span>
      </div>
      <button className="btn-book" onClick={onBook}>
        Book Now
      </button>
    </div>
  );
}

export default ServiceCard;
