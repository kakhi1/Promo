import React, { useState, useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
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

import "./index.css"; // Assuming Tailwind CSS is being used
import Footer from "./components/Footer";
import Admin from "./components/Admin";
import Ads from "./components/Ads";
import Offers from "./components/Offers";
import Adbrands from "./components/Adbrands";
import BrandArea from "./components/BrandArea";
import Adoffers from "./components/Adoffers";
import OffersCard from "./components/OffersCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OffersInfo from "./components/OffersInfo";
import BrandCard from "./components/BrandCard";
import BrandInfo from "./components/BrandInfo";
import { useAuth } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import ModifyOffers from "./components/ModifyOffers";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  // const { user } = useAuth(); // Assuming `useAuth` provides user state and auth functions
  const { user } = useAuth();
  const [userLocation, setUserLocation] = useState(null);
  const { loginUser, logoutUser } = useAuth();

  // useEffect(() => {
  //   console.log("Checking for token...");
  //   const token = localStorage.getItem("userToken");
  //   console.log("Retrieved token:", token);

  //   if (token) {
  //     verifyTokenAndLogin(token); // This assumes verifyTokenAndLogin is now correctly exposed and callable
  //   }
  // }, [verifyTokenAndLogin]);
  useEffect(() => {
    if (user) {
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
      setIsCategoriesOpen(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const state = await convertLatLongToState(latitude, longitude);
            setUserLocation(state);
            toast.success(`Location detected: ${state}`);
          } catch (error) {
            console.error("Geolocation fetching failed:", error);
            toast.error(
              "Unable to fetch your location. Please try again later."
            );
          }
        },
        (error) => {
          console.error("Geolocation permission denied:", error);
          toast.error("Location permission denied.");
        }
      );
    }
  }, [user]);

  // Convert latitude and longitude to state name
  async function convertLatLongToState(latitude, longitude) {
    const apiKey = ""; // Ensure you have the correct API key
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&pretty=1&no_annotations=1`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log(data); // Log the data to inspect the structure

      if (data.results.length > 0 && data.results[0].components) {
        const components = data.results[0].components;
        if (components.state) {
          return components.state; // Return the state name
        } else {
          console.error("State not found in response components:", components);
          return "State not found"; // Handle no state found in components
        }
      } else {
        console.error("No results found in the API response:", data);
        return "State not found"; // Handle no results case
      }
    } catch (error) {
      console.error("Error fetching geolocation state:", error);
      throw error; // Rethrow or handle error as appropriate
    }
  }
  const handleShowRegisterForm = () => {
    setIsLoginOpen(false); // Close the login modal if open
    setIsRegisterOpen(true); // Open the registration modal
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <Header
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
          onCategoriesClick={() => setIsCategoriesOpen(true)}
        />
        {/*     
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
            <Route path="/offer-card/:offerId" element={<OffersInfo />} />
            <Route path="/brand-card/:brandId" element={<BrandInfo />} />
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
        {/* <Route
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
        </main>  */}
        <main className="flex-grow py-5">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
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
                  <Home />
                )
              }
            />
            <Route path="/modifyoffer/:offerId" element={<ModifyOffers />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/adbrands" element={<Adbrands />} />
            <Route path="/adoffers" element={<Adoffers />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            {/* Private Routes */}
            <Route
              path="/user-area"
              element={user ? <UserArea /> : <Navigate to="/" />}
            />
            <Route
              path="/admin-area"
              element={
                user && user.role === "admin" ? <Admin /> : <Navigate to="/" />
              }
            />
            <Route
              path="/brand-area"
              element={
                user && user.role === "brand" ? (
                  <BrandArea />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            {/* Dynamic Routes */}
            <Route path="/offer-card/:offerId" element={<OffersInfo />} />
            <Route path="/brand-card/:brandId" element={<BrandInfo />} />
            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
            {/* Pass handleShowRegisterForm to LoginForm */}
            <LoginForm onRegisterClick={handleShowRegisterForm} />
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
