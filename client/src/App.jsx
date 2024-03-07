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
import ModifyBrands from "./components/ModifyBrands";
import "react-toastify/dist/ReactToastify.css";
import Adadd from "./components/Adadd";
import ModifyAd from "./components/ModifyAd";
import AdComponent from "./components/AdComponent";
import Tags from "./components/Tags";

function App() {
  const { user, isAuthenticated, userRole } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  // const { user } = useAuth(); // Assuming `useAuth` provides user state and auth functions
  const [userLocation, setUserLocation] = useState(null);
  const { loginUser, logoutUser } = useAuth();
  const userId = user?.id || user?._id;
  console.log("userRole", userRole);
  console.log("userId in app", userId);
  useEffect(() => {
    logUserActivity(); // Log user activity when the app loads
  }, []);

  const logUserActivity = async () => {
    try {
      // Make an API call to log user activity
      await axios.post("http://localhost:5000/api/user-activity", {
        activity: "App Loaded",
      });
      console.log("User activity logged: App Loaded");
    } catch (error) {
      console.error("Error logging user activity:", error);
    }
  };
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
            const city = await convertLatLongToState(
              latitude,
              longitude,
              userId
            );
            setUserLocation(city);
            // toast.success(`Location detected: ${city}`);
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

  async function convertLatLongToState(latitude, longitude, userId) {
    const apiKey = "";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}&pretty=1&no_annotations=1`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data.results.length > 0 && data.results[0].components) {
        const city =
          data.results[0].components.city ||
          data.results[0].components._normalized_city;
        if (city) {
          await axios.put(`http://localhost:5000/api/users/${userId}/state`, {
            englishStateName: city,
          });
          return city;
        } else {
          console.error(
            "City not found in response components:",
            data.results[0].components
          );
          return "Location not found";
        }
      } else {
        console.error("No results found in the API response:", data);
        return "Location not found";
      }
    } catch (error) {
      console.error("Error fetching geolocation city:", error);
      throw error;
    }
  }

  const handleShowRegisterForm = () => {
    setIsLoginOpen(false); // Close the login modal if open
    setIsRegisterOpen(true); // Open the registration modal
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Header
          onLoginClick={() => setIsLoginOpen(true)}
          onRegisterClick={() => setIsRegisterOpen(true)}
          onCategoriesClick={() => setIsCategoriesOpen(true)}
        />
        <Tags />

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
                    // <Navigate to="/user-area" />
                    <Home />
                  )
                ) : (
                  <Home />
                )
              }
            />
            <Route path="/" element={<Home />} />
            <Route path="/modifyoffer/:offerId" element={<ModifyOffers />} />
            <Route path="/modify-brand/:id" element={<ModifyBrands />} />
            <Route path="/modify-ad/:adId" element={<ModifyAd />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/adbrands" element={<Adbrands />} />
            <Route path="/adoffers" element={<Adoffers />} />
            <Route path="/adadd" element={<Adadd />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />

            {/* Private Routes */}
            {/* <Route
              path="/user-area"
              element={user ? <UserArea /> : <Navigate to="/" />}
            /> */}
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
                isAuthenticated && user?.role === "admin" ? (
                  <Admin />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/brand-area"
              element={
                isAuthenticated && user?.role === "brand" ? (
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
