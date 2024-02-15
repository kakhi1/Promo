// PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { user } = useAuth();

//   return user ? children : <Navigate to="/user-area" replace />;
// };
// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminRoute = false }) => {
  const { user } = useAuth();

  // Redirect non-authenticated users
  if (!user) return <Navigate to="/" replace />;

  // Redirect non-admin users trying to access admin routes
  if (adminRoute && !user.isAdmin) return <Navigate to="/user-area" replace />;

  // Allow access to the route
  return children;
};

export default PrivateRoute;
