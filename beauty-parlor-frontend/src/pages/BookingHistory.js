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

  const handleCancelRequest = async (bookingId) => {
    const reason = window.prompt("Please provide a reason for cancellation (optional):");
    if (reason === null) return; // User cancelled

    try {
      await cancelBooking(bookingId, { cancellation_reason: reason || null });
      setMessage("Cancellation request submitted. Waiting for admin approval.");
      fetchBookings();
      setTimeout(() => setMessage(""), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit cancellation request");
      setTimeout(() => setError(""), 5000);
    }
  };

  const canRequestCancel = (bookingDate, timeSlot, status) => {
    // Can only request cancellation if status is PENDING or CONFIRMED
    if (status === "CANCELLED" || status === "COMPLETED" || status === "CANCEL_REQUESTED") return false;
    const bookingDateTime = new Date(`${bookingDate} ${timeSlot}`);
    return bookingDateTime > new Date();
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      'PENDING': 'status-pending',
      'CONFIRMED': 'status-confirmed',
      'CANCEL_REQUESTED': 'status-cancel-requested',
      'CANCELLED': 'status-cancelled',
      'COMPLETED': 'status-completed'
    };
    return statusMap[status] || 'status-pending';
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'PENDING': 'Pending Confirmation',
      'CONFIRMED': 'Confirmed',
      'CANCEL_REQUESTED': 'Cancellation Requested',
      'CANCELLED': 'Cancelled',
      'COMPLETED': 'Completed'
    };
    return statusMap[status] || status;
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
                <span className={`status ${getStatusBadgeClass(booking.status)}`}>
                  {getStatusLabel(booking.status)}
                </span>
              </div>
              <div className="booking-details">
                <p><strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time_slot.substring(0, 5)}</p>
                <p><strong>Price:</strong> Rs. {booking.price_npr}</p>
                <p><strong>Duration:</strong> {booking.duration} minutes</p>
                {booking.stylist_name && (
                  <p><strong>Assigned Stylist:</strong> {booking.stylist_name}</p>
                )}
                <p><strong>Booked on:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                {booking.cancellation_reason && (
                  <p className="cancellation-reason"><strong>Cancellation Reason:</strong> {booking.cancellation_reason}</p>
                )}
              </div>
              {canRequestCancel(booking.booking_date, booking.time_slot, booking.status) && (
                <button
                  className="btn-cancel-request"
                  onClick={() => handleCancelRequest(booking.id)}
                >
                  Request Cancellation
                </button>
              )}
              {booking.status === 'CANCEL_REQUESTED' && (
                <p className="cancel-request-note">⏳ Your cancellation request is pending admin approval.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingHistory;

