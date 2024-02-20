// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import PrivateRoute from "./components/PrivateRoute";
// import Header from "./components/Header";
// import Home from "./components/Home";
// import Modal from "./components/Modal";
// import LoginForm from "./components/LoginForm";
// import RegisterForm from "./components/RegisterForm";
// import Brands from "./components/Brands";
// import Categories from "./components/Categories";
// import About from "./components/About";
// import UserArea from "./components/UserArea";
// import { useAuth } from "./context/AuthContext";
// import "./index.css"; // Assuming Tailwind CSS is being used
// import Footer from "./components/Footer";
// import Admin from "./components/Admin";
// import Ads from "./components/Ads";
// import Offers from "./components/Offers";
// import Adbrands from "./components/Adbrands";
// import UserArea from "./components/UserArea";
// function App() {
//   const [isLoginOpen, setIsLoginOpen] = useState(false);
//   const [isRegisterOpen, setIsRegisterOpen] = useState(false);
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const { user } = useAuth(); // Assuming `useAuth` provides user state and auth functions

//   // Close modals and navigate to user area on successful login
//   const handleLoginSuccess = () => {
//     setIsLoginOpen(false); // Close login modal
//     // Logic for navigating to the user area after login should be handled within LoginForm
//     // This is a placeholder for any additional logic you might want to run on login success
//   };

//   // Automatically redirect authenticated users to the user area
//   useEffect(() => {
//     if (user) {
//       // If there is a user, then close all modals just in case they are open
//       setIsLoginOpen(false);
//       setIsRegisterOpen(false);
//     }
//   }, [user]);
//   const RootRedirect = () => {
//     const { user } = useAuth();
//   };

//   const handleCategoriesOpen = () => {
//     setIsCategoriesOpen(true);
//   };

//   // Optional: Handler for closing Categories modal (can be passed to Categories component if needed)
//   const handleCategorySelect = () => {
//     setIsCategoriesOpen(false); // Close Categories modal on category selection
//   };

//   return (
//     <Router>
//       <div className="min-h-screen">
//         <Header
//           onLoginClick={() => setIsLoginOpen(true)}
//           onCategoriesClick={handleCategoriesOpen}
//         />
//         <main className="py-5">
//           <Routes>
//             <Route
//               path="/"
//               element={
//                 user ? (
//                   user.isAdmin ? (
//                     <Navigate to="/admin-area" />
//                   ) : (
//                     <Navigate to="/user-area" />
//                   )
//                 ) : (
//                   <Home />
//                 )
//               }
//             />
//             <Route path="/offers" element={<Offers />} />
//             <Route path="/ads" element={<Ads />} />
//             <Route path="/adbrands" element={<Adbrands />} />
//             <Route path="/brands" element={<Brands />} />
//             <Route path="/categories" element={<Categories />} />
//             <Route path="/about" element={<About />} />
//             <Route
//               path="/admin-area"
//               element={
//                 <PrivateRoute isAdminRoute={true}>
//                   <Admin />
//                 </PrivateRoute>
//               }
//             />

//             <Route
//               path="/user-area"
//               element={
//                 <PrivateRoute>
//                   <UserArea />
//                 </PrivateRoute>
//               }
//             />
//           </Routes>
//         </main>

//         {isLoginOpen && (
//           <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
//             <LoginForm
//               onLoginSuccess={handleLoginSuccess}
//               onRegisterClick={() => {
//                 setIsLoginOpen(false);
//                 setIsRegisterOpen(true);
//               }}
//             />
//           </Modal>
//         )}

//         {isRegisterOpen && (
//           <Modal
//             isOpen={isRegisterOpen}
//             onClose={() => setIsRegisterOpen(false)}
//           >
//             <RegisterForm onRegisterSuccess={() => setIsRegisterOpen(false)} />
//           </Modal>
//         )}
//         {isCategoriesOpen && (
//           <Modal
//             isOpen={isCategoriesOpen}
//             onClose={() => setIsCategoriesOpen(false)}
//           >
//             <Categories onCategorySelect={handleCategorySelect} />
//           </Modal>
//         )}
//       </div>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Header from "./components/Header";
import Home from "./components/Home";
import Modal from "./components/Modal";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import About from "./components/About";
import UserArea from "./components/UserArea";
import { useAuth } from "./context/AuthContext";
import "./index.css"; // Assuming Tailwind CSS is being used
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import Ads from "./components/Ads";
import Offers from "./components/Offers";
import Adbrands from "./components/Adbrands";
import BrandArea from "./components/BrandArea";
import Adoffers from "./components/Adoffers";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  // const { user } = useAuth(); // Assuming `useAuth` provides user state and auth functions
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
      setIsCategoriesOpen(false);
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <Header
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
          onCategoriesClick={() => setIsCategoriesOpen(true)}
        />
        <main className="flex-grow py-5">
          <Routes>
            <Route
              path="/"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/admin-area" />
                  ) : user.role === "brand" ? (
                    <Navigate to="/brand-area" /> // Redirect to brand area if the user is a brand
                  ) : (
                    <Navigate to="/user-area" /> // Default to user area for regular users
                  )
                ) : (
                  <Home /> // Show home page for unauthenticated users
                )
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/adbrands" element={<Adbrands />} />
            <Route path="/adoffers" element={<Adoffers />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/user-area"
              element={
                <PrivateRoute>
                  <UserArea />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-area"
              element={
                <PrivateRoute roleRequired="admin">
                  <Admin />
                </PrivateRoute>
              }
            />
            <Route
              path="/brand-area"
              element={
                <PrivateRoute roleRequired="brand">
                  <BrandArea />
                </PrivateRoute>
              }
            />
            {/* Redirect based on user role */}
            <Route
              path="/redirect"
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/admin-area" />
                  ) : user.role === "brand" ? (
                    <Navigate to="/brand-area" />
                  ) : (
                    <Navigate to="/user-area" />
                  )
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </main>
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
            <LoginForm />
          </Modal>
        )}
        {isRegisterOpen && (
          <Modal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
          >
            <RegisterForm />
          </Modal>
        )}
        {isCategoriesOpen && (
          <Modal
            isOpen={isCategoriesOpen}
            onClose={() => setIsCategoriesOpen(false)}
          >
            <Categories />
          </Modal>
        )}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
