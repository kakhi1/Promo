// // import React, { createContext, useContext, useState, useEffect } from "react";

// // const AuthContext = createContext();

// // export const useAuth = () => {
// //   const context = useContext(AuthContext);
// //   if (context === undefined) {
// //     throw new Error("useAuth must be used within an AuthProvider");
// //   }
// //   return context;
// // };

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(() => {
// //     // Attempt to load user data from localStorage
// //     const savedUser = localStorage.getItem("user");
// //     return savedUser ? JSON.parse(savedUser) : null;
// //   });

// //   useEffect(() => {
// //     // Effect to run when the user state changes, e.g., to save user data to localStorage
// //     if (user) {
// //       localStorage.setItem("user", JSON.stringify(user));
// //       console.log("User logged in:", user);
// //       console.log("User role:", user.role); // Log the role for debugging
// //     } else {
// //       localStorage.removeItem("user");
// //     }
// //   }, [user]);

// //   const [isAuthenticated, setIsAuthenticated] = useState(user != null);

// //   const login = (userData) => {
// //     setIsAuthenticated(true);
// //     setUser(userData); // Assuming userData includes the entire entity object with role
// //   };

// //   const logout = () => {
// //     setIsAuthenticated(false);
// //     setUser(null);
// //     localStorage.removeItem("user"); // Ensure user data is cleared from localStorage on logout
// //   };

// //   return (
// //     <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

// import React, { createContext, useContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const verifyTokenAndLogin = async () => {
//       const token = localStorage.getItem("userToken");
//       console.log("Retrieved token from localStorage:", token);
//       if (!token) return;
//       console.log("Verifying token:", token);

//       try {
//         console.log("Sending token for verification");
//         const response = await fetch(
//           "http://localhost:5000/api/users/verify-Token",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         console.log("Token verification response status:", response.status);
//         if (!response.ok) throw new Error("Token validation failed");

//         const data = await response.json();
//         console.log("Token verification success, user data:", data);
//         login(data); // Assuming `data` is the user data you want to set
//       } catch (error) {
//         console.error("Token validation error:", error);
//         localStorage.removeItem("userToken"); // Clear the token if invalid
//       }
//     };

//     verifyTokenAndLogin();
//   }, []);

//   useEffect(() => {
//     // Effect to run when the user state changes, e.g., to save user data to localStorage
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user)); // Save user data for session persistence
//     } else {
//       localStorage.removeItem("user"); // Clear user data if logged out
//     }
//   }, [user]);

//   const login = (userData, rememberMe = false) => {
//     setUser(userData); // Set user data

//     if (rememberMe && userData.token) {
//       localStorage.setItem("userToken", userData.token); // Save the token if "Remember Me" is checked
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     localStorage.removeItem("userToken"); // Ensure token is cleared on logout
//   };

//   const isAuthenticated = !!user;

//   return (
//     <AuthContext.Provider
//       value={{ isAuthenticated, user, login, userRole, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Add userRole state

  useEffect(() => {
    const verifyTokenAndLogin = async () => {
      const token = localStorage.getItem("userToken");
      console.log("Retrieved token from localStorage:", token);
      if (!token) return;
      console.log("Verifying token:", token);

      try {
        console.log("Sending token for verification");
        const response = await fetch(
          "http://localhost:5000/api/users/verify-Token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Token verification response status:", response.status);
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
      localStorage.setItem("userToken", userData.token); // Save the token if "Remember Me" is checked
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null); // Clear user role on logout
    localStorage.removeItem("user");
    localStorage.removeItem("userToken"); // Ensure token is cleared on logout
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, userRole, login, logout }} // Include userRole in the context value
    >
      {children}
    </AuthContext.Provider>
  );
};
