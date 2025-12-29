import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Configure axios defaults
axios.defaults.baseURL = API_URL;
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Services
export const getServices = () => axios.get(`${API_URL}/services`);
export const getService = (id) => axios.get(`${API_URL}/services/${id}`);

// Availability
export const getAvailability = (serviceId, date) => {
  const params = date ? { date } : {};
  return axios.get(`${API_URL}/availability/service/${serviceId}`, { params });
};

// Bookings
export const createBooking = (data) => axios.post(`${API_URL}/bookings`, data);
export const getMyBookings = () => axios.get(`${API_URL}/bookings/my-bookings`);
export const cancelBooking = (id) => axios.put(`${API_URL}/bookings/${id}/cancel`);

// Admin
export const getDashboard = () => axios.get(`${API_URL}/admin/dashboard`);
export const getAllAppointments = (params) => axios.get(`${API_URL}/admin/appointments`, { params });
export const getBookingHistory = () => axios.get(`${API_URL}/admin/booking-history`);

// Service management (admin)
export const createService = (data) => axios.post(`${API_URL}/services`, data);
export const updateService = (id, data) => axios.put(`${API_URL}/services/${id}`, data);
export const deleteService = (id) => axios.delete(`${API_URL}/services/${id}`);

// Set availability (admin)
export const setAvailability = (data) => axios.post(`${API_URL}/availability`, data);
