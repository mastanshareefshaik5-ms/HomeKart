import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [loading, setLoading] = useState(false);

  // ===============================
  // LOGIN
  // ===============================

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      setUser(user);

      return {
        success: true,
        user,
      };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };

    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // REGISTER
  // ===============================

  const register = async (
    name,
    email,
    password
  ) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/register`,
        {
          name,
          email,
          password,
        }
      );

      return {
        success: true,
        message: response.data.message,
      };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };

    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // LOGOUT
  // ===============================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };


  // ===============================
  // CHECK LOGIN
  // ===============================

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}