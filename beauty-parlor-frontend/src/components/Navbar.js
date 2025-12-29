import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Beauty Parlor
        </Link>
        <div className="nav-links">
          {user.role === "admin" ? (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
            </>
          ) : (
            <>
              <Link to="/user/services">Services</Link>
              <Link to="/user/bookings">My Bookings</Link>
            </>
          )}
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
