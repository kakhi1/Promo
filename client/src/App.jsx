import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import config from "./config";
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
import Adbrands from "./components/Adbrands";
import BrandArea from "./components/BrandArea";
import Adoffers from "./components/Adoffers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OffersInfo from "./components/OffersInfo";
import BrandInfo from "./components/BrandInfo";
import { useAuth } from "./context/AuthContext";
import ModifyOffers from "./components/ModifyOffers";
import ModifyBrands from "./components/ModifyBrands";
import "react-toastify/dist/ReactToastify.css";
import Adadd from "./components/Adadd";
import ModifyAd from "./components/ModifyAd";
import Tags from "./components/Tags";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import ConditionalTags from "./components/ConditionalTags ";
import ResetPasswordPage from "./components/ResetPasswordPage";
import WelcomeModal from "./components/WelcomeModal";
import OffersCategory from "./components/OffersCategory";
import Favorites from "./components/Favorites";
import AboutPar from "./components/AboutPar";

function App() {
  const { user, isAuthenticated, userRole } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const { loginUser, logoutUser } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(true);

  const [statesList, setStatesList] = useState([]);

  useEffect(() => {
    axios
      .get(`${config.apiBaseUrl}/api/data/states`)
      .then((res) => setStatesList(res.data))
      .catch((err) => console.error("Error fetching states:", err));

    axios
      .get("https://api.ipify.org?format=json")
      .then((response) => {
        const ip = response.data.ip;
        checkGuestUser(ip);
      })
      .catch((err) => console.error("Error fetching IP address:", err));
  }, []);

  const checkGuestUser = (ip) => {
    axios
      .get(`${config.apiBaseUrl}/api/check-modal/${ip}`)
      .then((response) => {
        setIsWelcomeModalOpen(response.data.showModal);
      })
      .catch((err) => console.error("Error checking guest user:", err));
  };

  const handleWelcomeSubmit = async (state) => {
    try {
      const ipAddressResponse = await axios.get(
        "https://api.ipify.org?format=json"
      );
      const ipAddress = ipAddressResponse.data.ip;

      await axios.post(`${config.apiBaseUrl}/api/guest-user`, {
        state,
        ipAddress,
      });
      setIsWelcomeModalOpen(false);
    } catch (error) {
      console.error("Error handling welcome submit:", error);
    }
  };

  const userId = user?.id || user?._id;
  useEffect(() => {
    logUserActivity(); // Log user activity when the app loads
  }, []);

  const logUserActivity = async () => {
    try {
      // Make an API call to log user activity
      await axios.post(`${config.apiBaseUrl}/api/user-activity`, {
        activity: "App Loaded",
      });
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
  const refreshOffersAndBrands = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    // Note: Due to React's asynchronous state updates,
    // logging 'selectedTag' immediately after 'setSelectedTag' won't show the updated state.
  };

  useEffect(() => {}, [selectedTag]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoriesOpen(false);
  };

  const handleShowRegisterForm = () => {
    setIsLoginOpen(false); // Close the login modal if open
    setIsRegisterOpen(true); // Open the registration modal
  };

  // Function to handle the "Forgot Password" click event
  const handleForgotPasswordClick = () => {
    console.log("Forgot password in parent clicked");
    setShowForgotPasswordModal(true); // This should open the modal
    setIsLoginOpen(true);
  };

  const handleBackToLoginClick = () => {
    setShowForgotPasswordModal(false); // Close the modal
    // Optionally, navigate or open another modal here
    navigate("/"); // For navigating to homepage
    // setIsLoginOpen(true); // For opening login modal
  };

  useEffect(() => {
    const registerOrFetchUser = async () => {
      try {
        const { data: ipData } = await axios.get(
          "https://api.ipify.org?format=json"
        );
        const ip = ipData.ip;

        const response = await axios.post(
          `${config.apiBaseUrl}/api/users/auto-register`,
          { ip }
        );
        console.log("User check/create response:", response.data);
      } catch (error) {
        console.error("Error registering or fetching user:", error);
      }
    };

    registerOrFetchUser();
  }, []);
  return (
    <Router>
      <div className="min-h-screen flex flex-col justify-between">
        {isWelcomeModalOpen && (
          <WelcomeModal
            isOpen={isWelcomeModalOpen}
            onSubmit={handleWelcomeSubmit}
            statesList={statesList}
          />
        )}
        {/* {showInterestsModal && (
          <InterestsModal
            isOpen={showInterestsModal}
            onSubmit={handleInterestsSubmit}
            tagsList={tagsList}
            onClose={handleModalClose}
          />
        )} */}
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
          onLogoClick={refreshOffersAndBrands}
          onSearch={(query) => setSearchQuery(query)}
          onForgotPasswordClick={handleForgotPasswordClick}
        />
        {/* <Tags onTagSelect={handleTagSelect} /> */}
        {/* Conditionally render <Tags/> based on the current route */}
        <main className="flex-grow py-5">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/login" element={<LoginForm />} />
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
                    <Home
                      selectedCategory={selectedCategory}
                      selectedTag={selectedTag}
                      refreshTrigger={refreshTrigger}
                      searchQuery={searchQuery}
                    />
                  )
                ) : (
                  <Home
                    selectedCategory={selectedCategory}
                    selectedTag={selectedTag}
                    refreshTrigger={refreshTrigger}
                    searchQuery={searchQuery}
                  />
                )
              }
            />
            <Route
              path="/offers-category/:categoryId"
              element={<OffersCategory />}
            />
            <Route
              path="/"
              element={
                <Home
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                  refreshTrigger={refreshTrigger}
                  searchQuery={searchQuery}
                />
              }
            />
            {/* Rest of the Routes remain unchanged */}
            <Route path="/modifyoffer/:offerId" element={<ModifyOffers />} />
            <Route path="/modify-brand/:id" element={<ModifyBrands />} />
            <Route path="/modify-ad/:adId" element={<ModifyAd />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/adbrands" element={<Adbrands />} />
            <Route path="/adoffers" element={<Adoffers />} />
            <Route path="/adadd" element={<Adadd />} />
            <Route
              path="/brands"
              element={
                <Brands
                  selectedCategory={selectedCategory}
                  selectedTag={selectedTag}
                  searchQuery={searchQuery}
                />
              }
            />

            <Route path="/favorites" element={<Favorites />} />
            <Route
              path="/categories"
              element={
                <Categories
                  onSelectCategory={() => console.log("Test function passed")}
                />
              }
            />
            <Route
              path="/about"
              element={<About onRegisterClick={handleShowRegisterForm} />}
            />
            <Route path="/aboutpat" element={<AboutPar />} />

            {/* Private Routes */}

            <Route
              path="/user-area"
              element={
                <PrivateRoute allowedRoles={["user"]}>
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
        {/* Conditionally render Footer based on userRole */}
        {userRole !== "admin" && userRole !== "brand" && <Footer />}
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
            {/* Pass handleShowRegisterForm to LoginForm */}
            <LoginForm
              onRegisterClick={handleShowRegisterForm}
              onForgotPasswordClick={handleForgotPasswordClick}
            />
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

        {/* {isCategoriesOpen && (
          <Modal
            isOpen={isCategoriesOpen}
            onClose={() => setIsCategoriesOpen(false)}
          >
            <Categories onSelectCategory={handleSelectCategory} />
          </Modal>
        )} */}
        {/* Forgot Password Modal */}
        {/* {showForgotPasswordModal && (
          <Modal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
          >
            <ForgotPasswordForm
              onBackToLoginClick={() => {
                setShowForgotPasswordModal(false); // Close forgot password modal
                setIsLoginOpen(true); // Optionally open login modal again if needed
              }}
            />
          </Modal>
        )} */}
        {showForgotPasswordModal && (
          <Modal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
          >
            <ForgotPasswordForm
              onBackToLoginClick={() => {
                setShowForgotPasswordModal(false); // Close forgot password modal
                setIsLoginOpen(true); // Optionally open login modal again if needed
              }}
              onSuccess={() => {
                setShowForgotPasswordModal(false); // Close forgot password modal
                // navigate('/'); // Navigate to homepage, uncomment if navigation is desired
                // setIsLoginOpen(true); // Optionally open login modal again if needed
              }}
            />
          </Modal>
        )}
      </div>
    </Router>
  );
}

export default App;
