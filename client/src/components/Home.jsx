import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../config";
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
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const offersPerPage = isMobile ? 12 : window.innerWidth <= 1000 ? 25 : 36; // Adjust the number of offers per page based on the screen size
  const totalPages = Math.ceil(offers.length / offersPerPage);
  const { user, isAuthenticated, token } = useAuth();
  const userId = user?.id || user?._id;

  const navigate = useNavigate();

  const navigateToAllBrands = () => {
    navigate("/brands");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleShowAllProducts = () => setShowAllProducts(!showAllProducts);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOffersAndBrands = async () => {
    setLoading(true);
    let offersUrl = `${config.apiBaseUrl}/api/offers`;
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
      const [offersResponse, brandsResponse] = await Promise.all([
        axios.get(offersUrl),
        axios.get(`${config.apiBaseUrl}/api/brands`),
      ]);

      if (
        offersResponse.data.success &&
        Array.isArray(offersResponse.data.data)
      ) {
        setOffers(offersResponse.data.data);
      } else {
        throw new Error("Failed to fetch offers");
      }

      if (
        brandsResponse.data.success &&
        Array.isArray(brandsResponse.data.data)
      ) {
        setBrands(brandsResponse.data.data);
      } else {
        throw new Error("Failed to fetch brands");
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setError(error.message);
      toast.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersAndBrands();
  }, [selectedCategory, selectedTag, refreshTrigger, searchQuery]);

  const fetchFavorites = async () => {
    if (isAuthenticated && userId) {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/users/${userId}/favorites`,
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
    fetchFavorites();
  }, [userId, token, isAuthenticated]);

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

  const baseUrl = `${config.apiBaseUrl}/`;

  return (
    <div className="pt-8 bg-white w-full ">
      <div className="flex md:flex-row flex-col-reverse justify-center px-5">
        <div className="md:flex-grow ">
          <div className="flex justify-between items-center py-4">
            <h2 className="text-lg font-semibold">ტოპ პროდუქტი</h2>
            {!isMobile || !showAllProducts ? (
              <button
                onClick={handleShowAllProducts}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllProducts ? "ნაკლები" : "ყველა"}
              </button>
            ) : null}
          </div>

          <div
            className={`grid grid-cols-2 ${
              isMobile
                ? "md:grid-cols-2"
                : window.innerWidth <= 1100
                ? "md:grid-cols-5"
                : "md:grid-cols-6"
            } gap-4 mb-8`}
          >
            {(showAllProducts ? offers : currentOffers).map((offer) => {
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
                  brandid={offer.brand}
                  originalPrice={offer.originalPrice}
                  discountPrice={offer.discountPrice}
                  views={offer.views}
                  userRole={user?.role}
                  onFavoriteToggle={fetchFavorites}
                  offer={offer}
                  numberField={offer.numberField}
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
                const fullImageUrl = `${config.apiBaseUrl}/${imagePath}`;

                return (
                  <BrandCard
                    key={brand._id}
                    id={brand._id}
                    name={brand.name}
                    imageUrl={fullImageUrl}
                    offerCount={brand.offerCount}
                  />
                );
              })}
            </div>
          </div>
        </div>

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
