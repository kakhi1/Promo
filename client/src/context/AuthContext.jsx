import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  console.log("Current user in useAuth:", context.user);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Attempt to load user data from localStorage or another storage mechanism
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(user != null);

  // Effect to run when the user state changes, e.g., to save user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("user");
      setIsAuthenticated(false);
    }
  }, [user]);

  const login = (userData) => {
    if (userData) {
      setIsAuthenticated(true);
      setUser(userData);
      console.log("User logged in:", userData);
    } else {
      console.error("No user data to set");
    }
  };

  const logout = () => {
    setUser(null); // Clears the user state, which will also update isAuthenticated due to the useEffect above
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
