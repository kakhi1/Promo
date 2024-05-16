import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const axiosInstance = axios.create({
  baseURL: "https://promo-iror.onrender.com/api",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null
  );
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    const fetchIPAndLogin = async () => {
      if (!token) {
        try {
          const ipResponse = await axios.get(
            "https://api.ipify.org?format=json"
          );
          const ip = ipResponse.data.ip;
          const { data } = await axiosInstance.post("/users/login-by-ip", {
            ip,
          });

          if (data.user && data.token) {
            setUser(data.user);
            setUserRole(data.user.role);

            // Storing the token securely
            setToken(data.token);
            sessionStorage.setItem("userToken", data.token); // Consider sessionStorage for less persistence
            sessionStorage.setItem("user", JSON.stringify(data.user));
            sessionStorage.setItem("userRole", data.user.role);
          }
        } catch (error) {
          console.error("Login by IP failed:", error);
        }
      }
    };

    // Check if a reload login should be performed
    if (sessionStorage.getItem("loginOnReload")) {
      sessionStorage.removeItem("loginOnReload");
    }
    fetchIPAndLogin();
  }, [token]);

  const clearCategoryAndTag = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const login = (userData) => {
    setUser(userData);
    setUserRole(userData.role);
    if (userData.token) {
      setToken(userData.token);
      localStorage.setItem("userToken", userData.token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", userData.role);
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRole");
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
