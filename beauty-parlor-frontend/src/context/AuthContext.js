import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:5001/api";

// Create axios instance for auth
const authApi = axios.create({
  baseURL: API_URL,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Clear any existing session before logging in (prevent multiple accounts)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      const response = await authApi.post("/auth/login", {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Store new session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed"
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Clear any existing session before registering (prevent multiple accounts)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      const response = await authApi.post("/auth/register", {
        name,
        email,
        password
      });

      const { token, user } = response.data;
      
      // Store new session
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed"
      };
    }
  };

  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // Note: Navigation is handled by the component calling logout
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
