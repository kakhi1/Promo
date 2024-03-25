import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import AdComponent from "./AdComponent";

const Home = ({
  selectedCategory,
  selectedTag,
  refreshTrigger,
  searchQuery,
}) => {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]); // Changed to fetch from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = 12; // You can adjust this value as needed
  const totalPages = Math.ceil(offers.length / offersPerPage);
  const { user, isAuthenticated, token, userRole } = useAuth();
  const userId = user?.id || user?._id;
  // const [selectedCategory, setSelectedCategory] = useState(null);
  // const [selectedTag, setSelectedTag] = useState(null);

  const navigate = useNavigate();

  // New function to navigate to Brand.jsx
  const navigateToAllBrands = () => {
    navigate("/brands"); // Assuming your route to Brand.jsx is "/brands"
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleShowAllProducts = () => setShowAllProducts(!showAllProducts);
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  useEffect(() => {
    // Function to handle resize events
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Call handleResize initially in case the initial window size is mobile
    handleResize();

    // Cleanup function to remove the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to refresh offers/favorites when a favorite is toggled
  const onFavoriteToggle = async () => {
    fetchFavorites();
    // Additionally fetch favorites if needed
  };

  useEffect(() => {
    const fetchOffersAndBrands = async () => {
      setLoading(true);
      let offersUrl = "http://localhost:5000/api/offers";
      const offersParams = new URLSearchParams();

      if (selectedCategory && selectedCategory._id) {
        offersParams.append("category", selectedCategory._id);
      }
      if (selectedTag) {
        offersParams.append("tags", selectedTag);
      }
      if (searchQuery && searchQuery.trim() !== "") {
        offersParams.append("search", searchQuery.trim());
      }

      offersUrl += `?${offersParams.toString()}`;

      try {
        const offersResponse = await axios.get(offersUrl);
        if (
          offersResponse.data.success &&
          Array.isArray(offersResponse.data.data)
        ) {
          setOffers(offersResponse.data.data);
        } else {
          throw new Error("Failed to fetch offers");
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndBrands();
  }, [selectedCategory, selectedTag, refreshData, searchQuery]);

  useEffect(() => {
    const fetchOffersAndBrands = async () => {
      setLoading(true);
      let offersUrl = "http://localhost:5000/api/offers";
      const offersParams = new URLSearchParams();

      if (selectedCategory && selectedCategory._id) {
        offersParams.append("category", selectedCategory._id);
      }
      if (selectedTag) {
        offersParams.append("tags", selectedTag);
      }
      offersUrl += `?${offersParams.toString()}`;

      try {
        const offersResponse = await fetch(offersUrl);
        const offersResult = await offersResponse.json();
        if (offersResult.success && Array.isArray(offersResult.data)) {
          setOffers(offersResult.data);
        } else {
          throw new Error("Failed to fetch offers");
        }
        // The rest of your code for fetching brands remains the same
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersAndBrands();
    // The rest of your useEffect logic remains unchanged
  }, [selectedCategory, selectedTag, refreshTrigger, searchQuery]);

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

  useEffect(() => {
    const fetchOffersAndBrands = async () => {
      setLoading(true);
      const offersUrl = "http://localhost:5000/api/offers";
      const brandsUrl = "http://localhost:5000/api/brands";

      try {
        const [offersResult, brandsResult] = await Promise.all([
          axios.get(offersUrl),
          axios.get(brandsUrl),
        ]);

        setOffers(offersResult.data.data);
        setBrands(brandsResult.data.data);
      } catch (error) {
        setError(error.toString());
        toast.error("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    fetchOffersAndBrands();
    fetchOffersAndBrands();
  }, [refreshTrigger]);

  const filteredBrands = searchQuery
    ? brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : brands;
  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const baseUrl = "http://localhost:5000/";
  return (
    <div className="pt-8 bg-white w-full ">
      {/* Responsive Grid Layout */}
      <div className="flex md:flex-row flex-col-reverse justify-center px-5">
        {/* Main Content Section */}
        <div className="md:flex-grow ">
          {/* Top Offers Section */}
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold"> ტოპ პროდუქტი</h2>
            {!isMobile || !showAllProducts ? (
              <button
                onClick={handleShowAllProducts}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllProducts ? "ნაკლები" : "ყველა"}
              </button>
            ) : null}
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
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 bg-gray-200 text-gray-700 hover:bg-blue-500 hover:text-white rounded-md ${
                  currentPage === index + 1 ? "bg-blue-500 text-white" : ""
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Brands Section */}
          <div className="mb-8">
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

            <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4">
              {filteredBrands.map((brand) => {
                const imagePath = brand.imageUrl.replace(/\\/g, "/");
                const fullImageUrl = `http://localhost:5000/${imagePath}`;

                return (
                  <BrandCard
                    key={brand._id}
                    id={brand._id}
                    name={brand.name}
                    imageUrl={fullImageUrl}
                    offerCount={brand.offerCount} // Ensure your API provides this info
                  />
                );
              })}
            </div>
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
