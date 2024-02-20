// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     // Attempt to load user data from localStorage or another storage mechanism
//     const savedUser = localStorage.getItem("user");
//     return savedUser ? JSON.parse(savedUser) : null;
//   });
//   useEffect(() => {
//     console.log("Current user role:", user?.role);
//   }, [user]);
//   const [isAuthenticated, setIsAuthenticated] = useState(user != null);

//   // Effect to run when the user state changes, e.g., to save user data to localStorage
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//       setIsAuthenticated(true);
//     } else {
//       localStorage.removeItem("user");
//       setIsAuthenticated(false);
//     }

//     // Print to console to check if the user is admin
//     console.log("Current user isAdmin:", user?.isAdmin);
//   }, [user]);

//   const login = (userData) => {
//     if (userData) {
//       setIsAuthenticated(true);
//       setUser(userData);
//       console.log("User logged in:", userData);
//       console.log("User role:", userData.role);
//     } else {
//       console.error("No user data to set");
//     }
//   };

//   const logout = () => {
//     setUser(null); // Clears the user state, which will also update isAuthenticated due to the useEffect above
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Attempt to load user data from localStorage
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Effect to run when the user state changes, e.g., to save user data to localStorage
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      console.log("User logged in:", user);
      console.log("User role:", user.role); // Log the role for debugging
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const [isAuthenticated, setIsAuthenticated] = useState(user != null);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData); // Assuming userData includes the entire entity object with role
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user"); // Ensure user data is cleared from localStorage on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
