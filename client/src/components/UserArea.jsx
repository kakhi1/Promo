import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import OffersCard from "./OffersCard";
import BrandCard from "./BrandCard";
import axios from "axios";
import AdComponent from "./AdComponent";

const UserArea = () => {
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

  // Toggle function for showing all brands or a limited number
  const toggleShowAllBrands = () => {
    setShowAllBrands(!showAllBrands);
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Fetch suggested brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${userId}/suggested-brands`
        );
        setBrands(response.data);
      } catch (error) {
        console.error("Error fetching brands:", error);
      }
    };

    fetchBrands();
  }, [userId]);

  // fetch suggesed offers
  const toggleShowAll = () => setShowAll(!showAll);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        // Adjust the URL as needed to include the appropriate user ID
        const response = await fetch(
          `http://localhost:5000/api/users/${userId}/suggestions`
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
  }, []);

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
    fetchFavorites(); // Initial fetch and refetch when relevant states change
  }, [userId, isAuthenticated]); // Dependencies
  //fetch favotites for users
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

  // This function could be passed to OffersCard to trigger a refetch
  const refreshFavorites = () => {
    fetchFavorites();
  };

  return (
    <div className="pt-8 bg-white flex">
      <div className="flex md:flex-row flex-col-reverse w-full justify-center px-5">
        <div className="md:flex-grow">
          {/* Section 1: Favorites */}
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
            <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8">
              {(showAllFavorites
                ? favorites
                : isMobile
                ? favorites.slice(0, 4)
                : favorites.slice(0, 8)
              ).map((offer) => {
                // Assuming your OffersCard component and favorites structure allows for this direct mapping
                return (
                  <OffersCard
                    key={offer._id}
                    id={offer._id}
                    imageUrls={offer.imageUrls.map(
                      (url) =>
                        `http://localhost:5000/${url.replace(/\\/g, "/")}`
                    )} // Adjust URL path as needed
                    title={offer.title}
                    originalPrice={offer.originalPrice}
                    discountPrice={offer.discountPrice}
                    views={offer.views}
                    userRole={user.role}
                    onFavoriteToggle={refreshFavorites}
                  />
                );
              })}
            </div>
          </section>

          {/* Section 2: Suggested Offers */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">
                ასევე შეიძლება მოგეწონოთ
              </h2>
              <button
                onClick={toggleShowAll}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {showAll ? "ნაკლები" : "ყველა"}
              </button>
            </div>
            <div
              className={`grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4 mb-8 ${
                !showAll && !isMobile ? "md:grid-rows-1" : ""
              }`}
            >
              {(!showAll ? offers.slice(0, isMobile ? 4 : 4) : offers).map(
                (offer) => (
                  <OffersCard
                    key={offer._id}
                    id={offer._id}
                    imageUrls={offer.imageUrls.map(
                      (url) =>
                        `http://localhost:5000/${url.replace(/\\/g, "/")}`
                    )}
                    title={offer.title}
                    originalPrice={offer.originalPrice}
                    discountPrice={offer.discountPrice}
                    views={offer.views}
                    userRole={user.role}
                    onFavoriteToggle={refreshFavorites}
                  />
                )
              )}
            </div>
          </section>
          {/* Section 3: Interesting Brands */}
          <section>
            <div className="flex justify-between items-center py-4">
              <h2 className="text-lg font-semibold">მსგავსი ბრენდები</h2>
              {brands.length > 0 && (
                <button
                  onClick={toggleShowAllBrands}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  {showAllBrands ? "ნაკლები" : "ყველა"}
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
          </section>
        </div>

        {/* add section */}
        <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
          <div className="p-4">
            <AdComponent pageType="userarea" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserArea;
