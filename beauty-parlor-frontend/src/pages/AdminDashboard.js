import { useState, useEffect } from "react";
import { getDashboard, getAllAppointments, updateBookingStatus, getStaff } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", date: "" });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchDashboard();
    fetchAppointments();
    fetchStaff();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      setStats(response.data.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.date) params.date = filter.date;
      
      const response = await getAllAppointments(params);
      setAppointments(response.data.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await getStaff();
      setStaff(response.data.data);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus, stylistId = null) => {
    try {
      await updateBookingStatus(bookingId, { status: newStatus, stylist_id: stylistId });
      setMessage(`Booking status updated to ${newStatus}`);
      setShowStatusModal(false);
      setSelectedBooking(null);
      fetchAppointments();
      fetchDashboard();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update booking status");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const openStatusModal = (booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
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
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'CANCEL_REQUESTED': 'Cancel Requested',
      'CANCELLED': 'Cancelled',
      'COMPLETED': 'Completed'
    };
    return statusMap[status] || status;
  };

  const getAvailableActions = (booking) => {
    const actions = [];
    if (booking.status === 'PENDING') {
      actions.push({ label: 'Confirm', status: 'CONFIRMED', color: 'green' });
      actions.push({ label: 'Reject', status: 'CANCELLED', color: 'red' });
    }
    if (booking.status === 'CONFIRMED') {
      actions.push({ label: 'Mark Completed', status: 'COMPLETED', color: 'blue' });
      actions.push({ label: 'Cancel', status: 'CANCELLED', color: 'red' });
    }
    if (booking.status === 'CANCEL_REQUESTED') {
      actions.push({ label: 'Approve Cancellation', status: 'CANCELLED', color: 'orange' });
      actions.push({ label: 'Reject Cancellation', status: 'CONFIRMED', color: 'green' });
    }
    return actions;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Sujita Beauty Parlour - Admin Dashboard</h1>
        <p className="admin-subtitle">Manage bookings, services, and staff</p>
      </div>

      {message && (
        <div className={`admin-message ${message.includes('Failed') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Total Bookings</h2>
            <p className="stat-number">{stats.totalBookings}</p>
          </div>
          <div className="stat-card">
            <h2>Pending Confirmation</h2>
            <p className="stat-number">{appointments.filter(a => a.status === 'PENDING').length}</p>
          </div>
          <div className="stat-card">
            <h2>Confirmed</h2>
            <p className="stat-number">{appointments.filter(a => a.status === 'CONFIRMED').length}</p>
          </div>
          <div className="stat-card"> 
            <h2>Cancellation Requests</h2>
            <p className="stat-number">{appointments.filter(a => a.status === 'CANCEL_REQUESTED').length}</p>
          </div>
        </div>
      )}

      <div className="filters-section">
        <h2>Booking Management</h2>
        <div className="filters">
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCEL_REQUESTED">Cancel Requested</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
            placeholder="Filter by date"
          />
        </div>
      </div>

      <div className="appointments-section">
        <h2>All Bookings</h2>
        {appointments.length === 0 ? (
          <div className="no-appointments">No appointments found</div>
        ) : (
          <div className="bookings-table-container">
            <table className="appointments-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Stylist</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => {
                  const actions = getAvailableActions(apt);
                  return (
                    <tr key={apt.id}>
                      <td>
                        <div className="customer-info">
                          <strong>{apt.user_name}</strong>
                          <span className="customer-email">{apt.user_email}</span>
                        </div>
                      </td>
                      <td>{apt.service_name}</td>
                      <td>
                        <div className="datetime-info">
                          <strong>{new Date(apt.booking_date).toLocaleDateString()}</strong>
                          <span>{apt.time_slot.substring(0, 5)}</span>
                        </div>
                      </td>
                      <td>
                        {apt.stylist_name || (
                          <select
                            className="stylist-select"
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusChange(apt.id, apt.status, e.target.value);
                              }
                            }}
                          >
                            <option value="">Assign Stylist</option>
                            {staff.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        )}
                        {apt.stylist_name && <span>{apt.stylist_name}</span>}
                      </td>
                      <td>Rs. {apt.price_npr}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(apt.status)}`}>
                          {getStatusLabel(apt.status)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {actions.length > 0 ? (
                            actions.map((action, idx) => (
                              <button
                                key={idx}
                                className={`btn-action btn-${action.color}`}
                                onClick={() => handleStatusChange(apt.id, action.status)}
                              >
                                {action.label}
                              </button>
                            ))
                          ) : (
                            <span className="no-actions">No actions</span>
                          )}
                          {apt.status === 'CANCEL_REQUESTED' && apt.cancellation_reason && (
                            <div className="cancel-reason-tooltip" title={apt.cancellation_reason}>
                              ℹ️ Reason
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
