import { useState, useEffect } from "react";
import { getDashboard, getAllAppointments } from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: "", date: "" });

  useEffect(() => {
    fetchDashboard();
    fetchAppointments();
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

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1>✨ Sujita Beauty Parlour - Admin Dashboard</h1>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">{stats.totalBookings}</p>
          </div>
          <div className="stat-card">
            <h3>Upcoming Appointments</h3>
            <p className="stat-number">{stats.upcomingAppointments}</p>
          </div>
          <div className="stat-card">
            <h3>Cancelled Appointments</h3>
            <p className="stat-number">{stats.cancelledAppointments}</p>
          </div>
        </div>
      )}

      <div className="filters">
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => setFilter({ ...filter, date: e.target.value })}
        />
      </div>

      <div className="appointments-section">
        <h2>All Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Price</th>
                <th>Status</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td>{apt.user_name} ({apt.user_email})</td>
                  <td>{apt.service_name}</td>
                  <td>{new Date(apt.booking_date).toLocaleDateString()}</td>
                  <td>{apt.time_slot.substring(0, 5)}</td>
                  <td>Rs. {apt.price_npr}</td>
                  <td><span className={`status ${apt.status}`}>{apt.status}</span></td>
                  <td>{new Date(apt.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
