// // PrivateRoute.jsx
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

const PrivateRoute = ({ children, isAdminRoute = false }) => {
  const { user } = useAuth();

  // Redirect non-logged-in users
  if (!user) return <Navigate to="/login" replace />;

  // If it's an admin route and the logged-in user is not an admin, redirect to user area
  if (isAdminRoute && !user.isAdmin)
    return <Navigate to="/user-area" replace />;

  // Otherwise, render the children components
  return children;
};

export default PrivateRoute;
