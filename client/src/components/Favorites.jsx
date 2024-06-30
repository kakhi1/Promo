import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import axios from "axios";
import AdComponent from "./AdComponent";
import config from "../config";
import { FaVoicemail } from "react-icons/fa6";

const Favorites = () => {
  const [interestingBrands] = useState([...Array(20).keys()]); // Simulated array of interesting brands
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllSuggestedOffers, setShowAllSuggestedOffers] = useState(false);
  const [showAllInterestingBrands, setShowAllInterestingBrands] =
    useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const { user, isAuthenticated, token } = useAuth();
  const userId = user?.id || user?._id;
  const [brands, setBrands] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const offersPerPage = isMobile ? 12 : window.innerWidth <= 1100 ? 25 : 36; // Adjust the number of offers per page based on the screen size
  const totalPages = Math.ceil(favorites.length / offersPerPage);

  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  // Fetch suggested brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `${config.apiBaseUrl}/api/users/${userId}/suggested-brands`
        );
        console.log("brand in userarea", response.data);
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [userId]);

  const toggleShowAll = () => setShowAll(!showAll);

  // Fetch suggested offers
  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/api/users/${userId}/suggestions`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        setOffers(data);
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [userId]);

  const handleShowAllFavorites = () => {
    setShowAllFavorites(!showAllFavorites);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [userId, isAuthenticated]);

  // Fetch favorites for users
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

  const refreshFavorites = () => {
    fetchFavorites();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentFavorites = favorites.slice(indexOfFirstOffer, indexOfLastOffer);

  if (isLoading) return <div>Loading...</div>;
  if (!favorites.length) return <div>No favorites available.</div>;

  return (
    <div className="pt-8 bg-white flex">
      <div className="flex md:flex-row flex-col-reverse w-full justify-center px-5">
        <div className="md:flex-grow">
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">ფავორიტები</h2>
              <button
                onClick={handleShowAllFavorites}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAllFavorites ? "ნაკლები" : "ყველა"}
              </button>
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
              {(showAllFavorites ? favorites : currentFavorites).map(
                (offer) => {
                  return (
                    <OffersCard
                      key={offer._id}
                      id={offer._id}
                      imageUrls={offer.imageUrls.map(
                        (url) =>
                          `${config.apiBaseUrl}/${url.replace(/\\/g, "/")}`
                      )}
                      title={offer.title}
                      originalPrice={offer.originalPrice}
                      discountPrice={offer.discountPrice}
                      brandid={offer.brand}
                      views={offer.views}
                      userRole={user.role}
                      onFavoriteToggle={refreshFavorites}
                      offer={offer}
                      numberField={offer.numberField}
                    />
                  );
                }
              )}
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
          </section>
        </div>
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <div className="p-4">
            <AdComponent pageType="userarea" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Favorites;
