// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// const PrivateRoute = ({ children, isAdminRoute = false }) => {
//   const { user } = useAuth();

//   // Redirect non-logged-in users
//   if (!user) return <Navigate to="/login" replace />;

//   // If it's an admin route and the logged-in user is not an admin, redirect to user area
//   if (isAdminRoute && !user.isAdmin)
//     return <Navigate to="/user-area" replace />;

//   // Otherwise, render the children components
//   return children;
// };

// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Updated PrivateRoute to accept an array of allowedRoles
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  // Redirect non-logged-in users
  if (!user) return <Navigate to="/login" replace />;

  // Check if the user's role is in the allowedRoles array
  if (!allowedRoles.includes(user.role)) {
    // Redirect to a default page based on the user's role, or a general page if role is unexpected
    const defaultRedirect =
      user.role === "admin"
        ? "/admin-area"
        : user.role === "brand"
        ? "/brand-area"
        : "/";
    return <Navigate to={defaultRedirect} replace />;
  }

  // Otherwise, render the children components
  return children;
};

export default PrivateRoute;
