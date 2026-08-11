
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD USER FROM LOCAL STORAGE
  // ==========================================

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        const parsedUser = JSON.parse(savedUser);

        console.log("AUTH USER:", parsedUser);
        console.log("AUTH ROLE:", parsedUser?.role);

        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("AUTH LOAD ERROR:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      console.log("LOGIN RESPONSE:", data);

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      const loggedInUser = data.user;

      if (!data.token || !loggedInUser) {
        return {
          success: false,
          message: "Invalid login response",
        };
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Save current user
      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      // Update React state
      setUser(loggedInUser);

      console.log("CURRENT USER:", loggedInUser);
      console.log("CURRENT ROLE:", loggedInUser.role);

      return {
        success: true,
        user: loggedInUser,
        token: data.token,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return {
        success: false,
        message: error.message || "Unable to login",
      };
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    console.log("LOGGING OUT USER");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // ==========================================
  // UPDATE USER
  // ==========================================

  const updateUser = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}