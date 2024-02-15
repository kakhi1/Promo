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

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { user } = useAuth(); // Assuming `useAuth` provides user state and auth functions

  // Close modals and navigate to user area on successful login
  const handleLoginSuccess = () => {
    setIsLoginOpen(false); // Close login modal
    // Logic for navigating to the user area after login should be handled within LoginForm
    // This is a placeholder for any additional logic you might want to run on login success
  };

  // Automatically redirect authenticated users to the user area
  useEffect(() => {
    if (user) {
      // If there is a user, then close all modals just in case they are open
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    }
  }, [user]);

  return (
    <Router>
      <div className="min-h-screen">
        <Header onLoginClick={() => setIsLoginOpen(true)} />
        <main className="py-5">
          <Routes>
            <Route
              path="/"
              element={user ? <Navigate to="/user-area" /> : <Home />}
            />
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
          </Routes>
        </main>

        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
            <LoginForm
              onLoginSuccess={handleLoginSuccess}
              onRegisterClick={() => {
                setIsLoginOpen(false);
                setIsRegisterOpen(true);
              }}
            />
          </Modal>
        )}

        {isRegisterOpen && (
          <Modal
            isOpen={isRegisterOpen}
            onClose={() => setIsRegisterOpen(false)}
          >
            <RegisterForm onRegisterSuccess={() => setIsRegisterOpen(false)} />
          </Modal>
        )}
      </div>
      <Footer />
    </Router>
  );
}

export default App;
