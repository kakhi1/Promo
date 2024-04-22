import React, { useState, useEffect } from "react";
import axios from "axios";
import OffersCard from "./OffersCard";
import AdComponent from "./AdComponent";
import { useAuth } from "../context/AuthContext";

const Favorites = () => {
  const [offers, setOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage] = useState(20); // Maximum offers per page
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isAuthenticated, token, userRole } = useAuth();
  const userId = user?.id || user?._id;

  useEffect(() => {
    const fetchPopularFavorites = async () => {
      setLoading(true);
      const url = "https://promo-iror.onrender.com/api/users/popular-favorites";

      try {
        const response = await axios.get(url);
        setOffers(response.data.data || response.data); // Adjust depending on your API's response structure
      } catch (err) {
        console.error("Error fetching popular favorites:", err);
        setError(err.message || "Failed to fetch popular favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchPopularFavorites();
  }, []); // Empty dependency array means this effect will only run once on component mount

  const onFavoriteToggle = async () => {
    fetchFavorites();
    // Additionally fetch favorites if needed
  };

  const fetchFavorites = async () => {
    if (isAuthenticated && userId) {
      try {
        const response = await axios.get(
          `https://promo-iror.onrender.com/api/users/${userId}/favorites`,
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

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = offers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  const getImageUrls = (offer) => {
    // Ensure that the offer object and the imageUrls property exist
    if (!offer || !offer.imageUrls || !Array.isArray(offer.imageUrls)) {
      return []; // Return an empty array if no valid image URLs exist
    }

    const baseUrl = "https://promo-iror.onrender.com/";
    return offer.imageUrls.map(
      (path) => `${baseUrl}${path.replace(/\\/g, "/")}`
    );
  };
  return (
    <div className="pt-8 bg-white w-full flex md:flex-row flex-col-reverse">
      <div className="flex flex-col justify-between h-full w-full px-5">
        <div className="mb-8">
          <h2 className="text-lg font-semibold py-4">ფავორიტები</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 xl2:grid-cols-6 gap-4">
            {currentOffers.map((offer) => {
              const imageUrls = getImageUrls(offer); // Use the helper function to get image URLs

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
          <Pagination
            itemsPerPage={offersPerPage}
            totalItems={offers.length}
            paginate={paginate}
          />
        </div>
      </div>

      <div className="w-full bg-gray-300 h-56 mb-4 md:mb-0 md:w-1/5 md:h-screen md:ml-4">
        <div className="p-4">
          <AdComponent pageType="favorites" />
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center space-x-2 mt-4">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className="border px-4 py-2 rounded hover:bg-gray-200 cursor-pointer"
          >
            <a onClick={() => paginate(number)} href="#!">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Favorites;
