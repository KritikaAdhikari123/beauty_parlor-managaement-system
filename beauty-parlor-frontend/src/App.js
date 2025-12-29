import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// Pages
import Login from "./components/Login";
import Register from "./components/Register";
import Services from "./pages/Services";
import BookingForm from "./components/BookingForm";
import BookingHistory from "./pages/BookingHistory";
import AdminDashboard from "./pages/AdminDashboard";

import "./styles.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/user/services"
            element={
              <ProtectedRoute>
                <Services />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/book/:serviceId"
            element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookings"
            element={
              <ProtectedRoute>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
