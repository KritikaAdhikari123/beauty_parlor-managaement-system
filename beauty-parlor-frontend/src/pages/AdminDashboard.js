import { useState, useEffect } from "react";
import {
  getDashboard,
  getAllAppointments,
  updateBookingStatus,
  getStaff
} from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", date: "" });
  const [message, setMessage] = useState("");
  const [updatingBookingId, setUpdatingBookingId] = useState(null);

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
      const res = await getDashboard();
      setStats(res.data.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.date) params.date = filter.date;

      const res = await getAllAppointments(params);
      setAppointments(res.data.data);
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await getStaff();
      setStaff(res.data.data);
    } catch (err) {
      console.error("Failed to load staff", err);
    }
  };

  const handleStatusChange = async (bookingId, status, stylistId = null) => {
    setUpdatingBookingId(bookingId);
    setMessage("");

    const payload = { status };
    if (stylistId) payload.stylist_id = stylistId;

    try {
      const res = await updateBookingStatus(bookingId, payload);
      const updatedBooking = res.data.booking;

      setAppointments(prev =>
        prev.map(apt =>
          apt.id === bookingId ? { ...apt, ...updatedBooking } : apt
        )
      );

      setMessage(`✅ Booking updated to ${getStatusLabel(status)}`);
      await Promise.all([fetchDashboard(), fetchAppointments()]);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("Update failed", err);
      fetchAppointments();
      setMessage("❌ Failed to update booking");
      setTimeout(() => setMessage(""), 4000);
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const getStatusBadgeClass = status => {
    const map = {
      PENDING: "status-pending",
      CONFIRMED: "status-confirmed",
      CANCEL_REQUESTED: "status-cancel-requested",
      CANCELLED: "status-cancelled",
      COMPLETED: "status-completed"
    };
    return map[status] || "status-pending";
  };

  const getStatusLabel = status => {
    const map = {
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      CANCEL_REQUESTED: "Cancel Requested",
      CANCELLED: "Cancelled",
      COMPLETED: "Completed"
    };
    return map[status] || status;
  };

  const getAvailableActions = booking => {
    const actions = [];
    if (booking.status === "PENDING") {
      actions.push({ label: "Confirm", status: "CONFIRMED", color: "green" });
      actions.push({ label: "Reject", status: "CANCELLED", color: "red" });
    }
    if (booking.status === "CONFIRMED") {
      actions.push({ label: "Mark Completed", status: "COMPLETED", color: "blue" });
      actions.push({ label: "Cancel", status: "CANCELLED", color: "red" });
    }
    if (booking.status === "CANCEL_REQUESTED") {
      actions.push({ label: "Approve Cancellation", status: "CANCELLED", color: "orange" });
      actions.push({ label: "Reject Request", status: "CONFIRMED", color: "green" });
    }
    return actions;
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Sujita Beauty Parlour - Admin Dashboard</h1>
        <p className="admin-subtitle">Manage bookings, services, and staff</p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className={`admin-message ${message.includes("❌") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      {/* DASHBOARD STATS */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Total Bookings</h2>
            <p className="stat-number">{stats.totalBookings}</p>
          </div>
          <div className="stat-card">
            <h2>Pending</h2>
            <p className="stat-number">{appointments.filter(a => a.status === "PENDING").length}</p>
          </div>
          <div className="stat-card">
            <h2>Confirmed</h2>
            <p className="stat-number">{appointments.filter(a => a.status === "CONFIRMED").length}</p>
          </div>
          <div className="stat-card">
            <h2>Cancel Requests</h2>
            <p className="stat-number">{appointments.filter(a => a.status === "CANCEL_REQUESTED").length}</p>
          </div>
        </div>
      )}

      {/* FILTERS */}
      <div className="filters-section">
        <h2>Booking Management</h2>
        <div className="filters">
          <select
            value={filter.status}
            onChange={e => setFilter({ ...filter, status: e.target.value })}
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
            onChange={e => setFilter({ ...filter, date: e.target.value })}
          />
        </div>
      </div>

      {/* BOOKINGS TABLE */}
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
                {appointments.map(apt => {
                  const actions = getAvailableActions(apt);
                  const isUpdating = updatingBookingId === apt.id;

                  return (
                    <tr key={apt.id}>
                      <td>
                        <strong>{apt.user_name}</strong>
                        <div className="customer-email">{apt.user_email}</div>
                      </td>

                      <td>{apt.service_name}</td>

                      <td>
                        <strong>{new Date(apt.booking_date).toLocaleDateString()}</strong>
                        <div>{apt.time_slot.slice(0, 5)}</div>
                      </td>

                      {/* ✅ FIXED STYLIST COLUMN */}
                      <td>
                        {apt.stylist_name ? (
                          <span>{apt.stylist_name}</span>
                        ) : (
                          <select
                            className="stylist-select"
                            onChange={e =>
                              e.target.value &&
                              handleStatusChange(apt.id, apt.status, e.target.value)
                            }
                          >
                            <option value="">Assign Stylist</option>
                            {staff.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        )}
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
                            actions.map((a, i) => (
                              <button
                                key={i}
                                className={`btn-action btn-${a.color}`}
                                disabled={isUpdating}
                                onClick={() => handleStatusChange(apt.id, a.status)}
                              >
                                {isUpdating ? "Updating..." : a.label}
                              </button>
                            ))
                          ) : (
                            <span className="no-actions">No actions</span>
                          )}

                          {apt.status === "CANCEL_REQUESTED" && apt.cancellation_reason && (
                            <div
                              className="cancel-reason-tooltip"
                              title={apt.cancellation_reason}
                            >
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
