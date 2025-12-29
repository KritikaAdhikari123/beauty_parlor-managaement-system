import axios from "axios";

const API_URL = "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Set up request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Set up response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Services
export const getServices = () => api.get("/services");
export const getService = (id) => api.get(`/services/${id}`);

// Availability
export const getAvailability = (serviceId, date) => {
  const params = date ? { date } : {};
  return api.get(`/availability/service/${serviceId}`, { params });
};

// Bookings
export const createBooking = (data) => api.post("/bookings", data);
export const getMyBookings = () => api.get("/bookings/my-bookings");
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Admin
export const getDashboard = () => api.get("/admin/dashboard");
export const getAllAppointments = (params) => api.get("/admin/appointments", { params });
export const getBookingHistory = () => api.get("/admin/booking-history");

// Service management (admin)
export const createService = (data) => api.post("/services", data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);

// Set availability (admin)
export const setAvailability = (data) => api.post("/availability", data);
