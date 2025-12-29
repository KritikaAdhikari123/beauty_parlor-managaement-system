import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getService, getAvailability, createBooking } from "../services/api";
import "./BookingForm.css";

function BookingForm() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate, serviceId]);

  const fetchService = async () => {
    try {
      const response = await getService(serviceId);
      setService(response.data.data);
    } catch (err) {
      setError("Failed to load service details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await getAvailability(serviceId, selectedDate);
      setAvailableSlots(response.data.data);
      setSelectedTime("");
    } catch (err) {
      setError("Failed to load available time slots");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createBooking({
        service_id: parseInt(serviceId),
        booking_date: selectedDate,
        time_slot: selectedTime
      });
      setSuccess("Booking confirmed successfully!");
      setTimeout(() => {
        navigate("/user/bookings");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split("T")[0];
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!service) return <div className="error">Service not found</div>;

  return (
    <div className="booking-form-container">
      <div className="booking-form-card">
        <h2>Book {service.name}</h2>
        <div className="service-info">
          <p><strong>Price:</strong> Rs. {service.price_npr}</p>
          <p><strong>Duration:</strong> {service.duration} minutes</p>
          {service.description && <p><strong>Description:</strong> {service.description}</p>}
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              required
            />
          </div>

          {selectedDate && (
            <div className="form-group">
              <label>Select Time</label>
              {availableSlots.length > 0 ? (
                <div className="time-slots">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className={`time-slot-btn ${selectedTime === slot.time_slot ? "selected" : ""}`}
                      onClick={() => setSelectedTime(slot.time_slot)}
                    >
                      {slot.time_slot.substring(0, 5)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-slots">No available time slots for this date</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || !selectedDate || !selectedTime}
          >
            {submitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>

        <button
          className="btn-secondary"
          onClick={() => navigate("/user/services")}
        >
          Back to Services
        </button>
      </div>
    </div>
  );
}

export default BookingForm;
