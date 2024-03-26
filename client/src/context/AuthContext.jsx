import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Axios instance for making API calls with automatic headers
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  useEffect(() => {
    const axiosInstance = axios.create();
    axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    // Set axiosInstance to state or context if needed
  }, [token]);
  const clearCategoryAndTag = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };
  useEffect(() => {
    const verifyTokenAndLogin = async () => {
      if (!token) return;

      try {
        console.log("Sending token for verification");
        const response = await fetch(
          "https://promo-iror.onrender.com/api/users/verify-Token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Token validation failed");

        const data = await response.json();
        console.log("Token verification success, user data:", data);
        setUser(data); // Set user data
        setUserRole(data.role); // Set user role
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("userToken"); // Clear the token if invalid
      }
    };

    verifyTokenAndLogin();
  }, []);

  useEffect(() => {
    // Effect to run when the user state changes, e.g., to save user data to localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user)); // Save user data for session persistence
    } else {
      localStorage.removeItem("user"); // Clear user data if logged out
    }
  }, [user]);

  const login = (userData, rememberMe = false) => {
    setUser(userData); // Set user data
    setUserRole(userData.role); // Set user role
    if (rememberMe && userData.token) {
      localStorage.setItem("userToken", userData.token);
      setToken(userData.token);
      // localStorage.setItem("user", JSON.stringify(entity));
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken"); // Ensure token is cleared on logout
    clearCategoryAndTag();
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userRole,
        token,
        login,
        logout,
        clearCategoryAndTag,
      }} // Include userRole in the context value
    >
      {children}
    </AuthContext.Provider>
  );
};
