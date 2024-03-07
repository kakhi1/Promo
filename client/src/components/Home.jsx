import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import AdComponent from "./AdComponent";
const Home = () => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]); // Changed to fetch from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const { user, isAuthenticated, token, userRole } = useAuth();
  const userId = user?.id || user?._id;
  console.log("home userId", userId);
  console.log("userRole in homeS", userRole);
  console.log(offers);
  console.log(brands);
  const navigate = useNavigate();

  // New function to navigate to Brand.jsx
  const navigateToAllBrands = () => {
    navigate("/brands"); // Assuming your route to Brand.jsx is "/brands"
  };

  const handleShowAllProducts = () => setShowAllProducts(!showAllProducts);
  const handleResize = () => setIsMobile(window.innerWidth <= 768);

  // Function to refresh offers/favorites when a favorite is toggled
  const onFavoriteToggle = async () => {
    fetchFavorites();
    // Additionally fetch favorites if needed
  };

  useEffect(() => {
    const fetchOffersAndBrands = async () => {
      setLoading(true);
      try {
        // Fetch offers
        const offersResponse = await fetch("http://localhost:5000/api/offers");
        const offersResult = await offersResponse.json();
        if (offersResult.success && Array.isArray(offersResult.data)) {
          setOffers(offersResult.data);
        } else {
          throw new Error("Failed to fetch offers");
        }

        // Fetch brands
        const brandsResponse = await fetch("http://localhost:5000/api/brands");
        const brandsResult = await brandsResponse.json();
        console.log(brandsResult);
        if (brandsResult.success && Array.isArray(brandsResult.data)) {
          setBrands(brandsResult.data);
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndBrands();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchFavorites(); // Initial fetch and refetch when relevant states change
  }, [userId, isAuthenticated]); // Dependencies

  const fetchFavorites = async () => {
    if (isAuthenticated && userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        toast.error("Failed to fetch favorites.");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const baseUrl = "http://localhost:5000/";
  return (
    <div className="pt-8 bg-white w-full">
      {/* Responsive Grid Layout */}
      <div className="flex md:flex-row flex-col-reverse justify-center px-5">
        {/* Main Content Section */}
        <div className="md:flex-grow ">
          {/* Top Offers Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold"> ტოპ პროდუქტი</h2>
            <button
              onClick={handleShowAllProducts}
              className="text-indigo-600 hover:text-indigo-800"
            >
              {showAllProducts ? "ნაკლები" : "ყველა"}
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8">
            {(showAllProducts
              ? offers
              : isMobile
              ? offers.slice(0, 4)
              : offers.slice(0, 8)
            ).map((offer) => {
              const imageUrls = offer.imageUrls
                ? offer.imageUrls.map(
                    (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
                  )
                : [];
              return (
                <OffersCard
                  key={offer._id}
                  id={offer._id}
                  imageUrls={imageUrls}
                  title={offer.title}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                  userRole={user?.role}
                  onFavoriteToggle={onFavoriteToggle}
                />
              );
            })}
          </div>

          {/* Rendering Offers using OffersCard components */}

          {/* Top Brands Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">ტოპ ბრენდები</h2>
            {!showAllBrands && (
              <button
                onClick={navigateToAllBrands}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ყველა
              </button>
            )}
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(showAllBrands
              ? brands
              : isMobile
              ? brands.slice(0, 4)
              : brands.slice(0, 8)
            ).map((brand) => {
              // Assuming your backend server is running on localhost:5000
              // and the images are served from the 'uploads' directory
              const baseUrl = "http://localhost:5000/";
              const imagePath = brand.imageUrl.replace(/\\/g, "/"); // Replace backslashes with forward slashes if needed
              const fullImageUrl = baseUrl + imagePath;

              return (
                <BrandCard
                  key={brand._id}
                  id={brand._id}
                  name={brand.name}
                  imageUrl={fullImageUrl} // Adjust as necessary for the path
                  offerCount={brand.offerCount} // Make sure your API provides this
                />
              );
            })}
          </div>
        </div>

        {/* Ad Section - On top for mobile */}
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <div className="p-4">
            <AdComponent pageType="home" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
