import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Modal from "./components/Modal";
import LoginForm from "./components/loginForm";
import RegisterForm from "./components/RegisterForm";
import Brands from "./components/Brands";
import Categories from "./components/Categories";
import About from "./components/About";
import { Navigate } from "react-router-dom";
import "./index.css"; // Ensure Tailwind CSS is imported here

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const handleRegistrationRedirect = () => {
    setIsLoginOpen(false); // Close the login modal
    setIsRegisterOpen(true); // Open the registration modal
  };

  // Enhance modal toggle functions if needed for additional logic
  const toggleLoginModal = () => setIsLoginOpen(!isLoginOpen);
  const toggleRegisterModal = () => setIsRegisterOpen(!isRegisterOpen);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header onLoginClick={toggleLoginModal} />

        <main className="py-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Navigate to="/" />} />
            {/* No need for login/register routes due to modals */}
          </Routes>
        </main>

        {/* Login Modal */}
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={toggleLoginModal}>
            <LoginForm
              onLoginSuccess={() => setIsLoginOpen(false)}
              onRegisterClick={handleRegistrationRedirect} // Pass this function as a prop
            />
          </Modal>
        )}

        {/* Register Modal */}
        {isRegisterOpen && (
          <Modal isOpen={isRegisterOpen} onClose={toggleRegisterModal}>
            <RegisterForm onRegisterSuccess={() => setIsRegisterOpen(false)} />
          </Modal>
        )}
      </div>
    </Router>
  );
}

export default App;
