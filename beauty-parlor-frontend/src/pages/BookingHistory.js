import { useState, useEffect } from "react";
import { getMyBookings, cancelBooking } from "../services/api";
import "./BookingHistory.css";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getMyBookings();
      setBookings(response.data.data);
    } catch (err) {
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId, bookingDate, timeSlot) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await cancelBooking(bookingId);
      setMessage("Booking cancelled successfully");
      fetchBookings();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
      setTimeout(() => setError(""), 3000);
    }
  };

  const canCancel = (bookingDate, timeSlot, status) => {
    if (status === "cancelled") return false;
    const bookingDateTime = new Date(`${bookingDate} ${timeSlot}`);
    return bookingDateTime > new Date();
  };

  if (loading) return <div className="loading">Loading bookings...</div>;

  return (
    <div className="booking-history">
      <h1>✨ My Bookings</h1>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 ? (
        <div className="no-bookings">You have no bookings yet.</div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.service_name}</h3>
                <span className={`status ${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time_slot.substring(0, 5)}</p>
                <p><strong>Price:</strong> Rs. {booking.price_npr}</p>
                <p><strong>Duration:</strong> {booking.duration} minutes</p>
                <p><strong>Booked on:</strong> {new Date(booking.created_at).toLocaleString()}</p>
              </div>
              {canCancel(booking.booking_date, booking.time_slot, booking.status) && (
                <button
                  className="btn-cancel"
                  onClick={() => handleCancel(booking.id, booking.booking_date, booking.time_slot)}
                >
                  Cancel Booking
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;

