import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getServices } from "../services/api";
import ServiceCard from "../components/ServiceCard";
import "./Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getServices();
      setServices(response.data.data);
    } catch (err) {
      setError("Failed to load services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="services-page">
      <div className="services-header">
        <h1>✨ Our Premium Services</h1>
        <p>Indulge in luxury and choose a service to book your appointment</p>
      </div>
      <div className="services-grid">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBook={() => navigate(`/user/book/${service.id}`)}
          />
        ))}
      </div>
      {services.length === 0 && (
        <div className="no-services">No services available at the moment.</div>
      )}
    </div>
  );
}

export default Services;
